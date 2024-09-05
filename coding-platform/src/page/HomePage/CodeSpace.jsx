import CodeEditor from "./component/CodeEditor.jsx";
import style from './code-space.module.css'
import Dropdown from "./component/Dropdown.jsx";
import {useEffect, useState} from "react";
import Terminal from "./component/Terminal.jsx";
import debugSVG from './debug.svg'
import terminalSVG from './terminal.svg'
import {useCode} from "../../statemanagement.jsx";
import TerminalComponent from "./component/Terminal.jsx";
import LoadingBar from "../../LoadingBar.jsx";

export default function CodeSpace({defaultLanguage}){
    const [language, setLanguage] =
        useCode((state)=>[state.language,state.setLanguage])
    const [openT, setOpenT] = useState(false)
    const [output, setOutput] = useState([])
    const [loading, setLoading] = useState(false)
    const [code,setCode] =
        useCode((state)=>[state.code,state.setCode])
    useEffect(() => {
        defaultLanguage&&setLanguage(defaultLanguage)
    }, [code]);
    function onRun(){
        console.log(language)
        setLoading(true)
        fetch('http://localhost:3000/services/compile-code',{
            method:'POST',
            credentials:'include',
            headers:{
                'Cookies':'cookies.txt',
                'Content-Type':'application/json',
            },
            body:JSON.stringify({code:code,language:language})
        }).then((response) => {
            setLoading(false)
            if(!response.ok){
                return response.json().then((data)=>{
                    throw new Error(data.error)
                })
            }
            return response.json();
        })
            .then((data) => {
                setOutput(data.output)
                setOpenT(true)
            })
            .catch((error) => {
                console.log(error)
            });
    }
    return(
        <>
            <div className={style.hingeBar}>
                <label>Code Space</label>
                <div style={{
                    display: 'flex',
                    placeItems: 'center',
                    gap: '20px'
                }}>
                    {!defaultLanguage&&<div className={style.language}>
                        language:
                        <Dropdown items={['Python', 'Java', 'JavaScript', 'Python']} value={setLanguage}/>
                    </div>}
                    <div className={style.run} onClick={onRun}>
                        Run
                        <img src={debugSVG} alt={'debug'}/>
                    </div>
                    <div className={style.terminalButton}>
                        <img src={terminalSVG} alt={'terminal'}
                             style={{
                                 backgroundColor:`${openT?'#0658a2':''}`
                             }}
                             onClick={()=>{setOpenT(!openT)}}/>
                    </div>
                </div>
            </div>
            <CodeEditor language={language} value={setCode} code={code} size={openT?68:92}/>
            {openT&&<TerminalComponent size={22} output={output}/>}
            {loading&&<LoadingBar/>}

        </>
    )
}