import React, { Component } from 'react';
import Load from './load';
import City from '../objects/city';

import { getStaticDataProject, sample } from '../api/repository';

import * as THREE from 'three';
import ProjectJson from '../objects/interfaces/projectJson';

let OrbitControls = require('three-orbit-controls')(THREE)

type CanvasState = {
  project?: City,
  loadingProject: boolean
}

let mount: any;

class ThreeScene extends Component<{}, CanvasState> {
  scene: THREE.Scene;
  camera: any;
  renderer: THREE.WebGLRenderer;
  controls: any;
  frameId: number;
  axesHelper!: THREE.AxesHelper;

  constructor(props: {}, state: CanvasState) {
    super(props);
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.frameId = requestAnimationFrame(this.animate);

    this.state = {
      loadingProject: true
    };
  }

  mountCanvas() {
    const width = window.innerWidth
    const height = window.innerHeight

    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    )
    this.camera.position.z = 4
    this.renderer.setClearColor('#00171f')
    this.renderer.setSize(width, height)
    this.renderer.gammaFactor = 2.2
    this.renderer.gammaOutput = true
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    mount.appendChild(this.renderer.domElement)
    this.axesHelper = new THREE.AxesHelper(4);
    this.scene.add(this.axesHelper);
    this.start()
  }

  componentDidMount() {
    getStaticDataProject()
      .then((data: ProjectJson) => {
        // TODO: Connect to repository
        let city: City = new City(sample.allProjectData[0]);

        // Add objects to scene
        city.getThreeObjects().forEach(object => {
          this.scene.add(object)
        });

        this.setState({
          project: city,
          loadingProject: false
        });
      })

    this.mountCanvas();
  }

  componentWillUnmount() {
    this.stop()
    mount.removeChild(this.renderer.domElement);
  }

  start = () => {
    this.frameId = requestAnimationFrame(this.animate);
  }

  stop = () => {
    cancelAnimationFrame(this.frameId);
  }

  animate = () => {
    //this.cube.rotation.x += 0.01
    //this.cube.rotation.y += 0.01
    this.frameId = requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderScene();
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
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
