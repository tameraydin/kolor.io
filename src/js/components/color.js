var React = require('react');
var AppStore = require('../stores/app-store.js');
var AppButton = require('./button.js');
var StoreMixin = require('../mixins/StoreMixin.js');

function isBackgroundLight(r, g, b) {
  return (((r*299)+(g*587)+(b*114))/1000) >= 128;
}

var Color =
  React.createClass({
    propTypes: {
      index: React.PropTypes.number.isRequired
    },
    mixins:[StoreMixin],
    render: function() {
      var elStyle = {
        background: 'rgb(' +
          this.state.red + ', ' +
          this.state.green + ', ' +
          this.state.blue + ')'
      };

      var defaultClassName = 'color';
      var backgroundClass = ' ' + defaultClassName + '--';

      backgroundClass += isBackgroundLight(this.state.red, this.state.green, this.state.blue) ?
        'light' : 'dark';

      var i = this.props.index;
      var colorLength = AppStore.getColorList().length;

      var menuButton =
        (i === 0) ?
          <AppButton type="menu" /> : null;

      var addButton =
        (i === colorLength - 1) ?
          <AppButton type="add" colorIndex={this.props.index} /> : null;

      var removeButton = (colorLength > 1) ?
          <AppButton type="remove" colorIndex={this.props.index} /> : null;

      return  (
        <div className={defaultClassName + backgroundClass} style={elStyle}>
          {menuButton}
          {addButton}
          {removeButton}
          {this.props.children}
        </div>
        );
    }
  });

module.exports = Color;
