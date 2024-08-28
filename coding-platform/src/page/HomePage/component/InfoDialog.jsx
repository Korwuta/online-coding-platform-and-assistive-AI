import styles from './info-dialog.module.css'
import Countdown from "react-countdown";
export default function({question,time,close,startSession}){
    return(
        <div className={styles.InfoDialogSection}>
            <div className={styles.dialog}>
                <div className={styles.caption}><p>Question</p>{time&&<Countdown date={time}
                                                                                 daysInHours={true}
                                                                                 onComplete={()=>{
                                                                                     close(null)
                                                                                     startSession&&startSession()
                                                                                 }}
                />}</div>
                <div className={styles.content}>
                    <div>
                        <p>{question}</p>
                    </div>
                </div>
                {
                    !time && <div className={styles.action}>
                        <button onClick={() => {
                            close(null)
                        }}>Cancel
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}