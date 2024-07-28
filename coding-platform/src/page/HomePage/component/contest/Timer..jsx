import Countdown from "react-countdown";
import styles from './timer.module.css'
export default function ({time}){
    return(
        <div className={styles.timer}>
            <div className={styles.blink}></div>
            <Countdown date={time} daysInHours={true} autoStart={false}/>
        </div>
    )
}