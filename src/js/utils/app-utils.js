var _hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

var Utils = {
  convertRgbToHex: function(r, g, b) {
    return this.convertRgbComponentToHex(r) +
      this.convertRgbComponentToHex(g) +
      this.convertRgbComponentToHex(b);
  },
  convertRgbComponentToHex: function(rgbComponent) {
    var hex = rgbComponent.toString(16);

    return hex.length === 1 ? '0' + hex : hex;
  },
  convertHexToRgb: function(hex) {
    var match = _hexRegex.exec(hex);

    return match && {
        red: parseInt(match[1], 16),
        green: parseInt(match[2], 16),
        blue: parseInt(match[3], 16)
      };
  },
  isValidHexColor: function(hex) {
    return typeof hex === 'string' && _hexRegex.exec(hex);
  }
};

module.exports = Utils;
