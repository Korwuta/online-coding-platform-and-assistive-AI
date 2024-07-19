import styles from './reader.module.css'
import Highlight from "react-highlight";
export default function Reader({topic,passage}){
    return(
        <div className={styles.reader}>
            <h2>{topic}</h2>
            <div className={styles.passage}>
                <p>
                    {passage.split(/(<pre><code>[\s\S]*?<\/code><\/pre>)/g).map((part, index) => {
                        if (part.startsWith('<pre><code')) {
                            return (
                                <Highlight key={index} innerHTML={true}>
                                    {part}
                                </Highlight>
                            );
                        }
                        return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
                    })}
                </p>
            </div>
        </div>
    )
}