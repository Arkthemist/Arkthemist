"use client";

import { useEffect, useRef } from "react";

interface Point {
	x: number;
	y: number;
	age: number;
	size: number;
	opacity: number;
	prevX: number;
	prevY: number;
}

export function MouseTrail() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const points = useRef<Point[]>([]);
	const mousePosition = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
	const lastTime = useRef<number>(0);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) return;

		// Set canvas size
		const updateCanvasSize = () => {
			const dpr = window.devicePixelRatio || 1;
			canvas.width = window.innerWidth * dpr;
			canvas.height = window.innerHeight * dpr;
			canvas.style.width = `${window.innerWidth}px`;
			canvas.style.height = `${window.innerHeight}px`;
			ctx.scale(dpr, dpr);
		};
		updateCanvasSize();
		window.addEventListener("resize", updateCanvasSize);

		const handleMouseMove = (e: MouseEvent) => {
			const rect = canvas.getBoundingClientRect();
			const currentX = e.clientX - rect.left;
			const currentY = e.clientY - rect.top;

			// Only create points if the mouse has moved
			if (
				currentX === mousePosition.current.x &&
				currentY === mousePosition.current.y
			) {
				return;
			}

			const speed = Math.hypot(
				currentX - mousePosition.current.x,
				currentY - mousePosition.current.y,
			);

			// Time-based point creation for smooth lines
			const now = performance.now();
			const timeDelta = now - lastTime.current;

			if (timeDelta > 16) {
				// Limit to ~60 FPS
				const size = Math.max(4, Math.min(32, 32 - speed * 0.8));
				const opacity = Math.min(0.9, 0.4 + speed * 0.01);

				points.current.push({
					x: currentX,
					y: currentY,
					prevX: mousePosition.current.x || currentX,
					prevY: mousePosition.current.y || currentY,
					age: 0,
					size,
					opacity,
				});

				mousePosition.current = {
					x: currentX,
					y: currentY,
					prevX: mousePosition.current.x,
					prevY: mousePosition.current.y,
				};
				lastTime.current = now;
			}
		};

		// Animation function
		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Update and draw points
			points.current = points.current.filter((point) => {
				point.age += 1;

				if (point.age > 60) return false;

				const alpha = Math.max(0, 1 - (point.age / 60) ** 2);

				// Draw brush stroke
				ctx.beginPath();
				ctx.moveTo(point.prevX, point.prevY);
				ctx.lineTo(point.x, point.y);

				// Enhanced brush style
				ctx.lineCap = "round";
				ctx.lineJoin = "round";
				ctx.lineWidth = point.size * (1 - (point.age / 60) ** 1.5);
				ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * point.opacity})`;

				// Enhanced glow effect
				ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
				ctx.shadowBlur = 10;

				ctx.stroke();
				return true;
			});

			requestAnimationFrame(animate);
		};

		// Start animation and add event listeners
		window.addEventListener("mousemove", handleMouseMove);
		animate();

		// Cleanup
		return () => {
			window.removeEventListener("resize", updateCanvasSize);
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	return (
		<div className="fixed inset-0 z-[1] pointer-events-none">
			<canvas
				ref={canvasRef}
				className="absolute inset-0 w-full h-full"
				style={{ mixBlendMode: "plus-lighter" }}
			/>
		</div>
	);
}
