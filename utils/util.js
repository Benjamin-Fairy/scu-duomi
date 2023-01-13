var r = function(r) {
    return (r = r.toString())[1] ? r : "0" + r;
};

function n(r, n) {
    return r << n | r >>> 32 - n;
}

function t(r, n) {
    var t, o, e, u, i;
    return e = 2147483648 & r, u = 2147483648 & n, i = (1073741823 & r) + (1073741823 & n), 
    (t = 1073741824 & r) & (o = 1073741824 & n) ? 2147483648 ^ i ^ e ^ u : t | o ? 1073741824 & i ? 3221225472 ^ i ^ e ^ u : 1073741824 ^ i ^ e ^ u : i ^ e ^ u;
}

function o(r, o, e, u, i, f, a) {
    return r = t(r, t(t(function(r, n, t) {
        return r & n | ~r & t;
    }(o, e, u), i), a)), t(n(r, f), o);
}

function e(r, o, e, u, i, f, a) {
    return r = t(r, t(t(function(r, n, t) {
        return r & t | n & ~t;
    }(o, e, u), i), a)), t(n(r, f), o);
}

function u(r, o, e, u, i, f, a) {
    return r = t(r, t(t(function(r, n, t) {
        return r ^ n ^ t;
    }(o, e, u), i), a)), t(n(r, f), o);
}

function i(r, o, e, u, i, f, a) {
    return r = t(r, t(t(function(r, n, t) {
        return n ^ (r | ~t);
    }(o, e, u), i), a)), t(n(r, f), o);
}

function f(r) {
    var n, t = "", o = "";
    for (n = 0; n <= 3; n++) t += (o = "0" + (r >>> 8 * n & 255).toString(16)).substr(o.length - 2, 2);
    return t;
}

