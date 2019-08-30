import ThreeFactory from '@/utils/ThreeFactory'
import ExtrudeGeoJson from './extrudeGeoJson'
import * as THREE from 'three/build/three.module'

const ctx = new ThreeFactory({
  cameraOpt: {
    far: 5000
  },
  gridOpt: {}
})
ctx.init()

ctx.camera.position.set(10, 1000, 100)
ctx.camera.lookAt(0, 0, 0)

const extrude = new ExtrudeGeoJson('./data.geojson', {
  center: [114.3977955, 30.480301799999999]
})

extrude.render().then(() => {
  console.log(extrude.group)
  ctx.scene.add(extrude.group)
})

ctx.scene.add(new THREE.AxesHelper(300))
