import style from "../LandingPagesStyle.module.css";
import {motion, useInView} from "framer-motion";
import {useRef} from "react";

export default function AnimatedText(props){
    const ref = useRef()
    const inView = useInView(ref,{once:false,margin:'-200px 0px'})
    return (
        <motion.div className={style.IDLEMessage} ref={ref}
                    initial={{opacity: 0, y: 50}}
                    animate={{opacity: inView ? 1 : 0, y: inView ? 0 : 50}}
                    transition={{duration: 0.3}}
                    style={{opacity: inView ? 1 : 0}}
        >
            <div>
                <h2>{props.caption}</h2>
                {props.children}
            </div>
        </motion.div>
    )
}