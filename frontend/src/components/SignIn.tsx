import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/provider/authProvider';

const userSignInSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});

const SignIn = () => {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();

  if (token) {
    navigate('/dashboard', { replace: true });
  }

  const form = useForm<z.infer<typeof userSignInSchema>>({
    resolver: zodResolver(userSignInSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof userSignInSchema>) {
    console.log(values);
    const user = await axios.post(
      'http://localhost:3000/api/v1/user/signin',
      values
    );

    setToken(user.data.token);
    navigate('/dashboard', { replace: true });
  }

  return (
    <div className='mt-24 flex justify-center items-center'>
      <div className='flex flex-col justify-center items-center gap-4 bottom-2 rounded-md shadow-lg p-4 px-10'>
        <h1 className='text-2xl font-bold'>Sign In</h1>
        <p className='font-semibold text-gray-500 text-center'>
          Enter your credentials to access your account
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full space-y-8'
          >
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold '>
                    Email <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold '>
                    Password
                    <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full' type='submit'>
              Sign In
            </Button>
          </form>
        </Form>
        <p className=''>
          Don't have an account?{` `}
          <Link to='/signup' className='font-semibold underline'>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
