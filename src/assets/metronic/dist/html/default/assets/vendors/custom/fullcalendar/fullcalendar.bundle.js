(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define([ 'jquery', 'moment' ], factory);
	}
	else if (typeof exports === 'object') { 
		module.exports = factory(require('jquery'), require('moment'));
	}
	else {
		factory(jQuery, moment);
	}
})(function($, moment) {
;;
var FC = $.fullCalendar = {
	version: "3.6.2",
	internalApiVersion: 11
};
var fcViews = FC.views = {};
$.fn.fullCalendar = function(options) {
	var args = Array.prototype.slice.call(arguments, 1); 
	var res = this; 
	this.each(function(i, _element) { 
		var element = $(_element);
		var calendar = element.data('fullCalendar'); 
		var singleRes; 
		if (typeof options === 'string') {
			if (options === 'getCalendar') {
				if (!i) { 
					res = calendar;
				}
			}
			else if (options === 'destroy') { 
				if (calendar) {
					calendar.destroy();
					element.removeData('fullCalendar');
				}
			}
			else if (!calendar) {
				FC.warn("Attempting to call a FullCalendar method on an element with no calendar.");
			}
			else if ($.isFunction(calendar[options])) {
				singleRes = calendar[options].apply(calendar, args);
				if (!i) {
					res = singleRes; 
				}
				if (options === 'destroy') { 
					element.removeData('fullCalendar');
				}
			}
			else {
				FC.warn("'" + options + "' is an unknown FullCalendar method.");
			}
		}
		else if (!calendar) { 
			calendar = new Calendar(element, options);
			element.data('fullCalendar', calendar);
			calendar.render();
		}
	});
	return res;
};
var complexOptions = [ 
	'header',
	'footer',
	'buttonText',
	'buttonIcons',
	'themeButtonIcons'
];
function mergeOptions(optionObjs) {
	return mergeProps(optionObjs, complexOptions);
}
;;
FC.applyAll = applyAll;
FC.debounce = debounce;
FC.isInt = isInt;
FC.htmlEscape = htmlEscape;
FC.cssToStr = cssToStr;
FC.proxy = proxy;
FC.capitaliseFirstLetter = capitaliseFirstLetter;
function compensateScroll(rowEls, scrollbarWidths) {
	if (scrollbarWidths.left) {
		rowEls.css({
			'border-left-width': 1,
			'margin-left': scrollbarWidths.left - 1
		});
	}
	if (scrollbarWidths.right) {
		rowEls.css({
			'border-right-width': 1,
			'margin-right': scrollbarWidths.right - 1
		});
	}
}
function uncompensateScroll(rowEls) {
	rowEls.css({
		'margin-left': '',
		'margin-right': '',
		'border-left-width': '',
		'border-right-width': ''
	});
}
function disableCursor() {
	$('body').addClass('fc-not-allowed');
}
function enableCursor() {
	$('body').removeClass('fc-not-allowed');
}
function distributeHeight(els, availableHeight, shouldRedistribute) {
	var minOffset1 = Math.floor(availableHeight / els.length); 
	var minOffset2 = Math.floor(availableHeight - minOffset1 * (els.length - 1)); 
	var flexEls = []; 
	var flexOffsets = []; 
	var flexHeights = []; 
	var usedHeight = 0;
	undistributeHeight(els); 
	els.each(function(i, el) {
		var minOffset = i === els.length - 1 ? minOffset2 : minOffset1;
		var naturalOffset = $(el).outerHeight(true);
		if (naturalOffset < minOffset) {
			flexEls.push(el);
			flexOffsets.push(naturalOffset);
			flexHeights.push($(el).height());
		}
		else {
			usedHeight += naturalOffset;
		}
	});
	if (shouldRedistribute) {
		availableHeight -= usedHeight;
		minOffset1 = Math.floor(availableHeight / flexEls.length);
		minOffset2 = Math.floor(availableHeight - minOffset1 * (flexEls.length - 1)); 
	}
	$(flexEls).each(function(i, el) {
		var minOffset = i === flexEls.length - 1 ? minOffset2 : minOffset1;
		var naturalOffset = flexOffsets[i];
		var naturalHeight = flexHeights[i];
		var newHeight = minOffset - (naturalOffset - naturalHeight); 
		if (naturalOffset < minOffset) { 
			$(el).height(newHeight);
		}
	});
}
function undistributeHeight(els) {
	els.height('');
}
function matchCellWidths(els) {
	var maxInnerWidth = 0;
	els.find('> *').each(function(i, innerEl) {
		var innerWidth = $(innerEl).outerWidth();
		if (innerWidth > maxInnerWidth) {
			maxInnerWidth = innerWidth;
		}
	});
	maxInnerWidth++; 
	els.width(maxInnerWidth);
	return maxInnerWidth;
}
function subtractInnerElHeight(outerEl, innerEl) {
	var both = outerEl.add(innerEl);
	var diff;
	both.css({
		position: 'relative', 
		left: -1 
	});
	diff = outerEl.outerHeight() - innerEl.outerHeight(); 
	both.css({ position: '', left: '' }); 
	return diff;
}
FC.getOuterRect = getOuterRect;
FC.getClientRect = getClientRect;
FC.getContentRect = getContentRect;
FC.getScrollbarWidths = getScrollbarWidths;
function getScrollParent(el) {
	var position = el.css('position'),
		scrollParent = el.parents().filter(function() {
			var parent = $(this);
			return (/(auto|scroll)/).test(
				parent.css('overflow') + parent.css('overflow-y') + parent.css('overflow-x')
			);
		}).eq(0);
	return position === 'fixed' || !scrollParent.length ? $(el[0].ownerDocument || document) : scrollParent;
}
function getOuterRect(el, origin) {
	var offset = el.offset();
	var left = offset.left - (origin ? origin.left : 0);
	var top = offset.top - (origin ? origin.top : 0);
	return {
		left: left,
		right: left + el.outerWidth(),
		top: top,
		bottom: top + el.outerHeight()
	};
}
function getClientRect(el, origin) {
	var offset = el.offset();
	var scrollbarWidths = getScrollbarWidths(el);
	var left = offset.left + getCssFloat(el, 'border-left-width') + scrollbarWidths.left - (origin ? origin.left : 0);
	var top = offset.top + getCssFloat(el, 'border-top-width') + scrollbarWidths.top - (origin ? origin.top : 0);
	return {
		left: left,
		right: left + el[0].clientWidth, 
		top: top,
		bottom: top + el[0].clientHeight 
	};
}
function getContentRect(el, origin) {
	var offset = el.offset(); 
	var left = offset.left + getCssFloat(el, 'border-left-width') + getCssFloat(el, 'padding-left') -
		(origin ? origin.left : 0);
	var top = offset.top + getCssFloat(el, 'border-top-width') + getCssFloat(el, 'padding-top') -
		(origin ? origin.top : 0);
	return {
		left: left,
		right: left + el.width(),
		top: top,
		bottom: top + el.height()
	};
}
function getScrollbarWidths(el) {
	var leftRightWidth = el[0].offsetWidth - el[0].clientWidth;
	var bottomWidth = el[0].offsetHeight - el[0].clientHeight;
	var widths;
	leftRightWidth = sanitizeScrollbarWidth(leftRightWidth);
	bottomWidth = sanitizeScrollbarWidth(bottomWidth);
	widths = { left: 0, right: 0, top: 0, bottom: bottomWidth };
	if (getIsLeftRtlScrollbars() && el.css('direction') == 'rtl') { 
		widths.left = leftRightWidth;
	}
	else {
		widths.right = leftRightWidth;
	}
	return widths;
}
function sanitizeScrollbarWidth(width) {
	width = Math.max(0, width); 
	width = Math.round(width);
	return width;
}
var _isLeftRtlScrollbars = null;
function getIsLeftRtlScrollbars() { 
	if (_isLeftRtlScrollbars === null) {
		_isLeftRtlScrollbars = computeIsLeftRtlScrollbars();
	}
	return _isLeftRtlScrollbars;
}
function computeIsLeftRtlScrollbars() { 
	var el = $('<div><div/></div>')
		.css({
			position: 'absolute',
			top: -1000,
			left: 0,
			border: 0,
			padding: 0,
			overflow: 'scroll',
			direction: 'rtl'
		})
		.appendTo('body');
	var innerEl = el.children();
	var res = innerEl.offset().left > el.offset().left; 
	el.remove();
	return res;
}
function getCssFloat(el, prop) {
	return parseFloat(el.css(prop)) || 0;
}
FC.preventDefault = preventDefault;
function isPrimaryMouseButton(ev) {
	return ev.which == 1 && !ev.ctrlKey;
}
function getEvX(ev) {
	var touches = ev.originalEvent.touches;
	if (touches && touches.length) {
		return touches[0].pageX;
	}
	return ev.pageX;
}
function getEvY(ev) {
	var touches = ev.originalEvent.touches;
	if (touches && touches.length) {
		return touches[0].pageY;
	}
	return ev.pageY;
}
function getEvIsTouch(ev) {
	return /^touch/.test(ev.type);
}
function preventSelection(el) {
	el.addClass('fc-unselectable')
		.on('selectstart', preventDefault);
}
function allowSelection(el) {
	el.removeClass('fc-unselectable')
		.off('selectstart', preventDefault);
}
function preventDefault(ev) {
	ev.preventDefault();
}
FC.intersectRects = intersectRects;
function intersectRects(rect1, rect2) {
	var res = {
		left: Math.max(rect1.left, rect2.left),
		right: Math.min(rect1.right, rect2.right),
		top: Math.max(rect1.top, rect2.top),
		bottom: Math.min(rect1.bottom, rect2.bottom)
	};
	if (res.left < res.right && res.top < res.bottom) {
		return res;
	}
	return false;
}
function constrainPoint(point, rect) {
	return {
		left: Math.min(Math.max(point.left, rect.left), rect.right),
		top: Math.min(Math.max(point.top, rect.top), rect.bottom)
	};
}
function getRectCenter(rect) {
	return {
		left: (rect.left + rect.right) / 2,
		top: (rect.top + rect.bottom) / 2
	};
}
function diffPoints(point1, point2) {
	return {
		left: point1.left - point2.left,
		top: point1.top - point2.top
	};
}
FC.parseFieldSpecs = parseFieldSpecs;
FC.compareByFieldSpecs = compareByFieldSpecs;
FC.compareByFieldSpec = compareByFieldSpec;
FC.flexibleCompare = flexibleCompare;
function parseFieldSpecs(input) {
	var specs = [];
	var tokens = [];
	var i, token;
	if (typeof input === 'string') {
		tokens = input.split(/\s*,\s*/);
	}
	else if (typeof input === 'function') {
		tokens = [ input ];
	}
	else if ($.isArray(input)) {
		tokens = input;
	}
	for (i = 0; i < tokens.length; i++) {
		token = tokens[i];
		if (typeof token === 'string') {
			specs.push(
				token.charAt(0) == '-' ?
					{ field: token.substring(1), order: -1 } :
					{ field: token, order: 1 }
			);
		}
		else if (typeof token === 'function') {
			specs.push({ func: token });
		}
	}
	return specs;
}
function compareByFieldSpecs(obj1, obj2, fieldSpecs) {
	var i;
	var cmp;
	for (i = 0; i < fieldSpecs.length; i++) {
		cmp = compareByFieldSpec(obj1, obj2, fieldSpecs[i]);
		if (cmp) {
			return cmp;
		}
	}
	return 0;
}
function compareByFieldSpec(obj1, obj2, fieldSpec) {
	if (fieldSpec.func) {
		return fieldSpec.func(obj1, obj2);
	}
	return flexibleCompare(obj1[fieldSpec.field], obj2[fieldSpec.field]) *
		(fieldSpec.order || 1);
}
function flexibleCompare(a, b) {
	if (!a && !b) {
		return 0;
	}
	if (b == null) {
		return -1;
	}
	if (a == null) {
		return 1;
	}
	if ($.type(a) === 'string' || $.type(b) === 'string') {
		return String(a).localeCompare(String(b));
	}
	return a - b;
}
FC.computeGreatestUnit = computeGreatestUnit;
FC.divideRangeByDuration = divideRangeByDuration;
FC.divideDurationByDuration = divideDurationByDuration;
FC.multiplyDuration = multiplyDuration;
FC.durationHasTime = durationHasTime;
var dayIDs = [ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ];
var unitsDesc = [ 'year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond' ]; 
function diffDayTime(a, b) {
	return moment.duration({
		days: a.clone().stripTime().diff(b.clone().stripTime(), 'days'),
		ms: a.time() - b.time() 
	});
}
function diffDay(a, b) {
	return moment.duration({
		days: a.clone().stripTime().diff(b.clone().stripTime(), 'days')
	});
}
function diffByUnit(a, b, unit) {
	return moment.duration(
		Math.round(a.diff(b, unit, true)), 
		unit
	);
}
function computeGreatestUnit(start, end) {
	var i, unit;
	var val;
	for (i = 0; i < unitsDesc.length; i++) {
		unit = unitsDesc[i];
		val = computeRangeAs(unit, start, end);
		if (val >= 1 && isInt(val)) {
			break;
		}
	}
	return unit; 
}
function computeDurationGreatestUnit(duration, durationInput) {
	var unit = computeGreatestUnit(duration);
	if (unit === 'week' && typeof durationInput === 'object' && durationInput.days) {
		unit = 'day';
	}
	return unit;
}
function computeRangeAs(unit, start, end) {
	if (end != null) { 
		return end.diff(start, unit, true);
	}
	else if (moment.isDuration(start)) { 
		return start.as(unit);
	}
	else { 
		return start.end.diff(start.start, unit, true);
	}
}
function divideRangeByDuration(start, end, dur) {
	var months;
	if (durationHasTime(dur)) {
		return (end - start) / dur;
	}
	months = dur.asMonths();
	if (Math.abs(months) >= 1 && isInt(months)) {
		return end.diff(start, 'months', true) / months;
	}
	return end.diff(start, 'days', true) / dur.asDays();
}
function divideDurationByDuration(dur1, dur2) {
	var months1, months2;
	if (durationHasTime(dur1) || durationHasTime(dur2)) {
		return dur1 / dur2;
	}
	months1 = dur1.asMonths();
	months2 = dur2.asMonths();
	if (
		Math.abs(months1) >= 1 && isInt(months1) &&
		Math.abs(months2) >= 1 && isInt(months2)
	) {
		return months1 / months2;
	}
	return dur1.asDays() / dur2.asDays();
}
function multiplyDuration(dur, n) {
	var months;
	if (durationHasTime(dur)) {
		return moment.duration(dur * n);
	}
	months = dur.asMonths();
	if (Math.abs(months) >= 1 && isInt(months)) {
		return moment.duration({ months: months * n });
	}
	return moment.duration({ days: dur.asDays() * n });
}
function durationHasTime(dur) {
	return Boolean(dur.hours() || dur.minutes() || dur.seconds() || dur.milliseconds());
}
function isNativeDate(input) {
	return  Object.prototype.toString.call(input) === '[object Date]' || input instanceof Date;
}
function isTimeString(str) {
	return typeof str === 'string' &&
		/^\d+\:\d+(?:\:\d+\.?(?:\d{3})?)?$/.test(str);
}
FC.log = function() {
	var console = window.console;
	if (console && console.log) {
		return console.log.apply(console, arguments);
	}
};
FC.warn = function() {
	var console = window.console;
	if (console && console.warn) {
		return console.warn.apply(console, arguments);
	}
	else {
		return FC.log.apply(FC, arguments);
	}
};
var hasOwnPropMethod = {}.hasOwnProperty;
function mergeProps(propObjs, complexProps) {
	var dest = {};
	var i, name;
	var complexObjs;
	var j, val;
	var props;
	if (complexProps) {
		for (i = 0; i < complexProps.length; i++) {
			name = complexProps[i];
			complexObjs = [];
			for (j = propObjs.length - 1; j >= 0; j--) {
				val = propObjs[j][name];
				if (typeof val === 'object') {
					complexObjs.unshift(val);
				}
				else if (val !== undefined) {
					dest[name] = val; 
					break;
				}
			}
			if (complexObjs.length) {
				dest[name] = mergeProps(complexObjs);
			}
		}
	}
	for (i = propObjs.length - 1; i >= 0; i--) {
		props = propObjs[i];
		for (name in props) {
			if (!(name in dest)) { 
				dest[name] = props[name];
			}
		}
	}
	return dest;
}
function copyOwnProps(src, dest) {
	for (var name in src) {
		if (hasOwnProp(src, name)) {
			dest[name] = src[name];
		}
	}
}
function hasOwnProp(obj, name) {
	return hasOwnPropMethod.call(obj, name);
}
function applyAll(functions, thisObj, args) {
	if ($.isFunction(functions)) {
		functions = [ functions ];
	}
	if (functions) {
		var i;
		var ret;
		for (i=0; i<functions.length; i++) {
			ret = functions[i].apply(thisObj, args) || ret;
		}
		return ret;
	}
}
function removeMatching(array, testFunc) {
	var removeCnt = 0;
	var i = 0;
	while (i < array.length) {
		if (testFunc(array[i])) { 
			array.splice(i, 1);
			removeCnt++;
		}
		else {
			i++;
		}
	}
	return removeCnt;
}
function removeExact(array, exactVal) {
	var removeCnt = 0;
	var i = 0;
	while (i < array.length) {
		if (array[i] === exactVal) {
			array.splice(i, 1);
			removeCnt++;
		}
		else {
			i++;
		}
	}
	return removeCnt;
}
FC.removeExact = removeExact;
function isArraysEqual(a0, a1) {
	var len = a0.length;
	var i;
	if (len == null || len !== a1.length) { 
		return false;
	}
	for (i = 0; i < len; i++) {
		if (a0[i] !== a1[i]) {
			return false;
		}
	}
	return true;
}
function firstDefined() {
	for (var i=0; i<arguments.length; i++) {
		if (arguments[i] !== undefined) {
			return arguments[i];
		}
	}
}
function htmlEscape(s) {
	return (s + '').replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/'/g, '&#039;')
		.replace(/"/g, '&quot;')
		.replace(/\n/g, '<br />');
}
function stripHtmlEntities(text) {
	return text.replace(/&.*?;/g, '');
}
function cssToStr(cssProps) {
	var statements = [];
	$.each(cssProps, function(name, val) {
		if (val != null) {
			statements.push(name + ':' + val);
		}
	});
	return statements.join(';');
}
function attrsToStr(attrs) {
	var parts = [];
	$.each(attrs, function(name, val) {
		if (val != null) {
			parts.push(name + '="' + htmlEscape(val) + '"');
		}
	});
	return parts.join(' ');
}
function capitaliseFirstLetter(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
function compareNumbers(a, b) { 
	return a - b;
}
function isInt(n) {
	return n % 1 === 0;
}
function proxy(obj, methodName) {
	var method = obj[methodName];
	return function() {
		return method.apply(obj, arguments);
	};
}
function debounce(func, wait, immediate) {
	var timeout, args, context, timestamp, result;
	var later = function() {
		var last = +new Date() - timestamp;
		if (last < wait) {
			timeout = setTimeout(later, wait - last);
		}
		else {
			timeout = null;
			if (!immediate) {
				result = func.apply(context, args);
				context = args = null;
			}
		}
	};
	return function() {
		context = this;
		args = arguments;
		timestamp = +new Date();
		var callNow = immediate && !timeout;
		if (!timeout) {
			timeout = setTimeout(later, wait);
		}
		if (callNow) {
			result = func.apply(context, args);
			context = args = null;
		}
		return result;
	};
}
;;
var ambigDateOfMonthRegex = /^\s*\d{4}-\d\d$/;
var ambigTimeOrZoneRegex =
	/^\s*\d{4}-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?)?$/;
var newMomentProto = moment.fn; 
var oldMomentProto = $.extend({}, newMomentProto); 
var momentProperties = moment.momentProperties;
momentProperties.push('_fullCalendar');
momentProperties.push('_ambigTime');
momentProperties.push('_ambigZone');
FC.moment = function() {
	return makeMoment(arguments);
};
FC.moment.utc = function() {
	var mom = makeMoment(arguments, true);
	if (mom.hasTime()) { 
		mom.utc();
	}
	return mom;
};
FC.moment.parseZone = function() {
	return makeMoment(arguments, true, true);
};
function makeMoment(args, parseAsUTC, parseZone) {
	var input = args[0];
	var isSingleString = args.length == 1 && typeof input === 'string';
	var isAmbigTime;
	var isAmbigZone;
	var ambigMatch;
	var mom;
	if (moment.isMoment(input) || isNativeDate(input) || input === undefined) {
		mom = moment.apply(null, args);
	}
	else { 
		isAmbigTime = false;
		isAmbigZone = false;
		if (isSingleString) {
			if (ambigDateOfMonthRegex.test(input)) {
				input += '-01';
				args = [ input ]; 
				isAmbigTime = true;
				isAmbigZone = true;
			}
			else if ((ambigMatch = ambigTimeOrZoneRegex.exec(input))) {
				isAmbigTime = !ambigMatch[5]; 
				isAmbigZone = true;
			}
		}
		else if ($.isArray(input)) {
			isAmbigZone = true;
		}
		if (parseAsUTC || isAmbigTime) {
			mom = moment.utc.apply(moment, args);
		}
		else {
			mom = moment.apply(null, args);
		}
		if (isAmbigTime) {
			mom._ambigTime = true;
			mom._ambigZone = true; 
		}
		else if (parseZone) { 
			if (isAmbigZone) {
				mom._ambigZone = true;
			}
			else if (isSingleString) {
				mom.utcOffset(input); 
			}
		}
	}
	mom._fullCalendar = true; 
	return mom;
}
newMomentProto.week = newMomentProto.weeks = function(input) {
	var weekCalc = this._locale._fullCalendar_weekCalc;
	if (input == null && typeof weekCalc === 'function') { 
		return weekCalc(this);
	}
	else if (weekCalc === 'ISO') {
		return oldMomentProto.isoWeek.apply(this, arguments); 
	}
	return oldMomentProto.week.apply(this, arguments); 
};
newMomentProto.time = function(time) {
	if (!this._fullCalendar) {
		return oldMomentProto.time.apply(this, arguments);
	}
	if (time == null) { 
		return moment.duration({
			hours: this.hours(),
			minutes: this.minutes(),
			seconds: this.seconds(),
			milliseconds: this.milliseconds()
		});
	}
	else { 
		this._ambigTime = false; 
		if (!moment.isDuration(time) && !moment.isMoment(time)) {
			time = moment.duration(time);
		}
		var dayHours = 0;
		if (moment.isDuration(time)) {
			dayHours = Math.floor(time.asDays()) * 24;
		}
		return this.hours(dayHours + time.hours())
			.minutes(time.minutes())
			.seconds(time.seconds())
			.milliseconds(time.milliseconds());
	}
};
newMomentProto.stripTime = function() {
	if (!this._ambigTime) {
		this.utc(true); 
		this.set({
			hours: 0,
			minutes: 0,
			seconds: 0,
			ms: 0
		});
		this._ambigTime = true;
		this._ambigZone = true; 
	}
	return this; 
};
newMomentProto.hasTime = function() {
	return !this._ambigTime;
};
newMomentProto.stripZone = function() {
	var wasAmbigTime;
	if (!this._ambigZone) {
		wasAmbigTime = this._ambigTime;
		this.utc(true); 
		this._ambigTime = wasAmbigTime || false;
		this._ambigZone = true;
	}
	return this; 
};
newMomentProto.hasZone = function() {
	return !this._ambigZone;
};
newMomentProto.local = function(keepLocalTime) {
	oldMomentProto.local.call(this, this._ambigZone || keepLocalTime);
	this._ambigTime = false;
	this._ambigZone = false;
	return this; 
};
newMomentProto.utc = function(keepLocalTime) {
	oldMomentProto.utc.call(this, keepLocalTime);
	this._ambigTime = false;
	this._ambigZone = false;
	return this;
};
newMomentProto.utcOffset = function(tzo) {
	if (tzo != null) { 
		this._ambigTime = false;
		this._ambigZone = false;
	}
	return oldMomentProto.utcOffset.apply(this, arguments);
};
newMomentProto.format = function() {
	if (this._fullCalendar && arguments[0]) { 
		return formatDate(this, arguments[0]); 
	}
	if (this._ambigTime) {
		return oldMomentFormat(englishMoment(this), 'YYYY-MM-DD');
	}
	if (this._ambigZone) {
		return oldMomentFormat(englishMoment(this), 'YYYY-MM-DD[T]HH:mm:ss');
	}
	if (this._fullCalendar) { 
		return oldMomentFormat(englishMoment(this));
	}
	return oldMomentProto.format.apply(this, arguments);
};
newMomentProto.toISOString = function() {
	if (this._ambigTime) {
		return oldMomentFormat(englishMoment(this), 'YYYY-MM-DD');
	}
	if (this._ambigZone) {
		return oldMomentFormat(englishMoment(this), 'YYYY-MM-DD[T]HH:mm:ss');
	}
	if (this._fullCalendar) { 
		return oldMomentProto.toISOString.apply(englishMoment(this), arguments);
	}
	return oldMomentProto.toISOString.apply(this, arguments);
};
function englishMoment(mom) {
	if (mom.locale() !== 'en') {
		return mom.clone().locale('en');
	}
	return mom;
}
;;
(function() {
FC.formatDate = formatDate;
FC.formatRange = formatRange;
FC.oldMomentFormat = oldMomentFormat;
FC.queryMostGranularFormatUnit = queryMostGranularFormatUnit;
var PART_SEPARATOR = '\u000b'; 
var SPECIAL_TOKEN_MARKER = '\u001f'; 
var MAYBE_MARKER = '\u001e'; 
var MAYBE_REGEXP = new RegExp(MAYBE_MARKER + '([^' + MAYBE_MARKER + ']*)' + MAYBE_MARKER, 'g'); 
var specialTokens = {
	t: function(date) { 
		return oldMomentFormat(date, 'a').charAt(0);
	},
	T: function(date) { 
		return oldMomentFormat(date, 'A').charAt(0);
	}
};
var largeTokenMap = {
	Y: { value: 1, unit: 'year' },
	M: { value: 2, unit: 'month' },
	W: { value: 3, unit: 'week' }, 
	w: { value: 3, unit: 'week' }, 
	D: { value: 4, unit: 'day' }, 
	d: { value: 4, unit: 'day' } 
};
function formatDate(date, formatStr) {
	return renderFakeFormatString(
		getParsedFormatString(formatStr).fakeFormatString,
		date
	);
}
function oldMomentFormat(mom, formatStr) {
	return oldMomentProto.format.call(mom, formatStr); 
}
function formatRange(date1, date2, formatStr, separator, isRTL) {
	var localeData;
	date1 = FC.moment.parseZone(date1);
	date2 = FC.moment.parseZone(date2);
	localeData = date1.localeData();
	formatStr = localeData.longDateFormat(formatStr) || formatStr;
	return renderParsedFormat(
		getParsedFormatString(formatStr),
		date1,
		date2,
		separator || ' - ',
		isRTL
	);
}
function renderParsedFormat(parsedFormat, date1, date2, separator, isRTL) {
	var sameUnits = parsedFormat.sameUnits;
	var unzonedDate1 = date1.clone().stripZone(); 
	var unzonedDate2 = date2.clone().stripZone(); 
	var renderedParts1 = renderFakeFormatStringParts(parsedFormat.fakeFormatString, date1);
	var renderedParts2 = renderFakeFormatStringParts(parsedFormat.fakeFormatString, date2);
	var leftI;
	var leftStr = '';
	var rightI;
	var rightStr = '';
	var middleI;
	var middleStr1 = '';
	var middleStr2 = '';
	var middleStr = '';
	for (
		leftI = 0;
		leftI < sameUnits.length && (!sameUnits[leftI] || unzonedDate1.isSame(unzonedDate2, sameUnits[leftI]));
		leftI++
	) {
		leftStr += renderedParts1[leftI];
	}
	for (
		rightI = sameUnits.length - 1;
		rightI > leftI && (!sameUnits[rightI] || unzonedDate1.isSame(unzonedDate2, sameUnits[rightI]));
		rightI--
	) {
		if (rightI - 1 === leftI && renderedParts1[rightI] === '.') {
			break;
		}
		rightStr = renderedParts1[rightI] + rightStr;
	}
	for (middleI = leftI; middleI <= rightI; middleI++) {
		middleStr1 += renderedParts1[middleI];
		middleStr2 += renderedParts2[middleI];
	}
	if (middleStr1 || middleStr2) {
		if (isRTL) {
			middleStr = middleStr2 + separator + middleStr1;
		}
		else {
			middleStr = middleStr1 + separator + middleStr2;
		}
	}
	return processMaybeMarkers(
		leftStr + middleStr + rightStr
	);
}
var parsedFormatStrCache = {};
function getParsedFormatString(formatStr) {
	return parsedFormatStrCache[formatStr] ||
		(parsedFormatStrCache[formatStr] = parseFormatString(formatStr));
}
function parseFormatString(formatStr) {
	var chunks = chunkFormatString(formatStr);
	return {
		fakeFormatString: buildFakeFormatString(chunks),
		sameUnits: buildSameUnits(chunks)
	};
}
function chunkFormatString(formatStr) {
	var chunks = [];
	var match;
	var chunker = /\[([^\]]*)\]|\(([^\)]*)\)|(LTS|LT|(\w)\4*o?)|([^\w\[\(]+)/g;
	while ((match = chunker.exec(formatStr))) {
		if (match[1]) { 
			chunks.push.apply(chunks, 
				splitStringLiteral(match[1])
			);
		}
		else if (match[2]) { 
			chunks.push({ maybe: chunkFormatString(match[2]) });
		}
		else if (match[3]) { 
			chunks.push({ token: match[3] });
		}
		else if (match[5]) { 
			chunks.push.apply(chunks, 
				splitStringLiteral(match[5])
			);
		}
	}
	return chunks;
}
function splitStringLiteral(s) {
	if (s === '. ') {
		return [ '.', ' ' ]; 
	}
	else {
		return [ s ];
	}
}
function buildFakeFormatString(chunks) {
	var parts = [];
	var i, chunk;
	for (i = 0; i < chunks.length; i++) {
		chunk = chunks[i];
		if (typeof chunk === 'string') {
			parts.push('[' + chunk + ']');
		}
		else if (chunk.token) {
			if (chunk.token in specialTokens) {
				parts.push(
					SPECIAL_TOKEN_MARKER + 
					'[' + chunk.token + ']' 
				);
			}
			else {
				parts.push(chunk.token); 
			}
		}
		else if (chunk.maybe) {
			parts.push(
				MAYBE_MARKER + 
				buildFakeFormatString(chunk.maybe) +
				MAYBE_MARKER
			);
		}
	}
	return parts.join(PART_SEPARATOR);
}
function buildSameUnits(chunks) {
	var units = [];
	var i, chunk;
	var tokenInfo;
	for (i = 0; i < chunks.length; i++) {
		chunk = chunks[i];
		if (chunk.token) {
			tokenInfo = largeTokenMap[chunk.token.charAt(0)];
			units.push(tokenInfo ? tokenInfo.unit : 'second'); 
		}
		else if (chunk.maybe) {
			units.push.apply(units, 
				buildSameUnits(chunk.maybe)
			);
		}
		else {
			units.push(null);
		}
	}
	return units;
}
function renderFakeFormatString(fakeFormatString, date) {
	return processMaybeMarkers(
		renderFakeFormatStringParts(fakeFormatString, date).join('')
	);
}
function renderFakeFormatStringParts(fakeFormatString, date) {
	var parts = [];
	var fakeRender = oldMomentFormat(date, fakeFormatString);
	var fakeParts = fakeRender.split(PART_SEPARATOR);
	var i, fakePart;
	for (i = 0; i < fakeParts.length; i++) {
		fakePart = fakeParts[i];
		if (fakePart.charAt(0) === SPECIAL_TOKEN_MARKER) {
			parts.push(
				specialTokens[fakePart.substring(1)](date)
			);
		}
		else {
			parts.push(fakePart);
		}
	}
	return parts;
}
function processMaybeMarkers(s) {
	return s.replace(MAYBE_REGEXP, function(m0, m1) { 
		if (m1.match(/[1-9]/)) { 
			return m1;
		}
		else {
			return '';
		}
	});
}
function queryMostGranularFormatUnit(formatStr) {
	var chunks = chunkFormatString(formatStr);
	var i, chunk;
	var candidate;
	var best;
	for (i = 0; i < chunks.length; i++) {
		chunk = chunks[i];
		if (chunk.token) {
			candidate = largeTokenMap[chunk.token.charAt(0)];
			if (candidate) {
				if (!best || candidate.value > best.value) {
					best = candidate;
				}
			}
		}
	}
	if (best) {
		return best.unit;
	}
	return null;
};
})();
var formatDate = FC.formatDate;
var formatRange = FC.formatRange;
var oldMomentFormat = FC.oldMomentFormat;
;;
FC.Class = Class; 
function Class() { }
Class.extend = function() {
	var members = {};
	var i;
	for (i = 0; i < arguments.length; i++) {
		copyOwnProps(arguments[i], members);
	}
	return extendClass(this, members);
};
Class.mixin = function(members) {
	copyOwnProps(members, this.prototype);
};
function extendClass(superClass, members) {
	var subClass;
	if (hasOwnProp(members, 'constructor')) {
		subClass = members.constructor;
	}
	if (typeof subClass !== 'function') {
		subClass = members.constructor = function() {
			superClass.apply(this, arguments);
		};
	}
	subClass.prototype = Object.create(superClass.prototype);
	copyOwnProps(members, subClass.prototype);
	copyOwnProps(superClass, subClass);
	return subClass;
}
;;
var EmitterMixin = FC.EmitterMixin = {
	on: function(types, handler) {
		$(this).on(types, this._prepareIntercept(handler));
		return this; 
	},
	one: function(types, handler) {
		$(this).one(types, this._prepareIntercept(handler));
		return this; 
	},
	_prepareIntercept: function(handler) {
		var intercept = function(ev, extra) {
			return handler.apply(
				extra.context || this,
				extra.args || []
			);
		};
		if (!handler.guid) {
			handler.guid = $.guid++;
		}
		intercept.guid = handler.guid;
		return intercept;
	},
	off: function(types, handler) {
		$(this).off(types, handler);
		return this; 
	},
	trigger: function(types) {
		var args = Array.prototype.slice.call(arguments, 1); 
		$(this).triggerHandler(types, { args: args });
		return this; 
	},
	triggerWith: function(types, context, args) {
		$(this).triggerHandler(types, { context: context, args: args });
		return this; 
	},
	hasHandlers: function(type) {
		var hash = $._data(this, 'events'); 
		return hash && hash[type] && hash[type].length > 0;
	}
};
;;
var ListenerMixin = FC.ListenerMixin = (function() {
	var guid = 0;
	var ListenerMixin = {
		listenerId: null,
		listenTo: function(other, arg, callback) {
			if (typeof arg === 'object') { 
				for (var eventName in arg) {
					if (arg.hasOwnProperty(eventName)) {
						this.listenTo(other, eventName, arg[eventName]);
					}
				}
			}
			else if (typeof arg === 'string') {
				other.on(
					arg + '.' + this.getListenerNamespace(), 
					$.proxy(callback, this) 
				);
			}
		},
		stopListeningTo: function(other, eventName) {
			other.off((eventName || '') + '.' + this.getListenerNamespace());
		},
		getListenerNamespace: function() {
			if (this.listenerId == null) {
				this.listenerId = guid++;
			}
			return '_listener' + this.listenerId;
		}
	};
	return ListenerMixin;
})();
;;
var ParsableModelMixin = {
	standardPropMap: {}, 
	applyProps: function(rawProps) {
		var standardPropMap = this.standardPropMap;
		var manualProps = {};
		var miscProps = {};
		var propName;
		for (propName in rawProps) {
			if (standardPropMap[propName] === true) { 
				this[propName] = rawProps[propName];
			}
			else if (standardPropMap[propName] === false) {
				manualProps[propName] = rawProps[propName];
			}
			else {
				miscProps[propName] = rawProps[propName];
			}
		}
		this.applyMiscProps(miscProps);
		return this.applyManualStandardProps(manualProps);
	},
	applyManualStandardProps: function(rawProps) {
		return true;
	},
	applyMiscProps: function(rawProps) {
	},
	isStandardProp: function(propName) {
		return propName in this.standardPropMap;
	}
};
var ParsableModelMixin_defineStandardProps = function(propDefs) {
	var proto = this.prototype;
	if (!proto.hasOwnProperty('standardPropMap')) {
		proto.standardPropMap = Object.create(proto.standardPropMap);
	}
	copyOwnProps(propDefs, proto.standardPropMap);
};
var ParsableModelMixin_copyVerbatimStandardProps = function(src, dest) {
	var map = this.prototype.standardPropMap;
	var propName;
	for (propName in map) {
		if (
			src[propName] != null && 
			map[propName] === true 
		) {
			dest[propName] = src[propName];
		}
	}
};
;;
var Model = Class.extend(EmitterMixin, ListenerMixin, {
	_props: null,
	_watchers: null,
	_globalWatchArgs: {}, 
	constructor: function() {
		this._watchers = {};
		this._props = {};
		this.applyGlobalWatchers();
		this.constructed();
	},
	constructed: function() {
	},
	applyGlobalWatchers: function() {
		var map = this._globalWatchArgs;
		var name;
		for (name in map) {
			this.watch.apply(this, map[name]);
		}
	},
	has: function(name) {
		return name in this._props;
	},
	get: function(name) {
		if (name === undefined) {
			return this._props;
		}
		return this._props[name];
	},
	set: function(name, val) {
		var newProps;
		if (typeof name === 'string') {
			newProps = {};
			newProps[name] = val === undefined ? null : val;
		}
		else {
			newProps = name;
		}
		this.setProps(newProps);
	},
	reset: function(newProps) {
		var oldProps = this._props;
		var changeset = {}; 
		var name;
		for (name in oldProps) {
			changeset[name] = undefined;
		}
		for (name in newProps) {
			changeset[name] = newProps[name];
		}
		this.setProps(changeset);
	},
	unset: function(name) { 
		var newProps = {};
		var names;
		var i;
		if (typeof name === 'string') {
			names = [ name ];
		}
		else {
			names = name;
		}
		for (i = 0; i < names.length; i++) {
			newProps[names[i]] = undefined;
		}
		this.setProps(newProps);
	},
	setProps: function(newProps) {
		var changedProps = {};
		var changedCnt = 0;
		var name, val;
		for (name in newProps) {
			val = newProps[name];
			if (
				typeof val === 'object' ||
				val !== this._props[name]
			) {
				changedProps[name] = val;
				changedCnt++;
			}
		}
		if (changedCnt) {
			this.trigger('before:batchChange', changedProps);
			for (name in changedProps) {
				val = changedProps[name];
				this.trigger('before:change', name, val);
				this.trigger('before:change:' + name, val);
			}
			for (name in changedProps) {
				val = changedProps[name];
				if (val === undefined) {
					delete this._props[name];
				}
				else {
					this._props[name] = val;
				}
				this.trigger('change:' + name, val);
				this.trigger('change', name, val);
			}
			this.trigger('batchChange', changedProps);
		}
	},
	watch: function(name, depList, startFunc, stopFunc) {
		var _this = this;
		this.unwatch(name);
		this._watchers[name] = this._watchDeps(depList, function(deps) {
			var res = startFunc.call(_this, deps);
			if (res && res.then) {
				_this.unset(name); 
				res.then(function(val) {
					_this.set(name, val);
				});
			}
			else {
				_this.set(name, res);
			}
		}, function(deps) {
			_this.unset(name);
			if (stopFunc) {
				stopFunc.call(_this, deps);
			}
		});
	},
	unwatch: function(name) {
		var watcher = this._watchers[name];
		if (watcher) {
			delete this._watchers[name];
			watcher.teardown();
		}
	},
	_watchDeps: function(depList, startFunc, stopFunc) {
		var _this = this;
		var queuedChangeCnt = 0;
		var depCnt = depList.length;
		var satisfyCnt = 0;
		var values = {}; 
		var bindTuples = []; 
		var isCallingStop = false;
		function onBeforeDepChange(depName, val, isOptional) {
			queuedChangeCnt++;
			if (queuedChangeCnt === 1) { 
				if (satisfyCnt === depCnt) { 
					isCallingStop = true;
					stopFunc(values);
					isCallingStop = false;
				}
			}
		}
		function onDepChange(depName, val, isOptional) {
			if (val === undefined) { 
				if (!isOptional && values[depName] !== undefined) {
					satisfyCnt--;
				}
				delete values[depName];
			}
			else { 
				if (!isOptional && values[depName] === undefined) {
					satisfyCnt++;
				}
				values[depName] = val;
			}
			queuedChangeCnt--;
			if (!queuedChangeCnt) { 
				if (satisfyCnt === depCnt) {
					if (!isCallingStop) {
						startFunc(values);
					}
				}
			}
		}
		function bind(eventName, handler) {
			_this.on(eventName, handler);
			bindTuples.push([ eventName, handler ]);
		}
		depList.forEach(function(depName) {
			var isOptional = false;
			if (depName.charAt(0) === '?') { 
				depName = depName.substring(1);
				isOptional = true;
			}
			bind('before:change:' + depName, function(val) {
				onBeforeDepChange(depName, val, isOptional);
			});
			bind('change:' + depName, function(val) {
				onDepChange(depName, val, isOptional);
			});
		});
		depList.forEach(function(depName) {
			var isOptional = false;
			if (depName.charAt(0) === '?') { 
				depName = depName.substring(1);
				isOptional = true;
			}
			if (_this.has(depName)) {
				values[depName] = _this.get(depName);
				satisfyCnt++;
			}
			else if (isOptional) {
				satisfyCnt++;
			}
		});
		if (satisfyCnt === depCnt) {
			startFunc(values);
		}
		return {
			teardown: function() {
				for (var i = 0; i < bindTuples.length; i++) {
					_this.off(bindTuples[i][0], bindTuples[i][1]);
				}
				bindTuples = null;
				if (satisfyCnt === depCnt) {
					stopFunc();
				}
			},
			flash: function() {
				if (satisfyCnt === depCnt) {
					stopFunc();
					startFunc(values);
				}
			}
		};
	},
	flash: function(name) {
		var watcher = this._watchers[name];
		if (watcher) {
			watcher.flash();
		}
	}
});
Model.watch = function(name ) {
	if (!this.prototype.hasOwnProperty('_globalWatchArgs')) {
		this.prototype._globalWatchArgs = Object.create(this.prototype._globalWatchArgs);
	}
	this.prototype._globalWatchArgs[name] = arguments;
};
FC.Model = Model;
;;
var Promise = {
	construct: function(executor) {
		var deferred = $.Deferred();
		var promise = deferred.promise();
		if (typeof executor === 'function') {
			executor(
				function(val) { 
					deferred.resolve(val);
					attachImmediatelyResolvingThen(promise, val);
				},
				function() { 
					deferred.reject();
					attachImmediatelyRejectingThen(promise);
				}
			);
		}
		return promise;
	},
	resolve: function(val) {
		var deferred = $.Deferred().resolve(val);
		var promise = deferred.promise();
		attachImmediatelyResolvingThen(promise, val);
		return promise;
	},
	reject: function() {
		var deferred = $.Deferred().reject();
		var promise = deferred.promise();
		attachImmediatelyRejectingThen(promise);
		return promise;
	}
};
function attachImmediatelyResolvingThen(promise, val) {
	promise.then = function(onResolve) {
		if (typeof onResolve === 'function') {
			return Promise.resolve(onResolve(val));
		}
		return promise;
	};
}
function attachImmediatelyRejectingThen(promise) {
	promise.then = function(onResolve, onReject) {
		if (typeof onReject === 'function') {
			onReject();
		}
		return promise;
	};
}
FC.Promise = Promise;
;;
var TaskQueue = Class.extend(EmitterMixin, {
	q: null,
	isPaused: false,
	isRunning: false,
	constructor: function() {
		this.q = [];
	},
	queue: function() {
		this.q.push.apply(this.q, arguments); 
		this.tryStart();
	},
	pause: function() {
		this.isPaused = true;
	},
	resume: function() {
		this.isPaused = false;
		this.tryStart();
	},
	getIsIdle: function() {
		return !this.isRunning && !this.isPaused;
	},
	tryStart: function() {
		if (!this.isRunning && this.canRunNext()) {
			this.isRunning = true;
			this.trigger('start');
			this.runRemaining();
		}
	},
	canRunNext: function() {
		return !this.isPaused && this.q.length;
	},
	runRemaining: function() { 
		var _this = this;
		var task;
		var res;
		do {
			task = this.q.shift(); 
			res = this.runTask(task);
			if (res && res.then) {
				res.then(function() { 
					if (_this.canRunNext()) {
						_this.runRemaining();
					}
				});
				return; 
			}
		} while (this.canRunNext());
		this.trigger('stop'); 
		this.isRunning = false;
		this.tryStart();
	},
	runTask: function(task) {
		return task(); 
	}
});
FC.TaskQueue = TaskQueue;
;;
var RenderQueue = TaskQueue.extend({
	waitsByNamespace: null,
	waitNamespace: null,
	waitId: null,
	constructor: function(waitsByNamespace) {
		TaskQueue.call(this); 
		this.waitsByNamespace = waitsByNamespace || {};
	},
	queue: function(taskFunc, namespace, type) {
		var task = {
			func: taskFunc,
			namespace: namespace,
			type: type
		};
		var waitMs;
		if (namespace) {
			waitMs = this.waitsByNamespace[namespace];
		}
		if (this.waitNamespace) {
			if (namespace === this.waitNamespace && waitMs != null) {
				this.delayWait(waitMs);
			}
			else {
				this.clearWait();
				this.tryStart();
			}
		}
		if (this.compoundTask(task)) { 
			if (!this.waitNamespace && waitMs != null) {
				this.startWait(namespace, waitMs);
			}
			else {
				this.tryStart();
			}
		}
	},
	startWait: function(namespace, waitMs) {
		this.waitNamespace = namespace;
		this.spawnWait(waitMs);
	},
	delayWait: function(waitMs) {
		clearTimeout(this.waitId);
		this.spawnWait(waitMs);
	},
	spawnWait: function(waitMs) {
		var _this = this;
		this.waitId = setTimeout(function() {
			_this.waitNamespace = null;
			_this.tryStart();
		}, waitMs);
	},
	clearWait: function() {
		if (this.waitNamespace) {
			clearTimeout(this.waitId);
			this.waitId = null;
			this.waitNamespace = null;
		}
	},
	canRunNext: function() {
		if (!TaskQueue.prototype.canRunNext.apply(this, arguments)) {
			return false;
		}
		if (this.waitNamespace) {
			for (var q = this.q, i = 0; i < q.length; i++) {
				if (q[i].namespace !== this.waitNamespace) {
					return true; 
				}
			}
			return false;
		}
		return true;
	},
	runTask: function(task) {
		task.func();
	},
	compoundTask: function(newTask) {
		var q = this.q;
		var shouldAppend = true;
		var i, task;
		if (newTask.namespace && newTask.type === 'destroy') {
			for (i = q.length - 1; i >= 0; i--) {
				task = q[i];
				switch (task.type) {
					case 'init':
						shouldAppend = false; 
					case 'add':
					case 'remove':
						q.splice(i, 1); 
				}
			}
		}
		if (shouldAppend) {
			q.push(newTask);
		}
		return shouldAppend;
	}
});
FC.RenderQueue = RenderQueue;
;;
var Popover = Class.extend(ListenerMixin, {
	isHidden: true,
	options: null,
	el: null, 
	margin: 10, 
	constructor: function(options) {
		this.options = options || {};
	},
	show: function() {
		if (this.isHidden) {
			if (!this.el) {
				this.render();
			}
			this.el.show();
			this.position();
			this.isHidden = false;
			this.trigger('show');
		}
	},
	hide: function() {
		if (!this.isHidden) {
			this.el.hide();
			this.isHidden = true;
			this.trigger('hide');
		}
	},
	render: function() {
		var _this = this;
		var options = this.options;
		this.el = $('<div class="fc-popover"/>')
			.addClass(options.className || '')
			.css({
				top: 0,
				left: 0
			})
			.append(options.content)
			.appendTo(options.parentEl);
		this.el.on('click', '.fc-close', function() {
			_this.hide();
		});
		if (options.autoHide) {
			this.listenTo($(document), 'mousedown', this.documentMousedown);
		}
	},
	documentMousedown: function(ev) {
		if (this.el && !$(ev.target).closest(this.el).length) {
			this.hide();
		}
	},
	removeElement: function() {
		this.hide();
		if (this.el) {
			this.el.remove();
			this.el = null;
		}
		this.stopListeningTo($(document), 'mousedown');
	},
	position: function() {
		var options = this.options;
		var origin = this.el.offsetParent().offset();
		var width = this.el.outerWidth();
		var height = this.el.outerHeight();
		var windowEl = $(window);
		var viewportEl = getScrollParent(this.el);
		var viewportTop;
		var viewportLeft;
		var viewportOffset;
		var top; 
		var left; 
		top = options.top || 0;
		if (options.left !== undefined) {
			left = options.left;
		}
		else if (options.right !== undefined) {
			left = options.right - width; 
		}
		else {
			left = 0;
		}
		if (viewportEl.is(window) || viewportEl.is(document)) { 
			viewportEl = windowEl;
			viewportTop = 0; 
			viewportLeft = 0; 
		}
		else {
			viewportOffset = viewportEl.offset();
			viewportTop = viewportOffset.top;
			viewportLeft = viewportOffset.left;
		}
		viewportTop += windowEl.scrollTop();
		viewportLeft += windowEl.scrollLeft();
		if (options.viewportConstrain !== false) {
			top = Math.min(top, viewportTop + viewportEl.outerHeight() - height - this.margin);
			top = Math.max(top, viewportTop + this.margin);
			left = Math.min(left, viewportLeft + viewportEl.outerWidth() - width - this.margin);
			left = Math.max(left, viewportLeft + this.margin);
		}
		this.el.css({
			top: top - origin.top,
			left: left - origin.left
		});
	},
	trigger: function(name) {
		if (this.options[name]) {
			this.options[name].apply(this, Array.prototype.slice.call(arguments, 1));
		}
	}
});
;;
var CoordCache = FC.CoordCache = Class.extend({
	els: null, 
	forcedOffsetParentEl: null, 
	origin: null, 
	boundingRect: null, 
	isHorizontal: false, 
	isVertical: false, 
	lefts: null,
	rights: null,
	tops: null,
	bottoms: null,
	constructor: function(options) {
		this.els = $(options.els);
		this.isHorizontal = options.isHorizontal;
		this.isVertical = options.isVertical;
		this.forcedOffsetParentEl = options.offsetParent ? $(options.offsetParent) : null;
	},
	build: function() {
		var offsetParentEl = this.forcedOffsetParentEl;
		if (!offsetParentEl && this.els.length > 0) {
			offsetParentEl = this.els.eq(0).offsetParent();
		}
		this.origin = offsetParentEl ?
			offsetParentEl.offset() :
			null;
		this.boundingRect = this.queryBoundingRect();
		if (this.isHorizontal) {
			this.buildElHorizontals();
		}
		if (this.isVertical) {
			this.buildElVerticals();
		}
	},
	clear: function() {
		this.origin = null;
		this.boundingRect = null;
		this.lefts = null;
		this.rights = null;
		this.tops = null;
		this.bottoms = null;
	},
	ensureBuilt: function() {
		if (!this.origin) {
			this.build();
		}
	},
	buildElHorizontals: function() {
		var lefts = [];
		var rights = [];
		this.els.each(function(i, node) {
			var el = $(node);
			var left = el.offset().left;
			var width = el.outerWidth();
			lefts.push(left);
			rights.push(left + width);
		});
		this.lefts = lefts;
		this.rights = rights;
	},
	buildElVerticals: function() {
		var tops = [];
		var bottoms = [];
		this.els.each(function(i, node) {
			var el = $(node);
			var top = el.offset().top;
			var height = el.outerHeight();
			tops.push(top);
			bottoms.push(top + height);
		});
		this.tops = tops;
		this.bottoms = bottoms;
	},
	getHorizontalIndex: function(leftOffset) {
		this.ensureBuilt();
		var lefts = this.lefts;
		var rights = this.rights;
		var len = lefts.length;
		var i;
		for (i = 0; i < len; i++) {
			if (leftOffset >= lefts[i] && leftOffset < rights[i]) {
				return i;
			}
		}
	},
	getVerticalIndex: function(topOffset) {
		this.ensureBuilt();
		var tops = this.tops;
		var bottoms = this.bottoms;
		var len = tops.length;
		var i;
		for (i = 0; i < len; i++) {
			if (topOffset >= tops[i] && topOffset < bottoms[i]) {
				return i;
			}
		}
	},
	getLeftOffset: function(leftIndex) {
		this.ensureBuilt();
		return this.lefts[leftIndex];
	},
	getLeftPosition: function(leftIndex) {
		this.ensureBuilt();
		return this.lefts[leftIndex] - this.origin.left;
	},
	getRightOffset: function(leftIndex) {
		this.ensureBuilt();
		return this.rights[leftIndex];
	},
	getRightPosition: function(leftIndex) {
		this.ensureBuilt();
		return this.rights[leftIndex] - this.origin.left;
	},
	getWidth: function(leftIndex) {
		this.ensureBuilt();
		return this.rights[leftIndex] - this.lefts[leftIndex];
	},
	getTopOffset: function(topIndex) {
		this.ensureBuilt();
		return this.tops[topIndex];
	},
	getTopPosition: function(topIndex) {
		this.ensureBuilt();
		return this.tops[topIndex] - this.origin.top;
	},
	getBottomOffset: function(topIndex) {
		this.ensureBuilt();
		return this.bottoms[topIndex];
	},
	getBottomPosition: function(topIndex) {
		this.ensureBuilt();
		return this.bottoms[topIndex] - this.origin.top;
	},
	getHeight: function(topIndex) {
		this.ensureBuilt();
		return this.bottoms[topIndex] - this.tops[topIndex];
	},
	queryBoundingRect: function() {
		var scrollParentEl;
		if (this.els.length > 0) {
			scrollParentEl = getScrollParent(this.els.eq(0));
			if (!scrollParentEl.is(document)) {
				return getClientRect(scrollParentEl);
			}
		}
		return null;
	},
	isPointInBounds: function(leftOffset, topOffset) {
		return this.isLeftInBounds(leftOffset) && this.isTopInBounds(topOffset);
	},
	isLeftInBounds: function(leftOffset) {
		return !this.boundingRect || (leftOffset >= this.boundingRect.left && leftOffset < this.boundingRect.right);
	},
	isTopInBounds: function(topOffset) {
		return !this.boundingRect || (topOffset >= this.boundingRect.top && topOffset < this.boundingRect.bottom);
	}
});
;;
var DragListener = FC.DragListener = Class.extend(ListenerMixin, {
	options: null,
	subjectEl: null,
	originX: null,
	originY: null,
	scrollEl: null,
	isInteracting: false,
	isDistanceSurpassed: false,
	isDelayEnded: false,
	isDragging: false,
	isTouch: false,
	isGeneric: false, 
	delay: null,
	delayTimeoutId: null,
	minDistance: null,
	shouldCancelTouchScroll: true,
	scrollAlwaysKills: false,
	constructor: function(options) {
		this.options = options || {};
	},
	startInteraction: function(ev, extraOptions) {
		if (ev.type === 'mousedown') {
			if (GlobalEmitter.get().shouldIgnoreMouse()) {
				return;
			}
			else if (!isPrimaryMouseButton(ev)) {
				return;
			}
			else {
				ev.preventDefault(); 
			}
		}
		if (!this.isInteracting) {
			extraOptions = extraOptions || {};
			this.delay = firstDefined(extraOptions.delay, this.options.delay, 0);
			this.minDistance = firstDefined(extraOptions.distance, this.options.distance, 0);
			this.subjectEl = this.options.subjectEl;
			preventSelection($('body'));
			this.isInteracting = true;
			this.isTouch = getEvIsTouch(ev);
			this.isGeneric = ev.type === 'dragstart';
			this.isDelayEnded = false;
			this.isDistanceSurpassed = false;
			this.originX = getEvX(ev);
			this.originY = getEvY(ev);
			this.scrollEl = getScrollParent($(ev.target));
			this.bindHandlers();
			this.initAutoScroll();
			this.handleInteractionStart(ev);
			this.startDelay(ev);
			if (!this.minDistance) {
				this.handleDistanceSurpassed(ev);
			}
		}
	},
	handleInteractionStart: function(ev) {
		this.trigger('interactionStart', ev);
	},
	endInteraction: function(ev, isCancelled) {
		if (this.isInteracting) {
			this.endDrag(ev);
			if (this.delayTimeoutId) {
				clearTimeout(this.delayTimeoutId);
				this.delayTimeoutId = null;
			}
			this.destroyAutoScroll();
			this.unbindHandlers();
			this.isInteracting = false;
			this.handleInteractionEnd(ev, isCancelled);
			allowSelection($('body'));
		}
	},
	handleInteractionEnd: function(ev, isCancelled) {
		this.trigger('interactionEnd', ev, isCancelled || false);
	},
	bindHandlers: function() {
		var globalEmitter = GlobalEmitter.get();
		if (this.isGeneric) {
			this.listenTo($(document), { 
				drag: this.handleMove,
				dragstop: this.endInteraction
			});
		}
		else if (this.isTouch) {
			this.listenTo(globalEmitter, {
				touchmove: this.handleTouchMove,
				touchend: this.endInteraction,
				scroll: this.handleTouchScroll
			});
		}
		else {
			this.listenTo(globalEmitter, {
				mousemove: this.handleMouseMove,
				mouseup: this.endInteraction
			});
		}
		this.listenTo(globalEmitter, {
			selectstart: preventDefault, 
			contextmenu: preventDefault 
		});
	},
	unbindHandlers: function() {
		this.stopListeningTo(GlobalEmitter.get());
		this.stopListeningTo($(document)); 
	},
	startDrag: function(ev, extraOptions) {
		this.startInteraction(ev, extraOptions); 
		if (!this.isDragging) {
			this.isDragging = true;
			this.handleDragStart(ev);
		}
	},
	handleDragStart: function(ev) {
		this.trigger('dragStart', ev);
	},
	handleMove: function(ev) {
		var dx = getEvX(ev) - this.originX;
		var dy = getEvY(ev) - this.originY;
		var minDistance = this.minDistance;
		var distanceSq; 
		if (!this.isDistanceSurpassed) {
			distanceSq = dx * dx + dy * dy;
			if (distanceSq >= minDistance * minDistance) { 
				this.handleDistanceSurpassed(ev);
			}
		}
		if (this.isDragging) {
			this.handleDrag(dx, dy, ev);
		}
	},
	handleDrag: function(dx, dy, ev) {
		this.trigger('drag', dx, dy, ev);
		this.updateAutoScroll(ev); 
	},
	endDrag: function(ev) {
		if (this.isDragging) {
			this.isDragging = false;
			this.handleDragEnd(ev);
		}
	},
	handleDragEnd: function(ev) {
		this.trigger('dragEnd', ev);
	},
	startDelay: function(initialEv) {
		var _this = this;
		if (this.delay) {
			this.delayTimeoutId = setTimeout(function() {
				_this.handleDelayEnd(initialEv);
			}, this.delay);
		}
		else {
			this.handleDelayEnd(initialEv);
		}
	},
	handleDelayEnd: function(initialEv) {
		this.isDelayEnded = true;
		if (this.isDistanceSurpassed) {
			this.startDrag(initialEv);
		}
	},
	handleDistanceSurpassed: function(ev) {
		this.isDistanceSurpassed = true;
		if (this.isDelayEnded) {
			this.startDrag(ev);
		}
	},
	handleTouchMove: function(ev) {
		if (this.isDragging && this.shouldCancelTouchScroll) {
			ev.preventDefault();
		}
		this.handleMove(ev);
	},
	handleMouseMove: function(ev) {
		this.handleMove(ev);
	},
	handleTouchScroll: function(ev) {
		if (!this.isDragging || this.scrollAlwaysKills) {
			this.endInteraction(ev, true); 
		}
	},
	trigger: function(name) {
		if (this.options[name]) {
			this.options[name].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		if (this['_' + name]) {
			this['_' + name].apply(this, Array.prototype.slice.call(arguments, 1));
		}
	}
});
;;
DragListener.mixin({
	isAutoScroll: false,
	scrollBounds: null, 
	scrollTopVel: null, 
	scrollLeftVel: null, 
	scrollIntervalId: null, 
	scrollSensitivity: 30, 
	scrollSpeed: 200, 
	scrollIntervalMs: 50, 
	initAutoScroll: function() {
		var scrollEl = this.scrollEl;
		this.isAutoScroll =
			this.options.scroll &&
			scrollEl &&
			!scrollEl.is(window) &&
			!scrollEl.is(document);
		if (this.isAutoScroll) {
			this.listenTo(scrollEl, 'scroll', debounce(this.handleDebouncedScroll, 100));
		}
	},
	destroyAutoScroll: function() {
		this.endAutoScroll(); 
		if (this.isAutoScroll) {
			this.stopListeningTo(this.scrollEl, 'scroll'); 
		}
	},
	computeScrollBounds: function() {
		if (this.isAutoScroll) {
			this.scrollBounds = getOuterRect(this.scrollEl);
		}
	},
	updateAutoScroll: function(ev) {
		var sensitivity = this.scrollSensitivity;
		var bounds = this.scrollBounds;
		var topCloseness, bottomCloseness;
		var leftCloseness, rightCloseness;
		var topVel = 0;
		var leftVel = 0;
		if (bounds) { 
			topCloseness = (sensitivity - (getEvY(ev) - bounds.top)) / sensitivity;
			bottomCloseness = (sensitivity - (bounds.bottom - getEvY(ev))) / sensitivity;
			leftCloseness = (sensitivity - (getEvX(ev) - bounds.left)) / sensitivity;
			rightCloseness = (sensitivity - (bounds.right - getEvX(ev))) / sensitivity;
			if (topCloseness >= 0 && topCloseness <= 1) {
				topVel = topCloseness * this.scrollSpeed * -1; 
			}
			else if (bottomCloseness >= 0 && bottomCloseness <= 1) {
				topVel = bottomCloseness * this.scrollSpeed;
			}
			if (leftCloseness >= 0 && leftCloseness <= 1) {
				leftVel = leftCloseness * this.scrollSpeed * -1; 
			}
			else if (rightCloseness >= 0 && rightCloseness <= 1) {
				leftVel = rightCloseness * this.scrollSpeed;
			}
		}
		this.setScrollVel(topVel, leftVel);
	},
	setScrollVel: function(topVel, leftVel) {
		this.scrollTopVel = topVel;
		this.scrollLeftVel = leftVel;
		this.constrainScrollVel(); 
		if ((this.scrollTopVel || this.scrollLeftVel) && !this.scrollIntervalId) {
			this.scrollIntervalId = setInterval(
				proxy(this, 'scrollIntervalFunc'), 
				this.scrollIntervalMs
			);
		}
	},
	constrainScrollVel: function() {
		var el = this.scrollEl;
		if (this.scrollTopVel < 0) { 
			if (el.scrollTop() <= 0) { 
				this.scrollTopVel = 0;
			}
		}
		else if (this.scrollTopVel > 0) { 
			if (el.scrollTop() + el[0].clientHeight >= el[0].scrollHeight) { 
				this.scrollTopVel = 0;
			}
		}
		if (this.scrollLeftVel < 0) { 
			if (el.scrollLeft() <= 0) { 
				this.scrollLeftVel = 0;
			}
		}
		else if (this.scrollLeftVel > 0) { 
			if (el.scrollLeft() + el[0].clientWidth >= el[0].scrollWidth) { 
				this.scrollLeftVel = 0;
			}
		}
	},
	scrollIntervalFunc: function() {
		var el = this.scrollEl;
		var frac = this.scrollIntervalMs / 1000; 
		if (this.scrollTopVel) {
			el.scrollTop(el.scrollTop() + this.scrollTopVel * frac);
		}
		if (this.scrollLeftVel) {
			el.scrollLeft(el.scrollLeft() + this.scrollLeftVel * frac);
		}
		this.constrainScrollVel(); 
		if (!this.scrollTopVel && !this.scrollLeftVel) {
			this.endAutoScroll();
		}
	},
	endAutoScroll: function() {
		if (this.scrollIntervalId) {
			clearInterval(this.scrollIntervalId);
			this.scrollIntervalId = null;
			this.handleScrollEnd();
		}
	},
	handleDebouncedScroll: function() {
		if (!this.scrollIntervalId) {
			this.handleScrollEnd();
		}
	},
	handleScrollEnd: function() {
	}
});
;;
var HitDragListener = DragListener.extend({
	component: null, 
	origHit: null, 
	hit: null, 
	coordAdjust: null, 
	constructor: function(component, options) {
		DragListener.call(this, options); 
		this.component = component;
	},
	handleInteractionStart: function(ev) {
		var subjectEl = this.subjectEl;
		var subjectRect;
		var origPoint;
		var point;
		this.component.hitsNeeded();
		this.computeScrollBounds(); 
		if (ev) {
			origPoint = { left: getEvX(ev), top: getEvY(ev) };
			point = origPoint;
			if (subjectEl) {
				subjectRect = getOuterRect(subjectEl); 
				point = constrainPoint(point, subjectRect);
			}
			this.origHit = this.queryHit(point.left, point.top);
			if (subjectEl && this.options.subjectCenter) {
				if (this.origHit) {
					subjectRect = intersectRects(this.origHit, subjectRect) ||
						subjectRect; 
				}
				point = getRectCenter(subjectRect);
			}
			this.coordAdjust = diffPoints(point, origPoint); 
		}
		else {
			this.origHit = null;
			this.coordAdjust = null;
		}
		DragListener.prototype.handleInteractionStart.apply(this, arguments);
	},
	handleDragStart: function(ev) {
		var hit;
		DragListener.prototype.handleDragStart.apply(this, arguments); 
		hit = this.queryHit(getEvX(ev), getEvY(ev));
		if (hit) {
			this.handleHitOver(hit);
		}
	},
	handleDrag: function(dx, dy, ev) {
		var hit;
		DragListener.prototype.handleDrag.apply(this, arguments); 
		hit = this.queryHit(getEvX(ev), getEvY(ev));
		if (!isHitsEqual(hit, this.hit)) { 
			if (this.hit) {
				this.handleHitOut();
			}
			if (hit) {
				this.handleHitOver(hit);
			}
		}
	},
	handleDragEnd: function() {
		this.handleHitDone();
		DragListener.prototype.handleDragEnd.apply(this, arguments); 
	},
	handleHitOver: function(hit) {
		var isOrig = isHitsEqual(hit, this.origHit);
		this.hit = hit;
		this.trigger('hitOver', this.hit, isOrig, this.origHit);
	},
	handleHitOut: function() {
		if (this.hit) {
			this.trigger('hitOut', this.hit);
			this.handleHitDone();
			this.hit = null;
		}
	},
	handleHitDone: function() {
		if (this.hit) {
			this.trigger('hitDone', this.hit);
		}
	},
	handleInteractionEnd: function() {
		DragListener.prototype.handleInteractionEnd.apply(this, arguments); 
		this.origHit = null;
		this.hit = null;
		this.component.hitsNotNeeded();
	},
	handleScrollEnd: function() {
		DragListener.prototype.handleScrollEnd.apply(this, arguments); 
		if (this.isDragging) {
			this.component.releaseHits();
			this.component.prepareHits();
		}
	},
	queryHit: function(left, top) {
		if (this.coordAdjust) {
			left += this.coordAdjust.left;
			top += this.coordAdjust.top;
		}
		return this.component.queryHit(left, top);
	}
});
function isHitsEqual(hit0, hit1) {
	if (!hit0 && !hit1) {
		return true;
	}
	if (hit0 && hit1) {
		return hit0.component === hit1.component &&
			isHitPropsWithin(hit0, hit1) &&
			isHitPropsWithin(hit1, hit0); 
	}
	return false;
}
function isHitPropsWithin(subHit, superHit) {
	for (var propName in subHit) {
		if (!/^(component|left|right|top|bottom)$/.test(propName)) {
			if (subHit[propName] !== superHit[propName]) {
				return false;
			}
		}
	}
	return true;
}
;;
FC.touchMouseIgnoreWait = 500;
var GlobalEmitter = Class.extend(ListenerMixin, EmitterMixin, {
	isTouching: false,
	mouseIgnoreDepth: 0,
	handleScrollProxy: null,
	bind: function() {
		var _this = this;
		this.listenTo($(document), {
			touchstart: this.handleTouchStart,
			touchcancel: this.handleTouchCancel,
			touchend: this.handleTouchEnd,
			mousedown: this.handleMouseDown,
			mousemove: this.handleMouseMove,
			mouseup: this.handleMouseUp,
			click: this.handleClick,
			selectstart: this.handleSelectStart,
			contextmenu: this.handleContextMenu
		});
		window.addEventListener(
			'touchmove',
			this.handleTouchMoveProxy = function(ev) {
				_this.handleTouchMove($.Event(ev));
			},
			{ passive: false } 
		);
		window.addEventListener(
			'scroll',
			this.handleScrollProxy = function(ev) {
				_this.handleScroll($.Event(ev));
			},
			true 
		);
	},
	unbind: function() {
		this.stopListeningTo($(document));
		window.removeEventListener(
			'touchmove',
			this.handleTouchMoveProxy
		);
		window.removeEventListener(
			'scroll',
			this.handleScrollProxy,
			true 
		);
	},
	handleTouchStart: function(ev) {
		this.stopTouch(ev, true); 
		this.isTouching = true;
		this.trigger('touchstart', ev);
	},
	handleTouchMove: function(ev) {
		if (this.isTouching) {
			this.trigger('touchmove', ev);
		}
	},
	handleTouchCancel: function(ev) {
		if (this.isTouching) {
			this.trigger('touchcancel', ev);
			this.stopTouch(ev);
		}
	},
	handleTouchEnd: function(ev) {
		this.stopTouch(ev);
	},
	handleMouseDown: function(ev) {
		if (!this.shouldIgnoreMouse()) {
			this.trigger('mousedown', ev);
		}
	},
	handleMouseMove: function(ev) {
		if (!this.shouldIgnoreMouse()) {
			this.trigger('mousemove', ev);
		}
	},
	handleMouseUp: function(ev) {
		if (!this.shouldIgnoreMouse()) {
			this.trigger('mouseup', ev);
		}
	},
	handleClick: function(ev) {
		if (!this.shouldIgnoreMouse()) {
			this.trigger('click', ev);
		}
	},
	handleSelectStart: function(ev) {
		this.trigger('selectstart', ev);
	},
	handleContextMenu: function(ev) {
		this.trigger('contextmenu', ev);
	},
	handleScroll: function(ev) {
		this.trigger('scroll', ev);
	},
	stopTouch: function(ev, skipMouseIgnore) {
		if (this.isTouching) {
			this.isTouching = false;
			this.trigger('touchend', ev);
			if (!skipMouseIgnore) {
				this.startTouchMouseIgnore();
			}
		}
	},
	startTouchMouseIgnore: function() {
		var _this = this;
		var wait = FC.touchMouseIgnoreWait;
		if (wait) {
			this.mouseIgnoreDepth++;
			setTimeout(function() {
				_this.mouseIgnoreDepth--;
			}, wait);
		}
	},
	shouldIgnoreMouse: function() {
		return this.isTouching || Boolean(this.mouseIgnoreDepth);
	}
});
(function() {
	var globalEmitter = null;
	var neededCount = 0;
	GlobalEmitter.get = function() {
		if (!globalEmitter) {
			globalEmitter = new GlobalEmitter();
			globalEmitter.bind();
		}
		return globalEmitter;
	};
	GlobalEmitter.needed = function() {
		GlobalEmitter.get(); 
		neededCount++;
	};
	GlobalEmitter.unneeded = function() {
		neededCount--;
		if (!neededCount) { 
			globalEmitter.unbind();
			globalEmitter = null;
		}
	};
})();
;;
var MouseFollower = Class.extend(ListenerMixin, {
	options: null,
	sourceEl: null, 
	el: null, 
	parentEl: null, 
	top0: null,
	left0: null,
	y0: null,
	x0: null,
	topDelta: null,
	leftDelta: null,
	isFollowing: false,
	isHidden: false,
	isAnimating: false, 
	constructor: function(sourceEl, options) {
		this.options = options = options || {};
		this.sourceEl = sourceEl;
		this.parentEl = options.parentEl ? $(options.parentEl) : sourceEl.parent(); 
	},
	start: function(ev) {
		if (!this.isFollowing) {
			this.isFollowing = true;
			this.y0 = getEvY(ev);
			this.x0 = getEvX(ev);
			this.topDelta = 0;
			this.leftDelta = 0;
			if (!this.isHidden) {
				this.updatePosition();
			}
			if (getEvIsTouch(ev)) {
				this.listenTo($(document), 'touchmove', this.handleMove);
			}
			else {
				this.listenTo($(document), 'mousemove', this.handleMove);
			}
		}
	},
	stop: function(shouldRevert, callback) {
		var _this = this;
		var revertDuration = this.options.revertDuration;
		function complete() { 
			_this.isAnimating = false;
			_this.removeElement();
			_this.top0 = _this.left0 = null; 
			if (callback) {
				callback();
			}
		}
		if (this.isFollowing && !this.isAnimating) { 
			this.isFollowing = false;
			this.stopListeningTo($(document));
			if (shouldRevert && revertDuration && !this.isHidden) { 
				this.isAnimating = true;
				this.el.animate({
					top: this.top0,
					left: this.left0
				}, {
					duration: revertDuration,
					complete: complete
				});
			}
			else {
				complete();
			}
		}
	},
	getEl: function() {
		var el = this.el;
		if (!el) {
			el = this.el = this.sourceEl.clone()
				.addClass(this.options.additionalClass || '')
				.css({
					position: 'absolute',
					visibility: '', 
					display: this.isHidden ? 'none' : '', 
					margin: 0,
					right: 'auto', 
					bottom: 'auto', 
					width: this.sourceEl.width(), 
					height: this.sourceEl.height(), 
					opacity: this.options.opacity || '',
					zIndex: this.options.zIndex
				});
			el.addClass('fc-unselectable');
			el.appendTo(this.parentEl);
		}
		return el;
	},
	removeElement: function() {
		if (this.el) {
			this.el.remove();
			this.el = null;
		}
	},
	updatePosition: function() {
		var sourceOffset;
		var origin;
		this.getEl(); 
		if (this.top0 === null) {
			sourceOffset = this.sourceEl.offset();
			origin = this.el.offsetParent().offset();
			this.top0 = sourceOffset.top - origin.top;
			this.left0 = sourceOffset.left - origin.left;
		}
		this.el.css({
			top: this.top0 + this.topDelta,
			left: this.left0 + this.leftDelta
		});
	},
	handleMove: function(ev) {
		this.topDelta = getEvY(ev) - this.y0;
		this.leftDelta = getEvX(ev) - this.x0;
		if (!this.isHidden) {
			this.updatePosition();
		}
	},
	hide: function() {
		if (!this.isHidden) {
			this.isHidden = true;
			if (this.el) {
				this.el.hide();
			}
		}
	},
	show: function() {
		if (this.isHidden) {
			this.isHidden = false;
			this.updatePosition();
			this.getEl().show();
		}
	}
});
;;
var Scroller = FC.Scroller = Class.extend({
	el: null, 
	scrollEl: null, 
	overflowX: null,
	overflowY: null,
	constructor: function(options) {
		options = options || {};
		this.overflowX = options.overflowX || options.overflow || 'auto';
		this.overflowY = options.overflowY || options.overflow || 'auto';
	},
	render: function() {
		this.el = this.renderEl();
		this.applyOverflow();
	},
	renderEl: function() {
		return (this.scrollEl = $('<div class="fc-scroller"></div>'));
	},
	clear: function() {
		this.setHeight('auto');
		this.applyOverflow();
	},
	destroy: function() {
		this.el.remove();
	},
	applyOverflow: function() {
		this.scrollEl.css({
			'overflow-x': this.overflowX,
			'overflow-y': this.overflowY
		});
	},
	lockOverflow: function(scrollbarWidths) {
		var overflowX = this.overflowX;
		var overflowY = this.overflowY;
		scrollbarWidths = scrollbarWidths || this.getScrollbarWidths();
		if (overflowX === 'auto') {
			overflowX = (
					scrollbarWidths.top || scrollbarWidths.bottom || 
					this.scrollEl[0].scrollWidth - 1 > this.scrollEl[0].clientWidth
				) ? 'scroll' : 'hidden';
		}
		if (overflowY === 'auto') {
			overflowY = (
					scrollbarWidths.left || scrollbarWidths.right || 
					this.scrollEl[0].scrollHeight - 1 > this.scrollEl[0].clientHeight
				) ? 'scroll' : 'hidden';
		}
		this.scrollEl.css({ 'overflow-x': overflowX, 'overflow-y': overflowY });
	},
	setHeight: function(height) {
		this.scrollEl.height(height);
	},
	getScrollTop: function() {
		return this.scrollEl.scrollTop();
	},
	setScrollTop: function(top) {
		this.scrollEl.scrollTop(top);
	},
	getClientWidth: function() {
		return this.scrollEl[0].clientWidth;
	},
	getClientHeight: function() {
		return this.scrollEl[0].clientHeight;
	},
	getScrollbarWidths: function() {
		return getScrollbarWidths(this.scrollEl);
	}
});
;;
function Iterator(items) {
    this.items = items || [];
}
Iterator.prototype.proxyCall = function(methodName) {
    var args = Array.prototype.slice.call(arguments, 1);
    var results = [];
    this.items.forEach(function(item) {
        results.push(item[methodName].apply(item, args));
    });
    return results;
};
;;
var Interaction = Class.extend({
	view: null,
	component: null,
	constructor: function(component) {
		this.view = component._getView();
		this.component = component;
	},
	opt: function(name) {
		return this.view.opt(name);
	},
	end: function() {
	}
});
;;
var DateClicking = Interaction.extend({
	dragListener: null,
	constructor: function(component) {
		Interaction.call(this, component);
		this.dragListener = this.buildDragListener();
	},
	end: function() {
		this.dragListener.endInteraction();
	},
	bindToEl: function(el) {
		var component = this.component;
		var dragListener = this.dragListener;
		component.bindDateHandlerToEl(el, 'mousedown', function(ev) {
			if (!component.shouldIgnoreMouse()) {
				dragListener.startInteraction(ev);
			}
		});
		component.bindDateHandlerToEl(el, 'touchstart', function(ev) {
			if (!component.shouldIgnoreTouch()) {
				dragListener.startInteraction(ev);
			}
		});
	},
	buildDragListener: function() {
		var _this = this;
		var component = this.component;
		var dayClickHit; 
		var dragListener = new HitDragListener(component, {
			scroll: this.opt('dragScroll'),
			interactionStart: function() {
				dayClickHit = dragListener.origHit;
			},
			hitOver: function(hit, isOrig, origHit) {
				if (!isOrig) {
					dayClickHit = null;
				}
			},
			hitOut: function() { 
				dayClickHit = null;
			},
			interactionEnd: function(ev, isCancelled) {
				var componentFootprint;
				if (!isCancelled && dayClickHit) {
					componentFootprint = component.getSafeHitFootprint(dayClickHit);
					if (componentFootprint) {
						_this.view.triggerDayClick(componentFootprint, component.getHitEl(dayClickHit), ev);
					}
				}
			}
		});
		dragListener.shouldCancelTouchScroll = false;
		dragListener.scrollAlwaysKills = true;
		return dragListener;
	}
});
;;
var DateSelecting = FC.DateSelecting = Interaction.extend({
	dragListener: null,
	constructor: function(component) {
		Interaction.call(this, component);
		this.dragListener = this.buildDragListener();
	},
	end: function() {
		this.dragListener.endInteraction();
	},
	getDelay: function() {
		var delay = this.opt('selectLongPressDelay');
		if (delay == null) {
			delay = this.opt('longPressDelay'); 
		}
		return delay;
	},
	bindToEl: function(el) {
		var _this = this;
		var component = this.component;
		var dragListener = this.dragListener;
		component.bindDateHandlerToEl(el, 'mousedown', function(ev) {
			if (_this.opt('selectable') && !component.shouldIgnoreMouse()) {
				dragListener.startInteraction(ev, {
					distance: _this.opt('selectMinDistance')
				});
			}
		});
		component.bindDateHandlerToEl(el, 'touchstart', function(ev) {
			if (_this.opt('selectable') && !component.shouldIgnoreTouch()) {
				dragListener.startInteraction(ev, {
					delay: _this.getDelay()
				});
			}
		});
		preventSelection(el);
	},
	buildDragListener: function() {
		var _this = this;
		var component = this.component;
		var selectionFootprint; 
		var dragListener = new HitDragListener(component, {
			scroll: this.opt('dragScroll'),
			interactionStart: function() {
				selectionFootprint = null;
			},
			dragStart: function(ev) {
				_this.view.unselect(ev); 
			},
			hitOver: function(hit, isOrig, origHit) {
				var origHitFootprint;
				var hitFootprint;
				if (origHit) { 
					origHitFootprint = component.getSafeHitFootprint(origHit);
					hitFootprint = component.getSafeHitFootprint(hit);
					if (origHitFootprint && hitFootprint) {
						selectionFootprint = _this.computeSelection(origHitFootprint, hitFootprint);
					}
					else {
						selectionFootprint = null;
					}
					if (selectionFootprint) {
						component.renderSelectionFootprint(selectionFootprint);
					}
					else if (selectionFootprint === false) {
						disableCursor();
					}
				}
			},
			hitOut: function() { 
				selectionFootprint = null;
				component.unrenderSelection();
			},
			hitDone: function() { 
				enableCursor();
			},
			interactionEnd: function(ev, isCancelled) {
				if (!isCancelled && selectionFootprint) {
					_this.view.reportSelection(selectionFootprint, ev);
				}
			}
		});
		return dragListener;
	},
	computeSelection: function(footprint0, footprint1) {
		var wholeFootprint = this.computeSelectionFootprint(footprint0, footprint1);
		if (wholeFootprint && !this.isSelectionFootprintAllowed(wholeFootprint)) {
			return false;
		}
		return wholeFootprint;
	},
	computeSelectionFootprint: function(footprint0, footprint1) {
		var ms = [
			footprint0.unzonedRange.startMs,
			footprint0.unzonedRange.endMs,
			footprint1.unzonedRange.startMs,
			footprint1.unzonedRange.endMs
		];
		ms.sort(compareNumbers);
		return new ComponentFootprint(
			new UnzonedRange(ms[0], ms[3]),
			footprint0.isAllDay
		);
	},
	isSelectionFootprintAllowed: function(componentFootprint) {
		return this.component.dateProfile.validUnzonedRange.containsRange(componentFootprint.unzonedRange) &&
			this.view.calendar.isSelectionFootprintAllowed(componentFootprint);
	}
});
;;
var EventDragging = FC.EventDragging = Interaction.extend({
	eventPointing: null,
	dragListener: null,
	isDragging: false,
	constructor: function(component, eventPointing) {
		Interaction.call(this, component);
		this.eventPointing = eventPointing;
	},
	end: function() {
		if (this.dragListener) {
			this.dragListener.endInteraction();
		}
	},
	getSelectionDelay: function() {
		var delay = this.opt('eventLongPressDelay');
		if (delay == null) {
			delay = this.opt('longPressDelay'); 
		}
		return delay;
	},
	bindToEl: function(el) {
		var component = this.component;
		component.bindSegHandlerToEl(el, 'mousedown', this.handleMousedown.bind(this));
		component.bindSegHandlerToEl(el, 'touchstart', this.handleTouchStart.bind(this));
	},
	handleMousedown: function(seg, ev) {
		if (this.component.canStartDrag(seg, ev)) {
			this.buildDragListener(seg).startInteraction(ev, { distance: 5 });
		}
	},
	handleTouchStart: function(seg, ev) {
		var component = this.component;
		var settings = {
			delay: this.view.isEventDefSelected(seg.footprint.eventDef) ? 
				0 : this.getSelectionDelay()
		};
		if (component.canStartDrag(seg, ev)) {
			this.buildDragListener(seg).startInteraction(ev, settings);
		}
		else if (component.canStartSelection(seg, ev)) {
			this.buildSelectListener(seg).startInteraction(ev, settings);
		}
	},
	buildSelectListener: function(seg) {
		var _this = this;
		var view = this.view;
		var eventDef = seg.footprint.eventDef;
		var eventInstance = seg.footprint.eventInstance; 
		if (this.dragListener) {
			return this.dragListener;
		}
		var dragListener = this.dragListener = new DragListener({
			dragStart: function(ev) {
				if (
					dragListener.isTouch &&
					!view.isEventDefSelected(eventDef) &&
					eventInstance
				) {
					view.selectEventInstance(eventInstance);
				}
			},
			interactionEnd: function(ev) {
				_this.dragListener = null;
			}
		});
		return dragListener;
	},
	buildDragListener: function(seg) {
		var _this = this;
		var component = this.component;
		var view = this.view;
		var calendar = view.calendar;
		var eventManager = calendar.eventManager;
		var el = seg.el;
		var eventDef = seg.footprint.eventDef;
		var eventInstance = seg.footprint.eventInstance; 
		var isDragging;
		var mouseFollower; 
		var eventDefMutation;
		if (this.dragListener) {
			return this.dragListener;
		}
		var dragListener = this.dragListener = new HitDragListener(view, {
			scroll: this.opt('dragScroll'),
			subjectEl: el,
			subjectCenter: true,
			interactionStart: function(ev) {
				seg.component = component; 
				isDragging = false;
				mouseFollower = new MouseFollower(seg.el, {
					additionalClass: 'fc-dragging',
					parentEl: view.el,
					opacity: dragListener.isTouch ? null : _this.opt('dragOpacity'),
					revertDuration: _this.opt('dragRevertDuration'),
					zIndex: 2 
				});
				mouseFollower.hide(); 
				mouseFollower.start(ev);
			},
			dragStart: function(ev) {
				if (
					dragListener.isTouch &&
					!view.isEventDefSelected(eventDef) &&
					eventInstance
				) {
					view.selectEventInstance(eventInstance);
				}
				isDragging = true;
				_this.eventPointing.handleMouseout(seg, ev);
				_this.segDragStart(seg, ev);
				view.hideEventsWithId(seg.footprint.eventDef.id);
			},
			hitOver: function(hit, isOrig, origHit) {
				var isAllowed = true;
				var origFootprint;
				var footprint;
				var mutatedEventInstanceGroup;
				if (seg.hit) {
					origHit = seg.hit;
				}
				origFootprint = origHit.component.getSafeHitFootprint(origHit);
				footprint = hit.component.getSafeHitFootprint(hit);
				if (origFootprint && footprint) {
					eventDefMutation = _this.computeEventDropMutation(origFootprint, footprint, eventDef);
					if (eventDefMutation) {
						mutatedEventInstanceGroup = eventManager.buildMutatedEventInstanceGroup(
							eventDef.id,
							eventDefMutation
						);
						isAllowed = component.isEventInstanceGroupAllowed(mutatedEventInstanceGroup);
					}
					else {
						isAllowed = false;
					}
				}
				else {
					isAllowed = false;
				}
				if (!isAllowed) {
					eventDefMutation = null;
					disableCursor();
				}
				if (
					eventDefMutation &&
					view.renderDrag( 
						component.eventRangesToEventFootprints(
							mutatedEventInstanceGroup.sliceRenderRanges(component.dateProfile.renderUnzonedRange, calendar)
						),
						seg,
						dragListener.isTouch
					)
				) {
					mouseFollower.hide(); 
				}
				else {
					mouseFollower.show(); 
				}
				if (isOrig) {
					eventDefMutation = null;
				}
			},
			hitOut: function() { 
				view.unrenderDrag(seg); 
				mouseFollower.show(); 
				eventDefMutation = null;
			},
			hitDone: function() { 
				enableCursor();
			},
			interactionEnd: function(ev) {
				delete seg.component; 
				mouseFollower.stop(!eventDefMutation, function() {
					if (isDragging) {
						view.unrenderDrag(seg);
						_this.segDragStop(seg, ev);
					}
					view.showEventsWithId(seg.footprint.eventDef.id);
					if (eventDefMutation) {
						view.reportEventDrop(eventInstance, eventDefMutation, el, ev);
					}
				});
				_this.dragListener = null;
			}
		});
		return dragListener;
	},
	segDragStart: function(seg, ev) {
		this.isDragging = true;
		this.component.publiclyTrigger('eventDragStart', {
			context: seg.el[0],
			args: [
				seg.footprint.getEventLegacy(),
				ev,
				{}, 
				this.view
			]
		});
	},
	segDragStop: function(seg, ev) {
		this.isDragging = false;
		this.component.publiclyTrigger('eventDragStop', {
			context: seg.el[0],
			args: [
				seg.footprint.getEventLegacy(),
				ev,
				{}, 
				this.view
			]
		});
	},
	computeEventDropMutation: function(startFootprint, endFootprint, eventDef) {
		var eventDefMutation = new EventDefMutation();
		eventDefMutation.setDateMutation(
			this.computeEventDateMutation(startFootprint, endFootprint)
		);
		return eventDefMutation;
	},
	computeEventDateMutation: function(startFootprint, endFootprint) {
		var date0 = startFootprint.unzonedRange.getStart();
		var date1 = endFootprint.unzonedRange.getStart();
		var clearEnd = false;
		var forceTimed = false;
		var forceAllDay = false;
		var dateDelta;
		var dateMutation;
		if (startFootprint.isAllDay !== endFootprint.isAllDay) {
			clearEnd = true;
			if (endFootprint.isAllDay) {
				forceAllDay = true;
				date0.stripTime();
			}
			else {
				forceTimed = true;
			}
		}
		dateDelta = this.component.diffDates(date1, date0);
		dateMutation = new EventDefDateMutation();
		dateMutation.clearEnd = clearEnd;
		dateMutation.forceTimed = forceTimed;
		dateMutation.forceAllDay = forceAllDay;
		dateMutation.setDateDelta(dateDelta);
		return dateMutation;
	}
});
;;
var EventResizing = FC.EventResizing = Interaction.extend({
	eventPointing: null,
	dragListener: null,
	isResizing: false,
	constructor: function(component, eventPointing) {
		Interaction.call(this, component);
		this.eventPointing = eventPointing;
	},
	end: function() {
		if (this.dragListener) {
			this.dragListener.endInteraction();
		}
	},
	bindToEl: function(el) {
		var component = this.component;
		component.bindSegHandlerToEl(el, 'mousedown', this.handleMouseDown.bind(this));
		component.bindSegHandlerToEl(el, 'touchstart', this.handleTouchStart.bind(this));
	},
	handleMouseDown: function(seg, ev) {
		if (this.component.canStartResize(seg, ev)) {
			this.buildDragListener(seg, $(ev.target).is('.fc-start-resizer'))
				.startInteraction(ev, { distance: 5 });
		}
	},
	handleTouchStart: function(seg, ev) {
		if (this.component.canStartResize(seg, ev)) {
			this.buildDragListener(seg, $(ev.target).is('.fc-start-resizer'))
				.startInteraction(ev);
		}
	},
	buildDragListener: function(seg, isStart) {
		var _this = this;
		var component = this.component;
		var view = this.view;
		var calendar = view.calendar;
		var eventManager = calendar.eventManager;
		var el = seg.el;
		var eventDef = seg.footprint.eventDef;
		var eventInstance = seg.footprint.eventInstance;
		var isDragging;
		var resizeMutation; 
		var dragListener = this.dragListener = new HitDragListener(component, {
			scroll: this.opt('dragScroll'),
			subjectEl: el,
			interactionStart: function() {
				isDragging = false;
			},
			dragStart: function(ev) {
				isDragging = true;
				_this.eventPointing.handleMouseout(seg, ev);
				_this.segResizeStart(seg, ev);
			},
			hitOver: function(hit, isOrig, origHit) {
				var isAllowed = true;
				var origHitFootprint = component.getSafeHitFootprint(origHit);
				var hitFootprint = component.getSafeHitFootprint(hit);
				var mutatedEventInstanceGroup;
				if (origHitFootprint && hitFootprint) {
					resizeMutation = isStart ?
						_this.computeEventStartResizeMutation(origHitFootprint, hitFootprint, seg.footprint) :
						_this.computeEventEndResizeMutation(origHitFootprint, hitFootprint, seg.footprint);
					if (resizeMutation) {
						mutatedEventInstanceGroup = eventManager.buildMutatedEventInstanceGroup(
							eventDef.id,
							resizeMutation
						);
						isAllowed = component.isEventInstanceGroupAllowed(mutatedEventInstanceGroup);
					}
					else {
						isAllowed = false;
					}
				}
				else {
					isAllowed = false;
				}
				if (!isAllowed) {
					resizeMutation = null;
					disableCursor();
				}
				else if (resizeMutation.isEmpty()) {
					resizeMutation = null;
				}
				if (resizeMutation) {
					view.hideEventsWithId(seg.footprint.eventDef.id);
					view.renderEventResize(
						component.eventRangesToEventFootprints(
							mutatedEventInstanceGroup.sliceRenderRanges(component.dateProfile.renderUnzonedRange, calendar)
						),
						seg
					);
				}
			},
			hitOut: function() { 
				resizeMutation = null;
			},
			hitDone: function() { 
				view.unrenderEventResize(seg);
				view.showEventsWithId(seg.footprint.eventDef.id);
				enableCursor();
			},
			interactionEnd: function(ev) {
				if (isDragging) {
					_this.segResizeStop(seg, ev);
				}
				if (resizeMutation) { 
					view.reportEventResize(eventInstance, resizeMutation, el, ev);
				}
				_this.dragListener = null;
			}
		});
		return dragListener;
	},
	segResizeStart: function(seg, ev) {
		this.isResizing = true;
		this.component.publiclyTrigger('eventResizeStart', {
			context: seg.el[0],
			args: [
				seg.footprint.getEventLegacy(),
				ev,
				{}, 
				this.view
			]
		});
	},
	segResizeStop: function(seg, ev) {
		this.isResizing = false;
		this.component.publiclyTrigger('eventResizeStop', {
			context: seg.el[0],
			args: [
				seg.footprint.getEventLegacy(),
				ev,
				{}, 
				this.view
			]
		});
	},
	computeEventStartResizeMutation: function(startFootprint, endFootprint, origEventFootprint) {
		var origRange = origEventFootprint.componentFootprint.unzonedRange;
		var startDelta = this.component.diffDates(
			endFootprint.unzonedRange.getStart(),
			startFootprint.unzonedRange.getStart()
		);
		var dateMutation;
		var eventDefMutation;
		if (origRange.getStart().add(startDelta) < origRange.getEnd()) {
			dateMutation = new EventDefDateMutation();
			dateMutation.setStartDelta(startDelta);
			eventDefMutation = new EventDefMutation();
			eventDefMutation.setDateMutation(dateMutation);
			return eventDefMutation;
		}
		return false;
	},
	computeEventEndResizeMutation: function(startFootprint, endFootprint, origEventFootprint) {
		var origRange = origEventFootprint.componentFootprint.unzonedRange;
		var endDelta = this.component.diffDates(
			endFootprint.unzonedRange.getEnd(),
			startFootprint.unzonedRange.getEnd()
		);
		var dateMutation;
		var eventDefMutation;
		if (origRange.getEnd().add(endDelta) > origRange.getStart()) {
			dateMutation = new EventDefDateMutation();
			dateMutation.setEndDelta(endDelta);
			eventDefMutation = new EventDefMutation();
			eventDefMutation.setDateMutation(dateMutation);
			return eventDefMutation;
		}
		return false;
	}
});
;;
var ExternalDropping = FC.ExternalDropping = Interaction.extend(ListenerMixin, {
	dragListener: null,
	isDragging: false, 
	end: function() {
		if (this.dragListener) {
			this.dragListener.endInteraction();
		}
	},
	bindToDocument: function() {
		this.listenTo($(document), {
			dragstart: this.handleDragStart, 
			sortstart: this.handleDragStart 
		});
	},
	unbindFromDocument: function() {
		this.stopListeningTo($(document));
	},
	handleDragStart: function(ev, ui) {
		var el;
		var accept;
		if (this.opt('droppable')) { 
			el = $((ui ? ui.item : null) || ev.target);
			accept = this.opt('dropAccept');
			if ($.isFunction(accept) ? accept.call(el[0], el) : el.is(accept)) {
				if (!this.isDragging) { 
					this.listenToExternalDrag(el, ev, ui);
				}
			}
		}
	},
	listenToExternalDrag: function(el, ev, ui) {
		var _this = this;
		var component = this.component;
		var view = this.view;
		var meta = getDraggedElMeta(el); 
		var singleEventDef; 
		var dragListener = _this.dragListener = new HitDragListener(component, {
			interactionStart: function() {
				_this.isDragging = true;
			},
			hitOver: function(hit) {
				var isAllowed = true;
				var hitFootprint = hit.component.getSafeHitFootprint(hit); 
				var mutatedEventInstanceGroup;
				if (hitFootprint) {
					singleEventDef = _this.computeExternalDrop(hitFootprint, meta);
					if (singleEventDef) {
						mutatedEventInstanceGroup = new EventInstanceGroup(
							singleEventDef.buildInstances()
						);
						isAllowed = meta.eventProps ? 
							component.isEventInstanceGroupAllowed(mutatedEventInstanceGroup) :
							component.isExternalInstanceGroupAllowed(mutatedEventInstanceGroup);
					}
					else {
						isAllowed = false;
					}
				}
				else {
					isAllowed = false;
				}
				if (!isAllowed) {
					singleEventDef = null;
					disableCursor();
				}
				if (singleEventDef) {
					component.renderDrag( 
						component.eventRangesToEventFootprints(
							mutatedEventInstanceGroup.sliceRenderRanges(component.dateProfile.renderUnzonedRange, view.calendar)
						)
					);
				}
			},
			hitOut: function() {
				singleEventDef = null; 
			},
			hitDone: function() { 
				enableCursor();
				component.unrenderDrag();
			},
			interactionEnd: function(ev) {
				if (singleEventDef) { 
					view.reportExternalDrop(
						singleEventDef,
						Boolean(meta.eventProps), 
						Boolean(meta.stick), 
						el, ev, ui
					);
				}
				_this.isDragging = false;
				_this.dragListener = null;
			}
		});
		dragListener.startDrag(ev); 
	},
	computeExternalDrop: function(componentFootprint, meta) {
		var calendar = this.view.calendar;
		var start = FC.moment.utc(componentFootprint.unzonedRange.startMs).stripZone();
		var end;
		var eventDef;
		if (componentFootprint.isAllDay) {
			if (meta.startTime) {
				start.time(meta.startTime);
			}
			else {
				start.stripTime();
			}
		}
		if (meta.duration) {
			end = start.clone().add(meta.duration);
		}
		start = calendar.applyTimezone(start);
		if (end) {
			end = calendar.applyTimezone(end);
		}
		eventDef = SingleEventDef.parse(
			$.extend({}, meta.eventProps, {
				start: start,
				end: end
			}),
			new EventSource(calendar)
		);
		return eventDef;
	}
});
FC.dataAttrPrefix = '';
function getDraggedElMeta(el) {
	var prefix = FC.dataAttrPrefix;
	var eventProps; 
	var startTime; 
	var duration;
	var stick;
	if (prefix) { prefix += '-'; }
	eventProps = el.data(prefix + 'event') || null;
	if (eventProps) {
		if (typeof eventProps === 'object') {
			eventProps = $.extend({}, eventProps); 
		}
		else { 
			eventProps = {};
		}
		startTime = eventProps.start;
		if (startTime == null) { startTime = eventProps.time; } 
		duration = eventProps.duration;
		stick = eventProps.stick;
		delete eventProps.start;
		delete eventProps.time;
		delete eventProps.duration;
		delete eventProps.stick;
	}
	if (startTime == null) { startTime = el.data(prefix + 'start'); }
	if (startTime == null) { startTime = el.data(prefix + 'time'); } 
	if (duration == null) { duration = el.data(prefix + 'duration'); }
	if (stick == null) { stick = el.data(prefix + 'stick'); }
	startTime = startTime != null ? moment.duration(startTime) : null;
	duration = duration != null ? moment.duration(duration) : null;
	stick = Boolean(stick);
	return { eventProps: eventProps, startTime: startTime, duration: duration, stick: stick };
}
;;
var EventPointing = FC.EventPointing = Interaction.extend({
	mousedOverSeg: null, 
	bindToEl: function(el) {
		var component = this.component;
		component.bindSegHandlerToEl(el, 'click', this.handleClick.bind(this));
		component.bindSegHandlerToEl(el, 'mouseenter', this.handleMouseover.bind(this));
		component.bindSegHandlerToEl(el, 'mouseleave', this.handleMouseout.bind(this));
	},
	handleClick: function(seg, ev) {
		var res = this.component.publiclyTrigger('eventClick', { 
			context: seg.el[0],
			args: [ seg.footprint.getEventLegacy(), ev, this.view ]
		});
		if (res === false) {
			ev.preventDefault();
		}
	},
	handleMouseover: function(seg, ev) {
		if (
			!GlobalEmitter.get().shouldIgnoreMouse() &&
			!this.mousedOverSeg
		) {
			this.mousedOverSeg = seg;
			if (this.view.isEventDefResizable(seg.footprint.eventDef)) {
				seg.el.addClass('fc-allow-mouse-resize');
			}
			this.component.publiclyTrigger('eventMouseover', {
				context: seg.el[0],
				args: [ seg.footprint.getEventLegacy(), ev, this.view ]
			});
		}
	},
	handleMouseout: function(seg, ev) {
		if (this.mousedOverSeg) {
			this.mousedOverSeg = null;
			if (this.view.isEventDefResizable(seg.footprint.eventDef)) {
				seg.el.removeClass('fc-allow-mouse-resize');
			}
			this.component.publiclyTrigger('eventMouseout', {
				context: seg.el[0],
				args: [
					seg.footprint.getEventLegacy(),
					ev || {}, 
					this.view
				]
			});
		}
	},
	end: function() {
		if (this.mousedOverSeg) {
			this.handleMouseout(this.mousedOverSeg);
		}
	}
});
;;
var StandardInteractionsMixin = FC.StandardInteractionsMixin = {
	dateClickingClass: DateClicking,
	dateSelectingClass: DateSelecting,
	eventPointingClass: EventPointing,
	eventDraggingClass: EventDragging,
	eventResizingClass: EventResizing,
	externalDroppingClass: ExternalDropping
};
;;
var EventRenderer = FC.EventRenderer = Class.extend({
	view: null,
	component: null,
	fillRenderer: null, 
	fgSegs: null,
	bgSegs: null,
	eventTimeFormat: null,
	displayEventTime: null,
	displayEventEnd: null,
	constructor: function(component, fillRenderer) { 
		this.view = component._getView();
		this.component = component;
		this.fillRenderer = fillRenderer;
	},
	opt: function(name) {
		return this.view.opt(name);
	},
	rangeUpdated: function() {
		var displayEventTime;
		var displayEventEnd;
		this.eventTimeFormat =
			this.opt('eventTimeFormat') ||
			this.opt('timeFormat') || 
			this.computeEventTimeFormat();
		displayEventTime = this.opt('displayEventTime');
		if (displayEventTime == null) {
			displayEventTime = this.computeDisplayEventTime(); 
		}
		displayEventEnd = this.opt('displayEventEnd');
		if (displayEventEnd == null) {
			displayEventEnd = this.computeDisplayEventEnd(); 
		}
		this.displayEventTime = displayEventTime;
		this.displayEventEnd = displayEventEnd;
	},
	render: function(eventsPayload) {
		var dateProfile = this.component._getDateProfile();
		var eventDefId;
		var instanceGroup;
		var eventRanges;
		var bgRanges = [];
		var fgRanges = [];
		for (eventDefId in eventsPayload) {
			instanceGroup = eventsPayload[eventDefId];
			eventRanges = instanceGroup.sliceRenderRanges(
				dateProfile.activeUnzonedRange
			);
			if (instanceGroup.getEventDef().hasBgRendering()) {
				bgRanges.push.apply(bgRanges, eventRanges);
			}
			else {
				fgRanges.push.apply(fgRanges, eventRanges);
			}
		}
		this.renderBgRanges(bgRanges);
		this.renderFgRanges(fgRanges);
	},
	unrender: function() {
		this.unrenderBgRanges();
		this.unrenderFgRanges();
	},
	renderFgRanges: function(eventRanges) {
		var eventFootprints = this.component.eventRangesToEventFootprints(eventRanges);
		var segs = this.component.eventFootprintsToSegs(eventFootprints);
		segs = this.renderFgSegEls(segs);
		if (this.renderFgSegs(segs) !== false) { 
			this.fgSegs = segs;
		}
	},
	unrenderFgRanges: function() {
		this.unrenderFgSegs(this.fgSegs || []);
		this.fgSegs = null;
	},
	renderBgRanges: function(eventRanges) {
		var eventFootprints = this.component.eventRangesToEventFootprints(eventRanges);
		var segs = this.component.eventFootprintsToSegs(eventFootprints);
		if (this.renderBgSegs(segs) !== false) { 
			this.bgSegs = segs;
		}
	},
	unrenderBgRanges: function() {
		this.unrenderBgSegs();
		this.bgSegs = null;
	},
	getSegs: function() {
		return (this.bgSegs || []).concat(this.fgSegs || []);
	},
	renderFgSegs: function(segs) {
		return false; 
	},
	unrenderFgSegs: function(segs) {
	},
	renderBgSegs: function(segs) {
		var _this = this;
		if (this.fillRenderer) {
			this.fillRenderer.renderSegs('bgEvent', segs, {
				getClasses: function(seg) {
					return _this.getBgClasses(seg.footprint.eventDef);
				},
				getCss: function(seg) {
					return {
						'background-color': _this.getBgColor(seg.footprint.eventDef)
					};
				},
				filterEl: function(seg, el) {
					return _this.filterEventRenderEl(seg.footprint, el);
				}
			});
		}
		else {
			return false; 
		}
	},
	unrenderBgSegs: function() {
		if (this.fillRenderer) {
			this.fillRenderer.unrender('bgEvent');
		}
	},
	renderFgSegEls: function(segs, disableResizing) {
		var _this = this;
		var hasEventRenderHandlers = this.view.hasPublicHandlers('eventRender');
		var html = '';
		var renderedSegs = [];
		var i;
		if (segs.length) { 
			for (i = 0; i < segs.length; i++) {
				this.beforeFgSegHtml(segs[i]);
				html += this.fgSegHtml(segs[i], disableResizing);
			}
			$(html).each(function(i, node) {
				var seg = segs[i];
				var el = $(node);
				if (hasEventRenderHandlers) { 
					el = _this.filterEventRenderEl(seg.footprint, el);
				}
				if (el) {
					el.data('fc-seg', seg); 
					seg.el = el;
					renderedSegs.push(seg);
				}
			});
		}
		return renderedSegs;
	},
	beforeFgSegHtml: function(seg) { 
	},
	fgSegHtml: function(seg, disableResizing) {
	},
	getSegClasses: function(seg, isDraggable, isResizable) {
		var classes = [
			'fc-event',
			seg.isStart ? 'fc-start' : 'fc-not-start',
			seg.isEnd ? 'fc-end' : 'fc-not-end'
		].concat(this.getClasses(seg.footprint.eventDef));
		if (isDraggable) {
			classes.push('fc-draggable');
		}
		if (isResizable) {
			classes.push('fc-resizable');
		}
		if (this.view.isEventDefSelected(seg.footprint.eventDef)) {
			classes.push('fc-selected');
		}
		return classes;
	},
	filterEventRenderEl: function(eventFootprint, el) {
		var legacy = eventFootprint.getEventLegacy();
		var custom = this.view.publiclyTrigger('eventRender', {
			context: legacy,
			args: [ legacy, el, this.view ]
		});
		if (custom === false) { 
			el = null;
		}
		else if (custom && custom !== true) {
			el = $(custom);
		}
		return el;
	},
	getTimeText: function(eventFootprint, formatStr, displayEnd) {
		return this._getTimeText(
			eventFootprint.eventInstance.dateProfile.start,
			eventFootprint.eventInstance.dateProfile.end,
			eventFootprint.componentFootprint.isAllDay,
			formatStr,
			displayEnd
		);
	},
	_getTimeText: function(start, end, isAllDay, formatStr, displayEnd) {
		if (formatStr == null) {
			formatStr = this.eventTimeFormat;
		}
		if (displayEnd == null) {
			displayEnd = this.displayEventEnd;
		}
		if (this.displayEventTime && !isAllDay) {
			if (displayEnd && end) {
				return this.view.formatRange(
					{ start: start, end: end },
					false, 
					formatStr
				);
			}
			else {
				return start.format(formatStr);
			}
		}
		return '';
	},
	computeEventTimeFormat: function() {
		return this.opt('smallTimeFormat');
	},
	computeDisplayEventTime: function() {
		return true;
	},
	computeDisplayEventEnd: function() {
		return true;
	},
	getBgClasses: function(eventDef) {
		var classNames = this.getClasses(eventDef);
		classNames.push('fc-bgevent');
		return classNames;
	},
	getClasses: function(eventDef) {
		var objs = this.getStylingObjs(eventDef);
		var i;
		var classNames = [];
		for (i = 0; i < objs.length; i++) {
			classNames.push.apply( 
				classNames,
				objs[i].eventClassName || objs[i].className || []
			);
		}
		return classNames;
	},
	getSkinCss: function(eventDef) {
		return {
			'background-color': this.getBgColor(eventDef),
			'border-color': this.getBorderColor(eventDef),
			color: this.getTextColor(eventDef)
		};
	},
	getBgColor: function(eventDef) {
		var objs = this.getStylingObjs(eventDef);
		var i;
		var val;
		for (i = 0; i < objs.length && !val; i++) {
			val = objs[i].eventBackgroundColor || objs[i].eventColor ||
				objs[i].backgroundColor || objs[i].color;
		}
		if (!val) {
			val = this.opt('eventBackgroundColor') || this.opt('eventColor');
		}
		return val;
	},
	getBorderColor: function(eventDef) {
		var objs = this.getStylingObjs(eventDef);
		var i;
		var val;
		for (i = 0; i < objs.length && !val; i++) {
			val = objs[i].eventBorderColor || objs[i].eventColor ||
				objs[i].borderColor || objs[i].color;
		}
		if (!val) {
			val = this.opt('eventBorderColor') || this.opt('eventColor');
		}
		return val;
	},
	getTextColor: function(eventDef) {
		var objs = this.getStylingObjs(eventDef);
		var i;
		var val;
		for (i = 0; i < objs.length && !val; i++) {
			val = objs[i].eventTextColor ||
				objs[i].textColor;
		}
		if (!val) {
			val = this.opt('eventTextColor');
		}
		return val;
	},
	getStylingObjs: function(eventDef) {
		var objs = this.getFallbackStylingObjs(eventDef);
		objs.unshift(eventDef);
		return objs;
	},
	getFallbackStylingObjs: function(eventDef) {
		return [ eventDef.source ];
	},
	sortEventSegs: function(segs) {
		segs.sort(proxy(this, 'compareEventSegs'));
	},
	compareEventSegs: function(seg1, seg2) {
		var f1 = seg1.footprint.componentFootprint;
		var r1 = f1.unzonedRange;
		var f2 = seg2.footprint.componentFootprint;
		var r2 = f2.unzonedRange;
		return r1.startMs - r2.startMs || 
			(r2.endMs - r2.startMs) - (r1.endMs - r1.startMs) || 
			f2.isAllDay - f1.isAllDay || 
			compareByFieldSpecs(
				seg1.footprint.eventDef,
				seg2.footprint.eventDef,
				this.view.eventOrderSpecs
			);
	}
});
;;
var BusinessHourRenderer = FC.BusinessHourRenderer = Class.extend({
	component: null,
	fillRenderer: null,
	segs: null,
	constructor: function(component, fillRenderer) {
		this.component = component;
		this.fillRenderer = fillRenderer;
	},
	render: function(businessHourGenerator) {
		var component = this.component;
		var unzonedRange = component._getDateProfile().activeUnzonedRange;
		var eventInstanceGroup = businessHourGenerator.buildEventInstanceGroup(
			component.hasAllDayBusinessHours,
			unzonedRange
		);
		var eventFootprints = eventInstanceGroup ?
			component.eventRangesToEventFootprints(
				eventInstanceGroup.sliceRenderRanges(unzonedRange)
			) :
			[];
		this.renderEventFootprints(eventFootprints);
	},
	renderEventFootprints: function(eventFootprints) {
		var segs = this.component.eventFootprintsToSegs(eventFootprints);
		this.renderSegs(segs);
		this.segs = segs;
	},
	renderSegs: function(segs) {
		if (this.fillRenderer) {
			this.fillRenderer.renderSegs('businessHours', segs, {
				getClasses: function(seg) {
					return [ 'fc-nonbusiness', 'fc-bgevent' ];
				}
			});
		}
	},
	unrender: function() {
		if (this.fillRenderer) {
			this.fillRenderer.unrender('businessHours');
		}
		this.segs = null;
	},
	getSegs: function() {
		return this.segs || [];
	}
});
;;
var FillRenderer = FC.FillRenderer = Class.extend({ 
	fillSegTag: 'div',
	component: null,
	elsByFill: null, 
	constructor: function(component) {
		this.component = component;
		this.elsByFill = {};
	},
	renderFootprint: function(type, componentFootprint, props) {
		this.renderSegs(
			type,
			this.component.componentFootprintToSegs(componentFootprint),
			props
		);
	},
	renderSegs: function(type, segs, props) {
		var els;
		segs = this.buildSegEls(type, segs, props); 
		els = this.attachSegEls(type, segs);
		if (els) {
			this.reportEls(type, els);
		}
		return segs;
	},
	unrender: function(type) {
		var el = this.elsByFill[type];
		if (el) {
			el.remove();
			delete this.elsByFill[type];
		}
	},
	buildSegEls: function(type, segs, props) {
		var _this = this;
		var html = '';
		var renderedSegs = [];
		var i;
		if (segs.length) {
			for (i = 0; i < segs.length; i++) {
				html += this.buildSegHtml(type, segs[i], props);
			}
			$(html).each(function(i, node) {
				var seg = segs[i];
				var el = $(node);
				if (props.filterEl) {
					el = props.filterEl(seg, el);
				}
				if (el) { 
					el = $(el); 
					if (el.is(_this.fillSegTag)) {
						seg.el = el;
						renderedSegs.push(seg);
					}
				}
			});
		}
		return renderedSegs;
	},
	buildSegHtml: function(type, seg, props) {
		var classes = props.getClasses ? props.getClasses(seg) : [];
		var css = cssToStr(props.getCss ? props.getCss(seg) : {});
		return '<' + this.fillSegTag +
			(classes.length ? ' class="' + classes.join(' ') + '"' : '') +
			(css ? ' style="' + css + '"' : '') +
			' />';
	},
	attachSegEls: function(type, segs) {
	},
	reportEls: function(type, nodes) {
		if (this.elsByFill[type]) {
			this.elsByFill[type] = this.elsByFill[type].add(nodes);
		}
		else {
			this.elsByFill[type] = $(nodes);
		}
	}
});
;;
var HelperRenderer = FC.HelperRenderer = Class.extend({
	view: null,
	component: null,
	eventRenderer: null,
	helperEls: null,
	constructor: function(component, eventRenderer) {
		this.view = component._getView();
		this.component = component;
		this.eventRenderer = eventRenderer;
	},
	renderComponentFootprint: function(componentFootprint) {
		this.renderEventFootprints([
			this.fabricateEventFootprint(componentFootprint)
		]);
	},
	renderEventDraggingFootprints: function(eventFootprints, sourceSeg, isTouch) {
		this.renderEventFootprints(
			eventFootprints,
			sourceSeg,
			'fc-dragging',
			isTouch ? null : this.view.opt('dragOpacity')
		);
	},
	renderEventResizingFootprints: function(eventFootprints, sourceSeg, isTouch) {
		this.renderEventFootprints(
			eventFootprints,
			sourceSeg,
			'fc-resizing'
		);
	},
	renderEventFootprints: function(eventFootprints, sourceSeg, extraClassNames, opacity) {
		var segs = this.component.eventFootprintsToSegs(eventFootprints);
		var classNames = 'fc-helper ' + (extraClassNames || '');
		var i;
		segs = this.eventRenderer.renderFgSegEls(segs);
		for (i = 0; i < segs.length; i++) {
			segs[i].el.addClass(classNames);
		}
		if (opacity != null) {
			for (i = 0; i < segs.length; i++) {
				segs[i].el.css('opacity', opacity);
			}
		}
		this.helperEls = this.renderSegs(segs, sourceSeg);
	},
	renderSegs: function(segs, sourceSeg) {
	},
	unrender: function() {
		if (this.helperEls) {
			this.helperEls.remove();
			this.helperEls = null;
		}
	},
	fabricateEventFootprint: function(componentFootprint) {
		var calendar = this.view.calendar;
		var eventDateProfile = calendar.footprintToDateProfile(componentFootprint);
		var dummyEvent = new SingleEventDef(new EventSource(calendar));
		var dummyInstance;
		dummyEvent.dateProfile = eventDateProfile;
		dummyInstance = dummyEvent.buildInstance();
		return new EventFootprint(componentFootprint, dummyEvent, dummyInstance);
	}
});
;;
var Component = Model.extend({
	el: null,
	setElement: function(el) {
		this.el = el;
		this.bindGlobalHandlers();
		this.renderSkeleton();
		this.set('isInDom', true);
	},
	removeElement: function() {
		this.unset('isInDom');
		this.unrenderSkeleton();
		this.unbindGlobalHandlers();
		this.el.remove();
	},
	bindGlobalHandlers: function() {
	},
	unbindGlobalHandlers: function() {
	},
	renderSkeleton: function() {
	},
	unrenderSkeleton: function() {
	}
});
;;
var DateComponent = FC.DateComponent = Component.extend({
	uid: null,
	childrenByUid: null,
	isRTL: false, 
	nextDayThreshold: null, 
	dateProfile: null, 
	eventRendererClass: null,
	helperRendererClass: null,
	businessHourRendererClass: null,
	fillRendererClass: null,
	eventRenderer: null,
	helperRenderer: null,
	businessHourRenderer: null,
	fillRenderer: null,
	hitsNeededDepth: 0, 
	hasAllDayBusinessHours: false, 
	isDatesRendered: false,
	constructor: function() {
		Component.call(this);
		this.uid = String(DateComponent.guid++);
		this.childrenByUid = {};
		this.nextDayThreshold = moment.duration(this.opt('nextDayThreshold'));
		this.isRTL = this.opt('isRTL');
		if (this.fillRendererClass) {
			this.fillRenderer = new this.fillRendererClass(this);
		}
		if (this.eventRendererClass) { 
			this.eventRenderer = new this.eventRendererClass(this, this.fillRenderer);
		}
		if (this.helperRendererClass && this.eventRenderer) {
			this.helperRenderer = new this.helperRendererClass(this, this.eventRenderer);
		}
		if (this.businessHourRendererClass && this.fillRenderer) {
			this.businessHourRenderer = new this.businessHourRendererClass(this, this.fillRenderer);
		}
	},
	addChild: function(child) {
		if (!this.childrenByUid[child.uid]) {
			this.childrenByUid[child.uid] = child;
			return true;
		}
		return false;
	},
	removeChild: function(child) {
		if (this.childrenByUid[child.uid]) {
			delete this.childrenByUid[child.uid];
			return true;
		}
		return false;
	},
	updateSize: function(totalHeight, isAuto, isResize) {
		this.callChildren('updateSize', arguments);
	},
	opt: function(name) {
		return this._getView().opt(name); 
	},
	publiclyTrigger: function() {
		var calendar = this._getCalendar();
		return calendar.publiclyTrigger.apply(calendar, arguments);
	},
	hasPublicHandlers: function() {
		var calendar = this._getCalendar();
		return calendar.hasPublicHandlers.apply(calendar, arguments);
	},
	executeDateRender: function(dateProfile) {
		this.dateProfile = dateProfile; 
		this.renderDates(dateProfile);
		this.isDatesRendered = true;
		this.callChildren('executeDateRender', arguments);
	},
	executeDateUnrender: function() { 
		this.callChildren('executeDateUnrender', arguments);
		this.dateProfile = null;
		this.unrenderDates();
		this.isDatesRendered = false;
	},
	renderDates: function(dateProfile) {
	},
	unrenderDates: function() {
	},
	getNowIndicatorUnit: function() {
	},
	renderNowIndicator: function(date) {
		this.callChildren('renderNowIndicator', arguments);
	},
	unrenderNowIndicator: function() {
		this.callChildren('unrenderNowIndicator', arguments);
	},
	renderBusinessHours: function(businessHourGenerator) {
		if (this.businessHourRenderer) {
			this.businessHourRenderer.render(businessHourGenerator);
		}
		this.callChildren('renderBusinessHours', arguments);
	},
	unrenderBusinessHours: function() {
		this.callChildren('unrenderBusinessHours', arguments);
		if (this.businessHourRenderer) {
			this.businessHourRenderer.unrender();
		}
	},
	executeEventRender: function(eventsPayload) {
		if (this.eventRenderer) {
			this.eventRenderer.rangeUpdated(); 
			this.eventRenderer.render(eventsPayload);
		}
		else if (this.renderEvents) { 
			this.renderEvents(convertEventsPayloadToLegacyArray(eventsPayload));
		}
		this.callChildren('executeEventRender', arguments);
	},
	executeEventUnrender: function() {
		this.callChildren('executeEventUnrender', arguments);
		if (this.eventRenderer) {
			this.eventRenderer.unrender();
		}
		else if (this.destroyEvents) { 
			this.destroyEvents();
		}
	},
	getBusinessHourSegs: function() { 
		var segs = this.getOwnBusinessHourSegs();
		this.iterChildren(function(child) {
			segs.push.apply(segs, child.getBusinessHourSegs());
		});
		return segs;
	},
	getOwnBusinessHourSegs: function() {
		if (this.businessHourRenderer) {
			return this.businessHourRenderer.getSegs();
		}
		return [];
	},
	getEventSegs: function() { 
		var segs = this.getOwnEventSegs();
		this.iterChildren(function(child) {
			segs.push.apply(segs, child.getEventSegs());
		});
		return segs;
	},
	getOwnEventSegs: function() { 
		if (this.eventRenderer) {
			return this.eventRenderer.getSegs();
		}
		return [];
	},
	triggerAfterEventsRendered: function() {
		this.triggerAfterEventSegsRendered(
			this.getEventSegs()
		);
		this.publiclyTrigger('eventAfterAllRender', {
			context: this,
			args: [ this ]
		});
	},
	triggerAfterEventSegsRendered: function(segs) {
		var _this = this;
		if (this.hasPublicHandlers('eventAfterRender')) {
			segs.forEach(function(seg) {
				var legacy;
				if (seg.el) { 
					legacy = seg.footprint.getEventLegacy();
					_this.publiclyTrigger('eventAfterRender', {
						context: legacy,
						args: [ legacy, seg.el, _this ]
					});
				}
			});
		}
	},
	triggerBeforeEventsDestroyed: function() {
		this.triggerBeforeEventSegsDestroyed(
			this.getEventSegs()
		);
	},
	triggerBeforeEventSegsDestroyed: function(segs) {
		var _this = this;
		if (this.hasPublicHandlers('eventDestroy')) {
			segs.forEach(function(seg) {
				var legacy;
				if (seg.el) { 
					legacy = seg.footprint.getEventLegacy();
					_this.publiclyTrigger('eventDestroy', {
						context: legacy,
						args: [ legacy, seg.el, _this ]
					});
				}
			});
		}
	},
	showEventsWithId: function(eventDefId) {
		this.getEventSegs().forEach(function(seg) {
			if (
				seg.footprint.eventDef.id === eventDefId &&
				seg.el 
			) {
				seg.el.css('visibility', '');
			}
		});
		this.callChildren('showEventsWithId', arguments);
	},
	hideEventsWithId: function(eventDefId) {
		this.getEventSegs().forEach(function(seg) {
			if (
				seg.footprint.eventDef.id === eventDefId &&
				seg.el 
			) {
				seg.el.css('visibility', 'hidden');
			}
		});
		this.callChildren('hideEventsWithId', arguments);
	},
	renderDrag: function(eventFootprints, seg, isTouch) {
		var renderedHelper = false;
		this.iterChildren(function(child) {
			if (child.renderDrag(eventFootprints, seg, isTouch)) {
				renderedHelper = true;
			}
		});
		return renderedHelper;
	},
	unrenderDrag: function() {
		this.callChildren('unrenderDrag', arguments);
	},
	renderEventResize: function(eventFootprints, seg, isTouch) {
		this.callChildren('renderEventResize', arguments);
	},
	unrenderEventResize: function() {
		this.callChildren('unrenderEventResize', arguments);
	},
	renderSelectionFootprint: function(componentFootprint) {
		this.renderHighlight(componentFootprint);
		this.callChildren('renderSelectionFootprint', arguments);
	},
	unrenderSelection: function() {
		this.unrenderHighlight();
		this.callChildren('unrenderSelection', arguments);
	},
	renderHighlight: function(componentFootprint) {
		if (this.fillRenderer) {
			this.fillRenderer.renderFootprint(
				'highlight',
				componentFootprint,
				{
					getClasses: function() {
						return [ 'fc-highlight' ];
					}
				}
			);
		}
		this.callChildren('renderHighlight', arguments);
	},
	unrenderHighlight: function() {
		if (this.fillRenderer) {
			this.fillRenderer.unrender('highlight');
		}
		this.callChildren('unrenderHighlight', arguments);
	},
	hitsNeeded: function() {
		if (!(this.hitsNeededDepth++)) {
			this.prepareHits();
		}
		this.callChildren('hitsNeeded', arguments);
	},
	hitsNotNeeded: function() {
		if (this.hitsNeededDepth && !(--this.hitsNeededDepth)) {
			this.releaseHits();
		}
		this.callChildren('hitsNotNeeded', arguments);
	},
	prepareHits: function() {
	},
	releaseHits: function() {
	},
	queryHit: function(leftOffset, topOffset) {
		var childrenByUid = this.childrenByUid;
		var uid;
		var hit;
		for (uid in childrenByUid) {
			hit = childrenByUid[uid].queryHit(leftOffset, topOffset);
			if (hit) {
				break;
			}
		}
		return hit;
	},
	getSafeHitFootprint: function(hit) {
		var footprint = this.getHitFootprint(hit);
		if (!this.dateProfile.activeUnzonedRange.containsRange(footprint.unzonedRange)) {
			return null;
		}
		return footprint;
	},
	getHitFootprint: function(hit) {
	},
	getHitEl: function(hit) {
	},
	eventRangesToEventFootprints: function(eventRanges) {
		var eventFootprints = [];
		var i;
		for (i = 0; i < eventRanges.length; i++) {
			eventFootprints.push.apply( 
				eventFootprints,
				this.eventRangeToEventFootprints(eventRanges[i])
			);
		}
		return eventFootprints;
	},
	eventRangeToEventFootprints: function(eventRange) {
		return [ eventRangeToEventFootprint(eventRange) ];
	},
	eventFootprintsToSegs: function(eventFootprints) {
		var segs = [];
		var i;
		for (i = 0; i < eventFootprints.length; i++) {
			segs.push.apply(segs,
				this.eventFootprintToSegs(eventFootprints[i])
			);
		}
		return segs;
	},
	eventFootprintToSegs: function(eventFootprint) {
		var unzonedRange = eventFootprint.componentFootprint.unzonedRange;
		var segs;
		var i, seg;
		segs = this.componentFootprintToSegs(eventFootprint.componentFootprint);
		for (i = 0; i < segs.length; i++) {
			seg = segs[i];
			if (!unzonedRange.isStart) {
				seg.isStart = false;
			}
			if (!unzonedRange.isEnd) {
				seg.isEnd = false;
			}
			seg.footprint = eventFootprint;
		}
		return segs;
	},
	componentFootprintToSegs: function(componentFootprint) {
		return [];
	},
	callChildren: function(methodName, args) {
		this.iterChildren(function(child) {
			child[methodName].apply(child, args);
		});
	},
	iterChildren: function(func) {
		var childrenByUid = this.childrenByUid;
		var uid;
		for (uid in childrenByUid) {
			func(childrenByUid[uid]);
		}
	},
	_getCalendar: function() { 
		return this.calendar || this.view.calendar;
	},
	_getView: function() { 
		return this.view;
	},
	_getDateProfile: function() {
		return this._getView().get('dateProfile');
	}
});
DateComponent.guid = 0; 
function convertEventsPayloadToLegacyArray(eventsPayload) {
	var eventDefId;
	var eventInstances;
	var legacyEvents = [];
	var i;
	for (eventDefId in eventsPayload) {
		eventInstances = eventsPayload[eventDefId].eventInstances;
		for (i = 0; i < eventInstances.length; i++) {
			legacyEvents.push(
				eventInstances[i].toLegacy()
			);
		}
	}
	return legacyEvents;
}
;;
DateComponent.mixin({
	buildGotoAnchorHtml: function(gotoOptions, attrs, innerHtml) {
		var date, type, forceOff;
		var finalOptions;
		if ($.isPlainObject(gotoOptions)) {
			date = gotoOptions.date;
			type = gotoOptions.type;
			forceOff = gotoOptions.forceOff;
		}
		else {
			date = gotoOptions; 
		}
		date = FC.moment(date); 
		finalOptions = { 
			date: date.format('YYYY-MM-DD'),
			type: type || 'day'
		};
		if (typeof attrs === 'string') {
			innerHtml = attrs;
			attrs = null;
		}
		attrs = attrs ? ' ' + attrsToStr(attrs) : ''; 
		innerHtml = innerHtml || '';
		if (!forceOff && this.opt('navLinks')) {
			return '<a' + attrs +
				' data-goto="' + htmlEscape(JSON.stringify(finalOptions)) + '">' +
				innerHtml +
				'</a>';
		}
		else {
			return '<span' + attrs + '>' +
				innerHtml +
				'</span>';
		}
	},
	getAllDayHtml: function() {
		return this.opt('allDayHtml') || htmlEscape(this.opt('allDayText'));
	},
	getDayClasses: function(date, noThemeHighlight) {
		var view = this._getView();
		var classes = [];
		var today;
		if (!this.dateProfile.activeUnzonedRange.containsDate(date)) {
			classes.push('fc-disabled-day'); 
		}
		else {
			classes.push('fc-' + dayIDs[date.day()]);
			if (view.isDateInOtherMonth(date, this.dateProfile)) { 
				classes.push('fc-other-month');
			}
			today = view.calendar.getNow();
			if (date.isSame(today, 'day')) {
				classes.push('fc-today');
				if (noThemeHighlight !== true) {
					classes.push(view.calendar.theme.getClass('today'));
				}
			}
			else if (date < today) {
				classes.push('fc-past');
			}
			else {
				classes.push('fc-future');
			}
		}
		return classes;
	},
	formatRange: function(range, isAllDay, formatStr, separator) {
		var end = range.end;
		if (isAllDay) {
			end = end.clone().subtract(1); 
		}
		return formatRange(range.start, end, formatStr, separator, this.isRTL);
	},
	currentRangeAs: function(unit) {
		return this._getDateProfile().currentUnzonedRange.as(unit);
	},
	computeDayRange: function(unzonedRange) {
		var calendar = this._getCalendar();
		var startDay = calendar.msToUtcMoment(unzonedRange.startMs, true); 
		var end = calendar.msToUtcMoment(unzonedRange.endMs);
		var endTimeMS = +end.time(); 
		var endDay = end.clone().stripTime(); 
		if (endTimeMS && endTimeMS >= this.nextDayThreshold) {
			endDay.add(1, 'days');
		}
		if (endDay <= startDay) {
			endDay = startDay.clone().add(1, 'days');
		}
		return { start: startDay, end: endDay };
	},
	isMultiDayRange: function(unzonedRange) {
		var dayRange = this.computeDayRange(unzonedRange);
		return dayRange.end.diff(dayRange.start, 'days') > 1;
	}
});
;;
var InteractiveDateComponent = FC.InteractiveDateComponent = DateComponent.extend({
	dateClickingClass: null,
	dateSelectingClass: null,
	eventPointingClass: null,
	eventDraggingClass: null,
	eventResizingClass: null,
	externalDroppingClass: null,
	dateClicking: null,
	dateSelecting: null,
	eventPointing: null,
	eventDragging: null,
	eventResizing: null,
	externalDropping: null,
	segSelector: '.fc-event-container > *', 
	largeUnit: null,
	constructor: function() {
		DateComponent.call(this);
		if (this.dateSelectingClass) {
			this.dateClicking = new this.dateClickingClass(this);
		}
		if (this.dateSelectingClass) {
			this.dateSelecting = new this.dateSelectingClass(this);
		}
		if (this.eventPointingClass) {
			this.eventPointing = new this.eventPointingClass(this);
		}
		if (this.eventDraggingClass && this.eventPointing) {
			this.eventDragging = new this.eventDraggingClass(this, this.eventPointing);
		}
		if (this.eventResizingClass && this.eventPointing) {
			this.eventResizing = new this.eventResizingClass(this, this.eventPointing);
		}
		if (this.externalDroppingClass) {
			this.externalDropping = new this.externalDroppingClass(this);
		}
	},
	setElement: function(el) {
		DateComponent.prototype.setElement.apply(this, arguments);
		if (this.dateClicking) {
			this.dateClicking.bindToEl(el);
		}
		if (this.dateSelecting) {
			this.dateSelecting.bindToEl(el);
		}
		this.bindAllSegHandlersToEl(el);
	},
	unrender: function() {
		this.endInteractions();
		DateComponent.prototype.unrender.apply(this, arguments);
	},
	executeEventUnrender: function() {
		this.endInteractions();
		DateComponent.prototype.executeEventUnrender.apply(this, arguments);
	},
	bindGlobalHandlers: function() {
		DateComponent.prototype.bindGlobalHandlers.apply(this, arguments);
		if (this.externalDropping) {
			this.externalDropping.bindToDocument();
		}
	},
	unbindGlobalHandlers: function() {
		DateComponent.prototype.unbindGlobalHandlers.apply(this, arguments);
		if (this.externalDropping) {
			this.externalDropping.unbindFromDocument();
		}
	},
	bindDateHandlerToEl: function(el, name, handler) {
		var _this = this;
		this.el.on(name, function(ev) {
			if (
				!$(ev.target).is(
					_this.segSelector + ',' + 
					_this.segSelector + ' *,' + 
					'.fc-more,' + 
					'a[data-goto]' 
				)
			) {
				return handler.call(_this, ev);
			}
		});
	},
	bindAllSegHandlersToEl: function(el) {
		[
			this.eventPointing,
			this.eventDragging,
			this.eventResizing
		].forEach(function(eventInteraction) {
			if (eventInteraction) {
				eventInteraction.bindToEl(el);
			}
		});
	},
	bindSegHandlerToEl: function(el, name, handler) {
		var _this = this;
		el.on(name, this.segSelector, function(ev) {
			var seg = $(this).data('fc-seg'); 
			if (seg && !_this.shouldIgnoreEventPointing()) {
				return handler.call(_this, seg, ev); 
			}
		});
	},
	shouldIgnoreMouse: function() {
		return GlobalEmitter.get().shouldIgnoreMouse();
	},
	shouldIgnoreTouch: function() {
		var view = this._getView();
		return view.isSelected || view.selectedEvent;
	},
	shouldIgnoreEventPointing: function() {
		return (this.eventDragging && this.eventDragging.isDragging) ||
			(this.eventResizing && this.eventResizing.isResizing);
	},
	canStartSelection: function(seg, ev) {
		return getEvIsTouch(ev) &&
			!this.canStartResize(seg, ev) &&
			(this.isEventDefDraggable(seg.footprint.eventDef) ||
			 this.isEventDefResizable(seg.footprint.eventDef));
	},
	canStartDrag: function(seg, ev) {
		return !this.canStartResize(seg, ev) &&
			this.isEventDefDraggable(seg.footprint.eventDef);
	},
	canStartResize: function(seg, ev) {
		var view = this._getView();
		var eventDef = seg.footprint.eventDef;
		return (!getEvIsTouch(ev) || view.isEventDefSelected(eventDef)) &&
			this.isEventDefResizable(eventDef) &&
			$(ev.target).is('.fc-resizer');
	},
	endInteractions: function() {
		[
			this.dateClicking,
			this.dateSelecting,
			this.eventPointing,
			this.eventDragging,
			this.eventResizing
		].forEach(function(interaction) {
			if (interaction) {
				interaction.end();
			}
		});
	},
	isEventDefDraggable: function(eventDef) {
		return this.isEventDefStartEditable(eventDef);
	},
	isEventDefStartEditable: function(eventDef) {
		var isEditable = eventDef.isStartExplicitlyEditable();
		if (isEditable == null) {
			isEditable = this.opt('eventStartEditable');
			if (isEditable == null) {
				isEditable = this.isEventDefGenerallyEditable(eventDef);
			}
		}
		return isEditable;
	},
	isEventDefGenerallyEditable: function(eventDef) {
		var isEditable = eventDef.isExplicitlyEditable();
		if (isEditable == null) {
			isEditable = this.opt('editable');
		}
		return isEditable;
	},
	isEventDefResizableFromStart: function(eventDef) {
		return this.opt('eventResizableFromStart') && this.isEventDefResizable(eventDef);
	},
	isEventDefResizableFromEnd: function(eventDef) {
		return this.isEventDefResizable(eventDef);
	},
	isEventDefResizable: function(eventDef) {
		var isResizable = eventDef.isDurationExplicitlyEditable();
		if (isResizable == null) {
			isResizable = this.opt('eventDurationEditable');
			if (isResizable == null) {
				isResizable = this.isEventDefGenerallyEditable(eventDef);
			}
		}
		return isResizable;
	},
	diffDates: function(a, b) {
		if (this.largeUnit) {
			return diffByUnit(a, b, this.largeUnit);
		}
		else {
			return diffDayTime(a, b);
		}
	},
	isEventInstanceGroupAllowed: function(eventInstanceGroup) {
		var view = this._getView();
		var dateProfile = this.dateProfile;
		var eventFootprints = this.eventRangesToEventFootprints(eventInstanceGroup.getAllEventRanges());
		var i;
		for (i = 0; i < eventFootprints.length; i++) {
			if (!dateProfile.validUnzonedRange.containsRange(eventFootprints[i].componentFootprint.unzonedRange)) {
				return false;
			}
		}
		return view.calendar.isEventInstanceGroupAllowed(eventInstanceGroup);
	},
	isExternalInstanceGroupAllowed: function(eventInstanceGroup) {
		var view = this._getView();
		var dateProfile = this.dateProfile;
		var eventFootprints = this.eventRangesToEventFootprints(eventInstanceGroup.getAllEventRanges());
		var i;
		for (i = 0; i < eventFootprints.length; i++) {
			if (!dateProfile.validUnzonedRange.containsRange(eventFootprints[i].componentFootprint.unzonedRange)) {
				return false;
			}
		}
		for (i = 0; i < eventFootprints.length; i++) {
			if (!view.calendar.isSelectionFootprintAllowed(eventFootprints[i].componentFootprint)) {
				return false;
			}
		}
		return true;
	}
});
;;
var DayTableMixin = FC.DayTableMixin = {
	breakOnWeeks: false, 
	dayDates: null, 
	dayIndices: null, 
	daysPerRow: null,
	rowCnt: null,
	colCnt: null,
	colHeadFormat: null,
	updateDayTable: function() {
		var view = this.view;
		var calendar = view.calendar;
		var date = calendar.msToUtcMoment(this.dateProfile.renderUnzonedRange.startMs, true);
		var end = calendar.msToUtcMoment(this.dateProfile.renderUnzonedRange.endMs, true);
		var dayIndex = -1;
		var dayIndices = [];
		var dayDates = [];
		var daysPerRow;
		var firstDay;
		var rowCnt;
		while (date.isBefore(end)) { 
			if (view.isHiddenDay(date)) {
				dayIndices.push(dayIndex + 0.5); 
			}
			else {
				dayIndex++;
				dayIndices.push(dayIndex);
				dayDates.push(date.clone());
			}
			date.add(1, 'days');
		}
		if (this.breakOnWeeks) {
			firstDay = dayDates[0].day();
			for (daysPerRow = 1; daysPerRow < dayDates.length; daysPerRow++) {
				if (dayDates[daysPerRow].day() == firstDay) {
					break;
				}
			}
			rowCnt = Math.ceil(dayDates.length / daysPerRow);
		}
		else {
			rowCnt = 1;
			daysPerRow = dayDates.length;
		}
		this.dayDates = dayDates;
		this.dayIndices = dayIndices;
		this.daysPerRow = daysPerRow;
		this.rowCnt = rowCnt;
		this.updateDayTableCols();
	},
	updateDayTableCols: function() {
		this.colCnt = this.computeColCnt();
		this.colHeadFormat = this.opt('columnFormat') || this.computeColHeadFormat();
	},
	computeColCnt: function() {
		return this.daysPerRow;
	},
	getCellDate: function(row, col) {
		return this.dayDates[
				this.getCellDayIndex(row, col)
			].clone();
	},
	getCellRange: function(row, col) {
		var start = this.getCellDate(row, col);
		var end = start.clone().add(1, 'days');
		return { start: start, end: end };
	},
	getCellDayIndex: function(row, col) {
		return row * this.daysPerRow + this.getColDayIndex(col);
	},
	getColDayIndex: function(col) {
		if (this.isRTL) {
			return this.colCnt - 1 - col;
		}
		else {
			return col;
		}
	},
	getDateDayIndex: function(date) {
		var dayIndices = this.dayIndices;
		var dayOffset = date.diff(this.dayDates[0], 'days');
		if (dayOffset < 0) {
			return dayIndices[0] - 1;
		}
		else if (dayOffset >= dayIndices.length) {
			return dayIndices[dayIndices.length - 1] + 1;
		}
		else {
			return dayIndices[dayOffset];
		}
	},
	computeColHeadFormat: function() {
		if (this.rowCnt > 1 || this.colCnt > 10) {
			return 'ddd'; 
		}
		else if (this.colCnt > 1) {
			return this.opt('dayOfMonthFormat'); 
		}
		else {
			return 'dddd'; 
		}
	},
	sliceRangeByRow: function(unzonedRange) {
		var daysPerRow = this.daysPerRow;
		var normalRange = this.view.computeDayRange(unzonedRange); 
		var rangeFirst = this.getDateDayIndex(normalRange.start); 
		var rangeLast = this.getDateDayIndex(normalRange.end.clone().subtract(1, 'days')); 
		var segs = [];
		var row;
		var rowFirst, rowLast; 
		var segFirst, segLast; 
		for (row = 0; row < this.rowCnt; row++) {
			rowFirst = row * daysPerRow;
			rowLast = rowFirst + daysPerRow - 1;
			segFirst = Math.max(rangeFirst, rowFirst);
			segLast = Math.min(rangeLast, rowLast);
			segFirst = Math.ceil(segFirst); 
			segLast = Math.floor(segLast); 
			if (segFirst <= segLast) { 
				segs.push({
					row: row,
					firstRowDayIndex: segFirst - rowFirst,
					lastRowDayIndex: segLast - rowFirst,
					isStart: segFirst === rangeFirst,
					isEnd: segLast === rangeLast
				});
			}
		}
		return segs;
	},
	sliceRangeByDay: function(unzonedRange) {
		var daysPerRow = this.daysPerRow;
		var normalRange = this.view.computeDayRange(unzonedRange); 
		var rangeFirst = this.getDateDayIndex(normalRange.start); 
		var rangeLast = this.getDateDayIndex(normalRange.end.clone().subtract(1, 'days')); 
		var segs = [];
		var row;
		var rowFirst, rowLast; 
		var i;
		var segFirst, segLast; 
		for (row = 0; row < this.rowCnt; row++) {
			rowFirst = row * daysPerRow;
			rowLast = rowFirst + daysPerRow - 1;
			for (i = rowFirst; i <= rowLast; i++) {
				segFirst = Math.max(rangeFirst, i);
				segLast = Math.min(rangeLast, i);
				segFirst = Math.ceil(segFirst); 
				segLast = Math.floor(segLast); 
				if (segFirst <= segLast) { 
					segs.push({
						row: row,
						firstRowDayIndex: segFirst - rowFirst,
						lastRowDayIndex: segLast - rowFirst,
						isStart: segFirst === rangeFirst,
						isEnd: segLast === rangeLast
					});
				}
			}
		}
		return segs;
	},
	renderHeadHtml: function() {
		var theme = this.view.calendar.theme;
		return '' +
			'<div class="fc-row ' + theme.getClass('headerRow') + '">' +
				'<table class="' + theme.getClass('tableGrid') + '">' +
					'<thead>' +
						this.renderHeadTrHtml() +
					'</thead>' +
				'</table>' +
			'</div>';
	},
	renderHeadIntroHtml: function() {
		return this.renderIntroHtml(); 
	},
	renderHeadTrHtml: function() {
		return '' +
			'<tr>' +
				(this.isRTL ? '' : this.renderHeadIntroHtml()) +
				this.renderHeadDateCellsHtml() +
				(this.isRTL ? this.renderHeadIntroHtml() : '') +
			'</tr>';
	},
	renderHeadDateCellsHtml: function() {
		var htmls = [];
		var col, date;
		for (col = 0; col < this.colCnt; col++) {
			date = this.getCellDate(0, col);
			htmls.push(this.renderHeadDateCellHtml(date));
		}
		return htmls.join('');
	},
	renderHeadDateCellHtml: function(date, colspan, otherAttrs) {
		var view = this.view;
		var isDateValid = this.dateProfile.activeUnzonedRange.containsDate(date); 
		var classNames = [
			'fc-day-header',
			view.calendar.theme.getClass('widgetHeader')
		];
		var innerHtml = htmlEscape(date.format(this.colHeadFormat));
		if (this.rowCnt === 1) {
			classNames = classNames.concat(
				this.getDayClasses(date, true)
			);
		}
		else {
			classNames.push('fc-' + dayIDs[date.day()]); 
		}
		return '' +
            '<th class="' + classNames.join(' ') + '"' +
				((isDateValid && this.rowCnt) === 1 ?
					' data-date="' + date.format('YYYY-MM-DD') + '"' :
					'') +
				(colspan > 1 ?
					' colspan="' + colspan + '"' :
					'') +
				(otherAttrs ?
					' ' + otherAttrs :
					'') +
				'>' +
				(isDateValid ?
					view.buildGotoAnchorHtml(
						{ date: date, forceOff: this.rowCnt > 1 || this.colCnt === 1 },
						innerHtml
					) :
					innerHtml
				) +
			'</th>';
	},
	renderBgTrHtml: function(row) {
		return '' +
			'<tr>' +
				(this.isRTL ? '' : this.renderBgIntroHtml(row)) +
				this.renderBgCellsHtml(row) +
				(this.isRTL ? this.renderBgIntroHtml(row) : '') +
			'</tr>';
	},
	renderBgIntroHtml: function(row) {
		return this.renderIntroHtml(); 
	},
	renderBgCellsHtml: function(row) {
		var htmls = [];
		var col, date;
		for (col = 0; col < this.colCnt; col++) {
			date = this.getCellDate(row, col);
			htmls.push(this.renderBgCellHtml(date));
		}
		return htmls.join('');
	},
	renderBgCellHtml: function(date, otherAttrs) {
		var view = this.view;
		var isDateValid = this.dateProfile.activeUnzonedRange.containsDate(date); 
		var classes = this.getDayClasses(date);
		classes.unshift('fc-day', view.calendar.theme.getClass('widgetContent'));
		return '<td class="' + classes.join(' ') + '"' +
			(isDateValid ?
				' data-date="' + date.format('YYYY-MM-DD') + '"' : 
				'') +
			(otherAttrs ?
				' ' + otherAttrs :
				'') +
			'></td>';
	},
	renderIntroHtml: function() {
	},
	bookendCells: function(trEl) {
		var introHtml = this.renderIntroHtml();
		if (introHtml) {
			if (this.isRTL) {
				trEl.append(introHtml);
			}
			else {
				trEl.prepend(introHtml);
			}
		}
	}
};
;;
var View = FC.View = InteractiveDateComponent.extend({
	type: null, 
	name: null, 
	title: null, 
	calendar: null, 
	viewSpec: null,
	options: null, 
	renderQueue: null,
	batchRenderDepth: 0,
	queuedScroll: null,
	isSelected: false, 
	selectedEventInstance: null,
	eventOrderSpecs: null, 
	isHiddenDayHash: null,
	isNowIndicatorRendered: null,
	initialNowDate: null, 
	initialNowQueriedMs: null, 
	nowIndicatorTimeoutID: null, 
	nowIndicatorIntervalID: null, 
	constructor: function(calendar, viewSpec) {
		this.calendar = calendar;
		this.viewSpec = viewSpec;
		this.type = viewSpec.type;
		this.options = viewSpec.options;
		this.name = this.type;
		InteractiveDateComponent.call(this);
		this.initRenderQueue();
		this.initHiddenDays();
		this.bindBaseRenderHandlers();
		this.eventOrderSpecs = parseFieldSpecs(this.opt('eventOrder'));
		if (this.initialize) {
			this.initialize();
		}
	},
	_getView: function() {
		return this;
	},
	opt: function(name) {
		return this.options[name];
	},
	initRenderQueue: function() {
		this.renderQueue = new RenderQueue({
			event: this.opt('eventRenderWait')
		});
		this.renderQueue.on('start', this.onRenderQueueStart.bind(this));
		this.renderQueue.on('stop', this.onRenderQueueStop.bind(this));
		this.on('before:change', this.startBatchRender);
		this.on('change', this.stopBatchRender);
	},
	onRenderQueueStart: function() {
		this.calendar.freezeContentHeight();
		this.addScroll(this.queryScroll());
	},
	onRenderQueueStop: function() {
		if (this.calendar.updateViewSize()) { 
			this.popScroll();
		}
		this.calendar.thawContentHeight();
	},
	startBatchRender: function() {
		if (!(this.batchRenderDepth++)) {
			this.renderQueue.pause();
		}
	},
	stopBatchRender: function() {
		if (!(--this.batchRenderDepth)) {
			this.renderQueue.resume();
		}
	},
	requestRender: function(func, namespace, actionType) {
		this.renderQueue.queue(func, namespace, actionType);
	},
	whenSizeUpdated: function(func) {
		if (this.renderQueue.isRunning) {
			this.renderQueue.one('stop', func.bind(this));
		}
		else {
			func.call(this);
		}
	},
	computeTitle: function(dateProfile) {
		var unzonedRange;
		if (/^(year|month)$/.test(dateProfile.currentRangeUnit)) {
			unzonedRange = dateProfile.currentUnzonedRange;
		}
		else { 
			unzonedRange = dateProfile.activeUnzonedRange;
		}
		return this.formatRange(
			{
				start: this.calendar.msToMoment(unzonedRange.startMs, dateProfile.isRangeAllDay),
				end: this.calendar.msToMoment(unzonedRange.endMs, dateProfile.isRangeAllDay)
			},
			dateProfile.isRangeAllDay,
			this.opt('titleFormat') || this.computeTitleFormat(dateProfile),
			this.opt('titleRangeSeparator')
		);
	},
	computeTitleFormat: function(dateProfile) {
		var currentRangeUnit = dateProfile.currentRangeUnit;
		if (currentRangeUnit == 'year') {
			return 'YYYY';
		}
		else if (currentRangeUnit == 'month') {
			return this.opt('monthYearFormat'); 
		}
		else if (dateProfile.currentUnzonedRange.as('days') > 1) {
			return 'll'; 
		}
		else {
			return 'LL'; 
		}
	},
	setDate: function(date) {
		var currentDateProfile = this.get('dateProfile');
		var newDateProfile = this.buildDateProfile(date, null, true); 
		if (
			!currentDateProfile ||
			!currentDateProfile.activeUnzonedRange.equals(newDateProfile.activeUnzonedRange)
		) {
			this.set('dateProfile', newDateProfile);
		}
	},
	unsetDate: function() {
		this.unset('dateProfile');
	},
	fetchInitialEvents: function(dateProfile) {
		var calendar = this.calendar;
		var forceAllDay = dateProfile.isRangeAllDay && !this.usesMinMaxTime;
		return calendar.requestEvents(
			calendar.msToMoment(dateProfile.activeUnzonedRange.startMs, forceAllDay),
			calendar.msToMoment(dateProfile.activeUnzonedRange.endMs, forceAllDay)
		);
	},
	bindEventChanges: function() {
		this.listenTo(this.calendar, 'eventsReset', this.resetEvents); 
	},
	unbindEventChanges: function() {
		this.stopListeningTo(this.calendar, 'eventsReset');
	},
	setEvents: function(eventsPayload) {
		this.set('currentEvents', eventsPayload);
		this.set('hasEvents', true);
	},
	unsetEvents: function() {
		this.unset('currentEvents');
		this.unset('hasEvents');
	},
	resetEvents: function(eventsPayload) {
		this.startBatchRender();
		this.unsetEvents();
		this.setEvents(eventsPayload);
		this.stopBatchRender();
	},
	requestDateRender: function(dateProfile) {
		var _this = this;
		this.requestRender(function() {
			_this.executeDateRender(dateProfile);
		}, 'date', 'init');
	},
	requestDateUnrender: function() {
		var _this = this;
		this.requestRender(function() {
			_this.executeDateUnrender();
		}, 'date', 'destroy');
	},
	executeDateRender: function(dateProfile) {
		DateComponent.prototype.executeDateRender.apply(this, arguments);
		if (this.render) {
			this.render(); 
		}
		this.trigger('datesRendered');
		this.addScroll({ isDateInit: true });
		this.startNowIndicator(); 
	},
	executeDateUnrender: function() {
		this.unselect();
		this.stopNowIndicator();
		this.trigger('before:datesUnrendered');
		if (this.destroy) {
			this.destroy(); 
		}
		DateComponent.prototype.executeDateUnrender.apply(this, arguments);
	},
	bindBaseRenderHandlers: function() {
		var _this = this;
		this.on('datesRendered', function() {
			_this.whenSizeUpdated(
				_this.triggerViewRender
			);
		});
		this.on('before:datesUnrendered', function() {
			_this.triggerViewDestroy();
		});
	},
	triggerViewRender: function() {
		this.publiclyTrigger('viewRender', {
			context: this,
			args: [ this, this.el ]
		});
	},
	triggerViewDestroy: function() {
		this.publiclyTrigger('viewDestroy', {
			context: this,
			args: [ this, this.el ]
		});
	},
	requestEventsRender: function(eventsPayload) {
		var _this = this;
		this.requestRender(function() {
			_this.executeEventRender(eventsPayload);
			_this.whenSizeUpdated(
				_this.triggerAfterEventsRendered
			);
		}, 'event', 'init');
	},
	requestEventsUnrender: function() {
		var _this = this;
		this.requestRender(function() {
			_this.triggerBeforeEventsDestroyed();
			_this.executeEventUnrender();
		}, 'event', 'destroy');
	},
	requestBusinessHoursRender: function(businessHourGenerator) {
		var _this = this;
		this.requestRender(function() {
			_this.renderBusinessHours(businessHourGenerator);
		}, 'businessHours', 'init');
	},
	requestBusinessHoursUnrender: function() {
		var _this = this;
		this.requestRender(function() {
			_this.unrenderBusinessHours();
		}, 'businessHours', 'destroy');
	},
	bindGlobalHandlers: function() {
		InteractiveDateComponent.prototype.bindGlobalHandlers.apply(this, arguments);
		this.listenTo(GlobalEmitter.get(), {
			touchstart: this.processUnselect,
			mousedown: this.handleDocumentMousedown
		});
	},
	unbindGlobalHandlers: function() {
		InteractiveDateComponent.prototype.unbindGlobalHandlers.apply(this, arguments);
		this.stopListeningTo(GlobalEmitter.get());
	},
	startNowIndicator: function() {
		var _this = this;
		var unit;
		var update;
		var delay; 
		if (this.opt('nowIndicator')) {
			unit = this.getNowIndicatorUnit();
			if (unit) {
				update = proxy(this, 'updateNowIndicator'); 
				this.initialNowDate = this.calendar.getNow();
				this.initialNowQueriedMs = +new Date();
				delay = this.initialNowDate.clone().startOf(unit).add(1, unit) - this.initialNowDate;
				this.nowIndicatorTimeoutID = setTimeout(function() {
					_this.nowIndicatorTimeoutID = null;
					update();
					delay = +moment.duration(1, unit);
					delay = Math.max(100, delay); 
					_this.nowIndicatorIntervalID = setInterval(update, delay); 
				}, delay);
			}
		}
	},
	updateNowIndicator: function() {
		if (
			this.isDatesRendered &&
			this.initialNowDate 
		) {
			this.unrenderNowIndicator(); 
			this.renderNowIndicator(
				this.initialNowDate.clone().add(new Date() - this.initialNowQueriedMs) 
			);
			this.isNowIndicatorRendered = true;
		}
	},
	stopNowIndicator: function() {
		if (this.isNowIndicatorRendered) {
			if (this.nowIndicatorTimeoutID) {
				clearTimeout(this.nowIndicatorTimeoutID);
				this.nowIndicatorTimeoutID = null;
			}
			if (this.nowIndicatorIntervalID) {
				clearInterval(this.nowIndicatorIntervalID);
				this.nowIndicatorIntervalID = null;
			}
			this.unrenderNowIndicator();
			this.isNowIndicatorRendered = false;
		}
	},
	updateSize: function(totalHeight, isAuto, isResize) {
		if (this.setHeight) { 
			this.setHeight(totalHeight, isAuto);
		}
		else {
			InteractiveDateComponent.prototype.updateSize.apply(this, arguments);
		}
		this.updateNowIndicator();
	},
	addScroll: function(scroll) {
		var queuedScroll = this.queuedScroll || (this.queuedScroll = {});
		$.extend(queuedScroll, scroll);
	},
	popScroll: function() {
		this.applyQueuedScroll();
		this.queuedScroll = null;
	},
	applyQueuedScroll: function() {
		if (this.queuedScroll) {
			this.applyScroll(this.queuedScroll);
		}
	},
	queryScroll: function() {
		var scroll = {};
		if (this.isDatesRendered) {
			$.extend(scroll, this.queryDateScroll());
		}
		return scroll;
	},
	applyScroll: function(scroll) {
		if (scroll.isDateInit && this.isDatesRendered) {
			$.extend(scroll, this.computeInitialDateScroll());
		}
		if (this.isDatesRendered) {
			this.applyDateScroll(scroll);
		}
	},
	computeInitialDateScroll: function() {
		return {}; 
	},
	queryDateScroll: function() {
		return {}; 
	},
	applyDateScroll: function(scroll) {
		; 
	},
	reportEventDrop: function(eventInstance, eventMutation, el, ev) {
		var eventManager = this.calendar.eventManager;
		var undoFunc = eventManager.mutateEventsWithId(
			eventInstance.def.id,
			eventMutation,
			this.calendar
		);
		var dateMutation = eventMutation.dateMutation;
		if (dateMutation) {
			eventInstance.dateProfile = dateMutation.buildNewDateProfile(
				eventInstance.dateProfile,
				this.calendar
			);
		}
		this.triggerEventDrop(
			eventInstance,
			(dateMutation && dateMutation.dateDelta) || moment.duration(),
			undoFunc,
			el, ev
		);
	},
	triggerEventDrop: function(eventInstance, dateDelta, undoFunc, el, ev) {
		this.publiclyTrigger('eventDrop', {
			context: el[0],
			args: [
				eventInstance.toLegacy(),
				dateDelta,
				undoFunc,
				ev,
				{}, 
				this
			]
		});
	},
	reportExternalDrop: function(singleEventDef, isEvent, isSticky, el, ev, ui) {
		if (isEvent) {
			this.calendar.eventManager.addEventDef(singleEventDef, isSticky);
		}
		this.triggerExternalDrop(singleEventDef, isEvent, el, ev, ui);
	},
	triggerExternalDrop: function(singleEventDef, isEvent, el, ev, ui) {
		this.publiclyTrigger('drop', {
			context: el[0],
			args: [
				singleEventDef.dateProfile.start.clone(),
				ev,
				ui,
				this
			]
		});
		if (isEvent) {
			this.publiclyTrigger('eventReceive', {
				context: this,
				args: [
					singleEventDef.buildInstance().toLegacy(),
					this
				]
			});
		}
	},
	reportEventResize: function(eventInstance, eventMutation, el, ev) {
		var eventManager = this.calendar.eventManager;
		var undoFunc = eventManager.mutateEventsWithId(
			eventInstance.def.id,
			eventMutation,
			this.calendar
		);
		eventInstance.dateProfile = eventMutation.dateMutation.buildNewDateProfile(
			eventInstance.dateProfile,
			this.calendar
		);
		this.triggerEventResize(
			eventInstance,
			eventMutation.dateMutation.endDelta,
			undoFunc,
			el, ev
		);
	},
	triggerEventResize: function(eventInstance, durationDelta, undoFunc, el, ev) {
		this.publiclyTrigger('eventResize', {
			context: el[0],
			args: [
				eventInstance.toLegacy(),
				durationDelta,
				undoFunc,
				ev,
				{}, 
				this
			]
		});
	},
	select: function(footprint, ev) {
		this.unselect(ev);
		this.renderSelectionFootprint(footprint);
		this.reportSelection(footprint, ev);
	},
	renderSelectionFootprint: function(footprint, ev) {
		if (this.renderSelection) { 
			this.renderSelection(
				footprint.toLegacy(this.calendar)
			);
		}
		else {
			InteractiveDateComponent.prototype.renderSelectionFootprint.apply(this, arguments);
		}
	},
	reportSelection: function(footprint, ev) {
		this.isSelected = true;
		this.triggerSelect(footprint, ev);
	},
	triggerSelect: function(footprint, ev) {
		var dateProfile = this.calendar.footprintToDateProfile(footprint); 
		this.publiclyTrigger('select', {
			context: this,
			args: [
				dateProfile.start,
				dateProfile.end,
				ev,
				this
			]
		});
	},
	unselect: function(ev) {
		if (this.isSelected) {
			this.isSelected = false;
			if (this.destroySelection) {
				this.destroySelection(); 
			}
			this.unrenderSelection();
			this.publiclyTrigger('unselect', {
				context: this,
				args: [ ev, this ]
			});
		}
	},
	selectEventInstance: function(eventInstance) {
		if (
			!this.selectedEventInstance ||
			this.selectedEventInstance !== eventInstance
		) {
			this.unselectEventInstance();
			this.getEventSegs().forEach(function(seg) {
				if (
					seg.footprint.eventInstance === eventInstance &&
					seg.el 
				) {
					seg.el.addClass('fc-selected');
				}
			});
			this.selectedEventInstance = eventInstance;
		}
	},
	unselectEventInstance: function() {
		if (this.selectedEventInstance) {
			this.getEventSegs().forEach(function(seg) {
				if (seg.el) { 
					seg.el.removeClass('fc-selected');
				}
			});
			this.selectedEventInstance = null;
		}
	},
	isEventDefSelected: function(eventDef) {
		return this.selectedEventInstance && this.selectedEventInstance.def.id === eventDef.id;
	},
	handleDocumentMousedown: function(ev) {
		if (isPrimaryMouseButton(ev)) {
			this.processUnselect(ev);
		}
	},
	processUnselect: function(ev) {
		this.processRangeUnselect(ev);
		this.processEventUnselect(ev);
	},
	processRangeUnselect: function(ev) {
		var ignore;
		if (this.isSelected && this.opt('unselectAuto')) {
			ignore = this.opt('unselectCancel');
			if (!ignore || !$(ev.target).closest(ignore).length) {
				this.unselect(ev);
			}
		}
	},
	processEventUnselect: function(ev) {
		if (this.selectedEventInstance) {
			if (!$(ev.target).closest('.fc-selected').length) {
				this.unselectEventInstance();
			}
		}
	},
	triggerBaseRendered: function() {
		this.publiclyTrigger('viewRender', {
			context: this,
			args: [ this, this.el ]
		});
	},
	triggerBaseUnrendered: function() {
		this.publiclyTrigger('viewDestroy', {
			context: this,
			args: [ this, this.el ]
		});
	},
	triggerDayClick: function(footprint, dayEl, ev) {
		var dateProfile = this.calendar.footprintToDateProfile(footprint); 
		this.publiclyTrigger('dayClick', {
			context: dayEl,
			args: [ dateProfile.start, ev, this ]
		});
	}
});
View.watch('displayingDates', [ 'isInDom', 'dateProfile' ], function(deps) {
	this.requestDateRender(deps.dateProfile);
}, function() {
	this.requestDateUnrender();
});
View.watch('displayingBusinessHours', [ 'displayingDates', 'businessHourGenerator' ], function(deps) {
	this.requestBusinessHoursRender(deps.businessHourGenerator);
}, function() {
	this.requestBusinessHoursUnrender();
});
View.watch('initialEvents', [ 'dateProfile' ], function(deps) {
	return this.fetchInitialEvents(deps.dateProfile);
});
View.watch('bindingEvents', [ 'initialEvents' ], function(deps) {
	this.setEvents(deps.initialEvents);
	this.bindEventChanges();
}, function() {
	this.unbindEventChanges();
	this.unsetEvents();
});
View.watch('displayingEvents', [ 'displayingDates', 'hasEvents' ], function() {
	this.requestEventsRender(this.get('currentEvents'));
}, function() {
	this.requestEventsUnrender();
});
View.watch('title', [ 'dateProfile' ], function(deps) {
	return (this.title = this.computeTitle(deps.dateProfile)); 
});
View.watch('legacyDateProps', [ 'dateProfile' ], function(deps) {
	var calendar = this.calendar;
	var dateProfile = deps.dateProfile;
	this.start = calendar.msToMoment(dateProfile.activeUnzonedRange.startMs, dateProfile.isRangeAllDay);
	this.end = calendar.msToMoment(dateProfile.activeUnzonedRange.endMs, dateProfile.isRangeAllDay);
	this.intervalStart = calendar.msToMoment(dateProfile.currentUnzonedRange.startMs, dateProfile.isRangeAllDay);
	this.intervalEnd = calendar.msToMoment(dateProfile.currentUnzonedRange.endMs, dateProfile.isRangeAllDay);
});
;;
View.mixin({
	usesMinMaxTime: false, 
	start: null, 
	end: null, 
	intervalStart: null, 
	intervalEnd: null, 
	buildPrevDateProfile: function(date) {
		var dateProfile = this.get('dateProfile');
		var prevDate = date.clone().startOf(dateProfile.currentRangeUnit)
			.subtract(dateProfile.dateIncrement);
		return this.buildDateProfile(prevDate, -1);
	},
	buildNextDateProfile: function(date) {
		var dateProfile = this.get('dateProfile');
		var nextDate = date.clone().startOf(dateProfile.currentRangeUnit)
			.add(dateProfile.dateIncrement);
		return this.buildDateProfile(nextDate, 1);
	},
	buildDateProfile: function(date, direction, forceToValid) {
		var isDateAllDay = !date.hasTime();
		var validUnzonedRange;
		var minTime = null;
		var maxTime = null;
		var currentInfo;
		var isRangeAllDay;
		var renderUnzonedRange;
		var activeUnzonedRange;
		var isValid;
		validUnzonedRange = this.buildValidRange();
		validUnzonedRange = this.trimHiddenDays(validUnzonedRange);
		if (forceToValid) {
			date = this.calendar.msToUtcMoment(
				validUnzonedRange.constrainDate(date), 
				isDateAllDay
			);
		}
		currentInfo = this.buildCurrentRangeInfo(date, direction);
		isRangeAllDay = /^(year|month|week|day)$/.test(currentInfo.unit);
		renderUnzonedRange = this.buildRenderRange(
			this.trimHiddenDays(currentInfo.unzonedRange),
			currentInfo.unit,
			isRangeAllDay
		);
		renderUnzonedRange = this.trimHiddenDays(renderUnzonedRange);
		activeUnzonedRange = renderUnzonedRange.clone();
		if (!this.opt('showNonCurrentDates')) {
			activeUnzonedRange = activeUnzonedRange.intersect(currentInfo.unzonedRange);
		}
		minTime = moment.duration(this.opt('minTime'));
		maxTime = moment.duration(this.opt('maxTime'));
		activeUnzonedRange = this.adjustActiveRange(activeUnzonedRange, minTime, maxTime);
		activeUnzonedRange = activeUnzonedRange.intersect(validUnzonedRange); 
		if (activeUnzonedRange) {
			date = this.calendar.msToUtcMoment(
				activeUnzonedRange.constrainDate(date), 
				isDateAllDay
			);
		}
		isValid = currentInfo.unzonedRange.intersectsWith(validUnzonedRange);
		return {
			validUnzonedRange: validUnzonedRange,
			currentUnzonedRange: currentInfo.unzonedRange,
			currentRangeUnit: currentInfo.unit,
			isRangeAllDay: isRangeAllDay,
			activeUnzonedRange: activeUnzonedRange,
			renderUnzonedRange: renderUnzonedRange,
			minTime: minTime,
			maxTime: maxTime,
			isValid: isValid,
			date: date,
			dateIncrement: this.buildDateIncrement(currentInfo.duration)
		};
	},
	buildValidRange: function() {
		return this.getUnzonedRangeOption('validRange', this.calendar.getNow()) ||
			new UnzonedRange(); 
	},
	buildCurrentRangeInfo: function(date, direction) {
		var duration = null;
		var unit = null;
		var unzonedRange = null;
		var dayCount;
		if (this.viewSpec.duration) {
			duration = this.viewSpec.duration;
			unit = this.viewSpec.durationUnit;
			unzonedRange = this.buildRangeFromDuration(date, direction, duration, unit);
		}
		else if ((dayCount = this.opt('dayCount'))) {
			unit = 'day';
			unzonedRange = this.buildRangeFromDayCount(date, direction, dayCount);
		}
		else if ((unzonedRange = this.buildCustomVisibleRange(date))) {
			unit = computeGreatestUnit(unzonedRange.getStart(), unzonedRange.getEnd());
		}
		else {
			duration = this.getFallbackDuration();
			unit = computeGreatestUnit(duration);
			unzonedRange = this.buildRangeFromDuration(date, direction, duration, unit);
		}
		return { duration: duration, unit: unit, unzonedRange: unzonedRange };
	},
	getFallbackDuration: function() {
		return moment.duration({ days: 1 });
	},
	adjustActiveRange: function(unzonedRange, minTime, maxTime) {
		var start = unzonedRange.getStart();
		var end = unzonedRange.getEnd();
		if (this.usesMinMaxTime) {
			if (minTime < 0) {
				start.time(0).add(minTime);
			}
			if (maxTime > 24 * 60 * 60 * 1000) { 
				end.time(maxTime - (24 * 60 * 60 * 1000));
			}
		}
		return new UnzonedRange(start, end);
	},
	buildRangeFromDuration: function(date, direction, duration, unit) {
		var alignment = this.opt('dateAlignment');
		var start = date.clone();
		var end;
		var dateIncrementInput;
		var dateIncrementDuration;
		if (duration.as('days') <= 1) {
			if (this.isHiddenDay(start)) {
				start = this.skipHiddenDays(start, direction);
				start.startOf('day');
			}
		}
		if (!alignment) {
			dateIncrementInput = this.opt('dateIncrement');
			if (dateIncrementInput) {
				dateIncrementDuration = moment.duration(dateIncrementInput);
				if (dateIncrementDuration < duration) {
					alignment = computeDurationGreatestUnit(dateIncrementDuration, dateIncrementInput);
				}
				else {
					alignment = unit;
				}
			}
			else {
				alignment = unit;
			}
		}
		start.startOf(alignment);
		end = start.clone().add(duration);
		return new UnzonedRange(start, end);
	},
	buildRangeFromDayCount: function(date, direction, dayCount) {
		var customAlignment = this.opt('dateAlignment');
		var runningCount = 0;
		var start = date.clone();
		var end;
		if (customAlignment) {
			start.startOf(customAlignment);
		}
		start.startOf('day');
		start = this.skipHiddenDays(start, direction);
		end = start.clone();
		do {
			end.add(1, 'day');
			if (!this.isHiddenDay(end)) {
				runningCount++;
			}
		} while (runningCount < dayCount);
		return new UnzonedRange(start, end);
	},
	buildCustomVisibleRange: function(date) {
		var visibleUnzonedRange = this.getUnzonedRangeOption(
			'visibleRange',
			this.calendar.applyTimezone(date) 
		);
		if (visibleUnzonedRange && (visibleUnzonedRange.startMs === null || visibleUnzonedRange.endMs === null)) {
			return null;
		}
		return visibleUnzonedRange;
	},
	buildRenderRange: function(currentUnzonedRange, currentRangeUnit, isRangeAllDay) {
		return currentUnzonedRange.clone();
	},
	buildDateIncrement: function(fallback) {
		var dateIncrementInput = this.opt('dateIncrement');
		var customAlignment;
		if (dateIncrementInput) {
			return moment.duration(dateIncrementInput);
		}
		else if ((customAlignment = this.opt('dateAlignment'))) {
			return moment.duration(1, customAlignment);
		}
		else if (fallback) {
			return fallback;
		}
		else {
			return moment.duration({ days: 1 });
		}
	},
	trimHiddenDays: function(inputUnzonedRange) {
		var start = inputUnzonedRange.getStart();
		var end = inputUnzonedRange.getEnd();
		if (start) {
			start = this.skipHiddenDays(start);
		}
		if (end) {
			end = this.skipHiddenDays(end, -1, true);
		}
		return new UnzonedRange(start, end);
	},
	isDateInOtherMonth: function(date, dateProfile) {
		return false;
	},
	getUnzonedRangeOption: function(name) {
		var val = this.opt(name);
		if (typeof val === 'function') {
			val = val.apply(
				null,
				Array.prototype.slice.call(arguments, 1)
			);
		}
		if (val) {
			return this.calendar.parseUnzonedRange(val);
		}
	},
	initHiddenDays: function() {
		var hiddenDays = this.opt('hiddenDays') || []; 
		var isHiddenDayHash = []; 
		var dayCnt = 0;
		var i;
		if (this.opt('weekends') === false) {
			hiddenDays.push(0, 6); 
		}
		for (i = 0; i < 7; i++) {
			if (
				!(isHiddenDayHash[i] = $.inArray(i, hiddenDays) !== -1)
			) {
				dayCnt++;
			}
		}
		if (!dayCnt) {
			throw 'invalid hiddenDays'; 
		}
		this.isHiddenDayHash = isHiddenDayHash;
	},
	isHiddenDay: function(day) {
		if (moment.isMoment(day)) {
			day = day.day();
		}
		return this.isHiddenDayHash[day];
	},
	skipHiddenDays: function(date, inc, isExclusive) {
		var out = date.clone();
		inc = inc || 1;
		while (
			this.isHiddenDayHash[(out.day() + (isExclusive ? inc : 0) + 7) % 7]
		) {
			out.add(inc, 'days');
		}
		return out;
	}
});
;;
function Toolbar(calendar, toolbarOptions) {
	var t = this;
	t.setToolbarOptions = setToolbarOptions;
	t.render = render;
	t.removeElement = removeElement;
	t.updateTitle = updateTitle;
	t.activateButton = activateButton;
	t.deactivateButton = deactivateButton;
	t.disableButton = disableButton;
	t.enableButton = enableButton;
	t.getViewsWithButtons = getViewsWithButtons;
	t.el = null; 
	var el;
	var viewsWithButtons = [];
	function setToolbarOptions(newToolbarOptions) {
		toolbarOptions = newToolbarOptions;
	}
	function render() {
		var sections = toolbarOptions.layout;
		if (sections) {
			if (!el) {
				el = this.el = $("<div class='fc-toolbar "+ toolbarOptions.extraClasses + "'/>");
			}
			else {
				el.empty();
			}
			el.append(renderSection('left'))
				.append(renderSection('right'))
				.append(renderSection('center'))
				.append('<div class="fc-clear"/>');
		}
		else {
			removeElement();
		}
	}
	function removeElement() {
		if (el) {
			el.remove();
			el = t.el = null;
		}
	}
	function renderSection(position) {
		var theme = calendar.theme;
		var sectionEl = $('<div class="fc-' + position + '"/>');
		var buttonStr = toolbarOptions.layout[position];
		var calendarCustomButtons = calendar.opt('customButtons') || {};
		var calendarButtonTextOverrides = calendar.overrides.buttonText || {};
		var calendarButtonText = calendar.opt('buttonText') || {};
		if (buttonStr) {
			$.each(buttonStr.split(' '), function(i) {
				var groupChildren = $();
				var isOnlyButtons = true;
				var groupEl;
				$.each(this.split(','), function(j, buttonName) {
					var customButtonProps;
					var viewSpec;
					var buttonClick;
					var buttonIcon; 
					var buttonText; 
					var buttonInnerHtml;
					var buttonClasses;
					var buttonEl;
					if (buttonName == 'title') {
						groupChildren = groupChildren.add($('<h2>&nbsp;</h2>')); 
						isOnlyButtons = false;
					}
					else {
						if ((customButtonProps = calendarCustomButtons[buttonName])) {
							buttonClick = function(ev) {
								if (customButtonProps.click) {
									customButtonProps.click.call(buttonEl[0], ev);
								}
							};
							(buttonIcon = theme.getCustomButtonIconClass(customButtonProps)) ||
							(buttonIcon = theme.getIconClass(buttonName)) ||
							(buttonText = customButtonProps.text); 
						}
						else if ((viewSpec = calendar.getViewSpec(buttonName))) {
							viewsWithButtons.push(buttonName);
							buttonClick = function() {
								calendar.changeView(buttonName);
							};
							(buttonText = viewSpec.buttonTextOverride) ||
							(buttonIcon = theme.getIconClass(buttonName)) ||
							(buttonText = viewSpec.buttonTextDefault); 
						}
						else if (calendar[buttonName]) { 
							buttonClick = function() {
								calendar[buttonName]();
							};
							(buttonText = calendarButtonTextOverrides[buttonName]) ||
							(buttonIcon = theme.getIconClass(buttonName)) ||
							(buttonText = calendarButtonText[buttonName]); 
						}
						if (buttonClick) {
							buttonClasses = [
								'fc-' + buttonName + '-button',
								theme.getClass('button'),
								theme.getClass('stateDefault')
							];
							if (buttonText) {
								buttonInnerHtml = htmlEscape(buttonText);
							}
							else if (buttonIcon) {
								buttonInnerHtml = "<span class='" + buttonIcon + "'></span>";
							}
							buttonEl = $( 
								'<button type="button" class="' + buttonClasses.join(' ') + '">' +
									buttonInnerHtml +
								'</button>'
								)
								.click(function(ev) {
									if (!buttonEl.hasClass(theme.getClass('stateDisabled'))) {
										buttonClick(ev);
										if (
											buttonEl.hasClass(theme.getClass('stateActive')) ||
											buttonEl.hasClass(theme.getClass('stateDisabled'))
										) {
											buttonEl.removeClass(theme.getClass('stateHover'));
										}
									}
								})
								.mousedown(function() {
									buttonEl
										.not('.' + theme.getClass('stateActive'))
										.not('.' + theme.getClass('stateDisabled'))
										.addClass(theme.getClass('stateDown'));
								})
								.mouseup(function() {
									buttonEl.removeClass(theme.getClass('stateDown'));
								})
								.hover(
									function() {
										buttonEl
											.not('.' + theme.getClass('stateActive'))
											.not('.' + theme.getClass('stateDisabled'))
											.addClass(theme.getClass('stateHover'));
									},
									function() {
										buttonEl
											.removeClass(theme.getClass('stateHover'))
											.removeClass(theme.getClass('stateDown')); 
									}
								);
							groupChildren = groupChildren.add(buttonEl);
						}
					}
				});
				if (isOnlyButtons) {
					groupChildren
						.first().addClass(theme.getClass('cornerLeft')).end()
						.last().addClass(theme.getClass('cornerRight')).end();
				}
				if (groupChildren.length > 1) {
					groupEl = $('<div/>');
					if (isOnlyButtons) {
						groupEl.addClass(theme.getClass('buttonGroup'));
					}
					groupEl.append(groupChildren);
					sectionEl.append(groupEl);
				}
				else {
					sectionEl.append(groupChildren); 
				}
			});
		}
		return sectionEl;
	}
	function updateTitle(text) {
		if (el) {
			el.find('h2').text(text);
		}
	}
	function activateButton(buttonName) {
		if (el) {
			el.find('.fc-' + buttonName + '-button')
				.addClass(calendar.theme.getClass('stateActive'));
		}
	}
	function deactivateButton(buttonName) {
		if (el) {
			el.find('.fc-' + buttonName + '-button')
				.removeClass(calendar.theme.getClass('stateActive'));
		}
	}
	function disableButton(buttonName) {
		if (el) {
			el.find('.fc-' + buttonName + '-button')
				.prop('disabled', true)
				.addClass(calendar.theme.getClass('stateDisabled'));
		}
	}
	function enableButton(buttonName) {
		if (el) {
			el.find('.fc-' + buttonName + '-button')
				.prop('disabled', false)
				.removeClass(calendar.theme.getClass('stateDisabled'));
		}
	}
	function getViewsWithButtons() {
		return viewsWithButtons;
	}
}
;;
var Calendar = FC.Calendar = Class.extend(EmitterMixin, ListenerMixin, {
	view: null, 
	viewsByType: null, 
	currentDate: null, 
	theme: null,
	businessHourGenerator: null,
	loadingLevel: 0, 
	constructor: function(el, overrides) {
		GlobalEmitter.needed();
		this.el = el;
		this.viewsByType = {};
		this.viewSpecCache = {};
		this.initOptionsInternals(overrides);
		this.initMomentInternals(); 
		this.initCurrentDate();
		this.initEventManager();
		this.constructed();
	},
	constructed: function() {
	},
	getView: function() {
		return this.view;
	},
	publiclyTrigger: function(name, triggerInfo) {
		var optHandler = this.opt(name);
		var context;
		var args;
		if ($.isPlainObject(triggerInfo)) {
			context = triggerInfo.context;
			args = triggerInfo.args;
		}
		else if ($.isArray(triggerInfo)) {
			args = triggerInfo;
		}
		if (context == null) {
			context = this.el[0]; 
		}
		if (!args) {
			args = [];
		}
		this.triggerWith(name, context, args); 
		if (optHandler) {
			return optHandler.apply(context, args);
		}
	},
	hasPublicHandlers: function(name) {
		return this.hasHandlers(name) ||
			this.opt(name); 
	},
	instantiateView: function(viewType) {
		var spec = this.getViewSpec(viewType);
		return new spec['class'](this, spec);
	},
	isValidViewType: function(viewType) {
		return Boolean(this.getViewSpec(viewType));
	},
	changeView: function(viewName, dateOrRange) {
		if (dateOrRange) {
			if (dateOrRange.start && dateOrRange.end) { 
				this.recordOptionOverrides({ 
					visibleRange: dateOrRange
				});
			}
			else { 
				this.currentDate = this.moment(dateOrRange).stripZone(); 
			}
		}
		this.renderView(viewName);
	},
	zoomTo: function(newDate, viewType) {
		var spec;
		viewType = viewType || 'day'; 
		spec = this.getViewSpec(viewType) || this.getUnitViewSpec(viewType);
		this.currentDate = newDate.clone();
		this.renderView(spec ? spec.type : null);
	},
	initCurrentDate: function() {
		var defaultDateInput = this.opt('defaultDate');
		if (defaultDateInput != null) {
			this.currentDate = this.moment(defaultDateInput).stripZone();
		}
		else {
			this.currentDate = this.getNow(); 
		}
	},
	prev: function() {
		var prevInfo = this.view.buildPrevDateProfile(this.currentDate);
		if (prevInfo.isValid) {
			this.currentDate = prevInfo.date;
			this.renderView();
		}
	},
	next: function() {
		var nextInfo = this.view.buildNextDateProfile(this.currentDate);
		if (nextInfo.isValid) {
			this.currentDate = nextInfo.date;
			this.renderView();
		}
	},
	prevYear: function() {
		this.currentDate.add(-1, 'years');
		this.renderView();
	},
	nextYear: function() {
		this.currentDate.add(1, 'years');
		this.renderView();
	},
	today: function() {
		this.currentDate = this.getNow(); 
		this.renderView();
	},
	gotoDate: function(zonedDateInput) {
		this.currentDate = this.moment(zonedDateInput).stripZone();
		this.renderView();
	},
	incrementDate: function(delta) {
		this.currentDate.add(moment.duration(delta));
		this.renderView();
	},
	getDate: function() {
		return this.applyTimezone(this.currentDate); 
	},
	pushLoading: function() {
		if (!(this.loadingLevel++)) {
			this.publiclyTrigger('loading', [ true, this.view ]);
		}
	},
	popLoading: function() {
		if (!(--this.loadingLevel)) {
			this.publiclyTrigger('loading', [ false, this.view ]);
		}
	},
	select: function(zonedStartInput, zonedEndInput) {
		this.view.select(
			this.buildSelectFootprint.apply(this, arguments)
		);
	},
	unselect: function() { 
		if (this.view) {
			this.view.unselect();
		}
	},
	buildSelectFootprint: function(zonedStartInput, zonedEndInput) {
		var start = this.moment(zonedStartInput).stripZone();
		var end;
		if (zonedEndInput) {
			end = this.moment(zonedEndInput).stripZone();
		}
		else if (start.hasTime()) {
			end = start.clone().add(this.defaultTimedEventDuration);
		}
		else {
			end = start.clone().add(this.defaultAllDayEventDuration);
		}
		return new ComponentFootprint(
			new UnzonedRange(start, end),
			!start.hasTime()
		);
	},
	parseUnzonedRange: function(rangeInput) {
		var start = null;
		var end = null;
		if (rangeInput.start) {
			start = this.moment(rangeInput.start).stripZone();
		}
		if (rangeInput.end) {
			end = this.moment(rangeInput.end).stripZone();
		}
		if (!start && !end) {
			return null;
		}
		if (start && end && end.isBefore(start)) {
			return null;
		}
		return new UnzonedRange(start, end);
	},
	rerenderEvents: function() { 
		this.view.flash('displayingEvents');
	},
	initEventManager: function() {
		var _this = this;
		var eventManager = new EventManager(this);
		var rawSources = this.opt('eventSources') || [];
		var singleRawSource = this.opt('events');
		this.eventManager = eventManager;
		if (singleRawSource) {
			rawSources.unshift(singleRawSource);
		}
		eventManager.on('release', function(eventsPayload) {
			_this.trigger('eventsReset', eventsPayload);
		});
		eventManager.freeze();
		rawSources.forEach(function(rawSource) {
			var source = EventSourceParser.parse(rawSource, _this);
			if (source) {
				eventManager.addSource(source);
			}
		});
		eventManager.thaw();
	},
	requestEvents: function(start, end) {
		return this.eventManager.requestEvents(
			start,
			end,
			this.opt('timezone'),
			!this.opt('lazyFetching')
		);
	}
});
;;
Calendar.mixin({
	dirDefaults: null, 
	localeDefaults: null, 
	overrides: null, 
	dynamicOverrides: null, 
	optionsModel: null, 
	initOptionsInternals: function(overrides) {
		this.overrides = $.extend({}, overrides); 
		this.dynamicOverrides = {};
		this.optionsModel = new Model();
		this.populateOptionsHash();
	},
	option: function(name, value) {
		var newOptionHash;
		if (typeof name === 'string') {
			if (value === undefined) { 
				return this.optionsModel.get(name);
			}
			else { 
				newOptionHash = {};
				newOptionHash[name] = value;
				this.setOptions(newOptionHash);
			}
		}
		else if (typeof name === 'object') { 
			this.setOptions(name);
		}
	},
	opt: function(name) {
		return this.optionsModel.get(name);
	},
	setOptions: function(newOptionHash) {
		var optionCnt = 0;
		var optionName;
		this.recordOptionOverrides(newOptionHash); 
		for (optionName in newOptionHash) {
			optionCnt++;
		}
		if (optionCnt === 1) {
			if (optionName === 'height' || optionName === 'contentHeight' || optionName === 'aspectRatio') {
				this.updateViewSize(true); 
				return;
			}
			else if (optionName === 'defaultDate') {
				return; 
			}
			else if (optionName === 'businessHours') {
				return; 
			}
			else if (optionName === 'timezone') {
				this.view.flash('initialEvents');
				return;
			}
		}
		this.renderHeader();
		this.renderFooter();
		this.viewsByType = {};
		this.reinitView();
	},
	populateOptionsHash: function() {
		var locale, localeDefaults;
		var isRTL, dirDefaults;
		var rawOptions;
		locale = firstDefined( 
			this.dynamicOverrides.locale,
			this.overrides.locale
		);
		localeDefaults = localeOptionHash[locale];
		if (!localeDefaults) { 
			locale = Calendar.defaults.locale;
			localeDefaults = localeOptionHash[locale] || {};
		}
		isRTL = firstDefined( 
			this.dynamicOverrides.isRTL,
			this.overrides.isRTL,
			localeDefaults.isRTL,
			Calendar.defaults.isRTL
		);
		dirDefaults = isRTL ? Calendar.rtlDefaults : {};
		this.dirDefaults = dirDefaults;
		this.localeDefaults = localeDefaults;
		rawOptions = mergeOptions([ 
			Calendar.defaults, 
			dirDefaults,
			localeDefaults,
			this.overrides,
			this.dynamicOverrides
		]);
		populateInstanceComputableOptions(rawOptions); 
		this.optionsModel.reset(rawOptions);
	},
	recordOptionOverrides: function(newOptionHash) {
		var optionName;
		for (optionName in newOptionHash) {
			this.dynamicOverrides[optionName] = newOptionHash[optionName];
		}
		this.viewSpecCache = {}; 
		this.populateOptionsHash(); 
	}
});
;;
Calendar.mixin({
	defaultAllDayEventDuration: null,
	defaultTimedEventDuration: null,
	localeData: null,
	initMomentInternals: function() {
		var _this = this;
		this.defaultAllDayEventDuration = moment.duration(this.opt('defaultAllDayEventDuration'));
		this.defaultTimedEventDuration = moment.duration(this.opt('defaultTimedEventDuration'));
		this.optionsModel.watch('buildingMomentLocale', [
			'?locale', '?monthNames', '?monthNamesShort', '?dayNames', '?dayNamesShort',
			'?firstDay', '?weekNumberCalculation'
		], function(opts) {
			var weekNumberCalculation = opts.weekNumberCalculation;
			var firstDay = opts.firstDay;
			var _week;
			if (weekNumberCalculation === 'iso') {
				weekNumberCalculation = 'ISO'; 
			}
			var localeData = Object.create( 
				getMomentLocaleData(opts.locale) 
			);
			if (opts.monthNames) {
				localeData._months = opts.monthNames;
			}
			if (opts.monthNamesShort) {
				localeData._monthsShort = opts.monthNamesShort;
			}
			if (opts.dayNames) {
				localeData._weekdays = opts.dayNames;
			}
			if (opts.dayNamesShort) {
				localeData._weekdaysShort = opts.dayNamesShort;
			}
			if (firstDay == null && weekNumberCalculation === 'ISO') {
				firstDay = 1;
			}
			if (firstDay != null) {
				_week = Object.create(localeData._week); 
				_week.dow = firstDay;
				localeData._week = _week;
			}
			if ( 
				weekNumberCalculation === 'ISO' ||
				weekNumberCalculation === 'local' ||
				typeof weekNumberCalculation === 'function'
			) {
				localeData._fullCalendar_weekCalc = weekNumberCalculation; 
			}
			_this.localeData = localeData;
			if (_this.currentDate) {
				_this.localizeMoment(_this.currentDate); 
			}
		});
	},
	moment: function() {
		var mom;
		if (this.opt('timezone') === 'local') {
			mom = FC.moment.apply(null, arguments);
			if (mom.hasTime()) { 
				mom.local();
			}
		}
		else if (this.opt('timezone') === 'UTC') {
			mom = FC.moment.utc.apply(null, arguments); 
		}
		else {
			mom = FC.moment.parseZone.apply(null, arguments); 
		}
		this.localizeMoment(mom); 
		return mom;
	},
	msToMoment: function(ms, forceAllDay) {
		var mom = FC.moment.utc(ms); 
		if (forceAllDay) {
			mom.stripTime();
		}
		else {
			mom = this.applyTimezone(mom); 
		}
		this.localizeMoment(mom);
		return mom;
	},
	msToUtcMoment: function(ms, forceAllDay) {
		var mom = FC.moment.utc(ms); 
		if (forceAllDay) {
			mom.stripTime();
		}
		this.localizeMoment(mom);
		return mom;
	},
	localizeMoment: function(mom) {
		mom._locale = this.localeData;
	},
	getIsAmbigTimezone: function() {
		return this.opt('timezone') !== 'local' && this.opt('timezone') !== 'UTC';
	},
	applyTimezone: function(date) {
		if (!date.hasTime()) {
			return date.clone();
		}
		var zonedDate = this.moment(date.toArray());
		var timeAdjust = date.time() - zonedDate.time();
		var adjustedZonedDate;
		if (timeAdjust) { 
			adjustedZonedDate = zonedDate.clone().add(timeAdjust); 
			if (date.time() - adjustedZonedDate.time() === 0) { 
				zonedDate = adjustedZonedDate;
			}
		}
		return zonedDate;
	},
	footprintToDateProfile: function(componentFootprint, ignoreEnd) {
		var start = FC.moment.utc(componentFootprint.unzonedRange.startMs);
		var end;
		if (!ignoreEnd) {
			end = FC.moment.utc(componentFootprint.unzonedRange.endMs);
		}
		if (componentFootprint.isAllDay) {
			start.stripTime();
			if (end) {
				end.stripTime();
			}
		}
		else {
			start = this.applyTimezone(start);
			if (end) {
				end = this.applyTimezone(end);
			}
		}
		return new EventDateProfile(start, end, this);
	},
	getNow: function() {
		var now = this.opt('now');
		if (typeof now === 'function') {
			now = now();
		}
		return this.moment(now).stripZone();
	},
	humanizeDuration: function(duration) {
		return duration.locale(this.opt('locale')).humanize();
	},
	getEventEnd: function(event) {
		if (event.end) {
			return event.end.clone();
		}
		else {
			return this.getDefaultEventEnd(event.allDay, event.start);
		}
	},
	getDefaultEventEnd: function(allDay, zonedStart) {
		var end = zonedStart.clone();
		if (allDay) {
			end.stripTime().add(this.defaultAllDayEventDuration);
		}
		else {
			end.add(this.defaultTimedEventDuration);
		}
		if (this.getIsAmbigTimezone()) {
			end.stripZone(); 
		}
		return end;
	}
});
;;
Calendar.mixin({
	viewSpecCache: null, 
	getViewSpec: function(viewType) {
		var cache = this.viewSpecCache;
		return cache[viewType] || (cache[viewType] = this.buildViewSpec(viewType));
	},
	getUnitViewSpec: function(unit) {
		var viewTypes;
		var i;
		var spec;
		if ($.inArray(unit, unitsDesc) != -1) {
			viewTypes = this.header.getViewsWithButtons(); 
			$.each(FC.views, function(viewType) { 
				viewTypes.push(viewType);
			});
			for (i = 0; i < viewTypes.length; i++) {
				spec = this.getViewSpec(viewTypes[i]);
				if (spec) {
					if (spec.singleUnit == unit) {
						return spec;
					}
				}
			}
		}
	},
	buildViewSpec: function(requestedViewType) {
		var viewOverrides = this.overrides.views || {};
		var specChain = []; 
		var defaultsChain = []; 
		var overridesChain = []; 
		var viewType = requestedViewType;
		var spec; 
		var overrides; 
		var durationInput;
		var duration;
		var unit;
		while (viewType) {
			spec = fcViews[viewType];
			overrides = viewOverrides[viewType];
			viewType = null; 
			if (typeof spec === 'function') { 
				spec = { 'class': spec };
			}
			if (spec) {
				specChain.unshift(spec);
				defaultsChain.unshift(spec.defaults || {});
				durationInput = durationInput || spec.duration;
				viewType = viewType || spec.type;
			}
			if (overrides) {
				overridesChain.unshift(overrides); 
				durationInput = durationInput || overrides.duration;
				viewType = viewType || overrides.type;
			}
		}
		spec = mergeProps(specChain);
		spec.type = requestedViewType;
		if (!spec['class']) {
			return false;
		}
		durationInput = durationInput ||
			this.dynamicOverrides.duration ||
			this.overrides.duration;
		if (durationInput) {
			duration = moment.duration(durationInput);
			if (duration.valueOf()) { 
				unit = computeDurationGreatestUnit(duration, durationInput);
				spec.duration = duration;
				spec.durationUnit = unit;
				if (duration.as(unit) === 1) {
					spec.singleUnit = unit;
					overridesChain.unshift(viewOverrides[unit] || {});
				}
			}
		}
		spec.defaults = mergeOptions(defaultsChain);
		spec.overrides = mergeOptions(overridesChain);
		this.buildViewSpecOptions(spec);
		this.buildViewSpecButtonText(spec, requestedViewType);
		return spec;
	},
	buildViewSpecOptions: function(spec) {
		spec.options = mergeOptions([ 
			Calendar.defaults, 
			spec.defaults, 
			this.dirDefaults,
			this.localeDefaults, 
			this.overrides, 
			spec.overrides, 
			this.dynamicOverrides 
		]);
		populateInstanceComputableOptions(spec.options);
	},
	buildViewSpecButtonText: function(spec, requestedViewType) {
		function queryButtonText(options) {
			var buttonText = options.buttonText || {};
			return buttonText[requestedViewType] ||
				(spec.buttonTextKey ? buttonText[spec.buttonTextKey] : null) ||
				(spec.singleUnit ? buttonText[spec.singleUnit] : null);
		}
		spec.buttonTextOverride =
			queryButtonText(this.dynamicOverrides) ||
			queryButtonText(this.overrides) || 
			spec.overrides.buttonText; 
		spec.buttonTextDefault =
			queryButtonText(this.localeDefaults) ||
			queryButtonText(this.dirDefaults) ||
			spec.defaults.buttonText || 
			queryButtonText(Calendar.defaults) ||
			(spec.duration ? this.humanizeDuration(spec.duration) : null) || 
			requestedViewType; 
	}
});
;;
Calendar.mixin({
	el: null,
	contentEl: null,
	suggestedViewHeight: null,
	ignoreUpdateViewSize: 0,
	freezeContentHeightDepth: 0,
	windowResizeProxy: null,
	render: function() {
		if (!this.contentEl) {
			this.initialRender();
		}
		else if (this.elementVisible()) {
			this.calcSize();
			this.renderView();
		}
	},
	initialRender: function() {
		var _this = this;
		var el = this.el;
		el.addClass('fc');
		el.on('click.fc', 'a[data-goto]', function(ev) {
			var anchorEl = $(this);
			var gotoOptions = anchorEl.data('goto'); 
			var date = _this.moment(gotoOptions.date);
			var viewType = gotoOptions.type;
			var customAction = _this.view.opt('navLink' + capitaliseFirstLetter(viewType) + 'Click');
			if (typeof customAction === 'function') {
				customAction(date, ev);
			}
			else {
				if (typeof customAction === 'string') {
					viewType = customAction;
				}
				_this.zoomTo(date, viewType);
			}
		});
		this.optionsModel.watch('settingTheme', [ '?theme', '?themeSystem' ], function(opts) {
			var themeClass = ThemeRegistry.getThemeClass(opts.themeSystem || opts.theme);
			var theme = new themeClass(_this.optionsModel);
			var widgetClass = theme.getClass('widget');
			_this.theme = theme;
			if (widgetClass) {
				el.addClass(widgetClass);
			}
		}, function() {
			var widgetClass = _this.theme.getClass('widget');
			_this.theme = null;
			if (widgetClass) {
				el.removeClass(widgetClass);
			}
		});
		this.optionsModel.watch('settingBusinessHourGenerator', [ '?businessHours' ], function(deps) {
			_this.businessHourGenerator = new BusinessHourGenerator(deps.businessHours, _this);
			if (_this.view) {
				_this.view.set('businessHourGenerator', _this.businessHourGenerator);
			}
		}, function() {
			_this.businessHourGenerator = null;
		});
		this.optionsModel.watch('applyingDirClasses', [ '?isRTL', '?locale' ], function(opts) {
			el.toggleClass('fc-ltr', !opts.isRTL);
			el.toggleClass('fc-rtl', opts.isRTL);
		});
		this.contentEl = $("<div class='fc-view-container'/>").prependTo(el);
		this.initToolbars();
		this.renderHeader();
		this.renderFooter();
		this.renderView(this.opt('defaultView'));
		if (this.opt('handleWindowResize')) {
			$(window).resize(
				this.windowResizeProxy = debounce( 
					this.windowResize.bind(this),
					this.opt('windowResizeDelay')
				)
			);
		}
	},
	destroy: function() {
		if (this.view) {
			this.clearView();
		}
		this.toolbarsManager.proxyCall('removeElement');
		this.contentEl.remove();
		this.el.removeClass('fc fc-ltr fc-rtl');
		this.optionsModel.unwatch('settingTheme');
		this.optionsModel.unwatch('settingBusinessHourGenerator');
		this.el.off('.fc'); 
		if (this.windowResizeProxy) {
			$(window).unbind('resize', this.windowResizeProxy);
			this.windowResizeProxy = null;
		}
		GlobalEmitter.unneeded();
	},
	elementVisible: function() {
		return this.el.is(':visible');
	},
	bindViewHandlers: function(view) {
		var _this = this;
		view.watch('titleForCalendar', [ 'title' ], function(deps) { 
			if (view === _this.view) { 
				_this.setToolbarsTitle(deps.title);
			}
		});
		view.watch('dateProfileForCalendar', [ 'dateProfile' ], function(deps) {
			if (view === _this.view) { 
				_this.currentDate = deps.dateProfile.date; 
				_this.updateToolbarButtons(deps.dateProfile);
			}
		});
	},
	unbindViewHandlers: function(view) {
		view.unwatch('titleForCalendar');
		view.unwatch('dateProfileForCalendar');
	},
	renderView: function(viewType) {
		var oldView = this.view;
		var newView;
		this.freezeContentHeight();
		if (oldView && viewType && oldView.type !== viewType) {
			this.clearView();
		}
		if (!this.view && viewType) {
			newView = this.view =
				this.viewsByType[viewType] ||
				(this.viewsByType[viewType] = this.instantiateView(viewType));
			this.bindViewHandlers(newView);
			newView.setElement(
				$("<div class='fc-view fc-" + viewType + "-view' />").appendTo(this.contentEl)
			);
			this.toolbarsManager.proxyCall('activateButton', viewType);
		}
		if (this.view) {
			if (this.view.get('businessHourGenerator') !== this.businessHourGenerator) {
				this.view.set('businessHourGenerator', this.businessHourGenerator);
			}
			this.view.setDate(this.currentDate);
		}
		this.thawContentHeight();
	},
	clearView: function() {
		var currentView = this.view;
		this.toolbarsManager.proxyCall('deactivateButton', currentView.type);
		this.unbindViewHandlers(currentView);
		currentView.removeElement();
		currentView.unsetDate(); 
		this.view = null;
	},
	reinitView: function() {
		var oldView = this.view;
		var scroll = oldView.queryScroll(); 
		this.freezeContentHeight();
		this.clearView();
		this.calcSize();
		this.renderView(oldView.type); 
		this.view.applyScroll(scroll);
		this.thawContentHeight();
	},
	getSuggestedViewHeight: function() {
		if (this.suggestedViewHeight === null) {
			this.calcSize();
		}
		return this.suggestedViewHeight;
	},
	isHeightAuto: function() {
		return this.opt('contentHeight') === 'auto' || this.opt('height') === 'auto';
	},
	updateViewSize: function(isResize) {
		var view = this.view;
		var scroll;
		if (!this.ignoreUpdateViewSize && view) {
			if (isResize) {
				this.calcSize();
				scroll = view.queryScroll();
			}
			this.ignoreUpdateViewSize++;
			view.updateSize(
				this.getSuggestedViewHeight(),
				this.isHeightAuto(),
				isResize
			);
			this.ignoreUpdateViewSize--;
			if (isResize) {
				view.applyScroll(scroll);
			}
			return true; 
		}
	},
	calcSize: function() {
		if (this.elementVisible()) {
			this._calcSize();
		}
	},
	_calcSize: function() { 
		var contentHeightInput = this.opt('contentHeight');
		var heightInput = this.opt('height');
		if (typeof contentHeightInput === 'number') { 
			this.suggestedViewHeight = contentHeightInput;
		}
		else if (typeof contentHeightInput === 'function') { 
			this.suggestedViewHeight = contentHeightInput();
		}
		else if (typeof heightInput === 'number') { 
			this.suggestedViewHeight = heightInput - this.queryToolbarsHeight();
		}
		else if (typeof heightInput === 'function') { 
			this.suggestedViewHeight = heightInput() - this.queryToolbarsHeight();
		}
		else if (heightInput === 'parent') { 
			this.suggestedViewHeight = this.el.parent().height() - this.queryToolbarsHeight();
		}
		else {
			this.suggestedViewHeight = Math.round(
				this.contentEl.width() /
				Math.max(this.opt('aspectRatio'), .5)
			);
		}
	},
	windowResize: function(ev) {
		if (
			ev.target === window && 
			this.view &&
			this.view.isDatesRendered
		) {
			if (this.updateViewSize(true)) { 
				this.publiclyTrigger('windowResize', [ this.view ]);
			}
		}
	},
	freezeContentHeight: function() {
		if (!(this.freezeContentHeightDepth++)) {
			this.forceFreezeContentHeight();
		}
	},
	forceFreezeContentHeight: function() {
		this.contentEl.css({
			width: '100%',
			height: this.contentEl.height(),
			overflow: 'hidden'
		});
	},
	thawContentHeight: function() {
		this.freezeContentHeightDepth--;
		this.contentEl.css({
			width: '',
			height: '',
			overflow: ''
		});
		if (this.freezeContentHeightDepth) {
			this.forceFreezeContentHeight();
		}
	}
});
;;
Calendar.mixin({
	header: null,
	footer: null,
	toolbarsManager: null,
	initToolbars: function() {
		this.header = new Toolbar(this, this.computeHeaderOptions());
		this.footer = new Toolbar(this, this.computeFooterOptions());
		this.toolbarsManager = new Iterator([ this.header, this.footer ]);
	},
	computeHeaderOptions: function() {
		return {
			extraClasses: 'fc-header-toolbar',
			layout: this.opt('header')
		};
	},
	computeFooterOptions: function() {
		return {
			extraClasses: 'fc-footer-toolbar',
			layout: this.opt('footer')
		};
	},
	renderHeader: function() {
		var header = this.header;
		header.setToolbarOptions(this.computeHeaderOptions());
		header.render();
		if (header.el) {
			this.el.prepend(header.el);
		}
	},
	renderFooter: function() {
		var footer = this.footer;
		footer.setToolbarOptions(this.computeFooterOptions());
		footer.render();
		if (footer.el) {
			this.el.append(footer.el);
		}
	},
	setToolbarsTitle: function(title) {
		this.toolbarsManager.proxyCall('updateTitle', title);
	},
	updateToolbarButtons: function(dateProfile) {
		var now = this.getNow();
		var view = this.view;
		var todayInfo = view.buildDateProfile(now);
		var prevInfo = view.buildPrevDateProfile(this.currentDate);
		var nextInfo = view.buildNextDateProfile(this.currentDate);
		this.toolbarsManager.proxyCall(
			(todayInfo.isValid && !dateProfile.currentUnzonedRange.containsDate(now)) ?
				'enableButton' :
				'disableButton',
			'today'
		);
		this.toolbarsManager.proxyCall(
			prevInfo.isValid ?
				'enableButton' :
				'disableButton',
			'prev'
		);
		this.toolbarsManager.proxyCall(
			nextInfo.isValid ?
				'enableButton' :
				'disableButton',
			'next'
		);
	},
	queryToolbarsHeight: function() {
		return this.toolbarsManager.items.reduce(function(accumulator, toolbar) {
			var toolbarHeight = toolbar.el ? toolbar.el.outerHeight(true) : 0; 
			return accumulator + toolbarHeight;
		}, 0);
	}
});
;;
Calendar.prototype.isEventInstanceGroupAllowed = function(eventInstanceGroup) {
	var eventDef = eventInstanceGroup.getEventDef();
	var eventFootprints = this.eventRangesToEventFootprints(eventInstanceGroup.getAllEventRanges());
	var i;
	var peerEventInstances = this.getPeerEventInstances(eventDef);
	var peerEventRanges = peerEventInstances.map(eventInstanceToEventRange);
	var peerEventFootprints = this.eventRangesToEventFootprints(peerEventRanges);
	var constraintVal = eventDef.getConstraint();
	var overlapVal = eventDef.getOverlap();
	var eventAllowFunc = this.opt('eventAllow');
	for (i = 0; i < eventFootprints.length; i++) {
		if (
			!this.isFootprintAllowed(
				eventFootprints[i].componentFootprint,
				peerEventFootprints,
				constraintVal,
				overlapVal,
				eventFootprints[i].eventInstance
			)
		) {
			return false;
		}
	}
	if (eventAllowFunc) {
		for (i = 0; i < eventFootprints.length; i++) {
			if (
				eventAllowFunc(
					eventFootprints[i].componentFootprint.toLegacy(this),
					eventFootprints[i].getEventLegacy()
				) === false
			) {
				return false;
			}
		}
	}
	return true;
};
Calendar.prototype.getPeerEventInstances = function(eventDef) {
	return this.eventManager.getEventInstancesWithoutId(eventDef.id);
};
Calendar.prototype.isSelectionFootprintAllowed = function(componentFootprint) {
	var peerEventInstances = this.eventManager.getEventInstances();
	var peerEventRanges = peerEventInstances.map(eventInstanceToEventRange);
	var peerEventFootprints = this.eventRangesToEventFootprints(peerEventRanges);
	var selectAllowFunc;
	if (
		this.isFootprintAllowed(
			componentFootprint,
			peerEventFootprints,
			this.opt('selectConstraint'),
			this.opt('selectOverlap')
		)
	) {
		selectAllowFunc = this.opt('selectAllow');
		if (selectAllowFunc) {
			return selectAllowFunc(componentFootprint.toLegacy(this)) !== false;
		}
		else {
			return true;
		}
	}
	return false;
};
Calendar.prototype.isFootprintAllowed = function(
	componentFootprint,
	peerEventFootprints,
	constraintVal,
	overlapVal,
	subjectEventInstance 
) {
	var constraintFootprints; 
	var overlapEventFootprints; 
	if (constraintVal != null) {
		constraintFootprints = this.constraintValToFootprints(constraintVal, componentFootprint.isAllDay);
		if (!this.isFootprintWithinConstraints(componentFootprint, constraintFootprints)) {
			return false;
		}
	}
	overlapEventFootprints = this.collectOverlapEventFootprints(peerEventFootprints, componentFootprint);
	if (overlapVal === false) {
		if (overlapEventFootprints.length) {
			return false;
		}
	}
	else if (typeof overlapVal === 'function') {
		if (!isOverlapsAllowedByFunc(overlapEventFootprints, overlapVal, subjectEventInstance)) {
			return false;
		}
	}
	if (subjectEventInstance) {
		if (!isOverlapEventInstancesAllowed(overlapEventFootprints, subjectEventInstance)) {
			return false;
		}
	}
	return true;
};
Calendar.prototype.isFootprintWithinConstraints = function(componentFootprint, constraintFootprints) {
	var i;
	for (i = 0; i < constraintFootprints.length; i++) {
		if (this.footprintContainsFootprint(constraintFootprints[i], componentFootprint)) {
			return true;
		}
	}
	return false;
};
Calendar.prototype.constraintValToFootprints = function(constraintVal, isAllDay) {
	var eventInstances;
	if (constraintVal === 'businessHours') {
		return this.buildCurrentBusinessFootprints(isAllDay);
	}
	else if (typeof constraintVal === 'object') {
		eventInstances = this.parseEventDefToInstances(constraintVal); 
		if (!eventInstances) { 
			return this.parseFootprints(constraintVal);
		}
		else {
			return this.eventInstancesToFootprints(eventInstances);
		}
	}
	else if (constraintVal != null) { 
		eventInstances = this.eventManager.getEventInstancesWithId(constraintVal);
		return this.eventInstancesToFootprints(eventInstances);
	}
};
Calendar.prototype.buildCurrentBusinessFootprints = function(isAllDay) {
	var view = this.view;
	var businessHourGenerator = view.get('businessHourGenerator');
	var unzonedRange = view.dateProfile.activeUnzonedRange;
	var eventInstanceGroup = businessHourGenerator.buildEventInstanceGroup(isAllDay, unzonedRange);
	if (eventInstanceGroup) {
		return this.eventInstancesToFootprints(eventInstanceGroup.eventInstances);
	}
	else {
		return [];
	}
};
Calendar.prototype.eventInstancesToFootprints = function(eventInstances) {
	var eventRanges = eventInstances.map(eventInstanceToEventRange);
	var eventFootprints = this.eventRangesToEventFootprints(eventRanges);
	return eventFootprints.map(eventFootprintToComponentFootprint);
};
Calendar.prototype.collectOverlapEventFootprints = function(peerEventFootprints, targetFootprint) {
	var overlapEventFootprints = [];
	var i;
	for (i = 0; i < peerEventFootprints.length; i++) {
		if (
			this.footprintsIntersect(
				targetFootprint,
				peerEventFootprints[i].componentFootprint
			)
		) {
			overlapEventFootprints.push(peerEventFootprints[i]);
		}
	}
	return overlapEventFootprints;
};
function isOverlapsAllowedByFunc(overlapEventFootprints, overlapFunc, subjectEventInstance) {
	var i;
	for (i = 0; i < overlapEventFootprints.length; i++) {
		if (
			!overlapFunc(
				overlapEventFootprints[i].eventInstance.toLegacy(),
				subjectEventInstance ? subjectEventInstance.toLegacy() : null
			)
		) {
			return false;
		}
	}
	return true;
}
function isOverlapEventInstancesAllowed(overlapEventFootprints, subjectEventInstance) {
	var subjectLegacyInstance = subjectEventInstance.toLegacy();
	var i;
	var overlapEventInstance;
	var overlapEventDef;
	var overlapVal;
	for (i = 0; i < overlapEventFootprints.length; i++) {
		overlapEventInstance = overlapEventFootprints[i].eventInstance;
		overlapEventDef = overlapEventInstance.def;
		overlapVal = overlapEventDef.getOverlap();
		if (overlapVal === false) {
			return false;
		}
		else if (typeof overlapVal === 'function') {
			if (
				!overlapVal(
					overlapEventInstance.toLegacy(),
					subjectLegacyInstance
				)
			) {
				return false;
			}
		}
	}
	return true;
}
Calendar.prototype.parseEventDefToInstances = function(eventInput) {
	var eventManager = this.eventManager;
	var eventDef = EventDefParser.parse(eventInput, new EventSource(this));
	if (!eventDef) { 
		return false;
	}
	return eventDef.buildInstances(eventManager.currentPeriod.unzonedRange);
};
Calendar.prototype.eventRangesToEventFootprints = function(eventRanges) {
	var i;
	var eventFootprints = [];
	for (i = 0; i < eventRanges.length; i++) {
		eventFootprints.push.apply( 
			eventFootprints,
			this.eventRangeToEventFootprints(eventRanges[i])
		);
	}
	return eventFootprints;
};
Calendar.prototype.eventRangeToEventFootprints = function(eventRange) {
	return [ eventRangeToEventFootprint(eventRange) ];
};
Calendar.prototype.parseFootprints = function(rawInput) {
	var start, end;
	if (rawInput.start) {
		start = this.moment(rawInput.start);
		if (!start.isValid()) {
			start = null;
		}
	}
	if (rawInput.end) {
		end = this.moment(rawInput.end);
		if (!end.isValid()) {
			end = null;
		}
	}
	return [
		new ComponentFootprint(
			new UnzonedRange(start, end),
			(start && !start.hasTime()) || (end && !end.hasTime()) 
		)
	];
};
Calendar.prototype.footprintContainsFootprint = function(outerFootprint, innerFootprint) {
	return outerFootprint.unzonedRange.containsRange(innerFootprint.unzonedRange);
};
Calendar.prototype.footprintsIntersect = function(footprint0, footprint1) {
	return footprint0.unzonedRange.intersectsWith(footprint1.unzonedRange);
};
;;
Calendar.mixin({
	getEventSources: function() {
		return this.eventManager.otherSources.slice(); 
	},
	getEventSourceById: function(id) {
		return this.eventManager.getSourceById(
			EventSource.normalizeId(id)
		);
	},
	addEventSource: function(sourceInput) {
		var source = EventSourceParser.parse(sourceInput, this);
		if (source) {
			this.eventManager.addSource(source);
		}
	},
	removeEventSources: function(sourceMultiQuery) {
		var eventManager = this.eventManager;
		var sources;
		var i;
		if (sourceMultiQuery == null) {
			this.eventManager.removeAllSources();
		}
		else {
			sources = eventManager.multiQuerySources(sourceMultiQuery);
			eventManager.freeze();
			for (i = 0; i < sources.length; i++) {
				eventManager.removeSource(sources[i]);
			}
			eventManager.thaw();
		}
	},
	removeEventSource: function(sourceQuery) {
		var eventManager = this.eventManager;
		var sources = eventManager.querySources(sourceQuery);
		var i;
		eventManager.freeze();
		for (i = 0; i < sources.length; i++) {
			eventManager.removeSource(sources[i]);
		}
		eventManager.thaw();
	},
	refetchEventSources: function(sourceMultiQuery) {
		var eventManager = this.eventManager;
		var sources = eventManager.multiQuerySources(sourceMultiQuery);
		var i;
		eventManager.freeze();
		for (i = 0; i < sources.length; i++) {
			eventManager.refetchSource(sources[i]);
		}
		eventManager.thaw();
	},
	refetchEvents: function() {
		this.eventManager.refetchAllSources();
	},
	renderEvents: function(eventInputs, isSticky) {
		this.eventManager.freeze();
		for (var i = 0; i < eventInputs.length; i++) {
			this.renderEvent(eventInputs[i], isSticky);
		}
		this.eventManager.thaw();
	},
	renderEvent: function(eventInput, isSticky) {
		var eventManager = this.eventManager;
		var eventDef = EventDefParser.parse(
			eventInput,
			eventInput.source || eventManager.stickySource
		);
		if (eventDef) {
			eventManager.addEventDef(eventDef, isSticky);
		}
	},
	removeEvents: function(legacyQuery) {
		var eventManager = this.eventManager;
		var legacyInstances = [];
		var idMap = {};
		var eventDef;
		var i;
		if (legacyQuery == null) { 
			eventManager.removeAllEventDefs(true); 
		}
		else {
			eventManager.getEventInstances().forEach(function(eventInstance) {
				legacyInstances.push(eventInstance.toLegacy());
			});
			legacyInstances = filterLegacyEventInstances(legacyInstances, legacyQuery);
			for (i = 0; i < legacyInstances.length; i++) {
				eventDef = this.eventManager.getEventDefByUid(legacyInstances[i]._id);
				idMap[eventDef.id] = true;
			}
			eventManager.freeze();
			for (i in idMap) { 
				eventManager.removeEventDefsById(i, true); 
			}
			eventManager.thaw();
		}
	},
	clientEvents: function(legacyQuery) {
		var legacyEventInstances = [];
		this.eventManager.getEventInstances().forEach(function(eventInstance) {
			legacyEventInstances.push(eventInstance.toLegacy());
		});
		return filterLegacyEventInstances(legacyEventInstances, legacyQuery);
	},
	updateEvents: function(eventPropsArray) {
		this.eventManager.freeze();
		for (var i = 0; i < eventPropsArray.length; i++) {
			this.updateEvent(eventPropsArray[i]);
		}
		this.eventManager.thaw();
	},
	updateEvent: function(eventProps) {
		var eventDef = this.eventManager.getEventDefByUid(eventProps._id);
		var eventInstance;
		var eventDefMutation;
		if (eventDef instanceof SingleEventDef) {
			eventInstance = eventDef.buildInstance();
			eventDefMutation = EventDefMutation.createFromRawProps(
				eventInstance,
				eventProps, 
				null 
			);
			this.eventManager.mutateEventsWithId(eventDef.id, eventDefMutation); 
		}
	}
});
function filterLegacyEventInstances(legacyEventInstances, legacyQuery) {
	if (legacyQuery == null) {
		return legacyEventInstances;
	}
	else if ($.isFunction(legacyQuery)) {
		return legacyEventInstances.filter(legacyQuery);
	}
	else { 
		legacyQuery += ''; 
		return legacyEventInstances.filter(function(legacyEventInstance) {
			return legacyEventInstance.id == legacyQuery ||
				legacyEventInstance._id === legacyQuery; 
		});
	}
}
;;
Calendar.defaults = {
	titleRangeSeparator: ' \u2013 ', 
	monthYearFormat: 'MMMM YYYY', 
	defaultTimedEventDuration: '02:00:00',
	defaultAllDayEventDuration: { days: 1 },
	forceEventDuration: false,
	nextDayThreshold: '09:00:00', 
	columnHeader: true,
	defaultView: 'month',
	aspectRatio: 1.35,
	header: {
		left: 'title',
		center: '',
		right: 'today prev,next'
	},
	weekends: true,
	weekNumbers: false,
	weekNumberTitle: 'W',
	weekNumberCalculation: 'local',
	scrollTime: '06:00:00',
	minTime: '00:00:00',
	maxTime: '24:00:00',
	showNonCurrentDates: true,
	lazyFetching: true,
	startParam: 'start',
	endParam: 'end',
	timezoneParam: 'timezone',
	timezone: false,
	isRTL: false,
	buttonText: {
		prev: "prev",
		next: "next",
		prevYear: "prev year",
		nextYear: "next year",
		year: 'year', 
		today: 'today',
		month: 'month',
		week: 'week',
		day: 'day'
	},
	allDayText: 'all-day',
	agendaEventMinHeight: 0,
	theme: false,
	dragOpacity: .75,
	dragRevertDuration: 500,
	dragScroll: true,
	unselectAuto: true,
	dropAccept: '*',
	eventOrder: 'title',
	eventLimit: false,
	eventLimitText: 'more',
	eventLimitClick: 'popover',
	dayPopoverFormat: 'LL',
	handleWindowResize: true,
	windowResizeDelay: 100, 
	longPressDelay: 1000
};
Calendar.englishDefaults = { 
	dayPopoverFormat: 'dddd, MMMM D'
};
Calendar.rtlDefaults = { 
	header: { 
		left: 'next,prev today',
		center: '',
		right: 'title'
	},
	buttonIcons: {
		prev: 'right-single-arrow',
		next: 'left-single-arrow',
		prevYear: 'right-double-arrow',
		nextYear: 'left-double-arrow'
	},
	themeButtonIcons: {
		prev: 'circle-triangle-e',
		next: 'circle-triangle-w',
		nextYear: 'seek-prev',
		prevYear: 'seek-next'
	}
};
;;
var localeOptionHash = FC.locales = {}; 
FC.datepickerLocale = function(localeCode, dpLocaleCode, dpOptions) {
	var fcOptions = localeOptionHash[localeCode] || (localeOptionHash[localeCode] = {});
	fcOptions.isRTL = dpOptions.isRTL;
	fcOptions.weekNumberTitle = dpOptions.weekHeader;
	$.each(dpComputableOptions, function(name, func) {
		fcOptions[name] = func(dpOptions);
	});
	if ($.datepicker) {
		$.datepicker.regional[dpLocaleCode] =
			$.datepicker.regional[localeCode] = 
				dpOptions;
		$.datepicker.regional.en = $.datepicker.regional[''];
		$.datepicker.setDefaults(dpOptions);
	}
};
FC.locale = function(localeCode, newFcOptions) {
	var fcOptions;
	var momOptions;
	fcOptions = localeOptionHash[localeCode] || (localeOptionHash[localeCode] = {});
	if (newFcOptions) {
		fcOptions = localeOptionHash[localeCode] = mergeOptions([ fcOptions, newFcOptions ]);
	}
	momOptions = getMomentLocaleData(localeCode); 
	$.each(momComputableOptions, function(name, func) {
		if (fcOptions[name] == null) {
			fcOptions[name] = func(momOptions, fcOptions);
		}
	});
	Calendar.defaults.locale = localeCode;
};
var dpComputableOptions = {
	buttonText: function(dpOptions) {
		return {
			prev: stripHtmlEntities(dpOptions.prevText),
			next: stripHtmlEntities(dpOptions.nextText),
			today: stripHtmlEntities(dpOptions.currentText)
		};
	},
	monthYearFormat: function(dpOptions) {
		return dpOptions.showMonthAfterYear ?
			'YYYY[' + dpOptions.yearSuffix + '] MMMM' :
			'MMMM YYYY[' + dpOptions.yearSuffix + ']';
	}
};
var momComputableOptions = {
	dayOfMonthFormat: function(momOptions, fcOptions) {
		var format = momOptions.longDateFormat('l'); 
		format = format.replace(/^Y+[^\w\s]*|[^\w\s]*Y+$/g, '');
		if (fcOptions.isRTL) {
			format += ' ddd'; 
		}
		else {
			format = 'ddd ' + format; 
		}
		return format;
	},
	mediumTimeFormat: function(momOptions) { 
		return momOptions.longDateFormat('LT')
			.replace(/\s*a$/i, 'a'); 
	},
	smallTimeFormat: function(momOptions) {
		return momOptions.longDateFormat('LT')
			.replace(':mm', '(:mm)')
			.replace(/(\Wmm)$/, '($1)') 
			.replace(/\s*a$/i, 'a'); 
	},
	extraSmallTimeFormat: function(momOptions) {
		return momOptions.longDateFormat('LT')
			.replace(':mm', '(:mm)')
			.replace(/(\Wmm)$/, '($1)') 
			.replace(/\s*a$/i, 't'); 
	},
	hourFormat: function(momOptions) {
		return momOptions.longDateFormat('LT')
			.replace(':mm', '')
			.replace(/(\Wmm)$/, '') 
			.replace(/\s*a$/i, 'a'); 
	},
	noMeridiemTimeFormat: function(momOptions) {
		return momOptions.longDateFormat('LT')
			.replace(/\s*a$/i, ''); 
	}
};
var instanceComputableOptions = {
	smallDayDateFormat: function(options) {
		return options.isRTL ?
			'D dd' :
			'dd D';
	},
	weekFormat: function(options) {
		return options.isRTL ?
			'w[ ' + options.weekNumberTitle + ']' :
			'[' + options.weekNumberTitle + ' ]w';
	},
	smallWeekFormat: function(options) {
		return options.isRTL ?
			'w[' + options.weekNumberTitle + ']' :
			'[' + options.weekNumberTitle + ']w';
	}
};
function populateInstanceComputableOptions(options) {
	$.each(instanceComputableOptions, function(name, func) {
		if (options[name] == null) {
			options[name] = func(options);
		}
	});
}
function getMomentLocaleData(localeCode) {
	return moment.localeData(localeCode) || moment.localeData('en');
}
FC.locale('en', Calendar.englishDefaults);
;;
var UnzonedRange = FC.UnzonedRange = Class.extend({
	startMs: null, 
	endMs: null, 
	isStart: true,
	isEnd: true,
	constructor: function(startInput, endInput) {
		if (moment.isMoment(startInput)) {
			startInput = startInput.clone().stripZone();
		}
		if (moment.isMoment(endInput)) {
			endInput = endInput.clone().stripZone();
		}
		if (startInput) {
			this.startMs = startInput.valueOf();
		}
		if (endInput) {
			this.endMs = endInput.valueOf();
		}
	},
	intersect: function(otherRange) {
		var startMs = this.startMs;
		var endMs = this.endMs;
		var newRange = null;
		if (otherRange.startMs !== null) {
			if (startMs === null) {
				startMs = otherRange.startMs;
			}
			else {
				startMs = Math.max(startMs, otherRange.startMs);
			}
		}
		if (otherRange.endMs !== null) {
			if (endMs === null) {
				endMs = otherRange.endMs;
			}
			else {
				endMs = Math.min(endMs, otherRange.endMs);
			}
		}
		if (startMs === null || endMs === null || startMs < endMs) {
			newRange = new UnzonedRange(startMs, endMs);
			newRange.isStart = this.isStart && startMs === this.startMs;
			newRange.isEnd = this.isEnd && endMs === this.endMs;
		}
		return newRange;
	},
	intersectsWith: function(otherRange) {
		return (this.endMs === null || otherRange.startMs === null || this.endMs > otherRange.startMs) &&
			(this.startMs === null || otherRange.endMs === null || this.startMs < otherRange.endMs);
	},
	containsRange: function(innerRange) {
		return (this.startMs === null || (innerRange.startMs !== null && innerRange.startMs >= this.startMs)) &&
			(this.endMs === null || (innerRange.endMs !== null && innerRange.endMs <= this.endMs));
	},
	containsDate: function(date) {
		var ms = date.valueOf();
		return (this.startMs === null || ms >= this.startMs) &&
			(this.endMs === null || ms < this.endMs);
	},
	constrainDate: function(date) {
		var ms = date.valueOf();
		if (this.startMs !== null && ms < this.startMs) {
			ms = this.startMs;
		}
		if (this.endMs !== null && ms >= this.endMs) {
			ms = this.endMs - 1;
		}
		return ms;
	},
	equals: function(otherRange) {
		return this.startMs === otherRange.startMs && this.endMs === otherRange.endMs;
	},
	clone: function() {
		var range = new UnzonedRange(this.startMs, this.endMs);
		range.isStart = this.isStart;
		range.isEnd = this.isEnd;
		return range;
	},
	getStart: function() {
		if (this.startMs !== null) {
			return FC.moment.utc(this.startMs).stripZone();
		}
	},
	getEnd: function() {
		if (this.endMs !== null) {
			return FC.moment.utc(this.endMs).stripZone();
		}
	},
	as: function(unit) {
		return moment.utc(this.endMs).diff(
			moment.utc(this.startMs),
			unit,
			true
		);
	}
});
function invertUnzonedRanges(ranges, constraintRange) {
	var invertedRanges = [];
	var startMs = constraintRange.startMs; 
	var i;
	var dateRange;
	ranges.sort(compareUnzonedRanges);
	for (i = 0; i < ranges.length; i++) {
		dateRange = ranges[i];
		if (dateRange.startMs > startMs) { 
			invertedRanges.push(
				new UnzonedRange(startMs, dateRange.startMs)
			);
		}
		if (dateRange.endMs > startMs) {
			startMs = dateRange.endMs;
		}
	}
	if (startMs < constraintRange.endMs) { 
		invertedRanges.push(
			new UnzonedRange(startMs, constraintRange.endMs)
		);
	}
	return invertedRanges;
}
function compareUnzonedRanges(range1, range2) {
	return range1.startMs - range2.startMs; 
}
;;
var ComponentFootprint = FC.ComponentFootprint = Class.extend({
	unzonedRange: null,
	isAllDay: false, 
	constructor: function(unzonedRange, isAllDay) {
		this.unzonedRange = unzonedRange;
		this.isAllDay = isAllDay;
	},
	toLegacy: function(calendar) {
		return {
			start: calendar.msToMoment(this.unzonedRange.startMs, this.isAllDay),
			end: calendar.msToMoment(this.unzonedRange.endMs, this.isAllDay)
		};
	}
});
;;
var EventPeriod = Class.extend(EmitterMixin, {
	start: null,
	end: null,
	timezone: null,
	unzonedRange: null,
	requestsByUid: null,
	pendingCnt: 0,
	freezeDepth: 0,
	stuntedReleaseCnt: 0,
	releaseCnt: 0,
	eventDefsByUid: null,
	eventDefsById: null,
	eventInstanceGroupsById: null,
	constructor: function(start, end, timezone) {
		this.start = start;
		this.end = end;
		this.timezone = timezone;
		this.unzonedRange = new UnzonedRange(
			start.clone().stripZone(),
			end.clone().stripZone()
		);
		this.requestsByUid = {};
		this.eventDefsByUid = {};
		this.eventDefsById = {};
		this.eventInstanceGroupsById = {};
	},
	isWithinRange: function(start, end) {
		return !start.isBefore(this.start) && !end.isAfter(this.end);
	},
	requestSources: function(sources) {
		this.freeze();
		for (var i = 0; i < sources.length; i++) {
			this.requestSource(sources[i]);
		}
		this.thaw();
	},
	requestSource: function(source) {
		var _this = this;
		var request = { source: source, status: 'pending' };
		this.requestsByUid[source.uid] = request;
		this.pendingCnt += 1;
		source.fetch(this.start, this.end, this.timezone).then(function(eventDefs) {
			if (request.status !== 'cancelled') {
				request.status = 'completed';
				request.eventDefs = eventDefs;
				_this.addEventDefs(eventDefs);
				_this.pendingCnt--;
				_this.tryRelease();
			}
		}, function() { 
			if (request.status !== 'cancelled') {
				request.status = 'failed';
				_this.pendingCnt--;
				_this.tryRelease();
			}
		});
	},
	purgeSource: function(source) {
		var request = this.requestsByUid[source.uid];
		if (request) {
			delete this.requestsByUid[source.uid];
			if (request.status === 'pending') {
				request.status = 'cancelled';
				this.pendingCnt--;
				this.tryRelease();
			}
			else if (request.status === 'completed') {
				request.eventDefs.forEach(this.removeEventDef.bind(this));
			}
		}
	},
	purgeAllSources: function() {
		var requestsByUid = this.requestsByUid;
		var uid, request;
		var completedCnt = 0;
		for (uid in requestsByUid) {
			request = requestsByUid[uid];
			if (request.status === 'pending') {
				request.status = 'cancelled';
			}
			else if (request.status === 'completed') {
				completedCnt++;
			}
		}
		this.requestsByUid = {};
		this.pendingCnt = 0;
		if (completedCnt) {
			this.removeAllEventDefs(); 
		}
	},
	getEventDefByUid: function(eventDefUid) {
		return this.eventDefsByUid[eventDefUid];
	},
	getEventDefsById: function(eventDefId) {
		var a = this.eventDefsById[eventDefId];
		if (a) {
			return a.slice(); 
		}
		return [];
	},
	addEventDefs: function(eventDefs) {
		for (var i = 0; i < eventDefs.length; i++) {
			this.addEventDef(eventDefs[i]);
		}
	},
	addEventDef: function(eventDef) {
		var eventDefsById = this.eventDefsById;
		var eventDefId = eventDef.id;
		var eventDefs = eventDefsById[eventDefId] || (eventDefsById[eventDefId] = []);
		var eventInstances = eventDef.buildInstances(this.unzonedRange);
		var i;
		eventDefs.push(eventDef);
		this.eventDefsByUid[eventDef.uid] = eventDef;
		for (i = 0; i < eventInstances.length; i++) {
			this.addEventInstance(eventInstances[i], eventDefId);
		}
	},
	removeEventDefsById: function(eventDefId) {
		var _this = this;
		this.getEventDefsById(eventDefId).forEach(function(eventDef) {
			_this.removeEventDef(eventDef);
		});
	},
	removeAllEventDefs: function() {
		var isEmpty = $.isEmptyObject(this.eventDefsByUid);
		this.eventDefsByUid = {};
		this.eventDefsById = {};
		this.eventInstanceGroupsById = {};
		if (!isEmpty) {
			this.tryRelease();
		}
	},
	removeEventDef: function(eventDef) {
		var eventDefsById = this.eventDefsById;
		var eventDefs = eventDefsById[eventDef.id];
		delete this.eventDefsByUid[eventDef.uid];
		if (eventDefs) {
			removeExact(eventDefs, eventDef);
			if (!eventDefs.length) {
				delete eventDefsById[eventDef.id];
			}
			this.removeEventInstancesForDef(eventDef);
		}
	},
	getEventInstances: function() { 
		var eventInstanceGroupsById = this.eventInstanceGroupsById;
		var eventInstances = [];
		var id;
		for (id in eventInstanceGroupsById) {
			eventInstances.push.apply(eventInstances, 
				eventInstanceGroupsById[id].eventInstances
			);
		}
		return eventInstances;
	},
	getEventInstancesWithId: function(eventDefId) {
		var eventInstanceGroup = this.eventInstanceGroupsById[eventDefId];
		if (eventInstanceGroup) {
			return eventInstanceGroup.eventInstances.slice(); 
		}
		return [];
	},
	getEventInstancesWithoutId: function(eventDefId) { 
		var eventInstanceGroupsById = this.eventInstanceGroupsById;
		var matchingInstances = [];
		var id;
		for (id in eventInstanceGroupsById) {
			if (id !== eventDefId) {
				matchingInstances.push.apply(matchingInstances, 
					eventInstanceGroupsById[id].eventInstances
				);
			}
		}
		return matchingInstances;
	},
	addEventInstance: function(eventInstance, eventDefId) {
		var eventInstanceGroupsById = this.eventInstanceGroupsById;
		var eventInstanceGroup = eventInstanceGroupsById[eventDefId] ||
			(eventInstanceGroupsById[eventDefId] = new EventInstanceGroup());
		eventInstanceGroup.eventInstances.push(eventInstance);
		this.tryRelease();
	},
	removeEventInstancesForDef: function(eventDef) {
		var eventInstanceGroupsById = this.eventInstanceGroupsById;
		var eventInstanceGroup = eventInstanceGroupsById[eventDef.id];
		var removeCnt;
		if (eventInstanceGroup) {
			removeCnt = removeMatching(eventInstanceGroup.eventInstances, function(currentEventInstance) {
				return currentEventInstance.def === eventDef;
			});
			if (!eventInstanceGroup.eventInstances.length) {
				delete eventInstanceGroupsById[eventDef.id];
			}
			if (removeCnt) {
				this.tryRelease();
			}
		}
	},
	tryRelease: function() {
		if (!this.pendingCnt) {
			if (!this.freezeDepth) {
				this.release();
			}
			else {
				this.stuntedReleaseCnt++;
			}
		}
	},
	release: function() {
		this.releaseCnt++;
		this.trigger('release', this.eventInstanceGroupsById);
	},
	whenReleased: function() {
		var _this = this;
		if (this.releaseCnt) {
			return Promise.resolve(this.eventInstanceGroupsById);
		}
		else {
			return Promise.construct(function(onResolve) {
				_this.one('release', onResolve);
			});
		}
	},
	freeze: function() {
		if (!(this.freezeDepth++)) {
			this.stuntedReleaseCnt = 0;
		}
	},
	thaw: function() {
		if (!(--this.freezeDepth) && this.stuntedReleaseCnt && !this.pendingCnt) {
			this.release();
		}
	}
});
;;
var EventManager = Class.extend(EmitterMixin, ListenerMixin, {
	currentPeriod: null,
	calendar: null,
	stickySource: null,
	otherSources: null, 
	constructor: function(calendar) {
		this.calendar = calendar;
		this.stickySource = new ArrayEventSource(calendar);
		this.otherSources = [];
	},
	requestEvents: function(start, end, timezone, force) {
		if (
			force ||
			!this.currentPeriod ||
			!this.currentPeriod.isWithinRange(start, end) ||
			timezone !== this.currentPeriod.timezone
		) {
			this.setPeriod( 
				new EventPeriod(start, end, timezone)
			);
		}
		return this.currentPeriod.whenReleased();
	},
	addSource: function(eventSource) {
		this.otherSources.push(eventSource);
		if (this.currentPeriod) {
			this.currentPeriod.requestSource(eventSource); 
		}
	},
	removeSource: function(doomedSource) {
		removeExact(this.otherSources, doomedSource);
		if (this.currentPeriod) {
			this.currentPeriod.purgeSource(doomedSource); 
		}
	},
	removeAllSources: function() {
		this.otherSources = [];
		if (this.currentPeriod) {
			this.currentPeriod.purgeAllSources(); 
		}
	},
	refetchSource: function(eventSource) {
		var currentPeriod = this.currentPeriod;
		if (currentPeriod) {
			currentPeriod.freeze();
			currentPeriod.purgeSource(eventSource);
			currentPeriod.requestSource(eventSource);
			currentPeriod.thaw();
		}
	},
	refetchAllSources: function() {
		var currentPeriod = this.currentPeriod;
		if (currentPeriod) {
			currentPeriod.freeze();
			currentPeriod.purgeAllSources();
			currentPeriod.requestSources(this.getSources());
			currentPeriod.thaw();
		}
	},
	getSources: function() {
		return [ this.stickySource ].concat(this.otherSources);
	},
	multiQuerySources: function(matchInputs) {
		if (!matchInputs) {
			matchInputs = [];
		}
		else if (!$.isArray(matchInputs)) {
			matchInputs = [ matchInputs ];
		}
		var matchingSources = [];
		var i;
		for (i = 0; i < matchInputs.length; i++) {
			matchingSources.push.apply( 
				matchingSources,
				this.querySources(matchInputs[i])
			);
		}
		return matchingSources;
	},
	querySources: function(matchInput) {
		var sources = this.otherSources;
		var i, source;
		for (i = 0; i < sources.length; i++) {
			source = sources[i];
			if (source === matchInput) {
				return [ source ];
			}
		}
		source = this.getSourceById(EventSource.normalizeId(matchInput));
		if (source) {
			return [ source ];
		}
		matchInput = EventSourceParser.parse(matchInput, this.calendar);
		if (matchInput) {
			return $.grep(sources, function(source) {
				return isSourcesEquivalent(matchInput, source);
			});
		}
	},
	getSourceById: function(id) {
		return $.grep(this.otherSources, function(source) {
			return source.id && source.id === id;
		})[0];
	},
	setPeriod: function(eventPeriod) {
		if (this.currentPeriod) {
			this.unbindPeriod(this.currentPeriod);
			this.currentPeriod = null;
		}
		this.currentPeriod = eventPeriod;
		this.bindPeriod(eventPeriod);
		eventPeriod.requestSources(this.getSources());
	},
	bindPeriod: function(eventPeriod) {
		this.listenTo(eventPeriod, 'release', function(eventsPayload) {
			this.trigger('release', eventsPayload);
		});
	},
	unbindPeriod: function(eventPeriod) {
		this.stopListeningTo(eventPeriod);
	},
	getEventDefByUid: function(uid) {
		if (this.currentPeriod) {
			return this.currentPeriod.getEventDefByUid(uid);
		}
	},
	addEventDef: function(eventDef, isSticky) {
		if (isSticky) {
			this.stickySource.addEventDef(eventDef);
		}
		if (this.currentPeriod) {
			this.currentPeriod.addEventDef(eventDef); 
		}
	},
	removeEventDefsById: function(eventId) {
		this.getSources().forEach(function(eventSource) {
			eventSource.removeEventDefsById(eventId);
		});
		if (this.currentPeriod) {
			this.currentPeriod.removeEventDefsById(eventId); 
		}
	},
	removeAllEventDefs: function() {
		this.getSources().forEach(function(eventSource) {
			eventSource.removeAllEventDefs();
		});
		if (this.currentPeriod) {
			this.currentPeriod.removeAllEventDefs();
		}
	},
	mutateEventsWithId: function(eventDefId, eventDefMutation) {
		var currentPeriod = this.currentPeriod;
		var eventDefs;
		var undoFuncs = [];
		if (currentPeriod) {
			currentPeriod.freeze();
			eventDefs = currentPeriod.getEventDefsById(eventDefId);
			eventDefs.forEach(function(eventDef) {
				currentPeriod.removeEventDef(eventDef);
				undoFuncs.push(eventDefMutation.mutateSingle(eventDef));
				currentPeriod.addEventDef(eventDef);
			});
			currentPeriod.thaw();
			return function() {
				currentPeriod.freeze();
				for (var i = 0; i < eventDefs.length; i++) {
					currentPeriod.removeEventDef(eventDefs[i]);
					undoFuncs[i]();
					currentPeriod.addEventDef(eventDefs[i]);
				}
				currentPeriod.thaw();
			};
		}
		return function() { };
	},
	buildMutatedEventInstanceGroup: function(eventDefId, eventDefMutation) {
		var eventDefs = this.getEventDefsById(eventDefId);
		var i;
		var defCopy;
		var allInstances = [];
		for (i = 0; i < eventDefs.length; i++) {
			defCopy = eventDefs[i].clone();
			if (defCopy instanceof SingleEventDef) {
				eventDefMutation.mutateSingle(defCopy);
				allInstances.push.apply(allInstances, 
					defCopy.buildInstances()
				);
			}
		}
		return new EventInstanceGroup(allInstances);
	},
	freeze: function() {
		if (this.currentPeriod) {
			this.currentPeriod.freeze();
		}
	},
	thaw: function() {
		if (this.currentPeriod) {
			this.currentPeriod.thaw();
		}
	}
});
[
	'getEventDefsById',
	'getEventInstances',
	'getEventInstancesWithId',
	'getEventInstancesWithoutId'
].forEach(function(methodName) {
	EventManager.prototype[methodName] = function() {
		var currentPeriod = this.currentPeriod;
		if (currentPeriod) {
			return currentPeriod[methodName].apply(currentPeriod, arguments);
		}
		return [];
	};
});
function isSourcesEquivalent(source0, source1) {
	return source0.getPrimitive() == source1.getPrimitive();
}
;;
var BUSINESS_HOUR_EVENT_DEFAULTS = {
	start: '09:00',
	end: '17:00',
	dow: [ 1, 2, 3, 4, 5 ], 
	rendering: 'inverse-background'
};
var BusinessHourGenerator = FC.BusinessHourGenerator = Class.extend({
	rawComplexDef: null,
	calendar: null, 
	constructor: function(rawComplexDef, calendar) {
		this.rawComplexDef = rawComplexDef;
		this.calendar = calendar;
	},
	buildEventInstanceGroup: function(isAllDay, unzonedRange) {
		var eventDefs = this.buildEventDefs(isAllDay);
		var eventInstanceGroup;
		if (eventDefs.length) {
			eventInstanceGroup = new EventInstanceGroup(
				eventDefsToEventInstances(eventDefs, unzonedRange)
			);
			eventInstanceGroup.explicitEventDef = eventDefs[0];
			return eventInstanceGroup;
		}
	},
	buildEventDefs: function(isAllDay) {
		var rawComplexDef = this.rawComplexDef;
		var rawDefs = [];
		var requireDow = false;
		var i;
		var defs = [];
		if (rawComplexDef === true) {
			rawDefs = [ {} ]; 
		}
		else if ($.isPlainObject(rawComplexDef)) {
			rawDefs = [ rawComplexDef ];
		}
		else if ($.isArray(rawComplexDef)) {
			rawDefs = rawComplexDef;
			requireDow = true; 
		}
		for (i = 0; i < rawDefs.length; i++) {
			if (!requireDow || rawDefs[i].dow) {
				defs.push(
					this.buildEventDef(isAllDay, rawDefs[i])
				);
			}
		}
		return defs;
	},
	buildEventDef: function(isAllDay, rawDef) {
		var fullRawDef = $.extend({}, BUSINESS_HOUR_EVENT_DEFAULTS, rawDef);
		if (isAllDay) {
			fullRawDef.start = null;
			fullRawDef.end = null;
		}
		return RecurringEventDef.parse(
			fullRawDef,
			new EventSource(this.calendar) 
		);
	}
});
;;
var EventDefParser = {
	parse: function(eventInput, source) {
		if (
			isTimeString(eventInput.start) || moment.isDuration(eventInput.start) ||
			isTimeString(eventInput.end) || moment.isDuration(eventInput.end)
		) {
			return RecurringEventDef.parse(eventInput, source);
		}
		else {
			return SingleEventDef.parse(eventInput, source);
		}
	}
};
;;
var EventDef = FC.EventDef = Class.extend(ParsableModelMixin, {
	source: null, 
	id: null, 
	rawId: null, 
	uid: null, 
	title: null,
	url: null,
	rendering: null,
	constraint: null,
	overlap: null,
	editable: null,
	startEditable: null,
	durationEditable: null,
	color: null,
	backgroundColor: null,
	borderColor: null,
	textColor: null,
	className: null, 
	miscProps: null,
	constructor: function(source) {
		this.source = source;
		this.className = [];
		this.miscProps = {};
	},
	isAllDay: function() {
	},
	buildInstances: function(unzonedRange) {
	},
	clone: function() {
		var copy = new this.constructor(this.source);
		copy.id = this.id;
		copy.rawId = this.rawId;
		copy.uid = this.uid; 
		EventDef.copyVerbatimStandardProps(this, copy);
		copy.className = this.className.slice(); 
		copy.miscProps = $.extend({}, this.miscProps);
		return copy;
	},
	hasInverseRendering: function() {
		return this.getRendering() === 'inverse-background';
	},
	hasBgRendering: function() {
		var rendering = this.getRendering();
		return rendering === 'inverse-background' || rendering === 'background';
	},
	getRendering: function() {
		if (this.rendering != null) {
			return this.rendering;
		}
		return this.source.rendering;
	},
	getConstraint: function() {
		if (this.constraint != null) {
			return this.constraint;
		}
		if (this.source.constraint != null) {
			return this.source.constraint;
		}
		return this.source.calendar.opt('eventConstraint'); 
	},
	getOverlap: function() {
		if (this.overlap != null) {
			return this.overlap;
		}
		if (this.source.overlap != null) {
			return this.source.overlap;
		}
		return this.source.calendar.opt('eventOverlap'); 
	},
	isStartExplicitlyEditable: function() {
		if (this.startEditable !== null) {
			return this.startEditable;
		}
		return this.source.startEditable;
	},
	isDurationExplicitlyEditable: function() {
		if (this.durationEditable !== null) {
			return this.durationEditable;
		}
		return this.source.durationEditable;
	},
	isExplicitlyEditable: function() {
		if (this.editable !== null) {
			return this.editable;
		}
		return this.source.editable;
	},
	toLegacy: function() {
		var obj = $.extend({}, this.miscProps);
		obj._id = this.uid;
		obj.source = this.source;
		obj.className = this.className.slice(); 
		obj.allDay = this.isAllDay();
		if (this.rawId != null) {
			obj.id = this.rawId;
		}
		EventDef.copyVerbatimStandardProps(this, obj);
		return obj;
	},
	applyManualStandardProps: function(rawProps) {
		if (rawProps.id != null) {
			this.id = EventDef.normalizeId((this.rawId = rawProps.id));
		}
		else {
			this.id = EventDef.generateId();
		}
		if (rawProps._id != null) { 
			this.uid = String(rawProps._id);
		}
		else {
			this.uid = EventDef.generateId();
		}
		if ($.isArray(rawProps.className)) {
			this.className = rawProps.className;
		}
		if (typeof rawProps.className === 'string') {
			this.className = rawProps.className.split(/\s+/);
		}
		return true;
	},
	applyMiscProps: function(rawProps) {
		$.extend(this.miscProps, rawProps);
	}
});
EventDef.defineStandardProps = ParsableModelMixin_defineStandardProps;
EventDef.copyVerbatimStandardProps = ParsableModelMixin_copyVerbatimStandardProps;
EventDef.uuid = 0;
EventDef.normalizeId = function(id) {
	return String(id);
};
EventDef.generateId = function() {
	return '_fc' + (EventDef.uuid++);
};
EventDef.defineStandardProps({
	_id: false,
	id: false,
	className: false,
	source: false, 
	title: true,
	url: true,
	rendering: true,
	constraint: true,
	overlap: true,
	editable: true,
	startEditable: true,
	durationEditable: true,
	color: true,
	backgroundColor: true,
	borderColor: true,
	textColor: true
});
EventDef.parse = function(rawInput, source) {
	var def = new this(source);
	if (def.applyProps(rawInput)) {
		return def;
	}
	return false;
};
;;
var SingleEventDef = EventDef.extend({
	dateProfile: null,
	buildInstances: function() {
		return [ this.buildInstance() ];
	},
	buildInstance: function() {
		return new EventInstance(
			this, 
			this.dateProfile
		);
	},
	isAllDay: function() {
		return this.dateProfile.isAllDay();
	},
	clone: function() {
		var def = EventDef.prototype.clone.call(this);
		def.dateProfile = this.dateProfile;
		return def;
	},
	rezone: function() {
		var calendar = this.source.calendar;
		var dateProfile = this.dateProfile;
		this.dateProfile = new EventDateProfile(
			calendar.moment(dateProfile.start),
			dateProfile.end ? calendar.moment(dateProfile.end) : null,
			calendar
		);
	},
	applyManualStandardProps: function(rawProps) {
		var superSuccess = EventDef.prototype.applyManualStandardProps.apply(this, arguments);
		var dateProfile = EventDateProfile.parse(rawProps, this.source); 
		if (dateProfile) {
			this.dateProfile = dateProfile;
			if (rawProps.date != null) {
				this.miscProps.date = rawProps.date;
			}
			return superSuccess;
		}
		else {
			return false;
		}
	}
});
SingleEventDef.defineStandardProps({ 
	start: false,
	date: false, 
	end: false,
	allDay: false
});
;;
var RecurringEventDef = EventDef.extend({
	startTime: null, 
	endTime: null, 
	dowHash: null, 
	isAllDay: function() {
		return !this.startTime && !this.endTime;
	},
	buildInstances: function(unzonedRange) {
		var calendar = this.source.calendar;
		var unzonedDate = unzonedRange.getStart();
		var unzonedEnd = unzonedRange.getEnd();
		var zonedDayStart;
		var instanceStart, instanceEnd;
		var instances = [];
		while (unzonedDate.isBefore(unzonedEnd)) {
			if (!this.dowHash || this.dowHash[unzonedDate.day()]) {
				zonedDayStart = calendar.applyTimezone(unzonedDate);
				instanceStart = zonedDayStart.clone();
				instanceEnd = null;
				if (this.startTime) {
					instanceStart.time(this.startTime);
				}
				else {
					instanceStart.stripTime();
				}
				if (this.endTime) {
					instanceEnd = zonedDayStart.clone().time(this.endTime);
				}
				instances.push(
					new EventInstance(
						this, 
						new EventDateProfile(instanceStart, instanceEnd, calendar)
					)
				);
			}
			unzonedDate.add(1, 'days');
		}
		return instances;
	},
	setDow: function(dowNumbers) {
		if (!this.dowHash) {
			this.dowHash = {};
		}
		for (var i = 0; i < dowNumbers.length; i++) {
			this.dowHash[dowNumbers[i]] = true;
		}
	},
	clone: function() {
		var def = EventDef.prototype.clone.call(this);
		if (def.startTime) {
			def.startTime = moment.duration(this.startTime);
		}
		if (def.endTime) {
			def.endTime = moment.duration(this.endTime);
		}
		if (this.dowHash) {
			def.dowHash = $.extend({}, this.dowHash);
		}
		return def;
	},
	applyProps: function(rawProps) {
		var superSuccess = EventDef.prototype.applyProps.apply(this, arguments);
		if (rawProps.start) {
			this.startTime = moment.duration(rawProps.start);
		}
		if (rawProps.end) {
			this.endTime = moment.duration(rawProps.end);
		}
		if (rawProps.dow) {
			this.setDow(rawProps.dow);
		}
		return superSuccess;
	}
});
RecurringEventDef.defineStandardProps({ 
	start: false,
	end: false,
	dow: false
});
;;
var EventInstance = Class.extend({
	def: null, 
	dateProfile: null, 
	constructor: function(def, dateProfile) {
		this.def = def;
		this.dateProfile = dateProfile;
	},
	toLegacy: function() {
		var dateProfile = this.dateProfile;
		var obj = this.def.toLegacy();
		obj.start = dateProfile.start.clone();
		obj.end = dateProfile.end ? dateProfile.end.clone() : null;
		return obj;
	}
});
;;
var EventInstanceGroup = FC.EventInstanceGroup = Class.extend({
	eventInstances: null,
	explicitEventDef: null, 
	constructor: function(eventInstances) {
		this.eventInstances = eventInstances || [];
	},
	getAllEventRanges: function(constraintRange) {
		if (constraintRange) {
			return this.sliceNormalRenderRanges(constraintRange);
		}
		else {
			return this.eventInstances.map(eventInstanceToEventRange);
		}
	},
	sliceRenderRanges: function(constraintRange) {
		if (this.isInverse()) {
			return this.sliceInverseRenderRanges(constraintRange);
		}
		else {
			return this.sliceNormalRenderRanges(constraintRange);
		}
	},
	sliceNormalRenderRanges: function(constraintRange) {
		var eventInstances = this.eventInstances;
		var i, eventInstance;
		var slicedRange;
		var slicedEventRanges = [];
		for (i = 0; i < eventInstances.length; i++) {
			eventInstance = eventInstances[i];
			slicedRange = eventInstance.dateProfile.unzonedRange.intersect(constraintRange);
			if (slicedRange) {
				slicedEventRanges.push(
					new EventRange(
						slicedRange,
						eventInstance.def,
						eventInstance
					)
				);
			}
		}
		return slicedEventRanges;
	},
	sliceInverseRenderRanges: function(constraintRange) {
		var unzonedRanges = this.eventInstances.map(eventInstanceToUnzonedRange);
		var ownerDef = this.getEventDef();
		unzonedRanges = invertUnzonedRanges(unzonedRanges, constraintRange);
		return unzonedRanges.map(function(unzonedRange) {
			return new EventRange(unzonedRange, ownerDef); 
		});
	},
	isInverse: function() {
		return this.getEventDef().hasInverseRendering();
	},
	getEventDef: function() {
		return this.explicitEventDef || this.eventInstances[0].def;
	}
});
;;
var EventDateProfile = Class.extend({
	start: null,
	end: null,
	unzonedRange: null,
	constructor: function(start, end, calendar) {
		this.start = start;
		this.end = end || null;
		this.unzonedRange = this.buildUnzonedRange(calendar);
	},
	isAllDay: function() { 
		return !(this.start.hasTime() || (this.end && this.end.hasTime()));
	},
	buildUnzonedRange: function(calendar) {
		var startMs = this.start.clone().stripZone().valueOf();
		var endMs = this.getEnd(calendar).stripZone().valueOf();
		return new UnzonedRange(startMs, endMs);
	},
	getEnd: function(calendar) {
		return this.end ?
			this.end.clone() :
			calendar.getDefaultEventEnd(
				this.isAllDay(),
				this.start
			);
	}
});
EventDateProfile.isStandardProp = function(propName) {
	return propName === 'start' || propName === 'date' || propName === 'end' || propName === 'allDay';
};
EventDateProfile.parse = function(rawProps, source) {
	var startInput = rawProps.start || rawProps.date;
	var endInput = rawProps.end;
	if (!startInput) {
		return false;
	}
	var calendar = source.calendar;
	var start = calendar.moment(startInput);
	var end = endInput ? calendar.moment(endInput) : null;
	var forcedAllDay = rawProps.allDay;
	var forceEventDuration = calendar.opt('forceEventDuration');
	if (!start.isValid()) {
		return false;
	}
	if (end && (!end.isValid() || !end.isAfter(start))) {
		end = null;
	}
	if (forcedAllDay == null) {
		forcedAllDay = source.allDayDefault;
		if (forcedAllDay == null) {
			forcedAllDay = calendar.opt('allDayDefault');
		}
	}
	if (forcedAllDay === true) {
		start.stripTime();
		if (end) {
			end.stripTime();
		}
	}
	else if (forcedAllDay === false) {
		if (!start.hasTime()) {
			start.time(0);
		}
		if (end && !end.hasTime()) {
			end.time(0);
		}
	}
	if (!end && forceEventDuration) {
		end = calendar.getDefaultEventEnd(!start.hasTime(), start);
	}
	return new EventDateProfile(start, end, calendar);
};
;;
var EventRange = Class.extend({
	unzonedRange: null,
	eventDef: null,
	eventInstance: null, 
	constructor: function(unzonedRange, eventDef, eventInstance) {
		this.unzonedRange = unzonedRange;
		this.eventDef = eventDef;
		if (eventInstance) {
			this.eventInstance = eventInstance;
		}
	}
});
;;
var EventFootprint = FC.EventFootprint = Class.extend({
	componentFootprint: null,
	eventDef: null,
	eventInstance: null, 
	constructor: function(componentFootprint, eventDef, eventInstance) {
		this.componentFootprint = componentFootprint;
		this.eventDef = eventDef;
		if (eventInstance) {
			this.eventInstance = eventInstance;
		}
	},
	getEventLegacy: function() {
		return (this.eventInstance || this.eventDef).toLegacy();
	}
});
;;
var EventDefMutation = FC.EventDefMutation = Class.extend({
	dateMutation: null,
	eventDefId: null, 
	className: null, 
	verbatimStandardProps: null,
	miscProps: null,
	mutateSingle: function(eventDef) {
		var origDateProfile;
		if (this.dateMutation) {
			origDateProfile = eventDef.dateProfile;
			eventDef.dateProfile = this.dateMutation.buildNewDateProfile(
				origDateProfile,
				eventDef.source.calendar
			);
		}
		if (this.eventDefId != null) {
			eventDef.id = EventDef.normalizeId((eventDef.rawId = this.eventDefId));
		}
		if (this.className) {
			eventDef.className = this.className;
		}
		if (this.verbatimStandardProps) {
			SingleEventDef.copyVerbatimStandardProps(
				this.verbatimStandardProps, 
				eventDef 
			);
		}
		if (this.miscProps) {
			eventDef.applyMiscProps(this.miscProps);
		}
		if (origDateProfile) {
			return function() {
				eventDef.dateProfile = origDateProfile;
			};
		}
		else {
			return function() { };
		}
	},
	setDateMutation: function(dateMutation) {
		if (dateMutation && !dateMutation.isEmpty()) {
			this.dateMutation = dateMutation;
		}
		else {
			this.dateMutation = null;
		}
	},
	isEmpty: function() {
		return !this.dateMutation;
	}
});
EventDefMutation.createFromRawProps = function(eventInstance, rawProps, largeUnit) {
	var eventDef = eventInstance.def;
	var dateProps = {};
	var standardProps = {};
	var miscProps = {};
	var verbatimStandardProps = {};
	var eventDefId = null;
	var className = null;
	var propName;
	var dateProfile;
	var dateMutation;
	var defMutation;
	for (propName in rawProps) {
		if (EventDateProfile.isStandardProp(propName)) {
			dateProps[propName] = rawProps[propName];
		}
		else if (eventDef.isStandardProp(propName)) {
			standardProps[propName] = rawProps[propName];
		}
		else if (eventDef.miscProps[propName] !== rawProps[propName]) { 
			miscProps[propName] = rawProps[propName];
		}
	}
	dateProfile = EventDateProfile.parse(dateProps, eventDef.source);
	if (dateProfile) { 
		dateMutation = EventDefDateMutation.createFromDiff(
			eventInstance.dateProfile,
			dateProfile,
			largeUnit
		);
	}
	if (standardProps.id !== eventDef.id) {
		eventDefId = standardProps.id; 
	}
	if (!isArraysEqual(standardProps.className, eventDef.className)) {
		className = standardProps.className; 
	}
	EventDef.copyVerbatimStandardProps(
		standardProps, 
		verbatimStandardProps 
	);
	defMutation = new EventDefMutation();
	defMutation.eventDefId = eventDefId;
	defMutation.className = className;
	defMutation.verbatimStandardProps = verbatimStandardProps;
	defMutation.miscProps = miscProps;
	if (dateMutation) {
		defMutation.dateMutation = dateMutation;
	}
	return defMutation;
};
;;
var EventDefDateMutation = Class.extend({
	clearEnd: false,
	forceTimed: false,
	forceAllDay: false,
	dateDelta: null,
	startDelta: null,
	endDelta: null,
	buildNewDateProfile: function(eventDateProfile, calendar) {
		var start = eventDateProfile.start.clone();
		var end = null;
		var shouldRezone = false;
		if (eventDateProfile.end && !this.clearEnd) {
			end = eventDateProfile.end.clone();
		}
		else if (this.endDelta && !end) {
			end = calendar.getDefaultEventEnd(eventDateProfile.isAllDay(), start);
		}
		if (this.forceTimed) {
			shouldRezone = true;
			if (!start.hasTime()) {
				start.time(0);
			}
			if (end && !end.hasTime()) {
				end.time(0);
			}
		}
		else if (this.forceAllDay) {
			if (start.hasTime()) {
				start.stripTime();
			}
			if (end && end.hasTime()) {
				end.stripTime();
			}
		}
		if (this.dateDelta) {
			shouldRezone = true;
			start.add(this.dateDelta);
			if (end) {
				end.add(this.dateDelta);
			}
		}
		if (this.endDelta) {
			shouldRezone = true;
			end.add(this.endDelta);
		}
		if (this.startDelta) {
			shouldRezone = true;
			start.add(this.startDelta);
		}
		if (shouldRezone) {
			start = calendar.applyTimezone(start);
			if (end) {
				end = calendar.applyTimezone(end);
			}
		}
		if (!end && calendar.opt('forceEventDuration')) {
			end = calendar.getDefaultEventEnd(eventDateProfile.isAllDay(), start);
		}
		return new EventDateProfile(start, end, calendar);
	},
	setDateDelta: function(dateDelta) {
		if (dateDelta && dateDelta.valueOf()) {
			this.dateDelta = dateDelta;
		}
		else {
			this.dateDelta = null;
		}
	},
	setStartDelta: function(startDelta) {
		if (startDelta && startDelta.valueOf()) {
			this.startDelta = startDelta;
		}
		else {
			this.startDelta = null;
		}
	},
	setEndDelta: function(endDelta) {
		if (endDelta && endDelta.valueOf()) {
			this.endDelta = endDelta;
		}
		else {
			this.endDelta = null;
		}
	},
	isEmpty: function() {
		return !this.clearEnd && !this.forceTimed && !this.forceAllDay &&
			!this.dateDelta && !this.startDelta && !this.endDelta;
	}
});
EventDefDateMutation.createFromDiff = function(dateProfile0, dateProfile1, largeUnit) {
	var clearEnd = dateProfile0.end && !dateProfile1.end;
	var forceTimed = dateProfile0.isAllDay() && !dateProfile1.isAllDay();
	var forceAllDay = !dateProfile0.isAllDay() && dateProfile1.isAllDay();
	var dateDelta;
	var endDiff;
	var endDelta;
	var mutation;
	function subtractDates(date1, date0) { 
		if (largeUnit) {
			return diffByUnit(date1, date0, largeUnit); 
		}
		else if (dateProfile1.isAllDay()) {
			return diffDay(date1, date0); 
		}
		else {
			return diffDayTime(date1, date0); 
		}
	}
	dateDelta = subtractDates(dateProfile1.start, dateProfile0.start);
	if (dateProfile1.end) {
		endDiff = subtractDates(
			dateProfile1.unzonedRange.getEnd(),
			dateProfile0.unzonedRange.getEnd()
		);
		endDelta = endDiff.subtract(dateDelta);
	}
	mutation = new EventDefDateMutation();
	mutation.clearEnd = clearEnd;
	mutation.forceTimed = forceTimed;
	mutation.forceAllDay = forceAllDay;
	mutation.setDateDelta(dateDelta);
	mutation.setEndDelta(endDelta);
	return mutation;
};
;;
function eventDefsToEventInstances(eventDefs, unzonedRange) {
	var eventInstances = [];
	var i;
	for (i = 0; i < eventDefs.length; i++) {
		eventInstances.push.apply(eventInstances, 
			eventDefs[i].buildInstances(unzonedRange)
		);
	}
	return eventInstances;
}
function eventInstanceToEventRange(eventInstance) {
	return new EventRange(
		eventInstance.dateProfile.unzonedRange,
		eventInstance.def,
		eventInstance
	);
}
function eventRangeToEventFootprint(eventRange) {
	return new EventFootprint(
		new ComponentFootprint(
			eventRange.unzonedRange,
			eventRange.eventDef.isAllDay()
		),
		eventRange.eventDef,
		eventRange.eventInstance 
	);
}
function eventInstanceToUnzonedRange(eventInstance) {
	return eventInstance.dateProfile.unzonedRange;
}
function eventFootprintToComponentFootprint(eventFootprint) {
	return eventFootprint.componentFootprint;
}
;;
var EventSource = Class.extend(ParsableModelMixin, {
	calendar: null,
	id: null, 
	uid: null,
	color: null,
	backgroundColor: null,
	borderColor: null,
	textColor: null,
	className: null, 
	editable: null,
	startEditable: null,
	durationEditable: null,
	rendering: null,
	overlap: null,
	constraint: null,
	allDayDefault: null,
	eventDataTransform: null, 
	constructor: function(calendar) {
		this.calendar = calendar;
		this.className = [];
		this.uid = String(EventSource.uuid++);
	},
	fetch: function(start, end, timezone) {
	},
	removeEventDefsById: function(eventDefId) {
	},
	removeAllEventDefs: function() {
	},
	getPrimitive: function(otherSource) {
	},
	parseEventDefs: function(rawEventDefs) {
		var i;
		var eventDef;
		var eventDefs = [];
		for (i = 0; i < rawEventDefs.length; i++) {
			eventDef = this.parseEventDef(rawEventDefs[i]);
			if (eventDef) {
				eventDefs.push(eventDef);
			}
		}
		return eventDefs;
	},
	parseEventDef: function(rawInput) {
		var calendarTransform = this.calendar.opt('eventDataTransform');
		var sourceTransform = this.eventDataTransform;
		if (calendarTransform) {
			rawInput = calendarTransform(rawInput);
		}
		if (sourceTransform) {
			rawInput = sourceTransform(rawInput);
		}
		return EventDefParser.parse(rawInput, this);
	},
	applyManualStandardProps: function(rawProps) {
		if (rawProps.id != null) {
			this.id = EventSource.normalizeId(rawProps.id);
		}
		if ($.isArray(rawProps.className)) {
			this.className = rawProps.className;
		}
		else if (typeof rawProps.className === 'string') {
			this.className = rawProps.className.split(/\s+/);
		}
		return true;
	}
});
EventSource.defineStandardProps = ParsableModelMixin_defineStandardProps;
EventSource.uuid = 0;
EventSource.normalizeId = function(id) {
	if (id) {
		return String(id);
	}
	return null;
};
EventSource.defineStandardProps({
	id: false,
	className: false,
	color: true,
	backgroundColor: true,
	borderColor: true,
	textColor: true,
	editable: true,
	startEditable: true,
	durationEditable: true,
	rendering: true,
	overlap: true,
	constraint: true,
	allDayDefault: true,
	eventDataTransform: true
});
EventSource.parse = function(rawInput, calendar) {
	var source = new this(calendar);
	if (typeof rawInput === 'object') {
		if (source.applyProps(rawInput)) {
			return source;
		}
	}
	return false;
};
FC.EventSource = EventSource;
;;
var EventSourceParser = {
	sourceClasses: [],
	registerClass: function(EventSourceClass) {
		this.sourceClasses.unshift(EventSourceClass); 
	},
	parse: function(rawInput, calendar) {
		var sourceClasses = this.sourceClasses;
		var i;
		var eventSource;
		for (i = 0; i < sourceClasses.length; i++) {
			eventSource = sourceClasses[i].parse(rawInput, calendar);
			if (eventSource) {
				return eventSource;
			}
		}
	}
};
FC.EventSourceParser = EventSourceParser;
;;
var ArrayEventSource = EventSource.extend({
	rawEventDefs: null, 
	eventDefs: null,
	currentTimezone: null,
	constructor: function(calendar) {
		EventSource.apply(this, arguments); 
		this.eventDefs = []; 
	},
	setRawEventDefs: function(rawEventDefs) {
		this.rawEventDefs = rawEventDefs;
		this.eventDefs = this.parseEventDefs(rawEventDefs);
	},
	fetch: function(start, end, timezone) {
		var eventDefs = this.eventDefs;
		var i;
		if (
			this.currentTimezone !== null &&
			this.currentTimezone !== timezone
		) {
			for (i = 0; i < eventDefs.length; i++) {
				if (eventDefs[i] instanceof SingleEventDef) {
					eventDefs[i].rezone();
				}
			}
		}
		this.currentTimezone = timezone;
		return Promise.resolve(eventDefs);
	},
	addEventDef: function(eventDef) {
		this.eventDefs.push(eventDef);
	},
	removeEventDefsById: function(eventDefId) {
		return removeMatching(this.eventDefs, function(eventDef) {
			return eventDef.id === eventDefId;
		});
	},
	removeAllEventDefs: function() {
		this.eventDefs = [];
	},
	getPrimitive: function() {
		return this.rawEventDefs;
	},
	applyManualStandardProps: function(rawProps) {
		var superSuccess = EventSource.prototype.applyManualStandardProps.apply(this, arguments);
		this.setRawEventDefs(rawProps.events);
		return superSuccess;
	}
});
ArrayEventSource.defineStandardProps({
	events: false 
});
ArrayEventSource.parse = function(rawInput, calendar) {
	var rawProps;
	if ($.isArray(rawInput.events)) { 
		rawProps = rawInput;
	}
	else if ($.isArray(rawInput)) { 
		rawProps = { events: rawInput };
	}
	if (rawProps) {
		return EventSource.parse.call(this, rawProps, calendar);
	}
	return false;
};
EventSourceParser.registerClass(ArrayEventSource);
FC.ArrayEventSource = ArrayEventSource;
;;
var FuncEventSource = EventSource.extend({
	func: null,
	fetch: function(start, end, timezone) {
		var _this = this;
		this.calendar.pushLoading();
		return Promise.construct(function(onResolve) {
			_this.func.call(
				_this.calendar,
				start.clone(),
				end.clone(),
				timezone,
				function(rawEventDefs) {
					_this.calendar.popLoading();
					onResolve(_this.parseEventDefs(rawEventDefs));
				}
			);
		});
	},
	getPrimitive: function() {
		return this.func;
	},
	applyManualStandardProps: function(rawProps) {
		var superSuccess = EventSource.prototype.applyManualStandardProps.apply(this, arguments);
		this.func = rawProps.events;
		return superSuccess;
	}
});
FuncEventSource.defineStandardProps({
	events: false 
});
FuncEventSource.parse = function(rawInput, calendar) {
	var rawProps;
	if ($.isFunction(rawInput.events)) { 
		rawProps = rawInput;
	}
	else if ($.isFunction(rawInput)) { 
		rawProps = { events: rawInput };
	}
	if (rawProps) {
		return EventSource.parse.call(this, rawProps, calendar);
	}
	return false;
};
EventSourceParser.registerClass(FuncEventSource);
FC.FuncEventSource = FuncEventSource;
;;
var JsonFeedEventSource = EventSource.extend({
	url: null,
	startParam: null,
	endParam: null,
	timezoneParam: null,
	ajaxSettings: null, 
	fetch: function(start, end, timezone) {
		var _this = this;
		var ajaxSettings = this.ajaxSettings;
		var onSuccess = ajaxSettings.success;
		var onError = ajaxSettings.error;
		var requestParams = this.buildRequestParams(start, end, timezone);
		this.calendar.pushLoading();
		return Promise.construct(function(onResolve, onReject) {
			$.ajax($.extend(
				{}, 
				JsonFeedEventSource.AJAX_DEFAULTS,
				ajaxSettings,
				{
					url: _this.url,
					data: requestParams,
					success: function(rawEventDefs) {
						var callbackRes;
						_this.calendar.popLoading();
						if (rawEventDefs) {
							callbackRes = applyAll(onSuccess, this, arguments); 
							if ($.isArray(callbackRes)) {
								rawEventDefs = callbackRes;
							}
							onResolve(_this.parseEventDefs(rawEventDefs));
						}
						else {
							onReject();
						}
					},
					error: function() {
						_this.calendar.popLoading();
						applyAll(onError, this, arguments); 
						onReject();
					}
				}
			));
		});
	},
	buildRequestParams: function(start, end, timezone) {
		var calendar = this.calendar;
		var ajaxSettings = this.ajaxSettings;
		var startParam, endParam, timezoneParam;
		var customRequestParams;
		var params = {};
		startParam = this.startParam;
		if (startParam == null) {
			startParam = calendar.opt('startParam');
		}
		endParam = this.endParam;
		if (endParam == null) {
			endParam = calendar.opt('endParam');
		}
		timezoneParam = this.timezoneParam;
		if (timezoneParam == null) {
			timezoneParam = calendar.opt('timezoneParam');
		}
		if ($.isFunction(ajaxSettings.data)) {
			customRequestParams = ajaxSettings.data();
		}
		else {
			customRequestParams = ajaxSettings.data || {};
		}
		$.extend(params, customRequestParams);
		params[startParam] = start.format();
		params[endParam] = end.format();
		if (timezone && timezone !== 'local') {
			params[timezoneParam] = timezone;
		}
		return params;
	},
	getPrimitive: function() {
		return this.url;
	},
	applyMiscProps: function(rawProps) {
		EventSource.prototype.applyMiscProps.apply(this, arguments);
		this.ajaxSettings = rawProps;
	}
});
JsonFeedEventSource.AJAX_DEFAULTS = {
	dataType: 'json',
	cache: false
};
JsonFeedEventSource.defineStandardProps({
	url: true,
	startParam: true,
	endParam: true,
	timezoneParam: true
});
JsonFeedEventSource.parse = function(rawInput, calendar) {
	var rawProps;
	if (typeof rawInput.url === 'string') { 
		rawProps = rawInput;
	}
	else if (typeof rawInput === 'string') { 
		rawProps = { url: rawInput };
	}
	if (rawProps) {
		return EventSource.parse.call(this, rawProps, calendar);
	}
	return false;
};
EventSourceParser.registerClass(JsonFeedEventSource);
FC.JsonFeedEventSource = JsonFeedEventSource;
;;
var ThemeRegistry = FC.ThemeRegistry = {
	themeClassHash: {},
	register: function(themeName, themeClass) {
		this.themeClassHash[themeName] = themeClass;
	},
	getThemeClass: function(themeSetting) {
		if (!themeSetting) {
			return StandardTheme;
		}
		else if (themeSetting === true) {
			return JqueryUiTheme;
		}
		else {
			return this.themeClassHash[themeSetting];
		}
	}
};
;;
var Theme = FC.Theme = Class.extend({
	classes: {},
	iconClasses: {},
	baseIconClass: '',
	iconOverrideOption: null,
	iconOverrideCustomButtonOption: null,
	iconOverridePrefix: '',
	constructor: function(optionsModel) {
		this.optionsModel = optionsModel;
		this.processIconOverride();
	},
	processIconOverride: function() {
		if (this.iconOverrideOption) {
			this.setIconOverride(
				this.optionsModel.get(this.iconOverrideOption)
			);
		}
	},
	setIconOverride: function(iconOverrideHash) {
		var iconClassesCopy;
		var buttonName;
		if ($.isPlainObject(iconOverrideHash)) {
			iconClassesCopy = $.extend({}, this.iconClasses);
			for (buttonName in iconOverrideHash) {
				iconClassesCopy[buttonName] = this.applyIconOverridePrefix(
					iconOverrideHash[buttonName]
				);
			}
			this.iconClasses = iconClassesCopy;
		}
		else if (iconOverrideHash === false) {
			this.iconClasses = {};
		}
	},
	applyIconOverridePrefix: function(className) {
		var prefix = this.iconOverridePrefix;
		if (prefix && className.indexOf(prefix) !== 0) { 
			className = prefix + className;
		}
		return className;
	},
	getClass: function(key) {
		return this.classes[key] || '';
	},
	getIconClass: function(buttonName) {
		var className = this.iconClasses[buttonName];
		if (className) {
			return this.baseIconClass + ' ' + className;
		}
		return '';
	},
	getCustomButtonIconClass: function(customButtonProps) {
		var className;
		if (this.iconOverrideCustomButtonOption) {
			className = customButtonProps[this.iconOverrideCustomButtonOption];
			if (className) {
				return this.baseIconClass + ' ' + this.applyIconOverridePrefix(className);
			}
		}
		return '';
	}
});
;;
var StandardTheme = Theme.extend({
	classes: {
		widget: 'fc-unthemed',
		widgetHeader: 'fc-widget-header',
		widgetContent: 'fc-widget-content',
		buttonGroup: 'fc-button-group',
		button: 'fc-button',
		cornerLeft: 'fc-corner-left',
		cornerRight: 'fc-corner-right',
		stateDefault: 'fc-state-default',
		stateActive: 'fc-state-active',
		stateDisabled: 'fc-state-disabled',
		stateHover: 'fc-state-hover',
		stateDown: 'fc-state-down',
		popoverHeader: 'fc-widget-header',
		popoverContent: 'fc-widget-content',
		headerRow: 'fc-widget-header',
		dayRow: 'fc-widget-content',
		listView: 'fc-widget-content'
	},
	baseIconClass: 'fc-icon',
	iconClasses: {
		close: 'fc-icon-x',
		prev: 'fc-icon-left-single-arrow',
		next: 'fc-icon-right-single-arrow',
		prevYear: 'fc-icon-left-double-arrow',
		nextYear: 'fc-icon-right-double-arrow'
	},
	iconOverrideOption: 'buttonIcons',
	iconOverrideCustomButtonOption: 'icon',
	iconOverridePrefix: 'fc-icon-'
});
ThemeRegistry.register('standard', StandardTheme);
;;
var JqueryUiTheme = Theme.extend({
	classes: {
		widget: 'ui-widget',
		widgetHeader: 'ui-widget-header',
		widgetContent: 'ui-widget-content',
		buttonGroup: 'fc-button-group',
		button: 'ui-button',
		cornerLeft: 'ui-corner-left',
		cornerRight: 'ui-corner-right',
		stateDefault: 'ui-state-default',
		stateActive: 'ui-state-active',
		stateDisabled: 'ui-state-disabled',
		stateHover: 'ui-state-hover',
		stateDown: 'ui-state-down',
		today: 'ui-state-highlight',
		popoverHeader: 'ui-widget-header',
		popoverContent: 'ui-widget-content',
		headerRow: 'ui-widget-header',
		dayRow: 'ui-widget-content',
		listView: 'ui-widget-content'
	},
	baseIconClass: 'ui-icon',
	iconClasses: {
		close: 'ui-icon-closethick',
		prev: 'ui-icon-circle-triangle-w',
		next: 'ui-icon-circle-triangle-e',
		prevYear: 'ui-icon-seek-prev',
		nextYear: 'ui-icon-seek-next'
	},
	iconOverrideOption: 'themeButtonIcons',
	iconOverrideCustomButtonOption: 'themeIcon',
	iconOverridePrefix: 'ui-icon-'
});
ThemeRegistry.register('jquery-ui', JqueryUiTheme);
;;
var BootstrapTheme = Theme.extend({
	classes: {
		widget: 'fc-bootstrap3',
		tableGrid: 'table-bordered', 
		tableList: 'table table-striped', 
		buttonGroup: 'btn-group',
		button: 'btn btn-default',
		stateActive: 'active',
		stateDisabled: 'disabled',
		today: 'alert alert-info', 
		popover: 'panel panel-default',
		popoverHeader: 'panel-heading',
		popoverContent: 'panel-body',
		headerRow: 'panel-default', 
		dayRow: 'panel-default', 
		listView: 'panel panel-default'
	},
	baseIconClass: 'glyphicon',
	iconClasses: {
		close: 'glyphicon-remove',
		prev: 'glyphicon-chevron-left',
		next: 'glyphicon-chevron-right',
		prevYear: 'glyphicon-backward',
		nextYear: 'glyphicon-forward'
	},
	iconOverrideOption: 'bootstrapGlyphicons',
	iconOverrideCustomButtonOption: 'bootstrapGlyphicon',
	iconOverridePrefix: 'glyphicon-'
});
ThemeRegistry.register('bootstrap3', BootstrapTheme);
;;
var DayGridFillRenderer = FillRenderer.extend({
	fillSegTag: 'td', 
	attachSegEls: function(type, segs) {
		var nodes = [];
		var i, seg;
		var skeletonEl;
		for (i = 0; i < segs.length; i++) {
			seg = segs[i];
			skeletonEl = this.renderFillRow(type, seg);
			this.component.rowEls.eq(seg.row).append(skeletonEl);
			nodes.push(skeletonEl[0]);
		}
		return nodes;
	},
	renderFillRow: function(type, seg) {
		var colCnt = this.component.colCnt;
		var startCol = seg.leftCol;
		var endCol = seg.rightCol + 1;
		var className;
		var skeletonEl;
		var trEl;
		if (type === 'businessHours') {
			className = 'bgevent';
		}
		else {
			className = type.toLowerCase();
		}
		skeletonEl = $(
			'<div class="fc-' + className + '-skeleton">' +
				'<table><tr/></table>' +
			'</div>'
		);
		trEl = skeletonEl.find('tr');
		if (startCol > 0) {
			trEl.append('<td colspan="' + startCol + '"/>');
		}
		trEl.append(
			seg.el.attr('colspan', endCol - startCol)
		);
		if (endCol < colCnt) {
			trEl.append('<td colspan="' + (colCnt - endCol) + '"/>');
		}
		this.component.bookendCells(trEl);
		return skeletonEl;
	}
});
;;
var DayGridEventRenderer = EventRenderer.extend({
	dayGrid: null,
	rowStructs: null, 
	constructor: function(dayGrid) {
		EventRenderer.apply(this, arguments);
		this.dayGrid = dayGrid;
	},
	renderBgRanges: function(eventRanges) {
		eventRanges = $.grep(eventRanges, function(eventRange) {
			return eventRange.eventDef.isAllDay();
		});
		EventRenderer.prototype.renderBgRanges.call(this, eventRanges);
	},
	renderFgSegs: function(segs) {
		var rowStructs = this.rowStructs = this.renderSegRows(segs);
		this.dayGrid.rowEls.each(function(i, rowNode) {
			$(rowNode).find('.fc-content-skeleton > table').append(
				rowStructs[i].tbodyEl
			);
		});
	},
	unrenderFgSegs: function() {
		var rowStructs = this.rowStructs || [];
		var rowStruct;
		while ((rowStruct = rowStructs.pop())) {
			rowStruct.tbodyEl.remove();
		}
		this.rowStructs = null;
	},
	renderSegRows: function(segs) {
		var rowStructs = [];
		var segRows;
		var row;
		segRows = this.groupSegRows(segs); 
		for (row = 0; row < segRows.length; row++) {
			rowStructs.push(
				this.renderSegRow(row, segRows[row])
			);
		}
		return rowStructs;
	},
	renderSegRow: function(row, rowSegs) {
		var colCnt = this.dayGrid.colCnt;
		var segLevels = this.buildSegLevels(rowSegs); 
		var levelCnt = Math.max(1, segLevels.length); 
		var tbody = $('<tbody/>');
		var segMatrix = []; 
		var cellMatrix = []; 
		var loneCellMatrix = []; 
		var i, levelSegs;
		var col;
		var tr;
		var j, seg;
		var td;
		function emptyCellsUntil(endCol) {
			while (col < endCol) {
				td = (loneCellMatrix[i - 1] || [])[col];
				if (td) {
					td.attr(
						'rowspan',
						parseInt(td.attr('rowspan') || 1, 10) + 1
					);
				}
				else {
					td = $('<td/>');
					tr.append(td);
				}
				cellMatrix[i][col] = td;
				loneCellMatrix[i][col] = td;
				col++;
			}
		}
		for (i = 0; i < levelCnt; i++) { 
			levelSegs = segLevels[i];
			col = 0;
			tr = $('<tr/>');
			segMatrix.push([]);
			cellMatrix.push([]);
			loneCellMatrix.push([]);
			if (levelSegs) {
				for (j = 0; j < levelSegs.length; j++) { 
					seg = levelSegs[j];
					emptyCellsUntil(seg.leftCol);
					td = $('<td class="fc-event-container"/>').append(seg.el);
					if (seg.leftCol != seg.rightCol) {
						td.attr('colspan', seg.rightCol - seg.leftCol + 1);
					}
					else { 
						loneCellMatrix[i][col] = td;
					}
					while (col <= seg.rightCol) {
						cellMatrix[i][col] = td;
						segMatrix[i][col] = seg;
						col++;
					}
					tr.append(td);
				}
			}
			emptyCellsUntil(colCnt); 
			this.dayGrid.bookendCells(tr);
			tbody.append(tr);
		}
		return { 
			row: row, 
			tbodyEl: tbody,
			cellMatrix: cellMatrix,
			segMatrix: segMatrix,
			segLevels: segLevels,
			segs: rowSegs
		};
	},
	buildSegLevels: function(segs) {
		var levels = [];
		var i, seg;
		var j;
		this.sortEventSegs(segs);
		for (i = 0; i < segs.length; i++) {
			seg = segs[i];
			for (j = 0; j < levels.length; j++) {
				if (!isDaySegCollision(seg, levels[j])) {
					break;
				}
			}
			seg.level = j;
			(levels[j] || (levels[j] = [])).push(seg);
		}
		for (j = 0; j < levels.length; j++) {
			levels[j].sort(compareDaySegCols);
		}
		return levels;
	},
	groupSegRows: function(segs) {
		var segRows = [];
		var i;
		for (i = 0; i < this.dayGrid.rowCnt; i++) {
			segRows.push([]);
		}
		for (i = 0; i < segs.length; i++) {
			segRows[segs[i].row].push(segs[i]);
		}
		return segRows;
	},
	computeEventTimeFormat: function() {
		return this.opt('extraSmallTimeFormat'); 
	},
	computeDisplayEventEnd: function() {
		return this.dayGrid.colCnt === 1; 
	},
	fgSegHtml: function(seg, disableResizing) {
		var view = this.view;
		var eventDef = seg.footprint.eventDef;
		var isAllDay = seg.footprint.componentFootprint.isAllDay;
		var isDraggable = view.isEventDefDraggable(eventDef);
		var isResizableFromStart = !disableResizing && isAllDay &&
			seg.isStart && view.isEventDefResizableFromStart(eventDef);
		var isResizableFromEnd = !disableResizing && isAllDay &&
			seg.isEnd && view.isEventDefResizableFromEnd(eventDef);
		var classes = this.getSegClasses(seg, isDraggable, isResizableFromStart || isResizableFromEnd);
		var skinCss = cssToStr(this.getSkinCss(eventDef));
		var timeHtml = '';
		var timeText;
		var titleHtml;
		classes.unshift('fc-day-grid-event', 'fc-h-event');
		if (seg.isStart) {
			timeText = this.getTimeText(seg.footprint);
			if (timeText) {
				timeHtml = '<span class="fc-time">' + htmlEscape(timeText) + '</span>';
			}
		}
		titleHtml =
			'<span class="fc-title">' +
				(htmlEscape(eventDef.title || '') || '&nbsp;') + 
			'</span>';
		return '<a class="' + classes.join(' ') + '"' +
				(eventDef.url ?
					' href="' + htmlEscape(eventDef.url) + '"' :
					''
					) +
				(skinCss ?
					' style="' + skinCss + '"' :
					''
					) +
			'>' +
				'<div class="fc-content">' +
					(this.isRTL ?
						titleHtml + ' ' + timeHtml : 
						timeHtml + ' ' + titleHtml   
						) +
				'</div>' +
				(isResizableFromStart ?
					'<div class="fc-resizer fc-start-resizer" />' :
					''
					) +
				(isResizableFromEnd ?
					'<div class="fc-resizer fc-end-resizer" />' :
					''
					) +
			'</a>';
	}
});
function isDaySegCollision(seg, otherSegs) {
	var i, otherSeg;
	for (i = 0; i < otherSegs.length; i++) {
		otherSeg = otherSegs[i];
		if (
			otherSeg.leftCol <= seg.rightCol &&
			otherSeg.rightCol >= seg.leftCol
		) {
			return true;
		}
	}
	return false;
}
function compareDaySegCols(a, b) {
	return a.leftCol - b.leftCol;
}
;;
var DayGridHelperRenderer = HelperRenderer.extend({
	renderSegs: function(segs, sourceSeg) {
		var helperNodes = [];
		var rowStructs;
		rowStructs = this.eventRenderer.renderSegRows(segs);
		this.component.rowEls.each(function(row, rowNode) {
			var rowEl = $(rowNode); 
			var skeletonEl = $('<div class="fc-helper-skeleton"><table/></div>'); 
			var skeletonTopEl;
			var skeletonTop;
			if (sourceSeg && sourceSeg.row === row) {
				skeletonTop = sourceSeg.el.position().top;
			}
			else {
				skeletonTopEl = rowEl.find('.fc-content-skeleton tbody');
				if (!skeletonTopEl.length) { 
					skeletonTopEl = rowEl.find('.fc-content-skeleton table');
				}
				skeletonTop = skeletonTopEl.position().top;
			}
			skeletonEl.css('top', skeletonTop)
				.find('table')
					.append(rowStructs[row].tbodyEl);
			rowEl.append(skeletonEl);
			helperNodes.push(skeletonEl[0]);
		});
		return $(helperNodes); 
	}
});
;;
var DayGrid = FC.DayGrid = InteractiveDateComponent.extend(StandardInteractionsMixin, DayTableMixin, {
	eventRendererClass: DayGridEventRenderer,
	businessHourRendererClass: BusinessHourRenderer,
	helperRendererClass: DayGridHelperRenderer,
	fillRendererClass: DayGridFillRenderer,
	view: null, 
	helperRenderer: null,
	cellWeekNumbersVisible: false, 
	bottomCoordPadding: 0, 
	headContainerEl: null, 
	rowEls: null, 
	cellEls: null, 
	rowCoordCache: null,
	colCoordCache: null,
	isRigid: false,
	hasAllDayBusinessHours: true,
	constructor: function(view) {
		this.view = view; 
		InteractiveDateComponent.call(this);
	},
	componentFootprintToSegs: function(componentFootprint) {
		var segs = this.sliceRangeByRow(componentFootprint.unzonedRange);
		var i, seg;
		for (i = 0; i < segs.length; i++) {
			seg = segs[i];
			if (this.isRTL) {
				seg.leftCol = this.daysPerRow - 1 - seg.lastRowDayIndex;
				seg.rightCol = this.daysPerRow - 1 - seg.firstRowDayIndex;
			}
			else {
				seg.leftCol = seg.firstRowDayIndex;
				seg.rightCol = seg.lastRowDayIndex;
			}
		}
		return segs;
	},
	renderDates: function(dateProfile) {
		this.dateProfile = dateProfile;
		this.updateDayTable();
		this.renderGrid();
	},
	unrenderDates: function() {
		this.removeSegPopover();
	},
	renderGrid: function() {
		var view = this.view;
		var rowCnt = this.rowCnt;
		var colCnt = this.colCnt;
		var html = '';
		var row;
		var col;
		if (this.headContainerEl) {
			this.headContainerEl.html(this.renderHeadHtml());
		}
		for (row = 0; row < rowCnt; row++) {
			html += this.renderDayRowHtml(row, this.isRigid);
		}
		this.el.html(html);
		this.rowEls = this.el.find('.fc-row');
		this.cellEls = this.el.find('.fc-day, .fc-disabled-day');
		this.rowCoordCache = new CoordCache({
			els: this.rowEls,
			isVertical: true
		});
		this.colCoordCache = new CoordCache({
			els: this.cellEls.slice(0, this.colCnt), 
			isHorizontal: true
		});
		for (row = 0; row < rowCnt; row++) {
			for (col = 0; col < colCnt; col++) {
				this.publiclyTrigger('dayRender', {
					context: view,
					args: [
						this.getCellDate(row, col),
						this.getCellEl(row, col),
						view
					]
				});
			}
		}
	},
	renderDayRowHtml: function(row, isRigid) {
		var theme = this.view.calendar.theme;
		var classes = [ 'fc-row', 'fc-week', theme.getClass('dayRow') ];
		if (isRigid) {
			classes.push('fc-rigid');
		}
		return '' +
			'<div class="' + classes.join(' ') + '">' +
				'<div class="fc-bg">' +
					'<table class="' + theme.getClass('tableGrid') + '">' +
						this.renderBgTrHtml(row) +
					'</table>' +
				'</div>' +
				'<div class="fc-content-skeleton">' +
					'<table>' +
						(this.getIsNumbersVisible() ?
							'<thead>' +
								this.renderNumberTrHtml(row) +
							'</thead>' :
							''
							) +
					'</table>' +
				'</div>' +
			'</div>';
	},
	getIsNumbersVisible: function() {
		return this.getIsDayNumbersVisible() || this.cellWeekNumbersVisible;
	},
	getIsDayNumbersVisible: function() {
		return this.rowCnt > 1;
	},
	renderNumberTrHtml: function(row) {
		return '' +
			'<tr>' +
				(this.isRTL ? '' : this.renderNumberIntroHtml(row)) +
				this.renderNumberCellsHtml(row) +
				(this.isRTL ? this.renderNumberIntroHtml(row) : '') +
			'</tr>';
	},
	renderNumberIntroHtml: function(row) {
		return this.renderIntroHtml();
	},
	renderNumberCellsHtml: function(row) {
		var htmls = [];
		var col, date;
		for (col = 0; col < this.colCnt; col++) {
			date = this.getCellDate(row, col);
			htmls.push(this.renderNumberCellHtml(date));
		}
		return htmls.join('');
	},
	renderNumberCellHtml: function(date) {
		var view = this.view;
		var html = '';
		var isDateValid = this.dateProfile.activeUnzonedRange.containsDate(date); 
		var isDayNumberVisible = this.getIsDayNumbersVisible() && isDateValid;
		var classes;
		var weekCalcFirstDoW;
		if (!isDayNumberVisible && !this.cellWeekNumbersVisible) {
			return '<td/>'; 
		}
		classes = this.getDayClasses(date);
		classes.unshift('fc-day-top');
		if (this.cellWeekNumbersVisible) {
			if (date._locale._fullCalendar_weekCalc === 'ISO') {
				weekCalcFirstDoW = 1;  
			}
			else {
				weekCalcFirstDoW = date._locale.firstDayOfWeek();
			}
		}
		html += '<td class="' + classes.join(' ') + '"' +
			(isDateValid ?
				' data-date="' + date.format() + '"' :
				''
				) +
			'>';
		if (this.cellWeekNumbersVisible && (date.day() == weekCalcFirstDoW)) {
			html += view.buildGotoAnchorHtml(
				{ date: date, type: 'week' },
				{ 'class': 'fc-week-number' },
				date.format('w') 
			);
		}
		if (isDayNumberVisible) {
			html += view.buildGotoAnchorHtml(
				date,
				{ 'class': 'fc-day-number' },
				date.date() 
			);
		}
		html += '</td>';
		return html;
	},
	prepareHits: function() {
		this.colCoordCache.build();
		this.rowCoordCache.build();
		this.rowCoordCache.bottoms[this.rowCnt - 1] += this.bottomCoordPadding; 
	},
	releaseHits: function() {
		this.colCoordCache.clear();
		this.rowCoordCache.clear();
	},
	queryHit: function(leftOffset, topOffset) {
		if (this.colCoordCache.isLeftInBounds(leftOffset) && this.rowCoordCache.isTopInBounds(topOffset)) {
			var col = this.colCoordCache.getHorizontalIndex(leftOffset);
			var row = this.rowCoordCache.getVerticalIndex(topOffset);
			if (row != null && col != null) {
				return this.getCellHit(row, col);
			}
		}
	},
	getHitFootprint: function(hit) {
		var range = this.getCellRange(hit.row, hit.col);
		return new ComponentFootprint(
			new UnzonedRange(range.start, range.end),
			true 
		);
	},
	getHitEl: function(hit) {
		return this.getCellEl(hit.row, hit.col);
	},
	getCellHit: function(row, col) {
		return {
			row: row,
			col: col,
			component: this, 
			left: this.colCoordCache.getLeftOffset(col),
			right: this.colCoordCache.getRightOffset(col),
			top: this.rowCoordCache.getTopOffset(row),
			bottom: this.rowCoordCache.getBottomOffset(row)
		};
	},
	getCellEl: function(row, col) {
		return this.cellEls.eq(row * this.colCnt + col);
	},
	unrenderEvents: function() {
		this.removeSegPopover(); 
		InteractiveDateComponent.prototype.unrenderEvents.apply(this, arguments);
	},
	getOwnEventSegs: function() {
		return InteractiveDateComponent.prototype.getOwnEventSegs.apply(this, arguments) 
			.concat(this.popoverSegs || []); 
	},
	renderDrag: function(eventFootprints, seg, isTouch) {
		var i;
		for (i = 0; i < eventFootprints.length; i++) {
			this.renderHighlight(eventFootprints[i].componentFootprint);
		}
		if (eventFootprints.length && seg && seg.component !== this) {
			this.helperRenderer.renderEventDraggingFootprints(eventFootprints, seg, isTouch);
			return true; 
		}
	},
	unrenderDrag: function(seg) {
		this.unrenderHighlight();
		this.helperRenderer.unrender();
	},
	renderEventResize: function(eventFootprints, seg, isTouch) {
		var i;
		for (i = 0; i < eventFootprints.length; i++) {
			this.renderHighlight(eventFootprints[i].componentFootprint);
		}
		this.helperRenderer.renderEventResizingFootprints(eventFootprints, seg, isTouch);
	},
	unrenderEventResize: function(seg) {
		this.unrenderHighlight();
		this.helperRenderer.unrender();
	}
});
;;
DayGrid.mixin({
	segPopover: null, 
	popoverSegs: null, 
	removeSegPopover: function() {
		if (this.segPopover) {
			this.segPopover.hide(); 
		}
	},
	limitRows: function(levelLimit) {
		var rowStructs = this.eventRenderer.rowStructs || [];
		var row; 
		var rowLevelLimit;
		for (row = 0; row < rowStructs.length; row++) {
			this.unlimitRow(row);
			if (!levelLimit) {
				rowLevelLimit = false;
			}
			else if (typeof levelLimit === 'number') {
				rowLevelLimit = levelLimit;
			}
			else {
				rowLevelLimit = this.computeRowLevelLimit(row);
			}
			if (rowLevelLimit !== false) {
				this.limitRow(row, rowLevelLimit);
			}
		}
	},
	computeRowLevelLimit: function(row) {
		var rowEl = this.rowEls.eq(row); 
		var rowHeight = rowEl.height(); 
		var trEls = this.eventRenderer.rowStructs[row].tbodyEl.children();
		var i, trEl;
		var trHeight;
		function iterInnerHeights(i, childNode) {
			trHeight = Math.max(trHeight, $(childNode).outerHeight());
		}
		for (i = 0; i < trEls.length; i++) {
			trEl = trEls.eq(i).removeClass('fc-limited'); 
			trHeight = 0;
			trEl.find('> td > :first-child').each(iterInnerHeights);
			if (trEl.position().top + trHeight > rowHeight) {
				return i;
			}
		}
		return false; 
	},
	limitRow: function(row, levelLimit) {
		var _this = this;
		var rowStruct = this.eventRenderer.rowStructs[row];
		var moreNodes = []; 
		var col = 0; 
		var levelSegs; 
		var cellMatrix; 
		var limitedNodes; 
		var i, seg;
		var segsBelow; 
		var totalSegsBelow; 
		var colSegsBelow; 
		var td, rowspan;
		var segMoreNodes; 
		var j;
		var moreTd, moreWrap, moreLink;
		function emptyCellsUntil(endCol) { 
			while (col < endCol) {
				segsBelow = _this.getCellSegs(row, col, levelLimit);
				if (segsBelow.length) {
					td = cellMatrix[levelLimit - 1][col];
					moreLink = _this.renderMoreLink(row, col, segsBelow);
					moreWrap = $('<div/>').append(moreLink);
					td.append(moreWrap);
					moreNodes.push(moreWrap[0]);
				}
				col++;
			}
		}
		if (levelLimit && levelLimit < rowStruct.segLevels.length) { 
			levelSegs = rowStruct.segLevels[levelLimit - 1];
			cellMatrix = rowStruct.cellMatrix;
			limitedNodes = rowStruct.tbodyEl.children().slice(levelLimit) 
				.addClass('fc-limited').get(); 
			for (i = 0; i < levelSegs.length; i++) {
				seg = levelSegs[i];
				emptyCellsUntil(seg.leftCol); 
				colSegsBelow = [];
				totalSegsBelow = 0;
				while (col <= seg.rightCol) {
					segsBelow = this.getCellSegs(row, col, levelLimit);
					colSegsBelow.push(segsBelow);
					totalSegsBelow += segsBelow.length;
					col++;
				}
				if (totalSegsBelow) { 
					td = cellMatrix[levelLimit - 1][seg.leftCol]; 
					rowspan = td.attr('rowspan') || 1;
					segMoreNodes = [];
					for (j = 0; j < colSegsBelow.length; j++) {
						moreTd = $('<td class="fc-more-cell"/>').attr('rowspan', rowspan);
						segsBelow = colSegsBelow[j];
						moreLink = this.renderMoreLink(
							row,
							seg.leftCol + j,
							[ seg ].concat(segsBelow) 
						);
						moreWrap = $('<div/>').append(moreLink);
						moreTd.append(moreWrap);
						segMoreNodes.push(moreTd[0]);
						moreNodes.push(moreTd[0]);
					}
					td.addClass('fc-limited').after($(segMoreNodes)); 
					limitedNodes.push(td[0]);
				}
			}
			emptyCellsUntil(this.colCnt); 
			rowStruct.moreEls = $(moreNodes); 
			rowStruct.limitedEls = $(limitedNodes); 
		}
	},
	unlimitRow: function(row) {
		var rowStruct = this.eventRenderer.rowStructs[row];
		if (rowStruct.moreEls) {
			rowStruct.moreEls.remove();
			rowStruct.moreEls = null;
		}
		if (rowStruct.limitedEls) {
			rowStruct.limitedEls.removeClass('fc-limited');
			rowStruct.limitedEls = null;
		}
	},
	renderMoreLink: function(row, col, hiddenSegs) {
		var _this = this;
		var view = this.view;
		return $('<a class="fc-more"/>')
			.text(
				this.getMoreLinkText(hiddenSegs.length)
			)
			.on('click', function(ev) {
				var clickOption = _this.opt('eventLimitClick');
				var date = _this.getCellDate(row, col);
				var moreEl = $(this);
				var dayEl = _this.getCellEl(row, col);
				var allSegs = _this.getCellSegs(row, col);
				var reslicedAllSegs = _this.resliceDaySegs(allSegs, date);
				var reslicedHiddenSegs = _this.resliceDaySegs(hiddenSegs, date);
				if (typeof clickOption === 'function') {
					clickOption = _this.publiclyTrigger('eventLimitClick', {
						context: view,
						args: [
							{
								date: date.clone(),
								dayEl: dayEl,
								moreEl: moreEl,
								segs: reslicedAllSegs,
								hiddenSegs: reslicedHiddenSegs
							},
							ev,
							view
						]
					});
				}
				if (clickOption === 'popover') {
					_this.showSegPopover(row, col, moreEl, reslicedAllSegs);
				}
				else if (typeof clickOption === 'string') { 
					view.calendar.zoomTo(date, clickOption);
				}
			});
	},
	showSegPopover: function(row, col, moreLink, segs) {
		var _this = this;
		var view = this.view;
		var moreWrap = moreLink.parent(); 
		var topEl; 
		var options;
		if (this.rowCnt == 1) {
			topEl = view.el; 
		}
		else {
			topEl = this.rowEls.eq(row); 
		}
		options = {
			className: 'fc-more-popover ' + view.calendar.theme.getClass('popover'),
			content: this.renderSegPopoverContent(row, col, segs),
			parentEl: view.el, 
			top: topEl.offset().top,
			autoHide: true, 
			viewportConstrain: this.opt('popoverViewportConstrain'),
			hide: function() {
				if (_this.popoverSegs) {
					_this.triggerBeforeEventSegsDestroyed(_this.popoverSegs);
				}
				_this.segPopover.removeElement();
				_this.segPopover = null;
				_this.popoverSegs = null;
			}
		};
		if (this.isRTL) {
			options.right = moreWrap.offset().left + moreWrap.outerWidth() + 1; 
		}
		else {
			options.left = moreWrap.offset().left - 1; 
		}
		this.segPopover = new Popover(options);
		this.segPopover.show();
		this.bindAllSegHandlersToEl(this.segPopover.el);
		this.triggerAfterEventSegsRendered(segs);
	},
	renderSegPopoverContent: function(row, col, segs) {
		var view = this.view;
		var theme = view.calendar.theme;
		var title = this.getCellDate(row, col).format(this.opt('dayPopoverFormat'));
		var content = $(
			'<div class="fc-header ' + theme.getClass('popoverHeader') + '">' +
				'<span class="fc-close ' + theme.getIconClass('close') + '"></span>' +
				'<span class="fc-title">' +
					htmlEscape(title) +
				'</span>' +
				'<div class="fc-clear"/>' +
			'</div>' +
			'<div class="fc-body ' + theme.getClass('popoverContent') + '">' +
				'<div class="fc-event-container"></div>' +
			'</div>'
		);
		var segContainer = content.find('.fc-event-container');
		var i;
		segs = this.eventRenderer.renderFgSegEls(segs, true); 
		this.popoverSegs = segs;
		for (i = 0; i < segs.length; i++) {
			this.hitsNeeded();
			segs[i].hit = this.getCellHit(row, col);
			this.hitsNotNeeded();
			segContainer.append(segs[i].el);
		}
		return content;
	},
	resliceDaySegs: function(segs, dayDate) {
		var dayStart = dayDate.clone();
		var dayEnd = dayStart.clone().add(1, 'days');
		var dayRange = new UnzonedRange(dayStart, dayEnd);
		var newSegs = [];
		var i, seg;
		var slicedRange;
		for (i = 0; i < segs.length; i++) {
			seg = segs[i];
			slicedRange = seg.footprint.componentFootprint.unzonedRange.intersect(dayRange);
			if (slicedRange) {
				newSegs.push(
					$.extend({}, seg, {
						footprint: new EventFootprint(
							new ComponentFootprint(
								slicedRange,
								seg.footprint.componentFootprint.isAllDay
							),
							seg.footprint.eventDef,
							seg.footprint.eventInstance
						),
						isStart: seg.isStart && slicedRange.isStart,
						isEnd: seg.isEnd && slicedRange.isEnd
					})
				);
			}
		}
		this.eventRenderer.sortEventSegs(newSegs);
		return newSegs;
	},
	getMoreLinkText: function(num) {
		var opt = this.opt('eventLimitText');
		if (typeof opt === 'function') {
			return opt(num);
		}
		else {
			return '+' + num + ' ' + opt;
		}
	},
	getCellSegs: function(row, col, startLevel) {
		var segMatrix = this.eventRenderer.rowStructs[row].segMatrix;
		var level = startLevel || 0;
		var segs = [];
		var seg;
		while (level < segMatrix.length) {
			seg = segMatrix[level][col];
			if (seg) {
				segs.push(seg);
			}
			level++;
		}
		return segs;
	}
});
;;
var BasicView = FC.BasicView = View.extend({
	scroller: null,
	dayGridClass: DayGrid, 
	dayGrid: null, 
	weekNumberWidth: null, 
	constructor: function() {
		View.apply(this, arguments);
		this.dayGrid = this.instantiateDayGrid();
		this.dayGrid.isRigid = this.hasRigidRows();
		if (this.opt('weekNumbers')) {
			if (this.opt('weekNumbersWithinDays')) {
				this.dayGrid.cellWeekNumbersVisible = true;
				this.dayGrid.colWeekNumbersVisible = false;
			}
			else {
				this.dayGrid.cellWeekNumbersVisible = false;
				this.dayGrid.colWeekNumbersVisible = true;
			};
		}
		this.addChild(this.dayGrid);
		this.scroller = new Scroller({
			overflowX: 'hidden',
			overflowY: 'auto'
		});
	},
	instantiateDayGrid: function() {
		var subclass = this.dayGridClass.extend(basicDayGridMethods);
		return new subclass(this);
	},
	buildRenderRange: function(currentUnzonedRange, currentRangeUnit, isRangeAllDay) {
		var renderUnzonedRange = View.prototype.buildRenderRange.apply(this, arguments); 
		var start = this.calendar.msToUtcMoment(renderUnzonedRange.startMs, isRangeAllDay);
		var end = this.calendar.msToUtcMoment(renderUnzonedRange.endMs, isRangeAllDay);
		if (/^(year|month)$/.test(currentRangeUnit)) {
			start.startOf('week');
			if (end.weekday()) {
				end.add(1, 'week').startOf('week'); 
			}
		}
		return new UnzonedRange(start, end);
	},
	executeDateRender: function(dateProfile) {
		this.dayGrid.breakOnWeeks = /year|month|week/.test(dateProfile.currentRangeUnit);
		View.prototype.executeDateRender.apply(this, arguments);
	},
	renderSkeleton: function() {
		var dayGridContainerEl;
		var dayGridEl;
		this.el.addClass('fc-basic-view').html(this.renderSkeletonHtml());
		this.scroller.render();
		dayGridContainerEl = this.scroller.el.addClass('fc-day-grid-container');
		dayGridEl = $('<div class="fc-day-grid" />').appendTo(dayGridContainerEl);
		this.el.find('.fc-body > tr > td').append(dayGridContainerEl);
		this.dayGrid.headContainerEl = this.el.find('.fc-head-container');
		this.dayGrid.setElement(dayGridEl);
	},
	unrenderSkeleton: function() {
		this.dayGrid.removeElement();
		this.scroller.destroy();
	},
	renderSkeletonHtml: function() {
		var theme = this.calendar.theme;
		return '' +
			'<table class="' + theme.getClass('tableGrid') + '">' +
				(this.opt('columnHeader') ?
					'<thead class="fc-head">' +
						'<tr>' +
							'<td class="fc-head-container ' + theme.getClass('widgetHeader') + '">&nbsp;</td>' +
						'</tr>' +
					'</thead>' :
					''
					) +
				'<tbody class="fc-body">' +
					'<tr>' +
						'<td class="' + theme.getClass('widgetContent') + '"></td>' +
					'</tr>' +
				'</tbody>' +
			'</table>';
	},
	weekNumberStyleAttr: function() {
		if (this.weekNumberWidth !== null) {
			return 'style="width:' + this.weekNumberWidth + 'px"';
		}
		return '';
	},
	hasRigidRows: function() {
		var eventLimit = this.opt('eventLimit');
		return eventLimit && typeof eventLimit !== 'number';
	},
	updateSize: function(totalHeight, isAuto, isResize) {
		var eventLimit = this.opt('eventLimit');
		var headRowEl = this.dayGrid.headContainerEl.find('.fc-row');
		var scrollerHeight;
		var scrollbarWidths;
		if (!this.dayGrid.rowEls) {
			if (!isAuto) {
				scrollerHeight = this.computeScrollerHeight(totalHeight);
				this.scroller.setHeight(scrollerHeight);
			}
			return;
		}
		View.prototype.updateSize.apply(this, arguments);
		if (this.dayGrid.colWeekNumbersVisible) {
			this.weekNumberWidth = matchCellWidths(
				this.el.find('.fc-week-number')
			);
		}
		this.scroller.clear();
		uncompensateScroll(headRowEl);
		this.dayGrid.removeSegPopover(); 
		if (eventLimit && typeof eventLimit === 'number') {
			this.dayGrid.limitRows(eventLimit); 
		}
		scrollerHeight = this.computeScrollerHeight(totalHeight);
		this.setGridHeight(scrollerHeight, isAuto);
		if (eventLimit && typeof eventLimit !== 'number') {
			this.dayGrid.limitRows(eventLimit); 
		}
		if (!isAuto) { 
			this.scroller.setHeight(scrollerHeight);
			scrollbarWidths = this.scroller.getScrollbarWidths();
			if (scrollbarWidths.left || scrollbarWidths.right) { 
				compensateScroll(headRowEl, scrollbarWidths);
				scrollerHeight = this.computeScrollerHeight(totalHeight);
				this.scroller.setHeight(scrollerHeight);
			}
			this.scroller.lockOverflow(scrollbarWidths);
		}
	},
	computeScrollerHeight: function(totalHeight) {
		return totalHeight -
			subtractInnerElHeight(this.el, this.scroller.el); 
	},
	setGridHeight: function(height, isAuto) {
		if (isAuto) {
			undistributeHeight(this.dayGrid.rowEls); 
		}
		else {
			distributeHeight(this.dayGrid.rowEls, height, true); 
		}
	},
	computeInitialDateScroll: function() {
		return { top: 0 };
	},
	queryDateScroll: function() {
		return { top: this.scroller.getScrollTop() };
	},
	applyDateScroll: function(scroll) {
		if (scroll.top !== undefined) {
			this.scroller.setScrollTop(scroll.top);
		}
	}
});
var basicDayGridMethods = { 
	colWeekNumbersVisible: false, 
	renderHeadIntroHtml: function() {
		var view = this.view;
		if (this.colWeekNumbersVisible) {
			return '' +
				'<th class="fc-week-number ' + view.calendar.theme.getClass('widgetHeader') + '" ' + view.weekNumberStyleAttr() + '>' +
					'<span>' + 
						htmlEscape(this.opt('weekNumberTitle')) +
					'</span>' +
				'</th>';
		}
		return '';
	},
	renderNumberIntroHtml: function(row) {
		var view = this.view;
		var weekStart = this.getCellDate(row, 0);
		if (this.colWeekNumbersVisible) {
			return '' +
				'<td class="fc-week-number" ' + view.weekNumberStyleAttr() + '>' +
					view.buildGotoAnchorHtml( 
						{ date: weekStart, type: 'week', forceOff: this.colCnt === 1 },
						weekStart.format('w') 
					) +
				'</td>';
		}
		return '';
	},
	renderBgIntroHtml: function() {
		var view = this.view;
		if (this.colWeekNumbersVisible) {
			return '<td class="fc-week-number ' + view.calendar.theme.getClass('widgetContent') + '" ' +
				view.weekNumberStyleAttr() + '></td>';
		}
		return '';
	},
	renderIntroHtml: function() {
		var view = this.view;
		if (this.colWeekNumbersVisible) {
			return '<td class="fc-week-number" ' + view.weekNumberStyleAttr() + '></td>';
		}
		return '';
	},
	getIsNumbersVisible: function() {
		return DayGrid.prototype.getIsNumbersVisible.apply(this, arguments) || this.colWeekNumbersVisible;
	}
};
;;
var MonthView = FC.MonthView = BasicView.extend({
	buildRenderRange: function(currentUnzonedRange, currentRangeUnit, isRangeAllDay) {
		var renderUnzonedRange = BasicView.prototype.buildRenderRange.apply(this, arguments);
		var start = this.calendar.msToUtcMoment(renderUnzonedRange.startMs, isRangeAllDay);
		var end = this.calendar.msToUtcMoment(renderUnzonedRange.endMs, isRangeAllDay);
		var rowCnt;
		if (this.isFixedWeeks()) {
			rowCnt = Math.ceil( 
				end.diff(start, 'weeks', true) 
			);
			end.add(6 - rowCnt, 'weeks');
		}
		return new UnzonedRange(start, end);
	},
	setGridHeight: function(height, isAuto) {
		if (isAuto) {
			height *= this.rowCnt / 6;
		}
		distributeHeight(this.dayGrid.rowEls, height, !isAuto); 
	},
	isFixedWeeks: function() {
		return this.opt('fixedWeekCount');
	},
	isDateInOtherMonth: function(date, dateProfile) {
		return date.month() !== moment.utc(dateProfile.currentUnzonedRange.startMs).month(); 
	}
});
;;
fcViews.basic = {
	'class': BasicView
};
fcViews.basicDay = {
	type: 'basic',
	duration: { days: 1 }
};
fcViews.basicWeek = {
	type: 'basic',
	duration: { weeks: 1 }
};
fcViews.month = {
	'class': MonthView,
	duration: { months: 1 }, 
	defaults: {
		fixedWeekCount: true
	}
};
;;
var TimeGridFillRenderer = FillRenderer.extend({
	attachSegEls: function(type, segs) {
		var timeGrid = this.component;
		var containerEls;
		if (type === 'bgEvent') {
			containerEls = timeGrid.bgContainerEls;
		}
		else if (type === 'businessHours') {
			containerEls = timeGrid.businessContainerEls;
		}
		else if (type === 'highlight') {
			containerEls = timeGrid.highlightContainerEls;
		}
		timeGrid.updateSegVerticals(segs);
		timeGrid.attachSegsByCol(timeGrid.groupSegsByCol(segs), containerEls);
		return segs.map(function(seg) {
			return seg.el[0];
		});
	}
});
;;
var TimeGridEventRenderer = EventRenderer.extend({
	timeGrid: null,
	constructor: function(timeGrid) {
		EventRenderer.apply(this, arguments);
		this.timeGrid = timeGrid;
	},
	renderFgSegs: function(segs) {
		this.renderFgSegsIntoContainers(segs, this.timeGrid.fgContainerEls);
	},
	renderFgSegsIntoContainers: function(segs, containerEls) {
		var segsByCol;
		var col;
		segsByCol = this.timeGrid.groupSegsByCol(segs);
		for (col = 0; col < this.timeGrid.colCnt; col++) {
			this.updateFgSegCoords(segsByCol[col]);
		}
		this.timeGrid.attachSegsByCol(segsByCol, containerEls);
	},
	unrenderFgSegs: function() {
		if (this.fgSegs) { 
			this.fgSegs.forEach(function(seg) {
				seg.el.remove();
			});
		}
	},
	computeEventTimeFormat: function() {
		return this.opt('noMeridiemTimeFormat'); 
	},
	computeDisplayEventEnd: function() {
		return true;
	},
	fgSegHtml: function(seg, disableResizing) {
		var view = this.view;
		var calendar = view.calendar;
		var componentFootprint = seg.footprint.componentFootprint;
		var isAllDay = componentFootprint.isAllDay;
		var eventDef = seg.footprint.eventDef;
		var isDraggable = view.isEventDefDraggable(eventDef);
		var isResizableFromStart = !disableResizing && seg.isStart && view.isEventDefResizableFromStart(eventDef);
		var isResizableFromEnd = !disableResizing && seg.isEnd && view.isEventDefResizableFromEnd(eventDef);
		var classes = this.getSegClasses(seg, isDraggable, isResizableFromStart || isResizableFromEnd);
		var skinCss = cssToStr(this.getSkinCss(eventDef));
		var timeText;
		var fullTimeText; 
		var startTimeText; 
		classes.unshift('fc-time-grid-event', 'fc-v-event');
		if (view.isMultiDayRange(componentFootprint.unzonedRange)) {
			if (seg.isStart || seg.isEnd) {
				var zonedStart = calendar.msToMoment(seg.startMs);
				var zonedEnd = calendar.msToMoment(seg.endMs);
				timeText = this._getTimeText(zonedStart, zonedEnd, isAllDay);
				fullTimeText = this._getTimeText(zonedStart, zonedEnd, isAllDay, 'LT');
				startTimeText = this._getTimeText(zonedStart, zonedEnd, isAllDay, null, false); 
			}
		}
		else {
			timeText = this.getTimeText(seg.footprint);
			fullTimeText = this.getTimeText(seg.footprint, 'LT');
			startTimeText = this.getTimeText(seg.footprint, null, false); 
		}
		return '<a class="' + classes.join(' ') + '"' +
			(eventDef.url ?
				' href="' + htmlEscape(eventDef.url) + '"' :
				''
				) +
			(skinCss ?
				' style="' + skinCss + '"' :
				''
				) +
			'>' +
				'<div class="fc-content">' +
					(timeText ?
						'<div class="fc-time"' +
						' data-start="' + htmlEscape(startTimeText) + '"' +
						' data-full="' + htmlEscape(fullTimeText) + '"' +
						'>' +
							'<span>' + htmlEscape(timeText) + '</span>' +
						'</div>' :
						''
						) +
					(eventDef.title ?
						'<div class="fc-title">' +
							htmlEscape(eventDef.title) +
						'</div>' :
						''
						) +
				'</div>' +
				'<div class="fc-bg"/>' +
				(isResizableFromEnd ?
					'<div class="fc-resizer fc-end-resizer" />' :
					''
					) +
			'</a>';
	},
	updateFgSegCoords: function(segs) {
		this.timeGrid.computeSegVerticals(segs); 
		this.computeFgSegHorizontals(segs); 
		this.timeGrid.assignSegVerticals(segs);
		this.assignFgSegHorizontals(segs);
	},
	computeFgSegHorizontals: function(segs) {
		var levels;
		var level0;
		var i;
		this.sortEventSegs(segs); 
		levels = buildSlotSegLevels(segs);
		computeForwardSlotSegs(levels);
		if ((level0 = levels[0])) {
			for (i = 0; i < level0.length; i++) {
				computeSlotSegPressures(level0[i]);
			}
			for (i = 0; i < level0.length; i++) {
				this.computeFgSegForwardBack(level0[i], 0, 0);
			}
		}
	},
	computeFgSegForwardBack: function(seg, seriesBackwardPressure, seriesBackwardCoord) {
		var forwardSegs = seg.forwardSegs;
		var i;
		if (seg.forwardCoord === undefined) { 
			if (!forwardSegs.length) {
				seg.forwardCoord = 1;
			}
			else {
				this.sortForwardSegs(forwardSegs);
				this.computeFgSegForwardBack(forwardSegs[0], seriesBackwardPressure + 1, seriesBackwardCoord);
				seg.forwardCoord = forwardSegs[0].backwardCoord;
			}
			seg.backwardCoord = seg.forwardCoord -
				(seg.forwardCoord - seriesBackwardCoord) / 
				(seriesBackwardPressure + 1); 
			for (i=0; i<forwardSegs.length; i++) {
				this.computeFgSegForwardBack(forwardSegs[i], 0, seg.forwardCoord);
			}
		}
	},
	sortForwardSegs: function(forwardSegs) {
		forwardSegs.sort(proxy(this, 'compareForwardSegs'));
	},
	compareForwardSegs: function(seg1, seg2) {
		return seg2.forwardPressure - seg1.forwardPressure ||
			(seg1.backwardCoord || 0) - (seg2.backwardCoord || 0) ||
			this.compareEventSegs(seg1, seg2);
	},
	assignFgSegHorizontals: function(segs) {
		var i, seg;
		for (i = 0; i < segs.length; i++) {
			seg = segs[i];
			seg.el.css(this.generateFgSegHorizontalCss(seg));
			if (seg.bottom - seg.top < 30) {
				seg.el.addClass('fc-short');
			}
		}
	},
	generateFgSegHorizontalCss: function(seg) {
		var shouldOverlap = this.opt('slotEventOverlap');
		var backwardCoord = seg.backwardCoord; 
		var forwardCoord = seg.forwardCoord; 
		var props = this.timeGrid.generateSegVerticalCss(seg); 
		var left; 
		var right; 
		if (shouldOverlap) {
			forwardCoord = Math.min(1, backwardCoord + (forwardCoord - backwardCoord) * 2);
		}
		if (this.timeGrid.isRTL) {
			left = 1 - forwardCoord;
			right = backwardCoord;
		}
		else {
			left = backwardCoord;
			right = 1 - forwardCoord;
		}
		props.zIndex = seg.level + 1; 
		props.left = left * 100 + '%';
		props.right = right * 100 + '%';
		if (shouldOverlap && seg.forwardPressure) {
			props[this.isRTL ? 'marginLeft' : 'marginRight'] = 10 * 2; 
		}
		return props;
	}
});
function buildSlotSegLevels(segs) {
	var levels = [];
	var i, seg;
	var j;
	for (i=0; i<segs.length; i++) {
		seg = segs[i];
		for (j=0; j<levels.length; j++) {
			if (!computeSlotSegCollisions(seg, levels[j]).length) {
				break;
			}
		}
		seg.level = j;
		(levels[j] || (levels[j] = [])).push(seg);
	}
	return levels;
}
function computeForwardSlotSegs(levels) {
	var i, level;
	var j, seg;
	var k;
	for (i=0; i<levels.length; i++) {
		level = levels[i];
		for (j=0; j<level.length; j++) {
			seg = level[j];
			seg.forwardSegs = [];
			for (k=i+1; k<levels.length; k++) {
				computeSlotSegCollisions(seg, levels[k], seg.forwardSegs);
			}
		}
	}
}
function computeSlotSegPressures(seg) {
	var forwardSegs = seg.forwardSegs;
	var forwardPressure = 0;
	var i, forwardSeg;
	if (seg.forwardPressure === undefined) { 
		for (i=0; i<forwardSegs.length; i++) {
			forwardSeg = forwardSegs[i];
			computeSlotSegPressures(forwardSeg);
			forwardPressure = Math.max(
				forwardPressure,
				1 + forwardSeg.forwardPressure
			);
		}
		seg.forwardPressure = forwardPressure;
	}
}
function computeSlotSegCollisions(seg, otherSegs, results) {
	results = results || [];
	for (var i=0; i<otherSegs.length; i++) {
		if (isSlotSegCollision(seg, otherSegs[i])) {
			results.push(otherSegs[i]);
		}
	}
	return results;
}
function isSlotSegCollision(seg1, seg2) {
	return seg1.bottom > seg2.top && seg1.top < seg2.bottom;
}
;;
var TimeGridHelperRenderer = HelperRenderer.extend({
	renderSegs: function(segs, sourceSeg) {
		var helperNodes = [];
		var i, seg;
		var sourceEl;
		this.eventRenderer.renderFgSegsIntoContainers(
			segs,
			this.component.helperContainerEls
		);
		for (i = 0; i < segs.length; i++) {
			seg = segs[i];
			if (sourceSeg && sourceSeg.col === seg.col) {
				sourceEl = sourceSeg.el;
				seg.el.css({
					left: sourceEl.css('left'),
					right: sourceEl.css('right'),
					'margin-left': sourceEl.css('margin-left'),
					'margin-right': sourceEl.css('margin-right')
				});
			}
			helperNodes.push(seg.el[0]);
		}
		return $(helperNodes); 
	}
});
;;
var TimeGrid = FC.TimeGrid = InteractiveDateComponent.extend(StandardInteractionsMixin, DayTableMixin, {
	eventRendererClass: TimeGridEventRenderer,
	businessHourRendererClass: BusinessHourRenderer,
	helperRendererClass: TimeGridHelperRenderer,
	fillRendererClass: TimeGridFillRenderer,
	view: null, 
	helperRenderer: null,
	dayRanges: null, 
	slotDuration: null, 
	snapDuration: null, 
	snapsPerSlot: null,
	labelFormat: null, 
	labelInterval: null, 
	headContainerEl: null, 
	colEls: null, 
	slatContainerEl: null, 
	slatEls: null, 
	nowIndicatorEls: null,
	colCoordCache: null,
	slatCoordCache: null,
	bottomRuleEl: null, 
	contentSkeletonEl: null,
	colContainerEls: null, 
	fgContainerEls: null,
	bgContainerEls: null,
	helperContainerEls: null,
	highlightContainerEls: null,
	businessContainerEls: null,
	helperSegs: null,
	highlightSegs: null,
	businessSegs: null,
	constructor: function(view) {
		this.view = view; 
		InteractiveDateComponent.call(this); 
		this.processOptions();
	},
	componentFootprintToSegs: function(componentFootprint) {
		var segs = this.sliceRangeByTimes(componentFootprint.unzonedRange);
		var i;
		for (i = 0; i < segs.length; i++) {
			if (this.isRTL) {
				segs[i].col = this.daysPerRow - 1 - segs[i].dayIndex;
			}
			else {
				segs[i].col = segs[i].dayIndex;
			}
		}
		return segs;
	},
	sliceRangeByTimes: function(unzonedRange) {
		var segs = [];
		var segRange;
		var dayIndex;
		for (dayIndex = 0; dayIndex < this.daysPerRow; dayIndex++) {
			segRange = unzonedRange.intersect(this.dayRanges[dayIndex]);
			if (segRange) {
				segs.push({
					startMs: segRange.startMs,
					endMs: segRange.endMs,
					isStart: segRange.isStart,
					isEnd: segRange.isEnd,
					dayIndex: dayIndex
				});
			}
		}
		return segs;
	},
	processOptions: function() {
		var slotDuration = this.opt('slotDuration');
		var snapDuration = this.opt('snapDuration');
		var input;
		slotDuration = moment.duration(slotDuration);
		snapDuration = snapDuration ? moment.duration(snapDuration) : slotDuration;
		this.slotDuration = slotDuration;
		this.snapDuration = snapDuration;
		this.snapsPerSlot = slotDuration / snapDuration; 
		input = this.opt('slotLabelFormat');
		if ($.isArray(input)) {
			input = input[input.length - 1];
		}
		this.labelFormat = input ||
			this.opt('smallTimeFormat'); 
		input = this.opt('slotLabelInterval');
		this.labelInterval = input ?
			moment.duration(input) :
			this.computeLabelInterval(slotDuration);
	},
	computeLabelInterval: function(slotDuration) {
		var i;
		var labelInterval;
		var slotsPerLabel;
		for (i = AGENDA_STOCK_SUB_DURATIONS.length - 1; i >= 0; i--) {
			labelInterval = moment.duration(AGENDA_STOCK_SUB_DURATIONS[i]);
			slotsPerLabel = divideDurationByDuration(labelInterval, slotDuration);
			if (isInt(slotsPerLabel) && slotsPerLabel > 1) {
				return labelInterval;
			}
		}
		return moment.duration(slotDuration); 
	},
	renderDates: function(dateProfile) {
		this.dateProfile = dateProfile;
		this.updateDayTable();
		this.renderSlats();
		this.renderColumns();
	},
	unrenderDates: function() {
		this.unrenderColumns();
	},
	renderSkeleton: function() {
		var theme = this.view.calendar.theme;
		this.el.html(
			'<div class="fc-bg"></div>' +
			'<div class="fc-slats"></div>' +
			'<hr class="fc-divider ' + theme.getClass('widgetHeader') + '" style="display:none" />'
		);
		this.bottomRuleEl = this.el.find('hr');
	},
	renderSlats: function() {
		var theme = this.view.calendar.theme;
		this.slatContainerEl = this.el.find('> .fc-slats')
			.html( 
				'<table class="' + theme.getClass('tableGrid') + '">' +
					this.renderSlatRowHtml() +
				'</table>'
			);
		this.slatEls = this.slatContainerEl.find('tr');
		this.slatCoordCache = new CoordCache({
			els: this.slatEls,
			isVertical: true
		});
	},
	renderSlatRowHtml: function() {
		var view = this.view;
		var calendar = view.calendar;
		var theme = calendar.theme;
		var isRTL = this.isRTL;
		var dateProfile = this.dateProfile;
		var html = '';
		var slotTime = moment.duration(+dateProfile.minTime); 
		var slotIterator = moment.duration(0);
		var slotDate; 
		var isLabeled;
		var axisHtml;
		while (slotTime < dateProfile.maxTime) {
			slotDate = calendar.msToUtcMoment(dateProfile.renderUnzonedRange.startMs).time(slotTime);
			isLabeled = isInt(divideDurationByDuration(slotIterator, this.labelInterval));
			axisHtml =
				'<td class="fc-axis fc-time ' + theme.getClass('widgetContent') + '" ' + view.axisStyleAttr() + '>' +
					(isLabeled ?
						'<span>' + 
							htmlEscape(slotDate.format(this.labelFormat)) +
						'</span>' :
						''
						) +
				'</td>';
			html +=
				'<tr data-time="' + slotDate.format('HH:mm:ss') + '"' +
					(isLabeled ? '' : ' class="fc-minor"') +
					'>' +
					(!isRTL ? axisHtml : '') +
					'<td class="' + theme.getClass('widgetContent') + '"/>' +
					(isRTL ? axisHtml : '') +
				"</tr>";
			slotTime.add(this.slotDuration);
			slotIterator.add(this.slotDuration);
		}
		return html;
	},
	renderColumns: function() {
		var dateProfile = this.dateProfile;
		var theme = this.view.calendar.theme;
		this.dayRanges = this.dayDates.map(function(dayDate) {
			return new UnzonedRange(
				dayDate.clone().add(dateProfile.minTime),
				dayDate.clone().add(dateProfile.maxTime)
			);
		});
		if (this.headContainerEl) {
			this.headContainerEl.html(this.renderHeadHtml());
		}
		this.el.find('> .fc-bg').html(
			'<table class="' + theme.getClass('tableGrid') + '">' +
				this.renderBgTrHtml(0) + 
			'</table>'
		);
		this.colEls = this.el.find('.fc-day, .fc-disabled-day');
		this.colCoordCache = new CoordCache({
			els: this.colEls,
			isHorizontal: true
		});
		this.renderContentSkeleton();
	},
	unrenderColumns: function() {
		this.unrenderContentSkeleton();
	},
	renderContentSkeleton: function() {
		var cellHtml = '';
		var i;
		var skeletonEl;
		for (i = 0; i < this.colCnt; i++) {
			cellHtml +=
				'<td>' +
					'<div class="fc-content-col">' +
						'<div class="fc-event-container fc-helper-container"></div>' +
						'<div class="fc-event-container"></div>' +
						'<div class="fc-highlight-container"></div>' +
						'<div class="fc-bgevent-container"></div>' +
						'<div class="fc-business-container"></div>' +
					'</div>' +
				'</td>';
		}
		skeletonEl = this.contentSkeletonEl = $(
			'<div class="fc-content-skeleton">' +
				'<table>' +
					'<tr>' + cellHtml + '</tr>' +
				'</table>' +
			'</div>'
		);
		this.colContainerEls = skeletonEl.find('.fc-content-col');
		this.helperContainerEls = skeletonEl.find('.fc-helper-container');
		this.fgContainerEls = skeletonEl.find('.fc-event-container:not(.fc-helper-container)');
		this.bgContainerEls = skeletonEl.find('.fc-bgevent-container');
		this.highlightContainerEls = skeletonEl.find('.fc-highlight-container');
		this.businessContainerEls = skeletonEl.find('.fc-business-container');
		this.bookendCells(skeletonEl.find('tr')); 
		this.el.append(skeletonEl);
	},
	unrenderContentSkeleton: function() {
		this.contentSkeletonEl.remove();
		this.contentSkeletonEl = null;
		this.colContainerEls = null;
		this.helperContainerEls = null;
		this.fgContainerEls = null;
		this.bgContainerEls = null;
		this.highlightContainerEls = null;
		this.businessContainerEls = null;
	},
	groupSegsByCol: function(segs) {
		var segsByCol = [];
		var i;
		for (i = 0; i < this.colCnt; i++) {
			segsByCol.push([]);
		}
		for (i = 0; i < segs.length; i++) {
			segsByCol[segs[i].col].push(segs[i]);
		}
		return segsByCol;
	},
	attachSegsByCol: function(segsByCol, containerEls) {
		var col;
		var segs;
		var i;
		for (col = 0; col < this.colCnt; col++) { 
			segs = segsByCol[col];
			for (i = 0; i < segs.length; i++) {
				containerEls.eq(col).append(segs[i].el);
			}
		}
	},
	getNowIndicatorUnit: function() {
		return 'minute'; 
	},
	renderNowIndicator: function(date) {
		var segs = this.componentFootprintToSegs(
			new ComponentFootprint(
				new UnzonedRange(date, date.valueOf() + 1), 
				false 
			)
		);
		var top = this.computeDateTop(date, date);
		var nodes = [];
		var i;
		for (i = 0; i < segs.length; i++) {
			nodes.push($('<div class="fc-now-indicator fc-now-indicator-line"></div>')
				.css('top', top)
				.appendTo(this.colContainerEls.eq(segs[i].col))[0]);
		}
		if (segs.length > 0) { 
			nodes.push($('<div class="fc-now-indicator fc-now-indicator-arrow"></div>')
				.css('top', top)
				.appendTo(this.el.find('.fc-content-skeleton'))[0]);
		}
		this.nowIndicatorEls = $(nodes);
	},
	unrenderNowIndicator: function() {
		if (this.nowIndicatorEls) {
			this.nowIndicatorEls.remove();
			this.nowIndicatorEls = null;
		}
	},
	updateSize: function(totalHeight, isAuto, isResize) {
		InteractiveDateComponent.prototype.updateSize.apply(this, arguments);
		this.slatCoordCache.build();
		if (isResize) {
			this.updateSegVerticals(
				[].concat(this.eventRenderer.getSegs(), this.businessSegs || [])
			);
		}
	},
	getTotalSlatHeight: function() {
		return this.slatContainerEl.outerHeight();
	},
	computeDateTop: function(ms, startOfDayDate) {
		return this.computeTimeTop(
			moment.duration(
				ms - startOfDayDate.clone().stripTime()
			)
		);
	},
	computeTimeTop: function(time) {
		var len = this.slatEls.length;
		var dateProfile = this.dateProfile;
		var slatCoverage = (time - dateProfile.minTime) / this.slotDuration; 
		var slatIndex;
		var slatRemainder;
		slatCoverage = Math.max(0, slatCoverage);
		slatCoverage = Math.min(len, slatCoverage);
		slatIndex = Math.floor(slatCoverage);
		slatIndex = Math.min(slatIndex, len - 1);
		slatRemainder = slatCoverage - slatIndex;
		return this.slatCoordCache.getTopPosition(slatIndex) +
			this.slatCoordCache.getHeight(slatIndex) * slatRemainder;
	},
	updateSegVerticals: function(segs) {
		this.computeSegVerticals(segs);
		this.assignSegVerticals(segs);
	},
	computeSegVerticals: function(segs) {
		var eventMinHeight = this.opt('agendaEventMinHeight');
		var i, seg;
		var dayDate;
		for (i = 0; i < segs.length; i++) {
			seg = segs[i];
			dayDate = this.dayDates[seg.dayIndex];
			seg.top = this.computeDateTop(seg.startMs, dayDate);
			seg.bottom = Math.max(
				seg.top + eventMinHeight,
				this.computeDateTop(seg.endMs, dayDate)
			);
		}
	},
	assignSegVerticals: function(segs) {
		var i, seg;
		for (i = 0; i < segs.length; i++) {
			seg = segs[i];
			seg.el.css(this.generateSegVerticalCss(seg));
		}
	},
	generateSegVerticalCss: function(seg) {
		return {
			top: seg.top,
			bottom: -seg.bottom 
		};
	},
	prepareHits: function() {
		this.colCoordCache.build();
		this.slatCoordCache.build();
	},
	releaseHits: function() {
		this.colCoordCache.clear();
	},
	queryHit: function(leftOffset, topOffset) {
		var snapsPerSlot = this.snapsPerSlot;
		var colCoordCache = this.colCoordCache;
		var slatCoordCache = this.slatCoordCache;
		if (colCoordCache.isLeftInBounds(leftOffset) && slatCoordCache.isTopInBounds(topOffset)) {
			var colIndex = colCoordCache.getHorizontalIndex(leftOffset);
			var slatIndex = slatCoordCache.getVerticalIndex(topOffset);
			if (colIndex != null && slatIndex != null) {
				var slatTop = slatCoordCache.getTopOffset(slatIndex);
				var slatHeight = slatCoordCache.getHeight(slatIndex);
				var partial = (topOffset - slatTop) / slatHeight; 
				var localSnapIndex = Math.floor(partial * snapsPerSlot); 
				var snapIndex = slatIndex * snapsPerSlot + localSnapIndex;
				var snapTop = slatTop + (localSnapIndex / snapsPerSlot) * slatHeight;
				var snapBottom = slatTop + ((localSnapIndex + 1) / snapsPerSlot) * slatHeight;
				return {
					col: colIndex,
					snap: snapIndex,
					component: this, 
					left: colCoordCache.getLeftOffset(colIndex),
					right: colCoordCache.getRightOffset(colIndex),
					top: snapTop,
					bottom: snapBottom
				};
			}
		}
	},
	getHitFootprint: function(hit) {
		var start = this.getCellDate(0, hit.col); 
		var time = this.computeSnapTime(hit.snap); 
		var end;
		start.time(time);
		end = start.clone().add(this.snapDuration);
		return new ComponentFootprint(
			new UnzonedRange(start, end),
			false 
		);
	},
	computeSnapTime: function(snapIndex) {
		return moment.duration(this.dateProfile.minTime + this.snapDuration * snapIndex);
	},
	getHitEl: function(hit) {
		return this.colEls.eq(hit.col);
	},
	renderDrag: function(eventFootprints, seg, isTouch) {
		var i;
		if (seg) { 
			if (eventFootprints.length) {
				this.helperRenderer.renderEventDraggingFootprints(eventFootprints, seg, isTouch);
				return true;
			}
		}
		else { 
			for (i = 0; i < eventFootprints.length; i++) {
				this.renderHighlight(eventFootprints[i].componentFootprint);
			}
		}
	},
	unrenderDrag: function(seg) {
		this.unrenderHighlight();
		this.helperRenderer.unrender();
	},
	renderEventResize: function(eventFootprints, seg, isTouch) {
		this.helperRenderer.renderEventResizingFootprints(eventFootprints, seg, isTouch);
	},
	unrenderEventResize: function(seg) {
		this.helperRenderer.unrender();
	},
	renderSelectionFootprint: function(componentFootprint) {
		if (this.opt('selectHelper')) { 
			this.helperRenderer.renderComponentFootprint(componentFootprint);
		}
		else {
			this.renderHighlight(componentFootprint);
		}
	},
	unrenderSelection: function() {
		this.helperRenderer.unrender();
		this.unrenderHighlight();
	}
});
;;
var AgendaView = FC.AgendaView = View.extend({
	scroller: null,
	timeGridClass: TimeGrid, 
	timeGrid: null, 
	dayGridClass: DayGrid, 
	dayGrid: null, 
	axisWidth: null, 
	usesMinMaxTime: true,
	constructor: function() {
		View.apply(this, arguments);
		this.timeGrid = this.instantiateTimeGrid();
		this.addChild(this.timeGrid);
		if (this.opt('allDaySlot')) { 
			this.dayGrid = this.instantiateDayGrid(); 
			this.addChild(this.dayGrid);
		}
		this.scroller = new Scroller({
			overflowX: 'hidden',
			overflowY: 'auto'
		});
	},
	instantiateTimeGrid: function() {
		var subclass = this.timeGridClass.extend(agendaTimeGridMethods);
		return new subclass(this);
	},
	instantiateDayGrid: function() {
		var subclass = this.dayGridClass.extend(agendaDayGridMethods);
		return new subclass(this);
	},
	renderSkeleton: function() {
		var timeGridWrapEl;
		var timeGridEl;
		this.el.addClass('fc-agenda-view').html(this.renderSkeletonHtml());
		this.scroller.render();
		timeGridWrapEl = this.scroller.el.addClass('fc-time-grid-container');
		timeGridEl = $('<div class="fc-time-grid" />').appendTo(timeGridWrapEl);
		this.el.find('.fc-body > tr > td').append(timeGridWrapEl);
		this.timeGrid.headContainerEl = this.el.find('.fc-head-container');
		this.timeGrid.setElement(timeGridEl);
		if (this.dayGrid) {
			this.dayGrid.setElement(this.el.find('.fc-day-grid'));
			this.dayGrid.bottomCoordPadding = this.dayGrid.el.next('hr').outerHeight();
		}
	},
	unrenderSkeleton: function() {
		this.timeGrid.removeElement();
		if (this.dayGrid) {
			this.dayGrid.removeElement();
		}
		this.scroller.destroy();
	},
	renderSkeletonHtml: function() {
		var theme = this.calendar.theme;
		return '' +
			'<table class="' + theme.getClass('tableGrid') + '">' +
				(this.opt('columnHeader') ?
					'<thead class="fc-head">' +
						'<tr>' +
							'<td class="fc-head-container ' + theme.getClass('widgetHeader') + '">&nbsp;</td>' +
						'</tr>' +
					'</thead>' :
					''
					) +
				'<tbody class="fc-body">' +
					'<tr>' +
						'<td class="' + theme.getClass('widgetContent') + '">' +
							(this.dayGrid ?
								'<div class="fc-day-grid"/>' +
								'<hr class="fc-divider ' + theme.getClass('widgetHeader') + '"/>' :
								''
								) +
						'</td>' +
					'</tr>' +
				'</tbody>' +
			'</table>';
	},
	axisStyleAttr: function() {
		if (this.axisWidth !== null) {
			 return 'style="width:' + this.axisWidth + 'px"';
		}
		return '';
	},
	getNowIndicatorUnit: function() {
		return this.timeGrid.getNowIndicatorUnit();
	},
	updateSize: function(totalHeight, isAuto, isResize) {
		var eventLimit;
		var scrollerHeight;
		var scrollbarWidths;
		View.prototype.updateSize.apply(this, arguments);
		this.axisWidth = matchCellWidths(this.el.find('.fc-axis'));
		if (!this.timeGrid.colEls) {
			if (!isAuto) {
				scrollerHeight = this.computeScrollerHeight(totalHeight);
				this.scroller.setHeight(scrollerHeight);
			}
			return;
		}
		var noScrollRowEls = this.el.find('.fc-row:not(.fc-scroller *)');
		this.timeGrid.bottomRuleEl.hide(); 
		this.scroller.clear(); 
		uncompensateScroll(noScrollRowEls);
		if (this.dayGrid) {
			this.dayGrid.removeSegPopover(); 
			eventLimit = this.opt('eventLimit');
			if (eventLimit && typeof eventLimit !== 'number') {
				eventLimit = AGENDA_ALL_DAY_EVENT_LIMIT; 
			}
			if (eventLimit) {
				this.dayGrid.limitRows(eventLimit);
			}
		}
		if (!isAuto) { 
			scrollerHeight = this.computeScrollerHeight(totalHeight);
			this.scroller.setHeight(scrollerHeight);
			scrollbarWidths = this.scroller.getScrollbarWidths();
			if (scrollbarWidths.left || scrollbarWidths.right) { 
				compensateScroll(noScrollRowEls, scrollbarWidths);
				scrollerHeight = this.computeScrollerHeight(totalHeight);
				this.scroller.setHeight(scrollerHeight);
			}
			this.scroller.lockOverflow(scrollbarWidths);
			if (this.timeGrid.getTotalSlatHeight() < scrollerHeight) {
				this.timeGrid.bottomRuleEl.show();
			}
		}
	},
	computeScrollerHeight: function(totalHeight) {
		return totalHeight -
			subtractInnerElHeight(this.el, this.scroller.el); 
	},
	computeInitialDateScroll: function() {
		var scrollTime = moment.duration(this.opt('scrollTime'));
		var top = this.timeGrid.computeTimeTop(scrollTime);
		top = Math.ceil(top);
		if (top) {
			top++; 
		}
		return { top: top };
	},
	queryDateScroll: function() {
		return { top: this.scroller.getScrollTop() };
	},
	applyDateScroll: function(scroll) {
		if (scroll.top !== undefined) {
			this.scroller.setScrollTop(scroll.top);
		}
	},
	getHitFootprint: function(hit) {
		return hit.component.getHitFootprint(hit);
	},
	getHitEl: function(hit) {
		return hit.component.getHitEl(hit);
	},
	executeEventRender: function(eventsPayload) {
		var dayEventsPayload = {};
		var timedEventsPayload = {};
		var id, eventInstanceGroup;
		for (id in eventsPayload) {
			eventInstanceGroup = eventsPayload[id];
			if (eventInstanceGroup.getEventDef().isAllDay()) {
				dayEventsPayload[id] = eventInstanceGroup;
			}
			else {
				timedEventsPayload[id] = eventInstanceGroup;
			}
		}
		this.timeGrid.executeEventRender(timedEventsPayload);
		if (this.dayGrid) {
			this.dayGrid.executeEventRender(dayEventsPayload);
		}
	},
	renderDrag: function(eventFootprints, seg, isTouch) {
		var groups = groupEventFootprintsByAllDay(eventFootprints);
		var renderedHelper = false;
		renderedHelper = this.timeGrid.renderDrag(groups.timed, seg, isTouch);
		if (this.dayGrid) {
			renderedHelper = this.dayGrid.renderDrag(groups.allDay, seg, isTouch) || renderedHelper;
		}
		return renderedHelper;
	},
	renderEventResize: function(eventFootprints, seg, isTouch) {
		var groups = groupEventFootprintsByAllDay(eventFootprints);
		this.timeGrid.renderEventResize(groups.timed, seg, isTouch);
		if (this.dayGrid) {
			this.dayGrid.renderEventResize(groups.allDay, seg, isTouch);
		}
	},
	renderSelectionFootprint: function(componentFootprint) {
		if (!componentFootprint.isAllDay) {
			this.timeGrid.renderSelectionFootprint(componentFootprint);
		}
		else if (this.dayGrid) {
			this.dayGrid.renderSelectionFootprint(componentFootprint);
		}
	}
});
var agendaTimeGridMethods = {
	renderHeadIntroHtml: function() {
		var view = this.view;
		var calendar = view.calendar;
		var weekStart = calendar.msToUtcMoment(this.dateProfile.renderUnzonedRange.startMs, true);
		var weekText;
		if (this.opt('weekNumbers')) {
			weekText = weekStart.format(this.opt('smallWeekFormat'));
			return '' +
				'<th class="fc-axis fc-week-number ' + calendar.theme.getClass('widgetHeader') + '" ' + view.axisStyleAttr() + '>' +
					view.buildGotoAnchorHtml( 
						{ date: weekStart, type: 'week', forceOff: this.colCnt > 1 },
						htmlEscape(weekText) 
					) +
				'</th>';
		}
		else {
			return '<th class="fc-axis ' + calendar.theme.getClass('widgetHeader') + '" ' + view.axisStyleAttr() + '></th>';
		}
	},
	renderBgIntroHtml: function() {
		var view = this.view;
		return '<td class="fc-axis ' + view.calendar.theme.getClass('widgetContent') + '" ' + view.axisStyleAttr() + '></td>';
	},
	renderIntroHtml: function() {
		var view = this.view;
		return '<td class="fc-axis" ' + view.axisStyleAttr() + '></td>';
	}
};
var agendaDayGridMethods = {
	renderBgIntroHtml: function() {
		var view = this.view;
		return '' +
			'<td class="fc-axis ' + view.calendar.theme.getClass('widgetContent') + '" ' + view.axisStyleAttr() + '>' +
				'<span>' + 
					view.getAllDayHtml() +
				'</span>' +
			'</td>';
	},
	renderIntroHtml: function() {
		var view = this.view;
		return '<td class="fc-axis" ' + view.axisStyleAttr() + '></td>';
	}
};
function groupEventFootprintsByAllDay(eventFootprints) {
	var allDay = [];
	var timed = [];
	var i;
	for (i = 0; i < eventFootprints.length; i++) {
		if (eventFootprints[i].componentFootprint.isAllDay) {
			allDay.push(eventFootprints[i]);
		}
		else {
			timed.push(eventFootprints[i]);
		}
	}
	return { allDay: allDay, timed: timed };
}
;;
var AGENDA_ALL_DAY_EVENT_LIMIT = 5;
var AGENDA_STOCK_SUB_DURATIONS = [
	{ hours: 1 },
	{ minutes: 30 },
	{ minutes: 15 },
	{ seconds: 30 },
	{ seconds: 15 }
];
fcViews.agenda = {
	'class': AgendaView,
	defaults: {
		allDaySlot: true,
		slotDuration: '00:30:00',
		slotEventOverlap: true 
	}
};
fcViews.agendaDay = {
	type: 'agenda',
	duration: { days: 1 }
};
fcViews.agendaWeek = {
	type: 'agenda',
	duration: { weeks: 1 }
};
;;
var ListView = FC.ListView = View.extend({
	segSelector: '.fc-list-item', 
	scroller: null,
	contentEl: null,
	dayDates: null, 
	dayRanges: null, 
	constructor: function() {
		View.apply(this, arguments);
		this.scroller = new Scroller({
			overflowX: 'hidden',
			overflowY: 'auto'
		});
	},
	renderSkeleton: function() {
		this.el.addClass(
			'fc-list-view ' +
			this.calendar.theme.getClass('listView')
		);
		this.scroller.render();
		this.scroller.el.appendTo(this.el);
		this.contentEl = this.scroller.scrollEl; 
	},
	unrenderSkeleton: function() {
		this.scroller.destroy(); 
	},
	updateSize: function(totalHeight, isAuto, isResize) {
		this.scroller.setHeight(this.computeScrollerHeight(totalHeight));
	},
	computeScrollerHeight: function(totalHeight) {
		return totalHeight -
			subtractInnerElHeight(this.el, this.scroller.el); 
	},
	renderDates: function(dateProfile) {
		var calendar = this.calendar;
		var dayStart = calendar.msToUtcMoment(dateProfile.renderUnzonedRange.startMs, true);
		var viewEnd = calendar.msToUtcMoment(dateProfile.renderUnzonedRange.endMs, true);
		var dayDates = [];
		var dayRanges = [];
		while (dayStart < viewEnd) {
			dayDates.push(dayStart.clone());
			dayRanges.push(new UnzonedRange(
				dayStart,
				dayStart.clone().add(1, 'day')
			));
			dayStart.add(1, 'day');
		}
		this.dayDates = dayDates;
		this.dayRanges = dayRanges;
	},
	componentFootprintToSegs: function(footprint) {
		var dayRanges = this.dayRanges;
		var dayIndex;
		var segRange;
		var seg;
		var segs = [];
		for (dayIndex = 0; dayIndex < dayRanges.length; dayIndex++) {
			segRange = footprint.unzonedRange.intersect(dayRanges[dayIndex]);
			if (segRange) {
				seg = {
					startMs: segRange.startMs,
					endMs: segRange.endMs,
					isStart: segRange.isStart,
					isEnd: segRange.isEnd,
					dayIndex: dayIndex
				};
				segs.push(seg);
				if (
					!seg.isEnd && !footprint.isAllDay &&
					dayIndex + 1 < dayRanges.length &&
					footprint.unzonedRange.endMs < dayRanges[dayIndex + 1].startMs + this.nextDayThreshold
				) {
					seg.endMs = footprint.unzonedRange.endMs;
					seg.isEnd = true;
					break;
				}
			}
		}
		return segs;
	},
	eventRendererClass: EventRenderer.extend({
		renderFgSegs: function(segs) {
			if (!segs.length) {
				this.component.renderEmptyMessage();
			}
			else {
				this.component.renderSegList(segs);
			}
		},
		fgSegHtml: function(seg) {
			var view = this.view;
			var calendar = view.calendar;
			var theme = calendar.theme;
			var eventFootprint = seg.footprint;
			var eventDef = eventFootprint.eventDef;
			var componentFootprint = eventFootprint.componentFootprint;
			var url = eventDef.url;
			var classes = [ 'fc-list-item' ].concat(this.getClasses(eventDef));
			var bgColor = this.getBgColor(eventDef);
			var timeHtml;
			if (componentFootprint.isAllDay) {
				timeHtml = view.getAllDayHtml();
			}
			else if (view.isMultiDayRange(componentFootprint.unzonedRange)) {
				if (seg.isStart || seg.isEnd) { 
					timeHtml = htmlEscape(this._getTimeText(
						calendar.msToMoment(seg.startMs),
						calendar.msToMoment(seg.endMs),
						componentFootprint.isAllDay
					));
				}
				else { 
					timeHtml = view.getAllDayHtml();
				}
			}
			else {
				timeHtml = htmlEscape(this.getTimeText(eventFootprint));
			}
			if (url) {
				classes.push('fc-has-url');
			}
			return '<tr class="' + classes.join(' ') + '">' +
				(this.displayEventTime ?
					'<td class="fc-list-item-time ' + theme.getClass('widgetContent') + '">' +
						(timeHtml || '') +
					'</td>' :
					'') +
				'<td class="fc-list-item-marker ' + theme.getClass('widgetContent') + '">' +
					'<span class="fc-event-dot"' +
					(bgColor ?
						' style="background-color:' + bgColor + '"' :
						'') +
					'></span>' +
				'</td>' +
				'<td class="fc-list-item-title ' + theme.getClass('widgetContent') + '">' +
					'<a' + (url ? ' href="' + htmlEscape(url) + '"' : '') + '>' +
						htmlEscape(eventDef.title || '') +
					'</a>' +
				'</td>' +
			'</tr>';
		},
		computeEventTimeFormat: function() {
			return this.opt('mediumTimeFormat');
		}
	}),
	eventPointingClass: EventPointing.extend({
		handleClick: function(seg, ev) {
			var url;
			EventPointing.prototype.handleClick.apply(this, arguments); 
			if (!$(ev.target).closest('a[href]').length) {
				url = seg.footprint.eventDef.url;
				if (url && !ev.isDefaultPrevented()) { 
					window.location.href = url; 
				}
			}
		}
	}),
	renderEmptyMessage: function() {
		this.contentEl.html(
			'<div class="fc-list-empty-wrap2">' + 
			'<div class="fc-list-empty-wrap1">' +
			'<div class="fc-list-empty">' +
				htmlEscape(this.opt('noEventsMessage')) +
			'</div>' +
			'</div>' +
			'</div>'
		);
	},
	renderSegList: function(allSegs) {
		var segsByDay = this.groupSegsByDay(allSegs); 
		var dayIndex;
		var daySegs;
		var i;
		var tableEl = $('<table class="fc-list-table ' + this.calendar.theme.getClass('tableList') + '"><tbody/></table>');
		var tbodyEl = tableEl.find('tbody');
		for (dayIndex = 0; dayIndex < segsByDay.length; dayIndex++) {
			daySegs = segsByDay[dayIndex];
			if (daySegs) { 
				tbodyEl.append(this.dayHeaderHtml(this.dayDates[dayIndex]));
				this.eventRenderer.sortEventSegs(daySegs);
				for (i = 0; i < daySegs.length; i++) {
					tbodyEl.append(daySegs[i].el); 
				}
			}
		}
		this.contentEl.empty().append(tableEl);
	},
	groupSegsByDay: function(segs) {
		var segsByDay = []; 
		var i, seg;
		for (i = 0; i < segs.length; i++) {
			seg = segs[i];
			(segsByDay[seg.dayIndex] || (segsByDay[seg.dayIndex] = []))
				.push(seg);
		}
		return segsByDay;
	},
	dayHeaderHtml: function(dayDate) {
		var mainFormat = this.opt('listDayFormat');
		var altFormat = this.opt('listDayAltFormat');
		return '<tr class="fc-list-heading" data-date="' + dayDate.format('YYYY-MM-DD') + '">' +
			'<td class="' + this.calendar.theme.getClass('widgetHeader') + '" colspan="3">' +
				(mainFormat ?
					this.buildGotoAnchorHtml(
						dayDate,
						{ 'class': 'fc-list-heading-main' },
						htmlEscape(dayDate.format(mainFormat)) 
					) :
					'') +
				(altFormat ?
					this.buildGotoAnchorHtml(
						dayDate,
						{ 'class': 'fc-list-heading-alt' },
						htmlEscape(dayDate.format(altFormat)) 
					) :
					'') +
			'</td>' +
		'</tr>';
	}
});
;;
fcViews.list = {
	'class': ListView,
	buttonTextKey: 'list', 
	defaults: {
		buttonText: 'list', 
		listDayFormat: 'LL', 
		noEventsMessage: 'No events to display'
	}
};
fcViews.listDay = {
	type: 'list',
	duration: { days: 1 },
	defaults: {
		listDayFormat: 'dddd' 
	}
};
fcViews.listWeek = {
	type: 'list',
	duration: { weeks: 1 },
	defaults: {
		listDayFormat: 'dddd', 
		listDayAltFormat: 'LL'
	}
};
fcViews.listMonth = {
	type: 'list',
	duration: { month: 1 },
	defaults: {
		listDayAltFormat: 'dddd' 
	}
};
fcViews.listYear = {
	type: 'list',
	duration: { year: 1 },
	defaults: {
		listDayAltFormat: 'dddd' 
	}
};
;;
return FC; 
});
(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define([ 'jquery' ], factory);
	}
	else if (typeof exports === 'object') { 
		module.exports = factory(require('jquery'));
	}
	else {
		factory(jQuery);
	}
})(function($) {
var FC = $.fullCalendar;
var Promise = FC.Promise;
var EventSource = FC.EventSource;
var JsonFeedEventSource = FC.JsonFeedEventSource;
var EventSourceParser = FC.EventSourceParser;
var applyAll = FC.applyAll;
;;
var GcalEventSource = EventSource.extend({
	googleCalendarApiKey: null,
	googleCalendarId: null,
	googleCalendarError: null, 
	ajaxSettings: null,
	constructor: function() {
		EventSource.apply(this, arguments);
		this.ajaxSettings = {};
	},
	fetch: function(start, end, timezone) {
		var _this = this;
		var url = this.buildUrl();
		var requestParams = this.buildRequestParams(start, end, timezone);
		var ajaxSettings = this.ajaxSettings;
		var onSuccess = ajaxSettings.success;
		if (!requestParams) { 
			return Promise.reject();
		}
		this.calendar.pushLoading();
		return Promise.construct(function(onResolve, onReject) {
			$.ajax($.extend(
				{}, 
				JsonFeedEventSource.AJAX_DEFAULTS,
				ajaxSettings,
				{
					url: url,
					data: requestParams,
					success: function(responseData) {
						var rawEventDefs;
						var successRes;
						_this.calendar.popLoading();
						if (responseData.error) {
							_this.reportError('Google Calendar API: ' + responseData.error.message, responseData.error.errors);
							onReject();
						}
						else if (responseData.items) {
							rawEventDefs = _this.gcalItemsToRawEventDefs(
								responseData.items,
								requestParams.timeZone
							);
							successRes = applyAll(
								onSuccess,
								this, 
								[ rawEventDefs ].concat(Array.prototype.slice.call(arguments, 1))
							);
							if ($.isArray(successRes)) {
								rawEventDefs = successRes;
							}
							onResolve(_this.parseEventDefs(rawEventDefs));
						}
					}
				}
			));
		});
	},
	gcalItemsToRawEventDefs: function(items, gcalTimezone) {
		var _this = this;
		return items.map(function(item) {
			return _this.gcalItemToRawEventDef(item, gcalTimezone);
		});
	},
	gcalItemToRawEventDef: function(item, gcalTimezone) {
		var url = item.htmlLink || null;
		if (url && gcalTimezone) {
			url = injectQsComponent(url, 'ctz=' + gcalTimezone);
		}
		return {
			id: item.id,
			title: item.summary,
			start: item.start.dateTime || item.start.date, 
			end: item.end.dateTime || item.end.date, 
			url: url,
			location: item.location,
			description: item.description
		};
	},
	buildUrl: function() {
		return GcalEventSource.API_BASE + '/' +
			encodeURIComponent(this.googleCalendarId) +
			'/events?callback=?'; 
	},
	buildRequestParams: function(start, end, timezone) {
		var apiKey = this.googleCalendarApiKey || this.calendar.opt('googleCalendarApiKey');
		var params;
		if (!apiKey) {
			this.reportError("Specify a googleCalendarApiKey. See http:
			return null;
		}
		if (!start.hasZone()) {
			start = start.clone().utc().add(-1, 'day');
		}
		if (!end.hasZone()) {
			end = end.clone().utc().add(1, 'day');
		}
		params = $.extend(
			this.ajaxSettings.data || {},
			{
				key: apiKey,
				timeMin: start.format(),
				timeMax: end.format(),
				singleEvents: true,
				maxResults: 9999
			}
		);
		if (timezone && timezone !== 'local') {
			params.timeZone = timezone.replace(' ', '_');
		}
		return params;
	},
	reportError: function(message, apiErrorObjs) {
		var calendar = this.calendar;
		var calendarOnError = calendar.opt('googleCalendarError');
		var errorObjs = apiErrorObjs || [ { message: message } ]; 
		if (this.googleCalendarError) {
			this.googleCalendarError.apply(calendar, errorObjs);
		}
		if (calendarOnError) {
			calendarOnError.apply(calendar, errorObjs);
		}
		FC.warn.apply(null, [ message ].concat(apiErrorObjs || []));
	},
	getPrimitive: function() {
		return this.googleCalendarId;
	},
	applyManualStandardProps: function(rawProps) {
		var superSuccess = EventSource.prototype.applyManualStandardProps.apply(this, arguments);
		var googleCalendarId = rawProps.googleCalendarId;
		if (googleCalendarId == null && rawProps.url) {
			googleCalendarId = parseGoogleCalendarId(rawProps.url);
		}
		if (googleCalendarId != null) {
			this.googleCalendarId = googleCalendarId;
			return superSuccess;
		}
		return false;
	},
	applyMiscProps: function(rawProps) {
		$.extend(this.ajaxSettings, rawProps);
	}
});
GcalEventSource.API_BASE = 'https:
GcalEventSource.defineStandardProps({
	url: false,
	googleCalendarId: false,
	googleCalendarApiKey: true,
	googleCalendarError: true
});
GcalEventSource.parse = function(rawInput, calendar) {
	var rawProps;
	if (typeof rawInput === 'object') { 
		rawProps = rawInput;
	}
	else if (typeof rawInput === 'string') { 
		rawProps = { url: rawInput }; 
	}
	if (rawProps) {
		return EventSource.parse.call(this, rawProps, calendar);
	}
	return false;
};
function parseGoogleCalendarId(url) {
	var match;
	if (/^[^\/]+@([^\/\.]+\.)*(google|googlemail|gmail)\.com$/.test(url)) {
		return url;
	}
	else if (
		(match = /^https:\/\/www.googleapis.com\/calendar\/v3\/calendars\/([^\/]*)/.exec(url)) ||
		(match = /^https?:\/\/www.google.com\/calendar\/feeds\/([^\/]*)/.exec(url))
	) {
		return decodeURIComponent(match[1]);
	}
}
function injectQsComponent(url, component) {
	return url.replace(/(\?.*?)?(#|$)/, function(whole, qs, hash) {
		return (qs ? qs + '&' : '?') + component + hash;
	});
}
EventSourceParser.registerClass(GcalEventSource);
FC.GcalEventSource = GcalEventSource;
;;
});
