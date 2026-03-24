export type WindowId = 'projects' | 'experience' | 'skills';

interface WindowState {
	open: boolean;
	x: number;
	y: number;
	zIndex: number;
	minimized: boolean;
}

let topZ = $state(100);
const windows = $state<Record<WindowId, WindowState>>({
	projects: { open: false, x: 0, y: 0, zIndex: 10, minimized: false },
	experience: { open: false, x: 0, y: 0, zIndex: 10, minimized: false },
	skills: { open: false, x: 0, y: 0, zIndex: 10, minimized: false }
});

export function getWindow(id: WindowId): WindowState {
	return windows[id];
}

export function isWindowOpen(id: WindowId): boolean {
	return windows[id].open && !windows[id].minimized;
}

export function toggleWindow(id: WindowId) {
	const w = windows[id];
	if (w.open && !w.minimized) {
		w.open = false;
		w.minimized = false;
	} else if (w.open && w.minimized) {
		w.minimized = false;
		bringToFront(id);
	} else {
		w.open = true;
		w.minimized = false;
		// Center with slight random offset
		if (typeof window !== 'undefined') {
			const offset = Math.random() * 40 - 20;
			w.x = Math.max(20, (window.innerWidth - 700) / 2 + offset);
			w.y = Math.max(20, (window.innerHeight - 500) / 2 + offset);
		}
		bringToFront(id);
	}
}

export function closeWindow(id: WindowId) {
	windows[id].open = false;
	windows[id].minimized = false;
}

export function minimizeWindow(id: WindowId) {
	windows[id].minimized = true;
}

export function bringToFront(id: WindowId) {
	topZ++;
	windows[id].zIndex = topZ;
}

export function updatePosition(id: WindowId, x: number, y: number) {
	windows[id].x = x;
	windows[id].y = y;
}
