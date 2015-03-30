var React = require('react/addons');
var AppActions = require('../actions/app-actions');
var StoreMixin = require('../mixins/StoreMixin.js');

var _invalidRgbValue = false;
var _getValidRgb = function(value) {
  // TODO: improve
  var match = /rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)/.exec(value);
  var isValid = match &&
    match.length > 3 &&
    Math.max(match[1], match[2], match[3]) < 256 &&
    Math.min(match[1], match[2], match[3]) > -1;

  return isValid && {
    red: parseInt(match[1]),
    green: parseInt(match[2]),
    blue: parseInt(match[3])
  };
};

var RgbInput = React.createClass({
  mixins:[StoreMixin],
  _getValue: function() {
    var inputValue = (_invalidRgbValue !== false) ?
      _invalidRgbValue : 'rgb(' +
      this.state.red + ', ' +
      this.state.green + ', ' +
      this.state.blue + ')';

    _invalidRgbValue = false;
    return inputValue;
  },
  _updateValue: function(e) {
    var validColor = _getValidRgb(e.target.value);

    if (validColor) {
      AppActions.updateColor(this.props.index, validColor);

    } else {
      _invalidRgbValue = e.target.value;
      this.forceUpdate();
    }
  },
  _revertValue: function() {
    this.forceUpdate();
  },
  _selectAll: function(e) {
    var input = e.target;
    setTimeout(function() {
      input.select();
    }, 10);
  },
  render: function() {
    return (
      <div>
        <input
          className="color-picker__rgb"
          type="text"
          spellCheck="false"
          maxLength="18"
          value={this._getValue()}
          onChange={this._updateValue}
          onBlur={this._revertValue}
          onFocus={this._selectAll} />
      </div>
    );
  }

});

module.exports = RgbInput;
