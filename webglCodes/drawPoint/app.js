import { create3DContext, initShaders } from 'GLHelper'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

function main() {
  const canvas = document.getElementById('gl-canvas')

  const gl = create3DContext(canvas)

  const program = initShaders(gl, vertexShader, fragmentShader)
  gl.useProgram(program)

  const aPosition = gl.getAttribLocation(program, 'aPosition')
  const uFragColor = gl.getUniformLocation(program, 'uFragColor')
  canvas.onmousedown = ev => canvasClick(ev, gl, canvas, aPosition, uFragColor)

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
}

const points = []
function canvasClick(ev, gl, canvas, aPosition, uFragColor) {
  const point = getClickPoint(ev, canvas)
  points.push(point)
  render(gl, aPosition, uFragColor)
}

function render(gl, aPosition, uFragColor) {
  gl.clear(gl.COLOR_BUFFER_BIT)
  for (let i = 0; i < points.length; i++) {
    gl.vertexAttrib3f(aPosition, points[i].x, points[i].y, 0.0)
    gl.uniform4f(uFragColor, points[i].color[0], points[i].color[1], points[i].color[2], 1.0)
    gl.drawArrays(gl.POINTS, 0, 1)
  }
}

function randomColor() {
  return [Math.random(), Math.random(), Math.random()]
}

function getClickPoint(ev, canvas) {
  let x = ev.clientX
  let y = ev.clientY
  let rect = ev.target.getBoundingClientRect()
  // 将坐标原点移到webgl的坐标原点，同时y坐标乘以-1
  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2)
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2)
  let color = randomColor()
  return {
    x,
    y,
    color
  }
}
main()
