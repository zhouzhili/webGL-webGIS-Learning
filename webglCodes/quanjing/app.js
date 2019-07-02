const THREE = (window.THREE = require('three'))
require('three/examples/js/loaders/MTLLoader')
require('three/examples/js/loaders/OBJLoader')
require('three/examples/js/loaders/DDSLoader')

var camera, scene, renderer;
var isUserInteracting = false,
  onMouseDownMouseX = 0, onMouseDownMouseY = 0,
  lon = 0, onMouseDownLon = 0,
  lat = 0, onMouseDownLat = 0,
  phi = 0, theta = 0;
init();
animate();

function init() {
  var container, mesh;
  container = document.body;
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
  camera.target = new THREE.Vector3(0, 0, 0);
  scene = new THREE.Scene();

  var geometry = new THREE.SphereBufferGeometry(500, 60, 40);
  // invert the geometry on the x-axis so that all of the faces point inward
  geometry.scale(- 1, 1, 1);
  var texture = new THREE.TextureLoader().load('./p3.png');
  var material = new THREE.MeshBasicMaterial({ map: texture });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  document.addEventListener('mousedown', onPointerStart, false);
  document.addEventListener('mousemove', onPointerMove, false);
  document.addEventListener('mouseup', onPointerUp, false);
  document.addEventListener('wheel', onDocumentMouseWheel, false);
  document.addEventListener('touchstart', onPointerStart, false);
  document.addEventListener('touchmove', onPointerMove, false);
  document.addEventListener('touchend', onPointerUp, false);
  //
  document.addEventListener('dragover', function(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, false);
  document.addEventListener('dragenter', function() {
    document.body.style.opacity = 0.5;
  }, false);
  document.addEventListener('dragleave', function() {
    document.body.style.opacity = 1;
  }, false);
  document.addEventListener('drop', function(event) {
    event.preventDefault();
    var reader = new FileReader();
    reader.addEventListener('load', function(event) {
      material.map.image.src = event.target.result;
      material.map.needsUpdate = true;
    }, false);
    reader.readAsDataURL(event.dataTransfer.files[0]);
    document.body.style.opacity = 1;
  }, false);
  //
  window.addEventListener('resize', onWindowResize, false);

  loadModal()
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function onPointerStart(event) {
  isUserInteracting = true;
  var clientX = event.clientX || event.touches[0].clientX;
  var clientY = event.clientY || event.touches[0].clientY;
  onMouseDownMouseX = clientX;
  onMouseDownMouseY = clientY;
  onMouseDownLon = lon;
  onMouseDownLat = lat;
}
function onPointerMove(event) {
  if (isUserInteracting === true) {
    var clientX = event.clientX || event.touches[0].clientX;
    var clientY = event.clientY || event.touches[0].clientY;
    lon = (onMouseDownMouseX - clientX) * 0.1 + onMouseDownLon;
    lat = (clientY - onMouseDownMouseY) * 0.1 + onMouseDownLat;
  }
}
function onPointerUp() {
  isUserInteracting = false;
}
function onDocumentMouseWheel(event) {
  var fov = camera.fov + event.deltaY * 0.05;
  camera.fov = THREE.Math.clamp(fov, 10, 75);
  camera.updateProjectionMatrix();
}
function animate() {
  requestAnimationFrame(animate);
  update();
}
function update() {
  if (isUserInteracting !== false) {
    lat = Math.max(- 85, Math.min(85, lat));
    phi = THREE.Math.degToRad(90 - lat);
    theta = THREE.Math.degToRad(lon);
    camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
    camera.target.y = 500 * Math.cos(phi);
    camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(camera.target);
  }
  renderer.render(scene, camera);
}

function loadModal() {
  const group = new THREE.Group()
  group.rotation.x += Math.PI / -2
  scene.add(group)
  scene.add(new THREE.AmbientLight(0xffffff))

  const objList = ['Tile_+000_+000', 'Tile_+000_+001', 'Tile_+000_+002']
  objList.forEach(n => {
    loadObj(n).then(obj => {
      // const mesh = obj.children[0]
      // mesh.position.set(0, -100, 0)
      group.add(obj)
      const box = new THREE.Box3()
      box.expandByObject(group)
      const getCenter = axis => (box.min[axis] + box.max[axis]) / 2
      group.position.x -= getCenter('x') + 100
      group.position.y -= getCenter('y') + 50
      group.position.z -= getCenter('z')
    })
  })

  function loadObj(fileName) {
    return new Promise((resolve) => {
      var mtlLoader = new THREE.MTLLoader()
      mtlLoader.setPath(`../LoadObj/${fileName}/`)
      mtlLoader.load(`${fileName}.mtl`, function(materials) {
        materials.preload()
        var objLoader = new THREE.OBJLoader()
        objLoader.setMaterials(materials)
        objLoader.setPath(`../LoadObj/${fileName}/`)
        objLoader.load(`${fileName}.obj`, function(object) {
          resolve(object)
        })
      })
    })
  }
}