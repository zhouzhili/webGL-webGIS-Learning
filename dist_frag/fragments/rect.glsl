#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;

vec3 plot_Rect(vec2 st,vec2 center,float width,float height,vec3 color){
  float left=step(center.x-width/2.,st.x);
  float right=step(1.-(center.x+width/2.),1.-st.x);
  float bottom=step(center.y-height/2.,st.y);
  float top=step(1.-(center.y+height/2.),1.-st.y);
  return vec3(left*right*bottom*top)*color;
}

void main(){
  vec2 st=gl_FragCoord.xy/uResolution;
  vec3 rect1=plot_Rect(st,vec2(.5,.3),.3,.3,vec3(1.,0.,0.));
  vec3 rect2=plot_Rect(st,vec2(.2,.7),.2,.1,vec3(0.,1.,0.));
  vec3 rect3=plot_Rect(st,vec2(.6),.4,.2,vec3(0.,0.,1.));
  gl_FragColor=vec4(rect1+rect2+rect3,1.);
}