import brandLogo from './logo.svg'
import style from './LandingPagesStyle.module.css'
import landingPage from './coding.jpg'
import downArrow from './down-arrow.svg'
import {useEffect, useRef, useState} from "react";
import {Link, NavLink} from "react-router-dom";
import ArrowUp from "./ArrowUp.jsx";
import codeSnippet from './code-snippet.png'
import editor from './code-editor.png'
import {motion, useInView} from "framer-motion";
import AnimatedText from "./component/AnimatedText.jsx";
import trophyImage from './trophy-colored.svg';
import AnimateCard from "./component/AnimatedCard.jsx";
import collaborationSVG from './collaboration.svg'
import quizSVG from './quiz.svg'
import collaborationImage from './collaboration-image.jpg'
import competitionImage from './competition-image.jpg'
import quizImage from './quiz-image.jpg'
import VerticalCard from "./component/VerticalCard.jsx";
import LandScapeCard from "./component/LandScapeCard.jsx";
export default function LandingPage(props){
    // const [stickNavBar,setStickNavBar] = useStore((state)=>
    //     [state.stickNavBar,state.setStickNavBar])
    const [stickNavBar,setStickNavBar] = useState(false)
    const imageRef = useRef()
    const messageRef = useRef()
    const inView = useInView(imageRef,{once:false,margin:'-100px 0px'})
    const messageInView = useInView(messageRef,{once:false,margin:'-200px 0px'})
    const [navLinkHover,setNavLinkHover] = useState(null)
    useEffect(()=>{
        window.addEventListener('scroll',()=>{
            if(window.scrollY>window.innerHeight){
                setStickNavBar(true)
            }else{
                setStickNavBar(false)

            }
        })
        return()=>{
            window.removeEventListener('scroll',()=>{
                if(window.scrollY>window.innerHeight + 50){
                    setStickNavBar(true)
                }else{
                    setStickNavBar(false)

                }
            })
        }
    },[])
    function navLinkStyling({isActive,isPending}){
        return style.navLink;
    }
    function onMouseEnterLink(index){
        setNavLinkHover(index)
    }
    function onMouseLeaveLink(){
        setNavLinkHover(null)
    }

    return(
        <>
            <header className={style.header}>
                <div className={style.backgroundImgContainer}><img src={landingPage} alt={'background'}/></div>
                <div>
                    <div className={style.openMessage}>
                        <div className={style.line}></div>
                        <div className={style.textHeaderContainer}>
                            <div>
                                <h1>Improving Coding on the WEB</h1>
                                <span>We provide the best tools for coding on the web. Advanced tools like Code Generation<br/>
                                and a Code tutor to assist you in your skills development
                                </span>
                            </div>
                            <div className={style.codeImageContainer}>
                                <img src={codeSnippet}/>
                            </div>
                        </div>
                    </div>
                </div>

            </header>
            <main className={style.main}>
                <div className={style.navBarContainer}>
                    <div className={style.scrollUpIndicator}>
                        <span>scroll up to explore to view our work</span>
                        <div className={style.indicator}><img src={downArrow}/></div>
                    </div>
                    <nav className={`${style.navBar} ${stickNavBar ? style.stick : ''}`}>
                        <div>
                            <img src={brandLogo} alt={"logo"}/>
                            <p>CODE</p>
                        </div>
                        <ul>
                            {
                                [{link: '', name: 'Practice'}, {link: '', name: 'Explore'}].map((value, index) =>
                                    <li key={index} onMouseEnter={() => {
                                        onMouseEnterLink(index)
                                    }} onMouseLeave={
                                        () => {
                                            onMouseLeaveLink()
                                        }}>
                                        <NavLink to={value.link} className={navLinkStyling}>
                                            {value.name}<ArrowUp
                                            color={navLinkHover === index ? '#646cff' : 'gainsboro'}/>
                                        </NavLink>
                                    </li>
                                )
                            }
                            <li>
                                <NavLink to={'/login'} className={style.tryNow}>Try NOW
                                    <ArrowUp color={'#646cff'}/></NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
                <section className={style.onlineIDLE}>
                    <div className={style.onlineIDLEMessage}>
                        <div className={style.onlineIDLEContainer}>
                            <div className={style.lineIDLEBG}></div>
                        </div>
                        <AnimatedText caption={'An Online Code Editor'}>
                            <span>A new way to code in your browser. Writing, runing and debuging code<br/>
                            in the browser made easier with an user interactive <br/>
                            code editor</span>
                        </AnimatedText>
                    </div>
                    <motion.div ref={imageRef}
                                className={style.codeEditor}
                                initial={{opacity: 0, y: 50, x: '-1%'}}
                                animate={{opacity: inView ? 1 : 0, y: inView ? 0 : 50, x: '-5%'}}
                                transition={{duration: 0.3}}
                                style={{opacity: inView ? 1 : 0}}
                    >
                        <img src={editor} alt={'code editor'}/>
                    </motion.div>
                </section>
                <section className={style.codeCompetition}>
                    <div className={style.codeCompetitionMessage}>
                        <AnimatedText caption={'Competitions'}>
                            <span>Using daily quizes, competitive coding practice to promote<br/>
                                    programming habit in individuals</span>
                        </AnimatedText>
                        <div className={style.competitionLineContainer}>
                            <div className={style.competitionLine}></div>
                        </div>
                    </div>
                    <div className={style.codeCompetitionOptions}>
                        <AnimateCard img={trophyImage} alt={'trophy'} message={
                            'Elevate your coding skills to new heights with our thrilling coding competition! ' +
                            'Designed for enthusiasts of all levels, from beginners to seasoned developers, ' +
                            'this competition offers a dynamic platform to showcase your programming prowess.'}
                                     animate={'left'} backgroundImage={competitionImage} caption={'Code Contest'}/>
                        <AnimateCard img={collaborationSVG} alt={'trophy'} message={
                            'Dive into our immersive code collaboration challenge and unleash your collaborative ' +
                            'potential! Whether you\'re a solo developer looking to connect with others or part of a' +
                            ' team seeking to enhance your collaboration skills, our challenge is designed to foster ' +
                            'creativity, communication, and camaraderie.'}
                                     animate={'center'} backgroundImage={collaborationImage} caption={'Collaboration'}/>
                        <AnimateCard img={quizSVG} alt={'trophy'} message={
                            'Dive into our ' +
                            'interactive programming quiz challenge and embark on a journey towards becoming ' +
                            'a programming enthusiast! Whether you\'re a beginner eager to learn the basics or ' +
                            'an experienced developer looking to test your knowledge, our quiz challenge is designed ' +
                            'to cater to all levels of expertise.'}
                                     animate={'right'} backgroundImage={quizImage} caption={'Quiz'}/>
                    </div>
                </section>
                <section className={style.aiContainer}>
                    <div className={style.aiMessageContainer}>
                        <AnimatedText caption={'Assistive Coding AI'}>
                            <span>An assistive AI tool for logical error detection, code generation<br/>
                                    and a tutor to help you in the way</span>
                        </AnimatedText>
                        <div className={style.AIContainer}>
                            <div className={style.AILine}></div>
                        </div>
                    </div>
                    <div className={style.aiOptions}>
                        <div className={style.aiOption}>
                            <VerticalCard caption={'Error Detection'}
                                          text={'Our cutting-edge machine learning system provides seamless detection' +
                                              'and resolution of logical errors and predictive inaccuracies in your' +
                                              ' Code Say goodbye to tedious error hunting and welcome effortless debugging with our AI tool'}/>
                            <VerticalCard caption={'Code Generation'} text={'Discover a game-changing solution for' +
                                ' your development endeavors with our pioneering code generation AI. Designed to' +
                                ' streamline your coding process, our AI effortlessly crafts precise and optimized code,' +
                                ' tailored to your given problem' +
                                'Embrace efficiency and unleash the full potential of your development team with our' +
                                ' intelligent code generation technology.'}/>
                        </div>
                        <div className={style.landScapeDiv}>
                            <LandScapeCard/>
                        </div>
                    </div>
                </section>
            </main>

        </>

    )
}