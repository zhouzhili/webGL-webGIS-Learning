import * as THREE from 'three/build/three.module'
import ThreeFactory from '@/utils/ThreeFactory'

const ctx = new ThreeFactory()
ctx.init()

ctx.camera.position.y = 100
ctx.camera.lookAt(0, 0, 0)

const textureLoader = new THREE.TextureLoader()
const snow1 = textureLoader.load('./snowflake2.png')
const snow2 = textureLoader.load('./snowflake5.png')

const params = {
  snow1: {
    color: [1.0, 0.2, 0.5],
    texture: snow1,
    size: 20
  },
  snow2: {
    color: [0.85, 0, 0.5],
    texture: snow2,
    size: 8
  }
}

function initSnow() {
  const points = []
  for (let i = 0; i < 10000; i++) {
    const x = Math.random() * 2000 - 1000
    const y = Math.random() * 2000 - 1000
    const z = Math.random() * 2000 - 1000
    points.push(x, y, z)
  }

  Object.keys(params).forEach(key => {
    const { color, size, texture } = params[key]
    const geometry = new THREE.BufferGeometry()
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(points, 3))

    const material = new THREE.PointsMaterial({
      size: size,
      map: texture,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    })
    material.color.setHSL(color[0], color[1], color[2])

    const particles = new THREE.Points(geometry, material)

    ctx.scene.add(particles)
  })
}

initSnow()

ctx.renderCb = () => {
  const time = Date.now() * 0.0002
  for (let i = 0; i < ctx.scene.children.length; i++) {
    const obj = ctx.scene.children[i]
    if (obj instanceof THREE.Points) {
      obj.rotation.y = time * (i < 1 ? i + 1 : -(i + 1))
      const h = ((360 * (1.0 + time)) % 360) / 360
      obj.material.color.setHSL(h, 0.2, 0.5)
    }
  }
}
