const THREE = (window.THREE = require('three'))
import ThreeFactory from '../../src/utils/ThreeFactory'

const ctx = new ThreeFactory()
ctx.init()

// 初始化平地
const plan = ctx.initPlan()
ctx.scene.add(plan)

// 随机颜色
function getColor() {
  const random = () => Math.ceil(Math.random() * 255)
  return `rgb(${random()},${random()},${random()})`
}

// 随机创建建筑物
function createBuild(height) {
  var box = new THREE.BoxGeometry(5, height, 10)
  let materials = new THREE.MeshLambertMaterial({ color: getColor() })
  var build = new THREE.Mesh(box, materials)
  build.castShadow = true
  return build
}

// 随机位置生成建筑
function randomCity() {
  let pos = []
  for (let i = 0; i < 100; i++) {
    let radian = Math.random() * Math.PI * 2
    let radius = Math.random() * 100
    let x = Math.cos(radian) * radius
    let z = Math.sin(radian) * radius
    pos.push({ x, z })
  }
  return pos
}

function initCity() {
  const pos = randomCity()
  const group = new THREE.Group()
  pos.forEach(p => {
    const { x, z } = p
    let height = Math.random() * 150
    let build = createBuild(height)
    build.position.set(x, height / 2, z)
    group.add(build)
  })
  ctx.scene.add(group)
}

function addLight() {
  // // 自然光
  const ambLight = new THREE.AmbientLight(0x606060)
  ctx.scene.add(ambLight)
  // // 平行光
  const direcLight = new THREE.DirectionalLight(0xffffff)
  direcLight.position.set(150, 150, 165)
  // // 投射阴影
  ctx.scene.add(direcLight)
}

const axis = new THREE.AxesHelper(200)
ctx.scene.add(axis)
ctx.camera.position.set(100, 300, 100)
ctx.camera.lookAt(0, 0, 0)

addLight()
initCity()
