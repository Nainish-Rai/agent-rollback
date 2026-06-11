#!/usr/bin/env bash
# agent-rollback one-click installer
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/Nainish-Rai/agent-rollback/main/scripts/install.sh | bash
#   curl -fsSL ... | bash -s -- --all           # install binary + skill + register MCP
#   curl -fsSL ... | bash -s -- --with-skill    # also install the agent skill (global)
#   curl -fsSL ... | bash -s -- --with-mcp      # also register MCP server in Codex config
#   curl -fsSL ... | bash -s -- --version 0.1.2 # pin a specific version
#   curl -fsSL ... | bash -s -- --uninstall     # remove the global install (and MCP config)
#   curl -fsSL ... | bash -s -- --dry-run       # print actions without running them
#
# Exit codes:
#   0  success
#   1  generic failure
#   2  unsupported platform / missing dependency
#   3  user aborted (e.g. macOS sudo prompt failed)

set -euo pipefail

# ---- constants -------------------------------------------------------------

PACKAGE_NAME="agent-rollback"
DEFAULT_VERSION="latest"
NODE_MIN_MAJOR=20
REPO_URL="https://github.com/Nainish-Rai/agent-rollback"
MCP_SERVER_NAME="agent-rollback"

# ---- output helpers --------------------------------------------------------

if [ -t 1 ] && [ "${NO_COLOR:-0}" != "1" ]; then
  C_BOLD=$'\033[1m'
  C_DIM=$'\033[2m'
  C_RED=$'\033[31m'
  C_GREEN=$'\033[32m'
  C_YELLOW=$'\033[33m'
  C_BLUE=$'\033[34m'
  C_RESET=$'\033[0m'
else
  C_BOLD=""; C_DIM=""; C_RED=""; C_GREEN=""; C_YELLOW=""; C_BLUE=""; C_RESET=""
fi

info()  { printf "%s==>%s %s\n" "$C_BLUE" "$C_RESET" "$*"; }
ok()    { printf "%s ✓%s %s\n" "$C_GREEN" "$C_RESET" "$*"; }
warn()  { printf "%s ! %s %s\n" "$C_YELLOW" "$C_RESET" "$*" >&2; }
err()   { printf "%s ✗ %s %s\n" "$C_RED"   "$C_RESET" "$*" >&2; }
hr()    { printf "%s%s%s\n" "$C_DIM" "----------------------------------------" "$C_RESET"; }

# ---- argument parsing ------------------------------------------------------

VERSION="$DEFAULT_VERSION"
WITH_SKILL=0
WITH_MCP=0
UNINSTALL=0
DRY_RUN=0
PRINT_HELP=0

while [ $# -gt 0 ]; do
  case "$1" in
    --version)     VERSION="${2:-}"; shift 2 ;;
    --with-skill)  WITH_SKILL=1; shift ;;
    --with-mcp)    WITH_MCP=1; shift ;;
    --all)         WITH_SKILL=1; WITH_MCP=1; shift ;;
    --uninstall)   UNINSTALL=1; shift ;;
    --dry-run)     DRY_RUN=1; shift ;;
    --no-color)    NO_COLOR=1; shift ;;
    -h|--help)     PRINT_HELP=1; shift ;;
    --) shift; break ;;
    -*) err "Unknown flag: $1"; exit 1 ;;
    *)  err "Unexpected positional argument: $1"; exit 1 ;;
  esac
done

if [ "$PRINT_HELP" = "1" ]; then
  sed -n '2,14p' "$0" | sed 's/^# \{0,1\}//'
  exit 0
fi

# ---- dry-run wrapper -------------------------------------------------------

run() {
  if [ "$DRY_RUN" = "1" ]; then
    printf "%s[dry-run]%s %s\n" "$C_DIM" "$C_RESET" "$*"
  else
    "$@"
  fi
}

# ---- platform checks -------------------------------------------------------

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    err "Required command not found: $1"
    case "$1" in
      node|npm)
        err "Install Node.js >= ${NODE_MIN_MAJOR} from https://nodejs.org or via nvm:"
        err "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash"
        err "  nvm install 20 && nvm use 20"
        ;;
      curl)
        err "Install curl or use wget if your platform ships it by default."
        ;;
    esac
    exit 2
  fi
}

check_node_version() {
  local major
  major="$(node -p 'process.versions.node.split(".")[0]')"
  if [ "$major" -lt "$NODE_MIN_MAJOR" ]; then
    err "Node.js >= ${NODE_MIN_MAJOR} is required (found $(node -v))."
    err "Upgrade with: nvm install ${NODE_MIN_MAJOR} && nvm use ${NODE_MIN_MAJOR}"
    exit 2
  fi
}

