import { useCallback, useEffect, useRef } from "react";
import * as THREE from 'three';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';
import { vertexShaderParticle, fragmentShaderParticle } from '../../../plugins/game/shaders/sphereParticle';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BufferGeometry, BufferGeometryUtils, Object3D } from "three";


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

const Menu = () => {

  const canvasContainer = useRef<HTMLDivElement>(null);

  const PLANET_ORIGIN_AXES = {
    x: 30,
    y: -2,
    z: 30
  }

  const modelLoader = new GLTFLoader()

  const characterAnimationMixer = useRef<THREE.AnimationMixer>()

  function setCameraPosition(camera: THREE.PerspectiveCamera, position: Axes, rotation: Axes) {
    camera.position.set(position.x, position.y, position.z)
    camera.rotation.set(rotation.x, rotation.y, rotation.z)
  }

  function addSunLight(scene: THREE.Scene) {
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.angle = Math.PI / 5
    spotLight.penumbra = 0.2
    spotLight.position.set(20, 10, 40)
    spotLight.castShadow = true
    spotLight.shadow.camera.near = 3
    spotLight.shadow.camera.far = 10
    spotLight.shadow.mapSize.width = 1024
    spotLight.shadow.mapSize.height = 1024
    scene.add(spotLight)

    const dirLight = new THREE.DirectionalLight(0x55505a, 1);
    dirLight.position.set(0, 10, 0)
    dirLight.castShadow = true
    dirLight.shadow.camera.near = 1
    dirLight.shadow.camera.far = 10

    dirLight.shadow.camera.right = 1
    dirLight.shadow.camera.left = - 1
    dirLight.shadow.camera.top = 1
    dirLight.shadow.camera.bottom = - 1

    dirLight.shadow.mapSize.width = 1024
    dirLight.shadow.mapSize.height = 1024
    scene.add(dirLight)

    const light = new THREE.AmbientLight(0xFF0000)
    scene.add(light)
  }
  function hasCollidedWithPlanet(point: THREE.Vector3) {
    const PLANET_RADIUS = 10
    const coordinatesForCollisionCalc = Math.pow(point.x - PLANET_ORIGIN_AXES.x, 2) + Math.pow(point.y - PLANET_ORIGIN_AXES.y, 2) + Math.pow(point.z - PLANET_ORIGIN_AXES.z, 2)
    const hasCollision = Math.sqrt(coordinatesForCollisionCalc) <= PLANET_RADIUS
    return hasCollision
  }

  function calculateParticleRotation(vector: THREE.Vector3, indexInArray: number, particlePositions: (THREE.BufferAttribute | THREE.InterleavedBufferAttribute), rotationAngle: number) {
    const rotationAngleInRadians = rotationAngle * Math.PI / 180
    const particleAfterRotationZ = Math.cos(rotationAngleInRadians) * (vector.z - PLANET_ORIGIN_AXES.z) - Math.sin(rotationAngleInRadians) * (vector.y - PLANET_ORIGIN_AXES.y) + PLANET_ORIGIN_AXES.z
    const particleAfterRotationY = Math.sin(rotationAngleInRadians) * (vector.z - PLANET_ORIGIN_AXES.z) + Math.cos(rotationAngleInRadians) * (vector.y - PLANET_ORIGIN_AXES.y) + PLANET_ORIGIN_AXES.y
    const particleAfterRotationX = vector.x
    particlePositions.setXYZ(indexInArray, particleAfterRotationX, particleAfterRotationY, particleAfterRotationZ)
  }

  const moveParticles = useCallback((particles: THREE.BufferGeometry, clock: THREE.Clock, particlesSystem: THREE.Points, PARTICLES_COUNT: number, trackedStillParticles: Array<TrackedParticles>) => {
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
          if (trackedParticle.angleOfRotation > 360) {
            trackedParticle.angleOfRotation = 0
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
  }, [])

  const addAmbientParticles = useCallback((scene: THREE.Scene, renderer: THREE.WebGLRenderer, clock: THREE.Clock, resolution: THREE.Vector2) => {
    const PARTICLES_COUNT = 750
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
      transparent: true
    })
    const particlesSystem = new THREE.Points(particles, particleShaderMaterial)
    const trackedStillParticles: Array<TrackedParticles> = []
    renderer.setAnimationLoop(() => {
      moveParticles(particles, clock, particlesSystem, PARTICLES_COUNT, trackedStillParticles)
      rotatePlanet(scene, clock)
      rotateTrees(scene, clock)
    })
    scene.add(particlesSystem)
  }, [moveParticles])


  function rotateTrees(scene: THREE.Scene, clock: THREE.Clock) {
    const trees = scene.getObjectByName('trees')
    if (!trees) return
    trees.rotation.x += 0.01
  }

  const valueToCheckRerender = Math.random()


  const render = useCallback((renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, clock: THREE.Clock, oldTime: number) => {
    console.log(valueToCheckRerender)
    const currentTime = clock.getElapsedTime()
    characterAnimationMixer.current?.update(currentTime - oldTime) // deltaTime = currentTime - oldTime.
    renderer.render(scene, camera)
    requestAnimationFrame(() => render(renderer, scene, camera, clock, currentTime))//  Not using THREE.getDelta because it wasn't working properly and I was lazy to research about it
  }, [])

  const resize = useCallback((renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, renderScreenWidth: number, renderScreenHeight: number) => {
    if (canvasContainer.current === null) return
    renderScreenWidth = canvasContainer.current.clientWidth
    renderScreenHeight = canvasContainer.current.clientHeight
    renderer.setSize(renderScreenWidth, renderScreenHeight);
    camera.aspect = renderScreenWidth / renderScreenHeight;
    camera.updateProjectionMatrix();
  }, [])

  function addPlanet(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
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
    const planetMaterial = new THREE.MeshPhongMaterial({ map: planetTexture })
    const planet = new THREE.Mesh(planetGeometry, planetMaterial)
    planet.position.set(30, -2, 30)
    planet.rotation.z = Math.PI / 2
    planet.receiveShadow = true
    planet.name = 'planet'
    scene.add(planet)
  }

  function addTrees(scene: THREE.Scene) {
    const TREE_COUNT = 20
    modelLoader.load('/game/models/tree.glb', (tree) => {
      let treeGeometry: BufferGeometry | undefined
      let treeMaterial
      tree.scene.traverse((child: Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
          treeGeometry = child.geometry.clone().applyMatrix4(child.matrixWorld)
          treeMaterial = child.material
        }
      })
      const treesInstancedMesh = new THREE.InstancedMesh(treeGeometry, treeMaterial, TREE_COUNT)
      const DISTANCE_TO_MERGE_TREES_TO_PLANET = 0.1
      treesInstancedMesh.position.set(PLANET_ORIGIN_AXES.x, PLANET_ORIGIN_AXES.y - DISTANCE_TO_MERGE_TREES_TO_PLANET, PLANET_ORIGIN_AXES.z)
      treesInstancedMesh.name = 'trees'
      const dummyTree = new THREE.Object3D()
      let treePositionX, treePositionY, treePositionZ, treeRotationX, treeRotationY, treeRotationZ
      let xz2dApparentPointRadius
      let currentTreeAngleOnPlanetZ = 0
      const currentTreeAngleOnPlanetZRadians = (angle: number) => angle * Math.PI / 180
      const START_NUMBER_FOR_TREE_POSITION_X = 2
      const NUMBER_OF_POSIBILITIES_X = 6
      const PLANET_RADIUS = 10
      const AMOUNT_OF_DEGREES_TO_SUM = 360 / TREE_COUNT
      for (let j = 0; j < TREE_COUNT; j++) {
        dummyTree.scale.set(0.1, 0.1, 0.1)
        treePositionX = Math.floor(Math.random() * NUMBER_OF_POSIBILITIES_X) - START_NUMBER_FOR_TREE_POSITION_X
        xz2dApparentPointRadius = Math.sqrt(Math.pow(PLANET_RADIUS, 2) - Math.pow(treePositionX, 2))
        treePositionZ = Math.sin(currentTreeAngleOnPlanetZRadians(currentTreeAngleOnPlanetZ) * (180 / Math.PI)) * xz2dApparentPointRadius
        treeRotationZ = Math.asin(treePositionX / PLANET_RADIUS)
        treeRotationX = -currentTreeAngleOnPlanetZRadians(currentTreeAngleOnPlanetZ) * (180 / Math.PI)
        treePositionY = Math.cos(currentTreeAngleOnPlanetZRadians(currentTreeAngleOnPlanetZ) * (180 / Math.PI)) * xz2dApparentPointRadius
        dummyTree.position.set(treePositionX, treePositionY, -treePositionZ)
        dummyTree.rotation.set(treeRotationX, 0, -treeRotationZ)
        dummyTree.updateMatrix()
        treesInstancedMesh.setMatrixAt(j, dummyTree.matrix)
        if (currentTreeAngleOnPlanetZ === 360) {
          currentTreeAngleOnPlanetZ = 0
          continue
        }
        currentTreeAngleOnPlanetZ += AMOUNT_OF_DEGREES_TO_SUM
      }
      treesInstancedMesh.instanceMatrix.needsUpdate = true
      scene.add(treesInstancedMesh)
    })
  }

  function addCharacter(scene: THREE.Scene) {
    const PLANET_RADIUS = 10
    modelLoader.load('/game/models/knight.gltf', (character) => {
      character.scene.position.set(PLANET_ORIGIN_AXES.x, PLANET_ORIGIN_AXES.y + PLANET_RADIUS, PLANET_ORIGIN_AXES.z)
      character.scene.scale.set(0.4, 0.4, 0.4)
      character.scene.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI)
      character.scene.name = 'character'
      characterAnimationMixer.current = new THREE.AnimationMixer(character.scene)
      const idleAnimation = characterAnimationMixer.current.clipAction(character.animations[15])
      idleAnimation.play()
      idleAnimation.clampWhenFinished = true
      scene.add(character.scene)

      characterAnimationMixer
        .current
        .addEventListener('loop', (e) => {
          if (e.action._clip.name === "knight_jump_up_root") {
            characterAnimationMixer.current?.stopAllAction()
          }
        })
    })
  }


  function rotatePlanet(scene: THREE.Scene, clock: THREE.Clock) {
    const planet = scene.getObjectByName('planet')
    if (!planet) return
    planet.rotation.x += 0.01
  }

  function setBackground(scene: THREE.Scene) {
    const background = new THREE
      .TextureLoader()
      .load("/game/textures/sky.jpeg")
    background.minFilter = THREE.LinearFilter
    scene.background = background
  }

  function setControls(camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0)
  }

  useEffect(() => {
    const canvasElement = document.getElementById('canvas');
    if (!canvasContainer.current || !canvasElement) {
      return
    }
    let renderScreenHeight = canvasContainer.current.clientHeight
    let renderScreenWidth = canvasContainer.current.clientWidth
    const resolution = new THREE.Vector2(renderScreenWidth, renderScreenHeight)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, renderScreenWidth / renderScreenHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ canvas: canvasElement })
    setControls(camera, renderer)
    setCameraPosition(camera, { x: 30, y: 10, z: 40 }, { x: -0.3, y: 0, z: 0 })
    addSunLight(scene)
    const clock = new THREE.Clock()
    addPlanet(scene, renderer)
    addTrees(scene)
    addCharacter(scene)
    addAmbientParticles(scene, renderer, clock, resolution)
    // setBackground(scene)
    renderer.setSize(renderScreenWidth, renderScreenHeight)
    window.addEventListener('resize', () => resize(renderer, camera, renderScreenWidth, renderScreenHeight))
    render(renderer, scene, camera, clock, clock.getElapsedTime())

    return () => {
      window.removeEventListener('resize', () => resize(renderer, camera, renderScreenWidth, renderScreenHeight))
    }

  }, [render, resize, addAmbientParticles])

  return (
    <div className="h-screen block" ref={canvasContainer}>
      <canvas id="canvas" className="max-w-full rounded-lg" />
    </div>
  )

}


export default Menu;