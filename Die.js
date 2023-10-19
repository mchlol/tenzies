import React from "react"
import Dot from './Dot'

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }

    function renderDots(value) {
        console.log(value, " dots");
        let arr = [];
        for (let i = 0; i < value; i++) {
            arr.push(<Dot />)
        }
        return arr;
    }

    return (
        <div 
            className="die-face" 
            style={styles}
            onClick={props.holdDice}
        >
            {renderDots(props.value)}
        </div>
    )
}