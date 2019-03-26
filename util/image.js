const fs = require('fs')
const request = require('request');
const exec = require('child_process').exec;
process.env.PATH += ":/usr/local/GraphicsMagick-1.3.28/bin";

function downloadHead(uri, filename, callback) {
    var stream = fs.createWriteStream(filename);
    request(uri).pipe(stream).on('close', callback);
}

function result_img(head, name, backimgurl, callback) {
    if (name && head) {
        var mosaic_cmd = 'gm "convert" "-page" "+0+0" "' + __dirname + '/user_image/' + backimgurl + '" "-page" "+163+1042" "' + __dirname + '/user_image/smallhead_'
            + head + '" "-mosaic" "' + __dirname + '/user_image/' + head + '"'
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
            var resize_head = 'gm "convert" "' + __dirname + '/user_image/head_' + head + '" "-resize" "167x" "' + __dirname + '/user_image/smallhead_' + head + '"';
            exec(resize_head, function (errorhead, stdouthead, stderrhead) {
                result_img(head, name, backimgurl)
            });
        })
    } else {
        result_img('', name, backimgurl)
    }
}

module.exports.getUserImg = getUserImg