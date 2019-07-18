import { create3DContext, initShaders, pointsToBuffer } from 'GLHelper'

/**
 * 初始化绘图，提供默认的顶点着色器
 * @param {String} fragmentShader 
 * @param {String} vShader
 */
export function initWebGLDraw(fragmentShader, vShader) {

  const canvas = document.getElementById('gl-canvas')

  const gl = create3DContext(canvas)

  const vertexShader = vShader || `
  #ifdef GL_ES
  precision mediump float;
  #endif

  attribute vec4 aPosition;

  void main(){
    gl_Position=aPosition;
    gl_PointSize=1.;
  }
  `

  const program = initShaders(gl, vertexShader, fragmentShader)
  gl.useProgram(program)

  const aPosition = gl.getAttribLocation(program, 'aPosition')

  const vertices = [
    [-1.0, -1.0],
    [1.0, -1.0],
    [1.0, 1.0],
    [-1.0, 1.0]
  ];

  const indexes = [
    [0, 1, 3],
    [3, 1, 2]
  ];

  // 索引buffer
  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, pointsToBuffer(indexes, Uint8Array), gl.STATIC_DRAW)

  // 顶点buffer
  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, pointsToBuffer(vertices), gl.STATIC_DRAW)

  // 设置画布大小
  const uResolution = gl.getUniformLocation(program, 'uResolution')
  gl.uniform2f(uResolution, gl.canvas.width, gl.canvas.height)

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

  gl.drawElements(gl.TRIANGLES, indexes.length * 3, gl.UNSIGNED_BYTE, 0)
}