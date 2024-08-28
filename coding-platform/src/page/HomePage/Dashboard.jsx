import styles from './dashboard.module.css'
import CircularImage from "./component/CircularImage.jsx";
import {useQuestionStorage, useUser} from "../../statemanagement.jsx";
import Chart from "react-apexcharts";
import Bar from "./Bar.jsx";
import {useEffect, useRef, useState} from "react";
import LoadingBar from "../../LoadingBar.jsx";
export default function(){
    const [user,setUser] = useUser(state=>([state?.user,state?.setUser]))
    const [score,setScore] = useQuestionStorage(state => [state.score?.[user?.id],state.setScore])
    const [total,setTotal] = useQuestionStorage(state => [state.total?.[user?.id],state.setTotal])
    const [editProfile,setEditProfile] = useState(false)
    const [loading, setLoading] = useState(false)
    const nameEL = useRef()
    const inputImage = useRef()
    const [tempProfileImage, setTempProfileImage] = useState(null)
    useEffect(() => {
        fetch(`http://localhost:3000/services/get-score/${user?.id}`,{
            method: 'GET',
            credentials:"include",
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
                setScore(data.output.score,user.id)
                setTotal(parseInt(data.output.total),user.id)
            })
            .catch((error) => {
                console.log(error)
            });
    }, []);
    function enableEdit(){
        setEditProfile(true)
        nameEL.current?.focus()
    }
    function updateProfile(){
        sendProfile(nameEL.current?.innerText,inputImage.current?.files[0])
        setEditProfile(false)
    }
    function sendProfile(displayName,profileImage){
        setLoading(true)
        const data = new FormData();
        data.append('displayName',displayName)
        data.append('id',user.id)
        profileImage&&data.append('image',profileImage)
        fetch(`http://localhost:3000/user/update-profile`,{
            method: 'POST',
            body: data,
            credentials:"include",
        }).then((response) => {
            if(!response.ok){
                return response.json().then((data)=>{
                    throw new Error(data.error)
                })
            }
            return response.json();
        })
            .then((data) => {
                if(data.success){
                    setUser(data.user)
                }
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
                console.log(error)
            });
    }
    return(
        <div className={styles.dashboard}>
            <div className={styles.profileSection}>
                <div className={styles.profileImageDiv}>
                   <div style={{
                       position:'relative',
                   }}>
                       <CircularImage src={tempProfileImage||user?.profileImage} alt={'profile'} size={150}/>
                       {editProfile&&<div className={styles.profileImageEdit} onClick={()=>{
                           inputImage.current?.click()
                       }}>
                           <svg width="35px" height="35px" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                               <path fillRule={"evenodd"} clipRule={"evenodd"}
                                     d="M3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 7.28595 22 4.92893 20.5355 3.46447C19.0711 2 16.714 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447ZM7.25 12C7.25 9.37665 9.37665 7.25 12 7.25C14.6234 7.25 16.75 9.37665 16.75 12C16.75 14.6234 14.6234 16.75 12 16.75C9.37665 16.75 7.25 14.6234 7.25 12ZM8.75 12C8.75 10.2051 10.2051 8.75 12 8.75C13.7949 8.75 15.25 10.2051 15.25 12C15.25 13.7949 13.7949 15.25 12 15.25C10.2051 15.25 8.75 13.7949 8.75 12Z"
                                     fill="gainsboro"/>
                           </svg>
                           <input type={"file"} accept={"image/*"} style={{display:"none"}} ref={inputImage}
                           onInput={(e)=>{
                               console.log(user?.displayName)
                               const reader = new FileReader()
                               reader.onload = ()=>{
                                   setTempProfileImage(reader.result)
                               }
                               reader.readAsDataURL(e.target?.files[0])
                           }}/>
                       </div>}
                   </div>
                </div>
                <form onSubmit={(e)=>{
                    e.preventDefault()
                }}>
                    <p contentEditable={editProfile} ref={nameEL}>{
                        user?.displayName?.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                    }</p>
                    <div>
                        <label>Email:&nbsp;</label>
                        <span>{user?.email}</span>
                    </div>
                    <div>
                        <label>Location:&nbsp;</label>
                        <span>Ghana</span>
                    </div>
                    <div>
                        <label>Last login:&nbsp;</label>
                        <span>{
                            new Date(Date.now()).toDateString()
                        }</span>
                    </div>
                    {editProfile?<button onClick={updateProfile} style={{
                        position: 'absolute',
                        bottom: '30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '80%',
                        fontSize: '1rem',
                        backgroundColor: '#0078D4'
                    }} >Change</button>:<button style={{
                        position: 'absolute',
                        bottom: '30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '80%',
                        fontSize: '1rem',
                        backgroundColor: '#0078D4'
                    }} onClick={enableEdit}>Edit Profile</button>}
                </form>
            </div>
            <div className={styles.activity}>
                <div className={styles.strength}>
                    <Chart options={{
                        plotOptions: {
                            radialBar: {
                                hollow: {
                                    size: '30%',
                                },
                                startAngle: 0,
                                dataLabels: {
                                    name: {
                                        show: false,
                                    },
                                    value: {
                                        show: false,
                                    },
                                },
                                track: {
                                    show: true,
                                    background: '#1E1F22',
                                    strokeWidth: '90%',
                                    margin: 9, // margin between tracks
                                },
                                stroke: {
                                    lineCap: 'round',  // This rounds the ends of the bars
                                },
                            }
                        },
                        colors: ['#FF4560', '#FEB019'], // Colors for each series
                        labels: ['Q-A Score', 'Duos'],  // Labels for each series
                        tooltip: {
                            enabled: true,
                            y: {
                                formatter: function (val) {
                                    return val + "%";  // Customize the format as needed
                                }
                            }
                        },
                        responsive: [{
                            breakpoint: 480,
                            options: {
                                legend: {
                                    show: false
                                }
                            }
                        }]
                    }} series={[score/total*100, 0.8]} type="radialBar" height={400}>
                    </Chart>
                    <div className={styles.detail}>
                        <label style={{
                            display: 'flex',
                            gap: '20px',
                            fontSize: '0.9rem',
                            placeItems: 'center'
                        }}><span>QA Score</span><Bar size={score/total*100} color={'#FF4560'}/><span>{score||0}/{total||0}</span></label>
                        <label style={{
                            display: 'flex',
                            gap: '20px',
                            fontSize: '0.9rem',
                            placeItems: 'center'
                        }}><span>GameHub Score</span><Bar size={100} color={'#FEB019'}/><span>40/50</span></label>
                        <label></label>
                    </div>
                </div>
            </div>
            {loading&&<LoadingBar/>}
        </div>
    )
}