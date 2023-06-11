import { ApolloError } from "apollo-server-core";
import { hash } from "bcrypt";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

import { User } from "../entity/User";

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hi!";
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    try {
      const hashedPassword = await hash(password, 12);

      await User.insert({
        email: email.trim(),
        password: hashedPassword
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
