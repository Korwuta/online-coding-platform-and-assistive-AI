import CircularImage from "../CircularImage.jsx";
import {useEffect, useState} from "react";

export default function({id,minute,second,name}){
    const [displayName,setDisplayName] = useState(null)
    useEffect(() => {
        fetch(`http://localhost:3000/user/${id}`,{
            method:'GET',
            credentials:'include',
        }).then((response) => {
            if(!response.ok){
                return response.json().then((data)=>{
                    throw new Error(data.error)
                })
            }
            return response.json();
        })
            .then((data) => {
                console.log(data)
                setDisplayName(data['display_name'])
            })
            .catch((error) => {
                console.log(error)
            });
    }, []);
    return(
        <>
            <div style={{
                display: "flex",
                placeItems: "center",
                gap: "10px",
                fontSize:"1rem"
            }}>
                <CircularImage src={`http://localhost:3000/profile/${displayName}`} alt={'profile'}
                               size={35}/>
                <span>{name||displayName}</span>
            </div>
            <p>{minute ? minute.toString().padStart(2, '0') : '00'}:{second ? second.toString().padStart(2, '0') : '00'}</p></>
    )
}