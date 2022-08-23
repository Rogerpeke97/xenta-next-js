import * as THREE from 'three';

export class World {
  renderer: THREE.WebGLRenderer
  resolution: THREE.Vector2
  camera: THREE.PerspectiveCamera
  scene: THREE.Scene
  trackedKeys = {
    ArrowRight: false,
    ArrowLeft: false,
  }
  ALLOWED_KEYS = [' ', 'ArrowLeft', 'ArrowRight']
  PLANET_ORIGIN_AXES = {
    x: 30,
    y: -2,
    z: 30
  }
  PLANET_RADIUS = 10
  constructor() {
    this.resolution = new THREE.Vector2(window.innerWidth, window.innerHeight)
    this.camera = new THREE.PerspectiveCamera(75, renderScreenWidth / renderScreenHeight, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer()
    this.scene = new THREE.Scene()
    this.setupIllumination()
    this.setUpRenderer()
    this.setKeyListeners()
    this.checkIfCanvasIsInDOM()
  }
  private setupIllumination() {
    const directionalLight = new THREE.DirectionalLight(0xBC2732, 1)
    directionalLight.position.set(this.PLANET_ORIGIN_AXES.x, this.PLANET_ORIGIN_AXES.y + this.PLANET_RADIUS * 2, this.PLANET_ORIGIN_AXES.z - 8)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.near = 0.1
    directionalLight.shadow.camera.far = 50
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    directionalLight.intensity = 3
    // const helper = new THREE.DirectionalLightHelper(directionalLight)
    this.scene.add(directionalLight)
    const ambientLight = new THREE.AmbientLight(0xffffff)
    ambientLight.intensity = 0.2
    this.scene.add(ambientLight)
  }
  private setUpRenderer() {
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
  }
  private removeListeners() {
    window.removeEventListener('keydown', this.afterKeyPress)
    window.removeEventListener('keyup', this.afterKeyPress)
  }
  private checkIfCanvasIsInDOM() {
    while(true){
      const canvas = document.getElementById('canvas')
      if(!canvas){
        this.removeListeners()
      }
    }
  }
  private afterKeyPress (event: KeyboardEvent) {
    const isAnAllowedKey = this.ALLOWED_KEYS.includes(event.key)
    if (isAnAllowedKey) {
      this.trackedKeys = { ...this.trackedKeys, [event.key]: false }
    }  
  }
  private setKeyListeners() {
    window.addEventListener('keydown', this.afterKeyPress)
    window.addEventListener('keyup', this.afterKeyPress)
  }
  setCanvasElement(canvas: HTMLCanvasElement) {
    this.renderer.domElement = canvas
  }
  setDirectionalLightTarget(target: THREE.Object3D<THREE.Event>){
    const directionalLight = this.scene.getObjectByName('directionalLight') as THREE.DirectionalLight
    directionalLight.target = target
  }
}
