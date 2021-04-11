const createChild = (p, s) => p.appendChild(document.createElement(s));
const removeChildren = p => {while (p.firstChild) p.removeChild(p.lastChild);};

const addProperty = (object, name, optional = false) => {
	const div = createChild(sidebar, "div");
	const span = createChild(div, "span");
	span.textContent = name;

	const makeInput = v => {
		const input = createChild(div, "input");
		input.setAttribute("type", "text");
		input.value = v;
		input.addEventListener("change", _ => object[name] = input.value);
	};

	if (optional) {
		const checkbox = createChild(div, "input");
		checkbox.setAttribute("type", "checkbox");
		checkbox.checked = object[name] !== undefined;
		if (checkbox.checked) makeInput(object[name] || "");
		checkbox.addEventListener("change", _ => {
			if (checkbox.checked) makeInput(object[name] || "");
			else {
				div.removeChild(div.lastChild);
				object[name] = undefined;
			}
		});
	}
	else makeInput(object[name]);
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
