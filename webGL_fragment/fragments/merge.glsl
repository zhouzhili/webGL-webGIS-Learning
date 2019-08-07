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
    return intersect(base, -1.0*subtraction);
}

// 插值
float interpolate(float dis1, float dis2, float amount){
    return smoothstep(dis1, dis2, amount);
}

void main(){
	vec2 st=gl_FragCoord.xy/uResolution;
	float cdis = sCircle(st,vec2(0.5),0.2);
	float rdis = sPoly(st,vec2(0.7),0.2,4);
	// min 为并运算，max为交运算
	float dis = subtract(cdis,rdis);
	// dis = max(cdis,rdis);
	gl_FragColor.rgb=fill(dis,AZUR);
	gl_FragColor.a=1.;
}