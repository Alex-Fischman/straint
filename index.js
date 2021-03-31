let lastMouse;
const loop = () => {
	// Input
	if (input.pos) {
		let hovering = false;

		for (let p of points) {
			p.hover = input.mouse === 1? p.hover: 
			          hovering? false: 
			          dist(pointToPixel(p), input.pos) < POINT_RAD;
			hovering ||= p.hover;
			p.select = p.hover && input.mouse === 1;
			if (p.select) {
				removeChildren(sidebar);
				addTextProperty(p, "x");
				addTextProperty(p, "y");
			}
		}

		for (let p of paths) {
			const c = coords(pixelToPoint(input.pos));
			setContextPath(p);
			p.hover = input.mouse === 1? p.hover: 
			          hovering? false: 
			          ctx.isPointInStroke(...c) || 
			          p.fill && ctx.isPointInPath(...c);
			hovering ||= p.hover;
			p.select = p.hover && input.mouse === 1;
			if (p.select) {
				removeChildren(sidebar);
				if (!p.construction) {
					addTextProperty(p, "stroke", true);
					addTextProperty(p, "fill",   true);
					addTextProperty(p, "alpha",  true);
					addTextProperty(p, "width",  true);
					addTextProperty(p, "cap",    true);
					addTextProperty(p, "join",   true);
				}
			}
		}

		if (input.mouse === 1 && !hovering) removeChildren(sidebar);
		if (input.mouse === 2) transform.translateSelf(
			(input.pos.x - lastMouse.x) / transform.a,
			(input.pos.y - lastMouse.y) / transform.d
		);

		lastMouse = input.pos;
	}
	if (input["c"]) window.dispatchEvent(new Event("resize"));

	const pointer = pixelToPoint(input.pos);
	for (let p of points) if (p.select) Object.assign(p, pointer);

	solve();
	render();
	window.requestAnimationFrame(loop);
}

window.dispatchEvent(new Event("resize"));
window.requestAnimationFrame(loop);
