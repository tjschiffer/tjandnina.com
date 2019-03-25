const generator = require("multi-language-site-generator");
const sass = require("node-sass");
const path = require("path");
const fs = require("fs");
const mustache = require("mustache");
const async = require("async");
const webpack = require("webpack");
const webpackConfig = require(path.join(__dirname, "./webpack.config"));

const layoutComponent = new (require("./components/layout-component/layout-component"))();
const headComponent = new (require("./components/head-component/head-component"))();
const navigationComponent = new (require("./components/navigation-component/navigation-component"))();
const footerComponent = new (require("./components/footer-component/footer-component"))();

const heroImageComponent = new (require("./components/hero-image-component/hero-image-component"))();
const detailsComponent = new (require("./components/details-component/details-component"))();
const registryComponent = new (require("./components/registry-component/registry-component"))();
const photosComponent = new (require("./components/photos-component/photos-component"))();
// const rsvpComponent = new (require('./components/rsvp-component/rsvp-component'))()
const landingPageComponent = new (require("./components/language-chooser-component/language-chooser-component"))();
// const loginComponent = new (require("./components/login-component/login-component"))();
// const invitesomponent = new (require("./components/invites-component/invites-component"))();

const templateLanguageDataPath = path.join(
  __dirname,
  "./templates/languageData.json"
);

function renderLanguages() {
  const templateDirPath = path.join(__dirname, "./templates");
  const outputFolder = path.join(__dirname, "..");

  generator.render(
    templateDirPath,
    templateLanguageDataPath,
    outputFolder,
    err => {
      if (err) console.error(err.stack || err);
    }
  );
}

