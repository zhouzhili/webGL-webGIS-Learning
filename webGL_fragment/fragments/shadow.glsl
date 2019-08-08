#ifdef GL_ES
precision mediump float;
#endif

#define SAMPLES 32

uniform vec2 uResolution;
uniform float uTime;

#include <lib/util.glsl>
#include <lib/shape.glsl>
#include <lib/color.glsl>

// 构建场景
float scene (vec2 st) {
	// st-=0.5;
	// st*= rotate2d(45.0);
	// float dis = sRect(st,vec2(0.0),vec2(0.2));
	// st*= rotate2d(-45.0);
	// st=abs(st);
	// float dis1 = sRect(st,vec2(0.3),vec2(0.2,0.05));
	// float dis2 = sRect(st,vec2(0.4,0.225),vec2(0.05,0.2));
	// dis = sdfUnion(dis,dis1);
	// dis = sdfUnion(dis,dis2);
	float re1 = sRect(st,vec2(0.2),vec2(0.2,0.05));
	float re2 = sRect(st,vec2(0.1,0.3),vec2(0.05,0.2));

	float dis = sdfUnion(re1,re2);
	// float dis = sRect(st,vec2(0.1,0.7),vec2(0.2,0.05));
	return dis;
}

float traceShadow(vec2 pos,vec2 lightPos) {
	float lightDist = length(lightPos-pos);

	vec2 direct =(lightDist==0.0)?vec2(0.0,1.0):(lightPos-pos)/lightDist;

	float rayProgress  = 0.0;
	for(int i=0;i<SAMPLES;i++) {
		float sceneDist = scene(pos+direct*rayProgress );

		if(sceneDist<=0.0) {
			return 0.0;
		}
		if(rayProgress >lightDist){
			return 1.0;
		}
		rayProgress  = rayProgress  + sceneDist;
	}
	return 0.0;
}

void main(){
	vec2 st=gl_FragCoord.xy/uResolution;

	vec2 lightPos = vec2(sin(uTime),cos(uTime))*0.1+vec2(0.5);

	float li = sCircle(st,lightPos,0.02);
	vec3 c = fill(li,RED);

	float shadow = traceShadow(st,lightPos);

	vec3 light = shadow*vec3(0.6,0.6,1.0);

	float sceneDist = scene(st);

	vec3 geo = fill(sceneDist,vec3(0.0,0.3,0.1));


	gl_FragColor.rgb=geo+light+c;

	gl_FragColor.a=1.;
}