import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column("text", { unique: true, nullable: false })
  email: string;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  firstName: string;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  lastName: string;

  @Column("text", { nullable: false })
  password: string;

  @Column("text", { select: false, nullable: true })
  refreshToken: string;
}
