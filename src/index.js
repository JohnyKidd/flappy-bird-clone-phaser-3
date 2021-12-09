import Phaser from "phaser"

const config = {
  type:Phaser.AUTO,
  width:800,
  height:600,
  physics: {
    default: 'arcade',
    arcade: {
      
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
}

// main variables

const velocity = 200
const pipesToRender = 2

let bird = null
let pipes = null

let pipeHorizontalDistance = 0

const pipeVerticalDistanceRange = [100, 250]
const pipeHorizontalDistanceRange = [500, 550]

const flapVelocity = 250
const initialBirdPosition = {x: config.width * 0.1, y: config.height/2}

function preload(){
  this.load.image('sky', 'assets/sky.png')
  this.load.image('bird', 'assets/bird.png')
  this.load.image('pipe', 'assets/pipe.png')
}

function create(){
  this.add.image(0, 0, 'sky').setOrigin(0,0)
  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird').setOrigin(0)
  bird.body.gravity.y = 400

  pipes = this.physics.add.group()

  for(let i = 0; i < pipesToRender; i++){
    const upperPipe = pipes.create(0,0,'pipe').setOrigin(0, 1)
    const lowerPipe = pipes.create(0,0,'pipe').setOrigin(0, 0)

    placePipe(upperPipe, lowerPipe)
  }

  pipes.setVelocityX(-velocity)

  // keypress implementation
  this.input.on('pointerdown', flap)
  this.input.keyboard.on('keydown_SPACE', flap)
  
}

// 60fps -> delta is 16 ms -> 60*16ms = 1000ms -> 60fps
function update(time, delta){
  if (bird.y > config.height || bird.y < 0 - bird.height){
    restartPlayerPosition()
  }
  recyclePipes()
}

// functions for game features
function restartPlayerPosition(){
  bird.x = initialBirdPosition.x
  bird.y = initialBirdPosition.y
  bird.body.velocity.y = 0
  
}

function flap(){
  bird.body.velocity.y = -flapVelocity
}

function placePipe(upperPipe, lowerPipe){
    const rightMostX = getRightMostPipe()
    const pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange)
    const pipeVerticalPosition = Phaser.Math.Between(20, config.height - 20 - pipeVerticalDistance)
    const pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange)

    upperPipe.x = rightMostX + pipeHorizontalDistance
    upperPipe.y = pipeVerticalDistance
    
    lowerPipe.x = upperPipe.x
    lowerPipe.y = upperPipe.y + pipeVerticalDistance
}

function recyclePipes(){
  const tempPipes = []
  pipes.getChildren().forEach(pipe =>{
    if (pipe.getBounds().right < 0){
      tempPipes.push(pipe)
      if (tempPipes.length === 2){
        placePipe(...tempPipes)
      }
    }
  })
}

function getRightMostPipe(){
  let rightMostX = 0

  pipes.getChildren().forEach(function (pipe){
    rightMostX = Math.max(pipe.x, rightMostX)
  })
  return rightMostX
}

new Phaser.Game(config)