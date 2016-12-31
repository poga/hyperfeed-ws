const WebSocket = require('ws')

function Server (feed, opts) {
  this._server = new WebSocket.Server(opts)

  this._server.on('connection', function (ws) {
    var updates = feed.list({live: true})
    ws.on('close', function () {
      updates.destroy()
    })

    updates.on('data', entry => {
      if (!opts.filter || (opts.filter && opts.filter(entry))) {
        feed.load(entry).then(item => {
          entry.item = item
          ws.send(JSON.stringify(entry))
        })
      }
    })
  })
}

Server.prototype.close = function (cb) {
  this._server.close(cb)
}

module.exports = Server
