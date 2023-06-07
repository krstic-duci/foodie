import { getModelForClass, prop } from "@typegoose/typegoose";
import { IsEmail, MinLength, MaxLength } from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";

@ObjectType()
class User {
  // TODO: why !
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  @prop({ default: "" })
  firstName?: string;

  @Field(() => String)
  @prop({ default: "" })
  lastName?: string;

  @Field(() => String)
  @prop({ default: "" })
  phone?: string;

  @Field(() => String, { nullable: false })
  @prop({ required: true, unique: true })
  email!: string;

  @prop({ required: true })
  password!: string;
}

// TODO: this is not working :(
@InputType()
export class RegisterUserInput {
  @IsEmail()
  @Field(() => String)
  email!: string;

  @MinLength(6, {
    message: "password must be at least 6 characters long",
  })
  @MaxLength(50, {
    message: "password must not be longer than 50 characters",
  })
  @Field(() => String)
  password!: string;
}

const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true }
});
export default UserModel;
