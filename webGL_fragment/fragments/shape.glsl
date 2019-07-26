// 绘制圆圈
vec3 circle(vec2 st,vec2 center,float radius,float innerStep,float outStep,vec3 color){
  float len=length(st-center);
  float pct=smoothstep(len-innerStep,len,radius)-smoothstep(len,len+outStep,radius);
  return pct*color;
}

// 输入坐标 st,绘制线段 ab
vec3 sdLine(in vec2 p,in vec2 a,in vec2 b,vec3 color)
{
  vec2 pa=p-a,ba=b-a;
  float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);
  float len=length(pa-ba*h);
  return smoothstep(len-.002,len,.0005)*color;
}