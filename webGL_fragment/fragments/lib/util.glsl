#define rx 1./min(uResolution.x,uResolution.y)

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
  return (1.-smoothstep(0.,rx*2.,d))*color;
}

// 描边使用颜色
vec3 stroke(in float d,in float t,in vec3 color){
  return (1.-smoothstep(t-rx*1.5,t+rx*1.5,abs(d)))*color;
}

vec3 rgb(in int r,in int g,in int b){
  return vec3(float(r),float(g),float(b))/255.0;
}