cheerio = require 'cheerio'

class GoogleSearchScraper
  INSTACE: 'https://www.google.co.jp'

  constructor: (@word) ->
    @results = []
    @index = -1
    @option = ->
      options = {
        ie: 'utf-8',
        oe: 'utf-8',
        hl: 'ja',
        lr: 'lang_ja'
      }
      return (Object.keys(options).map (k) ->
        return "#{k}=#{options[k]}"
      ).join '&'

  _getLink = (result) ->
    r = result.find('h3.r')
    a = r.find('a')
    link = a.attr('href')

    if link
      linkUrl = (link.match /(.+)(https?:\/\/.+?)(\&.+)/i)[2]
      return { title: a.text(), link: linkUrl }

  _getSummary = (result) ->
    s = result.find('div.s')
    st = s.find('span.st')
    return "#{st.text().replace(/\n/g, '')}"

  getUrl: ->
    return "#{this.INSTACE}/search?q=#{@word}&#{@option()}"

  parseBody: (body) ->
    $ = cheerio.load body
    $('div.g').each (i, g) =>
      result = _getLink $(g)
      summary = _getSummary $(g)

      if result
        @results.push Object.assign(result, { summary: _getSummary $(g) })

  getResult: () ->
    return @results

module.exports = GoogleSearchScraper
