import InputBox from "./InputBox.jsx";
import {useEffect, useState} from "react";
const usernameReGex = /^[a-zA-Z]{5}/
export default function UsernameValidateField({value,valid}){
    const [username,setUsername] = useState('')
    const [message,setMessage] = useState('')
    useEffect(() => {
        value(username)
        if(usernameReGex.test(username)){
            valid(true)
            setMessage('')
            fetch('http://localhost:3000/register/check-username',{
                method:'POST',
                headers:{
                    'Cookies':'cookies.txt',
                    'Content-Type': 'application/json',
                } ,
                body:JSON.stringify({username})
            }).then((response) => {
                if(!response.ok){
                    return response.json().then((data)=>{
                        throw new Error(data.message)
                    })
                }
                return response.json();
            })
                .then((data) => {
                    if(data.message==='username already exist'){
                        valid(false)
                        setMessage(data.message)
                    }else{
                        valid(true)
                        setMessage('')
                    }
                })
                .catch((error) => {

                });
        }else{
            if(username){
                setMessage('username must contain at least first 5 letters')
            }
            valid(false)
        }
    }, [username]);
    return(
        <div>
            <InputBox type={'text'} placeholder={'username'} height={50} value={setUsername}/>
            <span style={{
                color:'#f14e4e',
                fontSize:'0.7rem',
                padding:'10px',
                transition:'all 0.5s ease'
            }}>{message}</span>
        </div>
    )
}