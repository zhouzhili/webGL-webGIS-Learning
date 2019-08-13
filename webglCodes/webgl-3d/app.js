import { GRender } from '@/utils/fragmentDraw'
import { mat4 } from 'gl-matrix'
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'

const gRender = new GRender({
  canvas: document.getElementById('gl-canvas'),
  fragmentShader: fragment,
  vertexShader: vertex
})

gRender._initGL()
gRender._initProgram()

const gl = gRender.gl
const program = gRender.program

gl.enable(gl.DEPTH_TEST)
initVertexBuffers()
initMatrix()

animateDraw()

function animateDraw() {
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, 36)
}

/**
 *
 * @param {WebGLRenderingContext} gl
 */
function initVertexBuffers() {
  const verticesColors = new Float32Array([
    -0.5,
    -0.5,
    -0.5,
    -0.5,
    0.5,
    -0.5,
    0.5,
    -0.5,
    -0.5,
    -0.5,
    0.5,
    -0.5,
    0.5,
    0.5,
    -0.5,
    0.5,
    -0.5,
    -0.5,

    -0.5,
    -0.5,
    0.5,
    0.5,
    -0.5,
    0.5,
    -0.5,
    0.5,
    0.5,
    -0.5,
    0.5,
    0.5,
    0.5,
    -0.5,
    0.5,
    0.5,
    0.5,
    0.5,

    -0.5,
    0.5,
    -0.5,
    -0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    -0.5,
    -0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    -0.5,

    -0.5,
    -0.5,
    -0.5,
    0.5,
    -0.5,
    -0.5,
    -0.5,
    -0.5,
    0.5,
    -0.5,
    -0.5,
    0.5,
    0.5,
    -0.5,
    -0.5,
    0.5,
    -0.5,
    0.5,

    -0.5,
    -0.5,
    -0.5,
    -0.5,
    -0.5,
    0.5,
    -0.5,
    0.5,
    -0.5,
    -0.5,
    -0.5,
    0.5,
    -0.5,
    0.5,
    0.5,
    -0.5,
    0.5,
    -0.5,

    0.5,
    -0.5,
    -0.5,
    0.5,
    0.5,
    -0.5,
    0.5,
    -0.5,
    0.5,
    0.5,
    -0.5,
    0.5,
    0.5,
    0.5,
    -0.5,
    0.5,
    0.5,
    0.5
  ])

  const FSize = verticesColors.BYTES_PER_ELEMENT

  var vertexColorBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)

  // 顶点
  const aPosition = gl.getAttribLocation(program, 'aPosition')
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, FSize * 3, 0)
  gl.enableVertexAttribArray(aPosition)

  // 颜色
  // const aColor = gl.getAttribLocation(program, 'aColor')
  // gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, FSize * 6, FSize * 3)
  // gl.enableVertexAttribArray(aColor)
}

function initMatrix() {
  // 视角矩阵，投影矩阵
  const viewMatrix = mat4.create()
  mat4.lookAt(viewMatrix, [0.2, 0.25, 0.25], [0, 0, 0], [0, 1, 0])

  const uViewMatrix = gl.getUniformLocation(program, 'uViewMatrix')
  gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix)

  const projectMatrix = mat4.create()
  mat4.perspective(projectMatrix, 60, 512 / 512, 1, 100)
  const uProjectMatrix = gl.getUniformLocation(program, 'uProjectMatrix')
  gl.uniformMatrix4fv(uProjectMatrix, false, projectMatrix)
}
