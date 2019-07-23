#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;

void main(){
  vec2 st=gl_FragCoord.xy/uResolution;
  gl_FragColor.rgb=st.x*vec3(1.);
  gl_FragColor.a=1.;
}