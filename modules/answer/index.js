import React from "react";
import styles from './styles.module.css';

export default function Answer(props) {
    return (
        <h1 id="answer"><span className = 'answer'>{props.answer}</span></h1>
    )
}

