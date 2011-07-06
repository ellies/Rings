/** 
* Creating objects, rendering and event handling   
*/
var width, height; 
function runProgram()
{
	var canvas = document.getElementById("Ring"); 
	width = canvas.width;
	height = canvas.height;
	initGL(canvas); 
	initShaders(); 
	initBuffers(); 
	createRing(0, 0); 
	gl.clearColor(0, 0, 0, 1); 
	
	document.onkeydown = handleKeyDown; 
	document.onkeyup = handleKeyUp; 
    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
	
	tick(); 
}

function tick()
{
	requestAnimFrame(tick); 
	drawScene(); 	
	handleKeys();
	animate(); 
}

/**at every click, the next image will be rendered */
var imgs = ["img/i2.jpg", "img/i0.jpg", "img/i1.jpg"];  
/**stores rings */
var rings = [];
/**number of rings, each ring is created by a click */
var ringsCount = 0;
/**stores angles of rotation about z axis for each ring */
var rotZangles = [];   

/**creates dots, elements of a ring */
function createRing(x0, y0)
{
	// init a texture for this ring 
	initTexture(imgs[ringsCount%imgs.length]); 
	// init an array of dots for this ring 
	rings[ringsCount] = [];
	// initial dot position x (= x0 + dx0) 
	var dx0 = (2*Math.random()-1)*(ringsCount+1); 
	// angular speed for each dot's rotation about y axis
	var rotYspeed = Math.random()*2-1; 
	// radial speed of this ring 
	var radialspeed =(Math.random()*2-1)*0.25; 
	// number of dots per ring 
	var size = Math.random()*20 + 40; 
	
	for(var i =0; i < size; i++) 	 
	{
		rings[ringsCount].push(new Dot(x0, y0, dx0, i*dx0/size, i*rotYspeed/size, radialspeed)); 
	}
	
	// dot rotation about z axis 
	rotZangles.push((Math.random()*2-1)*0.3); 
	ringsCount++;
}

function drawScene()
{
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight); 
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
	
	mat4.perspective(45, gl.viewportWidth/gl.viewportHeight, 0.1, 100, pMatrix); 
	
	// for texture blending 
	gl.disable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND); 
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE); 

	mat4.identity(mvMatrix); 
	
	for(var i in rings)
	{	
		pushMVMatrix(); 
		// move dots to mouse position 	
		mat4.translate(mvMatrix, [mouseXYs[2*i], mouseXYs[2*i+1], zoom]); 
		mat4.rotate(mvMatrix, degToRad(rotXangle), [1,0,0]); 
		
		for(var j in rings[i])
		{
			rings[i][j].draw(rotXangle, rotZangle);
			rotZangle += rotZangles[i]; 
		}	
		popMVMatrix(); 
	}
}

var lastTime = 0; 
function animate()
{
	var curTime = new Date().getTime(); 	
	
	if(lastTime)
	{
		var elapsed = curTime - lastTime; 
		
		for(var i in rings)
		{
			for(var j in rings[i])
			{
				rings[i][j].animate(elapsed); 
			}
		}
	}
	
	lastTime = curTime; 	
}

/** handle key events */
var curKeys = [];
var zoom = -35; 
var rotXangle = 90;   
var rotZangle = 0;
function handleKeys()
{ 
	if(curKeys[38]) // up  
	{
		zoom -= 1; 
	}
	if(curKeys[40]) // down 
	{
		zoom += 1; 
	}
	if(curKeys[39]) // right
	{
		rotXangle += 10; 
	}
	if(curKeys[37]) // left
	{
		rotXangle -= 10; 
	}
}

function handleKeyDown(event)
{
	curKeys[event.keyCode] = true;	
}

function handleKeyUp(event)
{
	curKeys[event.keyCode] = false;	
}

var mouseDown = false;
var mouseXYs = [0,0];
function handleMouseDown(event)
{
	mouseDown = true;
	// calculate the clicked location
	var mx = (event.clientX*2 - width)*(-zoom/1000.0); 
	var my = (-event.clientY*2 + height)*(-zoom/1000.0); 
	mouseXYs.push(mx);
    mouseXYs.push(my);
	
	// create a ring at the clicked location 
	createRing(mx, my); 
}

function handleMouseUp(event)
{
	mouseDown = false;
}