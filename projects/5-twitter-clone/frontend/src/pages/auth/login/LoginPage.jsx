import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdPassword, MdPerson } from 'react-icons/md';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import XSvg from '../../../components/svgs/X';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const queryClient = useQueryClient();

  const {
    mutate: loginMutation, // the function to trigger the mutation
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      // refetch the authUser
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    // why [e.target.name]? since the property name is a dynamic value, and JS require dynamic value in []
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className='max-w-screen-xl mx-auto flex h-screen'>
      <div className='flex-1 hidden lg:flex items-center  justify-center'>
        <XSvg className='lg:w-2/3 fill-white' />
      </div>
      <div className='flex-1 flex flex-col justify-center items-center'>
        <XSvg className='w-24 lg:hidden fill-white' />
        <form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
          {/* <h1 className='text-4xl font-extrabold text-white text-center'>
            {"Let's"} go.
          </h1> */}
          {/* for the title, we don't use period, and every word should be capitalized */}
          <h1 className='text-4xl font-extrabold text-white text-center'>
            {"Let's"} Go
          </h1>
          <label className='input input-bordered rounded flex items-center gap-2'>
            <MdPerson />
            <input
              type='text'
              className='grow'
              placeholder='username'
              name='username'
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>

          <label className='input input-bordered rounded flex items-center gap-2'>
            <MdPassword />
            <input
              type='password'
              className='grow'
              placeholder='Password'
              name='password'
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button className='btn rounded-full btn-primary text-white'>
            {isPending ? 'Loading...' : 'Login'}
          </button>
          {isError && <p className='text-red-500'>{error.message}</p>}
        </form>
        <div className='flex flex-col gap-2 mt-4'>
          <p className='text-white text-lg'>{"Don't"} have an account?</p>
          {/* <Link to='/signup'>
            <button className='btn rounded-full btn-primary text-white btn-outline w-full'>
              Sign up
            </button>
          </Link> */}
          {/* for semantic reason, we shouldn't use button inside Link */}
          <Link
            to='/signup'
            className='btn rounded-full btn-primary text-white btn-outline w-full'
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
