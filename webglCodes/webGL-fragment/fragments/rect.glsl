#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;

void main(){
  vec2 st=gl_FragCoord.xy/uResolution;
  vec2 bl=step(vec2(.2),st.xy);
  vec2 tr=step(vec2(.2),1.-st);
  gl_FragColor.rgb=vec3(bl.x*bl.y*tr.x*tr.y);
  gl_FragColor.a=1.;
}