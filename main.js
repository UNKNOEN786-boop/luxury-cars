import * as THREE from "three";

import {
    OrbitControls
} from "three/addons/controls/OrbitControls.js";

import {
    GLTFLoader
} from "three/addons/loaders/GLTFLoader.js";


// ======================================
// GLOBAL GLB MODEL
// ======================================

const gltfLoader =
    new GLTFLoader();

let originalModel = null;


// ======================================
// LOAD GLB ONCE
// ======================================

gltfLoader.load(

    "models/car.glb",

    function(gltf) {

        console.log(
            "REALISTIC GLB LOADED"
        );

        originalModel =
            gltf.scene;


        // Prepare model

        originalModel.traverse(
            function(object) {

                if(object.isMesh) {

                    object.castShadow =
                        true;

                    object.receiveShadow =
                        true;


                    if(object.material) {

                        object.material
                            .envMapIntensity =
                            1.5;

                    }

                }

            }
        );


        // Create Hero

        createHeroCar();


        // Create Collection

        createCollectionCars();


        // Hide loader

        setTimeout(
            hideLoader,
            500
        );

    },

    function(progress) {

        if(progress.total) {

            const percent =
                Math.round(
                    progress.loaded /
                    progress.total *
                    100
                );

            const bar =
                document.querySelector(
                    ".loader-line span"
                );

            if(bar) {

                bar.style.width =
                    percent + "%";

            }

        }

    },

    function(error) {

        console.error(
            "GLB ERROR:",
            error
        );

        showError();

    }

);


// ======================================
// CLONE MODEL
// ======================================

function cloneModel() {

    const clone =
        originalModel.clone(
            true
        );


    clone.traverse(
        function(object) {

            if(object.isMesh) {

                object.castShadow =
                    true;

                object.receiveShadow =
                    true;


                // Clone material

                if(object.material) {

                    object.material =
                        object.material.clone();

                }

            }

        }
    );


    return clone;

}


// ======================================
// AUTO FIT MODEL
// ======================================

function fitModel(model, targetSize = 5) {

    const box = new THREE.Box3().setFromObject(model);

    const size = box.getSize(new THREE.Vector3());

    const maxSize = Math.max(
        size.x,
        size.y,
        size.z
    );

    const scale = targetSize / maxSize;

    model.scale.setScalar(scale);

    const scaledBox = new THREE.Box3()
        .setFromObject(model);

    const center = scaledBox.getCenter(
        new THREE.Vector3()
    );

    model.position.x -= center.x;
    model.position.z -= center.z;

    // Wheel / ground fix
    const finalBox = new THREE.Box3()
        .setFromObject(model);

    const carBottom = finalBox.min.y;

    const groundLevel = -0.88;

    model.position.y +=
        groundLevel - carBottom;
}


// ======================================
// SHOWROOM LIGHTS
// ======================================

function addLights(scene) {


    const ambient =
        new THREE.AmbientLight(
            0xffffff,
            1.7
        );

    scene.add(ambient);


    const key =
        new THREE.DirectionalLight(
            0xffffff,
            5
        );

    key.position.set(
        5,
        8,
        6
    );

    key.castShadow =
        true;

    scene.add(key);


    const blue =
        new THREE.PointLight(
            0x6688ff,
            20,
            30
        );

    blue.position.set(
        -5,
        3,
        4
    );

    scene.add(blue);


    const rim =
        new THREE.PointLight(
            0xffffff,
            18,
            30
        );

    rim.position.set(
        4,
        5,
        -6
    );

    scene.add(rim);

}


// ======================================
// HERO
// ======================================

