import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Grid,
  Link,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

import { graphql } from "../__generated__/gql";
import DisplayHello from "../components/DisplayHello";
import NoAuthLayout from "../layouts/NoAuthLayout";

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
  mutation Login($password: String!, $email: String!) {
    login(password: $password, email: $email) {
      accessToken
    }
  }
`);

const Login = () => {
  const navigate = useNavigate();

  const [loginMutation, { data, loading, error }] = useMutation(LOGIN_MUTATION);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit: SubmitHandler<FormData> = async (input) => {
    console.log(input);
    await loginMutation({
      variables: { email: input.email, password: input.password }
    });
    // FIXME: undefined
    console.log(data);
    // store the auth in the Context

    // navigate to the home page
    navigate("/", { replace: true });
  };
  return (
    <NoAuthLayout centered>
      <Typography component='h1' variant='h4'>
        This is login page, welcome
      </Typography>
      {error && (
        <Alert severity='error'>Auth failed, please try again...</Alert>
      )}
      <Box
        component='form'
        noValidate
        sx={{ mt: 2 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack>
          <TextField
            {...register("email")}
            label='Email'
            placeholder='Email'
            type='email'
            error={!!errors.email}
            helperText={errors?.email?.message}
            required
            variant='outlined'
          />
          <TextField
            {...register("password")}
            label='Password'
            placeholder='Password'
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
        </Stack>
        <Grid container>
          <Grid item xs>
            <Link href='/forgot-password' variant='body2'>
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href='/signup' variant='body2'>
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
      {/* FIXME: this is a test to ensure that graphql server is working */}
      <DisplayHello />
    </NoAuthLayout>
  );
};

export default Login;
