// Source: src/js/header.js
"use strict";

var webvowl = webvowl || {};
webvowl.elements = webvowl.elements || {};
webvowl.labels = webvowl.labels || {};
webvowl.nodes = webvowl.nodes || {};
webvowl.util = webvowl.util || {};
webvowl.modules = webvowl.modules || {};
webvowl.parsing = webvowl.parsing || {};
// Source: src/js/graph/elements/BaseElement.js
/**
 * The base element for all visual elements of webvowl.
 */
webvowl.elements.BaseElement = (function () {

	var DEFAULT_LABEL = "DEFAULT_LABEL";

	var base = function (graph) {
		// Basic attributes
		var equivalents = [],
			id,
			label,
			type,
			iri,
		// Additional attributes
			annotations,
			attributes = [],
			visualAttribute,
			comment,
			description,
			equivalentBase,
		// Style attributes
			focused = false,
			indications = [],
			mouseEntered = false,
			styleClass,
			visible = true,
		// Other
			languageTools = webvowl.util.languageTools();


		// Properties
		this.attributes = function (p) {
			if (!arguments.length) return attributes;
			attributes = p;
			return this;
		};

		this.annotations = function (p) {
			if (!arguments.length) return annotations;
			annotations = p;
			return this;
		};

		this.comment = function (p) {
			if (!arguments.length) return comment;
			comment = p;
			return this;
		};

		this.description = function (p) {
			if (!arguments.length) return description;
			description = p;
			return this;
		};

		this.equivalents = function (p) {
			if (!arguments.length) return equivalents;
			equivalents = p || [];
			return this;
		};

		this.equivalentBase = function (p) {
			if (!arguments.length) return equivalentBase;
			equivalentBase = p;
			return this;
		};

		this.focused = function (p) {
			if (!arguments.length) return focused;
			focused = p;
			return this;
		};

		this.id = function (p) {
			if (!arguments.length) return id;
			id = p;
			return this;
		};

		this.indications = function (p) {
			if (!arguments.length) return indications;
			indications = p;
			return this;
		};

		this.iri = function (p) {
			if (!arguments.length) return iri;
			iri = p;
			return this;
		};

		this.label = function (p) {
			if (!arguments.length) return label;
			label = p || DEFAULT_LABEL;
			return this;
		};

		this.mouseEntered = function (p) {
			if (!arguments.length) return mouseEntered;
			mouseEntered = p;
			return this;
		};

		this.styleClass = function (p) {
			if (!arguments.length) return styleClass;
			styleClass = p;
			return this;
		};

		this.type = function (p) {
			if (!arguments.length) return type;
			type = p;
			return this;
		};

		this.visible = function (p) {
			if (!arguments.length) return visible;
			visible = p;
			return this;
		};

		this.visualAttribute = function (p) {
			if (!arguments.length) return visualAttribute;
			visualAttribute = p;
			return this;
		};


		this.commentForCurrentLanguage = function () {
			return languageTools.textForCurrentLanguage(this.comment(), graph.getLanguage());
		};

		this.descriptionForCurrentLanguage = function() {
			return languageTools.textForCurrentLanguage(this.description(), graph.getLanguage());
		};

		this.defaultLabel = function () {
			return languageTools.textForCurrentLanguage(this.label(), "default");
		};

		this.indicationString = function () {
			return this.indications().join(", ");
		};

		this.labelForCurrentLanguage = function () {
			return languageTools.textForCurrentLanguage(this.label(), graph.getLanguage());
		};
	};

	base.prototype.constructor = base;


	return base;
}());

// Source: src/js/graph/elements/labels/BaseLabel.js
webvowl.labels.BaseLabel = (function () {

	// Static variables
	var labelHeight = 28,
		labelWidth = 80;


	// Constructor, private variables and privileged methods
	var base = function (graph) {
		webvowl.elements.BaseElement.apply(this, arguments);

		var that = this,
		// Basic attributes
			cardinality,
			domain,
			inverse,
			link,
			minCardinality,
			maxCardinality,
			range,
			subproperties,
			superproperties,
		// Style attributes
			linkType = "normal",
			markerType = "normal",
			labelVisible = true,
		// Element containers
			cardinalityElement,
			labelElement,
			linkGroup,
			markerElement,
		// Other
			redundantProperties = [];


		// Properties
		this.cardinality = function (p) {
			if (!arguments.length) return cardinality;
			cardinality = p;
			return this;
		};

		this.cardinalityElement = function (p) {
			if (!arguments.length) return cardinalityElement;
			cardinalityElement = p;
			return this;
		};

		this.domain = function (p) {
			if (!arguments.length) return domain;
			domain = p;
			return this;
		};

		this.inverse = function (p) {
			if (!arguments.length) return inverse;
			inverse = p;
			return this;
		};

		this.labelElement = function (p) {
			if (!arguments.length) return labelElement;
			labelElement = p;
			return this;
		};

		this.labelVisible = function (p) {
			if (!arguments.length) return labelVisible;
			labelVisible = p;
			return this;
		};

		this.link = function (p) {
			if (!arguments.length) return link;
			link = p;
			return this;
		};

		this.linkGroup = function (p) {
			if (!arguments.length) return linkGroup;
			linkGroup = p;
			return this;
		};

		this.linkType = function (p) {
			if (!arguments.length) return linkType;
			linkType = p;
			return this;
		};

		this.markerElement = function (p) {
			if (!arguments.length) return markerElement;
			markerElement = p;
			return this;
		};

		this.markerType = function (p) {
			if (!arguments.length) return markerType;
			markerType = p;
			return this;
		};

		this.maxCardinality = function (p) {
			if (!arguments.length) return maxCardinality;
			maxCardinality = p;
			return this;
		};

		this.minCardinality = function (p) {
			if (!arguments.length) return minCardinality;
			minCardinality = p;
			return this;
		};

		this.range = function (p) {
			if (!arguments.length) return range;
			range = p;
			return this;
		};

		this.redundantProperties = function (p) {
			if (!arguments.length) return redundantProperties;
			redundantProperties = p;
			return this;
		};

		this.subproperties = function (p) {
			if (!arguments.length) return subproperties;
			subproperties = p;
			return this;
		};

		this.superproperties = function (p) {
			if (!arguments.length) return superproperties;
			superproperties = p;
			return this;
		};


		// Functions
		this.isSpecialLink = function () {
			return linkType === "special";
		};

		this.markerId = function () {
			return "marker" + that.id();
		};

		this.toggleFocus = function () {
			that.focused(!that.focused());
			labelElement.select("rect").classed("focused", that.focused());
		};


		// Reused functions TODO refactor
		this.drawProperty = function (labelGroup) {
			function attachLabel(property) {
				// Draw the label and its background
				var label = labelGroup.append("g")
					.datum(property)
					.classed("label", true)
					.attr("id", property.id());
				property.addRect(label);

				// Attach the text and perhaps special elements
				var textBox = webvowl.util.textElement(label);
				if (property instanceof webvowl.labels.owldisjointwith) {
					property.addDisjointLabel(labelGroup, textBox);
					return label;
				} else {
					textBox.addText(property.labelForCurrentLanguage());
				}

				textBox.addSubText(property.indicationString());
				property.addEquivalentsToLabel(textBox);

				return label;
			}

			if (!that.labelVisible()) {
				return undefined;
			}

			that.labelElement(attachLabel(that));

			// Draw an inverse label and reposition both labels if necessary
			if (that.inverse()) {
				var yTransformation = (that.labelHeight() / 2) + 1 /* additional space */;
				that.inverse()
					.labelElement(attachLabel(that.inverse()));

				that.labelElement()
					.attr("transform", "translate(" + 0 + ",-" + yTransformation + ")");
				that.inverse()
					.labelElement()
					.attr("transform", "translate(" + 0 + "," + yTransformation + ")");
			}

			return that.labelElement();
		};

		this.addRect = function (groupTag) {
			var rect = groupTag.append("rect")
				.classed(that.styleClass(), true)
				.classed("property", true)
				.attr("x", -that.labelWidth() / 2)
				.attr("y", -that.labelHeight() / 2)
				.attr("width", that.labelWidth())
				.attr("height", that.labelHeight())
				.on("mouseover", function () {
					onMouseOver();
				})
				.on("mouseout", function () {
					onMouseOut();
				});

			rect.append("title")
				.text(that.labelForCurrentLanguage());

			if (that.visualAttribute()) {
				rect.classed(that.visualAttribute(), true);
			}
		};
		this.addDisjointLabel = function (groupTag, textTag) {
			groupTag.append("circle")
				.classed("symbol", true)
				.classed("fineline", true)
				.classed("embedded", true)
				.attr("cx", -12.5)
				.attr("r", 10);

			groupTag.append("circle")
				.classed("symbol", true)
				.classed("fineline", true)
				.classed("embedded", true)
				.attr("cx", 12.5)
				.attr("r", 10);

			if (!graph.options().compactNotation()) {
				textTag.addSubText("disjoint");
			}
			textTag.setTranslation(0, 20);
		};
		this.addEquivalentsToLabel = function (textBox) {
			if (that.equivalents()) {
				var equivalentLabels,
					equivalentString;

				equivalentLabels = that.equivalents().map(function (property) {
					return property.labelForCurrentLanguage();
				});
				equivalentString = equivalentLabels.join(", ");

				textBox.addEquivalents(equivalentString);
			}
		};
		this.drawCardinality = function (cardinalityGroup) {
			if (that.minCardinality() === undefined &&
				that.maxCardinality() === undefined &&
				that.cardinality() === undefined) {
				return undefined;
			}

			// Drawing cardinality groups
			that.cardinalityElement(cardinalityGroup.classed("cardinality", true));

			var cardText = cardinalityGroup.append("text")
				.classed("cardinality", true)
				.attr("text-anchor", "middle")
				.attr("dy", "0.5ex");

			if (that.minCardinality() !== undefined) {
				var cardString = that.minCardinality().toString();
				cardString = cardString.concat(" .. ");
				cardString = cardString.concat(that.maxCardinality() !== undefined ? that.maxCardinality() : "*");

				cardText.text(cardString);
			} else if (that.cardinality() !== undefined) {
				cardText.text(that.cardinality());
			}

			return that.cardinalityElement();
		};
		function onMouseOver() {
			if (that.mouseEntered()) {
				return;
			}
			that.mouseEntered(true);

			setHighlighting(true);

			that.foreground();
			foregroundSubAndSuperProperties();
		}

		function setHighlighting(enable) {
			that.labelElement().select("rect").classed("hovered", enable);
			that.linkGroup().selectAll("path, text").classed("hovered", enable);
			that.markerElement().select("path").classed("hovered", enable);
			if (that.cardinalityElement()) {
				that.cardinalityElement().classed("hovered", enable);
			}

			var subAndSuperProperties = getSubAndSuperProperties();
			subAndSuperProperties.forEach(function (property) {
				property.labelElement().select("rect")
					.classed("indirectHighlighting", enable);
			});
		}

		/**
		 * Combines the sub- and superproperties into a single array, because
		 * they're often used equivalently.
		 * @returns {Array}
		 */
		function getSubAndSuperProperties() {
			var properties = [];

			if (that.subproperties()) {
				properties = properties.concat(that.subproperties());
			}
			if (that.superproperties()) {
				properties = properties.concat(that.superproperties());
			}

			return properties;
		}

		/**
		 * Foregrounds the property, its inverse and the link.
		 */
		this.foreground = function () {
			var selectedLabelGroup = that.labelElement().node().parentNode,
				labelContainer = selectedLabelGroup.parentNode,
				selectedLinkGroup = that.linkGroup().node(),
				linkContainer = that.linkGroup().node().parentNode;

			// Append hovered element as last child to the container list.
			labelContainer.appendChild(selectedLabelGroup);
			linkContainer.appendChild(selectedLinkGroup);
		};

		/**
		 * Foregrounds the sub- and superproperties of this property.
		 * This is separated from the foreground-function to prevent endless loops.
		 */
		function foregroundSubAndSuperProperties() {
			var subAndSuperProperties = getSubAndSuperProperties();

			subAndSuperProperties.forEach(function (property) {
				property.foreground();
			});
		}

		function onMouseOut() {
			that.mouseEntered(false);

			setHighlighting(false);
		}

	};

	base.prototype = Object.create(webvowl.elements.BaseElement.prototype);
	base.prototype.constructor = base;

	base.prototype.labelHeight = function () {
		return labelHeight;
	};

	base.prototype.labelWidth = function () {
		return labelWidth;
	};

	base.prototype.textWidth = base.prototype.labelWidth;


	return base;
}());

// Source: src/js/graph/elements/labels/implementations/owlDatatypeProperty.js
webvowl.labels.owldatatypeproperty = (function () {

	var o = function (graph) {
		webvowl.labels.BaseLabel.apply(this, arguments);

		this.attributes(["datatype"])
			.styleClass("datatypeproperty")
			.type("owl:DatatypeProperty");
	};
	o.prototype = Object.create(webvowl.labels.BaseLabel.prototype);
	o.prototype.constructor = o;

	return o;
}());
// Source: src/js/graph/elements/labels/implementations/owlDeprecatedProperty.js
webvowl.labels.owldeprecatedproperty = (function () {

	var o = function (graph) {
		webvowl.labels.BaseLabel.apply(this, arguments);

		this.attributes(["deprecated"])
			.styleClass("deprecatedproperty")
			.type("owl:DeprecatedProperty");
	};
	o.prototype = Object.create(webvowl.labels.BaseLabel.prototype);
	o.prototype.constructor = o;

	return o;
}());
// Source: src/js/graph/elements/labels/implementations/owlDisjointWith.js
webvowl.labels.owldisjointwith = (function () {

	var o = function (graph) {
		webvowl.labels.BaseLabel.apply(this, arguments);

		var label = "Disjoint With";
		// Disallow overwriting the label
		this.label = function (p) {
			if (!arguments.length) return label;
			return this;
		};

		this.markerType("special")
			.linkType("special")
			.styleClass("disjointwith")
			.type("owl:disjointWith");
	};
	o.prototype = Object.create(webvowl.labels.BaseLabel.prototype);
	o.prototype.constructor = o;

	return o;
}());
// Source: src/js/graph/elements/labels/implementations/owlEquivalentProperty.js
webvowl.labels.owlequivalentproperty = (function () {

	var o = function (graph) {
		webvowl.labels.BaseLabel.apply(this, arguments);

		this.styleClass("equivalentproperty")
			.type("owl:equivalentProperty");
	};
	o.prototype = Object.create(webvowl.labels.BaseLabel.prototype);
	o.prototype.constructor = o;

	return o;
}());
// Source: src/js/graph/elements/labels/implementations/owlFunctionalProperty.js
webvowl.labels.owlfunctionalproperty = (function () {

	var o = function (graph) {
		webvowl.labels.BaseLabel.apply(this, arguments);

		this.attributes(["functional"])
			.styleClass("functionalproperty")
			.type("owl:FunctionalProperty");
	};
	o.prototype = Object.create(webvowl.labels.BaseLabel.prototype);
	o.prototype.constructor = o;

	return o;
}());
// Source: src/js/graph/elements/labels/implementations/owlInverseFunctionalProperty.js
webvowl.labels.owlinversefunctionalproperty = (function () {

	var o = function (graph) {
		webvowl.labels.BaseLabel.apply(this, arguments);

		this.attributes(["inverse functional"])
			.styleClass("inversefunctionalproperty")
			.type("owl:InverseFunctionalProperty");
	};
	o.prototype = Object.create(webvowl.labels.BaseLabel.prototype);
	o.prototype.constructor = o;

	return o;
}());
// Source: src/js/graph/elements/labels/implementations/owlObjectProperty.js
webvowl.labels.owlobjectproperty = (function () {

	var o = function (graph) {
		webvowl.labels.BaseLabel.apply(this, arguments);

		this.attributes(["object"])
			.styleClass("objectproperty")
			.type("owl:ObjectProperty");
	};
	o.prototype = Object.create(webvowl.labels.BaseLabel.prototype);
	o.prototype.constructor = o;

	return o;
}());



