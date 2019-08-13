attribute vec4 aPosition;
uniform mat4 uViewMatrix;
uniform mat4 uProjectMatrix;

// attribute vec4 aColor;
// varying vec4 vColor;

void main() {
  gl_Position =uViewMatrix*aPosition;
  // vColor = aColor;
}