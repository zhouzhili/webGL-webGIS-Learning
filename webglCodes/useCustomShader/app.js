const THREE = (window.THREE = require('three'))
import ThreeFactory from '../../src/utils/ThreeFactory'
import fragment from './fragment.glsl'
import vertex from './vertex.glsl'

const ctx = new ThreeFactory()
ctx.init()

const spotLight = ctx.initLight()
spotLight.position.set(60, 160, 30)
ctx.scene.add(spotLight)

const geo = new THREE.BoxBufferGeometry(1, 1, 1)

const width = ctx.renderer.domElement.width
const height = ctx.renderer.domElement.height

const uniforms = {
  uTime: { type: 'f', value: 1.0 },
  uResolution: { type: 'v2', value: new THREE.Vector2(width, height) }
}

const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: vertex,
  fragmentShader: fragment
})

const mesh = new THREE.Mesh(geo, material)
mesh.castShadow = true

ctx.camera.position.z = 10

ctx.scene.add(mesh)

ctx.renderCb = () => {
  uniforms.uTime.value += 0.05
}
