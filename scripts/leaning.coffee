module.exports = (robot) ->
  KEY_DIC = 'dic'

  getDic = () ->
    return robot.brain.get(KEY_DIC) or {}

  class Learner
    constructor: (key, val) ->
      @key = key
      @val = val
      @dic = getDic()
      @msg = ''


    save = ->
      @dic[@key] = @val
      robot.brain.set KEY_DIC, @dic

    create: ->
      if @dic[@key]
        @msg = "#{@key} is exist, please use another key or update"
      else
        save.call(@)
        @msg = "#{@key} is created as #{@val}"

    update: ->
      if @dic[@key]
        save.call(@)
        @msg = "#{@key} is updated to #{@val}"
      else
        @msg = "#{@key} is not exist"

    delete: ->
      if @dic[@key]
        delete @dic[@key]
        robot.brain.set KEY_DIC, @dic
        @msg = "completed to delete #{@key}"
      else
        @msg = "#{@key} is not exist"

    please: ->
      if @dic[@key]
        @msg = "#{@key} is #{@dic[@key]}!"
      else
        @msg = "#{@key} is not exist"

    getMsg: ->
      return @msg

  save_regex = (ope) ->
    return new RegExp("#{ope}\\s(.+?)\\s(.+)", 'i')

  search_regex = (ope) ->
    return new RegExp("#{ope}\\s(.+)", 'i')

  robot.respond save_regex('create'), (res) ->
    learner = new Learner(res.match[1], res.match[2])
    learner.create()
    res.send learner.getMsg()

  robot.respond save_regex('update'), (res) ->
    learner = new Learner(res.match[1], res.match[2])
    learner.update()
    res.send learner.getMsg()

  robot.respond search_regex('delete'), (res) ->
    learner = new Learner(res.match[1])
    learner.delete()
    res.send learner.getMsg()

  robot.respond search_regex('please'), (res) ->
    learner = new Learner(res.match[1])
    learner.please()
    res.send learner.getMsg()

  robot.respond /list/i, (res) ->
    dic = getDic()
    keys = Object.keys(dic)

    if keys.length == 0
      res.send 'I have nothing'
      return

    for key in keys
      res.send key
