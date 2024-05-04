import errorImage from './error-detection.png'
import style from '../LandingPagesStyle.module.css'
export default function VerticalCard(props){
    return(
        <div className={style.errorDetection}>
            <div className={style.errorText}>
                <p><span style={{fontWeight:"bold",color:"white",fontSize:'x-large'}}>{props.caption}:&nbsp;&nbsp;</span>{props.text}</p>
            </div>
            <div className={style.errorImageContainer}>
                <div><img src={errorImage} alt={'error'}/></div>
            </div>
        </div>
    )
}