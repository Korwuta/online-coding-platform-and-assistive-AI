import {XTerm} from "xterm-for-react";
import style from './terminal.module.css'
import {Terminal} from 'xterm'
import {useEffect, useRef} from "react";

export default function TerminalComponent({size,output}){
    const terminalRef = useRef();
    useEffect(() => {
        const term = new Terminal()
        term.open(terminalRef.current)
        term.options.fontFamily = 'monospace'
        term.writeln('Output:')
        output&&output.forEach((value)=>{
            console.log('hi')
            term.writeln(`${value}`)
        })
        return()=>{
            if(term){
                term.dispose()
            }
        }
    }, [output]);
    return(
        <section className={style.terminal} style={{height:`${size}vh`}} ref={terminalRef}>

        </section>

    )
}