detect_platform() {
  OS="$(uname -s 2>/dev/null || echo unknown)"
  ARCH="$(uname -m 2>/dev/null || echo unknown)"
  case "$OS" in
    Linux|Darwin) ;;
    MINGW*|MSYS*|CYGWIN*)
      err "Windows detected. agent-rollback requires WSL or a real POSIX shell."
      err "Run this from WSL, or on Windows use: npm install -g ${PACKAGE_NAME}"
      exit 2
      ;;
    *)
      err "Unsupported platform: $OS"
      exit 2
      ;;
  esac
}

# ---- Codex config helpers (defined up-front so both branches can use them) -

# Codex home may be overridden for testing or for non-default installs.
CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
CODEX_CONFIG="$CODEX_HOME/config.toml"

# Snippet we write into Codex config.toml. Kept in sync with the README.
mcp_block() {
  cat <<EOF

[mcp_servers.${MCP_SERVER_NAME}]
command = "${PACKAGE_NAME}"
args = ["mcp"]
EOF
}

# Register our MCP server in Codex's config.toml. Idempotent: if the block
# already exists, do nothing. Backs up the existing file before mutation.
codex_config_register() {
  local config="$1"
  local config_dir
  config_dir="$(dirname "$config")"

  if [ "$DRY_RUN" = "1" ]; then
    if [ -f "$config" ] && grep -q "^\[mcp_servers\.${MCP_SERVER_NAME}\]" "$config" 2>/dev/null; then
      warn "MCP block [mcp_servers.${MCP_SERVER_NAME}] already present in $config (would skip)"
    else
      printf "%s[dry-run]%s would register MCP block in %s\n" "$C_DIM" "$C_RESET" "$config"
    fi
    return 0
  fi

  if [ -f "$config" ] && grep -q "^\[mcp_servers\.${MCP_SERVER_NAME}\]" "$config" 2>/dev/null; then
    ok "MCP block [mcp_servers.${MCP_SERVER_NAME}] already present in $config (skipping)"
    return 0
  fi

  mkdir -p "$config_dir"
  local backup=""
  if [ -f "$config" ]; then
    backup="${config}.bak.$(date +%Y%m%d-%H%M%S)"
    cp "$config" "$backup"
  fi

  {
    if [ -f "$config" ] && [ -s "$config" ]; then
      cat "$config"
      # Ensure exactly one blank line before our append.
      if [ -n "$(tail -c 1 "$config")" ]; then
        printf "\n"
      fi
    fi
    mcp_block
  } > "${config}.tmp" && mv "${config}.tmp" "$config"

  ok "Registered [mcp_servers.${MCP_SERVER_NAME}] in $config"
  [ -n "$backup" ] && warn "Backup saved to $backup"
}

