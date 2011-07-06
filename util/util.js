function degToRad(rot)
{
	return (rot*Math.PI/180); 
}

var matrices = [];
function pushMVMatrix()
{
	var copy = mat4.create(); 
	mat4.set(mvMatrix, copy); 
	matrices.push(copy); 
}

function popMVMatrix()
{
	if(mvMatrix.length == 0)
	{
		throw "Invalid MV matrix!"; 
	}	
	mvMatrix = matrices.pop(); 
}

var mvMatrix = mat4.create();
var pMatrix = mat4.create();
function setMatrixUniforms()
{
	var pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix"); 
	var mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

	gl.uniformMatrix4fv(pMatrixUniform, false, pMatrix); 
	gl.uniformMatrix4fv(mvMatrixUniform, false, mvMatrix); 
}	
