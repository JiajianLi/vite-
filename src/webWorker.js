let count = 0;

(function timedCount () {
  count++
  postMessage(count)
  setTimeout(timedCount, 500)
})()
