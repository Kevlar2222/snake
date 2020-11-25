import { findAllByTestId } from '@testing-library/react';
import React from 'react';
import './App.css';
import music from './music.mp3';
import explosion from './explosion.mp3';
import splat from './splat.mp3';

const GRID_SIZE = 20;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      music: true,
      gameover: false,
      players: 1,
      speed: 60,
      direction: 'right',
      headPosition: [0, 0],
      headStyle: [0, 0],
      xSpeed: 1,
      ySpeed: 0,
      foodPosition: [],
      foodStyle: [],
      tailList: [[0, 0], [0, 1], [0, 2]],
      multi: false,
      p1: 0,
    };
    this.move = this.move.bind(this);
    this.changeDirection = this.changeDirection.bind(this);
    this.randomBetween = this.randomBetween.bind(this);
    this.placeFood = this.placeFood.bind(this);
    this.toggle = this.toggle.bind(this);
    this.startGame = this.startGame.bind(this);
    this.instructions = this.instructions.bind(this);
    this.menu = this.menu.bind(this);
    this.playSplat = this.playSplat.bind(this);
  }

  componentDidMount() {
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

  startGame() {                                               //Get number of players and speed settings, hide menu, setup second snake, start interval.
    let ms;
    let num;
    const players = document.querySelectorAll('.players');
    players.forEach(player => {
      if(player.classList.contains('selected')){
        num = Number(player.textContent);
        this.setState({
          players: num,
          gameover: false
      });
      }
    });
    const speed = document.querySelectorAll('.speed');
    speed.forEach(speed => {
      if(speed.classList.contains('selected')){
        ms = speed.textContent === "Fast" ? 60 : speed.textContent === "Medium" ? 120 : 240;
        this.setState({speed: ms});
      }
    });
    document.querySelector('.options').style.display = "none";
    document.querySelector('.instructions').style.display = "none";
    if(num === 1){
      this.setState({
        multi: false
      });
    }
    if(num === 2){
      this.setState({
        multi: true,
        direction2: 'left',
        headPosition2: [GRID_SIZE - 1, GRID_SIZE - 1],
        headStyle2: [0, 0],
        xSpeed2: -1,
        ySpeed2: 0,
        tailList2: [[GRID_SIZE - 1, GRID_SIZE - 1], [GRID_SIZE - 1, GRID_SIZE - 2], [GRID_SIZE - 1, GRID_SIZE - 3]],
        p2: 0
      });
    }
    this.interval = setInterval(() => {
      this.move();
    }, ms);
    this.placeFood();
    if(music){
      const music = document.getElementById('music');
      music.play();
      music.loop = true;
    }
  }

  playSplat() {
    if(music){
      const splat = document.getElementById('splat');
      splat.currentTime = 0;
      splat.play();
    }
  }

  move () {                                                           //move snake(s) one square, check for collisions, update page
    if(this.state.multi){                                             //multi = 2 snakes
      let xPos = this.state.headPosition[0] + this.state.xSpeed;
      let xPos2 = this.state.headPosition2[0] + this.state.xSpeed2;
      let yPos = this.state.headPosition[1] + this.state.ySpeed;
      let yPos2 = this.state.headPosition2[1] + this.state.ySpeed2;
      let p1Crashed = false;
      let p2Crashed = false;
      if(xPos < 0 || xPos >= GRID_SIZE){                              //e.g. player1 hit the wall
        p1Crashed = true;
      }
      if(xPos2 < 0 || xPos2 >= GRID_SIZE){
        p2Crashed = true;
      }
      if(yPos < 0 || yPos >= GRID_SIZE){
        p1Crashed = true;
      }
      if(yPos2 < 0 || yPos2 >= GRID_SIZE){
        p2Crashed = true;
      }
      let tailList = [...this.state.tailList];
      tailList.forEach(tail => { if(tail[0] === xPos && tail[1] === yPos){
        p1Crashed = true;
      }
      if(tail[0] === xPos2 && tail[1] === yPos2){
        p2Crashed = true;
      }
    });
      let tailList2 = [...this.state.tailList2];
      tailList2.forEach(tail => { if(tail[0] === xPos && tail[1] === yPos){
        p1Crashed = true;
      }
      if(tail[0] === xPos2 && tail[1] === yPos2){
        p2Crashed = true;
      }
    });
    if(p1Crashed){
      clearInterval(this.interval);
      if(p2Crashed){
        this.playSplat();
        this.setState({
          gameover: true,
          p1: this.state.p1 + 3,
          p2: this.state.p2 + 3
        });
        return;
      } else {
        this.playSplat();
        this.setState({
          gameover: true,
          p2: this.state.p2 + 3
        });
        return;
      }
    } else if(p2Crashed){
      clearInterval(this.interval);
      this.playSplat();
      this.setState({
        gameover: true,
        p1: this.state.p1 + 3
      });
      return;
    }
      tailList.unshift([xPos, yPos]);                               // Add current head position to start of tail list array
      if(this.state.headPosition[0] === this.state.foodPosition[0] && this.state.headPosition[1] === this.state.foodPosition[1]){
        this.placeFood();                                           // Ate the food, randomly place another
        this.setState({p1: this.state.p1 + 1});                     // +1 pt
      } else {
        tailList.pop();                                             // If didn't eat food, remove last entry of tail list array
      }
      tailList2.unshift([xPos2, yPos2]);
      if(this.state.headPosition2[0] === this.state.foodPosition[0] && this.state.headPosition2[1] === this.state.foodPosition[1]){
        this.placeFood();
        this.setState({p2: this.state.p2 + 1});
      } else {
        tailList2.pop();
      }
      let direction;
      let direction2;                                               // Set direction, position etc in state
      this.state.xSpeed === 1 ? direction = 'right' : this.state.xSpeed === -1 ? direction = 'left' : this.state.ySpeed === 1 ? direction = 'down' : direction = 'up';
      this.state.xSpeed2 === 1 ? direction2 = 'right' : this.state.xSpeed2 === -1 ? direction2 = 'left' : this.state.ySpeed2 === 1 ? direction2 = 'down' : direction2 = 'up';
      this.setState({
        headPosition: [xPos, yPos],
        headStyle: [String(xPos * (80 / GRID_SIZE)) + "vh", String(yPos * (80 / GRID_SIZE)) + "vh"],
        direction: direction,
        tailList: tailList,
        headPosition2: [xPos2, yPos2],
        headStyle2: [String(xPos2 * (80 / GRID_SIZE)) + "vh", String(yPos2 * (80 / GRID_SIZE)) + "vh"],
        direction2: direction2,
        tailList2: tailList2,
      });
      if(xPos === xPos2 && yPos === yPos2){                         // Head on collision
        clearInterval(this.interval);
        if(music){
          const explosion = document.getElementById('explosion');
          explosion.currentTime = 0;
          explosion.play();
        }
        this.setState({gameover: true});
        return;
      }
  } else {                                                          //Single player game loop
      let xPos = this.state.headPosition[0] + this.state.xSpeed;
      let yPos = this.state.headPosition[1] + this.state.ySpeed;
      if(xPos < 0 || xPos >= GRID_SIZE){
        clearInterval(this.interval);
        this.playSplat();
        this.setState({gameover: true});
        return;
      }
      if(yPos < 0 || yPos >= GRID_SIZE){
        clearInterval(this.interval);
        this.playSplat();
        this.setState({gameover: true});
        return;
      }
      let tailList = [...this.state.tailList];
      tailList.forEach(tail => { if(tail[0] === xPos && tail[1] === yPos){
        clearInterval(this.interval);
        this.playSplat();
        this.setState({gameover: true});
        return;
      }
    });
      tailList.unshift([xPos, yPos]);
      if(this.state.headPosition[0] === this.state.foodPosition[0] && this.state.headPosition[1] === this.state.foodPosition[1]){
        this.placeFood();
        this.setState({p1: this.state.p1 + 1});
      } else {
        tailList.pop();
      }
      let direction;
      this.state.xSpeed === 1 ? direction = 'right' : this.state.xSpeed === -1 ? direction = 'left' : this.state.ySpeed === 1 ? direction = 'down' : direction = 'up';
      this.setState({
        headPosition: [xPos, yPos],
        headStyle: [String(xPos * (80 / GRID_SIZE)) + "vh", String(yPos * (80 / GRID_SIZE)) + "vh"],
        direction: direction,
        tailList: tailList
      });
  }
  }

  changeDirection (e) {
    if(e.key === "ArrowDown" && this.state.direction !== 'up'){                 // e.g. Cannot change direction to down if currently moving up
      this.setState({
        xSpeed: 0,
        ySpeed: 1
      });
    }
    else if(e.key === "ArrowUp" && this.state.direction !== 'down'){
      this.setState({
        xSpeed: 0,
        ySpeed: -1
      });
    }
    else if(e.key === "ArrowLeft" && this.state.direction !== 'right'){
      this.setState({
        xSpeed: -1,
        ySpeed: 0
      });
    }
    else if(e.key === "ArrowRight" && this.state.direction !== 'left'){
      this.setState({
        xSpeed: 1,
        ySpeed: 0
      });
    }
    else if(this.state.multi && e.key === "s" && this.state.direction2 !== 'up'){
      this.setState({
        xSpeed2: 0,
        ySpeed2: 1
      });
    }
    else if(this.state.multi && e.key === "w" && this.state.direction2 !== 'down'){
      this.setState({
        xSpeed2: 0,
        ySpeed2: -1
      });
    }
    else if(this.state.multi && e.key === "a" && this.state.direction2 !== 'right'){
      this.setState({
        xSpeed2: -1,
        ySpeed2: 0
      });
    }
    else if(this.state.multi && e.key === "d" && this.state.direction2 !== 'left'){
      this.setState({
        xSpeed2: 1,
        ySpeed2: 0
      });
    }
    else if(this.state.gameover && e.key === "p"){                                              // Continue playing with same settings and carry over score
      if(this.state.multi){
        this.setState({
          gameover: false,
          direction: 'right',
          headPosition: [0, 0],
          headStyle: [0, 0],
          xSpeed: 1,
          ySpeed: 0,
          foodPosition: [],
          foodStyle: [],
          tailList: [[0, 0], [0, 1], [0, 2]],
          direction2: 'left',
          headPosition2: [GRID_SIZE - 1, GRID_SIZE - 1],
          headStyle2: [0, 0],
          xSpeed2: -1,
          ySpeed2: 0,
          tailList2: [[GRID_SIZE - 1, GRID_SIZE - 1], [GRID_SIZE - 1, GRID_SIZE - 2], [GRID_SIZE - 1, GRID_SIZE - 3]]
        });
        this.interval = setInterval(() => {
          this.move();
        }, this.state.speed);
        this.placeFood();
      } else {
        this.setState({
          gameover: false,
          direction: 'right',
          headPosition: [0, 0],
          headStyle: [0, 0],
          xSpeed: 1,
          ySpeed: 0,
          foodPosition: [],
          foodStyle: [],
          tailList: [[0, 0], [0, 1], [0, 2]],
      });
      this.interval = setInterval(() => {
        this.move();
      }, this.state.speed);
      this.placeFood();
    }
  } else if(this.state.gameover && e.key === "q"){                                        // Reset score and change settings
    document.querySelector('.options').style.display = "block";
    document.querySelector('.instructions').style.display = "none";
    this.setState({
      gameover: false,
      direction: 'right',
      headPosition: [0, 0],
      headStyle: [0, 0],
      xSpeed: 1,
      ySpeed: 0,
      foodPosition: [],
      foodStyle: [],
      tailList: [[0, 0], [0, 1], [0, 2]],
      p1: 0,
      direction2: 'left',
      headPosition2: [GRID_SIZE - 1, GRID_SIZE - 1],
      headStyle2: [0, 0],
      xSpeed2: -1,
      ySpeed2: 0,
      tailList2: [[GRID_SIZE - 1, GRID_SIZE - 1], [GRID_SIZE - 1, GRID_SIZE - 2], [GRID_SIZE - 1, GRID_SIZE - 3]],
      p2: 0
    });
    
  }
}

  placeFood() {
    let foodX = this.randomBetween(0, GRID_SIZE - 1);
    let foodY = this.randomBetween(0, GRID_SIZE - 1);
    this.setState({
      foodPosition: [foodX, foodY],
      foodStyle: [String(foodX * (80 / GRID_SIZE)) + "vh", String(foodY * (80 / GRID_SIZE)) + "vh"]   
    });
  }

  toggle(e) {                                                           // Change colour of selected menu buttons
    if(e.target.classList.contains("players")){
      const players = document.querySelectorAll('.players');
      players.forEach(player => player.classList.remove('selected'));
      e.target.classList.add('selected');
    } else {
      const speed = document.querySelectorAll('.speed');
      speed.forEach(speed => speed.classList.remove('selected'));
      e.target.classList.add('selected');
    }
  }

  instructions() {
    document.querySelector('.options').style.display = "none";
    document.querySelector('.instructions').style.display = "block";
  }

  menu() {
    document.querySelector('.options').style.display = "block";
    document.querySelector('.instructions').style.display = "none";
  }

  render () {
    window.addEventListener("keydown", this.changeDirection);
    const cell = <div className="cell"></div>;
    let html = [];
    const size = String(80 / GRID_SIZE) + "vh";

    for (let i = 0; i < GRID_SIZE; i++){                                //Setup grid
      for(let j = 0; j < GRID_SIZE; j++){
        html.push(cell);
      }
    }                                                                   //Render tails
    let tailList = this.state.tailList.map((el, idx) => {
      return <div style={{ width: size, height: size, zIndex: 1, position: 'absolute', left: String(el[0] * (80 / GRID_SIZE)) + "vh", top: String(el[1] * (80 / GRID_SIZE)) + "vh", backgroundColor: 'blue' }} />
    });
    let tailList2;
    if(this.state.multi){
      tailList2 = this.state.tailList2.map((el, idx) => {
        return <div style={{ width: size, height: size, zIndex: 1, position: 'absolute', left: String(el[0] * (80 / GRID_SIZE)) + "vh", top: String(el[1] * (80 / GRID_SIZE)) + "vh", backgroundColor: 'purple' }} />
      });

    }
    
    return (
      <div className="container">
        <audio id="music" className="audio-element">
          <source src={music}></source>
        </audio>
        <audio id="splat" className="audio-element">
          <source src={splat}></source>
        </audio>
        <audio id="explosion" className="audio-element">
          <source src={explosion}></source>
        </audio>
        <div className="gameBoard">
          {html}
          {tailList}
          {tailList2}
          <SnakeHead style={this.state.headStyle}/>
          <SnakeHead2 display={this.state.multi} style={this.state.headStyle2}/>
          <Food food={this.state.foodStyle}/>
        </div>
        <Start toggle={this.toggle} click={this.startGame} instructions={this.instructions}/>
        <Score p1={this.state.p1} p2={this.state.p2} multi={this.state.multi}/>
        <Instructions menu={this.menu}/>
      </div>
    );
  }
}

