const THREE = (window.THREE = require('three'))
import ThreeFactory from '../../src/utils/ThreeFactory'

const textureLoader = new THREE.TextureLoader()

const EARTH_RADIUS = 200

const ctx = new ThreeFactory()
ctx.init()

// 经纬度转XYZ坐标
function lngLat2XYZ(lng, lat, alt = 0) {
  const rLat = lat * (Math.PI / 180)
  const rLng = lng * (Math.PI / 180)
  const radius = alt + EARTH_RADIUS
  const x = radius * Math.cos(rLat) * Math.cos(rLng)
  const y = radius * Math.cos(rLat) * Math.sin(rLng)
  const z = radius * Math.sin(rLat)
  // ;(x = -(radius * Math.sin(phi) * Math.cos(theta))),
  //   (z = radius * Math.sin(phi) * Math.sin(theta)),
  //   (y = radius * Math.cos(phi))

  return { x, y, z }
}

function convertToSphereCoords(coordinates_array, sphere_radius = EARTH_RADIUS) {
  var lon = coordinates_array[0]
  var lat = coordinates_array[1]

  const x = Math.cos((lat * Math.PI) / 180) * Math.cos((lon * Math.PI) / 180) * sphere_radius
  const y = Math.cos((lat * Math.PI) / 180) * Math.sin((lon * Math.PI) / 180) * sphere_radius
  const z = Math.sin((lat * Math.PI) / 180) * sphere_radius

  return { x, y, z }
}

// 根据贴图创建地球
function createEarth(texture) {
  // 创建球体和材质
  const global = new THREE.SphereGeometry(EARTH_RADIUS, 100, 100)
  const globeMaterial = new THREE.MeshStandardMaterial({ map: texture })
  const globeMesh = new THREE.Mesh(global, globeMaterial)
  const group = new THREE.Group()
  group.add(globeMesh)
  group.position.set(0, 0, 0)

  // 添加灯光
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 2)
  hemisphereLight.position.x = 0
  hemisphereLight.position.y = 0
  hemisphereLight.position.z = -200
  group.add(hemisphereLight)

  return group
}

textureLoader.load('./earth.jpg', texture => {
  const group = createEarth(texture)
  ctx.scene.add(group)

  ctx.camera.position.set(0, 0, 600)
  ctx.camera.lookAt(0, 0, 0)
})
