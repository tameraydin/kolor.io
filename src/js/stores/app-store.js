var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var EventEmitter = require('events').EventEmitter;
var Utils = require('../utils/app-utils');
var navigate = require('react-mini-router').navigate;
var assign = require('object-assign');
var _ = require('lodash');

var CHANGE_EVENT = 'change';

var Color = function(reference) {
  this.red = 0;
  this.green = 0;
  this.blue = 0;

  if (reference) {
    _.assign(this, reference);
  }
};

Color.prototype = {
  update: function(newColorObj) {
    if (newColorObj) {
      _.assign(this, newColorObj);
    }
  }
};

var Colors = function() {
  this.list = [];
};

Colors.prototype = {
  setList: function(list) {
    _.forEach(list, function(color) {
      color = new Color(color);
    });

    this.list = list;
  },
  add: function(newColorObj) {
    var index = this.list.push(new Color(newColorObj));
    return index;
  },
  update: function(index, newColorObj) {
    this.list[index].update(newColorObj);
    return true;
  },
  getColor: function(index) {
    return this.list[index];
  },
  getHexValues: function() {
    var hexValues = [];
    var listLength = this.list.length;
    var i;

    for (i = 0; i < listLength; i++) {
      var color = this.list[i];

      hexValues.push(
        Utils.convertRgbToHex(color.red, color.green, color.blue));
    }

    return hexValues;
  }
};

var _colors = new Colors();

var _niceHexColors = [
  {red: 37, green: 154, blue: 200},
  {red: 255, green: 203, blue: 180},
  {red: 66, green: 203, blue: 179},
  {red: 253, green: 184, blue: 32},
  {red: 181, green: 160, blue: 255},
  {red: 14, green: 115, blue: 122},
  {red: 153, green: 46, blue: 62}
];
var _getANiceColor = function() {
  return new Color(_niceHexColors[
    Math.floor(Math.random() * (_niceHexColors.length))]);
};
var _getARandomColor = function() {
  return new Color({
    red: Math.floor(Math.random() * 255),
    green: Math.floor(Math.random() * 255),
    blue: Math.floor(Math.random() * 255)
  });
};

var _lastUrl = '';
var _isUrlManipulated = false;
var _urlUpdateTimer = null;
var _updateUrlTo = function(url, emitChange, timeout) {
  clearTimeout(_urlUpdateTimer);
  _urlUpdateTimer = setTimeout(function() {
    if (!emitChange) {
      _isUrlManipulated = true;
    }
    _lastUrl = '/' + url;
    navigate(_lastUrl);
  }, typeof timeout === 'number' ? timeout : AppConstants.URL_UPDATE_TIMEOUT);
};

var AppStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getColor: function(index) {
    return _colors.getColor(index);
  },
  getColorList: function() {
    return _colors.list;
  },
  getLastUrl: function() {
    return _lastUrl;
  }
});
AppStore.setMaxListeners(0);

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case AppConstants.SET_COLOR_LIST:
      _colors.list = [];

      var colorsLength = action.colors.length;
      var i;

      for (i = 0; i < colorsLength; i++) {
        if (i < AppConstants.MAX_COLOR &&
          Utils.isValidHexColor(action.colors[i])) {
          _colors.add(Utils.convertHexToRgb(action.colors[i]));
        }
      }

      if (_colors.list.length === 0) {
        var lastVisitedColors = window.localStorage.getItem(
          AppConstants.LAST_VISITED_COLORS);

        lastVisitedColors = lastVisitedColors ?
          JSON.parse(lastVisitedColors) : lastVisitedColors;

        if (lastVisitedColors && lastVisitedColors.length) {
          _colors.setList(lastVisitedColors);

        } else {
          _colors.add(_getANiceColor());
        }

      } else {
        window.localStorage.setItem(AppConstants.LAST_VISITED_COLORS,
          JSON.stringify(_colors.list));
      }

      _updateUrlTo(_colors.getHexValues().join(','), true, 0);
      break;

    case AppConstants.ADD_COLOR:
      var length = _colors.add(action.color || _getARandomColor());
      if (length > AppConstants.MAX_COLOR) {
        _colors.list.splice(length - 2, 1);
      }
      _updateUrlTo(_colors.getHexValues().join(','), true, 0);
      break;

    case AppConstants.UPDATE_COLOR:
      _colors.update(action.index, action.color);
      _updateUrlTo(_colors.getHexValues().join(','), false);
      break;

    case AppConstants.REMOVE_COLOR:
      _colors.list.splice(action.index, 1);
      _updateUrlTo(_colors.getHexValues().join(','), true, 0);
      break;

    case AppConstants.RANDOMIZE:
      if (typeof action.index !== 'undefined') {
        _colors.update(action.index, _getARandomColor());

      } else {
        for (i = 0; i < _colors.list.length; i++) {
          _colors.update(i, _getARandomColor());
        }
      }
      _updateUrlTo(_colors.getHexValues().join(','), true, 0);
      break;
  }

  if (!_isUrlManipulated) {
    AppStore.emitChange();
  }
  _isUrlManipulated = false;
  return true;
});

module.exports = AppStore;
