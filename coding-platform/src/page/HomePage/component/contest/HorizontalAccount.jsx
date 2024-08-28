import CircularImage from "../CircularImage.jsx";
import {useEffect, useState} from "react";
import {useUser} from "../../../../statemanagement.jsx";

export default function({id,name}){
    const mainUser = useUser(state => state?.user)
    const [user,setUser] = useState(null)
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
                setUser(data)
            })
            .catch((error) => {
                console.log(error)
            });
    }, []);
    return(
        <div style={{
            display: "flex",
            placeItems: "center",
            gap: "10px",
            fontSize: "1rem"
        }}>
            <CircularImage src={user?.['profile_image']} alt={'profile'}
                           size={35}/>
            <span>{id===mainUser?.id?'You':user?.['display_name']}</span>
        </div>
    )
}