module.exports = {
    md5: function(r) {
        var n, a, c, g, C, h, m, d, s, S = Array();
        for (S = function(r) {
            var n, t = r.length, o = t + 8, e = 16 * ((o - o % 64) / 64 + 1), u = Array(e - 1), i = 0, f = 0;
            for (;f < t; ) i = f % 4 * 8, u[n = (f - f % 4) / 4] = u[n] | r.charCodeAt(f) << i, 
            f++;
            return i = f % 4 * 8, u[n = (f - f % 4) / 4] = u[n] | 128 << i, u[e - 2] = t << 3, 
            u[e - 1] = t >>> 29, u;
        }(r = function(r) {
            for (var n = "", t = 0; t < r.length; t++) {
                var o = r.charCodeAt(t);
                o < 128 ? n += String.fromCharCode(o) : o > 127 && o < 2048 ? (n += String.fromCharCode(o >> 6 | 192), 
                n += String.fromCharCode(63 & o | 128)) : (n += String.fromCharCode(o >> 12 | 224), 
                n += String.fromCharCode(o >> 6 & 63 | 128), n += String.fromCharCode(63 & o | 128));
            }
            return n;
        }(r)), h = 1732584193, m = 4023233417, d = 2562383102, s = 271733878, n = 0; n < S.length; n += 16) a = h, 
        c = m, g = d, C = s, h = o(h, m, d, s, S[n + 0], 7, 3614090360), s = o(s, h, m, d, S[n + 1], 12, 3905402710), 
        d = o(d, s, h, m, S[n + 2], 17, 606105819), m = o(m, d, s, h, S[n + 3], 22, 3250441966), 
        h = o(h, m, d, s, S[n + 4], 7, 4118548399), s = o(s, h, m, d, S[n + 5], 12, 1200080426), 
        d = o(d, s, h, m, S[n + 6], 17, 2821735955), m = o(m, d, s, h, S[n + 7], 22, 4249261313), 
        h = o(h, m, d, s, S[n + 8], 7, 1770035416), s = o(s, h, m, d, S[n + 9], 12, 2336552879), 
        d = o(d, s, h, m, S[n + 10], 17, 4294925233), m = o(m, d, s, h, S[n + 11], 22, 2304563134), 
        h = o(h, m, d, s, S[n + 12], 7, 1804603682), s = o(s, h, m, d, S[n + 13], 12, 4254626195), 
        d = o(d, s, h, m, S[n + 14], 17, 2792965006), h = e(h, m = o(m, d, s, h, S[n + 15], 22, 1236535329), d, s, S[n + 1], 5, 4129170786), 
        s = e(s, h, m, d, S[n + 6], 9, 3225465664), d = e(d, s, h, m, S[n + 11], 14, 643717713), 
        m = e(m, d, s, h, S[n + 0], 20, 3921069994), h = e(h, m, d, s, S[n + 5], 5, 3593408605), 
        s = e(s, h, m, d, S[n + 10], 9, 38016083), d = e(d, s, h, m, S[n + 15], 14, 3634488961), 
        m = e(m, d, s, h, S[n + 4], 20, 3889429448), h = e(h, m, d, s, S[n + 9], 5, 568446438), 
        s = e(s, h, m, d, S[n + 14], 9, 3275163606), d = e(d, s, h, m, S[n + 3], 14, 4107603335), 
        m = e(m, d, s, h, S[n + 8], 20, 1163531501), h = e(h, m, d, s, S[n + 13], 5, 2850285829), 
        s = e(s, h, m, d, S[n + 2], 9, 4243563512), d = e(d, s, h, m, S[n + 7], 14, 1735328473), 
        h = u(h, m = e(m, d, s, h, S[n + 12], 20, 2368359562), d, s, S[n + 5], 4, 4294588738), 
        s = u(s, h, m, d, S[n + 8], 11, 2272392833), d = u(d, s, h, m, S[n + 11], 16, 1839030562), 
        m = u(m, d, s, h, S[n + 14], 23, 4259657740), h = u(h, m, d, s, S[n + 1], 4, 2763975236), 
        s = u(s, h, m, d, S[n + 4], 11, 1272893353), d = u(d, s, h, m, S[n + 7], 16, 4139469664), 
        m = u(m, d, s, h, S[n + 10], 23, 3200236656), h = u(h, m, d, s, S[n + 13], 4, 681279174), 
        s = u(s, h, m, d, S[n + 0], 11, 3936430074), d = u(d, s, h, m, S[n + 3], 16, 3572445317), 
        m = u(m, d, s, h, S[n + 6], 23, 76029189), h = u(h, m, d, s, S[n + 9], 4, 3654602809), 
        s = u(s, h, m, d, S[n + 12], 11, 3873151461), d = u(d, s, h, m, S[n + 15], 16, 530742520), 
        h = i(h, m = u(m, d, s, h, S[n + 2], 23, 3299628645), d, s, S[n + 0], 6, 4096336452), 
        s = i(s, h, m, d, S[n + 7], 10, 1126891415), d = i(d, s, h, m, S[n + 14], 15, 2878612391), 
        m = i(m, d, s, h, S[n + 5], 21, 4237533241), h = i(h, m, d, s, S[n + 12], 6, 1700485571), 
        s = i(s, h, m, d, S[n + 3], 10, 2399980690), d = i(d, s, h, m, S[n + 10], 15, 4293915773), 
        m = i(m, d, s, h, S[n + 1], 21, 2240044497), h = i(h, m, d, s, S[n + 8], 6, 1873313359), 
        s = i(s, h, m, d, S[n + 15], 10, 4264355552), d = i(d, s, h, m, S[n + 6], 15, 2734768916), 
        m = i(m, d, s, h, S[n + 13], 21, 1309151649), h = i(h, m, d, s, S[n + 4], 6, 4149444226), 
        s = i(s, h, m, d, S[n + 11], 10, 3174756917), d = i(d, s, h, m, S[n + 2], 15, 718787259), 
        m = i(m, d, s, h, S[n + 9], 21, 3951481745), h = t(h, a), m = t(m, c), d = t(d, g), 
        s = t(s, C);
        return (f(h) + f(m) + f(d) + f(s)).toUpperCase();
    },
    formatTime: function(n) {
        var t = n.getFullYear(), o = n.getMonth() + 1, e = n.getDate(), u = n.getHours(), i = n.getMinutes(), f = n.getSeconds();
        return [ t, o, e ].map(r).join("/") + " " + [ u, i, f ].map(r).join(":");
    }
};