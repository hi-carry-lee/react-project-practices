import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useFollow from '../../hooks/useFollow';
import RightPanelSkeleton from '../skeletons/RightPanelSkeleton';
import LoadingSpinner from './LoadingSpinner';

const RightPanel = () => {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ['suggestedUsers'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/users/suggested');
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong!');
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const { follow, isPending } = useFollow();

  if (suggestedUsers?.length === 0) return <div className='md:w-64 w-0'></div>;

  return (
    <div className='hidden lg:flex flex-col  my-4 mx-2'>
      <div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
        <p className='font-bold text-xl mb-2 text-center'>Who to follow</p>
        <div className='flex flex-col gap-4'>
          {/* loading skeleton */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}

          {/* users waiting for follow */}
          {!isLoading &&
            suggestedUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className='flex items-center justify-between gap-4 hover:bg-[#3d4044] transition-all duration-200 rounded-full p-2 group'
                key={user._id}
              >
                <div className='flex gap-2 items-center'>
                  <div className='avatar'>
                    <div className='w-8 rounded-full'>
                      <img src={user.profileImg || '/avatar-placeholder.png'} />
                    </div>
                  </div>
                  <div className='flex flex-col'>
                    <span className='font-semibold tracking-tight truncate w-28'>
                      {user.fullName}
                    </span>
                    <span
                      // ! add a group hover effect
                      className='text-sm text-slate-500 group-hover:text-slate-300 transition-colors duration-200'
                    >
                      @{user.username}
                    </span>
                  </div>
                </div>
                <button
                  className='btn bg-slate-300 text-black hover:bg-slate-100 hover:opacity-90 rounded-full btn-sm'
                  onClick={(e) => {
                    e.preventDefault();
                    follow(user._id);
                  }}
                >
                  {isPending ? <LoadingSpinner size='sm' /> : 'Follow'}
                </button>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
export default RightPanel;
