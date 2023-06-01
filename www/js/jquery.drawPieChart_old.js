;(function($, undefined) {
	$.fn.drawPieChart = function(data, options) {
		console.log(data);
		var $this = this,
			W = $this.width(),
			H = $this.width(),
			centerX = W / 2,
			centerY = H / 2,
			cos = Math.cos,
			sin = Math.sin,
			PI = Math.PI,
			settings = $.extend({
				segmentShowStroke: true,
				segmentStrokeColor: "#fff",
				segmentStrokeWidth: 1,
				baseColor: "#fff",
				baseOffset: 15,
				edgeOffset: 30, //offset from edge of $this
				pieSegmentGroupClass: "pieSegmentGroup",
				pieSegmentClass: "pieSegment",
				lightPiesOffset: 0, //lighten pie's width 12
				lightPiesOpacity: .3, //lighten pie's default opacity
				lightPieClass: "lightPie",
				animation: true,
				animationSteps: 90,
				animationEasing: "easeInOutExpo",
				tipOffsetX: -15,
				tipOffsetY: -45,
				tipClass: "pieTip",
				beforeDraw: function() {},
				afterDrawed: function() {},
				onPieMouseenter: function(e, data) {},
				onPieMouseleave: function(e, data) {},
				onPieClick: function(e, data) {}
			}, options),
			animationOptions = {
				linear: function(t) {
					return t;
				},
				easeInOutExpo: function(t) {
					var v = t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
					return (v > 1) ? 1 : v;
				}
			},
			requestAnimFrame = function() {
				return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
					window.setTimeout(callback, 1000 / 60);
				};
			}();
		if (W < 320) {
			var min_div = 4;
			console.log("True");
		} else if (W >= 350 && W <= 385) {
			console.log("351<400");
			var min_div = -15;
		} else {
			var min_div = -10;
			console.log("False");
		}
		var $wrapper = $('<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><\/svg>').appendTo($this);
		var $groups = [],
			$pies = [],
			$lightPies = [];
		var easingFunction = animationOptions[settings.animationEasing];
		var pieRadius = (Min([H / 2, W / 2]) - settings.edgeOffset) + min_div; //SVG Circle Radius
		var segmentTotal = 0;
		//Draw base circle
		var drawBasePie = function() {
			var base = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
			var $base = $(base).appendTo($wrapper);
			base.setAttribute("cx", centerX);
			base.setAttribute("cy", centerY);
			base.setAttribute("r", pieRadius); //+settings.baseOffset);
			base.setAttribute("fill", settings.baseColor);
		}();
		//Set up pie segments wrapper
		var pathGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		var $pathGroup = $(pathGroup).appendTo($wrapper);
		$pathGroup[0].setAttribute("opacity", 0);
		//Set up tooltip
		var $tip = $('<div class="' + settings.tipClass + '" />').appendTo('body').hide(),
			tipW = W,
			tipH = W;
		/* tipW = $tip.width(),
		 tipH = $tip.height();*/
		console.log(tipW + "+" + tipH);
		for (var i = 0, len = data.length; i < len; i++) {
			//segmentTotal += data[i].value;
			var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
			event_id = data[i].id;
			event_name = data[i].title;
			// g.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href','http://www.google.com');
			g.setAttribute("data-order", i);
			g.setAttribute("event-id", event_id);
			g.setAttribute("event-name", event_name);
			g.setAttribute("class", settings.pieSegmentGroupClass);
			$groups[i] = $(g).appendTo($pathGroup);
			$groups[i].on("mouseenter", pathMouseEnter).on("mouseleave", pathMouseLeave).on("mousemove", pathMouseMove).on("click", pathClick);
			var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			p.setAttribute("stroke-width", settings.segmentStrokeWidth);
			p.setAttribute("stroke", settings.segmentStrokeColor);
			p.setAttribute("stroke-miterlimit", 2);
			p.setAttribute("fill", data[i].color);
			p.setAttribute("class", settings.pieSegmentClass);
			$pies[i] = $(p).appendTo($groups[i]);
			var lp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			lp.setAttribute("stroke-width", settings.segmentStrokeWidth);
			lp.setAttribute("stroke", settings.segmentStrokeColor);
			lp.setAttribute("stroke-miterlimit", 2);
			lp.setAttribute("fill", data[i].color);
			lp.setAttribute("opacity", settings.lightPiesOpacity);
			lp.setAttribute("class", settings.lightPieClass);
			$lightPies[i] = $(lp).appendTo($groups[i]);
			//create new element
			/*            var hr=[];
			            var svg = document.getElementsByTagName('svg')[0]; //Get svg element
			            var hr=document.createElementNS('http://www.w3.org/2000/svg','line');
			            //<line id="hour0" x1="100" y1="10"  x2="100" y2="0"/>
			            hr.setAttribute("id","1");
			            hr.setAttribute('x1','100');
			            hr.setAttribute('y1','10');
			            hr.setAttribute('x2','100');
			            hr.setAttribute('y2','0');
			            hr.textContent = 'Hour';
			            svg.appendChild(hr);//element like <line>, <circle>*/
		}
		settings.beforeDraw.call($this);
	//Animation start
		triggerAnimation();

		function pathMouseEnter(e) {
			var index = $(this).data().order;
			$tip.text(data[index].title).fadeIn(200);
			if ($groups[index][0].getAttribute("data-active") !== "active") {
				$lightPies[index].animate({
					opacity: .8
				}, 20);
			}
			settings.onPieMouseenter.apply($(this), [e, data]);
		}

		function pathMouseLeave(e) {
			var index = $(this).data().order;
			$tip.hide();
			if ($groups[index][0].getAttribute("data-active") !== "active") {
				$lightPies[index].animate({
					opacity: settings.lightPiesOpacity
				}, 100);
			}
			settings.onPieMouseleave.apply($(this), [e, data]);
		}

		function pathMouseMove(e) {
			$tip.css({
				top: e.pageY + settings.tipOffsetY,
				left: e.pageX - W / 4 + settings.tipOffsetX
			});
		}

		function pathClick(e) {
			var index = $(this).data().order;
			var targetGroup = $groups[index][0];
			for (var i = 0, len = data.length; i < len; i++) {
				if (i === index) continue;
				$groups[i][0].setAttribute("data-active", "");
				$lightPies[i].css({
					opacity: settings.lightPiesOpacity
				});
			}
			if (targetGroup.getAttribute("data-active") === "active") {
				targetGroup.setAttribute("data-active", "");
				$lightPies[index].css({
					opacity: .8
				});
			} else {
				targetGroup.setAttribute("data-active", "active");
				$lightPies[index].css({
					opacity: 1
				});
			}
			settings.onPieClick.apply($(this), [e, data]);
		}

		/*****************************************************************************************************/
		function drawPieSegments(animationDecimal) {
			//var startRadius = -PI/2,//-90 degree
			//var startRadius = (data[0].value-90) * Math.PI / 180.0,//-90 degree
			rotateAnimation = 1;
			if (settings.animation) {
				rotateAnimation = animationDecimal; //count up between0~1
			}
			$pathGroup[0].setAttribute("opacity", animationDecimal);
			//draw each path
			for (var i = 0, len = data.length; i < len; i++) {
				var startRadius = (data[i].start - 90) * Math.PI / 180.0, //-90 degree
					endRadius = (data[i].end - 90) * Math.PI / 180.0,
					largeArc = ((endRadius - startRadius) % (PI * 2)) > PI ? 1 : 0,
					startX = centerX + cos(startRadius) * pieRadius,
					startY = centerY + sin(startRadius) * pieRadius,
					endX = centerX + cos(endRadius) * pieRadius,
					endY = centerY + sin(endRadius) * pieRadius,
					startX2 = centerX + cos(startRadius) * (pieRadius + settings.lightPiesOffset),
					startY2 = centerY + sin(startRadius) * (pieRadius + settings.lightPiesOffset),
					endX2 = centerX + cos(endRadius) * (pieRadius + settings.lightPiesOffset),
					endY2 = centerY + sin(endRadius) * (pieRadius + settings.lightPiesOffset);
				var cmd = ['M', startX, startY, //Move pointer
					'A', pieRadius, pieRadius, 0, largeArc, 1, endX, endY, //Draw outer arc path
					'L', centerX, centerY, //Draw line to the center.
					'Z' //Cloth path
				];
				var cmd2 = ['M', startX2, startY2, 'A', pieRadius + settings.lightPiesOffset, pieRadius + settings.lightPiesOffset, 0, largeArc, 1, endX2, endY2, //Draw outer arc path
					'L', centerX, centerY, 'Z'
				];
				$pies[i][0].setAttribute("d", cmd.join(' '));
				$lightPies[i][0].setAttribute("d", cmd2.join(' '));
				//startRadius += segmentAngle;
				//startRadius = (data[i].value-90) * Math.PI / 180.0;
			}
		}
		/*****************************************************************************************************/
		var animFrameAmount = (settings.animation) ? 1 / settings.animationSteps : 1, //if settings.animationSteps is 10, animFrameAmount is 0.1
			animCount = (settings.animation) ? 0 : 1;

		function triggerAnimation() {
			if (settings.animation) {
				requestAnimFrame(animationLoop);
			} else {
				drawPieSegments(1);
			}
		}

		function animationLoop() {
			animCount += animFrameAmount; //animCount start from 0, after "settings.animationSteps"-times executed, animCount reaches 1.
			drawPieSegments(easingFunction(animCount));
			if (animCount < 1) {
				requestAnimFrame(arguments.callee);
			} else {
				settings.afterDrawed.call($this);
			}
		}

		function Max(arr) {
			return Math.max.apply(null, arr);
		}

		function Min(arr) {
			return Math.min.apply(null, arr);
		}
		return $this;
	};
})(jQuery);

//////////Mouse Click for Event Edit///////////////
$(document).on('click', '.pieSegmentGroup', function() {
	var eid = $(this).attr('event-id');
	if (eid >= 1) {
		var url = "newevent.html?module=create_event&type=day&event_id=" + eid;
		//alert(url);
		document.write("<span style='display:none;'>" + url + "<\/span>");
		window.location.assign(url);
		//$(location).attr('href',url);
	} else {
		alert("No Events Found..!");
	}
});
//////////////////////////////////////////////////////