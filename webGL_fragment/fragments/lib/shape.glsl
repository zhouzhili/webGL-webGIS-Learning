/*
* 参考:
* https://github.com/actarian/vscode-glsl-canvas/blob/master/src/snippets/snippets.md
* http://iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm
*/

#define PI_TWO 1.570796326794897
#define PI 3.141592653589793
#define TWO_PI 6.283185307179586

/*
* shape 2D 参数说明
* p 为着色器坐标
* c 为中线点坐标
* w 为半径
* s 为起始弧度
* e 为终止弧度
*/
// 平移
vec2 translate(in vec2 p,in vec2 c) {
	return p-c;
}

/* Shape 2D circle */
// 坐标p ,圆心坐标 c , 半径 w
float sCircle(in vec2 p,in vec2 c,in float w){
	return length(translate(p,c))-w;
}

// 画弧线 ，输入坐标p ,圆心，直径 w,起始弧度s,终止弧度e
float sArc(in vec2 p,in vec2 c, in float w, in float s, in float e) {
	// 移动坐标在中心点
	p=translate(p,c);
	float a = distance(p, w*0.5*vec2(cos(s), sin(s)));
	float x = -PI;
	p *= mat2(cos(x - s), -sin(x - s), sin(x - s), cos(x - s));
	float b = clamp(atan(p.y, p.x), x, x + e);
	b = distance(p, w* 0.5*vec2(cos(b), sin(b)));
	return min(a, b) * 2.0;
}

/* Shape 2D line */
// 输入坐标 st,绘制线段 ab
float sLine(in vec2 p,in vec2 a,in vec2 b)
{
	vec2 pa=p-a,ba=b-a;
	float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);
	return length(pa-ba*h);
}

/* Shape 2D pie */
// 输入坐标，圆心，半径，起始弧度和终止弧度
float sPie(in vec2 p,in vec2 c, in float w, in float s, in float e) {
	p=translate(p,c);
	s = mod(s, TWO_PI);
	e = mod(s + e, TWO_PI);
	float a = mod(atan(p.y, p.x), TWO_PI);
	a = abs(step(s, a) - step(e, a));
	a = s < e ? a : 1.0 - a;
	float d = length(p);
	return 1.0 - (a - d * 2.0) - w;
}

/* Shape 2D poly */
// 绘制正多边形，输入坐标，半径，边数
float sPoly(in vec2 p,in vec2 c,in float w,in int sides){
	p=translate(p,c);
	float a=atan(p.x,p.y)+PI;
	float r=TWO_PI/float(sides);
	float d=cos(floor(.5+a/r)*r-a)*length(max(abs(p)*1.,0.));
	return d*2.-w;
}

// 矩形
float sRect(in vec2 p,vec2 c, in vec2 w) {  
	p = translate(p,c);  
		float d = max(abs(p.x / w.x), abs(p.y / w.y)) * 2.0;
		float m = max(w.x, w.y);
		return d * m - m;
}