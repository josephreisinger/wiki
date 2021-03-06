'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = wiki;

require('babel-polyfill');

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _util = require('./util');

var _page = require('./page');

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @namespace
 * @constant
 * @property {string} apiUrl - URL of Wikipedia API
 */
var defaultOptions = {
	apiUrl: 'http://en.wikipedia.org/w/api.php'
};

/**
 * wiki
 * @example
 * wiki({ apiUrl: 'http://fr.wikipedia.org/w/api.php' }).search(...);
 * @namespace Wiki
 * @param  {Object} options
 * @return {Object} - wiki (for chaining methods)
*/
function wiki() {
	var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];


	if (this instanceof wiki) {
		console.log('Please do not use wikijs ^1.0.0 as a class. Please see the new README.'); // eslint-disable-line
	}

	var apiOptions = Object.assign({}, defaultOptions, options);

	/**
  * Search articles
  * @example
  * wiki.search('star wars').then(data => console.log(data.results.length));
  * @example
  * wiki.search('star wars').then(data => {
  * 	data.next().then(...);
  * });
  * @method Wiki#search
  * @param  {string} query - keyword query
  * @param  {Number} [limit] - limits the number of results
  * @return {Promise} - pagination promise with results and next page function
  */
	function search(query) {
		var limit = arguments.length <= 1 || arguments[1] === undefined ? 50 : arguments[1];

		return (0, _util.pagination)(apiOptions, {
			list: 'search',
			srsearch: query,
			srlimit: limit
		}, function (res) {
			return _underscore2.default.pluck(res.query.search, 'title');
		});
	}

	/**
  * Random articles
  * @example
  * wiki.random(3).then(results => console.log(results[0]));
  * @method Wiki#random
  * @param  {Number} [limit] - limits the number of random articles
  * @return {Promise} - List of page titles
  */
	function random() {
		var limit = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

		return (0, _util.api)(apiOptions, {
			list: 'random',
			rnnamespace: 0,
			rnlimit: limit
		}).then(function (res) {
			return _underscore2.default.pluck(res.query.random, 'title');
		});
	}

	/**
  * Get Page
  * @example
  * wiki.page('Batman').then(page => console.log(page.pageid));
  * @method Wiki#page
  * @param  {string} title - title of article
  * @return {Promise}
  */
	function page(title) {
		return (0, _util.api)(apiOptions, {
			prop: 'info|pageprops',
			inprop: 'url',
			ppprop: 'disambiguation',
			titles: title
		}).then(function (res) {
			var id = _underscore2.default.findKey(res.query.pages, function (page) {
				return page.title === title;
			});
			if (!id) {
				throw new Error('No article found');
			}
			return (0, _page2.default)(res.query.pages[id], apiOptions);
		});
	}

	/**
  * Geographical Search
  * @example
  * wiki.geoSearch(32.329, -96.136).then(titles => console.log(titles.length));
  * @method Wiki#geoSearch
  * @param  {Number} lat - latitude
  * @param  {Number} lon - longitude
  * @param  {Number} [radius=1000] - search radius in kilometers (default: 1km)
  * @return {Promise} - List of page titles
  */
	function geoSearch(lat, lon) {
		var radius = arguments.length <= 2 || arguments[2] === undefined ? 1000 : arguments[2];

		return (0, _util.api)(apiOptions, {
			list: 'geosearch',
			gsradius: radius,
			gscoord: lat + '|' + lon
		}).then(function (res) {
			return _underscore2.default.pluck(res.query.geosearch, 'title');
		});
	}

	return {
		search: search,
		random: random,
		page: page,
		geoSearch: geoSearch,
		options: options
	};
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy93aWtpLmpzIl0sIm5hbWVzIjpbIndpa2kiLCJkZWZhdWx0T3B0aW9ucyIsImFwaVVybCIsIm9wdGlvbnMiLCJjb25zb2xlIiwibG9nIiwiYXBpT3B0aW9ucyIsIk9iamVjdCIsImFzc2lnbiIsInNlYXJjaCIsInF1ZXJ5IiwibGltaXQiLCJsaXN0Iiwic3JzZWFyY2giLCJzcmxpbWl0IiwicGx1Y2siLCJyZXMiLCJyYW5kb20iLCJybm5hbWVzcGFjZSIsInJubGltaXQiLCJ0aGVuIiwicGFnZSIsInRpdGxlIiwicHJvcCIsImlucHJvcCIsInBwcHJvcCIsInRpdGxlcyIsImlkIiwiZmluZEtleSIsInBhZ2VzIiwiRXJyb3IiLCJnZW9TZWFyY2giLCJsYXQiLCJsb24iLCJyYWRpdXMiLCJnc3JhZGl1cyIsImdzY29vcmQiLCJnZW9zZWFyY2giXSwibWFwcGluZ3MiOiJBQUFBOzs7OztrQkF3QndCQSxJOztBQXRCeEI7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBRUE7Ozs7O0FBS0EsSUFBTUMsaUJBQWlCO0FBQ3RCQyxTQUFRO0FBRGMsQ0FBdkI7O0FBSUE7Ozs7Ozs7O0FBUWUsU0FBU0YsSUFBVCxHQUE0QjtBQUFBLEtBQWRHLE9BQWMseURBQUosRUFBSTs7O0FBRTFDLEtBQUksZ0JBQWdCSCxJQUFwQixFQUEwQjtBQUN6QkksVUFBUUMsR0FBUixDQUFZLHdFQUFaLEVBRHlCLENBQzhEO0FBQ3ZGOztBQUVELEtBQU1DLGFBQWFDLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCUCxjQUFsQixFQUFrQ0UsT0FBbEMsQ0FBbkI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUFhQSxVQUFTTSxNQUFULENBQWdCQyxLQUFoQixFQUFtQztBQUFBLE1BQVpDLEtBQVkseURBQUosRUFBSTs7QUFDbEMsU0FBTyxzQkFBV0wsVUFBWCxFQUF1QjtBQUM3Qk0sU0FBTSxRQUR1QjtBQUU3QkMsYUFBVUgsS0FGbUI7QUFHN0JJLFlBQVNIO0FBSG9CLEdBQXZCLEVBSUo7QUFBQSxVQUFPLHFCQUFFSSxLQUFGLENBQVFDLElBQUlOLEtBQUosQ0FBVUQsTUFBbEIsRUFBMEIsT0FBMUIsQ0FBUDtBQUFBLEdBSkksQ0FBUDtBQUtBOztBQUVEOzs7Ozs7OztBQVFBLFVBQVNRLE1BQVQsR0FBMkI7QUFBQSxNQUFYTixLQUFXLHlEQUFILENBQUc7O0FBQzFCLFNBQU8sZUFBSUwsVUFBSixFQUFnQjtBQUNyQk0sU0FBTSxRQURlO0FBRXJCTSxnQkFBYSxDQUZRO0FBR3JCQyxZQUFTUjtBQUhZLEdBQWhCLEVBS0xTLElBTEssQ0FLQTtBQUFBLFVBQU8scUJBQUVMLEtBQUYsQ0FBUUMsSUFBSU4sS0FBSixDQUFVTyxNQUFsQixFQUEwQixPQUExQixDQUFQO0FBQUEsR0FMQSxDQUFQO0FBTUE7O0FBRUQ7Ozs7Ozs7O0FBUUEsVUFBU0ksSUFBVCxDQUFjQyxLQUFkLEVBQXFCO0FBQ3BCLFNBQU8sZUFBSWhCLFVBQUosRUFBZ0I7QUFDckJpQixTQUFNLGdCQURlO0FBRXJCQyxXQUFRLEtBRmE7QUFHckJDLFdBQVEsZ0JBSGE7QUFJckJDLFdBQVFKO0FBSmEsR0FBaEIsRUFNTEYsSUFOSyxDQU1BLGVBQU87QUFDWixPQUFNTyxLQUFLLHFCQUFFQyxPQUFGLENBQVVaLElBQUlOLEtBQUosQ0FBVW1CLEtBQXBCLEVBQTJCO0FBQUEsV0FBUVIsS0FBS0MsS0FBTCxLQUFlQSxLQUF2QjtBQUFBLElBQTNCLENBQVg7QUFDQSxPQUFJLENBQUNLLEVBQUwsRUFBUztBQUNSLFVBQU0sSUFBSUcsS0FBSixDQUFVLGtCQUFWLENBQU47QUFDQTtBQUNELFVBQU8sb0JBQVNkLElBQUlOLEtBQUosQ0FBVW1CLEtBQVYsQ0FBZ0JGLEVBQWhCLENBQVQsRUFBOEJyQixVQUE5QixDQUFQO0FBQ0EsR0FaSyxDQUFQO0FBYUE7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQSxVQUFTeUIsU0FBVCxDQUFtQkMsR0FBbkIsRUFBd0JDLEdBQXhCLEVBQTRDO0FBQUEsTUFBZkMsTUFBZSx5REFBTixJQUFNOztBQUMzQyxTQUFPLGVBQUk1QixVQUFKLEVBQWdCO0FBQ3JCTSxTQUFNLFdBRGU7QUFFckJ1QixhQUFVRCxNQUZXO0FBR3JCRSxZQUFZSixHQUFaLFNBQW1CQztBQUhFLEdBQWhCLEVBS0xiLElBTEssQ0FLQTtBQUFBLFVBQU8scUJBQUVMLEtBQUYsQ0FBUUMsSUFBSU4sS0FBSixDQUFVMkIsU0FBbEIsRUFBNkIsT0FBN0IsQ0FBUDtBQUFBLEdBTEEsQ0FBUDtBQU1BOztBQUVELFFBQU87QUFDTjVCLGdCQURNO0FBRU5RLGdCQUZNO0FBR05JLFlBSE07QUFJTlUsc0JBSk07QUFLTjVCO0FBTE0sRUFBUDtBQU9BIiwiZmlsZSI6Indpa2kuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCAnYmFiZWwtcG9seWZpbGwnO1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgeyBwYWdpbmF0aW9uLCBhcGkgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHdpa2lQYWdlIGZyb20gJy4vcGFnZSc7XG5cbi8qKlxuICogQG5hbWVzcGFjZVxuICogQGNvbnN0YW50XG4gKiBAcHJvcGVydHkge3N0cmluZ30gYXBpVXJsIC0gVVJMIG9mIFdpa2lwZWRpYSBBUElcbiAqL1xuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG5cdGFwaVVybDogJ2h0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3cvYXBpLnBocCdcbn07XG5cbi8qKlxuICogd2lraVxuICogQGV4YW1wbGVcbiAqIHdpa2koeyBhcGlVcmw6ICdodHRwOi8vZnIud2lraXBlZGlhLm9yZy93L2FwaS5waHAnIH0pLnNlYXJjaCguLi4pO1xuICogQG5hbWVzcGFjZSBXaWtpXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge09iamVjdH0gLSB3aWtpIChmb3IgY2hhaW5pbmcgbWV0aG9kcylcbiovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB3aWtpKG9wdGlvbnMgPSB7fSkge1xuXG5cdGlmICh0aGlzIGluc3RhbmNlb2Ygd2lraSkge1xuXHRcdGNvbnNvbGUubG9nKCdQbGVhc2UgZG8gbm90IHVzZSB3aWtpanMgXjEuMC4wIGFzIGEgY2xhc3MuIFBsZWFzZSBzZWUgdGhlIG5ldyBSRUFETUUuJyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcblx0fVxuXG5cdGNvbnN0IGFwaU9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cblx0LyoqXG5cdCAqIFNlYXJjaCBhcnRpY2xlc1xuXHQgKiBAZXhhbXBsZVxuXHQgKiB3aWtpLnNlYXJjaCgnc3RhciB3YXJzJykudGhlbihkYXRhID0+IGNvbnNvbGUubG9nKGRhdGEucmVzdWx0cy5sZW5ndGgpKTtcblx0ICogQGV4YW1wbGVcblx0ICogd2lraS5zZWFyY2goJ3N0YXIgd2FycycpLnRoZW4oZGF0YSA9PiB7XG5cdCAqIFx0ZGF0YS5uZXh0KCkudGhlbiguLi4pO1xuXHQgKiB9KTtcblx0ICogQG1ldGhvZCBXaWtpI3NlYXJjaFxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHF1ZXJ5IC0ga2V5d29yZCBxdWVyeVxuXHQgKiBAcGFyYW0gIHtOdW1iZXJ9IFtsaW1pdF0gLSBsaW1pdHMgdGhlIG51bWJlciBvZiByZXN1bHRzXG5cdCAqIEByZXR1cm4ge1Byb21pc2V9IC0gcGFnaW5hdGlvbiBwcm9taXNlIHdpdGggcmVzdWx0cyBhbmQgbmV4dCBwYWdlIGZ1bmN0aW9uXG5cdCAqL1xuXHRmdW5jdGlvbiBzZWFyY2gocXVlcnksIGxpbWl0ID0gNTApIHtcblx0XHRyZXR1cm4gcGFnaW5hdGlvbihhcGlPcHRpb25zLCB7XG5cdFx0XHRsaXN0OiAnc2VhcmNoJyxcblx0XHRcdHNyc2VhcmNoOiBxdWVyeSxcblx0XHRcdHNybGltaXQ6IGxpbWl0XG5cdFx0fSwgcmVzID0+IF8ucGx1Y2socmVzLnF1ZXJ5LnNlYXJjaCwgJ3RpdGxlJykpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJhbmRvbSBhcnRpY2xlc1xuXHQgKiBAZXhhbXBsZVxuXHQgKiB3aWtpLnJhbmRvbSgzKS50aGVuKHJlc3VsdHMgPT4gY29uc29sZS5sb2cocmVzdWx0c1swXSkpO1xuXHQgKiBAbWV0aG9kIFdpa2kjcmFuZG9tXG5cdCAqIEBwYXJhbSAge051bWJlcn0gW2xpbWl0XSAtIGxpbWl0cyB0aGUgbnVtYmVyIG9mIHJhbmRvbSBhcnRpY2xlc1xuXHQgKiBAcmV0dXJuIHtQcm9taXNlfSAtIExpc3Qgb2YgcGFnZSB0aXRsZXNcblx0ICovXG5cdGZ1bmN0aW9uIHJhbmRvbShsaW1pdCA9IDEpIHtcblx0XHRyZXR1cm4gYXBpKGFwaU9wdGlvbnMsIHtcblx0XHRcdFx0bGlzdDogJ3JhbmRvbScsXG5cdFx0XHRcdHJubmFtZXNwYWNlOiAwLFxuXHRcdFx0XHRybmxpbWl0OiBsaW1pdFxuXHRcdFx0fSlcblx0XHRcdC50aGVuKHJlcyA9PiBfLnBsdWNrKHJlcy5xdWVyeS5yYW5kb20sICd0aXRsZScpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgUGFnZVxuXHQgKiBAZXhhbXBsZVxuXHQgKiB3aWtpLnBhZ2UoJ0JhdG1hbicpLnRoZW4ocGFnZSA9PiBjb25zb2xlLmxvZyhwYWdlLnBhZ2VpZCkpO1xuXHQgKiBAbWV0aG9kIFdpa2kjcGFnZVxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHRpdGxlIC0gdGl0bGUgb2YgYXJ0aWNsZVxuXHQgKiBAcmV0dXJuIHtQcm9taXNlfVxuXHQgKi9cblx0ZnVuY3Rpb24gcGFnZSh0aXRsZSkge1xuXHRcdHJldHVybiBhcGkoYXBpT3B0aW9ucywge1xuXHRcdFx0XHRwcm9wOiAnaW5mb3xwYWdlcHJvcHMnLFxuXHRcdFx0XHRpbnByb3A6ICd1cmwnLFxuXHRcdFx0XHRwcHByb3A6ICdkaXNhbWJpZ3VhdGlvbicsXG5cdFx0XHRcdHRpdGxlczogdGl0bGVcblx0XHRcdH0pXG5cdFx0XHQudGhlbihyZXMgPT4ge1xuXHRcdFx0XHRjb25zdCBpZCA9IF8uZmluZEtleShyZXMucXVlcnkucGFnZXMsIHBhZ2UgPT4gcGFnZS50aXRsZSA9PT0gdGl0bGUpO1xuXHRcdFx0XHRpZiAoIWlkKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdObyBhcnRpY2xlIGZvdW5kJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHdpa2lQYWdlKHJlcy5xdWVyeS5wYWdlc1tpZF0sIGFwaU9wdGlvbnMpO1xuXHRcdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogR2VvZ3JhcGhpY2FsIFNlYXJjaFxuXHQgKiBAZXhhbXBsZVxuXHQgKiB3aWtpLmdlb1NlYXJjaCgzMi4zMjksIC05Ni4xMzYpLnRoZW4odGl0bGVzID0+IGNvbnNvbGUubG9nKHRpdGxlcy5sZW5ndGgpKTtcblx0ICogQG1ldGhvZCBXaWtpI2dlb1NlYXJjaFxuXHQgKiBAcGFyYW0gIHtOdW1iZXJ9IGxhdCAtIGxhdGl0dWRlXG5cdCAqIEBwYXJhbSAge051bWJlcn0gbG9uIC0gbG9uZ2l0dWRlXG5cdCAqIEBwYXJhbSAge051bWJlcn0gW3JhZGl1cz0xMDAwXSAtIHNlYXJjaCByYWRpdXMgaW4ga2lsb21ldGVycyAoZGVmYXVsdDogMWttKVxuXHQgKiBAcmV0dXJuIHtQcm9taXNlfSAtIExpc3Qgb2YgcGFnZSB0aXRsZXNcblx0ICovXG5cdGZ1bmN0aW9uIGdlb1NlYXJjaChsYXQsIGxvbiwgcmFkaXVzID0gMTAwMCkge1xuXHRcdHJldHVybiBhcGkoYXBpT3B0aW9ucywge1xuXHRcdFx0XHRsaXN0OiAnZ2Vvc2VhcmNoJyxcblx0XHRcdFx0Z3NyYWRpdXM6IHJhZGl1cyxcblx0XHRcdFx0Z3Njb29yZDogYCR7bGF0fXwke2xvbn1gXG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4ocmVzID0+IF8ucGx1Y2socmVzLnF1ZXJ5Lmdlb3NlYXJjaCwgJ3RpdGxlJykpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRzZWFyY2gsXG5cdFx0cmFuZG9tLFxuXHRcdHBhZ2UsXG5cdFx0Z2VvU2VhcmNoLFxuXHRcdG9wdGlvbnNcblx0fTtcbn1cbiJdfQ==