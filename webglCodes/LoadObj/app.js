const THREE = (window.THREE = require('three'))
require('three/examples/js/loaders/MTLLoader')
require('three/examples/js/loaders/OBJLoader')
require('three/examples/js/loaders/DDSLoader')
require('three/examples/js/loaders/GLTFLoader')
require('three/examples/js/controls/OrbitControls')
import ThreeFactory from '../../src/utils/ThreeFactory'

const ctx = new ThreeFactory()

ctx.init()

ctx.renderer.setClearColor('#eee', 0.0)
ctx.scene.background = new THREE.Color('#eee')

ctx.scene.add(new THREE.AmbientLight(0xffffff))

const group = new THREE.Group()
group.rotation.x += Math.PI / -2
ctx.scene.add(group)

const objList = ['Tile_+000_+000', 'Tile_+000_+001', 'Tile_+000_+002', 'Tile_+000_+003']
objList.forEach(n => {
  loadObj(n).then(obj => {
    group.add(obj)
    const addCount = group.children.length
    document.querySelector('.bar').style.width = `${addCount / 4 * 100}%`
    if (addCount === 4) {
      const box = new THREE.Box3()
      box.expandByObject(group)
      const getCenter = axis => (box.min[axis] + box.max[axis]) / 2
      group.position.x -= getCenter('x')
      group.position.y -= getCenter('y') - 10
      group.position.z -= getCenter('z')
      ctx.camera.position.x = 30
      ctx.camera.position.y = 200
      setTimeout(() => document.getElementById('loading').style.display = 'none', 1000)
    }
  })
})

function loadObj(folder) {
  document.querySelector('.bar').style.width = `0%`
  return new Promise((resolve) => {
    var mtlLoader = new THREE.MTLLoader()
    mtlLoader.setPath(`./${folder}/`)
    mtlLoader.load(`${folder}.mtl`, function(materials) {
      materials.preload()
      var objLoader = new THREE.OBJLoader()
      objLoader.setMaterials(materials)
      objLoader.setPath(`./${folder}/`)
      objLoader.load(`${folder}.obj`, function(object) {
        resolve(object)
      })
    })
  })
}