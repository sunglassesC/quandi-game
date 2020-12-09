import { mgobexsInterface } from './mgobexsInterface'

const gameServer: mgobexsInterface.GameServer.IGameServer = {
  // 消息模式
  mode: 'sync',
  // 初始化游戏数据
  onInitGameData: function(): mgobexsInterface.GameData {
    return {}
  },
  // 监听客户端数据
  onRecvFromClient: function onRecvFromClient({ actionData, gameData, SDK, room, exports }: mgobexsInterface.ActionArgs<mgobexsInterface.UserDefinedData>) {
    gameData.pos = Math.floor(Math.random() * 2000)
    SDK.logger.debug('onRecvFromClient', gameData, actionData)
    setTimeout(() => {
      SDK.sendData({ playerIdList: [], data: { data: gameData, ts: new Date().toISOString() } }, { timeout: 2000, maxTry: 3 })
      SDK.exitAction()
    }, gameData.pos)
  },
  // 监听加房广播
  onJoinRoom: function({ actionData, gameData, SDK, room, exports }) {
    SDK.logger.debug('onJoinRoom', 'actionData:', actionData, 'gameData:', gameData, 'room:', room)
  },
  // 监听创建房间广播
  onCreateRoom: function({ actionData, gameData, SDK, room, exports }) {
    SDK.logger.debug('onCreateRoom', 'actionData:', actionData, 'gameData:', gameData, 'room:', room)
  },
  // 监听退房广播
  onLeaveRoom: function({ actionData, gameData, SDK, room, exports }) {
    SDK.logger.debug('onLeaveRoom', 'actionData:', actionData, 'gameData:', gameData, 'room:', room)
  },
  // 监听玩家被移除广播
  onRemovePlayer: function({ actionData, gameData, SDK, room, exports }) {
    SDK.logger.debug('onRemovePlayer', 'actionData:', actionData, 'gameData:', gameData, 'room:', room)
  },
  // 监听房间销毁广播
  onDestroyRoom: function({ actionData, gameData, SDK, room, exports }) {
    SDK.logger.debug('onDestroyRoom', 'actionData:', actionData, 'gameData:', gameData, 'room:', room)
  },
  // 监听修改房间属性广播
  onChangeRoom: function({ actionData, gameData, SDK, room, exports }) {
    SDK.logger.debug('onChangeRoom', 'actionData:', actionData, 'gameData:', gameData, 'room:', room)
  },
  // 监听修改玩家自定义状态广播
  onChangeCustomPlayerStatus: function({ actionData, gameData, SDK, room, exports }) {
    SDK.logger.debug('onChangeCustomPlayerStatus', 'actionData:', actionData, 'gameData:', gameData, 'room:', room)
  },
  // 监听玩家网络状态变化广播
  onChangePlayerNetworkState: function({ actionData, gameData, SDK, room, exports }) {
    SDK.logger.debug('onChangePlayerNetworkState', 'actionData:', actionData, 'gameData:', gameData, 'room:', room)
  },
  // 监听开始帧同步广播
  onStartFrameSync: function({ actionData, gameData, SDK, room, exports }) {
    SDK.logger.debug('onStartFrameSync', 'actionData:', actionData, 'gameData:', gameData, 'room:', room)
  },
  // 监听停止帧同步广播
  onStopFrameSync: function({ actionData, gameData, SDK, room, exports }) {
    SDK.logger.debug('onStopFrameSync', 'actionData:', actionData, 'gameData:', gameData, 'room:', room)
  }
}

let tcbApp: any
// 服务器初始化时调用
function onInitGameServer(tcb: any) {
  // 如需要，可以在此初始化 TCB
  tcbApp = tcb.init({
    secretId: '请填写腾讯云API密钥ID',
    secretKey: '请填写腾讯云API密钥KEY',
    env: '请填写云开发环境ID',
    serviceUrl: 'http://tcb-admin.tencentyun.com/admin',
    timeout: 5000
  })
}

export const mgobexsCode: mgobexsInterface.mgobexsCode = {
  logLevel: 'debug+',
  logLevelSDK: 'debug+',
  gameInfo: {
    gameId: '请填写游戏ID',
    serverKey: '请填写后端密钥'
  },
  onInitGameServer,
  gameServer
}
