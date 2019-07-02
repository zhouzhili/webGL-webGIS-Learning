#ifdef GL_ES
precision mediump float;
#endif

attribute vec4 aPosition;

void main(){
  gl_Position=aPosition;
  gl_PointSize=1.;
}