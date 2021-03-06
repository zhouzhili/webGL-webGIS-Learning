const THREE = (window.THREE = require('three'))
require('three/examples/js/controls/OrbitControls')
import Stats from 'three/examples/js/libs/stats.min'

class ThreeFactory {
  constructor(opts) {
    this.scene = null
    this.camera = null
    this.renderer = null
    this.stats = null
    this.controls = null
    this.opts = { el: null, initLight: false, initGrid: false, ...opts }
    this.renderCb = null
    this.mouseClickHandle = null
    this.rayCaster = new THREE.Raycaster()
  }

  _initCamera() {
    const { cameraOpt } = this.opts
    const defOpt = {
      fav: 45,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 1000,
      ...cameraOpt
    }
    const camera = new THREE.PerspectiveCamera(defOpt.fav, defOpt.aspect, defOpt.near, defOpt.far)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    this.camera = camera
  }

  _initScene() {
    this.scene = new THREE.Scene()
  }

  _initRender() {
    const { renderOpt } = this.opts
    const renderer = new THREE.WebGLRenderer({ antialias: true, ...renderOpt })
    //告诉渲染器需要阴影效果
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
    if (this.opts.el) {
      renderer.setSize(this.opts.el.innerWidth, this.opts.el.innerHeight)
      this.opts.el.appendChild(renderer.domElement)
    } else {
      renderer.setSize(window.innerWidth, window.innerHeight)
      document.body.appendChild(renderer.domElement)
    }
    const clearColor = (renderOpt && renderOpt.clearColor) || '#ccccff'
    renderer.setClearColor(clearColor)
    this.renderer = renderer
  }

  _initStats() {
    const stats = new Stats()
    document.body.appendChild(stats.dom)
    this.stats = stats
  }

  _onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  _initController() {
    const controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
    controls.enablePan = true
    controls.keyPanSpeed = 7.0
    this.controls = controls
  }

  _animate() {
    this.stats.update()
    this.controls.update()

    if (typeof this.renderCb === 'function') {
      this.renderCb()
    }
    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(this._animate.bind(this))
  }

  init() {
    this._initScene()
    this._initCamera()
    this.initGrid()
    this._initRender()
    this._initStats()
    this._initController()
    if (this.opts.initLight) {
      this._initDirecLight()
    }
    this.renderer.render(this.scene, this.camera)
    this._animate()

    window.addEventListener('resize', this._onWindowResize.bind(this), false)
    this.renderer.domElement.addEventListener('click', this._onMouseClick.bind(this), false)
  }

  initGrid() {
    const { gridOpt, initGrid } = this.opts
    if (initGrid) {
      const gridSetting = {
        size: 200,
        division: 20,
        color1: '#555',
        color2: '#555',
        ...gridOpt
      }
      const grid = new THREE.GridHelper(gridSetting.size, gridSetting.division, gridSetting.color1, gridSetting.color2)
      this.scene.add(grid)
      this.grid = grid
    }
  }

  /**
   * return plan
   */
  initPlan() {
    const geo = new THREE.CylinderGeometry(100, 100, 0.2, 32)
    // 接收阴影的材质
    const material = new THREE.MeshLambertMaterial({ color: 0xcccccc })
    const plan = new THREE.Mesh(geo, material)
    plan.receiveShadow = true
    return plan
  }

  /**
   * return {SpotLight}
   */
  initLight() {
    // 环境光-均匀的照亮场景中的所有物体,不能投射阴影
    const Alight = new THREE.AmbientLight(0x404040)
    this.scene.add(Alight)

    // 添加聚光灯
    const light = new THREE.SpotLight({ color: '#fff' })
    // 需要开启阴影投射
    light.castShadow = true
    return light
  }

  _initDirecLight() {
    // 平行光-模拟太阳光，可以投射阴影
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    this.scene.add(directionalLight)
  }

  _onMouseClick(e) {
    const mouse = new THREE.Vector2()

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

    this.rayCaster.setFromCamera(mouse, this.camera)

    // 同事检查所有的后代
    const intersects = this.rayCaster.intersectObjects(this.scene.children, true)

    if (typeof this.mouseClickHandle === 'function') {
      this.mouseClickHandle(intersects)
    }
  }

  /**
   * 根据name值移除Mesh
   * @param {} name
   */
  removeObjectByName(name) {
    this.scene.children.forEach(m => {
      if (m instanceof THREE.Mesh) {
        if (m.name === name) {
          this.scene.remove(m)
          return true
        }
      }
    })
  }
}

export default ThreeFactory
