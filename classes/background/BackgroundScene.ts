import { Stars, StarsType } from 'classes/particles/stars/Stars';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class BackgroundScene {
  renderer!: THREE.WebGLRenderer;
  resolution!: THREE.Vector2;
  camera!: THREE.PerspectiveCamera;
  sceneCanvasContainerId!: string;
  harmlessStars!: Stars;
  harmfulStars!: Stars;
  scene: THREE.Scene = new THREE.Scene()
  clock: THREE.Clock = new THREE.Clock()
  animationFrameId: number = 0
  observerOfCanvasContainer!: ResizeObserver;
  controls!: OrbitControls;
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
  constructor(canvas: HTMLCanvasElement, sceneCanvasContainerId: string) {
    this.initScene(canvas, sceneCanvasContainerId)
  }
  private initScene (canvas: HTMLCanvasElement, sceneCanvasContainerId: string) {
    this.resolution = new THREE.Vector2(canvas.clientWidth, canvas.clientHeight)
    this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({ canvas })
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.harmlessStars = new Stars({scene: this.scene, resolution: this.resolution,
      clock: this.clock, centerOriginAxes: this.CENTER_ORIGIN_AXES})
    this.harmfulStars = new Stars({scene: this.scene, resolution: this.resolution,
      clock: this.clock, starsType: StarsType.harmful, centerOriginAxes: this.CENTER_ORIGIN_AXES, customColor: new THREE.Vector3(0.9,0.3,0.4)})
    this.sceneCanvasContainerId = sceneCanvasContainerId
    this.setupIllumination()
    this.setCameraPositionAndAspect()
    this.setCameraControls()
    this.renderScene()
    this.updateRendererAndCamera()
    this.trackWindowAndContainerResize()
  }
  private trackWindowAndContainerResize() {
    this.observerOfCanvasContainer = new ResizeObserver(this.updateRendererAndCamera.bind(this))
    console.log(this.sceneCanvasContainerId)
    this.observerOfCanvasContainer.observe(document.getElementById(this.sceneCanvasContainerId) as HTMLElement)
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
    // console.log('Clock ', this.clock?.getElapsedTime())
    this.renderer.render(this.scene, this.camera)
    this.animationFrameId = requestAnimationFrame(this.renderScene.bind(this))
  }
  updateSceneWithNewCanvas(canvas: HTMLCanvasElement) {
    this.initScene(canvas)
  }
  destroyWorld() {
    console.log('removing listeners')
    this.removeListeners()
  }
  setCanvasElement(canvas: HTMLCanvasElement) {
    this.renderer.domElement = canvas
  }
  setDirectionalLightTarget(target: THREE.Object3D<THREE.Event>){
    const directionalLight = this.scene.getObjectByName('directionalLight') as THREE.DirectionalLight
    directionalLight.target = target
  }
}
