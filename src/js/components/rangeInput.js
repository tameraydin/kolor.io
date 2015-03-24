var React = require('react/addons');
var PureRenderMixin = React.addons.PureRenderMixin;

var MAX_VALUE = 255;
var MIN_VALUE = 0;

var Range = React.createClass({
  propTypes: {
    reference: React.PropTypes.string,
    val: React.PropTypes.number,
    update: React.PropTypes.func.isRequired
  },
  mixins: [PureRenderMixin],
  getInitialState: function() {
    return {
      rangeValue: this.props.val,
      inputValue: this.props.val,
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      rangeValue: nextProps.val,
      inputValue: nextProps.val,
    });
  },
  componentDidUpdate: function() {
    if (this.state.rangeValue < MIN_VALUE) {
      this._updateValue(null, MIN_VALUE);
    } else if (this.state.rangeValue > MAX_VALUE) {
      this._updateValue(null, MAX_VALUE);
    }
  },
  _revertValidValue: function(e) {
    if (e.target.value === '') {
      this.setState({
        inputValue: this.state.rangeValue
      });
    }
  },
  _updateValue: function(e, val) {
    var newVal = (typeof val !== 'undefined') ? val : e.target.value;

    if (newVal !== '') {
      if (isNaN(newVal)) {
        return;
      }

      newVal = parseInt(newVal);

      this.props.update(this.props.reference, newVal);
      this.setState({
        rangeValue: newVal,
        inputValue: newVal
      });

    } else {
      this.setState({
        inputValue: ''
      });
    }
  },
  render: function() {
    return (
      <div className="color-picker__range">
        <input
          className="color-picker__range__control"
          type="range"
          max={MAX_VALUE}
          min={MIN_VALUE}
          value={this.state.rangeValue}
          onChange={this._updateValue} />
        <input
          className="color-picker__range__value"
          type="text"
          maxLength="3"
          value={this.state.inputValue}
          onChange={this._updateValue}
          onBlur={this._revertValidValue} />
      </div>
    );
  }
});

module.exports = Range;