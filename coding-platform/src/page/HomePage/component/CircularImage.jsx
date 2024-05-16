export default function CircularImage({src,alt,size}){
    return(
        <div style={{
            contain:'paint',
            borderRadius:'50%',
            width:'fit-content',
            border:'1px solid gray'
        }}>
            <img src={src} alt={alt} style={{
                width:`${size}px`,
                height:`${size}px`,
                display:'block',
                textAlign:'center'
            }}/>
        </div>
    )
}