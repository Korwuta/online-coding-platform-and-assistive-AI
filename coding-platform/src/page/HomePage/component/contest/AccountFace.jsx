import CircularImage from "../CircularImage.jsx";
import {useEffect, useState} from "react";

export default function ({id,accepted,showAccept,size}) {
    const [userFrom, setUserFrom] = useState(null)
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
                setUserFrom(data)
            })
            .catch((error) => {
                console.log(error)
            });
    }, []);
    return(
        userFrom&&<div key={id} style={{
            display:"flex",
            flexDirection:"column",
            gap:"10px",
            placeItems:"center"
        }}>
            <CircularImage src={userFrom?.['profile_image']} alt={'profile'} size={size?size:55}/>
            {
                !size&&<>
                    <span style={{fontSize:"0.8rem"}}>{userFrom?.['display_name']}</span>
                    {showAccept && <button style={{
                        fontSize: '0.8rem',
                        backgroundColor: 'forestgreen'
                    }} onClick={() => {
                        accepted(id)
                    }}
                    >Accept</button>}
                </>
            }
        </div>
    )
}