import React from "react"
import Dot from './Dot'
import { nanoid } from "nanoid";

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }

    const [dieFaces, setDieFaces] = React.useState(props.value);

    React.useEffect( () => {

        let arr = [];
        for (let i = 0; i < props.value; i++) {
            arr.push(<Dot key={nanoid()}/>)
        }
        return setDieFaces(arr);
        
    }, [])


    return (
        <div 
            className="die-face" 
            style={styles}
            onClick={props.holdDice}
        >
            {dieFaces}
        </div>
    )
}