const path = require('path');
const fs = require('fs');
const async = require('async');
const mustache = require('mustache');

const templatePath = path.join(__dirname, './tpl.layout.mustache');

/**
 *
 * @param component
 * @param cb
 */
function renderComponent(component, cb) {
  if (!component || typeof component.render !== 'function') {
    cb(null);
    return;
  }
  component.render((err, renderedTemplate) => {
    cb(err, renderedTemplate);
  });
}

const layoutComponent = function() {

  /**
   *
   * @param cb
   */
  this.render = cb => {
    const _this = this;
    async.parallel({
        head: cb => {
          renderComponent(_this.headComponent, cb);
        },
        navigation: cb => {
          renderComponent(_this.navigationComponent, cb);
        },
        content: cb => {
          renderComponent(_this.contentComponent, cb);
        },
        footer: cb => {
          renderComponent(_this.footerComponent, cb);
        }
      }, (err, view) => {
        if (err) { cb(err) }
        view = Object.assign(view, _this);

        fs.readFile(templatePath, 'utf-8', (err, template) => {
          mustache.parse(template, ['<%', '%>']);
          const rendered = mustache.render(template, view);
          cb(err, rendered);
        });
      });
  };

  /**
   *
   * @param headComponent
   * @returns {layoutComponent}
   */
  this.setHeadComponent = headComponent => {
    this.headComponent = headComponent;
    return this;
  };

  /**
   *
   * @param contentComponent
   * @returns {layoutComponent}
   */
  this.setContentComponent = contentComponent => {
    this.contentComponent = contentComponent;
    return this;
  };

  /**
   *
   * @param navigationComponent
   * @returns {layoutComponent}
   */
  this.setNavigationComponent = navigationComponent => {
    this.navigationComponent = navigationComponent;
    return this;
  };

  /**
   *
   * @param footerComponent
   * @returns {layoutComponent}
   */
  this.setFooterComponent = footerComponent => {
    this.footerComponent = footerComponent;
    return this;
  };

  /**
   * Set to true to define the langauge
   *
   * @param defineLanguage bool
   * @return {layoutComponent}
   */
  this.setDefineLanguage = defineLanguage => {
    this.defineLanguage = defineLanguage;
    return this;
  }
};

module.exports = layoutComponent;
