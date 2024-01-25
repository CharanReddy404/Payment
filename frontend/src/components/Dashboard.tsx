import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from './ui/button';

const Dashboard = () => {
  const [filter, setFilter] = useState('');
  const [users, setUsers] = useState([
    {
      username: 'charanreddy404@gmail.com',
      firstName: 'Charan',
      lastName: 'Reddy',
      _id: '65ae50c93021003bad44c5dc',
    },
  ]);

  useEffect(() => {}, []);

  return (
    <div className='mt-24 px-4 lg:px-24 flex flex-col gap-4'>
      <h1 className='font-bold text-2xl'>Your Balance : {'₹ 100'}</h1>
      <h1 className='pt-3 font-bold text-2xl'>Users</h1>
      <Input
        onClick={(e) => {
          console.log(e.target.value);
        }}
        placeholder='Search users....'
      />
      {users.map((user) => (
        <Table key={user._id}>
          <TableBody>
            <TableRow>
              <TableCell className='font-medium'>
                {user.firstName + ' ' + user.lastName}
              </TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell className='text-right'>
                <Button>Send Money</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ))}
    </div>
  );
};

export default Dashboard;
