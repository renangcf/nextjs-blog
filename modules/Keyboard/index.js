import React, { useState } from "react";
import styles from './styles.module.css';
import KeyboardRow from "../KeyboardRow";

export default function Keyboard() {
    const [row1, setRow1] = useState(["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]);
    const [row2, setRow2] = useState(["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ç"]);
    const [row3, setRow3] = useState(["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫"]);

    return (
        <div>
            <KeyboardRow chaves={row1}/>
            <KeyboardRow chaves={row2}/>
            <KeyboardRow chaves={row3}/>
        </div>
    )
}
