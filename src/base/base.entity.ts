import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';
import { MutableType } from './type/mutable.type';
import { entries } from 'lodash';

@Entity()
export abstract class BaseEntity<T> {
  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  readonly deletedAt: Date;

  protected mutable(
    props: Omit<MutableType<T>, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    for (const [key, value] of entries(props)) {
      (this as any)[key] = value;
    }
  }
}
