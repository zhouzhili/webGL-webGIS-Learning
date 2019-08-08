#define rx 1./min(uResolution.x,uResolution.y)

/* Math 2D Transformations */

// 将坐标st，旋转 _angle度
mat2 rotate2d(in float _angle){
	float rad=radians(_angle);
	// 旋转矩阵
	mat2 rotateMat=mat2(cos(rad),-sin(rad),
	sin(rad),cos(rad));
	return rotateMat;
}

mat2 scale2d(vec2 scale){
	return mat2(scale.x,0.,0.,scale.y);
}

// 围绕 c 点旋转 angle 度
vec2 rotate2d(in vec2 st,in vec2 c,in float angle){
	vec2 p=st-c;
	p*=rotate2d(angle);
	return p+c;
}

// 填充,d:距离，
float fill(in float d){
	return 1.-smoothstep(0.,rx*2.,d);
}

// 描边,d为距离,t为描边宽度
float stroke(in float d,in float t){
	return 1.-smoothstep(t-rx*1.5,t+rx*1.5,abs(d));
}

// 填充使用颜色
vec3 fill(in float d,in vec3 color){
	return(1.-smoothstep(0.,rx*2.,d))*color;
}

// 描边使用颜色
vec3 stroke(in float d,in float t,in vec3 color){
	return(1.-smoothstep(t-rx*1.5,t+rx*1.5,abs(d)))*color;
}

vec3 rgb(in int r,in int g,in int b){
	return vec3(float(r),float(g),float(b))/255.;
}

// 分割成不同行列格网
vec2 grid(in vec2 p,in float row,in float col){
	return fract(vec2(p.x*col,p.y*row));
}

// 分割成相同行列相同的格网
vec2 grid(in vec2 p,int t){
	return fract(p*float(t));
}

/*图形布尔运算*/
// 合并，取并集
float sdfUnion(float dis1,float dis2) {
	return min(dis1,dis2);
}

// 相交，取交集
float sdfIntersect(float dis1,float dis2){
	return max(dis1,dis2);
}

// 相减
float sdfDifference(float base, float subtraction){
    return max(base, -subtraction);
}