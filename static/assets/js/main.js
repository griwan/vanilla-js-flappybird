const screen = document.getElementById('gameScreen');
const score = document.getElementsByClassName('score')[0];
const highscorediv = document.getElementsByClassName('highscore')[0]
const startscreen = document.getElementsByClassName('menu')[0];
const startbutton = document.getElementById('start-click');
const resetscreen = document.getElementsByClassName('reset')[0];
const resetbutton = document.getElementById('reset-button');
let highScore = 0;

	if(window.localStorage.getItem('flappy-score')){
		highScore =parseInt(window.localStorage.getItem('flappy-score'))
	}
	else
		window.localStorage.setItem('flappy-score', '0');

highscorediv.innerHTML = `${highScore}`;
startbutton.addEventListener('click',(e)=>{
	game.over = false;
	game.start = true;
	startscreen.style.display = 'none'
})
resetbutton.addEventListener('click',(e)=>{
	location.reload();
	
})

let gameObjects =[];

class RandomHeight{
	constructor(){
		this.new =0;
		
	}
	getHeight(){
		if(this.new==0){
			this.createHeight();
			this.new+=1;
			return(this.h1)
		}
		this.new=0;
		return(this.h2)
		

	}
	createHeight(){
		this.h1 = Math.random()*600+100;
		this.h2 = 900-this.h1-200;
	}
}
let rnd = new RandomHeight();
class Game{
	constructor(screen){
		this.screen = screen;
		this.screen.style.background=`url('./assets/sprites/background-day.png')`;
		this.screen.style.backgroundSize='100%';
		this.over = true;
		this.score = 0;
		this.start = false;
		this.reset = false;
	}
}

class gameSprite{
    constructor(w,h,y,x,img_src,scrn){
      		this.y = y;
      		this.x= x;
          	this.scrn = scrn;
			this.box = document.createElement('div');
		
			this.imgList=[];
			this.box.style.position = 'absolute';
			this.box.style.width = w;
			this.box.style.height = h;

				
            this.img = document.createElement('img')
			this.scrn.appendChild(this.box);
          	this.img.style.width = `100%`;
         	this.img.style.height = `100%`;
          	this.img.src = img_src
			
          // this.img.style.border = '1px solid green';
          this.w = this.box.clientWidth;
          this.h =this.box.clientHeight;
          this.box.appendChild(this.img);
          gameObjects.push(this)
					
      } 
			scroll(){
			if(!game.over){
				this.x-=2;
				if(this.x <-100){

					this.x = 700;
					this.h = rnd.getHeight();
					if(this.y>0){
							this.y = 900-this.h
					}
					game.score +=0.5;
					this.box.style.height = `${this.h}px`;
				}
			}

			}

      draw(){
   
          this.box.style.left = `${this.x}px`;
					this.box.style.top = `${this.y}px`;
         
					this.w = this.box.clientWidth;
          this.h =this.box.clientHeight;
  
      }
      
      
  }
  


class Bird extends gameSprite{
	
	init(){
		
		this.draw();
		this.index = 0;
		this.imgList = ['bird1.png','bird2.png','bird1.png','bird3.png']
		this.animation = setInterval(()=>{
			this.img.src = 'assets/sprites/'+this.imgList[this.index];
			this.index =(this.index+1)%4;
		},100)
		this.controller();
		this.phyiscsInit();
	}
	fallAnimation(){
		clearInterval(this.animation);
		this.fall = setInterval(()=>{
			if(this.y+this.h<screen.clientHeight){
				this.y+=this.yv;
				this.yv+=this.gravity/4;
				this.draw();
			}
		
				
		},100)
	}
	controller(){
		document.addEventListener('keypress',()=>{
			if(!game.over){
				this.yv-=8

				
			}
		
		})
	}
	phyiscsInit(){
		this.yv = 5;
		this.gravity = 0.3;
	}
	move(){

		this.y +=this.yv;
		this.yv +=this.gravity;
		this.draw();
	}
}
	game = new Game(screen);

	function createPipes(yPos){
		let h1 = rnd.getHeight();
		let h2 = rnd.getHeight();

		pipe =new gameSprite('100px',`${h1}px`,900-h1,(i+1)*400,'assets/sprites/pipe-green.png',screen);
		pipe2 =new gameSprite('100px',`${h2}px`,0,(i+1)*400,'assets/sprites/pipe-green-down.jpg',screen);
	}

	for(i=0;i<2;i++){
		createPipes((i+1)*400)
		
	}
	
function detectCollision(a,b){
		if(b.y+b.h<0 || b.y>screen.clientHeight){
			return true;
		}
		if (a.x < b.x + b.w &&
				a.x + a.w > b.x &&
				a.y < b.y + b.h &&
				a.h + a.y > b.y) {
						return true;
			}
	
		return false;
	
	
	}
	
	bird = new Bird('70px','50px',200,10,'assets/sprites/bird1.png',screen);
	bird.init();
const gameLoop = setInterval(()=>{
		gameObjects.forEach((obj)=>{
	
			if(obj!=bird){
				if(!game.over && game.start)
				obj.scroll();
				obj.draw();
				if(detectCollision(obj,bird)){
					game.over = true;
					
					game.reset = true;
					if(game.score>highScore){
						window.localStorage.setItem('flappy-score', `${game.score}`);
					}
					bird.fallAnimation();
				
				}
			}
			score.innerHTML = `${game.score}`;
		
		})
		if(!game.over ){
			score.style.display = 'flex';
			bird.move();
		}
		
		if(game.over && !game.start){
			resetscreen.style.display = 'none';
		}
		if(game.reset){
			resetscreen.style.display = 'flex';	
		}
	},1000/60)