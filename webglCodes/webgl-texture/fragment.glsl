precision mediump float;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;

varying vec2 vTexCoord;

void main() {
  vec4 img = texture2D(uSampler,vTexCoord);
  vec4 img2 = texture2D(uSampler2,vTexCoord);
  gl_FragColor=img*img2;
}