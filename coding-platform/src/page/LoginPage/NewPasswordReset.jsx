import style from "./LoginPage.module.css";
import brandLogo from "../LandingPage/logo.svg";
import InputBox from "./component/InputBox.jsx";
import errorSVG from "./error.svg";
import {Link, useNavigate, useParams} from "react-router-dom";
import Button from "./component/Button.jsx";
import {useState} from "react";
import mailSVG from './mail.svg'
import VerificationInputBox from "./component/VerificationInputBox.jsx";
import doneSVG from './done.svg'

const passwordRegex = /^(?=.*\d)(?=.*["#$%&'()*+,\-./:;<=>?@\[^\]_`{|}~])["\w#$%&'()*+,\-./:;<=>?@\[^\]_`{|}~]+$/
export default function NewPasswordReset(){
    const {resetToken} = useParams()
    const [resetError,setResetError] = useState(false)
    const [errorMessage,setErrorMessage] = useState('')
    const [newPassword,setNewPassword] = useState("")
    const [errAnimate, setErrAnimate] = useState(false)
    const [confirmPassword,setConfirmPassword] = useState("")
    const [resetSuccess,setResetSuccess] = useState(false)
    const navigate = useNavigate()

    async function onSubmit(e){
        setErrAnimate(false)
        e.preventDefault();
        setTimeout(()=>{
            let hasPasswordFormat = passwordRegex.test(newPassword);
            let newAndConfirmMatch = newPassword===confirmPassword;

            (hasPasswordFormat||setErrorMessage('Invalid password format'))&&
            (newAndConfirmMatch||setErrorMessage(('confirm password does not match password')))
            setResetError(passwordRegex.test(newPassword)||newPassword!==confirmPassword);
            setErrAnimate(passwordRegex.test(newPassword)||newPassword!==confirmPassword)
            if(hasPasswordFormat&&newAndConfirmMatch){
                fetch(`http://localhost:3000/resetpassword/token/${resetToken}`,{
                    method:'POST',
                    headers:{
                        'Cookies':'cookies.txt',
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({newPassword})
                }).then((response)=>{
                    if(!response.ok){
                        throw new Error(`HTTP error! : status ${response.status}`)
                    }
                    return response.json()
                }).then((data)=>{
                    setResetSuccess(true)
                }).catch((err)=>{
                    setErrorMessage(err.message)
                    setResetError(true)
                    setErrAnimate(resetError)
                })
            }
        },10)
    }
    return (
        <section className={style.loginSection}>
            <main className={`${style.main} ${errAnimate && style.animate}`}>
                <div className={style.imageHolder}>
                    <img src={brandLogo||''} alt={"logo"}/>
                </div>
                {
                    !resetSuccess ? <>
                        <p>Set New Password</p>
                        <form className={style.loginForm} onSubmit={onSubmit}>
                            <VerificationInputBox type={'password'} placeholder={'new password'} height={50}
                                                  value={setNewPassword}/>
                            <InputBox type={'password'} placeholder={'confirm password'} height={50}
                                      value={setConfirmPassword}/>
                            {resetError && <div className={style.errorPrompt}>
                                <img src={errorSVG || ''} alt={''}/><span>{errorMessage}</span>
                            </div>}
                            <Button name={'confirm'} color={'forestgreen'} width={300}/>
                        </form>
                    </> : <div className={style.mailSent}>
                        <p>Reset Successful</p>
                        <img src={doneSVG} alt={'mail'}/>
                        <label>Your password has been successfully reset,<br/>
                            <Link to={'/login'} className={style.forgotLink}>back to login</Link></label>
                    </div>
                }
            </main>
        </section>
    )
}