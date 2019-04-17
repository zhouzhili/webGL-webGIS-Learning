const THREE = (window.THREE = require('three'))
import ThreeFactory from '../../src/utils/ThreeFactory'

const textureLoader = new THREE.TextureLoader()

const EARTH_RADIUS = 200

const ctx = new ThreeFactory()
ctx.init()

// 根据贴图创建地球
function createEarth(texture) {
  // 创建球体和材质
  const global = new THREE.SphereGeometry(EARTH_RADIUS, 100, 100)
  // 添加贴图
  const globeMaterial = new THREE.MeshStandardMaterial({ map: texture })
  const globeMesh = new THREE.Mesh(global, globeMaterial)
  const group = new THREE.Group()
  group.add(globeMesh)
  group.position.set(0, 0, 0)

  // 添加灯光
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 2)
  hemisphereLight.position.z = -200
  group.add(hemisphereLight)
  group.rotateY(Math.PI)
  return group
}

textureLoader.load('./images/earth.jpg', texture => {
  const group = createEarth(texture)
  ctx.scene.add(group)

  ctx.camera.position.set(0, 0, 600)
  ctx.camera.lookAt(0, 0, 0)
})
