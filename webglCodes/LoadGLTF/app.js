const THREE = (window.THREE = require('three'))
require('three/examples/js/loaders/GLTFLoader')
require('three/examples/js/controls/OrbitControls')
import ThreeFactory from '../../src/utils/ThreeFactory'

const ctx = new ThreeFactory()

ctx.init()
ctx.camera.position.set(100, 200, 0)

const plan = ctx.initPlan()
ctx.scene.add(plan)

const spotLight = ctx.initLight()
spotLight.position.set(50, 50, 20)
spotLight.castShadow = true
//
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024

const cam = spotLight.shadow.camera
cam.near = 10
cam.far = 5000
cam.left = -500
cam.right = 500
cam.top = 500
cam.bottom = -500

ctx.scene.add(spotLight)

const loader = new THREE.GLTFLoader()
let mixer = null

// 加载模型
loader.load('./model/kgirls/scene.gltf', function(gltf) {
  const root = gltf.scene
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

  console.log(gltf)
})

const spotHelper = new THREE.SpotLightHelper(spotLight)
ctx.scene.add(spotHelper)

// 根绝时钟调用动画
const clock = new THREE.Clock()
const updateAnimate = () => {
  mixer && mixer.update(clock.getDelta())
  requestAnimationFrame(updateAnimate)
}

updateAnimate()
// const helper = new THREE.CameraHelper(ctx.camera)
// ctx.scene.add(helper)
