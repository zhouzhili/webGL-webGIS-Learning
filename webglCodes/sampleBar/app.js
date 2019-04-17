import { setupWebGL, initShaders, pointsToBuffer } from 'GLHelper'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'
import { vec2 } from 'gl-matrix'

function main(data) {
  const canvas = document.getElementById('gl-canvas')

  const gl = setupWebGL(canvas)
  if (!gl) {
    console.log('WebGL is not available')
  }

  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  const program = initShaders(gl, vertexShader, fragmentShader)
  gl.useProgram(program)

  // 点位位置
  const aPosition = gl.getAttribLocation(program, 'aPosition')
  // 颜色位置
  const colorLocation = gl.getUniformLocation(program, 'uFragColor')

  // 创建缓冲区
  const vertexBuffer = gl.createBuffer()
  // 绑定 buffer绑定 buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

  //启用
  gl.enableVertexAttribArray(aPosition)
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

  // 获取没个数据的高度 - 映射
  const max = Math.max(...data)
  const min = Math.min(...data)
  const width = 2 / data.length
  const height = data.map(item => {
    return (1.9 / (max - min)) * item + (0.1 * (max - min) - 1.9 * min) / (max - min)
  })

  // 绘制
  height.forEach((el, index) => {
    let x1 = -1 + width * index
    let x2 = x1 + width - 0.05
    let y1 = -1
    let y2 = el - 1
    let rect = [
      vec2.fromValues(x1, y1),
      vec2.fromValues(x2, y1),
      vec2.fromValues(x1, y2),
      vec2.fromValues(x1, y2),
      vec2.fromValues(x2, y1),
      vec2.fromValues(x2, y2)
    ]
    // 设置数据
    gl.bufferData(gl.ARRAY_BUFFER, pointsToBuffer(rect), gl.STATIC_DRAW)
    // 设置颜色
    gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1)
    // 不请空会保留之前的数据
    // gl.clear(gl.COLOR_BUFFER_BIT)
    // 每次只绘制一个矩形，6个点
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  })
}

function randomData(count, min = 0, max = 300) {
  const data = []
  for (let i = 0; i < count; i++) {
    data.push(Math.floor(Math.random() * (max - min) + min))
  }
  return data
}
const data = randomData(15)
main(data)
