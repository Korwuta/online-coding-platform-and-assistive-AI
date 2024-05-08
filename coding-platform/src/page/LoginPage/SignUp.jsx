import brandLogo from "../LandingPage/logo.svg";
import style from "./LoginPage.module.css"
import InputBox from "./component/InputBox.jsx";
import {Link, NavLink, useNavigate} from "react-router-dom";
import Button from "./component/Button.jsx";
import LoginLink from "./component/LoginLink.jsx";
import google from './google.svg'
import microsoft from './microsoft.svg'
import {useState} from "react";
import style2 from './sign-up.module.css'
import errorSVG from './error.svg'
import LoadingBar from "../../LoadingBar.jsx";
import VerificationInputBox from "./component/VerificationInputBox.jsx";
import mailSVG from "./mail.svg";

const nameReGex = /[a-zA-Z]{2,}/
const emailRegex = /^[^\s@]+@[^\s@].[^\s@]/
export default function LoginPage(){
    const [firstName,setFirstName] = useState("")
    const [lastName,setLastName] = useState("")
    const [email,setEmail] = useState('')
    const [signUpError,setSignUpError] = useState(false)
    const [validDetails,setValidDetails] = useState({name:false,email:false})
    const [load,setLoad] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()
    function onCreate(e){
        let hasNameFormat = nameReGex.test(firstName)&&nameReGex.test(lastName)

        setSignUpError(false)
        e.preventDefault()
        setTimeout(()=>{
            if(!hasNameFormat){
                setValidDetails((prevState)=>({
                    ...prevState,
                    name:false,
                }))
                setSignUpError(!hasNameFormat)
                setErrorMessage(!nameReGex.test(firstName)?'Invalid first name':'Invalid last name')
            }else{
                setValidDetails((prevState)=>({
                    ...prevState,
                    name:true,
                }))
                if(emailRegex.test(email)&&validDetails.name){
                    setLoad(true)
                    const requestBody = {firstName,lastName,email}
                    const request = fetch('http://localhost:3000/register/registeruser',{
                        method: 'POST',
                        body: JSON.stringify(requestBody),
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
                            setSignUpError(false)
                            setEmail(data.email)
                            setLoad(false)
                            setValidDetails((prevState)=>({
                                ...prevState,
                                email:true,
                            }))
                        })
                        .catch((error) => {
                            setSignUpError(true)
                            setLoad(false)
                            setErrorMessage(error.message)
                        });
                }
            }

        },10)
    }
    return(
        <section className={style.loginSection}>
            <main className={`${style.main} ${signUpError&&style.animate}`}>
                <div className={style.imageHolder}>
                    <img src={brandLogo} alt={"logo"}/>
                </div>
                {
                    !(validDetails.name && validDetails.email) ? <>
                        <p>Sign up with CODE</p>
                        <form className={style.loginForm} onSubmit={onCreate}>
                            <>
                                <label>Enter Your Full Name</label>
                                <InputBox type={'text'} placeholder={'first name'} height={50} value={setFirstName}
                                          disabled={validDetails.name}/>
                                <InputBox type={'text'} placeholder={'last name'} height={50} value={setLastName}
                                          disabled={validDetails.name}/>
                            </>
                            {
                                validDetails.name && <>
                            <span className={style2.span}
                                  onMouseDown={() => {
                                      setValidDetails((prevState) => ({
                                          ...prevState, name: false
                                      }))
                                  }}>Edit name</span>
                                    <label>Enter Email</label>
                                    <InputBox type={'email'} placeholder={'email'} height={50} value={setEmail}
                                              disabled={validDetails.email}/></>
                            }
                            {signUpError && <div className={style.errorPrompt}>
                                <img src={errorSVG} alt={''}/><span>{errorMessage}</span>
                            </div>}
                            <Link to={'/login'} className={style.forgotLink}>back to login</Link>
                            <Button name={validDetails.name ? 'register' : 'confirm'} color={'forestgreen'}
                                    width={300}/>
                        </form>

                    </> : <div className={style.mailSent}>
                        <p>Confirm Email</p>
                        <div><img src={mailSVG} alt={'mail'}/></div>
                        <label>A mail has been sent to your email address {email || ''}, check your mail to confirm
                            mail address</label>
                    </div>
                }
            </main>
            {load && <LoadingBar/>}
        </section>
    )
}