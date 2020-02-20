import * as React from 'react';
import * as THREE from 'three';

/*--------------------------------
  Viewer Area
--------------------------------*/
interface ViewerProps {
    viewing: string;
    viewerVideo: HTMLVideoElement;
}

interface ViewerState {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    invert: boolean;
    prevViewing: string;
    phi: number;
    theta: number;
    pointerLock: boolean;
}

export default class Viewer extends React.Component<ViewerProps, ViewerState> {
    constructor(props: ViewerProps) {
        super(props);
        this.state = {
            scene: new THREE.Scene(),
            renderer: new THREE.WebGLRenderer({antialias: true}),
            camera: new THREE.PerspectiveCamera(80, window.innerHeight / window.innerWidth, 0.01, 500),
            invert: true,
            prevViewing: '',
            phi: 0,
            theta: 0,
            pointerLock: false,
        };
        this.setupThree = this.setupThree.bind(this);
        this.setupMouseEvent = this.setupMouseEvent.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.glRender = this.glRender.bind(this);
        this.makeSphere = this.makeSphere.bind(this);
        this.setPointerLockEvent = this.setPointerLockEvent.bind(this);
    }

    componentDidMount() {
        this.setupThree();
        this.setupMouseEvent();
        this.setPointerLockEvent();
    }

    componentDidUpdate() {
        if (this.props.viewing !== this.state.prevViewing) {
            this.makeSphere();
            this.setState({prevViewing: this.props.viewing});
            console.log('view changed');
        }
    }

    setupMouseEvent() {
        document.addEventListener('mousemove', (e) => {
            var phi: number = this.state.phi;
            var theta: number = this.state.theta;
            phi += e.movementX * 0.003;
            theta -= e.movementY * 0.003;
            if (theta < -Math.PI / 2) theta = -Math.PI / 2;
            else if (theta > Math.PI / 2) theta = Math.PI / 2;

            const _y = Math.sin(theta);
            const _x = Math.cos(theta) * Math.cos(phi);
            const _z = Math.cos(theta) * Math.sin(phi);

            this.state.camera.lookAt(_x, _y, _z);
            this.setState({theta: theta, phi: phi});
        });
    }

    setPointerLockEvent() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'p') {
                const pointerLock: boolean = this.state.pointerLock;
                if(pointerLock) document.exitPointerLock();
                else document.body.requestPointerLock();
                this.setState({pointerLock: !pointerLock});
            }
        });
    }

    setupThree() {
        // make scene objects
        const container: HTMLElement = document.getElementById('app_viewer');
        const scene: THREE.Scene = Object.create(this.state.scene);
        const renderer: THREE.WebGLRenderer = Object.create(this.state.renderer);
        const light: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff);

        // scene setting
        scene.background = new THREE.Color(0x505050); // background
        light.position.set(1, 1, 1).normalize();
        scene.add(new THREE.HemisphereLight(0x606060, 0x404040));
        scene.add(light);
        renderer.setPixelRatio(container.clientWidth / container.clientHeight);
        renderer.setSize(container.clientWidth, container.clientHeight);

        // add renderer
        container.appendChild(renderer.domElement);
    
        window.addEventListener('resize', this.onWindowResize, false);
        this.onWindowResize(); // initialize
    
        // render loop
        renderer.setAnimationLoop(this.glRender);

        this.setState({renderer: renderer, scene: scene});
    }

    onWindowResize() {
        const container: HTMLElement = document.getElementById('app_viewer');
        const camera: THREE.PerspectiveCamera = Object.create(this.state.camera);
        const renderer: THREE.WebGLRenderer = Object.create(this.state.renderer);

        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);

        this.setState({camera: camera, renderer: renderer});
    }

    glRender() {
        const camera: THREE.PerspectiveCamera = Object.create(this.state.camera);
        const renderer: THREE.WebGLRenderer = Object.create(this.state.renderer);
        const scene: THREE.Scene = Object.create(this.state.scene);
        camera.position.set(-camera.position.x, -camera.position.y, -camera.position.z);
        // sendAngle();

        // checkHmdMove();
        // const delta = this.state.clock.getDelta() * 60;
        renderer.render(scene, camera);
        this.setState({renderer: renderer, scene: scene, camera: camera});
    }

    makeSphere() {
        let _opacity: number = 1.0;

        const texture: THREE.VideoTexture = new THREE.VideoTexture(this.props.viewerVideo);
        const sphereGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(1, 30, 30);

        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;
        sphereGeometry.scale(-1, 1, 1); // inside out

        var uniforms = {
            uTex: {type: "t", value: texture},
            _FOV: {type: "f", value: 200},
            _CenterShiftX: {type: "f", value: 0},
            _CenterShiftY: {type: "f", value: 0},
            _TextureSizeW: {type: "f", value: 3008},
            _TextureSizeH: {type: "f", value: 1504},
            _RotA: {type: "f", value: 0},
            _RotB: {type: "f", value: 0},
            _FisheyeDiameterOnTextureInPixel: {type: "f", value: 1504},
            _SigmoidCoef: {type: "f", value: 30},
            _opacity: {type: "f", value: _opacity}
        };

        var material: THREE.ShaderMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent,
            //blending: THREE.NormalBlending,
            depthWrite: false,
            transparent: true
        });

        const sphereMesh: THREE.Mesh = new THREE.Mesh(sphereGeometry, material);

        sphereMesh.name = this.props.viewing;
        if(this.state.invert) sphereMesh.rotation.x = Math.PI;

        const scene: THREE.Scene = Object.create(this.state.scene);
        scene.add(sphereMesh);
        this.setState({scene: scene});
    }

    render(): JSX.Element {
        return (
            <div className="app_viewer" id="app_viewer">
            </div>
        );
    }
}