import { useState } from 'react';
// import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { signInWithEmailAndPassword} from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/saillogo.png';
import { Link } from 'react-router-dom';
import Navbar from '@/components/NavBar';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err) {
      alert('Login failed');
    }
  };

  // const loginWithGoogle = async () => {
  //   const provider = new GoogleAuthProvider();
  //   try {
  //     await signInWithPopup(auth, provider);
  //     navigate('/role');
  //   } catch (err) {
  //     alert('Google Sign-in failed');
  //   }
  // };

  return (
    <div className="flex flex-col min-h-screen  bg-[#F6F6F3]">
      <Navbar/>
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md text-center">
          <img src={logo} alt="SAIL logo" className="w-20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-6">Log In to Your Account</h2>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
          />

          <div className="text-right text-sm text-red-400 hover:underline cursor-pointer mb-6">
            Forgot Password
          </div>

          <button
            onClick={login}
            className="w-full bg-red-500 text-white font-medium py-3 rounded-xl hover:bg-red-600 transition"
          >
            Log In
          </button>

          {/* <div className="my-6 flex items-center">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="mx-2 text-gray-500 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div> */}

          {/* <button
            onClick={loginWithGoogle}
            className="w-full border border-gray-300 flex items-center justify-center py-3 rounded-md hover:bg-gray-50 transition"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              alt="Google logo"
              className="w-5 h-5 mr-2"
            />
            Log In with Google
          </button> */}

          <div className="text-sm text-gray-500 mt-6">
            <Link to="/register">
              New patient? <span className="text-red-400 hover:underline cursor-pointer hover: text-red-600">Create your account</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;