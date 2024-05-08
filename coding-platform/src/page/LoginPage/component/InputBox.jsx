import {useEffect, useRef, useState} from 'react'
import styles from './input-box-style.module.css'

// props = {type:'type of input box', placeholder:'hint text'}
export default function InputBox(props){
    const [isFocus,setStateFocus] = useState(false);
    const [inputValue,setInputValue] = useState("");
    const thisInput = useRef();
    let setFocus = ()=>{
        thisInput.current.focus()
        setStateFocus(true)

    }
    let onBlur = ()=>{
        setStateFocus(false)
    }
    let onClick = ()=>{
        setStateFocus(true)
    }
    let onValueChange = (e)=>{
        setInputValue(e.target.value);
        props.value(e.target.value)
    }
    return(
        <div className={`${styles.inputBox} ${isFocus?styles.active:''}`} onClick={setFocus}
             style={{height:`${props.height}px`,width:`${props.width}px`}}>

            <div className={styles.labelContainer} >
                <label
                    className={`${styles.label} ${isFocus ? styles.active : inputValue ? styles.inactive : ''}`}
                    style={{fontSize: `${0.30 * props.height}px`}}>{props.placeholder}</label>
            </div>
            <input ref={thisInput} type={props.type} onBlur={onBlur} onFocus={onClick} onChange={onValueChange}
                   required/>
        </div>
    )
}