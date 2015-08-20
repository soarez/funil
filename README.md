
# funil

a stream that aggregates other streams

```javascript
var Funil = require('./funil');

var f = new Funil();
f.add(streamA);
f.add(streamB);
f.add(streamC);
f.add(streamD);

f.on('data', function(d) { /* d can be from either one of the streams */ });
```

