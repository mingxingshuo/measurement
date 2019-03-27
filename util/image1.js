const fs = require('fs')
const request = require('request');
const gm = require('gm').subClass({imageMagick: true});

function downloadHead(uri, filename, callback) {
    var stream = fs.createWriteStream(filename);
    request(uri).pipe(stream).on('close', callback);
}

function result_img(backimg, header, name, pic_name, callback) {
    if (backimg) {
        gm().in('-page', '+0+0').in(backimg.backimgurl)
            .in('-page', '+' + header.head_x + '+' + header.head_y + '').in(__dirname + '/user_image/smallhead_' + pic_name)
            .font(__dirname + '/' + name.name_typeface).fontSize(name.name_size).fill(name.name_colour).drawText(name.name_x, name.name_y, name.name)
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
    if (header.headimgurl) {
        downloadHead(header.headimgurl, __dirname + '/user_image/head_' + pic_name, function (err1, res) {
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
                            result_img(backimg, header, name, pic_name, callback)
                        });
                });
        })
    } else {
        result_img('', '', '', '', callback)
    }
}

module.exports.getUserImg = getUserImg