import InputBox from "./InputBox.jsx";
import styles from './verification-input-box.module.css'
import {useEffect, useState} from "react";
export default function VerificationInputBox(props){
    const [pass,setPass] = useState({number:false,symbol:false,capLetter:false,maxLength:false})
    const [inputValue,setInputValue] = useState('')
    useEffect(() => {
        props.value(inputValue)
        setPass((prevState)=> ({
            ...prevState,
            number: hasMatch(/\d/)
        }))
        setPass((prevState)=> ({
            ...prevState,
            symbol: hasMatch(/["#$%&'()*+,\-./:;<=>?@\[^\]_`{|}~]/)
        }))
        setPass((prevState)=> ({
            ...prevState,
            capLetter: hasMatch(/[A-Z]/)
        }))
        setPass((prevState)=> ({
            ...prevState,
            maxLength: inputValue.length>=8
        }))

    }, [inputValue]);
    function hasMatch(regEx){
        return !!inputValue.match(regEx)
    }
    return(
        <div className={styles.container}>
            <InputBox type={props.type} placeholder={props.placeholder} height={props.height} value={setInputValue}/>
            <ul>
                <li style={{color:!inputValue?"gainsboro":pass.number?'#3dc43d':'#f14e4e'}}><div
                    style={{backgroundColor:!inputValue?"gainsboro":pass.number?'#3dc43d':'#f14e4e'}}></div>
                    password must contain a number</li>
                <li style={{color:!inputValue?"gainsboro":pass.symbol?'#3dc43d':'#f14e4e'}}><div
                    style={{backgroundColor:!inputValue?"gainsboro":pass.symbol?'#3dc43d':'#f14e4e'}}></div>
                    password must contain a symbol</li>
                <li style={{color:!inputValue?"gainsboro":pass.capLetter?'#3dc43d':'#f14e4e'}}><div
                    style={{backgroundColor:!inputValue?"gainsboro":pass.capLetter?'#3dc43d':'#f14e4e'}}></div>
                    password must contain a capital letter</li>
                <li style={{color:!inputValue?"gainsboro":pass.maxLength?'#3dc43d':'#f14e4e'}}><div
                    style={{backgroundColor:!inputValue?"gainsboro":pass.maxLength?'#3dc43d':'#f14e4e'}}></div>
                    password must have 8 or more characters</li>
            </ul>
        </div>
    )
}