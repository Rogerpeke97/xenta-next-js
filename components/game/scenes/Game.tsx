import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from 'three';
import { vertexShaderParticle, fragmentShaderParticle } from '../../../utils/game/shaders/sphereParticle';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BufferGeometry, Object3D } from "three";
import { AppHelpers } from "context/AppHelpers";


interface Axes {
  x: number;
  y: number;
  z: number;
}
interface HslAxes {
  h: number;
  s: number;
  l: number;
  x: number;
  y: number;
  z: number;
}

interface TrackedParticles {
  index: number;
  position: THREE.Vector3;
  wasSetAt: number;
  angleOfRotation: number;
}

const Game = ({ isGameFinished }: { isGameFinished: MutableRefObject<boolean> }) => {

  const { gameHelpers, windowWidth } = AppHelpers()
  const modelLoader = new GLTFLoader()
  const animationFrameId = useRef<number>(0)
  const TREE_COUNT = 40
  const scene = useRef<THREE.Scene>(new THREE.Scene())
  const renderer = useRef<THREE.WebGLRenderer>()
  const camera = useRef<THREE.PerspectiveCamera>()
  const hasCharacterHitTree = (scene: THREE.Scene) => {
    const character = scene.getObjectByName('character')
    let trees: Array<THREE.Mesh> = []
    scene.traverse((mesh) => {
      if (mesh instanceof THREE.Mesh && mesh.name === 'tree') {
        trees.push(mesh)
      }
    })
    if (trees.length === 0 || !character) return
    const characterPosition = character.position
    const TOLERABLE_MARGINS_FOR_COLLISION = {
      x: 0.3,
      y: 0.4,
      z: 0.2
    }
    const isBetweenTreeAxes = (character: THREE.Vector3, treePosition: THREE.Vector3) => {
      const isBetweenY = character.y < treePosition.y + TOLERABLE_MARGINS_FOR_COLLISION.y
        && character.y > treePosition.y - TOLERABLE_MARGINS_FOR_COLLISION.y
      const isBetweenX = character.x < treePosition.x + TOLERABLE_MARGINS_FOR_COLLISION.x
        && character.x > treePosition.x - TOLERABLE_MARGINS_FOR_COLLISION.x
      const isBetweenZ = character.z < treePosition.z + TOLERABLE_MARGINS_FOR_COLLISION.z
        && character.z > treePosition.z - TOLERABLE_MARGINS_FOR_COLLISION.z

      return isBetweenY && isBetweenX && isBetweenZ
    }
    let hasBeenHit = false
    for (let i = 0; i < TREE_COUNT; i++) {
      if (isBetweenTreeAxes(characterPosition, trees[i].position)) {
        hasBeenHit = true
        break
      }
    }
    return hasBeenHit
  }
  const updateCharacterPosition = (scene: THREE.Scene) => {
    const character = scene.getObjectByName('character')
    if (!character || !characterAnimationMixer.current) return
    characterAnimationMixer.current.clipAction(
      characterAnimations.current[0]
    ).play()
    const ALLOWED_X_MAX_VALUE_LEFT = PLANET_ORIGIN_AXES.x - 2.5
    const ALLOWED_X_MAX_VALUE_RIGHT = PLANET_ORIGIN_AXES.x + 2.5
    if (trackedKeys.current.ArrowLeft && character.position.x > ALLOWED_X_MAX_VALUE_LEFT) {
      const characterNewPositionX = character.position.x - 0.05
      const characterPositionY = Math.sqrt(Math.pow(PLANET_RADIUS, 2) - Math.pow(characterNewPositionX - PLANET_ORIGIN_AXES.x, 2)) + PLANET_ORIGIN_AXES.y
      character.position.set(characterNewPositionX, characterPositionY, character.position.z)

    }
    if (trackedKeys.current.ArrowRight && character.position.x < ALLOWED_X_MAX_VALUE_RIGHT) {
      const characterNewPositionX = character.position.x + 0.05
      const characterPositionY = Math.sqrt(Math.pow(PLANET_RADIUS, 2) - Math.pow(characterNewPositionX - PLANET_ORIGIN_AXES.x, 2)) + PLANET_ORIGIN_AXES.y
      character.position.set(characterNewPositionX, characterPositionY, character.position.z)
    }
    if (hasCharacterHitTree(scene) && !isGameFinished.current) {
      if (gameHelpers.isCharacterBeingHit) return
      for (let i = gameHelpers.lives.length - 1; i >= 0; i--) {
        if (gameHelpers.lives[i].isActive) {
          gameHelpers.isCharacterBeingHit = true
          const newLives = [...gameHelpers.lives]
          newLives[i].isActive = false
          gameHelpers.setLives(newLives)
          setTimeout(() => { gameHelpers.isCharacterBeingHit = false }, 2000)
          if (i === 0) {
            isGameFinished.current = true
            gameHelpers.isCharacterBeingHit = false
          }
          return
        }
      }
    }
  }
  const characterAnimationMixer = useRef<THREE.AnimationMixer>()
  const characterAnimations = useRef<THREE.AnimationClip[]>([])
  const setCameraPosition = (camera: THREE.PerspectiveCamera, position: Axes, rotation: Axes) => {
    camera.position.set(position.x, position.y, position.z)
    camera.rotation.set(rotation.x, rotation.y, rotation.z)
  }
  const hasCollidedWithPlanet = (point: THREE.Vector3) => {
    const coordinatesForCollisionCalc = Math.pow(point.x - PLANET_ORIGIN_AXES.x, 2) + Math.pow(point.y - PLANET_ORIGIN_AXES.y, 2) + Math.pow(point.z - PLANET_ORIGIN_AXES.z, 2)
    const hasCollision = Math.sqrt(coordinatesForCollisionCalc) <= PLANET_RADIUS
    return hasCollision
  }
  const calculateParticleRotation = (vector: THREE.Vector3, indexInArray: number, particlePositions: (THREE.BufferAttribute | THREE.InterleavedBufferAttribute), rotationAngle: number) => {
    const rotationAngleInRadians = rotationAngle * Math.PI / 180
    const particleAfterRotationZ = Math.cos(rotationAngleInRadians) * (vector.z - PLANET_ORIGIN_AXES.z) - Math.sin(rotationAngleInRadians) * (vector.y - PLANET_ORIGIN_AXES.y) + PLANET_ORIGIN_AXES.z
    const particleAfterRotationY = Math.sin(rotationAngleInRadians) * (vector.z - PLANET_ORIGIN_AXES.z) + Math.cos(rotationAngleInRadians) * (vector.y - PLANET_ORIGIN_AXES.y) + PLANET_ORIGIN_AXES.y
    const particleAfterRotationX = vector.x
    particlePositions.setXYZ(indexInArray, particleAfterRotationX, particleAfterRotationY, particleAfterRotationZ)
  }
  const moveParticles = (particles: THREE.BufferGeometry, clock: THREE.Clock, particlesSystem: THREE.Points, PARTICLES_COUNT: number, trackedStillParticles: Array<TrackedParticles>) => {
    let trackedParticle
    const particlesPosition = particles.getAttribute('position')
    const PARTICLE_AXES = 3
    const vectorCollision = new THREE.Vector3()

    for (let i = 0; i < PARTICLES_COUNT; i++) {
      if (particlesPosition.getY(i) < -10) {
        particlesPosition.setY(i, particlesPosition.getY(i) + 30)
      }
      vectorCollision.set(particlesPosition.getX(i), particlesPosition.getY(i), particlesPosition.getZ(i))
      if (hasCollidedWithPlanet(vectorCollision)) {
        trackedParticle = trackedStillParticles.find(particle => particle.index === i)
        if (trackedParticle) {
          if (clock.getElapsedTime() - trackedParticle.wasSetAt > 2) {
            trackedStillParticles.splice(trackedStillParticles.indexOf(trackedParticle), 1)
            particlesPosition.setY(i, particlesPosition.getY(i) + 30)
            continue
          }
          calculateParticleRotation(vectorCollision, i, particlesPosition, trackedParticle.angleOfRotation)
          if (trackedParticle.angleOfRotation <= 0) {
            trackedParticle.angleOfRotation = 360
            continue
          }
          trackedParticle.angleOfRotation -= 0.01
          continue
        }
        trackedStillParticles.push({ index: i, position: vectorCollision, wasSetAt: clock.getElapsedTime(), angleOfRotation: 0 })
        continue
      }
      particlesPosition
        .setY(i, particlesPosition.getY(i) - 0.01)
      particlesSystem.geometry.attributes.position.needsUpdate = true
    }
  }
  const addAmbientParticles = (scene: THREE.Scene, renderer: THREE.WebGLRenderer, clock: THREE.Clock, resolution: THREE.Vector2) => {
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
      particlePositionX = Math.random() * PARTICLES_DISTANCE + PLANET_ORIGIN_AXES.x / 2 - 10
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
        time: { value: clock.getElapsedTime() },
        resolution: { value: resolution },
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
    const trackedStillParticles: Array<TrackedParticles> = []
    renderer.setAnimationLoop(() => {
      if (isGameFinished.current) {
        if (characterAnimationMixer.current) {
          characterAnimationMixer.current?._actions[1]?.stop()
          if (characterAnimationMixer.current?._actions.length >= 2) return
          characterAnimationMixer.current?._actions[0].play()
          return
        }
        return
      }
      moveParticles(particles, clock, particlesSystem, PARTICLES_COUNT, trackedStillParticles)
      rotatePlanet(scene, clock)
      rotateTrees(scene, clock)
    })

    scene.add(particlesSystem)
  }
  const rotateTrees = (scene: THREE.Scene, clock: THREE.Clock) => {
    let trees: Array<THREE.Mesh> = []
    scene.traverse((mesh) => {
      if (mesh instanceof THREE.Mesh && mesh.name === 'tree') {
        trees.push(mesh)
      }
    })
    const AMOUNT_TO_ROTATE_DEG = 0.01
    const ALLOWED_X_MAX_VALUE_LEFT = -2.5
    const ALLOWED_X_MAX_VALUE_RIGHT = 2.5
    if (trees.length === 0) return
    let treePositionX, treePositionY, treePositionZ, treeRotationX, treeRotationZ, xz2dApparentPointRadius
    const currentTreeAngleOnPlanetZRadians = (angle: number) => angle * Math.PI / 180
    trees.forEach((tree) => {
      const MOVE_ON_X_AXIS = 0.03 * (Math.random() < 0.5 ? -1 : 1)
      if (!tree.userData.treeAngleOnPlanetZ) return
      tree.userData.treeAngleOnPlanetZ -= AMOUNT_TO_ROTATE_DEG
      if (tree.userData.treeAngleOnPlanetZ <= 0) {
        tree.userData.treeAngleOnPlanetZ = 360
      }
      treePositionX = tree.position.x - PLANET_ORIGIN_AXES.x + MOVE_ON_X_AXIS
      if (treePositionX > ALLOWED_X_MAX_VALUE_RIGHT) {
        treePositionX = ALLOWED_X_MAX_VALUE_RIGHT
      }
      if (treePositionX < ALLOWED_X_MAX_VALUE_LEFT) {
        treePositionX = ALLOWED_X_MAX_VALUE_LEFT
      }
      xz2dApparentPointRadius = Math.sqrt(Math.pow(PLANET_RADIUS, 2) - Math.pow(treePositionX, 2))
      treePositionZ = Math.sin(currentTreeAngleOnPlanetZRadians(tree.userData.treeAngleOnPlanetZ) * (180 / Math.PI)) * xz2dApparentPointRadius
      treeRotationZ = Math.asin(treePositionX / PLANET_RADIUS)
      treeRotationX = -currentTreeAngleOnPlanetZRadians(tree.userData.treeAngleOnPlanetZ) * (180 / Math.PI)
      treePositionY = Math.cos(currentTreeAngleOnPlanetZRadians(tree.userData.treeAngleOnPlanetZ) * (180 / Math.PI)) * xz2dApparentPointRadius
      tree.position.set(treePositionX + PLANET_ORIGIN_AXES.x, treePositionY + PLANET_ORIGIN_AXES.y, -treePositionZ + PLANET_ORIGIN_AXES.z)
      tree.rotation.set(treeRotationX, 0, -treeRotationZ)
    })
  }
  const render = (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, clock: THREE.Clock, oldTime: number) => {
    const currentTime = clock.getElapsedTime()
    characterAnimationMixer.current?.update(currentTime - oldTime) // deltaTime = currentTime - oldTime.
    renderer.render(scene, camera)
    animationFrameId.current = requestAnimationFrame(() => render(renderer, scene, camera, clock, currentTime))//  Not using THREE.getDelta because it wasn't working properly and I was lazy to research about it
  }
  const resize = (renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, renderScreenWidth: number, renderScreenHeight: number) => {
    if (canvasContainer.current === null) return
    renderScreenWidth = canvasContainer.current.clientWidth
    renderScreenHeight = canvasContainer.current.clientHeight
    renderer.setSize(renderScreenWidth, renderScreenHeight);
    camera.aspect = renderScreenWidth / renderScreenHeight;
    camera.updateProjectionMatrix();
  }
  const addPlanet = (scene: THREE.Scene, renderer: THREE.WebGLRenderer) => {
    const planetTexture = new THREE
      .TextureLoader()
      .load('/game/textures/rock.jpg', () => {
        planetTexture.wrapS = THREE.RepeatWrapping
        planetTexture.wrapT = THREE.RepeatWrapping
        planetTexture
          .repeat
          .set(2, 2)
      })
    const planetGeometry = new THREE.SphereBufferGeometry(10, 50, 50)
    const planetMaterial = new THREE.MeshStandardMaterial({ map: planetTexture, color: 0x55505a })
    const planet = new THREE.Mesh(planetGeometry, planetMaterial)
    planet.position.set(30, -2, 30)
    planet.rotation.z = Math.PI / 2
    planet.receiveShadow = true
    planet.name = 'planet'
    scene.add(planet)
  }
  const addTrees = (scene: THREE.Scene) => {
    modelLoader.load('/game/models/tree.glb', (tree) => {
      let treeGeometry: BufferGeometry | undefined
      let treeMaterial
      tree.scene.traverse((child: Object3D) => {
        if (child instanceof THREE.Mesh) {
          treeGeometry = child.geometry.clone().applyMatrix4(child.matrixWorld)
          treeMaterial = child.material
        }
      })
      const DISTANCE_TO_MERGE_TREES_TO_PLANET = 0.1
      let treePositionX, treePositionY, treePositionZ, treeRotationX, treeRotationY, treeRotationZ
      let xz2dApparentPointRadius
      let currentTreeAngleOnPlanetZ = 0
      const currentTreeAngleOnPlanetZRadians = (angle: number) => angle * Math.PI / 180
      const START_NUMBER_FOR_TREE_POSITION_X = 2
      const NUMBER_OF_POSIBILITIES_X = 6
      const AMOUNT_OF_DEGREES_TO_SUM = 360 / TREE_COUNT
      for (let j = 0; j < TREE_COUNT; j++) {
        const dummyTree = new THREE.Mesh(treeGeometry, treeMaterial)
        dummyTree.scale.set(0.1, 0.1, 0.1)
        treePositionX = Math.floor(Math.random() * NUMBER_OF_POSIBILITIES_X) - START_NUMBER_FOR_TREE_POSITION_X
        xz2dApparentPointRadius = Math.sqrt(Math.pow(PLANET_RADIUS, 2) - Math.pow(treePositionX, 2))
        treePositionZ = Math.sin(currentTreeAngleOnPlanetZRadians(currentTreeAngleOnPlanetZ) * (180 / Math.PI)) * xz2dApparentPointRadius
        treeRotationZ = Math.asin(treePositionX / PLANET_RADIUS)
        treeRotationX = -currentTreeAngleOnPlanetZRadians(currentTreeAngleOnPlanetZ) * (180 / Math.PI)
        treePositionY = Math.cos(currentTreeAngleOnPlanetZRadians(currentTreeAngleOnPlanetZ) * (180 / Math.PI)) * xz2dApparentPointRadius
        dummyTree.position.set(treePositionX + PLANET_ORIGIN_AXES.x, treePositionY + PLANET_ORIGIN_AXES.y - DISTANCE_TO_MERGE_TREES_TO_PLANET, -treePositionZ + PLANET_ORIGIN_AXES.z)
        dummyTree.rotation.set(treeRotationX, 0, -treeRotationZ)
        if (currentTreeAngleOnPlanetZ === 360) {
          currentTreeAngleOnPlanetZ = 0
          continue
        }
        currentTreeAngleOnPlanetZ += AMOUNT_OF_DEGREES_TO_SUM
        dummyTree.userData.treeAngleOnPlanetZ = currentTreeAngleOnPlanetZ
        dummyTree.castShadow = true
        dummyTree.name = 'tree'
        scene.add(dummyTree)
      }
    })
  }
  const addCharacter = (scene: THREE.Scene) => {
    modelLoader.load('/game/models/knight.gltf', (character) => {
      character.scene.traverse((child: Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
        }
      })
      character.scene.position.set(PLANET_ORIGIN_AXES.x, PLANET_ORIGIN_AXES.y + PLANET_RADIUS, PLANET_ORIGIN_AXES.z)
      character.scene.scale.set(0.4, 0.4, 0.4)
      character.scene.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI)
      character.scene.name = 'character'
      characterAnimationMixer.current = new THREE.AnimationMixer(character.scene)
      const idleAnimation = characterAnimationMixer.current.clipAction(character.animations[15])
      idleAnimation.play()
      idleAnimation.clampWhenFinished = true
      character.scene.castShadow = true
      characterAnimations.current = character.animations
      scene.add(character.scene)
    })
  }
  const rotatePlanet = (scene: THREE.Scene, clock: THREE.Clock) => {
    const planet = scene.getObjectByName('planet')
    if (!planet) return
    planet.rotation.x += 0.01
  }
  const setControls = (camera: THREE.Camera, renderer: THREE.WebGLRenderer) => {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0)
  }
  useEffect(() => {
    if (gameHelpers.gameInterval) return
    if (gameHelpers.intervalIds.length > 1) {
      gameHelpers.intervalIds.forEach((id: number, index: number) => {
        clearInterval(id)
      })
      gameHelpers.intervalIds = []
    }
    const interval = setInterval(() => updateCharacterPosition(scene.current), 15)
    gameHelpers.gameInterval = interval
    gameHelpers.intervalIds.push(interval)
  }, [gameHelpers])
  const canvasContainerSize = useMemo(() => {
    return {
      renderScreenHeight: canvasContainer.current?.clientHeight || 0,
      renderScreenWidth: canvasContainer.current?.clientWidth || 0
    }
  }, [windowWidth])
  useEffect(() => {
    const canvasForRenderer = document.getElementById('canvas')
    if(!canvasForRenderer) return
    renderer.current = new THREE.WebGLRenderer({ 
      canvas: canvasForRenderer
    })
    const { renderScreenHeight, renderScreenWidth } = canvasContainerSize
    const resolution = new THREE.Vector2(renderScreenWidth, renderScreenHeight)
    camera.current = new THREE.PerspectiveCamera(75, renderScreenWidth / renderScreenHeight, 0.1, 1000)
    renderer.current.shadowMap.enabled = true
    renderer.current.shadowMap.type = THREE.PCFSoftShadowMap
    const CHARACTER_POSITION_ON_PLANET_Y_AXIS = PLANET_ORIGIN_AXES.y + PLANET_RADIUS + 1.5
    setKeyDownListener()
    setKeyUpListener()
    setControls(camera.current, renderer.current)
    setCameraPosition(camera.current, { x: PLANET_ORIGIN_AXES.x, y: CHARACTER_POSITION_ON_PLANET_Y_AXIS, z: PLANET_ORIGIN_AXES.z + 1.2 }, { x: -0.7, y: 0, z: 0 })
    const clock = new THREE.Clock()
    addPlanet(scene.current, renderer.current)
    addTrees(scene.current)
    addCharacter(scene.current)
    addAmbientParticles(scene.current, renderer.current, clock, resolution)
    addLight(scene.current)
    renderer.current.setSize(renderScreenWidth, renderScreenHeight)
    camera.current.aspect = renderScreenWidth / renderScreenHeight
    camera.current.updateProjectionMatrix()
    window.addEventListener('resize', () => resize(renderer.current, camera.current, renderScreenWidth, renderScreenHeight))
    render(renderer.current, scene.current, camera.current, clock, clock.getElapsedTime())
    return () => {
      window.removeEventListener('resize', () => resize(renderer.current, camera.current, renderScreenWidth, renderScreenHeight))
      window.cancelAnimationFrame(animationFrameId.current)
      window.removeEventListener('keydown', afterKeyPressHandler)
      window.removeEventListener('keyup', afterKeyUnpressedHandler)
    }
  }, [trackedKeys])
  useEffect(() => {
    const { renderScreenHeight, renderScreenWidth } = canvasContainerSize
    resize(renderer.current, camera.current, renderScreenWidth, renderScreenHeight)
  }, [canvasContainerSize])
  useEffect(() => {
    const { renderScreenHeight, renderScreenWidth } = canvasContainerSize
    resize(renderer.current, camera.current, renderScreenWidth, renderScreenHeight)
  }, [])

  return (
    <div className="h-full" ref={canvasContainer}>
      <canvas id="canvas" className="max-w-full h-full rounded-lg" />
    </div>
  )

}


export default Game;