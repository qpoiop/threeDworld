import * as THREE from 'three'
// import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Refractor } from 'three/examples/jsm/objects/Refractor.js';
import { WaterRefractionShader } from 'three/examples/jsm/shaders/WaterRefractionShader.js';


export class ThreeDWorld {
    SCREEN_WIDTH = window.innerWidth
    SCREEN_HEIGHT = window.innerHeight
    container
    stats
    camera
    clock
    scene
    renderer
    refractor
    smallSphere
    constructor() {
        this.init()
    }

    async init() {
        this.container = document.getElementById('world')
        this.clock = new THREE.Clock();

        this.camera = new THREE.PerspectiveCamera(50, this.SCREEN_WIDTH / this.SCREEN_HEIGHT, 1, 10000)
        this.camera.position.set(0, 50, -500)

        this.scene = new THREE.Scene()

        this.renderer = new THREE.WebGL1Renderer( { antialias: true })
        this.renderer.setPixelRatio( window.devicePixelRatio )
        this.renderer.setSize( this.SCREEN_WIDTH, this.SCREEN_HEIGHT )
        this.container.appendChild( this.renderer.domElement )
        this.renderer.outputEncoding = THREE.sRGBEncoding

        const controls = new OrbitControls( this.camera, this.renderer.domElement )
        controls.target.set( 0, 40, 0 )
        controls.enableZoom = false
        controls.enablePan = false
        controls.enableDamping = false
        controls.enabledRotate = false
        controls.keyPanSpeed = 7.0
        controls.panSpeed = 0.5
        // controls.maxDistance = 0
        // controls.maxPolarAngle = 0
        // controls.maxDistance = 400
        // controls.minDistance = 10

        controls.update()

        const refractorGeometry = new THREE.PlaneGeometry( 90, 90 )
        this.refractor = new Refractor( refractorGeometry, {
            color: 0x999999,
            textureWidth: 1024,
            textureHeight: 1024,
            shader: WaterRefractionShader
        } )

        this.refractor.position.set( 0, 50, 0 )

        this.scene.add( this.refractor )

        // this.stats = new Stats()
        // this.container.appendChild( this.stats.dom )

        // const loader = new THREE.ObjectLoader()
        // const object = await loader.loadAsync("models/lightmap.json")
        // // loader.load("../assets/models/lightmap.json", model => {
        // // })
        
        // this.scene.add(object)
        
        // const dudvMap = new THREE.TextureLoader().load( 'textures/waterdudv.jpg', function () {
        //     this.animate()
        // })

        // dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping;
        // this.refractor.material.uniforms.tDudv.value = dudvMap;

        const geometry = new THREE.IcosahedronGeometry( 5, 0 )
        const material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x333333, flatShading: true } )
        this.smallSphere = new THREE.Mesh( geometry, material )
        this.scene.add( this.smallSphere )

        // walls
        const planeGeo = new THREE.PlaneGeometry( this.SCREEN_WIDTH, this.SCREEN_HEIGHT )

        const planeTop = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff } ) )
        planeTop.position.y = 100
        planeTop.rotateX( Math.PI / 2 )
        this.scene.add( planeTop )

        const planeBottom = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff } ) )
        planeBottom.rotateX( - Math.PI / 2 )
        this.scene.add( planeBottom )

        const planeBack = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0x7f7fff } ) )
        planeBack.position.z = - 50
        planeBack.position.y = 150
        this.scene.add( planeBack )

        const planeRight = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0x00ff00 } ) )
        planeRight.position.x = 50
        planeRight.position.y = 50
        planeRight.rotateY( - Math.PI / 2 )
        this.scene.add( planeRight )

        const planeLeft = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xff0000 } ) )
        planeLeft.position.x = - 50
        planeLeft.position.y = 50
        planeLeft.rotateY( Math.PI / 2 )
        this.scene.add( planeLeft )

        // lights
        const backLight = new THREE.DirectionalLight(0xaabbff, 5000)
        backLight.position.x = 300
        backLight.position.y = 250
        backLight.position.z = -500
        // this.scene.add( backLight )

        const mainLight = new THREE.PointLight( 0xcccccc, 1.5, 250 )
        mainLight.position.y = 60
        this.scene.add( mainLight )

        const greenLight = new THREE.PointLight( 0x00ff00, 0.25, 1000 )
        greenLight.position.set( 550, 50, 0 )
        this.scene.add( greenLight )

        const redLight = new THREE.PointLight( 0xff0000, 0.25, 1000 )
        redLight.position.set( - 550, 50, 0 )
        this.scene.add( redLight )

        const blueLight = new THREE.PointLight( 0x7f7fff, 0.25, 1000 )
        blueLight.position.set( 0, 50, 550 )
        this.scene.add( blueLight )

        window.addEventListener( 'resize', this.onWindowResize )
        this.animate()
    }

    onWindowResize() {
        this.camera.aspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( this.SCREEN_WIDTH, this.SCREEN_HEIGHT )
    }

    animate() {
        requestAnimationFrame( ()=> this.animate() )
        const time = this.clock.getElapsedTime()
        this.refractor.material.uniforms.time.value = time

        this.smallSphere.position.set(
            Math.cos( time ) * 30,
            Math.abs( Math.cos( time * 2 ) ) * 20 + 5,
            Math.sin( time ) * 30
        )
        this.smallSphere.rotation.y = ( Math.PI / 2 ) - time
        this.smallSphere.rotation.z = time * 8

        this.renderer.render( this.scene, this.camera )
    }
}