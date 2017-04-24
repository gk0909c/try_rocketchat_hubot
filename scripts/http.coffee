cheerio = require 'cheerio'
proxy = require 'proxy-agent'
GoogleSearchScraper = require('./google_search_scraper')

module.exports = (robot) ->
  proxyServer = process.env.http_proxy
  robot.globalHttpOptions.httpAgent  = proxy(proxyServer, false)
  robot.globalHttpOptions.httpsAgent = proxy(proxyServer, true)

  robot.respond /search\s(.+)/i, (res) ->
    g = new GoogleSearchScraper(res.match[1])
    url = g.getUrl()

    robot.http(url).get() (err, response, body) ->
      g.parseBody(body)
      results = g.getResult()

      for r, i in results
        res.send "#{r.title} - #{r.link}"
        res.send ">#{r.summary}"
        return false if i > 5
