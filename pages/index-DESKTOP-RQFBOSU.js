import React, { useEffect, useState, useRef } from "react";
import Title from "../modules/title";
import Points from "../modules/points";
import Board from "../modules/board";
import Keyboard from "../modules/Keyboard";
import Timer from "../modules/timer";
import Answer from "../modules/answer";
import WordList from "./wordList";
import ReadySetGo from "../modules/RSG";
import $ from 'jquery';

export default function Home() {
  const wordList = WordList();

  wordList.forEach(function(word, index, theArray){
    theArray[index] = word.toLowerCase();
  });
  
  const height = 6; //numero de tentativas
  const width = 5; //tamanho das palavras

  var initialTime = 10;
  var extraTimeOnCorrectWord = 30; //extra time on correct word!

  var gameTimer; //variavel para timer global de jogo;

  const [points, setPoints] = useState(0);
  const [time, setTime] = useState(initialTime); //quantidade de segundos que o jogador possui inicialmente
  const [readySetGoText, setReadySetGoText] = useState("Ready....");
  const [answer, setAnswer] = useState("");
  const [currTile, setCurrTile] = useState("#0-0");
  const [keyTile, setKeyTile] = useState("");
  const [rsgCheck, setrRsgCheck] = useState(true);
  const [tile, setTile] = useState("");
  const [word, setWord] = useState(wordList[Math.floor(Math.random() * wordList.length)].toUpperCase());
  const [gameOver, setGameOver] = useState(true);
  const [col, setCol] = useState(0);
  const [row, setRow] = useState(0);

  var callProcessInput = function (event){
    processInput(event);
  }

  function inicializar(firstTime) {
    //setRow(0);
    //setCol(0);
    
    //console.log(word);

    if(firstTime){        
      // JS pegando o input do teclado
      useEffect(() => {
        if (typeof window !== "undefined") {

          window.addEventListener("keyup", callProcessInput);

          return () => window.removeEventListener("keyup", callProcessInput);
        }
      });
    }
  }
  
  inicializar(true);
    
  function processKey() {
      e = { "code": this.id };
      processInput(e);
  }

  function processInput(e) {
      console.log("apertei tecla");
      console.log("row: " + row);
      console.log("col: " + col);
      console.log("gameover: " + gameOver);

      if (gameOver) return;

      // alert(e.code);
      if ("KeyA" <= e.code && e.code <= "KeyZ") {
        if (col < width) {
          //setCurrTile('#'+ row.toString() + '-' + col.toString());
          console.log("currTile:" + currTile);

          if($(currTile).text() == "") {
              $(currTile).text(e.code[3]);
              var newCol = col + 1;
              setCol(newCol);
              console.log("atualizei col para: " + newCol);

              setCurrTile('#'+ row.toString() + '-' + newCol.toString());
              console.log("atualizei currTile para: " + currTile);
            }
          }
      }
      else if (e.code == "Backspace") {
          if (0 < col && col <= width) {
              setCol(col-1);
              console.log(col);
          }
          setCurrTile(row.toString() + '-' + col.toString());
          $(currTile).text("") ;
      }

      else if (e.code == "Enter") {
          var guess = getGuess();

          if(col == width && wordList.includes(guess)){
              update();
          }else{
              //shake(row.toString());
          }
      }

      if (!gameOver && row == height) {
        triggerGameOver(false);
      }
  }

  function triggerGameOver(guessedCorrectWord){
      setGameOver(true);

      if(guessedCorrectWord){
        $("#answer").css("color", "green");
        setPoints(points + (10 * (6 - row)));
      }else{
        $("#answer").css("color", "red");
      }

      $("#answer").text("testWord");
      clearInterval(gameTimer);

      setRow(0);
      setCol(0);

      setTimeout(function () {
          
        inicializar(false);
        $(".timer").text('');
        $("#answer").text('');

        $(".readySetGo").text("Ready....");
        $(".timer").css("color", "black");

        if(guessedCorrectWord){
            setTime(time+extraTimeOnCorrectWord);
        }else{
            setTime(initialTime);
            setPoints(0);
        }
        readySetGo();

      }, 3000);    
  }

  function TimeCountdown() {

    useEffect(() =>{
      gameTimer = setInterval(() => {
        if(rsgCheck){
          readySetGo();
        }else{
          if (time <= 0) {
            $(".timer").css('color', 'red');
            triggerGameOver(false);
          }else{
            setTime(time-1);
          }
        }
      }, 1000);

      return () => clearInterval(gameTimer);
    }, [time,readySetGoText]);
    
  }
  
  function readySetGo(){
    if(readySetGoText == "Ready...."){
      setReadySetGoText("Set....");
      
    }else if(readySetGoText == "Set...."){
      setReadySetGoText("Go!");
      $(".readySetGoText").css('color' ,"green");
      
    }else{
      setReadySetGoText("");
      $(".readySetGoText").css('color' ,"black");
      setGameOver(false); //deixa o jogador digitar!
      setrRsgCheck(false);      
    }
  }

  TimeCountdown();

  function shake(row){
    $(".row-"+row).effect("shake");
  }


  function getGuess(){
    let guess = "";

    //suposições de palavra
    for (let c = 0; c < width; c++) {
      setCurrTile('#'+ row.toString() + '-' + col.toString()); 
      guess += $(currTile).text();
    }

    guess = guess.toLowerCase(); //case sensitive

    console.log(guess);
    return guess;
  }

  function update() {
      
    //Começa o processo de adivinhação
    let correct = 0;

    let letterCount = {}; //Acompanhe a frequência das letras, ex) KENNY -> {K:1, E:1, N:2, Y: 1}
    for (let i = 0; i < word.length; i++) {
        let letter = word[i];

        if (letterCount[letter]) {
            letterCount[letter] += 1;
        }
        else {
            letterCount[letter] = 1;
        }
    }

    //console.log(letterCount);

    //primeira interação, verifique todas as corretas primeiro
    for (let c = 0; c < width; c++) {
        setCurrTile("#"+row.toString() + '-' + c.toString());

        //posição correta
        if (word[c] == $(currTile).text()) {
            $(currTile).addClass("correct");

            setKeyTile("#Key" + letter);
            $(keyTile).removeClass("present");
            $(keyTile).addClass("correct");

            correct += 1;
            letterCount[letter] -= 1; //deduzir a contagem de letras
        }

        if (correct == width) {
            triggerGameOver(true);     
        }
    }

    //console.log(letterCount);
    //vá novamente e marque quais estão presentes, mas na posição errada
    for (let c = 0; c < width; c++) {
        setCurrTile("#"+row.toString() + '-' + c.toString());

        // pule a letra se estiver marcada como correta
        if (!$(setCurrTile).hasClass("correct")) {
            //Está na palavra? certifique-se de que não contamos duas vezes
            if (word.includes(currTile) && letterCount[letter] > 0) {
                $(currTile).addClass("present");

                setKeyTile("#Key" + currTile);
                if (!$(keyTile).hasClass("correct")) {
                    $(keyTile).addClass("present");
                }
                letterCount[letter] -= 1;
            } // Não é a palavra ou (todas as letras foram usadas para evitar excesso de contagem)
            else {
                $(currTile).addClass("absent");
                setKeyTile("#Key" + currTile);
                $(keyTile).addClass("absent");
            }
        }
    }

    setRow(row+1); //nova linha
    setCol(0); //começa uma nova linha no inicio
  }

  return (
    <div>
      <Title/>
      <hr/>
      <Points points={points}/>
      <Board/>
      <br/>
      <br/>
      <ReadySetGo readySetGoText={readySetGoText} />
      <Timer time={time} />
      <br/>
      <Answer/>
      <Keyboard/>
    </div>
  )
}
