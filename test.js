import * as webGLAPI from './WebGL_API.js';



var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'',
'void main()',
'{',
'  fragColor = vertColor;',
'  gl_Position = vec4(vertPosition, 0.0, 1.0);',
' gl_PointSize = 30.0;',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'  gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');
//******************************** *


function flatten( v )
{
    if ( v.matrix === true ) {
        v = transpose( v );
    }

    var n = v.length;
    var elemsAreArrays = false;

    if ( Array.isArray(v[0]) ) {
        elemsAreArrays = true;
        n *= v[0].length;
    }

    var floats = new Float32Array( n );

    if ( elemsAreArrays ) {
        var idx = 0;
        for ( var i = 0; i < v.length; ++i ) {
            for ( var j = 0; j < v[i].length; ++j ) {
                floats[idx++] = v[i][j];
            }
        }
    }
    else {
        for ( var i = 0; i < v.length; ++i ) {
            floats[i] = v[i];
        }
    }

    return floats;
}

var program;

function createShaders(){




	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//
	// Create shaders
	// 
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	 program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}
}


function InitDemo  () {

    program = new webGLAPI.Program(vertexShaderText , fragmentShaderText)

    var box  = [
		1.0, 1.0,  
		-1.0, 1.0,  
		1.0, -1.0,   
		0.7, 0.7, 
    ]

    const indices = [
        3 ,2 ,1 ,  // first triangle
        3,1,0,   // second triangle
      ];


var pointsBuffer = new webGLAPI.VertexBuffer(new Float32Array(box) , 1 , 2);

var layout = new webGLAPI.bufferLayout();
let pos = {type: gl.FLOAT , count : 2 , normlized:gl.FALSE}
let color = {type: gl.FLOAT , count : 3 , normlized:gl.FALSE}

layout.pushAtr(pos);
// layout.pushAtr(color);


let vao =  new webGLAPI.VertexArray(pointsBuffer , layout);

    
	// var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	// gl.vertexAttribPointer(
	// 	0, // Attribute location
	// 	2, // Number of elements per attribute
	// 	gl.FLOAT, // Type of elements
	// 	gl.FALSE,
	// 	5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
	// 	0 // Offset from the beginning of a single vertex to this attribute
	// );
	
	// gl.vertexAttribPointer(
	// 	1, // Attribute location
	// 	3, // Number of elements per attribute
	// 	gl.FLOAT, // Type of elements
	// 	gl.FALSE,
	// 	5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
	// 	2*Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	// );


	// gl.enableVertexAttribArray( 0 );  
	// gl.enableVertexAttribArray( 1);  


	// var colorAttribLocation = gl.getUniformLocation(program, 'vertColor');

	// gl.uniform3f(colorAttribLocation , 1.0,0.0,0.0,);
    //var index = new  webGLAPI.IndexBuffer(new Uint16Array(indices) , 1);

    // gl.drawArrays(gl.TRIANGLES, 0, 3);
	let engine = new webGLAPI.Renderer(pointsBuffer , vao , program);
	  engine.drawRectangle(indices);
    

    }

    canvas.onload = InitDemo();

