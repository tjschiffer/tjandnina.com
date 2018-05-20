const generator = require('multi-language-site-generator');
const sass = require('node-sass');
const path = require('path');
const fs = require('fs');

const layoutComponent = new (require('./components/layout-component/layout-component'))();
const headComponent = new (require('./components/head-component/head-component'))();
const navigationComponent = new (require('./components/navigation-component/navigation-component'))()

function renderLanguages() {
  const templateDirPath = path.resolve('./templates');
  const templateDataPath = path.resolve('./templates/languageData.json');
  const outputFolder = path.resolve('./');

  generator.render(templateDirPath, templateDataPath, outputFolder, err => {
    if (err) throw err;
  });
}

// Render landing page
const landingPageComponent = new (require('./components/landing-page-component/landing-page-component.js'))();
layoutComponent
  .setHeadComponent(headComponent)
  .setContentComponent(landingPageComponent)
  .render((err, renderedTemplate) => {
    if (err) throw err;
    fs.writeFile('./index1.html', renderedTemplate, err => {
      if(err) throw err;
    });
  });

// Generate each page of the site and save the template to be rendered for each language
navigationComponent.render((err, renderedTemplate) => {
  if (err) throw err;
  console.log(renderedTemplate);
  fs.writeFile('./index1.html', renderedTemplate, err => {
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
