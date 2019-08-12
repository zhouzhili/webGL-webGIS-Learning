import { GRender } from '@/utils/fragmentDraw'
import glslLanguage from '@/utils/glsl-language'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

function initCodeEditor() {
  monaco.languages.register({ id: 'glsl' })
  monaco.languages.setMonarchTokensProvider('glsl', glslLanguage)

  const monacoIns = monaco.editor.create(document.getElementById('code'), {
    value: '',
    language: 'glsl',
    theme: 'vs-dark',
    minimap: {
      enabled: false
    },
    automaticLayout: true
  })
  return monacoIns
}

async function runCode(dataset) {
  try {
    const fragVal = monacoIns.getValue()
    const enableTime = fragVal.indexOf('uniform float uTime;')
    gRender.enableTime = enableTime !== -1
    if (dataset.texture) {
      const texture = await gRender.loadTexture(dataset.texture)
      gRender.texture = texture
    }
    await gRender.renderByShader(fragVal)
  } catch (e) {
    console.log(e)
  }
}

function addEvent() {
  const menuListEl = document.getElementById('menuList')

  menuListEl.addEventListener('click', function(e) {
    if (e.target.nodeName === 'LI') {
      const dataset = e.target.dataset
      if (dataset.name) {
        initDraw(dataset)
        const allActive = document.querySelectorAll('li.active')
        for (let i = 0; i < allActive.length; i++) {
          allActive[i].className = ''
        }
        e.target.className += 'active'
      }
    }
  })

  document.querySelector('#menuCtr').addEventListener('click', function(e) {
    const menuStyle = menuListEl.style.display
    menuListEl.style.display = menuStyle === 'none' ? 'block' : 'none'
  })

  document.querySelector('#runCode').addEventListener('click', function() {
    const curLi = document.querySelectorAll('li.active')[0]
    runCode(curLi.dataset)
  })
}

function initDraw(dataset) {
  gRender
    .loadGLSL(`${dataset.name}.glsl`)
    .then(code => {
      monacoIns.setValue(code)
      runCode(dataset)
    })
    .catch(err => {
      console.log(`加载${name}.glsl失败`, err)
    })
}

const monacoIns = initCodeEditor()
const gRender = new GRender({
  canvas: document.getElementById('gl-canvas'),
  basePath: './fragments/'
})
addEvent()
initDraw({ name: 'coordinate' })
