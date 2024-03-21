import style from "../LandingPagesStyle.module.css";
import trophyImage from "../trophy-colored.svg";
import competitionImage from '../collaboration-image.jpg'

export default function AnimateCard(props) {
    return (
        <div className={`${style.competitionBox} ${props.animate==='left'?style.left:props.animate==='center'?
        style.center:props.animate?style.right:''}`} >
            <div className={style.competitionImageContainer} style={{backgroundImage:`url(${props.backgroundImage})`}}>
                <img src={props.img} alt={props.alt}/>
            </div>
            <div className={style.competitionText}>
                <span>{props.caption}</span>
                <p>
                    {props.message}
                </p>
            </div>
        </div>
    )
}