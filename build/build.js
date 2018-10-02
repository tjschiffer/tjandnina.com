const generator = require('multi-language-site-generator');
const sass = require('node-sass');
const path = require('path');
const fs = require('fs');
const async = require('async');
const webpack = require('webpack');
const webpackConfig = require(path.join(__dirname, './webpack.config'));

const layoutComponent = new (require('./components/layout-component/layout-component'))();
const headComponent = new (require('./components/head-component/head-component'))();
const navigationComponent = new (require('./components/navigation-component/navigation-component'))();
const footerComponent = new (require('./components/footer-component/footer-component'))();

const heroImageComponent = new (require('./components/hero-image-component/hero-image-component'))();
const detailsComponent = new (require('./components/details-component/details-component'))();
const registryComponent = new (require('./components/registry-component/registry-component'))();
const photosComponent = new (require('./components/photos-component/photos-component'))();
const rsvpComponent = new (require('./components/rsvp-component/rsvp-component'))();

function renderLanguages() {
  const templateDirPath = path.join(__dirname, './templates');
  const templateDataPath = path.join(__dirname, './templates/languageData.json');
  const outputFolder = path.join(__dirname, '../static');

  generator.render(templateDirPath, templateDataPath, outputFolder, err => {
    if (err) console.error(err.stack || err);
  });
}

// Generate each page of the site and save the template to be rendered for each language
// Use series so that singleton components do not clash
async.series([
    cb => {
      layoutComponent
        .setDefineLanguage(true)
        .setHeadComponent(headComponent)
        .setContentComponent(heroImageComponent)
        .setNavigationComponent(navigationComponent.setIsOverlay(true).setActiveLink('Home'))
        .setFooterComponent(footerComponent)
        .render((err, renderedTemplate) => {
          if (err) {
            cb(err);
            return;
          }
          fs.writeFile(path.join(__dirname, './templates/index.mustache'), renderedTemplate, err => {
            cb(err);
          });
        });
    },
    cb => {
      layoutComponent
        .setDefineLanguage(true)
        .setHeadComponent(headComponent.setTitle('T.J. & Nina | {{ Details }}'))
        .setContentComponent(detailsComponent)
        .setNavigationComponent(navigationComponent.setIsOverlay(false).setActiveLink('Details'))
        .setFooterComponent(footerComponent)
        .render((err, renderedTemplate) => {
          if (err) {
            cb(err);
            return;
          }
          fs.writeFile(path.join(__dirname, './templates/details.mustache'), renderedTemplate, err => {
            cb(err);
          });
        });
    },
    cb => {
      layoutComponent
        .setDefineLanguage(true)
        .setHeadComponent(headComponent.setTitle('T.J. & Nina | {{ Registry }}'))
        .setContentComponent(registryComponent)
        .setNavigationComponent(navigationComponent.setIsOverlay(false).setActiveLink('Registry'))
        .setFooterComponent(footerComponent)
        .render((err, renderedTemplate) => {
          if (err) {
            cb(err);
            return;
          }
          fs.writeFile(path.join(__dirname, './templates/registry.mustache'), renderedTemplate, err => {
            cb(err);
          });
        });
    },
    cb => {
      layoutComponent
        .setDefineLanguage(true)
        .setHeadComponent(headComponent.setTitle('T.J. & Nina | {{ Photos }}'))
        .setContentComponent(photosComponent)
        .setNavigationComponent(navigationComponent.setIsOverlay(false).setActiveLink('Photos'))
        .setFooterComponent(footerComponent)
        .render((err, renderedTemplate) => {
          if (err) {
            cb(err);
            return;
          }
          fs.writeFile(path.join(__dirname, './templates/photos.mustache'), renderedTemplate, err => {
            cb(err);
          });
        });
    },
    cb => {
      layoutComponent
        .setDefineLanguage(true)
        .setHeadComponent(headComponent.setTitle('T.J. & Nina | {{ RSVP }}'))
        .setContentComponent(rsvpComponent)
        .setNavigationComponent(navigationComponent.setIsOverlay(false).setActiveLink('RSVP'))
        .setFooterComponent(footerComponent)
        .render((err, renderedTemplate) => {
          if (err) {
            cb(err);
            return;
          }
          fs.writeFile(path.join(__dirname, './templates/rsvp.mustache'), renderedTemplate, err => {
            cb(err);
          });
        });
    }
  ],
  (err) => {
    if(err) console.error(err.stack || err);
    renderLanguages();
  }
);

// Render landing page with no header or footer
const landingPageComponent = new (require('./components/language-chooser-component/language-chooser-component'))();
layoutComponent
  .setDefineLanguage(false)
  .setHeadComponent(headComponent)
  .setContentComponent(landingPageComponent)
  .setNavigationComponent(null)
  .setFooterComponent(null)
  .render((err, renderedTemplate) => {
    if (err) console.error(err.stack || err);
    fs.writeFile(path.join(__dirname, '../static/index.html'), renderedTemplate, err => {
      if(err) console.error(err.stack || err);
    });
  });

// Generate css files
const sassFilesToBuild = [
  path.join(__dirname, './scss/main.scss'),
  path.join(__dirname, './components/hero-image-component/hero-image.scss'),
  path.join(__dirname, './components/navigation-component/navigation.scss'),
  path.join(__dirname, './components/language-chooser-component/language-chooser.scss'),
  path.join(__dirname, './components/navigation-language-chooser-component/navigation-language-chooser.scss')
];
const cssStaticFolder = path.join(__dirname, '../static/css');

sassFilesToBuild.forEach((sassFile) => {
  const basename = path.parse(sassFile).name;
  const outputPath = path.join(cssStaticFolder, basename) + '.css';
  sass.render({
    file: sassFile,
    sourceMap: true,
    outFile: outputPath,
    outputStyle: 'nested'
  }, function (err, result) {
    if (err) console.error(err.stack || err);
    fs.writeFile(outputPath, result.css, err => {
      if (err) console.error(err.stack || err);
    });
    fs.writeFile(outputPath + '.map', result.map, err => {
      if (err) console.error(err.stack || err);
    });
  });
});


webpack(webpackConfig, (err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.error(info.errors);
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }
});
