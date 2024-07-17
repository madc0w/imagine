const numPoints = 12;
let itNum = 0;
let canvas,
	ctx,
	lastRenderDate = new Date();
let points = [];

function load() {
	console.log('load');
	canvas = document.getElementById('canvas');
	canvas.width = innerWidth * 0.98;
	canvas.height = innerHeight * 0.98;

	ctx = canvas.getContext('2d', { willReadFrequently: true });
	ctx.fillStyle = '#004';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < numPoints; i++) {
		points.push({
			color: hexColor(hsvToRgb(Math.random(), 1, 1)),
			pos: {
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
			},
			vel: {
				x: 4 * (Math.random() - 0.5),
				y: 4 * (Math.random() - 0.5),
			},
		});
	}

	draw();
}

async function draw() {
	// if (Math.random() < 0.1) {
	for (const p of points) {
		// p.vel.y += 2;
		// p.vel.x += 2 * (Math.random() - 0.5);
		p.pos.x += p.vel.x;
		p.pos.y += p.vel.y;

		if (p.pos.x < 0 || p.pos.x > canvas.width) {
			p.vel.x *= -1;
		}
		if (p.pos.y < 0 || p.pos.y > canvas.height) {
			p.vel.y *= -1;
		}
	}

	// const numThreads = 20;
	// let numFinished = 0;
	// for (let i = 0; i < numThreads; i++) {
	// 	setTimeout(() => {
	// for (
	// 	let x = (i * canvas.width) / numThreads;
	// 	x < ((i + 1) * canvas.width) / numThreads;
	// 	x++
	// ) {
	for (let x = 0; x < canvas.width; x++) {
		for (let y = 0; y < canvas.height; y++) {
			let minDistPoint = points[0];
			for (const p of points) {
				if (distSq(p.pos, { x, y }) < distSq(minDistPoint.pos, { x, y })) {
					minDistPoint = p;
				}
			}

			ctx.fillStyle = minDistPoint.color;
			ctx.beginPath();
			ctx.rect(x, y, 1, 1);
			ctx.fill();
		}
		// }
		// 	numFinished++;
		// }, 0);
	}

	// do {
	// 	await sleep(200);
	// } while (numFinished < numThreads);

	itNum++;
	console.log(`iteration ${itNum} took ${new Date() - lastRenderDate} ms`);
	lastRenderDate = new Date();

	requestAnimationFrame(draw);
}

function hsvToRgb(h, s, v) {
	const i = Math.floor(h * 6);
	const f = h * 6 - i;
	const p = v * (1 - s);
	const q = v * (1 - f * s);
	const t = v * (1 - (1 - f) * s);
	let r, g, b;
	switch (i % 6) {
		case 0:
			(r = v), (g = t), (b = p);
			break;
		case 1:
			(r = q), (g = v), (b = p);
			break;
		case 2:
			(r = p), (g = v), (b = t);
			break;
		case 3:
			(r = p), (g = q), (b = v);
			break;
		case 4:
			(r = t), (g = p), (b = v);
			break;
		case 5:
			(r = v), (g = p), (b = q);
			break;
	}

	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255),
	};
}

function hexColor(color) {
	function toHex(n) {
		let h = n.toString(16);
		if (h.length < 2) {
			h = `0${h}`;
		}
		return h;
	}
	return `#${toHex(Math.round(color.r))}${toHex(Math.round(color.g))}${toHex(
		Math.round(color.b)
	)}`;
}

function getCanvasPixel(x, y) {
	const imgData = ctx.getImageData(x, y, 1, 1).data;
	return { r: imgData[0], g: imgData[1], b: imgData[2], a: imgData[3] };
}

function setPixel(imageData, x, y, color) {
	// console.log(color);
	const index = (x + y * imageData.width) * 4;
	imageData.data[index + 0] = color.r;
	imageData.data[index + 1] = color.g;
	imageData.data[index + 2] = color.b;
	imageData.data[index + 3] = color.a || 255;
}

function getPixel(imageData, x, y) {
	// console.log(color);
	const index = (x + y * imageData.width) * 4;
	return {
		r: imageData.data[index + 0],
		g: imageData.data[index + 1],
		b: imageData.data[index + 2],
		a: imageData.data[index + 3],
	};
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function distSq(p1, p2) {
	const dx = p1.x - p2.x;
	const dy = p1.y - p2.y;
	return dx * dx + dy * dy;
}
