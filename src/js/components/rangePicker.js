var React = require('react/addons');
var PureRenderMixin = React.addons.PureRenderMixin;
var RangeInput = require('./rangeInput');
var AppActions = require('../actions/app-actions');
var StoreMixin = require('../mixins/StoreMixin.js');

var RangePicker = React.createClass({
  propTypes: {
    index: React.PropTypes.number.isRequired
  },
  mixins:[PureRenderMixin, StoreMixin],
  _updateColorValue: function(ref, val) {
    this.state[ref] = val;
    AppActions.updateColor(this.props.index, this.state);
  },
  render: function() {
    return (
      <div>
        <RangeInput
          reference="red"
          val={this.state.red}
          update={this._updateColorValue} />
        <RangeInput
          reference="green"
          val={this.state.green}
          update={this._updateColorValue} />
        <RangeInput
          reference="blue"
          val={this.state.blue}
          update={this._updateColorValue} />
      </div>
    );
  }

});

module.exports = RangePicker;