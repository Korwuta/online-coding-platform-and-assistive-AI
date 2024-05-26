import {XTerm} from "xterm-for-react";
import style from './terminal.module.css'
import {useEffect, useRef} from "react";
const terminalOutput = 'CODE Terminal:'
export default function Terminal({size,output}){
    const terminalRef = useRef();
    useEffect(() => {
        terminalRef.current.terminal.focus()
        terminalRef.current.terminal.writeln(`${terminalOutput}${output||''}`)
    }, []);
    return(
        <section className={style.terminal} style={{height:`${size}vh`}}>
            <XTerm options={{
                cursorBlink:true,
                fontFamily:'monospace',
            }} ref={terminalRef}/>
        </section>

    )
}