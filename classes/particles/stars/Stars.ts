import * as THREE from 'three';
import { findNormalizedValue, randomizeNumBetweenMinAndMax } from 'utils/game/math';
import { starsFragmentShader, starsVertexShader } from "utils/game/shaders/stars";

type centerOriginAxes = {
  x: number,
  y: number,
  z: number
}

export enum StarsType {
  harmless = 'harmless',
  harmful = 'harmful'
}

export interface StarsConstructorParams {
  scene: THREE.Scene,
  resolution: THREE.Vector2,
  clock: THREE.Clock,
  centerOriginAxes: centerOriginAxes,
  starsType?: StarsType,
  customColor?: THREE.Vector3,
  particlesCount?: number,
  particlesDistanceFromEachOther?: number,
}

export class Stars {
  scene!: THREE.Scene;
  resolution!: THREE.Vector2;
  starsType!: StarsType;
  particlesCount!: number;
  particlesDistanceFromEachOther!: number;
  clock!: THREE.Clock;
  customColor: THREE.Vector3 | undefined = undefined;
  uniformsForParticles: {
    time: { value: number },
    resolution: { value: THREE.Vector2 },
    particleTexture: { value: THREE.Texture | null }
  } = {
    time: { value: 0 } ,
    resolution: { value: this.resolution },
    particleTexture: { value: null }
  }
  centerOriginAxes!: {
    x: number,
    y: number,
    z: number
  }
  constructor({ scene, resolution, clock, centerOriginAxes, customColor, 
    particlesCount = 1800, particlesDistanceFromEachOther = 53, starsType = StarsType.harmless }: 
    StarsConstructorParams) {
    this.scene = scene
    this.resolution = resolution
    this.clock = clock
    this.starsType = starsType
    this.centerOriginAxes = centerOriginAxes
    this.particlesCount = particlesCount
    this.particlesDistanceFromEachOther = particlesDistanceFromEachOther
    this.customColor = customColor
    this.addParticles()
    if(starsType === StarsType.harmful){
      this.animateExplosiveStars()
    }
  }
  public updateTimeUniform(time: number) {
    this.uniformsForParticles.time.value = time
  }
  private addParticles () {
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
      particlePositionX = Math.random() * PARTICLES_DISTANCE + this.centerOriginAxes.x / 2 - 10
      particlePositionY = Math.random() * PARTICLES_DISTANCE
      particlePositionZ = Math.random() * PARTICLES_DISTANCE
      positions.push(particlePositionX, particlePositionY, particlePositionZ)
      if(this.customColor){
        color.set(this.customColor.x, this.customColor.y, this.customColor.z)
      } else {
        color.set(Math.random() * NORMALIZED_VEC_MAX, Math.random() * NORMALIZED_VEC_MAX, Math.random() * NORMALIZED_VEC_MAX)
      }
      colors.push(color.x, color.y, color.z)
    }
    particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    particles.setAttribute('customParticleColor', new THREE.Float32BufferAttribute(colors, 3))
    this.uniformsForParticles.particleTexture.value = particleTexture
    const particleShaderMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniformsForParticles,
      vertexShader: starsVertexShader(),
      fragmentShader: starsFragmentShader(this.starsType),
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false,
      transparent: true,
    })
    const particlesSystem = new THREE.Points(particles, particleShaderMaterial)
    console.log('particlesSystem', particlesSystem)
    particlesSystem.castShadow = true
    this.scene.add(particlesSystem)
  }
  private animateExplosiveStars() {
    setInterval(() => {
      // console.log(this.starsType)
      // console.log('animating explosive stars')
      this.uniformsForParticles.time.value = this.clock.getElapsedTime()
    }, 10)
  }

}