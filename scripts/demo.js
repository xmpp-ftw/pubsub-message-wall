$(document).ready(function() { 
    
    var script = config.host + '/scripts/primus.js'
    
    jQuery.getScript(script, function() {
          init()
    }) 
})

var addMessage = function(data) {
    $('#content').prepend('<p class="message">' + $('<div/>').text(data).html() + '</p>')
}

var socket 

var init = function() {

    socket = new Primus(config.host)
    
    socket.on('error', function(error) { console.error('error', error) })
    
    socket.on('open', function(data) {
        console.log('Connected')        
    })
    
    socket.on('connect.fail', function(reason) {
        console.log('Connection failed: ' + reason)
    })
    
    socket.on('disconnect', function() {
        console.log('disconnected')
        socket = null
    })
    
    // When messages come in, display them
    socket.on('xmpp.pubsub.push.item', function(data) {
        console.log('new item', data)
        addMessage(data.entry.body)    
    })
    
    // Detect when we are connected ok
    socket.on('xmpp.connection', function(data) { 
        console.log(data) 
        // Set presence
        socket.emit('xmpp.presence', {
           show: 'online',
           status: 'https://github.com/lloydwatkin/pubsub-message-wall.git',
           priority: 10
        })
        var subscribeAndPost = function() {
            // Subscribe to a node
            var subscribeNode = { 
              to: config.server,
              node: config.node
            }
            console.log('subscribeNode', subscribeNode)
            socket.emit(
                'xmpp.pubsub.subscribe', subscribeNode, function(error, success) {
                    if (error) return console.error('Error subscribing to node', error)
                    console.log('Node created')
                }
            )
            // Publish a test item
            var publishItem = {
                to: config.server,
                node: config.node,
                content: 'Hello world!',
            }
            socket.emit('xmpp.pubsub.publish', publishItem, function(error, data) {
                if (error) return console.error('Failed to publish to node', error)
                console.log('Published to node', data)
            })
        }
        var node = {
            to: config.server,
            node: config.node
        }
        socket.emit('xmpp.pubsub.create', node, function(error, success) {
            console.log('Node create', error, success)
            subscribeAndPost()
        })
    })
    socket.emit('xmpp.login', config.connect)
}
