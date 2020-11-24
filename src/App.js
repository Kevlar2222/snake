import { findAllByTestId } from '@testing-library/react';
import React from 'react';
import './App.css';

const GRID_SIZE = 20;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      p1: 0
    };
    this.move = this.move.bind(this);
    this.changeDirection = this.changeDirection.bind(this);
    this.randomBetween = this.randomBetween.bind(this);
    this.placeFood = this.placeFood.bind(this);
    this.toggle = this.toggle.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  componentDidMount() {
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

  startGame() {
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

  }

  move () {
    if(this.state.multi){
      let xPos = this.state.headPosition[0] + this.state.xSpeed;
      let xPos2 = this.state.headPosition2[0] + this.state.xSpeed2;
      let yPos = this.state.headPosition[1] + this.state.ySpeed;
      let yPos2 = this.state.headPosition2[1] + this.state.ySpeed2;
      if(xPos < 0 || xPos >= GRID_SIZE){
        clearInterval(this.interval);
        this.setState({
          gameover: true,
          p2: this.state.p2 + 3
        });
        return;
      }
      if(xPos2 < 0 || xPos2 >= GRID_SIZE){
        clearInterval(this.interval);
        this.setState({
          gameover: true,
          p1: this.state.p1 + 3
        });
        return;
      }
      if(yPos < 0 || yPos >= GRID_SIZE){
        clearInterval(this.interval);
        this.setState({
          gameover: true,
          p2: this.state.p2 + 3
        });
        return;
      }
      if(yPos2 < 0 || yPos2 >= GRID_SIZE){
        clearInterval(this.interval);
        this.setState({
          gameover: true,
          p1: this.state.p1 + 3
        });
        return;
      }
      let tailList = [...this.state.tailList];
      tailList.forEach(tail => { if(tail[0] === xPos && tail[1] === yPos){
        clearInterval(this.interval);
        this.setState({
          gameover: true,
          p2: this.state.p2 + 3
        });
        return;
      }
      if(tail[0] === xPos2 && tail[1] === yPos2){
        clearInterval(this.interval);
        this.setState({
          gameover: true,
          p1: this.state.p1 + 3
        });
        return;
      }
    });
      let tailList2 = [...this.state.tailList2];
      tailList2.forEach(tail => { if(tail[0] === xPos && tail[1] === yPos){
        clearInterval(this.interval);
        this.setState({
          gameover: true,
          p2: this.state.p2 + 3
        });
        return;
      }
      if(tail[0] === xPos2 && tail[1] === yPos2){
        clearInterval(this.interval);
        this.setState({
          gameover: true,
          p1: this.state.p1 + 3
        });
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
      tailList2.unshift([xPos2, yPos2]);
      if(this.state.headPosition2[0] === this.state.foodPosition[0] && this.state.headPosition2[1] === this.state.foodPosition[1]){
        this.placeFood();
        this.setState({p2: this.state.p2 + 1});
      } else {
        tailList2.pop();
      }
      let direction;
      let direction2;
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
      if(xPos === xPos2 && yPos === yPos2){
        clearInterval(this.interval);
        this.setState({gameover: true});
        return;
      }
  } else {
      let xPos = this.state.headPosition[0] + this.state.xSpeed;
      let yPos = this.state.headPosition[1] + this.state.ySpeed;
      if(xPos < 0 || xPos >= GRID_SIZE){
        clearInterval(this.interval);
        this.setState({gameover: true});
        return;
      }
      if(yPos < 0 || yPos >= GRID_SIZE){
        clearInterval(this.interval);
        this.setState({gameover: true});
        return;
      }
      let tailList = [...this.state.tailList];
      tailList.forEach(tail => { if(tail[0] === xPos && tail[1] === yPos){
        clearInterval(this.interval);
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
    if(e.key === "ArrowDown" && this.state.direction !== 'up'){
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
    else if(this.state.gameover && e.key === "p"){
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
  } else if(this.state.gameover && e.key === "q"){
    document.querySelector('.options').style.display = "block";
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

  toggle(e) {
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

  render () {
    window.addEventListener("keydown", this.changeDirection);
    const cell = <div className="cell"></div>;
    let html = [];
    const size = String(80 / GRID_SIZE) + "vh";

    for (let i = 0; i < GRID_SIZE; i++){
      for(let j = 0; j < GRID_SIZE; j++){
        html.push(cell);
      }
    }
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
      <div className="gameBoard">
        {html}
        {tailList}
        {tailList2}
        <SnakeHead style={this.state.headStyle}/>
        <SnakeHead2 display={this.state.multi} style={this.state.headStyle2}/>
        <Food food={this.state.foodStyle}/>
      </div>
      <Start toggle={this.toggle} click={this.startGame}/>
      <Score p1={this.state.p1} p2={this.state.p2} multi={this.state.multi}/>
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

export default App;