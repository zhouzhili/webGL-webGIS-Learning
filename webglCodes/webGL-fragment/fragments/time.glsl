#ifdef GL_ES
precision mediump float;
#endif

uniform float uTime;

void main(){
  gl_FragColor=vec4(abs(sin(uTime)),0.,0.,1.);
}