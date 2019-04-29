// 点位
attribute vec4 aPosition;
// 点位大小
attribute vec4 aColor;
varying vec4 vColor;

void main() {
  gl_Position = aPosition;
  gl_PointSize = 10.0;
  vColor = aColor;
}