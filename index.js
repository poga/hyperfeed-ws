const WebSocket = require('ws')

function Server (feed, opts) {
  this._server = new WebSocket.Server(opts)

  this._server.on('connection', function (ws) {
    var updates = feed.list({live: true})
    ws.on('close', function () {
      updates.destroy()
    })

    var failed = false
    updates.on('data', entry => {
      if (failed) return
      if (!opts.filter || (opts.filter && opts.filter(entry))) {
        feed.load(entry).then(item => {
          entry.item = item
          try {
            ws.send(JSON.stringify(entry))
          } catch (e) {
            console.log('Failed to send, discarding connection', e)
            failed = true
            updates.destroy()
          }
        })
      }
    })
  })
}

Server.prototype.close = function (cb) {
  this._server.close(cb)
}

module.exports = Server
