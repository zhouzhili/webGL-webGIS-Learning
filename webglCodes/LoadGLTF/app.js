const THREE = (window.THREE = require('three'))
require('three/examples/js/loaders/GLTFLoader')
require('three/examples/js/controls/OrbitControls')
import ThreeFactory from '../../src/utils/ThreeFactory'

const ctx = new ThreeFactory()

ctx.init()

ctx.scene.add(ctx.initPlan())

const spotLight = ctx.initLight()
spotLight.position.set(100, 160, 0)
