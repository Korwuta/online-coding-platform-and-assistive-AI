import {NavLink, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import LoginPage from "../LoginPage/LoginPage.jsx";
import style from './home-page.module.css'
import logo from '../LandingPage/logo.svg'
import dashboardSVG from './dashboard.svg'
import testSVG from './quiz.svg'
import aiSVG from './ai.svg'
import logoutSVG from './logout.svg'
import codeSVG from './code.svg'
import {data} from "express-session/session/cookie.js";
import {useEffect, useState} from "react";
import CircularImage from "./component/CircularImage.jsx";
import profile from './profile.png'
import SearchBox from "./component/SearchBox.jsx";
import Notification from "./component/Notification.jsx";
import CodeSpace from "./CodeSpace.jsx";
import Dropdown from "./component/Dropdown.jsx";
import {create} from 'zustand'
export const useCode = create((set)=>({
    code:'',
    setCode: (value)=> set(()=>({code:value}))
}))
export default function Home(){
    const location = useLocation()
    const navigate = useNavigate()
    const [displayName,setDisplayName] = useState('')
    useEffect(() => {
        console.log(location.state)
        fetch('http://localhost:3000/home',{
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
                setDisplayName(data.data.displayName)
            })
            .catch((error) => {
                navigate('/login')
            });
    }, []);
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
                console.log(data)
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
                            <NavLink to={'/home/you'} className={navLink}>
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
                            <CircularImage src={`http://localhost:3000/profile/${displayName}`} alt={'profile'} size={35}/>
                            <div>
                                <label>{displayName}</label>
                                <label>Admin</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.i}>
                    <Routes>
                        <Route path={'code-space'} Component={CodeSpace}/>
                    </Routes>
                </div>
            </div>
        </section>
    )
}