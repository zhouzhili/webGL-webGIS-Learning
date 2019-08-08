#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform float uTime;

#include <lib/util.glsl>
#include <lib/shape.glsl>
#include <lib/color.glsl>

//参考： https://www.ronja-tutorials.com/2018/11/24/sdf-space-manipulation.html
void wobble(inout vec2 position, float frequency, float amount){
    vec2 wobble = sin(position.yx * frequency) * amount;
    position += wobble;
}

void main(){
	vec2 st=gl_FragCoord.xy/uResolution;
	
	float frequency = 5.0;
	float offset = mod(uTime, PI * 2.0 / frequency);
	st = translate(st, vec2(offset));
	wobble(st, 5.0, .05);
	st = translate(st, vec2(-offset));

	float dis = sCircle(st,vec2(0.5),0.1);
	
	gl_FragColor.rgb=fill(dis,CYAN);
	gl_FragColor.a=1.;
}