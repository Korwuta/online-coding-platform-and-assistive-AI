import searchSVG from './search.svg'
import style from './search-input-box.module.css'
import {useRef, useState} from "react";
export default function SearchBox({width,height}){
    const inputRef = useRef();
    const [focus, setFocus] = useState(false)
    function onClick(){
        inputRef.current.focus()
    }

    return(
        <div className={style.searchBox} onClick={onClick}
             style={{outline:focus?'1px solid #535bf2':''}}
        >
            <img src={searchSVG} alt={'search'}/>
            <input type={'text'} placeholder={'Search'} ref={inputRef}
                   style={{width:`${width}px`,height:`${height}px`}}
                   onFocus={()=>{
                       setFocus(true)
                   }}
                   onBlur={()=>{
                       setFocus(false)
                   }}
            />
        </div>
    )
}