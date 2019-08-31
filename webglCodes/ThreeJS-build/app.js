import ThreeFactory from '@/utils/ThreeFactory'
import ExtrudeGeoJson from '@/utils/extrudeGeoJson'
import { MeshBasicMaterial } from 'three'

const ctx = new ThreeFactory({
  cameraOpt: {
    far: 5000
  },
  renderOpt: {
    clearColor: '#1C2025'
  },
  initGrid: false
})
ctx.init()

ctx.camera.position.set(0, 1000, 0)
ctx.camera.lookAt(0, 0, 0)

const extrude = new ExtrudeGeoJson('./china.json')

extrude.render().then(() => {
  extrude.group.scale.set(0.0001, 0.0001, 1)
  ctx.scene.add(extrude.group)
})

ctx.mouseClickHandle = insect => {
  if (insect.length > 0) {
    const object = insect[0].object
    const group = extrude.findGroup(object)
    if (group) {
      console.log(group.userData.originData.name)

      const material = new MeshBasicMaterial({ color: '#0099FF' })
      const material2 = new MeshBasicMaterial({ color: '#0099CC' })
      extrude.highlight(group, [material, material2])
    }
  }
}
