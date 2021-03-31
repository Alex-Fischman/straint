const ZOOM_SPEED = 1.01;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let transform = new DOMMatrix();
const pointToPixel = p => toXY(transform.transformPoint(p));
const pixelToPoint = p => toXY(transform.inverse().transformPoint(p));
const pixelsToMath = x => x / Math.abs(transform.a);

const initCanvasContext = c => {
	const {width: w, height: h} = c.canvas.getBoundingClientRect();
	c.canvas.width = w;
	c.canvas.height = h;
	return {w, h};
};
window.addEventListener("resize", _ => {
	const {w, h} = initCanvasContext(ctx);
	transform = new DOMMatrix(w > h? 
		[h / 2, 0, 0, -h / 2, h / 2 + (w - h) / 2, h / 2]: 
		[w / 2, 0, 0, -w / 2, w / 2, w / 2 + (h - w) / 2]
	);
	transform.scaleSelf(1 / ZOOM_SPEED, 1 / ZOOM_SPEED);
});

let input = {};
canvas.addEventListener("keydown", e => input[e.key] = true);
canvas.addEventListener("keyup",   e => input[e.key] = false);
canvas.addEventListener("pointerdown", e => input.mouse = e.which);
canvas.addEventListener("pointerup",   _ => input.mouse = 0);
canvas.addEventListener("pointermove", e => input.pos = sub(e, canvas.getBoundingClientRect()));
canvas.addEventListener("wheel", e => {
	const scale = ZOOM_SPEED ** -e.deltaY;
	const p = pixelToPoint(input.pos);
	transform.scaleSelf(scale, scale, 1, ...coords(p));
});

const LINE_WIDTH = 0.01;
const setContextPath = p => {
	ctx.beginPath();
	for (let c of p.commands) {
		if (c.type === "move")      ctx.moveTo(...coords(c.p));
		else if (c.type === "line") ctx.lineTo(...coords(c.p));
		else if (c.type === "arc") {
			const radius = dist(c.center, c.start);
			const flat = {x: 1, y: 0};
			const startArm = sub(c.start, c.center);
			const start = Math.atan2(startArm.y, startArm.x);
			const endArm = sub(c.end, c.center);
			const end = Math.atan2(endArm.y, endArm.x);
			if (start === end) ctx.arc(...coords(c.center), radius, 0, Math.PI * 2);
			else ctx.arc(...coords(c.center), radius, start, end, !c.clockwise);
		}
	}
	ctx.lineCap   = p.cap   || "round";
	ctx.lineJoin  = p.join  || "round";
	ctx.lineWidth = p.width || LINE_WIDTH;
};

const paths = [
	{commands: [{type: "arc", center: points[0], start: points[1], end: points[3]}], fill: "green"},
	{commands: [{type: "move", p: points[0]}, {type: "line", p: points[2]}], stroke: "red"},
	{commands: [{type: "move", p: points[1]}, {type: "line", p: points[3]}], stroke: "blue"}
];

const POINT_RAD = 10;
const DASH_SPACING = [5, 15];
const POINT_ALPHA = 0.5;
const CONSTRUCTION_ALPHA = 0.1;
const CONSTRUCTION_WIDTH = 5;

const FIX_ICON_SIZE = 25;
const render = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.setTransform(transform);

	ctx.setLineDash([]);
	for (let p of paths) {
		setContextPath(p);
		ctx.globalAlpha = p.alpha === undefined? 1: p.alpha;
		if (p.fill) {
			ctx.fillStyle = p.fill;
			ctx.fill();
		}
		if (p.stroke) {
			ctx.strokeStyle = p.select? "blue": p.hover? "cyan": p.stroke;
			ctx.stroke();
		}
	}

	ctx.setTransform(1, 0, 0, 1, 0, 0);

	if (RENDER_CONSTR) {
		ctx.setLineDash(DASH_SPACING);
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.lineWidth = CONSTRUCTION_WIDTH;

		for (let p of points) if (p.constraints) for (let c of p.constraints) {
			ctx.beginPath();
			if (c.type === "fixed") {
				const p2 = pointToPixel(p);
				ctx.moveTo(p2.x - FIX_ICON_SIZE, p2.y + FIX_ICON_SIZE);
				ctx.lineTo(p2.x + FIX_ICON_SIZE, p2.y - FIX_ICON_SIZE);
				ctx.moveTo(p2.x - FIX_ICON_SIZE, p2.y - FIX_ICON_SIZE);
				ctx.lineTo(p2.x + FIX_ICON_SIZE, p2.y + FIX_ICON_SIZE);
			}
			else if (c.type === "colinear") {
				// TODO
			}
			else if (c.type === "equidistant") {
				const a = pointToPixel(c.c);
				const b = pointToPixel(c.r);
				ctx.arc(...coords(a), dist(a, b), 0, Math.PI * 2);
			}
			ctx.globalAlpha = c.hover? POINT_ALPHA: CONSTRUCTION_ALPHA;
			ctx.strokeStyle = c.select? "blue": c.hover? "cyan": "black";
			ctx.stroke();
		}

		ctx.globalAlpha = CONSTRUCTION_ALPHA;
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, canvas.width, canvas.height);
		
		ctx.globalAlpha = POINT_ALPHA;
		for (let p of points) {
			ctx.beginPath();
			ctx.arc(...coords(pointToPixel(p)), POINT_RAD, 0, Math.PI * 2);
			if (p.hover) {
				ctx.fillStyle = p.select? "blue": "cyan";
				ctx.fill();
			}
			ctx.stroke();
		}
	}
};
