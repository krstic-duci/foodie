import { ApolloError } from "apollo-server-core";
import { compare, hash } from "bcrypt";
import { Response } from "express";
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver
} from "type-graphql";

import { User } from "@entity/User";
import {
  ACCESS_TOKEN_FIFTEEN_MINUTES,
  REFERSH_TOKEN_ONE_DAY
} from "@utils/constants";
import { signAccessToken, signRefreshToken } from "@utils/jwtTokens";
import { toMilliseconds } from "@utils/toMiliseconds";
import { CustomContext } from "@utils/types";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hi!";
  }

  @Authorized()
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
    @Ctx() { res }: CustomContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email: email.trim() } });

    if (!user) {
      throw new ApolloError("Cannot login...");
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new ApolloError("Cannot login...");
    }

    try {
      const signUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      };
      const accessToken = signAccessToken(signUser);
      const refreshToken = signRefreshToken(signUser);

      res.cookie("dule", refreshToken, {
        httpOnly: true
      });

      return {
        accessToken
      };
    } catch (error) {
      console.error(error);
      throw new ApolloError("Cannot login...");
    }
  }
}
