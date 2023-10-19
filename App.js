import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false);
    const [rolls, setRolls] = React.useState(1);
    const [time, setTime] = React.useState(0);
    const [running, setRunning] = React.useState(true);
    const [fastestTime, setFastestTime] = React.useState(0);
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setRunning(false);
        } else {
            setRunning(true);
        }
    }, [dice])

    React.useEffect( () => {

        let intervalId = null;
        if (running) {
            intervalId = setInterval( () => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(intervalId);
        }
        return () => clearInterval(intervalId);

    },[running, time]);

    React.useEffect( () => {
        // when running is false
        // check the time against the prevFastestTime
        // if it's higher, setFastestTime
        if (!running) {
            time < fastestTime && setFastestTime(time) 
        }

    }, [running, time]);

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        setRolls(rolls + 1);
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setRolls(1);
            setDice(allNewDice())
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                { ...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            
            {tenzies ? <p>You won in {rolls} rolls!</p> : <p>Rolls: {rolls}</p>}
            {tenzies ? <p>Your time: {time} seconds</p> : <p>Time: {time} seconds</p>}
            {<p>Fastest time: {fastestTime}</p>}
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}