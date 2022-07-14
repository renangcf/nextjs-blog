import React from "react";
import styles from './styles.module.css';

export default function Points(props) {
    return (
        <h2 id={styles.pointsH2}>Pontos: <span id={styles.points} className="points">{props.points}</span></h2>
    )
}

