import { AppError } from 'src/common/response/app.error';

export class User {
  private _name: string;
  private _email: string;
  private _password: string;
  private _role: number;

  constructor(
    public readonly id: string,
    name: string,
    email: string,
    password: string,
    role: number,
    public readonly createdAt: Date = new Date(),
  ) {
    this.setName(name);
    this.setEmail(email);
    this.setPassword(password);
    this.setRole(role);
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email;
  }

  get role() {
    return this._role;
  }

  get password() {
    return this._password;
  }

  setName(name: string) {
    if (!name || name.length < 3) {
      throw new AppError({
        message: 'Name must have at least 3 characters',
        statusCode: 400,
      });
    }
    this._name = name;
  }

  setEmail(email: string) {
    if (!email.includes('@')) {
      throw new AppError({
        message: 'Invalid email',
        statusCode: 400,
      });
    }
    this._email = email;
  }

  setRole(role: number) {
    if (role < 1) {
      throw new AppError({
        message: 'Role ID must be a positive integer',
        statusCode: 400,
      });
    }
    this._role = role;
  }

  setPassword(password: string) {
    if (password.length < 6) {
      throw new AppError({
        message: 'Password must have at least 6 characters',
        statusCode: 400,
      });
    }
    this._password = password;
  }
}
