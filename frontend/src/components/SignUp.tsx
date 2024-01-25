import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/provider/authProvider';
import { toast } from 'react-toastify';

const userSignUpSchema = z.object({
  username: z.string().email().min(3),
  firstName: z.string().min(3),
  lastName: z.string().min(1),
  password: z.string().min(6),
});

const SignUp = () => {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();

  if (token) {
    return <Navigate to='/dashboard' />;
  }

  const form = useForm<z.infer<typeof userSignUpSchema>>({
    resolver: zodResolver(userSignUpSchema),
  });

  async function onSubmit(values: z.infer<typeof userSignUpSchema>) {
    console.log(values);

    try {
      const user = await axios.post(
        process.env.API_ENDPOINT + `/user/signup`,
        values
      );

      setToken(user.data.token);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <div className='mt-24 flex justify-center items-center'>
      <div className='flex flex-col justify-center items-center gap-4 bottom-2 rounded-md shadow-lg p-4 px-10'>
        <h1 className='text-2xl font-bold'>Sign Up</h1>
        <p className='font-semibold text-gray-500 text-center'>
          Enter your information to create your account
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full space-y-8'
          >
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold '>
                    First Name <span className='text-red-500'>*</span>
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
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold '>
                    Last Name <span className='text-red-500'>*</span>
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
                    Password <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full' type='submit'>
              Sign Up
            </Button>
          </form>
        </Form>
        <p className='d'>
          Already have an account?{' '}
          <Link to='/signin' className='underline font-semibold'>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
