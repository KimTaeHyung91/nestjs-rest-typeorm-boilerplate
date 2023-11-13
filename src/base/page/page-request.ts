import { Expose, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export abstract class PageRequest {
  @Expose()
  @IsOptional()
  @Transform(({ value }) => value || 1, { toClassOnly: true })
  private pageNo?: number;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => value || 10, { toClassOnly: true })
  private pageSize?: number;

  get offset(): number {
    return (this.pageNo - 1) * this.pageSize;
  }

  get limit(): number {
    return this.pageSize;
  }
}
