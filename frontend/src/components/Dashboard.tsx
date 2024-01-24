import { Input } from './ui/input';

const Dashboard = () => {
  return (
    <div className='mt-24 px-4 lg:px-24 flex flex-col gap-4'>
      <h1 className='font-bold text-2xl'>Your Balance : {'₹ 100'}</h1>
      <h1 className='pt-3 font-bold text-2xl'>Users</h1>
      <Input placeholder='Search users....' />
    </div>
  );
};

export default Dashboard;
