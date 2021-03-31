const constr = document.getElementById("constructions").getContext("2d");
const point =  document.getElementById("point")        .getContext("2d");
const line =   document.getElementById("line")         .getContext("2d");
const circle = document.getElementById("circle")       .getContext("2d");

const ICON_WIDTH = 0.1;
const ICON_MATH = 0.75;
const ICON_PIXEL = 15;
window.addEventListener("resize", _ => {
	const {w, h} = initCanvasContext(constr);
	constr.globalAlpha = CONSTRUCTION_ALPHA;
	constr.lineWidth = CONSTRUCTION_WIDTH;
	constr.lineCap = "round";
	constr.setLineDash(DASH_SPACING);
	constr.strokeRect(ICON_PIXEL, ICON_PIXEL, w - 2 * ICON_PIXEL, h - 2 * ICON_PIXEL);

	initCanvasContext(point);
	point.globalAlpha = POINT_ALPHA;
	point.lineWidth = CONSTRUCTION_WIDTH;
	point.lineCap = "round";
	point.setLineDash(DASH_SPACING);
	point.beginPath();
	point.arc(w / 2, h / 2, POINT_RAD, 0, Math.PI * 2);
	point.stroke();

	initCanvasContext(line);
	line.setTransform(new DOMMatrix(w > h? 
		[h / 2, 0, 0, -h / 2, h / 2 + (w - h) / 2, h / 2]: 
		[w / 2, 0, 0, -w / 2, w / 2, w / 2 + (h - w) / 2]
	));
	line.lineWidth = ICON_WIDTH;
	line.lineCap = "round";
	line.beginPath();
	line.moveTo(-ICON_MATH, -ICON_MATH);
	line.lineTo( ICON_MATH,  ICON_MATH);
	line.stroke();

	initCanvasContext(circle);
	circle.setTransform(new DOMMatrix(w > h? 
		[h / 2, 0, 0, -h / 2, h / 2 + (w - h) / 2, h / 2]: 
		[w / 2, 0, 0, -w / 2, w / 2, w / 2 + (h - w) / 2]
	));
	circle.lineWidth = ICON_WIDTH;
	circle.beginPath();
	circle.arc(0, 0, ICON_MATH, 0, Math.PI * 2);
	circle.stroke();
});

let RENDER_CONSTR = true;
constr.canvas.addEventListener("pointerdown", _ => {RENDER_CONSTR ^= 1;});
