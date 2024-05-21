import CodeEditor from "./component/CodeEditor.jsx";
import style from './code-space.module.css'
import Dropdown from "./component/Dropdown.jsx";
import {useState} from "react";

export default function CodeSpace(){
    const [language, setLanguage] = useState('')
    return(
        <>
            <div className={style.hingeBar}>
                <label>Code Space</label>
                <div className={style.language}>
                    language:
                    <Dropdown items={['C++','Java','JavaScript']} value={setLanguage}/>
                </div>
            </div>
            <CodeEditor language={language}/>
        </>
    )
}