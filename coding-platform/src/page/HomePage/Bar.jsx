import styles from './dashboard.module.css'
export default function({size,color}){
    return(
        <div style={{
            width:'100%',
            display:"flex",
            height:'20px',
            borderRadius:'30px',
            backgroundColor:'#1E1F22',
            contain:"paint"
        }}>
            <div className={styles.bar} style={{
                width:`${size}%`,
                height:'20px',
                borderRadius:'30px',
                backgroundColor:color
            }}></div>
        </div>
    )
}