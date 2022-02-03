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

    const light = new THREE.AmbientLight( 0xFF0000 )
    scene.add(light)
  }
  function hasCollidedWithPlanet(point: THREE.Vector3) {
    const planetOriginAxes = {
      x: 30,
      y: -2,
      z: 30
    }
    const PLANET_RADIUS = 10
    const coordinatesForCollisionCalc = Math.pow(point.x - planetOriginAxes.x, 2) + Math.pow(point.y - planetOriginAxes.y, 2) + Math.pow(point.z - planetOriginAxes.z, 2)
    const hasCollision = Math.sqrt(coordinatesForCollisionCalc) <= PLANET_RADIUS
    return hasCollision
  }

  function calculateParticleRotation(vector: THREE.Vector3, indexInArray: number, particlePositions: (THREE.BufferAttribute | THREE.InterleavedBufferAttribute), rotationAngle: number) {
    const PLANET_ORIGIN_AXES = {
      x: 30,
      y: -2,
      z: 30
    }
    const rotationAngleInRadians = rotationAngle * Math.PI / 180
    const particleAfterRotationZ = Math.cos(rotationAngleInRadians) * (vector.z - PLANET_ORIGIN_AXES.z) - Math.sin(rotationAngleInRadians) * (vector.y - PLANET_ORIGIN_AXES.y) + PLANET_ORIGIN_AXES.z
    const particleAfterRotationY = Math.sin(rotationAngleInRadians) * (vector.z - PLANET_ORIGIN_AXES.z) + Math.cos(rotationAngleInRadians) * (vector.y - PLANET_ORIGIN_AXES.y) + PLANET_ORIGIN_AXES.y
    const particleAfterRotationX = vector.x
    particlePositions.setXYZ(indexInArray, particleAfterRotationX, particleAfterRotationY, particleAfterRotationZ)
  }

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
      particlePositionX = Math.random() * PARTICLES_DISTANCE
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
    const particlesPosition = particles.getAttribute('position')
    const PARTICLE_AXES = 3
    const vectorCollision = new THREE.Vector3()
    console.log(particlesPosition)
    const trackedStillParticles: Array<TrackedParticles> = []
    let trackedParticle
    renderer.setAnimationLoop(() => {
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
      rotatePlanet(scene, clock)
    })
    scene.add(particlesSystem)
  }, [])

  const render = useCallback((renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
    renderer.render(scene, camera)
    requestAnimationFrame(() => render(renderer, scene, camera))
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
    const PLANET_ORIGIN_AXES = {
      x: 30,
      y: -2,
      z: 30
    }
    const treeLoader = new GLTFLoader()
    const TREE_COUNT = 20
    treeLoader.load('/game/models/tree.glb', (tree) => {
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
      treesInstancedMesh.position.set(PLANET_ORIGIN_AXES.x, PLANET_ORIGIN_AXES.y, PLANET_ORIGIN_AXES.z)
      treesInstancedMesh.name = 'trees'
      const dummyTree = new THREE.Object3D()
      let treePositionX, treePositionY, treePositionZ, treeRotationX, treeRotationY, treeRotationZ
      let xz2dApparentPointRadius
      let currentTreeAngleOnPlanetZ = 0
      const currentTreeAngleOnPlanetZRadians = (angle: number) => angle * Math.PI / 180
      const START_NUMBER_FOR_TREE_POSITION_X = 0
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
        if(currentTreeAngleOnPlanetZ === 360) {
          currentTreeAngleOnPlanetZ = 0
          continue
        }
        currentTreeAngleOnPlanetZ += AMOUNT_OF_DEGREES_TO_SUM
      }
      treesInstancedMesh.instanceMatrix.needsUpdate = true
      scene.add(treesInstancedMesh)
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
    addAmbientParticles(scene, renderer, clock, resolution)
    // setBackground(scene)
    renderer.setSize(renderScreenWidth, renderScreenHeight)
    window.addEventListener('resize', () => resize(renderer, camera, renderScreenWidth, renderScreenHeight))
    console.log(scene)
    render(renderer, scene, camera)

    return () => {
      window.removeEventListener('resize', () => resize(renderer, camera, renderScreenWidth, renderScreenHeight))
    }

  }, [render, resize, addAmbientParticles])































  // useEffect(() => {
  //   let height = canvasContainer.current.clientHeight;
  //   let width = canvasContainer.current.clientWidth;
  //   const scene = new THREE.Scene();
  //   //scene.add(helper) ONLY FOR DEBUGGING

  //   camera.current = new THREE.PerspectiveCamera(40, width / height, 1, 1500);
  //   const renderer = new THREE.WebGLRenderer({ antialias: true });
  //   /*let controls = new OrbitControls(camera.current, renderer.domElement);
  //   controls
  //       .target
  //       .set(0, 0, 0);*/
  //   camera
  //     .current.position
  //     .set(9, -0.5, -7);
  //   camera
  //     .current.rotation.y = 2.3;
  //   camera
  //     .current.rotation.x = -0.1;



  //   //

  //   const textureFlare = new THREE.TextureLoader();
  //   const textureFlare0 = textureFlare.load('lensflare0.png');
  //   const textureFlare3 = textureFlare.load('lensflare3.png');

  //   const addLight = (h, s, l, x, y, z) => {

  //     const light = new THREE.PointLight(0xffffff, 1.5, 7500);
  //     light.color.setHSL(h, s, l);
  //     light.position.set(x, y, z);
  //     scene.add(light);

  //     const lensflare = new Lensflare();
  //     lensflare.addElement(new LensflareElement(textureFlare0, 700, 0, light.color));
  //     lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
  //     lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
  //     lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
  //     lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
  //     light.add(lensflare);

  //   }

  //   addLight(0.55, 1.5, 0.5, 5000, 0, 1000);
  //   addLight(0.08, 1.4, 0.5, -1000, 100, 1005);
  //   addLight(0.995, 1.2, 0.9, 5000, 5000, 1000);

  //   let clock = new THREE.Clock();
  //   window.addEventListener('resize', () => {
  //     if (canvasContainer.current !== null) {
  //       width = canvasContainer.current.clientWidth
  //       height = canvasContainer.current.clientHeight
  //       renderer.setSize(width, height);
  //       camera.current.aspect = width / height;
  //       camera.current.updateProjectionMatrix();
  //     }
  //   });

  //   //// PARTICLES
  //   const particleCount = 750;
  //   const particleDistance = 53;
  //   let particles = new THREE.BufferGeometry();
  //   const texture = new THREE
  //     .TextureLoader()
  //     .load('leaftexture.png');
  //   const pMaterial = new THREE.PointsMaterial({
  //     color: 'green', size: 0.3, map: texture, alphaTest: 0.1, // removes black squares,
  //     blending: THREE.CustomBlending,
  //     transparent: true
  //   });

  //   let positions = [];
  //   let posX, posY, posZ;
  //   for (let i = 0; i < 750; i++) {
  //     posX = (Math.random() - 0.5) * particleDistance;
  //     posY = (Math.random() - 0.5) * particleDistance;;
  //     posZ = (Math.random() - 0.5) * particleDistance;;
  //     positions.push(posX, posY, posZ);
  //   }
  //   particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  //   // create the particle system
  //   let particleSys = new THREE.Points(particles, pMaterial);
  //   particleSys.name = 'particleSys';
  //   let star = particleSys.geometry.attributes.position.array;
  //   renderer.setAnimationLoop(() => {
  //     for (let i = 1; i < particleCount * 3; i += 3) {
  //       star[i] -= 0.01;
  //       if (star[i] < -10) {
  //         star[i] = 20;
  //       }
  //       particleSys.geometry.attributes.position.needsUpdate = true;
  //     }
  //   })
  //   scene.add(particleSys)
  //   // CHARACTER ADDON FOR MAIN MENU
  //   const loader = new GLTFLoader()
  //   let action;
  //   loader.load("knight.gltf", function (object) {
  //     object.scene.position.x = 0;
  //     object.scene.position.y = -2;
  //     object.scene.position.z = -2;
  //     mixer.current = new THREE.AnimationMixer(object.scene);
  //     action = mixer.current.clipAction(object.animations[15]);
  //     action.play();
  //     scene.add(object.scene);
  //     switcher.current = 1;
  //   });
  //   // setTimeout(()=>mixer.clipAction(obj.animations[1]).play(), 8000)// WORKS
  //   // TRYING A SPHERE
  //   const floorTexture = new THREE
  //     .TextureLoader()
  //     .load('homescreenGrass.jpg', () => {
  //       floorTexture.wrapS = THREE.RepeatWrapping;
  //       floorTexture.wrapT = THREE.RepeatWrapping;
  //       floorTexture
  //         .repeat
  //         .set(2, 2);
  //     });
  //   /*let floorBump = new THREE
  //       .TextureLoader(manager)
  //       .load('sunbump.png', () => {
  //           floorTexture.wrapS = THREE.RepeatWrapping;
  //           floorTexture.wrapT = THREE.RepeatWrapping;
  //           floorTexture
  //               .repeat
  //               .set(2, 2);
  //       });*/
  //   const geometrySphere = new THREE.SphereGeometry(7, 25, 25);
  //   const materialSphere = new THREE.MeshLambertMaterial({ map: floorTexture, alphaTest: 0.1 });
  //   const sphere = new THREE.Mesh(geometrySphere, materialSphere);
  //   sphere.rotation.x = 1;
  //   sphere.position.set(0, -9, -2);
  //   scene.add(sphere);
  //   const textu = new THREE
  //     .TextureLoader()
  //     .load("/textures/skyBackgroundCropped.jpeg");
  //   textu.minFilter = THREE.LinearFilter;
  //   scene.background = textu;
  //   //TREE
  //   const treeLoader = new GLTFLoader();
  //   let trees_instanced_mesh;
  //   let treeRotationX, treePositionY;
  //   let newX = -5;
  //   let angleSphereForTrees = 0;
  //   let geometry_merged = new THREE.BufferGeometry();
  //   let geometry_array = [];
  //   let material_tree;
  //   treeLoader.load('new_tree.glb', (tree) => {
  //     tree.scene.traverse((child) => {
  //       if (child.isMesh) {
  //         geometry_array.push(child.geometry.clone().applyMatrix4(child.matrixWorld));
  //         material_tree = child.material;
  //       }
  //     });
  //     geometry_merged = BufferGeometryUtils.mergeBufferGeometries(geometry_array);
  //     //geometry_merged.merge(child.geometry, child.matrix);
  //     //const mesh_material = new THREE.MeshStandardMaterial({color: 0xFFFFFF});
  //     trees_instanced_mesh = new THREE.InstancedMesh(geometry_merged, material_tree, 2);
  //     trees_instanced_mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
  //     //trees_instanced_mesh.instanceMatrix.needsUpdate = true;
  //     //dummy_tree.add(tree_children[i]);
  //     for (let j = 0; j < 2; j++) {
  //       let dummy_tree = new THREE.Object3D();
  //       dummy_tree.scale.set(0.3, 0.3, 0.3);
  //       newX += 3; //RANDOM NUMBER BETWEEN -7 AND 7
  //       zRotationNewRadius = Math.sqrt(49 - (newX * newX)); // NEW RADIUS IF LOOKED FROM THE SIDE, LOOKS AS IF THE RADIUS DECREASED
  //       z = Math.sin(angleSphereForTrees * (180 / Math.PI)) * zRotationNewRadius;
  //       // I HAVE TO USE THE SAME FORMULA AS THE KNIGHT TO POSITION THE TREE WITH THE
  //       // RIGHT ROTATION AND Y POSITION AROUND THE SPHERE TREE ROTATION SIN ANGLE =
  //       // OPOSSITE OVER HYPOTHENUSE
  //       treeRotationZ = Math.asin(newX / 7); //SPHERE RADIUS = 7

  //       treeRotationX = -angleSphereForTrees * (180 / Math.PI); //The tree rotation ON X AXIS (FORWARDS)

  //       //FIND Y OPOSSITE = SQUARE ROOT OF RADIUS SQUARED - ADYACER = Z SQUARED
  //       treePositionY = Math.cos(angleSphereForTrees * (180 / Math.PI)) * zRotationNewRadius;

  //       dummy_tree.position.set(newX, treePositionY - 9.3, -z - 3.2);
  //       dummy_tree.rotation.set(treeRotationX, 0, -treeRotationZ);
  //       dummy_tree.updateMatrix();
  //       trees_instanced_mesh.setMatrixAt(j, dummy_tree.matrix);
  //       //angleSphereForTrees += 0.00813333333; //keep it at 0 because trees are on a fixed x value
  //     }
  //     trees_instanced_mesh.instanceMatrix.needsUpdate = true;
  //     scene.add(trees_instanced_mesh);
  //     /*tree.scene.position.set(0, -2.1, -3.2);
  //     tree.scene.rotation.x = -0.2;
  //     tree.scene.rotation.y = -0.4;
  //     scene.add(tree.scene);*/
  //   })

  //   //GRASS

  //   const dummy = new THREE.Object3D();
  //   let zRotationNewRadius, treeRotationZ, grassRotationX, z, grassPositionY;
  //   //GRASS USED BLENDER TO CREATE LITTLE BLOCKS OF GRASS AND WIND ANIMATION
  //   const grassLoader = new GLTFLoader();                // eslint-disable-next-line no-loop-func
  //   grassLoader.load('grassColor.glb', (grass) => {
  //     grass.scene.traverse((child) => {
  //       if (child.isMesh) {
  //         grass_geometry.current = child;
  //       }
  //     });
  //     const mesh_material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  //     const grass_instanced_mesh = new THREE.InstancedMesh(grass_geometry.current.geometry, mesh_material, 12);
  //     scene.add(grass_instanced_mesh);
  //     for (let i = 0; i < 12; i++) {
  //       dummy.position.x = Math.floor(Math.random() * 3) + 1;
  //       zRotationNewRadius = Math.sqrt(49 - (dummy.position.x * dummy.position.x)); // NEW RADIUS IF LOOKED FROM THE SIDE, LOOKS AS IF THE RADIUS DECREASED
  //       treeRotationZ = Math.asin(dummy.position.x / 7); //SPHERE RADIUS = 7
  //       z = Math.sin(angleSphereForgrass.current * (180 / Math.PI)) * zRotationNewRadius;
  //       dummy.rotation.z = -treeRotationZ;
  //       dummy.position.z = -z - 2;

  //       grassRotationX = grassRotationAngle.current * (180 / Math.PI); //The grass rotation ON X AXIS (FORWARDS)
  //       dummy.rotation.x = grassRotationX;

  //       grassPositionY = Math.cos(angleSphereForgrass.current * (180 / Math.PI)) * zRotationNewRadius;
  //       dummy.position.y = grassPositionY - 9.3;
  //       angleSphereForgrass.current += 0.001;
  //       grassRotationAngle.current -= 0.001;
  //       dummy.updateMatrix();
  //       grass_instanced_mesh.setMatrixAt(i, dummy.matrix);

  //     }
  //     grass_instanced_mesh.instanceMatrix.needsUpdate = true;
  //   })

  //   //USED BLENDER TO CREATE LITTLE BLOCKS OF GRASS AND WIND ANIMATION
  //   /*const grassLoader = new GLTFLoader(manager);
  //   let zRotationNewRadius;
  //   let treeRotationZ;
  //   let grassRotationX;
  //   let z;
  //   let grassPositionY;
  //   for(let i = 0; i < 4; i++){
  //   // eslint-disable-next-line no-loop-func
  //   grassLoader.load('grassColor.glb', (grass) => {
  //       grass.scene.position.x = Math.floor(Math.random() * 3) -0.5 ;
  //       grass.scene.scale.set(0.14, 0.14, 0.14)
  //       zRotationNewRadius = Math.sqrt(49 - (grass.scene.position.x * grass.scene.position.x)); // NEW RADIUS IF LOOKED FROM THE SIDE, LOOKS AS IF THE RADIUS DECREASED
  //       treeRotationZ = Math.asin(grass.scene.position.x / 7); //SPHERE RADIUS = 7
  //       z = Math.sin(angleSphereForgrass.current * (180 / Math.PI)) * zRotationNewRadius;
  //       grass.scene.rotation.z = -treeRotationZ;
  //       grass.scene.position.z = -z - 2;
  //       grassRotationX = grassRotationAngle.current * (180 / Math.PI); //The grass rotation ON X AXIS (FORWARDS)
  //       grass.scene.rotation.x = grassRotationX;
  //       grassPositionY = Math.cos(angleSphereForgrass.current * (180 / Math.PI)) * zRotationNewRadius;
  //       grass.scene.position.y = grassPositionY - 9;
  //       scene.add(grass.scene);
  //       angleSphereForgrass.current+=0.001;
  //       grassRotationAngle.current-=0.001;
  //   })
  //   }*/

  //   //media queries
  //   let phoneViewCheck = (e) => {
  //     if (e.matches === true) {
  //       setSmartphoneView(true);
  //       explainBox.current.style.width = "100%";
  //       explainBox.current.style.left = "0%";
  //     }
  //     else {
  //       explainBox.current.style.width = "70%";
  //       explainBox.current.style.left = "15%";
  //       setSmartphoneView(false);
  //     }
  //   }
  //   phoneViewCheck(window.matchMedia("(max-width: 700px)"));
  //   window.matchMedia("(max-width: 700px)").addEventListener('change', phoneViewCheck);


  //   renderer.setSize(width, height)
  //   canvasContainer
  //     .current
  //     .appendChild(renderer.domElement)
  //   let delta;
  //   const animate = () => {
  //     delta = clock.getDelta();
  //     if (switcher.current === 1) {
  //       mixer
  //         .current
  //         .update(delta)
  //     }
  //     renderer.render(scene, camera.current)
  //     requestAnimationFrame(animate);
  //   }
  //   animate()
  //   //CHECK IF MODELS ARE LOADED
  //   percentage.current.innerText = "0 %";
  //   THREE.DefaultLoadingManager.onProgress = () => {
  //     if (parseInt(percentage.current.innerText.slice(0, -2)) < 100) {
  //       loadingScreenMessages.current.innerText = "Loading your experience...";
  //       percentage.current.innerText = parseInt(percentage.current.innerText.slice(0, -2)) + 1 + " %";
  //       progress_bar.current.style.width = (percentage.current.innerText).replace(' ', '');
  //     }
  //     else {
  //       percentage.current.innerText = "100%";
  //       progress_bar.current.style.width = percentage.current.innerText;
  //     }
  //   }
  //   THREE.DefaultLoadingManager.onLoad = () => {
  //     percentage.current.innerText = "100%";
  //     progress_bar.current.style.width = percentage.current.innerText;
  //     fadeScreen.current.style.animation = "loadingDone 1s normal forwards ease-out";
  //     fadeScreen.current.onanimationend = () => setComponentLoaded(true);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <div className="h-screen block" ref={canvasContainer}>
      <canvas id="canvas" className="max-w-full rounded-lg" />
    </div>
  )

}


export default Menu;