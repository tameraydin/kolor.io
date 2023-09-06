var React = require('react/addons');
var AppStore = require('../stores/app-store.js');

var RangePicker = React.createClass({
  getInitialState: function() {
    return {
      pageUrl: window.location.href,
      showCopyInstructions: false
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
    this.setState({
      pageUrl: window.location.origin + '/kolor.io/#!' + AppStore.getLastUrl()
    });
  },
  _selectAll: function(e) {
    var input = e.target;
    setTimeout(function() {
      input.select();
    }, 10);
  },
  _revertInstructions: function() {
    this.setState({
      showCopyInstructions: false
    });
  },
  _showInstructions: function() {
    this.setState({
      showCopyInstructions: true
    });
    this.refs.urlInput.getDOMNode().focus();
  },
  render: function() {
    var copyLinkClass = 'menu__link';
    var copyLinkText = 'URL';

    if (this.state.showCopyInstructions) {
      copyLinkClass += 'menu__link--instruction';
      copyLinkText = 'Ctrl/\u2318 + C';
    }

    return (
      <div>
        <input
          ref="urlInput"
          className="menu__share-input"
          type="text"
          readOnly
          onFocus={this._selectAll}
          onBlur={this._revertInstructions}
          value={this.state.pageUrl} />
        <p>
          <a onClick={this._showInstructions} className={copyLinkClass}>{copyLinkText}</a> | <a target="_blank" href={'http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(this.state.pageUrl)}>Facebook</a> | <a target="_blank" href={'https://twitter.com/share?via=outofroutine&text=I+love+these+colors!+<3&url=' + encodeURIComponent(this.state.pageUrl)}>Twitter</a>
        </p>
      </div>
    );
  }

});

module.exports = RangePicker;
