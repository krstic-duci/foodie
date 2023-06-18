import { ApolloError } from "apollo-server-core";
import { compare, hash } from "bcrypt";
import { IsEmail, Min } from "class-validator";
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver
} from "type-graphql";

import { User } from "@entity/User";
import { COOKIE_NAME } from "@utils/constants";
import { signAccessToken, signRefreshTokenInCookie } from "@utils/jwtTokens";
import { CustomContext } from "@utils/types";

@ObjectType()
class LoginResponse {
  @Field({ nullable: false })
  accessToken: string;
}

@InputType()
class SignupInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  @Min(2, { message: "First name too short" })
  firstName: string;

  @Field({ nullable: true })
  @Min(2, { message: "Last name too short" })
  lastName: string;
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
  async signup(
    @Arg("input") { email, password, firstName, lastName }: SignupInput
  ) {
    try {
      const hashedPassword = await hash(password, 12);

      await User.insert({
        email: email.trim(),
        password: hashedPassword,
        firstName,
        lastName
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
      throw new ApolloError("Auth failed, please try again...");
    }

    try {
      const accessToken = signAccessToken(user.id);
      const foodieCookie = signRefreshTokenInCookie(user.id);

      res.cookie(COOKIE_NAME, foodieCookie, {
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
