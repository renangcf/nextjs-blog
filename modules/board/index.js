import React, { useEffect } from "react";
import styles from './styles.module.css';

export default function Board() {
    var height = 6; //numero de tentativas
    var width = 5; //tamanho das palavras
    var tileId = "";
    var tileRow = "";

    var spans = [];
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            tileId = r.toString() + "-" + c.toString();
            tileRow = "row-" + tileId;
            
            spans.push(<span id={tileId} className={styles.tile}></span>);         
        }
    }

    return (
        <div id={styles.board}>{spans}</div>
    )
}
