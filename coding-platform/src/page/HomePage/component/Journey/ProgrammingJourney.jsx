import styles from './programming-journey.module.css'
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Reader from "./Reader.jsx";
export default function ProgrammingJourney(){
    const [topics, setTopics] = useState([])
    const {language} = useParams()
    const [selectedKey, setSelectedKey] = useState(0)
    const [reader, setReader] = useState(null)
    useEffect(() => {
        fetch(`http://localhost:3000/services/topic/${language}`,{
            method:'GET',
            credentials:'include'
        }).then((response) => {
            if(!response.ok){
                return response.json().then((data)=>{
                    throw new Error(data.error)
                })
            }
            return response.json();
        })
            .then((data) => {
                setTopics(data.output)
            })
            .catch((error) => {
                console.log(error)
            });
    }, [language]);
    useEffect(() => {
        fetch(`http://localhost:3000/services/tutorial/${language}/${selectedKey}`,{
            method:'GET',
            credentials:'include'
        }).then((response) => {
            if(!response.ok){
                return response.json().then((data)=>{
                    throw new Error(data.error)
                })
            }
            return response.json();
        })
            .then((data) => {
                setReader(data.output)
            })
            .catch((error) => {
                console.log(error)
            });
    }, [selectedKey]);
    return(
        <section className={styles.programmingJourney}>
            <div className={styles.content}>
                {
                    reader&&<Reader topic={reader.topic} passage={reader.passage}/>
                }
            </div>
            <div className={styles.sideOptions}>
                <div><p>Topics</p></div>
                <div>
                    <ul>
                        {
                            topics.map((value)=>(<li onClick={()=>{setSelectedKey(value.index)}} key={value.index} >{value.name}</li>))
                        }
                    </ul>
                </div>
            </div>
        </section>
    )
}
