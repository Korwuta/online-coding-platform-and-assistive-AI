import styles from './info-dialog.module.css'
import Countdown from "react-countdown";
import {Link} from "react-router-dom";
export default function({question,time,close,startSession}){
    return(
        <div className={styles.InfoDialogSection}>
            <div className={styles.dialog}>
                <div className={styles.caption}><p>Select Programming Language</p><Countdown date={time}
                                                                                             daysInHours={true}
                                                                                             onComplete={()=>{
                                                                                                 close(null)
                                                                                                 startSession&&startSession()
                                                                                             }}
                /></div>
                <div className={styles.content}>
                    <div>
                        <p>{question}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}