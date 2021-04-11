let lastMouse;
const loop = () => {
	if (input.pos) {
		let alreadyHovering = false;

		for (let p of points) {
			p.hover = input.mouse === 1? p.hover: 
			          alreadyHovering? false: 
			          dist(toXY(ctx.getTransform().transformPoint(p)), input.pos) < POINT_RAD;
			alreadyHovering ||= p.hover;
			p.select = p.hover && input.mouse === 1;
			if (p.select) {
				removeChildren(sidebar);
				addProperty(p, "x");
				addProperty(p, "y");
			}
		}

		for (let p of [...paths].reverse()) {
			setContextPath(p);
			p.hover = input.mouse === 1? p.hover: 
			          alreadyHovering? false: 
			          p.fill? ctx.isPointInPath(...coords(input.pos)): 
			          ctx.isPointInStroke(...coords(input.pos));
			alreadyHovering ||= p.hover;
			p.select = p.hover && input.mouse === 1;
			if (p.select) {
				removeChildren(sidebar);
				if (!p.construction) {
					addProperty(p, "stroke", true);
					addProperty(p, "fill",   true);
					addProperty(p, "alpha",  true);
					addProperty(p, "width",  true);
					addProperty(p, "cap",    true);
					addProperty(p, "join",   true);
				}
			}
		}

		if (input.mouse === 1 && !alreadyHovering) removeChildren(sidebar);
		if (input.mouse === 2) ctx.setTransform(ctx.getTransform().translate(
			(input.pos.x - lastMouse.x) / ctx.getTransform().a,
			(input.pos.y - lastMouse.y) / ctx.getTransform().d
		));

		lastMouse = input.pos;
	}

	if (input["c"]) window.dispatchEvent(new Event("resize"));

	const pointer = toXY(ctx.getTransform().inverse().transformPoint(input.pos));
	for (let p of points) if (p.select) Object.assign(p, pointer);

	let old = [{}];
	for (let i = 0; i < SOLVER_MAX_ITER && old.some((o, i) => !eql(o, points[i])); ++i) {
		old = points.map(p => Object.assign({}, p));
		for (let p of points) if (p.constraints) for (let c of p.constraints) {
			if (c.type === "fixed") {
				if (c.pos) Object.assign(p, c.pos);
				else c.pos = toXY(p);
			}
			else if (c.type === "colinear") {
				const a = sub(c.b, c.a);
				const b = sub(p,   c.a);
				const r = dot(a, b) / dot(a, a);
				const p2 = add(c.a, scale(a, r));
				if (!pIsNaN(p2)) Object.assign(p, p2);
			}
			else if (c.type === "equidistant") {
				const offset = scale(norm(sub(p, c.c)), dist(c.c, c.r));
				if (!pIsNaN(offset)) Object.assign(p, add(offset, c.c));
			}
		}
	}

	const transform = ctx.getTransform();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.setTransform(transform);

	for (let p of paths) {
		setContextPath(p);
		if (p.fill)   ctx.fill();
		if (p.stroke) ctx.stroke();
	}
	
	if (RENDER_CONSTR) {
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.setLineDash(DASH_SPACING);
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.lineWidth = CONSTRUCTION_WIDTH;

		for (let p of points) if (p.constraints) for (let c of p.constraints) {
			ctx.beginPath();
			if (c.type === "fixed") {
				const p2 = toXY(transform.transformPoint(p));
				ctx.moveTo(p2.x - FIX_ICON_SIZE, p2.y + FIX_ICON_SIZE);
				ctx.lineTo(p2.x + FIX_ICON_SIZE, p2.y - FIX_ICON_SIZE);
				ctx.moveTo(p2.x - FIX_ICON_SIZE, p2.y - FIX_ICON_SIZE);
				ctx.lineTo(p2.x + FIX_ICON_SIZE, p2.y + FIX_ICON_SIZE);
			}
			else if (c.type === "colinear") {
				// TODO
			}
			else if (c.type === "equidistant") {
				const a = toXY(transform.transformPoint(c.c));
				const b = toXY(transform.transformPoint(c.r));
				ctx.arc(...coords(a), dist(a, b), 0, Math.PI * 2);
			}
			ctx.globalAlpha = c.hover? POINT_ALPHA: CONSTRUCTION_ALPHA;
			ctx.strokeStyle = c.select? "blue": c.hover? "cyan": "black";
			ctx.stroke();
		}

		ctx.strokeStyle = "black";
		ctx.globalAlpha = POINT_ALPHA;
		for (let p of points) {
			ctx.beginPath();
			ctx.arc(...coords(toXY(transform.transformPoint(p))), POINT_RAD, 0, Math.PI * 2);
			if (p.hover) {
				ctx.fillStyle = p.select? "blue": "cyan";
				ctx.fill();
			}
			ctx.stroke();
		}

		ctx.setLineDash([]);
		ctx.setTransform(transform);
	}

	window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);

window.addEventListener("resize", _ => {
	initCanvasContext(ctx);

	const {w, h} = initCanvasContext(constr, false);
	constr.globalAlpha = CONSTRUCTION_ALPHA;
	constr.lineWidth = CONSTRUCTION_WIDTH;
	constr.lineCap = "round";
	constr.setLineDash(DASH_SPACING);
	constr.strokeRect(ICON_PIXEL, ICON_PIXEL, w - 2 * ICON_PIXEL, h - 2 * ICON_PIXEL);

	initCanvasContext(point, false);
	point.globalAlpha = POINT_ALPHA;
	point.lineWidth = CONSTRUCTION_WIDTH;
	point.lineCap = "round";
	point.setLineDash(DASH_SPACING);
	point.beginPath();
	point.arc(w / 2, h / 2, POINT_RAD, 0, Math.PI * 2);
	point.stroke();

	initCanvasContext(line);
	line.lineWidth = ICON_WIDTH;
	line.lineCap = "round";
	line.beginPath();
	line.moveTo(-ICON_MATH, -ICON_MATH);
	line.lineTo( ICON_MATH,  ICON_MATH);
	line.stroke();

	initCanvasContext(circle);
	circle.lineWidth = ICON_WIDTH;
	circle.beginPath();
	circle.arc(0, 0, ICON_MATH, 0, Math.PI * 2);
	circle.stroke();
});
window.dispatchEvent(new Event("resize"));
