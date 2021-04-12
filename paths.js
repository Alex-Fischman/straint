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
	ctx.lineWidth = p.width || C.LINE_WIDTH;
	ctx.globalAlpha = p.alpha === undefined? 1: p.alpha;
	if (p.fill)   ctx.fillStyle   = p.select? "blue": p.hover? "cyan": p.fill;
	if (p.stroke) ctx.strokeStyle = p.select? "blue": p.hover? "cyan": p.stroke;
};
