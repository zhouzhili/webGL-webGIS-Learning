const THREE = (window.THREE = require('three'))
require('three/examples/js/loaders/GLTFLoader')
require('three/examples/js/controls/OrbitControls')
import Stats from 'three/examples/js/libs/stats.min'

var camera, scene, renderer, controls

function initRender() {
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  //告诉渲染器需要阴影效果
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
  document.body.appendChild(renderer.domElement)
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 100, 200)
  camera.lookAt(new THREE.Vector3(0, 0, 0))
}

function initScene() {
  scene = new THREE.Scene()
}

function initLight() {
  scene.add(new THREE.AmbientLight(0x444444))

  var light = new THREE.DirectionalLight(0xffffff)
  light.position.set(40, 60, 10)

  //告诉光需要开启阴影投射
  light.castShadow = true
  scene.add(light)
}

function initPlane() {
  const planeGeometry = new THREE.PlaneGeometry(100, 100)
  var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide })
  var plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.rotation.x = -0.5 * Math.PI
  plane.position.y = -0.1
  plane.receiveShadow = true //可以接收阴影
  scene.add(plane)
}

function loadGLTF() {
  var loader = new THREE.GLTFLoader()
  // 设置模型位置
  loader.setPath('model/model1/')
  loader.load(
    'scene.gltf',
    function(gltf) {
      gltf.scene.scale.set(0.1, 0.1, 0.1)
      gltf.scene.position.set(0, 0, 10)
      gltf.scene.castShadow = true
      gltf.scene.name = 'cat'
      scene.add(gltf.scene)
    },
    undefined,
    function(e) {
      console.error(e)
    }
  )
}

var stats
function initStats() {
  stats = new Stats()
  document.body.appendChild(stats.dom)
}

function initModal() {
  initPlane()
  loadGLTF()
}

function initController() {
  controls = new THREE.OrbitControls(camera, renderer.domElement)
}

function render() {
  renderer.render(scene, camera)
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  // renderer.gammaOutput = true
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
  render()
  // 刷新状态
  stats.update()
  // 刷新控制器
  controls.update()

  requestAnimationFrame(animate)
}

function draw() {
  initRender()
  initScene()
  initCamera()
  initLight()
  initModal()
  initController()
  initStats()
  render()
  animate()

  window.addEventListener('resize', onWindowResize, false)
}

draw()
