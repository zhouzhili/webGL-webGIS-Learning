#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;

float plot_Rect(vec2 st,vec2 c,vec2 halfwh){
	// 移动到中心
	st-=c;
	// 以绝对值减去长宽
	st=abs(st)-halfwh;
	// 在矩形内部的点 x 范围为：[-w/2,0],同时 y的范围为[-h/2,0],所以，只要最大值小于0就可以表示点在矩形的范围
	return max(st.x,st.y);
}

void main(){
	vec2 st=gl_FragCoord.xy/uResolution;
	float dis = plot_Rect(st,vec2(0.5),vec2(0.3,0.1));
	gl_FragColor.rgb=step(dis,0.0)*vec3(1.0);
	gl_FragColor.a = 1.0;
}