# Remove our MCP block from Codex config. Best-effort, used by --uninstall.
codex_config_unregister() {
  local config="${1:-$CODEX_CONFIG}"
  [ -f "$config" ] || return 0
  if ! grep -q "^\[mcp_servers\.${MCP_SERVER_NAME}\]" "$config" 2>/dev/null; then
    return 0
  fi
  if [ "$DRY_RUN" = "1" ]; then
    printf "%s[dry-run]%s would remove MCP block from %s\n" "$C_DIM" "$C_RESET" "$config"
    return 0
  fi
  local backup="${config}.bak.$(date +%Y%m%d-%H%M%S)"
  cp "$config" "$backup"
  # Delete from the section header up to (but not including) the next
  # [section] header, or end of file. Uses awk to stay portable.
  awk -v target="[mcp_servers.${MCP_SERVER_NAME}]" '
    $0 == target { skip = 1; next }
    skip && /^\[/ { skip = 0 }
    !skip
  ' "$config" > "${config}.tmp" && mv "${config}.tmp" "$config"
  ok "Removed [mcp_servers.${MCP_SERVER_NAME}] from $config (backup: $backup)"
}

# ---- uninstall path --------------------------------------------------------

if [ "$UNINSTALL" = "1" ]; then
  info "Uninstalling ${PACKAGE_NAME}..."
  if ! command -v npm >/dev/null 2>&1; then
    err "npm not found; nothing to uninstall."
    exit 2
  fi
  run npm uninstall -g "$PACKAGE_NAME"
  ok "${PACKAGE_NAME} removed."

  # Best-effort: also strip our MCP block from Codex config if present.
  codex_config_unregister

  if command -v npx >/dev/null 2>&1; then
    run npx --yes skills remove "${PACKAGE_NAME}" -g -y >/dev/null 2>&1 || true
  fi

  hr
  info "Next (if you want a full reset):"
  printf "  • Remove the agent skill:\n"
  printf "      npx skills remove ${PACKAGE_NAME} -g -y\n"
  exit 0
fi

# ---- main install path -----------------------------------------------------

printf "%sagent-rollback%s installer\n" "$C_BOLD" "$C_RESET"
hr

detect_platform
require_cmd node
require_cmd npm
require_cmd curl
check_node_version

ok "Node $(node -v) on ${OS}/${ARCH}"

# Build the install spec. When VERSION is "latest" we let npm resolve it; any
# other value is treated as an explicit version pin.
if [ "$VERSION" = "latest" ]; then
  INSTALL_SPEC="$PACKAGE_NAME"
else
  INSTALL_SPEC="${PACKAGE_NAME}@${VERSION}"
fi

info "Installing ${INSTALL_SPEC} globally with npm..."
run npm install -g "$INSTALL_SPEC"

# Verify by invoking the binary. We check `agent-rollback` first, then `arb`
# (the 3-char short alias). We deliberately do NOT use `ar` because it collides
# with the BSD/GNU `ar` archive tool on every Unix system; if `ar` resolves to
# /usr/bin/ar on your PATH, the system tool wins and our binary is shadowed.
if command -v agent-rollback >/dev/null 2>&1; then
  ok "agent-rollback ready: $(agent-rollback --version 2>/dev/null || echo installed)"
elif command -v arb >/dev/null 2>&1; then
  ok "arb (short alias) ready: $(arb --version 2>/dev/null || echo installed)"
else
  warn "npm install finished but the binary is not on PATH."
  warn "Your global npm bin directory is likely: $(npm bin -g 2>/dev/null || npm root -g)"
  warn "Add it to your shell PATH if it isn't already."
fi

# Detect a shadowed `ar` (system BSD/GNU archive tool beating our old short
# alias in PATH order). This is informational only; we don't write to PATH.
if command -v ar >/dev/null 2>&1; then
  ar_path="$(command -v ar)"
  if [ "$ar_path" != "$(npm root -g 2>/dev/null)/../bin/ar" ] \
     && [ "$ar_path" != "$(command -v agent-rollback 2>/dev/null | xargs dirname 2>/dev/null)/ar" ]; then
    # `ar` resolves somewhere other than our npm bin -> system ar is winning.
    # Only warn if the system ar looks like the archive tool (has -d/-r flags).
    if /usr/bin/ar --help 2>/dev/null | grep -q -- '-d \[-TLsv\]'; then
      warn "Note: 'ar' on your PATH is /usr/bin/ar (the BSD archive tool)."
      warn "      Our short alias is now 'arb' to avoid that collision."
      warn "      Use 'agent-rollback' or 'arb' for agent-rollback commands."
    fi
  fi
fi

# ---- optional: install the agent skill -------------------------------------

if [ "$WITH_SKILL" = "1" ]; then
  info "Installing agent-rollback skill globally via npx skills..."
  if run npx --yes skills add Nainish-Rai/agent-rollback --skill agent-rollback -g -y; then
    ok "Skill installed for all detected agents."
  else
    warn "Skill install failed; you can retry with:"
    warn "  npx skills add Nainish-Rai/agent-rollback --skill agent-rollback -g -y"
  fi
fi

# ---- optional: register the MCP server in Codex config --------------------

if [ "$WITH_MCP" = "1" ]; then
  info "Registering MCP server in Codex config ($CODEX_CONFIG)..."
  codex_config_register "$CODEX_CONFIG"
fi

# ---- finish ----------------------------------------------------------------

hr
printf "%sDone.%s Try it in any repo:\n" "$C_GREEN" "$C_RESET"
printf "  %sagent-rollback init%s\n" "$C_BOLD" "$C_RESET"
printf "  %sagent-rollback checkpoint 'before refactor'%s\n" "$C_BOLD" "$C_RESET"
printf "  %sagent-rollback run codex 'refactor the auth module'%s\n" "$C_BOLD" "$C_RESET"
printf "  (or just:  %sarb init%s)\n" "$C_BOLD" "$C_RESET"
hr

if [ "$WITH_MCP" = "1" ]; then
  printf "MCP server registered. Restart Codex CLI to pick it up:\n"
  printf "  %scodex%s   (Ctrl-C, then re-run)\n" "$C_BOLD" "$C_RESET"
  printf "To inspect:  cat %s\n" "$CODEX_CONFIG"
  hr
fi

if [ "$DRY_RUN" = "1" ]; then
  warn "Dry run complete; no changes were made. Re-run without --dry-run to install."
fi
