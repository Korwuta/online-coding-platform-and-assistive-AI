import notificationSVG from './notification-svgrepo-com.svg'
import style from './notification.module.css'
import {useState} from "react";
export default function Notification(){
    const [notificationExist, setNotificationExist] = useState(false)
    return(
        <div className={style.notification}>
            <img src={notificationSVG} alt={'notification'}
                 className={notificationExist?style.notificationExist:null}/>
            {
                notificationExist && <div></div>
            }
        </div>
    )
}