import { GoogleOAuthProvider } from '@react-oauth/google'
import './App.css'
import AppFlex from './components/AppFlex'
import Navbar from './components/Navbar'
import { useEffect, useState } from 'react'

const App = () => {
  const [auth, setAuth] = useState(false)
  
  useEffect(()=>{
    if(localStorage.getItem("accessToken")) setAuth(true)
  }, [])

  return (
    <GoogleOAuthProvider clientId='622024748798-lbme6j6b5ofms1q955rjf1bmj9n2ied3.apps.googleusercontent.com'>
    <Navbar auth={auth} setAuth={setAuth} />
    {auth ? <AppFlex /> : <></>}
    </GoogleOAuthProvider>
  )
}

export default App
