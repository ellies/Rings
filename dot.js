/** Dot class - component of Ring*/

/** position and color*/
var x, y, r, g, b;
var dx=0;
var prevdx = 0;
var dxval=0;
var rotYspeed=0;
var rotYangle=0;
var radialspeed=0;
var incr = 0; 
var radius =0;
var fpms = 0; 
var radfpms = 0; 

function Dot(x0, y0, dxval0, dx0, rotYspeed0, radialspeed0)
{
	this.x = x0;   
	this.y = y0;   
	this.dx = dx0; 
	this.prevdx = dx0; 
	this.dxval = dxval0;

	if(dxval0 >= 0)
		this.incr = -0.01;
	else
		this.incr = 0.01;

	this.rotYangle = 0;
	this.rotYspeed = rotYspeed0; 
	this.radius = 0;
	this.radialspeed = radialspeed0; 
	this.fpms = 0.03;
	this.radfpms = 0.015;
	
	this.randomizeColor(); 
}

Dot.prototype.draw = function(rotXangle, rotZangle)
{
	pushMVMatrix(); 
	mat4.rotate(mvMatrix, degToRad(this.rotYangle), [0,1,0]); 
	mat4.translate(mvMatrix, [this.dx+this.radius, this.radius, this.radius]); 		
	mat4.rotate(mvMatrix, degToRad(-this.rotYangle), [0,1,0]); 
	mat4.rotate(mvMatrix, degToRad(-rotXangle), [1,0,0]); 
	mat4.rotate(mvMatrix, degToRad(rotZangle), [0,0,1]); 

	var col = gl.getUniformLocation(shaderProgram, "uColor"); 
	gl.uniform3f(col, this.r, this.g, this.b); 

	drawADot(); 			
	popMVMatrix(); 
};

function drawADot()
{
	gl.activeTexture(gl.TEXTURE0); 
	gl.bindTexture(gl.TEXTURE_2D, dotTexture); 
	var sampler = gl.getUniformLocation(shaderProgram, "uSampler"); 
	gl.uniform1i(sampler, 0); 

	gl.bindBuffer(gl.ARRAY_BUFFER, dotVertexPositionBuffer); 
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, dotVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0); 
	gl.bindBuffer(gl.ARRAY_BUFFER, dotTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexTexCoordAttribute, dotTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0); 
	
	setMatrixUniforms(); 
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, dotVertexPositionBuffer.numItems);  	
}

Dot.prototype.animate = function(elapsedTime)
{
	this.rotYangle += this.rotYspeed * this.fpms * elapsedTime; 
	this.radius += this.radialspeed * this.radfpms * elapsedTime; 
	this.prevdx = this.dx;
	this.dx += this.incr * this.fpms * elapsedTime; 

	if(Math.abs(this.radius) >= 3)
		this.radialspeed *= -1; 

	if(this.prevdx * this.dx <= 0.0)
	{
		this.dx += this.dxval; 		
		this.randomizeColor(); 
	}
};

Dot.prototype.randomizeColor = function()
{
	this.r = Math.random()*0.8; 
	this.g = Math.random()*0.8; 
	this.b = Math.random()*0.8; 
};
