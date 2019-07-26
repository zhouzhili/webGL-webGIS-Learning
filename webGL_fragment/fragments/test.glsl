#ifdef GL_ES
precision mediump float;
#endif

#include <shape.glsl>

uniform vec2 uResolution;

void main(){
  vec2 st=gl_FragCoord.xy/uResolution;
  vec3 line =sdLine(st,vec2(0.5),vec2(0.9),vec3(1.0));
  gl_FragColor.rgb=line;
  gl_FragColor.a=1.;
}