#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;

void main(){
	vec2 st=gl_FragCoord.xy/uResolution;
	vec2 center=vec2(.5);
	float dis=distance(center,st.xy);
	gl_FragColor.rgb=dis*vec3(1.);
	gl_FragColor.a=1.;
}