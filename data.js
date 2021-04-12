const points = [{x: 0, y: 0}, {x: 0, y: 0.5}, {x: 0.5, y: 0.5}, {x: -0.5, y: 0}];
points[0].constraints = [{type: "fixed"}];
points[1].constraints = [{type: "fixed"}];
points[3].constraints = [
	{type: "colinear", a: points[0], b: points[2]},
	{type: "equidistant", c: points[0], r: points[1]}
];

const paths = [
	{stroke: "blue", z: 0, commands: [
		{type: "arc", center: points[0], start: points[1], end: points[3]}
	]},
	{stroke: "red", z: 1, commands: [
		{type: "move", p: points[0]},
		{type: "line", p: points[2]}
	]},
	{fill: "green", z: 0, commands: [
		{type: "move", p: points[0]},
		{type: "line", p: points[1]},
		{type: "line", p: points[3]},
		{type: "line", p: points[0]}
	]}
];

let input = {};

const ctx      = document.getElementById("canvas")  .getContext("2d");
const point    = document.getElementById("point")   .getContext("2d");
const line     = document.getElementById("line")    .getContext("2d");
const circle   = document.getElementById("circle")  .getContext("2d");
const settings = document.getElementById("settings").getContext("2d");
const sidebar  = document.getElementById("sidebar");

const C = {
	RENDER_CONSTR: true,

	ZOOM_SPEED: 1.001,
	MAX_ITER: 5,

	POINT_RADIUS: 10,
	LINE_WIDTH: 0.01,
	CONSTRUCTION_WIDTH: 5,

	POINT_ALPHA: 0.5,
	CONSTRUCTION_ALPHA: 0.1,

	DASH_SPACING: [5, 15],
	
	FIX_ICON_SIZE: 25,
	ICON_WIDTH: 0.75,
	ICON_LINE_WIDTH: 0.1,
};
