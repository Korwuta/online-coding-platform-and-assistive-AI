import style from "./LoginPage.module.css";
import brandLogo from "../LandingPage/logo.svg";
import InputBox from "./component/InputBox.jsx";
import errorSVG from "./error.svg";
import {Link} from "react-router-dom";
import Button from "./component/Button.jsx";
import {useState} from "react";
import mailSVG from './mail.svg'
import LoadingBar from "../../LoadingBar.jsx";

export default function Reset(){
    const [resetError,setResetError] = useState(false)
    const [username,enteredUsername] = useState("")
    const [linkSentSuccess,setLinkSentSuccess] = useState(false)
    const [resetEmail,setResetEmail] = useState('')
    const [load,setLoad] = useState(false)
    function onSubmit(e){
        setResetError(false)
        setLoad(true)
        e.preventDefault()
        fetch('http://localhost:3000/resetpassword/sendresetlink',{
            method:'POST',
            headers:{
                'Cookies':'cookies.txt',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({username:username})
        }).then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
            .then((data) => {
                setLoad(false)
                setResetError(false)
                setLinkSentSuccess(true)
                setResetEmail(data.email)
            })
            .catch(() => {
                setLoad(false)
                setResetError(true)
            });
    }
    return (
        <section className={style.loginSection}>
            <main className={`${style.main} ${resetError && style.animate}`}>
                <div className={style.imageHolder}>
                    <img src={brandLogo||''} alt={"logo"}/>
                </div>
                {!linkSentSuccess? <>
                    <p>Reset Password</p>
                    <form className={style.loginForm} onSubmit={onSubmit}>
                        <InputBox type={'text'} placeholder={'username'} height={50} value={enteredUsername}/>
                        {resetError && <div className={style.errorPrompt}>
                            <img src={errorSVG || ''} alt={''}/><span>Incorrect username</span>
                        </div>}
                        <Link to={'/login'} className={style.forgotLink}>back to login</Link>
                        <Button name={'reset'} color={'forestgreen'} width={300}/>
                    </form>
                </> : <div className={style.mailSent}>
                        <p>Reset Password</p>
                        <div><img src={mailSVG} alt={'mail'}/></div>
                        <label>A mail has been sent to your email address {resetEmail || ''}, check your mail to reset
                            password </label>
                    </div>
                }
            </main>
            {load&&<LoadingBar/>}
        </section>
    )
}