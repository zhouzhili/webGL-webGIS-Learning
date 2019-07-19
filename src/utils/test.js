const vert = `
    attribute vec4 a_position;
    varying vec4 v_color;

    void main() {
      gl_Position = vec4(a_position.xy, 0.0, 1.0);
      v_color = gl_Position * 0.5 + 0.5;
    }`

const frag = `
    precision mediump float;

    varying vec4 v_color;
    uniform float time;

    void main() {
      gl_FragColor = v_color;
      gl_FragColor.r = v_color.r * 0.5 * (1.0 + sin(4.0*time) );
      gl_FragColor.g = v_color.g * 0.5 * (1.0 + sin(1.0 + 2.0*time) );
    }`

function animate(t) {
  gl.uniform1f(timeUniformLocation, t / 1000); // convert from milis to seconds
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(primitiveType, offset, count);
  requestAnimationFrame(animate)
}


var gl = document.getElementById("canvas").getContext('webgl');
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vert);
gl.compileShader(vertexShader);
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, frag);
gl.compileShader(fragmentShader);
var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.log(gl.getShaderInfoLog(fragmentShader))
  console.log(gl.getShaderInfoLog(vertexShader))
}

var timeUniformLocation = gl.getUniformLocation(program, "time");
var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
var positions = [
  -1, -1,
  -1, 1,
  1, 1,
  1, 1,
  1, -1,
  -1, -1,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(program);
gl.enableVertexAttribArray(positionAttributeLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
var size = 2;          // 2 components per iteration
var type = gl.FLOAT;   // the data is 32bit floats
var normalize = false; // don't normalize the data
var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(
  positionAttributeLocation, size, type, normalize, stride, offset)
// // draw
var primitiveType = gl.TRIANGLES;
var offset = 0;
var count = 6;
gl.drawArrays(primitiveType, offset, count);

animate()