function createHeroCar() {


    const container =
        document.getElementById(
            "hero3d"
        );


    if(!container)
        return;


    const scene =
        new THREE.Scene();


    const camera =
        new THREE.PerspectiveCamera(
            40,
            container.clientWidth /
            container.clientHeight,
            0.1,
            1000
        );


    camera.position.set(
        5,
        2.2,
        7
    );


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


    renderer.shadowMap.enabled =
        true;


    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    renderer.toneMapping =
        THREE.ACESFilmicToneMapping;


    renderer.toneMappingExposure =
        1.1;


    container.appendChild(
        renderer.domElement
    );


    addLights(scene);


    // Floor

    const floor =
        new THREE.Mesh(

            new THREE.CircleGeometry(
                10,
                64
            ),

            new THREE.MeshStandardMaterial({
                color:0x080808,
                roughness:.25,
                metalness:.85
            })

        );


    floor.rotation.x =
        -Math.PI / 2;


    floor.position.y =
        -1.15;


    scene.add(floor);


    // Platform

    const platform =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                3.8,
                3.8,
                .12,
                64
            ),

            new THREE.MeshStandardMaterial({
                color:0x111111,
                roughness:.18,
                metalness:.9
            })

        );


    platform.position.y =
        -1.05;


    scene.add(platform);


    // Car

    const car =
        cloneModel();


    fitModel(
        car,
        5
    );


    car.rotation.y =
        0.3;


    scene.add(car);


    // Controls

    const controls =
        new OrbitControls(
            camera,
            renderer.domElement
        );


    controls.enableDamping =
        true;

    controls.dampingFactor =
        .06;

    controls.enablePan =
        false;

    controls.minDistance =
        3;

    controls.maxDistance =
        9;

    controls.autoRotate =
        true;

    controls.autoRotateSpeed =
        .7;


    // Resize

    window.addEventListener(
        "resize",
        function() {

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


    function animate() {

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

}


// ======================================
// COLLECTION 3D CARS
// ======================================

function createCollectionCars() {


    const cards =
        document.querySelectorAll(
            ".car-card"
        );


    cards.forEach(
        function(card) {

            createCardCar(
                card
            );

        }
    );

}


// ======================================
// CREATE ONE CARD CAR
// ======================================

function createCardCar(card) {


    const container =
        card.querySelector(
            ".card-3d"
        );


    if(!container)
        return;


    const scene =
        new THREE.Scene();


    const camera =
        new THREE.PerspectiveCamera(
            35,
            container.clientWidth /
            container.clientHeight,
            .1,
            100
        );


    camera.position.set(
        4,
        1.7,
        6
    );


    const renderer =
        new THREE.WebGLRenderer({
            antialias:true,
            alpha:true
        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            1.5
        )
    );


    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );


    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    renderer.toneMapping =
        THREE.ACESFilmicToneMapping;


    renderer.toneMappingExposure =
        1.15;


    renderer.shadowMap.enabled =
        true;


    container.appendChild(
        renderer.domElement
    );


    // Lights

    const ambient =
        new THREE.AmbientLight(
            0xffffff,
            2
        );

    scene.add(ambient);


    const light =
        new THREE.DirectionalLight(
            0xffffff,
            4
        );

    light.position.set(
        4,
        6,
        5
    );

    scene.add(light);


    const blue =
        new THREE.PointLight(
            0x6688ff,
            12,
            20
        );

    blue.position.set(
        -4,
        3,
        3
    );

    scene.add(blue);


    // Car

    const car =
        cloneModel();


    fitModel(
        car,
        3.5
    );


    // Different starting rotation

    car.rotation.y =
        Math.random() *
        Math.PI;


    // Color

    const color =
        parseInt(
            card.dataset.color
        );


    changeModelColor(
        car,
        color
    );


    scene.add(car);


    // Controls

    const controls =
        new OrbitControls(
            camera,
            renderer.domElement
        );


    controls.enableDamping =
        true;

    controls.dampingFactor =
        .08;

    controls.enablePan =
        false;

    controls.minDistance =
        3;

    controls.maxDistance =
        8;

    controls.autoRotate =
        true;

    controls.autoRotateSpeed =
        1;


    // Stop card click from triggering

    renderer.domElement.addEventListener(
        "pointerdown",
        function(event) {

            event.stopPropagation();

        }
    );


    // Resize

    const resize =
        function() {

            camera.aspect =
                container.clientWidth /
                container.clientHeight;

            camera.updateProjectionMatrix();

            renderer.setSize(
                container.clientWidth,
                container.clientHeight
            );

        };


    window.addEventListener(
        "resize",
        resize
    );


    // Animation

    function animate() {

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

}


// ======================================
// COLOR CHANGE
// ======================================

function changeModelColor(
    model,
    color
) {


    model.traverse(
        function(object) {

            if(
                object.isMesh &&
                object.material &&
                object.material.color
            ) {

                object.material.color
                    .setHex(color);

            }

        }
    );

}


// ======================================
// LOADER
// ======================================

function hideLoader() {

    const loader =
        document.getElementById(
            "loader"
        );


    if(!loader)
        return;


    loader.style.opacity =
        "0";


    setTimeout(
        function() {

            loader.style.display =
                "none";

        },
        900
    );

}


// ======================================
// ERROR
// ======================================

function showError() {

    const loader =
        document.getElementById(
            "loader"
        );


    loader.innerHTML = `

        <div class="model-error">

            <h2>
                3D MODEL ERROR
            </h2>

            <p>
                Make sure car.glb is inside
                the models folder.
            </p>

        </div>

    `;

}


// ======================================
// RESET HERO
// ======================================

window.resetCamera =
function() {

    location.reload();

};