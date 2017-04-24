var GoogleSearchScraper = require('../src/google_search_scraper');

var body = `
<div class="g">
  <h3 class="r">
    <a href="/url?q=https://server1.com/&aaa=1&bbb=2">Link1</a>
  </h3>
  <div class="s">
    <span class="st">text1_<br />text2</span>
  </div>
</div>
<div class="g">
  <h3 class="r">
    <a href="/url?q=https://server2.com/&aaa=1&bbb=2">Link2</a>
  </h3>
  <div class="s">
    <span class="st">text3</span>
  </div>
</div>
`

describe('GoogleSearchScraper', function() {
  beforeEach(function() {
    this.g = new GoogleSearchScraper('ruby');
  })
  describe('#getUrl', function() {
    it('create url', function() {
      expect(this.g.getUrl()).toBe('https://www.google.co.jp/search?q=ruby&ie=utf-8&oe=utf-8&hl=ja&lr=lang_ja');
    });
  });

  describe('#load', function() {
    it('scrape search result', function() {
      this.g.parseBody(body)
      r = this.g.getResult()
      expect(r.length).toBe(2)
      expect(r[0].title).toBe('Link1')
      expect(r[0].link).toBe('https://server1.com/')
      expect(r[0].summary).toBe('text1_text2')
      expect(r[1].title).toBe('Link2')
      expect(r[1].link).toBe('https://server2.com/')
      expect(r[1].summary).toBe('text3')
    });
  });
});
