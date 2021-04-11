const points = [{x: 0, y: 0}, {x: 0, y: 0.5}, {x: 0.5, y: 0.5}, {x: -0.5, y: 0}];
points[0].constraints = [{type: "fixed"}];
points[1].constraints = [{type: "fixed"}];
points[3].constraints = [
	{type: "colinear", a: points[0], b: points[2]},
	{type: "equidistant", c: points[0], r: points[1]}
];

const paths = [
	{commands: [{type: "arc", center: points[0], start: points[1], end: points[3]}], fill: "green"},
	{commands: [{type: "move", p: points[0]}, {type: "line", p: points[2]}], stroke: "red"}
];

let input = {};

const ctx    = document.getElementById("canvas")       .getContext("2d");
const constr = document.getElementById("constructions").getContext("2d");
const point  = document.getElementById("point")        .getContext("2d");
const line   = document.getElementById("line")         .getContext("2d");
const circle = document.getElementById("circle")       .getContext("2d");

const sidebar = document.getElementById("sidebar");

let RENDER_CONSTR = true;

const ZOOM_SPEED = 1.001;
const SOLVER_MAX_ITER = 5;

const POINT_RAD = 10;
const LINE_WIDTH = 0.01;
const DASH_SPACING = [5, 15];
const POINT_ALPHA = 0.5;
const CONSTRUCTION_ALPHA = 0.1;
const CONSTRUCTION_WIDTH = 5;

const FIX_ICON_SIZE = 25;

const ICON_WIDTH = 0.1;
const ICON_MATH = 0.75;
const ICON_PIXEL = 15;
