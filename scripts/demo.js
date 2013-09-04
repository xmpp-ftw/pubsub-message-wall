$(document).ready(function() {
    
    jQuery.getScript(
      '//' + config.host + '/scripts/primus.js', function(script) {
          init()
      })
    
})

var init = function() {
console.log(config.host)
    var socket = new Primus('//' + config.host)
    
    socket.on('error', function(error) { console.log(error) })
    
    socket.on('connect', function(data) {
        console.log('Connected')
    })
    
    socket.on('connect.fail', function(reason) {
        console.log("Connection failed: " + reason)
    })
    
    socket.on('disconnect', function() {
        console.log('disconnected')
        socket = null
    })
}