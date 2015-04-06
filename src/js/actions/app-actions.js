var AppConstants = require('../constants/app-constants');
var AppDispatcher = require('../dispatchers/app-dispatcher');

var AppActions = {
  setColorList: function(colorList) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SET_COLOR_LIST,
      colors: colorList
    });
  },
  addColor: function(colorObj) {
    AppDispatcher.dispatch({
      actionType: AppConstants.ADD_COLOR,
      color: colorObj
    });
  },
  updateColor: function(index, colorObj) {
    AppDispatcher.dispatch({
      actionType: AppConstants.UPDATE_COLOR,
      index: index,
      color: colorObj
    });
  },
  removeColor: function(index) {
    AppDispatcher.dispatch({
      actionType: AppConstants.REMOVE_COLOR,
      index: index
    });
  },
  randomize: function(index) {
    AppDispatcher.dispatch({
      actionType: AppConstants.RANDOMIZE,
      index: index
    });
  }
};

module.exports = AppActions;
