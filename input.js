canvas.addEventListener("keydown", e => input[e.key] = true);
canvas.addEventListener("keyup",   e => input[e.key] = false);
canvas.addEventListener("pointerdown", e => input.mouse = e.which);
canvas.addEventListener("pointerup",   _ => input.mouse = 0);
canvas.addEventListener("pointermove", e => input.pos = sub(e, canvas.getBoundingClientRect()));
canvas.addEventListener("wheel", e => {
	const scale = ZOOM_SPEED ** -e.deltaY;
	const p = toXY(ctx.getTransform().inverse().transformPoint(input.pos));
	ctx.setTransform(ctx.getTransform().scale(scale, scale, 1, ...coords(p)));
});

constr.canvas.addEventListener("pointerdown", _ => {RENDER_CONSTR ^= 1;});
