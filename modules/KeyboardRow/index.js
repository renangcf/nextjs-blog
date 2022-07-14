import React, { useEffect } from "react";
import styles from './styles.module.css';

export default function KeyboardRow(props) {

    var chaves = props.chaves.map(createRow);
    
    function createRow(entry){
        if(entry == "Enter"){
            return <div id={"Key" + entry} className={styles.enterKeyTile}>{entry}</div>
        }else if(entry == "⌫"){
            return <div id={"Backspace"} className={styles.keyTile}>{entry}</div>
        }else{
            return <div id={"Key" + entry} className={styles.keyTile}>{entry}</div>
        }
    }
    
    return (
        <div className={styles.keyboardRow}>
            {chaves}
        </div>
    )
}
