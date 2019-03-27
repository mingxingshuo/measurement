const router = require('koa-router')();
const rp = require('request-promise');
const ConfigModel = require('../model/Config');
const UserconfModel = require('../model/Userconf');
const crypto = require('crypto');
const mem = require('../util/mem');
const imageUtil = require('../util/simage');

router.prefix('/mp/saction')

router.get('/dth/:index_id', getOpenid, async (ctx, next) => {
	ctx.redirect('/mp/action_dth/index.html');
})

router.get('/dth_res',async(ctx,next)=>{
	let index_id = ctx.cookies.get('index_id');
	let openid = ctx.cookies.get('ctx_openid_'+index_id);
	if(!openid){
		return ctx.redirect('/saction/dth/'+index_id);
	}
	let name = decodeURIComponent(ctx.query.name);

	let index = ctx.cookies.get('ctx_index_'+index_id+encodeURIComponent(name))
	console.log('-----index-------',index)

	if(index === undefined || index==='' ){
		index = parseInt(Math.random()*11)+'';
		let key = 'ctx_index_'+index_id+encodeURIComponent(name);
		console.log('key---------------',key)
		ctx.cookies.set(key,index)
	}
	index = parseInt(index)
	console.log('-----parseInt index-------',index)

	let user = await UserconfModel.findOne({openid:openid},{headimgurl:1,nickname:1,openid:1});
	if(!user){
		return ctx.redirect('/mp/action_dth/sub.html?code='+index_id);
	}
	let bgs = [
	'dasao1.png',
	'ersao1.png',
	'liuqing1.png',
	'mengzong1.png',
	'shitiandong1.png',
	'sumingcheng1.png',
	'sumingyu1.png',
	'sumingzhe1.png',
	'sumu1.png',
	'xiaomengzong1.png',
	'xiaomi1.png'
	]
	let str_bg = __dirname+'/../util/bg/dth/'+bgs[index];
	console.log('image 参数------------',name,user.headimgurl,str_bg,index_id+'.jpg')
	let head = await image(name,user.headimgurl,str_bg,index_id+'.jpg')
	console.log('-----路径----')
	head = head.split('.')[0]
	console.log('/mp/action_dth/result.html?img='+encodeURIComponent(head))
	if(head){
		return ctx.redirect('/mp/action_dth/result.html?img='+encodeURIComponent(head))
	}else{
		return ctx.redirect('/saction/dth/'+index_id);
	}
})

function image(name,headimgurl,str_bg,code){
	return new Promise((resolve,reject)=>{
		imageUtil.getUserImg(name,headimgurl,str_bg,code,function(head){
		if(head){
			resolve(head)
		}else{
			resolve('')
		}
	})
	});
}

async function getOpenid(ctx, next){
	let index_id = ctx.params.index_id;
	ctx.cookies.set("index_id",index_id);
	let openid = ctx.cookies.get('ctx_openid_'+index_id);
	if(!openid){
		console.log('-----ctx.query.uuu-----')
		console.log(ctx.query.uuu);
		openid = ctx.query.uuu;
		ctx.cookies.set('ctx_openid_'+index_id,openid);
	}
	let code = ctx.query.code;
	let config = await getConfig(index_id);
	if(!openid){
		if(index_id=='26'){
			return ctx.redirect('/mp/action_dth/sub.html?code='+index_id);
		}
		/*req.session.openid = 'o3qBK0RXH4BlFLEIksKOJEzx08og';
		return callback(req,res);*/
		if(!code){
			console.log('------go to get code-------')
			console.log('http://'+ctx.hostname+ctx.originalUrl)
			let url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+config
			.appid+"&redirect_uri="+encodeURIComponent('http://'+ctx.hostname+ctx.originalUrl)+"&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
			ctx.redirect(url);
		}else{
			let api_url="https://api.weixin.qq.com/sns/oauth2/access_token?appid="+config
			.appid+"&secret="+config
			.appsecret+"&code="+code+"&grant_type=authorization_code";
			let body = await rp({
				uri:api_url,
				json:true
			});
			ctx.cookies.set('ctx_openid_'+index_id,body.openid);
			console.log('-------get  openid---------')
			console.log(body.openid)
			await next()		
		}
	}else{
		await next()
	}
}

async function getConfig(index_id){
	var config = await mem.get("configure_" + index_id);
    if (!config) {
        config = await ConfigModel.findOne({code: index_id})
        if (config) {
            await mem.set("configure_" + index_id, config, 30)
        }
    }
    return config
}

function name_calculate(name , count){
	let md5 = crypto.createHash('md5');
	let str_name = md5.update(name).digest('hex');
	let n = parseInt(str_name,16)
	return n%count
}

module.exports = router
