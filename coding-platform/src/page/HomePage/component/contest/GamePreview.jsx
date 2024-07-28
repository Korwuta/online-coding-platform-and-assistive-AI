import CodeSpace from "../../CodeSpace.jsx";
import styles from './game-preview.module.css'
import Countdown from 'react-countdown'
import Timer from "./Timer..jsx";
import useWebSocket from "react-use-websocket";
import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {useUser} from "../../../../statemanagement.jsx";
import AccountFace from "./AccountFace.jsx";
const WSSInviteLink = 'ws://localhost:3000/';
export default function(){
    const {accessToken} = useParams()
    const user = useUser(state => state.user)
    const {sendMessage,lastMessage} = useWebSocket(WSSInviteLink,{
        onOpen: ()=>console.log('connection Open')
    })
    useEffect(() => {
        sendMessage(JSON.stringify({accessToken,user}))
    }, []);
    useEffect(() => {
        console.log(lastMessage?.data)
    }, [lastMessage]);
    return(
        <div className={styles.preview}>
            <div className={styles.referee}>
                <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM12 9C11.7015 9 11.4344 9.12956 11.2497 9.33882C10.8843 9.75289 10.2523 9.79229 9.83827 9.42683C9.4242 9.06136 9.3848 8.42942 9.75026 8.01535C10.2985 7.3942 11.1038 7 12 7C13.6569 7 15 8.34315 15 10C15 11.3072 14.1647 12.4171 13 12.829V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V12.5C11 11.6284 11.6873 11.112 12.2482 10.9692C12.681 10.859 13 10.4655 13 10C13 9.44772 12.5523 9 12 9ZM12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17H12.01C12.5623 17 13.01 16.5523 13.01 16C13.01 15.4477 12.5623 15 12.01 15H12Z"
                          fill="gainsboro"/>
                </svg>
                <Timer time={Date.now()+50000}/>
            </div>
            <div className={styles.participantConsole}>
                <p>Game Hub</p>
                <div className={styles.participants}>
                    {
                        lastMessage ? JSON.parse(lastMessage.data).map((value)=><AccountFace displayName={value.displayName}/>)
                            : <span>Waiting for participants...</span>
                    }
                </div>
            </div>

            <div className={styles.codeEditor}>
                <CodeSpace/>
            </div>
        </div>
    )
}