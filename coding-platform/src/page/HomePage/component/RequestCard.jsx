import Highlight from 'react-highlight'
import style from './request-card.module.css'
import {useEffect, useRef} from "react";
export default function RequestCard({prompt,result}){
    const ref = useRef()
    useEffect(() => {
        ref.current?.scrollIntoView({behavior: 'smooth'})
    }, []);
    return(
        <div className={style.requestCard} ref={ref}>
            <div className={style.prompt}>
                <label>{prompt}</label>
            </div>
            <div className={style.result}>
                <Highlight language={'bash'} >
                    {
                        result
                    }
                </Highlight>
            </div>
        </div>
    )
}