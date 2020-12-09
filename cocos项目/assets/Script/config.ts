/**
 * 随机产生 openId
 */
const mockOpenId = (): string => {
    let str = Date.now().toString(36);

    for (let i = 0; i < 7; i++) {
        str += Math.ceil(Math.random() * (10 ** 4)).toString(36);
    }

    return str;
};

export default {
    // MGOBE 游戏信息
    gameId: "obg-lx1f8gmq",
    secretKey: "840491c5e72cef76ed4d86d8336711b7a190e513",
    url: "lx1f8gmq.wxlagame.com",
    // 玩家 ID，建议使用真实的 openId
    openId: mockOpenId(),
    // 默认匹配 Code
    matchCode: "match-c4g5esp3",
};