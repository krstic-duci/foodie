import { IsEmail, Min, validateOrReject } from "class-validator";
import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn
} from "typeorm";

// FIXME: Validation is not working
@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column("text", { unique: true, nullable: false })
  @IsEmail()
  email: string;

  @Field()
  @Column("text", { nullable: true })
  @Min(2, { message: "First Name too short" })
  firstName: string;

  @Field()
  @Column("text", { nullable: true })
  @Min(2, { message: "Last Name too short" })
  lastName: string;

  @Column("text", { nullable: false })
  password: string;

  @Column("text", { select: false, nullable: true })
  refreshToken: string;

  // HOOKS
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
