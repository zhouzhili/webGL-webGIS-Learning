#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uSampler;

#include <lib/util.glsl>
#include <lib/shape.glsl>

float rand(vec2 st) {
  return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(){
	vec2 st=gl_FragCoord.xy/uResolution;
	float dis = sRect(st,vec2(0.5),vec2(0.2));
	vec3 color=texture2D(uSampler,st.xy).rgb;

	gl_FragColor.rgb=fill(dis,color);
	gl_FragColor.a=1.;
}