// Source: src/js/graph/elements/labels/implementations/owlSymmetricProperty.js
webvowl.labels.owlsymmetricproperty = (function () {

	var o = function (graph) {
		webvowl.labels.BaseLabel.apply(this, arguments);

		this.attributes(["symmetric"])
			.styleClass("symmetricproperty")
			.type("owl:SymmetricProperty");
	};
	o.prototype = Object.create(webvowl.labels.BaseLabel.prototype);
	o.prototype.constructor = o;

	return o;
}());
// Source: src/js/graph/elements/labels/implementations/owlTransitiveProperty.js
webvowl.labels.owltransitiveproperty = (function () {

	var o = function (graph) {
		webvowl.labels.BaseLabel.apply(this, arguments);

		this.attributes(["transitive"])
			.styleClass("transitiveproperty")
			.type("owl:TransitiveProperty");
	};
	o.prototype = Object.create(webvowl.labels.BaseLabel.prototype);
	o.prototype.constructor = o;

	return o;
}());
// Source: src/js/graph/elements/labels/implementations/rdfProperty.js
webvowl.labels.rdfproperty = (function () {

	var o = function (graph) {
		webvowl.labels.BaseLabel.apply(this, arguments);

		this.attributes(["rdf"])
			.styleClass("rdfproperty")
			.type("rdf:Property");
	};
	o.prototype = Object.create(webvowl.labels.BaseLabel.prototype);
	o.prototype.constructor = o;

	return o;
}());
// Source: src/js/graph/elements/labels/implementations/rdfsSubClassOf.js
webvowl.labels.rdfssubclassof = (function () {

	var o = function (graph) {
		webvowl.labels.BaseLabel.apply(this, arguments);

		var that = this,
			superDrawFunction = that.drawProperty,
			label = "Subclass of";

		this.drawProperty = function(labelGroup) {
			that.labelVisible(!graph.options().compactNotation());
			return superDrawFunction(labelGroup);
		};

		// Disallow overwriting the label
		this.label = function (p) {
			if (!arguments.length) return label;
			return this;
		};

		this.linkType("dotted")
			.markerType("dotted")
			.styleClass("subclass")
			.type("rdfs:subClassOf");
	};
	o.prototype = Object.create(webvowl.labels.BaseLabel.prototype);
	o.prototype.constructor = o;

	return o;
}());

// Source: src/js/graph/elements/labels/implementations/setOperatorProperty.js
webvowl.labels.setoperatorproperty = (function () {

	var o = function (graph) {
		webvowl.labels.BaseLabel.apply(this, arguments);

		this.markerType("special")
			.labelVisible(false)
			.linkType("special")
			.styleClass("setoperatorproperty")
			.type("setOperatorProperty");
	};
	o.prototype = Object.create(webvowl.labels.BaseLabel.prototype);
	o.prototype.constructor = o;

	return o;
}());
// Source: src/js/graph/elements/link.js
webvowl.elements.link = function () {
	var l = {},
		curvePoint,
		domain,
		inverse,
		layers,
		layerCount,
		layerIndex,
		loops,
		loopCount,
		loopIndex,
		property,
		range;


	l.curvePoint = function (p) {
		if (!arguments.length) return curvePoint;
		curvePoint = p;
		return l;
	};

	l.domain = function (p) {
		if (!arguments.length) return domain;
		domain = p;
		this.source = p;
		return l;
	};

	l.inverse = function (p) {
		if (!arguments.length) return inverse;
		inverse = p;
		return l;
	};

	l.layers = function (p) {
		if (!arguments.length) return layers;
		layers = p;
		return l;
	};

	l.layerCount = function (p) {
		if (!arguments.length) return layerCount;
		layerCount = p;
		return l;
	};

	l.layerIndex = function (p) {
		if (!arguments.length) return layerIndex;
		layerIndex = p;
		return l;
	};

	l.loops = function (p) {
		if (!arguments.length) return loops;
		loops = p;
		return l;
	};

	l.loopCount = function (p) {
		if (!arguments.length) return loopCount;
		loopCount = p;
		return l;
	};

	l.loopIndex = function (p) {
		if (!arguments.length) return loopIndex;
		loopIndex = p;
		return l;
	};

	l.property = function (p) {
		if (!arguments.length) return property;
		property = p;
		return l;
	};

	l.range = function (p) {
		if (!arguments.length) return range;
		range = p;
		this.target = p;
		return l;
	};

	// Define d3 properties
	Object.defineProperties(l, {
		"source": {writable: true},
		"target": {writable: true}
	});


	l.drawLink = function (linkGroup, markerContainer) {
		property.linkGroup(linkGroup);
		if (inverse) {
			inverse.linkGroup(linkGroup);
		}

		// Marker for this property
		property.markerElement(markerContainer.append("marker")
			.datum(property)
			.attr("id", property.markerId())
			.attr("viewBox", "0 -8 14 16")
			.attr("refX", 12)
			.attr("refY", 0)
			.attr("markerWidth", 12)  // ArrowSize
			.attr("markerHeight", 12)
			.attr("markerUnits", "userSpaceOnUse")
			.attr("orient", "auto")  // Orientation of Arrow
			.attr("class", property.markerType() + "Marker"));
		property.markerElement()
			.append("path")
			.attr("d", "M0,-8L12,0L0,8Z");

		// Marker for the inverse property
		if (inverse) {
			inverse.markerElement(markerContainer.append("marker")
				.datum(inverse)
				.attr("id", inverse.markerId())
				.attr("viewBox", "0 -8 14 16")
				.attr("refX", 0)
				.attr("refY", 0)
				.attr("markerWidth", 12)  // ArrowSize
				.attr("markerHeight", 12)
				.attr("markerUnits", "userSpaceOnUse")
				.attr("orient", "auto")  // Orientation of Arrow
				.attr("class", inverse.markerType() + "Marker"));
			inverse.markerElement().append("path")
				.attr("d", "M12,-8L0,0L12,8Z");
		}

		// Draw the link
		linkGroup.append("path")
			.classed("link-path", true)
			.classed(domain.cssClassOfNode(), true)
			.classed(range.cssClassOfNode(), true)
			.classed(property.linkType(), true)
			.attr("marker-end", function (l) {
				if (!l.property().isSpecialLink()) {
					return "url(#" + l.property().markerId() + ")";
				}
				return "";
			})
			.attr("marker-start", function (l) {
				if (l.inverse() && !l.inverse().isSpecialLink()) {
					return "url(#" + l.inverse().markerId() + ")";
				}
				return "";
			});
	};

	return l;
};
// Source: src/js/graph/elements/nodes/BaseNode.js
webvowl.nodes.BaseNode = (function () {

	var base = function (graph) {
		webvowl.elements.BaseElement.apply(this, arguments);

		var that = this,
		// Basic attributes
			complement,
			disjointWith,
			individuals = [],
			intersection,
			links,
			union,
		// Additional attributes
			maxIndividualCount,
		// Fixed Location attributes
			locked = false,
			frozen = false,
			pinned = false,
		// Element containers
			nodeElement;


		// Properties
		this.complement = function (p) {
			if (!arguments.length) return complement;
			complement = p;
			return this;
		};

		this.disjointWith = function (p) {
			if (!arguments.length) return disjointWith;
			disjointWith = p;
			return this;
		};

		this.individuals = function (p) {
			if (!arguments.length) return individuals;
			individuals = p || [];
			return this;
		};

		this.intersection = function (p) {
			if (!arguments.length) return intersection;
			intersection = p;
			return this;
		};

		this.links = function (p) {
			if (!arguments.length) return links;
			links = p;
			return this;
		};

		this.maxIndividualCount = function (p) {
			if (!arguments.length) return maxIndividualCount;
			maxIndividualCount = p;
			return this;
		};

		this.nodeElement = function (p) {
			if (!arguments.length) return nodeElement;
			nodeElement = p;
			return this;
		};

		this.union = function (p) {
			if (!arguments.length) return union;
			union = p;
			return this;
		};


		// Functions
		this.locked = function (p) {
			if (!arguments.length) return locked;
			locked = p;
			applyFixedLocationAttributes();
			return this;
		};

		this.frozen = function (p) {
			if (!arguments.length) return frozen;
			frozen = p;
			applyFixedLocationAttributes();
			return this;
		};

		this.pinned = function (p) {
			if (!arguments.length) return pinned;
			pinned = p;
			applyFixedLocationAttributes();
			return this;
		};

		function applyFixedLocationAttributes() {
			if (that.locked() || that.frozen() || that.pinned()) {
				that.fixed = true;
			} else {
				that.fixed = false;
			}
		}

		/**
		 * Returns css classes generated from the data of this object.
		 * @returns {Array}
		 */
		that.collectCssClasses = function () {
			var cssClasses = [];

			if (typeof that.styleClass() === "string") {
				cssClasses.push(that.styleClass());
			}

			if (typeof that.visualAttribute() === "string") {
				cssClasses.push(that.visualAttribute());
			}

			return cssClasses;
		};


		// Reused functions TODO refactor
		this.addMouseListeners = function () {
			// Empty node
			if (!that.nodeElement()) {
				console.warn(this);
				return;
			}

			that.nodeElement().selectAll("*")
				.on("mouseover", onMouseOver)
				.on("mouseout", onMouseOut);
		};

		function onMouseOver() {
			if (that.mouseEntered()) {
				return;
			}

			var selectedNode = that.nodeElement().node(),
				nodeContainer = selectedNode.parentNode;

			// Append hovered element as last child to the container list.
			nodeContainer.appendChild(selectedNode);

			that.setHoverHighlighting(true);

			that.mouseEntered(true);
		}

		function onMouseOut() {
			that.setHoverHighlighting(false);

			that.mouseEntered(false);
		}

		/**
		 * Generates a distinct css class for a node id.
		 * @returns {string}
		 */
		this.cssClassOfNode = function () {
			return "node" + that.id();
		};

	};

	base.prototype = Object.create(webvowl.elements.BaseElement.prototype);
	base.prototype.constructor = base;

	// Define d3 properties
	Object.defineProperties(base, {
		"index": {writable: true},
		"x": {writable: true},
		"y": {writable: true},
		"px": {writable: true},
		"py": {writable: true},
		"fixed": {writable: true},
		"weight": {writable: true}
	});


	return base;
}());

// Source: src/js/graph/elements/nodes/RectangularNode.js
webvowl.nodes.RectangularNode = (function () {

	var o = function (graph) {
		webvowl.nodes.BaseNode.apply(this, arguments);

		var that = this,
			height = 20,
			width = 60;


		// Properties
		this.height = function (p) {
			if (!arguments.length) return height;
			height = p;
			return this;
		};

		this.width = function (p) {
			if (!arguments.length) return width;
			width = p;
			return this;
		};


		// Functions
		// for compatibility reasons // TODO resolve
		this.actualRadius = function () {
			return width;
		};

		this.setHoverHighlighting = function (enable) {
			that.nodeElement().selectAll("rect").classed("hovered", enable);
		};

		this.textWidth = function () {
			return this.width();
		};

		this.toggleFocus = function () {
			that.focused(!that.focused());
			that.nodeElement().select("rect").classed("focused", that.focused());
		};

		/**
		 * Draws the rectangular node.
		 * @param parentElement the element to which this node will be appended
		 * @param [additionalCssClasses] additional css classes
		 */
		this.drawNode = function (parentElement, additionalCssClasses) {
			var drawTools = webvowl.nodes.drawTools(),
				textBlock,
				cssClasses = that.collectCssClasses();

			that.nodeElement(parentElement);

			if (additionalCssClasses instanceof Array) {
				cssClasses = cssClasses.concat(additionalCssClasses);
			}
			drawTools.appendRectangularClass(parentElement, that.width(), that.height(), cssClasses, that.labelForCurrentLanguage());

			textBlock = webvowl.util.textElement(parentElement);
			textBlock.addText(that.labelForCurrentLanguage());

			that.addMouseListeners();
		};
	};
	o.prototype = Object.create(webvowl.nodes.BaseNode.prototype);
	o.prototype.constructor = o;

	return o;
}());

