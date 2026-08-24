export interface NetworkScene {
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

/** Perspective strength. Larger flattens the field, smaller exaggerates depth. */
const FOCAL_LENGTH = 900;

/**
 * Drifting point field with proximity links, rendered in Canvas 2D.
 *
 * Replaces an equivalent Three.js scene that cost 181 KB gzipped for a purely
 * decorative background. Points carry a z coordinate so the projection, sizing
 * and rotation still read as three-dimensional.
 */
export function createNetworkScene(
	canvas: HTMLCanvasElement,
	accentColor: string,
	isMobile: boolean
): NetworkScene {
	const ctx = canvas.getContext('2d', { alpha: true });
	if (!ctx) throw new Error('2D canvas context unavailable');

	const nodeCount = isMobile ? 30 : 60;
	const linkDistance = isMobile ? 260 : 300;
	const drawLinks = !isMobile;

	let width = canvas.clientWidth || 1;
	let height = canvas.clientHeight || 1;
	let dpr = Math.min(window.devicePixelRatio || 1, 2);

	// Spread in world units, sized off the viewport so the field always fills it.
	let spreadX = Math.max(width, 640) * 0.75;
	let spreadY = Math.max(height, 480) * 0.75;
	const spreadZ = 420;

	let rgb = parseColor(accentColor);
	let mouseX = 0;
	let mouseY = 0;
	let targetMouseX = 0;
	let targetMouseY = 0;
	let time = 0;
	let frame = 0;
	let running = true;

	const nodes: Node[] = Array.from({ length: nodeCount }, () => ({
		x: (Math.random() - 0.5) * spreadX,
		y: (Math.random() - 0.5) * spreadY,
		z: (Math.random() - 0.5) * spreadZ,
		vx: (Math.random() - 0.5) * 0.28,
		vy: (Math.random() - 0.5) * 0.28,
		vz: (Math.random() - 0.5) * 0.18
	}));

	// Reused per frame so the projection isn't reallocated 60 times a second.
	const px = new Float32Array(nodeCount);
	const py = new Float32Array(nodeCount);
	const pScale = new Float32Array(nodeCount);

	function parseColor(hex: string): [number, number, number] {
		const clean = hex.replace('#', '').trim();
		const full =
			clean.length === 3
				? clean
						.split('')
						.map((c) => c + c)
						.join('')
				: clean;
		const int = Number.parseInt(full, 16);
		if (Number.isNaN(int)) return [184, 216, 176];
		return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
	}

	function applyCanvasSize() {
		canvas.width = Math.round(width * dpr);
		canvas.height = Math.round(height * dpr);
		ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	function draw() {
		ctx!.clearRect(0, 0, width, height);

		const [r, g, b] = rgb;
		const cx = width / 2 + mouseX * 26;
		const cy = height / 2 + mouseY * 18;
		const angle = time * 0.15;
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);

		for (let i = 0; i < nodeCount; i++) {
			const n = nodes[i];

			n.x += n.vx + Math.sin(time + i * 0.5) * 0.08;
			n.y += n.vy + Math.cos(time + i * 0.3) * 0.08;
			n.z += n.vz;

			if (Math.abs(n.x) > spreadX * 0.5) n.vx *= -1;
			if (Math.abs(n.y) > spreadY * 0.5) n.vy *= -1;
			if (Math.abs(n.z) > spreadZ * 0.5) n.vz *= -1;

			// Rotate the field around its vertical axis, then project.
			const rx = n.x * cos - n.z * sin;
			const rz = n.x * sin + n.z * cos;
			const scale = FOCAL_LENGTH / (FOCAL_LENGTH + rz + spreadZ);

			px[i] = cx + rx * scale;
			py[i] = cy + n.y * scale;
			pScale[i] = scale;
		}

		if (drawLinks) {
			ctx!.lineWidth = 1;
			for (let i = 0; i < nodeCount; i++) {
				for (let j = i + 1; j < nodeCount; j++) {
					const dx = px[i] - px[j];
					const dy = py[i] - py[j];
					const dist = Math.hypot(dx, dy);
					if (dist >= linkDistance) continue;

					// Fade with both separation and depth.
					const depth = (pScale[i] + pScale[j]) * 0.5;
					const alpha = (1 - dist / linkDistance) * 0.18 * depth;
					ctx!.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
					ctx!.beginPath();
					ctx!.moveTo(px[i], py[i]);
					ctx!.lineTo(px[j], py[j]);
					ctx!.stroke();
				}
			}
		}

		for (let i = 0; i < nodeCount; i++) {
			const radius = Math.max(0.6, (isMobile ? 1.6 : 2) * pScale[i]);
			ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.35 + pScale[i] * 0.55})`;
			ctx!.beginPath();
			ctx!.arc(px[i], py[i], radius, 0, Math.PI * 2);
			ctx!.fill();
		}
	}

	function tick() {
		if (!running) return;
		frame = requestAnimationFrame(tick);
		time += 0.005;
		mouseX += (targetMouseX - mouseX) * 0.05;
		mouseY += (targetMouseY - mouseY) * 0.05;
		draw();
	}

	// Animating an offscreen tab burns battery for nothing.
	function onVisibility() {
		if (document.hidden) {
			running = false;
			cancelAnimationFrame(frame);
		} else if (!running) {
			running = true;
			tick();
		}
	}
	document.addEventListener('visibilitychange', onVisibility);

	applyCanvasSize();
	tick();

	return {
		resize(nextWidth: number, nextHeight: number) {
			width = Math.max(1, nextWidth);
			height = Math.max(1, nextHeight);
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			spreadX = Math.max(width, 640) * 0.75;
			spreadY = Math.max(height, 480) * 0.75;
			applyCanvasSize();
		},

		updateMouse(x: number, y: number) {
			targetMouseX = (x - 0.5) * 2;
			targetMouseY = (y - 0.5) * 2;
		},

		updateColors(accent: string) {
			rgb = parseColor(accent);
		},

		dispose() {
			running = false;
			cancelAnimationFrame(frame);
			document.removeEventListener('visibilitychange', onVisibility);
			ctx!.clearRect(0, 0, width, height);
		}
	};
}
