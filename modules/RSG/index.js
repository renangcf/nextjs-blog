import React from "react";
import styles from './styles.module.css';

export default function ReadySetGo(props) {
    return (
        <h2> <span className="readySetGoText">{props.readySetGoText}</span> </h2>
    )
}

