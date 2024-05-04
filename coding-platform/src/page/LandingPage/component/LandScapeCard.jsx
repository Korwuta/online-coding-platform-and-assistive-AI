import codeTutor from './coding-tutor.svg'
import style from '../LandingPagesStyle.module.css'
export default function LandScapeCard(){
    return(
        <div className={style.landScapeCardContainer}>
            <div className={style.tutorImage}>
                <div>
                    <img src={codeTutor} alt={'code tutor'}/>
                </div>
                <div className={style.tutorText}>
                    <p>A Code Tutor that assist you in your programming journey.
                        Step into the world of programming mastery with our top-tier tutoring service.
                        Our skilled tutors are dedicated to nurturing your coding skills, offering personalized
                        guidance tailored to your individual learning needs. Just as a trusted mentor guides you
                        through challenges, our tutors provide expert assistance, helping you overcome obstacles
                        and grasp complex programming concepts with ease. Whether you're a beginner or an experienced
                        coder, our tutors empower you to unlock your full potential and achieve your goals in the
                        exciting
                        world of programming.</p>
                </div>
            </div>
            <div className={style.tutorCaption}>
                <p>Programming Tutor</p>
            </div>
        </div>
    )
}