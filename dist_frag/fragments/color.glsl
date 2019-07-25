#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;

void main(){
  vec2 st=gl_FragCoord.xy/uResolution;
  vec3 red=vec3(1.,0.,0.);
  vec3 green=vec3(0.,1.,0.);
  vec3 color=mix(red,green,vec3(st.x));
  gl_FragColor=vec4(color,1.);
}
