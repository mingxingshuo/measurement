const fs = require('fs')
const gm = require('gm');
const request = require('request');
const exec = require('child_process').exec;
process.env.PATH += ":/usr/local/GraphicsMagick-1.3.28/bin";

function share_img(ticket, qr_name, callback) {
    var resize_cmd = 'gm "convert" "' + __dirname + '/qr_image/' + qr_name + '" "-resize" "164x" "' + __dirname + '/qr_image/small_' + qr_name + '"';
    exec(resize_cmd, function (error, stdout, stderr) {
        if (error) {
            console.log(error);
        }
        var mosaic_cmd = 'gm "convert" "-page" "+0+0" "' + __dirname + '/qr_image/tmp_bg_nickname.png" "-page" "+294+1119" "' + __dirname + '/qr_image/small_' + qr_name + '" "-mosaic" "' + __dirname + '/../public/qr_image/' + qr_name + '"'
        exec(mosaic_cmd, function (error, stdout, stderr) {
            if (error) {
                console.log(error);
            }
            memcached.set('qr_' + ticket, qr_name, 7 * 24 * 60 * 60, function (err) {
            });
            callback(qr_name);
        });
    });
}

function result_img(qr_name, nickname, headimgurl, callback) {
    var resize_cmd = 'gm "convert" "' + __dirname + '/user_image/' + qr_name + '" "-resize" "200x" "' + __dirname + '/user_image/small_' + qr_name + '"';
        var resize_head = 'gm "convert" "' + __dirname + '/user_image/head_' + qr_name + '" "-resize" "167x" "' + __dirname + '/user_image/smallhead_' + qr_name + '"';

        exec(resize_cmd, function (error, stdout, stderr) {
            exec(resize_head, function (errorhead, stdouthead, stderrhead) {
                if (error) {
                    console.log(error);
                }
                if (errorhead) {
                    console.log(errorhead);
                }
                var mosaic_cmd = 'gm "convert" "-page" "+0+0" "' + __dirname + '/user_image/tmp_bg_nickname.png" ' +
                    '"-page" "+369+1046" "' + __dirname + '/user_image/small_' + qr_name + '" "-page" "+163+1042" "' + __dirname + '/user_image/smallhead_'
                    + qr_name + '" "-mosaic" "' + __dirname + '/user_image/' + qr_name + '"'
                console.log(mosaic_cmd,'--------------------mosaic_cmd')

                exec(mosaic_cmd, function (error, stdout, stderr) {
                    if (error) {
                        console.log(error);
                    }
                    callback(qr_name);
                });
            });
        });
}

module.exports.result_img = result_img