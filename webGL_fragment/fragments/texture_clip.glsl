#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform sampler2D uSampler;

#include <lib/shape.glsl>
#include <lib/util.glsl>

void main(){
  vec2 st=gl_FragCoord.xy/uResolution;
	float dis = sCircle(st,vec2(0.5),0.2);
	vec3 color=texture2D(uSampler,st.xy).rgb;
	gl_FragColor.rgb = fill(dis,color);
	gl_FragColor.a = 1.0;
}