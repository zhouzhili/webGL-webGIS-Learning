import { GRender } from '@/utils/fragmentDraw'
import fragmentShader from './fragment.glsl'

const gRender = new GRender({
  canvas: document.getElementById('gl-canvas'),
  fragmentShader: fragmentShader
})

gRender.render()
