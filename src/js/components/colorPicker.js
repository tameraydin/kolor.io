var React = require('react/addons');
var PureRenderMixin = React.addons.PureRenderMixin;
var HexInput = require('./hexInput');
var RgbInput = require('./rgbInput');
var RangePicker = require('./rangePicker');

var ColorPicker = React.createClass({
  propTypes: {
    index: React.PropTypes.number.isRequired
  },
  mixins: [PureRenderMixin],
  render: function() {
    return (
      <div className="color-picker">
        <HexInput index={this.props.index} />
        <RgbInput index={this.props.index} />
        <RangePicker index={this.props.index} />
      </div>
      );
  }
});

module.exports = ColorPicker;