import Countdown from "react-countdown";
import styles from './timer.module.css'
import {useRef} from "react";
export default function ({time,completionFn,completionTime}){

    return(
        <div className={styles.timer}>
            <div className={styles.blink}></div>
            <Countdown  date={time} daysInHours={true} autoStart={!!time} onComplete={()=>{completionFn&&completionFn()}}
                        onTick={({minutes,seconds})=>{
                           completionTime&&completionTime({minutes,seconds})
                        }}
            />
        </div>
    )
}