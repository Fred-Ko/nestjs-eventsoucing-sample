import { Field, ObjectType } from '@nestjs/graphql';
import { DefaultEntity } from '@src/common.domain/default.entity';
import { IReadEntity } from '@src/common.domain/read_entity.interface';
import { IUser } from '@src/user/interfaces/user.interface';
import { Expose } from 'class-transformer';
import { Entity, Column, VersionColumn, Unique } from 'typeorm';

@ObjectType()
@Entity()
@Unique(['email'])
export class User extends DefaultEntity implements IUser, IReadEntity {
  @Expose()
  @Column({ type: 'uuid' })
  @Field()
  aggregateId: string;

  @Expose()
  @Column()
  @Field()
  name: string;

  @Expose()
  @Column()
  @Field()
  email: string;

  @Expose()
  @VersionColumn()
  @Field()
  version: number;
}
