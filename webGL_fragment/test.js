let str = `#ifdef GL_ES
precision mediump float;
#endif

#include <shape.glsl>

void main(){
  vec2 st=gl_FragCoord.xy;
  gl_FragColor.rgb=step(256.,st.x)*vec3(1.);
  gl_FragColor.a=1.;
}`
const getIncludeGLSL=(glsl)=> {
  const reg = /#include <(.*?.glsl)>/g
  const arr = [];
  while (r = reg.exec(glsl)) {
    arr.push({
      reg: r[0],
      target: r[1]
    })
  }
  return arr
}

const a = getIncludeGLSL(str)
console.log(a)
