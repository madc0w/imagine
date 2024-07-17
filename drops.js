let itNum = 0;
let canvas,
	ctx,
	lastRenderDate = new Date();
const r = 4;
let drops = [];

function load() {
	console.log('load');
	canvas = document.getElementById('canvas');
	canvas.width = 800; //innerWidth * 0.98;
	canvas.height = 800; //innerHeight * 0.98;

	ctx = canvas.getContext('2d', { willReadFrequently: true });
	ctx.fillStyle = '#004';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

	draw();
}

async function draw() {
	// if (Math.random() < 0.1) {
	drops.push({
		color: hexColor(hsvToRgb(Math.random(), 1, 1)),
		r: 20 + 80 * Math.random(),
		pos: {
			x: canvas.width * Math.random(),
			y: canvas.height * Math.random(),
		},
		vel: {
			x: 0,
			y: 0,
		},
	});
	// }

	const toKeep = [];
	for (const drop of drops) {
		drop.vel.y += 2;
		drop.vel.x += 2 * (Math.random() - 0.5);
		drop.pos.x += drop.vel.x;
		drop.pos.y += drop.vel.y;
		if (
			!(
				drop.pos.x < -drop.r ||
				drop.pos.x > canvas.width + drop.r ||
				drop.pos.y < -drop.r ||
				drop.pos.y > canvas.height + drop.r
			)
		) {
			toKeep.push(drop);
		}
	}
	drops = toKeep;

	for (const drop of drops) {
		ctx.fillStyle = drop.color;
		ctx.beginPath();
		ctx.arc(drop.pos.x, drop.pos.y, drop.r, 0, 2 * Math.PI);
		ctx.fill();
	}
	imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

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
			const points = [];
			// points.push(getPixel(imageData, x, y));
			for (let x1 = x - r; x1 <= x + r; x1++) {
				for (let y1 = y - r; y1 <= y + r; y1++) {
					if (x1 >= 0 && y1 >= 0 && x1 < canvas.width && y1 < canvas.height) {
						points.push(getPixel(imageData, x1, y1));
					}
				}
			}
			const c = {
				r: 0,
				b: 0,
				g: 0,
			};
			for (const p of points) {
				c.r += p.r;
				c.g += p.g;
				c.b += p.b;
			}
			c.r /= points.length;
			c.g /= points.length;
			c.b /= points.length;

			setPixel(imageData, x, y, c);
		}
		// }
		// 	numFinished++;
		// }, 0);
	}

	// do {
	// 	await sleep(200);
	// } while (numFinished < numThreads);

	ctx.putImageData(imageData, 0, 0);

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
