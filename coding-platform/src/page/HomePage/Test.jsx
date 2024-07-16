import style from './test.module.css'


import AnimatedCodeSVG from "./component/AnimatedCodeSVG.jsx";
import {Link} from "react-router-dom";
import OptionsDialog from "./component/OptionsDialog.jsx";
import {useState} from "react";
export default function Test(){
    const [optionDialog, setOptionDialog] = useState(null)
    function startCodeJourney(){
        setOptionDialog(<OptionsDialog close={setOptionDialog}/>)
    }
    return (
        <>
            <div className={style.testContainer}
                onClick={startCodeJourney}
            >
                <div className={style.codeJourney}>
                    <div>
                        <h3>Programming Journey</h3>
                        <span>Learn how to code with our intuitive resources</span>
                    </div>
                </div>
                <div className={style.QAContainer}>
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