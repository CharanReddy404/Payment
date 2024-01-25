import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@/provider/authProvider';

const Dashboard = () => {
  const [filter, setFilter] = useState('');
  const [users, setUsers] = useState([]);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);

  const { userInfo } = useAuth();

  const fetchBalance = async () => {
    try {
      const response = await axios.get(
        process.env.API_ENDPOINT + `/account/balance`
      );

      setBalance(response?.data.balance);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const transferAmount = async (to, amount) => {
    try {
      const response = await axios.post(
        process.env.API_ENDPOINT + `/account/transfer`,
        { to, amount }
      );
      fetchBalance();
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchBalance();
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.API_ENDPOINT + `/user/bulk?filter=${filter}`
        );

        setUsers(response?.data.users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const searchTimmer = setTimeout(() => {
      fetchData();
    }, 300);

    return () => {
      clearTimeout(searchTimmer);
    };
  }, [filter]);

  return (
    <div className='mt-24 px-4 lg:px-24 flex flex-col gap-4'>
      <h1 className='font-bold text-2xl'>Your Balance : {'₹ ' + balance}</h1>
      <h1 className='pt-3 font-bold text-2xl'>Users</h1>
      <Input
        onChange={(e) => {
          setFilter(e.target.value);
        }}
        placeholder='Search users....'
      />
      {users.map(
        (user) =>
          userInfo.userId != user._id && (
            <Table key={user._id}>
              <TableBody>
                <TableRow>
                  <TableCell className='font-medium'>
                    {user.firstName + ' ' + user.lastName}
                  </TableCell>
                  <TableCell className='hidden md:block'>
                    {user.username}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>Send Money</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader className='flex flex-col gap-4'>
                          <DialogTitle className='text-center text-2xl'>
                            Send Money
                          </DialogTitle>
                          <DialogTitle className='text-2xl'>
                            Name: {user.firstName + ' ' + user.lastName}
                          </DialogTitle>
                          <DialogDescription className='font-semibold'>
                            {'Amount (in Rs)'}
                          </DialogDescription>
                          <Input
                            placeholder='Enter amount'
                            type='number'
                            onChange={(e) => {
                              setAmount(+e.target.value);
                            }}
                          />
                          <Button
                            className='bg-green-500'
                            onClick={() => {
                              transferAmount(user._id, amount);
                            }}
                          >
                            Initiate Transfer
                          </Button>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )
      )}
    </div>
  );
};

export default Dashboard;
