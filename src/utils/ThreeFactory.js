const THREE = (window.THREE = require('three'))
require('three/examples/js/controls/OrbitControls')
import Stats from 'three/examples/js/libs/stats.min'

class ThreeFactory {
  constructor() {
    this.scene = null
    this.camera = null
    this.renderer = null
    this.stats = null
    this.controls = null
  }

  _initCamera(fov = 45, aspect, near = 0.1, far = 1000) {
    const defaultAspect = aspect || window.innerWidth / window.innerHeight
    const camera = new THREE.PerspectiveCamera(fov, defaultAspect, near, far)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    this.camera = camera
  }

  _initScene() {
    this.scene = new THREE.Scene()
  }

  _initRender() {
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    //告诉渲染器需要阴影效果
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
    document.body.appendChild(renderer.domElement)
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
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
  }

  _animate() {
    this.stats.update()
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this._animate.bind(this))
  }

  init() {
    this._initScene()
    this._initCamera()
    this._initRender()
    this._initStats()
    this._initController()
    this.renderer.render(this.scene, this.camera)
    this._animate()

    window.addEventListener('resize', this._onWindowResize.bind(this), false)
  }

  initPlan() {
    const geo = new THREE.CylinderGeometry(100, 100, 0.2, 32)
    // 接收阴影的材质
    const material = new THREE.MeshLambertMaterial({ color: 0xcccccc })
    const plan = new THREE.Mesh(geo, material)
    plan.receiveShadow = true
    return plan
  }

  initLight() {
    // 添加直射光
    const dLight = new THREE.DirectionalLight(0x444444)
    dLight.position.set(100, 100, 60)
    this.scene.add(dLight)

    // 添加聚光灯
    const light = new THREE.SpotLight({ color: '#ddd' })
    // 需要开启阴影投射
    light.castShadow = true
    return light
  }
}

export default ThreeFactory
