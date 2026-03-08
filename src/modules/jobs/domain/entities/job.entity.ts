import { AppError } from 'src/common/response/app.error';

export class Job {
  private _title: string;
  private _description: string;
  private _companyId: string;

  constructor(
    public readonly id: string,
    title: string,
    description: string,
    companyId: string,
  ) {
    this.setTitle(title);
    this.setDescription(description);
    this.setCompanyId(companyId);
  }

  get title() {
    return this._title;
  }

  get description() {
    return this._description;
  }

  get companyId() {
    return this._companyId;
  }

  setTitle(title: string) {
    if (!title || title.trim().length < 3) {
      throw new AppError({
        message: 'Title must have at least 3 characters',
        statusCode: 400,
      });
    }

    if (title.trim().length > 255) {
      throw new AppError({
        message: 'Title must not exceed 255 characters',
        statusCode: 400,
      });
    }

    this._title = title.trim();
  }

  setDescription(description: string) {
    if (!description || description.trim().length < 10) {
      throw new AppError({
        message: 'Description must have at least 10 characters',
        statusCode: 400,
      });
    }

    if (description.trim().length > 500) {
      throw new AppError({
        message: 'Description must not exceed 500 characters',
        statusCode: 400,
      });
    }

    this._description = description.trim();
  }

  setCompanyId(companyId: string) {
    if (!companyId || companyId.trim().length === 0) {
      throw new AppError({
        message: 'Company ID is required',
        statusCode: 400,
      });
    }

    // Validação básica de UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(companyId)) {
      throw new AppError({
        message: 'Invalid Company ID format',
        statusCode: 400,
      });
    }

    this._companyId = companyId;
  }
}