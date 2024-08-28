
import styles from './completion-style.module.css'
import AccountFace from "./AccountFace.jsx";
import CircularImage from "../CircularImage.jsx";
import {useEffect, useState} from "react";
import {isEmpty} from "lodash/lang.js";
import FinishTimes from "./FinishTimes.jsx";
import Celebration from "./Celebration.jsx";
import HorizontalAccount from "./HorizontalAccount.jsx";
import {useUser} from "../../../../statemanagement.jsx";


export default function ({minute,second,id,thosePlaying,end,winner}){
    const user = useUser(state => state?.user)
    const [displayName, setDisplayName] = useState()
    useEffect(() => {
        console.log(end)
        fetch(`http://localhost:3000/user/${id}`,{
            method:'GET',
            credentials:'include',
        }).then((response) => {
            if(!response.ok){
                return response.json().then((data)=>{
                    throw new Error(data.error)
                })
            }
            return response.json();
        })
            .then((data) => {
                console.log(data)
                setDisplayName(data['display_name'])
            })
            .catch((error) => {
                console.log(error)
            });
    }, []);
    return(
        <div className={styles.completionDialogSection}>
            <div className={styles.dialog}>
                <div className={styles.caption}><p>Completion</p></div>
                <div className={styles.content}>
                    <p>Your code has been successfully submitted, verifying code</p>
                    <ul className={styles.participantEndTime}>
                        <li>
                            <FinishTimes id={id} minute={minute} second={second} name={'You'}/>
                        </li>
                        {
                            !isEmpty(thosePlaying) && thosePlaying.map((value) => <li>
                                <FinishTimes id={value} minute={end?.[value]?.minute} second={end?.[value]?.second}/>
                            </li>)
                        }
                    </ul>
                    {!winner?<div className={styles.status}><p>Analyzing code</p>
                        <div className={styles.loading}></div>
                    </div>:<div className={styles.status}
                    ><HorizontalAccount id={winner}/><p>winner</p></div>}
                </div>
            </div>
            {winner===user?.id && < Celebration/>}
        </div>
    )
}