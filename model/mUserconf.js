var mongoose = require('mongoose');
//mongoose.set('debug', true);
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var UserconfSchema = new Schema({
    openid: String,
    code: Number,
    nickname: String,
    sex: {type: String, default: "0"},
    province: String,
    city: String,
    country: String,
    headimgurl: String,
    tagIds: Array,
    auction: {type: Number, default: 0},
    action_time: Number,
    subscribe_time: Number,
    unsubscribe_time: Number,
    subscribe_flag: {type: Boolean, default: true},
    referee: String,
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: {createdAt: 'createAt', updatedAt: 'updateAt'}
});


var UserconfModel = db.model('Userconf', UserconfSchema);

module.exports = UserconfModel;