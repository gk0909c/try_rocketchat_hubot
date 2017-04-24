cheerio = require 'cheerio'
proxy = require 'proxy-agent'

module.exports = (robot) ->
  proxyServer = process.env.http_proxy
  robot.globalHttpOptions.httpAgent  = proxy(proxyServer, false)
  robot.globalHttpOptions.httpsAgent = proxy(proxyServer, true)

  robot.respond /search\s(.+)/i, (res) ->
    instance = 'https://www.google.co.jp'
    options = {
      ie: 'utf-8',
      oe: 'utf-8',
      hl: 'ja',
      lr: 'lang_ja'
    }
    urlOption = (Object.keys(options).map (k) ->
      return "#{k}=#{options[k]}"
    ).join '&'
    url = "#{instance}/search?q=#{res.match[1]}&#{urlOption}"

    robot.http(url).get() (err, response, body) ->
      $ = cheerio.load(body)
      $('div.g').each (i, g) ->
        r = $(g).find('h3.r')
        a = r.find('a')
        link = a.attr('href')

        if link
          linkUrl = (link.match /(.+)(https?:\/\/.+?)(\&.+)/i)[2]
          res.send "#{a.text()} - #{linkUrl}"

        s = $(g).find('div.s')
        st = s.find('span.st')
        res.send ">#{st.text().replace(/\n/g, '')}"

        return false if i > 5
