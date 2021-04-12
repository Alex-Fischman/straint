const createChild = (p, s) => p.appendChild(document.createElement(s));
const removeChildren = p => {while (p.firstChild) p.removeChild(p.lastChild);};

const addProperty = (object, name, type, optional = false) => {
	const div = createChild(sidebar, "div");
	const span = createChild(div, "span");
	span.textContent = name;

	const makeInput = () => {
		if (type === "boolean") return;
		const input = createChild(div, "input");
		input.setAttribute("type", "text");
		if (optional) input.value = object[name] || object[name + "lastValue"] || "";
		else input.value = object[name];
		input.addEventListener("change", _ => {
			if (type === "number") object[name] = Number(input.value);
			else if (type === "string") object[name] = input.value;
			else throw "unrecognized input type";
		});
		input.dispatchEvent(new Event("change"));
	};

	if (optional) {
		const checkbox = createChild(div, "input");
		checkbox.setAttribute("type", "checkbox");
		checkbox.checked = object[name] !== undefined;
		if (checkbox.checked) makeInput();
		checkbox.addEventListener("change", _ => {
			if (type === "boolean") object[name] = checkbox.checked;
			else if (checkbox.checked) makeInput();
			else {
				div.removeChild(div.lastChild);
				object[name + "lastValue"] = object[name];
				object[name] = undefined;
			}
		});
	}
	else makeInput();
};

const initCanvasContext = (c, normalizeTransform = true) => {
	const {width: w, height: h} = c.canvas.getBoundingClientRect();
	c.canvas.width = w;
	c.canvas.height = h;
	if (normalizeTransform) c.setTransform(new DOMMatrix(w > h? 
		[h / 2, 0, 0, -h / 2, h / 2 + (w - h) / 2, h / 2]: 
		[w / 2, 0, 0, -w / 2, w / 2, w / 2 + (h - w) / 2]
	));
	return {w, h};
};
