export let dir;

cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node
        },

        maxSpeed: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // hide FPS info
        cc.debug.setDisplayStats(false);

        // get joyStickBtn
        this.joyStickBtn = this.node.children[0];

        // Player's move direction
        this.dir = cc.v2(0, 0);

        // touch event
        this.node.on('touchstart', this.onTouchStart, this);
        this.node.on('touchmove', this.onTouchMove, this);
        this.node.on('touchend', this.onTouchEnd, this);
        this.node.on('touchcancel', this.onTouchCancel, this);
    },

    onDestroy() {
        // touch event
        this.node.off('touchstart', this.onTouchStart, this);
        this.node.off('touchmove', this.onTouchMove, this);
        this.node.off('touchend', this.onTouchEnd, this);
        this.node.off('touchcancel', this.onTouchCancel, this);
    },

    onTouchStart(event) {
        // when touch starts, set joyStickBtn's position 
        let pos = this.node.convertToNodeSpaceAR(event.getLocation());
        this.joyStickBtn.setPosition(pos);
    },

    onTouchMove(event) {
        // constantly change joyStickBtn's position
        let posDelta = event.getDelta();
        this.joyStickBtn.setPosition(this.joyStickBtn.position.add(posDelta));

        // get direction
        this.dir = this.joyStickBtn.position.normalize();
    },

    onTouchEnd(event) {
        // reset
        this.joyStickBtn.setPosition(cc.v2(0, 0));
    },

    onTouchCancel(event) {
        // reset
        this.joyStickBtn.setPosition(cc.v2(0, 0));
    },

    update(dt) {
        // get ratio
        let len = this.joyStickBtn.position.mag();
        let maxLen = this.node.width / 2;
        let ratio = len / maxLen;

        // restrict joyStickBtn inside the joyStickPanel
        if (ratio > 1) {
            this.joyStickBtn.setPosition(this.joyStickBtn.position.div(ratio));
        }

        dir = [this.joyStickBtn.position.x, this.joyStickBtn.position.y];


        // move Player
        // let dis = this.dir.mul(this.maxSpeed * ratio);
        // this.player.setPosition(this.player.position.add(dis));

        // restrict Player inside the Canvas
        // if (this.player.x > this.player.parent.width / 2)
        //     this.player.x = this.player.parent.width / 2;
        // else if (this.player.x < -this.player.parent.width / 2)
        //     this.player.x = -this.player.parent.width /2;

        // if (this.player.y > this.player.parent.height / 2)
        //     this.player.y = this.player.parent.height / 2;
        // else if (this.player.y < -this.player.parent.height / 2)
        //     this.player.y = -this.player.parent.height / 2;
    },
});
