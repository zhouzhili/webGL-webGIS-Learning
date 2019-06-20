import { create3DContext, initShaders } from 'GLHelper'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

const canvas = document.getElementById('gl-canvas')

const gl = create3DContext(canvas)

const program = initShaders(gl, vertexShader, fragmentShader)
gl.useProgram(program)

const aPosition = gl.getAttribLocation(program, 'aPosition')

const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

const points = [
  0, 0,
  0, 1.0,
  0.7, 0
]
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW)

gl.clearColor(0.0, 0.0, 0.0, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)

gl.enableVertexAttribArray(aPosition)

// 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
var size = 2;          // 每次迭代运行提取两个单位数据
var type = gl.FLOAT;   // 每个单位的数据类型是32位浮点型
var normalize = false; // 不需要归一化数据
var stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
// 每次迭代运行运动多少内存到下一个数据开始点
var offset = 0;        // 从缓冲起始位置开始读取
gl.vertexAttribPointer(
  aPosition, size, type, normalize, stride, offset)

// 绘制三角形，画3个点
gl.drawArrays(gl.LINES, 0, 2)