export class CourseResponseDto {
  id: string;
  title: string;
  description: string;
  link: string;
  companyId: string;
  companyName?: string;
  createdAt: Date;

  constructor(
    id: string,
    title: string,
    description: string,
    link: string,
    companyId: string,
    createdAt: Date,
    companyName?: string,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.link = link;
    this.companyId = companyId;
    this.createdAt = createdAt;
    this.companyName = companyName;
  }
}