// Source: src/js/graph/elements/nodes/RoundNode.js
webvowl.nodes.RoundNode = (function () {

	var o = function (graph) {
		webvowl.nodes.BaseNode.apply(this, arguments);

		var that = this,
			collapsible = false,
			radius = 50,
			collapsingGroupElement,
			pinGroupElement,
			textBlock;


		// Properties
		this.collapsible = function (p) {
			if (!arguments.length) return collapsible;
			collapsible = p;
			return this;
		};

		this.textBlock = function (p) {
			if (!arguments.length) return textBlock;
			textBlock = p;
			return this;
		};

		/**
		 * This might not be equal to the actual radius, because the instance count is used for its calculation.
		 * @param p
		 * @returns {*}
		 */
		this.radius = function (p) {
			if (!arguments.length) return radius;
			radius = p;
			return this;
		};


		// Functions
		this.setHoverHighlighting = function (enable) {
			that.nodeElement().selectAll("circle").classed("hovered", enable);
		};

		this.textWidth = function () {
			return this.actualRadius() * 2;
		};

		this.toggleFocus = function () {
			that.focused(!that.focused());
			that.nodeElement().select("circle").classed("focused", that.focused());
		};

		this.actualRadius = function () {
			if (!graph.options().scaleNodesByIndividuals() || that.individuals().length <= 0) {
				return that.radius();
			} else {
				// we could "listen" for radius and maxIndividualCount changes, but this is easier
				var MULTIPLIER = 8,
					additionalRadius = Math.log(that.individuals().length + 1) * MULTIPLIER + 5;

				return that.radius() + additionalRadius;
			}
		};

		/**
		 * Draws the pin on a round node on a position depending on its radius.
		 */
		this.drawPin = function () {
			that.pinned(true);

			pinGroupElement = that.nodeElement()
				.append("g")
				.classed("hidden-in-export", true)
				.attr("transform", function () {
					var dx = (2 / 5) * that.actualRadius(),
						dy = (-7 / 10) * that.actualRadius();
					return "translate(" + dx + "," + dy + ")";
				});

			pinGroupElement.append("circle")
				.classed("class pin feature", true)
				.attr("r", 12)
				.on("click", function () {
					that.removePin();
					d3.event.stopPropagation();
				});

			pinGroupElement.append("line")
				.attr("x1", 0)
				.attr("x2", 0)
				.attr("y1", 12)
				.attr("y2", 16);
		};

		/**
		 * Removes the pin and refreshs the graph to update the force layout.
		 */
		this.removePin = function () {
			that.pinned(false);
			if (pinGroupElement) {
				pinGroupElement.remove();
			}
			graph.updateStyle();
		};

		this.drawCollapsingButton = function () {

			collapsingGroupElement = that.nodeElement()
				.append("g")
				.classed("hidden-in-export", true)
				.attr("transform", function () {
					var dx = (-2 / 5) * that.actualRadius(),
						dy = (1 / 2) * that.actualRadius();
					return "translate(" + dx + "," + dy + ")";
				});

			collapsingGroupElement.append("rect")
				.classed("class pin feature", true)
				.attr("x", 0)
				.attr("y", 0)
				.attr("width", 40)
				.attr("height", 24);

			collapsingGroupElement.append("line")
				.attr("x1", 13)
				.attr("y1", 12)
				.attr("x2", 27)
				.attr("y2", 12);

			collapsingGroupElement.append("line")
				.attr("x1", 20)
				.attr("y1", 6)
				.attr("x2", 20)
				.attr("y2", 18);
		};

		/**
		 * Draws a circular node.
		 * @param parentElement the element to which this node will be appended
		 * @param [additionalCssClasses] additional css classes
		 */
		this.drawNode = function (parentElement, additionalCssClasses) {
			var drawTools = webvowl.nodes.drawTools(),
				cssClasses = that.collectCssClasses();

			that.nodeElement(parentElement);

			if (additionalCssClasses instanceof Array) {
				cssClasses = cssClasses.concat(additionalCssClasses);
			}
			drawTools.appendCircularClass(parentElement, that.actualRadius(), cssClasses, that.labelForCurrentLanguage());

			that.postDrawActions(parentElement);
		};

		/**
		 * Common actions that should be invoked after drawing a node.
		 */
		this.postDrawActions = function () {
			var textBlock = webvowl.util.textElement(that.nodeElement());
			textBlock.addText(that.labelForCurrentLanguage());
			if (!graph.options().compactNotation()) {
				textBlock.addSubText(that.indicationString());
			}
			textBlock.addInstanceCount(that.individuals().length);
			that.textBlock(textBlock);

			that.addMouseListeners();
			if (that.pinned()) {
				that.drawPin();
			}
			if (that.collapsible()) {
				that.drawCollapsingButton();
			}
		};
	};
	o.prototype = Object.create(webvowl.nodes.BaseNode.prototype);
	o.prototype.constructor = o;

	return o;
}());

// Source: src/js/graph/elements/nodes/SetOperatorNode.js
webvowl.nodes.SetOperatorNode = (function () {

	var radius = 40;

	var o = function (graph) {
		webvowl.nodes.RoundNode.apply(this, arguments);

		var that = this,
			superHoverHighlightingFunction = this.setHoverHighlighting,
			superPostDrawActions = this.postDrawActions;

		this.radius(radius);

		this.setHoverHighlighting = function (enable) {
			superHoverHighlightingFunction(enable);

			d3.selectAll(".special." + that.cssClassOfNode()).classed("hovered", enable);
		};

		this.postDrawActions = function () {
			superPostDrawActions();

			that.textBlock().clear();
			that.textBlock().addInstanceCount(that.individuals().length);
			that.textBlock().setTranslation(0, that.radius() - 15);
		};
	};
	o.prototype = Object.create(webvowl.nodes.RoundNode.prototype);
	o.prototype.constructor = o;

	return o;
}());

// Source: src/js/graph/elements/nodes/drawTools.js
/**
 * Contains reusable function for drawing nodes.
 */
webvowl.nodes.drawTools = (function () {

	var tools = {};

	/**
	 * Append a circular class node with the passed attributes.
	 * @param parent the parent element to which the circle will be appended
	 * @param radius
	 * @param cssClasses an array of additional css classes
	 * @param [tooltip]
	 * @returns {*}
	 */
	tools.appendCircularClass = function (parent, radius, cssClasses, tooltip) {
		var circle = parent.append("circle")
			.classed("class", true)
			.attr("r", radius);

		addCssClasses(circle, cssClasses);
		addToolTip(circle, tooltip);

		return circle;
	};

	function addCssClasses(element, cssClasses) {
		if (cssClasses instanceof Array) {
			cssClasses.forEach(function (cssClass) {
				element.classed(cssClass, true);
			});
		}
	}

	function addToolTip(element, tooltip) {
		if (tooltip) {
			element.append("title").text(tooltip);
		}
	}

	/**
	 * Appends a rectangular class node with the passed attributes.
	 * @param parent the parent element to which the rectangle will be appended
	 * @param width
	 * @param height
	 * @param cssClasses an array of additional css classes
	 * @param [tooltip]
	 * @returns {*}
	 */
	tools.appendRectangularClass = function (parent, width, height, cssClasses, tooltip) {
		var rectangle = parent.append("rect")
			.classed("class", true)
			.attr("x", -width / 2)
			.attr("y", -height / 2)
			.attr("width", width)
			.attr("height", height);

		addCssClasses(rectangle, cssClasses);
		addToolTip(rectangle, tooltip);

		return rectangle;
	};


	return function () {
		// Encapsulate into function to maintain default.module.path()
		return tools;
	};
})();

// Source: src/js/graph/elements/nodes/implementions/ExternalClass.js
webvowl.nodes.externalclass = (function () {

	var o = function (graph) {
		webvowl.nodes.RoundNode.apply(this, arguments);

		this.attributes(["external"])
			.type("ExternalClass");
	};
	o.prototype = Object.create(webvowl.nodes.RoundNode.prototype);
	o.prototype.constructor = o;

	return o;
}());
// Source: src/js/graph/elements/nodes/implementions/owlClass.js
webvowl.nodes.owlclass = (function () {

	var o = function (graph) {
		webvowl.nodes.RoundNode.apply(this, arguments);

		this.type("owl:Class");
	};
	o.prototype = Object.create(webvowl.nodes.RoundNode.prototype);
	o.prototype.constructor = o;

	return o;
}());
// Source: src/js/graph/elements/nodes/implementions/owlDeprecatedClass.js
webvowl.nodes.owldeprecatedclass = (function () {

	var o = function (graph) {
		webvowl.nodes.RoundNode.apply(this, arguments);

		this.attributes(["deprecated"])
			.type("owl:DeprecatedClass");
	};
	o.prototype = Object.create(webvowl.nodes.RoundNode.prototype);
	o.prototype.constructor = o;

	return o;
}());
// Source: src/js/graph/elements/nodes/implementions/owlThing.js
webvowl.nodes.owlthing = (function () {

	var o = function (graph) {
		webvowl.nodes.RoundNode.apply(this, arguments);

		var superDrawFunction = this.drawNode;

		this.label("Thing")
			.radius(30)
			.styleClass("thing")
			.type("owl:Thing")
			.iri("http://www.w3.org/2002/07/owl#Thing");

		this.drawNode = function (element) {
			superDrawFunction(element, ["white", "special"]);
		};
	};
	o.prototype = Object.create(webvowl.nodes.RoundNode.prototype);
	o.prototype.constructor = o;

	return o;
}());

// Source: src/js/graph/elements/nodes/implementions/owlcomplementOf.js
webvowl.nodes.owlcomplementof = (function () {

	var o = function (graph) {
		webvowl.nodes.SetOperatorNode.apply(this, arguments);

		var that = this;

		this.styleClass("intersectionof")
			.type("owl:intersectionOf");

		this.drawNode = function (element) {
			that.nodeElement(element);

			element.append("circle")
				.attr("class", that.type())
				.classed("class", true)
				.classed("special", true)
				.attr("r", that.actualRadius());

			var symbol = element.append("g").classed("embedded", true);

			symbol.append("circle")
				.attr("class", "symbol")
				.classed("fineline", true)
				.attr("r", (that.radius() - 15));
			symbol.append("path")
				.attr("class", "nofill")
				.attr("d", "m -7,-1.5 12,0 0,6");

			symbol.attr("transform", "translate(-" + (that.radius() - 15) / 100 + ",-" + (that.radius() - 15) / 100 + ")");

			that.postDrawActions();
		};
	};
	o.prototype = Object.create(webvowl.nodes.SetOperatorNode.prototype);
	o.prototype.constructor = o;

	return o;
}());

// Source: src/js/graph/elements/nodes/implementions/owlequivalentClass.js
webvowl.nodes.owlequivalentclass = (function () {

	var o = function (graph) {
		webvowl.nodes.RoundNode.apply(this, arguments);

		var CIRCLE_SIZE_DIFFERENCE = 4;

		var that = this,
			superActualRadiusFunction = that.actualRadius;

		this.styleClass("equivalentclass")
			.type("owl:equivalentClass");

		this.actualRadius = function () {
			return superActualRadiusFunction() - CIRCLE_SIZE_DIFFERENCE;
		};


		this.drawNode = function (parentElement) {
			var drawTools = webvowl.nodes.drawTools(),
				cssClasses = that.collectCssClasses();

			that.nodeElement(parentElement);

			drawTools.appendCircularClass(parentElement, that.actualRadius() + CIRCLE_SIZE_DIFFERENCE, ["white", "embedded"]);
			drawTools.appendCircularClass(parentElement, that.actualRadius(), cssClasses, that.labelForCurrentLanguage());

			that.postDrawActions();
			appendEquivalentClasses(that.textBlock(), that.equivalents());
		};

		function appendEquivalentClasses(textBlock, equivalentClasses) {
			if (typeof equivalentClasses === "undefined") {
				return;
			}

			var equivalentNames,
				equivalentNamesString;

			equivalentNames = equivalentClasses.map(function (node) {
				return node.labelForCurrentLanguage();
			});
			equivalentNamesString = equivalentNames.join(", ");

			textBlock.addEquivalents(equivalentNamesString);
		}

		/**
		 * Sets the hover highlighting of this node.
		 * @param enable
		 */
		that.setHoverHighlighting = function (enable) {
			that.nodeElement().selectAll("circle:last-of-type").classed("hovered", enable);
		};
	};
	o.prototype = Object.create(webvowl.nodes.RoundNode.prototype);
	o.prototype.constructor = o;

	return o;
}());

// Source: src/js/graph/elements/nodes/implementions/owlintersectionOf.js
webvowl.nodes.owlintersectionof = (function () {

	var o = function (graph) {
		webvowl.nodes.SetOperatorNode.apply(this, arguments);

		var that = this;

		this.styleClass("intersectionof")
			.type("owl:intersectionOf");

		this.drawNode = function (element) {
			that.nodeElement(element);

			element.append("circle")
				.attr("class", that.type())
				.classed("class", true)
				.classed("special", true)
				.attr("r", that.actualRadius());

			var symbol = element.append("g").classed("embedded", true);

			symbol.append("path")
				.attr("class", "nostroke")
				.classed("symbol", true).attr("d", "m 24.777,0.771 c0,16.387-13.607,23.435-19.191,23.832S-15.467," +
					"14.526-15.467,0.424S-1.216-24.4,5.437-24.4 C12.09-24.4,24.777-15.616,24.777,0.771z");
			symbol.append("circle")
				.attr("class", "nofill")
				.classed("fineline", true)
				.attr("r", (that.radius() - 15));
			symbol.append("circle")
				.attr("cx", 10)
				.attr("class", "nofill")
				.classed("fineline", true)
				.attr("r", (that.radius() - 15));
			symbol.append("path")
				.attr("class", "nofill")
				.attr("d", "m 9,5 c 0,-2 0,-4 0,-6 0,0 0,0 0,0 0,0 0,-1.8 -1,-2.3 -0.7,-0.6 -1.7,-0.8 -2.9," +
					"-0.8 -1.2,0 -2,0 -3,0.8 -0.7,0.5 -1,1.4 -1,2.3 0,2 0,4 0,6");

			symbol.attr("transform", "translate(-" +  (that.radius() - 15) / 5 + ",-" + (that.radius() - 15) / 100 + ")");

			that.postDrawActions();
		};
	};
	o.prototype = Object.create(webvowl.nodes.SetOperatorNode.prototype);
	o.prototype.constructor = o;

	return o;
}());

// Source: src/js/graph/elements/nodes/implementions/owlunionOf.js
webvowl.nodes.owlunionof = (function () {

	var o = function (graph) {
		webvowl.nodes.SetOperatorNode.apply(this, arguments);

		var that = this;

		this.styleClass("unionof")
			.type("owl:unionOf");

		this.drawNode = function (element) {
			that.nodeElement(element);

			element.append("circle")
				.attr("class", that.type())
				.classed("class", true)
				.classed("special", true)
				.attr("r", that.actualRadius());

			var symbol = element.append("g").classed("embedded", true);

			symbol.append("circle")
				.attr("class", "symbol")
				.attr("r", (that.radius() - 15));
			symbol.append("circle")
				.attr("cx", 10)
				.attr("class", "symbol")
				.classed("fineline", true)
				.attr("r", (that.radius() - 15));
			symbol.append("circle")
				.attr("class", "nofill")
				.classed("fineline", true)
				.attr("r", (that.radius() - 15));
			symbol.append("path")
				.attr("class", "link")
				.attr("d", "m 1,-3 c 0,2 0,4 0,6 0,0 0,0 0,0 0,2 2,3 4,3 2,0 4,-1 4,-3 0,-2 0,-4 0,-6");

			symbol.attr("transform", "translate(-" + (that.radius() - 15) / 5 + ",-" + (that.radius() - 15) / 100 + ")");

			that.postDrawActions();
		};
	};
	o.prototype = Object.create(webvowl.nodes.SetOperatorNode.prototype);
	o.prototype.constructor = o;

	return o;
}());

// Source: src/js/graph/elements/nodes/implementions/rdfsClass.js
webvowl.nodes.rdfsclass = (function () {

	var o = function (graph) {
		webvowl.nodes.RoundNode.apply(this, arguments);

		this.attributes(["rdf"])
			.type("rdfs:Class");
	};
	o.prototype = Object.create(webvowl.nodes.RoundNode.prototype);
	o.prototype.constructor = o;

	return o;
}());
// Source: src/js/graph/elements/nodes/implementions/rdfsDatatype.js
webvowl.nodes.rdfsdatatype = (function () {

	var o = function (graph) {
		webvowl.nodes.RectangularNode.apply(this, arguments);

		this.attributes(["datatype"])
			.type("rdfs:Datatype");
	};
	o.prototype = Object.create(webvowl.nodes.RectangularNode.prototype);
	o.prototype.constructor = o;

	return o;
}());
// Source: src/js/graph/elements/nodes/implementions/rdfsLiteral.js
webvowl.nodes.rdfsliteral = (function () {

	var o = function (graph) {
		webvowl.nodes.RectangularNode.apply(this, arguments);

		var superDrawFunction = this.drawNode,
			superLabelFunction = this.label;

		this.attributes(["datatype"])
			.label("Literal")
			.styleClass("literal")
			.type("rdfs:Literal")
			.iri("http://www.w3.org/2000/01/rdf-schema#Literal");

		this.drawNode = function (element) {
			superDrawFunction(element, ["special"]);
		};

		this.label = function (p) {
			if (!arguments.length) return superLabelFunction();
			return this;
		};
	};
	o.prototype = Object.create(webvowl.nodes.RectangularNode.prototype);
	o.prototype.constructor = o;

	return o;
}());

