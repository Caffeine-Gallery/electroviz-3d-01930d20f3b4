import { backend } from "declarations/backend";

class FieldVisualizer {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.arrows = [];
        this.charges = [];
        
        this.init();
        this.setupControls();
        this.animate();
    }

    init() {
        const container = document.getElementById('canvas-container');
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);

        // Set up camera
        this.camera.position.z = 15;
        this.camera.position.y = 5;
        this.camera.lookAt(0, 0, 0);

        // Add grid
        const gridHelper = new THREE.GridHelper(20, 20);
        this.scene.add(gridHelper);

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 1, 0);
        this.scene.add(directionalLight);

        // Handle window resize
        window.addEventListener('resize', () => {
            const container = document.getElementById('canvas-container');
            this.camera.aspect = container.clientWidth / container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }

    setupControls() {
        document.getElementById('updateField').addEventListener('click', () => this.updateField());
        
        // Update strength value displays
        document.getElementById('charge1Strength').addEventListener('input', (e) => {
            document.getElementById('charge1StrengthValue').textContent = e.target.value;
        });
        document.getElementById('charge2Strength').addEventListener('input', (e) => {
            document.getElementById('charge2StrengthValue').textContent = e.target.value;
        });
    }

    async updateField() {
        const loading = document.getElementById('loading');
        loading.classList.remove('d-none');

        // Get charge configurations
        const charge1 = {
            strength: parseFloat(document.getElementById('charge1Strength').value),
            position: {
                x: parseFloat(document.getElementById('charge1X').value),
                y: parseFloat(document.getElementById('charge1Y').value),
                z: parseFloat(document.getElementById('charge1Z').value)
            }
        };

        const charge2 = {
            strength: parseFloat(document.getElementById('charge2Strength').value),
            position: {
                x: parseFloat(document.getElementById('charge2X').value),
                y: parseFloat(document.getElementById('charge2Y').value),
                z: parseFloat(document.getElementById('charge2Z').value)
            }
        };

        try {
            // Clear existing field visualization
            this.clearField();

            // Calculate field vectors using backend
            const fieldVectors = await backend.calculateField(charge1, charge2);
            
            // Visualize charges
            this.visualizeCharge(charge1, 0xff0000);
            this.visualizeCharge(charge2, 0x0000ff);

            // Visualize field vectors
            this.visualizeField(fieldVectors);
        } catch (error) {
            console.error('Error updating field:', error);
        } finally {
            loading.classList.add('d-none');
        }
    }

    clearField() {
        // Remove existing arrows
        this.arrows.forEach(arrow => this.scene.remove(arrow));
        this.arrows = [];

        // Remove existing charges
        this.charges.forEach(charge => this.scene.remove(charge));
        this.charges = [];
    }

    visualizeCharge(charge, color) {
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: color });
        const sphere = new THREE.Mesh(geometry, material);
        
        sphere.position.set(charge.position.x, charge.position.y, charge.position.z);
        this.scene.add(sphere);
        this.charges.push(sphere);
    }

    visualizeField(fieldVectors) {
        fieldVectors.forEach(vector => {
            const origin = new THREE.Vector3(vector.position.x, vector.position.y, vector.position.z);
            const direction = new THREE.Vector3(vector.field.x, vector.field.y, vector.field.z);
            const length = direction.length();
            direction.normalize();

            const arrowHelper = new THREE.ArrowHelper(
                direction,
                origin,
                length * 2, // Scale the arrow length for visibility
                0xffff00,
                0.2,
                0.1
            );

            this.scene.add(arrowHelper);
            this.arrows.push(arrowHelper);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the visualizer when the page loads
window.addEventListener('load', () => {
    new FieldVisualizer();
});
