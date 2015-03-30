var React = require('react');
var navigate = require('react-mini-router').navigate;
var AppStore = require('../stores/app-store.js');
var AppActions = require('../actions/app-actions');

var AppButton =
  React.createClass({
    propTypes: {
      type: React.PropTypes.string.isRequired,
      colorIndex: React.PropTypes.number
    },
    _onAddClick: function() {
      AppActions.addColor();
    },
    _onRemoveClick: function() {
      AppActions.removeColor(this.props.colorIndex);
    },
    _onMenuClick: function() {
      navigate(window.location.hash.indexOf('menu') > -1 ?
        AppStore.getLastUrl() : '/menu');
    },
    render: function() {
      var button = null;

      switch (this.props.type) {
        case 'add':
          button = (
            <a
              title="New Color"
              onClick={this._onAddClick}
              className="button button--add">
              New Color
            </a>);
          break;
        case 'remove':
          button = (
            <a
              title="Remove"
              onClick={this._onRemoveClick}
              className="button button--remove">
              Remove
            </a>);
          break;
        case 'menu':
          button = (
            <a
              title="Menu"
              onClick={this._onMenuClick}
              className="button button--menu">
              <span className="button__text">Menu</span>
            </a>);
          break;
      }

      return button;
    }
  });

module.exports = AppButton;