// Source: src/js/graph/elements/nodes/implementions/rdfsResource.js
webvowl.nodes.rdfsresource = (function () {

	var o = function (graph) {
		webvowl.nodes.RoundNode.apply(this, arguments);

		var superDrawFunction = this.drawNode;

		this.attributes(["rdf"])
			.label("Resource")
			.radius(30)
			.styleClass("rdfsresource")
			.type("rdfs:Resource");

		this.drawNode = function (element) {
			superDrawFunction(element, ["rdf", "special"]);
		};
	};
	o.prototype = Object.create(webvowl.nodes.RoundNode.prototype);
	o.prototype.constructor = o;

	return o;
}());
// Source: src/js/graph/graph.js
"use strict";

webvowl.graph = function (graphContainerSelector) {
	var graph = {},
		CARDINALITY_HDISTANCE = 20,
		CARDINALITY_VDISTANCE = 10,
		curveFunction = d3.svg.line()
			.x(function (d) {
				return d.x;
			})
			.y(function (d) {
				return d.y;
			})
			.interpolate("cardinal"),
		options = webvowl.options(),
		parser = webvowl.parser(graph),
		linkCreator = webvowl.parsing.linkCreator(),
		language = "default",
	// Container for visual elements
		graphContainer,
		nodeContainer,
		labelContainer,
		cardinalityContainer,
		linkContainer,
	// Visual elements
		nodeElements,
		labelGroupElements,
		linkGroups,
		linkPathElements,
		cardinalityElements,
	// Internal data
		nodes,
		properties,
		unfilteredNodes,
		unfilteredProperties,
		links,
	// Graph behaviour
		force,
		dragBehaviour,
		zoom;

	/**
	 * Recalculates the positions of nodes, links, ... and updates them.
	 */
	function recalculatePositions() {
		// Set node positions
		nodeElements.attr("transform", function (node) {
			return "translate(" + node.x + "," + node.y + ")";
		});

		// Set link paths and calculate additional informations
		linkPathElements.attr("d", function (l) {
			if (l.domain() === l.range()) {
				return webvowl.util.math().calculateLoopPath(l);
			}

			// Calculate these every time to get nicer curved paths
			var pathStart = webvowl.util.math().calculateIntersection(l.range(), l.domain(), 1),
				pathEnd = webvowl.util.math().calculateIntersection(l.domain(), l.range(), 1),
				linkDistance = getVisibleLinkDistance(l),
				curvePoint = webvowl.util.math().calculateCurvePoint(pathStart, pathEnd, l,
					linkDistance / options.defaultLinkDistance());

			l.curvePoint(curvePoint);

			return curveFunction([webvowl.util.math().calculateIntersection(l.curvePoint(), l.domain(), 1),
				curvePoint, webvowl.util.math().calculateIntersection(l.curvePoint(), l.range(), 1)]);
		});

		// Set label group positions
		labelGroupElements.attr("transform", function (link) {
			var posX = link.curvePoint().x,
				posY = link.curvePoint().y;

			return "translate(" + posX + "," + posY + ")";
		});


		// Set cardinality positions
		cardinalityElements.attr("transform", function (p) {
			var curve = p.link().curvePoint(),
				pos = webvowl.util.math().calculateIntersection(curve, p.range(), CARDINALITY_HDISTANCE),
				normalV = webvowl.util.math().calculateNormalVector(curve, p.domain(), CARDINALITY_VDISTANCE);

			return "translate(" + (pos.x + normalV.x) + "," + (pos.y + normalV.y) + ")";
		});
	}

	/**
	 * Adjusts the containers current scale and position.
	 */
	function zoomed() {
		graphContainer.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	}

	/**
	 * Initializes the graph.
	 */
	function initializeGraph() {
		options.graphContainerSelector(graphContainerSelector);

		force = d3.layout.force()
			.on("tick", recalculatePositions);

		dragBehaviour = d3.behavior.drag()
			.origin(function (d) {
				return d;
			})
			.on("dragstart", function (d) {
				d3.event.sourceEvent.stopPropagation(); // Prevent panning
				d.locked(true);
			})
			.on("drag", function (d) {
				d.px = d3.event.x;
				d.py = d3.event.y;
				force.resume();
			})
			.on("dragend", function (d) {
				d.locked(false);
			});

		// Apply the zooming factor.
		zoom = d3.behavior.zoom()
			.duration(150)
			.scaleExtent([options.minMagnification(), options.maxMagnification()])
			.on("zoom", zoomed);

	}

	initializeGraph();

	/**
	 * Returns the graph options of this graph (readonly).
	 * @returns {webvowl.options} a graph options object
	 */
	graph.graphOptions = function () {
		return options;
	};

	/**
	 * Loads all settings, removes the old graph (if it exists) and draws a new one.
	 */
	graph.start = function () {
		force.stop();
		loadGraphData();
		redrawGraph();
		graph.update();
	};

	/**
	 * Updates only the style of the graph.
	 */
	graph.updateStyle = function () {
		refreshGraphStyle();
		force.start();
	};

	graph.reload = function () {
		loadGraphData();
		this.update();
	};

	/**
	 * Updates the graphs displayed data and style.
	 */
	graph.update = function () {
		refreshGraphData();
		refreshGraphStyle();
		force.start();
		redrawContent();
	};

	/**
	 * Stops the influence of the force directed layout on all nodes. They are still manually movable.
	 */
	graph.freeze = function () {
		if (nodes) {
			nodes.forEach(function (n) {
				n.frozen(true);
			});
		}
	};

	/**
	 * Allows the influence of the force directed layout on all nodes.
	 */
	graph.unfreeze = function () {
		if (nodes) {
			nodes.forEach(function (n) {
				n.frozen(false);
			});
			force.resume();
		}
	};

	/**
	 * Resets visual settings like zoom or panning.
	 */
	graph.reset = function () {
		zoom.translate([0, 0])
			.scale(1);
	};

	/**
	 * Calculate the complete link distance. The visual link distance does
	 * not contain e.g. radii of round nodes.
	 * @param link the link
	 * @returns {*}
	 */
	function calculateLinkDistance(link) {
		var distance = getVisibleLinkDistance(link);
		distance += link.domain().actualRadius();
		distance += link.range().actualRadius();
		return distance;
	}

	function getVisibleLinkDistance(link) {
		function isDatatype(node) {
			if (node instanceof webvowl.nodes.rdfsdatatype ||
				node instanceof webvowl.nodes.rdfsliteral) {
				return true;
			}
			return false;
		}

		if (isDatatype(link.domain()) || isDatatype(link.range())) {
			return options.datatypeDistance();
		} else {
			return options.classDistance();
		}
	}

	/**
	 * Empties the last graph container and draws a new one with respect to the
	 * value the graph container selector has.
	 */
	function redrawGraph() {
		remove();

		graphContainer = d3.selectAll(options.graphContainerSelector())
			.append("svg")
			.classed("vowlGraph", true)
			.attr("width", options.width())
			.attr("height", options.height())
			.call(zoom)
			.append("g");
	}

	/**
	 * Redraws all elements like nodes, links, ...
	 */
	function redrawContent() {
		var markerContainer;

		if (!graphContainer) {
			return;
		}

		// Empty the graph container
		graphContainer.selectAll("*").remove();

		// Last container -> elements of this container overlap others
		linkContainer = graphContainer.append("g").classed("linkContainer", true);
		cardinalityContainer = graphContainer.append("g").classed("cardinalityContainer", true);
		labelContainer = graphContainer.append("g").classed("labelContainer", true);
		nodeContainer = graphContainer.append("g").classed("nodeContainer", true);

		// Add an extra container for all markers
		markerContainer = linkContainer.append("defs");

		// Draw nodes
		nodeElements = nodeContainer.selectAll(".node")
			.data(nodes).enter()
			.append("g")
			.classed("node", true)
			.attr("id", function (d) {
				return d.id();
			})
			.call(dragBehaviour);

		nodeElements.each(function (d) {
			d.drawNode(d3.select(this));
		});


		// Draw label groups (property + inverse)
		labelGroupElements = labelContainer.selectAll(".labelGroup")
			.data(links).enter()
			.append("g")
			.classed("labelGroup", true);

		labelGroupElements.each(function (link) {
			var success = link.property().drawProperty(d3.select(this));
			// Remove empty groups without a label.
			if (!success) {
				d3.select(this).remove();
			}
		});

		// Place subclass label groups on the bottom of all labels
		labelGroupElements.each(function(link) {
			// the label might be hidden e.g. in compact notation
			if (!this.parentNode) {
				return;
			}

			if (link.property() instanceof webvowl.labels.rdfssubclassof ||
				link.inverse() instanceof webvowl.labels.rdfssubclassof) {

				var parentNode = this.parentNode;
				parentNode.insertBefore(this, parentNode.firstChild);
			}
		});

		// Draw cardinalities
		cardinalityElements = cardinalityContainer.selectAll(".cardinality")
			.data(properties).enter()
			.append("g")
			.classed("cardinality", true);

		cardinalityElements.each(function (property) {
			var success = property.drawCardinality(d3.select(this));

			// Remove empty groups without a label.
			if (!success) {
				d3.select(this).remove();
			}
		});

		// Draw links
		linkGroups = linkContainer.selectAll(".link")
			.data(links).enter()
			.append("g")
			.classed("link", true);

		linkGroups.each(function (link) {
			link.drawLink(d3.select(this), markerContainer);
		});

		// Select the path for direct access to receive a better performance
		linkPathElements = linkGroups.selectAll("path");

		addClickEvents();
	}

	/**
	 * Applies click listeneres to nodes and properties.
	 */
	function addClickEvents() {
		function executeModules(selectedElement) {
			options.selectionModules().forEach(function (module) {
				module.handle(selectedElement);
			});
		}

		nodeElements.on("click", function (clickedNode) {
			executeModules(clickedNode);
		});

		labelGroupElements.selectAll(".label").on("click", function (clickedProperty) {
			executeModules(clickedProperty);
		});
	}

	function loadGraphData() {
		parser.parse(options.data());

		unfilteredNodes = parser.nodes();
		unfilteredProperties = parser.properties();
	}

	/**
	 * Applies the data of the graph options object and parses it. The graph is not redrawn.
	 */
	function refreshGraphData() {
		var preprocessedNodes = unfilteredNodes,
			preprocessedProperties = unfilteredProperties;

		// Filter the data
		options.filterModules().forEach(function (module) {
			links = linkCreator.createLinks(preprocessedProperties);
			storeLinksOnNodes(preprocessedNodes, links);

			module.filter(preprocessedNodes, preprocessedProperties);
			preprocessedNodes = module.filteredNodes();
			preprocessedProperties = module.filteredProperties();
		});

		nodes = preprocessedNodes;
		properties = preprocessedProperties;
		links = linkCreator.createLinks(properties);

		storeLinksOnNodes(nodes, links);

		force.nodes(nodes)
			.links(links);
	}

	function storeLinksOnNodes(nodes, links) {
		for (var i = 0, nodesLength = nodes.length; i < nodesLength; i++) {
			var node = nodes[i],
				connectedLinks = [];

			// look for properties where this node is the domain or range
			for (var j = 0, linksLength = links.length; j < linksLength; j++) {
				var link = links[j];

				if (link.domain() === node || link.range() === node) {
					connectedLinks.push(link);
				}
			}

			node.links(connectedLinks);
		}
	}


	/**
	 * Applies all options that don't change the graph data.
	 */
	function refreshGraphStyle() {
		zoom = zoom.scaleExtent([options.minMagnification(), options.maxMagnification()]);
		if (graphContainer) {
			zoom.event(graphContainer);
		}

		force.charge(options.charge())
			.size([options.width(), options.height()])
			.linkDistance(calculateLinkDistance)
			.gravity(options.gravity())
			.linkStrength(options.linkStrength()); // Flexibility of links
	}

	/**
	 * Removes all elements from the graph container.
	 */
	function remove() {
		if (graphContainer) {
			// Select the parent element because the graph container is a group (e.g. for zooming)
			d3.select(graphContainer.node().parentNode).remove();
		}
	}

	graph.options = function() {
		return options;
	};

	graph.setLanguage = function (l) {
		if (language !== l) {
			language = l || "default";
			redrawContent();
			recalculatePositions();
		}
	};

	graph.getLanguage = function () {
		return language;
	};


	return graph;
};

// Source: src/js/graph/modules/collapsing.js
webvowl.modules.collapsing = function () {
	var collapsing = {},
		enabled = false,
		filteredNodes, filteredProperties;

	collapsing.filter = function (nodes, properties) {
		// Nothing is filtered, we just need to draw everywehere
		filteredNodes = nodes;
		filteredProperties = properties;


		var i, l, node;

		for (i = 0, l = nodes.length; i < l; i++) {
			node = nodes[i];
			if (node instanceof webvowl.nodes.RoundNode) {
				node.collapsible(enabled);
			}
		}
	};

	collapsing.enabled = function (p) {
		if (!arguments.length) return enabled;
		enabled = p;
		return collapsing;
	};

	collapsing.reset = function () {
		// todo
	};

	collapsing.filteredNodes = function () {
		return filteredNodes;
	};

	collapsing.filteredProperties = function () {
		return filteredProperties;
	};

	return collapsing;
};

// Source: src/js/graph/modules/compactNotationSwitch.js
/**
 * This module abuses the filter function a bit like the statistics module. Nothing is filtered.
 *
 * @returns {{}}
 */
webvowl.modules.compactNotationSwitch = function (graph) {

	var DEFAULT_STATE = false;

	var filter = {},
		nodes,
		properties,
		enabled = DEFAULT_STATE,
		filteredNodes,
		filteredProperties;


	/**
	 * If enabled, redundant details won't be drawn anymore.
	 * @param untouchedNodes
	 * @param untouchedProperties
	 */
	filter.filter = function (untouchedNodes, untouchedProperties) {
		nodes = untouchedNodes;
		properties = untouchedProperties;

		graph.options().compactNotation(enabled);

		filteredNodes = nodes;
		filteredProperties = properties;
	};

	filter.enabled = function (p) {
		if (!arguments.length) return enabled;
		enabled = p;
		return filter;
	};

	filter.reset = function() {
		enabled = DEFAULT_STATE;
	};


	// Functions a filter must have
	filter.filteredNodes = function () {
		return filteredNodes;
	};

	filter.filteredProperties = function () {
		return filteredProperties;
	};


	return filter;
};

