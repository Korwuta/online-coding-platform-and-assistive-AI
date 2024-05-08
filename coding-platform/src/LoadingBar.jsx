import style from './loading-bar.module.css'
export default function LoadingBar(){
    return (
        <div className={style.spinner}>
            <div className={`${style.ball} ${style['ball-1']}`}/>
            <div className={`${style.ball} ${style['ball-2']}`}/>
            <div className={`${style.ball} ${style['ball-3']}`}/>
            <div className={`${style.ball} ${style['ball-4']}`}/>
            <div className={`${style.ball} ${style['ball-5']}`}/>
            <div className={`${style.ball} ${style['ball-6']}`}/>
            <div className={`${style.ball} ${style['ball-7']}`}/>
            <div className={`${style.ball} ${style['ball-8']}`}/>
        </div>
    )
}