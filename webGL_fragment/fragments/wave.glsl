#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform float uTime;

#include <lib/util.glsl>
#include <lib/shape.glsl>
#include <lib/color.glsl>

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

	float dis=length(st-.5);
	dis = fract(dis*20.0);
	gl_FragColor.rgb=stroke(dis,0.1,AZUR);

	gl_FragColor.a=1.;
}