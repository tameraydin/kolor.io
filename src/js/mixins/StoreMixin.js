var AppStore = require('../stores/app-store.js');

var StoreMixin = {
  getInitialState: function() {
    return AppStore.getColor(this.props.index);
  },
  componentWillMount: function() {
    AppStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },
  _onChange: function() {
    var color = AppStore.getColor(this.props.index);

    if (color) {
      this.setState(AppStore.getColor(this.props.index));
    }
  }
};

module.exports = StoreMixin;