function SnakeHead(props) {
    return (
      <div className="snakeHead" style={{top: `${props.style[1]}`, left: `${props.style[0]}`}}></div>
    );
}

function SnakeHead2(props) {
  if(props.display){
    return (
      <div className="snakeHead2" style={{top: `${props.style[1]}`, left: `${props.style[0]}`}}></div>
    );
  } else {
    return (<div style={{display: "none"}}></div>);
  }
}

function Food(props) {
  return (
    <div className="food" style={{top: `${props.food[1]}`, left: `${props.food[0]}`}}></div>
  )
}

function Start(props) {
  return (
  <div className="options">
    <div className="heading">Number of Players:</div>
    <div className="flex">
      <button onClick={props.toggle} className="button players selected">1</button>
      <button onClick={props.toggle} className="button players">2</button>
    </div>
    
    <div className="heading">Speed:</div>
    <div className="flex">
      <button onClick={props.toggle} className="button speed">Slow</button>
      <button onClick={props.toggle} className="button speed">Medium</button>
      <button onClick={props.toggle} className="button speed selected">Fast</button>
    </div>

    <div className="flex">
      <button onClick={props.click} className="button start">Start</button>
    </div>
    <button className="instructionButton" onClick={props.instructions}>Instructions</button>
  </div>
  );
}

function Score(props) {
  if(props.multi){
    return(
    <div className="scores">
    Scores:
      <div className="pl">Player 1: {props.p1}</div>
      <div className="pl">Player 2: {props.p2}</div>
    </div>
    );
  } else {
  return(
    <div className="scores">
    Scores:
      <div className="pl">Player 1: {props.p1}</div>
    </div>
    );
  }
}

function Instructions(props) {
  return (
    <div className="instructions">
      <div className="bigger">Instructions</div>
      <div>
        Player 1:
        <br></br>
        - Start position = top left, moving right
        <br></br>
        - Controls = arrow keys
        <br></br>
        <br></br>

        Player 2:
        <br></br>
        - Start position = bottom right, moving left
        <br></br>
        - Controls = WASD
        <br></br>
        <br></br>

        Game over:
        <br></br>
        - Press p to continue playing with the same settings and score carried over
        <br></br>
        - Press q to quit to menu, reset score and change settings
        <br></br>
        <br></br>

        Scoring:
        <br></br>
        - 1 point for eating the food
        <br></br>
        - 3 points if your opponent crashes
      </div>
      <button className='instructionButton' onClick={props.menu}>Okay</button>
    </div>
    
  )
}

export default App;