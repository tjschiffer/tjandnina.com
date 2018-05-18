const path = require('path');
const fs = require('fs');
const mustache = require('mustache');

const templatePath = path.resolve('./tpl.head.mustache');

const headComponent = {
  render: function render(view, cb) {
    view = Object.assign({
      title: 'Welcome!'
    }, view);

    fs.readFile(templatePath, 'utf-8', (err, template) => {
      mustache.parse(template, ['<%', '%>']);
      const rendered = mustache.render(template, view);
      cb(err, rendered);
    });
  }
};

// headComponent.render(null, (err, data) => console.log(data));

module.exports = headComponent;