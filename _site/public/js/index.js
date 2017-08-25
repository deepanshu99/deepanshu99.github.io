var container, stats;
var camera, controls, scene, renderer;
var pickingData = [], pickingTexture, pickingScene;
var objects = [];
var highlightBox;
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3( 10, 10, 10 );
init();
animate();
function init() {
  container = document.getElementById( "container" );
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 1000;
  controls = new THREE.TrackballControls( camera );
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = true;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );
  pickingScene = new THREE.Scene();
  pickingTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
  pickingTexture.texture.minFilter = THREE.LinearFilter;
  scene.add( new THREE.AmbientLight( 0x555555 ) );
  var light = new THREE.SpotLight( 0xffffff, 1.5 );
  light.position.set( 0, 500, 2000 );
  scene.add( light );
  var geometry = new THREE.Geometry(),
  pickingGeometry = new THREE.Geometry(),
  pickingMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } ),
  defaultMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true, vertexColors: THREE.VertexColors, shininess: 0	} );
  function applyVertexColors( g, c ) {
    g.faces.forEach( function( f ) {
      var n = ( f instanceof THREE.Face3 ) ? 3 : 4;
      for( var j = 0; j < n; j ++ ) {
        f.vertexColors[ j ] = c;
      }
    } );
  }
  var geom = new THREE.BoxGeometry( 1, 1, 1 );
  var color = new THREE.Color();
  var matrix = new THREE.Matrix4();
  var quaternion = new THREE.Quaternion();
  for ( var i = 0; i < 5000; i ++ ) {
    var position = new THREE.Vector3();
    position.x = Math.random() * 10000 - 5000;
    position.y = Math.random() * 6000 - 3000;
    position.z = Math.random() * 8000 - 4000;
    var rotation = new THREE.Euler();
    rotation.x = Math.random() * 2 * Math.PI;
    rotation.y = Math.random() * 2 * Math.PI;
    rotation.z = Math.random() * 2 * Math.PI;
    var scale = new THREE.Vector3();
    scale.x = Math.random() * 200 + 100;
    scale.y = Math.random() * 200 + 100;
    scale.z = Math.random() * 200 + 100;
    quaternion.setFromEuler( rotation, false );
    matrix.compose( position, quaternion, scale );
    // give the geom's vertices a random color, to be displayed
    applyVertexColors( geom, color.setHex( Math.random() * 0xffffff ) );
    geometry.merge( geom, matrix );
    // give the geom's vertices a color corresponding to the "id"
    applyVertexColors( geom, color.setHex( i ) );
    pickingGeometry.merge( geom, matrix );
    pickingData[ i ] = {
      position: position,
      rotation: rotation,
      scale: scale
    };
  }
  var drawnObject = new THREE.Mesh( geometry, defaultMaterial );
  scene.add( drawnObject );
  pickingScene.add( new THREE.Mesh( pickingGeometry, pickingMaterial ) );
  highlightBox = new THREE.Mesh(
    new THREE.BoxGeometry( 1, 1, 1 ),
    new THREE.MeshLambertMaterial( { color: 0xffff00 }
  ) );
  scene.add( highlightBox );
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
  stats = new Stats();
  container.appendChild( stats.dom );
  renderer.domElement.addEventListener( 'mousemove', onMouseMove );
}
//
function onMouseMove( e ) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}
function animate() {
  requestAnimationFrame( animate );
  render();
  stats.update();
}
function pick() {
  //render the picking scene off-screen
  renderer.render( pickingScene, camera, pickingTexture );
  //create buffer for reading single pixel
  var pixelBuffer = new Uint8Array( 4 );
  //read the pixel under the mouse from the texture
  renderer.readRenderTargetPixels(pickingTexture, mouse.x, pickingTexture.height - mouse.y, 1, 1, pixelBuffer);
  //interpret the pixel as an ID
  var id = ( pixelBuffer[0] << 16 ) | ( pixelBuffer[1] << 8 ) | ( pixelBuffer[2] );
  var data = pickingData[ id ];
  if ( data) {
    //move our highlightBox so that it surrounds the picked object
    if ( data.position && data.rotation && data.scale ){
      highlightBox.position.copy( data.position );
      highlightBox.rotation.copy( data.rotation );
      highlightBox.scale.copy( data.scale ).add( offset );
      highlightBox.visible = true;
    }
  } else {
    highlightBox.visible = false;
  }
}
function render() {
  controls.update();
  pick();
  renderer.render( scene, camera );
}
