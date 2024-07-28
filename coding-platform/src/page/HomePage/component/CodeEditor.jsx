import Editor from '@monaco-editor/react'
import {useState} from "react";
import styles from './code-editor.module.css'


export default function CodeEditor({language,value,code,size}){
    return(
        <Editor height={`${size}%`}
                options={{
                    suggestOnTriggerCharacters:false,
                    fontSize:'15rem'
                }}
                language={language?language.toLowerCase():'python'}
                defaultLanguage={language.toLowerCase()}
                theme={'vs-dark'}
                onChange={value}
                value={`${code?code:`${language.toLowerCase()==='python'?'#':'//'}write code here`}`}

        />
    )
}