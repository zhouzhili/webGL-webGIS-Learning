
// 射线拾取
var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()
function onMouseClick(evt) {
  mouse.x = (evt.clientX / window.innerWidth) * 2 - 1
  mouse.y = (evt.clientY / window.innerHeight) * 2 - 1

  raycaster.setFromCamera(mouse.clone(), ctx.camera)

  const intersects = raycaster.intersectObjects(ctx.scene.children)
  const plan = intersects.find(m => m.object.name === 'plan')

  if (plan) {
    const point = plan.point
    const kGirls = ctx.scene.children.find(m => m.name === 'kGirls')
    console.log(plan)
    kGirls.position.x = point.x
    kGirls.position.z = point.z
  }

}

window.addEventListener('click', onMouseClick, false)