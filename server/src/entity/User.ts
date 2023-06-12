import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// TODO: validation
@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text", { unique: true, nullable: false })
  email: string;

  @Field(() => String || null, { nullable: true })
  @Column("text", { nullable: true })
  firstName: string | null;

  @Field(() => String || null, { nullable: true })
  @Column("text", { nullable: true })
  lastName: string | null;

  @Column("text", { nullable: false })
  password: string;
}
