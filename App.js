import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false);
    const [rolls, setRolls] = React.useState(0);
    const [time, setTime] = React.useState(0);
    const [running, setRunning] = React.useState(true);
    const [fastestTime, setFastestTime] = React.useState(localStorage.getItem('storedFastestTime') || null);

    React.useEffect( () => {
        if (tenzies) {
            if (fastestTime === null) {
                setFastestTime(time);
                localStorage.setItem('storedFastestTime',time);
            } else {
                if (time < fastestTime) {
                    setFastestTime(time);
                    localStorage.setItem('storedFastestTime',time);
                } 
            }
        } 
    }, [tenzies]);


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
            setRolls(0);
            setDice(allNewDice())
            setTime(0);
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
            {fastestTime ? <p>Fastest time: {fastestTime} seconds</p> : <p>No fastest time set</p>}

            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}