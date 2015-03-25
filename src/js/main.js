var APP = require('./components/app');
var React = require('react');

if (!window.location.hash) {
  window.location.hash = '#!/';
}

// handle escaped fragment:
var searchQuery = window.location.search;
if (searchQuery && searchQuery.indexOf('_escaped_fragment_') > -1) {
  var colors = decodeURIComponent(searchQuery.split('_=')[1]);
  window.location.hash = '#!' + colors;
  window.location.search = '';
}

React.render(
  <APP />,
  document.getElementById('app'));
