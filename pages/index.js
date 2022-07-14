import React, { useEffect, useState } from "react";
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

  var initialTime = 30;
  var extraTimeOnCorrectWord = 30; //extra time on correct word!

  var gameTimer; //variavel para timer global de jogo;

  const [points, setPoints] = useState(0);
  const [time, setTime] = useState(initialTime); //quantidade de segundos que o jogador possui inicialmente
  const [readySetGoText, setReadySetGoText] = useState("Ready....");
  const [currTile, setCurrTile] = useState("#0-0");
  const [rsgCheck, setRsgCheck] = useState(true);
  const [word, setWord] = useState(wordList[Math.floor(Math.random() * wordList.length)].toUpperCase());
  const [gameOver, setGameOver] = useState(true);
  const [col, setCol] = useState(0);
  const [row, setRow] = useState(0);
  const [keepCounting, setKeepCounting] = useState(true);

  console.log(word);

  var callProcessInput = function (event){
    processInput(event);
  }

  function inicializar(firstTime) {

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

      if (gameOver) return;

      if ("KeyA" <= e.code && e.code <= "KeyZ") {
        if (col < width) {

          if($(currTile).text() == "") {
              $(currTile).text(e.code[3]);
              
              if(col != 4){

                var newCol = col + 1;
  
                setCol(newCol);
                setCurrTile('#'+ row.toString() + '-' + newCol.toString());
              }
            }
          }
      }
      else if (e.code == "Backspace") {

        if($(currTile).text() == ""){
          var newCol = col - 1;
          var alterTile = '#'+row.toString() + '-' + newCol.toString();
        }else{
          var alterTile = '#'+row.toString() + '-' + col.toString();
          var newCol = col;
        }

        $(alterTile).text('') ;


        if (0 < col && col <= width) {
          
          setCol(newCol);
          setCurrTile(alterTile);
        }
      }

      else if (e.code == "Enter") {
          var guess = getGuess();

          if(col == width-1 && wordList.includes(guess)){
            update();
          }else{
            shake(row);
          }
      }

      if (!gameOver && row == height) {
        triggerGameOver(false);
      }
  }

  function restartBoard(){
    for(let r = 0; r < height; r++){
      for(let c = 0; c < width; c++){
        $("#"+r+"-"+c).text("");
        $("#"+r+"-"+c).css({"color":"", "border-color":"", "background-color":""});
        $("#"+r+"-"+c).removeClass("absent");
        $("#"+r+"-"+c).removeClass("present");
        $("#"+r+"-"+c).removeClass("correct");
      }
    }

    var letras = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","W","Y","Z","Ç"];
    for(const letra of letras){
      $("#Key"+letra).css({"color":"", "border-color":"", "background-color":""});
      $("#Key"+letra).removeClass("absent");
      $("#Key"+letra).removeClass("present");
      $("#Key"+letra).removeClass("correct");
    }
    $("#KeyEnter").css({"color":"", "border-color":"", "background-color":""});
    $("#Backspace").css({"color":"", "border-color":"", "background-color":""});
  }

  function triggerGameOver(guessedCorrectWord){
      setGameOver(true);

      if(guessedCorrectWord){
        $("#answer").css("color", "green");
        setPoints(points + (10 * (6 - row)));
      }else{
        $("#answer").css("color", "red");
      }

      $("#answer").text(word);
      setKeepCounting(false);
      clearInterval(gameTimer);

      
      setTimeout(function () {
        
        setWord(wordList[Math.floor(Math.random() * wordList.length)].toUpperCase());
        restartBoard();
        $(".timer").text('');
        $("#answer").text('');
        
        setReadySetGoText("Ready....");
        $(".timer").css("color", "black");
        
        if(guessedCorrectWord){
          setTime(time+extraTimeOnCorrectWord);
        }else{
          setTime(initialTime);
          setPoints(0);
        }
        setRow(0);
        setCol(0);
        setCurrTile("#0-0");

        setKeepCounting(true);
        setRsgCheck(true);


      }, 3000);    
  }

  function TimeCountdown() {

    useEffect(() =>{
      gameTimer = setInterval(() => {
        if(keepCounting){
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
      setRsgCheck(false);      
    }
  }

  TimeCountdown();

  function shake(row){
    console.log('#'+row.toString()+"-0"); 
    $('#'+row.toString()+"-0").css("border", "2px solid red");
    $('#'+row.toString()+"-1").css("border", "2px solid red");
    $('#'+row.toString()+"-2").css("border", "2px solid red");
    $('#'+row.toString()+"-3").css("border", "2px solid red");
    $('#'+row.toString()+"-4").css("border", "2px solid red");
  }


  function getGuess(){
    let guess = "";

    //suposições de palavra
    for (let c = 0; c < width; c++) {
      var checkTile = '#'+ row.toString() + '-' + c.toString()
      guess += $(checkTile).text();
    }

    guess = guess.toLowerCase(); //case sensitive

    return guess;
  }

  function update() {
      
    //Começa o processo de adivinhação
    let correct = 0;

    let letterCount = {}; //Acompanhe a frequência das letras, ex) KENNY -> {K:1, E:1, N:2, Y: 1}
    var badGameOver = true;

    for (let i = 0; i < word.length; i++) {
        var letter = word[i];

        if (letterCount[letter]) {
            letterCount[letter] += 1;
        }
        else {
            letterCount[letter] = 1;
        }
    }

    //primeira interação, verifique todas as corretas primeiro
    for (let c = 0; c < width; c++) {
      var alterTile = "#"+row.toString() + '-' + c.toString();
      let letter = $(alterTile).text();

      //posição correta
      if (word[c] == $(alterTile).text()) {
        $(alterTile).addClass("correct");
        addCorrectCss(alterTile);

        var alterKeyTile = "#Key" + letter;
        $(alterKeyTile).removeClass("present");
        $(alterKeyTile).css({"color":"", "border-color":"", "background-color":""});
        $(alterKeyTile).addClass("correct");
        addCorrectCss(alterKeyTile);

        correct += 1;
        letterCount[letter] -= 1; //deduzir a contagem de letras
      }

      if (correct == width) {
          triggerGameOver(true);     
          badGameOver = false;
      }
    }

    //vá novamente e marque quais estão presentes, mas na posição errada
    for (let c = 0; c < width; c++) {
      let checkTile = "#"+ row.toString() + '-' + c.toString();
      let letter = $(checkTile).text();

      // pule a letra se estiver marcada como correta
      if (!$(checkTile).hasClass("correct")) {
          //Está na palavra? certifique-se de que não contamos duas vezes
          if (word.includes(letter) && letterCount[letter] > 0) {
            $(checkTile).addClass("present");
            addPresentCss(checkTile);

            let alterKeyTile = "#Key"+letter;
            if (!$(alterKeyTile).hasClass("correct")) {
              $(alterKeyTile).addClass("present");
              addPresentCss(alterKeyTile);
            }
            letterCount[letter] -= 1;
          } // Não é a palavra ou (todas as letras foram usadas para evitar excesso de contagem)
          else {
            $(checkTile).addClass("absent");
            addAbsentCss(checkTile);
            let alterKeyTile = "#Key"+letter;
            $(alterKeyTile).addClass("absent");
            addAbsentCss(alterKeyTile);
          }
      }
    }

    var newRow = row + 1;
    var newCol = 0;

    setRow(newRow); //nova linha
    setCol(newCol); //começa uma nova linha no inicio
    setCurrTile("#"+newRow+'-'+newCol);

    if(badGameOver && newRow == height){
      triggerGameOver(false);
    }
  }

  function addCorrectCss(elementId){
    $(elementId).css({"color":"white", "border-color":"white", "background-color":"#1ed760"});
  }

  function addPresentCss(elementId){
    $(elementId).css({"color":"white", "border-color":"white", "background-color":"#f9ba04"});
  }

  function addAbsentCss(elementId){
    $(elementId).css({"color":"white", "border-color":"white", "background-color":"#777e99"});
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
