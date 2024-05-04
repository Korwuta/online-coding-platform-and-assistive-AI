import {Link} from "react-router-dom";
import style from './login-link.module.css'
export default function LoginLink(props){
    return(
        <Link to={props.path} className={style.link}>
            <img src={props.image} alt={''}/>
            {props.name}
        </Link>
    )
}