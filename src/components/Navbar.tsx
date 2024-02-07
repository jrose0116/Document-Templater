import { useEffect } from "react"

import { GoogleLogin } from "@react-oauth/google"

export interface Props {
    auth: boolean;
    setAuth: (arg0: boolean) => void;
}

const Navbar = (props: Props) => {
    const {auth, setAuth} = props

    const signOut = () => {
        localStorage.removeItem("accessToken")
        setAuth(false)
    }

    useEffect(()=>{
        const token = localStorage.getItem("accessToken")
        if(token) setAuth(true)
    }, [])
    
    return <div className="navbar">
        <h1 className="title">Cover Letter Templater</h1>
        {auth ? <button className="navButton" onClick={signOut}>Sign Out</button> : <div className="navButton">
            <GoogleLogin
            onSuccess={credentialResponse => {
                if (credentialResponse && credentialResponse.credential) {
                    localStorage.setItem("accessToken", credentialResponse.credential)
                    setAuth(true)
                }
            }}
            onError={() => {
                console.log('Login Failed');
            }} />
        </div>}
    </div>
}

export default Navbar