import Editor from '@monaco-editor/react'
export default function CodeEditor({language}){
    return(
        <Editor height={'60vh'}
                options={{
                    suggestOnTriggerCharacters:false
                }}
                defaultLanguage={language?language.toUpperCase():'javascript'}
                theme={'vs-dark'}
                defaultValue={'#Write code here'}
        />
    )
}