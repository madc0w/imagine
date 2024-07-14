let canvas, ctx, imageData;

function load() {
	canvas = document.getElementById('canvas');
	canvas.width = innerWidth * 0.92;
	canvas.height = innerHeight * 0.92;

	ctx = canvas.getContext('2d');
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

	draw();
}

function draw() {
	// if (Math.random() < 0.1) {
	ctx.fillStyle = hexColor(hsvToRgb(Math.random(), 1, 1));
	ctx.beginPath();
	ctx.arc(
		canvas.width * Math.random(),
		canvas.height * Math.random(),
		20 + 80 * Math.random(),
		0,
		2 * Math.PI
	);
	ctx.fill();
	imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	// }

	for (let x = 0; x < canvas.width; x++) {
		for (let y = 0; y < canvas.height; y++) {
			const points = [];
			// points.push(getPixel(imageData, x, y));
			for (let x1 = x - 2; x1 <= x + 2; x1++) {
				for (let y1 = y - 2; y1 <= y + 2; y1++) {
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
	}

	ctx.putImageData(imageData, 0, 0);
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
