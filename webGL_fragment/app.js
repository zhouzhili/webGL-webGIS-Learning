import { GRender } from '@/utils/fragmentDraw'
import glslLanguage from '@/utils/glsl-language'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

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
    automaticLayout: true,
  });
  return monacoIns
}

function runCode() {
  try {
    const fragVal = monacoIns.getValue()
    const enableTime = fragVal.indexOf('uniform float uTime;')
    gRender.enableTime = enableTime !== -1
    gRender.renderByShader(fragVal)
  } catch (e) {
    console.log(e)
  }
}
function addEvent() {
  const menuListEl = document.getElementById('menuList')

  menuListEl.addEventListener('click', function(e) {
    if (e.target.nodeName === 'LI') {
      const { name } = e.target.dataset
      if (name) {
        initDraw(name)
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

  document.querySelector('#runCode').addEventListener('click', runCode)
}

function initDraw(name) {
  gRender.loadGLSL(`${name}.glsl`).then(code => {
    monacoIns.setValue(code)
    runCode()
  }).catch(err => {
    console.log(`加载${name}.glsl失败`, err)
  })
}


const monacoIns = initCodeEditor()
const gRender = new GRender({
  canvas: document.getElementById('gl-canvas'),
  basePath:'./fragments/'
})
addEvent()
initDraw('coordinate')