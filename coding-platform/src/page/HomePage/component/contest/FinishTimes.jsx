import CircularImage from "../CircularImage.jsx";
import {useEffect, useState} from "react";
import style from './completion-style.module.css'
import HorizontalAccount from "./HorizontalAccount.jsx";
export default function({id,minute,second,name}){
    return(
        <>
            <HorizontalAccount id={id} name={name}/>
            {
                minute&&second?<p>{minute ? minute.toString().padStart(2, '0') : '00'}:{second ? second.toString().padStart(2, '0') : '00'}</p>:
                    <p className={style.writing}>writing<span style={{
                        ['--index']:0
                    }}>.</span><span style={{'--index':1}}>.</span><span style={{'--index':2}}>.</span></p>
            }</>
    )
}