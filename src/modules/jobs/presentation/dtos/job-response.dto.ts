export class JobResponseDto {
  id: string;
  title: string;
  description: string;
  companyId: string;
  companyName?: string;

  constructor(
    id: string,
    title: string,
    description: string,
    companyId: string,
    companyName?: string,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.companyId = companyId;
    this.companyName = companyName;
  }
}
