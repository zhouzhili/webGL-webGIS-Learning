#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;

#include <lib/util.glsl>
#include <lib/shape.glsl>

vec2 grid2(in vec2 st,in float row,in float col){
  vec2 p=vec2(st.x*col,st.y*row);
  // mod(p.y,2.0):取偶数行，奇数行偏移0.5
  p.x+=step(1.,mod(p.y,2.))*.5;
  return fract(p);
}

void main(){
  vec2 st=gl_FragCoord.xy/uResolution;
  vec3 color=vec3(0.);
  st=grid2(st,13.,7.);
  
  float cd=sPoly(st,vec2(.5),.9,4);
  color+=fill(cd,vec3(1.));
  
  gl_FragColor.rgb=color;
  gl_FragColor.a=1.;
}