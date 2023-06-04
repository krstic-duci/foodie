import * as z from "zod";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, TextField, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { graphql } from "../__generated__/gql";

const loginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email"
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
});
type FormData = z.infer<typeof loginSchema>;

const LOGIN_MUTATION = graphql(`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
    }
  }
`);

const Login = () => {
  const [loginMutation, { data, loading, error }] = useMutation(LOGIN_MUTATION);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data);
    await loginMutation({
      variables: { input: { email: data.email, password: data.password } }
    });
    reset();
  };
  return (
    <>
      <h1>This is login page, welcome</h1>
      <form>
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

        <Button
          disabled={loading}
          variant='contained'
          onClick={handleSubmit(onSubmit)}
        >
          Login
        </Button>
      </form>

      {error && <Alert severity='error'>Something went wrong...</Alert>}

      <Typography>
        Don't have an account, click
        <Link to='/signup'> here</Link>
      </Typography>
    </>
  );
};

export default Login;
