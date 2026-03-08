import { AppError } from 'src/common/response/app.error';

export class Company {
  private _name: string;
  private _document: string;
  private _userId: string;

  constructor(
    public readonly id: string,
    name: string,
    document: string,
    userId: string,
  ) {
    this.setName(name);
    this.setDocument(document);
    this.setUser(userId);
  }

  get name(): string {
    return this._name;
  }

  get document(): string {
    return this._document;
  }

  get userId(): string {
    return this._userId;
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

  setDocument(document: string) {
    if (!document || document.length < 11) {
      throw new AppError({
        message: 'Document must have at least 11 characters',
        statusCode: 400,
      });
    }
    this._document = document;
  }

  setUser(userId: string) {
    if (!userId) {
      throw new AppError({
        message: 'User is required',
        statusCode: 400,
      });
    }
    this._userId = userId;
  }
}
