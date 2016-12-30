const tape = require('tape')
const hyperfeed = require('hyperfeed')
const WebSocket = require('ws')
const Wss = require('.')
const openport = require('openport')

tape('send updates', function (t) {
  var feed = hyperfeed().createFeed()
  openport.find((_, port) => {
    var wss = new Wss(feed, {port})

    addItem(feed, 'Feed Title', Date.now()).then(() => {
      var client = new WebSocket(`ws://localhost:${port}`)
      client.on('message', data => {
        var item = JSON.parse(data)
        t.same(item.title, 'Feed Title')
        wss.close()
        t.end()
      })
    })
  })
})

tape('updates after connect', function (t) {
  var feed = hyperfeed().createFeed()
  openport.find((_, port) => {
    var wss = new Wss(feed, {port})

    var client = new WebSocket(`ws://localhost:${port}`)
    client.on('message', data => {
      var item = JSON.parse(data)
      t.same(item.title, 'Feed Title')
      wss.close()
      t.end()
    })
    addItem(feed, 'Feed Title', Date.now())
  })
})

tape('filter', function (t) {
  var feed = hyperfeed().createFeed()
  var now = Date.now()
  openport.find((_, port) => {
    var wss = new Wss(feed, {port, filter: x => x.ctime <= now - 1000})

    var client = new WebSocket(`ws://localhost:${port}`)
    client.on('message', data => {
      var item = JSON.parse(data)
      t.same(item.title, 'Feed Title2')
      wss.close()
      t.end()
    })
    addItem(feed, 'Feed Title', now)
    addItem(feed, 'Feed Title2', now - 5000)
  })
})

function addItem (feed, title, date) {
  return feed.save({
    title: title,
    description: 'This is my personnal feed!',
    id: 'http://example.com/',
    link: 'http://example.com/',
    image: 'http://example.com/image.png',
    copyright: 'All rights reserved 2013, John Doe',
    updated: date,

    author: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      link: 'https://example.com/johndoe'
    }
  }, {ctime: date, name: title})
}
