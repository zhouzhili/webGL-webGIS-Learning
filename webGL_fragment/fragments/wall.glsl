#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;

#include <lib/util.glsl>
#include <lib/shape.glsl>

vec2 grid2(in vec2 st,in float row,in float col){
  vec2 p = vec2(st.x*col,st.y*row);
  // mod(p.y,2.0):取偶数行，偶数行偏移0.5
  p.x += step(1.0,mod(p.y,2.0))*0.5;
  return fract(p);
}

void main(){
  vec2 st=gl_FragCoord.xy/uResolution;
  vec3 color = vec3(0.0);
  st=grid2(st,13.0,7.0);

  float cd = sPoly(st,vec2(0.5),0.9,4);
  color += fill(cd,vec3(1.0));
  
  gl_FragColor.rgb=color;
  gl_FragColor.a=1.;
}