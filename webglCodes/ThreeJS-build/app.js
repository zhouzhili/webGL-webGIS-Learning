import ThreeFactory from '@/utils/ThreeFactory'
import ExtrudeGeoJson from '@/utils/extrudeGeoJson'
import { BoxGeometry, LineBasicMaterial, SpotLight, MeshLambertMaterial, Mesh } from 'three'
import { GUI } from 'dat.gui'

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

const directionalLight = new THREE.DirectionalLight(0x343434, 2)
ctx.scene.add(directionalLight)

const Alight = new THREE.AmbientLight(0xb6b6b6)
ctx.scene.add(Alight)

const spotLight = new SpotLight(0xf5f1f1, 0.6)
spotLight.position.set(0, 500, -0)
spotLight.angle = Math.PI / 4
spotLight.penumbra = 0.05
spotLight.decay = 2
spotLight.distance = 800
spotLight.castShadow = true
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.near = 10
spotLight.shadow.camera.far = 200
ctx.scene.add(spotLight)

const geo = new BoxGeometry(1000, 1, 1000)
// 接收阴影的材质
const plan = new Mesh(geo, new MeshLambertMaterial({ color: '#1C2025' }))
plan.position.y = -3
plan.receiveShadow = true
ctx.scene.add(plan)

const materialFront = new MeshLambertMaterial({ color: 0xf31d2, transparent: true, opacity: 0.52 })
const extrude = new ExtrudeGeoJson('./china_all.geojson', {
  extrudeHeight: 50,
  showEdge: false,
  meshMaterial: materialFront
})

extrude.render().then(() => {
  extrude.group.scale.set(0.0001, 0.0001, 1)
  ctx.scene.add(extrude.group)
  // 保证坐标中心一致
  const center = extrude.setting.center
  addLineGeo(center)
})

let lineGroup = null
const lineMaterial = new LineBasicMaterial({ color: 0x182e52, linewidth: 1 })
function addLineGeo(center) {
  const lineGeo = new ExtrudeGeoJson('./china_division.geojson', {
    lineMaterial: lineMaterial,
    lineHeight: 49,
    center,
    extrude: false
  })

  lineGeo.render().then(() => {
    lineGeo.group.scale.set(0.0001, 0.0001, 1)
    ctx.scene.add(lineGeo.group)
    lineGroup = lineGeo.group
  })
}

const gui = new GUI()
function buildMeshGui() {
  var folder = gui.addFolder('挤出的面材质')
  var params = {
    'material color': materialFront.color.getHex(),
    'extrude height': 50,
    transparent: materialFront.transparent,
    opacity: materialFront.opacity
  }
  folder.addColor(params, 'material color').onChange(function(val) {
    if (typeof value === 'string') {
      value = value.replace('#', '0x')
    }
    extrude.group.children[0].children.forEach(g => {
      g.children[0].material.color.setHex(val)
    })
  })
  folder.add(params, 'extrude height', 0, 100).onChange(function(val) {
    extrude.group.children[0].children.forEach(g => {
      g.children[0].position.z = val
    })
  })
  folder.add(params, 'transparent').onChange(function(val) {
    extrude.group.children[0].children.forEach(g => {
      g.children[0].material.transparent = val
    })
  })
  folder
    .add(params, 'opacity', 0, 1)
    .step(0.01)
    .onChange(function(val) {
      extrude.group.children[0].children.forEach(g => {
        g.children[0].material.opacity = val
      })
    })
}

function buildLineGui() {
  var folder = gui.addFolder('线材质')
  var params = {
    'z value': 49,
    'material color': lineMaterial.color.getHex(),
    transparent: lineMaterial.transparent,
    opacity: lineMaterial.opacity
  }

  folder.addColor(params, 'material color').onChange(function(val) {
    if (typeof value === 'string') {
      value = value.replace('#', '0x')
    }
    lineGroup.children.forEach(g => {
      g.children[0].children[0].material.color.setHex(val)
    })
  })
  folder.add(params, 'transparent').onChange(function(val) {
    lineGroup.children.forEach(g => {
      g.children[0].children[0].material.transparent = val
    })
  })
  folder
    .add(params, 'opacity', 0, 1)
    .step(0.01)
    .onChange(function(val) {
      lineGroup.children.forEach(g => {
        g.children[0].children[0].material.opacity = val
      })
    })

  folder.add(params, 'z value', -10, 100).onChange(function(val) {
    lineGroup.children.forEach(g => {
      g.children[0].children[0].position.z = val
    })
  })
}

function lightGui() {
  var params = {
    lightHelper: false,
    'light color': spotLight.color.getHex(),
    intensity: spotLight.intensity,
    distance: spotLight.distance,
    angle: spotLight.angle,
    penumbra: spotLight.penumbra,
    decay: spotLight.decay
  }
  const lightHelper = new THREE.SpotLightHelper(spotLight)
  const render = () => {
    if (params.lightHelper) {
      lightHelper.update()
    }
    ctx.renderer.render(ctx.scene, ctx.camera)
  }
  var folder = gui.addFolder('点状灯光')
  folder.add(params, 'lightHelper', false).onChange(function(val) {
    if (val) {
      ctx.scene.add(lightHelper)
    } else {
      ctx.scene.remove(lightHelper)
    }
    render()
  })
  folder.addColor(params, 'light color').onChange(function(val) {
    spotLight.color.setHex(val)
    render()
  })
  folder.add(params, 'intensity', 0, 2).onChange(function(val) {
    spotLight.intensity = val
    render()
  })
  folder.add(params, 'distance', 50, 200).onChange(function(val) {
    spotLight.distance = val
    render()
  })
  folder.add(params, 'angle', 0, Math.PI / 3).onChange(function(val) {
    spotLight.angle = val
    render()
  })
  folder.add(params, 'penumbra', 0, 1).onChange(function(val) {
    spotLight.penumbra = val
    render()
  })
  folder.add(params, 'decay', 1, 2).onChange(function(val) {
    spotLight.decay = val
    render()
  })
}

function direcLightGui() {
  var params = {
    color: directionalLight.color.getHex(),
    intensity: directionalLight.intensity
  }
  var folder = gui.addFolder('直射光')

  folder.addColor(params, 'color').onChange(function(val) {
    directionalLight.color.setHex(val)
    ctx.renderer.render(ctx.scene, ctx.camera)
  })

  folder.add(params, 'intensity', 1, 2).onChange(function(val) {
    directionalLight.intensity = val
    ctx.renderer.render(ctx.scene, ctx.camera)
  })
}

function AmbientLightGui() {
  var params = {
    color: Alight.color.getHex(),
    intensity: Alight.intensity
  }
  var folder = gui.addFolder('环境光')

  folder.addColor(params, 'color').onChange(function(val) {
    Alight.color.setHex(val)
    ctx.renderer.render(ctx.scene, ctx.camera)
  })

  folder.add(params, 'intensity', 1, 2).onChange(function(val) {
    Alight.intensity = val
    ctx.renderer.render(ctx.scene, ctx.camera)
  })
}

buildMeshGui()
buildLineGui()
lightGui()
direcLightGui()
AmbientLightGui()
