const fs = require('fs')
const request = require('request');
const gm = require('gm').subClass({imageMagick: true});

function downloadHead(uri, filename, callback) {
    var stream = fs.createWriteStream(filename);
    request(uri).pipe(stream).on('close', callback);
}

function result_img(backimg, header, name, pic_name, code, callback) {
    if (backimg.url) {
        gm().in('-page', '+0+0').in(backimg.url)
            .in('-page', '+' + header.x + '+' + header.y + '').in(__dirname + '/user_image/smallhead_' + pic_name)
            .in('-page', '+' + code.x + '+' + code.y + '').in(code.url)
            .font(__dirname + '/' + name.typeface).fontSize(name.size).fill(name.colour).drawText(name.x, name.y, name.name)
            .mosaic()
            .write(__dirname + '/../public/action_img/result_image/' + pic_name, function (error) {
                if (error) {
                    console.log(error);
                }
                callback('/action_img/result_image/' + pic_name);
            })
    } else {
        callback('');
    }
}

function getUserImg(param, callback) {
    let pic_name = Date.now() + '' + parseInt(Math.random() * 10000) + '.png';
    let backimg = param.backimg
    let header = param.header
    let name = param.name
    let code = param.code
    if (header.url) {
        downloadHead(header.url, __dirname + '/user_image/head_' + pic_name, function (err1, res) {
            if (err1) {
                console.log(err1, '------------------err1')
            }
            let origin = __dirname + '/user_image/head_' + pic_name;
            let output = __dirname + '/user_image/smallhead_' + pic_name;
            let size = header.size;
            gm(origin)
                .crop(header.crop_h, header.crop_w, header.crop_x, header.crop_y)
                .resize(size, size)
                .write(output, function () {
                    gm(size, size, 'none')
                        .fill(output)
                        .drawCircle(size / 2, size / 2, size / 2, 0)
                        .write(output, function (err) {
                            console.log(err || 'done');
                            result_img(backimg, header, name, pic_name, code, callback)
                        });
                });
        })
    } else {
        result_img('', '', '', '', '', callback)
    }
}

module.exports.getUserImg = getUserImg