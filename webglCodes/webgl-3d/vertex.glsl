attribute vec4 aPosition;
uniform mat4 uViewMatrix;
uniform mat4 uProjectMatrix;

void main() {
  gl_Position =uViewMatrix*aPosition;
}