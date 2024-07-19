import styles from './options-dialog.module.css'
import {Link} from "react-router-dom";
export default function OptionsDialog({options,close}){
    return(
        <div className={styles.optionsDialogSection}>
            <div className={styles.dialog}>
                <div className={styles.caption}><p>Select Programming Language</p></div>
                <div className={styles.content}>
                    <ul className={styles.options}>
                        {
                            options.map((value,key)=> (
                                <li key={key}><Link to={value.link} style={{color: "gainsboro"}}>{value.name}</Link></li>))
                        }
                    </ul>
                    <div className={styles.action}>
                        <button onClick={()=>{close(null)}}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}