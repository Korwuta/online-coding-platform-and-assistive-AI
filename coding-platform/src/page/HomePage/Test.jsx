import style from './test.module.css'


import AnimatedCodeSVG from "./component/AnimatedCodeSVG.jsx";
import {Link} from "react-router-dom";
export default function Test(){
    return (
        <div className={style.testContainer}>
            <Link to={''} className={style.codeJourney}>
                <div>
                    <h3>Programming Journey</h3>
                    <span>Learn how to code with our intuitive resources</span>
                </div>
            </Link>
            <Link to={''} className={style.QAContainer}>
                <div>
                    <h3>Question and Answer</h3>
                    <span>Answer programming question to help you grasp programming questions better</span>
                </div>
            </Link>
            <Link to={''} className={style.contestContainer}>
                <div>Compete with Others</div>
            </Link>
            <Link to={''} className={style.problemContainer}>
                <div>Check Problem</div>
            </Link>
        </div>
    )
}