import styles from './question.module.css'
import QuestionCard from "./QuestionCard.jsx";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useUser} from "../../../../statemanagement.jsx";
import {isEmpty} from "lodash/lang.js";
export default function (){
    const user = useUser(state=>state.user)
    const {language} = useParams()
    const [question, setQuestion] = useState([])
    const [answer, setAnswer] = useState([])
    useEffect(() => {
        fetch(`http://localhost:3000/services/question/${language}`,{
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
                setAnswer(data.out.map((value)=>({user_id:user?.id,question_id:value['question_id'],answer_given:null})))
            })
            .catch((error) => {
                console.log(error)
            });
    }, []);
    function onNext(e){
        e.preventDefault()
    }
    return(
        <>
            <form onSubmit={onNext} className={styles.question}>
                <h2>Programming Question</h2>
                {
                    !isEmpty(question)&& <>
                        <div className={styles.mcq}>
                            <p style={{marginLeft: '10px'}}>Multiple choice question on java</p>
                            {
                                question.map((value, key) => (<QuestionCard
                                    value={value} number={key} answer={setAnswer}/>))
                            }
                        </div>
                        <button>Next <svg width={'30px'} height={'30px'} viewBox={"0 0 24 24"} fill={"none"}>
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