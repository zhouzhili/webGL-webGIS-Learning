import { setupWebGL, initShaders, pointsToBuffer } from 'GLHelper'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

function main() {
  const canvas = document.getElementById('gl-canvas')

  const gl = setupWebGL(canvas)
  if (!gl) {
    console.log('WebGL is not available')
  }

  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  const program = initShaders(gl, vertexShader, fragmentShader)
  gl.useProgram(program)

  const n = initVertexBuffers(gl, program)

  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, n)
}

function initVertexBuffers(gl, program) {
  const N = 3
  // 点位数组
  const vertices = [[0.0, 0.5], [-0.5, -0.5], [0.5, -0.5]]
  // 创建缓冲区
  const vertexBuffer = gl.createBuffer()
  // 绑定buffer绑定buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  // 设置数据
  gl.bufferData(gl.ARRAY_BUFFER, pointsToBuffer(vertices), gl.STATIC_DRAW)

  const aPosition = gl.getAttribLocation(program, 'aPosition')
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(aPosition)

  return N
}

main()
