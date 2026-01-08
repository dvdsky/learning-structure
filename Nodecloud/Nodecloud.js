import * as THREE from './../lib/three.module.js'
const positions=[]
let selectedIndex=-1
const geometry = new THREE.BufferGeometry()
const material = new THREE.PointsMaterial({
  color: 0x66ccff,
  size: 0.15,          // 👈 点大小（非常重要）
  sizeAttenuation: true
})

const pointCloud = new THREE.Points(geometry, material)
scene.add(pointCloud)

function addPoint(x, y, z) {
  positions.push(x, y, z)

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  )

  geometry.attributes.position.needsUpdate = true
}