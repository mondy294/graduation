const ws = require('nodejs-websocket')
const { LOGIN, ADD_FRIEND, TEXT, REPERTORY, CONTRACT, REFRESH_CONTRACT } = require('./constant')
const InitWebsocket = () => {
    const server = ws.createServer((connect) => {
        console.log('新用户连接');

        connect.on('text', (data) => {
            data = JSON.parse(data)
            console.log('收到客户端信息:', data);
            if (data.type == LOGIN) {
                // 每个用户的唯一标识
                connect.id = data.id
            }
            else if (data.type == ADD_FRIEND) {
                sendTo(server, data)
            } else if (data.type == TEXT) {
                sendTo(server, data)
            } else if (data.type == REPERTORY) {
                sendTo(server, data)
            } else if (data.type == CONTRACT) {
                sendTo(server, data)
            } else if (data.type == REFRESH_CONTRACT) {
                sendTo(server, data)
            }

        })
        connect.on('close', () => {
            console.log('websocket连接断开....')
        })

        //监听websocket异常信息
        connect.on('error', () => {
            console.log('websocket连接异常....')
        })

    })
    return server
}

const sendTo = (server, message) => {
    const actions = {
        '1': friendAsk,
        '3': friendAsk,
        '4': sendAll,
        '5': friendAsk,
        '6': friendAsk,
    }
    return actions[message.type](server, message)
}
function friendAsk(server, message) {
    server.connections.forEach(connect => {
        if (connect.id == message.targetId) {
            connect.send(JSON.stringify(message))
        }
    });
}
const sendAll = (server, message) => {
    server.connections.forEach(connect => {
        connect.send(JSON.stringify(message))
    });
}


module.exports = InitWebsocket