// Source: src/js/graph/modules/datatypeFilter.js
webvowl.modules.datatypeFilter = function () {

	var filter = {},
		nodes,
		properties,
		enabled = false,
		filteredNodes,
		filteredProperties,
		filterTools = webvowl.util.filterTools();


	/**
	 * If enabled, all datatypes and literals including connected properties are filtered.
	 * @param untouchedNodes
	 * @param untouchedProperties
	 */
	filter.filter = function (untouchedNodes, untouchedProperties) {
		nodes = untouchedNodes;
		properties = untouchedProperties;

		if (this.enabled()) {
			removeDatatypesAndLiterals();
		}

		filteredNodes = nodes;
		filteredProperties = properties;
	};

	function removeDatatypesAndLiterals() {
		var filteredData = filterTools.filterNodesAndTidy(nodes, properties, isNoDatatypeOrLiteral);

		nodes = filteredData.nodes;
		properties = filteredData.properties;
	}

	function isNoDatatypeOrLiteral(node) {
		if (node instanceof webvowl.nodes.rdfsdatatype ||
			node instanceof webvowl.nodes.rdfsliteral) {
			return false;
		}
		return true;
	}

	filter.enabled = function (p) {
		if (!arguments.length) return enabled;
		enabled = p;
		return filter;
	};


	// Functions a filter must have
	filter.filteredNodes = function () {
		return filteredNodes;
	};

	filter.filteredProperties = function () {
		return filteredProperties;
	};


	return filter;
};

// Source: src/js/graph/modules/disjointFilter.js
webvowl.modules.disjointFilter = function () {

	var filter = {},
		nodes,
		properties,
	// According to the specification enabled by default
		enabled = true,
		filteredNodes,
		filteredProperties;


	/**
	 * If enabled, all disjoint with properties are filtered.
	 * @param untouchedNodes
	 * @param untouchedProperties
	 */
	filter.filter = function (untouchedNodes, untouchedProperties) {
		nodes = untouchedNodes;
		properties = untouchedProperties;

		if (this.enabled()) {
			removeDisjointWithProperties();
		}

		filteredNodes = nodes;
		filteredProperties = properties;
	};

	function removeDisjointWithProperties() {
		var cleanedProperties = [],
			i, l, property;

		for (i = 0, l = properties.length; i < l; i++) {
			property = properties[i];

			if (!(property instanceof webvowl.labels.owldisjointwith)) {
				cleanedProperties.push(property);
			}
		}

		properties = cleanedProperties;
	}

	filter.enabled = function (p) {
		if (!arguments.length) return enabled;
		enabled = p;
		return filter;
	};


	// Functions a filter must have
	filter.filteredNodes = function () {
		return filteredNodes;
	};

	filter.filteredProperties = function () {
		return filteredProperties;
	};


	return filter;
};

// Source: src/js/graph/modules/filterModuleTemplate.js
webvowl.modules.filterModuleTemplate = function () {

	var filter = {},
		filteredNodes,
		filteredProperties;


	filter.filter = function (nodes, properties) {

		// Filter the data

		filteredNodes = nodes;
		filteredProperties = properties;
	};


	// Functions a filter must have
	filter.filteredNodes = function () {
		return filteredNodes;
	};

	filter.filteredProperties = function () {
		return filteredProperties;
	};


	return filter;
};
// Source: src/js/graph/modules/focuser.js
webvowl.modules.focuser = function () {
	var focuser = {},
		focusedElement;

	focuser.handle = function (selectedElement) {
		// Don't display details on a drag event, which will be prevented
		if (d3.event.defaultPrevented) {
			return;
		}

		if (focusedElement !== undefined) {
			focusedElement.toggleFocus();
		}

		if (focusedElement !== selectedElement) {
			selectedElement.toggleFocus();
			focusedElement = selectedElement;
		} else {
			focusedElement = undefined;
		}
	};

	/**
	 * Removes the focus if an element is focussed.
	 */
	focuser.reset = function () {
		if (focusedElement) {
			focusedElement.toggleFocus();
			focusedElement = undefined;
		}
	};

	return focuser;
};

// Source: src/js/graph/modules/nodeDegreeFilter.js
webvowl.modules.nodeDegreeFilter = function () {

	var filter = {},
		nodes,
		properties,
		enabled = true,
		filteredNodes,
		filteredProperties,
		maxDegreeSetter,
		degreeQueryFunction,
		filterTools = webvowl.util.filterTools();


	/**
	 * If enabled, all nodes are filter by their node degree.
	 * @param untouchedNodes
	 * @param untouchedProperties
	 */
	filter.filter = function (untouchedNodes, untouchedProperties) {
		nodes = untouchedNodes;
		properties = untouchedProperties;

		setMaxLinkCount();

		if (this.enabled()) {
			filterByNodeDegree(degreeQueryFunction());
		}

		filteredNodes = nodes;
		filteredProperties = properties;
	};

	function setMaxLinkCount() {
		var maxLinkCount = 0;
		for (var i = 0, l = nodes.length; i < l; i++) {
			var linksWithoutDatatypes = filterOutDatatypes(nodes[i].links());

			maxLinkCount = Math.max(maxLinkCount, linksWithoutDatatypes.length);
		}

		if (maxDegreeSetter instanceof Function) {
			maxDegreeSetter(maxLinkCount);
		}
	}

	function filterOutDatatypes(links) {
		return links.filter(function(link) {
			return !(link.property() instanceof webvowl.labels.owldatatypeproperty);
		});
	}

	function filterByNodeDegree(minDegree) {
		var filteredData = filterTools.filterNodesAndTidy(nodes, properties, hasRequiredDegree(minDegree));

		nodes = filteredData.nodes;
		properties = filteredData.properties;
	}

	function hasRequiredDegree(minDegree) {
		return function (node) {
			return filterOutDatatypes(node.links()).length >= minDegree;
		};
	}

	filter.setMaxDegreeSetter = function(maxNodeDegreeSetter) {
		maxDegreeSetter = maxNodeDegreeSetter;
	};

	filter.setDegreeQueryFunction = function(nodeDegreeQueryFunction) {
		degreeQueryFunction = nodeDegreeQueryFunction;
	};

	filter.enabled = function (p) {
		if (!arguments.length) return enabled;
		enabled = p;
		return filter;
	};


	// Functions a filter must have
	filter.filteredNodes = function () {
		return filteredNodes;
	};

	filter.filteredProperties = function () {
		return filteredProperties;
	};


	return filter;
};

// Source: src/js/graph/modules/nodeScalingSwitch.js
/**
 * This module abuses the filter function a bit like the statistics module. Nothing is filtered.
 *
 * @returns {{}}
 */
webvowl.modules.nodeScalingSwitch = function (graph) {

	var DEFAULT_STATE = true;

	var filter = {},
		nodes,
		properties,
		enabled = DEFAULT_STATE,
		filteredNodes,
		filteredProperties;


	/**
	 * If enabled, the scaling of nodes according to individuals will be enabled.
	 * @param untouchedNodes
	 * @param untouchedProperties
	 */
	filter.filter = function (untouchedNodes, untouchedProperties) {
		nodes = untouchedNodes;
		properties = untouchedProperties;

		graph.options().scaleNodesByIndividuals(enabled);

		filteredNodes = nodes;
		filteredProperties = properties;
	};

	filter.enabled = function (p) {
		if (!arguments.length) return enabled;
		enabled = p;
		return filter;
	};

	filter.reset = function() {
		enabled = DEFAULT_STATE;
	};


	// Functions a filter must have
	filter.filteredNodes = function () {
		return filteredNodes;
	};

	filter.filteredProperties = function () {
		return filteredProperties;
	};


	return filter;
};

// Source: src/js/graph/modules/pickAndPin.js
webvowl.modules.pickAndPin = function () {
	var pap = {},
		enabled = false,
		pinnedNodes = [];

	pap.handle = function (selectedElement) {
		if (!enabled) {
			return;
		}

		if (selectedElement instanceof webvowl.nodes.RoundNode && !selectedElement.pinned()) {
			selectedElement.drawPin();
			pinnedNodes.push(selectedElement);
		}
	};

	pap.enabled = function (p) {
		if (!arguments.length) return enabled;
		enabled = p;
		return pap;
	};

	pap.reset = function () {
		var i = 0, l = pinnedNodes.length;
		for (; i < l; i++) {
			pinnedNodes[i].removePin();
		}
		// Clear the array of stored nodes
		pinnedNodes.length = 0;
	};

	return pap;
};

// Source: src/js/graph/modules/selectionDetailsDisplayer.js
webvowl.modules.selectionDetailsDisplayer = function (handlerFunction) {
	var viewer = {},
		lastSelectedElement;

	viewer.handle = function (selectedElement) {
		// Don't display details on a drag event, which will be prevented
		if (d3.event.defaultPrevented) {
			return;
		}

		var isSelection = true;

		// Deselection of the focused element
		if (lastSelectedElement === selectedElement) {
			isSelection = false;
		}

		if (handlerFunction instanceof Function) {
			if (isSelection) {
				handlerFunction(selectedElement);
			} else {
				handlerFunction(undefined);
			}
		}

		if (isSelection) {
			lastSelectedElement = selectedElement;
		} else {
			lastSelectedElement = undefined;
		}
	};

	/**
	 * Resets the displayed information to its default.
	 */
	viewer.reset = function () {
		if (lastSelectedElement) {
			handlerFunction(undefined);
			lastSelectedElement = undefined;
		}
	};

	return viewer;
};

// Source: src/js/graph/modules/setOperatorFilter.js
webvowl.modules.setOperatorFilter = function () {

	var filter = {},
		nodes,
		properties,
		enabled = false,
		filteredNodes,
		filteredProperties,
		filterTools = webvowl.util.filterTools();


	/**
	 * If enabled, all set operators including connected properties are filtered.
	 * @param untouchedNodes
	 * @param untouchedProperties
	 */
	filter.filter = function (untouchedNodes, untouchedProperties) {
		nodes = untouchedNodes;
		properties = untouchedProperties;

		if (this.enabled()) {
			removeSetOperators();
		}

		filteredNodes = nodes;
		filteredProperties = properties;
	};

	function removeSetOperators() {
		var filteredData = filterTools.filterNodesAndTidy(nodes, properties, isNoSetOperator);

		nodes = filteredData.nodes;
		properties = filteredData.properties;
	}

	function isNoSetOperator(node) {
		return !(node instanceof webvowl.nodes.SetOperatorNode);
	}

	filter.enabled = function (p) {
		if (!arguments.length) return enabled;
		enabled = p;
		return filter;
	};


	// Functions a filter must have
	filter.filteredNodes = function () {
		return filteredNodes;
	};

	filter.filteredProperties = function () {
		return filteredProperties;
	};


	return filter;
};

// Source: src/js/graph/modules/statistics.js
webvowl.modules.statistics = function () {

	var statistics = {},
		nodeCount,
		occurencesOfClassAndDatatypeTypes = {},
		edgeCount,
		occurencesOfPropertyTypes = {},
		classCount,
		datatypeCount,
		datatypePropertyCount,
		objectPropertyCount,
		propertyCount,
		totalIndividualCount,
		filteredNodes,
		filteredProperties;


	statistics.filter = function (classesAndDatatypes, properties) {
		resetStoredData();

		storeTotalCounts(classesAndDatatypes, properties);
		storeClassAndDatatypeCount(classesAndDatatypes);
		storePropertyCount(properties);

		storeOccurencesOfTypes(classesAndDatatypes, occurencesOfClassAndDatatypeTypes);
		storeOccurencesOfTypes(properties, occurencesOfPropertyTypes);

		storeTotalIndividualCount(classesAndDatatypes);

		filteredNodes = classesAndDatatypes;
		filteredProperties = properties;
	};

	function resetStoredData() {
		nodeCount = 0;
		edgeCount = 0;
		classCount = 0;
		datatypeCount = 0;
		datatypePropertyCount = 0;
		objectPropertyCount = 0;
		propertyCount = 0;
		totalIndividualCount = 0;
	}

	function storeTotalCounts(classesAndDatatypes, properties) {
		nodeCount = classesAndDatatypes.length;

		var seenProperties = webvowl.util.set(), i, l, property;
		for (i = 0, l = properties.length; i < l; i++) {
			property = properties[i];
			if (!seenProperties.has(property)) {
				edgeCount += 1;
			}

			seenProperties.add(property);
			if (property.inverse()) {
				seenProperties.add(property.inverse());
			}
		}
	}

	function storeClassAndDatatypeCount(classesAndDatatypes) {
		// Each datatype should be counted just a single time
		var datatypeSet = d3.set(),
			hasThing = false;

		function isDatatype(node) {
			if (node instanceof webvowl.nodes.rdfsdatatype ||
				node instanceof webvowl.nodes.rdfsliteral) {
				return true;
			}
			return false;
		}

		classesAndDatatypes.forEach(function (node) {
			if (isDatatype(node)) {
				datatypeSet.add(node.defaultLabel());
			} else if (!(node instanceof webvowl.nodes.SetOperatorNode)) {
				if (node instanceof webvowl.nodes.owlthing) {
					hasThing = true;
				} else {
					classCount += 1;
					classCount += countElementArray(node.equivalents());
				}
			}
		});

		// count things just a single time
		classCount += hasThing ? 1 : 0;

		datatypeCount = datatypeSet.size();
	}

	function storePropertyCount(properties) {
		for (var i = 0, l = properties.length; i < l; i++) {
			var property = properties[i];

			if (property instanceof webvowl.labels.owlobjectproperty) {
				objectPropertyCount += getExtendedPropertyCount(property);
			} else if (property instanceof webvowl.labels.owldatatypeproperty) {
				datatypePropertyCount += getExtendedPropertyCount(property);
			}
		}
		propertyCount = objectPropertyCount + datatypePropertyCount;
	}

	function getExtendedPropertyCount(property) {
		// count the property itself
		var count = 1;

		// and count properties this property represents
		count += countElementArray(property.equivalents());
		count += countElementArray(property.redundantProperties());

		return count;
	}

	function countElementArray(properties) {
		if (properties) {
			return properties.length;
		}
		return 0;
	}

	function storeOccurencesOfTypes(elements, storage) {
		elements.forEach(function (element) {
			var type = element.type(),
				typeCount = storage[type];

			if (typeof typeCount === "undefined") {
				typeCount = 0;
			} else {
				typeCount += 1;
			}
			storage[type] = typeCount;
		});
	}

	function storeTotalIndividualCount(nodes) {
	 	var totalCount = 0;
		for (var i = 0, l = nodes.length; i < l; i++) {
			totalCount += nodes[i].individuals().length || 0;
		}
		totalIndividualCount = totalCount;
	}


	statistics.nodeCount = function () {
		return nodeCount;
	};

	statistics.occurencesOfClassAndDatatypeTypes = function () {
		return occurencesOfClassAndDatatypeTypes;
	};

	statistics.edgeCount = function () {
		return edgeCount;
	};

	statistics.occurencesOfPropertyTypes = function () {
		return occurencesOfPropertyTypes;
	};

	statistics.classCount = function () {
		return classCount;
	};

	statistics.datatypeCount = function () {
		return datatypeCount;
	};

	statistics.datatypePropertyCount = function () {
		return datatypePropertyCount;
	};

	statistics.objectPropertyCount = function () {
		return objectPropertyCount;
	};

	statistics.propertyCount = function () {
		return propertyCount;
	};

	statistics.totalIndividualCount = function () {
		return totalIndividualCount;
	};


	// Functions a filter must have
	statistics.filteredNodes = function () {
		return filteredNodes;
	};

	statistics.filteredProperties = function () {
		return filteredProperties;
	};


	return statistics;
};

