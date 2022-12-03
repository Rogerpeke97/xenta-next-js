
export enum StarsType {
  harmless = 'harmless',
  harmful = 'harmful'
}

export function starsVertexShader(){
  return `
  varying vec3 vColor;
  attribute vec3 customParticleColor;
  attribute uint starTimeOffset;
    void main(){
      vColor = customParticleColor;
      //we cast the vec3 attribute position into a vec4
      //why .w is 1 is a topic on its own, but it represents 
      //a position in space, versus a direction
      vec4 _position = vec4(position, 1.0); 
      //next we need to tell this vertex to be somewhere in 3d space
      //this is the contract we accept when working with a scene graph
      //the modelMatrix represents the position of our Mesh and all
      //the parents above it:
      vec4 worldPosition = modelMatrix * _position; 
      //next we get information from the render(scene,CAMERA)
      //the camera used for that call gives us the viewMatrix uniform
      //this transforms the world (through this vertex) into something
      //called "camera space" or "view space"
      vec4 viewPosition = viewMatrix * worldPosition;
      //this space is suitable for further transformations so we
      //apply the projectionMatrix 
      vec4 perspectiveSpace = projectionMatrix * viewPosition;
      //finally we write the result into a built-in GLSL variable
      gl_PointSize = 30.0;
      gl_Position = perspectiveSpace;
    }
  `
}

export function starsFragmentShader(type: StarsType){
  if(type === StarsType.harmless){
    return `
      uniform vec2 resolution;
      uniform sampler2D particleTexture;
      varying vec3 vColor;
        void main(){
          gl_FragColor = vec4(vColor, 1.0);
          gl_FragColor = gl_FragColor * texture2D(particleTexture, gl_PointCoord);
        }
    `
  }
  if(type === StarsType.harmful){
    return `
      float piTimes2 = 3.1415926536*2.0; 
      uniform float time;
      uniform vec2 resolution;
      uniform sampler2D particleTexture;
      varying vec3 vColor;
        void main(){
          vec2 normalizedCoordinates = gl_FragCoord.xy / resolution.xy;
          float timePlusStarRedColor = time + vColor.x;
          float normalizedTimeStarPositionX = timePlusStarRedColor - floor(timePlusStarRedColor) / ceil(timePlusStarRedColor) - floor(timePlusStarRedColor);
          gl_FragColor = vec4(sin(normalizedTimeStarPositionX * piTimes2), sin(normalizedTimeStarPositionX * piTimes2), vColor.y, vColor.z);
          gl_FragColor = gl_FragColor * texture2D(particleTexture, gl_PointCoord);
        }
    `
  }
}
