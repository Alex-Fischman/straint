const toXY   = ({x, y}) => ({x, y});
const coords = ({x, y}) => [x, y];
const pIsNaN = ({x, y}) => isNaN(x) || isNaN(y);
const eql    = (a, b) => a.x === b.x && a.y === b.y;
const dist   = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
const add    = (a, b) => ({x: a.x + b.x, y: a.y + b.y});
const sub    = (a, b) => ({x: a.x - b.x, y: a.y - b.y});
const mul    = (a, b) => ({x: a.x * b.x, y: a.y * b.y});
const dot    = (a, b) => a.x * b.x + a.y * b.y;
const scale  = (v, s) => ({x: v.x * s, y: v.y * s});
const length = v => dist(v, {x: 0, y: 0});
const norm   = v => scale(v, 1 / length(v));

const points = [{x: 0, y: 0}, {x: 0, y: 0.5}, {x: 0.5, y: 0.5}, {x: 0.5, y: 0}];
points[0].constraints = [{type: "fixed"}];
points[1].constraints = [{type: "fixed"}];
points[3].constraints = [
	{type: "colinear", a: points[0], b: points[2]},
	{type: "equidistant", c: points[0], r: points[1]}
];

const ITER = 5;
const solve = () => {
	let old = [{}];
	for (let i = 0; i < ITER && old.some((o, i) => !eql(o, points[i])); ++i) {
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
};
