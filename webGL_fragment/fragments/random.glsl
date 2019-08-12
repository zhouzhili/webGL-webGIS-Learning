#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;

float rand(vec2 st) {
  return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(){
	vec2 st=gl_FragCoord.xy/uResolution;

	gl_FragColor.rgb=rand(st)*vec3(1.0);
	gl_FragColor.a=1.;
}