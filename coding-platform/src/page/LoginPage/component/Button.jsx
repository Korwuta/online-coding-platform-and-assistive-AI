import style from './button.module.css'
export default function Button(props){
    return(
        <button className={style.button}
            style={{
            width:`${props.width}px`,
            backgroundColor:props.color,
        }}>{props.name}</button>
    )
}