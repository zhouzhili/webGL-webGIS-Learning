#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;

#include <lib/util.glsl>
#include <lib/shape.glsl>

void main(){
  vec2 st=gl_FragCoord.xy/uResolution;
  vec3 color = vec3(0.0);
  st=grid(st,4);

  st = rotate2d(st,vec2(0.5),45.0);
  float cd = sPoly(st,vec2(0.5),sqrt(2.0)/2.0,4);
  color += fill(cd,vec3(1.0));
  
  gl_FragColor.rgb=color;
  gl_FragColor.a=1.;
}