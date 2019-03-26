const fs = require('fs')
const request = require('request');
const exec = require('child_process').exec;
const gm = require('gm').subClass({imageMagick: true});
process.env.PATH += ":/usr/local/GraphicsMagick-1.3.29/bin";

function downloadHead(uri, filename, callback) {
    var stream = fs.createWriteStream(filename);
    request(uri).pipe(stream).on('close', callback);
}

function result_img(head, name, backimgurl, callback) {
    if (name && head) {
        // var mosaic_cmd = 'gm "convert" "-page" "+0+0" "' + backimgurl + '" "-page" "+87+203" "' + __dirname + '/user_image/smallhead_'
        //     + head +'"'+ ' "-font" "'+__dirname+'/china.TTF" "-draw" ' + name + '"100,503" "-mosaic" "' + __dirname + '/../public/action_img/result_image/' + head + '"'
        
        console.log('--------name----------')
        console.log(name)
        
        gm().in('-page','+0+0').in(backimgurl)
          .in('-page','+87+203').in(__dirname + '/user_image/smallhead_'+ head)
          .font(__dirname+'/FZYouSJW_509R.TTF').fontSize(60).fill('#090807').drawText(140,590,name)
          .mosaic()
          .write(__dirname + '/../public/action_img/result_image/' + head,function(error){
            if (error) {
                console.log(error);
            }
            callback('/action_img/result_image/'+head);
          })

        //console.log(mosaic_cmd, '--------------------mosaic_cmd')
        /*exec(mosaic_cmd, function (error, stdout, stderr) {
            if (error) {
                console.log(error);
            }
            callback(head);
        });*/
    } else {
        callback('');
    }
}

function getUserImg(name, headimgurl, backimgurl, callback) {
    var head = Date.now() + '' + parseInt(Math.random() * 10000) + '.png';
    var head_path = __dirname + '/user_image/head_' + head;
    if (headimgurl) {
        downloadHead(headimgurl, head_path, function (err1, res) {
            if (err1) {
                console.log(err1, '------------------err1')
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
                            result_img(head, name, backimgurl,callback)
                        });
                });
        })
    } else {
        result_img('', name, backimgurl,callback)
    }
}

module.exports.getUserImg = getUserImg