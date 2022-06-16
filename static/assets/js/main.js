

let highScore = 0;
let gameObjects =[];//array storing all objects

//loading high score from storage
if(window.localStorage.getItem('flappy-score')){
		highScore =parseInt(window.localStorage.getItem('flappy-score'))
	}
else
	window.localStorage.setItem('flappy-score', '0');

highscorediv.innerHTML = `${highScore}`;

//main game class
class Game{
	constructor(screen){
		this.screen = screen;
		this.screen.style.background=`url('./assets/sprites/background-day.png')`;
		this.screen.style.backgroundSize='100%';
		this.over = true;
		this.score = 0;
		this.start = false;
		this.reset = false;
		this.heightToggle = 0;
	}
	//function to get random height for pipes
	getHeight(){
		if(this.heightToggle==0){
			this.createHeight();
			this.heightToggle+=1;
			return(this.h1)
		}
		this.heightToggle=0;
		return(this.h2)
	}
	createHeight(){
		this.h1 = Math.random()*MaxPipeHeight+MinPipeHeight;
		this.h2 = screen.clientHeight-this.h1-PipeGap;
	}
}






//class to create game object with sprite
class GameObject{
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
		
				
		this.w = this.box.clientWidth;
		this.h =this.box.clientHeight;
		this.box.appendChild(this.img);
		gameObjects.push(this)
				
	} 

	scroll(){
		if(!game.over){
			this.x-=ScrollSpeed;
			if(this.x <-this.w){

				this.x = NewPipeLocation;
				this.h = game.getHeight();
				if(this.y>0){
						this.y = screen.clientHeight-this.h
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
  

//bird class with animation
class Bird extends GameObject{
	
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
				this.yv-=UpForce
			}
		
		})
	}
	phyiscsInit(){
		this.yv = 0;
		this.gravity = Gravity;
	}
	move(){
		this.y +=this.yv;
		this.yv +=this.gravity;
		this.draw();
	}
}

//new game object;
game = new Game(screen);


//create initial pipes
function createPipes(yPos){
	let h1 = game.getHeight();
	let h2 = game.getHeight();

	pipe =new GameObject(`${PipeWidth}px`,`${h1}px`,screen.clientHeight-h1,(i+1)*PipeSpacing,'assets/sprites/pipe-green.png',screen);
	pipe2 =new GameObject(`${PipeWidth}px`,`${h2}px`,0,(i+1)*PipeSpacing,'assets/sprites/pipe-green-down.jpg',screen);
}
for(i=0;i<2;i++){
	createPipes((i+1)*PipeSpacing)
}


//collision detection
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


//new bird object
bird = new Bird(BirdDimension.w,BirdDimension.h,200,10,'assets/sprites/bird1.png',screen);
bird.init();

//eventlistener for button
startbutton.addEventListener('click',(e)=>{
	game.over = false;
	game.start = true;
	startscreen.style.display = 'none'
})

resetbutton.addEventListener('click',(e)=>{
	location.reload();		
})


//main gameLoop
let gameLoop = setInterval(()=>{
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
},1000/FrameRate)

	