import CodeSpace from "../../CodeSpace.jsx";
import styles from './game-preview.module.css'
import Countdown from 'react-countdown'
import Timer from "./Timer..jsx";
import useWebSocket from "react-use-websocket";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useCode, useMessageStorage, useUser} from "../../../../statemanagement.jsx";
import AccountFace from "./AccountFace.jsx";
import useSound from 'use-sound'
import beep from './sound/beep.wav'
import {isEmpty} from "lodash/lang.js";
import InfoDialog from "../InfoDialog.jsx";
import CompletionDialog from "./CompletionDialog.jsx";
import {data} from "express-session/session/cookie.js";
const WSSInviteLink = 'ws://localhost:3000/';


export default function(){
    const {accessToken,language} = useParams()
    const [code] =
        useCode((state)=>[state.code])
    const user = useUser(state => state.user)
    const [message, setMessage] = useMessageStorage(state=>[state?.message?.[accessToken],state?.setMessage])
    const [time,setTime] = useMessageStorage(state => [state?.time?.[accessToken],state?.setTime])
    const [start, setStart] = useMessageStorage(state=>[state?.start?.[accessToken],state?.setStart])
    const [play,{stop}] = useSound(beep)
    const [enable , setEnable ] = useMessageStorage(state => [state?.enable?.[accessToken],state?.setEnable])
    const [thosePlaying,setThosePlaying] = useMessageStorage(state=>
        [state?.thosePlaying?.[accessToken],state?.setThosePlaying])
    const [dialog, setDialog] = useState(null)
    const [question,setQuestion] = useMessageStorage(state => [state?.question?.[accessToken],state?.setQuestion])
    const [completionTime,setCompletionTime] = useState({minutes:0,seconds:0})
    const [endDetail, setEndDetail] = useMessageStorage(state => [state?.endDetail?.[accessToken],state?.setEndDetail])
    const [openCompletionDialog, setOpenCompletionDialog] = useMessageStorage(state => [state?.openCompletionDialog?.[accessToken],state?.setOpenCompletionDialog])
    const [leaveTime, setLeaveTime] = useMessageStorage(state=>[state?.leaveTime?.[accessToken],state?.setLeaveTime])
    const [winner,setWinner] = useMessageStorage(state => [state?.winner?.[accessToken],state?.setWinner])
    const {sendMessage,lastMessage} = useWebSocket(WSSInviteLink,{
        onOpen: ()=>console.log('connection Open')
    })
    useEffect(() => {
        console.log('hidfd')
    }, []);
    function startContest(){
        sendMessage(JSON.stringify({event:'start-contest',accessToken}))
    }
    function startSession(){
        sendMessage(JSON.stringify({event:'start-session',accessToken,data:{id:user.id}}))
    }
    useEffect(() => {
        sendMessage(JSON.stringify({event:'get-participants',accessToken,data:{user}}))
    }, [user]);
    useEffect(() => {
        if(lastMessage){
            const message = JSON.parse(lastMessage.data)
            console.log(message)
            switch (message.event){
                case 'send-request':
                    setMessage(message.data,accessToken)
                    play()
                    break
                case 'request-accepted':
                    setEnable(true,accessToken)
                    setMessage(message.data,accessToken)
                    play()
                    break
                case 'question':
                    setQuestion(message.data.question,accessToken)
                    setDialog(<InfoDialog question={message.data.question.text} time={message.data.time} close={setDialog} startSession={startSession} />)
                    break
                case 'start-timeout':
                    setStart(message.data,accessToken)
                    break
                case 'start-session':
                    setTime(message.data.time,accessToken)
                    play()
                    break
                case 'game-end':
                    setDialog(<InfoDialog question={message.data.question} time={message.data.time} close={setDialog}/>)
                    break
                case 'those-playing':
                    setThosePlaying(message.data,accessToken)
                    break
                case 'finish':
                    const completeTime = message.data.completeTime.split(':')
                    console.log(message.data.id,completeTime[0])
                    setEndDetail({[message.data.id]:{minute:completeTime[0],second:completeTime[1]}},accessToken)
                    break
                case 'winner':
                    console.log(message.data.id)
                    const winnerId = message.data.id
                    setWinner(winnerId,accessToken)
            }
        }
    }, [lastMessage]);
    useEffect(() => {
        console.log(endDetail)
    }, [endDetail]);
    function onAccept(id){
        setEnable(true,accessToken)
        sendMessage(JSON.stringify({event:'add-participant',accessToken,data:{id,creatorId:user.id}}))
    }
    function handleSubmission(){
        sendMessage(JSON.stringify({event:'send-answer',accessToken,data:
                {
                    id:user.id,
                    completeTime:`${completionTime.minutes}:${completionTime.seconds}`,
                    question_id:question.id,
                    answer:code,
                    language
                }
        }))
        setOpenCompletionDialog(true,accessToken)
        setLeaveTime({minutes:completionTime.minutes,seconds:completionTime.seconds},accessToken)
    }
    return(
        <div className={styles.preview}>
            <div className={`${styles.referee} ${start && styles.active}`}>
                {
                    !start && <button className={styles.start} onClick={() => {
                        startContest()
                    }} disabled={!enable}>
                        start
                    </button>
                }
                {
                    start && !isEmpty(thosePlaying) && thosePlaying.map((value) => <AccountFace id={value} accepted={onAccept}
                                                                            showAccept={false} size={35}/>)
                }
                <svg width="25px" height="25px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                    onClick={handleSubmission}
                >
                    <g id="Complete">
                        <g id="upload">
                            <g>
                                <path d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7" fill="none" stroke="gainsboro"
                                      strokeLinecap={"round"} strokeLinejoin={"round"} strokeWidth={"2"}/>
                                <g>
                                    <polyline data-name="Right" fill="none" id="Right-2"
                                              points="7.9 6.7 12 2.7 16.1 6.7" stroke="gainsboro" strokeLinecap={"round"}
                                              strokeLinejoin={"round"} strokeWidth={"2"}/>
                                    <line fill="none" stroke="gainsboro" strokeLinecap={"round"} strokeLinejoin={"round"}
                                          strokeWidth={"2"} x1="12" x2="12" y1="16.3" y2="4.8"/>
                                </g>
                            </g>
                        </g>
                    </g>
                </svg>
                <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                     onClick={()=>setDialog(<InfoDialog question={question.text}  close={setDialog} />)}
                >
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM12 9C11.7015 9 11.4344 9.12956 11.2497 9.33882C10.8843 9.75289 10.2523 9.79229 9.83827 9.42683C9.4242 9.06136 9.3848 8.42942 9.75026 8.01535C10.2985 7.3942 11.1038 7 12 7C13.6569 7 15 8.34315 15 10C15 11.3072 14.1647 12.4171 13 12.829V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V12.5C11 11.6284 11.6873 11.112 12.2482 10.9692C12.681 10.859 13 10.4655 13 10C13 9.44772 12.5523 9 12 9ZM12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17H12.01C12.5623 17 13.01 16.5523 13.01 16C13.01 15.4477 12.5623 15 12.01 15H12Z"
                          fill="gainsboro"/>
                </svg>
                {time && <Timer time={time || Date.now()} completionFn={()=>{
                    isEmpty(leaveTime)&&handleSubmission()
                    setOpenCompletionDialog(true,accessToken)
                }}
                                completionTime={setCompletionTime}/>}
            </div>
            {
                !start && <div className={styles.participantConsole}>
                    <p style={{
                        color: "#FFF3E1"
                    }}>Game Hub</p>
                    <div className={styles.participants}>
                        {
                            message ? message.map((value) => <AccountFace id={value.id} accepted={onAccept}
                                                                          showAccept={value.status==='unaccepted'}/>)
                                : <span>Waiting for participants...</span>
                        }
                    </div>
                </div>
            }

            <div className={`${styles.codeEditor} ${start&&styles.active}`}>
                <CodeSpace/>
            </div>
            {
                  dialog
            }
            {
                openCompletionDialog&&<CompletionDialog winner={winner} minute={leaveTime?.minutes} second={leaveTime?.seconds}
                                  thosePlaying={thosePlaying} id={user.id} end={endDetail}
                />
            }
        </div>
    )
}