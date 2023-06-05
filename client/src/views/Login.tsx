import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Grid,
  Link,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

import DisplayBooks from "../components/DisplayBooks";
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

const Login = () => {
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
    reset();
  };
  return (
    <NoAuthLayout centered>
      <Typography component='h1' variant='h4'>
        This is login page, welcome
      </Typography>
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

          <Button variant='contained' onClick={handleSubmit(onSubmit)}>
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
      {/* <DisplayBooks /> */}
    </NoAuthLayout>
  );
};

export default Login;
