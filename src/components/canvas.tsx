import React, { Component, Props } from 'react';
import * as THREE from 'three';

type MyProps = {
  message: string;
};
type MyState = {
  count: number; // like this
};

let mount: any;

const geometry = new THREE.BoxGeometry(1, 1, 1);
  
const material = new THREE.MeshBasicMaterial({ 
  color: '#433F81'
});

class ThreeScene extends Component<MyProps, MyState> {
  scene: any;
  camera: any;
  renderer: any;
  cube: any;
  frameId: number;

  constructor(props: MyProps, state: MyState) {
    super(props);
    this.scene = new THREE.Scene();    //ADD CAMERA
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.frameId = requestAnimationFrame(this.animate);
    this.cube = new THREE.Mesh(geometry, material);
  }

  /* componentDidMount(){
    const width = window.innerWidth
    const height = window.innerHeight    //ADD SCENE
    
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    )
    this.camera.position.z = 4    //ADD RENDERER
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(width, height)
    // this.mount.appendChild(this.renderer.domElement)    //ADD CUBE
    this.scene.add(this.cube)
    this.start()
  } */
  
  componentDidMount() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    mount.appendChild( renderer.domElement );
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    camera.position.z = 5;
    var animate = function () {
      requestAnimationFrame( animate );
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render( scene, camera );
    };
    animate();
  }

  componentWillUnmount(){
    this.stop()
    // this.mount.removeChild(this.renderer.domElement)
  }
  
  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }
  
  stop = () => {
    cancelAnimationFrame(this.frameId)
  }
  
  animate = () => {
   this.cube.rotation.x += 0.01
   this.cube.rotation.y += 0.01
   this.renderScene()
   this.frameId = window.requestAnimationFrame(this.animate)
 }
 
 renderScene = () => {
  this.renderer.render(this.scene, this.camera)
}

render(){
    return(
      <div ref={ref => (mount = ref)} />
    )
  }
}

export default ThreeScene;