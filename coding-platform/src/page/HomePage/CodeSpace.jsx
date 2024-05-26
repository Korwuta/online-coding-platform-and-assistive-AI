import CodeEditor from "./component/CodeEditor.jsx";
import style from './code-space.module.css'
import Dropdown from "./component/Dropdown.jsx";
import {useEffect, useState} from "react";
import Terminal from "./component/Terminal.jsx";
import debugSVG from './debug.svg'
import terminalSVG from './terminal.svg'
import {useCode} from "./Home.jsx";


export default function CodeSpace(){
    const [language, setLanguage] = useState('')
    const [openT, setOpenT] = useState(false)
    const [code,setCode] = useCode((state)=>[state.code,state.setCode])
    useEffect(() => {

    }, [code]);
    return(
        <>
            <div className={style.hingeBar}>
                <label>Code Space</label>
                <div style={{
                    display: 'flex',
                    placeItems: 'center',
                    gap: '20px'
                }}>
                    <div className={style.language}>
                        language:
                        <Dropdown items={['Python', 'Java', 'JavaScript', 'Python']} value={setLanguage}/>
                    </div>
                    <div className={style.run}>
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
            <CodeEditor language={language} value={setCode} code={code} size={openT?60:81.2}/>
            {openT&&<Terminal size={21.3}/>}
        </>
    )
}