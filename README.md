# hyperfeed-ws

send hyperfeed updates through websocket

## Usage

```js
const WSS = require('hyperfeed-ws')
const hyperfeed = require('hyperfeed')

var feed = hyperfeed().createFeed()

var server = new WSS(feed, {port: 8080}) // done
```

## License

The MIT License
