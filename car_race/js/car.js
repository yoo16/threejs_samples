import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';

export class Car {
    constructor(textureLoader) {
        this.startX = 100;
        this.startY = 200;
        this.width = 30;
        this.height = 30;
        this.image = 'assets/car.png';
        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(this.width, this.height),
            new THREE.MeshBasicMaterial({
                map: textureLoader.load(this.image),
                transparent: true,
                side: THREE.DoubleSide
            })
        );
        this.mesh.position.set(this.startX, this.startY, 2);

        this.speed = 0;
        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;
        this.crashed = false;

        this.forwardAcceleration = 0.1;
        this.forwardMaxSpeed = 2;
        this.backwardAcceleration = 0.05;
        this.backwardMaxSpeed = 0.5;
        this.rotationSpeed = 0.03;
    }

    update() {
        const angle = this.mesh.rotation.z - Math.PI / 2;

        // 回転操作
        if (this.left) this.mesh.rotation.z += this.rotationSpeed;
        if (this.right) this.mesh.rotation.z -= this.rotationSpeed;

        // 加速
        if (this.forward) {
            this.speed = Math.min(this.speed + this.forwardAcceleration, this.forwardMaxSpeed);
        } else if (this.backward) {
            this.speed = Math.max(this.speed - this.backwardAcceleration, -this.backwardMaxSpeed);
        } else {
            // 慣性（摩擦による減速）
            const friction = 0.02;
            if (this.speed > 0) {
                this.speed = Math.max(0, this.speed - friction);
            } else if (this.speed < 0) {
                this.speed = Math.min(0, this.speed + friction);
            }
        }

        // 移動（前進／後退）
        this.mesh.position.x -= Math.cos(angle) * this.speed;
        this.mesh.position.y -= Math.sin(angle) * this.speed;
    }


    getFrontPosition() {
        const angle = this.mesh.rotation.z - Math.PI / 2;
        return new THREE.Vector2(
            this.mesh.position.x - Math.cos(angle) * 15,
            this.mesh.position.y - Math.sin(angle) * 15
        );
    }

    reset() {
        this.mesh.position.set(this.startX, this.startY, 2);
        this.mesh.rotation.z = 0;
        this.speed = 0;
        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;
        this.crashed = false;
    }
}
