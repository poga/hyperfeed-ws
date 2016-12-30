const WebSocket = require('ws')

function Server (feed, opts) {
  this._server = new WebSocket.Server(opts)

  this._server.on('connection', function (ws) {
    var updates = feed.list({live: true})
    updates.on('data', x => {
      if (!opts.filter || (opts.filter && opts.filter(x))) {
        feed.load(x).then(body => {
          ws.send(JSON.stringify(body))
        })
      }
    })
  })
}

Server.prototype.close = function (cb) {
  this._server.close(cb)
}

module.exports = Server
