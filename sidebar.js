const sidebar = document.getElementById("sidebar");

const createChild = (p, s) => p.appendChild(document.createElement(s));
const removeChildren = p => {while (p.firstChild) p.removeChild(p.lastChild);};

const addTextProperty = (object, name, optional = false) => {
	const div = createChild(sidebar, "div");
	const span = createChild(div, "span");
	span.textContent = name;

	const makeTextInput = v => {
		const input = createChild(div, "input");
		input.setAttribute("type", "text");
		input.value = v;
		input.addEventListener("change", _ => object[name] = input.value);
	};

	if (optional) {
		const checkbox = createChild(span, "input");
		checkbox.setAttribute("type", "checkbox");
		checkbox.checked = object[name] !== undefined;
		if (checkbox.checked) makeTextInput(object[name] || "");
		checkbox.addEventListener("change", _ => {
			if (checkbox.checked) makeTextInput(object[name] || "");
			else {
				div.removeChild(div.lastChild);
				object[name] = undefined;
			}
		});
	}
	else makeTextInput(object[name]);
};
