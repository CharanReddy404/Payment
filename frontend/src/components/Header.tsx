import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '@/provider/authProvider';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';

const Header = () => {
  const { token, userInfo, setToken } = useAuth();

  return (
    <header className='fixed top-0 text-black px-4 lg:px-24 py-2 flex justify-between items-center shadow-md bg-white w-full h-16'>
      <h1 className='font-bold text-lg'>
        <a href='/'>Payment</a>
      </h1>
      {token ? (
        <div className='flex justify-center items-center gap-4'>
          <div className='font-bold text-xl'>Hello, {userInfo?.fullName}</div>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger> {userInfo?.fullName[0]}</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Profile</MenubarItem>
                <MenubarSeparator />
                <MenubarItem
                  onClick={() => {
                    setToken(null);
                  }}
                >
                  Logout
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      ) : (
        <nav className='flex gap-4'>
          <Button variant='outline'>
            <Link to='/signup'>SignUp</Link>
          </Button>
          <Button>
            <Link to='/signin'>SignIn</Link>
          </Button>
        </nav>
      )}
    </header>
  );
};

export default Header;
