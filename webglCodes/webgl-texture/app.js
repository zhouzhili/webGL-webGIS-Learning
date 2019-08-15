import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

import { GRender } from '@/utils/fragmentDraw'
import { pointsToBuffer } from '@/GLHelper'

const gRender = new GRender({
  canvas: document.getElementById('gl-canvas'),
  vertexShader,
  fragmentShader
})

gRender._initGL()
gRender._initProgram()
const { gl, program } = gRender
const verticesTexCoords = [
  [-1.0, 1.0, 0.0, 1.0],
  [-1.0, 0.0, 0.0, 0.0],
  [0.0, 1.0, 1.0, 1.0],
  [0.0, 0.0, 1.0, 0.0],

  [0.0, 0.0, 0.0, 1.0],
  [0.0, -1.0, 0.0, 0.0],
  [1.0, 0.0, 1.0, 1.0],
  [1.0, -1.0, 1.0, 0.0]
]
const points = pointsToBuffer(verticesTexCoords)
const fSize = points.BYTES_PER_ELEMENT

const verticesBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)
gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)

const aPosition = gl.getAttribLocation(program, 'aPosition')
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, fSize * 4, 0)
gl.enableVertexAttribArray(aPosition)

const aTexCoord = gl.getAttribLocation(program, 'aTexCoord')
gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, fSize * 4, fSize * 2)
gl.enableVertexAttribArray(aTexCoord)

const texture = gl.createTexture()
const uSampler = gl.getUniformLocation(program, 'uSampler')

;(async () => {
  const image = await createTextureByUrl('./wall.jpg')

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
  gl.activeTexture(gl.TEXTURE0)

  gl.bindTexture(gl.TEXTURE_2D, texture)

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)

  gl.uniform1i(uSampler, 0)

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 8)
})()

function createTextureByUrl(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = url
    image.onload = () => {
      resolve(image)
    }
    image.onerror = () => {
      reject(null)
    }
  })
}
