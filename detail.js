import * as THREE from "three";

import {
    OrbitControls
} from "three/addons/controls/OrbitControls.js";


const container =
document.getElementById("detail3d");


/* SCENE */

const scene =
new THREE.Scene();


/* CAMERA */

const camera =
new THREE.PerspectiveCamera(
    45,
    container.clientWidth /
    container.clientHeight,
    .1,
    1000
);


camera.position.set(
    5,
    2.5,
    7
);


/* RENDERER */

const renderer =
new THREE.WebGLRenderer({
    antialias:true,
    alpha:true
});


renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);


renderer.setSize(
    container.clientWidth,
    container.clientHeight
);


renderer.shadowMap.enabled = true;


container.appendChild(
    renderer.domElement
);


/* CONTROLS */

const controls =
new OrbitControls(
    camera,
    renderer.domElement
);


controls.enableDamping = true;

controls.dampingFactor = .06;

controls.enablePan = false;

controls.minDistance = 3;

controls.maxDistance = 9;

controls.autoRotate = true;

controls.autoRotateSpeed = .8;


/* LIGHTING */

scene.add(
    new THREE.AmbientLight(
        0xffffff,
        2
    )
);


const key =
new THREE.DirectionalLight(
    0xffffff,
    6
);


key.position.set(
    5,
    8,
    5
);


scene.add(key);


const blueLight =
new THREE.PointLight(
    0x5577ff,
    25,
    30
);


blueLight.position.set(
    -5,
    3,
    4
);


scene.add(blueLight);


const rim =
new THREE.PointLight(
    0xffffff,
    20,
    30
);


rim.position.set(
    3,
    5,
    -6
);


scene.add(rim);


/* FLOOR */

const floor =
new THREE.Mesh(

    new THREE.CircleGeometry(
        10,
        64
    ),

    new THREE.MeshStandardMaterial({
        color:0x080808,
        roughness:.3,
        metalness:.8
    })

);


floor.rotation.x =
-Math.PI / 2;


floor.position.y =
-1.2;


scene.add(floor);


/* CAR */

const car =
new THREE.Group();


/* BODY */

const bodyMaterial =
new THREE.MeshStandardMaterial({
    color:0xb00000,
    metalness:.9,
    roughness:.17
});


const body =
new THREE.Mesh(

    new THREE.BoxGeometry(
        4.4,
        .8,
        1.9
    ),

    bodyMaterial

);


body.castShadow = true;


car.add(body);


/* CABIN */

const cabin =
new THREE.Mesh(

    new THREE.BoxGeometry(
        2.2,
        .75,
        1.5
    ),

    new THREE.MeshStandardMaterial({
        color:0x050505,
        metalness:.7,
        roughness:.12
    })

);


cabin.position.set(
    -.25,
    .7,
    0
);


car.add(cabin);


/* DOORS */

const doorMaterial =
new THREE.MeshStandardMaterial({
    color:0xb00000,
    metalness:.9,
    roughness:.17
});


const leftDoor =
new THREE.Mesh(

    new THREE.BoxGeometry(
        1.7,
        .7,
        .08
    ),

    doorMaterial

);


leftDoor.position.set(
    -.35,
    .2,
    1
);


car.add(leftDoor);


const rightDoor =
leftDoor.clone();


rightDoor.position.z =
-1;


car.add(rightDoor);


/* BONNET */

const bonnet =
new THREE.Mesh(

    new THREE.BoxGeometry(
        1.5,
        .22,
        1.75
    ),

    bodyMaterial

);


bonnet.position.set(
    1.45,
    .48,
    0
);


car.add(bonnet);


/* WHEELS */

const wheelGeometry =
new THREE.CylinderGeometry(
    .52,
    .52,
    .38,
    32
);


const wheelMaterial =
new THREE.MeshStandardMaterial({
    color:0x050505,
    roughness:.7
});


[
    [-1.45,-.45,1],
    [1.45,-.45,1],
    [-1.45,-.45,-1],
    [1.45,-.45,-1]
].forEach(
    p => {

        const wheel =
        new THREE.Mesh(
            wheelGeometry,
            wheelMaterial
        );


        wheel.rotation.z =
        Math.PI / 2;


        wheel.position.set(
            ...p
        );


        car.add(wheel);

    }
);


car.position.y =
-.5;


scene.add(car);


/* DOOR ANIMATION */

let doorsOpen =
false;


document
.getElementById("doorBtn")
.addEventListener(
    "click",
    () => {

        doorsOpen =
        !doorsOpen;


        if(doorsOpen){

            leftDoor.rotation.y =
            -Math.PI / 3;


            rightDoor.rotation.y =
            Math.PI / 3;

        }else{

            leftDoor.rotation.y =
            0;


            rightDoor.rotation.y =
            0;

        }

    }
);


/* BONNET ANIMATION */

let hoodOpen =
false;


document
.getElementById("hoodBtn")
.addEventListener(
    "click",
    () => {

        hoodOpen =
        !hoodOpen;


        if(hoodOpen){

            bonnet.rotation.z =
            -.55;

        }else{

            bonnet.rotation.z =
            0;

        }

    }
);


/* AUTO ROTATE */

document
.getElementById("rotateBtn")
.addEventListener(
    "click",
    () => {

        controls.autoRotate =
        !controls.autoRotate;

    }
);


/* ENGINE */

const engine =
document.getElementById(
    "engineSound"
);


let engineRunning =
false;


document
.getElementById("engineBtn")
.addEventListener(
    "click",
    () => {

        if(!engineRunning){

            engine.currentTime = 0;

            engine.play();

            engine.loop = true;

            engineRunning = true;

            document
            .getElementById(
                "engineBtn"
            )
            .textContent =
            "STOP ENGINE";

        }else{

            engine.pause();

            engineRunning = false;

            document
            .getElementById(
                "engineBtn"
            )
            .textContent =
            "START ENGINE";

        }

    }
);


/* COLOR */

document
.querySelectorAll(".color-btn")
.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const color =
                parseInt(
                    button.dataset.color
                );


                bodyMaterial.color
                .setHex(color);


                doorMaterial.color
                .setHex(color);

            }
        );

    }
);


/* RESIZE */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
        container.clientWidth /
        container.clientHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(
            container.clientWidth,
            container.clientHeight
        );

    }
);


/* ANIMATION */

function animate(){

    requestAnimationFrame(
        animate
    );


    controls.update();


    renderer.render(
        scene,
        camera
    );

}


animate();