const THREE = (window.THREE = require('three'))
import ThreeFactory from '../../src/utils/ThreeFactory'

const ctx = new ThreeFactory()
ctx.init()

ctx.camera.position.set(100, 120, 100)

const light = ctx.initLight()
light.position.set(50, 100, 60)
ctx.scene.add(light)

const box = new THREE.BoxGeometry(20, 20, 20)

const textureLoader = new THREE.TextureLoader()

// 方法一：多个贴图
const setTextureFun1 = () => {
  const imgList = [
    './images/bricks.jpg',
    './images/clouds.jpg',
    './images/crate.jpg',
    './images/stone-wall.jpg',
    './images/water.jpg',
    './images/wood-floor.jpg'
  ]
  const materials = imgList.map(imgPath => {
    const texture = textureLoader.load(imgPath)
    return new THREE.MeshBasicMaterial({ map: texture })
  })

  return new THREE.Mesh(box, materials)
}

// 方法二：UV贴图
const setTextureFun2 = () => {
  const texture = textureLoader.load('./images/texture-atlas.jpg')
  const m = new THREE.MeshBasicMaterial({ map: texture })
  /**
   *  4<----3
   *  |     |
   *  1---->2
   */
  const bricks = [
    new THREE.Vector2(0, 0.666),
    new THREE.Vector2(0.5, 0.666),
    new THREE.Vector2(0.5, 1),
    new THREE.Vector2(0, 1)
  ]
  const clouds = [
    new THREE.Vector2(0.5, 0.666),
    new THREE.Vector2(1, 0.666),
    new THREE.Vector2(1, 1),
    new THREE.Vector2(0.5, 1)
  ]
  const crate = [
    new THREE.Vector2(0, 0.333),
    new THREE.Vector2(0.5, 0.333),
    new THREE.Vector2(0.5, 0.666),
    new THREE.Vector2(0, 0.666)
  ]
  const stone = [
    new THREE.Vector2(0.5, 0.333),
    new THREE.Vector2(1, 0.333),
    new THREE.Vector2(1, 0.666),
    new THREE.Vector2(0.5, 0.666)
  ]
  const water = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.5, 0),
    new THREE.Vector2(0.5, 0.333),
    new THREE.Vector2(0, 0.333)
  ]
  const wood = [
    new THREE.Vector2(0.5, 0),
    new THREE.Vector2(1, 0),
    new THREE.Vector2(1, 0.333),
    new THREE.Vector2(0.5, 0.333)
  ]
  box.faceVertexUvs[0] = []
  box.faceVertexUvs[0][0] = [bricks[0], bricks[1], bricks[3]]
  box.faceVertexUvs[0][1] = [bricks[1], bricks[2], bricks[3]]

  box.faceVertexUvs[0][2] = [clouds[0], clouds[1], clouds[3]]
  box.faceVertexUvs[0][3] = [clouds[1], clouds[2], clouds[3]]

  box.faceVertexUvs[0][4] = [crate[0], crate[1], crate[3]]
  box.faceVertexUvs[0][5] = [crate[1], crate[2], crate[3]]

  box.faceVertexUvs[0][6] = [stone[0], stone[1], stone[3]]
  box.faceVertexUvs[0][7] = [stone[1], stone[2], stone[3]]

  box.faceVertexUvs[0][8] = [water[0], water[1], water[3]]
  box.faceVertexUvs[0][9] = [water[1], water[2], water[3]]

  box.faceVertexUvs[0][10] = [wood[0], wood[1], wood[3]]
  box.faceVertexUvs[0][11] = [wood[1], wood[2], wood[3]]

  return new THREE.Mesh(box, m)
}

const mesh = setTextureFun2()
mesh.position.y = 20
mesh.castShadow = true
ctx.scene.add(mesh)
// 添加光线辅助
var helper = new THREE.CameraHelper(light.shadow.camera)
ctx.scene.add(helper)

const box2 = new THREE.BoxGeometry(20, 20, 20)
const video = document.getElementById('cxk')
const cxk = new THREE.VideoTexture(video)
const mesh2 = new THREE.Mesh(box2, new THREE.MeshPhongMaterial({ map: cxk }))
mesh2.position.set(10, 10, 40)
ctx.scene.add(mesh2)
