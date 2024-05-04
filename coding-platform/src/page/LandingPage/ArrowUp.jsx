export default function ArrowUp(props){
    return(
        <>
            <svg width='30px' height='30px' viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17L17 7M17 7H8M17 7V16" stroke={props.color} strokeWidth="1.5" strokeLinecap={"round"} strokeLinejoin={"round"}/>
            </svg>
        </>
    )
}