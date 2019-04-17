import { setupWebGL, initShaders, pointsToBuffer } from 'GLHelper'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'
import { vec2, mat4, vec3 } from 'gl-matrix'

let gl
let uTranslateMatrix

// 旋转
let rotateMatrix = mat4.create()
// 平移
let translateMatrix = mat4.create()
// 缩放
let scale = mat4.create()

function main() {
  const canvas = document.getElementById('gl-canvas')

  gl = setupWebGL(canvas)
  if (!gl) {
    console.log('WebGL is not available')
  }

  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  const program = initShaders(gl, vertexShader, fragmentShader)
  gl.useProgram(program)

  // 点位位置
  const aPosition = gl.getAttribLocation(program, 'aPosition')
  // 平移变换矩阵
  uTranslateMatrix = gl.getUniformLocation(program, 'uTranslateMatrix')
  // 颜色位置
  const colorLocation = gl.getUniformLocation(program, 'uFragColor')
  //

  // 创建缓冲区
  const vertexBuffer = gl.createBuffer()
  // 绑定 buffer绑定 buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

  //启用
  gl.enableVertexAttribArray(aPosition)
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

  const point = [vec2.fromValues(-0.2, 0), vec2.fromValues(0.2, 0.0), vec2.fromValues(0, 0.2)]
  // 设置数据
  gl.bufferData(gl.ARRAY_BUFFER, pointsToBuffer(point), gl.STATIC_DRAW)
  // 设置颜色
  gl.uniform4f(colorLocation, 0, 0.5, 0, 1)
  //
  render()

  addEvent()
}

function addEvent() {
  document.getElementById('xRange').oninput = function(e) {
    mat4.translate(
      translateMatrix,
      mat4.create(),
      vec3.fromValues(Number(e.target.value), 0.0, 0.0)
    )
    render()
  }

  document.getElementById('yRange').oninput = function(e) {
    mat4.translate(
      translateMatrix,
      mat4.create(),
      vec3.fromValues(0.0, Number(e.target.value), 0.0)
    )
    render()
  }

  document.getElementById('zRotate').oninput = function(e) {
    const rotate = (e.target.value * Math.PI) / 180.0
    mat4.fromZRotation(rotateMatrix, rotate)
    render()
  }

  document.getElementById('scale').oninput = function(e) {
    mat4.scale(scale, mat4.create(), vec3.fromValues(Number(e.target.value), 1.0, 1.0))
    render()
  }
}

function render() {
  // 设置偏移值
  let matrix = mat4.create()
  // 先旋转和缩放，然后平移
  mat4.multiply(matrix, rotateMatrix, scale)
  mat4.multiply(matrix, matrix, translateMatrix)
  gl.uniformMatrix4fv(uTranslateMatrix, false, matrix)
  // 不请空会保留之前的数据
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}

main()
