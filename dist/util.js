'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.api = api;
exports.pagination = pagination;
exports.aggregatePagination = aggregatePagination;

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var fetchOptions = {
	method: 'GET',
	headers: {
		'User-Agent': 'WikiJs/0.1 (https://github.com/dijs/wiki; richard.vanderdys@gmail.com)'
	}
};

function api(apiOptions) {
	var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	var qs = Object.assign({}, params, {
		format: 'json',
		action: 'query'
	});
	var url = apiOptions.apiUrl + '?' + _querystring2.default.stringify(qs);
	return (0, _isomorphicFetch2.default)(url, fetchOptions).then(function (res) {
		return res.json();
	});
}

function pagination(apiOptions, params, parseResults) {
	return api(apiOptions, params).then(function (res) {
		var resolution = {};
		resolution.results = parseResults(res);
		if (res['continue']) {
			var continueType = Object.keys(res['continue']).filter(function (key) {
				return key !== 'continue';
			})[0];
			var continueKey = res['continue'][continueType];
			params[continueType] = continueKey;
			resolution.next = function () {
				return pagination(apiOptions, params, parseResults);
			};
		}
		return resolution;
	});
}

function aggregatePagination(pagination) {
	var previousResults = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

	return pagination.then(function (res) {
		var results = [].concat(_toConsumableArray(previousResults), _toConsumableArray(res.results));
		if (res.next) {
			return aggregatePagination(res.next(), results);
		} else {
			return results;
		}
	});
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLmpzIl0sIm5hbWVzIjpbImFwaSIsInBhZ2luYXRpb24iLCJhZ2dyZWdhdGVQYWdpbmF0aW9uIiwiZmV0Y2hPcHRpb25zIiwibWV0aG9kIiwiaGVhZGVycyIsImFwaU9wdGlvbnMiLCJwYXJhbXMiLCJxcyIsIk9iamVjdCIsImFzc2lnbiIsImZvcm1hdCIsImFjdGlvbiIsInVybCIsImFwaVVybCIsInN0cmluZ2lmeSIsInRoZW4iLCJyZXMiLCJqc29uIiwicGFyc2VSZXN1bHRzIiwicmVzb2x1dGlvbiIsInJlc3VsdHMiLCJjb250aW51ZVR5cGUiLCJrZXlzIiwiZmlsdGVyIiwia2V5IiwiY29udGludWVLZXkiLCJuZXh0IiwicHJldmlvdXNSZXN1bHRzIl0sIm1hcHBpbmdzIjoiOzs7OztRQVVnQkEsRyxHQUFBQSxHO1FBU0FDLFUsR0FBQUEsVTtRQWlCQUMsbUIsR0FBQUEsbUI7O0FBcENoQjs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU1DLGVBQWU7QUFDcEJDLFNBQVEsS0FEWTtBQUVwQkMsVUFBUztBQUNSLGdCQUFjO0FBRE47QUFGVyxDQUFyQjs7QUFPTyxTQUFTTCxHQUFULENBQWFNLFVBQWIsRUFBc0M7QUFBQSxLQUFiQyxNQUFhLHlEQUFKLEVBQUk7O0FBQzVDLEtBQU1DLEtBQUtDLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCSCxNQUFsQixFQUEwQjtBQUNwQ0ksVUFBUSxNQUQ0QjtBQUVwQ0MsVUFBUTtBQUY0QixFQUExQixDQUFYO0FBSUEsS0FBTUMsTUFBU1AsV0FBV1EsTUFBcEIsU0FBOEIsc0JBQVlDLFNBQVosQ0FBc0JQLEVBQXRCLENBQXBDO0FBQ0EsUUFBTywrQkFBTUssR0FBTixFQUFXVixZQUFYLEVBQXlCYSxJQUF6QixDQUE4QjtBQUFBLFNBQU9DLElBQUlDLElBQUosRUFBUDtBQUFBLEVBQTlCLENBQVA7QUFDQTs7QUFFTSxTQUFTakIsVUFBVCxDQUFvQkssVUFBcEIsRUFBZ0NDLE1BQWhDLEVBQXdDWSxZQUF4QyxFQUFzRDtBQUM1RCxRQUFPbkIsSUFBSU0sVUFBSixFQUFnQkMsTUFBaEIsRUFDTFMsSUFESyxDQUNBLGVBQU87QUFDWixNQUFJSSxhQUFhLEVBQWpCO0FBQ0FBLGFBQVdDLE9BQVgsR0FBcUJGLGFBQWFGLEdBQWIsQ0FBckI7QUFDQSxNQUFJQSxJQUFJLFVBQUosQ0FBSixFQUFxQjtBQUNwQixPQUFNSyxlQUFlYixPQUNuQmMsSUFEbUIsQ0FDZE4sSUFBSSxVQUFKLENBRGMsRUFFbkJPLE1BRm1CLENBRVo7QUFBQSxXQUFPQyxRQUFRLFVBQWY7QUFBQSxJQUZZLEVBRWUsQ0FGZixDQUFyQjtBQUdBLE9BQU1DLGNBQWNULElBQUksVUFBSixFQUFnQkssWUFBaEIsQ0FBcEI7QUFDQWYsVUFBT2UsWUFBUCxJQUF1QkksV0FBdkI7QUFDQU4sY0FBV08sSUFBWCxHQUFrQjtBQUFBLFdBQU0xQixXQUFXSyxVQUFYLEVBQXVCQyxNQUF2QixFQUErQlksWUFBL0IsQ0FBTjtBQUFBLElBQWxCO0FBQ0E7QUFDRCxTQUFPQyxVQUFQO0FBQ0EsRUFiSyxDQUFQO0FBY0E7O0FBRU0sU0FBU2xCLG1CQUFULENBQTZCRCxVQUE3QixFQUErRDtBQUFBLEtBQXRCMkIsZUFBc0IseURBQUosRUFBSTs7QUFDckUsUUFBTzNCLFdBQ0xlLElBREssQ0FDQSxlQUFPO0FBQ1osTUFBTUssdUNBQWNPLGVBQWQsc0JBQWtDWCxJQUFJSSxPQUF0QyxFQUFOO0FBQ0EsTUFBSUosSUFBSVUsSUFBUixFQUFjO0FBQ2IsVUFBT3pCLG9CQUFvQmUsSUFBSVUsSUFBSixFQUFwQixFQUFnQ04sT0FBaEMsQ0FBUDtBQUNBLEdBRkQsTUFFTztBQUNOLFVBQU9BLE9BQVA7QUFDQTtBQUNELEVBUkssQ0FBUDtBQVNBIiwiZmlsZSI6InV0aWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy1mZXRjaCc7XG5pbXBvcnQgcXVlcnlzdHJpbmcgZnJvbSAncXVlcnlzdHJpbmcnO1xuXG5jb25zdCBmZXRjaE9wdGlvbnMgPSB7XG5cdG1ldGhvZDogJ0dFVCcsXG5cdGhlYWRlcnM6IHtcblx0XHQnVXNlci1BZ2VudCc6ICdXaWtpSnMvMC4xIChodHRwczovL2dpdGh1Yi5jb20vZGlqcy93aWtpOyByaWNoYXJkLnZhbmRlcmR5c0BnbWFpbC5jb20pJ1xuXHR9XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gYXBpKGFwaU9wdGlvbnMsIHBhcmFtcyA9IHt9KSB7XG5cdGNvbnN0IHFzID0gT2JqZWN0LmFzc2lnbih7fSwgcGFyYW1zLCB7XG5cdFx0Zm9ybWF0OiAnanNvbicsXG5cdFx0YWN0aW9uOiAncXVlcnknXG5cdH0pO1xuXHRjb25zdCB1cmwgPSBgJHthcGlPcHRpb25zLmFwaVVybH0/JHtxdWVyeXN0cmluZy5zdHJpbmdpZnkocXMpfWA7XG5cdHJldHVybiBmZXRjaCh1cmwsIGZldGNoT3B0aW9ucykudGhlbihyZXMgPT4gcmVzLmpzb24oKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYWdpbmF0aW9uKGFwaU9wdGlvbnMsIHBhcmFtcywgcGFyc2VSZXN1bHRzKSB7XG5cdHJldHVybiBhcGkoYXBpT3B0aW9ucywgcGFyYW1zKVxuXHRcdC50aGVuKHJlcyA9PiB7XG5cdFx0XHRsZXQgcmVzb2x1dGlvbiA9IHt9O1xuXHRcdFx0cmVzb2x1dGlvbi5yZXN1bHRzID0gcGFyc2VSZXN1bHRzKHJlcyk7XG5cdFx0XHRpZiAocmVzWydjb250aW51ZSddKSB7XG5cdFx0XHRcdGNvbnN0IGNvbnRpbnVlVHlwZSA9IE9iamVjdFxuXHRcdFx0XHRcdC5rZXlzKHJlc1snY29udGludWUnXSlcblx0XHRcdFx0XHQuZmlsdGVyKGtleSA9PiBrZXkgIT09ICdjb250aW51ZScpWzBdO1xuXHRcdFx0XHRjb25zdCBjb250aW51ZUtleSA9IHJlc1snY29udGludWUnXVtjb250aW51ZVR5cGVdO1xuXHRcdFx0XHRwYXJhbXNbY29udGludWVUeXBlXSA9IGNvbnRpbnVlS2V5O1xuXHRcdFx0XHRyZXNvbHV0aW9uLm5leHQgPSAoKSA9PiBwYWdpbmF0aW9uKGFwaU9wdGlvbnMsIHBhcmFtcywgcGFyc2VSZXN1bHRzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXNvbHV0aW9uO1xuXHRcdH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWdncmVnYXRlUGFnaW5hdGlvbihwYWdpbmF0aW9uLCBwcmV2aW91c1Jlc3VsdHMgPSBbXSkge1xuXHRyZXR1cm4gcGFnaW5hdGlvblxuXHRcdC50aGVuKHJlcyA9PiB7XG5cdFx0XHRjb25zdCByZXN1bHRzID0gWy4uLnByZXZpb3VzUmVzdWx0cywgLi4ucmVzLnJlc3VsdHNdO1xuXHRcdFx0aWYgKHJlcy5uZXh0KSB7XG5cdFx0XHRcdHJldHVybiBhZ2dyZWdhdGVQYWdpbmF0aW9uKHJlcy5uZXh0KCksIHJlc3VsdHMpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHR9XG5cdFx0fSk7XG59XG4iXX0=