import styles from './assistive-ai.module.css'
import sendSVG from './send.svg'
import {useEffect, useRef, useState} from "react";
import RequestCard from "./component/RequestCard.jsx";
import 'highlight.js/styles/monokai-sublime.css';
import {useRequest} from "../../statemanagement.jsx";
import {isEmpty} from "lodash/lang.js";
import LoadingBar from "../../LoadingBar.jsx";
import LottieAnimationDiv from "./component/LottieAnimationDiv.jsx";
export default function AssistiveAI(){
    const textareaRef = useRef();
    const [load, setLoad] = useState(false)
    const [componentList, setComponentList] = useRequest(state => [state.requests,state.setRequests])
    const [prompt, setPrompt] = useState(null)
    function resize(){
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current?.scrollHeight + 3.6 + 'px'
    }
    function sendPrompt(){
        setLoad(true)
        setPrompt('')
        fetch('http://127.0.0.1:5000/generate_code',{
            method:'POST',
            body:JSON.stringify({prompt}),
            headers:{
                "Content-Type":"application/json"
            }
        }).then(response=>response.json()).then((data)=>{
            console.log(data)
            setLoad(false)
            setComponentList(<RequestCard prompt={prompt} result={data.generated_code}/>)
        }).catch(error=>{
            setLoad(false)
            setComponentList(<RequestCard prompt={prompt} result={'Request Failed, retry again'}/>)
        })

    }
    useEffect(() => {
        resize()
    }, [prompt]);
    return(
        <section className={styles.assistiveAISection}>
            {
                isEmpty(componentList)&&<LottieAnimationDiv/>
            }
            {
                componentList.map((value)=>value)
            }
            <div className={styles.inputBox}>
                <textarea rows={1} placeholder={'Type here'} ref={textareaRef}
                    onInput={(e)=>{
                        setPrompt(e.target?.value)
                    }}
                          onKeyUp={(e)=>{
                              if(e.code==='Enter' && !(e.shiftKey&&e.code==='Enter') && !isEmpty(prompt.trim())) {
                                  sendPrompt()
                              }
                          }}
                          value={prompt}
                />
                <div className={styles.send}
                     onClick={sendPrompt}
                >
                    <img src={sendSVG}/>
                </div>
            </div>
            {load&&<LoadingBar/>}
        </section>
    )
}