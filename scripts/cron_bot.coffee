cronJob = require('cron').CronJob

module.exports = (robot) ->
  # this is every am 12:00 on weekday. Second Minute Hour Day Month Week
  job = new cronJob('0 0 12 * * 1-5', () ->
    envelop = room:"hubot_test1"
    robot.send envelop, "this is cron job @satohk"
  )
  job.start()

  robot.respond /stop job/i, (msg) ->
    msg.send "Stop job..."
    job.stop()
