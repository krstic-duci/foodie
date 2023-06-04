// import User from "@database/models/user";
// import bcrypt from "bcrypt";
// import { Response } from "express";
// import { sign } from "jsonwebtoken";

// import {
//   MutationLoginArgs,
//   MutationSignupArgs
// } from "__generated__/schemaTypes";

// export const user = {
//   signup: async (_: any, args: MutationSignupArgs) => {
//     const {
//       input: { firstname, lastname, email, password, telephone }
//     } = args;

//     const hashed = await bcrypt.hash(password, 10);
//     try {
//       await User.create({
//         firstname,
//         lastname,
//         email: email.trim().toLowerCase(),
//         password: hashed,
//         telephone
//       });
//       return true;
//     } catch (err) {
//       console.log(err);
//       return false;
//     }
//   },
//   login: async (_: any, args: MutationLoginArgs, res: Response) => {
//     const {
//       input: { email, password }
//     } = args;

//     const currentUser = await User.findOne({
//       email: email.trim().toLowerCase()
//     });
//     if (!currentUser) {
//       // TODO: better solution maybe ?!?
//       return null;
//     }

//     const isPasswordValid = await bcrypt.compare(
//       password,
//       currentUser.password
//     );
//     if (!isPasswordValid) {
//       // TODO: better solution maybe ?!?
//       return null;
//     }

//     const accessToken = sign(
//       { userId: currentUser.id },
//       process.env.ACCESS_TOKEN_JWT_SECRET!,
//       {
//         expiresIn: "15min"
//       }
//     );
//     const refreshToken = sign(
//       { userId: currentUser.id, count: currentUser.count },
//       process.env.REFRESH_TOKEN_JWT_SECRET!,
//       {
//         expiresIn: "7d"
//       }
//     );

//     res.cookie("access-token", accessToken);
//     res.cookie("refresh-token", refreshToken);
//     return currentUser;
//   }
// };

export {};
