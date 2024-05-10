import style from './loading-bar.module.css'
export default function LoadingBar(){
    return (
        <div className={style.div}>
            <div className={style.cube}>
                <div className={style.side}></div>
                <div className={style.side}></div>
                <div className={style.side}></div>
                <div className={style.side}></div>
                <div className={style.side}></div>
                <div className={style.side}></div>
            </div>
        </div>
    )
}