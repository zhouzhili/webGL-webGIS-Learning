import { create3DContext, initShaders, pointsToBuffer } from 'GLHelper'

export class GRender {
  constructor(options) {
    const defaultOpt = {
      enableTime: false,
      vertexShader: `#ifdef GL_ES
        precision mediump float;
          #endif

        attribute vec4 aPosition;

        void main(){
          gl_Position=aPosition;
          gl_PointSize=1.;
        }`,
      fragmentShader: `precision mediump float;
          void main() {
            gl_FragColor = vec4(0.0,0.0,0.0,1.0);
          }`
    }
    const { enableTime, canvas, vertexShader, fragmentShader } = { ...defaultOpt, ...options }
    this.enableTime = enableTime
    this._animateInterval = null
    this.canvas = canvas
    this.gl = null
    this.program = null
    this.vertexShader = vertexShader
    this.fragmentShader = fragmentShader
    this.clock = null
  }

  _initGL() {
    if (!this.canvas) {
      console.error('canvas element object is required!')
      return
    }
    this.gl = create3DContext(this.canvas)
  }

  _initProgram(fragmentShader, vertexShader) {
    const vertex = vertexShader || this.vertexShader
    const frag = fragmentShader || this.fragmentShader
    this.program = initShaders(this.gl, vertex, frag)
    this.gl.useProgram(this.program)
  }

  _initPlayground() {
    const aPosition = this.gl.getAttribLocation(this.program, 'aPosition')
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
    const indexBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, pointsToBuffer(indexes, Uint8Array), this.gl.STATIC_DRAW)

    // 顶点buffer
    const vertexBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, pointsToBuffer(vertices), this.gl.STATIC_DRAW)

    // 设置画布大小
    const uResolution = this.gl.getUniformLocation(this.program, 'uResolution')
    if (uResolution) {
      this.gl.uniform2f(uResolution, this.gl.canvas.width, this.gl.canvas.height)
    }

    this.gl.enableVertexAttribArray(aPosition)

    // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
    var size = 2;          // 每次迭代运行提取两个单位数据
    var type = this.gl.FLOAT;   // 每个单位的数据类型是32位浮点型
    var normalize = false; // 不需要归一化数据
    var stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
    // 每次迭代运行运动多少内存到下一个数据开始点
    var offset = 0;        // 从缓冲起始位置开始读取
    this.gl.vertexAttribPointer(
      aPosition, size, type, normalize, stride, offset)

    const uTimeLocation = this.gl.getUniformLocation(this.program, 'uTime')

    const animateDraw = () => {
      const time = new Date().getTime() - this.clock
      console.log('start', time)
      this.gl.uniform1f(uTimeLocation, time / 1000)
      commonDraw()
      this._animateInterval = requestAnimationFrame(animateDraw)
    }

    const commonDraw = () => {
      this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
      this.gl.clear(this.gl.COLOR_BUFFER_BIT)
      this.gl.drawElements(this.gl.TRIANGLES, indexes.length * 3, this.gl.UNSIGNED_BYTE, 0)
    }

    if (this.enableTime && uTimeLocation) {
      console.log('start animate draw')
      this.clock = new Date().getTime()
      animateDraw()
    } else {
      if (this._animateInterval) {
        cancelAnimationFrame(this._animateInterval)
        console.log('clear animation frame')
      }
      commonDraw()
    }
  }

  /**
   * 加载GLSL文件，返回文件内容
   * @param {String} path 文件路径
   */
  loadGLSL(path) {
    return new Promise((resolve, reject) => {
      fetch(path).then(res => res.text()).then(resp => {
        resolve(resp)
      }).catch(err => {
        reject(err)
      })
    })
  }

  /**
   * 
   */
  render() {
    this._initGL()
    this._initProgram()
    this._initPlayground()
  }

  /**
   * 根据传入的片元着色器渲染
   * @param {String} fragmentShader
   * @param {String} vertexShader
   */
  renderByShader(fragmentShader, vertexShader) {
    this._initGL()
    this._initProgram(fragmentShader, vertexShader)
    this._initPlayground()
  }
}