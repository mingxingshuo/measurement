const fs = require('fs')
const request = require('request');
const exec = require('child_process').exec;
const gm = require('gm').subClass({imageMagick: true});
process.env.PATH += ":/usr/local/GraphicsMagick-1.3.28/bin";

function downloadHead(uri, filename, callback) {
    var stream = fs.createWriteStream(filename);
    request(uri).pipe(stream).on('close', callback);
}

function result_img(head, name, backimgurl, callback) {
    if (name && head) {
        var mosaic_cmd = 'gm "convert" "-page" "+0+0" "' + backimgurl + '" "-page" "+87+203" "' + __dirname + '/user_image/smallhead_'
            + head + '" "-font" "' + name + '" "-mosaic" "' + __dirname + '/result_image/' + head + '"'
        console.log(mosaic_cmd, '--------------------mosaic_cmd')

        exec(mosaic_cmd, function (error, stdout, stderr) {
            if (error) {
                console.log(error);
            }
            callback(head);
        });
    } else {
        callback('');
    }
}

function getUserImg(name, headimgurl, backimgurl, callback) {
    var head = Date.now() + '' + parseInt(Math.random() * 10000) + '.jpg';
    var head_path = __dirname + '/user_image/head_' + head;
    if (headimgurl) {
        downloadHead(headimgurl, head_path, function (err1, res) {
            if (err) {
                console.log(err, '------------------err')
            }
            let origin = __dirname + '/user_image/head_' + head;
            let output = __dirname + '/user_image/smallhead_' + head;
            let size = 300;
            gm(origin)
                .crop(233, 233, 29, 26)
                .resize(size, size)
                .write(output, function () {
                    gm(size, size, 'none')
                        .fill(output)
                        .drawCircle(size / 2, size / 2, size / 2, 0)
                        .write(output, function (err) {
                            console.log(err || 'done');
                            result_img(head, name, backimgurl)
                        });
                });
        })
    } else {
        result_img('', name, backimgurl)
    }
}

module.exports.getUserImg = getUserImg