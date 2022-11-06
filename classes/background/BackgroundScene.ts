import { getEventListeners } from 'events';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { fragmentShaderParticle, vertexShaderParticle } from 'utils/game/shaders/sphereParticle';

export class BackgroundScene {
  renderer: THREE.WebGLRenderer
  resolution: THREE.Vector2
  camera: THREE.PerspectiveCamera
  scene: THREE.Scene = new THREE.Scene()
  clock: THREE.Clock = new THREE.Clock()
  animationFrameId: number = 0
  observerOfCanvasContainer: ResizeObserver
  controls: OrbitControls
  canvasContainer = {
    width: 0,
    height: 0
  }
  trackedKeys = {
    ArrowRight: false,
    ArrowLeft: false,
  }
  ALLOWED_KEYS = [' ', 'ArrowLeft', 'ArrowRight']
  CENTER_ORIGIN_AXES = {
    x: 30,
    y: -2,
    z: 30
  }
  CENTER_OBJECT_RADIUS = 10
  constructor(canvas: HTMLCanvasElement) {
    this.initScene(canvas)
  }
  private initScene (canvas: HTMLCanvasElement) {
    this.resolution = new THREE.Vector2(canvas.clientWidth, canvas.clientHeight)
    this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({ canvas })
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.setupIllumination()
    this.setCameraPositionAndAspect()
    this.setCameraControls()
    this.addAmbientParticles()
    this.renderScene()
    this.updateRendererAndCamera()
    this.trackWindowAndContainerResize()
  }
  private trackWindowAndContainerResize() {
    // window.addEventListener('resize', this.updateRendererAndCamera.bind(this))
    this.observerOfCanvasContainer = new ResizeObserver(this.updateRendererAndCamera.bind(this))
    this.observerOfCanvasContainer.observe(document.getElementById('backgroundSceneContainer') as HTMLElement)
  }
  private setCameraPositionAndAspect() {
    const POSITION = {
      x: this.CENTER_ORIGIN_AXES.x,
      y: this.CENTER_ORIGIN_AXES.y + this.CENTER_OBJECT_RADIUS + 1.5,
      z: this.CENTER_ORIGIN_AXES.z + 1.2
    }
    const ROTATION = {
      x: -0.7,
      y: 0, 
      z: 0 
    }
    this.camera.position.set(POSITION.x, POSITION.y, POSITION.z)
    this.camera.rotation.set(ROTATION.x, ROTATION.y, ROTATION.z)
    this.camera.aspect = this.canvasContainer.width / this.canvasContainer.height
    this.camera.updateProjectionMatrix()
  }
  private setCameraControls(){
    this.controls.target.set(0, 0, 0)
  }
  private updateRendererAndCamera() {
    const backgroundSceneContainer = document.getElementById('backgroundSceneContainer') as HTMLElement
    this.canvasContainer.width = backgroundSceneContainer?.clientWidth
    this.canvasContainer.height = backgroundSceneContainer?.clientHeight
    this.renderer.setSize(this.canvasContainer.width, this.canvasContainer.height)
    this.camera.aspect = this.canvasContainer.width / this.canvasContainer.height
    this.camera.updateProjectionMatrix()
    this.controls.update()
  }
  private setupIllumination() {
    const directionalLight = new THREE.DirectionalLight(0xBC2732, 1)
    directionalLight.position.set(this.CENTER_ORIGIN_AXES.x, this.CENTER_ORIGIN_AXES.y + this.CENTER_OBJECT_RADIUS * 2, this.CENTER_ORIGIN_AXES.z - 8)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.near = 0.1
    directionalLight.shadow.camera.far = 50
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    directionalLight.intensity = 3
    directionalLight.target = this.scene
    const helper = new THREE.DirectionalLightHelper(directionalLight)
    this.scene.add(directionalLight)
    const ambientLight = new THREE.AmbientLight(0xffffff)
    ambientLight.intensity = 0.2
    this.scene.add(ambientLight)
  }
  private removeListeners() {
    window.removeEventListener('keydown', this.afterKeyPress)
    window.removeEventListener('keyup', this.afterKeyPress)
    // window.removeEventListener('resize', this.updateRendererAndCamera)
  }
  private afterKeyPress (event: KeyboardEvent) {
    console.log(this.ALLOWED_KEYS)
    const isAnAllowedKey = this.ALLOWED_KEYS.includes(event.key)
    if (isAnAllowedKey) {
      this.trackedKeys = { ...this.trackedKeys, [event.key]: false }
    }  
  }
  private renderScene() {
    this.renderer.render(this.scene, this.camera)
    this.animationFrameId = requestAnimationFrame(this.renderScene.bind(this))
  }
  private addAmbientParticles () {
    const PARTICLES_COUNT = 1800
    const PARTICLES_DISTANCE = 53
    const particleTexture = new THREE.TextureLoader().load('/game/textures/particle.png')
    const particles = new THREE.BufferGeometry()
    const positions: Array<number> = []
    const colors: Array<number> = []
    let color = new THREE.Vector3()
    const NORMALIZED_VEC_MAX = 1.0
    let particlePositionX, particlePositionY, particlePositionZ
    for (let i = 0; i < PARTICLES_COUNT; i++) {
      particlePositionX = Math.random() * PARTICLES_DISTANCE + this.CENTER_ORIGIN_AXES.x / 2 - 10
      particlePositionY = Math.random() * PARTICLES_DISTANCE
      particlePositionZ = Math.random() * PARTICLES_DISTANCE
      positions.push(particlePositionX, particlePositionY, particlePositionZ)
      color.set(Math.random() * NORMALIZED_VEC_MAX, Math.random() * NORMALIZED_VEC_MAX, Math.random() * NORMALIZED_VEC_MAX)
      colors.push(color.x, color.y, color.z)
    }
    particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    particles.setAttribute('customParticleColor', new THREE.Float32BufferAttribute(colors, 3))
    const particleShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: this.clock.getElapsedTime() },
        resolution: { value: this.resolution },
        particleTexture: { value: particleTexture }
      },
      vertexShader: vertexShaderParticle(),
      fragmentShader: fragmentShaderParticle(),
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false,
      transparent: true,
    })
    const particlesSystem = new THREE.Points(particles, particleShaderMaterial)
    particlesSystem.castShadow = true
    this.scene.add(particlesSystem)
  }
  updateSceneWithNewCanvas(canvas: HTMLCanvasElement) {
    this.initScene(canvas)
  }
  destroyWorld() {
    console.log('removing listeners')
    this.removeListeners()
    // while(true){
    //   const canvas = document.getElementById('canvas')
    //   if(!canvas){
    //     this.removeListeners()
    //   }
    // }
  }
  setCanvasElement(canvas: HTMLCanvasElement) {
    this.renderer.domElement = canvas
  }
  setDirectionalLightTarget(target: THREE.Object3D<THREE.Event>){
    const directionalLight = this.scene.getObjectByName('directionalLight') as THREE.DirectionalLight
    directionalLight.target = target
  }
}
