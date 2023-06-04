import * as z from "zod";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, TextField, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { graphql } from "../__generated__/gql";

const signupSchema = z
  .object({
    firstname: z.string().min(1, { message: "Firstname is required" }),
    lastname: z.string().min(1, { message: "Lastname is required" }),
    email: z.string().min(1, { message: "Email is required" }).email({
      message: "Must be a valid email"
    }),
    password: z
      .string()
      .min(6, { message: "Password must be atleast 6 characters" }),
    confirmpassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
    telephone: z.string().min(1, { message: "Telephone is required" })
  })
  .superRefine(({ password, confirmpassword }, ctx) => {
    if (password !== confirmpassword) {
      ctx.addIssue({
        path: ["confirmpassword"],
        code: "custom",
        message: "Password don't match"
      });
    }
  });
type FormData = z.infer<typeof signupSchema>;

const SIGNUP_MUTATION = graphql(`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      token
    }
  }
`);

const Signup = () => {
  const [signupMutation, { data, loading, error }] =
    useMutation(SIGNUP_MUTATION);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data);
    await signupMutation({
      variables: {
        input: {
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          password: data.password,
          telephone: data.telephone
        }
      }
    });
    reset();
  };
  return (
    <>
      <h1>Please signup</h1>
      <form>
        <TextField
          {...register("firstname")}
          label='First Name'
          type='text'
          error={!!errors.firstname}
          helperText={errors?.firstname?.message}
          required
          variant='outlined'
        />
        <TextField
          {...register("lastname")}
          label='Last Name'
          type='text'
          error={!!errors.lastname}
          helperText={errors?.lastname?.message}
          required
          variant='outlined'
        />
        <TextField
          {...register("email")}
          label='Email'
          type='email'
          error={!!errors.email}
          helperText={errors?.email?.message}
          required
          variant='outlined'
        />
        <TextField
          {...register("password")}
          label='Password'
          type='password'
          error={!!errors.password}
          helperText={errors?.password?.message}
          required
          variant='outlined'
        />
        <TextField
          {...register("confirmpassword")}
          label='Confirm Password'
          type='password'
          error={!!errors.confirmpassword}
          helperText={errors?.confirmpassword?.message}
          required
          variant='outlined'
        />
        <TextField
          {...register("telephone")}
          label='Telephone'
          type='text'
          error={!!errors.telephone}
          helperText={errors?.telephone?.message}
          required
          variant='outlined'
        />

        <Button
          disabled={loading}
          variant='contained'
          onClick={handleSubmit(onSubmit)}
        >
          Signup
        </Button>
      </form>

      {error && <Alert severity='error'>Something went wrong...</Alert>}

      <Typography>
        Back to
        <Link to='/login'> login</Link>
      </Typography>
    </>
  );
};

export default Signup;
