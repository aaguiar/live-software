import React, { Component, Props } from 'react';
import District from '../objects/district';

import { getStaticDataProject } from '../api/repository';

import * as THREE from 'three';

type CanvasProps = {
  message: string;
};

type CanvasState = {
  project: {}
}

let mount: any;

class ThreeScene extends Component<CanvasProps, CanvasState> {
  scene: any;
  camera: any;
  renderer: any;
  //cube: any;
  frameId: number;

  constructor(props: CanvasProps, state: CanvasState) {
    super(props);
    this.scene = new THREE.Scene();    //ADD CAMERA
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.frameId = requestAnimationFrame(this.animate);
    //this.cube = new District('', 1, 1, 1);

    this.state = state;
  }

  componentDidMount() {
    getStaticDataProject()
      .then(data => {
        this.setState({ project: data })
      })

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
    mount.appendChild(this.renderer.domElement)    //ADD CUBE
    //this.scene.add(this.cube)
    this.start()
  }

  componentWillUnmount() {
    this.stop()
    //this.mount.removeChild(this.renderer.domElement)
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
    //this.cube.rotation.x += 0.01
    //this.cube.rotation.y += 0.01
    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    return (
      <div ref={ref => (mount = ref)} />
    )
  }
}

export default ThreeScene;