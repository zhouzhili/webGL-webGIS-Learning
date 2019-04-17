// 点位
attribute vec4 aPosition;
// 变换矩阵
uniform mat4 uTranslateMatrix;
void main() {
  gl_Position =uTranslateMatrix * aPosition;
}