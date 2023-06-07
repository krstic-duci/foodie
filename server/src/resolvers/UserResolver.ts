import { hash } from "bcrypt";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

import UserModel, { RegisterUserInput } from "../db/models/user";

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hi";
  }

  // @Query(() => [UserModel])
  // async users() {
  //   return await UserModel.find();
  // }

  @Mutation(() => Boolean)
  async register(@Arg("input") input: RegisterUserInput) {
    const { email, password } = input;
    const hashedPassword = await hash(password, 12);

    try {
      await UserModel.create({
        email: email.trim(),
        password: hashedPassword
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
