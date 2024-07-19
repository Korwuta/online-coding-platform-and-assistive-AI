import styles from './question-card.module.css'
import {useEffect, useState} from "react";
import Highlight from "react-highlight";
export default function({value,number,answer}){
    const [selectedValue, setSelectedValue] = useState(null)
    function handleChange(e){
        setSelectedValue((prevState)=>{
            console.log(prevState)
            if(prevState===e.target.value){
                return null
            }
            return e.target.value
        })
    }

    return(
        <div className={styles.questionCard} key={value['question_id']}>
            <p>
                {value['question'].split(/(<pre><code>[\s\S]*?<\/code><\/pre>)/g).map((part, index) => {
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
            <div className={styles.alternative}>
                <label style={{
                    backgroundColor: selectedValue === value['option_a'] ? '#1DAA61' : '#3B3B3B'
                }}>
                    <input checked={selectedValue === value['option_a']}
                           type={"radio"} name={number} value={value['option_a']} onClick={handleChange}/>
                    {value['option_a']}
                </label>
                <label style={{
                    backgroundColor: selectedValue === value['option_b'] ? '#1DAA61':'#3B3B3B'
                    }}>
                    <input checked={selectedValue === value['option_b']}
                        type={"radio"} name={number} value={value['option_b']} onClick={handleChange}/>
                    {value['option_b']}
                </label>
                <label style={{
                    backgroundColor: selectedValue === value['option_c'] ? '#1DAA61':'#3B3B3B'
                }}>
                    <input checked={selectedValue === value['option_c']}
                        type={"radio"} name={number} value={value['option_c']} onClick={handleChange}/>
                    {value['option_c']}
                </label>
                <label style={{
                    backgroundColor: selectedValue === value['option_d'] ? '#1DAA61':'#3B3B3B'
                }}>
                    <input checked={selectedValue === value['option_d']}
                        type={"radio"} name={number} value={value['option_d']} onClick={handleChange}/>
                    {value['option_d']}
                </label>
            </div>
        </div>
    )
}