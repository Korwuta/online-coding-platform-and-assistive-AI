import style from "../LandingPagesStyle.module.css";
import trophyImage from "../trophy-colored.svg";

export default function AnimateCard(props) {
    return (
        <div className={`${style.competitionBox} ${props.animate==='left'?style.left:props.animate==='center'?
        style.center:props.animate?style.right:''}`}>
            <div className={style.competitionImageContainer}>
                <img src={props.img} alt={props.alt}/>
            </div>
            <div className={style.competitionText}>
                <p>
                    {props.message}
                </p>
            </div>
        </div>
    )
}