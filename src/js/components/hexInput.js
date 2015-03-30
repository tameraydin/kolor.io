var React = require('react/addons');
var AppActions = require('../actions/app-actions');
var StoreMixin = require('../mixins/StoreMixin.js');
var Utils = require('../utils/app-utils');

var _typedHexValue = false;

var HexInput = React.createClass({
  propTypes: {
    index: React.PropTypes.number.isRequired
  },
  mixins:[StoreMixin],
  componentWillUpdate: function(nextProps, nextState) {
    // avoid update for same HEX values in order to keep cursor at same point
    var inpDOM = this.refs.input.getDOMNode();
    var inpHex = inpDOM.value.toLowerCase();
    var newHex = Utils.convertRgbToHex(
      nextState.red, nextState.green, nextState.blue);

    inpHex = inpHex[0] === '#' ? inpHex.substr(1) : inpHex;
    if (inpHex === newHex) {
      _typedHexValue = inpDOM.value;
    }
  },
  _getValue: function() {
    var inputValue = (_typedHexValue !== false) ?
      _typedHexValue : '#' + Utils.convertRgbToHex(
        this.state.red, this.state.green, this.state.blue).toUpperCase();

    _typedHexValue = false;
    return inputValue;
  },
  _updateValue: function(e) {
    var validColor = Utils.convertHexToRgb(e.target.value);

    if (validColor) {
      AppActions.updateColor(this.props.index, validColor);

    } else {
      _typedHexValue = e.target.value;
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
          ref="input"
          className="color-picker__hex"
          type="text"
          spellCheck="false"
          maxLength="7"
          value={this._getValue()}
          onChange={this._updateValue}
          onBlur={this._revertValue}
          onFocus={this._selectAll} />
      </div>
    );
  }

});

module.exports = HexInput;
