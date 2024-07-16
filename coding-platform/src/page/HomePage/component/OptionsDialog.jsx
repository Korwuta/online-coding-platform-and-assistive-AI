import styles from './options-dialog.module.css'
import {Link} from "react-router-dom";
export default function OptionsDialog({options,close}){
    return(
        <div className={styles.optionsDialogSection}>
            <div className={styles.dialog}>
                <div className={styles.caption}><p>Select Programming Language</p></div>
                <div className={styles.content}>
                    <ul className={styles.options}>
                        <li><Link to={'/home/test/journey/java'} style={{color:"gainsboro"}}>Java</Link></li>
                        <li><Link to={'/home/test/journey/python'} style={{color:"gainsboro"}}>Python</Link></li>
                        <li><Link to={'/home/test/journey/javascript'} style={{color:"gainsboro"}}>Javascript</Link></li>
                    </ul>
                    <div className={styles.action}>
                        <button onClick={()=>{close(null)}}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}