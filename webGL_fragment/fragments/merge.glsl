#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;

#include <lib/util.glsl>
#include <lib/shape.glsl>
#include <lib/color.glsl>

// 合并，取并集
float merge(float dis1,float dis2) {
	return min(dis1,dis2);
}

// 相交，取交集
float intersect(float dis1,float dis2){
	return max(dis1,dis2);
}

// 相减
float subtract(float base, float subtraction){
	return max(base,-subtraction);
}


void main(){
	vec2 st=gl_FragCoord.xy/uResolution;
	// 交集
	float c1 = sCircle(st,vec2(0.1,0.5),0.2);
	float r1 = sPoly(st,vec2(0.2,0.6),0.2,4);
	float dis1 = intersect(c1,r1);
	
	// 并
	float c2 = sCircle(st,vec2(0.5,0.5),0.1);
	float r2 = sPoly(st,vec2(0.5,0.6),0.1,4);
	float dis2 = merge(c2,r2);
	
	// 差
	float c3 = sCircle(st,vec2(0.8,0.5),0.1);
	float r3 = sPoly(st,vec2(0.8,0.6),0.1,4);
	float dis3 = subtract(c3,r3);
	
	float dis = merge(dis1,dis2);
	dis = merge(dis,dis3);

	gl_FragColor.rgb=fill(dis,AZUR);
	gl_FragColor.a=1.;
}