import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const Header = () => {
  const userId = true;
  return (
    <header className='fixed top-0 text-black px-4 lg:px-24 py-2 flex justify-between items-center shadow-md bg-white w-full h-16'>
      <h1 className='font-bold text-lg'>
        <a href='/'>Payment</a>
      </h1>
      {userId ? (
        <div className='flex justify-center items-center gap-4'>
          <div className='font-bold text-xl'>Hello, Name</div>
          <div className='font-bold px-3 p-2 rounded-[50%] border-black border-2 shadow-lg'>
            N
          </div>
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
