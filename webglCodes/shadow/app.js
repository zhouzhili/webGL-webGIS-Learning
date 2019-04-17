const THREE = (window.THREE = require('three'))
import ThreeFactory from '../../src/utils/ThreeFactory'

const ctx = new ThreeFactory()

ctx.init()
ctx.camera.position.set(100, 300, 100)
ctx.camera.lookAt(0, 0, 0)

// 平面，接收阴影
const plan = ctx.initPlan()
plan.position.set(0, 0, 0)
plan.receiveShadow = true
ctx.scene.add(plan)

// 添加聚光灯
const light = new THREE.SpotLight({ color: '#ddd' })
light.position.set(60, 160, 0)
//告诉平行光需要开启阴影投射
light.castShadow = true
ctx.scene.add(light)
// 添加直射光
const dLight = new THREE.DirectionalLight(0x444444)
dLight.position.set(100, 100, 60)
ctx.scene.add(dLight)

// 添加球
const sphere = new THREE.SphereGeometry(20, 26, 26)
// 材质
const material = new THREE.MeshLambertMaterial({ color: 'red' })
const mesh = new THREE.Mesh(sphere, material)
mesh.castShadow = true
mesh.position.y = 30
ctx.scene.add(mesh)

// 添加光线辅助
var helper = new THREE.CameraHelper(light.shadow.camera)
ctx.scene.add(helper)
