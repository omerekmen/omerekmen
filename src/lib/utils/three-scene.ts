import type {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	BufferGeometry,
	Points,
	LineSegments,
	BufferAttribute
} from 'three';

export interface NeuralNetworkScene {
	resize: (width: number, height: number) => void;
	updateMouse: (x: number, y: number) => void;
	updateColors: (accent: string) => void;
	dispose: () => void;
}

interface Node {
	x: number;
	y: number;
	z: number;
	vx: number;
	vy: number;
	vz: number;
}

export async function createNeuralNetworkScene(
	canvas: HTMLCanvasElement,
	accentColor: string,
	isMobile: boolean
): Promise<NeuralNetworkScene> {
	const THREE = await import('three');

	const nodeCount = isMobile ? 30 : 60;
	const connectionDistance = isMobile ? 2.5 : 2.2;

	// Adapt spread to screen aspect ratio so it fills the viewport
	const aspect = canvas.clientWidth / canvas.clientHeight;
	const spreadX = isMobile ? 6 : Math.max(8, 7 * aspect);
	const spreadY = isMobile ? 6 : 7;
	const spreadZ = isMobile ? 3 : 4;

	// Scene setup
	const scene: Scene = new THREE.Scene();
	const camera: PerspectiveCamera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
	camera.position.z = isMobile ? 9 : 8;

	const renderer: WebGLRenderer = new THREE.WebGLRenderer({
		canvas,
		antialias: !isMobile,
		alpha: true
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setClearColor(0x000000, 0);

	// Mouse tracking
	let mouseX = 0;
	let mouseY = 0;
	let targetMouseX = 0;
	let targetMouseY = 0;

	// Create nodes spread to fill the screen
	const nodes: Node[] = [];
	for (let i = 0; i < nodeCount; i++) {
		nodes.push({
			x: (Math.random() - 0.5) * spreadX,
			y: (Math.random() - 0.5) * spreadY,
			z: (Math.random() - 0.5) * spreadZ,
			vx: (Math.random() - 0.5) * 0.003,
			vy: (Math.random() - 0.5) * 0.003,
			vz: (Math.random() - 0.5) * 0.002
		});
	}

	// Node particles
	const nodeGeometry: BufferGeometry = new THREE.BufferGeometry();
	const nodePositions = new Float32Array(nodeCount * 3);

	for (let i = 0; i < nodeCount; i++) {
		nodePositions[i * 3] = nodes[i].x;
		nodePositions[i * 3 + 1] = nodes[i].y;
		nodePositions[i * 3 + 2] = nodes[i].z;
	}

	nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));

	const accentThree = new THREE.Color(accentColor);

	const nodeMaterial = new THREE.PointsMaterial({
		color: accentThree,
		size: isMobile ? 0.08 : 0.1,
		transparent: true,
		opacity: 0.9,
		sizeAttenuation: true
	});

	const pointCloud: Points = new THREE.Points(nodeGeometry, nodeMaterial);
	scene.add(pointCloud);

	// Connections
	const maxConnections = nodeCount * (nodeCount - 1);
	const linePositions = new Float32Array(maxConnections * 3);
	const lineGeometry: BufferGeometry = new THREE.BufferGeometry();
	lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

	const lineMaterial = new THREE.LineBasicMaterial({
		color: accentThree,
		transparent: true,
		opacity: 0.12
	});

	const lines: LineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
	if (!isMobile) {
		scene.add(lines);
	}

	// Animation
	let animationId: number;
	let time = 0;

	function updateConnections() {
		let vertexIndex = 0;
		const posAttr = lineGeometry.getAttribute('position') as BufferAttribute;

		for (let i = 0; i < nodeCount; i++) {
			for (let j = i + 1; j < nodeCount; j++) {
				const dx = nodes[i].x - nodes[j].x;
				const dy = nodes[i].y - nodes[j].y;
				const dz = nodes[i].z - nodes[j].z;
				const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

				if (dist < connectionDistance) {
					posAttr.array[vertexIndex * 3] = nodes[i].x;
					posAttr.array[vertexIndex * 3 + 1] = nodes[i].y;
					posAttr.array[vertexIndex * 3 + 2] = nodes[i].z;
					vertexIndex++;

					posAttr.array[vertexIndex * 3] = nodes[j].x;
					posAttr.array[vertexIndex * 3 + 1] = nodes[j].y;
					posAttr.array[vertexIndex * 3 + 2] = nodes[j].z;
					vertexIndex++;
				}
			}
		}

		// Zero out remaining
		for (let i = vertexIndex * 3; i < posAttr.array.length; i++) {
			posAttr.array[i] = 0;
		}

		lineGeometry.setDrawRange(0, vertexIndex);
		posAttr.needsUpdate = true;
	}

	function animate() {
		animationId = requestAnimationFrame(animate);
		time += 0.005;

		// Smooth mouse following
		mouseX += (targetMouseX - mouseX) * 0.05;
		mouseY += (targetMouseY - mouseY) * 0.05;

		// Update node positions
		const posAttr = nodeGeometry.getAttribute('position') as BufferAttribute;

		for (let i = 0; i < nodeCount; i++) {
			const node = nodes[i];
			node.x += node.vx + Math.sin(time + i * 0.5) * 0.001;
			node.y += node.vy + Math.cos(time + i * 0.3) * 0.001;
			node.z += node.vz;

			// Bounds — use the actual spread values
			if (Math.abs(node.x) > spreadX * 0.5) node.vx *= -1;
			if (Math.abs(node.y) > spreadY * 0.5) node.vy *= -1;
			if (Math.abs(node.z) > spreadZ * 0.5) node.vz *= -1;

			posAttr.array[i * 3] = node.x;
			posAttr.array[i * 3 + 1] = node.y;
			posAttr.array[i * 3 + 2] = node.z;
		}

		posAttr.needsUpdate = true;

		if (!isMobile) {
			updateConnections();
		}

		// Camera parallax from mouse
		camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.05;
		camera.position.y += (mouseY * 1.0 - camera.position.y) * 0.05;
		camera.lookAt(0, 0, 0);

		// Slow global rotation
		pointCloud.rotation.y = time * 0.15;
		if (!isMobile) lines.rotation.y = time * 0.15;

		renderer.render(scene, camera);
	}

	animate();

	return {
		resize(width: number, height: number) {
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);
		},

		updateMouse(x: number, y: number) {
			targetMouseX = (x - 0.5) * 2;
			targetMouseY = -(y - 0.5) * 2;
		},

		updateColors(accent: string) {
			const color = new THREE.Color(accent);
			nodeMaterial.color = color;
			lineMaterial.color = color;
		},

		dispose() {
			cancelAnimationFrame(animationId);
			nodeGeometry.dispose();
			nodeMaterial.dispose();
			lineGeometry.dispose();
			lineMaterial.dispose();
			renderer.dispose();
		}
	};
}
