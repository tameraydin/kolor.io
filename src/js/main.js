var APP = require('./components/app');
var React = require('react');

// # tamerayd.in/kolor.io
// # tameraydin.github.io/kolor.io
// always use kolor.io as url-origin:
if (window.location.origin.indexOf('tamerayd') > -1) {
  window.location.replace('http://kolor.io/' + window.location.hash);
}

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
