uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

float edge(float st,float real){
  return smoothstep(st-.01,st,real)-smoothstep(st,st+.01,real);
}

// 日升日落
void main(){
  vec2 st=gl_FragCoord.xy/uResolution;

  gl_FragColor.rgb=vec3(sin(uTime),cos(uTime),1.0);
  gl_FragColor.a=1.;

}