// Generate each page of the site and save the template to be rendered for each language
// Use series so that state on singleton components do not clash
async.series(
  [
    cb => {
      layoutComponent
        .setDefineLanguage(true)
        .setHeadComponent(headComponent)
        .setContentComponent(heroImageComponent)
        .setNavigationComponent(
          navigationComponent.setIsOverlay(true).setActiveLink("Home")
        )
        .setFooterComponent(footerComponent)
        .render((err, renderedTemplate) => {
          if (err) {
            cb(err);
            return;
          }
          fs.writeFile(
            path.join(__dirname, "./templates/index.mustache"),
            renderedTemplate,
            err => {
              cb(err);
            }
          );
        });
    },
    cb => {
      layoutComponent
        .setDefineLanguage(true)
        .setHeadComponent(headComponent.setTitle("T.J. & Nina | {{ Details }}"))
        .setContentComponent(detailsComponent)
        .setNavigationComponent(
          navigationComponent.setIsOverlay(false).setActiveLink("Details")
        )
        .setFooterComponent(footerComponent)
        .render((err, renderedTemplate) => {
          if (err) {
            cb(err);
            return;
          }
          fs.writeFile(
            path.join(__dirname, "./templates/details.mustache"),
            renderedTemplate,
            err => {
              cb(err);
            }
          );
        });
    },
    cb => {
      layoutComponent
        .setDefineLanguage(true)
        .setHeadComponent(
          headComponent.setTitle("T.J. & Nina | {{ Registry }}")
        )
        .setContentComponent(registryComponent)
        .setNavigationComponent(
          navigationComponent.setIsOverlay(false).setActiveLink("Registry")
        )
        .setFooterComponent(footerComponent)
        .render((err, renderedTemplate) => {
          if (err) {
            cb(err);
            return;
          }
          fs.writeFile(
            path.join(__dirname, "./templates/registry.mustache"),
            renderedTemplate,
            err => {
              cb(err);
            }
          );
        });
    },
    cb => {
      layoutComponent
        .setDefineLanguage(true)
        .setHeadComponent(headComponent.setTitle("T.J. & Nina | {{ Photos }}"))
        .setContentComponent(photosComponent)
        .setNavigationComponent(
          navigationComponent.setIsOverlay(false).setActiveLink("Photos")
        )
        .setFooterComponent(footerComponent)
        .render((err, renderedTemplate) => {
          if (err) {
            cb(err);
            return;
          }
          fs.writeFile(
            path.join(__dirname, "./templates/photos.mustache"),
            renderedTemplate,
            err => {
              cb(err);
            }
          );
        });
    },
    // cb => {
    //   layoutComponent
    //     .setDefineLanguage(true)
    //     .setHeadComponent(headComponent.setTitle('T.J. & Nina | {{ RSVP }}'))
    //     .setContentComponent(rsvpComponent)
    //     .setNavigationComponent(navigationComponent.setIsOverlay(false).setActiveLink('RSVP'))
    //     .setFooterComponent(footerComponent)
    //     .render((err, renderedTemplate) => {
    //       if (err) {
    //         cb(err)
    //         return
    //       }
    //       fs.writeFile(path.join(__dirname, './templates/rsvp.mustache'), renderedTemplate, err => {
    //         cb(err)
    //       })
    //     })
    // },
    // Render landing page with no header or footer
    cb => {
      layoutComponent
        .setDefineLanguage(false)
        .setHeadComponent(headComponent.setTitle("T.J. & Nina"))
        .setContentComponent(landingPageComponent)
        .setNavigationComponent(null)
        .setFooterComponent(null)
        .render((err, renderedPage) => {
          if (err) console.error(err.stack || err);
          fs.writeFile(
            path.join(__dirname, "../index.html"),
            renderedPage,
            err => {
              cb(err);
            }
          );
        });
    }
    // Render login page
    // cb => {
    //   layoutComponent
    //     .setDefineLanguage(false)
    //     .setHeadComponent(headComponent.setTitle("T.J. & Nina | Login"))
    //     .setContentComponent(loginComponent)
    //     .setNavigationComponent(
    //       navigationComponent
    //         .setIsOverlay(false)
    //         .setActiveLink(null)
    //         .setShowNavigationLanguageChooser(false)
    //     )
    //     .setFooterComponent(footerComponent)
    //     .render((err, renderedTemplate) => {
    //       if (err) console.error(err.stack || err);
    //       // Special case for login page since it is being forced with en data
    //       fs.readFile(
    //         templateLanguageDataPath,
    //         "utf-8",
    //         (err, languageData) => {
    //           if (err) console.error(err.stack || err);
    //           const englishData = JSON.parse(languageData)["en"];
    //           englishData["language"] = "en";
    //           const loginPage = mustache.render(renderedTemplate, englishData);
    //           fs.writeFile(
    //             path.join(__dirname, "../static/login.html"),
    //             loginPage,
    //             err => {
    //               cb(err);
    //             }
    //           );
    //         }
    //       );
    //     });
    // },
    // Render invites page
    // cb => {
    //   layoutComponent
    //     .setDefineLanguage(false)
    //     .setHeadComponent(headComponent.setTitle("T.J. & Nina | Invites"))
    //     .setContentComponent(invitesomponent)
    //     .setNavigationComponent(
    //       navigationComponent
    //         .setIsOverlay(false)
    //         .setActiveLink(null)
    //         .setShowNavigationLanguageChooser(false)
    //     )
    //     .setFooterComponent(footerComponent)
    //     .render((err, renderedTemplate) => {
    //       if (err) console.error(err.stack || err);
    //       // Special case for login page since it is being forced with en data
    //       fs.readFile(
    //         templateLanguageDataPath,
    //         "utf-8",
    //         (err, languageData) => {
    //           if (err) console.error(err.stack || err);
    //           const englishData = JSON.parse(languageData)["en"];
    //           englishData["language"] = "en";
    //           const loginPage = mustache.render(renderedTemplate, englishData);
    //           fs.writeFile(
    //             path.join(__dirname, "../static/invites.html"),
    //             loginPage,
    //             err => {
    //               cb(err);
    //             }
    //           );
    //         }
    //       );
    //     });
    // }
  ],
  err => {
    if (err) console.error(err.stack || err);
    renderLanguages();
  }
);

// Generate css files
const sassFilesToBuild = [
  path.join(__dirname, "./scss/main.scss"),
  path.join(__dirname, "./components/hero-image-component/hero-image.scss"),
  path.join(__dirname, "./components/navigation-component/navigation.scss"),
  path.join(
    __dirname,
    "./components/language-chooser-component/language-chooser.scss"
  ),
  path.join(
    __dirname,
    "./components/navigation-language-chooser-component/navigation-language-chooser.scss"
  )
];
const cssStaticFolder = path.join(__dirname, "../css");

sassFilesToBuild.forEach(sassFile => {
  const basename = path.parse(sassFile).name;
  const outputPath = path.join(cssStaticFolder, basename) + ".css";
  sass.render(
    {
      file: sassFile,
      sourceMap: true,
      outFile: outputPath,
      outputStyle: "nested"
    },
    function(err, result) {
      if (err) console.error(err.stack || err);
      fs.writeFile(outputPath, result.css, err => {
        if (err) console.error(err.stack || err);
      });
      fs.writeFile(outputPath + ".map", result.map, err => {
        if (err) console.error(err.stack || err);
      });
    }
  );
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
