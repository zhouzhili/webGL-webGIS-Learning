import ThreeFactory from '@/utils/ThreeFactory'

const THREE = (window.THREE = require('three'))
require('three/examples/js/objects/Fire')
import { PlaneBufferGeometry } from 'three'

const ctx = new ThreeFactory({
  initGrid: true
})

ctx.init()

//const light = ctx.initLight()

const plan = new PlaneBufferGeometry(20, 20)

const fire = new THREE.Fire(plan, {
  textureWidth: 512,
  textureHeight: 512,
  debug: false
})

fire.position.y = -2

ctx.scene.add(fire)