// Source: src/js/graph/modules/subclassFilter.js
webvowl.modules.subclassFilter = function () {

	var filter = {},
		nodes,
		properties,
		enabled = false,
		filteredNodes,
		filteredProperties;


	/**
	 * If enabled subclasses that have only subclass properties are filtered.
	 * @param untouchedNodes
	 * @param untouchedProperties
	 */
	filter.filter = function (untouchedNodes, untouchedProperties) {
		nodes = untouchedNodes;
		properties = untouchedProperties;

		if (this.enabled()) {
			hideSubclassesWithoutOwnProperties();
		}

		filteredNodes = nodes;
		filteredProperties = properties;
	};

	function hideSubclassesWithoutOwnProperties() {
		var unneededProperties = [],
			unneededClasses = [],
			subclasses = [],
			connectedProperties,
			subclass,
			property,
			i, // index,
			l; // length


		for (i = 0, l = properties.length; i < l; i++) {
			property = properties[i];
			if (property instanceof webvowl.labels.rdfssubclassof) {
				subclasses.push(property.domain());
			}
		}

		for (i = 0, l = subclasses.length; i < l; i++) {
			subclass = subclasses[i];
			connectedProperties = findRelevantConnectedProperties(subclass, properties);

			// Only remove the node and its properties, if they're all subclassOf properties
			if (areOnlySubclassProperties(connectedProperties) &&
				doesNotInheritFromMultipleClasses(subclass, connectedProperties)) {

				unneededProperties = unneededProperties.concat(connectedProperties);
				unneededClasses.push(subclass);
			}
		}

		nodes = removeUnneededElements(nodes, unneededClasses);
		properties = removeUnneededElements(properties, unneededProperties);
	}

	/**
	 * Looks recursively for connected properties. Because just subclasses are relevant,
	 * we just look recursively for their properties.
	 *
	 * @param node
	 * @param allProperties
	 * @param visitedNodes a visited nodes which is used on recursive invocation
	 * @returns {Array}
	 */
	function findRelevantConnectedProperties(node, allProperties, visitedNodes) {
		var connectedProperties = [],
			property,
			i,
			l;

		for (i = 0, l = allProperties.length; i < l; i++) {
			property = allProperties[i];
			if (property.domain() === node ||
				property.range() === node) {

				connectedProperties.push(property);


				/* Special case: SuperClass <-(1) Subclass <-(2) Subclass ->(3) e.g. Datatype
				 * We need to find the last property recursively. Otherwise, we would remove the subClassOf
				 * property (1) because we didn't see the datatype property (3).
				 */

				// Look only for subclass properties, because these are the relevant properties
				if (property instanceof webvowl.labels.rdfssubclassof) {
					var domain = property.domain();
					visitedNodes = visitedNodes || webvowl.util.set();

					// If we have the range, there might be a nested property on the domain
					if (node === property.range() && !visitedNodes.has(domain)) {
						visitedNodes.add(domain);
						var nestedConnectedProperties = findRelevantConnectedProperties(domain, allProperties, visitedNodes);
						connectedProperties = connectedProperties.concat(nestedConnectedProperties);
					}
				}
			}
		}

		return connectedProperties;
	}

	function areOnlySubclassProperties(connectedProperties) {
		var onlySubclassProperties = true,
			property,
			i,
			l;

		for (i = 0, l = connectedProperties.length; i < l; i++) {
			property = connectedProperties[i];

			if (!(property instanceof webvowl.labels.rdfssubclassof)) {
				onlySubclassProperties = false;
				break;
			}
		}

		return onlySubclassProperties;
	}

	function doesNotInheritFromMultipleClasses(subclass, connectedProperties) {
		var superClassCount = 0;

		for (var i = 0, l = connectedProperties.length; i < l; i++) {
			var property = connectedProperties[i];

			if (property.domain() === subclass) {
				superClassCount += 1;
			}

			if (superClassCount > 1) {
				return false;
			}
		}

		return true;
	}

	function removeUnneededElements(array, removableElements) {
		var disjoint = [],
			element,
			i,
			l;

		for (i = 0, l = array.length; i < l; i++) {
			element = array[i];
			if (removableElements.indexOf(element) === -1) {
				disjoint.push(element);
			}
		}
		return disjoint;
	}

	filter.enabled = function (p) {
		if (!arguments.length) return enabled;
		enabled = p;
		return filter;
	};


	// Functions a filter must have
	filter.filteredNodes = function () {
		return filteredNodes;
	};

	filter.filteredProperties = function () {
		return filteredProperties;
	};


	return filter;
};
// Source: src/js/graph/options.js
webvowl.options = function () {
	/**
	 * @constructor
	 */
	var options = {},
		data,
		graphContainerSelector,
		defaultLinkDistance = 160,
		classDistance = defaultLinkDistance,
		datatypeDistance = defaultLinkDistance,
		charge = -1000,
		gravity = 0.025,
		linkStrength = 0.7,
		height = 600,
		width = 800,
		selectionModules = [],
		filterModules = [],
		minMagnification = 0.1,
		maxMagnification = 4,
		compactNotation = false,
		scaleNodesByIndividuals = false;

	/* Read-only properties */
	options.defaultLinkDistance = function () {
		return defaultLinkDistance;
	};

	/* Properties with read-write access */
	options.charge = function (p) {
		if (!arguments.length) return charge;
		charge = +p;
		return options;
	};

	options.classDistance = function (p) {
		if (!arguments.length) return classDistance;
		classDistance = +p;
		return options;
	};

	options.compactNotation = function (p) {
		if (!arguments.length) return compactNotation;
		compactNotation = p;
		return options;
	};

	options.data = function (p) {
		if (!arguments.length) return data;
		data = p;
		return options;
	};

	options.datatypeDistance = function (p) {
		if (!arguments.length) return datatypeDistance;
		datatypeDistance = +p;
		return options;
	};

	options.filterModules = function (p) {
		if (!arguments.length) return filterModules;
		filterModules = p;
		return options;
	};

	options.graphContainerSelector = function (p) {
		if (!arguments.length) return graphContainerSelector;
		graphContainerSelector = p;
		return options;
	};

	options.gravity = function (p) {
		if (!arguments.length) return gravity;
		gravity = +p;
		return options;
	};

	options.height = function (p) {
		if (!arguments.length) return height;
		height = +p;
		return options;
	};

	options.linkStrength = function (p) {
		if (!arguments.length) return linkStrength;
		linkStrength = +p;
		return options;
	};

	options.minMagnification = function (p) {
		if (!arguments.length) return minMagnification;
		minMagnification = +p;
		return options;
	};

	options.maxMagnification = function (p) {
		if (!arguments.length) return maxMagnification;
		maxMagnification = +p;
		return options;
	};

	options.scaleNodesByIndividuals = function (p) {
		if (!arguments.length) return scaleNodesByIndividuals;
		scaleNodesByIndividuals = p;
		return options;
	};

	options.selectionModules = function (p) {
		if (!arguments.length) return selectionModules;
		selectionModules = p;
		return options;
	};

	options.width = function (p) {
		if (!arguments.length) return width;
		width = +p;
		return options;
	};

	return options;
};

// Source: src/js/graph/parser.js
/**
 * Encapsulates the parsing and preparation logic of the input data.
 * @param graph the graph object that will be passed to the elements
 * @returns {{}}
 */
