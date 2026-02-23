export class AppResponse<T> {
  public readonly statusCode: number;
  public readonly message: string;
  public readonly data: T;

  constructor({
    statusCode = 200,
    message = 'Success',
    data,
  }: {
    statusCode?: number;
    message?: string;
    data: T;
  }) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
