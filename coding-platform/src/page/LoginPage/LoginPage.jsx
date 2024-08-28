import brandLogo from "../LandingPage/logo.svg";
import style from "./LoginPage.module.css"
import InputBox from "./component/InputBox.jsx";
import {Link, NavLink, useNavigate} from "react-router-dom";
import Button from "./component/Button.jsx";
import LoginLink from "./component/LoginLink.jsx";
import google from './google.svg'
import microsoft from './microsoft.svg'
import {useEffect, useState} from "react";
import errorSVG from './error.svg'
import LoadingBar from "../../LoadingBar.jsx";
import {useUser} from "../../statemanagement.jsx";
import {color} from "framer-motion";
export default function LoginPage(){
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [loginError,setLoginError] = useState(false)
    const [load,setLoad] = useState(false)
    const navigate = useNavigate()
    const [user,setUser] = useUser(state=>([state?.user,state?.setUser]))
    useEffect(() => {
        fetch('http://localhost:3000/home',{
            method:'GET',
            credentials:'include',
        }).then((response) => {
            if(!response.ok){
                return response.json().then((data)=>{
                    throw new Error(data.message)
                })
            }
            return response.json();
        })
            .then((data) => {
                setUser(data.data)
                navigate('/home')
            })
            .catch((error) => {

            });
    }, [navigate]);
    function onLogin(e){
        setLoginError(false)
        setLoad(true)
        e.preventDefault()
        const requestBody = {username:username,password:password}
        const request = fetch('http://localhost:3000/auth/login',{
            method: 'POST',
            body: JSON.stringify(requestBody),
            credentials:"include",
            headers: {
                'Cookies':'cookies.txt',
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if(!response.ok){
                return response.json().then((data)=>{
                    throw new Error(data.message)
                })
            }
            return response.json();
        })
            .then((data) => {
                setLoginError(false)
                setLoad(false)
                setUser(data.data)
                navigate('/home/test')
            })
            .catch((error) => {
                setLoginError(true)
                setLoad(false)
            });
    }
    return(
        <section className={style.loginSection}>
            <main className={`${style.main} ${loginError&&style.animate}`}>
                <div className={style.imageHolder}>
                    <img src={brandLogo} alt={"logo"}/>
                </div>
                <p>Login in to CODE</p>
                <form className={style.loginForm} onSubmit={onLogin}>
                    <InputBox type={'text'} placeholder={'username'} height={50} value={setUsername}/>
                    <InputBox type={'password'} placeholder={'password'} height={50} value={setPassword}/>
                    {loginError&&<div className={style.errorPrompt}>
                        <img src={errorSVG} alt={''}/><span>Incorrect username or password</span>
                    </div>}
                    <Link to={'/reset'} className={style.forgotLink}>Forgot password?</Link>
                    <Button name={'login'} color={'forestgreen'} width={300}/>
                </form>
                <div className={style.altLabel}></div>
                <LoginLink name={'Continue with Google'} image={google} path={'http://localhost:3000/auth/federated/google'}/>
                <LoginLink name={'Continue with Microsoft'} image={microsoft} path={'http://localhost:3000/auth/federated/microsoft'}/>
                <div className={style.createLink}>I do not have an account?<Link to={'/register'}>create new</Link></div>
            </main>
            {load&&<LoadingBar/>}
        </section>
    )
}