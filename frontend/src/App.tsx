import AuthProvider from './provider/authProvider';
import Routes from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <AuthProvider>
        <Routes />
      </AuthProvider>
      <ToastContainer position='bottom-right' />
    </>
  );
}

export default App;
