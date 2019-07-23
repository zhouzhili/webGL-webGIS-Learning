#ifdef GL_ES
precision mediump float;
#endif

void main(){
  vec2 st=gl_FragCoord.xy;
  gl_FragColor.rgb=step(256.,st.x)*vec3(1.);
  gl_FragColor.a=1.;
}