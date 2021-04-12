canvas.addEventListener("keydown", e => input[e.key] = true);
canvas.addEventListener("keyup",   e => input[e.key] = false);
canvas.addEventListener("pointerdown", e => input.mouse = e.which);
canvas.addEventListener("pointerup",   _ => input.mouse = 0);
canvas.addEventListener("pointermove", e => input.pos = sub(e, canvas.getBoundingClientRect()));
canvas.addEventListener("wheel", e => {
	const scale = C.ZOOM_SPEED ** -e.deltaY;
	const p = toXY(ctx.getTransform().inverse().transformPoint(input.pos));
	ctx.setTransform(ctx.getTransform().scale(scale, scale, 1, ...coords(p)));
});

settings.canvas.addEventListener("pointerdown", _ => {
	removeChildren(sidebar);
	addProperty(C, "RENDER_CONSTR",      "boolean", true);
	addProperty(C, "ZOOM_SPEED",         "number");
	addProperty(C, "MAX_ITER",           "number");
	addProperty(C, "POINT_RADIUS",       "number");
	addProperty(C, "LINE_WIDTH",         "number");
	addProperty(C, "CONSTRUCTION_WIDTH", "number");
	addProperty(C, "POINT_ALPHA",        "number");
	addProperty(C, "CONSTRUCTION_ALPHA", "number");
	addProperty(C, "FIX_ICON_SIZE",      "number");
	addProperty(C, "ICON_WIDTH",         "number");
	addProperty(C, "ICON_LINE_WIDTH",    "number");
});

window.addEventListener("resize", _ => {
	initCanvasContext(ctx);
	{
		const {w, h} = initCanvasContext(settings, false);
		settings.globalAlpha = C.POINT_ALPHA;
		settings.font = h + "px monospace";
		settings.textAlign = "center";
		settings.textBaseline = "middle";
		settings.fillText("\u2699", w / 2, h / 2);
	}
	{
		const {w, h} = initCanvasContext(point, false);
		point.globalAlpha = C.POINT_ALPHA;
		point.lineWidth = C.CONSTRUCTION_WIDTH;
		point.lineCap = "round";
		point.setLineDash(C.DASH_SPACING);
		point.beginPath();
		point.arc(w / 2, h / 2, C.POINT_RADIUS, 0, Math.PI * 2);
		point.stroke();

		initCanvasContext(line);
		line.lineWidth = C.ICON_LINE_WIDTH;
		line.lineCap = "round";
		line.beginPath();
		line.moveTo(-C.ICON_WIDTH, -C.ICON_WIDTH);
		line.lineTo( C.ICON_WIDTH,  C.ICON_WIDTH);
		line.stroke();

		initCanvasContext(circle);
		circle.lineWidth = C.ICON_LINE_WIDTH;
		circle.beginPath();
		circle.arc(0, 0, C.ICON_WIDTH, 0, Math.PI * 2);
		circle.stroke();
	}
});

window.dispatchEvent(new Event("resize"));
