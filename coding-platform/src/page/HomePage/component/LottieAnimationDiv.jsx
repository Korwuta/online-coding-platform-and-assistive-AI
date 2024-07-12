import lottie from "./animation/Animation.json";
import LottieAnimation from "./LottieAnimation.jsx";
import bulbSVG from "./bulb.svg"

export default function LottieAnimationDiv(){
    return(
        <div style={{
            position:"absolute",
            top:'50%',
            transform:'translateY(-70%)',
            display:"flex",
            flexDirection:"column",
            gap:'40px',
            fontSize:'0.9rem'
        }}>
            <LottieAnimation lotti={lottie} height={200} width={200}/>
            <div style={{display:'flex',placeContent:'space-between',gap:'40px'}}>
                <div style={{
                    display:"flex",
                    placeItems:"center",
                    padding:'20px 10px',
                    border:"1px solid gray",
                    borderRadius:"10px",
                    gap:"10px",
                    backgroundColor:'#1E1E1E'
                }}>
                   <img src={bulbSVG||''} style={{height:'25px',width:'25px'}} alt={''}/>
                    Generate your solution code
                </div>
                <div
                    style={{
                        display:"flex",
                        placeItems:"center",
                        padding:'20px 10px',
                        border:"1px solid gray",
                        borderRadius:"10px",
                        gap:"10px",
                        backgroundColor:'#1E1E1E'
                    }}
                >
                    <img src={bulbSVG || ''} style={{height: '25px', width: '25px'}} alt={''}/>
                    Let our AI help you fix your code
                </div>
            </div>
        </div>
    )
}