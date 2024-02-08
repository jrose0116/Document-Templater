import { GoogleOAuthProvider } from '@react-oauth/google'
import './App.css'
import AppFlex from './components/AppFlex'
import Navbar from './components/Navbar'
import { useEffect, useState } from 'react'
import { ToastContainer, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [auth, setAuth] = useState(false)
  
  useEffect(()=>{
    if(localStorage.getItem("accessToken")) setAuth(true)
  }, [])

  return (
    <GoogleOAuthProvider clientId='622024748798-lbme6j6b5ofms1q955rjf1bmj9n2ied3.apps.googleusercontent.com'>
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Bounce}
      />
    <Navbar auth={auth} setAuth={setAuth} />
    {auth ? <AppFlex /> : <></>}
    </GoogleOAuthProvider>
  )
}

export default App
