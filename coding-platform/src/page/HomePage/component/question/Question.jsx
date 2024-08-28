import styles from './question.module.css'
import QuestionCard from "./QuestionCard.jsx";
import {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {useQuestionStorage, useUser} from "../../../../statemanagement.jsx";
import {isEmpty, isEqual} from "lodash/lang.js";
import Timer from "../contest/Timer..jsx";
export default function (){
    const user = useUser(state=>state.user)
    const {language} = useParams()
    const [question, setQuestion] = useState([])
    const [answer, setAnswer] = useState({})
    const hasFetch = useRef(false)
    const [score,setScore] = useQuestionStorage(state => [state?.score?.[user.id],state?.setScore])
    const [total,setTotal] = useQuestionStorage(state=>[state?.total?.[user.id],state?.setTotal])
    useEffect(() => {
        if(!hasFetch.current){
           hasFetch.current = true
            getQuestion()
        }

    }, []);
    function putAnswer(question_id,answer){
        console.log(question_id,answer)
        setAnswer(state=>({
            ...state,[question_id]:answer
        }))
    }
    function getQuestion(){
        setAnswer({})
        fetch(`http://localhost:3000/services/question/${language}/${user.id}`,{
            method:'GET',
            credentials:'include'
        }).then((response) => {
            if(!response.ok){
                return response.json().then((data)=>{
                    throw new Error(data.error)
                })
            }
            return response.json();
        })
            .then((data) => {
                setQuestion(data.output)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    useEffect(() => {
        fetch(`http://localhost:3000/services/get-score/${user.id}`,{
            method: 'GET',
            credentials:"include",
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
                setScore(data.output.score,user.id)
                setTotal(data.output.total,user.id)
            })
            .catch((error) => {
                console.log(error)
            });
    }, [question]);
    function onNext(e){
        e.preventDefault()
    }
    function submitAnswer(){
        fetch(`http://localhost:3000/services/mark-answer`,{
            method: 'POST',
            body: JSON.stringify({answer,userId:user.id}),
            credentials:"include",
            headers: {
                'Cookies':'cookies.txt',
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if(!response.ok){
                return response.json().then((data)=>{
                    throw new Error(data.error)
                })
            }
            return response.json();
        })
            .then((data) => {
                getQuestion()
            })
            .catch((error) => {
                console.log(error)
            });
    }
    return(
        <>
            <form onSubmit={onNext} className={styles.question}>
                <div className={styles.questionDep}>
                    <Timer time={Date.now() + 60000 * 5} completionFn={submitAnswer}/>
                    <p style={{
                    }}><span style={{
                        color:"forestgreen",
                    }}>{score||0}</span>/{total||0}</p>
                </div>
                <h2>Programming Question</h2>
                {
                    !isEmpty(question)&& <>
                        <div className={styles.mcq}>
                            <p style={{marginLeft: '10px'}}>Multiple choice question on java</p>
                            {
                                question.map((value, key) => (<QuestionCard
                                    value={value} number={key} answer={putAnswer}/>))
                            }
                        </div>
                        <button onClick={submitAnswer}>Next <svg width={'30px'} height={'30px'} viewBox={"0 0 24 24"} fill={"none"}>
                            <path d={"M4 12H20M20 12L16 8M20 12L16 16"} stroke={"white"} stroke-width={"2"}
                                  stroke-linecap={"round"} stroke-linejoin={"round"}/>
                        </svg>
                        </button>
                    </>
                }
            </form>
        </>
    )
}