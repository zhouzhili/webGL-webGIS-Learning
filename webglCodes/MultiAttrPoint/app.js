import { setupWebGL, initShaders, pointsToBuffer } from 'GLHelper'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'
import { vec2, vec3 } from 'gl-matrix'

let gl
function main() {
  const canvas = document.getElementById('gl-canvas')

  gl = setupWebGL(canvas)
  if (!gl) {
    console.log('WebGL is not available')
  }

  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(1.0, 1.0, 1.0, 1.0)

  const program = initShaders(gl, vertexShader, fragmentShader)
  gl.useProgram(program)

  //
  const pointAndColor = new Float32Array([
    0.0,
    0.5,
    1.0,
    0.0,
    0.0,
    -0.5,
    -0.5,
    0.0,
    1.0,
    0.0,
    0.5,
    -0.5,
    0.0,
    0.0,
    1.0
  ])
  // 创建缓冲区
  const vertexBuffer = gl.createBuffer()
  // 绑定 buffer绑定 buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  // 设置数据
  gl.bufferData(gl.ARRAY_BUFFER, pointAndColor, gl.STATIC_DRAW)
  const FSIZE = pointAndColor.BYTES_PER_ELEMENT
  // 点位位置
  const aPosition = gl.getAttribLocation(program, 'aPosition')
  //启用
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 5, 0)
  gl.enableVertexAttribArray(aPosition)

  const aColor = gl.getAttribLocation(program, 'aColor')
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2)
  gl.enableVertexAttribArray(aColor)
  //
  render()
}

function render() {
  // 不请空会保留之前的数据
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}

main()
