import { initWebGLDraw } from '@/utils/fragmentDraw'
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

  let interval = null
  monacoIns.onDidChangeModelContent((event) => {
    clearTimeout(interval)
    interval = setTimeout(() => {
      try {
        const newVal = monacoIns.getValue()
        initWebGLDraw(newVal)
      } catch (e) {
        console.log(e)
      }
    }, 2000)
  })
  return monacoIns
}

function addEvent() {
  const menuListEl = document.getElementById('menuList')
  menuListEl.addEventListener('click', function(e) {
    if (e.target.nodeName === 'LI') {
      const name = e.target.dataset.name
      if (name) {
        initDraw(name)
      }
    }
  })

  document.querySelector('.menu-ctr').addEventListener('click', function(e) {
    const menuStyle = menuListEl.style.display
    menuListEl.style.display = menuStyle === 'none' ? 'block' : 'none'
  })
}

function initDraw(name) {
  import(`./fragments/${name}.glsl`).then((frag) => {
    monacoIns.setValue(frag.default)
    initWebGLDraw(frag.default)
  })
}


const monacoIns = initCodeEditor()
initDraw('coordinate')
addEvent()