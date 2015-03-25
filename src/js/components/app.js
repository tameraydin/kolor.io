var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var RouterMixin = require('react-mini-router').RouterMixin;
var AppStore = require('../stores/app-store.js');
var AppActions = require('../actions/app-actions');
var ColorPicker = require('./colorPicker');
var Color = require('./color');
var Menu = require('./menu');
var _ = require('lodash');

var Template =
  React.createClass({
    propTypes: {
      menu: React.PropTypes.bool,
      colors: React.PropTypes.oneOfType([
        React.PropTypes.array,
        React.PropTypes.string
      ])
    },
    getInitialState: function() {
      return {
        didMount: false
      };
    },
    componentWillReceiveProps: function(nextProps) {
      if (!nextProps.menu) {
        AppActions.setColorList(nextProps.colors);
      }
    },
    componentDidMount: function() {
      AppActions.setColorList(this.props.colors || ['']);

      this.setState({
        didMount: true
      });
    },
    render: function() {
      var template = null;

      if (this.state.didMount) {
        var colorList = AppStore.getColorList();
        var colorLength = colorList.length;

        var colors = _.map(colorList, function(color, i) {
          return (
            <Color key={i} index={i}>
              <ColorPicker index={i} color={color} />
            </Color>);
        });

        var containerClass = 'container';
        var modifierClass = ' ';

        if (colorLength > 1) {
          modifierClass += ' ' + containerClass + '--multiple ';

          if (colorLength > 3) {
            modifierClass += ' ' + containerClass + '--narrow';
          }
        }

        if (this.props.menu) {
          modifierClass += ' ' + containerClass + '--menu';
        }

        template = (
          <div className={containerClass + modifierClass}>
            {colors}
            <Menu />
          </div>);
      }

      return (
        <ReactCSSTransitionGroup transitionName="container" component="div">
          {template}
        </ReactCSSTransitionGroup>
        );
    }
  });

var APP =
  React.createClass({
    mixins: [RouterMixin],
    routes: {
      '/': 'home',
      '/:params': 'home'
    },
    render: function() {
      return this.renderCurrentRoute();
    },
    home: function(params) {
      var colors = [''];
      var menu = false;

      if (typeof params === 'string') {
        if (params === 'menu') {
          menu = true;
        } else {
          colors = params.split(',');
        }
      }

      return (
        <Template colors={colors} menu={menu} />
        );
    }
  });

module.exports = APP;
