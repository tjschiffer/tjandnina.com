const generator = require('multi-language-site-generator');
const sass = require('node-sass');
const path = require('path');
const fs = require('fs');
const async = require('async');

const layoutComponent = new (require('./components/layout-component/layout-component'))();
const headComponent = new (require('./components/head-component/head-component'))();
const navigationComponent = new (require('./components/navigation-component/navigation-component'))();
const footerComponent = new (require('./components/footer-component/footer-component'))();

const heroImageComponent = new (require('./components/hero-image-component/hero-image-component'))();
const detailsComponent = new (require('./components/details-component/details-component'))();
const registryComponent = new (require('./components/registry-component/registry-component'))();
const photosComponent = new (require('./components/photos-component/photos-component'))();

function renderLanguages() {
  const templateDirPath = path.resolve('./templates');
  const templateDataPath = path.resolve('./templates/languageData.json');
  const outputFolder = path.resolve('./');

  generator.render(templateDirPath, templateDataPath, outputFolder, err => {
    if (err) throw err;
  });
}

// Generate each page of the site and save the template to be rendered for each language
// Use series so that singleton components do not clash
async.series([
    cb => {
      layoutComponent
        .setHeadComponent(headComponent)
        .setContentComponent(heroImageComponent)
        .setNavigationComponent(navigationComponent.setIsOverlay(true))
        .setFooterComponent(footerComponent)
        .render((err, renderedTemplate) => {
          if (err) {
            cb(err);
            return;
          }
          fs.writeFile('./templates/index.mustache', renderedTemplate, err => {
            cb(err);
          });
        });
    },
    cb => {
      layoutComponent
        .setHeadComponent(headComponent.setTitle('T.J. & Nina | {{ Details }}'))
        .setContentComponent(detailsComponent)
        .setNavigationComponent(navigationComponent.setIsOverlay(false))
        .setFooterComponent(footerComponent)
        .render((err, renderedTemplate) => {
          if (err) {
            cb(err);
            return;
          }
          fs.writeFile('./templates/details.mustache', renderedTemplate, err => {
            cb(err);
          });
        });
    },
    cb => {
      layoutComponent
        .setHeadComponent(headComponent.setTitle('T.J. & Nina | {{ Registry }}'))
        .setContentComponent(registryComponent)
        .setNavigationComponent(navigationComponent.setIsOverlay(false))
        .setFooterComponent(footerComponent)
        .render((err, renderedTemplate) => {
          if (err) {
            cb(err);
            return;
          }
          fs.writeFile('./templates/registry.mustache', renderedTemplate, err => {
            cb(err);
          });
        });
    },
    cb => {
      layoutComponent
        .setHeadComponent(headComponent.setTitle('T.J. & Nina | {{ Photos }}'))
        .setContentComponent(photosComponent)
        .setNavigationComponent(navigationComponent.setIsOverlay(false))
        .setFooterComponent(footerComponent)
        .render((err, renderedTemplate) => {
          if (err) {
            cb(err);
            return;
          }
          fs.writeFile('./templates/photos.mustache', renderedTemplate, err => {
            cb(err);
          });
        });
    }
  ],
  (err) => {
    if(err) throw err;
    renderLanguages();
  }
);

// Render landing page with no header or footer
const landingPageComponent = new (require('./components/language-chooser-component/language-chooser-component'))();
layoutComponent
  .setHeadComponent(headComponent)
  .setContentComponent(landingPageComponent)
  .setNavigationComponent(null)
  .setFooterComponent(null)
  .render((err, renderedTemplate) => {
    if (err) throw err;
    fs.writeFile('./index.html', renderedTemplate, err => {
      if(err) throw err;
    });
  });

// Generate css
const sassFile = path.resolve('./scss/main.scss');
const outFile = path.resolve('./css/main.css');

sass.render({
  file: sassFile,
  sourceMap: true,
  outFile: outFile,
  outputStyle: 'nested'
}, function(err, result) {
  if (err) throw err;
  fs.writeFile(outFile, result.css, err => {
    if(err) throw err;
  });
  fs.writeFile(outFile + '.map', result.map, err => {
    if(err) throw err;
  });
});
