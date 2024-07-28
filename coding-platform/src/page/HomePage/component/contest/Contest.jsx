import styles from './contest.module.css'
import gameSVG from './Online.svg'
import {useState} from "react";
import {useParams} from "react-router-dom";
import {useUser} from "../../../../statemanagement.jsx";
export default function(){
    const {language} = useParams()
    const user = useUser(state => state.user)
    const [inviteLink,setInviteLink] = useState(undefined)
    function getInviteLink(){
        fetch(`http://localhost:3000/services/create-link`,{
            method:'POST',
            credentials:'include',
            headers:{
                "Content-Type":"application/json",
                "Cookies":"cookies.txt"
            },
            body:JSON.stringify({creatorId:user.id})
        }).then((response) => {
            if(!response.ok){
                return response.json().then((data)=>{
                    throw new Error(data.error)
                })
            }
            return response.json();
        })
            .then((data) => {
                setInviteLink(`http://localhost:5173/home/test/contest/${language}/invite/${data.accessToken}`)
            })
            .catch((error) => {
                console.log(error)
            });
    }
    function copyToClipboard(){
        navigator.clipboard.writeText(inviteLink||'').then(

        ).catch()
    }
    return(
        <div className={styles.inviteContainer}>
            <div className={styles.greetings}>
                <div >
                    <h2>Invite Friends to a Competition</h2>
                    <p>connect, play and share ideas with friends from anywhere</p>
                    <button onClick={getInviteLink}>Create Invite Link</button>
                    <div>
                        <span>copy invite link and send to friend</span>
                        <div className={styles.inviteLink}>
                            <input placeholder={'http://..../java/invite/eyJhbGciO......'} disabled={true} value={inviteLink}/>
                            <svg fill="gainsboro" width="25px" height="25px" viewBox="0 0 24 24" onClick={copyToClipboard}>
                                <path
                                    d="M20,6V17a1,1,0,0,1-1,1H9a1,1,0,0,1-1-1V3A1,1,0,0,1,9,2h7a1.05,1.05,0,0,1,.71.29l3,3A1,1,0,0,1,20,6ZM17,21a1,1,0,0,0-1-1H6V6A1,1,0,0,0,4,6V20a2,2,0,0,0,2,2H16A1,1,0,0,0,17,21Z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.illustration}>
                <img src={gameSVG} alt={'working'}/>
            </div>
        </div>
    )
}