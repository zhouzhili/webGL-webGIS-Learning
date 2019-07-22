#ifdef GL_ES
precision mediump float;
#endif

uniform float uTime;
uniform vec2 uResolution;

void main(){
  vec2 coord=gl_FragCoord.xy/uResolution;
  vec2 center=vec2(.5);
  float dis=distance(coord,center);
  float rad=mod(uTime,10.)*.01;
  gl_FragColor.rgb=step(rad,dis)*vec3(1.);
  gl_FragColor.a=1.;
}