export class UserError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserError';
  }
}

export function requireValue(value, message) {
  if (value === undefined || value === null || value === '') {
    throw new UserError(message);
  }

  return value;
}
