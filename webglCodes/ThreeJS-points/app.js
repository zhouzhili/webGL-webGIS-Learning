import * as THREE from 'three/build/three.module'
import ThreeFactory from '@/utils/ThreeFactory'

const ctx = new ThreeFactory({
  cameraOpt: {
    far: 3000
  }
})
ctx.init()

ctx.camera.position.z = 2000
ctx.camera.lookAt(0, 0, 0)

function addPoints() {
  const startGeo = new THREE.BufferGeometry()
  const positions = []
  const colors = []

  const color = new THREE.Color()
  const n = 500
  const n2 = n / 2
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * n - n2
    const y = Math.random() * n - n2
    const z = Math.random() * n - n2
    positions.push(x, y, z)

    const vx = x / n + 0.5
    const vy = y / n + 0.5
    const vz = z / n + 0.5
    color.setRGB(vx, vy, vz)
    colors.push(color.r, color.g, color.b)
  }

  startGeo.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  startGeo.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  startGeo.computeBoundingSphere()

  const pointMa = new THREE.PointsMaterial({ size: 15, vertexColors: THREE.VertexColors })
  return new THREE.Points(startGeo, pointMa)
}

const starMesh = addPoints()
ctx.scene.add(starMesh)
