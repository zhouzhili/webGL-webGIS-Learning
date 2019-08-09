#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform sampler2D uSampler;


void main(){
  vec2 st=gl_FragCoord.xy/uResolution;
	gl_FragColor = texture2D(uSampler,st.xy);
}