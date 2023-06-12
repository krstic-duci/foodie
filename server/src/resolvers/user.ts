import { ApolloError } from "apollo-server-core";
import { compare, hash } from "bcrypt";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver
} from "type-graphql";

import { User } from "../entity/User";
import { signAccessToken, signRefreshToken } from "../utils/jwtTokens";
import { toMilliseconds } from "../utils/toMiliseconds";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
  @Field()
  refreshToken: string;
}

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

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ) {
    const user = await User.findOne({ where: { email: email.trim() } });

    if (!user) {
      throw new ApolloError("Cannot login...");
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new ApolloError("Cannot login...");
    }

    try {
      const accessToken = signAccessToken(user.id);
      const refreshToken = signRefreshToken(user.id);
      res.cookie("x-access-token", accessToken, {
        httpOnly: true,
        maxAge: toMilliseconds(0, 15, 0) // 15 minutes
      });
      res.cookie("x-refresh-token", refreshToken, {
        httpOnly: true,
        maxAge: toMilliseconds(24, 0, 0) // 24 hours
      });

      return {
        accessToken,
        refreshToken
      };
    } catch (error) {
      console.error(error);
      throw new ApolloError("Cannot login...");
    }
  }
}
