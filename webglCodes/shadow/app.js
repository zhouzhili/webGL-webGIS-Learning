const THREE = (window.THREE = require('three'))
import ThreeFactory from '../../src/utils/ThreeFactory'

const ctx = new ThreeFactory()

ctx.init()
ctx.camera.position.set(100, 300, 100)
ctx.camera.lookAt(0, 0, 0)

// 平面，接收阴影
const plan = ctx.initPlan()
ctx.scene.add(plan)

// 添加聚光灯
const spotLight = ctx.initLight()
spotLight.position.set(60, 160, 0)
ctx.scene.add(spotLight)
// 添加球
const sphere = new THREE.SphereGeometry(20, 26, 26)
// 材质
const material = new THREE.MeshLambertMaterial({ color: 'red' })
const mesh = new THREE.Mesh(sphere, material)
mesh.castShadow = true
mesh.position.y = 30
ctx.scene.add(mesh)

// 添加光线辅助
var helper = new THREE.CameraHelper(spotLight.shadow.camera)
ctx.scene.add(helper)
