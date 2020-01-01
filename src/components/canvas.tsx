import React, { Component, Props } from 'react';
import { useParams } from "react-router";
import Load from './load';
import City from '../objects/city';

import { getStaticDataProject, sample } from '../api/repository';

import * as THREE from 'three';
import ProjectJson from '../objects/interfaces/projectJson';

type CanvasProps = {
  projectId: number;
};

type CanvasState = {
  project?: {},
  loadingProject: boolean
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

    this.state = {
      loadingProject: true
    };
  }

  componentDidMount() {
    getStaticDataProject()
      .then((data: ProjectJson) => {
        let projectData: ProjectJson = sample.allProjectData[0];
        let city: City = new City(projectData);
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
    this.renderer.setClearColor('#00171f')
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
      <div ref={ref => (mount = ref)}>
        {this.state.loadingProject ? (
            <Load />
         ) : (null)}
      </div>
   )
  }
}

export default ThreeScene;
