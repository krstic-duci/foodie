import { isEmail, Min } from "class-validator";
import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// TODO: validation
@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column("text", { unique: true, nullable: false })
  // FIXME: not working for some reason
  // @isEmail()
  email: string;

  @Field(() => String || null, { nullable: true })
  @Column("text", { nullable: true })
  @Min(2)
  firstName: string | null;

  @Field(() => String || null, { nullable: true })
  @Column("text", { nullable: true })
  @Min(2)
  lastName: string | null;

  @Column("text", { nullable: false })
  password: string;
}
