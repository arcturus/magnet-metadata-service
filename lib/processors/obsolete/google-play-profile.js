
/**
 * Dependencies
 */

const htmlParser = require('magnet-html-parser/lib/parse');
const toDom = require('magnet-html-parser/lib/html-parser');
const debug = require('debug')('google-play-profile');

module.exports = function(res) {
  const doc = toDom(res.body);

  return htmlParser(doc, res, ['manifest', 'opengraph'])
    .then(result => {
      const android = parse(doc, res);
      debug('parsed', android);
      result.type = 'profile';
      result.android = android;
      result.icon = android.icon;
      result.title = android.name;
      return result;
    });
};

function parse(doc, res) {
  const result = {};
  const pkg = res.url.substr(res.url.lastIndexOf('=') + 1);
  if (pkg) {
    result.package = pkg;
  }

  if (doc.querySelector('.id-app-title')) {
    result.name = doc.querySelector('.id-app-title').textContent;
  }

  if (doc.querySelector('.cover-image')) {
    result.icon = doc.querySelector('.cover-image').src;
    if (!result.icon.startsWith('http:')) {
      result.icon = `http:${result.icon}`;
    }
  }

  if (doc.querySelector('.current-rating')) {
    result.rating = parseInt(doc.querySelector('.current-rating').style.width, 10);
  }

  return result;
}
