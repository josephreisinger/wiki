'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var datePattern = /(\d+\|\d+\|\d+)/;

var determiners = {
  age: function age(metadata) {
    if (!metadata.birth_date) {
      return;
    }
    var matches = metadata.birth_date.match(datePattern);
    if (!matches) {
      return;
    }
    var birthDate = (0, _moment2.default)(matches[1], 'YYYY|MM|DD');
    return (0, _moment2.default)().diff(birthDate, 'years');
  }
};

exports.default = determiners;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kZXRlcm1pbmVycy5qcyJdLCJuYW1lcyI6WyJkYXRlUGF0dGVybiIsImRldGVybWluZXJzIiwiYWdlIiwibWV0YWRhdGEiLCJiaXJ0aF9kYXRlIiwibWF0Y2hlcyIsIm1hdGNoIiwiYmlydGhEYXRlIiwiZGlmZiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7OztBQUVBLElBQU1BLGNBQWMsaUJBQXBCOztBQUVBLElBQU1DLGNBQWM7QUFDbEJDLE9BQUssdUJBQVk7QUFDZixRQUFJLENBQUNDLFNBQVNDLFVBQWQsRUFBMEI7QUFDeEI7QUFDRDtBQUNELFFBQU1DLFVBQVVGLFNBQVNDLFVBQVQsQ0FBb0JFLEtBQXBCLENBQTBCTixXQUExQixDQUFoQjtBQUNBLFFBQUksQ0FBQ0ssT0FBTCxFQUFjO0FBQ1o7QUFDRDtBQUNELFFBQU1FLFlBQVksc0JBQU9GLFFBQVEsQ0FBUixDQUFQLEVBQW1CLFlBQW5CLENBQWxCO0FBQ0EsV0FBTyx3QkFBU0csSUFBVCxDQUFjRCxTQUFkLEVBQXlCLE9BQXpCLENBQVA7QUFDRDtBQVhpQixDQUFwQjs7a0JBY2VOLFciLCJmaWxlIjoiZGV0ZXJtaW5lcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5cbmNvbnN0IGRhdGVQYXR0ZXJuID0gLyhcXGQrXFx8XFxkK1xcfFxcZCspLztcblxuY29uc3QgZGV0ZXJtaW5lcnMgPSB7XG4gIGFnZTogbWV0YWRhdGEgPT4ge1xuICAgIGlmICghbWV0YWRhdGEuYmlydGhfZGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBtYXRjaGVzID0gbWV0YWRhdGEuYmlydGhfZGF0ZS5tYXRjaChkYXRlUGF0dGVybik7XG4gICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGJpcnRoRGF0ZSA9IG1vbWVudChtYXRjaGVzWzFdLCAnWVlZWXxNTXxERCcpO1xuICAgIHJldHVybiBtb21lbnQoKS5kaWZmKGJpcnRoRGF0ZSwgJ3llYXJzJyk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRldGVybWluZXJzO1xuIl19