var React = require('react/addons');
var PureRenderMixin = React.addons.PureRenderMixin;
var AppStore = require('../stores/app-store.js');
var AppConstants = require('../constants/app-constants');
var AppActions = require('../actions/app-actions');
var _ = require('lodash');

var _getColorHistory = function() {
  var colorHistory = window.localStorage.getItem(
        AppConstants.COLOR_HISTORY);

  return colorHistory ? JSON.parse(colorHistory) : AppStore.getColorList();
};

var _setColorHistory = function(colorList) {
  return window.localStorage.setItem(AppConstants.COLOR_HISTORY,
    JSON.stringify(colorList));
};

var HistoryColor = React.createClass({
  propTypes: {
    key: React.PropTypes.number,
    color: React.PropTypes.object
  },
  mixins: [PureRenderMixin],
  _addColor: function() {
    AppActions.addColor(this.props.color);
  },
  render: function() {
    var elStyle = {
      background: 'rgb(' +
        this.props.color.red + ', ' +
        this.props.color.green + ', ' +
        this.props.color.blue + ')'
    };

    return (
      <span
        key={this.props.index}
        className="menu__color"
        onClick={this._addColor}
        style={elStyle}>
      </span>
      );
  }
});

var HistoryComponent = React.createClass({
  mixins: [PureRenderMixin],
  getInitialState: function() {
    return {
      colors: _getColorHistory()
    };
  },
  componentWillMount: function() {
    AppStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },
  _updateTimer: null,
  _onChange: function() {
    var _this = this;

    clearTimeout(this._updateTimer);
    this._updateTimer = setTimeout(function() {
      var colorHistory = _getColorHistory();
      var newColorHistory = _.filter(
        AppStore.getColorList(), function(color) {
          return !(_.find(colorHistory, color));
        })
        .concat(colorHistory)
        .splice(0, AppConstants.MAX_HISTORY);

      _setColorHistory(newColorHistory);
      _this.setState({
        colors: newColorHistory
      });
    }, AppConstants.URL_UPDATE_TIMEOUT);
  },
  render: function() {
    return (
      <p>
        {_.map(this.state.colors, function(color, index) {
          return (
            <HistoryColor
              key={index}
              color={color}>
            </HistoryColor>
            );
        })}
      </p>
      );
  }
});

module.exports = HistoryComponent;