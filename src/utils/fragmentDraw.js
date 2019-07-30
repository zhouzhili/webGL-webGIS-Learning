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
      fragmentShader: `#ifdef GL_ES
        precision mediump float;
        #endif
        void main(){
          gl_FragColor=vec4(0.,0.,0.,1.);
        }`
    }
    const { enableTime, canvas, vertexShader, fragmentShader, basePath } = { ...defaultOpt, ...options }
    this.enableTime = enableTime
    this._animateInterval = null
    this.canvas = canvas
    this.gl = null
    this.program = null
    this.vertexShader = vertexShader
    this.fragmentShader = fragmentShader
    this.clock = null
    this.baseFragPath = basePath || './'
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
      this.gl.uniform1f(uTimeLocation, time / 1000)
      commonDraw()
      this._animateInterval = requestAnimationFrame(animateDraw)
    }

    const commonDraw = () => {
      this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
      this.gl.clear(this.gl.COLOR_BUFFER_BIT)
      this.gl.drawElements(this.gl.TRIANGLES, indexes.length * 3, this.gl.UNSIGNED_BYTE, 0)
    }

    if (this._animateInterval) {
      cancelAnimationFrame(this._animateInterval)
      console.log('clear animation frame')
    }

    if (this.enableTime && uTimeLocation) {
      console.log('start animate draw')
      this.clock = new Date().getTime()
      animateDraw()
    } else {
      commonDraw()
    }
  }

  /**
   * 提取include的glsl文件名
   * @param {String} glsl 
   * @returns {Object} arr {reg:'',target} reg:需要被替换的内容,target:glsl文件名
   */
  _getIncludeGLSL(glsl) {
    try {
      const reg = /#include <(.*?.glsl)>/g
      const arr = [];
      let r = null
      while (r = reg.exec(glsl)) {
        arr.push({
          reg: r[0],
          target: r[1]
        })
      }
      return arr
    } catch (error) {
      const errorMSg = 'the include format is not correct'
      console.log(errorMSg, error)
      throw error
    }
  }

  /**
   * 根据传入的code , 判断是否有include，替换其为真实的code ，异步
   * @param {String} glslCode 
   * @returns {String} code
   */
  async _formatterCode(glslCode) {
    try {
      let code = glslCode
      // 判断是否包含 #include <*.glsl>
      const reg = /#include <(.*?.glsl)>/g
      if (reg.test(code)) {
        // 替换 include代码
        const includes = this._getIncludeGLSL(code)
        await Promise.all(includes.map(async item => {
          const subCode = await this.loadGLSL(item.target)
          const formatSubCode = await this._formatterCode(subCode)
          code = code.replace(item.reg, formatSubCode)
        }))
      }
      return code
    } catch (err) {
      const errorMsg = `load ${fileName} glsl file failed,check Is the include format correct`
      console.error(errorMsg)
      throw new Error(errorMsg)
    }
  }
  /**
   * 加载GLSL文件，返回文件内容 ，异步
   * @param {String} name 文件路径
   * @returns {String} code 加载的glsl code 
   */
  async loadGLSL(name) {
    if (name) {
      const errorMsg = 'load glsl file failed: file name is ' + name
      try {
        const res = await fetch(this.baseFragPath + name)
        if (res.ok) {
          return await res.text()
        } else {
          throw errorMsg
        }
      } catch (error) {
        console.error(errorMsg)
        throw error
      }
    } else {
      console.error('glsl file name is required')
    }
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
   * 根据传入的片元着色器渲染, 异步
   * @param {String} fragmentShader
   * @param {String} vertexShader
   * @returns {String} code 返回真实运行的code
   */
  async renderByShader(fragmentShader, vertexShader) {
    try {
      this._initGL()
      const code = await this._formatterCode(fragmentShader)
      this._initProgram(code, vertexShader)
      this._initPlayground()
      return code
    } catch (err) {
      throw err
    }
  }
}