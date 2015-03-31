var React = require('react/addons');
var PureRenderMixin = React.addons.PureRenderMixin;
var HistoryComponent = require('./history');
var ShareComponent = require('./share');

var Menu = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return (
      <div className="menu">
        <section className="menu__section">
          <h2 className="menu__title">History</h2>
          <HistoryComponent />
        </section>
        <section className="menu__section">
          <h2 className="menu__title">Share</h2>
          <ShareComponent />
        </section>
        <section className="menu__section">
          <h2 className="menu__title">About</h2>
          <p className="menu__text"><strong>kolor.io</strong> is just an experimental <a href="http://github.com/tameraydin/kolor.io" target="_blank">open-source</a> web application that allows you to do basic operations on color values, create your palettes & share it with other people.</p>
          <small>Handcrafted with <span className="menu__symbol menu__symbol--love"><span className="menu__symbol__text">love</span></span> in <span title="Amsterdam" className="menu__symbol menu__symbol--city"><span className="menu__symbol__text">Amsterdam</span></span>.
          </small>
        </section>
      </div>
      );
  }
});

module.exports = Menu;
