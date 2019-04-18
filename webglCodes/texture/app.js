const THREE = (window.THREE = require('three'))
import ThreeFactory from '../../src/utils/ThreeFactory'

const ctx = new ThreeFactory()
ctx.init()

const plan = ctx.initPlan()
ctx.scene.add(plan)

const spotLight = ctx.initLight()
spotLight.lookAt(plan)

ctx.scene.add(spotLight)
