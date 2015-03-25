var APP = require('./components/app');
var React = require('react');

window.location.hash = '#!/';

React.render(
  <APP />,
  document.getElementById('app'));
