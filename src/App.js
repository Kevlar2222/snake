import React from 'react';
import './App.css';

const GRID_SIZE = 20;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alive: true,
      direction: 'right',
      headPosition: [0, 0],
      headStyle: [0, 0],
      xSpeed: 1,
      ySpeed: 0,
      foodPosition: [],
      foodStyle: [],
      tailList: [[0, 0], [0, 1], [0, 2]],
      alive2: true,
      direction2: 'left',
      headPosition2: [GRID_SIZE - 1, GRID_SIZE - 1],
      headStyle2: [0, 0],
      xSpeed2: -1,
      ySpeed2: 0,
      tailList2: [[GRID_SIZE - 1, GRID_SIZE - 1], [GRID_SIZE - 1, GRID_SIZE - 2], [GRID_SIZE - 1, GRID_SIZE - 3]]
    };
    this.move = this.move.bind(this);
    this.changeDirection = this.changeDirection.bind(this);
    this.randomBetween = this.randomBetween.bind(this);
    this.placeFood = this.placeFood.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.move();
    }, 60);
    this.placeFood();
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

  move () {
    let xPos = this.state.headPosition[0] + this.state.xSpeed;
    let xPos2 = this.state.headPosition2[0] + this.state.xSpeed2;
    let yPos = this.state.headPosition[1] + this.state.ySpeed;
    let yPos2 = this.state.headPosition2[1] + this.state.ySpeed2;
    if(xPos < 0 || xPos >= GRID_SIZE){
      alert("Player 1 hit the wall. Player 2 Wins!");
      clearInterval(this.interval);
      return;
    }
    if(xPos2 < 0 || xPos2 >= GRID_SIZE){
      alert("Player 2 hit the wall. Player 1 Wins!");
      clearInterval(this.interval);
      return;
    }
    if(yPos < 0 || yPos >= GRID_SIZE){
      clearInterval(this.interval);
      alert("Player 1 hit the wall. Player 2 Wins!");
      return;
    }
    if(yPos2 < 0 || yPos2 >= GRID_SIZE){
      clearInterval(this.interval);
      alert("Player 2 hit the wall. Player 1 Wins!");
      return;
    }
    let tailList = [...this.state.tailList];
    tailList.forEach(tail => { if(tail[0] === xPos && tail[1] === yPos){
      alert("Player 1 crashed into a tail!");
      clearInterval(this.interval);
      return;
    }
    if(tail[0] === xPos2 && tail[1] === yPos2){
      alert("Player 2 crashed into a tail!");
      clearInterval(this.interval);
      return;
    }
  });
    let tailList2 = [...this.state.tailList2];
    tailList2.forEach(tail => { if(tail[0] === xPos && tail[1] === yPos){
      alert("Player 1 crashed into a tail!");
      clearInterval(this.interval);
      return;
    }
    if(tail[0] === xPos2 && tail[1] === yPos2){
      alert("Player 2 crashed into a tail!");
      clearInterval(this.interval);
      return;
    }
  });
    tailList.unshift([xPos, yPos]);
    if(this.state.headPosition[0] === this.state.foodPosition[0] && this.state.headPosition[1] === this.state.foodPosition[1]){
      this.placeFood();
    } else {
      tailList.pop();
    }
    tailList2.unshift([xPos2, yPos2]);
    if(this.state.headPosition2[0] === this.state.foodPosition[0] && this.state.headPosition2[1] === this.state.foodPosition[1]){
      this.placeFood();
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
      alert("Head-on Collision!");
      clearInterval(this.interval);
      return;
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
    else if(e.key === "s" && this.state.direction2 !== 'up'){
      this.setState({
        xSpeed2: 0,
        ySpeed2: 1
      });
    }
    else if(e.key === "w" && this.state.direction2 !== 'down'){
      this.setState({
        xSpeed2: 0,
        ySpeed2: -1
      });
    }
    else if(e.key === "a" && this.state.direction2 !== 'right'){
      this.setState({
        xSpeed2: -1,
        ySpeed2: 0
      });
    }
    else if(e.key === "d" && this.state.direction2 !== 'left'){
      this.setState({
        xSpeed2: 1,
        ySpeed2: 0
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
      return <div style={{ width: size, height: size, position: 'absolute', left: String(el[0] * (80 / GRID_SIZE)) + "vh", top: String(el[1] * (80 / GRID_SIZE)) + "vh", backgroundColor: 'blue' }} />
    });
    let tailList2 = this.state.tailList2.map((el, idx) => {
      return <div style={{ width: size, height: size, position: 'absolute', left: String(el[0] * (80 / GRID_SIZE)) + "vh", top: String(el[1] * (80 / GRID_SIZE)) + "vh", backgroundColor: 'purple' }} />
    });
    return (
      <div className="gameBoard">
        {html}
        {tailList}
        {tailList2}
        <SnakeHead style={this.state.headStyle}/>
        <SnakeHead2 style={this.state.headStyle2}/>
        <Food food={this.state.foodStyle}/>
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
  return (
    <div className="snakeHead2" style={{top: `${props.style[1]}`, left: `${props.style[0]}`}}></div>
  );
}

function Food(props) {
  return (
    <div className="food" style={{top: `${props.food[1]}`, left: `${props.food[0]}`}}></div>
  )
}

export default App;