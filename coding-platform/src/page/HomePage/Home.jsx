import {NavLink, Route, Routes, useLocation, useNavigate} from "react-router-dom";

import style from './home-page.module.css'
import logo from '../LandingPage/logo.svg'
import dashboardSVG from './dashboard.svg'
import testSVG from './quiz.svg'
import aiSVG from './ai.svg'
import logoutSVG from './logout.svg'
import codeSVG from './code.svg'

import {useEffect, useState} from "react";
import CircularImage from "./component/CircularImage.jsx";

import SearchBox from "./component/SearchBox.jsx";
import Notification from "./component/Notification.jsx";
import CodeSpace from "./CodeSpace.jsx";
import {useUser} from "../../statemanagement.jsx";
import Test from "./Test.jsx";
import AssistiveAI from "./AssistiveAI.jsx";
import ProgrammingJourney from "./component/journey/ProgrammingJourney.jsx";
import question from "./component/question/Question.jsx";
import contest from "./component/contest/Contest.jsx";
import gamePreview from "./component/contest/GamePreview.jsx";
import Dashboard from "./Dashboard.jsx";
export default function Home(){
    const navigate = useNavigate()
    const [user,setUser] = useUser(state=>([state?.user,state?.setUser]))
    useEffect(() => {
        if(!user){
            navigate('/login')
        }
    }, [user]);
    function navLink({isActive,isPending}){
        return `${style.navLink} ${isActive&&style.active}`
    }
    function onLogout(){
        fetch('http://localhost:3000/logout',{
            method:'GET',
            credentials:'include'
        }).then((response) => {
            if(!response.ok){
                return response.json().then((data)=>{
                    throw new Error(data.message)
                })
            }
            return response.json();
        })
            .then((data) => {
                setUser(null)
            })
            .catch((error) => {
                console.log(error)
            });
    }
    return(
        <section className={style.section}>
            <div className={style.dashboard}>
                <div className={style.topMenu}>
                    <div className={style.logoContainer}>
                        <img src={logo} alt={'logo'}/>
                        <label>CODE</label>
                    </div>
                    <ul>
                        <li>
                            <NavLink end={true} to={'/home'} className={navLink}>
                                <img src={dashboardSVG} alt={'dashboard'}/>
                                Dashboard</NavLink>
                        </li>
                        <li>
                            <NavLink to={'/home/test'} className={navLink}>
                                <img src={testSVG} alt={'test'}/>
                                Tests</NavLink>
                        </li>
                        <li>
                            <NavLink to={'/home/assistive-ai'} className={navLink}>
                                <img src={aiSVG} alt={'ai'}/>
                                Assistive AI</NavLink>
                        </li>
                        <li>
                            <NavLink to={'/home/code-space'} className={navLink}>
                                <img src={codeSVG} alt={'code space'}/>
                                Code Space</NavLink>
                        </li>
                    </ul>
                </div>
                <div className={style.topMenu}>
                    <ul>
                        <li>
                            <NavLink to={'/login'} className={navLink} onClick={onLogout}>
                                <img src={logoutSVG} alt={'ai'}/>
                                Log Out</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={style.content}>
                <div className={style.topBar}>
                    <SearchBox  height={35} width={400}/>
                    <div className={style.leftOption}>
                        <Notification/>
                        <div className={style.name}>
                            <CircularImage src={user.profileImage||`http://localhost:3000/profile/${user?.displayName}`} alt={'profile'} size={35}/>
                            <div>
                                <label>{user?.displayName}</label>
                                <label>Admin</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.i}>
                    <Routes>
                        <Route path={'code-space'} Component={CodeSpace}/>
                        <Route path={''} Component={Dashboard}/>
                        <Route path={'test'} Component={Test}/>
                        <Route path={'assistive-ai'} Component={AssistiveAI}/>
                        <Route path={'test/journey/:language'} Component={ProgrammingJourney}/>
                        <Route path={'test/question/:language'} Component={question}/>
                        <Route path={'test/contest/:language'} Component={contest}/>
                        <Route path={'test/contest/:language/invite/:accessToken'} Component={gamePreview}/>
                    </Routes>
                </div>
            </div>
        </section>
    )
}