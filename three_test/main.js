import * as THREE from './../lib/three.module.js'
const scene = new THREE.Scene()
scene.background = new THREE.Color(56/255,54/255,54/255)

const camera1 = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera1.position.set(2,2,5)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.domElement.addEventListener('mousedown', onMouseDown)

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
let selectedObject = null
updatePanel(selectedObject)



const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: 'rgb(144, 81, 81)' })
)

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({color:'rgb(144, 81, 81)'})
)                                               
/*
  plane 平面         circle 圆形              lcosahedron 二十面体
  sphere 球体        ring 圆环                octahedron  八面体
  cylinder 圆柱      shape 二维形状           tetrahedron 四面体
  cone 圆锥          extrude 挤压（三维几何体）dodecahedron 十二面体
  torus 圆环面       lathe 旋转几何体         tube 管状
  torusKnot 环面纽结 polyhedron多面体         edges 边缘几何体
  wireframe 线框几何体
*/
const box1=new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({color:'rgb(121,21,243)'})
)
const signx=new THREE.Mesh(
  new THREE.BoxGeometry(2,0.1,0.1),
  new THREE.MeshBasicMaterial({color:'rgba(228, 31, 17, 1)'})
)
const signy=new THREE.Mesh(
  new THREE.BoxGeometry(0.1,2,0.1),
  new THREE.MeshBasicMaterial({color:'rgba(33, 255, 51, 1)'})
)
const signz=new THREE.Mesh(
  new THREE.BoxGeometry(0.1,0.1,2),
  new THREE.MeshBasicMaterial({color:'rgba(31, 49, 255, 1)'})
)
cube2.position.set(5,5,10)
signx.position.set(0,5,0)
signy.position.set(0,5,0)
signz.position.set(0,5,0)
scene.add(cube1)
scene.add(cube2)
scene.add(signx)
scene.add(signy)
scene.add(signz)

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera1)
}
animate()

//主线一：添加方块节点 已完成
//主线二：升级摄像机 //byd怎么那么喜欢乱开支线 至少上帝视角可以随便动了
//主线一点五：添加地面 已完成

class KeyboardController {
  constructor(camera){
    this.camera = camera
    

  window.addEventListener('keydown',(e)=>this.onKeyDown(e))
}
  onKeyDown(k){
    if(k.code==="KeyW") this.camera.position.z=this.camera.position.z-0.1
    if(k.code==="KeyS") this.camera.position.z=this.camera.position.z+0.1
    if(k.code==="KeyD") this.camera.position.x=this.camera.position.x+0.1
    if(k.code==="KeyA") this.camera.position.x=this.camera.position.x-0.1
    if(k.code==="KeyZ") this.camera.position.y=this.camera.position.y+0.1
    if(k.code==="KeyC") this.camera.position.y=this.camera.position.y-0.1
    if(k.code==="KeyQ") this.camera.rotation.y=this.camera.rotation.y+0.1*Math.PI
    if(k.code==="KeyE") this.camera.rotation.y=this.camera.rotation.y-0.1*Math.PI
    if(k.code==="KeyO") addCube(1)
  }
  
}
const c1=new KeyboardController(camera1)
c1.camera=camera1
//2.1至少摄像头能动了不是 转动力学
const ground=new THREE.PlaneGeometry(20,20,1,1)//后两项是width segments height segments
const texture=new THREE.MeshBasicMaterial({color:'rgb(42,42,42)'})
const mesh1=new THREE.Mesh(ground,texture)
mesh1.rotation.x = -Math.PI / 2
scene.add(mesh1)
scene.add(new THREE.AxesHelper(5))
scene.add(new THREE.GridHelper(20, 20))

//这是添加方块
function addCube(size = 1) {
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(size, size, size),
    new THREE.MeshBasicMaterial({ color: 'rgb(144, 81, 81)' })
  )
  

  // 随机放在地面附近，防止重叠
  cube.position.set(
    (Math.random() - 0.5) * 10,
    size / 2,
    (Math.random() - 0.5) * 10
  )

  scene.add(cube)
}

//主线三 自由添加方块并修改属性

function onMouseDown(event) {
  // 1. 把鼠标位置转成 three.js 用的 -1 ~ 1
  const rect = renderer.domElement.getBoundingClientRect()

  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  // 2. 从摄像机发射射线
  raycaster.setFromCamera(mouse, camera1)

  // 3. 和场景里的物体求交
  const intersects = raycaster.intersectObjects(scene.children)

  if (intersects.length > 0) {
    const obj = intersects[0].object

    // 取消上一次选中
    if (selectedObject) {
      selectedObject.material.color.set('rgb(144, 81, 81)')
    }

    // 选中新物体
    selectedObject = obj
    obj.material.color.set('yellow')

    console.log('选中:', obj)
  }
}

const posX = document.getElementById('posX')
const posY = document.getElementById('posY')
const posZ = document.getElementById('posZ')

function updatePanel(obj) {
  if (!obj) return

  posX.value = obj.position.x.toFixed(2)
  posY.value = obj.position.y.toFixed(2)
  posZ.value = obj.position.z.toFixed(2)
}

posX.addEventListener('input', () => {
  if (selectedObject) selectedObject.position.x = Number(posX.value)
})

posY.addEventListener('input', () => {
  if (selectedObject) selectedObject.position.y = Number(posY.value)
})

posZ.addEventListener('input', () => {
  if (selectedObject) selectedObject.position.z = Number(posZ.value)
})