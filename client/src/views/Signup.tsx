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

import NoAuthLayout from "../layouts/NoAuthLayout";

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

const Signup = () => {
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
    reset();
  };
  return (
    <NoAuthLayout centered>
      <Typography component='h1' variant='h4'>
        Please signup
      </Typography>
      <Box component='form' noValidate sx={{ mt: 2 }}>
        <Stack>
          <TextField
            {...register("firstname")}
            label='First Name'
            placeholder='First name'
            type='text'
            error={!!errors.firstname}
            helperText={errors?.firstname?.message}
            required
            variant='outlined'
          />
          <TextField
            {...register("lastname")}
            label='Last Name'
            placeholder='Last name'
            type='text'
            error={!!errors.lastname}
            helperText={errors?.lastname?.message}
            required
            variant='outlined'
          />
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
          <TextField
            {...register("confirmpassword")}
            label='Confirm Password'
            placeholder='Confirm password'
            type='password'
            error={!!errors.confirmpassword}
            helperText={errors?.confirmpassword?.message}
            required
            variant='outlined'
          />
          <TextField
            {...register("telephone")}
            label='Telephone'
            placeholder='Telephone'
            type='text'
            error={!!errors.telephone}
            helperText={errors?.telephone?.message}
            required
            variant='outlined'
          />

          <Button variant='contained' onClick={handleSubmit(onSubmit)}>
            Signup
          </Button>
        </Stack>
      </Box>

      <Grid container>
        <Grid item xs>
          <Link href='/forgot-password' variant='body2'>
            Forgot password?
          </Link>
        </Grid>
        <Grid item>
          <Link href='/login' variant='body2'>
            {"Already have an account? Login"}
          </Link>
        </Grid>
      </Grid>
    </NoAuthLayout>
  );
};

export default Signup;
