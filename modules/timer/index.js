import React from "react";
import styles from './styles.module.css';

export default function Timer(props) {
    return (
        <span id={styles.timer} className='timer'>{props.time}</span>
    )
}

