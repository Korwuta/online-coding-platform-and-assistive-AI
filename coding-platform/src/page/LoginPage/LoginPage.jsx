import brandLogo from "../LandingPage/logo.svg";
import style from "./LoginPage.module.css"
import InputBox from "./component/InputBox.jsx";
import {Link, NavLink, useNavigate} from "react-router-dom";
import Button from "./component/Button.jsx";
import LoginLink from "./component/LoginLink.jsx";
import google from './google.svg'
import apple from './apple.svg'
import {useState} from "react";
import errorSVG from './error.svg'
export default function LoginPage(){
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [loginError,setLoginError] = useState(false)
    const navigate = useNavigate()
    function onLogin(e){
        setLoginError(false)
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
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
            .then((data) => {
                setLoginError(false)
                navigate('/home',{state:data})
            })
            .catch((error) => {
                setLoginError(true)
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
                    <Link to={'/'} className={style.forgotLink}>Forgot password?</Link>
                    <Button name={'login'} color={'forestgreen'} width={300}/>
                </form>
                <div className={style.altLabel}></div>
                <LoginLink name={'Continue with Google'} image={google}/>
                <LoginLink name={'Continue with Apple'} image={apple}/>
                <div className={style.createLink}>I do not have an account?<Link to={'/register'}>create new</Link></div>
            </main>
        </section>
    )
}