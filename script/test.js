const imageUtil = require('../util/image1')

function a() {
    let param = {
        backimg: {
            url: __dirname+'/../util/bg/dth/dasao1.png'
        },
        code: {
            url: __dirname + '/../util/qr/26.jpg',
            x: 108,
            y: 1236
        },
        header: {
            url: "http://thirdwx.qlogo.cn/mmopen/bGeGcV1Ycib1gM4icjPYjkjiate8UukcH8pD9gbsfr0ddyIrLic3srkH44W1FR3ZibxF39tuTibc8FN9hxDR1XyichWiaKic0N9ic00kEJ/132",
            size: 300,
            crop_h: 233,
            crop_w: 233,
            crop_x: 29,
            crop_y: 26,
            x: 87,
            y: 203
        },
        name: {
            name: "测试",
            typeface: "FZYouSJW_509R.TTF",
            size: 60,
            colour: "#090807",
            x: 140,
            y: 590
        }
    }
    imageUtil.getUserImg(param, function (data) {
        console.log(data, '----------------------data')
    })
}
a()