const THREE = (window.THREE = require('three'))
require('three/examples/js/loaders/GLTFLoader')
require('three/examples/js/controls/OrbitControls')
import ThreeFactory from '../../src/utils/ThreeFactory'

const ctx = new ThreeFactory()

ctx.init()

const plan = ctx.initPlan()
plan.name = 'plan'
ctx.scene.add(plan)

ctx.camera.position.set(100, 90, 100)
ctx.camera.lookAt(0, 0, 0)

const spotLight = ctx.initLight()
spotLight.position.set(50, 100, 0)
ctx.scene.add(spotLight)

const loader = new THREE.GLTFLoader()
let mixer = null

// 加载模型
loader.load('./model/kgirls/scene.gltf', function(gltf) {
  const root = gltf.scene
  root.name = 'kGirls'
  ctx.scene.add(root)
  // 添加阴影
  root.traverse(obj => {
    if (obj.castShadow !== undefined) {
      obj.castShadow = true
      obj.receiveShadow = true
    }
  })
  root.scale.set(0.1, 0.1, 0.1)
  root.position.y = 20

  mixer = new THREE.AnimationMixer(root)
  gltf.animations.forEach(clip => {
    mixer.clipAction(clip).play()
  })
})

// 根据时钟调用动画
const clock = new THREE.Clock()
const updateAnimate = () => {
  mixer && mixer.update(clock.getDelta())
  requestAnimationFrame(updateAnimate)
}

updateAnimate()

// 射线拾取
// var raycaster = new THREE.Raycaster()
// var mouse = new THREE.Vector2()
// function onMouseClick(evt) {
//   mouse.x = (evt.clientX / window.innerWidth) * 2 - 1
//   mouse.y = (evt.clientY / window.innerHeight) * 2 - 1

//   raycaster.setFromCamera(mouse, ctx.camera)

//   const intersects = raycaster.intersectObjects(ctx.scene.children)
//   const plan = intersects.find(m => m.object.name === 'plan')

//   if (plan) {
//     const point = plan.point
//     const kGirls = ctx.scene.children.find(m => m.name === 'kGirls')
//     kGirls.position.x = -1 * point.x
//     kGirls.position.z = point.z
//   }

// }

// window.addEventListener('click', onMouseClick, false)
