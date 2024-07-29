import CircularImage from "../CircularImage.jsx";
import {useEffect, useState} from "react";

export default function ({id}) {
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
        displayName&&<div key={id} style={{
            display:"flex",
            flexDirection:"column",
            gap:"10px",
            placeItems:"center"
        }}>
            <CircularImage src={`http://localhost:3000/profile/${displayName}`} alt={'profile'} size={55}/>
            <span style={{fontSize:"0.8rem"}}>{displayName}</span>
            <button style={{
                fontSize:'0.8rem',
                backgroundColor:'forestgreen'
            }}>Accept</button>
        </div>
    )
}