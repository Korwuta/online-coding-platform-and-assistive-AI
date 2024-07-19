import style from './test.module.css'
import AnimatedCodeSVG from "./component/AnimatedCodeSVG.jsx";
import {Link} from "react-router-dom";
import OptionsDialog from "./component/OptionsDialog.jsx";
import {useState} from "react";
import Question from "./component/question/Question.jsx";
export default function Test(){
    const [optionDialog, setOptionDialog] = useState(null)
    function startCodeJourney(){
        const options = [
            {name:'Java',link:'/home/test/journey/java'},
            {name: 'Python',link:'/home/test/journey/python'},
            {name:'JavaScript',link:'/home/test/journey/javascript'}
        ]
        setOptionDialog(<OptionsDialog options={options} close={setOptionDialog}/>)
    }
    function startQuestion(){
        const options = [
            {name:'Java',link:'/home/test/question/java'},
            {name: 'Python',link:'/home/test/question/python'},
            {name:'JavaScript',link:'/home/test/question/javascript'}
        ]
        setOptionDialog(<OptionsDialog options={options} close={setOptionDialog}/>)
    }

    return (
        <>
            <div className={style.testContainer}
            >
                <div className={style.codeJourney}
                     onClick={startCodeJourney}
                >
                    <div>
                        <h3>Programming Journey</h3>
                        <span>Learn how to code with our intuitive resources</span>
                    </div>
                </div>
                <div className={style.QAContainer}
                     onClick={startQuestion}
                >
                    <div>
                        <h3 style={{marginTop:0}}>Question and Answer</h3>
                        <span>Answer programming question to help you grasp programming questions better</span>
                    </div>
                </div>
                <div className={style.contestContainer}>
                    <div>Compete with Others</div>
                </div>
                <div className={style.problemContainer}>
                    <div>Check Problem</div>
                </div>
            </div>
            {
                optionDialog
            }
        </>
    )
}