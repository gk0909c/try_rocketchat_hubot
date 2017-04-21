module.exports = (robot) ->
  KEY_DIC = 'key_dic'

  getDic = () ->
    return robot.brain.get(KEY_DIC) or {}

  save_regex = (ope) ->
    return new RegExp("#{ope}\\s(.+?)\\s(.+)", 'i')

  search_regex = (ope) ->
    return new RegExp("#{ope}\\s(.+)", 'i')

  robot.respond save_regex('create'), (res) ->
    key = res.match[1]
    val = res.match[2]
    dic = getDic

    if dic[key]
      res.send "#{key} is exist, please use another key or update"
    else
      dic[key] = val
      robot.brain.set KEY_DIC, dic
      res.send "#{key} is created as #{val}"

  robot.respond save_regex('update'), (res) ->
    key = res.match[1]
    val = res.match[2]
    dic = getDic

    if dic[key]
      dic[key] = val
      robot.brain.set KEY_DIC, dic
      res.send "#{key} is updated to #{val}"
    else
      res.send "#{key} is not exist"

  robot.respond search_regex('please'), (res) ->
    key = res.match[1]
    dic = getDic
    val = dic[key]

    if dic[key]
      res.send "#{key} is #{val}!"
    else
      res.send "#{key} is not exist"

  robot.respond /list/i, (res) ->
    dic = getDic
    keys = Object.keys(dic)

    for key in keys
      res.send key
