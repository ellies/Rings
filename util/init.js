var gl;
function initGL(canvas)
{
	try
	{
		gl = canvas.getContext("experimental-webgl"); 
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height; 
	}
	catch(e)
	{		
	}
	
	if(!gl)
	{
		alert("Could not initialize WebGL!"); 
	}	
}

var dotTexture; 
function initTexture(imgpath)
{
	var txture = gl.createTexture(); 
	txture.image = new Image(); 
	txture.image.onload = function() 
	{
		handleLoadedTexture(txture); 
	}
	
	txture.image.src = imgpath; 
	dotTexture = txture; 
}

function handleLoadedTexture(texture)
{
	gl.bindTexture(gl.TEXTURE_2D, texture); 
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); 
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image); 
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); 
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); 
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); 
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); 
	gl.bindTexture(gl.TEXTURE_2D, null); 
}

var shaderProgram; 
function initShaders()
{
	var fragShader = getShader(gl, "shader-fs"); 
	var vertexShader = getShader(gl, "shader-vs"); 
	
	shaderProgram = gl.createProgram(); 
	gl.attachShader(shaderProgram, fragShader); 
	gl.attachShader(shaderProgram, vertexShader); 
	gl.linkProgram(shaderProgram); 
	
	if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
	{
		alert("Could not initialize shaders"); 
	}
	
	gl.useProgram(shaderProgram); 
	
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);  
	shaderProgram.vertexTexCoordAttribute = gl.getAttribLocation(shaderProgram, "aVertexTexCoord");
	gl.enableVertexAttribArray(shaderProgram.vertexTexCoordAttribute);  
}

function getShader(gl, id)
{
	var shaderScript = document.getElementById(id); 
	if(!shaderScript)
	{
		return null;
	}
	
	var str = ""; 
	var child = shaderScript.firstChild; 	
	while(child)
	{
		if(child.nodeType == 3)
		{
			str += child.textContent; 
		}
	
		child = child.nextSibling; 
	}

	var shader; 
	if(shaderScript.type == "x-shader/x-fragment")
	{
		shader = gl.createShader(gl.FRAGMENT_SHADER); 
	}
	else if(shaderScript.type == "x-shader/x-vertex")
	{
		shader = gl.createShader(gl.VERTEX_SHADER); 
	}
	else
	{
		return null;
	}
	
	gl.shaderSource(shader, str); 
	gl.compileShader(shader); 
	
	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		alert(gl.getShaderInfoLog(shader));
		return null; 
	}
	
	return shader; 
}

var dotVertexPositionBuffer; 
var dotTextureCoordBuffer; 
function initBuffers()
{
	dotVertexPositionBuffer = gl.createBuffer(); 	
	gl.bindBuffer(gl.ARRAY_BUFFER, dotVertexPositionBuffer); 
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dotVertexPositions), gl.STATIC_DRAW); 
	dotVertexPositionBuffer.itemSize = 3; 
	dotVertexPositionBuffer.numItems = 4; 

	dotTextureCoordBuffer = gl.createBuffer(); 
	gl.bindBuffer(gl.ARRAY_BUFFER, dotTextureCoordBuffer); 
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dotVertexTextureCoords), gl.STATIC_DRAW); 
	dotTextureCoordBuffer.itemSize = 2;
	dotTextureCoordBuffer.numItems = 4; 
}
