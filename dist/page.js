'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = wikiPage;

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _util = require('./util');

var _determiners = require('./determiners');

var _determiners2 = _interopRequireDefault(_determiners);

var _wikiInfoboxParserCore = require('wiki-infobox-parser-core');

var _wikiInfoboxParserCore2 = _interopRequireDefault(_wikiInfoboxParserCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function markupParser(data) {
	return new Promise(function (resolve, reject) {
		(0, _wikiInfoboxParserCore2.default)(data, function (err, resultString) {
			if (err) {
				reject(err);
			} else {
				resolve(JSON.parse(resultString));
			}
		});
	});
}

/**
 * WikiPage
 * @namespace WikiPage
 */
function wikiPage(rawPageInfo, apiOptions) {

	var raw = rawPageInfo;

	/**
  * HTML from page
  * @example
  * wiki.page('batman').then(page => page.html()).then(console.log);
  * @method WikiPage#html
  * @return {Promise}
  */
	function html() {
		return (0, _util.api)(apiOptions, {
			prop: 'revisions',
			rvprop: 'content',
			rvlimit: 1,
			rvparse: '',
			titles: raw.title
		}).then(function (res) {
			return res.query.pages[raw.pageid].revisions[0]['*'];
		});
	}

	/**
  * Text content from page
  * @example
  * wiki.page('batman').then(page => page.content()).then(console.log);
  * @method WikiPage#content
  * @return {Promise}
  */
	function content() {
		return (0, _util.api)(apiOptions, {
			prop: 'extracts',
			explaintext: '',
			titles: raw.title
		}).then(function (res) {
			return res.query.pages[raw.pageid].extract;
		});
	}

	/**
  * Text summary from page
  * @example
  * wiki.page('batman').then(page => page.summary()).then(console.log);
  * @method WikiPage#summary
  * @return {Promise}
  */
	function summary() {
		return (0, _util.api)(apiOptions, {
			prop: 'extracts',
			explaintext: '',
			exintro: '',
			titles: raw.title
		}).then(function (res) {
			return res.query.pages[raw.pageid].extract;
		});
	}

	/**
  * Raw data from images from page
  * @example
  * wiki.page('batman').then(page => page.rawImages()).then(console.log);
  * @method WikiPage#rawImages
  * @return {Promise}
  */
	function rawImages() {
		return (0, _util.api)(apiOptions, {
			generator: 'images',
			gimlimit: 'max',
			prop: 'imageinfo',
			iiprop: 'url',
			titles: raw.title
		}).then(function (res) {
			if (res.query) {
				return _underscore2.default.values(res.query.pages);
			}
			return [];
		});
	}

	/**
  * Main image URL from infobox on page
  * @example
  * wiki.page('batman').then(page => page.mainImage()).then(console.log);
  * @method WikiPage#mainImage
  * @return {Promise}
  */
	function mainImage() {
		return Promise.all([rawImages(), info()]).then(function (_ref) {
			var _ref2 = _slicedToArray(_ref, 2);

			var images = _ref2[0];
			var info = _ref2[1];

			var image = images.find(function (image) {
				return image.title === 'File:' + info.image;
			});
			return image.imageinfo.length > 0 ? image.imageinfo[0].url : undefined;
		});
	}

	/**
  * Image URL's from page
  * @example
  * wiki.page('batman').then(page => page.image()).then(console.log);
  * @method WikiPage#images
  * @return {Promise}
  */
	function images() {
		return rawImages().then(function (images) {
			return _underscore2.default.chain(images).pluck('imageinfo').flatten().pluck('url').value();
		});
	}

	/**
  * References from page
  * @example
  * wiki.page('batman').then(page => page.references()).then(console.log);
  * @method WikiPage#references
  * @return {Promise}
  */
	function references() {
		return (0, _util.api)(apiOptions, {
			prop: 'extlinks',
			ellimit: 'max',
			titles: raw.title
		}).then(function (res) {
			return _underscore2.default.pluck(res.query.pages[raw.pageid].extlinks, '*');
		});
	}

	/**
  * Paginated links from page
  * @example
  * wiki.page('batman').then(page => page.links()).then(console.log);
  * @method WikiPage#links
  * @param  {Boolean} [aggregated] - return all links (default is true)
  * @param  {Number} [limit] - number of links per page
  * @return {Promise} - returns results if aggregated [and next function for more results if not aggregated]
  */
	function links() {
		var aggregated = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
		var limit = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];

		var _pagination = (0, _util.pagination)(apiOptions, {
			prop: 'links',
			plnamespace: 0,
			pllimit: limit,
			titles: raw.title
		}, function (res) {
			return _underscore2.default.pluck(res.query.pages[raw.pageid].links, 'title');
		});
		if (aggregated) {
			return (0, _util.aggregatePagination)(_pagination);
		}
		return _pagination;
	}

	/**
  * Paginated categories from page
  * @example
  * wiki.page('batman').then(page => page.categories()).then(console.log);
  * @method WikiPage#categories
  * @param  {Boolean} [aggregated] - return all categories (default is true)
  * @param  {Number} [limit] - number of categories per page
  * @param  {Boolean} [includeHidden] - include hidden categories
  * @return {Promise} - returns results if aggregated [and next function for more results if not aggregated]
  */
	function categories() {
		var aggregated = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
		var limit = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];
		var includeHidden = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

		var _pagination = (0, _util.pagination)(apiOptions, {
			prop: 'categories',
			pllimit: limit,
			clshow: includeHidden ? null : '!hidden',
			titles: raw.title
		}, function (res) {
			return _underscore2.default.pluck(res.query.pages[raw.pageid].categories, 'title');
		});
		if (aggregated) {
			return (0, _util.aggregatePagination)(_pagination);
		}
		return _pagination;
	}

	/**
  * Geographical coordinates from page
  * @example
  * wiki().page('Texas').then(texas => texas.coordinates())
  * @method WikiPage#coordinates
  * @return {Promise}
  */
	function coordinates() {
		return (0, _util.api)(apiOptions, {
			prop: 'coordinates',
			titles: raw.title
		}).then(function (res) {
			return res.query.pages[raw.pageid].coordinates[0];
		});
	}

	/**
  * Get information from page
  * @example
  * new Wiki().page('Batman').then(page => page.info('alter_ego'));
  * @method WikiPage#info
  * @param  {String} [key] - Information key
  * @return {Promise} - info Object contains key/value pairs of infobox data, or specific value if key given
  */
	function info(key) {
		return (0, _util.api)(apiOptions, {
			prop: 'revisions',
			rvprop: 'content',
			rvsection: 0,
			titles: raw.title
		}).then(function (res) {
			return markupParser(JSON.stringify(res));
		}).then(function (metadata) {
			if (!key) {
				return metadata;
			}
			if (metadata.hasOwnProperty(key)) {
				return metadata[key];
			}
			if (_determiners2.default.hasOwnProperty(key)) {
				var value = _determiners2.default[key](metadata);
				if (value) {
					return value;
				}
			}
			return undefined;
		});
	}

	/**
  * Paginated backlinks from page
  * @method WikiPage#backlinks
  * @param  {Boolean} [aggregated] - return all backlinks (default is true)
  * @param  {Number} [limit] - number of backlinks per page
  * @return {Promise} - includes results [and next function for more results if not aggregated]
  */
	function backlinks() {
		var aggregated = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
		var limit = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];

		var _pagination = (0, _util.pagination)(apiOptions, {
			list: 'backlinks',
			bllimit: limit,
			bltitle: raw.title
		}, function (res) {
			return _underscore2.default.pluck(res.query.backlinks, 'title');
		});
		if (aggregated) {
			return (0, _util.aggregatePagination)(_pagination);
		}
		return _pagination;
	}

	var page = {
		raw: raw,
		html: html,
		content: content,
		summary: summary,
		images: images,
		references: references,
		links: links,
		categories: categories,
		coordinates: coordinates,
		info: info,
		backlinks: backlinks,
		rawImages: rawImages,
		mainImage: mainImage
	};

	return page;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYWdlLmpzIl0sIm5hbWVzIjpbIndpa2lQYWdlIiwibWFya3VwUGFyc2VyIiwiZGF0YSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZXJyIiwicmVzdWx0U3RyaW5nIiwiSlNPTiIsInBhcnNlIiwicmF3UGFnZUluZm8iLCJhcGlPcHRpb25zIiwicmF3IiwiaHRtbCIsInByb3AiLCJydnByb3AiLCJydmxpbWl0IiwicnZwYXJzZSIsInRpdGxlcyIsInRpdGxlIiwidGhlbiIsInJlcyIsInF1ZXJ5IiwicGFnZXMiLCJwYWdlaWQiLCJyZXZpc2lvbnMiLCJjb250ZW50IiwiZXhwbGFpbnRleHQiLCJleHRyYWN0Iiwic3VtbWFyeSIsImV4aW50cm8iLCJyYXdJbWFnZXMiLCJnZW5lcmF0b3IiLCJnaW1saW1pdCIsImlpcHJvcCIsInZhbHVlcyIsIm1haW5JbWFnZSIsImFsbCIsImluZm8iLCJpbWFnZXMiLCJpbWFnZSIsImZpbmQiLCJpbWFnZWluZm8iLCJsZW5ndGgiLCJ1cmwiLCJ1bmRlZmluZWQiLCJjaGFpbiIsInBsdWNrIiwiZmxhdHRlbiIsInZhbHVlIiwicmVmZXJlbmNlcyIsImVsbGltaXQiLCJleHRsaW5rcyIsImxpbmtzIiwiYWdncmVnYXRlZCIsImxpbWl0IiwiX3BhZ2luYXRpb24iLCJwbG5hbWVzcGFjZSIsInBsbGltaXQiLCJjYXRlZ29yaWVzIiwiaW5jbHVkZUhpZGRlbiIsImNsc2hvdyIsImNvb3JkaW5hdGVzIiwia2V5IiwicnZzZWN0aW9uIiwic3RyaW5naWZ5IiwibWV0YWRhdGEiLCJoYXNPd25Qcm9wZXJ0eSIsImJhY2tsaW5rcyIsImxpc3QiLCJibGxpbWl0IiwiYmx0aXRsZSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O2tCQXFCd0JBLFE7O0FBckJ4Qjs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLFNBQVNDLFlBQVQsQ0FBc0JDLElBQXRCLEVBQTRCO0FBQzNCLFFBQU8sSUFBSUMsT0FB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OlsiaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgeyBhZ2dyZWdhdGVQYWdpbmF0aW9uLCBwYWdpbmF0aW9uLCBhcGkgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IGRldGVybWluZXJzIGZyb20gJy4vZGV0ZXJtaW5lcnMnO1xuaW1wb3J0IHdpa2lJbmZvYm94UGFyc2VyIGZyb20gJ3dpa2ktaW5mb2JveC1wYXJzZXItY29yZSc7XG5cbmZ1bmN0aW9uIG1hcmt1cFBhcnNlcihkYXRhKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0d2lraUluZm9ib3hQYXJzZXIoZGF0YSwgKGVyciwgcmVzdWx0U3RyaW5nKSA9PiB7XG5cdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdHJlamVjdChlcnIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzb2x2ZShKU09OLnBhcnNlKHJlc3VsdFN0cmluZykpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBXaWtpUGFnZVxuICogQG5hbWVzcGFjZSBXaWtpUGFnZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB3aWtpUGFnZShyYXdQYWdlSW5mbywgYXBpT3B0aW9ucykge1xuXG5cdGNvbnN0IHJhdyA9IHJhd1BhZ2VJbmZvO1xuXG5cdC8qKlxuXHQgKiBIVE1MIGZyb20gcGFnZVxuXHQgKiBAZXhhbXBsZVxuXHQgKiB3aWtpLnBhZ2UoJ2JhdG1hbicpLnRoZW4ocGFnZSA9PiBwYWdlLmh0bWwoKSkudGhlbihjb25zb2xlLmxvZyk7XG5cdCAqIEBtZXRob2QgV2lraVBhZ2UjaHRtbFxuXHQgKiBAcmV0dXJuIHtQcm9taXNlfVxuXHQgKi9cblx0ZnVuY3Rpb24gaHRtbCgpIHtcblx0XHRyZXR1cm4gYXBpKGFwaU9wdGlvbnMsIHtcblx0XHRcdFx0cHJvcDogJ3JldmlzaW9ucycsXG5cdFx0XHRcdHJ2cHJvcDogJ2NvbnRlbnQnLFxuXHRcdFx0XHRydmxpbWl0OiAxLFxuXHRcdFx0XHRydnBhcnNlOiAnJyxcblx0XHRcdFx0dGl0bGVzOiByYXcudGl0bGVcblx0XHRcdH0pXG5cdFx0XHQudGhlbihyZXMgPT4gcmVzLnF1ZXJ5LnBhZ2VzW3Jhdy5wYWdlaWRdLnJldmlzaW9uc1swXVsnKiddKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUZXh0IGNvbnRlbnQgZnJvbSBwYWdlXG5cdCAqIEBleGFtcGxlXG5cdCAqIHdpa2kucGFnZSgnYmF0bWFuJykudGhlbihwYWdlID0+IHBhZ2UuY29udGVudCgpKS50aGVuKGNvbnNvbGUubG9nKTtcblx0ICogQG1ldGhvZCBXaWtpUGFnZSNjb250ZW50XG5cdCAqIEByZXR1cm4ge1Byb21pc2V9XG5cdCAqL1xuXHRmdW5jdGlvbiBjb250ZW50KCkge1xuXHRcdHJldHVybiBhcGkoYXBpT3B0aW9ucywge1xuXHRcdFx0XHRwcm9wOiAnZXh0cmFjdHMnLFxuXHRcdFx0XHRleHBsYWludGV4dDogJycsXG5cdFx0XHRcdHRpdGxlczogcmF3LnRpdGxlXG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4ocmVzID0+IHJlcy5xdWVyeS5wYWdlc1tyYXcucGFnZWlkXS5leHRyYWN0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUZXh0IHN1bW1hcnkgZnJvbSBwYWdlXG5cdCAqIEBleGFtcGxlXG5cdCAqIHdpa2kucGFnZSgnYmF0bWFuJykudGhlbihwYWdlID0+IHBhZ2Uuc3VtbWFyeSgpKS50aGVuKGNvbnNvbGUubG9nKTtcblx0ICogQG1ldGhvZCBXaWtpUGFnZSNzdW1tYXJ5XG5cdCAqIEByZXR1cm4ge1Byb21pc2V9XG5cdCAqL1xuXHRmdW5jdGlvbiBzdW1tYXJ5KCkge1xuXHRcdHJldHVybiBhcGkoYXBpT3B0aW9ucywge1xuXHRcdFx0XHRwcm9wOiAnZXh0cmFjdHMnLFxuXHRcdFx0XHRleHBsYWludGV4dDogJycsXG5cdFx0XHRcdGV4aW50cm86ICcnLFxuXHRcdFx0XHR0aXRsZXM6IHJhdy50aXRsZVxuXHRcdFx0fSlcblx0XHRcdC50aGVuKHJlcyA9PiByZXMucXVlcnkucGFnZXNbcmF3LnBhZ2VpZF0uZXh0cmFjdCk7XG5cdH1cblxuXHQvKipcblx0ICogUmF3IGRhdGEgZnJvbSBpbWFnZXMgZnJvbSBwYWdlXG5cdCAqIEBleGFtcGxlXG5cdCAqIHdpa2kucGFnZSgnYmF0bWFuJykudGhlbihwYWdlID0+IHBhZ2UucmF3SW1hZ2VzKCkpLnRoZW4oY29uc29sZS5sb2cpO1xuXHQgKiBAbWV0aG9kIFdpa2lQYWdlI3Jhd0ltYWdlc1xuXHQgKiBAcmV0dXJuIHtQcm9taXNlfVxuXHQgKi9cblx0ZnVuY3Rpb24gcmF3SW1hZ2VzKCkge1xuXHRcdHJldHVybiBhcGkoYXBpT3B0aW9ucywge1xuXHRcdFx0XHRnZW5lcmF0b3I6ICdpbWFnZXMnLFxuXHRcdFx0XHRnaW1saW1pdDogJ21heCcsXG5cdFx0XHRcdHByb3A6ICdpbWFnZWluZm8nLFxuXHRcdFx0XHRpaXByb3A6ICd1cmwnLFxuXHRcdFx0XHR0aXRsZXM6IHJhdy50aXRsZVxuXHRcdFx0fSlcblx0XHRcdC50aGVuKHJlcyA9PiB7XG5cdFx0XHRcdGlmIChyZXMucXVlcnkpIHtcblx0XHRcdFx0XHRyZXR1cm4gXy52YWx1ZXMocmVzLnF1ZXJ5LnBhZ2VzKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNYWluIGltYWdlIFVSTCBmcm9tIGluZm9ib3ggb24gcGFnZVxuXHQgKiBAZXhhbXBsZVxuXHQgKiB3aWtpLnBhZ2UoJ2JhdG1hbicpLnRoZW4ocGFnZSA9PiBwYWdlLm1haW5JbWFnZSgpKS50aGVuKGNvbnNvbGUubG9nKTtcblx0ICogQG1ldGhvZCBXaWtpUGFnZSNtYWluSW1hZ2Vcblx0ICogQHJldHVybiB7UHJvbWlzZX1cblx0ICovXG5cdGZ1bmN0aW9uIG1haW5JbWFnZSgpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoW3Jhd0ltYWdlcygpLCBpbmZvKCldKVxuXHRcdFx0LnRoZW4oKFtpbWFnZXMsIGluZm9dKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGltYWdlID0gaW1hZ2VzLmZpbmQoaW1hZ2UgPT4gaW1hZ2UudGl0bGUgPT09IGBGaWxlOiR7aW5mby5pbWFnZX1gKTtcblx0XHRcdFx0cmV0dXJuIGltYWdlLmltYWdlaW5mby5sZW5ndGggPiAwID8gaW1hZ2UuaW1hZ2VpbmZvWzBdLnVybCA6IHVuZGVmaW5lZDtcblx0XHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEltYWdlIFVSTCdzIGZyb20gcGFnZVxuXHQgKiBAZXhhbXBsZVxuXHQgKiB3aWtpLnBhZ2UoJ2JhdG1hbicpLnRoZW4ocGFnZSA9PiBwYWdlLmltYWdlKCkpLnRoZW4oY29uc29sZS5sb2cpO1xuXHQgKiBAbWV0aG9kIFdpa2lQYWdlI2ltYWdlc1xuXHQgKiBAcmV0dXJuIHtQcm9taXNlfVxuXHQgKi9cblx0ZnVuY3Rpb24gaW1hZ2VzKCkge1xuXHRcdHJldHVybiByYXdJbWFnZXMoKVxuXHRcdFx0LnRoZW4oaW1hZ2VzID0+IHtcblx0XHRcdFx0cmV0dXJuIF8uY2hhaW4oaW1hZ2VzKVxuXHRcdFx0XHRcdC5wbHVjaygnaW1hZ2VpbmZvJylcblx0XHRcdFx0XHQuZmxhdHRlbigpXG5cdFx0XHRcdFx0LnBsdWNrKCd1cmwnKVxuXHRcdFx0XHRcdC52YWx1ZSgpO1xuXHRcdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogUmVmZXJlbmNlcyBmcm9tIHBhZ2Vcblx0ICogQGV4YW1wbGVcblx0ICogd2lraS5wYWdlKCdiYXRtYW4nKS50aGVuKHBhZ2UgPT4gcGFnZS5yZWZlcmVuY2VzKCkpLnRoZW4oY29uc29sZS5sb2cpO1xuXHQgKiBAbWV0aG9kIFdpa2lQYWdlI3JlZmVyZW5jZXNcblx0ICogQHJldHVybiB7UHJvbWlzZX1cblx0ICovXG5cdGZ1bmN0aW9uIHJlZmVyZW5jZXMoKSB7XG5cdFx0cmV0dXJuIGFwaShhcGlPcHRpb25zLCB7XG5cdFx0XHRcdHByb3A6ICdleHRsaW5rcycsXG5cdFx0XHRcdGVsbGltaXQ6ICdtYXgnLFxuXHRcdFx0XHR0aXRsZXM6IHJhdy50aXRsZVxuXHRcdFx0fSlcblx0XHRcdC50aGVuKHJlcyA9PiBfLnBsdWNrKHJlcy5xdWVyeS5wYWdlc1tyYXcucGFnZWlkXS5leHRsaW5rcywgJyonKSk7XG5cdH1cblxuXHQvKipcblx0ICogUGFnaW5hdGVkIGxpbmtzIGZyb20gcGFnZVxuXHQgKiBAZXhhbXBsZVxuXHQgKiB3aWtpLnBhZ2UoJ2JhdG1hbicpLnRoZW4ocGFnZSA9PiBwYWdlLmxpbmtzKCkpLnRoZW4oY29uc29sZS5sb2cpO1xuXHQgKiBAbWV0aG9kIFdpa2lQYWdlI2xpbmtzXG5cdCAqIEBwYXJhbSAge0Jvb2xlYW59IFthZ2dyZWdhdGVkXSAtIHJldHVybiBhbGwgbGlua3MgKGRlZmF1bHQgaXMgdHJ1ZSlcblx0ICogQHBhcmFtICB7TnVtYmVyfSBbbGltaXRdIC0gbnVtYmVyIG9mIGxpbmtzIHBlciBwYWdlXG5cdCAqIEByZXR1cm4ge1Byb21pc2V9IC0gcmV0dXJucyByZXN1bHRzIGlmIGFnZ3JlZ2F0ZWQgW2FuZCBuZXh0IGZ1bmN0aW9uIGZvciBtb3JlIHJlc3VsdHMgaWYgbm90IGFnZ3JlZ2F0ZWRdXG5cdCAqL1xuXHRmdW5jdGlvbiBsaW5rcyhhZ2dyZWdhdGVkID0gdHJ1ZSwgbGltaXQgPSAxMDApIHtcblx0XHRjb25zdCBfcGFnaW5hdGlvbiA9IHBhZ2luYXRpb24oYXBpT3B0aW9ucywge1xuXHRcdFx0cHJvcDogJ2xpbmtzJyxcblx0XHRcdHBsbmFtZXNwYWNlOiAwLFxuXHRcdFx0cGxsaW1pdDogbGltaXQsXG5cdFx0XHR0aXRsZXM6IHJhdy50aXRsZVxuXHRcdH0sIHJlcyA9PiBfLnBsdWNrKHJlcy5xdWVyeS5wYWdlc1tyYXcucGFnZWlkXS5saW5rcywgJ3RpdGxlJykpO1xuXHRcdGlmIChhZ2dyZWdhdGVkKSB7XG5cdFx0XHRyZXR1cm4gYWdncmVnYXRlUGFnaW5hdGlvbihfcGFnaW5hdGlvbik7XG5cdFx0fVxuXHRcdHJldHVybiBfcGFnaW5hdGlvbjtcblx0fVxuXG5cdC8qKlxuXHQgKiBQYWdpbmF0ZWQgY2F0ZWdvcmllcyBmcm9tIHBhZ2Vcblx0ICogQGV4YW1wbGVcblx0ICogd2lraS5wYWdlKCdiYXRtYW4nKS50aGVuKHBhZ2UgPT4gcGFnZS5jYXRlZ29yaWVzKCkpLnRoZW4oY29uc29sZS5sb2cpO1xuXHQgKiBAbWV0aG9kIFdpa2lQYWdlI2NhdGVnb3JpZXNcblx0ICogQHBhcmFtICB7Qm9vbGVhbn0gW2FnZ3JlZ2F0ZWRdIC0gcmV0dXJuIGFsbCBjYXRlZ29yaWVzIChkZWZhdWx0IGlzIHRydWUpXG5cdCAqIEBwYXJhbSAge051bWJlcn0gW2xpbWl0XSAtIG51bWJlciBvZiBjYXRlZ29yaWVzIHBlciBwYWdlXG5cdCAqIEBwYXJhbSAge0Jvb2xlYW59IFtpbmNsdWRlSGlkZGVuXSAtIGluY2x1ZGUgaGlkZGVuIGNhdGVnb3JpZXNcblx0ICogQHJldHVybiB7UHJvbWlzZX0gLSByZXR1cm5zIHJlc3VsdHMgaWYgYWdncmVnYXRlZCBbYW5kIG5leHQgZnVuY3Rpb24gZm9yIG1vcmUgcmVzdWx0cyBpZiBub3QgYWdncmVnYXRlZF1cblx0ICovXG5cdGZ1bmN0aW9uIGNhdGVnb3JpZXMoYWdncmVnYXRlZCA9IHRydWUsIGxpbWl0ID0gMTAwLCBpbmNsdWRlSGlkZGVuID0gZmFsc2UpIHtcblx0XHRjb25zdCBfcGFnaW5hdGlvbiA9IHBhZ2luYXRpb24oYXBpT3B0aW9ucywge1xuXHRcdFx0cHJvcDogJ2NhdGVnb3JpZXMnLFxuXHRcdFx0cGxsaW1pdDogbGltaXQsXG4gICAgICBjbHNob3c6IGluY2x1ZGVIaWRkZW4gPyBudWxsIDogJyFoaWRkZW4nLFxuXHRcdFx0dGl0bGVzOiByYXcudGl0bGVcblx0XHR9LCByZXMgPT4gXy5wbHVjayhyZXMucXVlcnkucGFnZXNbcmF3LnBhZ2VpZF0uY2F0ZWdvcmllcywgJ3RpdGxlJykpO1xuXHRcdGlmIChhZ2dyZWdhdGVkKSB7XG5cdFx0XHRyZXR1cm4gYWdncmVnYXRlUGFnaW5hdGlvbihfcGFnaW5hdGlvbik7XG5cdFx0fVxuXHRcdHJldHVybiBfcGFnaW5hdGlvbjtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZW9ncmFwaGljYWwgY29vcmRpbmF0ZXMgZnJvbSBwYWdlXG5cdCAqIEBleGFtcGxlXG5cdCAqIHdpa2koKS5wYWdlKCdUZXhhcycpLnRoZW4odGV4YXMgPT4gdGV4YXMuY29vcmRpbmF0ZXMoKSlcblx0ICogQG1ldGhvZCBXaWtpUGFnZSNjb29yZGluYXRlc1xuXHQgKiBAcmV0dXJuIHtQcm9taXNlfVxuXHQgKi9cblx0ZnVuY3Rpb24gY29vcmRpbmF0ZXMoKSB7XG5cdFx0cmV0dXJuIGFwaShhcGlPcHRpb25zLCB7XG5cdFx0XHRcdHByb3A6ICdjb29yZGluYXRlcycsXG5cdFx0XHRcdHRpdGxlczogcmF3LnRpdGxlXG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4ocmVzID0+IHJlcy5xdWVyeS5wYWdlc1tyYXcucGFnZWlkXS5jb29yZGluYXRlc1swXSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IGluZm9ybWF0aW9uIGZyb20gcGFnZVxuXHQgKiBAZXhhbXBsZVxuXHQgKiBuZXcgV2lraSgpLnBhZ2UoJ0JhdG1hbicpLnRoZW4ocGFnZSA9PiBwYWdlLmluZm8oJ2FsdGVyX2VnbycpKTtcblx0ICogQG1ldGhvZCBXaWtpUGFnZSNpbmZvXG5cdCAqIEBwYXJhbSAge1N0cmluZ30gW2tleV0gLSBJbmZvcm1hdGlvbiBrZXlcblx0ICogQHJldHVybiB7UHJvbWlzZX0gLSBpbmZvIE9iamVjdCBjb250YWlucyBrZXkvdmFsdWUgcGFpcnMgb2YgaW5mb2JveCBkYXRhLCBvciBzcGVjaWZpYyB2YWx1ZSBpZiBrZXkgZ2l2ZW5cblx0ICovXG5cdGZ1bmN0aW9uIGluZm8oa2V5KSB7XG5cdFx0cmV0dXJuIGFwaShhcGlPcHRpb25zLCB7XG5cdFx0XHRcdHByb3A6ICdyZXZpc2lvbnMnLFxuXHRcdFx0XHRydnByb3A6ICdjb250ZW50Jyxcblx0XHRcdFx0cnZzZWN0aW9uOiAwLFxuXHRcdFx0XHR0aXRsZXM6IHJhdy50aXRsZVxuXHRcdFx0fSlcblx0XHRcdC50aGVuKHJlcyA9PiBtYXJrdXBQYXJzZXIoSlNPTi5zdHJpbmdpZnkocmVzKSkpXG5cdFx0XHQudGhlbihtZXRhZGF0YSA9PiB7XG5cdFx0XHRcdGlmICgha2V5KSB7XG5cdFx0XHRcdFx0cmV0dXJuIG1ldGFkYXRhO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChtZXRhZGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG1ldGFkYXRhW2tleV07XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGRldGVybWluZXJzLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdFx0XHRjb25zdCB2YWx1ZSA9IGRldGVybWluZXJzW2tleV0obWV0YWRhdGEpO1xuXHRcdFx0XHRcdGlmICh2YWx1ZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogUGFnaW5hdGVkIGJhY2tsaW5rcyBmcm9tIHBhZ2Vcblx0ICogQG1ldGhvZCBXaWtpUGFnZSNiYWNrbGlua3Ncblx0ICogQHBhcmFtICB7Qm9vbGVhbn0gW2FnZ3JlZ2F0ZWRdIC0gcmV0dXJuIGFsbCBiYWNrbGlua3MgKGRlZmF1bHQgaXMgdHJ1ZSlcblx0ICogQHBhcmFtICB7TnVtYmVyfSBbbGltaXRdIC0gbnVtYmVyIG9mIGJhY2tsaW5rcyBwZXIgcGFnZVxuXHQgKiBAcmV0dXJuIHtQcm9taXNlfSAtIGluY2x1ZGVzIHJlc3VsdHMgW2FuZCBuZXh0IGZ1bmN0aW9uIGZvciBtb3JlIHJlc3VsdHMgaWYgbm90IGFnZ3JlZ2F0ZWRdXG5cdCAqL1xuXHRmdW5jdGlvbiBiYWNrbGlua3MoYWdncmVnYXRlZCA9IHRydWUsIGxpbWl0ID0gMTAwKSB7XG5cdFx0Y29uc3QgX3BhZ2luYXRpb24gPSBwYWdpbmF0aW9uKGFwaU9wdGlvbnMsIHtcblx0XHRcdGxpc3Q6ICdiYWNrbGlua3MnLFxuXHRcdFx0YmxsaW1pdDogbGltaXQsXG5cdFx0XHRibHRpdGxlOiByYXcudGl0bGVcblx0XHR9LCByZXMgPT4gXy5wbHVjayhyZXMucXVlcnkuYmFja2xpbmtzLCAndGl0bGUnKSk7XG5cdFx0aWYgKGFnZ3JlZ2F0ZWQpIHtcblx0XHRcdHJldHVybiBhZ2dyZWdhdGVQYWdpbmF0aW9uKF9wYWdpbmF0aW9uKTtcblx0XHR9XG5cdFx0cmV0dXJuIF9wYWdpbmF0aW9uO1xuXHR9XG5cblx0Y29uc3QgcGFnZSA9IHtcblx0XHRyYXcsXG5cdFx0aHRtbCxcblx0XHRjb250ZW50LFxuXHRcdHN1bW1hcnksXG5cdFx0aW1hZ2VzLFxuXHRcdHJlZmVyZW5jZXMsXG5cdFx0bGlua3MsXG5cdFx0Y2F0ZWdvcmllcyxcblx0XHRjb29yZGluYXRlcyxcblx0XHRpbmZvLFxuXHRcdGJhY2tsaW5rcyxcblx0XHRyYXdJbWFnZXMsXG5cdFx0bWFpbkltYWdlXG5cdH07XG5cbiAgcmV0dXJuIHBhZ2U7XG59XG4iXX0=