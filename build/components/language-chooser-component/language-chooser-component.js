const path = require('path')
const fs = require('fs')
const async = require('async')
const mustache = require('mustache')
const styleTagComponent = new (require('../style-tag-component/style-tag-component'))()

const templatePath = path.join(__dirname, './tpl.language-chooser.mustache')

const languageChooserComponent = function () {
  /**
   *
   * @param cb
   */
  this.render = cb => {
    const _view = {
      languages: [
        {
          languageLandingPageUrl: 'fr/index.html',
          language: 'fr',
          flagPath: '/img/franceflag.svg',
          languageMessage: 'Je parle français.'
        },
        {
          languageLandingPageUrl: 'en/index.html',
          language: 'en',
          flagPath: '/img/americaflag.svg',
          languageMessage: '<div>I took Spanish</div><div>in High School.</div>'
        }
      ]
    }
    styleTagComponent.setStylesheetPath('/css/language-chooser.css')
    async.parallel({
      styleTag: cb => {
        styleTagComponent.render((err, renderedTemplate) => {
          cb(err, renderedTemplate)
        })
      }
    }, (err, view) => {
      if (err) {
        cb(err)
      }
      view = Object.assign(view, _view)

      fs.readFile(templatePath, 'utf-8', (err, template) => {
        mustache.parse(template, ['<%', '%>'])
        const rendered = mustache.render(template, view)
        cb(err, rendered)
      })
    }
    )
  }
}

module.exports = languageChooserComponent