webvowl.parser = function (graph) {
	var parser = {},
		nodes,
		properties,
		classMap,
		propertyMap,
	// Modules
		attributeParser = webvowl.parsing.attributeParser();

	/**
	 * Parses the ontology data and preprocesses it (e.g. connecting inverse properties and so on).
	 * @param ontologyData the loaded ontology json file
	 */
	parser.parse = function (ontologyData) {
		if (!ontologyData) {
			nodes = [];
			properties = [];
			return;
		}

		var classes = combineClasses(ontologyData.class, ontologyData.classAttribute, webvowl.nodes),
			datatypes = combineClasses(ontologyData.datatype, ontologyData.datatypeAttribute, webvowl.nodes),
			combinedClassesAndDatatypes = classes.concat(datatypes),
			combinedProperties;

		// Inject properties for unions, intersections, ...
		addSetOperatorProperties(combinedClassesAndDatatypes, ontologyData.property);

		combinedProperties = combineProperties(ontologyData.property, ontologyData.propertyAttribute, webvowl.labels);

		classMap = mapElements(combinedClassesAndDatatypes);
		propertyMap = mapElements(combinedProperties);

		mergeRangesOfEquivalentProperties(combinedProperties, combinedClassesAndDatatypes);

		// Process the graph data
		convertTypesToIris(combinedClassesAndDatatypes, ontologyData.namespace);
		convertTypesToIris(combinedProperties, ontologyData.namespace);

		nodes = createNodeStructure(combinedClassesAndDatatypes, classMap);
		properties = createPropertyStructure(combinedProperties, classMap, propertyMap);
	};

	/**
	 * @return {Array} the preprocessed nodes
	 */
	parser.nodes = function () {
		return nodes;
	};

	/**
	 * @returns {Array} the preprocessed properties
	 */
	parser.properties = function () {
		return properties;
	};

	/**
	 * Combines the passed objects with its attributes and prototypes. This also applies
	 * attributes defined in the base of the prototype.
	 */
	function combineClasses(baseObjects, attributes, prototypes) {
		var combinations = [];

		if (baseObjects) {
			baseObjects.forEach(function (element) {
				var matchingAttribute,
					elementType;

				if (attributes) {
					// Look for an attribute with the same id and merge them
					for (var i = 0; i < attributes.length; i++) {
						var attribute = attributes[i];
						if (element.id === attribute.id) {
							matchingAttribute = attribute;
							break;
						}
					}
					addAdditionalAttributes(element, matchingAttribute);
				}

				// Then look for a prototype to add its properties
				elementType = element.type.replace(":", "").toLowerCase();

				if (elementType in prototypes) {
					addAdditionalAttributes(element, prototypes[elementType]);

					var node = new prototypes[elementType](graph);
					node.annotations(element.annotations)
						.comment(element.comment)
						.complement(element.complement)
						.description(element.description)
						.equivalents(element.equivalent)
						.id(element.id)
						.intersection(element.intersection)
						.label(element.label)
						// .type(element.type) Ignore, because we predefined it
						.union(element.union)
						.iri(element.iri);

					// Create node objects for all individuals
					if (element.individuals) {
						element.individuals.forEach(function (individual) {
							var individualNode = new prototypes[elementType](graph);
							individualNode.label(individual.labels)
								.iri(individual.iri);

							node.individuals().push(individualNode);
						});
					}

					if (element.attributes) {
						var deduplicatedAttributes = d3.set(element.attributes.concat(node.attributes()));
						node.attributes(deduplicatedAttributes.values());
					}

					combinations.push(node);
				} else {
					console.error("Unknown element type: " + elementType);
				}
			});
		}

		return combinations;
	}

	function combineProperties(baseObjects, attributes, prototypes) {
		var combinations = [];

		if (baseObjects) {
			baseObjects.forEach(function (element) {
				var matchingAttribute,
					elementType;

				if (attributes) {
					// Look for an attribute with the same id and merge them
					for (var i = 0; i < attributes.length; i++) {
						var attribute = attributes[i];
						if (element.id === attribute.id) {
							matchingAttribute = attribute;
							break;
						}
					}
					addAdditionalAttributes(element, matchingAttribute);
				}

				// Then look for a prototype to add its properties
				elementType = element.type.replace(":", "").toLowerCase();

				if (elementType in prototypes) {
					// Create the matching object and set the properties
					var property = new prototypes[elementType](graph);
					property.annotations(element.annotations)
						.cardinality(element.cardinality)
						.comment(element.comment)
						.domain(element.domain)
						.description(element.description)
						.equivalents(element.equivalent)
						.id(element.id)
						.inverse(element.inverse)
						.label(element.label)
						.minCardinality(element.minCardinality)
						.maxCardinality(element.maxCardinality)
						.range(element.range)
						.subproperties(element.subproperty)
						.superproperties(element.superproperty)
						// .type(element.type) Ignore, because we predefined it
						.iri(element.iri);

					if (element.attributes) {
						var deduplicatedAttributes = d3.set(element.attributes.concat(property.attributes()));
						property.attributes(deduplicatedAttributes.values());
					}

					combinations.push(property);
				} else {
					console.error("Unknown element type: " + elementType);
				}

			});
		}

		return combinations;
	}

	/**
	 * Really dirty implementation of the range merging of equivalent Ids,
	 * but this will be moved to the converter.
	 * @param properties
	 * @param nodes
	 */
	function mergeRangesOfEquivalentProperties(properties, nodes) {
		var backedUpNodes = nodes.slice(),
			hiddenNodeIds = d3.set(),
			i, l, j, k,
			prefix = "GENERATED-MERGED_RANGE-";

		// clear the original array
		nodes.length = 0;

		for (i = 0, l = properties.length; i < l; i++) {
			var property = properties[i],
				equivalents = property.equivalents();

			if (equivalents.length === 0) {
				continue;
			}

			// quickfix, because all equivalent properties have the equivalent attribute
			if (property.range().indexOf(prefix) === 0) {
				continue;
			}

			var mergedRange;
			if (property instanceof webvowl.labels.owldatatypeproperty) {
				mergedRange = new webvowl.nodes.rdfsliteral(graph);
			} else {
				mergedRange = new webvowl.nodes.owlthing(graph);
			}
			mergedRange.id(prefix + property.id());
			nodes.push(mergedRange);

			var hiddenNodeId = property.range();
			property.range(mergedRange.id());

			for (j = 0, k = equivalents.length; j < k; j++) {
				var equivalentId = equivalents[j],
					equivProperty = propertyMap[equivalentId];

				var oldRange = equivProperty.range();
				equivProperty.range(mergedRange.id());
				if (!isDomainOrRangeOfOtherProperty(oldRange, properties)) {
					hiddenNodeIds.add(oldRange);
				}
			}

			// only merge if this property was the only connected one
			if (!isDomainOrRangeOfOtherProperty(hiddenNodeId, properties)) {
				hiddenNodeIds.add(hiddenNodeId);
			}
		}

		for (i = 0, l = backedUpNodes.length; i < l; i++) {
			var node = backedUpNodes[i];

			if (!hiddenNodeIds.has(node.id())) {
				nodes.push(node);
			}
		}

		// Create a map again
		classMap = mapElements(nodes);
	}

	function isDomainOrRangeOfOtherProperty(nodeId, properties) {
		var i, l;

		for (i = 0, l = properties.length; i < l; i++) {
			var property = properties[i];
			if (property.domain() === nodeId || property.range() === nodeId) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Checks all attributes which have to be rewritten.
	 * For example:
	 * <b>equivalent</b> is filled with only ID's of the corresponding nodes. It would be better to used the
	 * object instead of the ID so we swap the ID's with the correct object reference and can delete it from drawing
	 * because it is not necessary.
	 */
	function createNodeStructure(rawNodes, classMap) {
		var nodes = [];

		// Set the default values
		var maxIndividualCount = 0;
		rawNodes.forEach(function (node) {
			maxIndividualCount = Math.max(maxIndividualCount, node.individuals().length);
			node.visible(true);
		});

		rawNodes.forEach(function (node) {
			// Merge and connect the equivalent nodes
			processEquivalentIds(node, classMap);

			attributeParser.parseClassAttributes(node);

			node.maxIndividualCount(maxIndividualCount);
		});

		// Collect all nodes that should be displayed
		rawNodes.forEach(function (node) {
			if (node.visible()) {
				nodes.push(node);
			}
		});

		return nodes;
	}

	/**
	 * Sets the disjoint attribute of the nodes if a disjoint label is found.
	 * @param property
	 */
	function processDisjoints(property) {
		if (property instanceof webvowl.labels.owldisjointwith === false) {
			return;
		}

		var domain = property.domain(),
			range = property.range();

		// Check the domain.
		if (!domain.disjointWith()) {
			domain.disjointWith([]);
		}

		// Check the range.
		if (!range.disjointWith()) {
			range.disjointWith([]);
		}

		domain.disjointWith().push(property.range());
		range.disjointWith().push(property.domain());
	}

	/**
	 * Connect all properties and also their sub- and superproperties.
	 * We iterate over the rawProperties array because it is way faster than iterating
	 * over an object and its attributes.
	 *
	 * @param rawProperties the properties
	 * @param classMap a map of all classes
	 * @param propertyMap the properties in a map
	 */
	function createPropertyStructure(rawProperties, classMap, propertyMap) {
		var properties = [],
			i, // loop index
			l; // array length

		// Set default values
		rawProperties.forEach(function (property) {
			property.visible(true);
		});

		// Connect properties
		rawProperties.forEach(function (property) {
			var domain,
				range,
				domainObject,
				rangeObject,
				inverse;

			/* Skip properties that have no information about their domain and range, like
			 inverse properties with optional inverse and optional domain and range attributes */
			if ((property.domain() && property.range()) || property.inverse()) {

				var inversePropertyId = findId(property.inverse());
				// Look if an inverse property exists
				if (inversePropertyId) {
					inverse = propertyMap[inversePropertyId];
					if (!inverse) {
						console.warn("No inverse property was found for id: " + inversePropertyId);
					}
				}

				// Either domain and range are set on this property or at the inverse
				if (typeof property.domain() !== "undefined" && typeof property.range() !== "undefined") {
					domain = findId(property.domain());
					range = findId(property.range());

					domainObject = classMap[domain];
					rangeObject = classMap[range];
				} else if (inverse) {
					// Domain and range need to be switched
					domain = findId(inverse.range());
					range = findId(inverse.domain());

					domainObject = classMap[domain];
					rangeObject = classMap[range];
				} else {
					console.warn("Domain and range not found for property: " + property.id());
				}

				// Set the references on this property
				property.domain(domainObject);
				property.range(rangeObject);

				// Also set the attributes of the inverse property
				if (inverse) {
					property.inverse(inverse);
					inverse.inverse(property);

					// Switch domain and range
					inverse.domain(rangeObject);
					inverse.range(domainObject);
				}
			}

			// Reference sub- and superproperties
			referenceSubOrSuperProperties(property.subproperties());
			referenceSubOrSuperProperties(property.superproperties());
		});

		// Merge equivalent properties and process disjoints.
		rawProperties.forEach(function (property) {
			processEquivalentIds(property, propertyMap);
			processDisjoints(property);

			attributeParser.parsePropertyAttributes(property);
		});

		// Add additional information to the properties
		rawProperties.forEach(function (property) {

			// Properties of merged classes should point to/from the visible equivalent class
			var propertyWasRerouted = false;
			if (wasNodeMerged(property.domain())) {
				property.domain(property.domain().equivalentBase());
				propertyWasRerouted = true;
			}
			if (wasNodeMerged(property.range())) {
				property.range(property.range().equivalentBase());
				propertyWasRerouted = true;
			}

			// But there should not be two equal properties between the same domain and range
			var equalProperty = getOtherEqualProperty(rawProperties, property);
			if (propertyWasRerouted && equalProperty) {
				property.visible(false);

				equalProperty.redundantProperties().push(property);
			}

			// Hide property if source or target node is hidden
			if (!property.domain().visible() || !property.range().visible()) {
				property.visible(false);
			}

			// Collect all properties that should be displayed
			if (property.visible()) {
				properties.push(property);
			}
		});

		return properties;
	}

	function referenceSubOrSuperProperties(subOrSuperPropertiesArray) {
		var i, l;

		if (!subOrSuperPropertiesArray) {
			return;
		}

		for (i = 0, l = subOrSuperPropertiesArray.length; i < l; ++i) {
			var subOrSuperPropertyId = findId(subOrSuperPropertiesArray[i]);
			var subOrSuperProperty = propertyMap[subOrSuperPropertyId];

			if (subOrSuperProperty) {
				// Replace id with object
				subOrSuperPropertiesArray[i] = subOrSuperProperty;
			} else {
				console.warn("No sub-/superproperty was found for id: " + subOrSuperPropertyId);
			}
		}
	}

	function wasNodeMerged(node) {
		return !node.visible() && node.equivalentBase();
	}

	function getOtherEqualProperty(properties, referenceProperty) {
		var i, l, property;

		for (i = 0, l = properties.length; i < l; i++) {
			property = properties[i];

			if (referenceProperty === property) {
				continue;
			}
			if (referenceProperty.domain() !== property.domain() ||
				referenceProperty.range() !== property.range()) {
				continue;
			}

			// Check for an equal IRI, if non existent compare label and type
			if (referenceProperty.iri() && property.iri()) {
				if (referenceProperty.iri() === property.iri()) {
					return property;
				}
			} else if (referenceProperty.type() === property.type() &&
				referenceProperty.defaultLabel() === property.defaultLabel()) {
				return property;
			}
		}

		return undefined;
	}

	/**
	 * Generates and adds properties for links to set operators.
	 * @param classes unprocessed classes
	 * @param properties unprocessed properties
	 */
	function addSetOperatorProperties(classes, properties) {
		var i, // index
			l; // array length

		function addProperties(domainId, setIds, operatorType) {
			if (typeof setIds !== "undefined") {
				for (i = 0, l = setIds.length; i < l; ++i) {
					var rangeId = setIds[i],
						property = {};

					property.id = "GENERATED-" + operatorType + "-" + domainId + "-" + rangeId + "-" + i;
					property.type = "setOperatorProperty";
					property.domain = domainId;
					property.range = rangeId;

					properties.push(property);
				}
			}
		}

		classes.forEach(function (clss) {
			addProperties(clss.id(), clss.complement(), "COMPLEMENT");
			addProperties(clss.id(), clss.intersection(), "INTERSECTION");
			addProperties(clss.id(), clss.union(), "UNION");
		});
	}

	/**
	 * Replaces the ids of equivalent nodes/properties with the matching objects, cross references them
	 * and tags them as processed.
	 * @param element a node or a property
	 * @param elementMap a map where nodes/properties can be looked up
	 */
	function processEquivalentIds(element, elementMap) {
		var eqIds = element.equivalents();

		if (!eqIds || element.equivalentBase()) {
			return;
		}

		// Replace ids with the corresponding objects
		for (var i = 0, l = eqIds.length; i < l; ++i) {
			var eqId = findId(eqIds[i]);
			var eqObject = elementMap[eqId];

			if (eqObject) {
				// Cross reference both objects
				eqObject.equivalents(eqObject.equivalents());
				eqObject.equivalents().push(element);
				eqObject.equivalentBase(element);
				eqIds[i] = eqObject;

				// Hide other equivalent nodes
				eqObject.visible(false);
			} else {
				console.warn("No class/property was found for equivalent id: " + eqId);
			}
		}
	}

	/**
	 * Tries to convert the type to an iri and sets it.
	 * @param elements classes or properties
	 * @param namespaces an array of namespaces
	 */
	function convertTypesToIris(elements, namespaces) {
		elements.forEach(function (element) {
			if (typeof element.iri() === "string") {
				element.iri(replaceNamespace(element.iri(), namespaces));
			}
		});
	}

	/**
	 * Creates a map by mapping the array with the passed function.
	 * @param array the array
	 * @returns {{}}
	 */
	function mapElements(array) {
		var map = {};
		for (var i = 0, length = array.length; i < length; i++) {
			var element = array[i];
			map[element.id()] = element;
		}
		return map;
	}

	/**
	 * Adds the attributes of the additional object to the base object, but doesn't
	 * overwrite existing ones.
	 *
	 * @param base the base object
	 * @param addition the object with additional data
	 * @returns the combination is also returned
	 */
	function addAdditionalAttributes(base, addition) {
		// Check for an undefined value
		addition = addition || {};

		for (var addAttribute in addition) {
			// Add the attribute if it doesn't exist
			if (!(addAttribute in base) && addition.hasOwnProperty(addAttribute)) {
				base[addAttribute] = addition[addAttribute];
			}
		}
		return base;
	}

	/**
	 * Replaces the namespace (and the separator) if one exists and returns the new value.
	 * @param address the address with a namespace in it
	 * @param namespaces an array of namespaces
	 * @returns {string} the processed address with the (possibly) replaced namespace
	 */
	function replaceNamespace(address, namespaces) {
		var separatorIndex = address.indexOf(":");
		if (separatorIndex === -1) {
			return address;
		}

		var namespaceName = address.substring(0, separatorIndex);

		for (var i = 0, length = namespaces.length; i < length; ++i) {
			var namespace = namespaces[i];
			if (namespaceName === namespace.name) {
				return namespace.iri + address.substring(separatorIndex + 1);
			}
		}

		return address;
	}

	/**
	 * Looks whether the passed object is already the id or if it was replaced
	 * with the object that belongs to the id.
	 * @param object an id, a class or a property
	 * @returns {string} the id of the passed object or undefined
	 */
	function findId(object) {
		if (!object) {
			return undefined;
		} else if (typeof object === "string") {
			return object;
		} else if ("id" in object) {
			return object.id();
		} else {
			console.warn("No Id was found for this object: " + object);
			return undefined;
		}
	}

	return parser;
};

// Source: src/js/graph/parsing/attributeParser.js
/**
 * Parses the attributes an element has and sets the corresponding attributes.
 * @returns {Function}
 */
webvowl.parsing.attributeParser = (function () {
	var attributeParser = {},
	// Style
		DEPRECATED = "deprecated",
		EXTERNAL = "external",
		DATATYPE = "datatype",
		OBJECT = "object",
		RDF = "rdf",
	// Representations
		FUNCTIONAL = "functional",
		INVERSE_FUNCTIONAL = "inverse functional",
		TRANSITIVE = "transitive",
		SYMMETRIC = "symmetric";

	/**
	 * Parses and sets the attributes of a class.
	 * @param clazz
	 */
	attributeParser.parseClassAttributes = function (clazz) {
		if (!(clazz.attributes() instanceof Array)) {
			return;
		}

		parseVisualAttributes(clazz);
		parseClassIndications(clazz);
	};

	function parseVisualAttributes(element) {
		var orderedAttributes = [DEPRECATED, EXTERNAL, DATATYPE, OBJECT, RDF],
			i, l, attribute;

		for (i = 0, l = orderedAttributes.length; i < l; i++) {
			attribute = orderedAttributes[i];
			if (element.attributes().contains(attribute)) {
				element.visualAttribute(attribute);

				// Just a single attribute is possible
				break;
			}
		}
	}

	function parseClassIndications(clazz) {
		var indications = [DEPRECATED, EXTERNAL],
			i, l, indication;

		for (i = 0, l = indications.length; i < l; i++) {
			indication = indications[i];

			if (clazz.attributes().contains(indication)) {
				clazz.indications().push(indication);
			}
		}
	}

	/**
	 * Parses and sets the attributes of a property.
	 * @param property
	 */
	attributeParser.parsePropertyAttributes = function (property) {
		if (!(property.attributes() instanceof Array)) {
			return;
		}

		parseVisualAttributes(property);
		parsePropertyIndications(property);
	};

	function parsePropertyIndications(property) {
		var indications = [FUNCTIONAL, INVERSE_FUNCTIONAL, SYMMETRIC, TRANSITIVE],
			i, l, indication;

		for (i = 0, l = indications.length; i < l; i++) {
			indication = indications[i];

			if (property.attributes().contains(indication)) {
				property.indications().push(indication);
			}
		}
	}


	return function () {
		// Return a function to keep module interfaces consistent
		return attributeParser;
	};
})();
// Source: src/js/graph/parsing/linkCreator.js
/**
 * Stores the passed properties in links.
 * @returns {Function}
 */
webvowl.parsing.linkCreator = (function () {
	var linkCreator = {};

	/**
	 * Creates links from the passed properties.
	 * @param properties
	 */
	linkCreator.createLinks = function (properties) {
		var links = groupPropertiesToLinks(properties);

		for (var i = 0, l = links.length; i < l; i++) {
			var link = links[i];

			countAndSetLayers(link, links);
			countAndSetLoops(link, links);
		}

		return links;
	};

	/**
	 * Creates links of properties and - if existing - their inverses.
	 * @param properties the properties
	 * @returns {Array}
	 */
	function groupPropertiesToLinks(properties) {
		var links = [],
			property,
			addedProperties = webvowl.util.set();

		for (var i = 0, l = properties.length; i < l; i++) {
			property = properties[i];

			if (!addedProperties.has(property)) {
				var link = webvowl.elements.link();
				link.property(property);
				link.domain(property.domain());
				link.range(property.range());

				property.link(link);
				addedProperties.add(property);

				var inverse = property.inverse();
				if (inverse) {
					link.inverse(inverse);
					inverse.link(link);
					addedProperties.add(inverse);
				}

				links.push(link);
			}
		}

		return links;
	}

	function countAndSetLayers(link, allLinks) {
		var layer,
			layers,
			i, l;

		if (typeof link.layerCount() === "undefined") {
			layers = [];

			// Search for other links that are another layer
			for (i = 0, l = allLinks.length; i < l; i++) {
				var otherLink = allLinks[i];
				if (link.domain() === otherLink.domain() && link.range() === otherLink.range() ||
					link.domain() === otherLink.range() && link.range() === otherLink.domain()) {
					layers.push(otherLink);
				}
			}

			// Set the results on each of the layers
			for (i = 0, l = layers.length; i < l; ++i) {
				layer = layers[i];

				layer.layerIndex(i);
				layer.layerCount(l);
				layer.layers(layers);
			}
		}
	}

	function countAndSetLoops(link, allLinks) {
		var loop,
			loops,
			i, l;

		if (typeof link.loopCount() === "undefined") {
			loops = [];

			// Search for other links that are also loops of the same node
			for (i = 0, l = allLinks.length; i < l; i++) {
				var otherLink = allLinks[i];
				if (link.domain() === otherLink.domain() && link.domain() === otherLink.range()) {
					loops.push(otherLink);
				}
			}

			// Set the results on each of the loops
			for (i = 0, l = loops.length; i < l; ++i) {
				loop = loops[i];

				loop.loopIndex(i);
				loop.loopCount(l);
				loop.loops(loops);
			}
		}
	}


	return function () {
		// Return a function to keep module interfaces consistent
		return linkCreator;
	};
})();

// Source: src/js/graph/util/constants.js
webvowl.util.constants = (function () {

	var constants = {};

	constants.LANG_IRIBASED = "IRI-based";
	constants.LANG_UNDEFINED = "undefined";

	return function () {
		/* Use a function here to keep a consistent style like webvowl.path.to.module()
		 * despite having just a single object. */
		return constants;
	};
})();

// Source: src/js/graph/util/filterTools.js
webvowl.util.filterTools = (function () {

	var tools = {};

	/**
	 * Filters the passed nodes and removes dangling properties.
	 * @param nodes
	 * @param properties
	 * @param shouldKeepNode function that returns true if the node should be kept
	 * @returns {{nodes: Array, properties: Array}} the filtered nodes and properties
	 */
	tools.filterNodesAndTidy = function (nodes, properties, shouldKeepNode) {
		var removedNodes = webvowl.util.set(),
			cleanedNodes = [],
			cleanedProperties = [];

		nodes.forEach(function (node) {
			if (shouldKeepNode(node)) {
				cleanedNodes.push(node);
			} else {
				removedNodes.add(node);
			}
		});

		properties.forEach(function (property) {
			if (propertyHasVisibleNodes(removedNodes, property)) {
				cleanedProperties.push(property);
			} else if (property instanceof webvowl.labels.owldatatypeproperty) {
				// Remove floating datatypes/literals, because they belong to their datatype property
				var index = cleanedNodes.indexOf(property.range());
				if (index >= 0) {
					cleanedNodes.splice(index, 1);
				}
			}
		});

		return {
			nodes: cleanedNodes,
			properties: cleanedProperties
		};
	};

	/**
	 * Returns true, if the domain and the range of this property have not been removed.
	 * @param removedNodes
	 * @param property
	 * @returns {boolean} true if property isn't dangling
	 */
	function propertyHasVisibleNodes(removedNodes, property) {
		return !removedNodes.has(property.domain()) && !removedNodes.has(property.range());
	}


	return function () {
		return tools;
	};
})();

// Source: src/js/graph/util/general.js
"use strict";

var ADDITIONAL_TEXT_SPACE = 4;

/**
 * Add String function to calculate the text field length.
 * @param textStyle The optional special style.
 * @returns {number} The width of the text.
 */
String.prototype.width = function (textStyle) {
	// Set a default value
	if (!textStyle) {
		textStyle = "text";
	}
	var d = d3.select("body")
			.append("div")
			.attr("class", textStyle)
			.attr("id", "width-test") // tag this element to identify it
			.text(this),
		w = document.getElementById("width-test").offsetWidth;
	d.remove();
	return w;
};

/**
 * Function to truncate a string.
 * @param maxLength The maximum length of the text block.
 * @param textStyle The optional special style.
 * @returns {String} The truncated String.
 */
String.prototype.truncate = function (maxLength, textStyle) {
	maxLength -= ADDITIONAL_TEXT_SPACE;
	if (isNaN(maxLength) || maxLength <= 0) {
		return this;
	}

	var text = this,
		textLength = this.length,
		textWidth,
		ratio;

	while (true) {
		textWidth = text.width(textStyle);
		if (textWidth <= maxLength) {
			break;
		}

		ratio = textWidth / maxLength;
		textLength = Math.floor(textLength / ratio);
		text = text.substring(0, textLength);
	}

	if (this.length > textLength) {
		return this.substring(0, textLength - 3) + "...";
	}
	return this;
};

/**
 * Checks if the array contains the specified object.
 * @param obj The object to search for.
 * @returns {boolean}
 */
Array.prototype.contains = function (obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
};

// Source: src/js/graph/util/languageTools.js
/**
 * Encapsulates methods which return a label in a specific language for a preferred language.
 */
webvowl.util.languageTools = (function () {

	var languageTools = {};


	languageTools.textForCurrentLanguage = function (textObject, preferredLanguage) {
		if (typeof textObject === "undefined") {
			return undefined;
		}

		if (typeof textObject === "string") {
			return textObject;
		}

		if (textObject.hasOwnProperty(preferredLanguage)) {
			return textObject[preferredLanguage];
		}

		var textForLanguage = searchLanguage(textObject, "en");
		if (textForLanguage) {
			return textForLanguage;
		}
		textForLanguage = searchLanguage(textObject, webvowl.util.constants().LANG_UNDEFINED);
		if (textForLanguage) {
			return textForLanguage;
		}

		return textObject[webvowl.util.constants().LANG_IRIBASED];
	};


	function searchLanguage (textObject, preferredLanguage) {
		for (var language in textObject) {
			if (language === preferredLanguage && textObject.hasOwnProperty(language)) {
				return textObject[language];
			}
		}
	}

	return function () {
		/* Use a function here to keep a consistent style like webvowl.path.to.module()
		 * despite having just a single languageTools object. */
		return languageTools;
	};
})();

// Source: src/js/graph/util/math.js
/**
 * Contains a collection of mathematical functions with some additional data
 * used for WebVOWL.
 */
webvowl.util.math = (function () {

	var math = {},
		loopFunction = d3.svg.line()
			.x(function (d) {
				return d.x;
			})
			.y(function (d) {
				return d.y;
			})
			.interpolate("cardinal")
			.tension(-1);


	/**
	 * Calculates the normal vector of the path between the two nodes.
	 * @param source the first node
	 * @param target the second node
	 * @param length the length of the calculated normal vector
	 * @returns {{x: number, y: number}}
	 */
	math.calculateNormalVector = function (source, target, length) {
		var dx = target.x - source.x,
			dy = target.y - source.y,

			nx = -dy,
			ny = dx,

			vlength = Math.sqrt(nx * nx + ny * ny),
			ratio = length / vlength;

		return {"x": nx * ratio, "y": ny * ratio};
	};

	/**
	 * Calculates an additional point for the link path. This curve point
	 * will ensure, that no links overlap each other completely.
	 * @param linkStart the position where the link starts - might differ from link.source
	 * @param linkEnd the position where the link ends - might differ from link.target
	 * @param link the associated link
	 * @param linkDistanceMultiplier is multiplied with the default distance two parallel links
	 *                               have from each other
	 * @returns {{x: number, y: number}}
	 */
	math.calculateCurvePoint = function (linkStart, linkEnd, link, linkDistanceMultiplier) {
		var distance = calculateLayeredLinkDistance(link, linkDistanceMultiplier),

		// Find the center of the two points,
			dx = linkEnd.x - linkStart.x,
			dy = linkEnd.y - linkStart.y,

			cx = linkStart.x + dx / 2,
			cy = linkStart.y + dy / 2,

			n = math.calculateNormalVector(linkStart, linkEnd, distance);

		// Every second link shoud be drawn on the opposite of the center
		if (link.layerIndex() % 2 !== 0) {
			n.x = -n.x;
			n.y = -n.y;
		}

		/*
		 If there is a link from A to B, the normal vector will point to the left
		 in movement direction.
		 It there is a link from B to A, the normal vector should point to the right of his
		 own direction to not overlay the other link.
		 */
		if (link.domain().index < link.range().index) {
			n.x = -n.x;
			n.y = -n.y;
		}

		return {"x": cx + n.x, "y": cy + n.y};
	};

	/**
	 * Calculates the height of the layer of the passed link.
	 * @param link the associated link
	 * @param linkDistanceMultiplier is multplied with the default distance
	 * @returns {number}
	 */
	function calculateLayeredLinkDistance(link, linkDistanceMultiplier) {
		var level = Math.floor((link.layerIndex() - link.layerCount() % 2) / 2) + 1,
			isOddLayerCountAsFlag = (link.layerCount() % 2) * 15,
			distance = 0;
		switch (level) {
			case 1:
				distance = 20 + isOddLayerCountAsFlag;
				break;
			case 2:
				distance = 50 + isOddLayerCountAsFlag;
				break;
		}
		return distance * linkDistanceMultiplier;
	}

	/**
	 * Calculates the path for a link, if it is a loop. Currently only working for circlular nodes.
	 * @param link the link
	 * @returns {*}
	 */
	math.calculateLoopPath = function (link) {
		var node = link.domain(),
			loopShiftAngle = 360 / link.loopCount(),
			loopAngle = Math.min(60, loopShiftAngle * 0.8),

			arcFrom = calculateRadian(loopShiftAngle * link.loopIndex()),
			arcTo = calculateRadian((loopShiftAngle * link.loopIndex()) + loopAngle),

			x1 = Math.cos(arcFrom) * node.actualRadius(),
			y1 = Math.sin(arcFrom) * node.actualRadius(),

			x2 = Math.cos(arcTo) * node.actualRadius(),
			y2 = Math.sin(arcTo) * node.actualRadius(),

			fixPoint1 = {"x": node.x + x1, "y": node.y + y1},
			fixPoint2 = {"x": node.x + x2, "y": node.y + y2},

			distanceMultiplier = 2.5,
			dx = ((x1 + x2) / 2) * distanceMultiplier,
			dy = ((y1 + y2) / 2) * distanceMultiplier,
			curvePoint = {"x": node.x + dx, "y": node.y + dy};
		link.curvePoint(curvePoint);

		return loopFunction([fixPoint1, curvePoint, fixPoint2]);
	};

	/**
	 * Calculates the radian of an angle.
	 * @param angle the angle
	 * @returns {number}
	 */
	function calculateRadian(angle) {
		angle = angle % 360;
		if (angle < 0) {
			angle = angle + 360;
		}
		var arc = (2 * Math.PI * angle) / 360;
		if (arc < 0) {
			arc = arc + (2 * Math.PI);
		}
		return arc;
	}

	/**
	 * Calculates the point where the link between the source and target node
	 * intersects the border of the target node.
	 * @param source the source node
	 * @param target the target node
	 * @param additionalDistance additional distance the
	 * @returns {{x: number, y: number}}
	 */
	math.calculateIntersection = function (source, target, additionalDistance) {
		var dx = target.x - source.x,
			dy = target.y - source.y,
			innerDistance;

		if (target instanceof webvowl.nodes.RoundNode) {
			innerDistance = target.actualRadius();
		} else {
			var m_link = Math.abs(dy / dx),
				m_rect = target.height() / target.width();

			if (m_link <= m_rect) {
				var timesX = dx / (target.width() / 2),
					rectY = dy / timesX;
				innerDistance = Math.sqrt(Math.pow(target.width() / 2, 2) + Math.pow(rectY, 2));
			} else {
				var timesY = dy / (target.height() / 2),
					rectX = dx / timesY;
				innerDistance = Math.sqrt(Math.pow(target.height() / 2, 2) + Math.pow(rectX, 2));
			}
		}

		var length = Math.sqrt(dx * dx + dy * dy),
			ratio = (length - (innerDistance + additionalDistance)) / length,
			x = dx * ratio + source.x,
			y = dy * ratio + source.y;

		return {x: x, y: y};
	};


	return function () {
		/* Use a function here to keep a consistent style like webvowl.path.to.module()
		 * despite having just a single math object. */
		return math;
	};
})();

// Source: src/js/graph/util/set.js
/**
 * A simple incomplete encapsulation of the d3 set, which is able to store webvowl
 * elements by using their id.
 */
webvowl.util.set = function (array) {

	var set = {},
		d3Set = d3.set(array);

	set.has = function (webvowlElement) {
		return d3Set.has(webvowlElement.id());
	};

	set.add = function (webvowlElement) {
		return d3Set.add(webvowlElement.id());
	};

	set.remove = function (webvowlElement) {
		return d3Set.remove(webvowlElement.id());
	};

	set.empty = function () {
		return d3Set.empty();
	};

	set.size = function () {
		return d3Set.size();
	};

	return set;
};

// Source: src/js/graph/util/textElement.js
/**
 * Creates a new textblock in the specified element.
 * @param element The element/group where the text block should be appended.
 * @constructor New text block where additional <tspan>'s can be applied to.
 */
webvowl.util.textElement = function (element) {

	var textElement = {},
		LINE_DISTANCE = 1,
		SUBTEXT_CSS_CLASS = "subtext",
		textBlock = element.append("text")
			.classed("text", true)
			.attr("text-anchor", "middle");

	/**
	 * Repositions the textblock according to its own offsetHeight.
	 */
	function repositionTextBlock() {
		// Nothing to do if no child elements exist
		var lineCount = getLineCount();
		if (lineCount < 1) {
			textBlock.attr("y", 0);
			return;
		}

		var textBlockHeight = getTextBlockHeight(textBlock);
		textBlock.attr("y", -textBlockHeight * 0.6 + "px");
	}

	/**
	 * Adds a new line of text to the element.
	 * @param text
	 */
	textElement.addText = function (text) {
		addTextline(text);
	};

	/**
	 * Adds a line of text in subproperty style.
	 * @param text
	 */
	textElement.addSubText = function (text) {
		addTextline(text, SUBTEXT_CSS_CLASS, "(", ")");
	};

	/**
	 * Adds a line of text in equivalent node listing style.
	 * @param text
	 */
	textElement.addEquivalents = function (text) {
		addTextline(text, SUBTEXT_CSS_CLASS, "[", "]");
	};

	/**
	 * Adds a label with the instance count.
	 * @param instanceCount
	 */
	textElement.addInstanceCount = function (instanceCount) {
		if (instanceCount) {
			addTextline(instanceCount.toString(), "instance-count");
		}
	};

	function getLineCount() {
		return textBlock.property("childElementCount") - textBlock.selectAll(".instance-count").size();
	}

	function addTextline(text, subtextCssClass, prefix, postfix) {
		if (!text) {
			return;
		}

		var truncatedText, tspan;

		subtextCssClass = subtextCssClass || "text";
		truncatedText = text.truncate(element.datum().textWidth(), subtextCssClass);

		tspan = textBlock.append("tspan")
			.classed("text", true)
			.classed(subtextCssClass, true)
			.text(applyPreAndPostFix(truncatedText, prefix, postfix))
			.attr("x", 0)
			.attr("dy", function () {
				var heightInPixels = getPixelHeightOfTextLine(d3.select(this)),
					siblingCount = getLineCount() - 1,
					lineDistance = siblingCount > 0 ? LINE_DISTANCE : 0;
				return heightInPixels + lineDistance + "px";
			});

		repositionTextBlock();
	}

	function applyPreAndPostFix(text, prefix, postfix) {
		if (prefix) {
			text = prefix + text;
		}
		if (postfix) {
			text += postfix;
		}
		return text;
	}

	function getPixelHeightOfTextLine(textElement) {
		/* Due to browser incompatibilities this has to be hardcoded. This is because Firefox has no
		 * "offsetHeight" attribute like Chrome to retrieve the absolute pixel height. */
		if (textElement.classed("subtext")) {
			return 10;
		} else {
			return 14;
		}
	}

	function getTextBlockHeight(textBlock) {
		/* Hardcoded due to the same reasons like in the getPixelHeightOfTextLine function. */

		var children = textBlock.selectAll("*"),
			childCount = children.size();
		if (childCount === 0) {
			return 0;
		}

		// Values retrieved by testing
		var pixelHeight = childCount * LINE_DISTANCE;
		children.each(function () {
			pixelHeight += getPixelHeightOfTextLine(d3.select(this));
		});

		return pixelHeight;
	}

	textElement.setTranslation = function (x, y) {
		textBlock.attr("transform", "translate(" + x + ", " + y + ")");
	};

	textElement.clear = function() {
		textBlock.selectAll("*").remove();
	};

	return textElement;
};
