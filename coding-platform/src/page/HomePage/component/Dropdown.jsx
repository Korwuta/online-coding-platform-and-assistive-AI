import downDrop from './down-arrow.svg'
import style from './dropdown.module.css'
import {useEffect, useRef, useState} from "react";

export default function Dropdown({items,value}){
    const [showOption, setShowOption] = useState(false)
    const [height, setHeight] = useState(0)
    const ulRef = useRef()
    const [selectedItem, setSelectedItem] = useState(items[0])
    const [filteredItems, setFilteredItems] = useState(items.filter((item)=>{
        return item !== selectedItem
    }))
    useEffect(() => {
        setFilteredItems(items.filter((item)=>{
           return item !== selectedItem
        }))
    }, [selectedItem]);
    useEffect(() => {
        setHeight(ulRef.current.scrollHeight)
    }, []);
    function onHover(){
        setShowOption(true)
    }
    function onLeave(){
        setShowOption(false)
    }
    return(
        <div className={style.dropDownContainer} onMouseLeave={onLeave}>
            <div style={{
                width:'200px',
                outline:`${showOption?'1px solid #535bf2':''}`,
            }} onMouseEnter={onHover}>
                <span>{selectedItem}</span>
                <img src={downDrop} alt={'down drop'}/>
            </div>
            <ul style={{
                width:'200px',

                height:`${showOption?height:0}px`,
                border:`${showOption?'1px solid white':'none'}`}} ref={ulRef} >
                {
                    filteredItems.map((item,key)=>{
                        return <><li onClick={()=>{
                            setSelectedItem(item)
                            value(item)
                            setShowOption(false)
                        }}>{item}</li></>
                    })
                }
            </ul>
        </div>
    )
}