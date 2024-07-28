import CircularImage from "../CircularImage.jsx";

export default function ({displayName}) {
    return(
        <div style={{
            display:"flex",
            flexDirection:"column",
            gap:"10px",
            placeItems:"center"
        }}>
            <CircularImage src={`http://localhost:3000/profile/${displayName}`} alt={'profile'} size={55}/>
            <span style={{fontSize:"0.8rem"}}>{displayName}</span>
        </div>
    )
}