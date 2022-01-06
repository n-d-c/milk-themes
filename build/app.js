import {randomBytes, createHash} from "crypto";
import http from "http";
import https from "https";
import zlib from "zlib";
import Stream, {PassThrough, pipeline} from "stream";
import {types} from "util";
import {format, parse, resolve, URLSearchParams as URLSearchParams$1} from "url";
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
const {Readable} = Stream;
const wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
class Blob {
  constructor(blobParts = [], options = {type: ""}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options.type === void 0 ? "" : String(options.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const {size} = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], {type});
    Object.assign(wm.get(blob), {size: span, parts: blobParts});
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
}
Object.defineProperties(Blob.prototype, {
  size: {enumerable: true},
  type: {enumerable: true},
  slice: {enumerable: true}
});
var fetchBlob = Blob;
class FetchBaseError extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
}
class FetchError extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
}
const NAME = Symbol.toStringTag;
const isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
const isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
const isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
const carriage = "\r\n";
const dashes = "-".repeat(2);
const carriageLength = Buffer.byteLength(carriage);
const getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
const getBoundary = () => randomBytes(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
const INTERNALS$2 = Symbol("Body internals");
class Body {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof Stream)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = Stream.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof Stream) {
      body.on("error", (err) => {
        const error = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const {buffer, byteOffset, byteLength} = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new fetchBlob([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
}
Object.defineProperties(Body.prototype, {
  body: {enumerable: true},
  bodyUsed: {enumerable: true},
  arrayBuffer: {enumerable: true},
  blob: {enumerable: true},
  json: {enumerable: true},
  text: {enumerable: true}
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let {body} = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof Stream)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error) {
    if (error instanceof FetchBaseError) {
      throw error;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error.message}`, "system", error);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error.message}`, "system", error);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
const clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let {body} = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof Stream && typeof body.getBoundary !== "function") {
    p1 = new PassThrough({highWaterMark});
    p2 = new PassThrough({highWaterMark});
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
const extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof Stream) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
const getTotalBytes = (request) => {
  const {body} = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
const writeToStream = (dest, {body}) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
const validateHeaderName = typeof http.validateHeaderName === "function" ? http.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", {value: "ERR_INVALID_HTTP_TOKEN"});
    throw err;
  }
};
const validateHeaderValue = typeof http.validateHeaderValue === "function" ? http.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", {value: "ERR_INVALID_CHAR"});
    throw err;
  }
};
class Headers extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
}
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = {enumerable: true};
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch (e) {
      return false;
    }
  }));
}
const redirectStatus = new Set([301, 302, 303, 307, 308]);
const isRedirect = (code) => {
  return redirectStatus.has(code);
};
const INTERNALS$1 = Symbol("Response internals");
class Response extends Body {
  constructor(body = null, options = {}) {
    super(body, options);
    const status = options.status || 200;
    const headers = new Headers(options.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options.url,
      status,
      statusText: options.statusText || "",
      headers,
      counter: options.counter,
      highWaterMark: options.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
}
Object.defineProperties(Response.prototype, {
  url: {enumerable: true},
  status: {enumerable: true},
  ok: {enumerable: true},
  redirected: {enumerable: true},
  statusText: {enumerable: true},
  headers: {enumerable: true},
  clone: {enumerable: true}
});
const getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
};
const INTERNALS = Symbol("Request internals");
const isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
class Request extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return format(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
}
Object.defineProperties(Request.prototype, {
  method: {enumerable: true},
  url: {enumerable: true},
  headers: {enumerable: true},
  redirect: {enumerable: true},
  clone: {enumerable: true},
  signal: {enumerable: true}
});
const getNodeRequestOptions = (request) => {
  const {parsedURL} = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let {agent} = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
class AbortError extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
}
const supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch$1(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options.protocol === "data:") {
      const data = src(request.url);
      const response2 = new Response(data, {headers: {"Content-Type": data.typeFull}});
      resolve2(response2);
      return;
    }
    const send = (options.protocol === "https:" ? https : http).request;
    const {signal} = request;
    let response = null;
    const abort = () => {
      const error = new AbortError("The operation was aborted.");
      reject(error);
      if (request.body && request.body instanceof Stream.Readable) {
        request.body.destroy(error);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location2 = headers.get("Location");
        const locationURL = location2 === null ? null : new URL(location2, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error) {
                reject(error);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof Stream.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch$1(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = pipeline(response_, new PassThrough(), (error) => {
        reject(error);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: zlib.Z_SYNC_FLUSH,
        finishFlush: zlib.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = pipeline(body, zlib.createGunzip(zlibOptions), (error) => {
          reject(error);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = pipeline(response_, new PassThrough(), (error) => {
          reject(error);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = pipeline(body, zlib.createInflate(), (error) => {
              reject(error);
            });
          } else {
            body = pipeline(body, zlib.createInflateRaw(), (error) => {
              reject(error);
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = pipeline(body, zlib.createBrotliDecompress(), (error) => {
          reject(error);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}
function noop$1() {
}
function safe_not_equal$1(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
const subscriber_queue$1 = [];
function writable$1(value, start = noop$1) {
  let stop;
  const subscribers = [];
  function set2(new_value) {
    if (safe_not_equal$1(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue$1.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s = subscribers[i];
          s[1]();
          subscriber_queue$1.push(s, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue$1.length; i += 2) {
            subscriber_queue$1[i][0](subscriber_queue$1[i + 1]);
          }
          subscriber_queue$1.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set2(fn(value));
  }
  function subscribe2(run2, invalidate = noop$1) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set2) || noop$1;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return {set: set2, update, subscribe: subscribe2};
}
function normalize(loaded) {
  if (loaded.error) {
    const error = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    const status = loaded.status;
    if (!(error instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return {status: 500, error};
    }
    return {status, error};
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
async function get_response({request, options, $session, route, status = 200, error}) {
  const host = options.host || request.headers[options.host_header];
  const dependencies = {};
  const serialized_session = try_serialize($session, (error2) => {
    throw new Error(`Failed to serialize session data: ${error2.message}`);
  });
  const serialized_data = [];
  const match = route && route.pattern.exec(request.path);
  const params = route && route.params(match);
  const page2 = {
    host,
    path: request.path,
    query: request.query,
    params
  };
  let uses_credentials = false;
  const fetcher = async (url, opts = {}) => {
    if (options.local && url.startsWith(options.paths.assets)) {
      url = url.replace(options.paths.assets, "");
    }
    const parsed = parse(url);
    if (opts.credentials !== "omit") {
      uses_credentials = true;
    }
    let response;
    if (parsed.protocol) {
      response = await fetch$1(parsed.href, opts);
    } else {
      const resolved = resolve(request.path, parsed.pathname);
      const filename = resolved.slice(1);
      const filename_html = `${filename}/index.html`;
      const asset = options.manifest.assets.find((d2) => d2.file === filename || d2.file === filename_html);
      if (asset) {
        if (options.get_static_file) {
          response = new Response(options.get_static_file(asset.file), {
            headers: {
              "content-type": asset.type
            }
          });
        } else {
          response = await fetch$1(`http://${page2.host}/${asset.file}`, opts);
        }
      }
      if (!response) {
        const rendered2 = await ssr({
          host: request.host,
          method: opts.method || "GET",
          headers: opts.headers || {},
          path: resolved,
          body: opts.body,
          query: new URLSearchParams$1(parsed.query || "")
        }, {
          ...options,
          fetched: url
        });
        if (rendered2) {
          dependencies[resolved] = rendered2;
          response = new Response(rendered2.body, {
            status: rendered2.status,
            headers: rendered2.headers
          });
        }
      }
    }
    if (response) {
      const clone2 = response.clone();
      const headers2 = {};
      clone2.headers.forEach((value, key) => {
        if (key !== "etag")
          headers2[key] = value;
      });
      const payload = JSON.stringify({
        status: clone2.status,
        statusText: clone2.statusText,
        headers: headers2,
        body: await clone2.text()
      });
      serialized_data.push({url, payload});
      return response;
    }
    return new Response("Not found", {
      status: 404
    });
  };
  const component_promises = error ? [options.manifest.layout()] : [options.manifest.layout(), ...route.parts.map((part) => part.load())];
  const components2 = [];
  const props_promises = [];
  let context = {};
  let maxage;
  if (options.only_render_prerenderable_pages) {
    if (error)
      return;
    const mod = await component_promises[component_promises.length - 1];
    if (!mod.prerender)
      return;
  }
  for (let i = 0; i < component_promises.length; i += 1) {
    let loaded;
    try {
      const mod = await component_promises[i];
      components2[i] = mod.default;
      if (mod.preload) {
        throw new Error("preload has been deprecated in favour of load. Please consult the documentation: https://kit.svelte.dev/docs#load");
      }
      loaded = mod.load && await mod.load.call(null, {
        page: page2,
        get session() {
          uses_credentials = true;
          return $session;
        },
        fetch: fetcher,
        context: {...context}
      });
    } catch (e) {
      if (error)
        throw e instanceof Error ? e : new Error(e);
      loaded = {
        error: e instanceof Error ? e : {name: "Error", message: e.toString()},
        status: 500
      };
    }
    if (loaded) {
      loaded = normalize(loaded);
      if (loaded.error) {
        return await get_response({
          request,
          options,
          $session,
          route,
          status: loaded.status,
          error: loaded.error
        });
      }
      if (loaded.redirect) {
        return {
          status: loaded.status,
          headers: {
            location: loaded.redirect
          }
        };
      }
      if (loaded.context) {
        context = {
          ...context,
          ...loaded.context
        };
      }
      maxage = loaded.maxage || 0;
      props_promises[i] = loaded.props;
    }
  }
  const session = writable$1($session);
  let session_tracking_active = false;
  const unsubscribe = session.subscribe(() => {
    if (session_tracking_active)
      uses_credentials = true;
  });
  session_tracking_active = true;
  if (error) {
    if (options.dev) {
      error.stack = await options.get_stack(error);
    } else {
      error.stack = String(error);
    }
  }
  const props = {
    status,
    error,
    stores: {
      page: writable$1(null),
      navigating: writable$1(null),
      session
    },
    page: page2,
    components: components2
  };
  for (let i = 0; i < props_promises.length; i += 1) {
    props[`props_${i}`] = await props_promises[i];
  }
  let rendered;
  try {
    rendered = options.root.render(props);
  } catch (e) {
    if (error)
      throw e instanceof Error ? e : new Error(e);
    return await get_response({
      request,
      options,
      $session,
      route,
      status: 500,
      error: e instanceof Error ? e : {name: "Error", message: e.toString()}
    });
  }
  unsubscribe();
  const js_deps = route ? route.js : [];
  const css_deps = route ? route.css : [];
  const style = route ? route.style : "";
  const s = JSON.stringify;
  const prefix = `${options.paths.assets}/${options.app_dir}`;
  const links = options.amp ? `<style amp-custom>${style || (await Promise.all(css_deps.map((dep) => options.get_amp_css(dep)))).join("\n")}</style>` : [
    ...js_deps.map((dep) => `<link rel="modulepreload" href="${prefix}/${dep}">`),
    ...css_deps.map((dep) => `<link rel="stylesheet" href="${prefix}/${dep}">`)
  ].join("\n			");
  const init2 = options.amp ? `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"></script>` : `
		<script type="module">
			import { start } from ${s(options.entry)};
			start({
				target: ${options.target ? `document.querySelector(${s(options.target)})` : "document.body"},
				paths: ${s(options.paths)},
				status: ${status},
				error: ${serialize_error(error)},
				session: ${serialized_session},
				nodes: [
					${(route ? route.parts : []).map((part) => `import(${s(options.get_component_path(part.id))})`).join(",\n					")}
				],
				page: {
					host: ${host ? s(host) : "location.host"},
					path: ${s(request.path)},
					query: new URLSearchParams(${s(request.query.toString())}),
					params: ${s(params)}
				}
			});
		</script>`;
  const head = [
    rendered.head,
    options.amp ? "" : `<style data-svelte>${style}</style>`,
    links,
    init2
  ].join("\n\n");
  const body = options.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({url, payload}) => `<script type="svelte-data" url="${url}">${payload}</script>`).join("\n\n			")}
		`.replace(/^\t{2}/gm, "");
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${uses_credentials ? "private" : "public"}, max-age=${maxage}`;
  }
  return {
    status,
    headers,
    body: options.template({head, body}),
    dependencies
  };
}
async function render_page(request, context, options) {
  const route = options.manifest.pages.find((route2) => route2.pattern.test(request.path));
  const $session = await (options.setup.getSession && options.setup.getSession({context}));
  if (!route) {
    if (options.fetched) {
      throw new Error(`Bad request in load function: failed to fetch ${options.fetched}`);
    }
    return await get_response({
      request,
      options,
      $session,
      route,
      status: 404,
      error: new Error(`Not found: ${request.path}`)
    });
  }
  return await get_response({
    request,
    options,
    $session,
    route,
    status: 200,
    error: null
  });
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error) {
  if (!error)
    return null;
  let serialized = try_serialize(error);
  if (!serialized) {
    const {name, message, stack} = error;
    serialized = try_serialize({name, message, stack});
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function render_route(request, context, options) {
  const route = options.manifest.endpoints.find((route2) => route2.pattern.test(request.path));
  if (!route)
    return null;
  return route.load().then(async (mod) => {
    const handler = mod[request.method.toLowerCase().replace("delete", "del")];
    if (handler) {
      const match = route.pattern.exec(request.path);
      const params = route.params(match);
      const response = await handler({
        host: options.host || request.headers[options.host_header || "host"],
        path: request.path,
        headers: request.headers,
        query: request.query,
        body: request.body,
        params
      }, context);
      if (typeof response !== "object" || response.body == null) {
        return {
          status: 500,
          body: `Invalid response from route ${request.path}; ${response.body == null ? "body is missing" : `expected an object, got ${typeof response}`}`,
          headers: {}
        };
      }
      let {status = 200, body, headers = {}} = response;
      headers = lowercase_keys(headers);
      if (typeof body === "object" && !("content-type" in headers) || headers["content-type"] === "application/json") {
        headers = {...headers, "content-type": "application/json"};
        body = JSON.stringify(body);
      }
      return {status, body, headers};
    } else {
      return {
        status: 501,
        body: `${request.method} is not implemented for ${request.path}`,
        headers: {}
      };
    }
  });
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function md5(body) {
  return createHash("md5").update(body).digest("hex");
}
async function ssr(request, options) {
  if (request.path.endsWith("/") && request.path !== "/") {
    const q = request.query.toString();
    return {
      status: 301,
      headers: {
        location: request.path.slice(0, -1) + (q ? `?${q}` : "")
      }
    };
  }
  const {context, headers = {}} = await (options.setup.prepare && options.setup.prepare({headers: request.headers})) || {};
  try {
    const response = await (render_route(request, context, options) || render_page(request, context, options));
    if (response) {
      if (response.status === 200) {
        if (!/(no-store|immutable)/.test(response.headers["cache-control"])) {
          const etag = `"${md5(response.body)}"`;
          if (request.headers["if-none-match"] === etag) {
            return {
              status: 304,
              headers: {},
              body: null
            };
          }
          response.headers["etag"] = etag;
        }
      }
      return {
        status: response.status,
        headers: {...headers, ...response.headers},
        body: response.body,
        dependencies: response.dependencies
      };
    }
  } catch (e) {
    if (e && e.stack) {
      e.stack = await options.get_stack(e);
    }
    console.error(e && e.stack || e);
    return {
      status: 500,
      headers,
      body: options.dev ? e.stack : e.message
    };
  }
}
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function null_to_empty(value) {
  return value == null ? "" : value;
}
function set_store_value(store, ret, value = ret) {
  store.set(value);
  return ret;
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
  get_current_component().$$.after_update.push(fn);
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
const escaped = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
const missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
let on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({$$});
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, options = {}) => {
      on_destroy = [];
      const result = {title: "", head: "", css: new Set()};
      const html = $$render(result, props, {}, options);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
function add_classes(classes) {
  return classes ? ` class="${classes}"` : "";
}
const subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = [];
  function set2(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s = subscribers[i];
          s[1]();
          subscriber_queue.push(s, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set2(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set2) || noop;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return {set: set2, update, subscribe: subscribe2};
}
function promisifyRequest(request) {
  return new Promise((resolve2, reject) => {
    request.oncomplete = request.onsuccess = () => resolve2(request.result);
    request.onabort = request.onerror = () => reject(request.error);
  });
}
function createStore(dbName, storeName) {
  const request = indexedDB.open(dbName);
  request.onupgradeneeded = () => request.result.createObjectStore(storeName);
  const dbp = promisifyRequest(request);
  return (txMode, callback) => dbp.then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)));
}
let defaultGetStoreFunc;
function defaultGetStore() {
  if (!defaultGetStoreFunc) {
    defaultGetStoreFunc = createStore("keyval-store", "keyval");
  }
  return defaultGetStoreFunc;
}
function get$1(key, customStore = defaultGetStore()) {
  return customStore("readonly", (store) => promisifyRequest(store.get(key)));
}
function set(key, value, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.put(value, key);
    return promisifyRequest(store.transaction);
  });
}
const MILK_CFG$3 = JSON.parse(decodeURI("%7B%22config%22:%7B%22theme%22:%22hya%22,%22debug%22:true,%22lock_config%22:false,%22cache_swr%22:true,%22cache%22:true,%22expires%22:300,%22pwa%22:true,%22lang%22:%22en%22,%22darkmode%22:%22light%22,%22smoothscroll%22:true,%22topanchor%22:true,%22watch_scroll%22:true,%22watch_resize%22:false,%22watch_mouse%22:false,%22pagination_size%22:8,%22credit%22:%7B%22milk%22:true,%22svelte%22:true,%22graphql%22:true,%22vite%22:true,%22rollup%22:true%7D%7D,%22site%22:%7B%22domain%22:%22staging.immigrationlawnj.com%22,%22url%22:%22https://staging.immigrationlawnj.com%22,%22admin_url%22:%22https://admin.immigrationlawnj.com%22,%22photo%22:%22/img/profile_1200x1200.jpg%22,%22photo_avif%22:%22/img/profile_1200x1200.avif%22,%22photo_webp%22:%22/img/profile_1200x1200.webp%22,%22logo%22:%22/img/logo.svg%22,%22logo_width%22:%22200%22,%22logo_height%22:%2228%22,%22title%22:%22Harlan%20York%20and%20Associates%22,%22tagline%22:%22Immigration%20Attorneys%22,%22organization%22:%22Harlan%20York%20and%20Associates%22,%22first_name%22:%22Harlan%22,%22last_name%22:%22York%22,%22middle_name%22:%22%22,%22prefix_name%22:%22%22,%22suffix_name%22:%22%22,%22nick_name%22:%22%22,%22email_address%22:%22info@immigrationlawnj.com%22,%22phone%22:%221.973.642.1111%22,%22fax%22:%221.973.642.0022%22,%22address%22:%2260%20Park%20Pl%22,%22address2%22:%22Suite%201010%22,%22city%22:%22Newark%22,%22state%22:%22New%20Jersey%22,%22state_abbr%22:%22NJ%22,%22zip%22:%2207102%22,%22country%22:%22United%20States%22,%22country_abbr%22:%22US%22,%22hours_of_operation%22:%229:00am%20%E2%80%93%205:00pm%20/%20Monday%20%E2%80%93%20Friday%22,%22hours_of_operation_dt%22:%22Mo,Tu,We,Th,Fr%2009:00-17:00%22,%22price_range%22:%22$$%22,%22category%22:%22Immigration%20Law%22,%22description%22:%22Harlan%20York%20and%20Associates%20are%20the%20best%20immigration%20lawyers%20for%20Green%20Cards,%20Deportation,%20Family%20Immigration,%20and%20Naturalization%20in%20New%20York,%20New%20Jersey,%20and%20surrounding%20areas.%22,%22keywords%22:%22Immigration%20Law,%20USA%20Immigration,%20Lawer,%20Attourney,%20Greencard,%20Visa%22,%22established%22:%22%22,%22latitude%22:%2240.7385726%22,%22longitude%22:%22-74.1690402%22,%22google_maps%22:%22https://bit.ly/3aPm8HF%22,%22google_maps_embed%22:%22https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1511.533014259071!2d-74.1690402!3d40.7385726!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25381b9bdf0fb%253A0x7681dbe37e1094d1!2sHarlan%2520York%2520%2526%2520Associates!5e0!3m2!1sen!2sca!4v1613362597071!5m2!1sen!2sca%22,%22google_maps_image%22:%22/img/google_maps_1350x922.jpg%22,%22google_maps_image_webp%22:%22/img/google_maps_1350x922.webp%22,%22google_maps_image_avif%22:%22/img/google_maps_1350x922.avif%22,%22google_business%22:%22%22,%22facebook%22:%22http://www.facebook.com/ImmigrationLawNJ%22,%22facebook_photo%22:%22/img/socialmedia_1200x630.jpg%22,%22facebook_type%22:%22website%22,%22twitter%22:%22http://twitter.com/hyorklaw%22,%22twitter_photo%22:%22/img/socialmedia_1200x630.jpg%22,%22instagram%22:%22%22,%22linkedin%22:%22http://www.linkedin.com/in/harlanyork%22,%22youtube%22:%22http://www.youtube.com/user/HYORKLAW%22,%22vimeo%22:%22%22,%22rss%22:%22%22,%22blog%22:%22%22,%22etsy%22:%22%22,%22yelp%22:%22%22,%22airbnb%22:%22%22,%22tiktok%22:%22%22,%22snapchat%22:%22%22,%22pinterest%22:%22%22,%22vcf_file%22:%22/harlan_york.vcf%22,%22calendar%22:%22https://calendly.com/immigrationlawnj/30min-consultation/%22,%22author%22:%22Nelson%20Design%20Collective%22,%22author_url%22:%22http://nelsondesigncollective.com%22,%22author_email%22:%22info@nelsondesigncollective.com%22,%22paypal%22:%22PayFees@immigrationlawnj.com%22,%22lawpay%22:%22https://secure.lawpay.com/pages/immigrationlawnj/operating%22%7D,%22pwa%22:%7B%22app_color%22:%22#800E16%22,%22app_background%22:%22#800E16%22,%22app_name%22:%22Harlan%20York%20and%20Associates%20%E2%80%93%20Immigration%20Attorneys%22%7D,%22sources%22:%7B%22wordpress%22:%22https://admin.immigrationlawnj.com/graphql%22%7D%7D"));
const {config: config$3} = MILK_CFG$3;
const cache_swr = new Map();
const get = (url, request_swr = config$3.cache_swr, request_cache = config$3.cache, expires = config$3.expires) => {
  const store = writable(new Promise(() => {
  }));
  const loadData = async () => {
    let cache_good = false;
    let request_hash = hash(url);
    if (config$3.cache_swr && request_swr) {
      if (cache_swr.has(request_hash)) {
        store.set(Promise.resolve(cache_swr.get(request_hash)));
      }
    }
    if (config$3.cache) {
      const cached_data = await get$1(request_hash);
      if (cached_data && cached_data.data && cached_data.timestamp) {
        let cached_for = parseInt((new Date().getTime() - new Date(cached_data.timestamp).getTime()) / 1e3);
        if (cached_for < config$3.expires) {
          cache_good = true;
          console.log("good cache");
          store.set(Promise.resolve(cached_data));
        } else {
          cache_good = false;
        }
      } else {
        cache_good = false;
      }
    }
    if (!config$3.cache || !cache_good) {
      console.log("invalid cache");
      const response = await fetch(url);
      const data = await response.json();
      if (config$3.cache_swr) {
        cache_swr.set(request_hash, data);
      }
      if (config$3.cache) {
        set(request_hash, {timestamp: new Date(), data});
      }
      store.set(Promise.resolve(data));
    }
  };
  loadData();
  return store;
};
const post = (url, variables = {}) => {
  console.log(url);
  console.log(variables);
  return url;
};
const gql = (query, source, variables = {}, request_swr = config$3.cache_swr, request_cache = config$3.cache, expires = config$3.expires) => {
  const store = writable(new Promise(() => {
  }));
  const loadData = async () => {
    let cache_good = false;
    let request_hash = hash(`${query}${variables}`);
    if (request_swr && request_swr) {
      if (cache_swr.has(request_hash)) {
        store.set(Promise.resolve(cache_swr.get(request_hash)));
      }
    }
    if (request_cache) {
      const cached_data = await get$1(request_hash);
      if (cached_data && cached_data.data && cached_data.timestamp) {
        let cached_for = parseInt((new Date().getTime() - new Date(cached_data.timestamp).getTime()) / 1e3);
        if (cached_for < expires) {
          cache_good = true;
          console.log("good cache");
          store.set(Promise.resolve(cached_data.data));
        } else {
          cache_good = false;
        }
      } else {
        cache_good = false;
      }
    }
    if (!request_cache || !cache_good) {
      console.log("invalid cache");
      const response = await fetch(source, {
        method: "POST",
        referrerPolicy: "no-referrer",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          query,
          variables
        })
      });
      const data = await response.json();
      console.log(data);
      if (request_swr) {
        cache_swr.set(request_hash, data.data);
      }
      if (request_cache) {
        set(request_hash, {timestamp: new Date(), data: data.data});
      }
      store.set(Promise.resolve(data.data));
    }
  };
  loadData();
  return store;
};
const rest = (url, method = "GET") => {
  console.log(url);
  return url;
};
const hash = (str = "") => {
  let hash2 = 0;
  for (let i = 0; i < str.length; i++) {
    hash2 = (hash2 << 5) - hash2 + str.charCodeAt(i);
    hash2 |= 0;
  }
  return Math.abs(hash2);
};
const credits = {
  name: "Milk.js",
  title: "Milk.js - It does a website good.",
  tagline: "Best Developer Experience \u2764 Best Finished Results",
  excerpt: "Svelte-Kit + Vite + SSR + SWR + PWA + CS-CSS + PostCSS + Rollup + JSON-LD + Markdown + SVX + Microformats & Microdata + Serverless + Web Components + GraphQL + REST + Accessibility + Animations + SEO + So much more, all packed in a gooey JAMStack you can host anywhere with Zero Dependency Deploys.  We handle it all so you can focus on creating amazing things, we look forward to seeing what you make. Have some Milk.",
  details: "Have some Milk to go with that.  Milk sits lightly on top of the shoulders of GIANTS like: Svelte-kit, Vite. Rollup, PostCSS, GraphQL, WorkBox, Wordpress, and many more.  Providing the quickest, cleantest, fastest, way to launch perfect headless websites.  We worry about all the tricky stuff so that you can just make amazing things.  We can't wait to see them.",
  url: "https://milkjs.com",
  email: "info@milkjs.com",
  keywords: "Made with MILK: Snowpack, Skypack, Svelte, PWA, WordPress, GraphQL, REST, JAMStack, SSR, SWR, Web Components, CS-CSS, by DevLove (https://devlove.us) & RandomUser (https://random-user.com)",
  logo_mini: "/milk/img/logo_milk.svg",
  logo: "/milk/img/logo_milkjs.svg",
  logo_width: "200",
  logo_height: "200",
  social: "/milk/img/socialmedia_1200x630.jpg",
  svelte_logo: "/milk/img/logo_svelte.svg",
  svelte_title: "Svelte",
  svelte_url: "https://svelte.dev/",
  graphql_logo: "/milk/img/logo_graphql.svg",
  graphql_title: "GraphQL",
  graphql_url: "https://graphql.org/",
  vite_logo: "/milk/img/logo_vite.svg",
  vite_title: "Vite",
  vite_url: "https://vitejs.dev/",
  rollup_logo: "/milk/img/logo_rollup.svg",
  rollup_title: "Rollup",
  rollup_url: "https://postcss.org/",
  postcss_logo: "/milk/img/logo_postcss.svg",
  postcss_title: "PostCSS",
  postcss_url: "https://postcss.org/",
  markdown_logo: "/milk/img/logo_markdown.svg",
  markdown_title: "Markdown",
  markdown_url: "https://daringfireball.net/projects/markdown/syntax",
  hello: "Hello Milk!"
};
Object.freeze(credits);
let browser$1 = {
  online: false,
  darkmode: false
};
const theme = {
  name: "HYA - Harlan York and Associates",
  slug: "hya",
  version: "0.0.11",
  date: "2021-06-15",
  url: "https://milkjs.com/themes/hya",
  author: "Joshua Jarman (Nelson Design Collective)",
  tagline: "Harlan York and Associates",
  excerpt: "Custom theme for Harlan York and Associates.",
  theme_by: "Nelson Design Collective",
  theme_by_url: "https://nelsondesigncollective.com",
  theme_by_email: "support@nelsondesigncollective.com",
  darkmode: true,
  prismjs: true
};
if (typeof window$1 == "undefined") {
  var window$1 = {};
}
const debug = function() {
  if (window$1 == null ? void 0 : window$1.debugging) {
    console.log.apply(this, arguments);
  }
};
const setupDebug = (enabled = true) => {
  window$1.debugging = enabled;
  window$1.debug = debug;
};
const MILK_VERSION = "0.0.08";
const MILK_DATE = "2021-04-19";
const MILK_CWD = "/home/blaze/Dev/HYA-working-site";
const MILK_CFG$2 = JSON.parse(decodeURI("%7B%22config%22:%7B%22theme%22:%22hya%22,%22debug%22:true,%22lock_config%22:false,%22cache_swr%22:true,%22cache%22:true,%22expires%22:300,%22pwa%22:true,%22lang%22:%22en%22,%22darkmode%22:%22light%22,%22smoothscroll%22:true,%22topanchor%22:true,%22watch_scroll%22:true,%22watch_resize%22:false,%22watch_mouse%22:false,%22pagination_size%22:8,%22credit%22:%7B%22milk%22:true,%22svelte%22:true,%22graphql%22:true,%22vite%22:true,%22rollup%22:true%7D%7D,%22site%22:%7B%22domain%22:%22staging.immigrationlawnj.com%22,%22url%22:%22https://staging.immigrationlawnj.com%22,%22admin_url%22:%22https://admin.immigrationlawnj.com%22,%22photo%22:%22/img/profile_1200x1200.jpg%22,%22photo_avif%22:%22/img/profile_1200x1200.avif%22,%22photo_webp%22:%22/img/profile_1200x1200.webp%22,%22logo%22:%22/img/logo.svg%22,%22logo_width%22:%22200%22,%22logo_height%22:%2228%22,%22title%22:%22Harlan%20York%20and%20Associates%22,%22tagline%22:%22Immigration%20Attorneys%22,%22organization%22:%22Harlan%20York%20and%20Associates%22,%22first_name%22:%22Harlan%22,%22last_name%22:%22York%22,%22middle_name%22:%22%22,%22prefix_name%22:%22%22,%22suffix_name%22:%22%22,%22nick_name%22:%22%22,%22email_address%22:%22info@immigrationlawnj.com%22,%22phone%22:%221.973.642.1111%22,%22fax%22:%221.973.642.0022%22,%22address%22:%2260%20Park%20Pl%22,%22address2%22:%22Suite%201010%22,%22city%22:%22Newark%22,%22state%22:%22New%20Jersey%22,%22state_abbr%22:%22NJ%22,%22zip%22:%2207102%22,%22country%22:%22United%20States%22,%22country_abbr%22:%22US%22,%22hours_of_operation%22:%229:00am%20%E2%80%93%205:00pm%20/%20Monday%20%E2%80%93%20Friday%22,%22hours_of_operation_dt%22:%22Mo,Tu,We,Th,Fr%2009:00-17:00%22,%22price_range%22:%22$$%22,%22category%22:%22Immigration%20Law%22,%22description%22:%22Harlan%20York%20and%20Associates%20are%20the%20best%20immigration%20lawyers%20for%20Green%20Cards,%20Deportation,%20Family%20Immigration,%20and%20Naturalization%20in%20New%20York,%20New%20Jersey,%20and%20surrounding%20areas.%22,%22keywords%22:%22Immigration%20Law,%20USA%20Immigration,%20Lawer,%20Attourney,%20Greencard,%20Visa%22,%22established%22:%22%22,%22latitude%22:%2240.7385726%22,%22longitude%22:%22-74.1690402%22,%22google_maps%22:%22https://bit.ly/3aPm8HF%22,%22google_maps_embed%22:%22https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1511.533014259071!2d-74.1690402!3d40.7385726!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25381b9bdf0fb%253A0x7681dbe37e1094d1!2sHarlan%2520York%2520%2526%2520Associates!5e0!3m2!1sen!2sca!4v1613362597071!5m2!1sen!2sca%22,%22google_maps_image%22:%22/img/google_maps_1350x922.jpg%22,%22google_maps_image_webp%22:%22/img/google_maps_1350x922.webp%22,%22google_maps_image_avif%22:%22/img/google_maps_1350x922.avif%22,%22google_business%22:%22%22,%22facebook%22:%22http://www.facebook.com/ImmigrationLawNJ%22,%22facebook_photo%22:%22/img/socialmedia_1200x630.jpg%22,%22facebook_type%22:%22website%22,%22twitter%22:%22http://twitter.com/hyorklaw%22,%22twitter_photo%22:%22/img/socialmedia_1200x630.jpg%22,%22instagram%22:%22%22,%22linkedin%22:%22http://www.linkedin.com/in/harlanyork%22,%22youtube%22:%22http://www.youtube.com/user/HYORKLAW%22,%22vimeo%22:%22%22,%22rss%22:%22%22,%22blog%22:%22%22,%22etsy%22:%22%22,%22yelp%22:%22%22,%22airbnb%22:%22%22,%22tiktok%22:%22%22,%22snapchat%22:%22%22,%22pinterest%22:%22%22,%22vcf_file%22:%22/harlan_york.vcf%22,%22calendar%22:%22https://calendly.com/immigrationlawnj/30min-consultation/%22,%22author%22:%22Nelson%20Design%20Collective%22,%22author_url%22:%22http://nelsondesigncollective.com%22,%22author_email%22:%22info@nelsondesigncollective.com%22,%22paypal%22:%22PayFees@immigrationlawnj.com%22,%22lawpay%22:%22https://secure.lawpay.com/pages/immigrationlawnj/operating%22%7D,%22pwa%22:%7B%22app_color%22:%22#800E16%22,%22app_background%22:%22#800E16%22,%22app_name%22:%22Harlan%20York%20and%20Associates%20%E2%80%93%20Immigration%20Attorneys%22%7D,%22sources%22:%7B%22wordpress%22:%22https://admin.immigrationlawnj.com/graphql%22%7D%7D"));
const {config: config$2, site, pwa, sources} = MILK_CFG$2;
if (config$2.lock_config) {
  Object.freeze(config$2);
  Object.freeze(site);
  Object.freeze(pwa);
  Object.freeze(sources);
}
if (config$2 == null ? void 0 : config$2.debug) {
  setupDebug(config$2 == null ? void 0 : config$2.debug);
}
debug(`%c\u{1F95B}MILK: Pouring you a glass of Milk.js v${MILK_VERSION}...`, "font-weight: bold;");
const milk = writable({
  version: MILK_VERSION,
  date: MILK_DATE,
  cwd: MILK_CWD,
  hello: config$2 == null ? void 0 : config$2.hello,
  credits,
  config: config$2,
  theme,
  site,
  pwa,
  data: Object.freeze({
    sources,
    get,
    post,
    rest,
    gql
  })
});
const browser = writable(browser$1);
debug("%c    \u{1F95B} Milk.js     ", "font-size: 8rem;background: linear-gradient(320deg, #3A0D2E 0%, #60154C 50%, #B32A51 100%); text-shadow: 0.5rem 0.5rem 0.25rem rgba(0,0,0,0.4); line-height: 30rem; vertical-align: top; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';");
debug(`%c\u{1F95B}MILK: %cPoured Milk.js v${MILK_VERSION}, Enjoy!.`, "font-weight: bold;", "font-weight: normal;");
debug(`%c\u{1FA85}MILKTHEME: %c${theme == null ? void 0 : theme.name} / ${theme == null ? void 0 : theme.slug} v${theme == null ? void 0 : theme.version}.`, "font-weight: bold;", "font-weight: normal;");
const Head_ContentType = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var {mime_type = "text/html"} = $$props;
  var {encoding = "utf-8"} = $$props;
  var content = "text/html; charset=utf-8";
  if ($$props.mime_type === void 0 && $$bindings.mime_type && mime_type !== void 0)
    $$bindings.mime_type(mime_type);
  if ($$props.encoding === void 0 && $$bindings.encoding && encoding !== void 0)
    $$bindings.encoding(encoding);
  content = mime_type + "; charset=" + encoding;
  return `${$$result.head += `<meta${add_attribute("charset", encoding, 0)} data-svelte="svelte-440jr"><meta http-equiv="${"content-type"}"${add_attribute("content", content, 0)} data-svelte="svelte-440jr">`, ""}`;
});
const Head_Website = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<meta name="${"viewport"}" content="${"width=device-width, initial-scale=1, minimum-scale=1"}" data-svelte="svelte-3dp1f8">`, ""}`;
});
const Head_PWA = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var _$milk, _$milk$pwa, _$milk2, _$milk2$pwa, _$milk3, _$milk3$pwa;
  var {app_name} = $$props;
  var {app_color} = $$props;
  var {app_background} = $$props;
  if ($$props.app_name === void 0 && $$bindings.app_name && app_name !== void 0)
    $$bindings.app_name(app_name);
  if ($$props.app_color === void 0 && $$bindings.app_color && app_color !== void 0)
    $$bindings.app_color(app_color);
  if ($$props.app_background === void 0 && $$bindings.app_background && app_background !== void 0)
    $$bindings.app_background(app_background);
  app_name || (app_name = ((_$milk = $milk) == null ? void 0 : (_$milk$pwa = _$milk.pwa) == null ? void 0 : _$milk$pwa.app_name) || "Milk based App");
  app_color || (app_color = ((_$milk2 = $milk) == null ? void 0 : (_$milk2$pwa = _$milk2.pwa) == null ? void 0 : _$milk2$pwa.app_color) || "#60154C");
  app_background || (app_background = ((_$milk3 = $milk) == null ? void 0 : (_$milk3$pwa = _$milk3.pwa) == null ? void 0 : _$milk3$pwa.app_background) || "#FFF");
  $$unsubscribe_milk();
  return `${$$result.head += `<meta name="${"viewport"}" content="${"width=device-width, initial-scale=1,minimum-scale=1"}" data-svelte="svelte-1b8ab6w"><meta name="${"application-name"}" content="${"Harlan York & Associates \u2013 Immigration Attorneys"}" data-svelte="svelte-1b8ab6w"><link async rel="${"manifest"}" href="${"/manifest.json"}" data-svelte="svelte-1b8ab6w"><link async href="${"/register-service-workers.js"}" rel="${"preload"}" as="${"script"}" data-svelte="svelte-1b8ab6w"><script async src="${"/register-service-workers.js"}" data-svelte="svelte-1b8ab6w"></script><meta name="${"theme-color"}"${add_attribute("content", app_color, 0)} data-svelte="svelte-1b8ab6w"><meta name="${"apple-mobile-web-app-capable"}" content="${"yes"}" data-svelte="svelte-1b8ab6w"><meta name="${"apple-mobile-web-app-status-bar-style"}" content="${"default"}" data-svelte="svelte-1b8ab6w"><meta name="${"apple-mobile-web-app-title"}"${add_attribute("content", app_name, 0)} data-svelte="svelte-1b8ab6w"><link async rel="${"apple-touch-startup-image"}" href="${"/ico/splash-1024x1024.png"}" data-svelte="svelte-1b8ab6w"><link async rel="${"apple-touch-icon"}" href="${"/ico/apple-touch-icon-152x152.png"}" data-svelte="svelte-1b8ab6w"><link async rel="${"apple-touch-icon-precomposed"}" sizes="${"57x57"}" href="${"/ico/apple-touch-icon-57x57.png"}" data-svelte="svelte-1b8ab6w"><link async rel="${"apple-touch-icon-precomposed"}" sizes="${"60x60"}" href="${"/ico/apple-touch-icon-60x60.png"}" data-svelte="svelte-1b8ab6w"><link async rel="${"apple-touch-icon-precomposed"}" sizes="${"72x72"}" href="${"/ico/apple-touch-icon-72x72.png"}" data-svelte="svelte-1b8ab6w"><link async rel="${"apple-touch-icon-precomposed"}" sizes="${"76x76"}" href="${"/ico/apple-touch-icon-76x76.png"}" data-svelte="svelte-1b8ab6w"><link async rel="${"apple-touch-icon-precomposed"}" sizes="${"114x114"}" href="${"/ico/apple-touch-icon-114x114.png"}" data-svelte="svelte-1b8ab6w"><link async rel="${"apple-touch-icon-precomposed"}" sizes="${"120x120"}" href="${"/ico/apple-touch-icon-120x120.png"}" data-svelte="svelte-1b8ab6w"><link async rel="${"apple-touch-icon-precomposed"}" sizes="${"144x144"}" href="${"/ico/apple-touch-icon-144x144.png"}" data-svelte="svelte-1b8ab6w"><link async rel="${"apple-touch-icon-precomposed"}" sizes="${"152x152"}" href="${"/ico/apple-touch-icon-152x152.png"}" data-svelte="svelte-1b8ab6w"><meta name="${"msapplication-TileColor"}"${add_attribute("content", app_color, 0)} data-svelte="svelte-1b8ab6w"><meta name="${"msapplication-TileImage"}" content="${"/ico/mstile-144x144.png"}" data-svelte="svelte-1b8ab6w"><meta name="${"msapplication-TileImage"}" content="${"/ico/mstile-310x310.png"}" data-svelte="svelte-1b8ab6w"><meta name="${"msapplication-square70x70logo"}" content="${"/ico/mstile-70x70.png"}" data-svelte="svelte-1b8ab6w"><meta name="${"msapplication-square150x150logo"}" content="${"/ico/mstile-150x150.png"}" data-svelte="svelte-1b8ab6w"><meta name="${"msapplication-wide310x150logo"}" content="${"/ico/mstile-310x150.png"}" data-svelte="svelte-1b8ab6w"><meta name="${"msapplication-square310x310logo"}" content="${"/ico/mstile-310x310.png"}" data-svelte="svelte-1b8ab6w">`, ""}`;
});
const Head_Favicon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<link async rel="${"icon"}" href="${"/favicon.ico"}" data-svelte="svelte-oi7co3"><link async rel="${"icon"}" type="${"image/png"}" href="${"/ico/favicon-16x16.png"}" sizes="${"16x16"}" data-svelte="svelte-oi7co3"><link async rel="${"icon"}" type="${"image/png"}" href="${"/ico/favicon-32x32.png"}" sizes="${"32x32"}" data-svelte="svelte-oi7co3"><link async rel="${"icon"}" type="${"image/png"}" href="${"/ico/favicon-64x64.png"}" sizes="${"64x64"}" data-svelte="svelte-oi7co3"><link async rel="${"icon"}" type="${"image/png"}" href="${"/ico/favicon-96x96.png"}" sizes="${"96x96"}" data-svelte="svelte-oi7co3"><link async rel="${"icon"}" type="${"image/png"}" href="${"/ico/favicon-128x128.png"}" sizes="${"128x128"}" data-svelte="svelte-oi7co3"><link async rel="${"icon"}" type="${"image/png"}" href="${"/ico/favicon-256x256.png"}" sizes="${"256x256"}" data-svelte="svelte-oi7co3"><link async rel="${"icon"}" type="${"image/png"}" href="${"/ico/favicon-512x512.png"}" sizes="${"512x512"}" data-svelte="svelte-oi7co3"><link async rel="${"icon"}" type="${"image/png"}" href="${"/ico/favicon-1024x1024.png"}" sizes="${"1024x1024"}" data-svelte="svelte-oi7co3">`, ""}`;
});
const Head_MilkCSS = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a;
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  $$unsubscribe_milk();
  return `${$$result.head += `<style type="${"text/css"}" data-note="${"Reset CSS"}" data-svelte="svelte-1fsmg9c">@charset "UTF-8";*,:after,:before{box-sizing:border-box;scroll-behavior:smooth}@media (prefers-reduced-motion:reduce){*,:after,:before{-webkit-animation-delay:-1ms;animation-delay:-1ms;-webkit-animation-duration:1ms;animation-duration:1ms;-webkit-animation-iteration-count:1;animation-iteration-count:1;background-attachment:scroll;scroll-behavior:auto;transition-delay:0s;transition-duration:0s}}a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{cursor:default;-moz-tab-size:4;-o-tab-size:4;tab-size:4;margin:0;padding:0;border:none;font:inherit;font-size:100%;vertical-align:baseline}html{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-size:1rem;font-weight:400;line-height:1.5;color:inherit;background-color:inherit;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:transparent}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}[tabindex="-1"]:focus:not(.focus-visible),[tabindex="-1"]:focus:not(:focus-visible){outline:0}hr{margin:1em 0;color:inherit;background-color:currentColor;border:0;overflow:visible}hr:not([size]){height:1px}h1,h2,h3,h4,h5,h6{margin-top:0;margin-bottom:.5em;font-weight:500;line-height:1.2}h1{font-size:calc(1.375em + 1.5vw)}@media (min-width:1200px){h1{font-size:2.5em}}h2{font-size:calc(1.325em + .9vw)}@media (min-width:1200px){h2{font-size:2em}}h3{font-size:calc(1.3em + .6vw)}@media (min-width:1200px){h3{font-size:1.75em}}h4{font-size:calc(1.275em + .3vw)}@media (min-width:1200px){h4{font-size:1.5em}}h5{font-size:1.25em}h6{font-size:1em}p{margin-top:0;margin-bottom:1em}abbr[data-bs-original-title],abbr[title]{-webkit-text-decoration:underline dotted;text-decoration:underline dotted;cursor:help;-webkit-text-decoration-skip-ink:none;text-decoration-skip-ink:none}address{margin-bottom:1em;font-style:normal;line-height:inherit}ol,ul{padding-left:2em}dl,ol,ul{margin-top:0;margin-bottom:1em}ol ol,ol ul,ul ol,ul ul{margin-bottom:0}nav li{list-style:none;padding:0}nav li:before{content:"\u200B"}dt{font-weight:700}dd{margin-bottom:.5em;margin-left:0}blockquote{margin:0 0 1em}b,strong{font-weight:bolder}small{font-size:.875em}mark{padding:.2em;background-color:currentColor}sub,sup{position:relative;font-size:.75em;line-height:0;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}a{cursor:pointer;color:#3333e1;background-color:transparent;text-decoration:none}a:hover{color:#3434e0;text-decoration:underline}a:focus{outline:thin dotted}a:not([href]):not([class]):hover,a:not([href]):not(class){cursor:default;color:inherit;text-decoration:none}[tabindex],a,area,button,input,label,select,summary,textarea{touch-action:manipulation}code,kbd,pre,samp{font-family:Fira Code,Cascadia Code,Consolas,Inconsolata,Monaco,Menlo,Noto Mono,Roboto Mono,Droid Sans Mono,Ubuntu Mono,"Ubuntu Monospace",Source Code Pro,Oxygen Mono,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,monospace,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-size:1em}pre{display:block;margin-top:0;margin-bottom:1em;font-size:.875em;overflow:auto;-ms-overflow-style:scrollbar}pre code{font-size:inherit;color:inherit;word-break:normal}code{font-size:.875em;word-wrap:break-word}a>*,code,kbd{color:inherit}kbd{padding:.2em .4em;font-size:.875em;background-color:inherit;border-radius:.2em}kbd kbd{padding:0;font-size:1em;font-weight:700}figure{margin:0 0 1em}iframe{max-width:100%}img,input,select,textarea{height:auto;max-width:100%}audio,canvas,iframe,img,svg,video{vertical-align:middle}svg:not([fill]){fill:currentColor}svg:not(:root){overflow:hidden}img{border:0;-ms-interpolation-mode:bicubic}table{caption-side:bottom;border-collapse:collapse;text-indent:0}caption{padding-top:.5em;padding-bottom:.5em;color:inherit;text-align:left}th{text-align:inherit;text-align:-webkit-match-parent}tbody,td,tfoot,th,thead,tr{border:0 solid;border-color:inherit}label{display:inline-block}button{border-radius:0;text-transform:none}button:focus{outline:1px dotted;outline:5px auto -webkit-focus-ring-color}button,input{overflow:visible}button,input,optgroup,select,textarea{margin:0;font-family:inherit;font-size:inherit;line-height:inherit}button,input,select,textarea{background-color:transparent;border:1px solid WindowFrame;color:inherit;font:inherit;letter-spacing:inherit;padding:.25em .375em}button,select{text-transform:none}[role=button]{cursor:pointer}select{text-transform:none;word-wrap:normal}select:not([multiple]):not([size]){background-image:"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='4'%3E%3Cpath d='M4 0h6L7 4'/%3E%3C/svg%3E"}::-ms-expand{display:none}[list]::-webkit-calendar-picker-indicator{display:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}[type=button]:not(disabled),[type=reset]:not(disabled),[type=submit]:not(disabled),button:not(disabled){cursor:pointer}::-webkit-file-upload-button{font:inherit;-webkit-appearance:button}textarea{overflow:auto;-ms-overflow-style:scrollbar;resize:vertical;vertical-align:top}fieldset{min-width:0;padding:.35em .75em .625em;margin:0;border:1px solid inherit}legend{float:left;width:100%;padding:0;margin-bottom:.5em;font-size:calc(1.275em + .3vw);line-height:inherit;max-width:100%;white-space:normal}@media (max-width:1200px){legend{font-size:1.5em}}legend+*{clear:left}dialog{background-color:inherit;border:solid;color:inherit;display:block;height:-webkit-fit-content;height:-moz-fit-content;height:fit-content;left:0;margin:auto;padding:1em;position:absolute;right:0;width:-webkit-fit-content;width:-moz-fit-content;width:fit-content}dialog:not([open]){display:none}::-webkit-datetime-edit-day-field,::-webkit-datetime-edit-fields-wrapper,::-webkit-datetime-edit-hour-field,::-webkit-datetime-edit-minute,::-webkit-datetime-edit-month-field,::-webkit-datetime-edit-text,::-webkit-datetime-edit-year-field{padding:0}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}::-webkit-input-placeholder{color:inherit;opacity:.54}[type=email],[type=number],[type=tel],[type=url]{direction:ltr}::-webkit-color-swatch-wrapper{padding:0}::-moz-focus-inner{padding:0;border-style:none}:-moz-ui-invalid{box-shadow:none}:-moz-focusring{outline:1px dotted ButtonText}output{display:inline-block}iframe{border:none}audio,canvas,video{display:inline;display:inline-block;zoom:1;max-width:100%}audio:not([controls]){display:none;height:0}summary{display:list-item;cursor:pointer}progress{display:inline-block;vertical-align:baseline}[hidden],template{display:none}[aria-busy=true]{cursor:progress}[aria-controls]{cursor:pointer}[aria-disabled=true],[disabled]{cursor:not-allowed}[aria-hidden=false][hidden=false]{display:inline;display:initial}[aria-hidden=false][hidden=false]:not(:focus){clip:rect(0,0,0,0);position:absolute}a,button,select{cursor:pointer!important}input[type=color]{vertical-align:middle}input[type=color]::-webkit-color-swatch-wrapper{padding:0}input[type=color]::-webkit-color-swatch{height:1.4em;width:3em}input[type=color]::-moz-color-swatch{height:1.5em;width:1.6em}input[type=color]{width:2.6em}input[type=day],input[type=number]{width:5em}fieldset label{display:block;font-size:smaller}fieldset .form-row{display:block}fieldset .form-input{display:inline-block;vertical-align:top}h1,h2,h3,h4,h5,h6,p{color:currentColor}</style><style type="${"text/css"}" data-note="${"Accessibility CSS"}" data-svelte="svelte-1fsmg9c">@media (prefers-reduced-motion:reduce){*{-webkit-animation-duration:.01ms!important;animation-duration:.01ms!important;-webkit-animation-iteration-count:1!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}}.do-not-read,.do-not-speak,.no-read,.no-screenreader{speak:none}</style><style type="${"text/css"}" data-note="${"Print CSS"}" data-svelte="svelte-1fsmg9c">@media print{.no-print{display:none}.print-bw,.print-monochrome{filter:grayscale(100%)}}</style><link async${add_attribute("href", `/themes/${$milk.theme.slug}/style.css`, 0)} rel="${"preload"}" as="${"style"}" data-svelte="svelte-1fsmg9c"><link async${add_attribute("href", `/themes/${$milk.theme.slug}/style.css`, 0)} rel="${"stylesheet"}" data-svelte="svelte-1fsmg9c"><style type="${"text/css"}" data-note="${"Milk CSS"}" data-svelte="svelte-1fsmg9c">body{font-size:16px;font-size:var(--base-fontsize,16px)}.notice{border:1px solid var(--color-black);background:var(--color-white);color:var(--color-black);padding:5px 10px;margin:10px 5px;border-color:var(--color-notice);background:var(--background-notice);color:var(--color-notice)}.notice.error{border-color:var(--color-error);background:var(--background-error);color:var(--color-error)}.notice.warning{border-color:var(--color-warn);background:var(--background-warn);color:var(--color-warn)}.notice.success{border-color:var(--color-success);background:var(--background-success);color:var(--color-success)}.color-transparent{color:var(--color-transparent)}.color-white{color:var(--color-white)}.color-offwhite{color:var(--color-offwhite)}.color-grey-light{color:var(--color-grey-light)}.color-grey{color:var(--color-grey)}.color-grey-dark{color:var(--color-grey-dark)}.color-charcoal{color:var(--color-charcoal)}.color-black{color:var(--color-black)}.background-transparent{background-color:var(--color-transparent)}.background-white{background-color:var(--color-white)}.background-offwhite{background-color:var(--color-offwhite)}.background-grey-light{background-color:var(--color-grey-light)}.background-grey{background-color:var(--color-grey)}.background-grey-dark{background-color:var(--color-grey-dark)}.background-charcoal{background-color:var(--color-charcoal)}.background-black{background-color:var(--color-black)}.color-one{color:var(--color-one)}.color-two{color:var(--color-two)}.color-three{color:var(--color-three)}.color-four{color:var(--color-four)}.color-five{color:var(--color-five)}.color-six{color:var(--color-six)}.color-seven{color:var(--color-seven)}.color-eight{color:var(--color-eight)}.background-one{background-color:var(--color-one)}.background-two{background-color:var(--color-two)}.background-three{background-color:var(--color-three)}.background-four{background-color:var(--color-four)}.background-five{background-color:var(--color-five)}.background-six{background-color:var(--color-six)}.background-seven{background-color:var(--color-seven)}.background-eight{background-color:var(--color-eight)}.font-special{font-family:var(--font-special)}.font-main{font-family:var(--font-main)}.font-baseline,.font-resize{vertical-align:baseline}[class*=font-resize]{font-size:1em;font-size:var(--resize-to,calc(1em*var(--resize-by, 1)))}body{background:var(--background);color:var(--text-color)}button,input,select,td,textarea,th{border:var(--border-size) var(--border-style) var(--border-color)}a{color:var(--link-color)}a:active,a:hover{color:var(--link-color-hover)}a:visited{color:var(--link-color-visited)}::-moz-selection{background:var(--highlight-background);color:var(--highlight-color);box-shadow:.04rem .07rem .15rem rgba(0,0,0,.4)}::selection{background:var(--highlight-background);color:var(--highlight-color);box-shadow:.04rem .07rem .15rem rgba(0,0,0,.4)}input,select,select optgroup,select option,textarea{background:var(--input-background);color:var(--input-color)}::-moz-placeholder{color:var(--input-placeholder)}:-ms-input-placeholder{color:var(--input-placeholder)}::placeholder{color:var(--input-placeholder)}a.button,button{transition:color .35s ease,background .35s ease;display:inline-block;vertical-align:middle;text-decoration:none;font-size:var(--button-fontsize);color:var(--button-color);background:var(--button-background);padding:var(--button-padding);border:var(--button-border-size) var(--button-border-style) var(--button-border-color);border-radius:var(--button-border-radius);transform-origin:center}a.button:active,a.button:hover,button:active,button:hover{color:var(--button-color-hover);background:var(--button-background-hover);border-color:var(--button-border-color-hover)}hr{display:block;height:var(--border-size);background:transparent;border:0;border-bottom:var(--border-size) var(--border-style) var(--border-color);max-width:calc(100% - var(--padding-large) - var(--padding-large));margin-left:var(--padding-large);margin-right:var(--padding-large)}input[type=checkbox],input[type=radio],input[type=range],progress{filter:hue-rotate(40deg) brightness(100%);filter:hue-rotate(var(--input-hue-rotate,40deg)) brightness(calc(10% + var(--input-brightness-adjust, 90%)))}meter{filter:saturate(150%) hue-rotate(140deg) brightness(110%);filter:saturate(150%) hue-rotate(calc(100deg + var(--input-hue-rotate, 40deg))) brightness(calc(var(--input-brightness-adjust, 90%) + 20%))}@-moz-document url-prefix(){input[type=checkbox],input[type=radio],input[type=range]{filter:hue-rotate(50deg) brightness(90%);filter:hue-rotate(calc(var(--input-hue-rotate, 40deg) + 10deg)) brightness(var(--input-brightness-adjust,90%))}progress{filter:saturate(200%) brightness(250%) hue-rotate(166deg) brightness(90%);filter:saturate(200%) brightness(250%) hue-rotate(calc(var(--input-hue-rotate, 40deg) + 126deg)) brightness(var(--input-brightness-adjust,90%))}meter{filter:brightness(105%) saturate(90%) hue-rotate(180deg);filter:brightness(calc(15% + var(--input-brightness-adjust, 90%))) saturate(90%) hue-rotate(calc(var(--input-hue-rotate, 40deg) + 140deg))}}*{--prepend:initial;--append:initial;--box-shadow:initial;box-shadow:var(--box-shadow)}:before{content:var(--prepend)}:after{content:var(--append)}details summary::marker{display:none}summary:before{font-family:Hiragino Mincho ProN,Open Sans,sans-serif;content:"\u25B6";position:absolute;top:1rem;left:.8rem;transform:rotate(0);transform-origin:center;transition:transform .2s ease}details[open]>summary:before{transform:rotate(90deg);transition:transform .45s ease}details{max-width:500px;box-sizing:border-box;margin-top:5px;background:var(--color-transparent)}summary{border:4px solid transparent;outline:none;display:block;background:#666;color:#fff;padding:1rem 1rem 1rem 2.2rem;position:relative;cursor:pointer}details[open] summary,summary:hover{color:#ffca28;background:#444}details[open] summary:before,details[open] summary strong,summary:hover:before,summary:hover strong{color:#ffa128}details .content{padding:10px;border:2px solid #888;border-top:none;margin:0}details{overflow:hidden}details summary{position:relative;z-index:10}@-webkit-keyframes details-show{0%{margin-bottom:-80%;opacity:0;transform:translateY(-100%)}}@keyframes details-show{0%{margin-bottom:-80%;opacity:0;transform:translateY(-100%)}}details>:not(summary){-webkit-animation:details-show .5s ease-in-out;animation:details-show .5s ease-in-out;position:relative;z-index:1;transition:all .3s ease-in-out;color:transparent;overflow:hidden}details[open]>:not(summary){color:inherit}details summary :is(h1,h2,h3,h4,h5,h6){margin:0;padding:0}details.faq summary{padding-right:2.2rem;padding-left:1rem}details.faq summary:before{content:"\xD7";color:#fff;font-size:2rem;line-height:1rem;transform:rotate(-45deg);top:1.2rem;left:unset;right:.6rem}details[open].faq>summary:before{transform:rotate(90deg);color:red!important;transition:color 2s ease,transform 1s ease}.hide{position:absolute;max-width:100vw;margin-left:-999vw;visibility:hidden}.remove{display:none}.dark-mode .light-only{position:absolute;margin-left:-9999vw}.dark-mode .light-mode .light-only{position:inherit;margin-left:inherit}.light-mode .dark-only{position:absolute;margin-left:-9999vw}.light-mode .dark-mode .dark-only{position:inherit;margin-left:inherit}.monochrome{filter:grayscale(100%)}.capitalize,capitalize{text-transform:capitalize}.uppercase,uppercase{text-transform:uppercase}.lowercase,lowercase{text-transform:lowercase}.inline-block{display:inline-block}.float-left{float:left}.float-right{float:right}.columns{-moz-column-width:var(--column-width);grid-column-gap:var(--column-gap);-moz-column-gap:var(--column-gap);column-gap:var(--column-gap);-moz-columns:var(--column-count);columns:var(--column-count)}b,em,emphasize{font-weight:700;color:inherit}em,i{font-style:italic}bad,strike{text-decoration:line-through}check,dashed,dotted,double,issue,u,underline,warn,wavy{-webkit-text-decoration-line:underline;text-decoration-line:underline;-webkit-text-decoration-style:solid;text-decoration-style:solid;-webkit-text-decoration-color:currentColor;text-decoration-color:currentColor;-webkit-text-decoration-color:var(--text-decoration-color,currentColor);text-decoration-color:var(--text-decoration-color,currentColor)}cage,cage-dashed,cage-dotted,cage-double,cage-wavy{text-decoration:underline overline;-webkit-text-decoration-style:solid;text-decoration-style:solid}cage-wavy,check,issue,warn,wavy{-webkit-text-decoration-style:wavy;text-decoration-style:wavy}cage-dotted,dotted{-webkit-text-decoration-style:dotted;text-decoration-style:dotted}cage-dashed,dashed{-webkit-text-decoration-style:dashed;text-decoration-style:dashed}cage-double,double{-webkit-text-decoration-style:double;text-decoration-style:double}outline,outline-dashed,outline-dotted,outline-double,outline-groove,outline-inset,outline-offset,outline-outset,outline-ridge{outline-color:currentColor;outline-color:var(--outline-color,currentColor);outline-width:1px;outline-width:var(--outline-size,1px);outline-style:solid}outline-dashed{outline-style:dashed}outline-dotted{outline-style:dotted}outline-double{outline-width:3px;outline-width:calc(var(--outline-size, 1px)*3);outline-style:double}outline-groove{outline-style:groove}outline-inset{outline-style:inset}outline-offset{outline-style:offset}outline-outset{outline-style:outset}outline-ridge{outline-style:ridge}@-webkit-keyframes blink{0%{visibility:hidden}50%{visibility:hidden}to{visibility:visible}}@keyframes blink{0%{visibility:hidden}50%{visibility:hidden}to{visibility:visible}}.animate-blink,blink{-webkit-animation:blink 2s linear infinite;animation:blink 2s linear infinite}@-webkit-keyframes pulse{0%,to{transform:scale(1.05)}50%{transform:scale(.95)}}@keyframes pulse{0%,to{transform:scale(1.05)}50%{transform:scale(.95)}}.animate-pulse,pulse{-webkit-animation:pulse 1s linear infinite;animation:pulse 1s linear infinite}@-webkit-keyframes flash{0%,to{opacity:1}50%{opacity:0}}@keyframes flash{0%,to{opacity:1}50%{opacity:0}}@-webkit-keyframes flashy{0%,to{opacity:1}50%{opacity:.65}}@keyframes flashy{0%,to{opacity:1}50%{opacity:.65}}.animate-flash,flash{-webkit-animation:flash 2s linear infinite;animation:flash 2s linear infinite}.animate-flashy,flashy{-webkit-animation:flashy 2s linear infinite;animation:flashy 2s linear infinite}bad{color:var(--color-error)}issue{-webkit-text-decoration-color:var(--color-error);text-decoration-color:var(--color-error)}warn{-webkit-text-decoration-color:var(--color-warn);text-decoration-color:var(--color-warn)}check{-webkit-text-decoration-color:var(--color-success);text-decoration-color:var(--color-success)}.highlight,.selected,highlight,selected{background:var(--highlight-background);color:var(--highlight-color)}.critical,critical{color:#fff}.critical,critical,emergency{background:var(--color-error)}emergency{-webkit-animation:flashy 2s linear infinite;animation:flashy 2s linear infinite;display:inline-block;color:var(--color-white);outline-width:1px;outline-width:var(--outline-size,1px);outline-style:dashed;outline-color:var(--color-black);vertical-align:middle;padding:0 10px 2px;box-sizing:border-box}table{border:var(--border-size) var(--border-style) var(--border-color);border-collapse:collapse}table th{color:var(--table-head-color);background:var(--table-head-background)}table tr:nth-child(2n) td{color:var(--table-row-even-color);background:var(--table-row-even-background)}table tr:nth-child(odd) td{color:var(--table-row-odd-color);background:var(--table-row-odd-background)}table td,table th{padding:var(--table-cell-padding)}.content{margin:5vw;margin:var(--margin-large,5vw)}.content-inner{margin:0 auto;max-width:100%;max-width:var(--content-constrain,100%)}a,a *,button,button *{cursor:pointer!important}</style>${((_a = $milk == null ? void 0 : $milk.theme) == null ? void 0 : _a.prismjs) ? `<link async${add_attribute("href", `/themes/${$milk.theme.slug}/prismjs.css`, 0)} rel="${"preload"}" as="${"style"}" data-svelte="svelte-1fsmg9c">
		<link async${add_attribute("href", `/themes/${$milk.theme.slug}/prismjs.css`, 0)} rel="${"stylesheet"}" data-svelte="svelte-1fsmg9c">` : ``}`, ""}`;
});
const Head_Extra = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${slots.default ? slots.default({}) : ``}`, ""}`;
});
function asyncGeneratorStep$G(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$G(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$G(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$G(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Setup_DarkMode = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $browser, $$unsubscribe_browser;
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_browser = subscribe(browser, (value) => $browser = value);
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var _$browser;
  var darkMode;
  var setDarkMode = () => {
  };
  onMount(/* @__PURE__ */ _asyncToGenerator$G(function* () {
    var _$milk, _$milk$config, _$milk2, _$milk2$theme, _window, _window$localStorage, _window2, _window2$localStorage, _$milk3, _$milk3$config, _$milk4, _$milk4$config;
    setDarkMode = () => {
      if (darkMode) {
        var _document, _document$querySelect, _document$querySelect2;
        (_document = document) == null ? void 0 : (_document$querySelect = _document.querySelector("body")) == null ? void 0 : (_document$querySelect2 = _document$querySelect.classList) == null ? void 0 : _document$querySelect2.add("dark-mode");
        window.localStorage.setItem("dark-mode", "true");
      } else {
        var _document2, _document2$querySelec, _document2$querySelec2;
        (_document2 = document) == null ? void 0 : (_document2$querySelec = _document2.querySelector("body")) == null ? void 0 : (_document2$querySelec2 = _document2$querySelec.classList) == null ? void 0 : _document2$querySelec2.remove("dark-mode");
        window.localStorage.setItem("dark-mode", "false");
      }
    };
    if (((_$milk = $milk) == null ? void 0 : (_$milk$config = _$milk.config) == null ? void 0 : _$milk$config.darkmode) == "disabled") {
      set_store_value(browser, $browser.darkmode = false, $browser);
    } else if (((_$milk2 = $milk) == null ? void 0 : (_$milk2$theme = _$milk2.theme) == null ? void 0 : _$milk2$theme.darkmode) != true) {
      set_store_value(browser, $browser.darkmode = false, $browser);
    } else if (((_window = window) == null ? void 0 : (_window$localStorage = _window.localStorage) == null ? void 0 : _window$localStorage.getItem("dark-mode")) == "true") {
      set_store_value(browser, $browser.darkmode = true, $browser);
    } else if (((_window2 = window) == null ? void 0 : (_window2$localStorage = _window2.localStorage) == null ? void 0 : _window2$localStorage.getItem("dark-mode")) == "false") {
      set_store_value(browser, $browser.darkmode = false, $browser);
    } else if (((_$milk3 = $milk) == null ? void 0 : (_$milk3$config = _$milk3.config) == null ? void 0 : _$milk3$config.darkmode) == "dark") {
      set_store_value(browser, $browser.darkmode = true, $browser);
    } else if (((_$milk4 = $milk) == null ? void 0 : (_$milk4$config = _$milk4.config) == null ? void 0 : _$milk4$config.darkmode) == "light") {
      set_store_value(browser, $browser.darkmode = false, $browser);
    } else {
      var _window3, _window4, _window4$matchMedia;
      set_store_value(browser, $browser.darkmode = ((_window3 = window) == null ? void 0 : _window3.matchMedia) && ((_window4 = window) == null ? void 0 : (_window4$matchMedia = _window4.matchMedia("(prefers-color-scheme: dark)")) == null ? void 0 : _window4$matchMedia.matches), $browser);
    }
    set_store_value(browser, $browser.toggleDarkMode = toggleDarkMode, $browser);
  }));
  var {toggleDarkMode = () => {
    var _$browser2;
    set_store_value(browser, $browser.darkmode = !((_$browser2 = $browser) != null && _$browser2.darkmode), $browser);
  }} = $$props;
  if ($$props.toggleDarkMode === void 0 && $$bindings.toggleDarkMode && toggleDarkMode !== void 0)
    $$bindings.toggleDarkMode(toggleDarkMode);
  darkMode = ((_$browser = $browser) == null ? void 0 : _$browser.darkmode) || false;
  {
    setDarkMode(darkMode);
  }
  $$unsubscribe_browser();
  $$unsubscribe_milk();
  return ``;
});
function asyncGeneratorStep$F(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$F(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$F(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$F(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Setup_WatchScroll = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $browser, $$unsubscribe_browser;
  $$unsubscribe_browser = subscribe(browser, (value) => $browser = value);
  onMount(/* @__PURE__ */ _asyncToGenerator$F(function* () {
    var _window$pageYOffset, _window, _window$pageXOffset, _window2, _window3, _window4, _document, _document$documentEle, _document$documentEle2, _document2, _document2$documentEl, _document2$documentEl2, _document3, _document3$documentEl, _document3$documentEl2, _document12, _document12$documentE, _document12$documentE2, _document13, _document13$documentE, _document13$documentE2, _document14, _document14$documentE, _document14$documentE2;
    var y = (_window$pageYOffset = (_window = window) == null ? void 0 : _window.pageYOffset) != null ? _window$pageYOffset : 0;
    var x = (_window$pageXOffset = (_window2 = window) == null ? void 0 : _window2.pageXOffset) != null ? _window$pageXOffset : 0;
    var yd = (_window3 = window) != null && _window3.pageYOffset ? "down" : "up";
    var xd = (_window4 = window) != null && _window4.pageXOffset ? "right" : "left";
    (_document = document) == null ? void 0 : (_document$documentEle = _document.documentElement) == null ? void 0 : (_document$documentEle2 = _document$documentEle.style) == null ? void 0 : _document$documentEle2.setProperty == null ? void 0 : _document$documentEle2.setProperty("--scroll-y", y);
    set_store_value(browser, $browser.scroll_y = y, $browser);
    (_document2 = document) == null ? void 0 : (_document2$documentEl = _document2.documentElement) == null ? void 0 : (_document2$documentEl2 = _document2$documentEl.style) == null ? void 0 : _document2$documentEl2.setProperty == null ? void 0 : _document2$documentEl2.setProperty("--scroll-y-last", y);
    set_store_value(browser, $browser.scroll_y_last = y, $browser);
    (_document3 = document) == null ? void 0 : (_document3$documentEl = _document3.documentElement) == null ? void 0 : (_document3$documentEl2 = _document3$documentEl.style) == null ? void 0 : _document3$documentEl2.setProperty == null ? void 0 : _document3$documentEl2.setProperty("--scroll-y-direction", yd);
    set_store_value(browser, $browser.scroll_y_direction = yd, $browser);
    if (yd == "down") {
      var _document4, _document4$querySelec, _document4$querySelec2, _document5, _document5$querySelec, _document5$querySelec2;
      (_document4 = document) == null ? void 0 : (_document4$querySelec = _document4.querySelector("body")) == null ? void 0 : (_document4$querySelec2 = _document4$querySelec.classList) == null ? void 0 : _document4$querySelec2.remove("scroll-up");
      (_document5 = document) == null ? void 0 : (_document5$querySelec = _document5.querySelector("body")) == null ? void 0 : (_document5$querySelec2 = _document5$querySelec.classList) == null ? void 0 : _document5$querySelec2.add("scroll-down");
    } else {
      var _document6, _document6$querySelec, _document6$querySelec2, _document7, _document7$querySelec, _document7$querySelec2;
      (_document6 = document) == null ? void 0 : (_document6$querySelec = _document6.querySelector("body")) == null ? void 0 : (_document6$querySelec2 = _document6$querySelec.classList) == null ? void 0 : _document6$querySelec2.remove("scroll-down");
      (_document7 = document) == null ? void 0 : (_document7$querySelec = _document7.querySelector("body")) == null ? void 0 : (_document7$querySelec2 = _document7$querySelec.classList) == null ? void 0 : _document7$querySelec2.add("scroll-up");
    }
    if (y == 0) {
      var _document8, _document8$querySelec, _document8$querySelec2;
      (_document8 = document) == null ? void 0 : (_document8$querySelec = _document8.querySelector("body")) == null ? void 0 : (_document8$querySelec2 = _document8$querySelec.classList) == null ? void 0 : _document8$querySelec2.add("scroll-attop");
    } else {
      var _document9, _document9$querySelec, _document9$querySelec2;
      (_document9 = document) == null ? void 0 : (_document9$querySelec = _document9.querySelector("body")) == null ? void 0 : (_document9$querySelec2 = _document9$querySelec.classList) == null ? void 0 : _document9$querySelec2.remove("scroll-attop");
    }
    if (y < 10) {
      var _document10, _document10$querySele, _document10$querySele2;
      (_document10 = document) == null ? void 0 : (_document10$querySele = _document10.querySelector("body")) == null ? void 0 : (_document10$querySele2 = _document10$querySele.classList) == null ? void 0 : _document10$querySele2.add("scroll-neartop");
    } else {
      var _document11, _document11$querySele, _document11$querySele2;
      (_document11 = document) == null ? void 0 : (_document11$querySele = _document11.querySelector("body")) == null ? void 0 : (_document11$querySele2 = _document11$querySele.classList) == null ? void 0 : _document11$querySele2.remove("scroll-neartop");
    }
    (_document12 = document) == null ? void 0 : (_document12$documentE = _document12.documentElement) == null ? void 0 : (_document12$documentE2 = _document12$documentE.style) == null ? void 0 : _document12$documentE2.setProperty == null ? void 0 : _document12$documentE2.setProperty("--scroll-x", x);
    set_store_value(browser, $browser.scroll_x = x, $browser);
    (_document13 = document) == null ? void 0 : (_document13$documentE = _document13.documentElement) == null ? void 0 : (_document13$documentE2 = _document13$documentE.style) == null ? void 0 : _document13$documentE2.setProperty == null ? void 0 : _document13$documentE2.setProperty("--scroll-x-last", x);
    set_store_value(browser, $browser.scroll_x_last = x, $browser);
    (_document14 = document) == null ? void 0 : (_document14$documentE = _document14.documentElement) == null ? void 0 : (_document14$documentE2 = _document14$documentE.style) == null ? void 0 : _document14$documentE2.setProperty == null ? void 0 : _document14$documentE2.setProperty("--scroll-x-direction", xd);
    set_store_value(browser, $browser.scroll_x_direction = xd, $browser);
    if (xd == "right") {
      var _document15, _document15$querySele, _document15$querySele2, _document16, _document16$querySele, _document16$querySele2;
      (_document15 = document) == null ? void 0 : (_document15$querySele = _document15.querySelector("body")) == null ? void 0 : (_document15$querySele2 = _document15$querySele.classList) == null ? void 0 : _document15$querySele2.remove("scroll-left");
      (_document16 = document) == null ? void 0 : (_document16$querySele = _document16.querySelector("body")) == null ? void 0 : (_document16$querySele2 = _document16$querySele.classList) == null ? void 0 : _document16$querySele2.add("scroll-right");
    } else {
      var _document17, _document17$querySele, _document17$querySele2, _document18, _document18$querySele, _document18$querySele2;
      (_document17 = document) == null ? void 0 : (_document17$querySele = _document17.querySelector("body")) == null ? void 0 : (_document17$querySele2 = _document17$querySele.classList) == null ? void 0 : _document17$querySele2.remove("scroll-right");
      (_document18 = document) == null ? void 0 : (_document18$querySele = _document18.querySelector("body")) == null ? void 0 : (_document18$querySele2 = _document18$querySele.classList) == null ? void 0 : _document18$querySele2.add("scroll-left");
    }
    window.addEventListener("scroll", () => {
      var _window$pageYOffset2, _window5, _window$pageXOffset2, _window6, _document19, _document19$documentE, _document19$documentE2, _document20, _document20$documentE, _document20$documentE2, _document21, _document21$documentE, _document21$documentE2, _document22, _document22$documentE, _document22$documentE2, _document23, _document23$documentE, _document23$documentE2, _document28, _document28$documentE, _document28$documentE2, _document29, _document29$documentE, _document29$documentE2, _document30, _document30$documentE, _document30$documentE2;
      var y2 = (_window$pageYOffset2 = (_window5 = window) == null ? void 0 : _window5.pageYOffset) != null ? _window$pageYOffset2 : 0;
      var x2 = (_window$pageXOffset2 = (_window6 = window) == null ? void 0 : _window6.pageXOffset) != null ? _window$pageXOffset2 : 0;
      var ly = (_document19 = document) == null ? void 0 : (_document19$documentE = _document19.documentElement) == null ? void 0 : (_document19$documentE2 = _document19$documentE.style) == null ? void 0 : _document19$documentE2.getPropertyValue == null ? void 0 : _document19$documentE2.getPropertyValue("--scroll-y");
      var lx = (_document20 = document) == null ? void 0 : (_document20$documentE = _document20.documentElement) == null ? void 0 : (_document20$documentE2 = _document20$documentE.style) == null ? void 0 : _document20$documentE2.getPropertyValue == null ? void 0 : _document20$documentE2.getPropertyValue("--scroll-x");
      var yd2 = y2 > ly ? "down" : "up";
      var xd2 = x2 > lx ? "right" : "left";
      (_document21 = document) == null ? void 0 : (_document21$documentE = _document21.documentElement) == null ? void 0 : (_document21$documentE2 = _document21$documentE.style) == null ? void 0 : _document21$documentE2.setProperty == null ? void 0 : _document21$documentE2.setProperty("--scroll-y", y2);
      set_store_value(browser, $browser.scroll_y = y2, $browser);
      (_document22 = document) == null ? void 0 : (_document22$documentE = _document22.documentElement) == null ? void 0 : (_document22$documentE2 = _document22$documentE.style) == null ? void 0 : _document22$documentE2.setProperty == null ? void 0 : _document22$documentE2.setProperty("--scroll-y-last", y2);
      set_store_value(browser, $browser.scroll_y_last = y2, $browser);
      (_document23 = document) == null ? void 0 : (_document23$documentE = _document23.documentElement) == null ? void 0 : (_document23$documentE2 = _document23$documentE.style) == null ? void 0 : _document23$documentE2.setProperty == null ? void 0 : _document23$documentE2.setProperty("--scroll-y-direction", yd2);
      set_store_value(browser, $browser.scroll_y_direction = yd2, $browser);
      if (yd2 == "down") {
        var _document24, _document24$querySele, _document24$querySele2, _document25, _document25$querySele, _document25$querySele2;
        (_document24 = document) == null ? void 0 : (_document24$querySele = _document24.querySelector("body")) == null ? void 0 : (_document24$querySele2 = _document24$querySele.classList) == null ? void 0 : _document24$querySele2.remove("scroll-up");
        (_document25 = document) == null ? void 0 : (_document25$querySele = _document25.querySelector("body")) == null ? void 0 : (_document25$querySele2 = _document25$querySele.classList) == null ? void 0 : _document25$querySele2.add("scroll-down");
      } else {
        var _document26, _document26$querySele, _document26$querySele2, _document27, _document27$querySele, _document27$querySele2;
        (_document26 = document) == null ? void 0 : (_document26$querySele = _document26.querySelector("body")) == null ? void 0 : (_document26$querySele2 = _document26$querySele.classList) == null ? void 0 : _document26$querySele2.remove("scroll-down");
        (_document27 = document) == null ? void 0 : (_document27$querySele = _document27.querySelector("body")) == null ? void 0 : (_document27$querySele2 = _document27$querySele.classList) == null ? void 0 : _document27$querySele2.add("scroll-up");
      }
      (_document28 = document) == null ? void 0 : (_document28$documentE = _document28.documentElement) == null ? void 0 : (_document28$documentE2 = _document28$documentE.style) == null ? void 0 : _document28$documentE2.setProperty == null ? void 0 : _document28$documentE2.setProperty("--scroll-x", x2);
      set_store_value(browser, $browser.scroll_x = x2, $browser);
      (_document29 = document) == null ? void 0 : (_document29$documentE = _document29.documentElement) == null ? void 0 : (_document29$documentE2 = _document29$documentE.style) == null ? void 0 : _document29$documentE2.setProperty == null ? void 0 : _document29$documentE2.setProperty("--scroll-x-last", x2);
      set_store_value(browser, $browser.scroll_x_last = x2, $browser);
      (_document30 = document) == null ? void 0 : (_document30$documentE = _document30.documentElement) == null ? void 0 : (_document30$documentE2 = _document30$documentE.style) == null ? void 0 : _document30$documentE2.setProperty == null ? void 0 : _document30$documentE2.setProperty("--scroll-x-direction", xd2);
      set_store_value(browser, $browser.scroll_x_direction = xd2, $browser);
      if (xd2 == "right") {
        var _document31, _document31$querySele, _document31$querySele2, _document32, _document32$querySele, _document32$querySele2;
        (_document31 = document) == null ? void 0 : (_document31$querySele = _document31.querySelector("body")) == null ? void 0 : (_document31$querySele2 = _document31$querySele.classList) == null ? void 0 : _document31$querySele2.remove("scroll-left");
        (_document32 = document) == null ? void 0 : (_document32$querySele = _document32.querySelector("body")) == null ? void 0 : (_document32$querySele2 = _document32$querySele.classList) == null ? void 0 : _document32$querySele2.add("scroll-right");
      } else {
        var _document33, _document33$querySele, _document33$querySele2, _document34, _document34$querySele, _document34$querySele2;
        (_document33 = document) == null ? void 0 : (_document33$querySele = _document33.querySelector("body")) == null ? void 0 : (_document33$querySele2 = _document33$querySele.classList) == null ? void 0 : _document33$querySele2.remove("scroll-right");
        (_document34 = document) == null ? void 0 : (_document34$querySele = _document34.querySelector("body")) == null ? void 0 : (_document34$querySele2 = _document34$querySele.classList) == null ? void 0 : _document34$querySele2.add("scroll-left");
      }
      if (y2 == 0) {
        var _document35, _document35$querySele, _document35$querySele2;
        (_document35 = document) == null ? void 0 : (_document35$querySele = _document35.querySelector("body")) == null ? void 0 : (_document35$querySele2 = _document35$querySele.classList) == null ? void 0 : _document35$querySele2.add("scroll-attop");
      } else {
        var _document36, _document36$querySele, _document36$querySele2;
        (_document36 = document) == null ? void 0 : (_document36$querySele = _document36.querySelector("body")) == null ? void 0 : (_document36$querySele2 = _document36$querySele.classList) == null ? void 0 : _document36$querySele2.remove("scroll-attop");
      }
      if (y2 < 10) {
        var _document37, _document37$querySele, _document37$querySele2;
        (_document37 = document) == null ? void 0 : (_document37$querySele = _document37.querySelector("body")) == null ? void 0 : (_document37$querySele2 = _document37$querySele.classList) == null ? void 0 : _document37$querySele2.add("scroll-neartop");
      } else {
        var _document38, _document38$querySele, _document38$querySele2;
        (_document38 = document) == null ? void 0 : (_document38$querySele = _document38.querySelector("body")) == null ? void 0 : (_document38$querySele2 = _document38$querySele.classList) == null ? void 0 : _document38$querySele2.remove("scroll-neartop");
      }
    });
  }));
  $$unsubscribe_browser();
  return ``;
});
function asyncGeneratorStep$E(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$E(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$E(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$E(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Setup_WatchMouse = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $browser, $$unsubscribe_browser;
  $$unsubscribe_browser = subscribe(browser, (value) => $browser = value);
  onMount(/* @__PURE__ */ _asyncToGenerator$E(function* () {
    var _document, _document$documentEle, _document$documentEle2, _document2, _document2$documentEl, _document2$documentEl2, _document3, _document3$documentEl, _document3$documentEl2, _document4, _document4$documentEl, _document4$documentEl2, _document5;
    (_document = document) == null ? void 0 : (_document$documentEle = _document.documentElement) == null ? void 0 : (_document$documentEle2 = _document$documentEle.style) == null ? void 0 : _document$documentEle2.setProperty == null ? void 0 : _document$documentEle2.setProperty("--mouse-x", 0);
    set_store_value(browser, $browser.mouse_x = 0, $browser);
    (_document2 = document) == null ? void 0 : (_document2$documentEl = _document2.documentElement) == null ? void 0 : (_document2$documentEl2 = _document2$documentEl.style) == null ? void 0 : _document2$documentEl2.setProperty == null ? void 0 : _document2$documentEl2.setProperty("--mouse-y", 0);
    set_store_value(browser, $browser.mouse_y = 0, $browser);
    (_document3 = document) == null ? void 0 : (_document3$documentEl = _document3.documentElement) == null ? void 0 : (_document3$documentEl2 = _document3$documentEl.style) == null ? void 0 : _document3$documentEl2.setProperty == null ? void 0 : _document3$documentEl2.setProperty("--mouse-xfm", 0);
    set_store_value(browser, $browser.mouse_xfm = 0, $browser);
    (_document4 = document) == null ? void 0 : (_document4$documentEl = _document4.documentElement) == null ? void 0 : (_document4$documentEl2 = _document4$documentEl.style) == null ? void 0 : _document4$documentEl2.setProperty == null ? void 0 : _document4$documentEl2.setProperty("--mouse-yfm", 0);
    set_store_value(browser, $browser.mouse_yfm = 0, $browser);
    (_document5 = document) == null ? void 0 : _document5.addEventListener == null ? void 0 : _document5.addEventListener("mousemove", (e) => {
      var _document6, _document6$documentEl, _document6$documentEl2, _document7, _document7$documentEl, _document7$documentEl2, _document8, _document8$documentEl, _document8$documentEl2, _document9, _document9$documentEl, _document9$documentEl2;
      var x = (e == null ? void 0 : e.clientX) / innerWidth;
      var y = (e == null ? void 0 : e.clientY) / innerHeight;
      var xfm = x * 2 - 1;
      var yfm = y * 2 - 1;
      (_document6 = document) == null ? void 0 : (_document6$documentEl = _document6.documentElement) == null ? void 0 : (_document6$documentEl2 = _document6$documentEl.style) == null ? void 0 : _document6$documentEl2.setProperty == null ? void 0 : _document6$documentEl2.setProperty("--mouse-x", x);
      set_store_value(browser, $browser.mouse_x = x, $browser);
      (_document7 = document) == null ? void 0 : (_document7$documentEl = _document7.documentElement) == null ? void 0 : (_document7$documentEl2 = _document7$documentEl.style) == null ? void 0 : _document7$documentEl2.setProperty == null ? void 0 : _document7$documentEl2.setProperty("--mouse-y", y);
      set_store_value(browser, $browser.mouse_y = y, $browser);
      (_document8 = document) == null ? void 0 : (_document8$documentEl = _document8.documentElement) == null ? void 0 : (_document8$documentEl2 = _document8$documentEl.style) == null ? void 0 : _document8$documentEl2.setProperty == null ? void 0 : _document8$documentEl2.setProperty("--mouse-xfm", xfm);
      set_store_value(browser, $browser.mouse_xfm = xfm, $browser);
      (_document9 = document) == null ? void 0 : (_document9$documentEl = _document9.documentElement) == null ? void 0 : (_document9$documentEl2 = _document9$documentEl.style) == null ? void 0 : _document9$documentEl2.setProperty == null ? void 0 : _document9$documentEl2.setProperty("--mouse-yfm", yfm);
      set_store_value(browser, $browser.mouse_yfm = yfm, $browser);
    });
  }));
  $$unsubscribe_browser();
  return ``;
});
function asyncGeneratorStep$D(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$D(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$D(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$D(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Setup_WatchResize = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $browser, $$unsubscribe_browser;
  $$unsubscribe_browser = subscribe(browser, (value) => $browser = value);
  onMount(/* @__PURE__ */ _asyncToGenerator$D(function* () {
    var _document, _document$documentEle, _document$documentEle2, _document2, _document2$documentEl, _document2$documentEl2, _window;
    var w = innerWidth;
    var h = innerHeight;
    (_document = document) == null ? void 0 : (_document$documentEle = _document.documentElement) == null ? void 0 : (_document$documentEle2 = _document$documentEle.style) == null ? void 0 : _document$documentEle2.setProperty == null ? void 0 : _document$documentEle2.setProperty("--viewport-width", w);
    set_store_value(browser, $browser.viewport_width = w, $browser);
    (_document2 = document) == null ? void 0 : (_document2$documentEl = _document2.documentElement) == null ? void 0 : (_document2$documentEl2 = _document2$documentEl.style) == null ? void 0 : _document2$documentEl2.setProperty == null ? void 0 : _document2$documentEl2.setProperty("--viewport-height", h);
    set_store_value(browser, $browser.viewport_height = h, $browser);
    (_window = window) == null ? void 0 : _window.addEventListener == null ? void 0 : _window.addEventListener("resize", (e) => {
      var _document3, _document3$documentEl, _document3$documentEl2, _document4, _document4$documentEl, _document4$documentEl2;
      var w2 = innerWidth;
      var h2 = innerHeight;
      (_document3 = document) == null ? void 0 : (_document3$documentEl = _document3.documentElement) == null ? void 0 : (_document3$documentEl2 = _document3$documentEl.style) == null ? void 0 : _document3$documentEl2.setProperty == null ? void 0 : _document3$documentEl2.setProperty("--viewport-width", w2);
      set_store_value(browser, $browser.viewport_width = w2, $browser);
      (_document4 = document) == null ? void 0 : (_document4$documentEl = _document4.documentElement) == null ? void 0 : (_document4$documentEl2 = _document4$documentEl.style) == null ? void 0 : _document4$documentEl2.setProperty == null ? void 0 : _document4$documentEl2.setProperty("--viewport-height", h2);
      set_store_value(browser, $browser.viewport_height = h2, $browser);
    });
  }));
  $$unsubscribe_browser();
  return ``;
});
function asyncGeneratorStep$C(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$C(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$C(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$C(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Setup_SmoothScroll = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $browser, $$unsubscribe_browser;
  $$unsubscribe_browser = subscribe(browser, (value) => $browser = value);
  onMount(/* @__PURE__ */ _asyncToGenerator$C(function* () {
    var _document;
    var html = (_document = document) == null ? void 0 : _document.querySelector("html");
    if (html != null && html.scrollBehavior) {
      html.scrollBehavior = "smooth";
    }
    set_store_value(browser, $browser.scrollToTop = scrollToTop, $browser);
    set_store_value(browser, $browser.scrollToElement = scrollToElement, $browser);
    set_store_value(browser, $browser.scrollToPosition = scrollToPosition, $browser);
  }));
  var {scrollToTop = () => {
    window.scroll({behavior: "smooth", left: 0, top: -100});
  }} = $$props;
  var {scrollToElement = (element) => {
    window.scroll({
      behavior: "smooth",
      left: 0,
      top: element.offsetTop
    });
  }} = $$props;
  var {scrollToPosition = (xPosition, yPosition) => {
    window.scroll({
      behavior: "smooth",
      left: xPosition,
      top: yPosition
    });
  }} = $$props;
  if ($$props.scrollToTop === void 0 && $$bindings.scrollToTop && scrollToTop !== void 0)
    $$bindings.scrollToTop(scrollToTop);
  if ($$props.scrollToElement === void 0 && $$bindings.scrollToElement && scrollToElement !== void 0)
    $$bindings.scrollToElement(scrollToElement);
  if ($$props.scrollToPosition === void 0 && $$bindings.scrollToPosition && scrollToPosition !== void 0)
    $$bindings.scrollToPosition(scrollToPosition);
  $$unsubscribe_browser();
  return ``;
});
function asyncGeneratorStep$B(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$B(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$B(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$B(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Setup_TopAnchorLink = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  onMount(/* @__PURE__ */ _asyncToGenerator$B(function* () {
    var _document;
    if (!((_document = document) != null && _document.querySelector("#TopLinkAnchor"))) {
      var _document2, _document3;
      var a = (_document2 = document) == null ? void 0 : _document2.createElement("a");
      a.name = "TopLinkAnchor";
      a.id = "TopLinkAnchor";
      var body = (_document3 = document) == null ? void 0 : _document3.querySelector("body");
      if (body) {
        body == null ? void 0 : body.insertBefore(a, body == null ? void 0 : body.firstChild);
      }
    }
  }));
  return ``;
});
var Layout_Milk_svelte = "app.svelte-d3uf0z{display:block;min-height:100vh}";
const css$M = {
  code: "app.svelte-d3uf0z{display:block;min-height:100vh}",
  map: `{"version":3,"file":"Layout_Milk.svelte","sources":["Layout_Milk.svelte"],"sourcesContent":["<Head_ContentType encoding=\\"utf-8\\" mime_type=\\"text/html\\" />\\n{#if $milk?.config?.pwa}\\n\\t<Head_PWA />\\n{:else}\\n\\t<Head_Website />\\n{/if}\\n<Head_Favicon />\\n<Head_MilkCSS />\\n<Head_Extra>\\n\\t<link rel=\\"preconnect\\" href=\\"https://google.com\\" />\\n\\t<link rel=\\"preconnect\\" href=\\"https://fonts.googleapis.com\\" />\\n\\t<link rel=\\"preconnect\\" href=\\"https://storage.googleapis.com\\" />\\n\\t<link rel=\\"preconnect\\" href=\\"https://www.googletagmanager.com\\" />\\n\\t<link rel=\\"stylesheet\\" href={themestyle} />\\n</Head_Extra>\\n{#if $milk?.theme?.darkmode}\\n\\t<Setup_DarkMode />\\n{/if}\\n{#if $milk?.config?.watch_scroll !== false}\\n\\t<Setup_WatchScroll />\\n{/if}\\n{#if $milk?.config?.watch_resize !== false}\\n\\t<Setup_WatchResize />\\n{/if}\\n{#if $milk?.config?.watch_mouse !== false}\\n\\t<Setup_WatchMouse />\\n{/if}\\n{#if $milk?.config?.smoothscroll !== false}\\n\\t<Setup_SmoothScroll />\\n{/if}\\n{#if $milk?.config?.topanchor !== false}\\n\\t<Setup_TopAnchorLink />\\n{/if}\\n<app data-theme={$milk?.theme?.slug} class={$milk?.theme?.slug}><slot /></app>\\n\\n<script>/* ## MILK ## */\\nimport { milk } from '$milk/milk.js';\\n/* ## Components ## */\\n\\nimport Head_ContentType from '$milk/lib/Head_ContentType.svelte';\\nimport Head_Website from '$milk/lib/Head_Website.svelte';\\nimport Head_PWA from '$milk/lib/Head_PWA.svelte';\\nimport Head_Favicon from '$milk/lib/Head_Favicon.svelte';\\nimport Head_MilkCSS from '$milk/lib/Head_MilkCSS.svelte';\\nimport Head_Extra from '$milk/lib/Head_Extra.svelte';\\nimport Setup_DarkMode from '$milk/lib/Setup_DarkMode.svelte';\\nimport Setup_WatchScroll from '$milk/lib/Setup_WatchScroll.svelte';\\nimport Setup_WatchMouse from '$milk/lib/Setup_WatchMouse.svelte';\\nimport Setup_WatchResize from '$milk/lib/Setup_WatchResize.svelte';\\nimport Setup_SmoothScroll from '$milk/lib/Setup_SmoothScroll.svelte';\\nimport Setup_TopAnchorLink from '$milk/lib/Setup_TopAnchorLink.svelte';\\nvar themestyle = '';\\n\\n$: themestyle = \\"/themes/\\" + $milk.config.theme + \\"/style.css\\";</script>\\n\\n<style>app{display:block;min-height:100vh}</style>\\n"],"names":[],"mappings":"AAuDO,iBAAG,CAAC,QAAQ,KAAK,CAAC,WAAW,KAAK,CAAC"}`
};
const Layout_Milk = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var themestyle = "";
  $$result.css.add(css$M);
  themestyle = "/themes/" + $milk.config.theme + "/style.css";
  $$unsubscribe_milk();
  return `${validate_component(Head_ContentType, "Head_ContentType").$$render($$result, {
    encoding: "utf-8",
    mime_type: "text/html"
  }, {}, {})}
${((_a = $milk == null ? void 0 : $milk.config) == null ? void 0 : _a.pwa) ? `${validate_component(Head_PWA, "Head_PWA").$$render($$result, {}, {}, {})}` : `${validate_component(Head_Website, "Head_Website").$$render($$result, {}, {}, {})}`}
${validate_component(Head_Favicon, "Head_Favicon").$$render($$result, {}, {}, {})}
${validate_component(Head_MilkCSS, "Head_MilkCSS").$$render($$result, {}, {}, {})}
${validate_component(Head_Extra, "Head_Extra").$$render($$result, {}, {}, {
    default: () => `<link rel="${"preconnect"}" href="${"https://google.com"}">
	<link rel="${"preconnect"}" href="${"https://fonts.googleapis.com"}">
	<link rel="${"preconnect"}" href="${"https://storage.googleapis.com"}">
	<link rel="${"preconnect"}" href="${"https://www.googletagmanager.com"}">
	<link rel="${"stylesheet"}"${add_attribute("href", themestyle, 0)}>`
  })}
${((_b = $milk == null ? void 0 : $milk.theme) == null ? void 0 : _b.darkmode) ? `${validate_component(Setup_DarkMode, "Setup_DarkMode").$$render($$result, {}, {}, {})}` : ``}
${((_c = $milk == null ? void 0 : $milk.config) == null ? void 0 : _c.watch_scroll) !== false ? `${validate_component(Setup_WatchScroll, "Setup_WatchScroll").$$render($$result, {}, {}, {})}` : ``}
${((_d = $milk == null ? void 0 : $milk.config) == null ? void 0 : _d.watch_resize) !== false ? `${validate_component(Setup_WatchResize, "Setup_WatchResize").$$render($$result, {}, {}, {})}` : ``}
${((_e = $milk == null ? void 0 : $milk.config) == null ? void 0 : _e.watch_mouse) !== false ? `${validate_component(Setup_WatchMouse, "Setup_WatchMouse").$$render($$result, {}, {}, {})}` : ``}
${((_f = $milk == null ? void 0 : $milk.config) == null ? void 0 : _f.smoothscroll) !== false ? `${validate_component(Setup_SmoothScroll, "Setup_SmoothScroll").$$render($$result, {}, {}, {})}` : ``}
${((_g = $milk == null ? void 0 : $milk.config) == null ? void 0 : _g.topanchor) !== false ? `${validate_component(Setup_TopAnchorLink, "Setup_TopAnchorLink").$$render($$result, {}, {}, {})}` : ``}
<app${add_attribute("data-theme", (_h = $milk == null ? void 0 : $milk.theme) == null ? void 0 : _h.slug, 0)} class="${escape(null_to_empty((_i = $milk == null ? void 0 : $milk.theme) == null ? void 0 : _i.slug)) + " svelte-d3uf0z"}">${slots.default ? slots.default({}) : ``}</app>`;
});
const $error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Layout_Milk, "Layout_Milk").$$render($$result, {}, {}, {default: () => `404 Error`})}`;
});
var $error$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: $error
});
var root_svelte = "#svelte-announcer.svelte-1y31lbn{position:absolute;left:0;top:0;clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}";
const css$L = {
  code: "#svelte-announcer.svelte-1y31lbn{position:absolute;left:0;top:0;clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>import { setContext, afterUpdate, onMount } from 'svelte';\\nimport ErrorComponent from \\"../../../src/routes/$error.svelte\\"; // error handling\\n\\nexport var status = undefined;\\nexport var error = undefined; // stores\\n\\nexport var stores;\\nexport var page;\\nexport var components;\\nexport var props_0 = null;\\nexport var props_1 = null;\\nvar Layout = components[0];\\nsetContext('__svelte__', stores);\\n\\n$: stores.page.set(page);\\n\\nafterUpdate(stores.page.notify);\\nvar mounted = false;\\nvar navigated = false;\\nvar title = null;\\nonMount(() => {\\n  var unsubscribe = stores.page.subscribe(() => {\\n    if (mounted) {\\n      navigated = true;\\n      title = document.title;\\n    }\\n  });\\n  mounted = true;\\n  return unsubscribe;\\n});</script>\\n\\n<Layout {...(props_0 || {})}>\\n\\t{#if error}\\n\\t\\t<ErrorComponent {status} {error}/>\\n\\t{:else}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}/>\\n\\t{/if}\\n</Layout>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\tNavigated to {title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>#svelte-announcer{position:absolute;left:0;top:0;clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}</style>"],"names":[],"mappings":"AAgDO,gCAAiB,CAAC,SAAS,QAAQ,CAAC,KAAK,CAAC,CAAC,IAAI,CAAC,CAAC,KAAK,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,kBAAkB,MAAM,GAAG,CAAC,CAAC,UAAU,MAAM,GAAG,CAAC,CAAC,SAAS,MAAM,CAAC,YAAY,MAAM,CAAC,MAAM,GAAG,CAAC,OAAO,GAAG,CAAC"}`
};
const Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var {status = void 0} = $$props;
  var {error = void 0} = $$props;
  var {stores} = $$props;
  var {page: page2} = $$props;
  var {components: components2} = $$props;
  var {props_0 = null} = $$props;
  var {props_1 = null} = $$props;
  var Layout = components2[0];
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  var mounted = false;
  var navigated = false;
  var title = null;
  onMount(() => {
    var unsubscribe = stores.page.subscribe(() => {
      if (mounted) {
        navigated = true;
        title = document.title;
      }
    });
    mounted = true;
    return unsubscribe;
  });
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error !== void 0)
    $$bindings.error(error);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  if ($$props.components === void 0 && $$bindings.components && components2 !== void 0)
    $$bindings.components(components2);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  $$result.css.add(css$L);
  {
    stores.page.set(page2);
  }
  return `


${validate_component(Layout, "Layout").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${error ? `${validate_component($error, "ErrorComponent").$$render($$result, {status, error}, {}, {})}` : `${validate_component(components2[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {})}`}`
  })}

${mounted ? `<div id="${"svelte-announcer"}" aria-live="${"assertive"}" aria-atomic="${"true"}" class="${"svelte-1y31lbn"}">${navigated ? `Navigated to ${escape(title)}` : ``}</div>` : ``}`;
});
var setup = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
const template = ({head, body}) => '<!DOCTYPE html>\n<html lang="en" xmlns:og="http://opengraphprotocol.org/schema/" xmlns:fb="http://www.facebook.com/2008/fbml">\n\n<head>' + head + '</head>\n\n<body>\n	<div id="milk">' + body + "</div>\n</body>\n\n</html>";
function init({paths}) {
}
const d = decodeURIComponent;
const empty = () => ({});
const components = [
  () => Promise.resolve().then(function() {
    return index$7;
  }),
  () => Promise.resolve().then(function() {
    return index$6;
  }),
  () => Promise.resolve().then(function() {
    return _slug_$1;
  }),
  () => Promise.resolve().then(function() {
    return index$5;
  }),
  () => Promise.resolve().then(function() {
    return _page_id_;
  }),
  () => Promise.resolve().then(function() {
    return index$4;
  }),
  () => Promise.resolve().then(function() {
    return index$3;
  }),
  () => Promise.resolve().then(function() {
    return index$2;
  }),
  () => Promise.resolve().then(function() {
    return blog;
  }),
  () => Promise.resolve().then(function() {
    return _slug_;
  }),
  () => Promise.resolve().then(function() {
    return index$1;
  }),
  () => Promise.resolve().then(function() {
    return fonttest;
  }),
  () => Promise.resolve().then(function() {
    return index;
  }),
  () => Promise.resolve().then(function() {
    return test_svelte;
  })
];
const client_component_lookup = {".svelte/build/runtime/internal/start.js": "start-a4bdfc80.js", "src/routes/index.svelte": "pages/index.svelte-a9358155.js", "src/routes/immigration-law-services/index.svelte": "pages/immigration-law-services/index.svelte-9810dff8.js", "src/routes/immigration-law-services/[slug].svelte": "pages/immigration-law-services/[slug].svelte-59db881d.js", "src/routes/immigration-information/index.svelte": "pages/immigration-information/index.svelte-cf93dbb0.js", "src/routes/immigration-information/[page_id].svelte": "pages/immigration-information/[page_id].svelte-e6404f53.js", "src/routes/immigration-attorneys/index.svelte": "pages/immigration-attorneys/index.svelte-e0bfdb68.js", "src/routes/immigration-resources/index.svelte": "pages/immigration-resources/index.svelte-ed9823c7.js", "src/routes/immigration-law-blog/index.svelte": "pages/immigration-law-blog/index.svelte-4b1daa84.js", "src/routes/immigration-law-blog/blog.svelte": "pages/immigration-law-blog/blog.svelte-99055e9f.js", "src/routes/immigration-law-blog/[slug].svelte": "pages/immigration-law-blog/[slug].svelte-d99c353b.js", "src/routes/client-testimonials/index.svelte": "pages/client-testimonials/index.svelte-88be609e.js", "src/routes/fonttest.svelte": "pages/fonttest.svelte-05962535.js", "src/routes/espanol/index.svelte": "pages/espanol/index.svelte-2a755d86.js", "src/routes/test.svelte.md": "pages/test.svelte.md-a58c7b83.js"};
const manifest = {
  assets: [{file: ".htaccess", size: 7347, type: null}, {file: ".nginx", size: 184, type: null}, {file: "documentation/code_analysis.html", size: 136774, type: "text/html"}, {file: "favicon.ico", size: 1150, type: "image/vnd.microsoft.icon"}, {file: "harlan_york.vcf", size: 541, type: "text/x-vcard"}, {file: "ico/apple-touch-icon-114x114.png", size: 2005, type: "image/png"}, {file: "ico/apple-touch-icon-120x120.png", size: 2581, type: "image/png"}, {file: "ico/apple-touch-icon-144x144.png", size: 2443, type: "image/png"}, {file: "ico/apple-touch-icon-152x152.png", size: 3608, type: "image/png"}, {file: "ico/apple-touch-icon-57x57.png", size: 1319, type: "image/png"}, {file: "ico/apple-touch-icon-60x60.png", size: 1337, type: "image/png"}, {file: "ico/apple-touch-icon-72x72.png", size: 1236, type: "image/png"}, {file: "ico/apple-touch-icon-76x76.png", size: 1646, type: "image/png"}, {file: "ico/favicon-1024x1024.png", size: 13310, type: "image/png"}, {file: "ico/favicon-128x128.png", size: 1723, type: "image/png"}, {file: "ico/favicon-16x16.png", size: 146, type: "image/png"}, {file: "ico/favicon-256x256.png", size: 3305, type: "image/png"}, {file: "ico/favicon-32x32.png", size: 603, type: "image/png"}, {file: "ico/favicon-512x512.png", size: 5824, type: "image/png"}, {file: "ico/favicon-64x64.png", size: 1070, type: "image/png"}, {file: "ico/favicon-96x96.png", size: 1677, type: "image/png"}, {file: "ico/favicon.ico", size: 1150, type: "image/vnd.microsoft.icon"}, {file: "ico/favicon.png", size: 146, type: "image/png"}, {file: "ico/favicon.svg", size: 3026, type: "image/svg+xml"}, {file: "ico/mstile-144x144.png", size: 2443, type: "image/png"}, {file: "ico/mstile-150x150.png", size: 4341, type: "image/png"}, {file: "ico/mstile-310x150.png", size: 11763, type: "image/png"}, {file: "ico/mstile-310x310.png", size: 21643, type: "image/png"}, {file: "ico/mstile-70x70.png", size: 1562, type: "image/png"}, {file: "ico/splash-1024x1024.png", size: 3879, type: "image/png"}, {file: "img/button_lawpay.avif", size: 1852, type: "image/avif"}, {file: "img/button_lawpay.png", size: 2410, type: "image/png"}, {file: "img/button_lawpay.webp", size: 2480, type: "image/webp"}, {file: "img/button_paypal.avif", size: 6281, type: "image/avif"}, {file: "img/button_paypal.png", size: 18929, type: "image/png"}, {file: "img/button_paypal.webp", size: 8312, type: "image/webp"}, {file: "img/espanol-video-01.avif", size: 14102, type: "image/avif"}, {file: "img/espanol-video-01.jpg", size: 46431, type: "image/jpeg"}, {file: "img/espanol-video-01.webp", size: 24768, type: "image/webp"}, {file: "img/espanol-video-02.avif", size: 26299, type: "image/avif"}, {file: "img/espanol-video-02.jpg", size: 72806, type: "image/jpeg"}, {file: "img/espanol-video-02.webp", size: 47230, type: "image/webp"}, {file: "img/espanol-video-03.avif", size: 18215, type: "image/avif"}, {file: "img/espanol-video-03.jpg", size: 70581, type: "image/jpeg"}, {file: "img/espanol-video-03.webp", size: 40574, type: "image/webp"}, {file: "img/google_maps_1350x922.avif", size: 44665, type: "image/avif"}, {file: "img/google_maps_1350x922.jpg", size: 98501, type: "image/jpeg"}, {file: "img/google_maps_1350x922.webp", size: 68740, type: "image/webp"}, {file: "img/harlan_spanish_tv_1.avif", size: 7845, type: "image/avif"}, {file: "img/harlan_spanish_tv_1.jpg", size: 13745, type: "image/jpeg"}, {file: "img/harlan_spanish_tv_1.webp", size: 11916, type: "image/webp"}, {file: "img/harlan_spanish_tv_2.avif", size: 5089, type: "image/avif"}, {file: "img/harlan_spanish_tv_2.jpg", size: 10452, type: "image/jpeg"}, {file: "img/harlan_spanish_tv_2.webp", size: 7588, type: "image/webp"}, {file: "img/harlan_spanish_tv_3.avif", size: 4766, type: "image/avif"}, {file: "img/harlan_spanish_tv_3.jpg", size: 9741, type: "image/jpeg"}, {file: "img/harlan_spanish_tv_3.webp", size: 7336, type: "image/webp"}, {file: "img/harlan_spanish_tv_4.avif", size: 7149, type: "image/avif"}, {file: "img/harlan_spanish_tv_4.jpg", size: 13097, type: "image/jpeg"}, {file: "img/harlan_spanish_tv_4.webp", size: 10448, type: "image/webp"}, {file: "img/harlans-3degree-book.avif", size: 10233, type: "image/avif"}, {file: "img/harlans-3degree-book.jpg", size: 22886, type: "image/jpeg"}, {file: "img/harlans-3degree-book.webp", size: 13200, type: "image/webp"}, {file: "img/hero_attorneys_01.avif", size: 94597, type: "image/avif"}, {file: "img/hero_attorneys_01.jpg", size: 331955, type: "image/jpeg"}, {file: "img/hero_attorneys_01.webp", size: 251668, type: "image/webp"}, {file: "img/hero_blog_01.avif", size: 114247, type: "image/avif"}, {file: "img/hero_blog_01.jpg", size: 354558, type: "image/jpeg"}, {file: "img/hero_blog_01.webp", size: 264900, type: "image/webp"}, {file: "img/hero_espanol_01.avif", size: 53251, type: "image/avif"}, {file: "img/hero_espanol_01.jpg", size: 229546, type: "image/jpeg"}, {file: "img/hero_espanol_01.webp", size: 122038, type: "image/webp"}, {file: "img/hero_homepage_01.avif", size: 37678, type: "image/avif"}, {file: "img/hero_homepage_01.heic", size: 176069, type: "image/heic"}, {file: "img/hero_homepage_01.jpg", size: 200299, type: "image/jpeg"}, {file: "img/hero_homepage_01.webp", size: 108924, type: "image/webp"}, {file: "img/hero_homepage_02.avif", size: 50687, type: "image/avif"}, {file: "img/hero_homepage_02.heic", size: 256825, type: "image/heic"}, {file: "img/hero_homepage_02.jpg", size: 269407, type: "image/jpeg"}, {file: "img/hero_homepage_02.webp", size: 151440, type: "image/webp"}, {file: "img/hero_homepage_02_alt.avif", size: 75595, type: "image/avif"}, {file: "img/hero_homepage_02_alt.jpg", size: 269406, type: "image/jpeg"}, {file: "img/hero_homepage_02_alt.webp", size: 165506, type: "image/webp"}, {file: "img/hero_homepage_03.avif", size: 45337, type: "image/avif"}, {file: "img/hero_homepage_03.heic", size: 303956, type: "image/heic"}, {file: "img/hero_homepage_03.jpg", size: 328766, type: "image/jpeg"}, {file: "img/hero_homepage_03.webp", size: 180154, type: "image/webp"}, {file: "img/hero_resources_01.avif", size: 71373, type: "image/avif"}, {file: "img/hero_resources_01.jpg", size: 252693, type: "image/jpeg"}, {file: "img/hero_resources_01.webp", size: 192130, type: "image/webp"}, {file: "img/hero_services_01.avif", size: 54876, type: "image/avif"}, {file: "img/hero_services_01.jpg", size: 204587, type: "image/jpeg"}, {file: "img/hero_services_01.webp", size: 104962, type: "image/webp"}, {file: "img/hero_services_02.avif", size: 211757, type: "image/avif"}, {file: "img/hero_services_02.jpg", size: 495322, type: "image/jpeg"}, {file: "img/hero_services_02.webp", size: 394470, type: "image/webp"}, {file: "img/hero_testimonial_01.avif", size: 217674, type: "image/avif"}, {file: "img/hero_testimonial_01.jpg", size: 493245, type: "image/jpeg"}, {file: "img/hero_testimonial_01.webp", size: 374142, type: "image/webp"}, {file: "img/hya_agustin_photo.avif", size: 23632, type: "image/avif"}, {file: "img/hya_agustin_photo.jpg", size: 56361, type: "image/jpeg"}, {file: "img/hya_agustin_photo.webp", size: 48476, type: "image/webp"}, {file: "img/icon-browser.svg", size: 908, type: "image/svg+xml"}, {file: "img/icon-cancel.svg", size: 645, type: "image/svg+xml"}, {file: "img/icon-cellphone.svg", size: 516, type: "image/svg+xml"}, {file: "img/icon-chevron-right.svg", size: 527, type: "image/svg+xml"}, {file: "img/icon-close.svg", size: 645, type: "image/svg+xml"}, {file: "img/icon-contactcard.svg", size: 857, type: "image/svg+xml"}, {file: "img/icon-email.svg", size: 672, type: "image/svg+xml"}, {file: "img/icon-hya-white.svg", size: 2993, type: "image/svg+xml"}, {file: "img/icon-invoice.svg", size: 1008, type: "image/svg+xml"}, {file: "img/icon-pen.svg", size: 857, type: "image/svg+xml"}, {file: "img/icon-phone-yellow.svg", size: 552, type: "image/svg+xml"}, {file: "img/icon-phone.svg", size: 502, type: "image/svg+xml"}, {file: "img/icon-rating-star.svg", size: 526, type: "image/svg+xml"}, {file: "img/icon-socialmedia-airbnb.svg", size: 1001, type: "image/svg+xml"}, {file: "img/icon-socialmedia-blog.svg", size: 847, type: "image/svg+xml"}, {file: "img/icon-socialmedia-calendar.svg", size: 1099, type: "image/svg+xml"}, {file: "img/icon-socialmedia-etsy.svg", size: 810, type: "image/svg+xml"}, {file: "img/icon-socialmedia-facebook.svg", size: 412, type: "image/svg+xml"}, {file: "img/icon-socialmedia-google_business.svg", size: 479, type: "image/svg+xml"}, {file: "img/icon-socialmedia-google_maps.svg", size: 893, type: "image/svg+xml"}, {file: "img/icon-socialmedia-instagram.svg", size: 1160, type: "image/svg+xml"}, {file: "img/icon-socialmedia-linkedin.svg", size: 542, type: "image/svg+xml"}, {file: "img/icon-socialmedia-pinterest.svg", size: 737, type: "image/svg+xml"}, {file: "img/icon-socialmedia-rss.svg", size: 869, type: "image/svg+xml"}, {file: "img/icon-socialmedia-snapchat.svg", size: 1650, type: "image/svg+xml"}, {file: "img/icon-socialmedia-tiktok.svg", size: 451, type: "image/svg+xml"}, {file: "img/icon-socialmedia-twitter.svg", size: 1025, type: "image/svg+xml"}, {file: "img/icon-socialmedia-vcard.svg", size: 857, type: "image/svg+xml"}, {file: "img/icon-socialmedia-vimeo.svg", size: 615, type: "image/svg+xml"}, {file: "img/icon-socialmedia-yelp.svg", size: 985, type: "image/svg+xml"}, {file: "img/icon-socialmedia-youtube-alt.svg", size: 339, type: "image/svg+xml"}, {file: "img/icon-socialmedia-youtube.svg", size: 704, type: "image/svg+xml"}, {file: "img/icon-triangle-up.svg", size: 396, type: "image/svg+xml"}, {file: "img/icon-yellow-star.svg", size: 526, type: "image/svg+xml"}, {file: "img/logo-lawpay.svg", size: 9618, type: "image/svg+xml"}, {file: "img/logo-paypal.svg", size: 5588, type: "image/svg+xml"}, {file: "img/logo.svg", size: 15649, type: "image/svg+xml"}, {file: "img/profile_1200x1200.avif", size: 37116, type: "image/avif"}, {file: "img/profile_1200x1200.jpg", size: 89089, type: "image/jpeg"}, {file: "img/profile_1200x1200.webp", size: 55248, type: "image/webp"}, {file: "img/socialmedia_1200x630.jpg", size: 65024, type: "image/jpeg"}, {file: "img/testimonial-video-01.avif", size: 17972, type: "image/avif"}, {file: "img/testimonial-video-01.jpg", size: 77653, type: "image/jpeg"}, {file: "img/testimonial-video-01.webp", size: 43616, type: "image/webp"}, {file: "img/user_nophoto.svg", size: 603, type: "image/svg+xml"}, {file: "img/video_featured.avif", size: 21349, type: "image/avif"}, {file: "img/video_featured.jpg", size: 106873, type: "image/jpeg"}, {file: "img/video_featured.webp", size: 54556, type: "image/webp"}, {file: "manifest.json", size: 2749, type: "application/json"}, {file: "milk/README.md", size: 75, type: "text/markdown"}, {file: "milk/do_not_delete.txt", size: 75, type: "text/plain"}, {file: "milk/img/icon-browser.svg", size: 908, type: "image/svg+xml"}, {file: "milk/img/imagetest_200x200_avif.avif", size: 1054, type: "image/avif"}, {file: "milk/img/imagetest_200x200_gif.gif", size: 1922, type: "image/gif"}, {file: "milk/img/imagetest_200x200_jpg.jpg", size: 32387, type: "image/jpeg"}, {file: "milk/img/imagetest_200x200_mozjpg.jpg", size: 8838, type: "image/jpeg"}, {file: "milk/img/imagetest_200x200_png24.png", size: 1617, type: "image/png"}, {file: "milk/img/imagetest_200x200_png8.png", size: 1276, type: "image/png"}, {file: "milk/img/imagetest_200x200_svg.svg", size: 3216, type: "image/svg+xml"}, {file: "milk/img/imagetest_200x200_webp.webp", size: 838, type: "image/webp"}, {file: "milk/img/logo_browser.svg", size: 4376, type: "image/svg+xml"}, {file: "milk/img/logo_devlove.svg", size: 670, type: "image/svg+xml"}, {file: "milk/img/logo_graphql.svg", size: 1357, type: "image/svg+xml"}, {file: "milk/img/logo_markdown.svg", size: 521, type: "image/svg+xml"}, {file: "milk/img/logo_milk.svg", size: 5852, type: "image/svg+xml"}, {file: "milk/img/logo_milkjs.svg", size: 7031, type: "image/svg+xml"}, {file: "milk/img/logo_postcss.svg", size: 17556, type: "image/svg+xml"}, {file: "milk/img/logo_rollup.svg", size: 3470, type: "image/svg+xml"}, {file: "milk/img/logo_snowpack.svg", size: 279, type: "image/svg+xml"}, {file: "milk/img/logo_svelte.svg", size: 1158, type: "image/svg+xml"}, {file: "milk/img/logo_vite.svg", size: 1114, type: "image/svg+xml"}, {file: "milk/img/onload_then_do_map.gif", size: 43, type: "image/gif"}, {file: "milk/img/onload_then_do_video.gif", size: 43, type: "image/gif"}, {file: "milk/img/user_nophoto.svg", size: 603, type: "image/svg+xml"}, {file: "milk/img/x.gif", size: 43, type: "image/gif"}, {file: "milk/index.html", size: 163, type: "text/html"}, {file: "register-service-workers.js", size: 365, type: "application/javascript"}, {file: "robots.txt", size: 67, type: "text/plain"}, {file: "service-worker.js", size: 4551, type: "application/javascript"}, {file: "themes/blank/Documentation.svelte.md", size: 769, type: "text/markdown"}, {file: "themes/blank/Layout_Blank.svelte", size: 198, type: null}, {file: "themes/blank/Layout_Main.svelte", size: 690, type: null}, {file: "themes/blank/info.js", size: 397, type: "application/javascript"}, {file: "themes/blank/logo_theme.svg", size: 7576, type: "image/svg+xml"}, {file: "themes/blank/style.css", size: 3454, type: "text/css"}, {file: "themes/hya/Block_3DBook.svelte", size: 3068, type: null}, {file: "themes/hya/Block_Attorneys.svelte", size: 4505, type: null}, {file: "themes/hya/Block_CallOutText.svelte", size: 1293, type: null}, {file: "themes/hya/Block_CallToAction.svelte", size: 5140, type: null}, {file: "themes/hya/Block_FAQs.svelte", size: 3201, type: null}, {file: "themes/hya/Block_FaqItem.svelte", size: 1125, type: null}, {file: "themes/hya/Block_Featured.svelte", size: 2917, type: null}, {file: "themes/hya/Block_Footer.svelte", size: 3682, type: null}, {file: "themes/hya/Block_GoogleTagManager.svelte", size: 297, type: null}, {file: "themes/hya/Block_Header.svelte", size: 1972, type: null}, {file: "themes/hya/Block_Languages.svelte", size: 1960, type: null}, {file: "themes/hya/Block_LanguagesWeSpeak.svelte", size: 706, type: null}, {file: "themes/hya/Block_Navigation.svelte", size: 10287, type: null}, {file: "themes/hya/Block_PaymentCard.svelte", size: 6982, type: null}, {file: "themes/hya/Block_Ratings.svelte", size: 4240, type: null}, {file: "themes/hya/Block_RelatedPosts.svelte", size: 1170, type: null}, {file: "themes/hya/Block_SearchCard.svelte", size: 2535, type: null}, {file: "themes/hya/Block_Services.svelte", size: 5237, type: null}, {file: "themes/hya/Block_ServicesList.svelte", size: 4576, type: null}, {file: "themes/hya/Block_Team.svelte", size: 4510, type: null}, {file: "themes/hya/Block_Testimonials.svelte", size: 6133, type: null}, {file: "themes/hya/Block_TestimonialsList.svelte", size: 4099, type: null}, {file: "themes/hya/Block_VideosList.svelte", size: 2579, type: null}, {file: "themes/hya/Block_eBook.svelte", size: 3543, type: null}, {file: "themes/hya/Block_eBooksList.svelte", size: 3598, type: null}, {file: "themes/hya/CallingCard.svelte", size: 4666, type: null}, {file: "themes/hya/Documentation.svelte.md", size: 769, type: "text/markdown"}, {file: "themes/hya/Layout_Blank.svelte", size: 341, type: null}, {file: "themes/hya/Layout_Main.svelte", size: 1566, type: null}, {file: "themes/hya/info.js", size: 525, type: "application/javascript"}, {file: "themes/hya/logo_theme.svg", size: 16376, type: "image/svg+xml"}, {file: "themes/hya/prismjs.css", size: 6484, type: "text/css"}, {file: "themes/hya/style.css", size: 22198, type: "text/css"}, {file: "themes/milkbox/Documentation.svelte.md", size: 769, type: "text/markdown"}, {file: "themes/milkbox/Layout_Blank.svelte", size: 198, type: null}, {file: "themes/milkbox/Layout_Main.svelte", size: 690, type: null}, {file: "themes/milkbox/info.js", size: 378, type: "application/javascript"}, {file: "themes/milkbox/logo_theme.svg", size: 16376, type: "image/svg+xml"}, {file: "themes/milkbox/prismjs.css", size: 6484, type: "text/css"}, {file: "themes/milkbox/style.css", size: 11006, type: "text/css"}],
  layout: () => Promise.resolve().then(function() {
    return $layout$1;
  }),
  error: () => Promise.resolve().then(function() {
    return $error$1;
  }),
  pages: [
    {
      pattern: /^\/$/,
      params: empty,
      parts: [{id: "src/routes/index.svelte", load: components[0]}],
      css: ["assets/start-521e4825.css", "assets/pages/index.svelte-e308b585.css", "assets/Layout_Main-7c5991fa.css", "assets/Block_Ratings-154e98f1.css", "assets/Block_Testimonials-f757a741.css", "assets/FeaturedVideo-4c2ed0ff.css"],
      js: ["start-a4bdfc80.js", "chunks/index-b6a42182.js", "chunks/milk-0fba135e.js", "pages/index.svelte-a9358155.js", "chunks/Head_Twitter-0458c92f.js", "chunks/Layout_Main-21e6a800.js", "chunks/Block_Ratings-49a8d14b.js", "chunks/Block_Testimonials-70bbe164.js", "chunks/wordpress.graphql-5818f662.js", "chunks/FeaturedVideo-b0ea6aef.js"]
    },
    {
      pattern: /^\/immigration-law-services\/?$/,
      params: empty,
      parts: [{id: "src/routes/immigration-law-services/index.svelte", load: components[1]}],
      css: ["assets/start-521e4825.css", "assets/pages/immigration-law-services/index.svelte-333dc843.css", "assets/Block_ServicesList.svelte-9fe10500.css", "assets/Layout_Main-7c5991fa.css", "assets/Block_Ratings-154e98f1.css", "assets/Block_CallOutText-7690976a.css", "assets/Block_LanguagesWeSpeak-4fc5fae9.css", "assets/Block_Testimonials-f757a741.css"],
      js: ["start-a4bdfc80.js", "chunks/index-b6a42182.js", "chunks/milk-0fba135e.js", "pages/immigration-law-services/index.svelte-9810dff8.js", "chunks/Head_Twitter-0458c92f.js", "chunks/Layout_Main-21e6a800.js", "chunks/Block_Ratings-49a8d14b.js", "chunks/Block_CallOutText-f8620481.js", "chunks/scroll-3817046f.js", "chunks/Block_LanguagesWeSpeak-ae46a675.js", "chunks/Block_Testimonials-70bbe164.js"]
    },
    {
      pattern: /^\/immigration-law-services\/([^/]+?)\/?$/,
      params: (m) => ({slug: d(m[1])}),
      parts: [{id: "src/routes/immigration-law-services/[slug].svelte", load: components[2]}],
      css: ["assets/start-521e4825.css", "assets/pages/immigration-law-services/[slug].svelte-be3bb193.css", "assets/Block_ServicesList.svelte-9fe10500.css", "assets/Layout_Main-7c5991fa.css", "assets/Block_Ratings-154e98f1.css", "assets/Block_CallOutText-7690976a.css", "assets/Block_LanguagesWeSpeak-4fc5fae9.css", "assets/Block_Testimonials-f757a741.css", "assets/FeaturedVideo-4c2ed0ff.css"],
      js: ["start-a4bdfc80.js", "chunks/index-b6a42182.js", "chunks/milk-0fba135e.js", "pages/immigration-law-services/[slug].svelte-59db881d.js", "chunks/Head_Article-304c0607.js", "chunks/Head_Twitter-0458c92f.js", "chunks/Layout_Main-21e6a800.js", "chunks/Block_Ratings-49a8d14b.js", "chunks/Block_CallOutText-f8620481.js", "chunks/Block_LanguagesWeSpeak-ae46a675.js", "chunks/Block_Testimonials-70bbe164.js", "chunks/FeaturedVideo-b0ea6aef.js"]
    },
    {
      pattern: /^\/immigration-information\/?$/,
      params: empty,
      parts: [{id: "src/routes/immigration-information/index.svelte", load: components[3]}],
      css: ["assets/start-521e4825.css", "assets/Layout_Main-7c5991fa.css"],
      js: ["start-a4bdfc80.js", "chunks/index-b6a42182.js", "chunks/milk-0fba135e.js", "pages/immigration-information/index.svelte-cf93dbb0.js", "chunks/Head_Twitter-0458c92f.js", "chunks/Layout_Main-21e6a800.js"]
    },
    {
      pattern: /^\/immigration-information\/([^/]+?)\/?$/,
      params: (m) => ({page_id: d(m[1])}),
      parts: [{id: "src/routes/immigration-information/[page_id].svelte", load: components[4]}],
      css: ["assets/start-521e4825.css", "assets/pages/immigration-information/[page_id].svelte-6c97d7f3.css", "assets/Block_ServicesList.svelte-9fe10500.css", "assets/Layout_Main-7c5991fa.css", "assets/Block_Ratings-154e98f1.css", "assets/Block_CallOutText-7690976a.css", "assets/Block_LanguagesWeSpeak-4fc5fae9.css", "assets/Block_Languages-5b0ea22c.css", "assets/Block_Testimonials-f757a741.css"],
      js: ["start-a4bdfc80.js", "chunks/index-b6a42182.js", "chunks/milk-0fba135e.js", "pages/immigration-information/[page_id].svelte-e6404f53.js", "chunks/Head_Article-304c0607.js", "chunks/Head_Twitter-0458c92f.js", "chunks/Layout_Main-21e6a800.js", "chunks/Block_Ratings-49a8d14b.js", "chunks/Block_CallOutText-f8620481.js", "chunks/Block_LanguagesWeSpeak-ae46a675.js", "chunks/Block_Languages-2c81612f.js", "chunks/Block_Testimonials-70bbe164.js", "chunks/wordpress.graphql-5818f662.js"]
    },
    {
      pattern: /^\/immigration-attorneys\/?$/,
      params: empty,
      parts: [{id: "src/routes/immigration-attorneys/index.svelte", load: components[5]}],
      css: ["assets/start-521e4825.css", "assets/pages/immigration-attorneys/index.svelte-11634b38.css", "assets/Layout_Main-7c5991fa.css", "assets/Block_Ratings-154e98f1.css", "assets/Block_CallOutText-7690976a.css", "assets/Block_LanguagesWeSpeak-4fc5fae9.css"],
      js: ["start-a4bdfc80.js", "chunks/index-b6a42182.js", "chunks/milk-0fba135e.js", "pages/immigration-attorneys/index.svelte-e0bfdb68.js", "chunks/Head_Twitter-0458c92f.js", "chunks/Layout_Main-21e6a800.js", "chunks/Block_Ratings-49a8d14b.js", "chunks/Block_CallOutText-f8620481.js", "chunks/scroll-3817046f.js", "chunks/Block_LanguagesWeSpeak-ae46a675.js"]
    },
    {
      pattern: /^\/immigration-resources\/?$/,
      params: empty,
      parts: [{id: "src/routes/immigration-resources/index.svelte", load: components[6]}],
      css: ["assets/start-521e4825.css", "assets/pages/immigration-resources/index.svelte-cec0f25e.css", "assets/Layout_Main-7c5991fa.css", "assets/Block_Ratings-154e98f1.css", "assets/Block_CallOutText-7690976a.css", "assets/Block_LanguagesWeSpeak-4fc5fae9.css", "assets/Block_Languages-5b0ea22c.css"],
      js: ["start-a4bdfc80.js", "chunks/index-b6a42182.js", "chunks/milk-0fba135e.js", "pages/immigration-resources/index.svelte-ed9823c7.js", "chunks/Head_Twitter-0458c92f.js", "chunks/Layout_Main-21e6a800.js", "chunks/Block_Ratings-49a8d14b.js", "chunks/Block_CallOutText-f8620481.js", "chunks/Block_LanguagesWeSpeak-ae46a675.js", "chunks/Block_Languages-2c81612f.js"]
    },
    {
      pattern: /^\/immigration-law-blog\/?$/,
      params: empty,
      parts: [{id: "src/routes/immigration-law-blog/index.svelte", load: components[7]}],
      css: ["assets/start-521e4825.css", "assets/pages/immigration-law-blog/index.svelte-95eec111.css", "assets/Layout_Main-7c5991fa.css", "assets/Block_Ratings-154e98f1.css", "assets/Block_CallOutText-7690976a.css", "assets/Block_Languages-5b0ea22c.css"],
      js: ["start-a4bdfc80.js", "chunks/index-b6a42182.js", "chunks/milk-0fba135e.js", "pages/immigration-law-blog/index.svelte-4b1daa84.js", "chunks/Head_Twitter-0458c92f.js", "chunks/Layout_Main-21e6a800.js", "chunks/Block_Ratings-49a8d14b.js", "chunks/Block_CallOutText-f8620481.js", "chunks/Block_Languages-2c81612f.js", "chunks/wordpress.graphql-5818f662.js", "chunks/scroll-3817046f.js"]
    },
    {
      pattern: /^\/immigration-law-blog\/blog\/?$/,
      params: empty,
      parts: [{id: "src/routes/immigration-law-blog/blog.svelte", load: components[8]}],
      css: ["assets/start-521e4825.css", "assets/pages/immigration-law-blog/blog.svelte-13080f1d.css", "assets/Block_ServicesList.svelte-9fe10500.css", "assets/Layout_Main-7c5991fa.css", "assets/Block_Ratings-154e98f1.css", "assets/Block_CallOutText-7690976a.css", "assets/Block_LanguagesWeSpeak-4fc5fae9.css", "assets/Block_Languages-5b0ea22c.css", "assets/Block_Testimonials-f757a741.css"],
      js: ["start-a4bdfc80.js", "chunks/index-b6a42182.js", "chunks/milk-0fba135e.js", "pages/immigration-law-blog/blog.svelte-99055e9f.js", "chunks/Head_Article-304c0607.js", "chunks/Head_Twitter-0458c92f.js", "chunks/Layout_Main-21e6a800.js", "chunks/Block_Ratings-49a8d14b.js", "chunks/Block_CallOutText-f8620481.js", "chunks/Block_LanguagesWeSpeak-ae46a675.js", "chunks/Block_Languages-2c81612f.js", "chunks/Block_Testimonials-70bbe164.js", "chunks/wordpress.graphql-5818f662.js"]
    },
    {
      pattern: /^\/immigration-law-blog\/([^/]+?)\/?$/,
      params: (m) => ({slug: d(m[1])}),
      parts: [{id: "src/routes/immigration-law-blog/[slug].svelte", load: components[9]}],
      css: ["assets/start-521e4825.css", "assets/pages/immigration-law-blog/blog.svelte-13080f1d.css", "assets/Block_ServicesList.svelte-9fe10500.css", "assets/Layout_Main-7c5991fa.css", "assets/Block_Ratings-154e98f1.css", "assets/Block_CallOutText-7690976a.css", "assets/Block_LanguagesWeSpeak-4fc5fae9.css", "assets/Block_Languages-5b0ea22c.css", "assets/Block_Testimonials-f757a741.css"],
      js: ["start-a4bdfc80.js", "chunks/index-b6a42182.js", "chunks/milk-0fba135e.js", "pages/immigration-law-blog/[slug].svelte-d99c353b.js", "chunks/Head_Article-304c0607.js", "chunks/Head_Twitter-0458c92f.js", "chunks/Layout_Main-21e6a800.js", "chunks/Block_Ratings-49a8d14b.js", "chunks/Block_CallOutText-f8620481.js", "chunks/Block_LanguagesWeSpeak-ae46a675.js", "chunks/Block_Languages-2c81612f.js", "chunks/Block_Testimonials-70bbe164.js", "chunks/wordpress.graphql-5818f662.js"]
    },
    {
      pattern: /^\/client-testimonials\/?$/,
      params: empty,
      parts: [{id: "src/routes/client-testimonials/index.svelte", load: components[10]}],
      css: ["assets/start-521e4825.css", "assets/pages/client-testimonials/index.svelte-3880b21c.css", "assets/Layout_Main-7c5991fa.css", "assets/Block_Ratings-154e98f1.css", "assets/Block_CallOutText-7690976a.css", "assets/FeaturedVideo-4c2ed0ff.css", "assets/Block_LanguagesWeSpeak-4fc5fae9.css", "assets/Block_Languages-5b0ea22c.css"],
      js: ["start-a4bdfc80.js", "chunks/index-b6a42182.js", "chunks/milk-0fba135e.js", "pages/client-testimonials/index.svelte-88be609e.js", "chunks/Head_Twitter-0458c92f.js", "chunks/Layout_Main-21e6a800.js", "chunks/Block_Ratings-49a8d14b.js", "chunks/Block_CallOutText-f8620481.js", "chunks/FeaturedVideo-b0ea6aef.js", "chunks/Block_LanguagesWeSpeak-ae46a675.js", "chunks/Block_Languages-2c81612f.js"]
    },
    {
      pattern: /^\/fonttest\/?$/,
      params: empty,
      parts: [{id: "src/routes/fonttest.svelte", load: components[11]}],
      css: ["assets/start-521e4825.css"],
      js: ["start-a4bdfc80.js", "chunks/index-b6a42182.js", "chunks/milk-0fba135e.js", "pages/fonttest.svelte-05962535.js"]
    },
    {
      pattern: /^\/espanol\/?$/,
      params: empty,
      parts: [{id: "src/routes/espanol/index.svelte", load: components[12]}],
      css: ["assets/start-521e4825.css", "assets/pages/espanol/index.svelte-38f6e0d7.css", "assets/Layout_Main-7c5991fa.css", "assets/Block_Ratings-154e98f1.css", "assets/Block_CallOutText-7690976a.css", "assets/FeaturedVideo-4c2ed0ff.css", "assets/Block_LanguagesWeSpeak-4fc5fae9.css", "assets/Block_Languages-5b0ea22c.css"],
      js: ["start-a4bdfc80.js", "chunks/index-b6a42182.js", "chunks/milk-0fba135e.js", "pages/espanol/index.svelte-2a755d86.js", "chunks/Head_Twitter-0458c92f.js", "chunks/Layout_Main-21e6a800.js", "chunks/Block_Ratings-49a8d14b.js", "chunks/Block_CallOutText-f8620481.js", "chunks/FeaturedVideo-b0ea6aef.js", "chunks/Block_LanguagesWeSpeak-ae46a675.js", "chunks/Block_Languages-2c81612f.js"]
    },
    {
      pattern: /^\/test\/?$/,
      params: empty,
      parts: [{id: "src/routes/test.svelte.md", load: components[13]}],
      css: ["assets/start-521e4825.css", "assets/Layout_Main-7c5991fa.css"],
      js: ["start-a4bdfc80.js", "chunks/index-b6a42182.js", "chunks/milk-0fba135e.js", "pages/test.svelte.md-a58c7b83.js", "chunks/Layout_Main-21e6a800.js"]
    }
  ],
  endpoints: []
};
function render(request, {
  paths = {base: "", assets: "/."},
  local = false,
  only_render_prerenderable_pages = false,
  get_static_file
} = {}) {
  return ssr(request, {
    paths,
    local,
    template,
    manifest,
    target: "#milk",
    entry: "/./_app/start-a4bdfc80.js",
    root: Root,
    setup,
    dev: false,
    amp: false,
    only_render_prerenderable_pages,
    app_dir: "_app",
    host: null,
    host_header: null,
    get_component_path: (id) => "/./_app/" + client_component_lookup[id],
    get_stack: (error) => error.stack,
    get_static_file,
    get_amp_css: (dep) => amp_css_lookup[dep]
  });
}
function asyncGeneratorStep$A(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$A(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$A(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$A(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Head_Language = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var _$milk, _$milk$config;
  var {lang = "en"} = $$props;
  onMount(/* @__PURE__ */ _asyncToGenerator$A(function* () {
    document.documentElement.setAttribute("lang", lang);
  }));
  if ($$props.lang === void 0 && $$bindings.lang && lang !== void 0)
    $$bindings.lang(lang);
  lang || (lang = ((_$milk = $milk) == null ? void 0 : (_$milk$config = _$milk.config) == null ? void 0 : _$milk$config.lang) || "en");
  $$unsubscribe_milk();
  return `${$$result.head += `<meta http-equiv="${"content-language"}"${add_attribute("content", lang, 0)} data-svelte="svelte-jw2sw1">`, ""}`;
});
function asyncGeneratorStep$z(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$z(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$z(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$z(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Head_HTML = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var _$milk, _$milk$site, _$milk2, _$milk2$site, _$milk3, _$milk3$site;
  var {title} = $$props;
  var {description: description2} = $$props;
  var {keywords} = $$props;
  var {canonical} = $$props;
  var win_location = "";
  onMount(/* @__PURE__ */ _asyncToGenerator$z(function* () {
    var _window, _window$location, _window2, _window2$location, _$milk4, _$milk4$site;
    win_location = (_window = window) != null && (_window$location = _window.location) != null && _window$location.href ? (_window2 = window) == null ? void 0 : (_window2$location = _window2.location) == null ? void 0 : _window2$location.href : (_$milk4 = $milk) == null ? void 0 : (_$milk4$site = _$milk4.site) == null ? void 0 : _$milk4$site.url;
  }));
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.description === void 0 && $$bindings.description && description2 !== void 0)
    $$bindings.description(description2);
  if ($$props.keywords === void 0 && $$bindings.keywords && keywords !== void 0)
    $$bindings.keywords(keywords);
  if ($$props.canonical === void 0 && $$bindings.canonical && canonical !== void 0)
    $$bindings.canonical(canonical);
  title || (title = ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.title) || "");
  description2 || (description2 = ((_$milk2 = $milk) == null ? void 0 : (_$milk2$site = _$milk2.site) == null ? void 0 : _$milk2$site.description) || "");
  keywords || (keywords = ((_$milk3 = $milk) == null ? void 0 : (_$milk3$site = _$milk3.site) == null ? void 0 : _$milk3$site.keywords) || "");
  canonical || (canonical = win_location || "");
  $$unsubscribe_milk();
  return `${$$result.head += `${$$result.title = `<title>${escape(title)}</title>`, ""}<meta name="${"description"}"${add_attribute("content", description2, 0)} data-svelte="svelte-yin3em"><meta name="${"keywords"}"${add_attribute("content", keywords, 0)} data-svelte="svelte-yin3em"><link rel="${"canonical"}"${add_attribute("href", canonical.replace("blog/?slug=", "").replace("blog?slug=", ""), 0)} data-svelte="svelte-yin3em"><meta name="${"developer"}" content="${"Joshua Jarman (josh@redesigned.com)"}" data-svelte="svelte-yin3em">${slots.default ? slots.default({}) : ``}`, ""}`;
});
function asyncGeneratorStep$y(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$y(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$y(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$y(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Head_Facebook = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a;
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var _$milk, _$milk$site, _$milk2, _$milk2$site, _$milk3, _$milk3$credits, _$milk4, _$milk4$site, _$milk5, _$milk5$site, _$milk6, _$milk6$site;
  var url;
  var {image} = $$props;
  var {type} = $$props;
  var {title} = $$props;
  var {description: description2} = $$props;
  var win_location = "";
  onMount(/* @__PURE__ */ _asyncToGenerator$y(function* () {
    var _window, _window$location, _window2, _window2$location, _$milk7, _$milk7$site;
    win_location = (_window = window) != null && (_window$location = _window.location) != null && _window$location.href ? (_window2 = window) == null ? void 0 : (_window2$location = _window2.location) == null ? void 0 : _window2$location.href : (_$milk7 = $milk) == null ? void 0 : (_$milk7$site = _$milk7.site) == null ? void 0 : _$milk7$site.url;
  }));
  if ($$props.image === void 0 && $$bindings.image && image !== void 0)
    $$bindings.image(image);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.description === void 0 && $$bindings.description && description2 !== void 0)
    $$bindings.description(description2);
  image || (image = ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.facebook_photo) || ((_$milk2 = $milk) == null ? void 0 : (_$milk2$site = _$milk2.site) == null ? void 0 : _$milk2$site.twitter_photo) || ((_$milk3 = $milk) == null ? void 0 : (_$milk3$credits = _$milk3.credits) == null ? void 0 : _$milk3$credits.social) || "");
  title || (title = (_$milk4 = $milk) == null ? void 0 : (_$milk4$site = _$milk4.site) == null ? void 0 : _$milk4$site.title);
  type || (type = (_$milk5 = $milk) == null ? void 0 : (_$milk5$site = _$milk5.site) == null ? void 0 : _$milk5$site.facebook_type);
  description2 || (description2 = (_$milk6 = $milk) == null ? void 0 : (_$milk6$site = _$milk6.site) == null ? void 0 : _$milk6$site.description);
  url = win_location;
  $$unsubscribe_milk();
  return `${$$result.head += `<meta property="${"og:url"}"${add_attribute("content", url, 0)} data-svelte="svelte-72tea"><meta property="${"og:type"}"${add_attribute("content", type, 0)} data-svelte="svelte-72tea"><meta property="${"og:site_name"}"${add_attribute("content", (_a = $milk == null ? void 0 : $milk.site) == null ? void 0 : _a.title, 0)} data-svelte="svelte-72tea"><meta property="${"og:title"}"${add_attribute("content", title, 0)} data-svelte="svelte-72tea"><meta property="${"og:description"}"${add_attribute("content", description2, 0)} data-svelte="svelte-72tea"><meta property="${"og:image"}"${add_attribute("content", `${url}${image}`, 0)} data-svelte="svelte-72tea">${slots.default ? slots.default({}) : ``}`, ""}`;
});
function asyncGeneratorStep$x(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$x(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$x(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$x(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Head_Twitter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var _$milk, _$milk$site, _$milk2, _$milk2$site, _$milk3, _$milk3$credits, _$milk4, _$milk4$site, _$milk5, _$milk5$site;
  var url;
  var domain;
  var {image} = $$props;
  var {title} = $$props;
  var {description: description2} = $$props;
  var win_location = "";
  var win_domain = "";
  onMount(/* @__PURE__ */ _asyncToGenerator$x(function* () {
    var _window, _window$location, _window2, _window2$location, _$milk6, _$milk6$site, _window3, _window3$location, _window4, _window4$location, _$milk7, _$milk7$site;
    win_location = (_window = window) != null && (_window$location = _window.location) != null && _window$location.href ? (_window2 = window) == null ? void 0 : (_window2$location = _window2.location) == null ? void 0 : _window2$location.href : (_$milk6 = $milk) == null ? void 0 : (_$milk6$site = _$milk6.site) == null ? void 0 : _$milk6$site.url;
    win_domain = (_window3 = window) != null && (_window3$location = _window3.location) != null && _window3$location.host ? (_window4 = window) == null ? void 0 : (_window4$location = _window4.location) == null ? void 0 : _window4$location.host : (_$milk7 = $milk) == null ? void 0 : (_$milk7$site = _$milk7.site) == null ? void 0 : _$milk7$site.domain;
  }));
  if ($$props.image === void 0 && $$bindings.image && image !== void 0)
    $$bindings.image(image);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.description === void 0 && $$bindings.description && description2 !== void 0)
    $$bindings.description(description2);
  image || (image = ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.twitter_photo) || ((_$milk2 = $milk) == null ? void 0 : (_$milk2$site = _$milk2.site) == null ? void 0 : _$milk2$site.facebook_photo) || ((_$milk3 = $milk) == null ? void 0 : (_$milk3$credits = _$milk3.credits) == null ? void 0 : _$milk3$credits.social) || "");
  title || (title = ((_$milk4 = $milk) == null ? void 0 : (_$milk4$site = _$milk4.site) == null ? void 0 : _$milk4$site.title) || "");
  description2 || (description2 = ((_$milk5 = $milk) == null ? void 0 : (_$milk5$site = _$milk5.site) == null ? void 0 : _$milk5$site.description) || "");
  url = win_location;
  domain = win_domain;
  $$unsubscribe_milk();
  return `${$$result.head += `<meta name="${"twitter:card"}" content="${"summary_large_image"}" data-svelte="svelte-1tmq1nn"><meta property="${"twitter:domain"}"${add_attribute("content", domain, 0)} data-svelte="svelte-1tmq1nn"><meta property="${"twitter:url"}"${add_attribute("content", url, 0)} data-svelte="svelte-1tmq1nn"><meta name="${"twitter:title"}"${add_attribute("content", title, 0)} data-svelte="svelte-1tmq1nn"><meta name="${"twitter:description"}"${add_attribute("content", description2, 0)} data-svelte="svelte-1tmq1nn"><meta name="${"twitter:image"}"${add_attribute("content", `${url}${image}`, 0)} data-svelte="svelte-1tmq1nn">${slots.default ? slots.default({}) : ``}`, ""}`;
});
var Block_StickyHeader_svelte = ".sticky-header.svelte-1pyujr9{position:relative;display:block;width:100%;margin:0 auto;text-align:center}.sticky-header[data-type^=sticky].svelte-1pyujr9{position:fixed;top:0;z-index:9999}.sticky-header[data-type=sticky-hide].svelte-1pyujr9{transition:all .3s cubic-bezier(.25,1,.5,1);transform:translateZ(0)}.sticky-header[data-type=sticky-hide][data-scroll=down].svelte-1pyujr9{transform:translate3d(0,-100%,0)}.sticky-header[data-type=sticky-hide][data-scroll=up].svelte-1pyujr9{transform:translateZ(0)}";
const css$K = {
  code: ".sticky-header.svelte-1pyujr9{position:relative;display:block;width:100%;margin:0 auto;text-align:center}.sticky-header[data-type^=sticky].svelte-1pyujr9{position:fixed;top:0;z-index:9999}.sticky-header[data-type=sticky-hide].svelte-1pyujr9{transition:all .3s cubic-bezier(.25,1,.5,1);transform:translateZ(0)}.sticky-header[data-type=sticky-hide][data-scroll=down].svelte-1pyujr9{transform:translate3d(0,-100%,0)}.sticky-header[data-type=sticky-hide][data-scroll=up].svelte-1pyujr9{transform:translateZ(0)}",
  map: `{"version":3,"file":"Block_StickyHeader.svelte","sources":["Block_StickyHeader.svelte"],"sourcesContent":["<svelte:window bind:scrollY={y} />\\n<div class=\\"sticky-header\\" data-type={type} data-scroll={scroll}><slot /></div>\\n\\n<script>var type;\\nvar y = 0;\\nvar pY = 0;\\nvar height = 0;\\nvar scroll = '';\\n\\n$: scroll = setDirection(y);\\n\\nvar setDirection = y => {\\n  if (y > height) {\\n    var direction = y <= pY ? 'up' : 'down';\\n    pY = y;\\n    return direction;\\n  } else {\\n    return 'up';\\n  }\\n};\\n\\nexport { type };</script>\\n\\n<style>.sticky-header{position:relative;display:block;width:100%;margin:0 auto;text-align:center}.sticky-header[data-type^=sticky]{position:fixed;top:0;z-index:9999}.sticky-header[data-type=sticky-hide]{transition:all .3s cubic-bezier(.25,1,.5,1);transform:translateZ(0)}.sticky-header[data-type=sticky-hide][data-scroll=down]{transform:translate3d(0,-100%,0)}.sticky-header[data-type=sticky-hide][data-scroll=up]{transform:translateZ(0)}</style>\\n"],"names":[],"mappings":"AAuBO,6BAAc,CAAC,SAAS,QAAQ,CAAC,QAAQ,KAAK,CAAC,MAAM,IAAI,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,WAAW,MAAM,CAAC,cAAc,CAAC,SAAS,EAAE,MAAM,gBAAC,CAAC,SAAS,KAAK,CAAC,IAAI,CAAC,CAAC,QAAQ,IAAI,CAAC,cAAc,CAAC,SAAS,CAAC,WAAW,gBAAC,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,aAAa,GAAG,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,UAAU,WAAW,CAAC,CAAC,CAAC,cAAc,CAAC,SAAS,CAAC,WAAW,CAAC,CAAC,WAAW,CAAC,IAAI,gBAAC,CAAC,UAAU,YAAY,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,cAAc,CAAC,SAAS,CAAC,WAAW,CAAC,CAAC,WAAW,CAAC,EAAE,gBAAC,CAAC,UAAU,WAAW,CAAC,CAAC,CAAC"}`
};
var height = 0;
const Block_StickyHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var {type} = $$props;
  var y = 0;
  var pY = 0;
  var scroll = "";
  var setDirection = (y2) => {
    if (y2 > height) {
      var direction = y2 <= pY ? "up" : "down";
      pY = y2;
      return direction;
    } else {
      return "up";
    }
  };
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  $$result.css.add(css$K);
  scroll = setDirection(y);
  return `
<div class="${"sticky-header svelte-1pyujr9"}"${add_attribute("data-type", type, 0)}${add_attribute("data-scroll", scroll, 0)}>${slots.default ? slots.default({}) : ``}</div>`;
});
var Block_Header_svelte = ".header.svelte-16u0y7p.svelte-16u0y7p{padding:var(--padding) var(--padding) 0;min-height:80px}.header-inner.svelte-16u0y7p.svelte-16u0y7p{margin:0 auto;max-width:1200px;max-width:var(--content-constrain,1200px);text-align:center;padding:var(--padding-small)}a.svelte-16u0y7p.svelte-16u0y7p{transition:color var(--transition-speed);display:inline-block}a.svelte-16u0y7p.svelte-16u0y7p:hover{text-decoration:none}div.logo.svelte-16u0y7p.svelte-16u0y7p{max-width:300px}div.logo.svelte-16u0y7p.svelte-16u0y7p,div.logo.svelte-16u0y7p a.svelte-16u0y7p,img.logo.svelte-16u0y7p.svelte-16u0y7p{width:100%}.contact.svelte-16u0y7p>div.svelte-16u0y7p{margin-top:5px}@media screen and (max-width:650px){.header.svelte-16u0y7p.svelte-16u0y7p{display:none}}";
const css$J = {
  code: ".header.svelte-16u0y7p.svelte-16u0y7p{padding:var(--padding) var(--padding) 0;min-height:80px}.header-inner.svelte-16u0y7p.svelte-16u0y7p{margin:0 auto;max-width:1200px;max-width:var(--content-constrain,1200px);text-align:center;padding:var(--padding-small)}a.svelte-16u0y7p.svelte-16u0y7p{transition:color var(--transition-speed);display:inline-block}a.svelte-16u0y7p.svelte-16u0y7p:hover{text-decoration:none}div.logo.svelte-16u0y7p.svelte-16u0y7p{max-width:300px}div.logo.svelte-16u0y7p.svelte-16u0y7p,div.logo.svelte-16u0y7p a.svelte-16u0y7p,img.logo.svelte-16u0y7p.svelte-16u0y7p{width:100%}.contact.svelte-16u0y7p>div.svelte-16u0y7p{margin-top:5px}@media screen and (max-width:650px){.header.svelte-16u0y7p.svelte-16u0y7p{display:none}}",
  map: `{"version":3,"file":"Block_Header.svelte","sources":["Block_Header.svelte"],"sourcesContent":["<header {id} class={blockclass}>\\n\\t<div class=\\"header-inner\\">\\n\\t\\t<div class=\\"header-content\\">\\n\\t\\t\\t<div class=\\"logo\\">\\n\\t\\t\\t\\t<a href=\\"/\\" title=\\"Home\\">\\n\\t\\t\\t\\t\\t<picture title={$milk.config.organization}>\\n\\t\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"logo u-logo image\\"\\n\\t\\t\\t\\t\\t\\t\\theight={$milk.site.logo_height}\\n\\t\\t\\t\\t\\t\\t\\twidth={$milk.site.logo_width}\\n\\t\\t\\t\\t\\t\\t\\tsrc={$milk.site.logo}\\n\\t\\t\\t\\t\\t\\t\\talt={$milk.site.organization}\\n\\t\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\t\\titemprop=\\"logo\\"\\n\\t\\t\\t\\t\\t\\t\\tproperty=\\"logo\\"\\n\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t</picture>\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</div>\\n\\t\\t\\t<div class=\\"contact\\">\\n\\t\\t\\t\\t<div>\\n\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\thref={\`tel:+\${$milk.site.phone}\`}\\n\\t\\t\\t\\t\\t\\ton:click|preventDefault={() => {\\n\\t\\t\\t\\t\\t\\t\\tif (window?.callingCard?.show) {\\n\\t\\t\\t\\t\\t\\t\\t\\twindow?.callingCard?.show();\\n\\t\\t\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t\\t\\t}}\\n\\t\\t\\t\\t\\t\\ttitle=\\"Phone\\"\\n\\t\\t\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t{$milk.site.phone}\\n\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t<div class=\\"address\\">\\n\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\thref={$milk.site.google_maps}\\n\\t\\t\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\t\\t\\ttitle=\\"Directions\\"\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t{$milk.site.address}, {$milk.site.address2}<br />\\n\\t\\t\\t\\t\\t\\t{$milk.site.city}, {$milk.site.state_abbr}\\n\\t\\t\\t\\t\\t\\t{$milk.site.zip}\\n\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t</div>\\n</header>\\n\\n<script>/* ## MILK ## */\\nimport { milk } from '$milk/milk.js';\\n/* ## Vairables ## */\\n\\nvar id;\\nvar blockstyle = '';\\nvar blockclass = 'header';\\n\\n$: blockclass = \\"header \\" + blockstyle;\\n/* ## Exports ## */\\n\\n\\nexport { id, blockstyle };</script>\\n\\n<style>.header{padding:var(--padding) var(--padding) 0;min-height:80px}.header-inner{margin:0 auto;max-width:1200px;max-width:var(--content-constrain,1200px);text-align:center;padding:var(--padding-small)}a{transition:color var(--transition-speed);display:inline-block}a:hover{text-decoration:none}div.logo{max-width:300px}div.logo,div.logo a,img.logo{width:100%}.contact>div{margin-top:5px}@media screen and (max-width:650px){.header{display:none}}</style>\\n"],"names":[],"mappings":"AAiEO,qCAAO,CAAC,QAAQ,IAAI,SAAS,CAAC,CAAC,IAAI,SAAS,CAAC,CAAC,CAAC,CAAC,WAAW,IAAI,CAAC,2CAAa,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,MAAM,CAAC,UAAU,IAAI,mBAAmB,CAAC,MAAM,CAAC,CAAC,WAAW,MAAM,CAAC,QAAQ,IAAI,eAAe,CAAC,CAAC,+BAAC,CAAC,WAAW,KAAK,CAAC,IAAI,kBAAkB,CAAC,CAAC,QAAQ,YAAY,CAAC,+BAAC,MAAM,CAAC,gBAAgB,IAAI,CAAC,GAAG,mCAAK,CAAC,UAAU,KAAK,CAAC,GAAG,mCAAK,CAAC,GAAG,oBAAK,CAAC,gBAAC,CAAC,GAAG,mCAAK,CAAC,MAAM,IAAI,CAAC,uBAAQ,CAAC,kBAAG,CAAC,WAAW,GAAG,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,qCAAO,CAAC,QAAQ,IAAI,CAAC,CAAC"}`
};
const Block_Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var {id} = $$props;
  var {blockstyle = ""} = $$props;
  var blockclass = "header";
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  $$result.css.add(css$J);
  blockclass = "header " + blockstyle;
  $$unsubscribe_milk();
  return `<header${add_attribute("id", id, 0)} class="${escape(null_to_empty(blockclass)) + " svelte-16u0y7p"}"><div class="${"header-inner svelte-16u0y7p"}"><div class="${"header-content"}"><div class="${"logo svelte-16u0y7p"}"><a href="${"/"}" title="${"Home"}" class="${"svelte-16u0y7p"}"><picture${add_attribute("title", $milk.config.organization, 0)}><img class="${"logo u-logo image svelte-16u0y7p"}"${add_attribute("height", $milk.site.logo_height, 0)}${add_attribute("width", $milk.site.logo_width, 0)}${add_attribute("src", $milk.site.logo, 0)}${add_attribute("alt", $milk.site.organization, 0)} loading="${"lazy"}" itemprop="${"logo"}" property="${"logo"}"></picture></a></div>
			<div class="${"contact svelte-16u0y7p"}"><div class="${"svelte-16u0y7p"}"><a${add_attribute("href", `tel:+${$milk.site.phone}`, 0)} title="${"Phone"}" rel="${"noreferrer"}" class="${"svelte-16u0y7p"}">${escape($milk.site.phone)}</a></div>
				<div class="${"address svelte-16u0y7p"}"><a${add_attribute("href", $milk.site.google_maps, 0)} target="${"_blank"}" rel="${"noreferrer"}" title="${"Directions"}" class="${"svelte-16u0y7p"}">${escape($milk.site.address)}, ${escape($milk.site.address2)}<br>
						${escape($milk.site.city)}, ${escape($milk.site.state_abbr)}
						${escape($milk.site.zip)}</a></div></div></div></div>
</header>`;
});
const stripTags = (htmlstr) => {
  let div = document.createElement("div");
  div.innerHTML = htmlstr;
  return div.textContent;
};
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};
const getAbsoluteUrl = (url) => {
  let a;
  if (!a) {
    a = document.createElement("a");
  }
  a.href = url;
  return a.href;
};
const debounce = (func, wait, immediate) => {
  let timeout;
  return function() {
    let context = this, args = arguments;
    let later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
};
[...Array(7).keys()].map((days) => new Date(Date.now() - 864e5 * days));
var Hamburger_svelte = ".hamburger-container.svelte-u8b73e.svelte-u8b73e{display:inline-block;vertical-align:middle;cursor:pointer}.hamburger.svelte-u8b73e.svelte-u8b73e{display:block;position:relative;height:400px;width:400px;padding:0;margin:0;cursor:pointer}.hamburger.svelte-u8b73e i.svelte-u8b73e{display:block;position:absolute;height:16%;width:100%;background:#000;background:var(--hamburger-color,#000);transition:all .4s ease-out}.hamburger.svelte-u8b73e:focus i.svelte-u8b73e,.hamburger.svelte-u8b73e:hover i.svelte-u8b73e{background:#000;background:var(--hamburger-color-hover,#000);transition:all .4s ease-out}.hamburger.svelte-u8b73e i.svelte-u8b73e:first-child{top:9%}.hamburger.svelte-u8b73e i.svelte-u8b73e:nth-child(2){top:42%}.hamburger.svelte-u8b73e i.svelte-u8b73e:nth-child(3){top:75%}.hamburger.open.svelte-u8b73e i.svelte-u8b73e:first-child{transform:rotate(45deg);transform-origin:left bottom;top:4%;left:8%}.hamburger.open.svelte-u8b73e i.svelte-u8b73e:nth-child(2){opacity:0}.hamburger.open.svelte-u8b73e i.svelte-u8b73e:nth-child(3){transform:rotate(-45deg);transform-origin:left top;top:80%;left:8%}.hamburger.open.svelte-u8b73e:hover i.svelte-u8b73e{background:#000;background:var(--hamburger-color-open,#000);transition:all .4s ease-out}.hamburger.open.svelte-u8b73e:focus i.svelte-u8b73e,.hamburger.open.svelte-u8b73e:hover i.svelte-u8b73e{background:#900;background:var(--hamburger-color-open-hover,#900);transition:all .4s ease-out}";
const css$I = {
  code: ".hamburger-container.svelte-u8b73e.svelte-u8b73e{display:inline-block;vertical-align:middle;cursor:pointer}.hamburger.svelte-u8b73e.svelte-u8b73e{display:block;position:relative;height:400px;width:400px;padding:0;margin:0;cursor:pointer}.hamburger.svelte-u8b73e i.svelte-u8b73e{display:block;position:absolute;height:16%;width:100%;background:#000;background:var(--hamburger-color,#000);transition:all .4s ease-out}.hamburger.svelte-u8b73e:focus i.svelte-u8b73e,.hamburger.svelte-u8b73e:hover i.svelte-u8b73e{background:#000;background:var(--hamburger-color-hover,#000);transition:all .4s ease-out}.hamburger.svelte-u8b73e i.svelte-u8b73e:first-child{top:9%}.hamburger.svelte-u8b73e i.svelte-u8b73e:nth-child(2){top:42%}.hamburger.svelte-u8b73e i.svelte-u8b73e:nth-child(3){top:75%}.hamburger.open.svelte-u8b73e i.svelte-u8b73e:first-child{transform:rotate(45deg);transform-origin:left bottom;top:4%;left:8%}.hamburger.open.svelte-u8b73e i.svelte-u8b73e:nth-child(2){opacity:0}.hamburger.open.svelte-u8b73e i.svelte-u8b73e:nth-child(3){transform:rotate(-45deg);transform-origin:left top;top:80%;left:8%}.hamburger.open.svelte-u8b73e:hover i.svelte-u8b73e{background:#000;background:var(--hamburger-color-open,#000);transition:all .4s ease-out}.hamburger.open.svelte-u8b73e:focus i.svelte-u8b73e,.hamburger.open.svelte-u8b73e:hover i.svelte-u8b73e{background:#900;background:var(--hamburger-color-open-hover,#900);transition:all .4s ease-out}",
  map: '{"version":3,"file":"Hamburger.svelte","sources":["Hamburger.svelte"],"sourcesContent":["<div\\n\\tclass=\\"hamburger-container\\"\\n\\tstyle={`padding: ${padding};`}\\n\\ton:click={toggleOpen}\\n>\\n\\t<div\\n\\t\\tclass=\\"hamburger\\"\\n\\t\\tclass:open={isOpen}\\n\\t\\tstyle={`width: ${size}; height: ${size}`}\\n\\t\\tfor=\\"#nav\\"\\n\\t>\\n\\t\\t<i /><i /><i />\\n\\t</div>\\n</div>\\n\\n<script>var size;\\nvar padding;\\nvar isOpen = false;\\nvar target = \'nav\';\\n\\nvar toggleOpen = () => {\\n  isOpen = !isOpen;\\n  var targetElm = document.querySelector(target);\\n\\n  if (targetElm) {\\n    if (isOpen) {\\n      targetElm.classList.add(\'open\');\\n    } else {\\n      targetElm.classList.remove(\'open\');\\n    }\\n  }\\n};\\n\\nexport { size, padding, target };</script>\\n\\n<style>.hamburger-container{display:inline-block;vertical-align:middle;cursor:pointer}.hamburger{display:block;position:relative;height:400px;width:400px;padding:0;margin:0;cursor:pointer}.hamburger i{display:block;position:absolute;height:16%;width:100%;background:#000;background:var(--hamburger-color,#000);transition:all .4s ease-out}.hamburger:focus i,.hamburger:hover i{background:#000;background:var(--hamburger-color-hover,#000);transition:all .4s ease-out}.hamburger i:first-child{top:9%}.hamburger i:nth-child(2){top:42%}.hamburger i:nth-child(3){top:75%}.hamburger.open i:first-child{transform:rotate(45deg);transform-origin:left bottom;top:4%;left:8%}.hamburger.open i:nth-child(2){opacity:0}.hamburger.open i:nth-child(3){transform:rotate(-45deg);transform-origin:left top;top:80%;left:8%}.hamburger.open:hover i{background:#000;background:var(--hamburger-color-open,#000);transition:all .4s ease-out}.hamburger.open:focus i,.hamburger.open:hover i{background:#900;background:var(--hamburger-color-open-hover,#900);transition:all .4s ease-out}</style>\\n"],"names":[],"mappings":"AAmCO,gDAAoB,CAAC,QAAQ,YAAY,CAAC,eAAe,MAAM,CAAC,OAAO,OAAO,CAAC,sCAAU,CAAC,QAAQ,KAAK,CAAC,SAAS,QAAQ,CAAC,OAAO,KAAK,CAAC,MAAM,KAAK,CAAC,QAAQ,CAAC,CAAC,OAAO,CAAC,CAAC,OAAO,OAAO,CAAC,wBAAU,CAAC,eAAC,CAAC,QAAQ,KAAK,CAAC,SAAS,QAAQ,CAAC,OAAO,GAAG,CAAC,MAAM,IAAI,CAAC,WAAW,IAAI,CAAC,WAAW,IAAI,iBAAiB,CAAC,IAAI,CAAC,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,QAAQ,CAAC,wBAAU,MAAM,CAAC,eAAC,CAAC,wBAAU,MAAM,CAAC,eAAC,CAAC,WAAW,IAAI,CAAC,WAAW,IAAI,uBAAuB,CAAC,IAAI,CAAC,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,QAAQ,CAAC,wBAAU,CAAC,eAAC,YAAY,CAAC,IAAI,EAAE,CAAC,wBAAU,CAAC,eAAC,WAAW,CAAC,CAAC,CAAC,IAAI,GAAG,CAAC,wBAAU,CAAC,eAAC,WAAW,CAAC,CAAC,CAAC,IAAI,GAAG,CAAC,UAAU,mBAAK,CAAC,eAAC,YAAY,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,iBAAiB,IAAI,CAAC,MAAM,CAAC,IAAI,EAAE,CAAC,KAAK,EAAE,CAAC,UAAU,mBAAK,CAAC,eAAC,WAAW,CAAC,CAAC,CAAC,QAAQ,CAAC,CAAC,UAAU,mBAAK,CAAC,eAAC,WAAW,CAAC,CAAC,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,iBAAiB,IAAI,CAAC,GAAG,CAAC,IAAI,GAAG,CAAC,KAAK,EAAE,CAAC,UAAU,mBAAK,MAAM,CAAC,eAAC,CAAC,WAAW,IAAI,CAAC,WAAW,IAAI,sBAAsB,CAAC,IAAI,CAAC,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,QAAQ,CAAC,UAAU,mBAAK,MAAM,CAAC,eAAC,CAAC,UAAU,mBAAK,MAAM,CAAC,eAAC,CAAC,WAAW,IAAI,CAAC,WAAW,IAAI,4BAA4B,CAAC,IAAI,CAAC,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,QAAQ,CAAC"}'
};
const Hamburger = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var {size} = $$props;
  var {padding} = $$props;
  var {target = "nav"} = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.padding === void 0 && $$bindings.padding && padding !== void 0)
    $$bindings.padding(padding);
  if ($$props.target === void 0 && $$bindings.target && target !== void 0)
    $$bindings.target(target);
  $$result.css.add(css$I);
  return `<div class="${"hamburger-container svelte-u8b73e"}"${add_attribute("style", `padding: ${padding};`, 0)}><div class="${["hamburger svelte-u8b73e", ""].join(" ").trim()}"${add_attribute("style", `width: ${size}; height: ${size}`, 0)} for="${"#nav"}"><i class="${"svelte-u8b73e"}"></i><i class="${"svelte-u8b73e"}"></i><i class="${"svelte-u8b73e"}"></i></div>
</div>`;
});
var Block_Navigation_svelte = '.navigation.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{padding-bottom:10px;min-height:42px;z-index:999}.navigation-inner.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{margin:0 auto;max-width:1200px;max-width:var(--content-constrain,1200px);text-align:center;padding:0 var(--padding)}.navigation-inner.svelte-s5o22v svg.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{max-width:30px;max-height:30px}.navigation-inner.svelte-s5o22v a.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{color:var(--color-white)}.navigation-inner.svelte-s5o22v a.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v:hover,.navigation-inner.svelte-s5o22v a:hover svg.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{color:var(--color-three)}.nav-extra.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{width:40px;height:30px;vertical-align:middle;line-height:25px;float:right;margin-right:calc(var(--padding) + 10px);text-align:center}.nav-extra.svelte-s5o22v svg.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{max-width:20px;max-height:20px}.nav-extra.svelte-s5o22v .call.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v,.nav-extra.svelte-s5o22v .map.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v,.nav-logo.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{display:none}nav.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{display:block;position:relative;text-align:left;padding:0 20px;width:calc(100% - 60px)}nav.svelte-s5o22v li.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v,nav.svelte-s5o22v ul.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{list-style:none;margin:0;padding:0}nav.svelte-s5o22v>ul.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{display:flex;width:100%}nav.svelte-s5o22v>ul.svelte-s5o22v>li.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{flex:1}nav.svelte-s5o22v li a.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{display:block;padding:var(--padding-nav);text-transform:uppercase;font-size:var(--small-fontsize);transition:color var(--transition-speed)}nav.svelte-s5o22v li a.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v:hover{text-decoration:none}nav.svelte-s5o22v li.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v:before{content:"";display:none}nav.svelte-s5o22v>ul.svelte-s5o22v>li.svelte-s5o22v>a.svelte-s5o22v>span.svelte-s5o22v{display:inline-block;position:relative}nav.svelte-s5o22v>ul.svelte-s5o22v>li.svelte-s5o22v>a.svelte-s5o22v>span.svelte-s5o22v:after{height:2px;background-color:transparent;position:absolute;content:"";width:0;margin:0 50%;display:block;bottom:0;left:0;transition:margin .5s,width .5s,opacity .5s,color .5s,background-color .5s}nav.svelte-s5o22v>ul.svelte-s5o22v>li.svelte-s5o22v:hover>a.svelte-s5o22v>span.svelte-s5o22v:after,nav.svelte-s5o22v>ul.svelte-s5o22v>li.svelte-s5o22v>a.current.svelte-s5o22v>span.svelte-s5o22v:after{margin:0 -10%;width:120%;opacity:1;background-color:var(--color-one)}@media screen and (max-width:700px){.navigation-inner.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{width:100%;padding-top:10px;text-align:left}.nav-logo.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{display:inline-block;vertical-align:middle;margin-top:-5px}.nav-extra.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{width:auto;display:inline-block;float:right;vertical-align:top;margin-right:0;margin-top:-10px}.nav-extra.svelte-s5o22v .call.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v,.nav-extra.svelte-s5o22v .map.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v,.nav-extra.svelte-s5o22v .search.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{display:inline-block;vertical-align:middle;width:30px;height:auto}nav.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{display:grid;align-content:center;justify-content:center;place-content:center;height:calc(100vh - 40px);width:100vw!important;overflow:scroll;position:fixed;top:40px;left:0;text-align:center;background:var(--color-six);transition:all 1s}nav.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v:not(.open){margin-left:100vw!important;transition:all 0s}nav.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v:is(.open){margin-left:0!important;transition:all 1s}nav.svelte-s5o22v>ul.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{display:block}nav.svelte-s5o22v li a.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{font-size:var(--large-fontsize)}}';
const css$H = {
  code: '.navigation.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{padding-bottom:10px;min-height:42px;z-index:999}.navigation-inner.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{margin:0 auto;max-width:1200px;max-width:var(--content-constrain,1200px);text-align:center;padding:0 var(--padding)}.navigation-inner.svelte-s5o22v svg.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{max-width:30px;max-height:30px}.navigation-inner.svelte-s5o22v a.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{color:var(--color-white)}.navigation-inner.svelte-s5o22v a.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v:hover,.navigation-inner.svelte-s5o22v a:hover svg.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{color:var(--color-three)}.nav-extra.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{width:40px;height:30px;vertical-align:middle;line-height:25px;float:right;margin-right:calc(var(--padding) + 10px);text-align:center}.nav-extra.svelte-s5o22v svg.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{max-width:20px;max-height:20px}.nav-extra.svelte-s5o22v .call.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v,.nav-extra.svelte-s5o22v .map.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v,.nav-logo.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{display:none}nav.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{display:block;position:relative;text-align:left;padding:0 20px;width:calc(100% - 60px)}nav.svelte-s5o22v li.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v,nav.svelte-s5o22v ul.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{list-style:none;margin:0;padding:0}nav.svelte-s5o22v>ul.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{display:flex;width:100%}nav.svelte-s5o22v>ul.svelte-s5o22v>li.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{flex:1}nav.svelte-s5o22v li a.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{display:block;padding:var(--padding-nav);text-transform:uppercase;font-size:var(--small-fontsize);transition:color var(--transition-speed)}nav.svelte-s5o22v li a.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v:hover{text-decoration:none}nav.svelte-s5o22v li.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v:before{content:"";display:none}nav.svelte-s5o22v>ul.svelte-s5o22v>li.svelte-s5o22v>a.svelte-s5o22v>span.svelte-s5o22v{display:inline-block;position:relative}nav.svelte-s5o22v>ul.svelte-s5o22v>li.svelte-s5o22v>a.svelte-s5o22v>span.svelte-s5o22v:after{height:2px;background-color:transparent;position:absolute;content:"";width:0;margin:0 50%;display:block;bottom:0;left:0;transition:margin .5s,width .5s,opacity .5s,color .5s,background-color .5s}nav.svelte-s5o22v>ul.svelte-s5o22v>li.svelte-s5o22v:hover>a.svelte-s5o22v>span.svelte-s5o22v:after,nav.svelte-s5o22v>ul.svelte-s5o22v>li.svelte-s5o22v>a.current.svelte-s5o22v>span.svelte-s5o22v:after{margin:0 -10%;width:120%;opacity:1;background-color:var(--color-one)}@media screen and (max-width:700px){.navigation-inner.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{width:100%;padding-top:10px;text-align:left}.nav-logo.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{display:inline-block;vertical-align:middle;margin-top:-5px}.nav-extra.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{width:auto;display:inline-block;float:right;vertical-align:top;margin-right:0;margin-top:-10px}.nav-extra.svelte-s5o22v .call.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v,.nav-extra.svelte-s5o22v .map.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v,.nav-extra.svelte-s5o22v .search.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{display:inline-block;vertical-align:middle;width:30px;height:auto}nav.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{display:grid;align-content:center;justify-content:center;place-content:center;height:calc(100vh - 40px);width:100vw!important;overflow:scroll;position:fixed;top:40px;left:0;text-align:center;background:var(--color-six);transition:all 1s}nav.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v:not(.open){margin-left:100vw!important;transition:all 0s}nav.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v:is(.open){margin-left:0!important;transition:all 1s}nav.svelte-s5o22v>ul.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{display:block}nav.svelte-s5o22v li a.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v.svelte-s5o22v{font-size:var(--large-fontsize)}}',
  map: `{"version":3,"file":"Block_Navigation.svelte","sources":["Block_Navigation.svelte"],"sourcesContent":["<div {id} class={blockclass}>\\n\\t<div class=\\"navigation-inner\\">\\n\\t\\t<div class=\\"nav-logo\\">\\n\\t\\t\\t<a href=\\"/\\" title=\\"home\\">\\n\\t\\t\\t\\t<svg\\n\\t\\t\\t\\t\\twidth=\\"100%\\"\\n\\t\\t\\t\\t\\theight=\\"100%\\"\\n\\t\\t\\t\\t\\tviewBox=\\"0 0 64 58\\"\\n\\t\\t\\t\\t\\tversion=\\"1.1\\"\\n\\t\\t\\t\\t\\txmlns=\\"http://www.w3.org/2000/svg\\"\\n\\t\\t\\t\\t\\txmlns:xlink=\\"http://www.w3.org/1999/xlink\\"\\n\\t\\t\\t\\t\\txml:space=\\"preserve\\"\\n\\t\\t\\t\\t\\txmlns:serif=\\"http://www.serif.com/\\"\\n\\t\\t\\t\\t\\tstyle=\\"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t<g\\n\\t\\t\\t\\t\\t\\tid=\\"Path_6526\\"\\n\\t\\t\\t\\t\\t\\ttransform=\\"matrix(1,0,0,1,-74.94,-72.328)\\"\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t<path\\n\\t\\t\\t\\t\\t\\t\\tfill=\\"currentColor\\"\\n\\t\\t\\t\\t\\t\\t\\td=\\"M124.252,72.328L91.458,72.328L91.458,72.7C89.277,72.912 88.048,73.068 87.358,73.755C86.782,74.395 86.57,75.437 86.515,77.169C86.505,77.529 86.499,77.911 86.499,78.34L86.499,80.084C86.426,82.069 86.462,84.365 86.462,85.655L86.4,93.53C91.481,89.564 94.641,88.51 97.43,88.51C101.645,88.51 103.13,91.237 103.13,95.824L103.13,107.846C103.13,112.494 103.376,113.176 107.963,113.484C108.024,113.484 108.086,113.859 108.024,113.859C106.724,113.672 103.068,113.484 101.333,113.484C99.302,113.462 97.272,113.588 95.259,113.859C95.136,113.859 95.259,113.484 95.321,113.484C98.729,113.177 99.472,112.744 99.472,107.846L99.472,98.546C99.472,92.908 98.047,90.551 94.703,90.551C92.72,90.551 91.11,91.111 86.403,94.024L86.403,107.843C86.403,112.429 86.959,113.173 90.49,113.481C90.553,113.481 90.677,113.856 90.553,113.856C88.641,113.624 86.717,113.498 84.791,113.481C82.452,113.464 80.115,113.59 77.791,113.856C77.666,113.856 77.791,113.481 77.791,113.481C82.254,113.049 82.747,112.863 82.747,107.843L82.8,76.732C82.864,75.677 82.578,74.63 81.986,73.754C81.296,73.068 80.065,72.911 77.886,72.642L77.886,72.328L74.789,72.288L74.94,115.653C74.94,123.535 81.426,130.022 89.308,130.023L122.133,130.023L122.133,129.715C124.312,129.504 125.542,129.346 126.233,128.659C126.806,128.021 127.02,126.978 127.074,125.248C127.084,124.886 127.09,124.502 127.09,124.075L127.09,122.332C127.162,120.347 127.128,118.052 127.128,116.761L127.19,108.884C122.109,112.851 118.947,113.904 116.159,113.904C111.944,113.904 110.459,111.177 110.459,106.59L110.459,94.563C110.459,89.915 110.214,89.233 105.627,88.924C105.565,88.924 105.503,88.551 105.565,88.551C106.865,88.736 110.523,88.924 112.26,88.924C114.29,88.946 116.32,88.821 118.332,88.551C118.457,88.551 118.332,88.924 118.27,88.924C114.863,89.234 114.12,89.666 114.12,94.563L114.12,103.863C114.12,109.501 115.544,111.857 118.889,111.857C120.874,111.857 122.489,111.299 127.194,108.387L127.194,94.563C127.194,89.977 126.636,89.233 123.104,88.924C123.042,88.924 122.917,88.551 123.042,88.551C124.955,88.782 126.879,88.906 128.805,88.924C131.144,88.941 133.481,88.817 135.805,88.551C135.929,88.551 135.805,88.924 135.805,88.924C131.343,89.357 130.849,89.544 130.849,94.563L130.79,125.679C130.727,126.733 131.014,127.779 131.605,128.654C132.297,129.341 133.526,129.498 135.705,129.765L135.705,130.017L138.618,130.017L138.618,86.696C138.618,78.815 132.133,72.329 124.252,72.328Z\\"\\n\\t\\t\\t\\t\\t\\t\\tstyle=\\"fill:white;fill-rule:nonzero;\\"\\n\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t</g>\\n\\t\\t\\t\\t</svg>\\n\\t\\t\\t</a>\\n\\t\\t</div>\\n\\t\\t<div class=\\"nav-extra\\">\\n\\t\\t\\t<a\\n\\t\\t\\t\\thref={$milk.site.google_maps}\\n\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\ttitle=\\"Directions\\"\\n\\t\\t\\t\\tclass=\\"map\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t<svg\\n\\t\\t\\t\\t\\taria-hidden=\\"true\\"\\n\\t\\t\\t\\t\\tfocusable=\\"false\\"\\n\\t\\t\\t\\t\\trole=\\"img\\"\\n\\t\\t\\t\\t\\txmlns=\\"http://www.w3.org/2000/svg\\"\\n\\t\\t\\t\\t\\tviewBox=\\"0 0 384 512\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t<path\\n\\t\\t\\t\\t\\t\\tfill=\\"currentColor\\"\\n\\t\\t\\t\\t\\t\\td=\\"M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t</svg>\\n\\t\\t\\t</a>\\n\\t\\t\\t<a\\n\\t\\t\\t\\thref={\`tel:+\${$milk.site.phone}\`}\\n\\t\\t\\t\\ton:click|preventDefault={() => {\\n\\t\\t\\t\\t\\tif (window?.callingCard?.show) {\\n\\t\\t\\t\\t\\t\\twindow?.callingCard?.show();\\n\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t}}\\n\\t\\t\\t\\ttitle=\\"Phone\\"\\n\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\tclass=\\"call\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t<svg\\n\\t\\t\\t\\t\\taria-hidden=\\"true\\"\\n\\t\\t\\t\\t\\tfocusable=\\"false\\"\\n\\t\\t\\t\\t\\trole=\\"img\\"\\n\\t\\t\\t\\t\\txmlns=\\"http://www.w3.org/2000/svg\\"\\n\\t\\t\\t\\t\\tviewBox=\\"0 0 320 512\\"\\n\\t\\t\\t\\t\\t><path\\n\\t\\t\\t\\t\\t\\tfill=\\"currentColor\\"\\n\\t\\t\\t\\t\\t\\td=\\"M272 0H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h224c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zM160 480c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm112-108c0 6.6-5.4 12-12 12H60c-6.6 0-12-5.4-12-12V60c0-6.6 5.4-12 12-12h200c6.6 0 12 5.4 12 12v312z\\"\\n\\t\\t\\t\\t\\t/></svg\\n\\t\\t\\t\\t>\\n\\t\\t\\t</a>\\n\\t\\t\\t<a\\n\\t\\t\\t\\thref=\\"/immigration-law-blog\\"\\n\\t\\t\\t\\ton:click|preventDefault={() => {\\n\\t\\t\\t\\t\\tif (window?.searchCard?.show) {\\n\\t\\t\\t\\t\\t\\twindow?.searchCard?.show();\\n\\t\\t\\t\\t\\t}\\n\\t\\t\\t\\t}}\\n\\t\\t\\t\\ttitle=\\"search\\"\\n\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\tclass=\\"search\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t<svg\\n\\t\\t\\t\\t\\taria-hidden=\\"true\\"\\n\\t\\t\\t\\t\\tfocusable=\\"false\\"\\n\\t\\t\\t\\t\\trole=\\"img\\"\\n\\t\\t\\t\\t\\txmlns=\\"http://www.w3.org/2000/svg\\"\\n\\t\\t\\t\\t\\tviewBox=\\"0 0 512 512\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t<path\\n\\t\\t\\t\\t\\t\\tfill=\\"currentColor\\"\\n\\t\\t\\t\\t\\t\\td=\\"M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t</svg>\\n\\t\\t\\t</a>\\n\\t\\t\\t<Hamburger size=\\"24px\\" padding=\\"6px\\" />\\n\\t\\t</div>\\n\\t\\t<nav>\\n\\t\\t\\t<ul>\\n\\t\\t\\t\\t<li>\\n\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\thref=\\"/immigration-attorneys\\"\\n\\t\\t\\t\\t\\t\\tclass:current={checkCurrent('/immigration-attorneys')}\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t<span>Attorneys</span>\\n\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t</li>\\n\\t\\t\\t\\t<li>\\n\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\thref=\\"/immigration-law-services\\"\\n\\t\\t\\t\\t\\t\\tclass:current={checkCurrent(\\n\\t\\t\\t\\t\\t\\t\\t'/immigration-law-services'\\n\\t\\t\\t\\t\\t\\t)}\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t<span>Services</span>\\n\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t</li>\\n\\t\\t\\t\\t<li>\\n\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\thref=\\"/client-testimonials\\"\\n\\t\\t\\t\\t\\t\\tclass:current={checkCurrent('/client-testimonials')}\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t<span>Testimonials</span>\\n\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t</li>\\n\\t\\t\\t\\t<li>\\n\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\thref=\\"/immigration-law-blog\\"\\n\\t\\t\\t\\t\\t\\tclass:current={checkIfBlog('/immigration-law-blog')}\\n\\t\\t\\t\\t\\t\\tclass=\\"blog-nav\\"\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t<span>Blog</span>\\n\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t</li>\\n\\t\\t\\t\\t<li>\\n\\t\\t\\t\\t\\t<a href=\\"/espanol\\" class:current={checkIfBlog('/espanol')}>\\n\\t\\t\\t\\t\\t\\t<span>Espa\xF1ol</span>\\n\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t</li>\\n\\t\\t\\t\\t<li>\\n\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\thref=\\"/immigration-resources\\"\\n\\t\\t\\t\\t\\t\\tclass:current={checkCurrent('/immigration-resources')}\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t<span>Resources</span>\\n\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t</li>\\n\\t\\t\\t</ul>\\n\\t\\t</nav>\\n\\t</div>\\n</div>\\n\\n<script>var _$milk, _$milk$site;\\n\\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount } from 'svelte';\\n/* ## MILK ## */\\n\\nimport { milk } from '$milk/milk.js';\\nimport { getAbsoluteUrl } from '$milk/util/helpers.js';\\n/* ## Components ## */\\n\\nimport Hamburger from '$milk/lib/Hamburger.svelte';\\n/* ## Vairables ## */\\n\\nvar id;\\nvar blockstyle = '';\\nvar blockclass = 'navigation';\\n\\n$: blockclass = \\"navigation \\" + blockstyle;\\n\\nvar espanol_url = \\"Shttps://translate.google.com/translate?sl=auto&tl=es&u=\\" + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.url);\\n\\nvar checkCurrent = url => {\\n  return false;\\n};\\n\\nvar checkIfBlog = url => {\\n  return false;\\n};\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  checkCurrent = url => {\\n    if (getAbsoluteUrl(url) == window.location.href.replace(location.hash, '')) {\\n      return true;\\n    } else {\\n      return false;\\n    }\\n  };\\n\\n  checkIfBlog = url => {\\n    if (window.location.href.startsWith(getAbsoluteUrl(url))) {\\n      return true;\\n    } else {\\n      return false;\\n    }\\n  };\\n\\n  espanol_url = \\"https://translate.google.com/translate?sl=auto&tl=es&u=\\" + getAbsoluteUrl('/');\\n}));\\n/* ## Exports ## */\\n\\nexport { id, blockstyle };</script>\\n\\n<style>.navigation{padding-bottom:10px;min-height:42px;z-index:999}.navigation-inner{margin:0 auto;max-width:1200px;max-width:var(--content-constrain,1200px);text-align:center;padding:0 var(--padding)}.navigation-inner svg{max-width:30px;max-height:30px}.navigation-inner a{color:var(--color-white)}.navigation-inner a:hover,.navigation-inner a:hover svg{color:var(--color-three)}.nav-extra{width:40px;height:30px;vertical-align:middle;line-height:25px;float:right;margin-right:calc(var(--padding) + 10px);text-align:center}.nav-extra svg{max-width:20px;max-height:20px}.nav-extra .call,.nav-extra .map,.nav-logo{display:none}nav{display:block;position:relative;text-align:left;padding:0 20px;width:calc(100% - 60px)}nav li,nav ul{list-style:none;margin:0;padding:0}nav>ul{display:flex;width:100%}nav>ul>li{flex:1}nav li a{display:block;padding:var(--padding-nav);text-transform:uppercase;font-size:var(--small-fontsize);transition:color var(--transition-speed)}nav li a:hover{text-decoration:none}nav li:before{content:\\"\\";display:none}nav>ul>li>a>span{display:inline-block;position:relative}nav>ul>li>a>span:after{height:2px;background-color:transparent;position:absolute;content:\\"\\";width:0;margin:0 50%;display:block;bottom:0;left:0;transition:margin .5s,width .5s,opacity .5s,color .5s,background-color .5s}nav>ul>li:hover>a>span:after,nav>ul>li>a.current>span:after{margin:0 -10%;width:120%;opacity:1;background-color:var(--color-one)}@media screen and (max-width:700px){.navigation-inner{width:100%;padding-top:10px;text-align:left}.nav-logo{display:inline-block;vertical-align:middle;margin-top:-5px}.nav-extra{width:auto;display:inline-block;float:right;vertical-align:top;margin-right:0;margin-top:-10px}.nav-extra .call,.nav-extra .map,.nav-extra .search{display:inline-block;vertical-align:middle;width:30px;height:auto}nav{display:grid;align-content:center;justify-content:center;place-content:center;height:calc(100vh - 40px);width:100vw!important;overflow:scroll;position:fixed;top:40px;left:0;text-align:center;background:var(--color-six);transition:all 1s}nav:not(.open){margin-left:100vw!important;transition:all 0s}nav:is(.open){margin-left:0!important;transition:all 1s}nav>ul{display:block}nav li a{font-size:var(--large-fontsize)}}</style>\\n"],"names":[],"mappings":"AAiNO,iFAAW,CAAC,eAAe,IAAI,CAAC,WAAW,IAAI,CAAC,QAAQ,GAAG,CAAC,uFAAiB,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,MAAM,CAAC,UAAU,IAAI,mBAAmB,CAAC,MAAM,CAAC,CAAC,WAAW,MAAM,CAAC,QAAQ,CAAC,CAAC,IAAI,SAAS,CAAC,CAAC,+BAAiB,CAAC,2DAAG,CAAC,UAAU,IAAI,CAAC,WAAW,IAAI,CAAC,+BAAiB,CAAC,yDAAC,CAAC,MAAM,IAAI,aAAa,CAAC,CAAC,+BAAiB,CAAC,yDAAC,MAAM,CAAC,+BAAiB,CAAC,CAAC,MAAM,CAAC,2DAAG,CAAC,MAAM,IAAI,aAAa,CAAC,CAAC,gFAAU,CAAC,MAAM,IAAI,CAAC,OAAO,IAAI,CAAC,eAAe,MAAM,CAAC,YAAY,IAAI,CAAC,MAAM,KAAK,CAAC,aAAa,KAAK,IAAI,SAAS,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,WAAW,MAAM,CAAC,wBAAU,CAAC,2DAAG,CAAC,UAAU,IAAI,CAAC,WAAW,IAAI,CAAC,wBAAU,CAAC,6DAAK,CAAC,wBAAU,CAAC,4DAAI,CAAC,+EAAS,CAAC,QAAQ,IAAI,CAAC,yEAAG,CAAC,QAAQ,KAAK,CAAC,SAAS,QAAQ,CAAC,WAAW,IAAI,CAAC,QAAQ,CAAC,CAAC,IAAI,CAAC,MAAM,KAAK,IAAI,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,iBAAG,CAAC,0DAAE,CAAC,iBAAG,CAAC,0DAAE,CAAC,WAAW,IAAI,CAAC,OAAO,CAAC,CAAC,QAAQ,CAAC,CAAC,iBAAG,CAAC,0DAAE,CAAC,QAAQ,IAAI,CAAC,MAAM,IAAI,CAAC,iBAAG,CAAC,gBAAE,CAAC,4CAAE,CAAC,KAAK,CAAC,CAAC,iBAAG,CAAC,EAAE,CAAC,yDAAC,CAAC,QAAQ,KAAK,CAAC,QAAQ,IAAI,aAAa,CAAC,CAAC,eAAe,SAAS,CAAC,UAAU,IAAI,gBAAgB,CAAC,CAAC,WAAW,KAAK,CAAC,IAAI,kBAAkB,CAAC,CAAC,iBAAG,CAAC,EAAE,CAAC,yDAAC,MAAM,CAAC,gBAAgB,IAAI,CAAC,iBAAG,CAAC,0DAAE,OAAO,CAAC,QAAQ,EAAE,CAAC,QAAQ,IAAI,CAAC,iBAAG,CAAC,gBAAE,CAAC,gBAAE,CAAC,eAAC,CAAC,kBAAI,CAAC,QAAQ,YAAY,CAAC,SAAS,QAAQ,CAAC,iBAAG,CAAC,gBAAE,CAAC,gBAAE,CAAC,eAAC,CAAC,kBAAI,MAAM,CAAC,OAAO,GAAG,CAAC,iBAAiB,WAAW,CAAC,SAAS,QAAQ,CAAC,QAAQ,EAAE,CAAC,MAAM,CAAC,CAAC,OAAO,CAAC,CAAC,GAAG,CAAC,QAAQ,KAAK,CAAC,OAAO,CAAC,CAAC,KAAK,CAAC,CAAC,WAAW,MAAM,CAAC,GAAG,CAAC,KAAK,CAAC,GAAG,CAAC,OAAO,CAAC,GAAG,CAAC,KAAK,CAAC,GAAG,CAAC,gBAAgB,CAAC,GAAG,CAAC,iBAAG,CAAC,gBAAE,CAAC,gBAAE,MAAM,CAAC,eAAC,CAAC,kBAAI,MAAM,CAAC,iBAAG,CAAC,gBAAE,CAAC,gBAAE,CAAC,CAAC,sBAAQ,CAAC,kBAAI,MAAM,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,MAAM,IAAI,CAAC,QAAQ,CAAC,CAAC,iBAAiB,IAAI,WAAW,CAAC,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,uFAAiB,CAAC,MAAM,IAAI,CAAC,YAAY,IAAI,CAAC,WAAW,IAAI,CAAC,+EAAS,CAAC,QAAQ,YAAY,CAAC,eAAe,MAAM,CAAC,WAAW,IAAI,CAAC,gFAAU,CAAC,MAAM,IAAI,CAAC,QAAQ,YAAY,CAAC,MAAM,KAAK,CAAC,eAAe,GAAG,CAAC,aAAa,CAAC,CAAC,WAAW,KAAK,CAAC,wBAAU,CAAC,6DAAK,CAAC,wBAAU,CAAC,4DAAI,CAAC,wBAAU,CAAC,+DAAO,CAAC,QAAQ,YAAY,CAAC,eAAe,MAAM,CAAC,MAAM,IAAI,CAAC,OAAO,IAAI,CAAC,yEAAG,CAAC,QAAQ,IAAI,CAAC,cAAc,MAAM,CAAC,gBAAgB,MAAM,CAAC,cAAc,MAAM,CAAC,OAAO,KAAK,KAAK,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,MAAM,KAAK,UAAU,CAAC,SAAS,MAAM,CAAC,SAAS,KAAK,CAAC,IAAI,IAAI,CAAC,KAAK,CAAC,CAAC,WAAW,MAAM,CAAC,WAAW,IAAI,WAAW,CAAC,CAAC,WAAW,GAAG,CAAC,EAAE,CAAC,yEAAG,KAAK,KAAK,CAAC,CAAC,YAAY,KAAK,UAAU,CAAC,WAAW,GAAG,CAAC,EAAE,CAAC,yEAAG,IAAI,KAAK,CAAC,CAAC,YAAY,CAAC,UAAU,CAAC,WAAW,GAAG,CAAC,EAAE,CAAC,iBAAG,CAAC,0DAAE,CAAC,QAAQ,KAAK,CAAC,iBAAG,CAAC,EAAE,CAAC,yDAAC,CAAC,UAAU,IAAI,gBAAgB,CAAC,CAAC,CAAC"}`
};
function asyncGeneratorStep$w(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$w(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$w(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$w(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Block_Navigation = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var _$milk, _$milk$site;
  var {id} = $$props;
  var {blockstyle = ""} = $$props;
  var blockclass = "navigation";
  "Shttps://translate.google.com/translate?sl=auto&tl=es&u=" + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.url);
  var checkCurrent = (url) => {
    return false;
  };
  var checkIfBlog = (url) => {
    return false;
  };
  onMount(/* @__PURE__ */ _asyncToGenerator$w(function* () {
    checkCurrent = (url) => {
      if (getAbsoluteUrl(url) == window.location.href.replace(location.hash, "")) {
        return true;
      } else {
        return false;
      }
    };
    checkIfBlog = (url) => {
      if (window.location.href.startsWith(getAbsoluteUrl(url))) {
        return true;
      } else {
        return false;
      }
    };
    "https://translate.google.com/translate?sl=auto&tl=es&u=" + getAbsoluteUrl("/");
  }));
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  $$result.css.add(css$H);
  blockclass = "navigation " + blockstyle;
  $$unsubscribe_milk();
  return `<div${add_attribute("id", id, 0)} class="${escape(null_to_empty(blockclass)) + " svelte-s5o22v"}"><div class="${"navigation-inner svelte-s5o22v"}"><div class="${"nav-logo svelte-s5o22v"}"><a href="${"/"}" title="${"home"}" class="${"svelte-s5o22v"}"><svg width="${"100%"}" height="${"100%"}" viewBox="${"0 0 64 58"}" version="${"1.1"}" xmlns="${"http://www.w3.org/2000/svg"}" xmlns:xlink="${"http://www.w3.org/1999/xlink"}" xml:space="${"preserve"}" xmlns:serif="${"http://www.serif.com/"}" style="${"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"}" class="${"svelte-s5o22v"}"><g id="${"Path_6526"}" transform="${"matrix(1,0,0,1,-74.94,-72.328)"}"><path fill="${"currentColor"}" d="${"M124.252,72.328L91.458,72.328L91.458,72.7C89.277,72.912 88.048,73.068 87.358,73.755C86.782,74.395 86.57,75.437 86.515,77.169C86.505,77.529 86.499,77.911 86.499,78.34L86.499,80.084C86.426,82.069 86.462,84.365 86.462,85.655L86.4,93.53C91.481,89.564 94.641,88.51 97.43,88.51C101.645,88.51 103.13,91.237 103.13,95.824L103.13,107.846C103.13,112.494 103.376,113.176 107.963,113.484C108.024,113.484 108.086,113.859 108.024,113.859C106.724,113.672 103.068,113.484 101.333,113.484C99.302,113.462 97.272,113.588 95.259,113.859C95.136,113.859 95.259,113.484 95.321,113.484C98.729,113.177 99.472,112.744 99.472,107.846L99.472,98.546C99.472,92.908 98.047,90.551 94.703,90.551C92.72,90.551 91.11,91.111 86.403,94.024L86.403,107.843C86.403,112.429 86.959,113.173 90.49,113.481C90.553,113.481 90.677,113.856 90.553,113.856C88.641,113.624 86.717,113.498 84.791,113.481C82.452,113.464 80.115,113.59 77.791,113.856C77.666,113.856 77.791,113.481 77.791,113.481C82.254,113.049 82.747,112.863 82.747,107.843L82.8,76.732C82.864,75.677 82.578,74.63 81.986,73.754C81.296,73.068 80.065,72.911 77.886,72.642L77.886,72.328L74.789,72.288L74.94,115.653C74.94,123.535 81.426,130.022 89.308,130.023L122.133,130.023L122.133,129.715C124.312,129.504 125.542,129.346 126.233,128.659C126.806,128.021 127.02,126.978 127.074,125.248C127.084,124.886 127.09,124.502 127.09,124.075L127.09,122.332C127.162,120.347 127.128,118.052 127.128,116.761L127.19,108.884C122.109,112.851 118.947,113.904 116.159,113.904C111.944,113.904 110.459,111.177 110.459,106.59L110.459,94.563C110.459,89.915 110.214,89.233 105.627,88.924C105.565,88.924 105.503,88.551 105.565,88.551C106.865,88.736 110.523,88.924 112.26,88.924C114.29,88.946 116.32,88.821 118.332,88.551C118.457,88.551 118.332,88.924 118.27,88.924C114.863,89.234 114.12,89.666 114.12,94.563L114.12,103.863C114.12,109.501 115.544,111.857 118.889,111.857C120.874,111.857 122.489,111.299 127.194,108.387L127.194,94.563C127.194,89.977 126.636,89.233 123.104,88.924C123.042,88.924 122.917,88.551 123.042,88.551C124.955,88.782 126.879,88.906 128.805,88.924C131.144,88.941 133.481,88.817 135.805,88.551C135.929,88.551 135.805,88.924 135.805,88.924C131.343,89.357 130.849,89.544 130.849,94.563L130.79,125.679C130.727,126.733 131.014,127.779 131.605,128.654C132.297,129.341 133.526,129.498 135.705,129.765L135.705,130.017L138.618,130.017L138.618,86.696C138.618,78.815 132.133,72.329 124.252,72.328Z"}" style="${"fill:white;fill-rule:nonzero;"}"></path></g></svg></a></div>
		<div class="${"nav-extra svelte-s5o22v"}"><a${add_attribute("href", $milk.site.google_maps, 0)} target="${"_blank"}" rel="${"noreferrer"}" title="${"Directions"}" class="${"map svelte-s5o22v"}"><svg aria-hidden="${"true"}" focusable="${"false"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 384 512"}" class="${"svelte-s5o22v"}"><path fill="${"currentColor"}" d="${"M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"}"></path></svg></a>
			<a${add_attribute("href", `tel:+${$milk.site.phone}`, 0)} title="${"Phone"}" rel="${"noreferrer"}" class="${"call svelte-s5o22v"}"><svg aria-hidden="${"true"}" focusable="${"false"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 320 512"}" class="${"svelte-s5o22v"}"><path fill="${"currentColor"}" d="${"M272 0H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h224c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zM160 480c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm112-108c0 6.6-5.4 12-12 12H60c-6.6 0-12-5.4-12-12V60c0-6.6 5.4-12 12-12h200c6.6 0 12 5.4 12 12v312z"}"></path></svg></a>
			<a href="${"/immigration-law-blog"}" title="${"search"}" rel="${"noreferrer"}" class="${"search svelte-s5o22v"}"><svg aria-hidden="${"true"}" focusable="${"false"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 512 512"}" class="${"svelte-s5o22v"}"><path fill="${"currentColor"}" d="${"M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"}"></path></svg></a>
			${validate_component(Hamburger, "Hamburger").$$render($$result, {size: "24px", padding: "6px"}, {}, {})}</div>
		<nav class="${"svelte-s5o22v"}"><ul class="${"svelte-s5o22v"}"><li class="${"svelte-s5o22v"}"><a href="${"/immigration-attorneys"}" class="${["svelte-s5o22v", checkCurrent("/immigration-attorneys") ? "current" : ""].join(" ").trim()}"><span class="${"svelte-s5o22v"}">Attorneys</span></a></li>
				<li class="${"svelte-s5o22v"}"><a href="${"/immigration-law-services"}" class="${[
    "svelte-s5o22v",
    checkCurrent("/immigration-law-services") ? "current" : ""
  ].join(" ").trim()}"><span class="${"svelte-s5o22v"}">Services</span></a></li>
				<li class="${"svelte-s5o22v"}"><a href="${"/client-testimonials"}" class="${["svelte-s5o22v", checkCurrent("/client-testimonials") ? "current" : ""].join(" ").trim()}"><span class="${"svelte-s5o22v"}">Testimonials</span></a></li>
				<li class="${"svelte-s5o22v"}"><a href="${"/immigration-law-blog"}" class="${[
    "blog-nav svelte-s5o22v",
    checkIfBlog("/immigration-law-blog") ? "current" : ""
  ].join(" ").trim()}"><span class="${"svelte-s5o22v"}">Blog</span></a></li>
				<li class="${"svelte-s5o22v"}"><a href="${"/espanol"}" class="${["svelte-s5o22v", checkIfBlog("/espanol") ? "current" : ""].join(" ").trim()}"><span class="${"svelte-s5o22v"}">Espa\xF1ol</span></a></li>
				<li class="${"svelte-s5o22v"}"><a href="${"/immigration-resources"}" class="${["svelte-s5o22v", checkCurrent("/immigration-resources") ? "current" : ""].join(" ").trim()}"><span class="${"svelte-s5o22v"}">Resources</span></a></li></ul></nav></div>
</div>`;
});
var ContactCard_svelte = ".label.svelte-7gtf33{font-weight:700}.type.svelte-7gtf33{display:block;position:absolute;margin-left:-9999vw}.adr.svelte-7gtf33{cursor:pointer;display:inline-block}.adr.svelte-7gtf33:hover{color:#f4ba38;color:var(--color-yellow-vibrant,#f4ba38)}.hide.svelte-7gtf33{display:block;position:absolute;margin-left:-9999vw}";
const css$G = {
  code: ".label.svelte-7gtf33{font-weight:700}.type.svelte-7gtf33{display:block;position:absolute;margin-left:-9999vw}.adr.svelte-7gtf33{cursor:pointer;display:inline-block}.adr.svelte-7gtf33:hover{color:#f4ba38;color:var(--color-yellow-vibrant,#f4ba38)}.hide.svelte-7gtf33{display:block;position:absolute;margin-left:-9999vw}",
  map: `{"version":3,"file":"ContactCard.svelte","sources":["ContactCard.svelte"],"sourcesContent":["<svelte:head>\\n\\t<link async rel=\\"profile\\" href=\\"http://microformats.org/profile/hcard\\" />\\n</svelte:head>\\n<!-- ###### !!!!!! WARNING !!!!!! ###### -->\\n<!-- Note: These specs depend on exact markup and classes and heiarchy.\\n\\tGetting multiple ones implimented at the same time takes a ton of very\\n\\tcareful testing with the validators.  If you don't know what you are doing,\\n\\tbest not to edit this component.\\n -->\\n<div\\n\\tclass=\\"vcard h-card\\"\\n\\tdata-impliments=\\"microformat, microdata, rdfa\\"\\n\\tdata-microformat=\\"hCard, vCard, oCard, h-card, h-addr, geo, h-geo\\"\\n\\tdata-microdata=\\"Person, Organization, PostalAddress, LocalBusiness, openingHours, Place, webFeed, Service\\"\\n\\tdata-rdfa=\\"Person, Organization, PostalAddress, LocalBusiness, openingHours, Place, webFeed, Service\\"\\n\\tvocab=\\"https://schema.org/\\"\\n\\titemscope\\n\\titemtype={item_type}\\n\\ttypeof={\`\${specific_type} Organization Person Service\`}\\n>\\n\\t<link itemprop=\\"additionalType\\" href=\\"https://schema.org/Organization\\" />\\n\\t<link itemprop=\\"additionalType\\" href=\\"https://schema.org/Person\\" />\\n\\t<link itemprop=\\"additionalType\\" href=\\"https://schema.org/Service\\" />\\n\\t<!-- ## MicroFormat ## -->\\n\\t<!-- Note: Do not change class names without checking the format spec RFC2426. -->\\n\\t<!-- Impliments the Following MicroFormats:\\n\\thCard/vCard: http://microformats.org/wiki/hcard\\n\\tgeo: http://microformats.org/wiki/geo\\n\\th-card: http://microformats.org/wiki/h-card\\n\\th-adr: http://microformats.org/wiki/h-adr\\n\\th-geo: http://microformats.org/wiki/h-geo -->\\n\\t<!-- Validate Using: https://pin13.net\\n\\tValidation Chrome Extension: https://chrome.google.com/webstore/detail/microformats/oalbifknmclbnmjlljdemhjjlkmppjjl\\n\\t-->\\n\\n\\t<!-- ## MicroData ## -->\\n\\t<!-- Note: Do not change attributes without checking the format spec on https://schema.org/. -->\\n\\t<!-- Impliments the Following MicroData:\\n\\tMicroData Person: https://schema.org/Person\\n\\tMicroData Organization: https://schema.org/Organization\\n\\tMicroData PostalAddress: https://schema.org/PostalAddress\\n\\tMicroData LocalBusiness: https://schema.org/LocalBusiness\\n\\tMicroData openingHours: https://schema.org/openingHours\\n\\tMicroData Place: https://schema.org/Place\\n\\tMicroData webFeed: https://schema.org/webFeed\\n\\tMicroData Service: https://schema.org/Service -->\\n\\t<!-- Validate Using: https://search.google.com/structured-data/testing-tool/u/0/\\n\\tValidation Chrome Extension: https://chrome.google.com/webstore/detail/structured-data-testing-t/kfdjeigpgagildmolfanniafmplnplpl\\n\\t-->\\n\\n\\t<!-- ## RDFa ## -->\\n\\t<!-- Note: Do not change attributes without checking the format spec on https://schema.org/. -->\\n\\t<!-- Impliments the Following RDFa:\\n\\tRDFa Person: https://schema.org/Person\\n\\tRDFa Organization: https://schema.org/Organization\\n\\tRDFa PostalAddress: https://schema.org/PostalAddress\\n\\tRDFa LocalBusiness: https://schema.org/LocalBusiness\\n\\tRDFa openingHours: https://schema.org/openingHours\\n\\tRDFa Place: https://schema.org/Place\\n\\tRDFa webFeed: https://schema.org/webFeed\\n\\tRDFa Service: https://schema.org/Service -->\\n\\t<!-- Validate Using: https://search.google.com/structured-data/testing-tool/u/0/\\n\\tValidation Chrome Extension: https://chrome.google.com/webstore/detail/structured-data-testing-t/kfdjeigpgagildmolfanniafmplnplpl\\n\\t-->\\n\\n\\t<!-- TODO: Microfotmat JSON header injections. -->\\n\\n\\t<!-- TODO: Facebook OpenGraph header injections. -->\\n\\t<!-- Validate Using: https://developers.facebook.com/tools/debug/\\n\\tValidation Chrome Extension: https://chrome.google.com/webstore/detail/open-graph-preview/ehaigphokkgebnmdiicabhjhddkaekgh/\\n\\tSocial Share Preview Extension: https://socialsharepreview.com/browser-extensions\\n\\t-->\\n\\n\\t<!-- TODO: TwitterGraph header injections. -->\\n\\n\\t<!-- TODO: JSON-LD header injections. -->\\n\\n\\t<!-- TODO: vCard auto generation w/ forced download client side. -->\\n\\n\\t<!-- Type Heiarachy > Organization > LocalBusiness > Specific Business Type  -->\\n\\n\\t{#if photo && photo != ''}\\n\\t\\t<div class=\\"picture\\">\\n\\t\\t\\t<div class=\\"photo\\">\\n\\t\\t\\t\\t<picture title={\`\${full_name}\`}>\\n\\t\\t\\t\\t\\t{#if photo_avif && photo_avif != ''}\\n\\t\\t\\t\\t\\t\\t<source type=\\"image/avif\\" srcset={photo_avif} />\\n\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t{#if photo_webp && photo_webp != ''}\\n\\t\\t\\t\\t\\t\\t<source type=\\"image/webp\\" srcset={photo_webp} />\\n\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\tclass=\\"photo u-photo\\"\\n\\t\\t\\t\\t\\t\\theight=\\"300\\"\\n\\t\\t\\t\\t\\t\\twidth=\\"300\\"\\n\\t\\t\\t\\t\\t\\tsrc={photo}\\n\\t\\t\\t\\t\\t\\talt={full_name}\\n\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\titemprop=\\"image\\"\\n\\t\\t\\t\\t\\t\\tproperty=\\"image\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t</picture>\\n\\t\\t\\t</div>\\n\\t\\t\\t{#if logo && logo != ''}\\n\\t\\t\\t\\t<div class=\\"logo\\">\\n\\t\\t\\t\\t\\t<picture title={\`\${organization}\`}>\\n\\t\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"logo u-logo image\\"\\n\\t\\t\\t\\t\\t\\t\\theight={logo_height}\\n\\t\\t\\t\\t\\t\\t\\twidth={logo_width}\\n\\t\\t\\t\\t\\t\\t\\tsrc={logo}\\n\\t\\t\\t\\t\\t\\t\\talt={organization}\\n\\t\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\t\\titemprop=\\"logo\\"\\n\\t\\t\\t\\t\\t\\t\\tproperty=\\"logo\\"\\n\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t</picture>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t{/if}\\n\\t\\t</div>\\n\\t{/if}\\n\\n\\t{#if type && type != 'organization'}\\n\\t\\t<div\\n\\t\\t\\tclass=\\"fn p-name\\"\\n\\t\\t\\ttitle=\\"Full Name\\"\\n\\t\\t\\titemprop=\\"name\\"\\n\\t\\t\\tproperty=\\"name\\"\\n\\t\\t>\\n\\t\\t\\t<div class=\\"n\\">\\n\\t\\t\\t\\t{#if prefix_name && prefix_name != ''}\\n\\t\\t\\t\\t\\t<span class=\\"honorific-prefix p-honorific-prefix\\">\\n\\t\\t\\t\\t\\t\\t{prefix_name}\\n\\t\\t\\t\\t\\t</span>\\n\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t{#if first_name && first_name != ''}\\n\\t\\t\\t\\t\\t<span class=\\"given-name p-given-name\\" title=\\"First Name\\">\\n\\t\\t\\t\\t\\t\\t{first_name}\\n\\t\\t\\t\\t\\t</span>\\n\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t{#if middle_name && middle_name != ''}\\n\\t\\t\\t\\t\\t<span class=\\"additional-name p-additional-name\\">\\n\\t\\t\\t\\t\\t\\t{middle_name}\\n\\t\\t\\t\\t\\t</span>\\n\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t{#if last_name && last_name != ''}\\n\\t\\t\\t\\t\\t<span class=\\"family-name p-family-name\\" title=\\"Last Name\\">\\n\\t\\t\\t\\t\\t\\t{last_name}\\n\\t\\t\\t\\t\\t</span>\\n\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t{#if suffix_name && suffix_name != ''}\\n\\t\\t\\t\\t\\t<span class=\\"honorific-suffix p-honorific-suffix\\">\\n\\t\\t\\t\\t\\t\\t{suffix_name}\\n\\t\\t\\t\\t\\t</span>\\n\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t{#if nick_name && nick_name != ''}\\n\\t\\t\\t\\t\\t(<span class=\\"nickname p-nickname\\" title=\\"Nickname\\">\\n\\t\\t\\t\\t\\t\\t{nick_name}\\n\\t\\t\\t\\t\\t</span>)\\n\\t\\t\\t\\t{/if}\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t\\t{#if organization && organization != ''}\\n\\t\\t\\t<div\\n\\t\\t\\t\\titemscope\\n\\t\\t\\t\\titemtype=\\"https://schema.org/Organization\\"\\n\\t\\t\\t\\tvocab=\\"https://schema.org/\\"\\n\\t\\t\\t\\ttypeof=\\"Organization\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\tclass=\\"org p-org p-organization-name\\"\\n\\t\\t\\t\\t\\ttitle=\\"Company/Organization\\"\\n\\t\\t\\t\\t\\titemprop=\\"name\\"\\n\\t\\t\\t\\t\\tproperty=\\"name\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{organization}\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t{:else}\\n\\t\\t<div\\n\\t\\t\\tclass=\\"fn n org p-name p-org p-organization-name\\"\\n\\t\\t\\ttitle=\\"Company/Organization\\"\\n\\t\\t\\titemprop=\\"name\\"\\n\\t\\t\\tproperty=\\"name\\"\\n\\t\\t>\\n\\t\\t\\t{organization}\\n\\t\\t</div>\\n\\t{/if}\\n\\n\\t{#if email_address && email_address != ''}\\n\\t\\t<div class=\\"emailaddress\\">\\n\\t\\t\\t<span class=\\"label\\">Email:</span>\\n\\t\\t\\t<a\\n\\t\\t\\t\\tclass=\\"email u-email\\"\\n\\t\\t\\t\\thref={\`mailto:\${email_address}\`}\\n\\t\\t\\t\\ttitle=\\"Email Address\\"\\n\\t\\t\\t\\titemprop=\\"email\\"\\n\\t\\t\\t\\tproperty=\\"email\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t<span class=\\"type p-label\\">Email</span>\\n\\t\\t\\t\\t<span class=\\"value\\">{email_address}</span>\\n\\t\\t\\t</a>\\n\\t\\t</div>\\n\\t{/if}\\n\\t{#if phone && phone != ''}\\n\\t\\t<div class=\\"telephone\\">\\n\\t\\t\\t<span class=\\"label\\">Telephone:</span>\\n\\t\\t\\t<a\\n\\t\\t\\t\\tclass=\\"tel p-tel\\"\\n\\t\\t\\t\\thref={\`tel:+\${phone}\`}\\n\\t\\t\\t\\ttitle=\\"Telephone\\"\\n\\t\\t\\t\\titemprop=\\"telephone\\"\\n\\t\\t\\t\\tproperty=\\"telephone\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t<span itemprop=\\"telephone\\" property=\\"telephone\\">{phone}</span>\\n\\t\\t\\t</a>\\n\\t\\t</div>\\n\\t{/if}\\n\\t{#if fax && fax != ''}\\n\\t\\t<div class=\\"facsimile\\">\\n\\t\\t\\t<span class=\\"label\\">Facsimile:</span>\\n\\t\\t\\t<a\\n\\t\\t\\t\\tclass=\\"fax tel p-tel\\"\\n\\t\\t\\t\\thref={\`tel:+\${fax}\`}\\n\\t\\t\\t\\ttitle=\\"Fax\\"\\n\\t\\t\\t\\titemprop=\\"faxNumber\\"\\n\\t\\t\\t\\tproperty=\\"faxNumber\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t<span itemprop=\\"faxNumber\\" property=\\"faxNumber\\">{fax}</span>\\n\\t\\t\\t</a>\\n\\t\\t</div>\\n\\t{/if}\\n\\n\\t<div\\n\\t\\tclass=\\"adr p-adr h-adr\\"\\n\\t\\ttitle=\\"Address\\"\\n\\t\\titemprop=\\"address\\"\\n\\t\\titemscope\\n\\t\\titemtype=\\"https://schema.org/PostalAddress\\"\\n\\t\\tvocab=\\"https://schema.org/\\"\\n\\t\\tproperty=\\"address\\"\\n\\t\\ttypeof=\\"PostalAddress\\"\\n\\t\\ton:click={openMap}\\n\\t>\\n\\t\\t<span class=\\"label\\">Address:</span>\\n\\t\\t{#if address && address != ''}\\n\\t\\t\\t<div\\n\\t\\t\\t\\tclass=\\"street-address p-street-address\\"\\n\\t\\t\\t\\ttitle=\\"Street Address\\"\\n\\t\\t\\t\\titemprop=\\"streetAddress\\"\\n\\t\\t\\t\\tproperty=\\"streetAddress\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t{address}\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t\\t<div>\\n\\t\\t\\t{#if city && city != ''}\\n\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\tclass=\\"locality p-locality\\"\\n\\t\\t\\t\\t\\ttitle=\\"City/Locality\\"\\n\\t\\t\\t\\t\\titemprop=\\"addressLocality\\"\\n\\t\\t\\t\\t\\tproperty=\\"addressLocality\\">{city}</span\\n\\t\\t\\t\\t>,\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if state_abbr && state_abbr != ''}\\n\\t\\t\\t\\t<span class=\\"state\\" title=\\"State/Region\\">\\n\\t\\t\\t\\t\\t<abbr\\n\\t\\t\\t\\t\\t\\tclass=\\"region p-region\\"\\n\\t\\t\\t\\t\\t\\ttitle={state}\\n\\t\\t\\t\\t\\t\\titemprop=\\"addressRegion\\"\\n\\t\\t\\t\\t\\t\\tproperty=\\"addressRegion\\">{state_abbr}</abbr\\n\\t\\t\\t\\t\\t>,\\n\\t\\t\\t\\t</span>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if zip && zip != ''}\\n\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\tclass=\\"postal-code p-postal-code\\"\\n\\t\\t\\t\\t\\ttitle=\\"Zipcode/Postal Code\\"\\n\\t\\t\\t\\t\\titemprop=\\"postalCode\\"\\n\\t\\t\\t\\t\\tproperty=\\"postalCode\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{zip}\\n\\t\\t\\t\\t</span>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if country_abbr && country_abbr != ''}\\n\\t\\t\\t\\t<span class=\\"country\\" title=\\"Country\\">\\n\\t\\t\\t\\t\\t<abbr\\n\\t\\t\\t\\t\\t\\tclass=\\"country-name p-country-name\\"\\n\\t\\t\\t\\t\\t\\ttitle={country}\\n\\t\\t\\t\\t\\t\\titemprop=\\"addressCountry\\"\\n\\t\\t\\t\\t\\t\\tproperty=\\"addressCountry\\"\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t{country_abbr}\\n\\t\\t\\t\\t\\t</abbr>\\n\\t\\t\\t\\t</span>\\n\\t\\t\\t{/if}\\n\\t\\t</div>\\n\\t</div>\\n\\n\\t<div\\n\\t\\titemprop=\\"location\\"\\n\\t\\titemscope\\n\\t\\tvocab=\\"https://schema.org/\\"\\n\\t\\titemtype=\\"https://schema.org/Place\\"\\n\\t\\tproperty=\\"location\\"\\n\\t\\ttypeof=\\"Place\\"\\n\\t\\tclass=\\"hide\\"\\n\\t>\\n\\t\\t<div itemprop=\\"name\\" property=\\"name\\" class=\\"hide\\">{full_name}</div>\\n\\t\\t<div\\n\\t\\t\\titemprop=\\"address\\"\\n\\t\\t\\titemscope\\n\\t\\t\\titemtype=\\"https://schema.org/PostalAddress\\"\\n\\t\\t\\tvocab=\\"https://schema.org/\\"\\n\\t\\t\\tproperty=\\"address\\"\\n\\t\\t\\ttypeof=\\"PostalAddress\\"\\n\\t\\t>\\n\\t\\t\\t<span class=\\"label\\">Address:</span>\\n\\t\\t\\t{#if address && address != ''}\\n\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\tclass=\\"street-address p-street-address\\"\\n\\t\\t\\t\\t\\ttitle=\\"Street Address\\"\\n\\t\\t\\t\\t\\titemprop=\\"streetAddress\\"\\n\\t\\t\\t\\t\\tproperty=\\"streetAddress\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{address}\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t{/if}\\n\\t\\t\\t<div>\\n\\t\\t\\t\\t{#if city && city != ''}\\n\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\tclass=\\"locality p-locality\\"\\n\\t\\t\\t\\t\\t\\ttitle=\\"City/Locality\\"\\n\\t\\t\\t\\t\\t\\titemprop=\\"addressLocality\\"\\n\\t\\t\\t\\t\\t\\tproperty=\\"addressLocality\\"\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t{city}\\n\\t\\t\\t\\t\\t</span>,\\n\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t{#if state_abbr && state_abbr != ''}\\n\\t\\t\\t\\t\\t<span class=\\"state\\" title=\\"State/Region\\">\\n\\t\\t\\t\\t\\t\\t<abbr\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"region p-region\\"\\n\\t\\t\\t\\t\\t\\t\\ttitle={state}\\n\\t\\t\\t\\t\\t\\t\\titemprop=\\"addressRegion\\"\\n\\t\\t\\t\\t\\t\\t\\tproperty=\\"addressRegion\\"\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t{state_abbr}\\n\\t\\t\\t\\t\\t\\t</abbr>,\\n\\t\\t\\t\\t\\t</span>\\n\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t{#if zip && zip != ''}\\n\\t\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\t\\tclass=\\"postal-code p-postal-code\\"\\n\\t\\t\\t\\t\\t\\ttitle=\\"Zipcode/Postal Code\\"\\n\\t\\t\\t\\t\\t\\titemprop=\\"postalCode\\"\\n\\t\\t\\t\\t\\t\\tproperty=\\"postalCode\\"\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t{zip}\\n\\t\\t\\t\\t\\t</span>\\n\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t{#if country_abbr && country_abbr != ''}\\n\\t\\t\\t\\t\\t<span class=\\"country\\" title=\\"Country\\">\\n\\t\\t\\t\\t\\t\\t<abbr\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"country-name p-country-name\\"\\n\\t\\t\\t\\t\\t\\t\\ttitle={country}\\n\\t\\t\\t\\t\\t\\t\\titemprop=\\"addressCountry\\"\\n\\t\\t\\t\\t\\t\\t\\tproperty=\\"addressCountry\\"\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t{country_abbr}\\n\\t\\t\\t\\t\\t\\t</abbr>\\n\\t\\t\\t\\t\\t</span>\\n\\t\\t\\t\\t{/if}\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t</div>\\n\\n\\t{#if website && website != ''}\\n\\t\\t<div class=\\"website\\" title=\\"Website\\">\\n\\t\\t\\t<span class=\\"label\\">Website:</span>\\n\\t\\t\\t<a\\n\\t\\t\\t\\tclass=\\"url u-url\\"\\n\\t\\t\\t\\ttarget=\\"website\\"\\n\\t\\t\\t\\thref={website}\\n\\t\\t\\t\\ttitle={\`Website for \${full_name}\`}\\n\\t\\t\\t\\titemprop=\\"url\\"\\n\\t\\t\\t\\tproperty=\\"url\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t{website}\\n\\t\\t\\t</a>\\n\\t\\t</div>\\n\\t{/if}\\n\\n\\t{#if type && type == 'organization'}\\n\\t\\t{#if hours_of_operation && hours_of_operation != ''}\\n\\t\\t\\t<div class=\\"hours-of-operation note p-note\\">\\n\\t\\t\\t\\t<span class=\\"label\\">Hours of Operation:</span>\\n\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\tclass=\\"hours\\"\\n\\t\\t\\t\\t\\ttitle=\\"Hours of Operation\\"\\n\\t\\t\\t\\t\\titemprop=\\"openingHours\\"\\n\\t\\t\\t\\t\\tproperty=\\"openingHours\\"\\n\\t\\t\\t\\t\\tcontent={hours_of_operation_dt}\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{hours_of_operation}\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t\\t{#if price_range && price_range != ''}\\n\\t\\t\\t<div class=\\"price note p-note\\">\\n\\t\\t\\t\\t<span class=\\"label\\">Price Range:</span>\\n\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\tclass=\\"price-range\\"\\n\\t\\t\\t\\t\\ttitle=\\"Price Range\\"\\n\\t\\t\\t\\t\\titemprop=\\"priceRange\\"\\n\\t\\t\\t\\t\\tproperty=\\"priceRange\\"\\n\\t\\t\\t\\t\\tcontent={price_range}\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{price_range}\\n\\t\\t\\t\\t</span>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t{/if}\\n\\t{#if category && category != ''}\\n\\t\\t<div class=\\"categories\\">\\n\\t\\t\\t<span class=\\"label\\">Categories:</span>\\n\\t\\t\\t<div class=\\"category p-category\\" title=\\"Categories\\">\\n\\t\\t\\t\\t{category}\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t{/if}\\n\\t{#if notes && notes != ''}\\n\\t\\t<div class=\\"notes\\">\\n\\t\\t\\t<span class=\\"label\\">Notes:</span>\\n\\t\\t\\t<div class=\\"note p-note\\">{notes}</div>\\n\\t\\t</div>\\n\\t{/if}\\n\\t{#if type && type != 'organization'}\\n\\t\\t{#if birthday && birthday != ''}\\n\\t\\t\\t<div class=\\"birthday\\">\\n\\t\\t\\t\\t<span class=\\"label\\">Birthday:</span>\\n\\t\\t\\t\\t<time\\n\\t\\t\\t\\t\\tclass=\\"bday dt-bday\\"\\n\\t\\t\\t\\t\\ttitle=\\"Birthday\\"\\n\\t\\t\\t\\t\\titemprop=\\"birthDate\\"\\n\\t\\t\\t\\t\\tproperty=\\"birthDate\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{birthday}\\n\\t\\t\\t\\t</time>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t{/if}\\n\\n\\t<div class=\\"location\\" title=\\"Location\\">\\n\\t\\t{#if google_maps && google_maps != ''}\\n\\t\\t\\t<div class=\\"directions\\" title=\\"Directions\\">\\n\\t\\t\\t\\t<span class=\\"label\\">Directions:</span>\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\tclass=\\"url u-url\\"\\n\\t\\t\\t\\t\\ttarget=\\"google_maps\\"\\n\\t\\t\\t\\t\\thref={google_maps}\\n\\t\\t\\t\\t\\ttitle={\`Directions to \${full_name}}\`}\\n\\t\\t\\t\\t\\trel=\\"url\\"\\n\\t\\t\\t\\t\\titemprop=\\"hasMap\\"\\n\\t\\t\\t\\t\\tproperty=\\"hasMap\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{google_maps}\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t\\t<div class=\\"geo h-geo\\">\\n\\t\\t\\t{#if latitude && latitude != ''}\\n\\t\\t\\t\\t<span class=\\"label\\">Geolocation:</span>\\n\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\tclass=\\"latitude p-latitude\\"\\n\\t\\t\\t\\t\\titemprop=\\"latitude\\"\\n\\t\\t\\t\\t\\tproperty=\\"latitude\\">{latitude}</span\\n\\t\\t\\t\\t>,\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if longitude && longitude != ''}\\n\\t\\t\\t\\t<span\\n\\t\\t\\t\\t\\tclass=\\"longitude p-logitude\\"\\n\\t\\t\\t\\t\\titemprop=\\"longitude\\"\\n\\t\\t\\t\\t\\tproperty=\\"longitude\\">{longitude}</span\\n\\t\\t\\t\\t>\\n\\t\\t\\t{/if}\\n\\t\\t</div>\\n\\t</div>\\n\\n\\t<div class=\\"social-media\\">\\n\\t\\t{#if google_business && google_business != ''}\\n\\t\\t\\t<div class=\\"google_business\\" title=\\"Google Business Profile\\">\\n\\t\\t\\t\\t<span class=\\"label\\">Business Profile:</span>\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\tclass=\\"url u-url\\"\\n\\t\\t\\t\\t\\ttarget=\\"google_business\\"\\n\\t\\t\\t\\t\\thref={google_business}\\n\\t\\t\\t\\t\\ttitle=\\"Business Profile\\"\\n\\t\\t\\t\\t\\trel=\\"url\\"\\n\\t\\t\\t\\t\\titemprop=\\"url\\"\\n\\t\\t\\t\\t\\tproperty=\\"url\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{google_business}\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t\\t{#if facebook && facebook != ''}\\n\\t\\t\\t<div class=\\"facebook\\" title=\\"Facebook\\">\\n\\t\\t\\t\\t<span class=\\"label\\">Facebook:</span>\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\tclass=\\"url u-url\\"\\n\\t\\t\\t\\t\\ttarget=\\"facebook\\"\\n\\t\\t\\t\\t\\thref={facebook}\\n\\t\\t\\t\\t\\ttitle=\\"Facebook\\"\\n\\t\\t\\t\\t\\trel=\\"url\\"\\n\\t\\t\\t\\t\\titemprop=\\"url\\"\\n\\t\\t\\t\\t\\tproperty=\\"url\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{facebook}\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t\\t{#if twitter && twitter != ''}\\n\\t\\t\\t<div class=\\"twitter\\" title=\\"Twitter\\">\\n\\t\\t\\t\\t<span class=\\"label\\">Twitter:</span>\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\tclass=\\"url u-url\\"\\n\\t\\t\\t\\t\\ttarget=\\"twitte\\"\\n\\t\\t\\t\\t\\thref={twitter}\\n\\t\\t\\t\\t\\ttitle=\\"Twitter\\"\\n\\t\\t\\t\\t\\trel=\\"url\\"\\n\\t\\t\\t\\t\\titemprop=\\"url\\"\\n\\t\\t\\t\\t\\tproperty=\\"url\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{twitter}\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t\\t{#if instagram && instagram != ''}\\n\\t\\t\\t<div class=\\"instagram\\" title=\\"Instagram\\">\\n\\t\\t\\t\\t<span class=\\"label\\">Instagram:</span>\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\tclass=\\"url u-url\\"\\n\\t\\t\\t\\t\\ttarget=\\"instagram\\"\\n\\t\\t\\t\\t\\thref={instagram}\\n\\t\\t\\t\\t\\ttitle=\\"Instagram\\"\\n\\t\\t\\t\\t\\trel=\\"url\\"\\n\\t\\t\\t\\t\\titemprop=\\"url\\"\\n\\t\\t\\t\\t\\tproperty=\\"url\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{instagram}\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t\\t{#if linkedin && linkedin != ''}\\n\\t\\t\\t<div class=\\"linkedin\\" title=\\"LinkedIn\\">\\n\\t\\t\\t\\t<span class=\\"label\\">LinkedIn:</span>\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\tclass=\\"url u-url\\"\\n\\t\\t\\t\\t\\ttarget=\\"linkedin\\"\\n\\t\\t\\t\\t\\thref={linkedin}\\n\\t\\t\\t\\t\\ttitle=\\"LinkedIn\\"\\n\\t\\t\\t\\t\\trel=\\"url\\"\\n\\t\\t\\t\\t\\titemprop=\\"url\\"\\n\\t\\t\\t\\t\\tproperty=\\"url\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{linkedin}\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t\\t{#if youtube && youtube != ''}\\n\\t\\t\\t<div class=\\"youtube\\" title=\\"YouTube\\">\\n\\t\\t\\t\\t<span class=\\"label\\">YouTube:</span>\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\tclass=\\"url u-url\\"\\n\\t\\t\\t\\t\\ttarget=\\"youtube\\"\\n\\t\\t\\t\\t\\thref={youtube}\\n\\t\\t\\t\\t\\ttitle=\\"YouTube\\"\\n\\t\\t\\t\\t\\trel=\\"url\\"\\n\\t\\t\\t\\t\\titemprop=\\"url\\"\\n\\t\\t\\t\\t\\tproperty=\\"url\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{youtube}\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t\\t{#if vimeo && vimeo != ''}\\n\\t\\t\\t<div class=\\"youtube\\" title=\\"Vimeo\\">\\n\\t\\t\\t\\t<span class=\\"label\\">Vimeo:</span>\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\tclass=\\"url u-url\\"\\n\\t\\t\\t\\t\\ttarget=\\"vimeo\\"\\n\\t\\t\\t\\t\\thref={vimeo}\\n\\t\\t\\t\\t\\ttitle=\\"Vimeo\\"\\n\\t\\t\\t\\t\\trel=\\"url\\"\\n\\t\\t\\t\\t\\titemprop=\\"url\\"\\n\\t\\t\\t\\t\\tproperty=\\"url\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{vimeo}\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t\\t{#if rss && rss != ''}\\n\\t\\t\\t<div class=\\"rss\\" title=\\"RSS\\">\\n\\t\\t\\t\\t<span class=\\"label\\">RSS:</span>\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\tclass=\\"url u-url\\"\\n\\t\\t\\t\\t\\ttarget=\\"rss\\"\\n\\t\\t\\t\\t\\thref={rss}\\n\\t\\t\\t\\t\\ttitle=\\"RSS\\"\\n\\t\\t\\t\\t\\trel=\\"url\\"\\n\\t\\t\\t\\t\\titemprop=\\"url\\"\\n\\t\\t\\t\\t\\tproperty=\\"url\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{rss}\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t\\t{#if blog && blog != ''}\\n\\t\\t\\t<div class=\\"blog\\" title=\\"Blog\\">\\n\\t\\t\\t\\t<span class=\\"label\\">Blog:</span>\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\tclass=\\"url u-url\\"\\n\\t\\t\\t\\t\\ttarget=\\"blog\\"\\n\\t\\t\\t\\t\\thref={blog}\\n\\t\\t\\t\\t\\ttitle=\\"Blog\\"\\n\\t\\t\\t\\t\\trel=\\"url\\"\\n\\t\\t\\t\\t\\titemprop=\\"url\\"\\n\\t\\t\\t\\t\\tproperty=\\"url\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{blog}\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t\\t{#if etsy && etsy != ''}\\n\\t\\t\\t<div class=\\"etsy\\" title=\\"Etsy\\">\\n\\t\\t\\t\\t<span class=\\"label\\">Etsy:</span>\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\tclass=\\"url u-url\\"\\n\\t\\t\\t\\t\\ttarget=\\"etsy\\"\\n\\t\\t\\t\\t\\thref={etsy}\\n\\t\\t\\t\\t\\ttitle=\\"Etsy\\"\\n\\t\\t\\t\\t\\trel=\\"url\\"\\n\\t\\t\\t\\t\\titemprop=\\"url\\"\\n\\t\\t\\t\\t\\tproperty=\\"url\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{etsy}\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t\\t{#if yelp && yelp != ''}\\n\\t\\t\\t<div class=\\"yelp\\" title=\\"Yelp!\\">\\n\\t\\t\\t\\t<span class=\\"label\\">Yelp!:</span>\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\tclass=\\"url u-url\\"\\n\\t\\t\\t\\t\\ttarget=\\"yelp\\"\\n\\t\\t\\t\\t\\thref={yelp}\\n\\t\\t\\t\\t\\ttitle=\\"Yelp!\\"\\n\\t\\t\\t\\t\\trel=\\"url\\"\\n\\t\\t\\t\\t\\titemprop=\\"url\\"\\n\\t\\t\\t\\t\\tproperty=\\"url\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{yelp}\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t\\t{#if airbnb && airbnb != ''}\\n\\t\\t\\t<div class=\\"airbnb\\" title=\\"AirBnB\\">\\n\\t\\t\\t\\t<span class=\\"label\\">AirBnB:</span>\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\tclass=\\"url u-url\\"\\n\\t\\t\\t\\t\\ttarget=\\"airbnb\\"\\n\\t\\t\\t\\t\\thref={airbnb}\\n\\t\\t\\t\\t\\ttitle=\\"AirBnB\\"\\n\\t\\t\\t\\t\\trel=\\"url\\"\\n\\t\\t\\t\\t\\titemprop=\\"url\\"\\n\\t\\t\\t\\t\\tproperty=\\"url\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{airbnb}\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t\\t{#if tiktok && tiktok != ''}\\n\\t\\t\\t<div class=\\"tiktok\\" title=\\"TikTok\\">\\n\\t\\t\\t\\t<span class=\\"label\\">TikTok:</span>\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\tclass=\\"url u-url\\"\\n\\t\\t\\t\\t\\ttarget=\\"tiktok\\"\\n\\t\\t\\t\\t\\thref={tiktok}\\n\\t\\t\\t\\t\\ttitle=\\"TikTok\\"\\n\\t\\t\\t\\t\\trel=\\"url\\"\\n\\t\\t\\t\\t\\titemprop=\\"url\\"\\n\\t\\t\\t\\t\\tproperty=\\"url\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{tiktok}\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t\\t{#if snapchat && snapchat != ''}\\n\\t\\t\\t<div class=\\"snapchat\\" title=\\"SnapChat\\">\\n\\t\\t\\t\\t<span class=\\"label\\">SnapChat:</span>\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\tclass=\\"url u-url\\"\\n\\t\\t\\t\\t\\ttarget=\\"snapchat\\"\\n\\t\\t\\t\\t\\thref={snapchat}\\n\\t\\t\\t\\t\\ttitle=\\"SnapChat\\"\\n\\t\\t\\t\\t\\trel=\\"url\\"\\n\\t\\t\\t\\t\\titemprop=\\"url\\"\\n\\t\\t\\t\\t\\tproperty=\\"url\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{snapchat}\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t\\t{#if pinterest && pinterest != ''}\\n\\t\\t\\t<div class=\\"pinterest\\" title=\\"Pinterest\\">\\n\\t\\t\\t\\t<span class=\\"label\\">Pinterest:</span>\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\tclass=\\"url u-url\\"\\n\\t\\t\\t\\t\\ttarget=\\"pinterest\\"\\n\\t\\t\\t\\t\\thref={pinterest}\\n\\t\\t\\t\\t\\ttitle=\\"Pinterest\\"\\n\\t\\t\\t\\t\\trel=\\"url\\"\\n\\t\\t\\t\\t\\titemprop=\\"url\\"\\n\\t\\t\\t\\t\\tproperty=\\"url\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{pinterest}\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t</div>\\n\\n\\t{#if vcf_file && vcf_file != ''}\\n\\t\\t<div class=\\"vcf-file\\" title=\\"vCard File\\">\\n\\t\\t\\t<span class=\\"label\\">vCard File:</span>\\n\\t\\t\\t<a\\n\\t\\t\\t\\tclass=\\"url u-url\\"\\n\\t\\t\\t\\ttarget=\\"vcf_file\\"\\n\\t\\t\\t\\thref={vcf_file}\\n\\t\\t\\t\\ttitle=\\"vCard File\\"\\n\\t\\t\\t\\trel=\\"url\\"\\n\\t\\t\\t\\titemprop=\\"url\\"\\n\\t\\t\\t\\tproperty=\\"url\\"\\n\\t\\t\\t\\tencodingFormat=\\"Text\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t{vcf_file}\\n\\t\\t\\t</a>\\n\\t\\t</div>\\n\\t{/if}\\n</div>\\n\\n<!-- Note: These specs depend on exact markup and classes and heiarchy.  Getting multiple ones implimented at the same time takes a ton of very careful testing with the validators.  If you don't know what youa re doing, best not to edit this component. -->\\n<script>var type = 'person';\\nvar specific_type = 'Person';\\nvar item_type = 'https://schema.org/Person';\\nvar type_of = 'Person';\\n/* ## Person or Organization ## */\\n\\nvar photo;\\nvar photo_avif;\\nvar photo_webp;\\nvar photo_type = 'image';\\nvar organization;\\nvar website;\\nvar email_address;\\nvar phone;\\nvar fax;\\nvar address;\\nvar city;\\nvar state;\\nvar state_abbr;\\nvar zip;\\nvar country;\\nvar country_abbr;\\nvar category;\\nvar notes;\\nvar latitude;\\nvar longitude;\\nvar google_maps;\\nvar google_business;\\nvar facebook;\\nvar facebook_image;\\nvar twitter;\\nvar twitter_image;\\nvar instagram;\\nvar linkedin;\\nvar youtube;\\nvar vimeo;\\nvar rss;\\nvar blog;\\nvar etsy;\\nvar yelp;\\nvar airbnb;\\nvar tiktok;\\nvar snapchat;\\nvar pinterest;\\nvar vcf_file;\\n/* ## Person ## */\\n\\nvar full_name;\\nvar first_name;\\nvar last_name;\\nvar middle_name;\\nvar prefix_name;\\nvar suffix_name;\\nvar nick_name;\\nvar birthday;\\n/* ## Organization ## */\\n\\nvar hours_of_operation;\\nvar hours_of_operation_dt;\\nvar price_range;\\nvar logo;\\nvar logo_height = '';\\nvar logo_width = '';\\n\\n$: type = type && type != 'organization' ? 'person' : 'organization';\\n\\n$: specific_type = type && specific_type && type != 'organization' ? 'Person' : specific_type != '' ? \\"\\" + specific_type : 'Organization';\\n\\n$: item_type = type && type != 'organization' ? 'https://schema.org/Person' : \\"https://schema.org/\\" + specific_type;\\n\\n$: type_of = type && type != 'organization' ? 'Person' : 'Organization';\\n\\n$: photo_type = type && type != 'organization' ? 'image' : 'logo';\\n\\n$: full_name = type && type != 'organization' && (organization || last_name) ? first_name + \\" \\" + last_name : \\"\\" + organization;\\n\\nvar openMap = () => {\\n  if (google_maps && google_maps != '') {\\n    var win = window.open(google_maps, 'google_maps');\\n    win.focus();\\n  }\\n};\\n\\nexport { type, specific_type, photo, photo_avif, photo_webp, first_name, last_name, middle_name, prefix_name, suffix_name, nick_name, organization, logo, logo_height, logo_width, website, email_address, phone, fax, address, city, state, state_abbr, zip, country, country_abbr, birthday, category, notes, hours_of_operation, hours_of_operation_dt, price_range, latitude, longitude, google_maps, google_business, facebook, facebook_image, twitter, twitter_image, instagram, etsy, linkedin, youtube, vimeo, rss, yelp, airbnb, tiktok, snapchat, pinterest, blog, vcf_file };</script>\\n\\n<style>.label{font-weight:700}.type{display:block;position:absolute;margin-left:-9999vw}.adr{cursor:pointer;display:inline-block}.adr:hover{color:#f4ba38;color:var(--color-yellow-vibrant,#f4ba38)}.hide{display:block;position:absolute;margin-left:-9999vw}</style>\\n"],"names":[],"mappings":"AAs0BO,oBAAM,CAAC,YAAY,GAAG,CAAC,mBAAK,CAAC,QAAQ,KAAK,CAAC,SAAS,QAAQ,CAAC,YAAY,OAAO,CAAC,kBAAI,CAAC,OAAO,OAAO,CAAC,QAAQ,YAAY,CAAC,kBAAI,MAAM,CAAC,MAAM,OAAO,CAAC,MAAM,IAAI,sBAAsB,CAAC,OAAO,CAAC,CAAC,mBAAK,CAAC,QAAQ,KAAK,CAAC,SAAS,QAAQ,CAAC,YAAY,OAAO,CAAC"}`
};
const ContactCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var {type = "person"} = $$props;
  var {specific_type = "Person"} = $$props;
  var item_type = "https://schema.org/Person";
  var {photo} = $$props;
  var {photo_avif} = $$props;
  var {photo_webp} = $$props;
  var {organization} = $$props;
  var {website} = $$props;
  var {email_address} = $$props;
  var {phone} = $$props;
  var {fax} = $$props;
  var {address} = $$props;
  var {city} = $$props;
  var {state} = $$props;
  var {state_abbr} = $$props;
  var {zip} = $$props;
  var {country} = $$props;
  var {country_abbr} = $$props;
  var {category} = $$props;
  var {notes} = $$props;
  var {latitude} = $$props;
  var {longitude} = $$props;
  var {google_maps} = $$props;
  var {google_business} = $$props;
  var {facebook} = $$props;
  var {facebook_image} = $$props;
  var {twitter} = $$props;
  var {twitter_image} = $$props;
  var {instagram} = $$props;
  var {linkedin} = $$props;
  var {youtube} = $$props;
  var {vimeo} = $$props;
  var {rss} = $$props;
  var {blog: blog2} = $$props;
  var {etsy} = $$props;
  var {yelp} = $$props;
  var {airbnb} = $$props;
  var {tiktok} = $$props;
  var {snapchat} = $$props;
  var {pinterest} = $$props;
  var {vcf_file} = $$props;
  var full_name;
  var {first_name} = $$props;
  var {last_name} = $$props;
  var {middle_name} = $$props;
  var {prefix_name} = $$props;
  var {suffix_name} = $$props;
  var {nick_name} = $$props;
  var {birthday} = $$props;
  var {hours_of_operation} = $$props;
  var {hours_of_operation_dt} = $$props;
  var {price_range} = $$props;
  var {logo} = $$props;
  var {logo_height = ""} = $$props;
  var {logo_width = ""} = $$props;
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.specific_type === void 0 && $$bindings.specific_type && specific_type !== void 0)
    $$bindings.specific_type(specific_type);
  if ($$props.photo === void 0 && $$bindings.photo && photo !== void 0)
    $$bindings.photo(photo);
  if ($$props.photo_avif === void 0 && $$bindings.photo_avif && photo_avif !== void 0)
    $$bindings.photo_avif(photo_avif);
  if ($$props.photo_webp === void 0 && $$bindings.photo_webp && photo_webp !== void 0)
    $$bindings.photo_webp(photo_webp);
  if ($$props.organization === void 0 && $$bindings.organization && organization !== void 0)
    $$bindings.organization(organization);
  if ($$props.website === void 0 && $$bindings.website && website !== void 0)
    $$bindings.website(website);
  if ($$props.email_address === void 0 && $$bindings.email_address && email_address !== void 0)
    $$bindings.email_address(email_address);
  if ($$props.phone === void 0 && $$bindings.phone && phone !== void 0)
    $$bindings.phone(phone);
  if ($$props.fax === void 0 && $$bindings.fax && fax !== void 0)
    $$bindings.fax(fax);
  if ($$props.address === void 0 && $$bindings.address && address !== void 0)
    $$bindings.address(address);
  if ($$props.city === void 0 && $$bindings.city && city !== void 0)
    $$bindings.city(city);
  if ($$props.state === void 0 && $$bindings.state && state !== void 0)
    $$bindings.state(state);
  if ($$props.state_abbr === void 0 && $$bindings.state_abbr && state_abbr !== void 0)
    $$bindings.state_abbr(state_abbr);
  if ($$props.zip === void 0 && $$bindings.zip && zip !== void 0)
    $$bindings.zip(zip);
  if ($$props.country === void 0 && $$bindings.country && country !== void 0)
    $$bindings.country(country);
  if ($$props.country_abbr === void 0 && $$bindings.country_abbr && country_abbr !== void 0)
    $$bindings.country_abbr(country_abbr);
  if ($$props.category === void 0 && $$bindings.category && category !== void 0)
    $$bindings.category(category);
  if ($$props.notes === void 0 && $$bindings.notes && notes !== void 0)
    $$bindings.notes(notes);
  if ($$props.latitude === void 0 && $$bindings.latitude && latitude !== void 0)
    $$bindings.latitude(latitude);
  if ($$props.longitude === void 0 && $$bindings.longitude && longitude !== void 0)
    $$bindings.longitude(longitude);
  if ($$props.google_maps === void 0 && $$bindings.google_maps && google_maps !== void 0)
    $$bindings.google_maps(google_maps);
  if ($$props.google_business === void 0 && $$bindings.google_business && google_business !== void 0)
    $$bindings.google_business(google_business);
  if ($$props.facebook === void 0 && $$bindings.facebook && facebook !== void 0)
    $$bindings.facebook(facebook);
  if ($$props.facebook_image === void 0 && $$bindings.facebook_image && facebook_image !== void 0)
    $$bindings.facebook_image(facebook_image);
  if ($$props.twitter === void 0 && $$bindings.twitter && twitter !== void 0)
    $$bindings.twitter(twitter);
  if ($$props.twitter_image === void 0 && $$bindings.twitter_image && twitter_image !== void 0)
    $$bindings.twitter_image(twitter_image);
  if ($$props.instagram === void 0 && $$bindings.instagram && instagram !== void 0)
    $$bindings.instagram(instagram);
  if ($$props.linkedin === void 0 && $$bindings.linkedin && linkedin !== void 0)
    $$bindings.linkedin(linkedin);
  if ($$props.youtube === void 0 && $$bindings.youtube && youtube !== void 0)
    $$bindings.youtube(youtube);
  if ($$props.vimeo === void 0 && $$bindings.vimeo && vimeo !== void 0)
    $$bindings.vimeo(vimeo);
  if ($$props.rss === void 0 && $$bindings.rss && rss !== void 0)
    $$bindings.rss(rss);
  if ($$props.blog === void 0 && $$bindings.blog && blog2 !== void 0)
    $$bindings.blog(blog2);
  if ($$props.etsy === void 0 && $$bindings.etsy && etsy !== void 0)
    $$bindings.etsy(etsy);
  if ($$props.yelp === void 0 && $$bindings.yelp && yelp !== void 0)
    $$bindings.yelp(yelp);
  if ($$props.airbnb === void 0 && $$bindings.airbnb && airbnb !== void 0)
    $$bindings.airbnb(airbnb);
  if ($$props.tiktok === void 0 && $$bindings.tiktok && tiktok !== void 0)
    $$bindings.tiktok(tiktok);
  if ($$props.snapchat === void 0 && $$bindings.snapchat && snapchat !== void 0)
    $$bindings.snapchat(snapchat);
  if ($$props.pinterest === void 0 && $$bindings.pinterest && pinterest !== void 0)
    $$bindings.pinterest(pinterest);
  if ($$props.vcf_file === void 0 && $$bindings.vcf_file && vcf_file !== void 0)
    $$bindings.vcf_file(vcf_file);
  if ($$props.first_name === void 0 && $$bindings.first_name && first_name !== void 0)
    $$bindings.first_name(first_name);
  if ($$props.last_name === void 0 && $$bindings.last_name && last_name !== void 0)
    $$bindings.last_name(last_name);
  if ($$props.middle_name === void 0 && $$bindings.middle_name && middle_name !== void 0)
    $$bindings.middle_name(middle_name);
  if ($$props.prefix_name === void 0 && $$bindings.prefix_name && prefix_name !== void 0)
    $$bindings.prefix_name(prefix_name);
  if ($$props.suffix_name === void 0 && $$bindings.suffix_name && suffix_name !== void 0)
    $$bindings.suffix_name(suffix_name);
  if ($$props.nick_name === void 0 && $$bindings.nick_name && nick_name !== void 0)
    $$bindings.nick_name(nick_name);
  if ($$props.birthday === void 0 && $$bindings.birthday && birthday !== void 0)
    $$bindings.birthday(birthday);
  if ($$props.hours_of_operation === void 0 && $$bindings.hours_of_operation && hours_of_operation !== void 0)
    $$bindings.hours_of_operation(hours_of_operation);
  if ($$props.hours_of_operation_dt === void 0 && $$bindings.hours_of_operation_dt && hours_of_operation_dt !== void 0)
    $$bindings.hours_of_operation_dt(hours_of_operation_dt);
  if ($$props.price_range === void 0 && $$bindings.price_range && price_range !== void 0)
    $$bindings.price_range(price_range);
  if ($$props.logo === void 0 && $$bindings.logo && logo !== void 0)
    $$bindings.logo(logo);
  if ($$props.logo_height === void 0 && $$bindings.logo_height && logo_height !== void 0)
    $$bindings.logo_height(logo_height);
  if ($$props.logo_width === void 0 && $$bindings.logo_width && logo_width !== void 0)
    $$bindings.logo_width(logo_width);
  $$result.css.add(css$G);
  type = type && type != "organization" ? "person" : "organization";
  specific_type = type && specific_type && type != "organization" ? "Person" : specific_type != "" ? "" + specific_type : "Organization";
  item_type = type && type != "organization" ? "https://schema.org/Person" : "https://schema.org/" + specific_type;
  full_name = type && type != "organization" && (organization || last_name) ? first_name + " " + last_name : "" + organization;
  return `${$$result.head += `<link async rel="${"profile"}" href="${"http://microformats.org/profile/hcard"}" data-svelte="svelte-t4njke">`, ""}


<div class="${"vcard h-card"}" data-impliments="${"microformat, microdata, rdfa"}" data-microformat="${"hCard, vCard, oCard, h-card, h-addr, geo, h-geo"}" data-microdata="${"Person, Organization, PostalAddress, LocalBusiness, openingHours, Place, webFeed, Service"}" data-rdfa="${"Person, Organization, PostalAddress, LocalBusiness, openingHours, Place, webFeed, Service"}" vocab="${"https://schema.org/"}" itemscope${add_attribute("itemtype", item_type, 0)}${add_attribute("typeof", `${specific_type} Organization Person Service`, 0)}><link itemprop="${"additionalType"}" href="${"https://schema.org/Organization"}">
	<link itemprop="${"additionalType"}" href="${"https://schema.org/Person"}">
	<link itemprop="${"additionalType"}" href="${"https://schema.org/Service"}">
	
	
	
	

	
	
	
	

	
	
	
	

	

	
	

	

	

	

	

	${photo && photo != "" ? `<div class="${"picture"}"><div class="${"photo"}"><picture${add_attribute("title", `${full_name}`, 0)}>${photo_avif && photo_avif != "" ? `<source type="${"image/avif"}"${add_attribute("srcset", photo_avif, 0)}>` : ``}
					${photo_webp && photo_webp != "" ? `<source type="${"image/webp"}"${add_attribute("srcset", photo_webp, 0)}>` : ``}
					<img class="${"photo u-photo"}" height="${"300"}" width="${"300"}"${add_attribute("src", photo, 0)}${add_attribute("alt", full_name, 0)} loading="${"lazy"}" itemprop="${"image"}" property="${"image"}"></picture></div>
			${logo && logo != "" ? `<div class="${"logo"}"><picture${add_attribute("title", `${organization}`, 0)}><img class="${"logo u-logo image"}"${add_attribute("height", logo_height, 0)}${add_attribute("width", logo_width, 0)}${add_attribute("src", logo, 0)}${add_attribute("alt", organization, 0)} loading="${"lazy"}" itemprop="${"logo"}" property="${"logo"}"></picture></div>` : ``}</div>` : ``}

	${type && type != "organization" ? `<div class="${"fn p-name"}" title="${"Full Name"}" itemprop="${"name"}" property="${"name"}"><div class="${"n"}">${prefix_name && prefix_name != "" ? `<span class="${"honorific-prefix p-honorific-prefix"}">${escape(prefix_name)}</span>` : ``}
				${first_name && first_name != "" ? `<span class="${"given-name p-given-name"}" title="${"First Name"}">${escape(first_name)}</span>` : ``}
				${middle_name && middle_name != "" ? `<span class="${"additional-name p-additional-name"}">${escape(middle_name)}</span>` : ``}
				${last_name && last_name != "" ? `<span class="${"family-name p-family-name"}" title="${"Last Name"}">${escape(last_name)}</span>` : ``}
				${suffix_name && suffix_name != "" ? `<span class="${"honorific-suffix p-honorific-suffix"}">${escape(suffix_name)}</span>` : ``}
				${nick_name && nick_name != "" ? `(<span class="${"nickname p-nickname"}" title="${"Nickname"}">${escape(nick_name)}
					</span>)` : ``}</div></div>
		${organization && organization != "" ? `<div itemscope itemtype="${"https://schema.org/Organization"}" vocab="${"https://schema.org/"}" typeof="${"Organization"}"><div class="${"org p-org p-organization-name"}" title="${"Company/Organization"}" itemprop="${"name"}" property="${"name"}">${escape(organization)}</div></div>` : ``}` : `<div class="${"fn n org p-name p-org p-organization-name"}" title="${"Company/Organization"}" itemprop="${"name"}" property="${"name"}">${escape(organization)}</div>`}

	${email_address && email_address != "" ? `<div class="${"emailaddress"}"><span class="${"label svelte-7gtf33"}">Email:</span>
			<a class="${"email u-email"}"${add_attribute("href", `mailto:${email_address}`, 0)} title="${"Email Address"}" itemprop="${"email"}" property="${"email"}"><span class="${"type p-label svelte-7gtf33"}">Email</span>
				<span class="${"value"}">${escape(email_address)}</span></a></div>` : ``}
	${phone && phone != "" ? `<div class="${"telephone"}"><span class="${"label svelte-7gtf33"}">Telephone:</span>
			<a class="${"tel p-tel"}"${add_attribute("href", `tel:+${phone}`, 0)} title="${"Telephone"}" itemprop="${"telephone"}" property="${"telephone"}"><span itemprop="${"telephone"}" property="${"telephone"}">${escape(phone)}</span></a></div>` : ``}
	${fax && fax != "" ? `<div class="${"facsimile"}"><span class="${"label svelte-7gtf33"}">Facsimile:</span>
			<a class="${"fax tel p-tel"}"${add_attribute("href", `tel:+${fax}`, 0)} title="${"Fax"}" itemprop="${"faxNumber"}" property="${"faxNumber"}"><span itemprop="${"faxNumber"}" property="${"faxNumber"}">${escape(fax)}</span></a></div>` : ``}

	<div class="${"adr p-adr h-adr svelte-7gtf33"}" title="${"Address"}" itemprop="${"address"}" itemscope itemtype="${"https://schema.org/PostalAddress"}" vocab="${"https://schema.org/"}" property="${"address"}" typeof="${"PostalAddress"}"><span class="${"label svelte-7gtf33"}">Address:</span>
		${address && address != "" ? `<div class="${"street-address p-street-address"}" title="${"Street Address"}" itemprop="${"streetAddress"}" property="${"streetAddress"}">${escape(address)}</div>` : ``}
		<div>${city && city != "" ? `<span class="${"locality p-locality"}" title="${"City/Locality"}" itemprop="${"addressLocality"}" property="${"addressLocality"}">${escape(city)}</span>,` : ``}
			${state_abbr && state_abbr != "" ? `<span class="${"state"}" title="${"State/Region"}"><abbr class="${"region p-region"}"${add_attribute("title", state, 0)} itemprop="${"addressRegion"}" property="${"addressRegion"}">${escape(state_abbr)}</abbr>,
				</span>` : ``}
			${zip && zip != "" ? `<span class="${"postal-code p-postal-code"}" title="${"Zipcode/Postal Code"}" itemprop="${"postalCode"}" property="${"postalCode"}">${escape(zip)}</span>` : ``}
			${country_abbr && country_abbr != "" ? `<span class="${"country"}" title="${"Country"}"><abbr class="${"country-name p-country-name"}"${add_attribute("title", country, 0)} itemprop="${"addressCountry"}" property="${"addressCountry"}">${escape(country_abbr)}</abbr></span>` : ``}</div></div>

	<div itemprop="${"location"}" itemscope vocab="${"https://schema.org/"}" itemtype="${"https://schema.org/Place"}" property="${"location"}" typeof="${"Place"}" class="${"hide svelte-7gtf33"}"><div itemprop="${"name"}" property="${"name"}" class="${"hide svelte-7gtf33"}">${escape(full_name)}</div>
		<div itemprop="${"address"}" itemscope itemtype="${"https://schema.org/PostalAddress"}" vocab="${"https://schema.org/"}" property="${"address"}" typeof="${"PostalAddress"}"><span class="${"label svelte-7gtf33"}">Address:</span>
			${address && address != "" ? `<div class="${"street-address p-street-address"}" title="${"Street Address"}" itemprop="${"streetAddress"}" property="${"streetAddress"}">${escape(address)}</div>` : ``}
			<div>${city && city != "" ? `<span class="${"locality p-locality"}" title="${"City/Locality"}" itemprop="${"addressLocality"}" property="${"addressLocality"}">${escape(city)}
					</span>,` : ``}
				${state_abbr && state_abbr != "" ? `<span class="${"state"}" title="${"State/Region"}"><abbr class="${"region p-region"}"${add_attribute("title", state, 0)} itemprop="${"addressRegion"}" property="${"addressRegion"}">${escape(state_abbr)}
						</abbr>,
					</span>` : ``}
				${zip && zip != "" ? `<span class="${"postal-code p-postal-code"}" title="${"Zipcode/Postal Code"}" itemprop="${"postalCode"}" property="${"postalCode"}">${escape(zip)}</span>` : ``}
				${country_abbr && country_abbr != "" ? `<span class="${"country"}" title="${"Country"}"><abbr class="${"country-name p-country-name"}"${add_attribute("title", country, 0)} itemprop="${"addressCountry"}" property="${"addressCountry"}">${escape(country_abbr)}</abbr></span>` : ``}</div></div></div>

	${website && website != "" ? `<div class="${"website"}" title="${"Website"}"><span class="${"label svelte-7gtf33"}">Website:</span>
			<a class="${"url u-url"}" target="${"website"}"${add_attribute("href", website, 0)}${add_attribute("title", `Website for ${full_name}`, 0)} itemprop="${"url"}" property="${"url"}">${escape(website)}</a></div>` : ``}

	${type && type == "organization" ? `${hours_of_operation && hours_of_operation != "" ? `<div class="${"hours-of-operation note p-note"}"><span class="${"label svelte-7gtf33"}">Hours of Operation:</span>
				<div class="${"hours"}" title="${"Hours of Operation"}" itemprop="${"openingHours"}" property="${"openingHours"}"${add_attribute("content", hours_of_operation_dt, 0)}>${escape(hours_of_operation)}</div></div>` : ``}
		${price_range && price_range != "" ? `<div class="${"price note p-note"}"><span class="${"label svelte-7gtf33"}">Price Range:</span>
				<span class="${"price-range"}" title="${"Price Range"}" itemprop="${"priceRange"}" property="${"priceRange"}"${add_attribute("content", price_range, 0)}>${escape(price_range)}</span></div>` : ``}` : ``}
	${category && category != "" ? `<div class="${"categories"}"><span class="${"label svelte-7gtf33"}">Categories:</span>
			<div class="${"category p-category"}" title="${"Categories"}">${escape(category)}</div></div>` : ``}
	${notes && notes != "" ? `<div class="${"notes"}"><span class="${"label svelte-7gtf33"}">Notes:</span>
			<div class="${"note p-note"}">${escape(notes)}</div></div>` : ``}
	${type && type != "organization" ? `${birthday && birthday != "" ? `<div class="${"birthday"}"><span class="${"label svelte-7gtf33"}">Birthday:</span>
				<time class="${"bday dt-bday"}" title="${"Birthday"}" itemprop="${"birthDate"}" property="${"birthDate"}">${escape(birthday)}</time></div>` : ``}` : ``}

	<div class="${"location"}" title="${"Location"}">${google_maps && google_maps != "" ? `<div class="${"directions"}" title="${"Directions"}"><span class="${"label svelte-7gtf33"}">Directions:</span>
				<a class="${"url u-url"}" target="${"google_maps"}"${add_attribute("href", google_maps, 0)}${add_attribute("title", `Directions to ${full_name}}`, 0)} rel="${"url"}" itemprop="${"hasMap"}" property="${"hasMap"}">${escape(google_maps)}</a></div>` : ``}
		<div class="${"geo h-geo"}">${latitude && latitude != "" ? `<span class="${"label svelte-7gtf33"}">Geolocation:</span>
				<span class="${"latitude p-latitude"}" itemprop="${"latitude"}" property="${"latitude"}">${escape(latitude)}</span>,` : ``}
			${longitude && longitude != "" ? `<span class="${"longitude p-logitude"}" itemprop="${"longitude"}" property="${"longitude"}">${escape(longitude)}</span>` : ``}</div></div>

	<div class="${"social-media"}">${google_business && google_business != "" ? `<div class="${"google_business"}" title="${"Google Business Profile"}"><span class="${"label svelte-7gtf33"}">Business Profile:</span>
				<a class="${"url u-url"}" target="${"google_business"}"${add_attribute("href", google_business, 0)} title="${"Business Profile"}" rel="${"url"}" itemprop="${"url"}" property="${"url"}">${escape(google_business)}</a></div>` : ``}
		${facebook && facebook != "" ? `<div class="${"facebook"}" title="${"Facebook"}"><span class="${"label svelte-7gtf33"}">Facebook:</span>
				<a class="${"url u-url"}" target="${"facebook"}"${add_attribute("href", facebook, 0)} title="${"Facebook"}" rel="${"url"}" itemprop="${"url"}" property="${"url"}">${escape(facebook)}</a></div>` : ``}
		${twitter && twitter != "" ? `<div class="${"twitter"}" title="${"Twitter"}"><span class="${"label svelte-7gtf33"}">Twitter:</span>
				<a class="${"url u-url"}" target="${"twitte"}"${add_attribute("href", twitter, 0)} title="${"Twitter"}" rel="${"url"}" itemprop="${"url"}" property="${"url"}">${escape(twitter)}</a></div>` : ``}
		${instagram && instagram != "" ? `<div class="${"instagram"}" title="${"Instagram"}"><span class="${"label svelte-7gtf33"}">Instagram:</span>
				<a class="${"url u-url"}" target="${"instagram"}"${add_attribute("href", instagram, 0)} title="${"Instagram"}" rel="${"url"}" itemprop="${"url"}" property="${"url"}">${escape(instagram)}</a></div>` : ``}
		${linkedin && linkedin != "" ? `<div class="${"linkedin"}" title="${"LinkedIn"}"><span class="${"label svelte-7gtf33"}">LinkedIn:</span>
				<a class="${"url u-url"}" target="${"linkedin"}"${add_attribute("href", linkedin, 0)} title="${"LinkedIn"}" rel="${"url"}" itemprop="${"url"}" property="${"url"}">${escape(linkedin)}</a></div>` : ``}
		${youtube && youtube != "" ? `<div class="${"youtube"}" title="${"YouTube"}"><span class="${"label svelte-7gtf33"}">YouTube:</span>
				<a class="${"url u-url"}" target="${"youtube"}"${add_attribute("href", youtube, 0)} title="${"YouTube"}" rel="${"url"}" itemprop="${"url"}" property="${"url"}">${escape(youtube)}</a></div>` : ``}
		${vimeo && vimeo != "" ? `<div class="${"youtube"}" title="${"Vimeo"}"><span class="${"label svelte-7gtf33"}">Vimeo:</span>
				<a class="${"url u-url"}" target="${"vimeo"}"${add_attribute("href", vimeo, 0)} title="${"Vimeo"}" rel="${"url"}" itemprop="${"url"}" property="${"url"}">${escape(vimeo)}</a></div>` : ``}
		${rss && rss != "" ? `<div class="${"rss"}" title="${"RSS"}"><span class="${"label svelte-7gtf33"}">RSS:</span>
				<a class="${"url u-url"}" target="${"rss"}"${add_attribute("href", rss, 0)} title="${"RSS"}" rel="${"url"}" itemprop="${"url"}" property="${"url"}">${escape(rss)}</a></div>` : ``}
		${blog2 && blog2 != "" ? `<div class="${"blog"}" title="${"Blog"}"><span class="${"label svelte-7gtf33"}">Blog:</span>
				<a class="${"url u-url"}" target="${"blog"}"${add_attribute("href", blog2, 0)} title="${"Blog"}" rel="${"url"}" itemprop="${"url"}" property="${"url"}">${escape(blog2)}</a></div>` : ``}
		${etsy && etsy != "" ? `<div class="${"etsy"}" title="${"Etsy"}"><span class="${"label svelte-7gtf33"}">Etsy:</span>
				<a class="${"url u-url"}" target="${"etsy"}"${add_attribute("href", etsy, 0)} title="${"Etsy"}" rel="${"url"}" itemprop="${"url"}" property="${"url"}">${escape(etsy)}</a></div>` : ``}
		${yelp && yelp != "" ? `<div class="${"yelp"}" title="${"Yelp!"}"><span class="${"label svelte-7gtf33"}">Yelp!:</span>
				<a class="${"url u-url"}" target="${"yelp"}"${add_attribute("href", yelp, 0)} title="${"Yelp!"}" rel="${"url"}" itemprop="${"url"}" property="${"url"}">${escape(yelp)}</a></div>` : ``}
		${airbnb && airbnb != "" ? `<div class="${"airbnb"}" title="${"AirBnB"}"><span class="${"label svelte-7gtf33"}">AirBnB:</span>
				<a class="${"url u-url"}" target="${"airbnb"}"${add_attribute("href", airbnb, 0)} title="${"AirBnB"}" rel="${"url"}" itemprop="${"url"}" property="${"url"}">${escape(airbnb)}</a></div>` : ``}
		${tiktok && tiktok != "" ? `<div class="${"tiktok"}" title="${"TikTok"}"><span class="${"label svelte-7gtf33"}">TikTok:</span>
				<a class="${"url u-url"}" target="${"tiktok"}"${add_attribute("href", tiktok, 0)} title="${"TikTok"}" rel="${"url"}" itemprop="${"url"}" property="${"url"}">${escape(tiktok)}</a></div>` : ``}
		${snapchat && snapchat != "" ? `<div class="${"snapchat"}" title="${"SnapChat"}"><span class="${"label svelte-7gtf33"}">SnapChat:</span>
				<a class="${"url u-url"}" target="${"snapchat"}"${add_attribute("href", snapchat, 0)} title="${"SnapChat"}" rel="${"url"}" itemprop="${"url"}" property="${"url"}">${escape(snapchat)}</a></div>` : ``}
		${pinterest && pinterest != "" ? `<div class="${"pinterest"}" title="${"Pinterest"}"><span class="${"label svelte-7gtf33"}">Pinterest:</span>
				<a class="${"url u-url"}" target="${"pinterest"}"${add_attribute("href", pinterest, 0)} title="${"Pinterest"}" rel="${"url"}" itemprop="${"url"}" property="${"url"}">${escape(pinterest)}</a></div>` : ``}</div>

	${vcf_file && vcf_file != "" ? `<div class="${"vcf-file"}" title="${"vCard File"}"><span class="${"label svelte-7gtf33"}">vCard File:</span>
			<a class="${"url u-url"}" target="${"vcf_file"}"${add_attribute("href", vcf_file, 0)} title="${"vCard File"}" rel="${"url"}" itemprop="${"url"}" property="${"url"}" encodingFormat="${"Text"}">${escape(vcf_file)}</a></div>` : ``}</div>

`;
});
var GoogleMaps_svelte = ".map.svelte-15z64nh{text-align:left;min-height:250px;padding:0;font-size:0;position:relative;background-size:cover!important;overflow:hidden}.map.svelte-15z64nh,iframe.svelte-15z64nh{display:block;width:100%;height:100%}iframe.svelte-15z64nh{border:0}img.svelte-15z64nh{position:absolute;-o-object-fit:cover;object-fit:cover;width:auto;min-width:100%;height:auto;min-height:100%;max-width:100%}@media screen and (max-width:650px){iframe.svelte-15z64nh{height:300px}}";
const css$F = {
  code: ".map.svelte-15z64nh{text-align:left;min-height:250px;padding:0;font-size:0;position:relative;background-size:cover!important;overflow:hidden}.map.svelte-15z64nh,iframe.svelte-15z64nh{display:block;width:100%;height:100%}iframe.svelte-15z64nh{border:0}img.svelte-15z64nh{position:absolute;-o-object-fit:cover;object-fit:cover;width:auto;min-width:100%;height:auto;min-height:100%;max-width:100%}@media screen and (max-width:650px){iframe.svelte-15z64nh{height:300px}}",
  map: `{"version":3,"file":"GoogleMaps.svelte","sources":["GoogleMaps.svelte"],"sourcesContent":["<div\\n\\tbind:this={map_element}\\n\\tclass=\\"map\\"\\n\\ton:mouseover={() => {\\n\\t\\tshow_map = true;\\n\\t}}\\n\\ton:click={() => {\\n\\t\\tshow_map = true;\\n\\t}}\\n\\tstyle={\`/* background-image: url('\${image_webp}'); background-image: -webkit-image-set('\${image_webp}')1x ); background-image: image-set('\${image_avif}')1x ); */\`}\\n>\\n\\t{#if show_map}\\n\\t\\t<iframe\\n\\t\\t\\tsrc={url}\\n\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\tframeborder=\\"0\\"\\n\\t\\t\\tallowfullscreen=\\"true\\"\\n\\t\\t\\taria-hidden=\\"false\\"\\n\\t\\t\\ttabindex=\\"0\\"\\n\\t\\t\\t{title}\\n\\t\\t/>\\n\\t{:else}\\n\\t\\t<picture>\\n\\t\\t\\t{#if image_avif && image_avif != ''}\\n\\t\\t\\t\\t<source type=\\"image/avif\\" srcset={image_avif} />\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if image_webp && image_webp != ''}\\n\\t\\t\\t\\t<source type=\\"image/webp\\" srcset={image_webp} />\\n\\t\\t\\t{/if}\\n\\t\\t\\t<img\\n\\t\\t\\t\\talt=\\"map\\"\\n\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\tsrc={image}\\n\\t\\t\\t\\twidth=\\"270\\"\\n\\t\\t\\t\\theight=\\"184\\"\\n\\t\\t\\t\\ton:load={() => {\\n\\t\\t\\t\\t\\tshow_map = true;\\n\\t\\t\\t\\t}}\\n\\t\\t\\t/>\\n\\t\\t</picture>\\n\\t\\t<img\\n\\t\\t\\tsrc={\`/milk/img/onload_then_do_map.gif?cache=\${cache_bust}\`}\\n\\t\\t\\trel=\\"nocache\\"\\n\\t\\t\\tdata-dev=\\"uncachable proximity loader\\"\\n\\t\\t\\talt=\\"loader\\"\\n\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\twidth=\\"1\\"\\n\\t\\t\\theight=\\"1\\"\\n\\t\\t\\ton:load={() => {\\n\\t\\t\\t\\tshow_map = true;\\n\\t\\t\\t}}\\n\\t\\t/>\\n\\t{/if}\\n</div>\\n\\n<script>import { onMount } from 'svelte';\\nvar map_element;\\nvar map_observer;\\nvar url;\\nvar title;\\nvar image;\\nvar image_webp;\\nvar image_avif;\\nvar show_map = false;\\nvar cache_bust = new Date().getTime();\\nonMount(() => {\\n  var _map_observer;\\n\\n  map_observer = new IntersectionObserver(function (entries) {\\n    if ((entries == null ? void 0 : entries[0].isIntersecting) === true) {\\n      show_map = true;\\n    }\\n  }, {\\n    threshold: [0]\\n  });\\n  (_map_observer = map_observer) == null ? void 0 : _map_observer.observe(map_element);\\n});\\nexport { url, title, image, image_webp, image_avif };</script>\\n\\n<style>.map{text-align:left;min-height:250px;padding:0;font-size:0;position:relative;background-size:cover!important;overflow:hidden}.map,iframe{display:block;width:100%;height:100%}iframe{border:0}img{position:absolute;-o-object-fit:cover;object-fit:cover;width:auto;min-width:100%;height:auto;min-height:100%;max-width:100%}@media screen and (max-width:650px){iframe{height:300px}}</style>\\n"],"names":[],"mappings":"AA+EO,mBAAI,CAAC,WAAW,IAAI,CAAC,WAAW,KAAK,CAAC,QAAQ,CAAC,CAAC,UAAU,CAAC,CAAC,SAAS,QAAQ,CAAC,gBAAgB,KAAK,UAAU,CAAC,SAAS,MAAM,CAAC,mBAAI,CAAC,qBAAM,CAAC,QAAQ,KAAK,CAAC,MAAM,IAAI,CAAC,OAAO,IAAI,CAAC,qBAAM,CAAC,OAAO,CAAC,CAAC,kBAAG,CAAC,SAAS,QAAQ,CAAC,cAAc,KAAK,CAAC,WAAW,KAAK,CAAC,MAAM,IAAI,CAAC,UAAU,IAAI,CAAC,OAAO,IAAI,CAAC,WAAW,IAAI,CAAC,UAAU,IAAI,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,qBAAM,CAAC,OAAO,KAAK,CAAC,CAAC"}`
};
const GoogleMaps = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var map_element;
  var map_observer;
  var {url} = $$props;
  var {title} = $$props;
  var {image} = $$props;
  var {image_webp} = $$props;
  var {image_avif} = $$props;
  var show_map = false;
  var cache_bust = new Date().getTime();
  onMount(() => {
    var _map_observer;
    map_observer = new IntersectionObserver(function(entries) {
      if ((entries == null ? void 0 : entries[0].isIntersecting) === true) {
        show_map = true;
      }
    }, {threshold: [0]});
    (_map_observer = map_observer) == null ? void 0 : _map_observer.observe(map_element);
  });
  if ($$props.url === void 0 && $$bindings.url && url !== void 0)
    $$bindings.url(url);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.image === void 0 && $$bindings.image && image !== void 0)
    $$bindings.image(image);
  if ($$props.image_webp === void 0 && $$bindings.image_webp && image_webp !== void 0)
    $$bindings.image_webp(image_webp);
  if ($$props.image_avif === void 0 && $$bindings.image_avif && image_avif !== void 0)
    $$bindings.image_avif(image_avif);
  $$result.css.add(css$F);
  return `<div class="${"map svelte-15z64nh"}"${add_attribute("style", `/* background-image: url('${image_webp}'); background-image: -webkit-image-set('${image_webp}')1x ); background-image: image-set('${image_avif}')1x ); */`, 0)}${add_attribute("this", map_element, 1)}>${show_map ? `<iframe${add_attribute("src", url, 0)} loading="${"lazy"}" frameborder="${"0"}" allowfullscreen="${"true"}" aria-hidden="${"false"}" tabindex="${"0"}"${add_attribute("title", title, 0)} class="${"svelte-15z64nh"}"></iframe>` : `<picture>${image_avif && image_avif != "" ? `<source type="${"image/avif"}"${add_attribute("srcset", image_avif, 0)}>` : ``}
			${image_webp && image_webp != "" ? `<source type="${"image/webp"}"${add_attribute("srcset", image_webp, 0)}>` : ``}
			<img alt="${"map"}" loading="${"lazy"}"${add_attribute("src", image, 0)} width="${"270"}" height="${"184"}" class="${"svelte-15z64nh"}"></picture>
		<img${add_attribute("src", `/milk/img/onload_then_do_map.gif?cache=${cache_bust}`, 0)} rel="${"nocache"}" data-dev="${"uncachable proximity loader"}" alt="${"loader"}" loading="${"lazy"}" width="${"1"}" height="${"1"}" class="${"svelte-15z64nh"}">`}
</div>`;
});
var Block_Footer_svelte = ".footer-inner.svelte-13hu3h8{margin:0 auto;max-width:1200px;max-width:var(--content-constrain,1200px);text-align:center}";
const css$E = {
  code: ".footer-inner.svelte-13hu3h8{margin:0 auto;max-width:1200px;max-width:var(--content-constrain,1200px);text-align:center}",
  map: '{"version":3,"file":"Block_Footer.svelte","sources":["Block_Footer.svelte"],"sourcesContent":["<div {id} class={blockclass}>\\n\\t<div class=\\"footer-inner\\">\\n\\t\\t<div class=\\"contact-information\\">\\n\\t\\t\\t<ContactCard\\n\\t\\t\\t\\ttype=\\"organization\\"\\n\\t\\t\\t\\tspecific_type=\\"LocalBusiness\\"\\n\\t\\t\\t\\tphoto={$milk?.site?.photo}\\n\\t\\t\\t\\tphoto_avif={$milk?.site?.photo_avif}\\n\\t\\t\\t\\tphoto_webp={$milk?.site?.photo_webp}\\n\\t\\t\\t\\tlogo={$milk?.site?.logo}\\n\\t\\t\\t\\tlogo_width={$milk?.site?.logo_width}\\n\\t\\t\\t\\tlogo_height={$milk?.site?.logo_height}\\n\\t\\t\\t\\tfirst_name={$milk?.site?.first_name}\\n\\t\\t\\t\\tlast_name={$milk?.site?.last_name}\\n\\t\\t\\t\\tmiddle_name={$milk?.site?.middle_name}\\n\\t\\t\\t\\tprefix_name={$milk?.site?.prefix_name}\\n\\t\\t\\t\\tsuffix_name={$milk?.site?.suffix_name}\\n\\t\\t\\t\\tnick_name={$milk?.site?.nick_name}\\n\\t\\t\\t\\torganization={$milk?.site?.organization}\\n\\t\\t\\t\\twebsite={$milk?.site?.url}\\n\\t\\t\\t\\temail_address={$milk?.site?.email_address}\\n\\t\\t\\t\\tphone={$milk?.site?.phone}\\n\\t\\t\\t\\tfax={$milk?.site?.fax}\\n\\t\\t\\t\\taddress={`${$milk?.site?.address}, ${$milk?.site?.address2}`}\\n\\t\\t\\t\\tcity={$milk?.site?.city}\\n\\t\\t\\t\\tstate={$milk?.site?.state}\\n\\t\\t\\t\\tstate_abbr={$milk?.site?.state_abbr}\\n\\t\\t\\t\\tzip={$milk?.site?.zip}\\n\\t\\t\\t\\tcountry={$milk?.site?.country}\\n\\t\\t\\t\\tcountry_abbr={$milk?.site?.country_abbr}\\n\\t\\t\\t\\thours_of_operation={$milk?.site?.hours_of_operation}\\n\\t\\t\\t\\thours_of_operation_dt={$milk?.site?.hours_of_operation_dt}\\n\\t\\t\\t\\tprice_range={$milk?.site?.price_range}\\n\\t\\t\\t\\tbirthday={$milk?.site?.birthday}\\n\\t\\t\\t\\tcategory={$milk?.site?.category}\\n\\t\\t\\t\\tnotes={$milk?.site?.description}\\n\\t\\t\\t\\tlatitude={$milk?.site?.latitude}\\n\\t\\t\\t\\tlongitude={$milk?.site?.longitude}\\n\\t\\t\\t\\tgoogle_maps={$milk?.site?.google_maps}\\n\\t\\t\\t\\tgoogle_business={$milk?.site?.google_business}\\n\\t\\t\\t\\tfacebook={$milk?.site?.facebook}\\n\\t\\t\\t\\tfacebook_image={$milk?.site?.facebook_image}\\n\\t\\t\\t\\ttwitter={$milk?.site?.twitter}\\n\\t\\t\\t\\ttwitter_image={$milk?.site?.twitter_image}\\n\\t\\t\\t\\tinstagram={$milk?.site?.instagram}\\n\\t\\t\\t\\tlinkedin={$milk?.site?.linkedin}\\n\\t\\t\\t\\tyoutube={$milk?.site?.youtube}\\n\\t\\t\\t\\tvimeo={$milk?.site?.vimeo}\\n\\t\\t\\t\\trss={$milk?.site?.rss}\\n\\t\\t\\t\\tetsy={$milk?.site?.etsy}\\n\\t\\t\\t\\tyelp={$milk?.site?.yelp}\\n\\t\\t\\t\\tairbnb={$milk?.site?.airbnb}\\n\\t\\t\\t\\ttiktok={$milk?.site?.tiktok}\\n\\t\\t\\t\\tsnapchat={$milk?.site?.snapchat}\\n\\t\\t\\t\\tpinterest={$milk?.site?.pinterest}\\n\\t\\t\\t\\tblog={$milk?.site?.blog}\\n\\t\\t\\t\\tvcf_file={$milk?.site?.vcf_file}\\n\\t\\t\\t/>\\n\\t\\t\\t<div class=\\"extra-buttons\\">\\n\\t\\t\\t\\t<a href=\\"#\\" on:click|preventDefault={doCall}> Call Us </a>\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\thref={`mailto:${$milk?.site?.email_address}`}\\n\\t\\t\\t\\t\\ton:click|preventDefault={doEmail}\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\tEmail\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t<a href=\\"#\\" on:click|preventDefault={doCalendar}>\\n\\t\\t\\t\\t\\tConsultation\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t\\t<div class=\\"google-maps\\">\\n\\t\\t\\t<GoogleMaps\\n\\t\\t\\t\\turl={$milk?.site?.google_maps_embed}\\n\\t\\t\\t\\timage={$milk?.site?.google_maps_image}\\n\\t\\t\\t\\timage_webp={$milk?.site?.google_maps_image_webp}\\n\\t\\t\\t\\timage_avif={$milk?.site?.google_maps_image_avif}\\n\\t\\t\\t\\ttitle={`Directions to ${$milk?.site?.organization} - ${$milk?.site?.tagline}`}\\n\\t\\t\\t/>\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<script>/* ## MILK ## */\\nimport { milk } from \'$milk/milk.js\';\\n/* ## Components ## */\\n\\nimport ContactCard from \'$milk/lib/ContactCard.svelte\';\\nimport GoogleMaps from \'$milk/lib/GoogleMaps.svelte\';\\n/* ## Vairables ## */\\n\\nvar id;\\nvar blockstyle = \'\';\\nvar blockclass = \'footer\';\\n\\n$: blockclass = \\"footer \\" + blockstyle;\\n/* ## Methods and Functions ## */\\n\\n\\nvar doCall = () => {\\n  var _window, _window$callingCard;\\n\\n  if ((_window = window) != null && (_window$callingCard = _window.callingCard) != null && _window$callingCard.show) {\\n    var _window2, _window2$callingCard;\\n\\n    (_window2 = window) == null ? void 0 : (_window2$callingCard = _window2.callingCard) == null ? void 0 : _window2$callingCard.show();\\n  }\\n};\\n\\nvar doEmail = () => {\\n  var _window3;\\n\\n  if ((_window3 = window) != null && _window3.location) {\\n    var _$milk, _$milk$site;\\n\\n    window.location = \\"mailto:\\" + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.email_address);\\n  }\\n};\\n\\nvar doCalendar = () => {\\n  var _window4, _window4$calendarCard;\\n\\n  if ((_window4 = window) != null && (_window4$calendarCard = _window4.calendarCard) != null && _window4$calendarCard.show) {\\n    var _window5, _window5$calendarCard;\\n\\n    (_window5 = window) == null ? void 0 : (_window5$calendarCard = _window5.calendarCard) == null ? void 0 : _window5$calendarCard.show();\\n  }\\n};\\n/* ## Exports ## */\\n\\n\\nexport { id, blockstyle };</script>\\n\\n<style>.footer-inner{margin:0 auto;max-width:1200px;max-width:var(--content-constrain,1200px);text-align:center}</style>\\n"],"names":[],"mappings":"AAqIO,4BAAa,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,MAAM,CAAC,UAAU,IAAI,mBAAmB,CAAC,MAAM,CAAC,CAAC,WAAW,MAAM,CAAC"}'
};
const Block_Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U, _V, _W, _X, _Y, _Z, __, _$, _aa, _ba, _ca, _da, _ea;
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var {id} = $$props;
  var {blockstyle = ""} = $$props;
  var blockclass = "footer";
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  $$result.css.add(css$E);
  blockclass = "footer " + blockstyle;
  $$unsubscribe_milk();
  return `<div${add_attribute("id", id, 0)} class="${escape(null_to_empty(blockclass)) + " svelte-13hu3h8"}"><div class="${"footer-inner svelte-13hu3h8"}"><div class="${"contact-information"}">${validate_component(ContactCard, "ContactCard").$$render($$result, {
    type: "organization",
    specific_type: "LocalBusiness",
    photo: (_a = $milk == null ? void 0 : $milk.site) == null ? void 0 : _a.photo,
    photo_avif: (_b = $milk == null ? void 0 : $milk.site) == null ? void 0 : _b.photo_avif,
    photo_webp: (_c = $milk == null ? void 0 : $milk.site) == null ? void 0 : _c.photo_webp,
    logo: (_d = $milk == null ? void 0 : $milk.site) == null ? void 0 : _d.logo,
    logo_width: (_e = $milk == null ? void 0 : $milk.site) == null ? void 0 : _e.logo_width,
    logo_height: (_f = $milk == null ? void 0 : $milk.site) == null ? void 0 : _f.logo_height,
    first_name: (_g = $milk == null ? void 0 : $milk.site) == null ? void 0 : _g.first_name,
    last_name: (_h = $milk == null ? void 0 : $milk.site) == null ? void 0 : _h.last_name,
    middle_name: (_i = $milk == null ? void 0 : $milk.site) == null ? void 0 : _i.middle_name,
    prefix_name: (_j = $milk == null ? void 0 : $milk.site) == null ? void 0 : _j.prefix_name,
    suffix_name: (_k = $milk == null ? void 0 : $milk.site) == null ? void 0 : _k.suffix_name,
    nick_name: (_l = $milk == null ? void 0 : $milk.site) == null ? void 0 : _l.nick_name,
    organization: (_m = $milk == null ? void 0 : $milk.site) == null ? void 0 : _m.organization,
    website: (_n = $milk == null ? void 0 : $milk.site) == null ? void 0 : _n.url,
    email_address: (_o = $milk == null ? void 0 : $milk.site) == null ? void 0 : _o.email_address,
    phone: (_p = $milk == null ? void 0 : $milk.site) == null ? void 0 : _p.phone,
    fax: (_q = $milk == null ? void 0 : $milk.site) == null ? void 0 : _q.fax,
    address: `${(_r = $milk == null ? void 0 : $milk.site) == null ? void 0 : _r.address}, ${(_s = $milk == null ? void 0 : $milk.site) == null ? void 0 : _s.address2}`,
    city: (_t = $milk == null ? void 0 : $milk.site) == null ? void 0 : _t.city,
    state: (_u = $milk == null ? void 0 : $milk.site) == null ? void 0 : _u.state,
    state_abbr: (_v = $milk == null ? void 0 : $milk.site) == null ? void 0 : _v.state_abbr,
    zip: (_w = $milk == null ? void 0 : $milk.site) == null ? void 0 : _w.zip,
    country: (_x = $milk == null ? void 0 : $milk.site) == null ? void 0 : _x.country,
    country_abbr: (_y = $milk == null ? void 0 : $milk.site) == null ? void 0 : _y.country_abbr,
    hours_of_operation: (_z = $milk == null ? void 0 : $milk.site) == null ? void 0 : _z.hours_of_operation,
    hours_of_operation_dt: (_A = $milk == null ? void 0 : $milk.site) == null ? void 0 : _A.hours_of_operation_dt,
    price_range: (_B = $milk == null ? void 0 : $milk.site) == null ? void 0 : _B.price_range,
    birthday: (_C = $milk == null ? void 0 : $milk.site) == null ? void 0 : _C.birthday,
    category: (_D = $milk == null ? void 0 : $milk.site) == null ? void 0 : _D.category,
    notes: (_E = $milk == null ? void 0 : $milk.site) == null ? void 0 : _E.description,
    latitude: (_F = $milk == null ? void 0 : $milk.site) == null ? void 0 : _F.latitude,
    longitude: (_G = $milk == null ? void 0 : $milk.site) == null ? void 0 : _G.longitude,
    google_maps: (_H = $milk == null ? void 0 : $milk.site) == null ? void 0 : _H.google_maps,
    google_business: (_I = $milk == null ? void 0 : $milk.site) == null ? void 0 : _I.google_business,
    facebook: (_J = $milk == null ? void 0 : $milk.site) == null ? void 0 : _J.facebook,
    facebook_image: (_K = $milk == null ? void 0 : $milk.site) == null ? void 0 : _K.facebook_image,
    twitter: (_L = $milk == null ? void 0 : $milk.site) == null ? void 0 : _L.twitter,
    twitter_image: (_M = $milk == null ? void 0 : $milk.site) == null ? void 0 : _M.twitter_image,
    instagram: (_N = $milk == null ? void 0 : $milk.site) == null ? void 0 : _N.instagram,
    linkedin: (_O = $milk == null ? void 0 : $milk.site) == null ? void 0 : _O.linkedin,
    youtube: (_P = $milk == null ? void 0 : $milk.site) == null ? void 0 : _P.youtube,
    vimeo: (_Q = $milk == null ? void 0 : $milk.site) == null ? void 0 : _Q.vimeo,
    rss: (_R = $milk == null ? void 0 : $milk.site) == null ? void 0 : _R.rss,
    etsy: (_S = $milk == null ? void 0 : $milk.site) == null ? void 0 : _S.etsy,
    yelp: (_T = $milk == null ? void 0 : $milk.site) == null ? void 0 : _T.yelp,
    airbnb: (_U = $milk == null ? void 0 : $milk.site) == null ? void 0 : _U.airbnb,
    tiktok: (_V = $milk == null ? void 0 : $milk.site) == null ? void 0 : _V.tiktok,
    snapchat: (_W = $milk == null ? void 0 : $milk.site) == null ? void 0 : _W.snapchat,
    pinterest: (_X = $milk == null ? void 0 : $milk.site) == null ? void 0 : _X.pinterest,
    blog: (_Y = $milk == null ? void 0 : $milk.site) == null ? void 0 : _Y.blog,
    vcf_file: (_Z = $milk == null ? void 0 : $milk.site) == null ? void 0 : _Z.vcf_file
  }, {}, {})}
			<div class="${"extra-buttons"}"><a href="${"#"}">Call Us </a>
				<a${add_attribute("href", `mailto:${(__ = $milk == null ? void 0 : $milk.site) == null ? void 0 : __.email_address}`, 0)}>Email
				</a>
				<a href="${"#"}">Consultation
				</a></div></div>
		<div class="${"google-maps"}">${validate_component(GoogleMaps, "GoogleMaps").$$render($$result, {
    url: (_$ = $milk == null ? void 0 : $milk.site) == null ? void 0 : _$.google_maps_embed,
    image: (_aa = $milk == null ? void 0 : $milk.site) == null ? void 0 : _aa.google_maps_image,
    image_webp: (_ba = $milk == null ? void 0 : $milk.site) == null ? void 0 : _ba.google_maps_image_webp,
    image_avif: (_ca = $milk == null ? void 0 : $milk.site) == null ? void 0 : _ca.google_maps_image_avif,
    title: `Directions to ${(_da = $milk == null ? void 0 : $milk.site) == null ? void 0 : _da.organization} - ${(_ea = $milk == null ? void 0 : $milk.site) == null ? void 0 : _ea.tagline}`
  }, {}, {})}</div></div>
</div>`;
});
var Copyright_svelte = '.tagline.svelte-q93qd6.svelte-q93qd6:before{content:"-";display:inline-block;padding:0 5px}.hide.svelte-q93qd6.svelte-q93qd6{display:none}.copyright.svelte-q93qd6>div.svelte-q93qd6{display:inline-block}';
const css$D = {
  code: '.tagline.svelte-q93qd6.svelte-q93qd6:before{content:"-";display:inline-block;padding:0 5px}.hide.svelte-q93qd6.svelte-q93qd6{display:none}.copyright.svelte-q93qd6>div.svelte-q93qd6{display:inline-block}',
  map: `{"version":3,"file":"Copyright.svelte","sources":["Copyright.svelte"],"sourcesContent":["<svelte:head>\\n\\t<meta name=\\"doc-rights\\" content=\\"Copywritten Work\\" />\\n\\t<meta name=\\"owner\\" content={owner} />\\n\\t<meta name=\\"copyright\\" {content} />\\n</svelte:head>\\n\\n<div class=\\"copyright\\">\\n\\t<div class=\\"copyright-notice\\">\\n\\t\\t<nobr>\\n\\t\\t\\t\xA9 {year}\\n\\t\\t\\t{owner}\\n\\t\\t</nobr>\\n\\t</div>\\n\\t<div class=\\"tagline\\" class:hide={!(tagline?.length > 0)}>\\n\\t\\t{tagline}\\n\\t</div>\\n</div>\\n\\n<script>var _$milk, _$milk$site, _$milk2, _$milk2$site, _Date;\\n\\n/* ## MILK ## */\\nimport { milk } from '$milk/milk.js';\\n/* ## Variables ## **/\\n\\nvar owner = ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.organization) || '';\\nvar tagline = ((_$milk2 = $milk) == null ? void 0 : (_$milk2$site = _$milk2.site) == null ? void 0 : _$milk2$site.tagline) || '';\\nvar year = (_Date = new Date()) == null ? void 0 : _Date.getFullYear();\\nvar content = '\xA9 Copywritten Work.  All rights reserved.';\\n\\n$: content = \\"\\\\xA9 Copyright \\" + year + \\" - \\" + owner + \\" - All rights reserved. Reproduction of this publication in any form without prior written permission is forbidden.\\";\\n/* ## Exports ## **/\\n\\n\\nexport { owner, tagline };</script>\\n\\n<style>.tagline:before{content:\\"-\\";display:inline-block;padding:0 5px}.hide{display:none}.copyright>div{display:inline-block}</style>\\n"],"names":[],"mappings":"AAmCO,oCAAQ,OAAO,CAAC,QAAQ,GAAG,CAAC,QAAQ,YAAY,CAAC,QAAQ,CAAC,CAAC,GAAG,CAAC,iCAAK,CAAC,QAAQ,IAAI,CAAC,wBAAU,CAAC,iBAAG,CAAC,QAAQ,YAAY,CAAC"}`
};
const Copyright = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var _$milk, _$milk$site, _$milk2, _$milk2$site, _Date;
  var {owner = ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.organization) || ""} = $$props;
  var {tagline = ((_$milk2 = $milk) == null ? void 0 : (_$milk2$site = _$milk2.site) == null ? void 0 : _$milk2$site.tagline) || ""} = $$props;
  var year = (_Date = new Date()) == null ? void 0 : _Date.getFullYear();
  var content = "\xA9 Copywritten Work.  All rights reserved.";
  if ($$props.owner === void 0 && $$bindings.owner && owner !== void 0)
    $$bindings.owner(owner);
  if ($$props.tagline === void 0 && $$bindings.tagline && tagline !== void 0)
    $$bindings.tagline(tagline);
  $$result.css.add(css$D);
  content = "\xA9 Copyright " + year + " - " + owner + " - All rights reserved. Reproduction of this publication in any form without prior written permission is forbidden.";
  $$unsubscribe_milk();
  return `${$$result.head += `<meta name="${"doc-rights"}" content="${"Copywritten Work"}" data-svelte="svelte-ngytge"><meta name="${"owner"}"${add_attribute("content", owner, 0)} data-svelte="svelte-ngytge"><meta name="${"copyright"}"${add_attribute("content", content, 0)} data-svelte="svelte-ngytge">`, ""}

<div class="${"copyright svelte-q93qd6"}"><div class="${"copyright-notice svelte-q93qd6"}"><nobr>\xA9 ${escape(year)}
			${escape(owner)}</nobr></div>
	<div class="${["tagline svelte-q93qd6", !((tagline == null ? void 0 : tagline.length) > 0) ? "hide" : ""].join(" ").trim()}">${escape(tagline)}</div>
</div>`;
});
var Credits_svelte = ".hide.svelte-yc9gtg.svelte-yc9gtg{position:absolute;margin-left:-999999vw}img.svelte-yc9gtg.svelte-yc9gtg{display:inline-block;vertical-align:middle;cursor:pointer}img.icon.svelte-yc9gtg.svelte-yc9gtg{margin-top:-5px 0}.built-with.svelte-yc9gtg.svelte-yc9gtg,.site-credits.svelte-yc9gtg.svelte-yc9gtg{line-height:30px;vertical-align:middle}.credits.svelte-yc9gtg>div.svelte-yc9gtg{display:inline-block}";
const css$C = {
  code: ".hide.svelte-yc9gtg.svelte-yc9gtg{position:absolute;margin-left:-999999vw}img.svelte-yc9gtg.svelte-yc9gtg{display:inline-block;vertical-align:middle;cursor:pointer}img.icon.svelte-yc9gtg.svelte-yc9gtg{margin-top:-5px 0}.built-with.svelte-yc9gtg.svelte-yc9gtg,.site-credits.svelte-yc9gtg.svelte-yc9gtg{line-height:30px;vertical-align:middle}.credits.svelte-yc9gtg>div.svelte-yc9gtg{display:inline-block}",
  map: `{"version":3,"file":"Credits.svelte","sources":["Credits.svelte"],"sourcesContent":["<svelte:head>\\n\\t<meta name=\\"author\\" content={\`\${name} [\${email}]\`} />\\n\\t<meta name=\\"author\\" type=\\"website\\" content={name} />\\n\\t<meta\\n\\t\\tname=\\"generator\\"\\n\\t\\tcontent=\\"Made with MILK: Snowpack, Skypack, Svelte, PWA, WordPress, GraphQL, REST, JAMStack, SSR, SWR, Web Components by DevLove & RandomUser\\"\\n\\t/>\\n</svelte:head>\\n\\n<div class=\\"credits\\">\\n\\t<div class=\\"site-credits\\">\\n\\t\\t<nobr>\\n\\t\\t\\tSite by <wbr />\\n\\t\\t\\t<a\\n\\t\\t\\t\\thref={url}\\n\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\ttitle={\`Link to \${name}, the web design agency that designed and developed this site.\`}\\n\\t\\t\\t>\\n\\t\\t\\t\\t{name}\\n\\t\\t\\t</a>\\n\\t\\t</nobr>\\n\\t</div>\\n\\t<div class=\\"built-with\\" class:hide={!credit_milk}>\\n\\t\\t<nobr>\\n\\t\\t\\tBuilt with <wbr />\\n\\t\\t\\t<a\\n\\t\\t\\t\\thref={$milk?.credits?.url}\\n\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\ttitle={$milk?.credits?.tagline}\\n\\t\\t\\t\\tclass=\\"built-with-milk\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\tsrc={$milk?.credits?.logo_mini}\\n\\t\\t\\t\\t\\twidth=\\"20\\"\\n\\t\\t\\t\\t\\theight=\\"20\\"\\n\\t\\t\\t\\t\\talt={$milk?.credits?.title}\\n\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\tclass=\\"icon icon-milk\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t</a>\\n\\t\\t\\t<a\\n\\t\\t\\t\\thref={$milk?.credits?.svelte_url}\\n\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\ttitle={$milk?.credits?.svelte_title}\\n\\t\\t\\t\\tclass=\\"built-with-svelte\\"\\n\\t\\t\\t\\tclass:hide={!credit_svelte}\\n\\t\\t\\t>\\n\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\tsrc={$milk?.credits?.svelte_logo}\\n\\t\\t\\t\\t\\twidth=\\"15\\"\\n\\t\\t\\t\\t\\theight=\\"15\\"\\n\\t\\t\\t\\t\\talt={$milk?.credits?.svelte_title}\\n\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\tclass=\\"icon icon-svelte\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t</a>\\n\\t\\t\\t<a\\n\\t\\t\\t\\thref={$milk?.credits?.graphql_url}\\n\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\ttitle={$milk?.credits?.graphql_title}\\n\\t\\t\\t\\tclass=\\"built-with-graphql\\"\\n\\t\\t\\t\\tclass:hide={!credit_graphql}\\n\\t\\t\\t>\\n\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\tsrc={$milk?.credits?.graphql_logo}\\n\\t\\t\\t\\t\\twidth=\\"20\\"\\n\\t\\t\\t\\t\\theight=\\"20\\"\\n\\t\\t\\t\\t\\talt={$milk?.credits?.graphql_title}\\n\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\tclass=\\"icon icon-graphql\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t</a>\\n\\t\\t\\t<a\\n\\t\\t\\t\\thref={$milk?.credits?.vite_url}\\n\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\ttitle={$milk?.credits?.vite_title}\\n\\t\\t\\t\\tclass=\\"built-with-vite\\"\\n\\t\\t\\t\\tclass:hide={!credit_vite}\\n\\t\\t\\t>\\n\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\tsrc={$milk?.credits?.vite_logo}\\n\\t\\t\\t\\t\\twidth=\\"20\\"\\n\\t\\t\\t\\t\\theight=\\"20\\"\\n\\t\\t\\t\\t\\talt={$milk?.credits?.vite_title}\\n\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\tclass=\\"icon icon-vite\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t</a>\\n\\t\\t\\t<a\\n\\t\\t\\t\\thref={$milk?.credits?.rollup_url}\\n\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\ttitle={$milk?.credits?.rollup_title}\\n\\t\\t\\t\\tclass=\\"built-with-rollup\\"\\n\\t\\t\\t\\tclass:hide={!credit_rollup}\\n\\t\\t\\t>\\n\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\tsrc={$milk?.credits?.rollup_logo}\\n\\t\\t\\t\\t\\twidth=\\"14\\"\\n\\t\\t\\t\\t\\theight=\\"14\\"\\n\\t\\t\\t\\t\\talt={$milk?.credits?.rollup_title}\\n\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\tclass=\\"icon icon-rollup\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t</a>\\n\\t\\t\\t<a\\n\\t\\t\\t\\thref={$milk?.credits?.postcss_url}\\n\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\ttitle={$milk?.credits?.postcss_title}\\n\\t\\t\\t\\tclass=\\"built-with-postcss\\"\\n\\t\\t\\t\\tclass:hide={!credit_postcss}\\n\\t\\t\\t>\\n\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\tsrc={$milk?.credits?.postcss_logo}\\n\\t\\t\\t\\t\\twidth=\\"18\\"\\n\\t\\t\\t\\t\\theight=\\"18\\"\\n\\t\\t\\t\\t\\talt={$milk?.credits?.postcss_title}\\n\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\tclass=\\"icon icon-postcss\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t</a>\\n\\t\\t\\t<a\\n\\t\\t\\t\\thref={$milk?.credits?.markdown_url}\\n\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\ttitle={$milk?.credits?.markdown_title}\\n\\t\\t\\t\\tclass=\\"built-with-markdown\\"\\n\\t\\t\\t\\tclass:hide={!credit_markdown}\\n\\t\\t\\t>\\n\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\tsrc={$milk?.credits?.markdown_logo}\\n\\t\\t\\t\\t\\twidth=\\"30\\"\\n\\t\\t\\t\\t\\theight=\\"20\\"\\n\\t\\t\\t\\t\\talt={$milk?.credits?.markdown_title}\\n\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\tclass=\\"icon icon-markdown\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t</a>\\n\\t\\t</nobr>\\n\\t</div>\\n</div>\\n\\n<script>var _$milk, _$milk$site, _$milk2, _$milk2$site, _$milk3, _$milk3$site, _$milk$config$credit$, _$milk4, _$milk4$config, _$milk4$config$credit, _$milk$config$credit$2, _$milk5, _$milk5$config, _$milk5$config$credit, _$milk$config$credit$3, _$milk6, _$milk6$config, _$milk6$config$credit, _$milk$config$credit$4, _$milk7, _$milk7$config, _$milk7$config$credit, _$milk$config$credit$5, _$milk8, _$milk8$config, _$milk8$config$credit, _$milk$config$credit$6, _$milk9, _$milk9$config, _$milk9$config$credit, _$milk$config$credit$7, _$milk10, _$milk10$config, _$milk10$config$credi;\\n\\n/* ## MILK ## */\\nimport { milk } from '$milk/milk.js';\\n/* ## Variables ## */\\n\\nvar name = ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.author) || 'Milk.js';\\nvar url = ((_$milk2 = $milk) == null ? void 0 : (_$milk2$site = _$milk2.site) == null ? void 0 : _$milk2$site.author_url) || 'https://milkjs.com/';\\nvar email = ((_$milk3 = $milk) == null ? void 0 : (_$milk3$site = _$milk3.site) == null ? void 0 : _$milk3$site.author_email) || 'info@milkjs.com';\\nvar credit_milk = (_$milk$config$credit$ = (_$milk4 = $milk) == null ? void 0 : (_$milk4$config = _$milk4.config) == null ? void 0 : (_$milk4$config$credit = _$milk4$config.credit) == null ? void 0 : _$milk4$config$credit.milk) != null ? _$milk$config$credit$ : true;\\nvar credit_svelte = (_$milk$config$credit$2 = (_$milk5 = $milk) == null ? void 0 : (_$milk5$config = _$milk5.config) == null ? void 0 : (_$milk5$config$credit = _$milk5$config.credit) == null ? void 0 : _$milk5$config$credit.svelte) != null ? _$milk$config$credit$2 : true;\\nvar credit_graphql = (_$milk$config$credit$3 = (_$milk6 = $milk) == null ? void 0 : (_$milk6$config = _$milk6.config) == null ? void 0 : (_$milk6$config$credit = _$milk6$config.credit) == null ? void 0 : _$milk6$config$credit.graphql) != null ? _$milk$config$credit$3 : true;\\nvar credit_vite = (_$milk$config$credit$4 = (_$milk7 = $milk) == null ? void 0 : (_$milk7$config = _$milk7.config) == null ? void 0 : (_$milk7$config$credit = _$milk7$config.credit) == null ? void 0 : _$milk7$config$credit.vite) != null ? _$milk$config$credit$4 : true;\\nvar credit_rollup = (_$milk$config$credit$5 = (_$milk8 = $milk) == null ? void 0 : (_$milk8$config = _$milk8.config) == null ? void 0 : (_$milk8$config$credit = _$milk8$config.credit) == null ? void 0 : _$milk8$config$credit.rollup) != null ? _$milk$config$credit$5 : true;\\nvar credit_postcss = (_$milk$config$credit$6 = (_$milk9 = $milk) == null ? void 0 : (_$milk9$config = _$milk9.config) == null ? void 0 : (_$milk9$config$credit = _$milk9$config.credit) == null ? void 0 : _$milk9$config$credit.postcss) != null ? _$milk$config$credit$6 : false;\\nvar credit_markdown = (_$milk$config$credit$7 = (_$milk10 = $milk) == null ? void 0 : (_$milk10$config = _$milk10.config) == null ? void 0 : (_$milk10$config$credi = _$milk10$config.credit) == null ? void 0 : _$milk10$config$credi.markdown) != null ? _$milk$config$credit$7 : false;\\nexport { name, url, email, credit_milk, credit_svelte, credit_graphql, credit_vite, credit_rollup, credit_postcss, credit_markdown };</script>\\n\\n<style>.hide{position:absolute;margin-left:-999999vw}img{display:inline-block;vertical-align:middle;cursor:pointer}img.icon{margin-top:-5px 0}.built-with,.site-credits{line-height:30px;vertical-align:middle}.credits>div{display:inline-block}</style>\\n"],"names":[],"mappings":"AAsKO,iCAAK,CAAC,SAAS,QAAQ,CAAC,YAAY,SAAS,CAAC,+BAAG,CAAC,QAAQ,YAAY,CAAC,eAAe,MAAM,CAAC,OAAO,OAAO,CAAC,GAAG,iCAAK,CAAC,WAAW,IAAI,CAAC,CAAC,CAAC,uCAAW,CAAC,yCAAa,CAAC,YAAY,IAAI,CAAC,eAAe,MAAM,CAAC,sBAAQ,CAAC,iBAAG,CAAC,QAAQ,YAAY,CAAC"}`
};
const Credits = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B;
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var _$milk, _$milk$site, _$milk2, _$milk2$site, _$milk3, _$milk3$site, _$milk$config$credit$, _$milk4, _$milk4$config, _$milk4$config$credit, _$milk$config$credit$2, _$milk5, _$milk5$config, _$milk5$config$credit, _$milk$config$credit$3, _$milk6, _$milk6$config, _$milk6$config$credit, _$milk$config$credit$4, _$milk7, _$milk7$config, _$milk7$config$credit, _$milk$config$credit$5, _$milk8, _$milk8$config, _$milk8$config$credit, _$milk$config$credit$6, _$milk9, _$milk9$config, _$milk9$config$credit, _$milk$config$credit$7, _$milk10, _$milk10$config, _$milk10$config$credi;
  var {name = ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.author) || "Milk.js"} = $$props;
  var {url = ((_$milk2 = $milk) == null ? void 0 : (_$milk2$site = _$milk2.site) == null ? void 0 : _$milk2$site.author_url) || "https://milkjs.com/"} = $$props;
  var {email = ((_$milk3 = $milk) == null ? void 0 : (_$milk3$site = _$milk3.site) == null ? void 0 : _$milk3$site.author_email) || "info@milkjs.com"} = $$props;
  var {credit_milk = (_$milk$config$credit$ = (_$milk4 = $milk) == null ? void 0 : (_$milk4$config = _$milk4.config) == null ? void 0 : (_$milk4$config$credit = _$milk4$config.credit) == null ? void 0 : _$milk4$config$credit.milk) != null ? _$milk$config$credit$ : true} = $$props;
  var {credit_svelte = (_$milk$config$credit$2 = (_$milk5 = $milk) == null ? void 0 : (_$milk5$config = _$milk5.config) == null ? void 0 : (_$milk5$config$credit = _$milk5$config.credit) == null ? void 0 : _$milk5$config$credit.svelte) != null ? _$milk$config$credit$2 : true} = $$props;
  var {credit_graphql = (_$milk$config$credit$3 = (_$milk6 = $milk) == null ? void 0 : (_$milk6$config = _$milk6.config) == null ? void 0 : (_$milk6$config$credit = _$milk6$config.credit) == null ? void 0 : _$milk6$config$credit.graphql) != null ? _$milk$config$credit$3 : true} = $$props;
  var {credit_vite = (_$milk$config$credit$4 = (_$milk7 = $milk) == null ? void 0 : (_$milk7$config = _$milk7.config) == null ? void 0 : (_$milk7$config$credit = _$milk7$config.credit) == null ? void 0 : _$milk7$config$credit.vite) != null ? _$milk$config$credit$4 : true} = $$props;
  var {credit_rollup = (_$milk$config$credit$5 = (_$milk8 = $milk) == null ? void 0 : (_$milk8$config = _$milk8.config) == null ? void 0 : (_$milk8$config$credit = _$milk8$config.credit) == null ? void 0 : _$milk8$config$credit.rollup) != null ? _$milk$config$credit$5 : true} = $$props;
  var {credit_postcss = (_$milk$config$credit$6 = (_$milk9 = $milk) == null ? void 0 : (_$milk9$config = _$milk9.config) == null ? void 0 : (_$milk9$config$credit = _$milk9$config.credit) == null ? void 0 : _$milk9$config$credit.postcss) != null ? _$milk$config$credit$6 : false} = $$props;
  var {credit_markdown = (_$milk$config$credit$7 = (_$milk10 = $milk) == null ? void 0 : (_$milk10$config = _$milk10.config) == null ? void 0 : (_$milk10$config$credi = _$milk10$config.credit) == null ? void 0 : _$milk10$config$credi.markdown) != null ? _$milk$config$credit$7 : false} = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.url === void 0 && $$bindings.url && url !== void 0)
    $$bindings.url(url);
  if ($$props.email === void 0 && $$bindings.email && email !== void 0)
    $$bindings.email(email);
  if ($$props.credit_milk === void 0 && $$bindings.credit_milk && credit_milk !== void 0)
    $$bindings.credit_milk(credit_milk);
  if ($$props.credit_svelte === void 0 && $$bindings.credit_svelte && credit_svelte !== void 0)
    $$bindings.credit_svelte(credit_svelte);
  if ($$props.credit_graphql === void 0 && $$bindings.credit_graphql && credit_graphql !== void 0)
    $$bindings.credit_graphql(credit_graphql);
  if ($$props.credit_vite === void 0 && $$bindings.credit_vite && credit_vite !== void 0)
    $$bindings.credit_vite(credit_vite);
  if ($$props.credit_rollup === void 0 && $$bindings.credit_rollup && credit_rollup !== void 0)
    $$bindings.credit_rollup(credit_rollup);
  if ($$props.credit_postcss === void 0 && $$bindings.credit_postcss && credit_postcss !== void 0)
    $$bindings.credit_postcss(credit_postcss);
  if ($$props.credit_markdown === void 0 && $$bindings.credit_markdown && credit_markdown !== void 0)
    $$bindings.credit_markdown(credit_markdown);
  $$result.css.add(css$C);
  $$unsubscribe_milk();
  return `${$$result.head += `<meta name="${"author"}"${add_attribute("content", `${name} [${email}]`, 0)} data-svelte="svelte-17vs934"><meta name="${"author"}" type="${"website"}"${add_attribute("content", name, 0)} data-svelte="svelte-17vs934"><meta name="${"generator"}" content="${"Made with MILK: Snowpack, Skypack, Svelte, PWA, WordPress, GraphQL, REST, JAMStack, SSR, SWR, Web Components by DevLove & RandomUser"}" data-svelte="svelte-17vs934">`, ""}

<div class="${"credits svelte-yc9gtg"}"><div class="${"site-credits svelte-yc9gtg"}"><nobr>Site by <wbr>
			<a${add_attribute("href", url, 0)} target="${"_blank"}" rel="${"noreferrer"}"${add_attribute("title", `Link to ${name}, the web design agency that designed and developed this site.`, 0)}>${escape(name)}</a></nobr></div>
	<div class="${["built-with svelte-yc9gtg", !credit_milk ? "hide" : ""].join(" ").trim()}"><nobr>Built with <wbr>
			<a${add_attribute("href", (_a = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _a.url, 0)} target="${"_blank"}" rel="${"noreferrer"}"${add_attribute("title", (_b = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _b.tagline, 0)} class="${"built-with-milk"}"><img${add_attribute("src", (_c = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _c.logo_mini, 0)} width="${"20"}" height="${"20"}"${add_attribute("alt", (_d = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _d.title, 0)} loading="${"lazy"}" class="${"icon icon-milk svelte-yc9gtg"}"></a>
			<a${add_attribute("href", (_e = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _e.svelte_url, 0)} target="${"_blank"}" rel="${"noreferrer"}"${add_attribute("title", (_f = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _f.svelte_title, 0)} class="${["built-with-svelte svelte-yc9gtg", !credit_svelte ? "hide" : ""].join(" ").trim()}"><img${add_attribute("src", (_g = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _g.svelte_logo, 0)} width="${"15"}" height="${"15"}"${add_attribute("alt", (_h = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _h.svelte_title, 0)} loading="${"lazy"}" class="${"icon icon-svelte svelte-yc9gtg"}"></a>
			<a${add_attribute("href", (_i = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _i.graphql_url, 0)} target="${"_blank"}" rel="${"noreferrer"}"${add_attribute("title", (_j = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _j.graphql_title, 0)} class="${["built-with-graphql svelte-yc9gtg", !credit_graphql ? "hide" : ""].join(" ").trim()}"><img${add_attribute("src", (_k = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _k.graphql_logo, 0)} width="${"20"}" height="${"20"}"${add_attribute("alt", (_l = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _l.graphql_title, 0)} loading="${"lazy"}" class="${"icon icon-graphql svelte-yc9gtg"}"></a>
			<a${add_attribute("href", (_m = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _m.vite_url, 0)} target="${"_blank"}" rel="${"noreferrer"}"${add_attribute("title", (_n = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _n.vite_title, 0)} class="${["built-with-vite svelte-yc9gtg", !credit_vite ? "hide" : ""].join(" ").trim()}"><img${add_attribute("src", (_o = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _o.vite_logo, 0)} width="${"20"}" height="${"20"}"${add_attribute("alt", (_p = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _p.vite_title, 0)} loading="${"lazy"}" class="${"icon icon-vite svelte-yc9gtg"}"></a>
			<a${add_attribute("href", (_q = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _q.rollup_url, 0)} target="${"_blank"}" rel="${"noreferrer"}"${add_attribute("title", (_r = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _r.rollup_title, 0)} class="${["built-with-rollup svelte-yc9gtg", !credit_rollup ? "hide" : ""].join(" ").trim()}"><img${add_attribute("src", (_s = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _s.rollup_logo, 0)} width="${"14"}" height="${"14"}"${add_attribute("alt", (_t = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _t.rollup_title, 0)} loading="${"lazy"}" class="${"icon icon-rollup svelte-yc9gtg"}"></a>
			<a${add_attribute("href", (_u = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _u.postcss_url, 0)} target="${"_blank"}" rel="${"noreferrer"}"${add_attribute("title", (_v = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _v.postcss_title, 0)} class="${["built-with-postcss svelte-yc9gtg", !credit_postcss ? "hide" : ""].join(" ").trim()}"><img${add_attribute("src", (_w = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _w.postcss_logo, 0)} width="${"18"}" height="${"18"}"${add_attribute("alt", (_x = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _x.postcss_title, 0)} loading="${"lazy"}" class="${"icon icon-postcss svelte-yc9gtg"}"></a>
			<a${add_attribute("href", (_y = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _y.markdown_url, 0)} target="${"_blank"}" rel="${"noreferrer"}"${add_attribute("title", (_z = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _z.markdown_title, 0)} class="${["built-with-markdown svelte-yc9gtg", !credit_markdown ? "hide" : ""].join(" ").trim()}"><img${add_attribute("src", (_A = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _A.markdown_logo, 0)} width="${"30"}" height="${"20"}"${add_attribute("alt", (_B = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _B.markdown_title, 0)} loading="${"lazy"}" class="${"icon icon-markdown svelte-yc9gtg"}"></a></nobr></div>
</div>`;
});
var ToTop_svelte = ".to-top.svelte-unu7yk{display:block;border:0;padding:0;margin:0 auto;background:none;cursor:pointer}.to-top.svelte-unu7yk:active,.to-top.svelte-unu7yk:focus{outline:none}.top-link.svelte-unu7yk{pointer-events:none;cursor:pointer}";
const css$B = {
  code: ".to-top.svelte-unu7yk{display:block;border:0;padding:0;margin:0 auto;background:none;cursor:pointer}.to-top.svelte-unu7yk:active,.to-top.svelte-unu7yk:focus{outline:none}.top-link.svelte-unu7yk{pointer-events:none;cursor:pointer}",
  map: `{"version":3,"file":"ToTop.svelte","sources":["ToTop.svelte"],"sourcesContent":["<button\\n\\tclass=\\"to-top\\"\\n\\ton:click={$browser.scrollToTop}\\n\\ttitle=\\"Link to top of page.\\"\\n>\\n\\t<span class=\\"top-link\\"><span><slot>Back To Top</slot></span></span>\\n</button>\\n\\n<script>/* ## MILK ## */\\nimport { browser } from '$milk/milk.js';</script>\\n\\n<style>.to-top{display:block;border:0;padding:0;margin:0 auto;background:none;cursor:pointer}.to-top:active,.to-top:focus{outline:none}.top-link{pointer-events:none;cursor:pointer}</style>\\n"],"names":[],"mappings":"AAWO,qBAAO,CAAC,QAAQ,KAAK,CAAC,OAAO,CAAC,CAAC,QAAQ,CAAC,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,WAAW,IAAI,CAAC,OAAO,OAAO,CAAC,qBAAO,OAAO,CAAC,qBAAO,MAAM,CAAC,QAAQ,IAAI,CAAC,uBAAS,CAAC,eAAe,IAAI,CAAC,OAAO,OAAO,CAAC"}`
};
const ToTop = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_browser;
  $$unsubscribe_browser = subscribe(browser, (value) => value);
  $$result.css.add(css$B);
  $$unsubscribe_browser();
  return `<button class="${"to-top svelte-unu7yk"}" title="${"Link to top of page."}"><span class="${"top-link svelte-unu7yk"}"><span>${slots.default ? slots.default({}) : `Back To Top`}</span></span>
</button>`;
});
var Block_AbsoluteFooter_svelte = ".absolute-footer-inner.svelte-j8lcmw.svelte-j8lcmw{margin:0 auto;max-width:auto;max-width:var(--content-constrain,auto);padding:var(--padding-small)}.top-link.svelte-j8lcmw.svelte-j8lcmw{display:block}.middle-left-right.svelte-j8lcmw.svelte-j8lcmw{display:block;text-align:center;position:relative;width:auto;font-size:0}.middle-left-right.svelte-j8lcmw>div.svelte-j8lcmw{display:inline-block;vertical-align:middle;width:auto;font-size:var(--base-fontsize)}.middle-left-right.svelte-j8lcmw .left.svelte-j8lcmw{float:left;text-align:left;padding-right:var(--padding);width:calc(50% - 30px)}.middle-left-right.svelte-j8lcmw .middle.svelte-j8lcmw{text-align:center;width:60px}.middle-left-right.svelte-j8lcmw .right.svelte-j8lcmw{float:right;text-align:right;padding-left:var(--padding);width:calc(50% - 30px)}@media screen and (max-width:650px){.middle-left-right.svelte-j8lcmw>div.svelte-j8lcmw{display:block;font-size:var(--small-fontsize)}.middle-left-right.svelte-j8lcmw .left.svelte-j8lcmw{float:none;padding-right:var(--padding);padding-left:var(--padding)}.middle-left-right.svelte-j8lcmw .left.svelte-j8lcmw,.middle-left-right.svelte-j8lcmw .middle.svelte-j8lcmw,.middle-left-right.svelte-j8lcmw .right.svelte-j8lcmw{text-align:center;width:auto}.middle-left-right.svelte-j8lcmw .right.svelte-j8lcmw{float:none;padding-left:var(--padding);padding-right:var(--padding)}}";
const css$A = {
  code: ".absolute-footer-inner.svelte-j8lcmw.svelte-j8lcmw{margin:0 auto;max-width:auto;max-width:var(--content-constrain,auto);padding:var(--padding-small)}.top-link.svelte-j8lcmw.svelte-j8lcmw{display:block}.middle-left-right.svelte-j8lcmw.svelte-j8lcmw{display:block;text-align:center;position:relative;width:auto;font-size:0}.middle-left-right.svelte-j8lcmw>div.svelte-j8lcmw{display:inline-block;vertical-align:middle;width:auto;font-size:var(--base-fontsize)}.middle-left-right.svelte-j8lcmw .left.svelte-j8lcmw{float:left;text-align:left;padding-right:var(--padding);width:calc(50% - 30px)}.middle-left-right.svelte-j8lcmw .middle.svelte-j8lcmw{text-align:center;width:60px}.middle-left-right.svelte-j8lcmw .right.svelte-j8lcmw{float:right;text-align:right;padding-left:var(--padding);width:calc(50% - 30px)}@media screen and (max-width:650px){.middle-left-right.svelte-j8lcmw>div.svelte-j8lcmw{display:block;font-size:var(--small-fontsize)}.middle-left-right.svelte-j8lcmw .left.svelte-j8lcmw{float:none;padding-right:var(--padding);padding-left:var(--padding)}.middle-left-right.svelte-j8lcmw .left.svelte-j8lcmw,.middle-left-right.svelte-j8lcmw .middle.svelte-j8lcmw,.middle-left-right.svelte-j8lcmw .right.svelte-j8lcmw{text-align:center;width:auto}.middle-left-right.svelte-j8lcmw .right.svelte-j8lcmw{float:none;padding-left:var(--padding);padding-right:var(--padding)}}",
  map: `{"version":3,"file":"Block_AbsoluteFooter.svelte","sources":["Block_AbsoluteFooter.svelte"],"sourcesContent":["<footer {id} class={blockclass}>\\n\\t<div class=\\"absolute-footer-inner\\">\\n\\t\\t<slot name=\\"content\\">\\n\\t\\t\\t<div class=\\"middle-left-right\\">\\n\\t\\t\\t\\t<div class=\\"middle\\">\\n\\t\\t\\t\\t\\t<slot name=\\"middle\\">\\n\\t\\t\\t\\t\\t\\t<ToTop>\\n\\t\\t\\t\\t\\t\\t\\t<svg\\n\\t\\t\\t\\t\\t\\t\\t\\taria-hidden=\\"true\\"\\n\\t\\t\\t\\t\\t\\t\\t\\tfocusable=\\"false\\"\\n\\t\\t\\t\\t\\t\\t\\t\\txmlns=\\"http://www.w3.org/2000/svg\\"\\n\\t\\t\\t\\t\\t\\t\\t\\tviewBox=\\"0 0 320 512\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t><path\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tfill=\\"currentColor\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\td=\\"M288.662 352H31.338c-17.818 0-26.741-21.543-14.142-34.142l128.662-128.662c7.81-7.81 20.474-7.81 28.284 0l128.662 128.662c12.6 12.599 3.676 34.142-14.142 34.142z\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t/></svg\\n\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"top-link\\"\\n\\t\\t\\t\\t\\t\\t\\t\\thref=\\"#TopLinkAnchor\\"\\n\\t\\t\\t\\t\\t\\t\\t\\ttitle=\\"Link to top of page.\\">TOP</a\\n\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t</ToTop>\\n\\t\\t\\t\\t\\t</slot>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t<div class=\\"left\\">\\n\\t\\t\\t\\t\\t<slot name=\\"left\\">\\n\\t\\t\\t\\t\\t\\t<Copyright\\n\\t\\t\\t\\t\\t\\t\\towner={$milk?.site?.organization || 'Milk.js'}\\n\\t\\t\\t\\t\\t\\t\\ttagline={$milk?.site?.tagline ||\\n\\t\\t\\t\\t\\t\\t\\t\\t'Milk, it does a website good.'}\\n\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t</slot>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t<div class=\\"right\\">\\n\\t\\t\\t\\t\\t<slot name=\\"right\\">\\n\\t\\t\\t\\t\\t\\t<Credits\\n\\t\\t\\t\\t\\t\\t\\tname={$milk.site.author ||\\n\\t\\t\\t\\t\\t\\t\\t\\t$milk.theme.theme_by ||\\n\\t\\t\\t\\t\\t\\t\\t\\t$milk?.credits?.name}\\n\\t\\t\\t\\t\\t\\t\\turl={$milk.site.author_url ||\\n\\t\\t\\t\\t\\t\\t\\t\\t$milk.theme.theme_by_url ||\\n\\t\\t\\t\\t\\t\\t\\t\\t$milk?.credits?.url}\\n\\t\\t\\t\\t\\t\\t\\temail={$milk.site.email ||\\n\\t\\t\\t\\t\\t\\t\\t\\t$milk.theme.theme_by_email ||\\n\\t\\t\\t\\t\\t\\t\\t\\t$milk?.credits?.email}\\n\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t</slot>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</div>\\n\\t\\t</slot>\\n\\t</div>\\n</footer>\\n\\n<script>/* ## MILK ## */\\nimport { milk } from '$milk/milk.js';\\n/* ## Imports ## */\\n\\nimport Copyright from '$milk/lib/Copyright.svelte';\\nimport Credits from '$milk/lib/Credits.svelte';\\nimport ToTop from '$milk/lib/ToTop.svelte';\\n/* ## Vairables ## */\\n\\nvar id;\\nvar blockstyle = '';\\nvar blockclass = 'absolute-footer';\\n\\n$: blockclass = \\"absolute-footer \\" + blockstyle;\\n\\nexport { id, blockstyle };</script>\\n\\n<style>.absolute-footer-inner{margin:0 auto;max-width:auto;max-width:var(--content-constrain,auto);padding:var(--padding-small)}.top-link{display:block}.middle-left-right{display:block;text-align:center;position:relative;width:auto;font-size:0}.middle-left-right>div{display:inline-block;vertical-align:middle;width:auto;font-size:var(--base-fontsize)}.middle-left-right .left{float:left;text-align:left;padding-right:var(--padding);width:calc(50% - 30px)}.middle-left-right .middle{text-align:center;width:60px}.middle-left-right .right{float:right;text-align:right;padding-left:var(--padding);width:calc(50% - 30px)}@media screen and (max-width:650px){.middle-left-right>div{display:block;font-size:var(--small-fontsize)}.middle-left-right .left{float:none;padding-right:var(--padding);padding-left:var(--padding)}.middle-left-right .left,.middle-left-right .middle,.middle-left-right .right{text-align:center;width:auto}.middle-left-right .right{float:none;padding-left:var(--padding);padding-right:var(--padding)}}</style>\\n"],"names":[],"mappings":"AAuEO,kDAAsB,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,IAAI,CAAC,UAAU,IAAI,mBAAmB,CAAC,IAAI,CAAC,CAAC,QAAQ,IAAI,eAAe,CAAC,CAAC,qCAAS,CAAC,QAAQ,KAAK,CAAC,8CAAkB,CAAC,QAAQ,KAAK,CAAC,WAAW,MAAM,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,CAAC,UAAU,CAAC,CAAC,gCAAkB,CAAC,iBAAG,CAAC,QAAQ,YAAY,CAAC,eAAe,MAAM,CAAC,MAAM,IAAI,CAAC,UAAU,IAAI,eAAe,CAAC,CAAC,gCAAkB,CAAC,mBAAK,CAAC,MAAM,IAAI,CAAC,WAAW,IAAI,CAAC,cAAc,IAAI,SAAS,CAAC,CAAC,MAAM,KAAK,GAAG,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,gCAAkB,CAAC,qBAAO,CAAC,WAAW,MAAM,CAAC,MAAM,IAAI,CAAC,gCAAkB,CAAC,oBAAM,CAAC,MAAM,KAAK,CAAC,WAAW,KAAK,CAAC,aAAa,IAAI,SAAS,CAAC,CAAC,MAAM,KAAK,GAAG,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,gCAAkB,CAAC,iBAAG,CAAC,QAAQ,KAAK,CAAC,UAAU,IAAI,gBAAgB,CAAC,CAAC,gCAAkB,CAAC,mBAAK,CAAC,MAAM,IAAI,CAAC,cAAc,IAAI,SAAS,CAAC,CAAC,aAAa,IAAI,SAAS,CAAC,CAAC,gCAAkB,CAAC,mBAAK,CAAC,gCAAkB,CAAC,qBAAO,CAAC,gCAAkB,CAAC,oBAAM,CAAC,WAAW,MAAM,CAAC,MAAM,IAAI,CAAC,gCAAkB,CAAC,oBAAM,CAAC,MAAM,IAAI,CAAC,aAAa,IAAI,SAAS,CAAC,CAAC,cAAc,IAAI,SAAS,CAAC,CAAC,CAAC"}`
};
const Block_AbsoluteFooter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a, _b, _c, _d, _e;
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var {id} = $$props;
  var {blockstyle = ""} = $$props;
  var blockclass = "absolute-footer";
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  $$result.css.add(css$A);
  blockclass = "absolute-footer " + blockstyle;
  $$unsubscribe_milk();
  return `<footer${add_attribute("id", id, 0)} class="${escape(null_to_empty(blockclass)) + " svelte-j8lcmw"}"><div class="${"absolute-footer-inner svelte-j8lcmw"}">${slots.content ? slots.content({}) : `
			<div class="${"middle-left-right svelte-j8lcmw"}"><div class="${"middle svelte-j8lcmw"}">${slots.middle ? slots.middle({}) : `
						${validate_component(ToTop, "ToTop").$$render($$result, {}, {}, {
    default: () => `<svg aria-hidden="${"true"}" focusable="${"false"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 320 512"}"><path fill="${"currentColor"}" d="${"M288.662 352H31.338c-17.818 0-26.741-21.543-14.142-34.142l128.662-128.662c7.81-7.81 20.474-7.81 28.284 0l128.662 128.662c12.6 12.599 3.676 34.142-14.142 34.142z"}"></path></svg>
							<a class="${"top-link svelte-j8lcmw"}" href="${"#TopLinkAnchor"}" title="${"Link to top of page."}">TOP</a>`
  })}
					`}</div>
				<div class="${"left svelte-j8lcmw"}">${slots.left ? slots.left({}) : `
						${validate_component(Copyright, "Copyright").$$render($$result, {
    owner: ((_a = $milk == null ? void 0 : $milk.site) == null ? void 0 : _a.organization) || "Milk.js",
    tagline: ((_b = $milk == null ? void 0 : $milk.site) == null ? void 0 : _b.tagline) || "Milk, it does a website good."
  }, {}, {})}
					`}</div>
				<div class="${"right svelte-j8lcmw"}">${slots.right ? slots.right({}) : `
						${validate_component(Credits, "Credits").$$render($$result, {
    name: $milk.site.author || $milk.theme.theme_by || ((_c = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _c.name),
    url: $milk.site.author_url || $milk.theme.theme_by_url || ((_d = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _d.url),
    email: $milk.site.email || $milk.theme.theme_by_email || ((_e = $milk == null ? void 0 : $milk.credits) == null ? void 0 : _e.email)
  }, {}, {})}
					`}</div></div>
		`}</div>
</footer>`;
});
var CalendarCard_svelte = ".calendarcard.svelte-19960tn.svelte-19960tn{position:fixed;top:0;left:0;width:100vw;min-width:100%;height:100vh;min-height:100%;display:grid;background:#fff;background:var(--background-white,#fff);z-index:999999}.close.svelte-19960tn.svelte-19960tn{position:absolute;top:2vw;right:4vw;z-index:9999}.close.svelte-19960tn:hover img.svelte-19960tn{filter:invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(70%) contrast(97%)}@media screen and (max-width:650px){.close.svelte-19960tn.svelte-19960tn{right:unset;left:4vw}}button.svelte-19960tn.svelte-19960tn{display:inline-block;margin:0;padding:0;border:0;background:transparent;transition:all .3s ease;transform-origin:center;transform:scale(1)}button.svelte-19960tn.svelte-19960tn:hover{transform:scale(1.1)}iframe.svelte-19960tn.svelte-19960tn{width:100%;height:100%}.calendarcard.svelte-19960tn.svelte-19960tn:not(.hide){margin-left:0;transition:all .5s}.calendarcard.svelte-19960tn.svelte-19960tn:is(.hide){margin-left:100vw;transition:all .2s}";
const css$z = {
  code: ".calendarcard.svelte-19960tn.svelte-19960tn{position:fixed;top:0;left:0;width:100vw;min-width:100%;height:100vh;min-height:100%;display:grid;background:#fff;background:var(--background-white,#fff);z-index:999999}.close.svelte-19960tn.svelte-19960tn{position:absolute;top:2vw;right:4vw;z-index:9999}.close.svelte-19960tn:hover img.svelte-19960tn{filter:invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(70%) contrast(97%)}@media screen and (max-width:650px){.close.svelte-19960tn.svelte-19960tn{right:unset;left:4vw}}button.svelte-19960tn.svelte-19960tn{display:inline-block;margin:0;padding:0;border:0;background:transparent;transition:all .3s ease;transform-origin:center;transform:scale(1)}button.svelte-19960tn.svelte-19960tn:hover{transform:scale(1.1)}iframe.svelte-19960tn.svelte-19960tn{width:100%;height:100%}.calendarcard.svelte-19960tn.svelte-19960tn:not(.hide){margin-left:0;transition:all .5s}.calendarcard.svelte-19960tn.svelte-19960tn:is(.hide){margin-left:100vw;transition:all .2s}",
  map: `{"version":3,"file":"CalendarCard.svelte","sources":["CalendarCard.svelte"],"sourcesContent":["<div class=\\"calendarcard\\" class:hide={!display}>\\n\\t<button class=\\"close\\" on:click={hideCalendarCard} title=\\"Close\\">\\n\\t\\t<img\\n\\t\\t\\talt=\\"Close\\"\\n\\t\\t\\theight=\\"40\\"\\n\\t\\t\\twidth=\\"40\\"\\n\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\tsrc=\\"/img/icon-close.svg\\"\\n\\t\\t\\tclass=\\"icon\\"\\n\\t\\t/>\\n\\t</button>\\n\\t{#if display}\\n\\t\\t<iframe\\n\\t\\t\\tsrc={$milk?.site?.calendar}\\n\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\tframeborder=\\"0\\"\\n\\t\\t\\tallowfullscreen=\\"true\\"\\n\\t\\t\\taria-hidden=\\"false\\"\\n\\t\\t\\ttabindex=\\"0\\"\\n\\t\\t\\ttitle=\\"Calendar\\"\\n\\t\\t/>\\n\\t{/if}\\n</div>\\n\\n<script>function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\nimport { onMount } from 'svelte';\\n/* ## MILK ## */\\n\\nimport { milk } from '$milk/milk.js';\\n/* ## Components ## */\\n\\n/* ## Variables ## */\\n\\nvar display = false;\\n/* ## Main ## */\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  var _window;\\n\\n  if (!((_window = window) != null && _window.calendarCard)) {\\n    window.calendarCard = {};\\n  }\\n\\n  window.calendarCard.show = showCalendarCard;\\n  window.calendarCard.hide = hideCalendarCard;\\n}));\\n/* ## Methods & Function ## */\\n\\nvar showCalendarCard = () => {\\n  display = true;\\n};\\n\\nvar hideCalendarCard = () => {\\n  display = false;\\n};</script>\\n\\n<style>.calendarcard{position:fixed;top:0;left:0;width:100vw;min-width:100%;height:100vh;min-height:100%;display:grid;background:#fff;background:var(--background-white,#fff);z-index:999999}.close{position:absolute;top:2vw;right:4vw;z-index:9999}.close:hover img{filter:invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(70%) contrast(97%)}@media screen and (max-width:650px){.close{right:unset;left:4vw}}button{display:inline-block;margin:0;padding:0;border:0;background:transparent;transition:all .3s ease;transform-origin:center;transform:scale(1)}button:hover{transform:scale(1.1)}iframe{width:100%;height:100%}.calendarcard:not(.hide){margin-left:0;transition:all .5s}.calendarcard:is(.hide){margin-left:100vw;transition:all .2s}</style>\\n"],"names":[],"mappings":"AA2DO,2CAAa,CAAC,SAAS,KAAK,CAAC,IAAI,CAAC,CAAC,KAAK,CAAC,CAAC,MAAM,KAAK,CAAC,UAAU,IAAI,CAAC,OAAO,KAAK,CAAC,WAAW,IAAI,CAAC,QAAQ,IAAI,CAAC,WAAW,IAAI,CAAC,WAAW,IAAI,kBAAkB,CAAC,IAAI,CAAC,CAAC,QAAQ,MAAM,CAAC,oCAAM,CAAC,SAAS,QAAQ,CAAC,IAAI,GAAG,CAAC,MAAM,GAAG,CAAC,QAAQ,IAAI,CAAC,qBAAM,MAAM,CAAC,kBAAG,CAAC,OAAO,OAAO,GAAG,CAAC,CAAC,MAAM,GAAG,CAAC,CAAC,SAAS,KAAK,CAAC,CAAC,WAAW,MAAM,CAAC,CAAC,WAAW,GAAG,CAAC,CAAC,SAAS,GAAG,CAAC,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,oCAAM,CAAC,MAAM,KAAK,CAAC,KAAK,GAAG,CAAC,CAAC,oCAAM,CAAC,QAAQ,YAAY,CAAC,OAAO,CAAC,CAAC,QAAQ,CAAC,CAAC,OAAO,CAAC,CAAC,WAAW,WAAW,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,iBAAiB,MAAM,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,oCAAM,MAAM,CAAC,UAAU,MAAM,GAAG,CAAC,CAAC,oCAAM,CAAC,MAAM,IAAI,CAAC,OAAO,IAAI,CAAC,2CAAa,KAAK,KAAK,CAAC,CAAC,YAAY,CAAC,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,2CAAa,IAAI,KAAK,CAAC,CAAC,YAAY,KAAK,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC"}`
};
function asyncGeneratorStep$v(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$v(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$v(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$v(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const CalendarCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a;
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var display = false;
  onMount(/* @__PURE__ */ _asyncToGenerator$v(function* () {
    var _window;
    if (!((_window = window) != null && _window.calendarCard)) {
      window.calendarCard = {};
    }
    window.calendarCard.show = showCalendarCard;
    window.calendarCard.hide = hideCalendarCard;
  }));
  var showCalendarCard = () => {
    display = true;
  };
  var hideCalendarCard = () => {
    display = false;
  };
  $$result.css.add(css$z);
  $$unsubscribe_milk();
  return `<div class="${["calendarcard svelte-19960tn", !display ? "hide" : ""].join(" ").trim()}"><button class="${"close svelte-19960tn"}" title="${"Close"}"><img alt="${"Close"}" height="${"40"}" width="${"40"}" loading="${"lazy"}" src="${"/img/icon-close.svg"}" class="${"icon svelte-19960tn"}"></button>
	${display ? `<iframe${add_attribute("src", (_a = $milk == null ? void 0 : $milk.site) == null ? void 0 : _a.calendar, 0)} loading="${"lazy"}" frameborder="${"0"}" allowfullscreen="${"true"}" aria-hidden="${"false"}" tabindex="${"0"}" title="${"Calendar"}" class="${"svelte-19960tn"}"></iframe>` : ``}
</div>`;
});
var CallingCard_svelte = '.callingcard.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{position:fixed;top:0;left:0;width:100vw;min-width:100%;height:100vh;min-height:100%;display:grid;background:#fff;background:var(--background-white,#fff);z-index:999999}h2.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe,h3.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe,p.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{color:#000;color:var(--color-black,#000)}p.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{font-size:25px;color:585858;color:var(--color-grey,585858)}.callcard.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{padding:5vw 5vw 2vw}.buttons.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe,.callcard.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{display:grid;align-content:center;justify-content:center;place-content:center;text-align:center}.buttons.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{width:100%;padding:1vw 5vw 5vw}.buttons-inner.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{max-width:180px;margin:0 auto;display:grid;grid-template-columns:50px auto 50px;grid-template-areas:" l m r ";width:100vw}button.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{display:inline-block;vertical-align:middle;padding:0;margin:0;border:0;background:transparent none}.phone-button.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{width:50px;height:50px;background:#4bcb70;border-radius:25px;display:grid;align-content:center;justify-content:center;place-content:center;transition:all .3s ease;transform-origin:center;transform:scale(1)}.phone-button.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe:hover{transform:scale(1.25)}.phone-button.svelte-1ikbafe img.svelte-1ikbafe.svelte-1ikbafe{width:25px;height:auto;filter:invert(1)}.button-call.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{background:#4bcb70}.left.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{grid-area:l;text-align:left;display:flex;justify-content:flex-start}.button-cancel.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{background:#ff3b2e}.right.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{grid-area:r;text-align:right;display:flex;justify-content:flex-end}.middle.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{grid-area:m}.add-to-contacts.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{display:grid;align-items:center;justify-items:center;place-items:center}.add-to-contacts.svelte-1ikbafe button.svelte-1ikbafe.svelte-1ikbafe{border:2px solid #000;padding:5px 15px;font-size:16px;margin:25px;transition:all .3s ease;transform-origin:center;transform:scale(1)}.add-to-contacts.svelte-1ikbafe button.svelte-1ikbafe.svelte-1ikbafe:hover{transform:scale(1.1);filter:drop-shadow(2px 2px 1px rgba(0,0,0,.4));filter:drop-shadow(var(--drop-shadow-hover,2px 2px 1px rgba(0,0,0,.4)))}.add-to-contacts.svelte-1ikbafe button.svelte-1ikbafe img.svelte-1ikbafe{display:inline-block;width:15px;height:auto;vertical-align:middle;position:relative;margin:-2px 5px 0 0}.tel.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{margin:15px 0}.callingcard.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe:not(.hide){margin-left:0;transition:all .5s}.callingcard.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe:is(.hide){margin-left:100vw;transition:all .2s}';
const css$y = {
  code: '.callingcard.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{position:fixed;top:0;left:0;width:100vw;min-width:100%;height:100vh;min-height:100%;display:grid;background:#fff;background:var(--background-white,#fff);z-index:999999}h2.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe,h3.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe,p.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{color:#000;color:var(--color-black,#000)}p.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{font-size:25px;color:585858;color:var(--color-grey,585858)}.callcard.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{padding:5vw 5vw 2vw}.buttons.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe,.callcard.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{display:grid;align-content:center;justify-content:center;place-content:center;text-align:center}.buttons.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{width:100%;padding:1vw 5vw 5vw}.buttons-inner.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{max-width:180px;margin:0 auto;display:grid;grid-template-columns:50px auto 50px;grid-template-areas:" l m r ";width:100vw}button.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{display:inline-block;vertical-align:middle;padding:0;margin:0;border:0;background:transparent none}.phone-button.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{width:50px;height:50px;background:#4bcb70;border-radius:25px;display:grid;align-content:center;justify-content:center;place-content:center;transition:all .3s ease;transform-origin:center;transform:scale(1)}.phone-button.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe:hover{transform:scale(1.25)}.phone-button.svelte-1ikbafe img.svelte-1ikbafe.svelte-1ikbafe{width:25px;height:auto;filter:invert(1)}.button-call.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{background:#4bcb70}.left.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{grid-area:l;text-align:left;display:flex;justify-content:flex-start}.button-cancel.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{background:#ff3b2e}.right.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{grid-area:r;text-align:right;display:flex;justify-content:flex-end}.middle.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{grid-area:m}.add-to-contacts.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{display:grid;align-items:center;justify-items:center;place-items:center}.add-to-contacts.svelte-1ikbafe button.svelte-1ikbafe.svelte-1ikbafe{border:2px solid #000;padding:5px 15px;font-size:16px;margin:25px;transition:all .3s ease;transform-origin:center;transform:scale(1)}.add-to-contacts.svelte-1ikbafe button.svelte-1ikbafe.svelte-1ikbafe:hover{transform:scale(1.1);filter:drop-shadow(2px 2px 1px rgba(0,0,0,.4));filter:drop-shadow(var(--drop-shadow-hover,2px 2px 1px rgba(0,0,0,.4)))}.add-to-contacts.svelte-1ikbafe button.svelte-1ikbafe img.svelte-1ikbafe{display:inline-block;width:15px;height:auto;vertical-align:middle;position:relative;margin:-2px 5px 0 0}.tel.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe{margin:15px 0}.callingcard.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe:not(.hide){margin-left:0;transition:all .5s}.callingcard.svelte-1ikbafe.svelte-1ikbafe.svelte-1ikbafe:is(.hide){margin-left:100vw;transition:all .2s}',
  map: `{"version":3,"file":"CallingCard.svelte","sources":["CallingCard.svelte"],"sourcesContent":["<div class=\\"callingcard\\" class:hide={!display}>\\n\\t<div class=\\"callcard\\">\\n\\t\\t<h2 class=\\"fn org\\">\\n\\t\\t\\t<span class=\\"organization-name\\">{$milk?.site.organization}</span>\\n\\t\\t</h2>\\n\\t\\t<p class=\\"category\\">{$milk?.site.tagline}</p>\\n\\t\\t<h3 class=\\"tel\\">{$milk?.site.phone}</h3>\\n\\t</div>\\n\\t<div class=\\"buttons\\">\\n\\t\\t<div class=\\"buttons-inner\\">\\n\\t\\t\\t<div class=\\"left\\">\\n\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\ttitle=\\"Place Call\\"\\n\\t\\t\\t\\t\\tclass=\\"phone-button button-call\\"\\n\\t\\t\\t\\t\\ton:click={makeCall}\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\tsrc=\\"/img/icon-phone.svg\\"\\n\\t\\t\\t\\t\\t\\twidth=\\"25\\"\\n\\t\\t\\t\\t\\t\\theight=\\"25\\"\\n\\t\\t\\t\\t\\t\\talt=\\"Phone\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t</button>\\n\\t\\t\\t</div>\\n\\t\\t\\t<div class=\\"middle\\" />\\n\\t\\t\\t<div class=\\"right\\">\\n\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\ttitle=\\"Cancel\\"\\n\\t\\t\\t\\t\\tclass=\\"phone-button button-cancel\\"\\n\\t\\t\\t\\t\\ton:click={hideCallingCard}\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\tsrc=\\"/img/icon-cancel.svg\\"\\n\\t\\t\\t\\t\\t\\twidth=\\"25\\"\\n\\t\\t\\t\\t\\t\\theight=\\"25\\"\\n\\t\\t\\t\\t\\t\\talt=\\"Cancel\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t</button>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t</div>\\n\\t<div class=\\"add-to-contacts\\">\\n\\t\\t<button on:click={addToContacts} title=\\"Add to Contacts\\">\\n\\t\\t\\t<img\\n\\t\\t\\t\\tsrc=\\"/img/icon-contactcard.svg\\"\\n\\t\\t\\t\\twidth=\\"15\\"\\n\\t\\t\\t\\theight=\\"14\\"\\n\\t\\t\\t\\talt=\\"Contact Card\\"\\n\\t\\t\\t/>\\n\\t\\t\\tAdd to Contacts\\n\\t\\t</button>\\n\\t</div>\\n</div>\\n\\n<script>function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\nimport { onMount } from 'svelte';\\n/* ## MILK ## */\\n\\nimport { milk } from '$milk/milk.js';\\n/* ## Components ## */\\n\\n/* ## Variables ## */\\n\\nvar display = false;\\n/* ## Main ## */\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  var _window;\\n\\n  if (!((_window = window) != null && _window.callingCard)) {\\n    window.callingCard = {};\\n  }\\n\\n  window.callingCard.show = showCallingCard;\\n  window.callingCard.hide = hideCallingCard;\\n  window.callingCard.call = makeCall;\\n  window.callingCard.add = addToContacts;\\n}));\\n/* ## Methods & Function ## */\\n\\nvar showCallingCard = () => {\\n  display = true;\\n};\\n\\nvar hideCallingCard = () => {\\n  display = false;\\n};\\n\\nvar makeCall = () => {\\n  var _$milk, _$milk$site;\\n\\n  window.location = \\"tel:+\\" + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.telephone);\\n};\\n\\nvar addToContacts = () => {\\n  var _$milk2, _$milk2$site;\\n\\n  window.open((_$milk2 = $milk) == null ? void 0 : (_$milk2$site = _$milk2.site) == null ? void 0 : _$milk2$site.vcf_file, 'contact');\\n};</script>\\n\\n<style>.callingcard{position:fixed;top:0;left:0;width:100vw;min-width:100%;height:100vh;min-height:100%;display:grid;background:#fff;background:var(--background-white,#fff);z-index:999999}h2,h3,p{color:#000;color:var(--color-black,#000)}p{font-size:25px;color:585858;color:var(--color-grey,585858)}.callcard{padding:5vw 5vw 2vw}.buttons,.callcard{display:grid;align-content:center;justify-content:center;place-content:center;text-align:center}.buttons{width:100%;padding:1vw 5vw 5vw}.buttons-inner{max-width:180px;margin:0 auto;display:grid;grid-template-columns:50px auto 50px;grid-template-areas:\\" l m r \\";width:100vw}button{display:inline-block;vertical-align:middle;padding:0;margin:0;border:0;background:transparent none}.phone-button{width:50px;height:50px;background:#4bcb70;border-radius:25px;display:grid;align-content:center;justify-content:center;place-content:center;transition:all .3s ease;transform-origin:center;transform:scale(1)}.phone-button:hover{transform:scale(1.25)}.phone-button img{width:25px;height:auto;filter:invert(1)}.button-call{background:#4bcb70}.left{grid-area:l;text-align:left;display:flex;justify-content:flex-start}.button-cancel{background:#ff3b2e}.right{grid-area:r;text-align:right;display:flex;justify-content:flex-end}.middle{grid-area:m}.add-to-contacts{display:grid;align-items:center;justify-items:center;place-items:center}.add-to-contacts button{border:2px solid #000;padding:5px 15px;font-size:16px;margin:25px;transition:all .3s ease;transform-origin:center;transform:scale(1)}.add-to-contacts button:hover{transform:scale(1.1);filter:drop-shadow(2px 2px 1px rgba(0,0,0,.4));filter:drop-shadow(var(--drop-shadow-hover,2px 2px 1px rgba(0,0,0,.4)))}.add-to-contacts button img{display:inline-block;width:15px;height:auto;vertical-align:middle;position:relative;margin:-2px 5px 0 0}.tel{margin:15px 0}.callingcard:not(.hide){margin-left:0;transition:all .5s}.callingcard:is(.hide){margin-left:100vw;transition:all .2s}</style>\\n"],"names":[],"mappings":"AAuGO,yDAAY,CAAC,SAAS,KAAK,CAAC,IAAI,CAAC,CAAC,KAAK,CAAC,CAAC,MAAM,KAAK,CAAC,UAAU,IAAI,CAAC,OAAO,KAAK,CAAC,WAAW,IAAI,CAAC,QAAQ,IAAI,CAAC,WAAW,IAAI,CAAC,WAAW,IAAI,kBAAkB,CAAC,IAAI,CAAC,CAAC,QAAQ,MAAM,CAAC,+CAAE,CAAC,+CAAE,CAAC,8CAAC,CAAC,MAAM,IAAI,CAAC,MAAM,IAAI,aAAa,CAAC,IAAI,CAAC,CAAC,8CAAC,CAAC,UAAU,IAAI,CAAC,MAAM,MAAM,CAAC,MAAM,IAAI,YAAY,CAAC,MAAM,CAAC,CAAC,sDAAS,CAAC,QAAQ,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,qDAAQ,CAAC,sDAAS,CAAC,QAAQ,IAAI,CAAC,cAAc,MAAM,CAAC,gBAAgB,MAAM,CAAC,cAAc,MAAM,CAAC,WAAW,MAAM,CAAC,qDAAQ,CAAC,MAAM,IAAI,CAAC,QAAQ,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,2DAAc,CAAC,UAAU,KAAK,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,QAAQ,IAAI,CAAC,sBAAsB,IAAI,CAAC,IAAI,CAAC,IAAI,CAAC,oBAAoB,SAAS,CAAC,MAAM,KAAK,CAAC,mDAAM,CAAC,QAAQ,YAAY,CAAC,eAAe,MAAM,CAAC,QAAQ,CAAC,CAAC,OAAO,CAAC,CAAC,OAAO,CAAC,CAAC,WAAW,WAAW,CAAC,IAAI,CAAC,0DAAa,CAAC,MAAM,IAAI,CAAC,OAAO,IAAI,CAAC,WAAW,OAAO,CAAC,cAAc,IAAI,CAAC,QAAQ,IAAI,CAAC,cAAc,MAAM,CAAC,gBAAgB,MAAM,CAAC,cAAc,MAAM,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,iBAAiB,MAAM,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,0DAAa,MAAM,CAAC,UAAU,MAAM,IAAI,CAAC,CAAC,4BAAa,CAAC,iCAAG,CAAC,MAAM,IAAI,CAAC,OAAO,IAAI,CAAC,OAAO,OAAO,CAAC,CAAC,CAAC,yDAAY,CAAC,WAAW,OAAO,CAAC,kDAAK,CAAC,UAAU,CAAC,CAAC,WAAW,IAAI,CAAC,QAAQ,IAAI,CAAC,gBAAgB,UAAU,CAAC,2DAAc,CAAC,WAAW,OAAO,CAAC,mDAAM,CAAC,UAAU,CAAC,CAAC,WAAW,KAAK,CAAC,QAAQ,IAAI,CAAC,gBAAgB,QAAQ,CAAC,oDAAO,CAAC,UAAU,CAAC,CAAC,6DAAgB,CAAC,QAAQ,IAAI,CAAC,YAAY,MAAM,CAAC,cAAc,MAAM,CAAC,YAAY,MAAM,CAAC,+BAAgB,CAAC,oCAAM,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,IAAI,CAAC,QAAQ,GAAG,CAAC,IAAI,CAAC,UAAU,IAAI,CAAC,OAAO,IAAI,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,iBAAiB,MAAM,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,+BAAgB,CAAC,oCAAM,MAAM,CAAC,UAAU,MAAM,GAAG,CAAC,CAAC,OAAO,YAAY,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,OAAO,YAAY,IAAI,mBAAmB,CAAC,0BAA0B,CAAC,CAAC,CAAC,+BAAgB,CAAC,qBAAM,CAAC,kBAAG,CAAC,QAAQ,YAAY,CAAC,MAAM,IAAI,CAAC,OAAO,IAAI,CAAC,eAAe,MAAM,CAAC,SAAS,QAAQ,CAAC,OAAO,IAAI,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC,iDAAI,CAAC,OAAO,IAAI,CAAC,CAAC,CAAC,yDAAY,KAAK,KAAK,CAAC,CAAC,YAAY,CAAC,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,yDAAY,IAAI,KAAK,CAAC,CAAC,YAAY,KAAK,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC"}`
};
function asyncGeneratorStep$u(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$u(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$u(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$u(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const CallingCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var display = false;
  onMount(/* @__PURE__ */ _asyncToGenerator$u(function* () {
    var _window;
    if (!((_window = window) != null && _window.callingCard)) {
      window.callingCard = {};
    }
    window.callingCard.show = showCallingCard;
    window.callingCard.hide = hideCallingCard;
    window.callingCard.call = makeCall;
    window.callingCard.add = addToContacts;
  }));
  var showCallingCard = () => {
    display = true;
  };
  var hideCallingCard = () => {
    display = false;
  };
  var makeCall = () => {
    var _$milk, _$milk$site;
    window.location = "tel:+" + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.telephone);
  };
  var addToContacts = () => {
    var _$milk2, _$milk2$site;
    window.open((_$milk2 = $milk) == null ? void 0 : (_$milk2$site = _$milk2.site) == null ? void 0 : _$milk2$site.vcf_file, "contact");
  };
  $$result.css.add(css$y);
  $$unsubscribe_milk();
  return `<div class="${["callingcard svelte-1ikbafe", !display ? "hide" : ""].join(" ").trim()}"><div class="${"callcard svelte-1ikbafe"}"><h2 class="${"fn org svelte-1ikbafe"}"><span class="${"organization-name"}">${escape($milk == null ? void 0 : $milk.site.organization)}</span></h2>
		<p class="${"category svelte-1ikbafe"}">${escape($milk == null ? void 0 : $milk.site.tagline)}</p>
		<h3 class="${"tel svelte-1ikbafe"}">${escape($milk == null ? void 0 : $milk.site.phone)}</h3></div>
	<div class="${"buttons svelte-1ikbafe"}"><div class="${"buttons-inner svelte-1ikbafe"}"><div class="${"left svelte-1ikbafe"}"><button title="${"Place Call"}" class="${"phone-button button-call svelte-1ikbafe"}"><img src="${"/img/icon-phone.svg"}" width="${"25"}" height="${"25"}" alt="${"Phone"}" class="${"svelte-1ikbafe"}"></button></div>
			<div class="${"middle svelte-1ikbafe"}"></div>
			<div class="${"right svelte-1ikbafe"}"><button title="${"Cancel"}" class="${"phone-button button-cancel svelte-1ikbafe"}"><img src="${"/img/icon-cancel.svg"}" width="${"25"}" height="${"25"}" alt="${"Cancel"}" class="${"svelte-1ikbafe"}"></button></div></div></div>
	<div class="${"add-to-contacts svelte-1ikbafe"}"><button title="${"Add to Contacts"}" class="${"svelte-1ikbafe"}"><img src="${"/img/icon-contactcard.svg"}" width="${"15"}" height="${"14"}" alt="${"Contact Card"}" class="${"svelte-1ikbafe"}">
			Add to Contacts
		</button></div>
</div>`;
});
var Block_SearchCard_svelte = ".searchcard.svelte-1gul89x.svelte-1gul89x{position:fixed;top:0;left:0;width:100vw;min-width:100%;height:100vh;min-height:100%;display:grid;background:#fff;background:var(--background-white,#fff);text-align:center;z-index:999999}.close.svelte-1gul89x.svelte-1gul89x{position:absolute;top:2vw;right:4vw;z-index:9999}.close.svelte-1gul89x:hover img.svelte-1gul89x{filter:invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(70%) contrast(97%)}@media screen and (max-width:650px){.close.svelte-1gul89x.svelte-1gul89x{right:unset;left:4vw}}.searchcard.svelte-1gul89x.svelte-1gul89x:not(.hide){margin-left:0;transition:all .5s}.searchcard.svelte-1gul89x.svelte-1gul89x:is(.hide){margin-left:100vw;transition:all .2s}.contents.svelte-1gul89x.svelte-1gul89x{margin:auto;padding:var(--padding);max-width:var(--content-constrain);min-width:300px}button.close.svelte-1gul89x.svelte-1gul89x{display:inline-block;margin:0;padding:0;border:0;background:transparent;transition:all .3s ease;transform-origin:center;transform:scale(1)}button.close.svelte-1gul89x.svelte-1gul89x:hover{transform:scale(1.1)}button.close.svelte-1gul89x.svelte-1gul89x:active,button.close.svelte-1gul89x.svelte-1gul89x:focus{border:0;background:transparent}";
const css$x = {
  code: ".searchcard.svelte-1gul89x.svelte-1gul89x{position:fixed;top:0;left:0;width:100vw;min-width:100%;height:100vh;min-height:100%;display:grid;background:#fff;background:var(--background-white,#fff);text-align:center;z-index:999999}.close.svelte-1gul89x.svelte-1gul89x{position:absolute;top:2vw;right:4vw;z-index:9999}.close.svelte-1gul89x:hover img.svelte-1gul89x{filter:invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(70%) contrast(97%)}@media screen and (max-width:650px){.close.svelte-1gul89x.svelte-1gul89x{right:unset;left:4vw}}.searchcard.svelte-1gul89x.svelte-1gul89x:not(.hide){margin-left:0;transition:all .5s}.searchcard.svelte-1gul89x.svelte-1gul89x:is(.hide){margin-left:100vw;transition:all .2s}.contents.svelte-1gul89x.svelte-1gul89x{margin:auto;padding:var(--padding);max-width:var(--content-constrain);min-width:300px}button.close.svelte-1gul89x.svelte-1gul89x{display:inline-block;margin:0;padding:0;border:0;background:transparent;transition:all .3s ease;transform-origin:center;transform:scale(1)}button.close.svelte-1gul89x.svelte-1gul89x:hover{transform:scale(1.1)}button.close.svelte-1gul89x.svelte-1gul89x:active,button.close.svelte-1gul89x.svelte-1gul89x:focus{border:0;background:transparent}",
  map: `{"version":3,"file":"Block_SearchCard.svelte","sources":["Block_SearchCard.svelte"],"sourcesContent":["<div class=\\"searchcard\\" class:hide={!display}>\\n\\t<button class=\\"close\\" on:click={hideSearchCard} title=\\"Close\\">\\n\\t\\t<img\\n\\t\\t\\talt=\\"Close\\"\\n\\t\\t\\theight=\\"40\\"\\n\\t\\t\\twidth=\\"40\\"\\n\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\tsrc=\\"/img/icon-close.svg\\"\\n\\t\\t\\tclass=\\"icon\\"\\n\\t\\t/>\\n\\t</button>\\n\\t<div class=\\"contents\\">\\n\\t\\t<h1>Search Our Blog</h1>\\n\\t\\t<form action=\\"/immigration-law-blog\\" method=\\"get\\">\\n\\t\\t\\t<div class=\\"form-row\\">\\n\\t\\t\\t\\t<label for=\\"s\\">Search:</label>\\n\\t\\t\\t\\t<input\\n\\t\\t\\t\\t\\ttype=\\"TEXT\\"\\n\\t\\t\\t\\t\\tname=\\"s\\"\\n\\t\\t\\t\\t\\tvalue=\\"\\"\\n\\t\\t\\t\\t\\tplaceholder=\\"Search For...\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t</div>\\n\\t\\t\\t<br />\\n\\t\\t\\t<div class=\\"form-row button-row\\">\\n\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\ttype=\\"submit\\"\\n\\t\\t\\t\\t\\tvalue=\\"Submit\\"\\n\\t\\t\\t\\t\\talt=\\"Search Our Blog\\"\\n\\t\\t\\t\\t\\ttitle=\\"Search\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\tSearch\\n\\t\\t\\t\\t</button>\\n\\t\\t\\t</div>\\n\\t\\t</form>\\n\\t</div>\\n</div>\\n\\n<script>function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\nimport { onMount } from 'svelte';\\n/* ## MILK ## */\\n\\n/* ## Variables ## */\\n\\nvar display = false;\\n/* ## Main ## */\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  var _window;\\n\\n  if (!((_window = window) != null && _window.searchCard)) {\\n    window.searchCard = {};\\n  }\\n\\n  window.searchCard.show = showSearchCard;\\n  window.searchCard.hide = hideSearchCard;\\n}));\\n/* ## Methods & Function ## */\\n\\nvar showSearchCard = () => {\\n  display = true;\\n};\\n\\nvar hideSearchCard = () => {\\n  display = false;\\n};</script>\\n\\n<style>.searchcard{position:fixed;top:0;left:0;width:100vw;min-width:100%;height:100vh;min-height:100%;display:grid;background:#fff;background:var(--background-white,#fff);text-align:center;z-index:999999}.close{position:absolute;top:2vw;right:4vw;z-index:9999}.close:hover img{filter:invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(70%) contrast(97%)}@media screen and (max-width:650px){.close{right:unset;left:4vw}}.searchcard:not(.hide){margin-left:0;transition:all .5s}.searchcard:is(.hide){margin-left:100vw;transition:all .2s}.contents{margin:auto;padding:var(--padding);max-width:var(--content-constrain);min-width:300px}button.close{display:inline-block;margin:0;padding:0;border:0;background:transparent;transition:all .3s ease;transform-origin:center;transform:scale(1)}button.close:hover{transform:scale(1.1)}button.close:active,button.close:focus{border:0;background:transparent}</style>\\n"],"names":[],"mappings":"AAsEO,yCAAW,CAAC,SAAS,KAAK,CAAC,IAAI,CAAC,CAAC,KAAK,CAAC,CAAC,MAAM,KAAK,CAAC,UAAU,IAAI,CAAC,OAAO,KAAK,CAAC,WAAW,IAAI,CAAC,QAAQ,IAAI,CAAC,WAAW,IAAI,CAAC,WAAW,IAAI,kBAAkB,CAAC,IAAI,CAAC,CAAC,WAAW,MAAM,CAAC,QAAQ,MAAM,CAAC,oCAAM,CAAC,SAAS,QAAQ,CAAC,IAAI,GAAG,CAAC,MAAM,GAAG,CAAC,QAAQ,IAAI,CAAC,qBAAM,MAAM,CAAC,kBAAG,CAAC,OAAO,OAAO,GAAG,CAAC,CAAC,MAAM,GAAG,CAAC,CAAC,SAAS,KAAK,CAAC,CAAC,WAAW,MAAM,CAAC,CAAC,WAAW,GAAG,CAAC,CAAC,SAAS,GAAG,CAAC,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,oCAAM,CAAC,MAAM,KAAK,CAAC,KAAK,GAAG,CAAC,CAAC,yCAAW,KAAK,KAAK,CAAC,CAAC,YAAY,CAAC,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,yCAAW,IAAI,KAAK,CAAC,CAAC,YAAY,KAAK,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,uCAAS,CAAC,OAAO,IAAI,CAAC,QAAQ,IAAI,SAAS,CAAC,CAAC,UAAU,IAAI,mBAAmB,CAAC,CAAC,UAAU,KAAK,CAAC,MAAM,oCAAM,CAAC,QAAQ,YAAY,CAAC,OAAO,CAAC,CAAC,QAAQ,CAAC,CAAC,OAAO,CAAC,CAAC,WAAW,WAAW,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,iBAAiB,MAAM,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,MAAM,oCAAM,MAAM,CAAC,UAAU,MAAM,GAAG,CAAC,CAAC,MAAM,oCAAM,OAAO,CAAC,MAAM,oCAAM,MAAM,CAAC,OAAO,CAAC,CAAC,WAAW,WAAW,CAAC"}`
};
function asyncGeneratorStep$t(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$t(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$t(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$t(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Block_SearchCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var display = false;
  onMount(/* @__PURE__ */ _asyncToGenerator$t(function* () {
    var _window;
    if (!((_window = window) != null && _window.searchCard)) {
      window.searchCard = {};
    }
    window.searchCard.show = showSearchCard;
    window.searchCard.hide = hideSearchCard;
  }));
  var showSearchCard = () => {
    display = true;
  };
  var hideSearchCard = () => {
    display = false;
  };
  $$result.css.add(css$x);
  return `<div class="${["searchcard svelte-1gul89x", !display ? "hide" : ""].join(" ").trim()}"><button class="${"close svelte-1gul89x"}" title="${"Close"}"><img alt="${"Close"}" height="${"40"}" width="${"40"}" loading="${"lazy"}" src="${"/img/icon-close.svg"}" class="${"icon svelte-1gul89x"}"></button>
	<div class="${"contents svelte-1gul89x"}"><h1>Search Our Blog</h1>
		<form action="${"/immigration-law-blog"}" method="${"get"}"><div class="${"form-row"}"><label for="${"s"}">Search:</label>
				<input type="${"TEXT"}" name="${"s"}" value="${""}" placeholder="${"Search For..."}"></div>
			<br>
			<div class="${"form-row button-row"}"><button type="${"submit"}" value="${"Submit"}" alt="${"Search Our Blog"}" title="${"Search"}">Search
				</button></div></form></div>
</div>`;
});
var GA_LOCAL_STORAGE_KEY = "ga:clientId";
var GA_COOKIE_KEY = "gaCookie";
function asyncGeneratorStep$s(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$s(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$s(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$s(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const GoogleAnalytics = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var {gacode = "UA-XXXXX-Y"} = $$props;
  var {rootdomain = "example.com"} = $$props;
  onMount(/* @__PURE__ */ _asyncToGenerator$s(function* () {
    if (window.localStorage) {
      ga("create", gacode, {
        storage: "none",
        clientId: window.localStorage.getItem(GA_LOCAL_STORAGE_KEY)
      });
      ga(function(tracker) {
        window.localStorage.setItem(GA_LOCAL_STORAGE_KEY, tracker.get("clientId"));
      });
    } else {
      ga("create", gacode, {
        cookieName: GA_COOKIE_KEY,
        cookieDomain: rootdomain,
        cookieExpires: 60 * 60 * 24 * 28,
        cookieUpdate: "false",
        cookieFlags: "SameSite=None; Secure"
      });
    }
  }));
  if ($$props.gacode === void 0 && $$bindings.gacode && gacode !== void 0)
    $$bindings.gacode(gacode);
  if ($$props.rootdomain === void 0 && $$bindings.rootdomain && rootdomain !== void 0)
    $$bindings.rootdomain(rootdomain);
  return `${$$result.head += `<link rel="${"dns-prefetch"}" href="${"https://www.google-analytics.com"}" data-svelte="svelte-g3j0bx"><link rel="${"preload"}" href="${"https://www.google-analytics.com/analytics.js"}" as="${"script"}" data-svelte="svelte-g3j0bx"><script async src="${"https://www.google-analytics.com/analytics.js"}" data-svelte="svelte-g3j0bx"></script>`, ""}`;
});
var Layout_Main_svelte = ".layout-main.svelte-1o2cp6u{display:grid;margin:0;padding:0;min-height:100vh;grid-template-rows:auto auto 1fr auto auto;z-index:10}.page-content.svelte-1o2cp6u{display:block}";
const css$w = {
  code: ".layout-main.svelte-1o2cp6u{display:grid;margin:0;padding:0;min-height:100vh;grid-template-rows:auto auto 1fr auto auto;z-index:10}.page-content.svelte-1o2cp6u{display:block}",
  map: `{"version":3,"file":"Layout_Main.svelte","sources":["Layout_Main.svelte"],"sourcesContent":["<div {id} class=\\"layout-main\\">\\n\\t<Block_StickyHeader type=\\"sticky-hide\\">\\n\\t\\t<Block_Header id=\\"header\\" blockstyle=\\"block-style01\\" />\\n\\t\\t<Block_Navigation id=\\"main-nav\\" blockstyle=\\"block-style01\\" />\\n\\t</Block_StickyHeader>\\n\\t<div class=\\"page-content\\"><slot /></div>\\n\\t<Block_Footer id=\\"footer\\" blockstyle=\\"block-style04\\" />\\n\\t<Block_AbsoluteFooter id=\\"footer-absolute\\" blockstyle=\\"block-style06\\" />\\n\\t<CalendarCard />\\n\\t<CallingCard />\\n\\t<!-- <Block_PaymentCard /> -->\\n\\t<Block_SearchCard />\\n\\t<!-- <Block_GoogleTagManager /> -->\\n\\t<GoogleAnalytics gacode=\\"UA-5989226-33\\" rootdomain=\\"immigrationlawnj.com\\" />\\n</div>\\n\\n<script>import Block_StickyHeader from '$milk/lib/Block_StickyHeader.svelte';\\nimport Block_Header from '$theme/Block_Header.svelte';\\nimport Block_Navigation from '$theme/Block_Navigation.svelte';\\nimport Block_Footer from '$theme/Block_Footer.svelte';\\nimport Block_AbsoluteFooter from '$milk/lib/Block_AbsoluteFooter.svelte';\\nimport CalendarCard from '$milk/lib/CalendarCard.svelte';\\nimport CallingCard from '$theme/CallingCard.svelte'; // import Block_PaymentCard from '$theme/Block_PaymentCard.svelte';\\n\\nimport Block_SearchCard from '$theme/Block_SearchCard.svelte'; // import Block_GoogleTagManager from '$theme/Block_GoogleTagManager.svelte';\\n\\nimport GoogleAnalytics from '$milk/lib/GoogleAnalytics.svelte';\\nvar id;\\nexport { id };</script>\\n\\n<style>.layout-main{display:grid;margin:0;padding:0;min-height:100vh;grid-template-rows:auto auto 1fr auto auto;z-index:10}.page-content{display:block}</style>\\n"],"names":[],"mappings":"AA8BO,2BAAY,CAAC,QAAQ,IAAI,CAAC,OAAO,CAAC,CAAC,QAAQ,CAAC,CAAC,WAAW,KAAK,CAAC,mBAAmB,IAAI,CAAC,IAAI,CAAC,GAAG,CAAC,IAAI,CAAC,IAAI,CAAC,QAAQ,EAAE,CAAC,4BAAa,CAAC,QAAQ,KAAK,CAAC"}`
};
const Layout_Main = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var {id} = $$props;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  $$result.css.add(css$w);
  return `<div${add_attribute("id", id, 0)} class="${"layout-main svelte-1o2cp6u"}">${validate_component(Block_StickyHeader, "Block_StickyHeader").$$render($$result, {type: "sticky-hide"}, {}, {
    default: () => `${validate_component(Block_Header, "Block_Header").$$render($$result, {
      id: "header",
      blockstyle: "block-style01"
    }, {}, {})}
		${validate_component(Block_Navigation, "Block_Navigation").$$render($$result, {
      id: "main-nav",
      blockstyle: "block-style01"
    }, {}, {})}`
  })}
	<div class="${"page-content svelte-1o2cp6u"}">${slots.default ? slots.default({}) : ``}</div>
	${validate_component(Block_Footer, "Block_Footer").$$render($$result, {
    id: "footer",
    blockstyle: "block-style04"
  }, {}, {})}
	${validate_component(Block_AbsoluteFooter, "Block_AbsoluteFooter").$$render($$result, {
    id: "footer-absolute",
    blockstyle: "block-style06"
  }, {}, {})}
	${validate_component(CalendarCard, "CalendarCard").$$render($$result, {}, {}, {})}
	${validate_component(CallingCard, "CallingCard").$$render($$result, {}, {}, {})}
	
	${validate_component(Block_SearchCard, "Block_SearchCard").$$render($$result, {}, {}, {})}
	
	${validate_component(GoogleAnalytics, "GoogleAnalytics").$$render($$result, {
    gacode: "UA-5989226-33",
    rootdomain: "immigrationlawnj.com"
  }, {}, {})}
</div>`;
});
var Hero_svelte = ".hero.svelte-10y0g9.svelte-10y0g9{width:100%;display:grid;align-items:center;justify-items:center;place-items:center;background-size:cover;overflow:hidden;text-align:center;position:relative;min-height:50vh}.hero-background.svelte-10y0g9.svelte-10y0g9{width:100%;height:100%;position:absolute;top:0;left:0;z-index:1;background-position:50%}.hero-inner.svelte-10y0g9.svelte-10y0g9{position:relative;z-index:10;max-width:1200px;max-width:var(--content-constrain,1200px);text-align:center;padding:var(--padding-small)}.hero.svelte-10y0g9:not(.parallax) .hero-background.svelte-10y0g9{margin-left:-50%}.bg-image.svelte-10y0g9.svelte-10y0g9{position:absolute;-o-object-fit:cover;object-fit:cover;background-position:50%}@media screen and (min-width:1400px){.hero-background.svelte-10y0g9.svelte-10y0g9{filter:blur(.5px)}}";
const css$v = {
  code: ".hero.svelte-10y0g9.svelte-10y0g9{width:100%;display:grid;align-items:center;justify-items:center;place-items:center;background-size:cover;overflow:hidden;text-align:center;position:relative;min-height:50vh}.hero-background.svelte-10y0g9.svelte-10y0g9{width:100%;height:100%;position:absolute;top:0;left:0;z-index:1;background-position:50%}.hero-inner.svelte-10y0g9.svelte-10y0g9{position:relative;z-index:10;max-width:1200px;max-width:var(--content-constrain,1200px);text-align:center;padding:var(--padding-small)}.hero.svelte-10y0g9:not(.parallax) .hero-background.svelte-10y0g9{margin-left:-50%}.bg-image.svelte-10y0g9.svelte-10y0g9{position:absolute;-o-object-fit:cover;object-fit:cover;background-position:50%}@media screen and (min-width:1400px){.hero-background.svelte-10y0g9.svelte-10y0g9{filter:blur(.5px)}}",
  map: `{"version":3,"file":"Hero.svelte","sources":["Hero.svelte"],"sourcesContent":["<div\\n\\t{id}\\n\\tclass={\`hero \${add_class}\`}\\n\\tclass:parallax={parallax == 'true'}\\n\\tstyle={\`/* aspect-ratio: \${aspect_ratio}; */ width: 100%; height: -webkit-calc(100vw / 16 * 9); height: -moz-calc(100vw / 16 * 9); height: calc(100vw / 16 * 9);\`}\\n>\\n\\t<div class=\\"hero-background\\" {style}>\\n\\t\\t{#if parallax != 'true'}\\n\\t\\t\\t<picture>\\n\\t\\t\\t\\t{#if avif_srcset && avif_srcset.length > 0}\\n\\t\\t\\t\\t\\t<source type=\\"image/avif\\" srcset={avif_srcset} />\\n\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t{#if webp_srcset && avif_srcset.length > 0}\\n\\t\\t\\t\\t\\t<source type=\\"image/webp\\" srcset={webp_srcset} />\\n\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\tclass=\\"bg-image\\"\\n\\t\\t\\t\\t\\tsrc={image_url}\\n\\t\\t\\t\\t\\tsrcset={img_srcset}\\n\\t\\t\\t\\t\\tstyle={img_style}\\n\\t\\t\\t\\t\\talt={title}\\n\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\twidth=\\"1600\\"\\n\\t\\t\\t\\t\\theight=\\"900\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t</picture>\\n\\t\\t{/if}\\n\\t</div>\\n\\t<div class=\\"hero-inner\\"><div class=\\"hero-content\\"><slot /></div></div>\\n</div>\\n\\n<script>function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount } from 'svelte';\\n/* ## MILK ## */\\n\\nimport { milk } from '$milk/milk.js';\\nvar id;\\nvar add_class = '';\\nvar image_url;\\nvar image_position = 'center center';\\nvar parallax = false;\\nvar aspect_ratio = '16/9';\\nvar img_srcset;\\nvar avif_srcset;\\nvar webp_srcset;\\nvar title = '';\\n\\n$: image_attachment = parallax != 'true' ? 'scroll' : 'fixed';\\n\\n$: style = parallax != 'true' ? \\"background: transparent none;\\" : \\"background: transparent url('\\" + image_url + \\"') \\" + image_position + \\" no-repeat; background-attachment: \\" + image_attachment + \\"; background-size: \\" + background_size;\\n\\n$: background_size = parallax != 'true' ? 'calc(100% + 2px) auto' : 'auto max(100vh, calc(100vw / 16 * 9))';\\n\\n$: img_width = parallax != 'true' ? '100%' : '100%';\\n\\n$: img_height = parallax != 'true' ? 'auto' : '100vh';\\n\\n$: img_position = parallax != 'true' ? 'absolute' : 'fixed';\\n\\n$: img_style = \\"width: \\" + img_width + \\" !important; height: auto !important; min-height: 100%; position: \\" + img_position + \\";\\"; // $: img_srcset =\\n// \\timg_srcset && img_srcset.length > 0\\n// \\t\\t? addDomainIfMissing(img_srcset)\\n// \\t\\t: addDomainIfMissing(image_url);\\n// let img = '';\\n// let wepb = '';\\n// let avif = '';\\n// $: image_url = addDomainIfMissing(image_url);\\n// $: avif_srcset = addDomainIfMissing(avif_srcset);\\n// $: webp_srcset = addDomainIfMissing(webp_srcset);\\n\\n\\nvar addDomainIfMissing = tmp => {\\n  // return url;\\n  if (tmp == '' || tmp && tmp.startsWith('http')) {\\n    // console.log(tmp);\\n    return tmp;\\n  } else {\\n    // console.log(tmp);\\n    // console.log(\`\${$milk.site.url}\${tmp}\`);\\n    return \\"\\" + $milk.site.url + tmp;\\n  }\\n};\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  var _window, _window$location, _window$location$href;\\n\\n  if (!((_window = window) != null && (_window$location = _window.location) != null && (_window$location$href = _window$location.href) != null && _window$location$href.includes('localhost'))) {\\n    img_srcset = img_srcset && img_srcset.length > 0 ? addDomainIfMissing(img_srcset) : addDomainIfMissing(image_url);\\n    image_url = addDomainIfMissing(image_url);\\n    avif_srcset = addDomainIfMissing(avif_srcset);\\n    webp_srcset = addDomainIfMissing(webp_srcset);\\n  } else {\\n    img_srcset = img_srcset && img_srcset.length > 0 ? img_srcset : image_url;\\n  }\\n}));\\nexport { id, add_class, image_url, image_position, parallax, aspect_ratio, img_srcset, avif_srcset, webp_srcset, title };</script>\\n\\n<style>.hero{width:100%;display:grid;align-items:center;justify-items:center;place-items:center;background-size:cover;overflow:hidden;text-align:center;position:relative;min-height:50vh}.hero-background{width:100%;height:100%;position:absolute;top:0;left:0;z-index:1;background-position:50%}.hero-inner{position:relative;z-index:10;max-width:1200px;max-width:var(--content-constrain,1200px);text-align:center;padding:var(--padding-small)}.hero:not(.parallax) .hero-background{margin-left:-50%}.bg-image{position:absolute;-o-object-fit:cover;object-fit:cover;background-position:50%}@media screen and (min-width:1400px){.hero-background{filter:blur(.5px)}}</style>\\n"],"names":[],"mappings":"AAqGO,iCAAK,CAAC,MAAM,IAAI,CAAC,QAAQ,IAAI,CAAC,YAAY,MAAM,CAAC,cAAc,MAAM,CAAC,YAAY,MAAM,CAAC,gBAAgB,KAAK,CAAC,SAAS,MAAM,CAAC,WAAW,MAAM,CAAC,SAAS,QAAQ,CAAC,WAAW,IAAI,CAAC,4CAAgB,CAAC,MAAM,IAAI,CAAC,OAAO,IAAI,CAAC,SAAS,QAAQ,CAAC,IAAI,CAAC,CAAC,KAAK,CAAC,CAAC,QAAQ,CAAC,CAAC,oBAAoB,GAAG,CAAC,uCAAW,CAAC,SAAS,QAAQ,CAAC,QAAQ,EAAE,CAAC,UAAU,MAAM,CAAC,UAAU,IAAI,mBAAmB,CAAC,MAAM,CAAC,CAAC,WAAW,MAAM,CAAC,QAAQ,IAAI,eAAe,CAAC,CAAC,mBAAK,KAAK,SAAS,CAAC,CAAC,8BAAgB,CAAC,YAAY,IAAI,CAAC,qCAAS,CAAC,SAAS,QAAQ,CAAC,cAAc,KAAK,CAAC,WAAW,KAAK,CAAC,oBAAoB,GAAG,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,MAAM,CAAC,CAAC,4CAAgB,CAAC,OAAO,KAAK,IAAI,CAAC,CAAC,CAAC"}`
};
function asyncGeneratorStep$r(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$r(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$r(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$r(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Hero = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let image_attachment;
  let style;
  let background_size;
  let img_width;
  let img_position;
  let img_style;
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var {id} = $$props;
  var {add_class = ""} = $$props;
  var {image_url} = $$props;
  var {image_position = "center center"} = $$props;
  var {parallax = false} = $$props;
  var {aspect_ratio = "16/9"} = $$props;
  var {img_srcset} = $$props;
  var {avif_srcset} = $$props;
  var {webp_srcset} = $$props;
  var {title = ""} = $$props;
  var addDomainIfMissing = (tmp) => {
    if (tmp == "" || tmp && tmp.startsWith("http")) {
      return tmp;
    } else {
      return "" + $milk.site.url + tmp;
    }
  };
  onMount(/* @__PURE__ */ _asyncToGenerator$r(function* () {
    var _window, _window$location, _window$location$href;
    if (!((_window = window) != null && (_window$location = _window.location) != null && (_window$location$href = _window$location.href) != null && _window$location$href.includes("localhost"))) {
      img_srcset = img_srcset && img_srcset.length > 0 ? addDomainIfMissing(img_srcset) : addDomainIfMissing(image_url);
      image_url = addDomainIfMissing(image_url);
      avif_srcset = addDomainIfMissing(avif_srcset);
      webp_srcset = addDomainIfMissing(webp_srcset);
    } else {
      img_srcset = img_srcset && img_srcset.length > 0 ? img_srcset : image_url;
    }
  }));
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.add_class === void 0 && $$bindings.add_class && add_class !== void 0)
    $$bindings.add_class(add_class);
  if ($$props.image_url === void 0 && $$bindings.image_url && image_url !== void 0)
    $$bindings.image_url(image_url);
  if ($$props.image_position === void 0 && $$bindings.image_position && image_position !== void 0)
    $$bindings.image_position(image_position);
  if ($$props.parallax === void 0 && $$bindings.parallax && parallax !== void 0)
    $$bindings.parallax(parallax);
  if ($$props.aspect_ratio === void 0 && $$bindings.aspect_ratio && aspect_ratio !== void 0)
    $$bindings.aspect_ratio(aspect_ratio);
  if ($$props.img_srcset === void 0 && $$bindings.img_srcset && img_srcset !== void 0)
    $$bindings.img_srcset(img_srcset);
  if ($$props.avif_srcset === void 0 && $$bindings.avif_srcset && avif_srcset !== void 0)
    $$bindings.avif_srcset(avif_srcset);
  if ($$props.webp_srcset === void 0 && $$bindings.webp_srcset && webp_srcset !== void 0)
    $$bindings.webp_srcset(webp_srcset);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  $$result.css.add(css$v);
  image_attachment = parallax != "true" ? "scroll" : "fixed";
  background_size = parallax != "true" ? "calc(100% + 2px) auto" : "auto max(100vh, calc(100vw / 16 * 9))";
  style = parallax != "true" ? "background: transparent none;" : "background: transparent url('" + image_url + "') " + image_position + " no-repeat; background-attachment: " + image_attachment + "; background-size: " + background_size;
  img_width = parallax != "true" ? "100%" : "100%";
  img_position = parallax != "true" ? "absolute" : "fixed";
  img_style = "width: " + img_width + " !important; height: auto !important; min-height: 100%; position: " + img_position + ";";
  $$unsubscribe_milk();
  return `<div${add_attribute("id", id, 0)} class="${[
    escape(null_to_empty(`hero ${add_class}`)) + " svelte-10y0g9",
    parallax == "true" ? "parallax" : ""
  ].join(" ").trim()}"${add_attribute("style", `/* aspect-ratio: ${aspect_ratio}; */ width: 100%; height: -webkit-calc(100vw / 16 * 9); height: -moz-calc(100vw / 16 * 9); height: calc(100vw / 16 * 9);`, 0)}><div class="${"hero-background svelte-10y0g9"}"${add_attribute("style", style, 0)}>${parallax != "true" ? `<picture>${avif_srcset && avif_srcset.length > 0 ? `<source type="${"image/avif"}"${add_attribute("srcset", avif_srcset, 0)}>` : ``}
				${webp_srcset && avif_srcset.length > 0 ? `<source type="${"image/webp"}"${add_attribute("srcset", webp_srcset, 0)}>` : ``}
				<img class="${"bg-image svelte-10y0g9"}"${add_attribute("src", image_url, 0)}${add_attribute("srcset", img_srcset, 0)}${add_attribute("style", img_style, 0)}${add_attribute("alt", title, 0)} loading="${"lazy"}" width="${"1600"}" height="${"900"}"></picture>` : ``}</div>
	<div class="${"hero-inner svelte-10y0g9"}"><div class="${"hero-content"}">${slots.default ? slots.default({}) : ``}</div></div>
</div>`;
});
var ScrollTo_svelte = "div.svelte-deo138{text-align:center}button.svelte-deo138{border:0!important;background:transparent!important}svg.svelte-deo138{width:40px;height:auto;margin:0 auto}";
const css$u = {
  code: "div.svelte-deo138{text-align:center}button.svelte-deo138{border:0!important;background:transparent!important}svg.svelte-deo138{width:40px;height:auto;margin:0 auto}",
  map: `{"version":3,"file":"ScrollTo.svelte","sources":["ScrollTo.svelte"],"sourcesContent":["<div class=\\"scroll-to\\">\\n\\t<button on:click={scrollTo(target)} title=\\"ScrollTo\\">\\n\\t\\t<svg\\n\\t\\t\\taria-hidden=\\"true\\"\\n\\t\\t\\tfocusable=\\"false\\"\\n\\t\\t\\trole=\\"img\\"\\n\\t\\t\\txmlns=\\"http://www.w3.org/2000/svg\\"\\n\\t\\t\\tviewBox=\\"0 0 448 512\\"\\n\\t\\t\\t><path\\n\\t\\t\\t\\tfill=\\"currentColor\\"\\n\\t\\t\\t\\td=\\"M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z\\"\\n\\t\\t\\t/></svg\\n\\t\\t>\\n\\t</button>\\n</div>\\n\\n<script>function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount } from 'svelte';\\n/* ## Variables ## */\\n\\nvar direction = 'down';\\nvar target;\\n\\nvar scrollTo = () => {};\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  scrollTo = target => {\\n    if (target) {\\n      var elem = document.querySelector(target);\\n\\n      if (elem) {\\n        elem.scrollIntoView({\\n          behavior: 'smooth',\\n          block: 'end',\\n          inline: 'nearest'\\n        });\\n      }\\n    }\\n  };\\n}));\\nexport { direction, target };</script>\\n\\n<style>div{text-align:center}button{border:0!important;background:transparent!important}svg{width:40px;height:auto;margin:0 auto}</style>\\n"],"names":[],"mappings":"AA8CO,iBAAG,CAAC,WAAW,MAAM,CAAC,oBAAM,CAAC,OAAO,CAAC,UAAU,CAAC,WAAW,WAAW,UAAU,CAAC,iBAAG,CAAC,MAAM,IAAI,CAAC,OAAO,IAAI,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC"}`
};
function asyncGeneratorStep$q(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$q(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$q(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$q(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const ScrollTo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var {direction = "down"} = $$props;
  var {target} = $$props;
  onMount(/* @__PURE__ */ _asyncToGenerator$q(function* () {
  }));
  if ($$props.direction === void 0 && $$bindings.direction && direction !== void 0)
    $$bindings.direction(direction);
  if ($$props.target === void 0 && $$bindings.target && target !== void 0)
    $$bindings.target(target);
  $$result.css.add(css$u);
  return `<div class="${"scroll-to svelte-deo138"}"><button title="${"ScrollTo"}" class="${"svelte-deo138"}"><svg aria-hidden="${"true"}" focusable="${"false"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 448 512"}" class="${"svelte-deo138"}"><path fill="${"currentColor"}" d="${"M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"}"></path></svg></button>
</div>`;
});
var Block_CallToAction_svelte = ".calltoaction.svelte-1a137or.svelte-1a137or{display:block;text-align:center}.calltoaction-inner.svelte-1a137or.svelte-1a137or{margin:0 auto;max-width:var(--content-constrain)}h2.title.svelte-1a137or.svelte-1a137or{font-size:var(--extralarge-fontsize);color:#fff;color:var(--color-white,#fff)}button.svelte-1a137or.svelte-1a137or{transition:all .3s ease;transform-origin:center;transform:scale(1)}button.svelte-1a137or.svelte-1a137or:hover{transform:scale(1.1)}button.call-button.svelte-1a137or.svelte-1a137or{color:#fff;color:var(--color-white,#fff);text-decoration:none;font-size:var(--large-fontsize);padding:10px 35px 10px 12px;border:3px solid #fff;border:3px solid var(--color-white,#fff);background:transparent;margin:25px 10px 15px;white-space:nowrap;min-width:225px;display:inline-block}button.call-button.svelte-1a137or.svelte-1a137or:hover{border:3px solid var(--color-three)}button.call-button.svelte-1a137or span.svelte-1a137or{white-space:nowrap;position:relative;display:inline-block;line-height:40px;vertical-align:middle}.caption.svelte-1a137or.svelte-1a137or{text-transform:uppercase;font-size:12px;letter-spacing:1px}hr.svelte-1a137or.svelte-1a137or{display:block;margin:25px auto 0;border:0;border-top:3px solid #fff;border-top:3px solid var(--color-white,#fff)}.actions.svelte-1a137or.svelte-1a137or{display:grid;grid-template-columns:1fr 1fr 1fr}.actions.svelte-1a137or>div.svelte-1a137or{text-align:center;display:grid;align-content:center;justify-content:center;place-content:center}.actions.svelte-1a137or button.svelte-1a137or{background:none;display:block;width:100%;border:0;color:#fff;color:var(--color-white,#fff);font-size:var(--base-fontsize);text-align:center}.actions.svelte-1a137or button.svelte-1a137or:hover{filter:brightness(.55) sepia(1) saturate(300%) hue-rotate(5deg) brightness(1.16) saturate(85%)}.actions.svelte-1a137or button span.svelte-1a137or{display:block;text-align:center}.icon.svelte-1a137or.svelte-1a137or{margin:30px auto 15px;max-width:30px;max-height:30px;width:auto;height:auto;vertical-align:middle}.icon-phone.svelte-1a137or.svelte-1a137or{margin:0;max-width:40px;max-height:40px;transform-origin:center center}@-webkit-keyframes svelte-1a137or-tada{0%{transform:scale(1)}10%,20%{transform:scale(.9) rotate(-8deg)}30%,50%,70%{transform:scale(1.2) rotate(8deg)}40%,60%{transform:scale(1.2) rotate(-8deg)}80%,to{transform:scale(1) rotate(0)}}@keyframes svelte-1a137or-tada{0%{transform:scale(1)}10%,20%{transform:scale(.9) rotate(-8deg)}30%,50%,70%{transform:scale(1.2) rotate(8deg)}40%,60%{transform:scale(1.2) rotate(-8deg)}80%,to{transform:scale(1) rotate(0)}}button.svelte-1a137or:hover .icon-phone.svelte-1a137or{-webkit-animation:svelte-1a137or-tada 2s linear 1;animation:svelte-1a137or-tada 2s linear 1}@media screen and (max-width:475px){.actions.svelte-1a137or button.svelte-1a137or{font-size:var(--base-fontsiz)}}@media screen and (max-width:400px){.actions.svelte-1a137or.svelte-1a137or{display:block;margin-left:-2vw;margin-right:-2vw}}@media screen and (max-width:650px){.call-button.svelte-1a137or span.svelte-1a137or{font-size:.9em}}";
const css$t = {
  code: ".calltoaction.svelte-1a137or.svelte-1a137or{display:block;text-align:center}.calltoaction-inner.svelte-1a137or.svelte-1a137or{margin:0 auto;max-width:var(--content-constrain)}h2.title.svelte-1a137or.svelte-1a137or{font-size:var(--extralarge-fontsize);color:#fff;color:var(--color-white,#fff)}button.svelte-1a137or.svelte-1a137or{transition:all .3s ease;transform-origin:center;transform:scale(1)}button.svelte-1a137or.svelte-1a137or:hover{transform:scale(1.1)}button.call-button.svelte-1a137or.svelte-1a137or{color:#fff;color:var(--color-white,#fff);text-decoration:none;font-size:var(--large-fontsize);padding:10px 35px 10px 12px;border:3px solid #fff;border:3px solid var(--color-white,#fff);background:transparent;margin:25px 10px 15px;white-space:nowrap;min-width:225px;display:inline-block}button.call-button.svelte-1a137or.svelte-1a137or:hover{border:3px solid var(--color-three)}button.call-button.svelte-1a137or span.svelte-1a137or{white-space:nowrap;position:relative;display:inline-block;line-height:40px;vertical-align:middle}.caption.svelte-1a137or.svelte-1a137or{text-transform:uppercase;font-size:12px;letter-spacing:1px}hr.svelte-1a137or.svelte-1a137or{display:block;margin:25px auto 0;border:0;border-top:3px solid #fff;border-top:3px solid var(--color-white,#fff)}.actions.svelte-1a137or.svelte-1a137or{display:grid;grid-template-columns:1fr 1fr 1fr}.actions.svelte-1a137or>div.svelte-1a137or{text-align:center;display:grid;align-content:center;justify-content:center;place-content:center}.actions.svelte-1a137or button.svelte-1a137or{background:none;display:block;width:100%;border:0;color:#fff;color:var(--color-white,#fff);font-size:var(--base-fontsize);text-align:center}.actions.svelte-1a137or button.svelte-1a137or:hover{filter:brightness(.55) sepia(1) saturate(300%) hue-rotate(5deg) brightness(1.16) saturate(85%)}.actions.svelte-1a137or button span.svelte-1a137or{display:block;text-align:center}.icon.svelte-1a137or.svelte-1a137or{margin:30px auto 15px;max-width:30px;max-height:30px;width:auto;height:auto;vertical-align:middle}.icon-phone.svelte-1a137or.svelte-1a137or{margin:0;max-width:40px;max-height:40px;transform-origin:center center}@-webkit-keyframes svelte-1a137or-tada{0%{transform:scale(1)}10%,20%{transform:scale(.9) rotate(-8deg)}30%,50%,70%{transform:scale(1.2) rotate(8deg)}40%,60%{transform:scale(1.2) rotate(-8deg)}80%,to{transform:scale(1) rotate(0)}}@keyframes svelte-1a137or-tada{0%{transform:scale(1)}10%,20%{transform:scale(.9) rotate(-8deg)}30%,50%,70%{transform:scale(1.2) rotate(8deg)}40%,60%{transform:scale(1.2) rotate(-8deg)}80%,to{transform:scale(1) rotate(0)}}button.svelte-1a137or:hover .icon-phone.svelte-1a137or{-webkit-animation:svelte-1a137or-tada 2s linear 1;animation:svelte-1a137or-tada 2s linear 1}@media screen and (max-width:475px){.actions.svelte-1a137or button.svelte-1a137or{font-size:var(--base-fontsiz)}}@media screen and (max-width:400px){.actions.svelte-1a137or.svelte-1a137or{display:block;margin-left:-2vw;margin-right:-2vw}}@media screen and (max-width:650px){.call-button.svelte-1a137or span.svelte-1a137or{font-size:.9em}}",
  map: `{"version":3,"file":"Block_CallToAction.svelte","sources":["Block_CallToAction.svelte"],"sourcesContent":["<div {id} class={blockclass}>\\n\\t<div class=\\"calltoaction-inner\\">\\n\\t\\t<h2 class=\\"title\\">Let Us Get To Work On Your Case Now</h2>\\n\\t\\t<div class=\\"call-button\\">\\n\\t\\t\\t<button class=\\"call-button\\" on:click={doCall} title=\\"Make Call\\">\\n\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\tsrc=\\"/img/icon-phone-yellow.svg\\"\\n\\t\\t\\t\\t\\tclass=\\"icon icon-phone\\"\\n\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\talt=\\"Call Us\\"\\n\\t\\t\\t\\t\\twidth=\\"40\\"\\n\\t\\t\\t\\t\\theight=\\"40\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t\\t<span>(973) 642-1111</span>\\n\\t\\t\\t</button>\\n\\t\\t</div>\\n\\t\\t<div class=\\"caption\\">We return most calls within 24 hours</div>\\n\\t\\t<hr />\\n\\t\\t<div class=\\"actions\\">\\n\\t\\t\\t<div class=\\"action\\">\\n\\t\\t\\t\\t<button on:click={doEmail} title=\\"Send Email\\">\\n\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\tsrc=\\"/img/icon-email.svg\\"\\n\\t\\t\\t\\t\\t\\tclass=\\"icon icon-email\\"\\n\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\talt=\\"Email Us\\"\\n\\t\\t\\t\\t\\t\\twidth=\\"30\\"\\n\\t\\t\\t\\t\\t\\theight=\\"23\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t<span>EMAIL US</span>\\n\\t\\t\\t\\t</button>\\n\\t\\t\\t</div>\\n\\t\\t\\t<div class=\\"action\\">\\n\\t\\t\\t\\t<button on:click={doCalendar} title=\\"Consultation Calendar\\">\\n\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\tsrc=\\"/img/icon-pen.svg\\"\\n\\t\\t\\t\\t\\t\\tclass=\\"icon icon-pen\\"\\n\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\talt=\\"Consultation\\"\\n\\t\\t\\t\\t\\t\\twidth=\\"30\\"\\n\\t\\t\\t\\t\\t\\theight=\\"30\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t<span>CONSULTATION</span>\\n\\t\\t\\t\\t</button>\\n\\t\\t\\t</div>\\n\\t\\t\\t<div class=\\"action\\">\\n\\t\\t\\t\\t<button on:click={doPayment} title=\\"Make Payment\\">\\n\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\tsrc=\\"/img/icon-invoice.svg\\"\\n\\t\\t\\t\\t\\t\\tclass=\\"icon icon-invoice\\"\\n\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\talt=\\"Pay Invoice\\"\\n\\t\\t\\t\\t\\t\\twidth=\\"30\\"\\n\\t\\t\\t\\t\\t\\theight=\\"30\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t<span>PAY INVOICE</span>\\n\\t\\t\\t\\t</button>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<script>/* ## MILK ## */\\nimport { milk } from '$milk/milk.js';\\n/* ## Variables ## */\\n\\nvar id;\\nvar blockstyle = '';\\nvar extraclasses = '';\\nvar blockclass = 'calltoaction';\\n\\n$: blockclass = \\"calltoaction \\" + blockstyle + \\" \\" + extraclasses;\\n/* ## Methods and Functions ## */\\n\\n\\nvar doCall = () => {\\n  var _window, _window$callingCard;\\n\\n  if ((_window = window) != null && (_window$callingCard = _window.callingCard) != null && _window$callingCard.show) {\\n    var _window2, _window2$callingCard;\\n\\n    (_window2 = window) == null ? void 0 : (_window2$callingCard = _window2.callingCard) == null ? void 0 : _window2$callingCard.show();\\n  }\\n};\\n\\nvar doEmail = () => {\\n  var _window3;\\n\\n  if ((_window3 = window) != null && _window3.location) {\\n    var _$milk, _$milk$site;\\n\\n    window.location = \\"mailto:\\" + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.email_address);\\n  }\\n};\\n\\nvar doCalendar = () => {\\n  var _window4, _window4$calendarCard;\\n\\n  if ((_window4 = window) != null && (_window4$calendarCard = _window4.calendarCard) != null && _window4$calendarCard.show) {\\n    var _window5, _window5$calendarCard;\\n\\n    (_window5 = window) == null ? void 0 : (_window5$calendarCard = _window5.calendarCard) == null ? void 0 : _window5$calendarCard.show();\\n  }\\n};\\n\\nvar doPayment = () => {\\n  var _$milk2, _$milk2$site;\\n\\n  // if (window?.paymentCard?.show) {\\n  // \\twindow?.paymentCard?.show();\\n  // }\\n  window.open((_$milk2 = $milk) == null ? void 0 : (_$milk2$site = _$milk2.site) == null ? void 0 : _$milk2$site.lawpay, '_blank');\\n};\\n/* ## Exports ## */\\n\\n\\nexport { id, blockstyle, extraclasses };</script>\\n\\n<style>.calltoaction{display:block;text-align:center}.calltoaction-inner{margin:0 auto;max-width:var(--content-constrain)}h2.title{font-size:var(--extralarge-fontsize);color:#fff;color:var(--color-white,#fff)}button{transition:all .3s ease;transform-origin:center;transform:scale(1)}button:hover{transform:scale(1.1)}button.call-button{color:#fff;color:var(--color-white,#fff);text-decoration:none;font-size:var(--large-fontsize);padding:10px 35px 10px 12px;border:3px solid #fff;border:3px solid var(--color-white,#fff);background:transparent;margin:25px 10px 15px;white-space:nowrap;min-width:225px;display:inline-block}button.call-button:hover{border:3px solid var(--color-three)}button.call-button span{white-space:nowrap;position:relative;display:inline-block;line-height:40px;vertical-align:middle}.caption{text-transform:uppercase;font-size:12px;letter-spacing:1px}hr{display:block;margin:25px auto 0;border:0;border-top:3px solid #fff;border-top:3px solid var(--color-white,#fff)}.actions{display:grid;grid-template-columns:1fr 1fr 1fr}.actions>div{text-align:center;display:grid;align-content:center;justify-content:center;place-content:center}.actions button{background:none;display:block;width:100%;border:0;color:#fff;color:var(--color-white,#fff);font-size:var(--base-fontsize);text-align:center}.actions button:hover{filter:brightness(.55) sepia(1) saturate(300%) hue-rotate(5deg) brightness(1.16) saturate(85%)}.actions button span{display:block;text-align:center}.icon{margin:30px auto 15px;max-width:30px;max-height:30px;width:auto;height:auto;vertical-align:middle}.icon-phone{margin:0;max-width:40px;max-height:40px;transform-origin:center center}@-webkit-keyframes tada{0%{transform:scale(1)}10%,20%{transform:scale(.9) rotate(-8deg)}30%,50%,70%{transform:scale(1.2) rotate(8deg)}40%,60%{transform:scale(1.2) rotate(-8deg)}80%,to{transform:scale(1) rotate(0)}}@keyframes tada{0%{transform:scale(1)}10%,20%{transform:scale(.9) rotate(-8deg)}30%,50%,70%{transform:scale(1.2) rotate(8deg)}40%,60%{transform:scale(1.2) rotate(-8deg)}80%,to{transform:scale(1) rotate(0)}}button:hover .icon-phone{-webkit-animation:tada 2s linear 1;animation:tada 2s linear 1}@media screen and (max-width:475px){.actions button{font-size:var(--base-fontsiz)}}@media screen and (max-width:400px){.actions{display:block;margin-left:-2vw;margin-right:-2vw}}@media screen and (max-width:650px){.call-button span{font-size:.9em}}</style>\\n"],"names":[],"mappings":"AAsHO,2CAAa,CAAC,QAAQ,KAAK,CAAC,WAAW,MAAM,CAAC,iDAAmB,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,IAAI,mBAAmB,CAAC,CAAC,EAAE,oCAAM,CAAC,UAAU,IAAI,qBAAqB,CAAC,CAAC,MAAM,IAAI,CAAC,MAAM,IAAI,aAAa,CAAC,IAAI,CAAC,CAAC,oCAAM,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,iBAAiB,MAAM,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,oCAAM,MAAM,CAAC,UAAU,MAAM,GAAG,CAAC,CAAC,MAAM,0CAAY,CAAC,MAAM,IAAI,CAAC,MAAM,IAAI,aAAa,CAAC,IAAI,CAAC,CAAC,gBAAgB,IAAI,CAAC,UAAU,IAAI,gBAAgB,CAAC,CAAC,QAAQ,IAAI,CAAC,IAAI,CAAC,IAAI,CAAC,IAAI,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,IAAI,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,IAAI,aAAa,CAAC,IAAI,CAAC,CAAC,WAAW,WAAW,CAAC,OAAO,IAAI,CAAC,IAAI,CAAC,IAAI,CAAC,YAAY,MAAM,CAAC,UAAU,KAAK,CAAC,QAAQ,YAAY,CAAC,MAAM,0CAAY,MAAM,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,IAAI,aAAa,CAAC,CAAC,MAAM,2BAAY,CAAC,mBAAI,CAAC,YAAY,MAAM,CAAC,SAAS,QAAQ,CAAC,QAAQ,YAAY,CAAC,YAAY,IAAI,CAAC,eAAe,MAAM,CAAC,sCAAQ,CAAC,eAAe,SAAS,CAAC,UAAU,IAAI,CAAC,eAAe,GAAG,CAAC,gCAAE,CAAC,QAAQ,KAAK,CAAC,OAAO,IAAI,CAAC,IAAI,CAAC,CAAC,CAAC,OAAO,CAAC,CAAC,WAAW,GAAG,CAAC,KAAK,CAAC,IAAI,CAAC,WAAW,GAAG,CAAC,KAAK,CAAC,IAAI,aAAa,CAAC,IAAI,CAAC,CAAC,sCAAQ,CAAC,QAAQ,IAAI,CAAC,sBAAsB,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,uBAAQ,CAAC,kBAAG,CAAC,WAAW,MAAM,CAAC,QAAQ,IAAI,CAAC,cAAc,MAAM,CAAC,gBAAgB,MAAM,CAAC,cAAc,MAAM,CAAC,uBAAQ,CAAC,qBAAM,CAAC,WAAW,IAAI,CAAC,QAAQ,KAAK,CAAC,MAAM,IAAI,CAAC,OAAO,CAAC,CAAC,MAAM,IAAI,CAAC,MAAM,IAAI,aAAa,CAAC,IAAI,CAAC,CAAC,UAAU,IAAI,eAAe,CAAC,CAAC,WAAW,MAAM,CAAC,uBAAQ,CAAC,qBAAM,MAAM,CAAC,OAAO,WAAW,GAAG,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,SAAS,IAAI,CAAC,CAAC,WAAW,IAAI,CAAC,CAAC,WAAW,IAAI,CAAC,CAAC,SAAS,GAAG,CAAC,CAAC,uBAAQ,CAAC,MAAM,CAAC,mBAAI,CAAC,QAAQ,KAAK,CAAC,WAAW,MAAM,CAAC,mCAAK,CAAC,OAAO,IAAI,CAAC,IAAI,CAAC,IAAI,CAAC,UAAU,IAAI,CAAC,WAAW,IAAI,CAAC,MAAM,IAAI,CAAC,OAAO,IAAI,CAAC,eAAe,MAAM,CAAC,yCAAW,CAAC,OAAO,CAAC,CAAC,UAAU,IAAI,CAAC,WAAW,IAAI,CAAC,iBAAiB,MAAM,CAAC,MAAM,CAAC,mBAAmB,mBAAI,CAAC,EAAE,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,UAAU,MAAM,EAAE,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,UAAU,MAAM,GAAG,CAAC,CAAC,OAAO,IAAI,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,UAAU,MAAM,GAAG,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,GAAG,CAAC,EAAE,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,WAAW,mBAAI,CAAC,EAAE,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,UAAU,MAAM,EAAE,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,UAAU,MAAM,GAAG,CAAC,CAAC,OAAO,IAAI,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,UAAU,MAAM,GAAG,CAAC,CAAC,OAAO,KAAK,CAAC,CAAC,GAAG,CAAC,EAAE,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,qBAAM,MAAM,CAAC,0BAAW,CAAC,kBAAkB,mBAAI,CAAC,EAAE,CAAC,MAAM,CAAC,CAAC,CAAC,UAAU,mBAAI,CAAC,EAAE,CAAC,MAAM,CAAC,CAAC,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,uBAAQ,CAAC,qBAAM,CAAC,UAAU,IAAI,cAAc,CAAC,CAAC,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,sCAAQ,CAAC,QAAQ,KAAK,CAAC,YAAY,IAAI,CAAC,aAAa,IAAI,CAAC,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,2BAAY,CAAC,mBAAI,CAAC,UAAU,IAAI,CAAC,CAAC"}`
};
const Block_CallToAction = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => value);
  var {id} = $$props;
  var {blockstyle = ""} = $$props;
  var {extraclasses = ""} = $$props;
  var blockclass = "calltoaction";
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  if ($$props.extraclasses === void 0 && $$bindings.extraclasses && extraclasses !== void 0)
    $$bindings.extraclasses(extraclasses);
  $$result.css.add(css$t);
  blockclass = "calltoaction " + blockstyle + " " + extraclasses;
  $$unsubscribe_milk();
  return `<div${add_attribute("id", id, 0)} class="${escape(null_to_empty(blockclass)) + " svelte-1a137or"}"><div class="${"calltoaction-inner svelte-1a137or"}"><h2 class="${"title svelte-1a137or"}">Let Us Get To Work On Your Case Now</h2>
		<div class="${"call-button svelte-1a137or"}"><button class="${"call-button svelte-1a137or"}" title="${"Make Call"}"><img src="${"/img/icon-phone-yellow.svg"}" class="${"icon icon-phone svelte-1a137or"}" loading="${"lazy"}" alt="${"Call Us"}" width="${"40"}" height="${"40"}">
				<span class="${"svelte-1a137or"}">(973) 642-1111</span></button></div>
		<div class="${"caption svelte-1a137or"}">We return most calls within 24 hours</div>
		<hr class="${"svelte-1a137or"}">
		<div class="${"actions svelte-1a137or"}"><div class="${"action svelte-1a137or"}"><button title="${"Send Email"}" class="${"svelte-1a137or"}"><img src="${"/img/icon-email.svg"}" class="${"icon icon-email svelte-1a137or"}" loading="${"lazy"}" alt="${"Email Us"}" width="${"30"}" height="${"23"}">
					<span class="${"svelte-1a137or"}">EMAIL US</span></button></div>
			<div class="${"action svelte-1a137or"}"><button title="${"Consultation Calendar"}" class="${"svelte-1a137or"}"><img src="${"/img/icon-pen.svg"}" class="${"icon icon-pen svelte-1a137or"}" loading="${"lazy"}" alt="${"Consultation"}" width="${"30"}" height="${"30"}">
					<span class="${"svelte-1a137or"}">CONSULTATION</span></button></div>
			<div class="${"action svelte-1a137or"}"><button title="${"Make Payment"}" class="${"svelte-1a137or"}"><img src="${"/img/icon-invoice.svg"}" class="${"icon icon-invoice svelte-1a137or"}" loading="${"lazy"}" alt="${"Pay Invoice"}" width="${"30"}" height="${"30"}">
					<span class="${"svelte-1a137or"}">PAY INVOICE</span></button></div></div></div>
</div>`;
});
const preload_attorneys = [
  {
    title: "Harlan York",
    slug: "harlan-york",
    Attorney: {
      additionalDescription: '<p>Mr. York has appeared on National Television on\xA0<a title="View CBS This Morning Screen Capture" href="http://staging.immigrationlawnj.com/wp-content/uploads/hya_cbs_appearance_screen_cap.jpg">CBS This Morning</a> and Primer Impacto on Univision and spoke on a host of immigration issues on Telemundo, NBC, Bloomberg Law and PBS.</p>\n<p>In his two decades exclusively practicing immigration law, Mr. York notes among his most memorable cases:</p>\n<ul>\n<li>Arguing that immigrants with crimes should be allowed to remain in the U.S. upon proving rehabilitation and hardship to their American spouses and children</li>\n<li>Countless successful appeals before federal and administrative courts on issues regarding waivers of removal and political asylum</li>\n<li>Preparing applications for companies sponsoring immigrants in industries ranging from restaurants to construction to agriculture, to academic institutions and research labs</li>\n<li>Representation of high-level athletes, artists and entertainers, including winners of Emmys, Grammys and Olympic Medals</li>\n<li>Winning deportation cases for immigrants whose children have special needs</li>\n<li>Assisting victims of violence who suffered at the hands of both foreign and domestic aggressors</li>\n</ul>\n<p>He frequently lectures on Immigration Law, including at Columbia, New York, Seton Hall and Rutgers Law Schools. He is a well-known speaker at events sponsored by the New Jersey State Bar Foundation and Federal Bar Association. Mr. York was also a Judge at the American Mock Trial Tournament at Yale University. His highly rated\xA0<a href="http://www.lawline.com/faculty/bio.php?id=1291" target="_blank" rel="noopener">Lawline.com</a>\xA0Lecture Series is available for attorneys, law students and the public to study online.</p>\n<p>Mr. York has also provided expert opinions to plaintiffs\u2019 and defendants\u2019 attorneys in civil matters as well as counsel to federal and state criminal defense lawyers in cases relating to immigration, including the recent \u201CReal Housewives of New Jersey\u201D matter.</p>\n<p>His chapter on Immigration Law Enforcement: Collaboration and Authority appears in the 2014 Thomson Reuters/Aspatore book, New Developments in Immigration Enforcement and Compliance: Leading Lawyers on Navigating Trends in Immigration Law (<a href="http://www.amazon.in/dp/031429273X/ref=rdr_ext_tmb" target="_blank" rel="noopener">Inside the Minds</a>).</p>\n<p>Mr. York moderates annual panels for the New Jersey Institute for Continuing Legal Education on the topics of \u201CProtecting Immigrant Victims of Violence \u201D and \u201CImmigration and Crime.\u201D</p>\n<p>A graduate of Choate Rosemary Hall, the State University of New York at Albany and the Tulane Law School, Mr. York is fluent in Spanish. He is admitted in many jurisdictions, including the United States Supreme Court.</p>\n<p>Mr. York has coached youth soccer for many years and is a Certified Women\u2019s Self-Defense Instructor.</p>\n',
      email: "HYork@ImmigrationLawNJ.com",
      avifImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/attorney_harlanyork.avif"
      },
      shortDescription: "<p>The first-ever attorney in New Jersey to win \u201CImmigration Lawyer of the Year\u201D from Best Lawyers, Harlan York is former immigration chair of the NJ State Bar Association and former co-chair for the NY State Bar Association CFLS Committee on Immigration.\xA0 He currently serves on the American Immigration Lawyers Association (AILA) National Practice Management Committee.</p>\n",
      jpegImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/attorney_harlanyork.jpg"
      },
      webpImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/attorney_harlanyork.webp"
      }
    }
  },
  {
    title: "Lauren Anselowitz",
    slug: "lauren-anselowitz",
    Attorney: {
      additionalDescription: "<p>In recent years, she has personally represented clients of Harlan York &amp; Associates at Immigration Court and Service Offices in New Jersey, New York, Connecticut, Pennsylvania, Massachusetts, Virginia, North Carolina, Georgia, and Florida.</p>\n<p>Ms. Anselowitz has successfully resolved complex family and employment-based green card applications, issues of citizenship and a number of different nonimmigrant visa petitions. Her experience includes H, L, E, O and R visas. Additionally, Ms. Anselowitz has worked extensively on applications under the Violence Against Women Act.</p>\n<p>Ms. Anselowitz is an adjunct professor of Immigration Law in the Justice Studies Department at Montclair State University. She has lectured at Rutgers University School of Law as well as before the New Jersey State Bar and the Federal Bar Associations. She was honored as a Super Lawyers Rising Star for four years.</p>\n<p>A graduate of North Carolina State University and Seton Hall Law School, Ms. Anselowitz earned a Master of Arts Degree from the John C. Whitehead School of Diplomacy and International Relations. She also attended the American University in Cairo, Egypt and served in the field of international criminal law at the Special Court for Sierra Leone. She previously lived in Pretoria, South Africa and has spent time in Botswana, Zimbabwe, Zambia, Senegal, the Gambia, Ethiopia and Morocco.</p>\n<p>Ms. Anselowitz is admitted to the Supreme Court of New Jersey, the U.S. District Court for the District of New Jersey, the U.S. Third Circuit Court of Appeals, and the U.S. Second Circuit Court of Appeals.</p>\n",
      email: "LAnselowitz@ImmigrationLawNJ.com",
      avifImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/attorney_laurenanselowitz.avif"
      },
      shortDescription: "<p>Lauren Anselowitz is a partner at the firm. Named to Best Lawyers in America, her most noted accomplishments include successfully arguing multiple cases under the Convention Against Torture before the U.S. Immigration Court. The Executive Office for Immigration Review reported that less than 1% of these cases are granted. Ms. Anselowitz also won oral argument before the U.S. Third Circuit Court of Appeals, one step below the U.S. Supreme Court, to vacate a deportation order for a client of the firm.</p>\n",
      jpegImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/attorney_laurenanselowitz.jpg"
      },
      webpImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/attorney_laurenanselowitz.webp"
      }
    }
  },
  {
    title: "Maggie Dunsmuir",
    slug: "maggie-dunsmuir",
    Attorney: {
      additionalDescription: "<p>Maggie\xA0Dunsmuir has successfully handled a great deal of applications for visas and green cards under the Violence Against Women Act (VAWA) and Trafficking Victims Protection Act (TVPA). \xA0She has also achieved positive outcomes in reopening cases that were previously denied before the firm became involved. She has lectured numerous times on VAWA for the New Jersey State Bar Association.</p>\n<p>Ms. Dunsmuir works frequently on H and L visas as well as employment based permanent residence applications.\xA0 Additionally, she has successfully obtained various waivers of inadmissibility for clients all over the world.</p>\n<p>A graduate of Brooklyn Law School, Ms. Dunsmuir received a bachelor\u2019s degree in English Literature from Washington University in St. Louis. She also studied in both Ireland and Guatemala. She is conversant in Spanish.</p>\n<p>Ms. Dunsmuir\u2019s immigration law experience included interning at Catholic Charities Immigration Services and the New York Immigration Court, where she researched complex legal issues and drafted decisions for Immigration Judges. She also interned at Advocates for Children of New York, Legal Services and Legal Aid. A member of the American Immigration Lawyers Association, she is admitted to practice in New York.</p>\n",
      email: "MDunsmuir@ImmigrationLawNJ.com",
      avifImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/attorney_maggiedunsmuir.avif"
      },
      shortDescription: "<p>Maggie Dunsmuir is a senior associate with Harlan York &amp; Associates. She represents a diverse group of clients in the areas of permanent residence, naturalization, removal defense, detention, asylum and visas. She appears regularly in hearings before the Immigration Service and United States Immigration Court, and has prevailed on behalf of the firm\u2019s clients before the Board of Immigration Appeals, Federal Courts, and Administrative Appeals Office.</p>\n",
      jpegImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/attorney_maggiedunsmuir.jpg"
      },
      webpImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/attorney_maggiedunsmuir.webp"
      }
    }
  },
  {
    title: "Riki King",
    slug: "riki-king",
    Attorney: {
      additionalDescription: "<p>Riki\xA0King handles a great deal of employment and family immigration cases. Additionally she appears often with clients in Immigration Court and at the Immigration Service offices in many states.</p>\n<p>She also spent several years as an attorney with a large international law firm in New York, where she handled complex litigation issues. Her accolades include the Legal Aid Society\u2019s 2007 and 2011 pro bono awards.</p>\n<p>Ms. King attended New York Law School where she graduated third in her class. She completed her concentration in Immigration and was Executive Notes Editor of the Law Review as well as a John Marshall Harlan Scholar.\xA0She also holds a Bachelor\u2019s Degree from Colgate University. Additionally, she studied in both Spain and Wales.</p>\n<p>A member of the American Immigration Lawyers Association,\xA0Ms. King\xA0is admitted to practice in New York and Massachusetts.</p>\n",
      email: "RKing@ImmigrationLawNJ.com",
      avifImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/attorney_rikiking.avif"
      },
      shortDescription: "<p>Riki King brings a wealth of experience in immigration law to Harlan York &amp; Associates. She previously was an Immigration Staff Attorney at the United States Court of Appeals for the Second Circuit. Before that, Ms. King interned at Immigration Units at Catholic Charities, Northeast New Jersey Legal Services and The Legal Aid Society.</p>\n",
      jpegImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/attorney_rikiking.jpg"
      },
      webpImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/attorney_rikiking.webp"
      }
    }
  },
  {
    title: "Mary Lynn Tedesco",
    slug: "mary-lynn-tedesco",
    Attorney: {
      additionalDescription: "<p>Ms. Tedesco has won asylum and withholding of removal, protection under the UN Convention Against Torture, permanent residency,<br />\nSpecial Immigrant Juvenile Status, as well as termination of removal proceedings due to improper allegations of fraud and crime. Additionally she has won countless waivers and appeals. She is particularly focused in complex matters of statutory interpretation, and where criminal and immigration law intersect.</p>\n<p>Fluent in Spanish, Ms. Tedesco is a graduate of Seton Hall Law School and The Catholic University of America. She is admitted to practice<br />\nin New Jersey and North Carolina, as well as before the Fourth Circuit Court of Appeals.</p>\n<p>In addition to being Of Counsel to Harlan York and Associates, Ms. Tedesco operates her own immigration firm in Charlotte, North Carolina.</p>\n",
      email: "MLTedesco@ImmigrationLawNJ.com",
      avifImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/ml-tedesco-sized.avif"
      },
      shortDescription: "<p>Mary Lynn Tedesco has spent a decade working in immigration law. She has successfully represented clients in removal proceedings, before USCIS, in federal courts, and at US Embassies all over the world.</p>\n<p>&nbsp;</p>\n",
      jpegImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/ml-tedesco-sized.jpg"
      },
      webpImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/ml-tedesco-sized.webp"
      }
    }
  }
];
const preload_faqs = [
  {
    slug: "marriage-and-family-based-immigration",
    title: "Marriage and Family Based Immigration",
    FAQ: {
      answer: "<p>Whether your husband or wife is outside of the United States or already stateside, we are here to help.</p>\n"
    }
  },
  {
    slug: "deportation-and-criminal",
    title: "Deportation and Criminal",
    FAQ: {
      answer: "<p>We have successfully stopped deportation on many occasions.\xA0 Additionally, our firm has filed arguments in cases where our clients\u2019 green card and citizenship applications were unreasonably delayed.\xA0 Whether you need a review of an asylum denial or visa refusal, a federal appeal might be appropriate.</p>\n"
    }
  },
  {
    slug: "business-immigration",
    title: "Business Immigration",
    FAQ: {
      answer: "<p>We give daily guidance\xA0 to companies with immigrant employees in areas ranging from restaurants to construction to agriculture, to academic institutions and research labs. From architects to dentists, librarians to engineers and teachers to every type of information technology specialist imaginable, our office has been able to secure long-term and permanent immigration status for a wide range of professionals.</p>\n"
    }
  },
  {
    slug: "green-cards",
    title: "Green Cards",
    FAQ: {
      answer: "<p>There are a variety of ways to get your green card.\xA0 At Harlan York &amp; Associates, we know them all, including obscure parts of immigration law that you will not hear about from \u201Cjack of all trades\u201D lawyers.</p>\n"
    }
  }
];
const preload_featured = [
  {
    slug: "the-national-jurist",
    title: "The National Jurist",
    FeaturedOn: {
      avifImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/featured_logo_nautraljurist.avif"
      },
      pngImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/featured_logo_nautraljurist.png"
      },
      webpImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/featured_logo_nautraljurist.webp"
      },
      link: "https://www.nationaljurist.com/"
    }
  },
  {
    slug: "bloomberg-law",
    title: "Bloomberg Law",
    FeaturedOn: {
      avifImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/featured_logo_bloomberglaw.avif"
      },
      pngImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/featured_logo_bloomberglaw.png"
      },
      webpImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/featured_logo_bloomberglaw.webp"
      },
      link: "https://www.bna.com/bloomberglaw/"
    }
  },
  {
    slug: "news-12",
    title: "News 12",
    FeaturedOn: {
      avifImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/featured_logo_news12.avif"
      },
      pngImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/featured_logo_news12.png"
      },
      webpImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/featured_logo_news12.webp"
      },
      link: "https://newjersey.news12.com/"
    }
  },
  {
    slug: "pbs",
    title: "PBS",
    FeaturedOn: {
      avifImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/featured_logo_pbs.avif"
      },
      pngImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/featured_logo_pbs.png"
      },
      webpImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/04/featured_logo_pbs.webp"
      },
      link: "https://www.pbs.org/"
    }
  },
  {
    slug: "univision",
    title: "Univision",
    FeaturedOn: {
      avifImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/featured_logo_univision.avif"
      },
      pngImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/featured_logo_univision.png"
      },
      webpImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/featured_logo_univision.webp"
      },
      link: "https://www.univision.com/"
    }
  },
  {
    slug: "nj-com",
    title: "NJ.com",
    FeaturedOn: {
      avifImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/featured_logo_njcom.avif"
      },
      pngImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/featured_logo_njcom.png"
      },
      webpImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/featured_logo_njcom.webp"
      },
      link: "https://www.nj.com/"
    }
  },
  {
    slug: "telemundo",
    title: "Telemundo",
    FeaturedOn: {
      avifImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/featured_logo_telemundo.avif"
      },
      pngImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/featured_logo_telemundo.png"
      },
      webpImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/featured_logo_telemundo.webp"
      },
      link: "https://www.telemundo.com/"
    }
  },
  {
    slug: "cbs-news",
    title: "CBS News",
    FeaturedOn: {
      avifImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/featured_logo_cbs.avif"
      },
      pngImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/featured_logo_cbs.png"
      },
      webpImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/featured_logo_cbs.webp"
      },
      link: "https://www.cbsnews.com/"
    }
  }
];
const preload_ratings = [
  {
    Ratings: {
      link: "http://www.martindale.com/Harlan-G-York/1106229-lawyer.htm",
      rating: "AV Preeminent"
    },
    slug: "martindale-rating",
    title: "Martindale Rating"
  },
  {
    Ratings: {
      link: "http://www.superlawyers.com/new-jersey/lawyer/Harlan-G-York/597208c4-5b6b-4c29-9c17-0442fe8a3e9f.html",
      rating: "Attorney Profile"
    },
    slug: "super-lawyers",
    title: "Super Lawyers"
  },
  {
    Ratings: {
      link: "http://www.bestlawyers.com/firms/harlan-york-and-associates/31749/US",
      rating: "Firm Profile"
    },
    slug: "best-lawyers-2",
    title: "Best Lawyers"
  },
  {
    Ratings: {
      link: "http://www.bestlawyers.com/logos/showprofile.aspx?lawyer_id=37694",
      rating: "Lawyer of the Year"
    },
    slug: "best-lawyers",
    title: "Best Lawyers"
  },
  {
    Ratings: {
      link: "http://bestlawfirms.usnews.com/firms/harlan-york-and-associates/overview/31749/",
      rating: "Best Law Firm"
    },
    slug: "us-news",
    title: "US NEWS"
  },
  {
    Ratings: {
      link: "http://www.avvo.com/attorneys/07102-nj-harlan-york-1473871.html",
      rating: "10.0 Superb"
    },
    slug: "aavo-rating",
    title: "AAVO Rating"
  }
];
const preload_services = [
  {
    slug: "marriage-and-family-based-immigration",
    title: "Marriage and Family Based Immigration",
    Services: {
      icon: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/hya-services-star.svg"
      },
      excerpt: "<div>\n<div>Whether\xA0your\xA0husband\xA0or\xA0wife\xA0is\xA0outside\xA0the\xA0United\xA0States\xA0or\xA0already\xA0stateside,\xA0we\xA0are\xA0here\xA0to\xA0help.</div>\n</div>\n",
      description: "<p>There has never been a better time to get your spouse a green card. Whether your husband or wife is outside the United States or already stateside, we are here to help.</p>\n<p>If you are an immigrant or a US citizen, you don\u2019t need to be afraid.</p>\n<p>We\u2019ve been helping immigrants become green card holders and US citizens for a quarter-century. We stay current on all the daily changes to immigration law and have a history of solving complicated immigration issues.</p>\n"
    }
  },
  {
    slug: "appellate-litigation",
    title: "Appellate Litigation",
    Services: {
      icon: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/hya-services-star.svg"
      },
      excerpt: "<div>\n<div>Harlan\xA0York\xA0and\xA0Associates\xA0regularly\xA0files\xA0and\xA0wins\xA0appeals\xA0in\xA0federal\xA0courts\xA0throughout\xA0the\xA0US\xA0on\xA0a\xA0host\xA0of\xA0immigration\xA0issues.</div>\n</div>\n",
      description: "<p>We have successfully stopped deportation on many occasions.\xA0 Additionally, our firm has filed arguments in cases where our clients\u2019 green card and citizenship applications were unreasonably delayed.\xA0 Whether you need a review of an asylum denial or visa refusal, a federal appeal might be appropriate.\xA0 We have taken on novel issues and made them work.</p>\n"
    }
  },
  {
    slug: "business-immigration",
    title: "Business Immigration",
    Services: {
      icon: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/hya-services-star.svg"
      },
      excerpt: "<p>We\xA0give\xA0daily\xA0guidance\xA0to\xA0companies\xA0with\xA0immigrant\xA0employees\xA0in\xA0areas\xA0ranging\xA0from\xA0restaurants\xA0to\xA0construction\xA0to\xA0agriculture,\xA0to\xA0academic\xA0institutions\xA0and\xA0research\xA0labs.</p>\n",
      description: "<p>From architects to dentists, librarians to engineers and teachers to every type of information technology specialist imaginable, our office has been able to secure long-term and permanent immigration status for a wide range of professionals.</p>\n"
    }
  },
  {
    slug: "citizenship",
    title: "Citizenship",
    Services: {
      icon: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/hya-services-star.svg"
      },
      excerpt: "<div>\n<div>Our\xA0firm\xA0successfully\xA0represents\xA0applicants\xA0for\xA0naturalization\xA0and\xA0derivative\xA0citizenship.</div>\n</div>\n",
      description: "<p>Whether you have a complicated case due to prior mistakes with the criminal justice system, tax problems or allegations of fraud, we will consult and advise if citizenship is right for you.\xA0 Do not forget, the 2014 version of the naturalization application is 21 pages long. Even those of you who think that the process looks simple, be careful, please. Call 973.642.1111 or email HYork@ImmigrationLawNJ.com for a consultation now.</p>\n"
    }
  },
  {
    slug: "deportation-and-criminal-defense",
    title: "Deportation and Criminal Defense",
    Services: {
      icon: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/hya-services-star.svg"
      },
      excerpt: "<p>We frequently work with criminal defense lawyers as co-counsel in post-conviction relief motions as well as advising attorneys on the proper pleas to negotiate for immigrants accused of crimes.</p>\n",
      description: "<p>It is your Constitutionally guaranteed Sixth Amendment right to have your criminal counsel work with us on ensuring the best way to avoid deportation at all times.</p>\n"
    }
  },
  {
    slug: "employment-immigration-and-work-visas",
    title: "Employment Immigration and Work Visas",
    Services: {
      icon: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/hya-services-star.svg"
      },
      excerpt: "<p>We\xA0offer\xA0creative\xA0solutions\xA0for\xA0many\xA0entities\xA0seeking\xA0visas\xA0in\xA0categories\xA0such\xA0as\xA0H-1B,\xA0L-1,\xA0O-1,\xA0TN,\xA0E-1,\xA0E-2,\xA0J-1,\xA0and\xA0many\xA0other\xA0nonimmigrant\xA0work\xA0visas.</p>\n",
      description: "<p>At Harlan York &amp; Associates, we pride ourselves on resolving cases for clients from all over the world, who are sponsored by companies from small businesses to Fortune 500 corporations.</p>\n"
    }
  },
  {
    slug: "green-cards",
    title: "Green Cards",
    Services: {
      icon: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/hya-services-star.svg"
      },
      excerpt: "<p>There are a variety of ways to get your green card. At Harlan York &amp; Associates, we know them all, including obscure parts of immigration law that you will not hear about from \u201Cjack of all trades\u201D lawyers.</p>\n",
      description: "<p>Our constant, thorough review of the latest progress \u2013 in the ever-changing procedures by which to secure legal permanent residence status \u2013 will help you achieve the best outcome possible on your green card application.</p>\n"
    }
  },
  {
    slug: "waivers-of-indamissibility-and-deportation",
    title: "Waivers of Inadmissibility and Deportation",
    Services: {
      icon: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/hya-services-star.svg"
      },
      excerpt: "<p>Many times, a green card or visa may be denied due to a violation of immigration or criminal law. Before this happens to you, speak with us about how to seek a waiver from Immigration.</p>\n",
      description: "<p>Harlan York &amp; Associates has gained ground in the various waivers such as I-601s, I-212s, I-601As plus waivers under Sections 237(a)(1)(H) as well as 212(d)(3).</p>\n"
    }
  },
  {
    slug: "removal-and-deportation",
    title: "Removal and Deportation",
    Services: {
      icon: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/hya-services-star.svg"
      },
      excerpt: "<p>Since 1997, when Congress began calling deportation \u201Cremoval,\u201D the numbers of people returned to their countries has skyrocketed.</p>\n",
      description: "<p>Do not find yourself in the two million-plus removed under the current presidential administration.\xA0 Contact us regardless of where you live if you are facing removal and we will do everything we can to find a solution before you are taken away from your loved ones.</p>\n"
    }
  },
  {
    slug: "k-visas",
    title: "K Visas for Fianc\xE9es",
    Services: {
      icon: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/hya-services-star.svg"
      },
      excerpt: "<p>A popular area of immigration law, K visas are utilized by immigrants engaged to US citizens. We have assisted hundreds of couples beginning a new life together in America.</p>\n",
      description: "<p>The procedure is often fraught with challenges ranging from document review to time delays to questions as to the validity of the relationship. You deserve to be united with your true love as soon as possible. We will do everything we can to return your emails and calls as soon as possible. Our immigration firm has assisted American citizens whose fianc\xE9es are all over the world waiting to enter the US.</p>\n"
    }
  },
  {
    slug: "labor-certification-perm",
    title: "Labor Certification (PERM)",
    Services: {
      icon: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/hya-services-star.svg"
      },
      excerpt: "<p>Typically used for skilled laborers and immigrants with advanced degrees, the PERM process is a necessary part of acquiring a green card for thousands of immigrants annually.</p>\n",
      description: "<p>We will outline and execute PERM cases for you, no matter what industry. We know the ins and outs of carefully crafting job duties and responsibilities. Recruitment and \u201Cability to pay\u201D issues are carefully reviewed in order to have the best results.</p>\n"
    }
  },
  {
    slug: "national-interest-waivers",
    title: "National Interest Waivers / PERM Bypass",
    Services: {
      icon: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/hya-services-star.svg"
      },
      excerpt: "<p>Immigrants wishing to bypass PERM often have exceptional ability and do not require a sponsor through the National Interest Waiver.</p>\n",
      description: "<p>Harlan York &amp; Associates has won many such cases by demonstrating that it is in the interest of the US to allow immigrants in this category to live here. These cases have gotten more challenging in recent years, and we will provide the support needed to overcome the difficulties.</p>\n"
    }
  },
  {
    slug: "orphan-and-adoption",
    title: "Orphans and Adoption Cases",
    Services: {
      icon: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/hya-services-star.svg"
      },
      excerpt: "<p>Adopting a child from another country can be a long and time consuming process.</p>\n",
      description: "<p>We have helped thousands of families successfully navigate this process as quickly and painlessly as possible, ensuring that precious years are spent with your family and not in court. US citizens adopting a child from another country must ensure legal status is conferred on their child. We are here to help you make this happen.</p>\n"
    }
  },
  {
    slug: "political-asylum",
    title: "Political Asylum",
    Services: {
      icon: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/hya-services-star.svg"
      },
      excerpt: "<p>Political asylum is one of the most difficult areas in immigration law. Our office fights and wins asylum for immigrants fearful of return to their home countries due to persecution based on race, religion, nationality, political opinion, and social group.</p>\n",
      description: "<p>The system is tricky and overwhelming. New caselaw commonly results in a need to keep up with how to win, given the obstacles of a backlogged bureaucracy. We have a proven record and are up to the task.</p>\n"
    }
  },
  {
    slug: "temporary-protected-status-sanctuary",
    title: "Temporary Protected Status / Sanctuary",
    Services: {
      icon: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/hya-services-star.svg"
      },
      excerpt: "<p>If your country was affected by a natural disaster or civil strife, we might be able to help you stay here and receive both employment and travel authorization through a Temporary Protected Status.</p>\n",
      description: "<p>There are a handful of nations whose citizens qualify for TPS, and we have helped hundreds and hundreds of these applicants seek sanctuary in the United States.</p>\n"
    }
  },
  {
    slug: "u-visas-victims-of-violence",
    title: "U Visas and Related Petitions for Victims of Violence",
    Services: {
      icon: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/hya-services-star.svg"
      },
      excerpt: "<p>Mr. York has spoken on National Television and at seminars in New York and New Jersey on this new area of immigration law.</p>\n",
      description: "<p>If you have been the victim of a crime or violent act, call us today at 973-642-1111 to discuss your rights and how you may qualify to receive legal status. There is a growing interest in our government to deter violence by encouraging immigrants to apply for legal status after suffering as victims of many criminal acts.\xA0 We can help you.</p>\n"
    }
  },
  {
    slug: "sciences-arts-sports-entertainment-immigration",
    title: "Sciences, Arts, Sports and Entertainment Immigration",
    Services: {
      icon: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/hya-services-star.svg"
      },
      excerpt: "<p>PhDs. Musicians. Journalists. Athletes. Actors. Harlan York &amp; Associates proudly assists immigrants who wish to reside in the US based upon their contributions to the arts, sciences, sports, film, television, and stage.</p>\n",
      description: "<p>Winners of international and national awards have graced us with their presence, and we have represented them in their visa and green card filings with aplomb.</p>\n"
    }
  }
];
const preload_testimonials = [
  {
    Testimonial: {
      avifImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/testimonial_adriana.avif"
      },
      jpgImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/testimonial_adriana.jpg"
      },
      webpImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/testimonial_adriana.webp"
      },
      rating: 5,
      testimonial: "They are the kind of lawyers that you can reach anytime by e-mail, phone, or even text message.  Every time I had a question, I would send them an e-mail and on the same day I would have an answer!",
      relationship: "Client"
    },
    slug: "adriana",
    title: "Adriana"
  },
  {
    Testimonial: {
      avifImage: null,
      jpgImage: null,
      webpImage: null,
      rating: 5,
      testimonial: "He found out that I had one day left before my deportation and was able to reverse my case into right track. Harlan is very friendly, honest, truthful and energetic. He didn\u2019t make any empty promises to us. He worked very hard with my case. I can not thank him enough.",
      relationship: "Client"
    },
    slug: "julia",
    title: "Julia"
  },
  {
    Testimonial: {
      avifImage: null,
      jpgImage: null,
      webpImage: null,
      rating: null,
      testimonial: "Harlan York is a Street Fighter",
      relationship: "Greatest Chess Player of All Time"
    },
    slug: "garry-kasparov",
    title: "Garry Kasparov"
  },
  {
    Testimonial: {
      avifImage: null,
      jpgImage: null,
      webpImage: null,
      rating: null,
      testimonial: "I had been given Mr York's name by one of my colleagues at the university, but I was skeptical until I noticed the efficiency with which he handled all paperwork. I received my US citizenship without any problems, and just last week, 12 years later, Harlan provided me with a legal note I required without any hesitation in the same quick and forthright manner that had impressed me when I first met him.",
      relationship: "Client"
    },
    slug: "karl",
    title: "Karl"
  },
  {
    Testimonial: {
      avifImage: null,
      jpgImage: null,
      webpImage: null,
      rating: 5,
      testimonial: "Willing to take on a case that other attorneys were not capable of handling. Honest, straightforward and knows the law. In addition, an extremely kind individual that you can consider a friend and not just your attorney.",
      relationship: "Client"
    },
    slug: "tarek",
    title: "Tarek"
  },
  {
    Testimonial: {
      avifImage: null,
      jpgImage: null,
      webpImage: null,
      rating: null,
      testimonial: "Thank you very much for the time and professionalism. You are excellent attorneys that honestly care about your clients.",
      relationship: "Oscar winning Filmmaker"
    },
    slug: "agustin-fernandez",
    title: "Agust\xEDn Fern\xE1ndez"
  },
  {
    Testimonial: {
      avifImage: null,
      jpgImage: null,
      webpImage: null,
      rating: null,
      testimonial: "Harlan is very professional, personable, efficient and transparent about the overall process and costs. Also, he is approachable and responsive to clients\u2019 needs and questions. I would recommend Harlan without hesitation.",
      relationship: "Client"
    },
    slug: "anthony",
    title: "Anthony"
  },
  {
    Testimonial: {
      avifImage: null,
      jpgImage: null,
      webpImage: null,
      rating: null,
      testimonial: "Mr. York and his staff conducted themselves in an exemplary way. We never had to wait for information or a special request. Our questions or concerns were always addressed. The case was brought to completion in less time than expected.",
      relationship: "Client"
    },
    slug: "ricardo",
    title: "Ricardo"
  },
  {
    Testimonial: {
      avifImage: null,
      jpgImage: null,
      webpImage: null,
      rating: null,
      testimonial: "When I first came to Mr. York, I was overwhelmed, lost and confused, but he was able to start quickly and move me forward through the paperwork. He was very reassuring and professional.",
      relationship: "Client"
    },
    slug: "alina",
    title: "Alina"
  },
  {
    Testimonial: {
      avifImage: null,
      jpgImage: null,
      webpImage: null,
      rating: null,
      testimonial: "I was recommended by a friend to Harlan York. I must say it was the best move I ever made. The process was painless and never once did I feel uneasy. Mr. York and his exceptional team of professional legal staff were there for me the entire time. Being a small business owner who employs people in similar situations to the one I was once in, I now recommend all my staff and potential future staff to Harlan York & Associates. He has a client for life with me, my business & my family.",
      relationship: "Client"
    },
    slug: "wayne",
    title: "Wayne"
  },
  {
    Testimonial: {
      avifImage: null,
      jpgImage: null,
      webpImage: null,
      rating: null,
      testimonial: "York was the consummate professional. He pinpointed precisely the issues that needed to be addressed. In personal terms he seemed to share an equal passion for the complexities of the law and the very human aspects of immigration law.",
      relationship: "Client"
    },
    slug: "jeremy",
    title: "Jeremy"
  },
  {
    Testimonial: {
      avifImage: null,
      jpgImage: null,
      webpImage: null,
      rating: null,
      testimonial: "What I like the most about Mr. York is that he tells you what can be done and on what you shouldn\u2019t waste your money and time.",
      relationship: "Client"
    },
    slug: "birol",
    title: "Birol"
  },
  {
    Testimonial: {
      avifImage: null,
      jpgImage: null,
      webpImage: null,
      rating: null,
      testimonial: "I was very pleased with the entire process. Above all, I was extremely happy with his accessibility. Staff is very friendly and always answered my questions when I called. Mr. York is extremely good about getting back to you with any questions. It never went for more than a few hours before getting a return call. He responds to his emails almost instantly. I have worked with other attorneys and have not been this satisfied until I found Mr. York.",
      relationship: "Client"
    },
    slug: "martha",
    title: "Martha"
  },
  {
    Testimonial: {
      avifImage: null,
      jpgImage: null,
      webpImage: null,
      rating: null,
      testimonial: "I dealt with many Immigration Attorneys. All of them would be nice to you until you pay and then completely non-responsive. Mr. York was the only one who proved to stand by me until the case was resolved.",
      relationship: "Client"
    },
    slug: "thomas",
    title: "Thomas"
  },
  {
    Testimonial: {
      avifImage: null,
      jpgImage: null,
      webpImage: null,
      rating: null,
      testimonial: "Mr. York is a true professional who cares about his clients and his work.",
      relationship: "Olympic Gold Medalist"
    },
    slug: "peter-rono",
    title: "Peter Rono"
  },
  {
    Testimonial: {
      avifImage: null,
      jpgImage: null,
      webpImage: null,
      rating: 5,
      testimonial: "Harlan York and his team were absolutely amazing. Our immigration case was a little bit complicated, but Harlan was there with us every step of the way. We always felt as if we were a top priority to Harlan and his team. I would highly recommend Harlan York to anyone who is looking for assistance with an immigration case.",
      relationship: "Client"
    },
    slug: "laurie",
    title: "Laurie"
  },
  {
    Testimonial: {
      avifImage: null,
      jpgImage: null,
      webpImage: null,
      rating: 5,
      testimonial: "Not only is he an expert in current immigration law, but he is well versed in changes that have occurred in the last 20 years. And I have always found his rates to be fair and reasonable.",
      relationship: "Client"
    },
    slug: "alberto",
    title: "Alberto"
  },
  {
    Testimonial: {
      avifImage: null,
      jpgImage: null,
      webpImage: null,
      rating: 5,
      testimonial: "Harlan York took an absolutely dead immigration case after three denials and removal proceedings and pulled it through. We are very happy to receive our green cards after his outstanding efforts.",
      relationship: "Client"
    },
    slug: "nikolay",
    title: "Nikolay"
  },
  {
    Testimonial: {
      avifImage: null,
      jpgImage: null,
      webpImage: null,
      rating: null,
      testimonial: "Mr. York has been a great, honest lawyer in all the years I have known him. He saved me from deportation.",
      relationship: "Client"
    },
    slug: "luis",
    title: "Luis"
  }
];
const preload_ebooks = [
  {
    slug: "stop-deportation",
    title: "Stop Deportation",
    date: "2021-06-28T22:49:40",
    eBook: {
      avifImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/ebook-stop-deportation.avif"
      },
      jpegImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/ebook-stop-deportation.jpg"
      },
      pdf: {
        mediaItemUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/ebook-stop-deportation.pdf"
      },
      webpImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/ebook-stop-deportation.webp"
      },
      shortDescription: "<div>As of today about 1 Million immigrants await removal / deportation hearings. Many of those who are waiting sit in jails.\xA03 million immigrants were \u2018removed\u2019 by President Obama.\xA0 Of course, President Trump has made immigration\xA0a focus of his administration.</div>\n<p>America deports many people who might be contributing members of our society. You could be deported for\xA0immigration violations, DUIs, illegal entry, or for a shoplifting conviction that happened over a decade previously \u2013 even if you have rehabilitated your life in the meantime.</p>\n<p>Our legal team got together and outlined the seven best ways to deal with the threat of deportation and removal, and are sharing it with you for free! Why? Immigration law is very complicated, and proper information is the key. We want our clients, and others to understand what they are facing, and what they might have to apply for in order to remain in the country.</p>\n"
    }
  },
  {
    slug: "getting-a-green-card-through-marriage",
    title: "Getting a Green Card Through Marriage",
    date: "2021-06-28T22:46:47",
    eBook: {
      avifImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/ebook-green-card-through-marriage.avif"
      },
      jpegImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/ebook-green-card-through-marriage.jpg"
      },
      pdf: {
        mediaItemUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/ebook-green-card-through-marriage.pdf"
      },
      webpImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/06/ebook-green-card-through-marriage.webp"
      },
      shortDescription: "<p>You have a handful of choices when seeking permanent residence in the United States. Family based immigration, statistically, has been shown to result in more green cards than any other category. Even so, over the last two decades of working as an immigration lawyer I have seen many people make mistakes when applying for their green card through marriage. Once mistakes are made in the process it can be very difficult to continue down this path.</p>\n<p>Our lawyers at Harlan York and Associates have put together a guide to help you understand the process, rules, and what will be expected of you in the process of getting your green card through marriage\u2026and more importantly outline the risks and pitfalls that are most commonly made.</p>\n"
    }
  }
];
const preload_videos = [
  {
    slug: "harlan-york-immigration-update",
    title: "Harlan York Immigration Update",
    date: "2021-07-01T03:49:01",
    Video: {
      avifImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/07/video_harlan_york_immigration_update.avif"
      },
      jpegImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/07/video_harlan_york_immigration_update.jpg"
      },
      webpImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/07/video_harlan_york_immigration_update.webp"
      },
      video: "https://www.youtube.com/watch?v=Lpd6OypxPyU"
    }
  },
  {
    slug: "getting-a-green-card-through-marriage",
    title: "Getting a Green Card Through Marriage",
    date: "2021-07-01T03:45:30",
    Video: {
      avifImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/07/video_green_card_through_marriage.avif"
      },
      jpegImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/07/video_green_card_through_marriage.jpg"
      },
      webpImage: {
        sourceUrl: "https://admin.immigrationlawnj.com/wp-content/uploads/2021/07/video_green_card_through_marriage.webp"
      },
      video: "https://www.youtube.com/watch?v=sjMF8A2FLHc"
    }
  }
];
const MILK_CFG$1 = JSON.parse(decodeURI("%7B%22config%22:%7B%22theme%22:%22hya%22,%22debug%22:true,%22lock_config%22:false,%22cache_swr%22:true,%22cache%22:true,%22expires%22:300,%22pwa%22:true,%22lang%22:%22en%22,%22darkmode%22:%22light%22,%22smoothscroll%22:true,%22topanchor%22:true,%22watch_scroll%22:true,%22watch_resize%22:false,%22watch_mouse%22:false,%22pagination_size%22:8,%22credit%22:%7B%22milk%22:true,%22svelte%22:true,%22graphql%22:true,%22vite%22:true,%22rollup%22:true%7D%7D,%22site%22:%7B%22domain%22:%22staging.immigrationlawnj.com%22,%22url%22:%22https://staging.immigrationlawnj.com%22,%22admin_url%22:%22https://admin.immigrationlawnj.com%22,%22photo%22:%22/img/profile_1200x1200.jpg%22,%22photo_avif%22:%22/img/profile_1200x1200.avif%22,%22photo_webp%22:%22/img/profile_1200x1200.webp%22,%22logo%22:%22/img/logo.svg%22,%22logo_width%22:%22200%22,%22logo_height%22:%2228%22,%22title%22:%22Harlan%20York%20and%20Associates%22,%22tagline%22:%22Immigration%20Attorneys%22,%22organization%22:%22Harlan%20York%20and%20Associates%22,%22first_name%22:%22Harlan%22,%22last_name%22:%22York%22,%22middle_name%22:%22%22,%22prefix_name%22:%22%22,%22suffix_name%22:%22%22,%22nick_name%22:%22%22,%22email_address%22:%22info@immigrationlawnj.com%22,%22phone%22:%221.973.642.1111%22,%22fax%22:%221.973.642.0022%22,%22address%22:%2260%20Park%20Pl%22,%22address2%22:%22Suite%201010%22,%22city%22:%22Newark%22,%22state%22:%22New%20Jersey%22,%22state_abbr%22:%22NJ%22,%22zip%22:%2207102%22,%22country%22:%22United%20States%22,%22country_abbr%22:%22US%22,%22hours_of_operation%22:%229:00am%20%E2%80%93%205:00pm%20/%20Monday%20%E2%80%93%20Friday%22,%22hours_of_operation_dt%22:%22Mo,Tu,We,Th,Fr%2009:00-17:00%22,%22price_range%22:%22$$%22,%22category%22:%22Immigration%20Law%22,%22description%22:%22Harlan%20York%20and%20Associates%20are%20the%20best%20immigration%20lawyers%20for%20Green%20Cards,%20Deportation,%20Family%20Immigration,%20and%20Naturalization%20in%20New%20York,%20New%20Jersey,%20and%20surrounding%20areas.%22,%22keywords%22:%22Immigration%20Law,%20USA%20Immigration,%20Lawer,%20Attourney,%20Greencard,%20Visa%22,%22established%22:%22%22,%22latitude%22:%2240.7385726%22,%22longitude%22:%22-74.1690402%22,%22google_maps%22:%22https://bit.ly/3aPm8HF%22,%22google_maps_embed%22:%22https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1511.533014259071!2d-74.1690402!3d40.7385726!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25381b9bdf0fb%253A0x7681dbe37e1094d1!2sHarlan%2520York%2520%2526%2520Associates!5e0!3m2!1sen!2sca!4v1613362597071!5m2!1sen!2sca%22,%22google_maps_image%22:%22/img/google_maps_1350x922.jpg%22,%22google_maps_image_webp%22:%22/img/google_maps_1350x922.webp%22,%22google_maps_image_avif%22:%22/img/google_maps_1350x922.avif%22,%22google_business%22:%22%22,%22facebook%22:%22http://www.facebook.com/ImmigrationLawNJ%22,%22facebook_photo%22:%22/img/socialmedia_1200x630.jpg%22,%22facebook_type%22:%22website%22,%22twitter%22:%22http://twitter.com/hyorklaw%22,%22twitter_photo%22:%22/img/socialmedia_1200x630.jpg%22,%22instagram%22:%22%22,%22linkedin%22:%22http://www.linkedin.com/in/harlanyork%22,%22youtube%22:%22http://www.youtube.com/user/HYORKLAW%22,%22vimeo%22:%22%22,%22rss%22:%22%22,%22blog%22:%22%22,%22etsy%22:%22%22,%22yelp%22:%22%22,%22airbnb%22:%22%22,%22tiktok%22:%22%22,%22snapchat%22:%22%22,%22pinterest%22:%22%22,%22vcf_file%22:%22/harlan_york.vcf%22,%22calendar%22:%22https://calendly.com/immigrationlawnj/30min-consultation/%22,%22author%22:%22Nelson%20Design%20Collective%22,%22author_url%22:%22http://nelsondesigncollective.com%22,%22author_email%22:%22info@nelsondesigncollective.com%22,%22paypal%22:%22PayFees@immigrationlawnj.com%22,%22lawpay%22:%22https://secure.lawpay.com/pages/immigrationlawnj/operating%22%7D,%22pwa%22:%7B%22app_color%22:%22#800E16%22,%22app_background%22:%22#800E16%22,%22app_name%22:%22Harlan%20York%20and%20Associates%20%E2%80%93%20Immigration%20Attorneys%22%7D,%22sources%22:%7B%22wordpress%22:%22https://admin.immigrationlawnj.com/graphql%22%7D%7D"));
const {config: config$1} = MILK_CFG$1;
const Q_GET_SERVICES = `query getServices($size: Int = ${config$1.pagination_size}) {
	services(first: $size) {
		nodes {
			slug
			title(format: RENDERED)
			Services {
				icon {
					sourceUrl
				}
				excerpt
				description
			}
		}
	}
}`;
const Q_GET_SERVICE = `query getService($id: ID!){
	service(id:$id, idType: SLUG) {
	  id
	  slug
	  title
	  serviceId
	  content
	  date
	  Services {
		description
		excerpt
		serviceFaq {
      	  faqTitle
      	  faqContent
      	}
		relatedPosts {
		  ... on Post {
			id
			title
			slug
			featuredImage {
          	  node {
          	    sourceUrl
          	  }
          	}
		  }
		}
	  }
	  enqueuedScripts {
		nodes {
		  src
		}
	  }
	  enqueuedStylesheets {
		nodes {
		  src
		}
	  }
	  featuredImage {
		node {
		  sourceUrl
		}
	  }
	}
  }`;
const Q_GET_FEATURED = `query getFeatured($size: Int = ${config$1.pagination_size}) {
	featuredOns(first: $size) {
		nodes {
			slug
			title(format: RENDERED)
			FeaturedOn {
				avifImage {
					sourceUrl
				}
				pngImage {
					sourceUrl
				}
				webpImage {
					sourceUrl
				}
				link
			}
		}
	}
}`;
const Q_GET_RATINGS = `query getRatings($size: Int = ${config$1.pagination_size}) {
	ratings(first: $size) {
		nodes {
			Ratings {
				link
				rating
			}
			slug
			title
		}
	}
}`;
const Q_GET_TESTIMONIALS = `query getTestimonials($size: Int = ${config$1.pagination_size}) {
	testimonials(first: $size) {
		nodes {
			Testimonial {
				avifImage {
					sourceUrl
				}
				jpgImage {
					sourceUrl
				}
				webpImage {
					sourceUrl
				}
				rating
				testimonial
				relationship
			}
			slug
			title
		}
	}
}`;
const Q_GET_FAQS = `query getFAQs($size: Int = ${config$1.pagination_size}) {
	fAQs(first: $size) {
		nodes {
			slug
			title
			FAQ {
				answer
			}
		}
	}
}`;
const Q_GET_TEAM = `query getTeam($size: Int = ${config$1.pagination_size}) {
	attorneys(first: $size) {
		nodes {
			title
			slug
			Attorney {
				additionalDescription
				email
				avifImage {
					sourceUrl
				}
				shortDescription
				jpegImage {
					sourceUrl
				}
				webpImage {
					sourceUrl
				}
			}
		}
	}
}`;
const Q_GET_EBOOKBYID = `query getEBook($id: ID) {
	eBookBy(id: $id) {
		slug
		title(format: RENDERED)
		date
		eBook {
			avifImage {
				sourceUrl
			}
			jpegImage {
				sourceUrl
			}
			pdf {
				mediaItemUrl
			}
			webpImage {
				sourceUrl
			}
			shortDescription
		}
	}
}`;
const Q_GET_EBOOKS = `query getEBooks($size: Int = ${config$1.pagination_size}) {
	eBooks(first: $size) {
		nodes {
			slug
			title(format: RENDERED)
			date
			eBook {
				avifImage {
					sourceUrl
				}
				jpegImage {
					sourceUrl
				}
				pdf {
					mediaItemUrl
				}
				webpImage {
					sourceUrl
				}
				shortDescription
			}
		}
	}
}`;
const Q_GET_VIDEOS = `query getVideos($size: Int = ${config$1.pagination_size}) {
	videos(first: $size) {
		nodes {
			slug
			title(format: RENDERED)
			date
			Video {
				avifImage {
					sourceUrl
				}
				jpegImage {
					sourceUrl
				}
				webpImage {
					sourceUrl
				}
				video
			}
		}
	}
}`;
var Block_Team_svelte = ".team.svelte-16oxioc.svelte-16oxioc{display:block;padding:50px 20px;padding:50px var(--padding-inner,20px);text-align:center}.team-inner.svelte-16oxioc.svelte-16oxioc{margin:0 auto;max-width:var(--content-constrain)}h2.svelte-16oxioc.svelte-16oxioc,h3.svelte-16oxioc.svelte-16oxioc,p.svelte-16oxioc.svelte-16oxioc{color:#fff;color:var(--color-white,#fff)}h2.svelte-16oxioc.svelte-16oxioc{margin-bottom:50px;font-size:var(--extralarge-fontsize)}h3.svelte-16oxioc.svelte-16oxioc{font-family:var(--font-main);color:var(--color-three)}@media screen and (min-width:650px){.team.svelte-16oxioc .blurb.svelte-16oxioc{margin:var(--padding);display:grid;grid-template-columns:1fr 2fr;text-align:left;-moz-column-gap:3em;grid-column-gap:3em;column-gap:3em}}.attorneys.svelte-16oxioc.svelte-16oxioc{padding:var(--padding-large) 0 0;text-align:center}.attorney.svelte-16oxioc.svelte-16oxioc{display:inline-block;vertical-align:top;margin:0 var(--padding) var(--padding) 0;transition:color var(--transition-speed)}@media screen and (max-width:650px){.attorneys.svelte-16oxioc.svelte-16oxioc{padding:var(--padding)}.attorney.svelte-16oxioc.svelte-16oxioc{margin:0 0 var(--padding)}.attorney.svelte-16oxioc.svelte-16oxioc:first-child{display:block}.attorney.svelte-16oxioc img.svelte-16oxioc{width:100%;height:auto}}.attorney.svelte-16oxioc .name.svelte-16oxioc{background:var(--color-white);padding:var(--padding);color:var(--color-black);font-weight:700;font-family:var(--font-main)!important}.attorney.svelte-16oxioc .name .go.svelte-16oxioc{display:inline-block;vertical-align:middle;float:right;width:20px;height:20px;margin-top:-5px;transition:color var(--transition-speed)}.attorney.svelte-16oxioc:hover .name .go.svelte-16oxioc{color:var(--color-three);transition:color var(--transition-speed)}";
const css$s = {
  code: ".team.svelte-16oxioc.svelte-16oxioc{display:block;padding:50px 20px;padding:50px var(--padding-inner,20px);text-align:center}.team-inner.svelte-16oxioc.svelte-16oxioc{margin:0 auto;max-width:var(--content-constrain)}h2.svelte-16oxioc.svelte-16oxioc,h3.svelte-16oxioc.svelte-16oxioc,p.svelte-16oxioc.svelte-16oxioc{color:#fff;color:var(--color-white,#fff)}h2.svelte-16oxioc.svelte-16oxioc{margin-bottom:50px;font-size:var(--extralarge-fontsize)}h3.svelte-16oxioc.svelte-16oxioc{font-family:var(--font-main);color:var(--color-three)}@media screen and (min-width:650px){.team.svelte-16oxioc .blurb.svelte-16oxioc{margin:var(--padding);display:grid;grid-template-columns:1fr 2fr;text-align:left;grid-column-gap:3em;-moz-column-gap:3em;column-gap:3em}}.attorneys.svelte-16oxioc.svelte-16oxioc{padding:var(--padding-large) 0 0;text-align:center}.attorney.svelte-16oxioc.svelte-16oxioc{display:inline-block;vertical-align:top;margin:0 var(--padding) var(--padding) 0;transition:color var(--transition-speed)}@media screen and (max-width:650px){.attorneys.svelte-16oxioc.svelte-16oxioc{padding:var(--padding)}.attorney.svelte-16oxioc.svelte-16oxioc{margin:0 0 var(--padding)}.attorney.svelte-16oxioc.svelte-16oxioc:first-child{display:block}.attorney.svelte-16oxioc img.svelte-16oxioc{width:100%;height:auto}}.attorney.svelte-16oxioc .name.svelte-16oxioc{background:var(--color-white);padding:var(--padding);color:var(--color-black);font-weight:700;font-family:var(--font-main)!important}.attorney.svelte-16oxioc .name .go.svelte-16oxioc{display:inline-block;vertical-align:middle;float:right;width:20px;height:20px;margin-top:-5px;transition:color var(--transition-speed)}.attorney.svelte-16oxioc:hover .name .go.svelte-16oxioc{color:var(--color-three);transition:color var(--transition-speed)}",
  map: `{"version":3,"file":"Block_Team.svelte","sources":["Block_Team.svelte"],"sourcesContent":["<div {id} class={blockclass}>\\n\\t<div class=\\"team-inner\\">\\n\\t\\t<h2>Your Legal Team</h2>\\n\\t\\t<div class=\\"blurb\\">\\n\\t\\t\\t<h3>\\n\\t\\t\\t\\tWe Believe in 24/7 Personal Access To Your Immigration Lawyers.\\n\\t\\t\\t</h3>\\n\\t\\t\\t<div class=\\"block-content\\">\\n\\t\\t\\t\\t<p>\\n\\t\\t\\t\\t\\tWe reply to phone calls within 24 hours or less in most\\n\\t\\t\\t\\t\\tcases.\\n\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t<p>\\n\\t\\t\\t\\t\\tWe answer emails on nights and weekends, use texting during\\n\\t\\t\\t\\t\\temergency cases. At the same time, our entire firm works\\n\\t\\t\\t\\t\\ttogether to win your case as your dedicated legal team.\\n\\t\\t\\t\\t</p>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t\\t<div class=\\"attorneys-container\\">\\n\\t\\t\\t<div class=\\"attorneys\\">\\n\\t\\t\\t\\t{#each team as attorney}\\n\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\thref={\`/immigration-attorneys#\${attorney?.slug}\`}\\n\\t\\t\\t\\t\\t\\ttitle={attorney?.title}\\n\\t\\t\\t\\t\\t\\tclass=\\"attorney\\"\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t<picture>\\n\\t\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"image/avif\\"\\n\\t\\t\\t\\t\\t\\t\\t\\tsrcset={attorney?.Attorney?.avifImage\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"image/webp\\"\\n\\t\\t\\t\\t\\t\\t\\t\\tsrcset={attorney?.Attorney?.webpImage\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\t\\t\\tsrc={attorney?.Attorney?.jpegImage?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\talt={attorney?.title}\\n\\t\\t\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\t\\t\\twidth=\\"260\\"\\n\\t\\t\\t\\t\\t\\t\\t\\theight=\\"260\\"\\n\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t</picture>\\n\\t\\t\\t\\t\\t\\t<div class=\\"name\\">\\n\\t\\t\\t\\t\\t\\t\\t{attorney?.title}\\n\\t\\t\\t\\t\\t\\t\\t<span class=\\"go\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t<svg\\n\\t\\t\\t\\t\\t\\t\\t\\t\\taria-hidden=\\"true\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tfocusable=\\"false\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\trole=\\"img\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\txmlns=\\"http://www.w3.org/2000/svg\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tviewBox=\\"0 0 320 512\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t><path\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tfill=\\"currentColor\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\td=\\"M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t/></svg\\n\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t</span>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t{/each}\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t\\t<div>\\n\\t\\t\\t<a href=\\"/immigration-attorneys\\" class=\\"fancy-link\\">\\n\\t\\t\\t\\t<span>View Our Attorneys</span>\\n\\t\\t\\t</a>\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<script>function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount, onDestroy } from 'svelte';\\n/* ## MILK ## */\\n\\nimport { milk } from '$milk/milk.js';\\nvar id;\\nvar blockstyle = '';\\nvar blockclass = 'team';\\n\\n$: blockclass = \\"team \\" + blockstyle;\\n/* ## Data Loading ## */\\n\\n\\nimport { preload_attorneys } from '$graphql/sitespecific.preload.js';\\nvar team = preload_attorneys;\\n\\nvar unsubscribe_team = () => {};\\n\\nimport { Q_GET_TEAM } from '$graphql/sitespecific.graphql.js';\\n/* ## Main ## */\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  var _$milk, _$milk$data;\\n\\n  var queryVariables = {\\n    size: 10\\n  };\\n  var getTeam = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_TEAM, $milk.data.sources.wordpress, queryVariables);\\n  unsubscribe_team = yield getTeam == null ? void 0 : getTeam.subscribe( /*#__PURE__*/function () {\\n    var _ref2 = _asyncToGenerator(function* (fetched_data) {\\n      var data = yield fetched_data; // console.log(data);\\n\\n      team = data.attorneys.nodes;\\n    });\\n\\n    return function (_x) {\\n      return _ref2.apply(this, arguments);\\n    };\\n  }());\\n}));\\n/* ## Exit ## */\\n\\nonDestroy(() => {\\n  unsubscribe_team(); // important for garbage collection otherwise memory leak\\n});\\n/* ## Exports ## */\\n\\nexport { id, blockstyle };</script>\\n\\n<style>.team{display:block;padding:50px 20px;padding:50px var(--padding-inner,20px);text-align:center}.team-inner{margin:0 auto;max-width:var(--content-constrain)}h2,h3,p{color:#fff;color:var(--color-white,#fff)}h2{margin-bottom:50px;font-size:var(--extralarge-fontsize)}h3{font-family:var(--font-main);color:var(--color-three)}@media screen and (min-width:650px){.team .blurb{margin:var(--padding);display:grid;grid-template-columns:1fr 2fr;text-align:left;grid-column-gap:3em;-moz-column-gap:3em;column-gap:3em}}.attorneys{padding:var(--padding-large) 0 0;text-align:center}.attorney{display:inline-block;vertical-align:top;margin:0 var(--padding) var(--padding) 0;transition:color var(--transition-speed)}@media screen and (max-width:650px){.attorneys{padding:var(--padding)}.attorney{margin:0 0 var(--padding)}.attorney:first-child{display:block}.attorney img{width:100%;height:auto}}.attorney .name{background:var(--color-white);padding:var(--padding);color:var(--color-black);font-weight:700;font-family:var(--font-main)!important}.attorney .name .go{display:inline-block;vertical-align:middle;float:right;width:20px;height:20px;margin-top:-5px;transition:color var(--transition-speed)}.attorney:hover .name .go{color:var(--color-three);transition:color var(--transition-speed)}</style>\\n"],"names":[],"mappings":"AA+HO,mCAAK,CAAC,QAAQ,KAAK,CAAC,QAAQ,IAAI,CAAC,IAAI,CAAC,QAAQ,IAAI,CAAC,IAAI,eAAe,CAAC,IAAI,CAAC,CAAC,WAAW,MAAM,CAAC,yCAAW,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,IAAI,mBAAmB,CAAC,CAAC,gCAAE,CAAC,gCAAE,CAAC,+BAAC,CAAC,MAAM,IAAI,CAAC,MAAM,IAAI,aAAa,CAAC,IAAI,CAAC,CAAC,gCAAE,CAAC,cAAc,IAAI,CAAC,UAAU,IAAI,qBAAqB,CAAC,CAAC,gCAAE,CAAC,YAAY,IAAI,WAAW,CAAC,CAAC,MAAM,IAAI,aAAa,CAAC,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,oBAAK,CAAC,qBAAM,CAAC,OAAO,IAAI,SAAS,CAAC,CAAC,QAAQ,IAAI,CAAC,sBAAsB,GAAG,CAAC,GAAG,CAAC,WAAW,IAAI,CAAC,gBAAgB,GAAG,CAAC,gBAAgB,GAAG,CAAC,WAAW,GAAG,CAAC,CAAC,wCAAU,CAAC,QAAQ,IAAI,eAAe,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,WAAW,MAAM,CAAC,uCAAS,CAAC,QAAQ,YAAY,CAAC,eAAe,GAAG,CAAC,OAAO,CAAC,CAAC,IAAI,SAAS,CAAC,CAAC,IAAI,SAAS,CAAC,CAAC,CAAC,CAAC,WAAW,KAAK,CAAC,IAAI,kBAAkB,CAAC,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,wCAAU,CAAC,QAAQ,IAAI,SAAS,CAAC,CAAC,uCAAS,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,IAAI,SAAS,CAAC,CAAC,uCAAS,YAAY,CAAC,QAAQ,KAAK,CAAC,wBAAS,CAAC,kBAAG,CAAC,MAAM,IAAI,CAAC,OAAO,IAAI,CAAC,CAAC,wBAAS,CAAC,oBAAK,CAAC,WAAW,IAAI,aAAa,CAAC,CAAC,QAAQ,IAAI,SAAS,CAAC,CAAC,MAAM,IAAI,aAAa,CAAC,CAAC,YAAY,GAAG,CAAC,YAAY,IAAI,WAAW,CAAC,UAAU,CAAC,wBAAS,CAAC,KAAK,CAAC,kBAAG,CAAC,QAAQ,YAAY,CAAC,eAAe,MAAM,CAAC,MAAM,KAAK,CAAC,MAAM,IAAI,CAAC,OAAO,IAAI,CAAC,WAAW,IAAI,CAAC,WAAW,KAAK,CAAC,IAAI,kBAAkB,CAAC,CAAC,wBAAS,MAAM,CAAC,KAAK,CAAC,kBAAG,CAAC,MAAM,IAAI,aAAa,CAAC,CAAC,WAAW,KAAK,CAAC,IAAI,kBAAkB,CAAC,CAAC"}`
};
function asyncGeneratorStep$p(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$p(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$p(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$p(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Block_Team = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var {id} = $$props;
  var {blockstyle = ""} = $$props;
  var blockclass = "team";
  var team = preload_attorneys;
  var unsubscribe_team = () => {
  };
  onMount(/* @__PURE__ */ _asyncToGenerator$p(function* () {
    var _$milk, _$milk$data;
    var queryVariables = {size: 10};
    var getTeam = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_TEAM, $milk.data.sources.wordpress, queryVariables);
    unsubscribe_team = yield getTeam == null ? void 0 : getTeam.subscribe(/* @__PURE__ */ function() {
      var _ref2 = _asyncToGenerator$p(function* (fetched_data) {
        var data = yield fetched_data;
        team = data.attorneys.nodes;
      });
      return function(_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  }));
  onDestroy(() => {
    unsubscribe_team();
  });
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  $$result.css.add(css$s);
  blockclass = "team " + blockstyle;
  $$unsubscribe_milk();
  return `<div${add_attribute("id", id, 0)} class="${escape(null_to_empty(blockclass)) + " svelte-16oxioc"}"><div class="${"team-inner svelte-16oxioc"}"><h2 class="${"svelte-16oxioc"}">Your Legal Team</h2>
		<div class="${"blurb svelte-16oxioc"}"><h3 class="${"svelte-16oxioc"}">We Believe in 24/7 Personal Access To Your Immigration Lawyers.
			</h3>
			<div class="${"block-content"}"><p class="${"svelte-16oxioc"}">We reply to phone calls within 24 hours or less in most
					cases.
				</p>
				<p class="${"svelte-16oxioc"}">We answer emails on nights and weekends, use texting during
					emergency cases. At the same time, our entire firm works
					together to win your case as your dedicated legal team.
				</p></div></div>
		<div class="${"attorneys-container"}"><div class="${"attorneys svelte-16oxioc"}">${each(team, (attorney) => {
    var _a, _b, _c, _d, _e, _f;
    return `<a${add_attribute("href", `/immigration-attorneys#${attorney == null ? void 0 : attorney.slug}`, 0)}${add_attribute("title", attorney == null ? void 0 : attorney.title, 0)} class="${"attorney svelte-16oxioc"}"><picture><source type="${"image/avif"}"${add_attribute("srcset", (_b = (_a = attorney == null ? void 0 : attorney.Attorney) == null ? void 0 : _a.avifImage) == null ? void 0 : _b.sourceUrl, 0)}>
							<source type="${"image/webp"}"${add_attribute("srcset", (_d = (_c = attorney == null ? void 0 : attorney.Attorney) == null ? void 0 : _c.webpImage) == null ? void 0 : _d.sourceUrl, 0)}>
							<img${add_attribute("src", (_f = (_e = attorney == null ? void 0 : attorney.Attorney) == null ? void 0 : _e.jpegImage) == null ? void 0 : _f.sourceUrl, 0)}${add_attribute("alt", attorney == null ? void 0 : attorney.title, 0)} loading="${"lazy"}" width="${"260"}" height="${"260"}" class="${"svelte-16oxioc"}"></picture>
						<div class="${"name svelte-16oxioc"}">${escape(attorney == null ? void 0 : attorney.title)}
							<span class="${"go svelte-16oxioc"}"><svg aria-hidden="${"true"}" focusable="${"false"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 320 512"}"><path fill="${"currentColor"}" d="${"M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"}"></path></svg>
							</span></div>
					</a>`;
  })}</div></div>
		<div><a href="${"/immigration-attorneys"}" class="${"fancy-link"}"><span>View Our Attorneys</span></a></div></div>
</div>`;
});
var Block_Services_svelte = ".services.svelte-wcn416.svelte-wcn416{display:block;padding:var(--padding-large);text-align:center}.services-inner.svelte-wcn416.svelte-wcn416{padding:50px 20px 100px;padding:50px var(--padding-inner,20px) 100px;margin:0 auto;max-width:var(--content-constrain);background:#f4f4f4;background:var(--color-offwhite,#f4f4f4)}h2.svelte-wcn416.svelte-wcn416,h3.svelte-wcn416.svelte-wcn416,p.svelte-wcn416.svelte-wcn416{color:#000;color:var(--color-black,#000)}h2.svelte-wcn416.svelte-wcn416{font-size:var(--extralarge-fontsize);margin-bottom:40px}h3.svelte-wcn416.svelte-wcn416{color:var(--color-one);font-family:var(--font-main)}.service.svelte-wcn416.svelte-wcn416{background-color:#fff;display:inline-block;vertical-align:top;position:relative;width:275px;max-width:80%;height:auto;margin:clamp(10px,4vw,30px);transition:all .3s ease;transform-origin:center;transform:scale(1);padding:20px 15px}.service.svelte-wcn416.svelte-wcn416:hover{transform:scale(1.1);background:rgba(0,0,0,.05)}.service.svelte-wcn416 h4.svelte-wcn416{font-weight:400;text-transform:uppercase;margin-bottom:0}.service.svelte-wcn416 p.svelte-wcn416{font-size:14px;font-size:calc(var(--font-size-small, 15px) - 1px)}.service.svelte-wcn416 a.svelte-wcn416{text-decoration:none;color:var(--color-black)}.icon.svelte-wcn416.svelte-wcn416{width:50px;height:auto;margin-bottom:10px}@media screen and (max-width:850px){.services-inner.svelte-wcn416.svelte-wcn416{padding:2vw 10px;padding:var(--padding-outer,2vw) 10px}.service.svelte-wcn416.svelte-wcn416{margin:clamp(10px,4vw,30px) 5px;width:265px}}@media screen and (max-width:500px){.services.svelte-wcn416.svelte-wcn416{padding:5vw 20px;padding:var(--padding-outer,5vw) 20px}.services-inner.svelte-wcn416.svelte-wcn416{padding:5vw 10px;padding:var(--padding-outer,5vw) 10px}.service.svelte-wcn416.svelte-wcn416{width:250px;margin-left:-15px;margin-right:-15px;max-width:100%}.service.svelte-wcn416 h4.svelte-wcn416{font-size:19px;font-size:calc(var(--font-size-h4, 22px) - 3px)}}@media screen and (max-width:350px){.services.svelte-wcn416.svelte-wcn416{padding:5vw 15px;padding:var(--padding-outer,5vw) 15px}.services-inner.svelte-wcn416.svelte-wcn416{padding:5vw 0;padding:var(--padding-outer,5vw) 0}.service.svelte-wcn416.svelte-wcn416{width:220px}}@media screen and (min-width:650px){.services.svelte-wcn416 .blurb.svelte-wcn416{margin:var(--padding);display:grid;grid-template-columns:1fr 2fr;text-align:left;-moz-column-gap:3em;grid-column-gap:3em;column-gap:3em}}";
const css$r = {
  code: ".services.svelte-wcn416.svelte-wcn416{display:block;padding:var(--padding-large);text-align:center}.services-inner.svelte-wcn416.svelte-wcn416{padding:50px 20px 100px;padding:50px var(--padding-inner,20px) 100px;margin:0 auto;max-width:var(--content-constrain);background:#f4f4f4;background:var(--color-offwhite,#f4f4f4)}h2.svelte-wcn416.svelte-wcn416,h3.svelte-wcn416.svelte-wcn416,p.svelte-wcn416.svelte-wcn416{color:#000;color:var(--color-black,#000)}h2.svelte-wcn416.svelte-wcn416{font-size:var(--extralarge-fontsize);margin-bottom:40px}h3.svelte-wcn416.svelte-wcn416{color:var(--color-one);font-family:var(--font-main)}.service.svelte-wcn416.svelte-wcn416{background-color:#fff;display:inline-block;vertical-align:top;position:relative;width:275px;max-width:80%;height:auto;margin:clamp(10px,4vw,30px);transition:all .3s ease;transform-origin:center;transform:scale(1);padding:20px 15px}.service.svelte-wcn416.svelte-wcn416:hover{transform:scale(1.1);background:rgba(0,0,0,.05)}.service.svelte-wcn416 h4.svelte-wcn416{font-weight:400;text-transform:uppercase;margin-bottom:0}.service.svelte-wcn416 p.svelte-wcn416{font-size:14px;font-size:calc(var(--font-size-small, 15px) - 1px)}.service.svelte-wcn416 a.svelte-wcn416{text-decoration:none;color:var(--color-black)}.icon.svelte-wcn416.svelte-wcn416{width:50px;height:auto;margin-bottom:10px}@media screen and (max-width:850px){.services-inner.svelte-wcn416.svelte-wcn416{padding:2vw 10px;padding:var(--padding-outer,2vw) 10px}.service.svelte-wcn416.svelte-wcn416{margin:clamp(10px,4vw,30px) 5px;width:265px}}@media screen and (max-width:500px){.services.svelte-wcn416.svelte-wcn416{padding:5vw 20px;padding:var(--padding-outer,5vw) 20px}.services-inner.svelte-wcn416.svelte-wcn416{padding:5vw 10px;padding:var(--padding-outer,5vw) 10px}.service.svelte-wcn416.svelte-wcn416{width:250px;margin-left:-15px;margin-right:-15px;max-width:100%}.service.svelte-wcn416 h4.svelte-wcn416{font-size:19px;font-size:calc(var(--font-size-h4, 22px) - 3px)}}@media screen and (max-width:350px){.services.svelte-wcn416.svelte-wcn416{padding:5vw 15px;padding:var(--padding-outer,5vw) 15px}.services-inner.svelte-wcn416.svelte-wcn416{padding:5vw 0;padding:var(--padding-outer,5vw) 0}.service.svelte-wcn416.svelte-wcn416{width:220px}}@media screen and (min-width:650px){.services.svelte-wcn416 .blurb.svelte-wcn416{margin:var(--padding);display:grid;grid-template-columns:1fr 2fr;text-align:left;grid-column-gap:3em;-moz-column-gap:3em;column-gap:3em}}",
  map: `{"version":3,"file":"Block_Services.svelte","sources":["Block_Services.svelte"],"sourcesContent":["<div {id} class={blockclass}>\\n\\t<div class=\\"services-inner\\">\\n\\t\\t<h2>Immigration Law Is All We Do</h2>\\n\\t\\t<div class=\\"blurb\\">\\n\\t\\t\\t<h3>\\n\\t\\t\\t\\tWhen Your Freedom Is On The Line, Why Hire Lawyers Who Only\\n\\t\\t\\t\\tDabble In Immigration?\\n\\t\\t\\t</h3>\\n\\t\\t\\t<div class=\\"block-content\\">\\n\\t\\t\\t\\t<p>\\n\\t\\t\\t\\t\\tHarlan York & Associates is one of the most successful firms\\n\\t\\t\\t\\t\\tin the country.\\n\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t<p>\\n\\t\\t\\t\\t\\tUsing our extensive experience on thousands of immigration\\n\\t\\t\\t\\t\\tcases and daily reviews of new developments in the changing\\n\\t\\t\\t\\t\\tfield of immigration law, we offer you the best legal\\n\\t\\t\\t\\t\\tcounsel available. Best Lawyers, the most respected\\n\\t\\t\\t\\t\\tpublication in the legal profession.\\n\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t<p>\\n\\t\\t\\t\\t\\tHarlan York & Associates are the best immigration lawyers\\n\\t\\t\\t\\t\\tfor Green Cards, Deportation, Family Immigration, and\\n\\t\\t\\t\\t\\tNaturalization in New York, New Jersey, and the area. Harlan\\n\\t\\t\\t\\t\\tYork is the first attorney in New Jersey to be named\\n\\t\\t\\t\\t\\tImmigration Lawyer of the Year by Best Lawyers, the most\\n\\t\\t\\t\\t\\trespected publication in the legal profession.\\n\\t\\t\\t\\t</p>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t\\t<div class=\\"listing-grid services-listing\\">\\n\\t\\t\\t{#each services as service}\\n\\t\\t\\t\\t<div class=\\"service\\">\\n\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\thref={\`/immigration-law-services/\${service?.slug}\`}\\n\\t\\t\\t\\t\\t\\ttitle={service?.title}\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t<div>\\n\\t\\t\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"icon\\"\\n\\t\\t\\t\\t\\t\\t\\t\\tsrc={service?.Services?.icon?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\talt={service?.title}\\n\\t\\t\\t\\t\\t\\t\\t\\twidth=\\"40\\"\\n\\t\\t\\t\\t\\t\\t\\t\\theight=\\"40\\"\\n\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t<h4>{service?.title}</h4>\\n\\t\\t\\t\\t\\t\\t<div>\\n\\t\\t\\t\\t\\t\\t\\t{@html cleanUp(service?.Services?.excerpt)}\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t{/each}\\n\\t\\t</div>\\n\\t\\t<div>\\n\\t\\t\\t<a href=\\"/immigration-law-services\\" class=\\"fancy-link\\">\\n\\t\\t\\t\\t<span>View All Services</span>\\n\\t\\t\\t</a>\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<script>function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount, onDestroy } from 'svelte';\\n/* ## MILK ## */\\n\\nimport { milk } from '$milk/milk.js';\\nimport { stripTags } from '$milk/util/helpers.js';\\n/* ## Variables ## */\\n\\nvar id;\\nvar blockstyle = '';\\nvar blockclass = 'services';\\n\\n$: blockclass = \\"services \\" + blockstyle;\\n/* ## Data Loading ## */\\n\\n\\nimport { preload_services } from '$graphql/sitespecific.preload.js';\\nvar services = preload_services.slice(0, 6);\\n\\nvar unsubscribe_services = () => {};\\n\\nimport { Q_GET_SERVICES } from '$graphql/sitespecific.graphql.js';\\n/* ## Main ## */\\n\\nvar cleanUp = html => {\\n  return html.replace(/\\\\u00a0/g, ' ');\\n};\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  var _$milk, _$milk$data;\\n\\n  cleanUp = html => {\\n    return stripTags(html).replace(/\\\\u00a0/g, ' ');\\n  };\\n\\n  var queryVariables = {\\n    size: 999\\n  };\\n  var getServices = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_SERVICES, $milk.data.sources.wordpress, queryVariables);\\n  unsubscribe_services = yield getServices == null ? void 0 : getServices.subscribe( /*#__PURE__*/function () {\\n    var _ref2 = _asyncToGenerator(function* (fetched_data) {\\n      var data = yield fetched_data; // console.log(data);\\n\\n      services = data.services.nodes.slice(0, 6);\\n    });\\n\\n    return function (_x) {\\n      return _ref2.apply(this, arguments);\\n    };\\n  }());\\n}));\\n/* ## Exit ## */\\n\\nonDestroy(() => {\\n  unsubscribe_services(); // important for garbage collection otherwise memory leak\\n});\\n/* ## Exports ## */\\n\\nexport { id, blockstyle };</script>\\n\\n<style>.services{display:block;padding:var(--padding-large);text-align:center}.services-inner{padding:50px 20px 100px;padding:50px var(--padding-inner,20px) 100px;margin:0 auto;max-width:var(--content-constrain);background:#f4f4f4;background:var(--color-offwhite,#f4f4f4)}h2,h3,p{color:#000;color:var(--color-black,#000)}h2{font-size:var(--extralarge-fontsize);margin-bottom:40px}h3{color:var(--color-one);font-family:var(--font-main)}.service{background-color:#fff;display:inline-block;vertical-align:top;position:relative;width:275px;max-width:80%;height:auto;margin:clamp(10px,4vw,30px);transition:all .3s ease;transform-origin:center;transform:scale(1);padding:20px 15px}.service:hover{transform:scale(1.1);background:rgba(0,0,0,.05)}.service h4{font-weight:400;text-transform:uppercase;margin-bottom:0}.service p{font-size:14px;font-size:calc(var(--font-size-small, 15px) - 1px)}.service a{text-decoration:none;color:var(--color-black)}.icon{width:50px;height:auto;margin-bottom:10px}@media screen and (max-width:850px){.services-inner{padding:2vw 10px;padding:var(--padding-outer,2vw) 10px}.service{margin:clamp(10px,4vw,30px) 5px;width:265px}}@media screen and (max-width:500px){.services{padding:5vw 20px;padding:var(--padding-outer,5vw) 20px}.services-inner{padding:5vw 10px;padding:var(--padding-outer,5vw) 10px}.service{width:250px;margin-left:-15px;margin-right:-15px;max-width:100%}.service h4{font-size:19px;font-size:calc(var(--font-size-h4, 22px) - 3px)}}@media screen and (max-width:350px){.services{padding:5vw 15px;padding:var(--padding-outer,5vw) 15px}.services-inner{padding:5vw 0;padding:var(--padding-outer,5vw) 0}.service{width:220px}}@media screen and (min-width:650px){.services .blurb{margin:var(--padding);display:grid;grid-template-columns:1fr 2fr;text-align:left;grid-column-gap:3em;-moz-column-gap:3em;column-gap:3em}}</style>\\n"],"names":[],"mappings":"AA8HO,qCAAS,CAAC,QAAQ,KAAK,CAAC,QAAQ,IAAI,eAAe,CAAC,CAAC,WAAW,MAAM,CAAC,2CAAe,CAAC,QAAQ,IAAI,CAAC,IAAI,CAAC,KAAK,CAAC,QAAQ,IAAI,CAAC,IAAI,eAAe,CAAC,IAAI,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,IAAI,mBAAmB,CAAC,CAAC,WAAW,OAAO,CAAC,WAAW,IAAI,gBAAgB,CAAC,OAAO,CAAC,CAAC,8BAAE,CAAC,8BAAE,CAAC,6BAAC,CAAC,MAAM,IAAI,CAAC,MAAM,IAAI,aAAa,CAAC,IAAI,CAAC,CAAC,8BAAE,CAAC,UAAU,IAAI,qBAAqB,CAAC,CAAC,cAAc,IAAI,CAAC,8BAAE,CAAC,MAAM,IAAI,WAAW,CAAC,CAAC,YAAY,IAAI,WAAW,CAAC,CAAC,oCAAQ,CAAC,iBAAiB,IAAI,CAAC,QAAQ,YAAY,CAAC,eAAe,GAAG,CAAC,SAAS,QAAQ,CAAC,MAAM,KAAK,CAAC,UAAU,GAAG,CAAC,OAAO,IAAI,CAAC,OAAO,MAAM,IAAI,CAAC,GAAG,CAAC,IAAI,CAAC,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,iBAAiB,MAAM,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,QAAQ,IAAI,CAAC,IAAI,CAAC,oCAAQ,MAAM,CAAC,UAAU,MAAM,GAAG,CAAC,CAAC,WAAW,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,sBAAQ,CAAC,gBAAE,CAAC,YAAY,GAAG,CAAC,eAAe,SAAS,CAAC,cAAc,CAAC,CAAC,sBAAQ,CAAC,eAAC,CAAC,UAAU,IAAI,CAAC,UAAU,KAAK,IAAI,iBAAiB,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,sBAAQ,CAAC,eAAC,CAAC,gBAAgB,IAAI,CAAC,MAAM,IAAI,aAAa,CAAC,CAAC,iCAAK,CAAC,MAAM,IAAI,CAAC,OAAO,IAAI,CAAC,cAAc,IAAI,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,2CAAe,CAAC,QAAQ,GAAG,CAAC,IAAI,CAAC,QAAQ,IAAI,eAAe,CAAC,GAAG,CAAC,CAAC,IAAI,CAAC,oCAAQ,CAAC,OAAO,MAAM,IAAI,CAAC,GAAG,CAAC,IAAI,CAAC,CAAC,GAAG,CAAC,MAAM,KAAK,CAAC,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,qCAAS,CAAC,QAAQ,GAAG,CAAC,IAAI,CAAC,QAAQ,IAAI,eAAe,CAAC,GAAG,CAAC,CAAC,IAAI,CAAC,2CAAe,CAAC,QAAQ,GAAG,CAAC,IAAI,CAAC,QAAQ,IAAI,eAAe,CAAC,GAAG,CAAC,CAAC,IAAI,CAAC,oCAAQ,CAAC,MAAM,KAAK,CAAC,YAAY,KAAK,CAAC,aAAa,KAAK,CAAC,UAAU,IAAI,CAAC,sBAAQ,CAAC,gBAAE,CAAC,UAAU,IAAI,CAAC,UAAU,KAAK,IAAI,cAAc,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,qCAAS,CAAC,QAAQ,GAAG,CAAC,IAAI,CAAC,QAAQ,IAAI,eAAe,CAAC,GAAG,CAAC,CAAC,IAAI,CAAC,2CAAe,CAAC,QAAQ,GAAG,CAAC,CAAC,CAAC,QAAQ,IAAI,eAAe,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,oCAAQ,CAAC,MAAM,KAAK,CAAC,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,uBAAS,CAAC,oBAAM,CAAC,OAAO,IAAI,SAAS,CAAC,CAAC,QAAQ,IAAI,CAAC,sBAAsB,GAAG,CAAC,GAAG,CAAC,WAAW,IAAI,CAAC,gBAAgB,GAAG,CAAC,gBAAgB,GAAG,CAAC,WAAW,GAAG,CAAC,CAAC"}`
};
function asyncGeneratorStep$o(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$o(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$o(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$o(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Block_Services = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var {id} = $$props;
  var {blockstyle = ""} = $$props;
  var blockclass = "services";
  var services = preload_services.slice(0, 6);
  var unsubscribe_services = () => {
  };
  var cleanUp = (html) => {
    return html.replace(/\u00a0/g, " ");
  };
  onMount(/* @__PURE__ */ _asyncToGenerator$o(function* () {
    var _$milk, _$milk$data;
    cleanUp = (html) => {
      return stripTags(html).replace(/\u00a0/g, " ");
    };
    var queryVariables = {size: 999};
    var getServices = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_SERVICES, $milk.data.sources.wordpress, queryVariables);
    unsubscribe_services = yield getServices == null ? void 0 : getServices.subscribe(/* @__PURE__ */ function() {
      var _ref2 = _asyncToGenerator$o(function* (fetched_data) {
        var data = yield fetched_data;
        services = data.services.nodes.slice(0, 6);
      });
      return function(_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  }));
  onDestroy(() => {
    unsubscribe_services();
  });
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  $$result.css.add(css$r);
  blockclass = "services " + blockstyle;
  $$unsubscribe_milk();
  return `<div${add_attribute("id", id, 0)} class="${escape(null_to_empty(blockclass)) + " svelte-wcn416"}"><div class="${"services-inner svelte-wcn416"}"><h2 class="${"svelte-wcn416"}">Immigration Law Is All We Do</h2>
		<div class="${"blurb svelte-wcn416"}"><h3 class="${"svelte-wcn416"}">When Your Freedom Is On The Line, Why Hire Lawyers Who Only
				Dabble In Immigration?
			</h3>
			<div class="${"block-content"}"><p class="${"svelte-wcn416"}">Harlan York &amp; Associates is one of the most successful firms
					in the country.
				</p>
				<p class="${"svelte-wcn416"}">Using our extensive experience on thousands of immigration
					cases and daily reviews of new developments in the changing
					field of immigration law, we offer you the best legal
					counsel available. Best Lawyers, the most respected
					publication in the legal profession.
				</p>
				<p class="${"svelte-wcn416"}">Harlan York &amp; Associates are the best immigration lawyers
					for Green Cards, Deportation, Family Immigration, and
					Naturalization in New York, New Jersey, and the area. Harlan
					York is the first attorney in New Jersey to be named
					Immigration Lawyer of the Year by Best Lawyers, the most
					respected publication in the legal profession.
				</p></div></div>
		<div class="${"listing-grid services-listing"}">${each(services, (service) => {
    var _a, _b, _c;
    return `<div class="${"service svelte-wcn416"}"><a${add_attribute("href", `/immigration-law-services/${service == null ? void 0 : service.slug}`, 0)}${add_attribute("title", service == null ? void 0 : service.title, 0)} class="${"svelte-wcn416"}"><div><img class="${"icon svelte-wcn416"}"${add_attribute("src", (_b = (_a = service == null ? void 0 : service.Services) == null ? void 0 : _a.icon) == null ? void 0 : _b.sourceUrl, 0)}${add_attribute("alt", service == null ? void 0 : service.title, 0)} width="${"40"}" height="${"40"}"></div>
						<h4 class="${"svelte-wcn416"}">${escape(service == null ? void 0 : service.title)}</h4>
						<div>${cleanUp((_c = service == null ? void 0 : service.Services) == null ? void 0 : _c.excerpt)}
						</div></a>
				</div>`;
  })}</div>
		<div><a href="${"/immigration-law-services"}" class="${"fancy-link svelte-wcn416"}"><span>View All Services</span></a></div></div>
</div>`;
});
var Carousel_svelte = ".carousel.svelte-1n04rcu.svelte-1n04rcu{transform-style:preserve-3d;overflow:hidden}.carousel.svelte-1n04rcu .slides.svelte-1n04rcu,.carousel.svelte-1n04rcu.svelte-1n04rcu{display:block;position:relative}.carousel.svelte-1n04rcu .slides.svelte-1n04rcu{overflow-x:hidden;text-align:center}.nextButton.svelte-1n04rcu.svelte-1n04rcu,.prevButton.svelte-1n04rcu.svelte-1n04rcu{position:absolute;top:0;height:100%;z-index:9999}.nextButton.svelte-1n04rcu svg.svelte-1n04rcu,.prevButton.svelte-1n04rcu svg.svelte-1n04rcu{height:40px;width:auto}.prevButton.svelte-1n04rcu.svelte-1n04rcu{left:25px}.nextButton.svelte-1n04rcu.svelte-1n04rcu{right:25px}.nextButton[disabled].svelte-1n04rcu.svelte-1n04rcu,.prevButton[disabled].svelte-1n04rcu.svelte-1n04rcu{opacity:.4}.pagination.svelte-1n04rcu.svelte-1n04rcu{text-align:center}";
const css$q = {
  code: ".carousel.svelte-1n04rcu.svelte-1n04rcu{transform-style:preserve-3d;overflow:hidden}.carousel.svelte-1n04rcu.svelte-1n04rcu,.carousel.svelte-1n04rcu .slides.svelte-1n04rcu{display:block;position:relative}.carousel.svelte-1n04rcu .slides.svelte-1n04rcu{overflow-x:hidden;text-align:center}.nextButton.svelte-1n04rcu.svelte-1n04rcu,.prevButton.svelte-1n04rcu.svelte-1n04rcu{position:absolute;top:0;height:100%;z-index:9999}.nextButton.svelte-1n04rcu svg.svelte-1n04rcu,.prevButton.svelte-1n04rcu svg.svelte-1n04rcu{height:40px;width:auto}.prevButton.svelte-1n04rcu.svelte-1n04rcu{left:25px}.nextButton.svelte-1n04rcu.svelte-1n04rcu{right:25px}.nextButton[disabled].svelte-1n04rcu.svelte-1n04rcu,.prevButton[disabled].svelte-1n04rcu.svelte-1n04rcu{opacity:.4}.pagination.svelte-1n04rcu.svelte-1n04rcu{text-align:center}",
  map: `{"version":3,"file":"Carousel.svelte","sources":["Carousel.svelte"],"sourcesContent":["<svelte:window\\n\\ton:load={setHeight}\\n\\ton:resize={setHeight}\\n\\ton:orientationchange={setHeight}\\n/>\\n\\n<svelte:head>\\n\\t<style>@-webkit-keyframes slideInLeft{0%{transform:translateX(-100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideInLeft{0%{transform:translateX(-100%);opacity:0}to{transform:translateX(0);opacity:1}}@-webkit-keyframes slideInRight{0%{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideInRight{0%{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@-webkit-keyframes slideOutLeft{to{transform:translateX(-100%);opacity:0}}@keyframes slideOutLeft{to{transform:translateX(-100%);opacity:0}}@-webkit-keyframes slideOutRight{to{transform:translateX(100%);opacity:0}}@keyframes slideOutRight{to{transform:translateX(100%);opacity:0}}.carousel .slides{text-align:center}.carousel .slides>*{display:block;position:absolute;width:100%;top:0;box-sizing:border-box;margin:0 auto;overflow-y:hidden}.carousel .slides>.slideInLeft{-webkit-animation:slideInLeft 1s ease 0s 1 normal forwards;animation:slideInLeft 1s ease 0s 1 normal forwards;-webkit-animation:slideInLeft var(--slide-speed,1s) ease 0s 1 normal forwards;animation:slideInLeft var(--slide-speed,1s) ease 0s 1 normal forwards}.carousel .slides>.slideInRight{-webkit-animation:slideInRight 1s ease 0s 1 normal forwards;animation:slideInRight 1s ease 0s 1 normal forwards;-webkit-animation:slideInRight var(--slide-speed,1s) ease 0s 1 normal forwards;animation:slideInRight var(--slide-speed,1s) ease 0s 1 normal forwards}.carousel .slides>.slideOutLeft{-webkit-animation:slideOutLeft 1s ease 0s 1 normal forwards;animation:slideOutLeft 1s ease 0s 1 normal forwards;-webkit-animation:slideOutLeft var(--slide-speed,1s) ease 0s 1 normal forwards;animation:slideOutLeft var(--slide-speed,1s) ease 0s 1 normal forwards}.carousel .slides>.slideOutRight{-webkit-animation:slideOutRight 1s ease 0s 1 normal forwards;animation:slideOutRight 1s ease 0s 1 normal forwards;-webkit-animation:slideOutRight var(--slide-speed,1s) ease 0s 1 normal forwards;animation:slideOutRight var(--slide-speed,1s) ease 0s 1 normal forwards}.carousel .slides>.outLeft{transform:translateX(-100%);opacity:0}.carousel .slides>.outRight{transform:translateX(100%);opacity:0}.carousel [slot=slides]>* img{-webkit-user-drag:none;-khtml-user-drag:none;-moz-user-drag:none;-o-user-drag:none;user-drag:none}</style>\\n</svelte:head>\\n\\n<div class=\\"carousel noselect\\" bind:this={component} {id}>\\n\\t<button\\n\\t\\tbind:this={prevButton}\\n\\t\\tclass=\\"prevButton\\"\\n\\t\\tstyle={\`margin-top: \${buttonOffset}px\`}\\n\\t\\ton:click={() => {\\n\\t\\t\\tstop();\\n\\t\\t\\tdoPrev();\\n\\t\\t}}\\n\\t\\ttitle=\\"Previous Item\\"\\n\\t\\tdisabled\\n\\t>\\n\\t\\t<slot name=\\"prev\\">\\n\\t\\t\\t<svg\\n\\t\\t\\t\\taria-hidden=\\"true\\"\\n\\t\\t\\t\\tfocusable=\\"false\\"\\n\\t\\t\\t\\trole=\\"img\\"\\n\\t\\t\\t\\txmlns=\\"http://www.w3.org/2000/svg\\"\\n\\t\\t\\t\\tviewBox=\\"0 0 320 512\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t<path\\n\\t\\t\\t\\t\\tfill=\\"currentColor\\"\\n\\t\\t\\t\\t\\td=\\"M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t</svg>\\n\\t\\t</slot>\\n\\t</button>\\n\\t<button\\n\\t\\tbind:this={nextButton}\\n\\t\\tclass=\\"nextButton\\"\\n\\t\\tstyle={\`margin-top: \${buttonOffset}px\`}\\n\\t\\ton:click={() => {\\n\\t\\t\\tstop();\\n\\t\\t\\tdoNext();\\n\\t\\t}}\\n\\t\\ttitle=\\"Next Item\\"\\n\\t\\tdisabled\\n\\t>\\n\\t\\t<slot name=\\"next\\">\\n\\t\\t\\t<svg\\n\\t\\t\\t\\taria-hidden=\\"true\\"\\n\\t\\t\\t\\tfocusable=\\"false\\"\\n\\t\\t\\t\\trole=\\"img\\"\\n\\t\\t\\t\\txmlns=\\"http://www.w3.org/2000/svg\\"\\n\\t\\t\\t\\tviewBox=\\"0 0 320 512\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\t<path\\n\\t\\t\\t\\t\\tfill=\\"currentColor\\"\\n\\t\\t\\t\\t\\td=\\"M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t</svg>\\n\\t\\t</slot>\\n\\t</button>\\n\\t<div\\n\\t\\tclass=\\"slides\\"\\n\\t\\tstyle={\`min-height: \${sliderHeight}px;\`}\\n\\t\\ton:click={stop}\\n\\t\\ton:touchstart|passive={startTouch}\\n\\t\\ton:touchmove|passive={moveTouch}\\n\\t\\ton:mousedown={startDrag}\\n\\t\\ton:mouseup={moveDrag}\\n\\t>\\n\\t\\t<slot>\\n\\t\\t\\t<div\\n\\t\\t\\t\\tclass=\\"slide slideInLeft slideInRight slideOutLeft slideOutRight outLeft outRight\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\tNo Slides\\n\\t\\t\\t</div>\\n\\t\\t\\t<div class=\\"slide\\">No Slides</div>\\n\\t\\t</slot>\\n\\t</div>\\n\\t{#if pagination != 'false'}\\n\\t\\t<div class=\\"pagination\\" bind:this={paginationControls}>\\n\\t\\t\\t{#each slides as slide, index}\\n\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\tclass:active={index == currentSlide}\\n\\t\\t\\t\\t\\tclass:inactive={index != currentSlide}\\n\\t\\t\\t\\t\\ton:click={() => {\\n\\t\\t\\t\\t\\t\\tstop();\\n\\t\\t\\t\\t\\t\\tjumpTo(index);\\n\\t\\t\\t\\t\\t}}\\n\\t\\t\\t\\t\\tstyle={index == currentSlide\\n\\t\\t\\t\\t\\t\\t? pagedot_activestyle\\n\\t\\t\\t\\t\\t\\t: pagedot_inactivestyle}\\n\\t\\t\\t\\t\\ttitle={\`Go to Item \${index}\`}\\n\\t\\t\\t\\t\\tdisabled={!controlsEnabled ? 'disabled' : ''}\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t{index}\\n\\t\\t\\t\\t</button>\\n\\t\\t\\t{/each}\\n\\t\\t</div>\\n\\t{/if}\\n</div>\\n\\n<script>function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\nimport { onMount } from 'svelte';\\nvar id;\\nvar component = {};\\nvar slides = [];\\nvar sliderHeight = 0;\\nvar currentSlide = 0;\\nvar prevButton = {\\n  disabled: true\\n};\\nvar nextButton = {\\n  disabled: true\\n};\\nvar controlsEnabled = true;\\n\\n$: prevButton.disabled = !controlsEnabled;\\n\\n$: nextButton.disabled = !controlsEnabled;\\n\\nvar buttonOffset = 0;\\nvar slide_speed = 1000;\\nvar disable_ratio = 0.8;\\nvar pagination = true;\\nvar paginationControls;\\nvar pagedot_activestyle = '';\\nvar pagedot_inactivestyle = '';\\nvar play = true;\\nvar interval = 8000;\\nvar playing = false;\\nvar initialX = null;\\nvar initialY = null;\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  slides = component.querySelectorAll('.slides>*'); // console.log({ slides: slides });\\n\\n  setHeight();\\n  removeAll();\\n  slide(slides[currentSlide], 'in', 'right');\\n  disableButtons(slide_speed * disable_ratio);\\n\\n  if (!!play == true) {\\n    setTimeout(start, interval);\\n  } // console.log({ slots: $$slots });\\n  // console.log({ component: component.querySelectorAll('.slides>*') });\\n\\n}));\\n\\nvar setHeight = () => {\\n  sliderHeight = 0;\\n  slides.forEach(function (el) {\\n    sliderHeight = el.offsetHeight > sliderHeight ? el.offsetHeight : sliderHeight;\\n  });\\n  sliderHeight = sliderHeight + 20;\\n  console.log('what is sliderhieght:' + sliderHeight);\\n};\\n\\nvar removeAll = () => {\\n  slides.forEach(function (el) {\\n    removeAllAnimations(el);\\n    el.classList.add('outRight');\\n  });\\n};\\n\\nvar removeAllAnimations = el => {\\n  el.classList.remove('slideInRight');\\n  el.classList.remove('slideInLeft');\\n  el.classList.remove('slideOutLeft');\\n  el.classList.remove('slideOutRight');\\n  el.classList.remove('outLeft');\\n  el.classList.remove('outRight');\\n};\\n\\nvar firstCap = function firstCap(str) {\\n  if (str === void 0) {\\n    str = '';\\n  }\\n\\n  return \\"\\" + str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();\\n};\\n\\nvar slide = function slide(el, send, direction) {\\n  if (send === void 0) {\\n    send = 'in';\\n  }\\n\\n  if (direction === void 0) {\\n    direction = 'right';\\n  }\\n\\n  direction = firstCap(direction);\\n  send = firstCap(send);\\n  removeAllAnimations(el);\\n  el.classList.add(\\"slide\\" + send + direction);\\n};\\n\\nvar disableButtons = milsec => {\\n  controlsEnabled = false;\\n  setTimeout(() => {\\n    controlsEnabled = true;\\n  }, milsec);\\n};\\n\\nvar doNext = () => {\\n  slide(slides[currentSlide], 'out', 'left');\\n  currentSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;\\n  slide(slides[currentSlide], 'in', 'right');\\n  disableButtons(slide_speed * disable_ratio);\\n};\\n\\nvar doPrev = () => {\\n  slide(slides[currentSlide], 'out', 'right');\\n  currentSlide = currentSlide == 0 ? slides.length - 1 : currentSlide - 1;\\n  slide(slides[currentSlide], 'in', 'left');\\n  disableButtons(slide_speed * disable_ratio);\\n};\\n\\nvar stop = () => {\\n  play = 'false';\\n  playing = false;\\n};\\n\\nvar start = () => {\\n  if (!playing) {\\n    play = 'true';\\n    playing = true;\\n    autoplay();\\n  }\\n};\\n\\nvar autoplay = () => {\\n  if (play == 'true') {\\n    doNext();\\n    setTimeout(autoplay, interval);\\n  }\\n};\\n\\nvar jumpTo = newSlide => {\\n  if (newSlide < currentSlide) {\\n    slide(slides[currentSlide], 'out', 'right');\\n    currentSlide = newSlide;\\n    slide(slides[currentSlide], 'in', 'left');\\n  } else if (newSlide > currentSlide) {\\n    slide(slides[currentSlide], 'out', 'left');\\n    currentSlide = newSlide;\\n    slide(slides[currentSlide], 'in', 'right');\\n  }\\n\\n  disableButtons(slide_speed * disable_ratio);\\n};\\n\\nvar startTouch = e => {\\n  stop();\\n  initialX = e.touches[0].clientX;\\n  initialY = e.touches[0].clientY;\\n};\\n\\nvar moveTouch = e => {\\n  if (initialX === null || initialY === null) {\\n    return;\\n  }\\n\\n  var currentX = e.touches[0].clientX;\\n  var currentY = e.touches[0].clientY;\\n  var diffX = initialX - currentX;\\n  var diffY = initialY - currentY;\\n\\n  if (Math.abs(diffX) > Math.abs(diffY)) {\\n    if (diffX > 0) {\\n      // console.log(\\"swiped left\\");\\n      stop();\\n      doNext();\\n    } else {\\n      // console.log(\\"swiped right\\");\\n      stop();\\n      doPrev();\\n    } // } else {\\n    // \\tif (diffY > 0) {\\n    // \\t\\t// console.log(\\"swiped up\\");\\n    // \\t} else {\\n    // \\t\\t// console.log(\\"swiped down\\");\\n    // \\t};\\n\\n  }\\n\\n  initialX = null;\\n  initialY = null;\\n  e.preventDefault();\\n};\\n\\nvar startDrag = e => {\\n  stop();\\n  initialX = e.pageX;\\n  initialY = e.pageY;\\n};\\n\\nvar moveDrag = e => {\\n  var delta = 10;\\n\\n  if (initialX === null || initialY === null) {\\n    return;\\n  }\\n\\n  var diffX = e.pageX - initialX;\\n  var diffY = e.pageY - initialY;\\n\\n  if (Math.abs(diffX) < delta && Math.abs(diffY) < delta) {// console.log('click');\\n  } else {\\n    if (Math.abs(diffX) > Math.abs(diffY)) {\\n      if (diffX < 0) {\\n        // console.log(\\"dragged left\\");\\n        stop();\\n        doNext();\\n      } else {\\n        // console.log(\\"dragged right\\");\\n        stop();\\n        doPrev();\\n      } // } else {\\n      // \\tif (diffY < 0) {\\n      // \\t\\tconsole.log(\\"draggeded up\\");\\n      // \\t} else {\\n      // \\t\\tconsole.log(\\"draggeded down\\");\\n      // \\t};\\n\\n    }\\n  }\\n\\n  initialX = null;\\n  initialY = null;\\n  e.preventDefault();\\n};\\n/* ## Exports ## */\\n\\n\\nexport { id, slide_speed, disable_ratio, pagination, pagedot_activestyle, pagedot_inactivestyle, play, interval, start, stop };</script>\\n\\n<style>.carousel{transform-style:preserve-3d;overflow:hidden}.carousel,.carousel .slides{display:block;position:relative}.carousel .slides{overflow-x:hidden;text-align:center}.nextButton,.prevButton{position:absolute;top:0;height:100%;z-index:9999}.nextButton svg,.prevButton svg{height:40px;width:auto}.prevButton{left:25px}.nextButton{right:25px}.nextButton[disabled],.prevButton[disabled]{opacity:.4}.pagination{text-align:center}</style>\\n"],"names":[],"mappings":"AAqVO,uCAAS,CAAC,gBAAgB,WAAW,CAAC,SAAS,MAAM,CAAC,uCAAS,CAAC,wBAAS,CAAC,sBAAO,CAAC,QAAQ,KAAK,CAAC,SAAS,QAAQ,CAAC,wBAAS,CAAC,sBAAO,CAAC,WAAW,MAAM,CAAC,WAAW,MAAM,CAAC,yCAAW,CAAC,yCAAW,CAAC,SAAS,QAAQ,CAAC,IAAI,CAAC,CAAC,OAAO,IAAI,CAAC,QAAQ,IAAI,CAAC,0BAAW,CAAC,kBAAG,CAAC,0BAAW,CAAC,kBAAG,CAAC,OAAO,IAAI,CAAC,MAAM,IAAI,CAAC,yCAAW,CAAC,KAAK,IAAI,CAAC,yCAAW,CAAC,MAAM,IAAI,CAAC,WAAW,CAAC,QAAQ,+BAAC,CAAC,WAAW,CAAC,QAAQ,+BAAC,CAAC,QAAQ,EAAE,CAAC,yCAAW,CAAC,WAAW,MAAM,CAAC"}`
};
var buttonOffset = 0;
function asyncGeneratorStep$n(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$n(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$n(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$n(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Carousel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var {id} = $$props;
  var component = {};
  var slides = [];
  var sliderHeight = 0;
  var currentSlide = 0;
  var prevButton = {disabled: true};
  var nextButton = {disabled: true};
  var controlsEnabled = true;
  var {slide_speed = 1e3} = $$props;
  var {disable_ratio = 0.8} = $$props;
  var {pagination = true} = $$props;
  var paginationControls;
  var {pagedot_activestyle = ""} = $$props;
  var {pagedot_inactivestyle = ""} = $$props;
  var {play = true} = $$props;
  var {interval = 8e3} = $$props;
  var playing = false;
  onMount(/* @__PURE__ */ _asyncToGenerator$n(function* () {
    slides = component.querySelectorAll(".slides>*");
    setHeight();
    removeAll();
    slide(slides[currentSlide], "in", "right");
    disableButtons(slide_speed * disable_ratio);
    if (!!play == true) {
      setTimeout(start, interval);
    }
  }));
  var setHeight = () => {
    sliderHeight = 0;
    slides.forEach(function(el) {
      sliderHeight = el.offsetHeight > sliderHeight ? el.offsetHeight : sliderHeight;
    });
    sliderHeight = sliderHeight + 20;
    console.log("what is sliderhieght:" + sliderHeight);
  };
  var removeAll = () => {
    slides.forEach(function(el) {
      removeAllAnimations(el);
      el.classList.add("outRight");
    });
  };
  var removeAllAnimations = (el) => {
    el.classList.remove("slideInRight");
    el.classList.remove("slideInLeft");
    el.classList.remove("slideOutLeft");
    el.classList.remove("slideOutRight");
    el.classList.remove("outLeft");
    el.classList.remove("outRight");
  };
  var firstCap = function firstCap2(str) {
    if (str === void 0) {
      str = "";
    }
    return "" + str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  var slide = function slide2(el, send, direction) {
    if (send === void 0) {
      send = "in";
    }
    if (direction === void 0) {
      direction = "right";
    }
    direction = firstCap(direction);
    send = firstCap(send);
    removeAllAnimations(el);
    el.classList.add("slide" + send + direction);
  };
  var disableButtons = (milsec) => {
    controlsEnabled = false;
    setTimeout(() => {
      controlsEnabled = true;
    }, milsec);
  };
  var doNext = () => {
    slide(slides[currentSlide], "out", "left");
    currentSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
    slide(slides[currentSlide], "in", "right");
    disableButtons(slide_speed * disable_ratio);
  };
  var {stop = () => {
    play = "false";
    playing = false;
  }} = $$props;
  var {start = () => {
    if (!playing) {
      play = "true";
      playing = true;
      autoplay();
    }
  }} = $$props;
  var autoplay = () => {
    if (play == "true") {
      doNext();
      setTimeout(autoplay, interval);
    }
  };
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.slide_speed === void 0 && $$bindings.slide_speed && slide_speed !== void 0)
    $$bindings.slide_speed(slide_speed);
  if ($$props.disable_ratio === void 0 && $$bindings.disable_ratio && disable_ratio !== void 0)
    $$bindings.disable_ratio(disable_ratio);
  if ($$props.pagination === void 0 && $$bindings.pagination && pagination !== void 0)
    $$bindings.pagination(pagination);
  if ($$props.pagedot_activestyle === void 0 && $$bindings.pagedot_activestyle && pagedot_activestyle !== void 0)
    $$bindings.pagedot_activestyle(pagedot_activestyle);
  if ($$props.pagedot_inactivestyle === void 0 && $$bindings.pagedot_inactivestyle && pagedot_inactivestyle !== void 0)
    $$bindings.pagedot_inactivestyle(pagedot_inactivestyle);
  if ($$props.play === void 0 && $$bindings.play && play !== void 0)
    $$bindings.play(play);
  if ($$props.interval === void 0 && $$bindings.interval && interval !== void 0)
    $$bindings.interval(interval);
  if ($$props.stop === void 0 && $$bindings.stop && stop !== void 0)
    $$bindings.stop(stop);
  if ($$props.start === void 0 && $$bindings.start && start !== void 0)
    $$bindings.start(start);
  $$result.css.add(css$q);
  prevButton.disabled = !controlsEnabled;
  nextButton.disabled = !controlsEnabled;
  return `

${$$result.head += `<style data-svelte="svelte-wkhzr2">@-webkit-keyframes slideInLeft{0%{transform:translateX(-100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideInLeft{0%{transform:translateX(-100%);opacity:0}to{transform:translateX(0);opacity:1}}@-webkit-keyframes slideInRight{0%{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideInRight{0%{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@-webkit-keyframes slideOutLeft{to{transform:translateX(-100%);opacity:0}}@keyframes slideOutLeft{to{transform:translateX(-100%);opacity:0}}@-webkit-keyframes slideOutRight{to{transform:translateX(100%);opacity:0}}@keyframes slideOutRight{to{transform:translateX(100%);opacity:0}}.carousel .slides{text-align:center}.carousel .slides>*{display:block;position:absolute;width:100%;top:0;box-sizing:border-box;margin:0 auto;overflow-y:hidden}.carousel .slides>.slideInLeft{-webkit-animation:slideInLeft 1s ease 0s 1 normal forwards;animation:slideInLeft 1s ease 0s 1 normal forwards;-webkit-animation:slideInLeft var(--slide-speed,1s) ease 0s 1 normal forwards;animation:slideInLeft var(--slide-speed,1s) ease 0s 1 normal forwards}.carousel .slides>.slideInRight{-webkit-animation:slideInRight 1s ease 0s 1 normal forwards;animation:slideInRight 1s ease 0s 1 normal forwards;-webkit-animation:slideInRight var(--slide-speed,1s) ease 0s 1 normal forwards;animation:slideInRight var(--slide-speed,1s) ease 0s 1 normal forwards}.carousel .slides>.slideOutLeft{-webkit-animation:slideOutLeft 1s ease 0s 1 normal forwards;animation:slideOutLeft 1s ease 0s 1 normal forwards;-webkit-animation:slideOutLeft var(--slide-speed,1s) ease 0s 1 normal forwards;animation:slideOutLeft var(--slide-speed,1s) ease 0s 1 normal forwards}.carousel .slides>.slideOutRight{-webkit-animation:slideOutRight 1s ease 0s 1 normal forwards;animation:slideOutRight 1s ease 0s 1 normal forwards;-webkit-animation:slideOutRight var(--slide-speed,1s) ease 0s 1 normal forwards;animation:slideOutRight var(--slide-speed,1s) ease 0s 1 normal forwards}.carousel .slides>.outLeft{transform:translateX(-100%);opacity:0}.carousel .slides>.outRight{transform:translateX(100%);opacity:0}.carousel [slot=slides]>* img{-webkit-user-drag:none;-khtml-user-drag:none;-moz-user-drag:none;-o-user-drag:none;user-drag:none}</style>`, ""}

<div class="${"carousel noselect svelte-1n04rcu"}"${add_attribute("id", id, 0)}${add_attribute("this", component, 1)}><button class="${"prevButton svelte-1n04rcu"}"${add_attribute("style", `margin-top: ${buttonOffset}px`, 0)} title="${"Previous Item"}" disabled${add_attribute("this", prevButton, 1)}>${slots.prev ? slots.prev({}) : `
			<svg aria-hidden="${"true"}" focusable="${"false"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 320 512"}" class="${"svelte-1n04rcu"}"><path fill="${"currentColor"}" d="${"M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"}"></path></svg>
		`}</button>
	<button class="${"nextButton svelte-1n04rcu"}"${add_attribute("style", `margin-top: ${buttonOffset}px`, 0)} title="${"Next Item"}" disabled${add_attribute("this", nextButton, 1)}>${slots.next ? slots.next({}) : `
			<svg aria-hidden="${"true"}" focusable="${"false"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 320 512"}" class="${"svelte-1n04rcu"}"><path fill="${"currentColor"}" d="${"M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"}"></path></svg>
		`}</button>
	<div class="${"slides svelte-1n04rcu"}"${add_attribute("style", `min-height: ${sliderHeight}px;`, 0)}>${slots.default ? slots.default({}) : `
			<div class="${"slide slideInLeft slideInRight slideOutLeft slideOutRight outLeft outRight"}">No Slides
			</div>
			<div class="${"slide"}">No Slides</div>
		`}</div>
	${pagination != "false" ? `<div class="${"pagination svelte-1n04rcu"}"${add_attribute("this", paginationControls, 1)}>${each(slides, (slide2, index2) => `<button${add_attribute("style", index2 == currentSlide ? pagedot_activestyle : pagedot_inactivestyle, 0)}${add_attribute("title", `Go to Item ${index2}`, 0)} ${(!controlsEnabled ? "disabled" : "") ? "disabled" : ""}${add_classes([
    (index2 == currentSlide ? "active" : "") + " " + (index2 != currentSlide ? "inactive" : "")
  ].join(" ").trim())}>${escape(index2)}
				</button>`)}</div>` : ``}
</div>`;
});
var Block_Testimonials_svelte = ".testimonials.svelte-1ihrjne.svelte-1ihrjne{display:block;padding:100px 20px;padding:100px var(--padding-inner,20px);color:#fff;color:var(--color-white,#fff);text-align:center}.testimonials-inner.svelte-1ihrjne.svelte-1ihrjne{margin:0 auto;max-width:var(--content-constrain)}h2.svelte-1ihrjne.svelte-1ihrjne,p.svelte-1ihrjne.svelte-1ihrjne{color:#fff;color:var(--color-white,#fff)}h2.svelte-1ihrjne.svelte-1ihrjne{margin-bottom:20px;font-size:var(--extralarge-fontsize)}h3.svelte-1ihrjne.svelte-1ihrjne{font-family:var(--font-main)}@media screen and (min-width:650px){.testimonials.svelte-1ihrjne .blurb.svelte-1ihrjne{margin:var(--padding);display:grid;grid-template-columns:1.5fr 2fr;text-align:left;-moz-column-gap:3em;grid-column-gap:3em;column-gap:3em}}.center.svelte-1ihrjne.svelte-1ihrjne{text-align:center}.testimonials-slides.svelte-1ihrjne.svelte-1ihrjne{text-align:center;position:relative;max-width:800px;background:var(--color-six);padding:0;margin:0 auto}@media screen and (max-width:650px){.testimonials-slides.svelte-1ihrjne.svelte-1ihrjne{left:0;width:100vw;margin:0 -20px}}.testimonial-slide.svelte-1ihrjne.svelte-1ihrjne,.testimonial.svelte-1ihrjne.svelte-1ihrjne{text-align:center}.testimonial.svelte-1ihrjne.svelte-1ihrjne{display:block;background:var(--color-six);margin:0 40px;padding:10px 25px 0}@media screen and (min-width:650px){.testimonial.svelte-1ihrjne.svelte-1ihrjne{-moz-column-gap:2em;grid-column-gap:2em;column-gap:2em;background:var(--color-six);text-align:left}}.testimonial.svelte-1ihrjne .testimonial-content.svelte-1ihrjne{padding:var(--padding);color:var(--color-white)}.testimonial.svelte-1ihrjne.svelte-1ihrjne:hover{text-decoration:none}.testimonial-quote.svelte-1ihrjne.svelte-1ihrjne{font-style:italic}.rating.svelte-1ihrjne.svelte-1ihrjne{margin:10px 0;height:17px;background:url(/img/icon-yellow-star.svg) 0 repeat;background-size:18px;color:transparent;font-size:0}";
const css$p = {
  code: ".testimonials.svelte-1ihrjne.svelte-1ihrjne{display:block;padding:100px 20px;padding:100px var(--padding-inner,20px);color:#fff;color:var(--color-white,#fff);text-align:center}.testimonials-inner.svelte-1ihrjne.svelte-1ihrjne{margin:0 auto;max-width:var(--content-constrain)}h2.svelte-1ihrjne.svelte-1ihrjne,p.svelte-1ihrjne.svelte-1ihrjne{color:#fff;color:var(--color-white,#fff)}h2.svelte-1ihrjne.svelte-1ihrjne{margin-bottom:20px;font-size:var(--extralarge-fontsize)}h3.svelte-1ihrjne.svelte-1ihrjne{font-family:var(--font-main)}@media screen and (min-width:650px){.testimonials.svelte-1ihrjne .blurb.svelte-1ihrjne{margin:var(--padding);display:grid;grid-template-columns:1.5fr 2fr;text-align:left;grid-column-gap:3em;-moz-column-gap:3em;column-gap:3em}}.center.svelte-1ihrjne.svelte-1ihrjne{text-align:center}.testimonials-slides.svelte-1ihrjne.svelte-1ihrjne{text-align:center;position:relative;max-width:800px;background:var(--color-six);padding:0;margin:0 auto}@media screen and (max-width:650px){.testimonials-slides.svelte-1ihrjne.svelte-1ihrjne{left:0;width:100vw;margin:0 -20px}}.testimonial.svelte-1ihrjne.svelte-1ihrjne,.testimonial-slide.svelte-1ihrjne.svelte-1ihrjne{text-align:center}.testimonial.svelte-1ihrjne.svelte-1ihrjne{display:block;background:var(--color-six);margin:0 40px;padding:10px 25px 0}@media screen and (min-width:650px){.testimonial.svelte-1ihrjne.svelte-1ihrjne{grid-column-gap:2em;-moz-column-gap:2em;column-gap:2em;background:var(--color-six);text-align:left}}.testimonial.svelte-1ihrjne .testimonial-content.svelte-1ihrjne{padding:var(--padding);color:var(--color-white)}.testimonial.svelte-1ihrjne.svelte-1ihrjne:hover{text-decoration:none}.testimonial-quote.svelte-1ihrjne.svelte-1ihrjne{font-style:italic}.rating.svelte-1ihrjne.svelte-1ihrjne{margin:10px 0;height:17px;background:url(/img/icon-yellow-star.svg) 0 repeat;background-size:18px}.rating.svelte-1ihrjne.svelte-1ihrjne{color:transparent;font-size:0}",
  map: `{"version":3,"file":"Block_Testimonials.svelte","sources":["Block_Testimonials.svelte"],"sourcesContent":["<div {id} class={blockclass}>\\n\\t<div class=\\"testimonials-inner\\">\\n\\t\\t<h2>What Our Clients Say</h2>\\n\\t\\t<div class=\\"blurb\\">\\n\\t\\t\\t<h3>\\n\\t\\t\\t\\tWith Hundreds Of Reviews Harlan York Is One Of The Top\\n\\t\\t\\t\\tImmigration Law Firms In America.\\n\\t\\t\\t</h3>\\n\\t\\t\\t<div class=\\"block-content\\">\\n\\t\\t\\t\\t<p>\\n\\t\\t\\t\\t\\tOur Immigration Attorneys help thousands of clients avoid\\n\\t\\t\\t\\t\\tdeportation, get their green cards and become US citizens.\\n\\t\\t\\t\\t\\tSee what our clients and colleagues have to say about how\\n\\t\\t\\t\\t\\tHarlan York & Associates helped them with their case.\\n\\t\\t\\t\\t</p>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t\\t<br /><br />\\n\\t</div>\\n\\t<div class=\\"center\\">\\n\\t\\t<div class=\\"testimonials-slides\\">\\n\\t\\t\\t{#if testimonials_loaded}\\n\\t\\t\\t\\t<Carousel id=\\"testimonial-carousel\\" play=\\"true\\">\\n\\t\\t\\t\\t\\t{#each testimonials as testimonial}\\n\\t\\t\\t\\t\\t\\t<div class=\\"testimonial-slide\\">\\n\\t\\t\\t\\t\\t\\t\\t<div title={testimonial?.title} class=\\"testimonial\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t<!-- <picture>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t{#if testimonial?.Testimonial?.avifImage?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"image/avif\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tsrcset={testimonial?.Testimonial\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t?.avifImage?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t{#if testimonial?.Testimonial?.webpImage?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"image/webp\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tsrcset={testimonial?.Testimonial\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t?.webpImage?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tsrc={testimonial?.Testimonial?.jpgImage\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t?.sourceUrl ||\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t'/milk/img/user_nophoto.svg'}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\talt={testimonial?.title}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\twidth=\\"130\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\theight=\\"130\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t\\t</picture> -->\\n\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"testimonial-content\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"testimonial-title\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<strong>{testimonial?.title}</strong>,\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{#if testimonial?.Testimonial?.relationship}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{testimonial?.Testimonial\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t?.relationship}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"testimonial-quote\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\"{testimonial?.Testimonial\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t?.testimonial}\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t{#if testimonial?.Testimonial?.rating}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"rating\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tstyle={\`width: \${\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ttestimonial?.Testimonial\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t?.rating * 18\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t}px\`}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{testimonial?.Testimonial?.rating}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t{/each}\\n\\t\\t\\t\\t</Carousel>\\n\\t\\t\\t{/if}\\n\\t\\t</div>\\n\\t</div>\\n\\t<div class=\\"testimonials-inner\\">\\n\\t\\t<br /><br />\\n\\t\\t<div>\\n\\t\\t\\t<a href=\\"/client-testimonials\\" class=\\"fancy-link\\">\\n\\t\\t\\t\\t<span>View Our Testimonials</span>\\n\\t\\t\\t</a>\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<script>function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount, onDestroy } from 'svelte';\\n/* ## MILK ## */\\n\\nimport { milk } from '$milk/milk.js';\\nimport { shuffleArray } from '$milk/util/helpers.js';\\n/* ## Components ## */\\n\\nimport Carousel from '$milk/lib/Carousel.svelte';\\n/* ## Vairables ## */\\n\\nvar id;\\nvar blockstyle = '';\\nvar blockclass = 'testimonials';\\n\\n$: blockclass = \\"testimonials \\" + blockstyle;\\n\\nvar testimonials_loaded = false;\\n/* ## Data Loading ## */\\n\\nimport { preload_testimonials } from '$graphql/sitespecific.preload.js'; // let testimonials = preload_testimonials;\\n\\nvar testimonials = [];\\n\\nvar unsubscribe_testimonials = () => {};\\n\\nimport { Q_GET_TESTIMONIALS } from '$graphql/sitespecific.graphql.js';\\n/* ## Main ## */\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  var _$milk, _$milk$data;\\n\\n  var queryVariables = {\\n    size: 99\\n  };\\n  var getTestimonials = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_TESTIMONIALS, $milk.data.sources.wordpress, queryVariables);\\n  unsubscribe_testimonials = yield getTestimonials == null ? void 0 : getTestimonials.subscribe( /*#__PURE__*/function () {\\n    var _ref2 = _asyncToGenerator(function* (fetched_data) {\\n      var _data$testimonials;\\n\\n      var data = yield fetched_data; // console.log(data);\\n\\n      var tmpArray = data == null ? void 0 : (_data$testimonials = data.testimonials) == null ? void 0 : _data$testimonials.nodes;\\n      shuffleArray(tmpArray);\\n      console.log(tmpArray);\\n      testimonials = tmpArray.slice(0, 5);\\n      console.log(testimonials);\\n      testimonials_loaded = true;\\n    });\\n\\n    return function (_x) {\\n      return _ref2.apply(this, arguments);\\n    };\\n  }());\\n}));\\n/* ## Exit ## */\\n\\nonDestroy(() => {\\n  unsubscribe_testimonials(); // important for garbage collection otherwise memory leak\\n});\\n/* ## Exports ## */\\n\\nexport { id, blockstyle };</script>\\n\\n<style>.testimonials{display:block;padding:100px 20px;padding:100px var(--padding-inner,20px);color:#fff;color:var(--color-white,#fff);text-align:center}.testimonials-inner{margin:0 auto;max-width:var(--content-constrain)}h2,p{color:#fff;color:var(--color-white,#fff)}h2{margin-bottom:20px;font-size:var(--extralarge-fontsize)}h3{font-family:var(--font-main)}@media screen and (min-width:650px){.testimonials .blurb{margin:var(--padding);display:grid;grid-template-columns:1.5fr 2fr;text-align:left;grid-column-gap:3em;-moz-column-gap:3em;column-gap:3em}}.center{text-align:center}.testimonials-slides{text-align:center;position:relative;max-width:800px;background:var(--color-six);padding:0;margin:0 auto}@media screen and (max-width:650px){.testimonials-slides{left:0;width:100vw;margin:0 -20px}}.testimonial,.testimonial-slide{text-align:center}.testimonial{display:block;background:var(--color-six);margin:0 40px;padding:10px 25px 0}@media screen and (min-width:650px){.testimonial{grid-column-gap:2em;-moz-column-gap:2em;column-gap:2em;background:var(--color-six);text-align:left}}.testimonial img{border-radius:50%;margin:var(--padding) var(--padding) var(--padding) var(--padding-large)}.testimonial .testimonial-content{padding:var(--padding);color:var(--color-white)}.testimonial:hover{text-decoration:none}.testimonial-quote{font-style:italic}.testimonial .go{display:grid;align-items:center;justify-items:center;place-items:center;background:var(--color-three)}.testimonial .go svg{width:30px;height:auto;color:var(--color-six)}.rating{margin:10px 0;height:17px;background:url(/img/icon-yellow-star.svg) 0 repeat;background-size:18px}.rating,a:hover .rating{color:transparent;font-size:0}a:hover .rating{text-decoration:none!important}</style>\\n"],"names":[],"mappings":"AAgKO,2CAAa,CAAC,QAAQ,KAAK,CAAC,QAAQ,KAAK,CAAC,IAAI,CAAC,QAAQ,KAAK,CAAC,IAAI,eAAe,CAAC,IAAI,CAAC,CAAC,MAAM,IAAI,CAAC,MAAM,IAAI,aAAa,CAAC,IAAI,CAAC,CAAC,WAAW,MAAM,CAAC,iDAAmB,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,IAAI,mBAAmB,CAAC,CAAC,gCAAE,CAAC,+BAAC,CAAC,MAAM,IAAI,CAAC,MAAM,IAAI,aAAa,CAAC,IAAI,CAAC,CAAC,gCAAE,CAAC,cAAc,IAAI,CAAC,UAAU,IAAI,qBAAqB,CAAC,CAAC,gCAAE,CAAC,YAAY,IAAI,WAAW,CAAC,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,4BAAa,CAAC,qBAAM,CAAC,OAAO,IAAI,SAAS,CAAC,CAAC,QAAQ,IAAI,CAAC,sBAAsB,KAAK,CAAC,GAAG,CAAC,WAAW,IAAI,CAAC,gBAAgB,GAAG,CAAC,gBAAgB,GAAG,CAAC,WAAW,GAAG,CAAC,CAAC,qCAAO,CAAC,WAAW,MAAM,CAAC,kDAAoB,CAAC,WAAW,MAAM,CAAC,SAAS,QAAQ,CAAC,UAAU,KAAK,CAAC,WAAW,IAAI,WAAW,CAAC,CAAC,QAAQ,CAAC,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,kDAAoB,CAAC,KAAK,CAAC,CAAC,MAAM,KAAK,CAAC,OAAO,CAAC,CAAC,KAAK,CAAC,CAAC,0CAAY,CAAC,gDAAkB,CAAC,WAAW,MAAM,CAAC,0CAAY,CAAC,QAAQ,KAAK,CAAC,WAAW,IAAI,WAAW,CAAC,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,QAAQ,IAAI,CAAC,IAAI,CAAC,CAAC,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,0CAAY,CAAC,gBAAgB,GAAG,CAAC,gBAAgB,GAAG,CAAC,WAAW,GAAG,CAAC,WAAW,IAAI,WAAW,CAAC,CAAC,WAAW,IAAI,CAAC,CAAC,AAA4G,2BAAY,CAAC,mCAAoB,CAAC,QAAQ,IAAI,SAAS,CAAC,CAAC,MAAM,IAAI,aAAa,CAAC,CAAC,0CAAY,MAAM,CAAC,gBAAgB,IAAI,CAAC,gDAAkB,CAAC,WAAW,MAAM,CAAC,AAA0L,qCAAO,CAAC,OAAO,IAAI,CAAC,CAAC,CAAC,OAAO,IAAI,CAAC,WAAW,IAAI,yBAAyB,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,gBAAgB,IAAI,CAAC,OAAO,8BAAgB,CAAC,MAAM,WAAW,CAAC,UAAU,CAAC,CAAC"}`
};
function asyncGeneratorStep$m(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$m(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$m(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$m(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Block_Testimonials = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var {id} = $$props;
  var {blockstyle = ""} = $$props;
  var blockclass = "testimonials";
  var testimonials_loaded = false;
  var testimonials = [];
  var unsubscribe_testimonials = () => {
  };
  onMount(/* @__PURE__ */ _asyncToGenerator$m(function* () {
    var _$milk, _$milk$data;
    var queryVariables = {size: 99};
    var getTestimonials = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_TESTIMONIALS, $milk.data.sources.wordpress, queryVariables);
    unsubscribe_testimonials = yield getTestimonials == null ? void 0 : getTestimonials.subscribe(/* @__PURE__ */ function() {
      var _ref2 = _asyncToGenerator$m(function* (fetched_data) {
        var _data$testimonials;
        var data = yield fetched_data;
        var tmpArray = data == null ? void 0 : (_data$testimonials = data.testimonials) == null ? void 0 : _data$testimonials.nodes;
        shuffleArray(tmpArray);
        console.log(tmpArray);
        testimonials = tmpArray.slice(0, 5);
        console.log(testimonials);
        testimonials_loaded = true;
      });
      return function(_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  }));
  onDestroy(() => {
    unsubscribe_testimonials();
  });
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  $$result.css.add(css$p);
  blockclass = "testimonials " + blockstyle;
  $$unsubscribe_milk();
  return `<div${add_attribute("id", id, 0)} class="${escape(null_to_empty(blockclass)) + " svelte-1ihrjne"}"><div class="${"testimonials-inner svelte-1ihrjne"}"><h2 class="${"svelte-1ihrjne"}">What Our Clients Say</h2>
		<div class="${"blurb svelte-1ihrjne"}"><h3 class="${"svelte-1ihrjne"}">With Hundreds Of Reviews Harlan York Is One Of The Top
				Immigration Law Firms In America.
			</h3>
			<div class="${"block-content"}"><p class="${"svelte-1ihrjne"}">Our Immigration Attorneys help thousands of clients avoid
					deportation, get their green cards and become US citizens.
					See what our clients and colleagues have to say about how
					Harlan York &amp; Associates helped them with their case.
				</p></div></div>
		<br><br></div>
	<div class="${"center svelte-1ihrjne"}"><div class="${"testimonials-slides svelte-1ihrjne"}">${testimonials_loaded ? `${validate_component(Carousel, "Carousel").$$render($$result, {id: "testimonial-carousel", play: "true"}, {}, {
    default: () => `${each(testimonials, (testimonial) => {
      var _a, _b, _c, _d, _e, _f;
      return `<div class="${"testimonial-slide svelte-1ihrjne"}"><div${add_attribute("title", testimonial == null ? void 0 : testimonial.title, 0)} class="${"testimonial svelte-1ihrjne"}">
								<div class="${"testimonial-content svelte-1ihrjne"}"><div class="${"testimonial-title"}"><strong>${escape(testimonial == null ? void 0 : testimonial.title)}</strong>,
										${((_a = testimonial == null ? void 0 : testimonial.Testimonial) == null ? void 0 : _a.relationship) ? `${escape((_b = testimonial == null ? void 0 : testimonial.Testimonial) == null ? void 0 : _b.relationship)}` : ``}</div>
									<div class="${"testimonial-quote svelte-1ihrjne"}">&quot;${escape((_c = testimonial == null ? void 0 : testimonial.Testimonial) == null ? void 0 : _c.testimonial)}&quot;
									</div>
									${((_d = testimonial == null ? void 0 : testimonial.Testimonial) == null ? void 0 : _d.rating) ? `<div class="${"rating svelte-1ihrjne"}"${add_attribute("style", `width: ${((_e = testimonial == null ? void 0 : testimonial.Testimonial) == null ? void 0 : _e.rating) * 18}px`, 0)}>${escape((_f = testimonial == null ? void 0 : testimonial.Testimonial) == null ? void 0 : _f.rating)}
										</div>` : ``}
								</div></div>
						</div>`;
    })}`
  })}` : ``}</div></div>
	<div class="${"testimonials-inner svelte-1ihrjne"}"><br><br>
		<div><a href="${"/client-testimonials"}" class="${"fancy-link"}"><span>View Our Testimonials</span></a></div></div>
</div>`;
});
const MILK_CFG = JSON.parse(decodeURI("%7B%22config%22:%7B%22theme%22:%22hya%22,%22debug%22:true,%22lock_config%22:false,%22cache_swr%22:true,%22cache%22:true,%22expires%22:300,%22pwa%22:true,%22lang%22:%22en%22,%22darkmode%22:%22light%22,%22smoothscroll%22:true,%22topanchor%22:true,%22watch_scroll%22:true,%22watch_resize%22:false,%22watch_mouse%22:false,%22pagination_size%22:8,%22credit%22:%7B%22milk%22:true,%22svelte%22:true,%22graphql%22:true,%22vite%22:true,%22rollup%22:true%7D%7D,%22site%22:%7B%22domain%22:%22staging.immigrationlawnj.com%22,%22url%22:%22https://staging.immigrationlawnj.com%22,%22admin_url%22:%22https://admin.immigrationlawnj.com%22,%22photo%22:%22/img/profile_1200x1200.jpg%22,%22photo_avif%22:%22/img/profile_1200x1200.avif%22,%22photo_webp%22:%22/img/profile_1200x1200.webp%22,%22logo%22:%22/img/logo.svg%22,%22logo_width%22:%22200%22,%22logo_height%22:%2228%22,%22title%22:%22Harlan%20York%20and%20Associates%22,%22tagline%22:%22Immigration%20Attorneys%22,%22organization%22:%22Harlan%20York%20and%20Associates%22,%22first_name%22:%22Harlan%22,%22last_name%22:%22York%22,%22middle_name%22:%22%22,%22prefix_name%22:%22%22,%22suffix_name%22:%22%22,%22nick_name%22:%22%22,%22email_address%22:%22info@immigrationlawnj.com%22,%22phone%22:%221.973.642.1111%22,%22fax%22:%221.973.642.0022%22,%22address%22:%2260%20Park%20Pl%22,%22address2%22:%22Suite%201010%22,%22city%22:%22Newark%22,%22state%22:%22New%20Jersey%22,%22state_abbr%22:%22NJ%22,%22zip%22:%2207102%22,%22country%22:%22United%20States%22,%22country_abbr%22:%22US%22,%22hours_of_operation%22:%229:00am%20%E2%80%93%205:00pm%20/%20Monday%20%E2%80%93%20Friday%22,%22hours_of_operation_dt%22:%22Mo,Tu,We,Th,Fr%2009:00-17:00%22,%22price_range%22:%22$$%22,%22category%22:%22Immigration%20Law%22,%22description%22:%22Harlan%20York%20and%20Associates%20are%20the%20best%20immigration%20lawyers%20for%20Green%20Cards,%20Deportation,%20Family%20Immigration,%20and%20Naturalization%20in%20New%20York,%20New%20Jersey,%20and%20surrounding%20areas.%22,%22keywords%22:%22Immigration%20Law,%20USA%20Immigration,%20Lawer,%20Attourney,%20Greencard,%20Visa%22,%22established%22:%22%22,%22latitude%22:%2240.7385726%22,%22longitude%22:%22-74.1690402%22,%22google_maps%22:%22https://bit.ly/3aPm8HF%22,%22google_maps_embed%22:%22https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1511.533014259071!2d-74.1690402!3d40.7385726!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25381b9bdf0fb%253A0x7681dbe37e1094d1!2sHarlan%2520York%2520%2526%2520Associates!5e0!3m2!1sen!2sca!4v1613362597071!5m2!1sen!2sca%22,%22google_maps_image%22:%22/img/google_maps_1350x922.jpg%22,%22google_maps_image_webp%22:%22/img/google_maps_1350x922.webp%22,%22google_maps_image_avif%22:%22/img/google_maps_1350x922.avif%22,%22google_business%22:%22%22,%22facebook%22:%22http://www.facebook.com/ImmigrationLawNJ%22,%22facebook_photo%22:%22/img/socialmedia_1200x630.jpg%22,%22facebook_type%22:%22website%22,%22twitter%22:%22http://twitter.com/hyorklaw%22,%22twitter_photo%22:%22/img/socialmedia_1200x630.jpg%22,%22instagram%22:%22%22,%22linkedin%22:%22http://www.linkedin.com/in/harlanyork%22,%22youtube%22:%22http://www.youtube.com/user/HYORKLAW%22,%22vimeo%22:%22%22,%22rss%22:%22%22,%22blog%22:%22%22,%22etsy%22:%22%22,%22yelp%22:%22%22,%22airbnb%22:%22%22,%22tiktok%22:%22%22,%22snapchat%22:%22%22,%22pinterest%22:%22%22,%22vcf_file%22:%22/harlan_york.vcf%22,%22calendar%22:%22https://calendly.com/immigrationlawnj/30min-consultation/%22,%22author%22:%22Nelson%20Design%20Collective%22,%22author_url%22:%22http://nelsondesigncollective.com%22,%22author_email%22:%22info@nelsondesigncollective.com%22,%22paypal%22:%22PayFees@immigrationlawnj.com%22,%22lawpay%22:%22https://secure.lawpay.com/pages/immigrationlawnj/operating%22%7D,%22pwa%22:%7B%22app_color%22:%22#800E16%22,%22app_background%22:%22#800E16%22,%22app_name%22:%22Harlan%20York%20and%20Associates%20%E2%80%93%20Immigration%20Attorneys%22%7D,%22sources%22:%7B%22wordpress%22:%22https://admin.immigrationlawnj.com/graphql%22%7D%7D"));
const {config} = MILK_CFG;
const PAGINATION = `pageInfo {
	offsetPagination {
		hasMore
		hasPrevious
		total
	}
}`;
const POST_TAGS = `tags {
	nodes {
		count
		id
		link
		name
		slug
		tagId
		taxonomy {
			node {
				description
				id
				label
				name
			}
		}
	}
}`;
const POST_CATEGORIES = `categories {
	nodes {
		count
		id
		link
		name
		slug
		categoryId
		taxonomy {
			node {
				description
				id
				label
				name
			}
		}
	}
}`;
const POST_FEATURED_IMAGE = `featuredImage {
	node {
		title(format: RENDERED)
		srcSet
		sourceUrl
		altText
		caption
	}
}`;
const POST_AUTHOR = `author {
	node {
		avatar {
			url
		}
		email
		description
		firstName
		lastName
		name
		nicename
		nickname
		Users {
			attorneyLink
			avifImage {
				sourceUrl
			}
			jpegImage {
				sourceUrl
			}
			webpImage {
				sourceUrl
			}
		}
	}
}`;
const POST_SCRIPTS = `enqueuedScripts(first: 999) {
	nodes {
		id
		args
		extra
		handle
		src
		version
	}
}`;
const POST_CSS = `enqueuedStylesheets(first: 999) {
	nodes {
		id
		src
		version
		extra
		handle
		args
	}
}`;
const POST_LISTING = `id
title(format: RENDERED)
slug
postId
uri
link
excerpt(format: RENDERED)
${POST_FEATURED_IMAGE}
date
modified
${POST_AUTHOR}`;
const POST_CONTENT = `id
title(format: RENDERED)
slug
postId
uri
link
excerpt(format: RENDERED)
${POST_FEATURED_IMAGE}
content(format: RENDERED)
date
modified
${POST_AUTHOR}
${POST_CATEGORIES}
${POST_TAGS}
${POST_SCRIPTS}
${POST_CSS}`;
const Q_LIST_ALL_POSTS = `query getPosts {
	posts(first: 9999) {
		${PAGINATION},
		nodes {
			${POST_LISTING}
		}
	}
}`;
const Q_LIST_POSTS = `query getPosts($offset: Int = 0, $size: Int = ${config.pagination_size}, $search: String = "") {
	posts(where: {search: $search, offsetPagination: {offset: $offset, size: $size}}) {
		${PAGINATION},
		nodes {
			${POST_LISTING}
		}
	}
}`;
`query getPosts($offset: Int = 0, $size: Int = ${config.pagination_size}, $search: String = "") {
	posts(where: {search: $search, offsetPagination: {offset: $offset, size: $size}}) {
		${PAGINATION},
		nodes {
			${POST_CONTENT}
		}
	}
}`;
const Q_LIST_POSTS_BYCAT = `query getPosts($category: String = "Uncategorized", $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	posts(where: {offsetPagination: {offset: $offset, size: $size}, categoryName: $category}) {
		${PAGINATION},
		nodes {
			${POST_LISTING}
		}
	}
}`;
`query getPosts($category: String = "Uncategorized", $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	posts(where: {offsetPagination: {offset: $offset, size: $size}, categoryName: $category}) {
		${PAGINATION},
		nodes {
			${POST_CONTENT}
		}
	}
}`;
`query getPosts($category: Int = 1, $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	posts(where: {offsetPagination: {offset: $offset, size: $size}, categoryId: $category}) {
		${PAGINATION},
		nodes {
			${POST_CONTENT}
		}
	}
}`;
`query getPosts($tag: String = "test", $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	posts(where: {offsetPagination: {offset: $offset, size: $size}, tag: $tag}) {
		${PAGINATION},
		nodes {
			${POST_CONTENT}
		}
	}
}`;
`query getPosts($tag: Int = 1, $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	posts(where: {offsetPagination: {offset: $offset, size: $size}, tagId: $tag}) {
		${PAGINATION},
		nodes {
			${POST_CONTENT}
		}
	}
}`;
`query getPosts($author: Int = 1, $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	posts(where: {offsetPagination: {offset: $offset, size: $size}, author: $author}) {
		${PAGINATION},
		nodes {
			${POST_CONTENT}
		}
	}
}`;
const Q_GET_POST_BYSLUG = `query getPost($slug: String = "hello-world") {
	postBy(slug: $slug) {
		${POST_CONTENT}
	}
}`;
const Q_GET_POST_CATEGORIES = `query getPostCategories($size: Int = ${config.pagination_size}) {
	categories(first: $size) {
		nodes {
			count
			id
			link
			name
			slug
			categoryId
			taxonomy {
				node {
					description
					id
					label
					name
				}
			}
		}
	}
}`;
`query getPostTags($size: Int = ${config.pagination_size}) {
	tags(first: $size) {
		nodes {
			count
			id
			link
			name
			slug
			tagId
			taxonomy {
				node {
					description
					id
					label
					name
				}
			}
		}
	}
}`;
const PAGE_TAGS = `tags {
	nodes {
		count
		id
		link
		name
		slug
		tagId
		taxonomy {
			node {
				description
				id
				label
				name
			}
		}
	}
}`;
const PAGE_CATEGORIES = `categories {
	nodes {
		count
		id
		link
		name
		slug
		categoryId
		taxonomy {
			node {
				description
				id
				label
				name
			}
		}
	}
}`;
const PAGE_LISTING = `id
title(format: RENDERED)
slug
pageId
uri
link
excerpt(format: RENDERED)
featuredImage {
	node {
		uri
		title(format: RENDERED)
		srcSet
		link
		altText
		caption
	}
}
date
modified
author {
	node {
		avatar {
			url
		}
		email
		description
		firstName
		lastName
		name
		nicename
		nickname
	}
}`;
const PAGE_CONTENT = `id
title(format: RENDERED)
slug
pageId
uri
link
excerpt(format: RENDERED)
featuredImage {
	node {
		uri
		title(format: RENDERED)
		srcSet
		link
		altText
		caption
	}
}
content(format: RENDERED)
date
modified
author {
	node {
		avatar {
			url
		}
		email
		description
		firstName
		lastName
		name
		nicename
		nickname
	}
}
${PAGE_CATEGORIES}
${PAGE_TAGS}`;
`query getPages($offset: Int = 0, $size: Int = ${config.pagination_size}, $search: String = "") {
	pages(where: {search: $search, offsetPagination: {offset: $offset, size: $size}}) {
		${PAGINATION},
		nodes {
			${PAGE_LISTING}
		}
	}
}`;
`query getPages($offset: Int = 0, $size: Int = ${config.pagination_size}, $search: String = "") {
	pages(where: {search: $search, offsetPagination: {offset: $offset, size: $size}}) {
		${PAGINATION},
		nodes {
			${PAGE_CONTENT}
		}
	}
}`;
`query getPages($category: String = "Uncategorized", $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	pages(where: {offsetPagination: {offset: $offset, size: $size}, categoryName: $category}) {
		${PAGINATION},
		nodes {
			${PAGE_LISTING}
		}
	}
}`;
`query getPages($category: String = "Uncategorized", $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	pages(where: {offsetPagination: {offset: $offset, size: $size}, categoryName: $category}) {
		${PAGINATION},
		nodes {
			${PAGE_CONTENT}
		}
	}
}`;
`query getPages($category: Int = 1, $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	pages(where: {offsetPagination: {offset: $offset, size: $size}, categoryId: $category}) {
		${PAGINATION},
		nodes {
			${PAGE_CONTENT}
		}
	}
}`;
`query getPages($tag: String = "test", $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	pages(where: {offsetPagination: {offset: $offset, size: $size}, tag: $tag}) {
		${PAGINATION},
		nodes {
			${PAGE_CONTENT}
		}
	}
}`;
`query getPages($tag: Int = 1, $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	pages(where: {offsetPagination: {offset: $offset, size: $size}, tagId: $tag}) {
		${PAGINATION},
		nodes {
			${PAGE_CONTENT}
		}
	}
}`;
`query getPages($author: Int = 1, $offset: Int = 0, $size: Int = ${config.pagination_size}) {
	pages(where: {offsetPagination: {offset: $offset, size: $size}, author: $author}) {
		${PAGINATION},
		nodes {
			${PAGE_CONTENT}
		}
	}
}`;
const Q_GET_PAGE_BYID = `query getPages($id: Int = 1) {
	pageBy(pageId: $id) {
		${PAGE_CONTENT}
	}
}`;
var Block_WP_BlogListingByCategory_svelte = ".blog.svelte-1hlewd7{display:block;padding:50px 20px;padding:50px var(--padding-inner,20px);text-align:center;background:#f4f4f4;background:var(--background-offwhite,#f4f4f4);margin:var(--margin-sides-large)}.blog.svelte-1hlewd7,h2.svelte-1hlewd7,h3.svelte-1hlewd7{color:#000;color:var(--color-black,#000)}.post.svelte-1hlewd7{max-width:75%}";
const css$o = {
  code: ".blog.svelte-1hlewd7{display:block;padding:50px 20px;padding:50px var(--padding-inner,20px);text-align:center;background:#f4f4f4;background:var(--background-offwhite,#f4f4f4);margin:var(--margin-sides-large)}.blog.svelte-1hlewd7,h2.svelte-1hlewd7,h3.svelte-1hlewd7{color:#000;color:var(--color-black,#000)}.post.svelte-1hlewd7{max-width:75%}",
  map: `{"version":3,"file":"Block_WP_BlogListingByCategory.svelte","sources":["Block_WP_BlogListingByCategory.svelte"],"sourcesContent":["<div class=\\"blog\\">\\n\\t<div class=\\"blog-inner\\">\\n\\t\\t<slot name=\\"before\\"><h2>Blog Posts</h2></slot>\\n\\t\\t<div class=\\"posts-grid posts-listing\\">\\n\\t\\t\\t{#each posts as post}\\n\\t\\t\\t\\t<div class=\\"post\\">\\n\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\thref={\`\${blog_path}/\${post?.slug}\`}\\n\\t\\t\\t\\t\\t\\ttitle={\`\${post?.title}\`}\\n\\t\\t\\t\\t\\t\\tsveltekit:prefetch\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t<picture>\\n\\t\\t\\t\\t\\t\\t\\t{#if post?.featuredImage?.node?.srcSet}\\n\\t\\t\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"image/jpeg\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tsrcset={post?.featuredImage?.node?.srcSet}\\n\\t\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\t\\t\\tsrc={post?.featuredImage?.node?.sourceUrl ||\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t'/milk/img/post_noimage.webp'}\\n\\t\\t\\t\\t\\t\\t\\t\\talt={post?.title}\\n\\t\\t\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\t\\t\\twidth=\\"250\\"\\n\\t\\t\\t\\t\\t\\t\\t\\theight=\\"141\\"\\n\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t</picture>\\n\\t\\t\\t\\t\\t\\t<h3>\\n\\t\\t\\t\\t\\t\\t\\t<span class=\\"post-title\\">{post?.title}</span>\\n\\t\\t\\t\\t\\t\\t\\t<span class=\\"more\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t<slot name=\\"more\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<svg\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\taria-hidden=\\"true\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tfocusable=\\"false\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\trole=\\"img\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\txmlns=\\"http://www.w3.org/2000/svg\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tviewBox=\\"0 0 320 512\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<path\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tfill=\\"currentColor\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\td=\\"M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</svg>\\n\\t\\t\\t\\t\\t\\t\\t\\t</slot>\\n\\t\\t\\t\\t\\t\\t\\t</span>\\n\\t\\t\\t\\t\\t\\t</h3>\\n\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t{/each}\\n\\t\\t</div>\\n\\t\\t<slot name=\\"after\\" />\\n\\t</div>\\n</div>\\n\\n<script>function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount, onDestroy } from 'svelte';\\n/* ## MILK ## */\\n\\nimport { milk } from '$milk/milk.js';\\n/* ## Vairables ## */\\n\\nvar id;\\nvar blockstyle = '';\\nvar blockclass = 'featured-blog';\\n\\n$: blockclass = \\"featured-blog \\" + blockstyle;\\n\\nvar blog_path = '/blog';\\nvar size = 10;\\nvar offset = 0;\\nvar pagination = false;\\nvar category = 'Featured';\\nvar posts = [];\\n/* ## Data Loading ## */\\n\\nvar unsubscribe_blogs = () => {};\\n\\nimport { Q_LIST_POSTS_BYCAT } from '$graphql/wordpress.graphql.js';\\n/* ## Main ## */\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  var _$milk, _$milk$data;\\n\\n  var queryVariables = {\\n    category: 'Featured',\\n    offset: parseInt(offset),\\n    size: parseInt(size)\\n  };\\n  var getBlogs = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_LIST_POSTS_BYCAT, $milk.data.sources.wordpress, queryVariables);\\n  unsubscribe_blogs = yield getBlogs == null ? void 0 : getBlogs.subscribe( /*#__PURE__*/function () {\\n    var _ref2 = _asyncToGenerator(function* (fetched_data) {\\n      var _data$posts;\\n\\n      var data = yield fetched_data;\\n      console.log(data);\\n      posts = data == null ? void 0 : (_data$posts = data.posts) == null ? void 0 : _data$posts.nodes;\\n    });\\n\\n    return function (_x) {\\n      return _ref2.apply(this, arguments);\\n    };\\n  }());\\n}));\\n/* ## Exit ## */\\n\\nonDestroy(() => {\\n  unsubscribe_blogs(); // important for garbage collection otherwise memory leak\\n});\\nexport { id, blockstyle, blog_path, size, offset, pagination, category };</script>\\n\\n<style>.blog{display:block;padding:50px 20px;padding:50px var(--padding-inner,20px);text-align:center;background:#f4f4f4;background:var(--background-offwhite,#f4f4f4);margin:var(--margin-sides-large)}.blog,h2,h3,p{color:#000;color:var(--color-black,#000)}.post{max-width:75%}</style>\\n"],"names":[],"mappings":"AAkHO,oBAAK,CAAC,QAAQ,KAAK,CAAC,QAAQ,IAAI,CAAC,IAAI,CAAC,QAAQ,IAAI,CAAC,IAAI,eAAe,CAAC,IAAI,CAAC,CAAC,WAAW,MAAM,CAAC,WAAW,OAAO,CAAC,WAAW,IAAI,qBAAqB,CAAC,OAAO,CAAC,CAAC,OAAO,IAAI,oBAAoB,CAAC,CAAC,oBAAK,CAAC,iBAAE,CAAC,EAAE,eAAE,CAAC,MAAM,IAAI,CAAC,MAAM,IAAI,aAAa,CAAC,IAAI,CAAC,CAAC,oBAAK,CAAC,UAAU,GAAG,CAAC"}`
};
function asyncGeneratorStep$l(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$l(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$l(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$l(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Block_WP_BlogListingByCategory = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var {id} = $$props;
  var {blockstyle = ""} = $$props;
  var {blog_path = "/blog"} = $$props;
  var {size = 10} = $$props;
  var {offset = 0} = $$props;
  var {pagination = false} = $$props;
  var {category = "Featured"} = $$props;
  var posts = [];
  var unsubscribe_blogs = () => {
  };
  onMount(/* @__PURE__ */ _asyncToGenerator$l(function* () {
    var _$milk, _$milk$data;
    var queryVariables = {
      category: "Featured",
      offset: parseInt(offset),
      size: parseInt(size)
    };
    var getBlogs = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_LIST_POSTS_BYCAT, $milk.data.sources.wordpress, queryVariables);
    unsubscribe_blogs = yield getBlogs == null ? void 0 : getBlogs.subscribe(/* @__PURE__ */ function() {
      var _ref2 = _asyncToGenerator$l(function* (fetched_data) {
        var _data$posts;
        var data = yield fetched_data;
        console.log(data);
        posts = data == null ? void 0 : (_data$posts = data.posts) == null ? void 0 : _data$posts.nodes;
      });
      return function(_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  }));
  onDestroy(() => {
    unsubscribe_blogs();
  });
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  if ($$props.blog_path === void 0 && $$bindings.blog_path && blog_path !== void 0)
    $$bindings.blog_path(blog_path);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.offset === void 0 && $$bindings.offset && offset !== void 0)
    $$bindings.offset(offset);
  if ($$props.pagination === void 0 && $$bindings.pagination && pagination !== void 0)
    $$bindings.pagination(pagination);
  if ($$props.category === void 0 && $$bindings.category && category !== void 0)
    $$bindings.category(category);
  $$result.css.add(css$o);
  $$unsubscribe_milk();
  return `<div class="${"blog svelte-1hlewd7"}"><div class="${"blog-inner"}">${slots.before ? slots.before({}) : `<h2 class="${"svelte-1hlewd7"}">Blog Posts</h2>`}
		<div class="${"posts-grid posts-listing"}">${each(posts, (post2) => {
    var _a, _b, _c, _d, _e, _f;
    return `<div class="${"post svelte-1hlewd7"}"><a${add_attribute("href", `${blog_path}/${post2 == null ? void 0 : post2.slug}`, 0)}${add_attribute("title", `${post2 == null ? void 0 : post2.title}`, 0)} sveltekit:prefetch><picture>${((_b = (_a = post2 == null ? void 0 : post2.featuredImage) == null ? void 0 : _a.node) == null ? void 0 : _b.srcSet) ? `<source type="${"image/jpeg"}"${add_attribute("srcset", (_d = (_c = post2 == null ? void 0 : post2.featuredImage) == null ? void 0 : _c.node) == null ? void 0 : _d.srcSet, 0)}>` : ``}
							<img${add_attribute("src", ((_f = (_e = post2 == null ? void 0 : post2.featuredImage) == null ? void 0 : _e.node) == null ? void 0 : _f.sourceUrl) || "/milk/img/post_noimage.webp", 0)}${add_attribute("alt", post2 == null ? void 0 : post2.title, 0)} loading="${"lazy"}" width="${"250"}" height="${"141"}"></picture>
						<h3 class="${"svelte-1hlewd7"}"><span class="${"post-title"}">${escape(post2 == null ? void 0 : post2.title)}</span>
							<span class="${"more"}">${slots.more ? slots.more({}) : `
									<svg aria-hidden="${"true"}" focusable="${"false"}" role="${"img"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 320 512"}"><path fill="${"currentColor"}" d="${"M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"}"></path></svg>
								`}</span>
						</h3></a>
				</div>`;
  })}</div>
		${slots.after ? slots.after({}) : ``}</div>
</div>`;
});
var Block_Featured_svelte = ".featured.svelte-wk2xk6.svelte-wk2xk6{display:block;padding:100px var(--padding) 0;text-align:center;margin-bottom:-50px}.featured-inner.svelte-wk2xk6.svelte-wk2xk6{margin:0 auto;max-width:var(--content-constrain)}h2.svelte-wk2xk6.svelte-wk2xk6{margin-bottom:-40px;font-size:var(--extralarge-fontsize)}.featured-on.svelte-wk2xk6.svelte-wk2xk6{display:inline-block;vertical-align:middle;margin:20px;max-width:200px;transition:all .3s ease;transform-origin:center;transform:scale(1)}.featured-on.svelte-wk2xk6.svelte-wk2xk6:hover{transform:scale(1.15)}.featured-on.svelte-wk2xk6 img.svelte-wk2xk6{width:100%;height:auto}.featured-on-listing.svelte-wk2xk6.svelte-wk2xk6{margin:5px 0 10px}@media screen and (max-width:650px){.featured-on.svelte-wk2xk6.svelte-wk2xk6{margin-bottom:-60px}.featured-on.svelte-wk2xk6.svelte-wk2xk6:last-of-type{margin-bottom:40px}}";
const css$n = {
  code: ".featured.svelte-wk2xk6.svelte-wk2xk6{display:block;padding:100px var(--padding) 0;text-align:center;margin-bottom:-50px}.featured-inner.svelte-wk2xk6.svelte-wk2xk6{margin:0 auto;max-width:var(--content-constrain)}h2.svelte-wk2xk6.svelte-wk2xk6{margin-bottom:-40px;font-size:var(--extralarge-fontsize)}.featured-on.svelte-wk2xk6.svelte-wk2xk6{display:inline-block;vertical-align:middle;margin:20px;max-width:200px;transition:all .3s ease;transform-origin:center;transform:scale(1)}.featured-on.svelte-wk2xk6.svelte-wk2xk6:hover{transform:scale(1.15)}.featured-on.svelte-wk2xk6 img.svelte-wk2xk6{width:100%;height:auto}.featured-on-listing.svelte-wk2xk6.svelte-wk2xk6{margin:5px 0 10px}@media screen and (max-width:650px){.featured-on.svelte-wk2xk6.svelte-wk2xk6{margin-bottom:-60px}.featured-on.svelte-wk2xk6.svelte-wk2xk6:last-of-type{margin-bottom:40px}}",
  map: `{"version":3,"file":"Block_Featured.svelte","sources":["Block_Featured.svelte"],"sourcesContent":["<div {id} class={blockclass}>\\n\\t<div class=\\"featured-inner\\">\\n\\t\\t<h2>Harlan York Has Been Featured On</h2>\\n\\t\\t<div class=\\"featured-on-listing\\">\\n\\t\\t\\t{#each featured as feature}\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\thref={feature?.FeaturedOn?.link}\\n\\t\\t\\t\\t\\ttitle={feature?.title}\\n\\t\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\t\\trel=\\"noopener\\"\\n\\t\\t\\t\\t\\tclass=\\"featured-on\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t<picture>\\n\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\ttype=\\"image/avif\\"\\n\\t\\t\\t\\t\\t\\t\\tsrcset={feature?.FeaturedOn?.avifImage?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\ttype=\\"image/webp\\"\\n\\t\\t\\t\\t\\t\\t\\tsrcset={feature?.FeaturedOn?.webpImage?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\t\\tsrc={feature?.FeaturedOn?.pngImage?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\talt={feature?.title}\\n\\t\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\t\\twidth=\\"200\\"\\n\\t\\t\\t\\t\\t\\t\\theight=\\"200\\"\\n\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t</picture>\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t{/each}\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<script>function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount, onDestroy } from 'svelte';\\n/* ## MILK ## */\\n\\nimport { milk } from '$milk/milk.js';\\nimport { shuffleArray } from '$milk/util/helpers.js';\\n/* ## Variables ## */\\n\\nvar id;\\nvar blockstyle = '';\\nvar blockclass = 'featured';\\n\\n$: blockclass = \\"featured \\" + blockstyle;\\n/* ## Data Loading ## */\\n\\n\\nimport { preload_featured } from '$graphql/sitespecific.preload.js';\\nvar preload = preload_featured;\\nshuffleArray(preload);\\nvar featured = preload.slice(0, 4);\\n\\nvar unsubscribe_featured = () => {};\\n\\nimport { Q_GET_FEATURED } from '$graphql/sitespecific.graphql.js';\\n/* ## Main ## */\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  var _$milk, _$milk$data;\\n\\n  var queryVariables = {\\n    size: 99\\n  };\\n  var getFeatrued = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_FEATURED, $milk.data.sources.wordpress, queryVariables);\\n  unsubscribe_featured = yield getFeatrued == null ? void 0 : getFeatrued.subscribe( /*#__PURE__*/function () {\\n    var _ref2 = _asyncToGenerator(function* (fetched_data) {\\n      var data = yield fetched_data; //console.log(data);\\n\\n      var tmpArray = data.featuredOns.nodes;\\n      shuffleArray(tmpArray);\\n      featured = tmpArray.slice(0, 4);\\n    });\\n\\n    return function (_x) {\\n      return _ref2.apply(this, arguments);\\n    };\\n  }());\\n}));\\n/* ## Exit ## */\\n\\nonDestroy(() => {\\n  unsubscribe_featured(); // important for garbage collection otherwise memory leak\\n});\\n/* ## Exports ## */\\n\\nexport { id, blockstyle };</script>\\n\\n<style>.featured{display:block;padding:100px var(--padding) 0;text-align:center;margin-bottom:-50px}.featured-inner{margin:0 auto;max-width:var(--content-constrain)}h2{margin-bottom:-40px;font-size:var(--extralarge-fontsize)}.featured-on{display:inline-block;vertical-align:middle;margin:20px;max-width:200px;transition:all .3s ease;transform-origin:center;transform:scale(1)}.featured-on:hover{transform:scale(1.15)}.featured-on img{width:100%;height:auto}.featured-on-listing{margin:5px 0 10px}@media screen and (max-width:650px){.featured-on{margin-bottom:-60px}.featured-on:last-of-type{margin-bottom:40px}}</style>\\n"],"names":[],"mappings":"AA+FO,qCAAS,CAAC,QAAQ,KAAK,CAAC,QAAQ,KAAK,CAAC,IAAI,SAAS,CAAC,CAAC,CAAC,CAAC,WAAW,MAAM,CAAC,cAAc,KAAK,CAAC,2CAAe,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,IAAI,mBAAmB,CAAC,CAAC,8BAAE,CAAC,cAAc,KAAK,CAAC,UAAU,IAAI,qBAAqB,CAAC,CAAC,wCAAY,CAAC,QAAQ,YAAY,CAAC,eAAe,MAAM,CAAC,OAAO,IAAI,CAAC,UAAU,KAAK,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,iBAAiB,MAAM,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,wCAAY,MAAM,CAAC,UAAU,MAAM,IAAI,CAAC,CAAC,0BAAY,CAAC,iBAAG,CAAC,MAAM,IAAI,CAAC,OAAO,IAAI,CAAC,gDAAoB,CAAC,OAAO,GAAG,CAAC,CAAC,CAAC,IAAI,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,wCAAY,CAAC,cAAc,KAAK,CAAC,wCAAY,aAAa,CAAC,cAAc,IAAI,CAAC,CAAC"}`
};
function asyncGeneratorStep$k(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$k(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$k(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$k(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Block_Featured = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var {id} = $$props;
  var {blockstyle = ""} = $$props;
  var blockclass = "featured";
  var preload = preload_featured;
  shuffleArray(preload);
  var featured = preload.slice(0, 4);
  var unsubscribe_featured = () => {
  };
  onMount(/* @__PURE__ */ _asyncToGenerator$k(function* () {
    var _$milk, _$milk$data;
    var queryVariables = {size: 99};
    var getFeatrued = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_FEATURED, $milk.data.sources.wordpress, queryVariables);
    unsubscribe_featured = yield getFeatrued == null ? void 0 : getFeatrued.subscribe(/* @__PURE__ */ function() {
      var _ref2 = _asyncToGenerator$k(function* (fetched_data) {
        var data = yield fetched_data;
        var tmpArray = data.featuredOns.nodes;
        shuffleArray(tmpArray);
        featured = tmpArray.slice(0, 4);
      });
      return function(_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  }));
  onDestroy(() => {
    unsubscribe_featured();
  });
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  $$result.css.add(css$n);
  blockclass = "featured " + blockstyle;
  $$unsubscribe_milk();
  return `<div${add_attribute("id", id, 0)} class="${escape(null_to_empty(blockclass)) + " svelte-wk2xk6"}"><div class="${"featured-inner svelte-wk2xk6"}"><h2 class="${"svelte-wk2xk6"}">Harlan York Has Been Featured On</h2>
		<div class="${"featured-on-listing svelte-wk2xk6"}">${each(featured, (feature) => {
    var _a, _b, _c, _d, _e, _f, _g;
    return `<a${add_attribute("href", (_a = feature == null ? void 0 : feature.FeaturedOn) == null ? void 0 : _a.link, 0)}${add_attribute("title", feature == null ? void 0 : feature.title, 0)} target="${"_blank"}" rel="${"noopener"}" class="${"featured-on svelte-wk2xk6"}"><picture><source type="${"image/avif"}"${add_attribute("srcset", (_c = (_b = feature == null ? void 0 : feature.FeaturedOn) == null ? void 0 : _b.avifImage) == null ? void 0 : _c.sourceUrl, 0)}>
						<source type="${"image/webp"}"${add_attribute("srcset", (_e = (_d = feature == null ? void 0 : feature.FeaturedOn) == null ? void 0 : _d.webpImage) == null ? void 0 : _e.sourceUrl, 0)}>
						<img${add_attribute("src", (_g = (_f = feature == null ? void 0 : feature.FeaturedOn) == null ? void 0 : _f.pngImage) == null ? void 0 : _g.sourceUrl, 0)}${add_attribute("alt", feature == null ? void 0 : feature.title, 0)} loading="${"lazy"}" width="${"200"}" height="${"200"}" class="${"svelte-wk2xk6"}"></picture>
				</a>`;
  })}</div></div>
</div>`;
});
var FeaturedVideo_svelte = ".video.svelte-lpyavj{display:block;width:100%;text-align:center;overflow-x:hidden;padding:var(--padding)}.video-inner.svelte-lpyavj{margin:0 auto;max-width:var(--content-constrain);position:relative;width:min(100%,min(100vw,var(--content-constrain)));height:min(43vw,calc(var(--content-constrain)/300*129));max-width:100%}.the-video.svelte-lpyavj,img.svelte-lpyavj,picture.svelte-lpyavj{display:block}.the-video.svelte-lpyavj,iframe.svelte-lpyavj,img.svelte-lpyavj{width:min(100%,min(100vw,var(--content-constrain)));height:min(43vw,calc(var(--content-constrain)/300*129));max-width:100%}";
const css$m = {
  code: ".video.svelte-lpyavj{display:block;width:100%;text-align:center;overflow-x:hidden;padding:var(--padding)}.video-inner.svelte-lpyavj{margin:0 auto;max-width:var(--content-constrain);position:relative;width:min(100%,min(100vw,var(--content-constrain)));height:min(43vw,calc(var(--content-constrain)/300*129));max-width:100%}picture.svelte-lpyavj{display:block}.the-video.svelte-lpyavj,img.svelte-lpyavj{display:block}.the-video.svelte-lpyavj,iframe.svelte-lpyavj,img.svelte-lpyavj{width:min(100%,min(100vw,var(--content-constrain)));height:min(43vw,calc(var(--content-constrain)/300*129));max-width:100%}",
  map: `{"version":3,"file":"FeaturedVideo.svelte","sources":["FeaturedVideo.svelte"],"sourcesContent":["<div\\n\\tbind:this={video_element}\\n\\ton:mouseover={() => {\\n\\t\\tshow_video = true;\\n\\t}}\\n\\ton:click={() => {\\n\\t\\tshow_video = true;\\n\\t}}\\n\\tclass=\\"video\\"\\n>\\n\\t<div class=\\"video-inner\\">\\n\\t\\t{#if show_video}\\n\\t\\t\\t<iframe\\n\\t\\t\\t\\tsrc={video_source}\\n\\t\\t\\t\\ttitle=\\"Video\\"\\n\\t\\t\\t\\tframeborder=\\"0\\"\\n\\t\\t\\t\\twebkitallowfullscreen\\n\\t\\t\\t\\tmozallowfullscreen\\n\\t\\t\\t\\tallowfullscreen\\n\\t\\t\\t\\tallow=\\"accelerometer; autoplay; clipboard-write; encrypted-media;\\"\\n\\t\\t\\t\\tclass=\\"the-video\\"\\n\\t\\t\\t/>\\n\\t\\t{:else}\\n\\t\\t\\t<picture>\\n\\t\\t\\t\\t<source type=\\"image/avif\\" srcset=\\"/img/video_featured.avif\\" />\\n\\t\\t\\t\\t<source type=\\"image/webp\\" srcset=\\"/img/video_featured.webp\\" />\\n\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\talt=\\"video\\"\\n\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\tsrc=\\"/img/video_featured.jpg\\"\\n\\t\\t\\t\\t\\twidth=\\"300\\"\\n\\t\\t\\t\\t\\theight=\\"150\\"\\n\\t\\t\\t\\t\\ton:load={() => {\\n\\t\\t\\t\\t\\t\\tshow_video = true;\\n\\t\\t\\t\\t\\t}}\\n\\t\\t\\t\\t/>\\n\\t\\t\\t</picture>\\n\\t\\t\\t<img\\n\\t\\t\\t\\tsrc={\`/milk/img/onload_then_do_video.gif?cache=\${cache_bust}\`}\\n\\t\\t\\t\\trel=\\"nocache\\"\\n\\t\\t\\t\\tdata-dev=\\"uncachable proximity loader\\"\\n\\t\\t\\t\\talt=\\"loader\\"\\n\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\twidth=\\"1\\"\\n\\t\\t\\t\\theight=\\"1\\"\\n\\t\\t\\t\\ton:load={() => {\\n\\t\\t\\t\\t\\tshow_video = true;\\n\\t\\t\\t\\t}}\\n\\t\\t\\t/>\\n\\t\\t{/if}\\n\\t</div>\\n</div>\\n\\n<script>var _Date;\\n\\nimport { onMount } from 'svelte';\\nvar id;\\nvar blockstyle = '';\\nvar blockclass = 'featuredvideo';\\n\\n$: blockclass = \\"featuredvideo \\" + blockstyle;\\n\\nvar video_element;\\nvar video_observer;\\nvar show_video = false;\\nvar cache_bust = (_Date = new Date()) == null ? void 0 : _Date.getTime();\\nvar video_source = '';\\nvar video_jpg = '';\\nvar video_webp = '';\\nvar video_avif = '';\\nonMount(() => {\\n  var _video_observer;\\n\\n  video_observer = new IntersectionObserver(function (entries) {\\n    var _entries$;\\n\\n    if ((entries == null ? void 0 : (_entries$ = entries[0]) == null ? void 0 : _entries$.isIntersecting) === true) {\\n      show_video = true;\\n    }\\n  }, {\\n    threshold: [0]\\n  });\\n  (_video_observer = video_observer) == null ? void 0 : _video_observer.observe(video_element);\\n});\\nexport { id, blockstyle, video_source, video_jpg, video_webp, video_avif };</script>\\n\\n<style>.video{display:block;width:100%;text-align:center;overflow-x:hidden;padding:var(--padding)}.video-inner{margin:0 auto;max-width:var(--content-constrain);position:relative;width:min(100%,min(100vw,var(--content-constrain)));height:min(43vw,calc(var(--content-constrain)/300*129));max-width:100%}picture{display:block}.the-video,img{display:block}.the-video,iframe,img{width:min(100%,min(100vw,var(--content-constrain)));height:min(43vw,calc(var(--content-constrain)/300*129));max-width:100%}</style>\\n"],"names":[],"mappings":"AAsFO,oBAAM,CAAC,QAAQ,KAAK,CAAC,MAAM,IAAI,CAAC,WAAW,MAAM,CAAC,WAAW,MAAM,CAAC,QAAQ,IAAI,SAAS,CAAC,CAAC,0BAAY,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,IAAI,mBAAmB,CAAC,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,IAAI,CAAC,IAAI,KAAK,CAAC,IAAI,mBAAmB,CAAC,CAAC,CAAC,CAAC,OAAO,IAAI,IAAI,CAAC,KAAK,IAAI,mBAAmB,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,UAAU,IAAI,CAAC,qBAAO,CAAC,QAAQ,KAAK,CAAC,wBAAU,CAAC,iBAAG,CAAC,QAAQ,KAAK,CAAC,wBAAU,CAAC,oBAAM,CAAC,iBAAG,CAAC,MAAM,IAAI,IAAI,CAAC,IAAI,KAAK,CAAC,IAAI,mBAAmB,CAAC,CAAC,CAAC,CAAC,OAAO,IAAI,IAAI,CAAC,KAAK,IAAI,mBAAmB,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,CAAC,CAAC,UAAU,IAAI,CAAC"}`
};
const FeaturedVideo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _Date;
  var {id} = $$props;
  var {blockstyle = ""} = $$props;
  var video_element;
  var video_observer;
  var show_video = false;
  var cache_bust = (_Date = new Date()) == null ? void 0 : _Date.getTime();
  var {video_source = ""} = $$props;
  var {video_jpg = ""} = $$props;
  var {video_webp = ""} = $$props;
  var {video_avif = ""} = $$props;
  onMount(() => {
    var _video_observer;
    video_observer = new IntersectionObserver(function(entries) {
      var _entries$;
      if ((entries == null ? void 0 : (_entries$ = entries[0]) == null ? void 0 : _entries$.isIntersecting) === true) {
        show_video = true;
      }
    }, {threshold: [0]});
    (_video_observer = video_observer) == null ? void 0 : _video_observer.observe(video_element);
  });
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  if ($$props.video_source === void 0 && $$bindings.video_source && video_source !== void 0)
    $$bindings.video_source(video_source);
  if ($$props.video_jpg === void 0 && $$bindings.video_jpg && video_jpg !== void 0)
    $$bindings.video_jpg(video_jpg);
  if ($$props.video_webp === void 0 && $$bindings.video_webp && video_webp !== void 0)
    $$bindings.video_webp(video_webp);
  if ($$props.video_avif === void 0 && $$bindings.video_avif && video_avif !== void 0)
    $$bindings.video_avif(video_avif);
  $$result.css.add(css$m);
  return `<div class="${"video svelte-lpyavj"}"${add_attribute("this", video_element, 1)}><div class="${"video-inner svelte-lpyavj"}">${show_video ? `<iframe${add_attribute("src", video_source, 0)} title="${"Video"}" frameborder="${"0"}" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="${"accelerometer; autoplay; clipboard-write; encrypted-media;"}" class="${"the-video svelte-lpyavj"}"></iframe>` : `<picture class="${"svelte-lpyavj"}"><source type="${"image/avif"}" srcset="${"/img/video_featured.avif"}">
				<source type="${"image/webp"}" srcset="${"/img/video_featured.webp"}">
				<img alt="${"video"}" loading="${"lazy"}" src="${"/img/video_featured.jpg"}" width="${"300"}" height="${"150"}" class="${"svelte-lpyavj"}"></picture>
			<img${add_attribute("src", `/milk/img/onload_then_do_video.gif?cache=${cache_bust}`, 0)} rel="${"nocache"}" data-dev="${"uncachable proximity loader"}" alt="${"loader"}" loading="${"lazy"}" width="${"1"}" height="${"1"}" class="${"svelte-lpyavj"}">`}</div>
</div>`;
});
var SocialIcon_svelte = ".social-icon.svelte-14lz7y7.svelte-14lz7y7{display:inline-block;vertical-align:middle}.social-icon.svelte-14lz7y7>div.svelte-14lz7y7{position:relative;width:100%;height:100%;padding-top:calc(50% + 2px)}a.svelte-14lz7y7.svelte-14lz7y7{display:inline-block;vertical-align:middle;margin-top:-50%;width:100%}span.svelte-14lz7y7.svelte-14lz7y7{display:block}.icon.svelte-14lz7y7.svelte-14lz7y7{width:auto;height:auto}";
const css$l = {
  code: ".social-icon.svelte-14lz7y7.svelte-14lz7y7{display:inline-block;vertical-align:middle}.social-icon.svelte-14lz7y7>div.svelte-14lz7y7{position:relative;width:100%;height:100%;padding-top:calc(50% + 2px)}a.svelte-14lz7y7.svelte-14lz7y7{display:inline-block;vertical-align:middle;margin-top:-50%;width:100%}span.svelte-14lz7y7.svelte-14lz7y7{display:block}.icon.svelte-14lz7y7.svelte-14lz7y7{width:auto;height:auto}",
  map: `{"version":3,"file":"SocialIcon.svelte","sources":["SocialIcon.svelte"],"sourcesContent":["<div\\n\\tclass={\`social-icon icon-for-\${title\\n\\t\\t.replace(/[^\\\\w]/g, '')\\n\\t\\t.toLowerCase()} \${title.replace(/[^\\\\w]/g, '').toLowerCase()}\`}\\n>\\n\\t<div>\\n\\t\\t<a href={url} target=\\"_blank\\" rel=\\"noopener\\" {title}>\\n\\t\\t\\t<img\\n\\t\\t\\t\\tsrc={icon}\\n\\t\\t\\t\\talt={title}\\n\\t\\t\\t\\tclass=\\"icon\\"\\n\\t\\t\\t\\twidth={size}\\n\\t\\t\\t\\theight={size}\\n\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\tstyle={\`max-width: \${size}px; max-height: \${size}px;\`}\\n\\t\\t\\t/>\\n\\t\\t\\t<span>{title}</span>\\n\\t\\t</a>\\n\\t</div>\\n</div>\\n\\n<script>var title = '';\\nvar icon = '';\\nvar size = 25;\\nvar url = '';\\nexport { title, icon, size, url };</script>\\n\\n<style>.social-icon{display:inline-block;vertical-align:middle}.social-icon>div{position:relative;width:100%;height:100%;padding-top:calc(50% + 2px)}a{display:inline-block;vertical-align:middle;margin-top:-50%;width:100%}span{display:block}.icon{width:auto;height:auto}</style>\\n"],"names":[],"mappings":"AA2BO,0CAAY,CAAC,QAAQ,YAAY,CAAC,eAAe,MAAM,CAAC,2BAAY,CAAC,kBAAG,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,CAAC,OAAO,IAAI,CAAC,YAAY,KAAK,GAAG,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,+BAAC,CAAC,QAAQ,YAAY,CAAC,eAAe,MAAM,CAAC,WAAW,IAAI,CAAC,MAAM,IAAI,CAAC,kCAAI,CAAC,QAAQ,KAAK,CAAC,mCAAK,CAAC,MAAM,IAAI,CAAC,OAAO,IAAI,CAAC"}`
};
const SocialIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var {title = ""} = $$props;
  var {icon = ""} = $$props;
  var {size = 25} = $$props;
  var {url = ""} = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.icon === void 0 && $$bindings.icon && icon !== void 0)
    $$bindings.icon(icon);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.url === void 0 && $$bindings.url && url !== void 0)
    $$bindings.url(url);
  $$result.css.add(css$l);
  return `<div class="${escape(null_to_empty(`social-icon icon-for-${title.replace(/[^\w]/g, "").toLowerCase()} ${title.replace(/[^\w]/g, "").toLowerCase()}`)) + " svelte-14lz7y7"}"><div class="${"svelte-14lz7y7"}"><a${add_attribute("href", url, 0)} target="${"_blank"}" rel="${"noopener"}"${add_attribute("title", title, 0)} class="${"svelte-14lz7y7"}"><img${add_attribute("src", icon, 0)}${add_attribute("alt", title, 0)} class="${"icon svelte-14lz7y7"}"${add_attribute("width", size, 0)}${add_attribute("height", size, 0)} loading="${"lazy"}"${add_attribute("style", `max-width: ${size}px; max-height: ${size}px;`, 0)}>
			<span class="${"svelte-14lz7y7"}">${escape(title)}</span></a></div>
</div>`;
});
var SocialMedia_svelte = ".socialmedia.svelte-1q0iq0z{display:block;padding:var(--padding) var(--padding) 100px;color:#000;color:var(--color-black,#000);text-align:center;background:#fff;background:var(--color-white,#fff)}.socialmedia-inner.svelte-1q0iq0z{margin:0 auto;max-width:var(--constrain-content)}h2.svelte-1q0iq0z{position:absolute;margin-left:-9999vw}h3.svelte-1q0iq0z{color:#000;color:var(--color-black,#000)}";
const css$k = {
  code: ".socialmedia.svelte-1q0iq0z{display:block;padding:var(--padding) var(--padding) 100px;color:#000;color:var(--color-black,#000);text-align:center;background:#fff;background:var(--color-white,#fff)}.socialmedia-inner.svelte-1q0iq0z{margin:0 auto;max-width:var(--constrain-content)}h2.svelte-1q0iq0z{position:absolute;margin-left:-9999vw}h3.svelte-1q0iq0z{color:#000;color:var(--color-black,#000)}",
  map: `{"version":3,"file":"SocialMedia.svelte","sources":["SocialMedia.svelte"],"sourcesContent":["<div {id} class={blockclass}>\\n\\t<div class=\\"socialmedia-inner\\">\\n\\t\\t<h2>Social Media</h2>\\n\\t\\t<h3>Follow Us On</h3>\\n\\t\\t<div class=\\"social-icons\\">\\n\\t\\t\\t{#if $milk?.site?.facebook != ''}\\n\\t\\t\\t\\t<SocialIcon\\n\\t\\t\\t\\t\\ttitle=\\"Facebook\\"\\n\\t\\t\\t\\t\\turl={$milk?.site?.facebook}\\n\\t\\t\\t\\t\\ticon=\\"/img/icon-socialmedia-facebook.svg\\"\\n\\t\\t\\t\\t\\tsize=\\"25\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if $milk?.site?.twitter != ''}\\n\\t\\t\\t\\t<SocialIcon\\n\\t\\t\\t\\t\\ttitle=\\"Twitter\\"\\n\\t\\t\\t\\t\\turl={$milk?.site?.twitter}\\n\\t\\t\\t\\t\\ticon=\\"/img/icon-socialmedia-twitter.svg\\"\\n\\t\\t\\t\\t\\tsize=\\"25\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if $milk?.site?.instagram != ''}\\n\\t\\t\\t\\t<SocialIcon\\n\\t\\t\\t\\t\\ttitle=\\"Instagram\\"\\n\\t\\t\\t\\t\\turl={$milk?.site?.instagram}\\n\\t\\t\\t\\t\\ticon=\\"/img/icon-socialmedia-instagram.svg\\"\\n\\t\\t\\t\\t\\tsize=\\"25\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if $milk?.site?.linkedin != ''}\\n\\t\\t\\t\\t<SocialIcon\\n\\t\\t\\t\\t\\ttitle=\\"LinkedIn\\"\\n\\t\\t\\t\\t\\turl={$milk?.site?.linkedin}\\n\\t\\t\\t\\t\\ticon=\\"/img/icon-socialmedia-linkedin.svg\\"\\n\\t\\t\\t\\t\\tsize=\\"25\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if $milk?.site?.youtube != ''}\\n\\t\\t\\t\\t<SocialIcon\\n\\t\\t\\t\\t\\ttitle=\\"YouTube\\"\\n\\t\\t\\t\\t\\turl={$milk?.site?.youtube}\\n\\t\\t\\t\\t\\ticon=\\"/img/icon-socialmedia-youtube.svg\\"\\n\\t\\t\\t\\t\\tsize=\\"25\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if $milk?.site?.vimeo != ''}\\n\\t\\t\\t\\t<SocialIcon\\n\\t\\t\\t\\t\\ttitle=\\"Vimeo\\"\\n\\t\\t\\t\\t\\turl={$milk?.site?.vimeo}\\n\\t\\t\\t\\t\\ticon=\\"/img/icon-socialmedia-vimeo.svg\\"\\n\\t\\t\\t\\t\\tsize=\\"25\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if $milk?.site?.etsy != ''}\\n\\t\\t\\t\\t<SocialIcon\\n\\t\\t\\t\\t\\ttitle=\\"Etsy\\"\\n\\t\\t\\t\\t\\turl={$milk?.site?.etsy}\\n\\t\\t\\t\\t\\ticon=\\"/img/icon-socialmedia-etsy.svg\\"\\n\\t\\t\\t\\t\\tsize=\\"25\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if $milk?.site?.pinterest != ''}\\n\\t\\t\\t\\t<SocialIcon\\n\\t\\t\\t\\t\\ttitle=\\"Pinterest\\"\\n\\t\\t\\t\\t\\turl={$milk?.site?.pinterest}\\n\\t\\t\\t\\t\\ticon=\\"/img/icon-socialmedia-pinterest.svg\\"\\n\\t\\t\\t\\t\\tsize=\\"25\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if $milk?.site?.airbnb != ''}\\n\\t\\t\\t\\t<SocialIcon\\n\\t\\t\\t\\t\\ttitle=\\"AirBnB\\"\\n\\t\\t\\t\\t\\turl={$milk?.site?.airbnb}\\n\\t\\t\\t\\t\\ticon=\\"/img/icon-socialmedia-airbnb.svg\\"\\n\\t\\t\\t\\t\\tsize=\\"25\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if $milk?.site?.yelp != ''}\\n\\t\\t\\t\\t<SocialIcon\\n\\t\\t\\t\\t\\ttitle=\\"Yelp!\\"\\n\\t\\t\\t\\t\\turl={$milk?.site?.yelp}\\n\\t\\t\\t\\t\\ticon=\\"/img/icon-socialmedia-yelp.svg\\"\\n\\t\\t\\t\\t\\tsize=\\"25\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if $milk?.site?.tiktok != ''}\\n\\t\\t\\t\\t<SocialIcon\\n\\t\\t\\t\\t\\ttitle=\\"TikTok\\"\\n\\t\\t\\t\\t\\turl={$milk?.site?.tiktok}\\n\\t\\t\\t\\t\\ticon=\\"/img/icon-socialmedia-tiktok.svg\\"\\n\\t\\t\\t\\t\\tsize=\\"25\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if $milk?.site?.snapchat != ''}\\n\\t\\t\\t\\t<SocialIcon\\n\\t\\t\\t\\t\\ttitle=\\"SnapChat\\"\\n\\t\\t\\t\\t\\turl={$milk?.site?.snapchat}\\n\\t\\t\\t\\t\\ticon=\\"/img/icon-socialmedia-snapchat.svg\\"\\n\\t\\t\\t\\t\\tsize=\\"25\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if $milk?.site?.blog != ''}\\n\\t\\t\\t\\t<SocialIcon\\n\\t\\t\\t\\t\\ttitle=\\"Blog\\"\\n\\t\\t\\t\\t\\turl={$milk?.site?.blog}\\n\\t\\t\\t\\t\\ticon=\\"/img/icon-socialmedia-blog.svg\\"\\n\\t\\t\\t\\t\\tsize=\\"25\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if $milk?.site?.rss != ''}\\n\\t\\t\\t\\t<SocialIcon\\n\\t\\t\\t\\t\\ttitle=\\"RSS\\"\\n\\t\\t\\t\\t\\turl={$milk?.site?.rss}\\n\\t\\t\\t\\t\\ticon=\\"/img/icon-socialmedia-rss.svg\\"\\n\\t\\t\\t\\t\\tsize=\\"25\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if $milk?.site?.google_maps != ''}\\n\\t\\t\\t\\t<SocialIcon\\n\\t\\t\\t\\t\\ttitle=\\"Google Maps\\"\\n\\t\\t\\t\\t\\turl={$milk?.site?.google_maps}\\n\\t\\t\\t\\t\\ticon=\\"/img/icon-socialmedia-google_maps.svg\\"\\n\\t\\t\\t\\t\\tsize=\\"25\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if $milk?.site?.google_business != ''}\\n\\t\\t\\t\\t<SocialIcon\\n\\t\\t\\t\\t\\ttitle=\\"Google Business\\"\\n\\t\\t\\t\\t\\turl={$milk?.site?.google_business}\\n\\t\\t\\t\\t\\ticon=\\"/img/icon-socialmedia-google_business.svg\\"\\n\\t\\t\\t\\t\\tsize=\\"25\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if $milk?.site?.vcf_file != ''}\\n\\t\\t\\t\\t<SocialIcon\\n\\t\\t\\t\\t\\ttitle=\\"vCard\\"\\n\\t\\t\\t\\t\\turl={$milk?.site?.vcf_file}\\n\\t\\t\\t\\t\\ticon=\\"/img/icon-socialmedia-vcard.svg\\"\\n\\t\\t\\t\\t\\tsize=\\"25\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if $milk?.site?.calendar != ''}\\n\\t\\t\\t\\t<SocialIcon\\n\\t\\t\\t\\t\\ttitle=\\"Calendar\\"\\n\\t\\t\\t\\t\\turl={$milk?.site?.calendar}\\n\\t\\t\\t\\t\\ticon=\\"/img/icon-socialmedia-calendar.svg\\"\\n\\t\\t\\t\\t\\tsize=\\"25\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t{/if}\\n\\t\\t\\t<slot />\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<script>/* ## MILK ## */\\nimport { milk } from '$milk/milk.js';\\n/* ## Components ## */\\n\\nimport SocialIcon from '$milk/lib/SocialIcon.svelte';\\n/* ## Variables ## */\\n\\nvar id;\\nvar blockstyle = '';\\nvar blockclass = 'socialmedia';\\n\\n$: blockclass = \\"socialmedia \\" + blockstyle;\\n\\nexport { id, blockstyle };</script>\\n\\n<style>.socialmedia{display:block;padding:var(--padding) var(--padding) 100px;color:#000;color:var(--color-black,#000);text-align:center;background:#fff;background:var(--color-white,#fff)}.socialmedia-inner{margin:0 auto;max-width:var(--constrain-content)}h2{position:absolute;margin-left:-9999vw}h3,p{color:#000;color:var(--color-black,#000)}</style>\\n"],"names":[],"mappings":"AAyKO,2BAAY,CAAC,QAAQ,KAAK,CAAC,QAAQ,IAAI,SAAS,CAAC,CAAC,IAAI,SAAS,CAAC,CAAC,KAAK,CAAC,MAAM,IAAI,CAAC,MAAM,IAAI,aAAa,CAAC,IAAI,CAAC,CAAC,WAAW,MAAM,CAAC,WAAW,IAAI,CAAC,WAAW,IAAI,aAAa,CAAC,IAAI,CAAC,CAAC,iCAAkB,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,IAAI,mBAAmB,CAAC,CAAC,iBAAE,CAAC,SAAS,QAAQ,CAAC,YAAY,OAAO,CAAC,EAAE,eAAE,CAAC,MAAM,IAAI,CAAC,MAAM,IAAI,aAAa,CAAC,IAAI,CAAC,CAAC"}`
};
const SocialMedia = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J;
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var {id} = $$props;
  var {blockstyle = ""} = $$props;
  var blockclass = "socialmedia";
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  $$result.css.add(css$k);
  blockclass = "socialmedia " + blockstyle;
  $$unsubscribe_milk();
  return `<div${add_attribute("id", id, 0)} class="${escape(null_to_empty(blockclass)) + " svelte-1q0iq0z"}"><div class="${"socialmedia-inner svelte-1q0iq0z"}"><h2 class="${"svelte-1q0iq0z"}">Social Media</h2>
		<h3 class="${"svelte-1q0iq0z"}">Follow Us On</h3>
		<div class="${"social-icons"}">${((_a = $milk == null ? void 0 : $milk.site) == null ? void 0 : _a.facebook) != "" ? `${validate_component(SocialIcon, "SocialIcon").$$render($$result, {
    title: "Facebook",
    url: (_b = $milk == null ? void 0 : $milk.site) == null ? void 0 : _b.facebook,
    icon: "/img/icon-socialmedia-facebook.svg",
    size: "25"
  }, {}, {})}` : ``}
			${((_c = $milk == null ? void 0 : $milk.site) == null ? void 0 : _c.twitter) != "" ? `${validate_component(SocialIcon, "SocialIcon").$$render($$result, {
    title: "Twitter",
    url: (_d = $milk == null ? void 0 : $milk.site) == null ? void 0 : _d.twitter,
    icon: "/img/icon-socialmedia-twitter.svg",
    size: "25"
  }, {}, {})}` : ``}
			${((_e = $milk == null ? void 0 : $milk.site) == null ? void 0 : _e.instagram) != "" ? `${validate_component(SocialIcon, "SocialIcon").$$render($$result, {
    title: "Instagram",
    url: (_f = $milk == null ? void 0 : $milk.site) == null ? void 0 : _f.instagram,
    icon: "/img/icon-socialmedia-instagram.svg",
    size: "25"
  }, {}, {})}` : ``}
			${((_g = $milk == null ? void 0 : $milk.site) == null ? void 0 : _g.linkedin) != "" ? `${validate_component(SocialIcon, "SocialIcon").$$render($$result, {
    title: "LinkedIn",
    url: (_h = $milk == null ? void 0 : $milk.site) == null ? void 0 : _h.linkedin,
    icon: "/img/icon-socialmedia-linkedin.svg",
    size: "25"
  }, {}, {})}` : ``}
			${((_i = $milk == null ? void 0 : $milk.site) == null ? void 0 : _i.youtube) != "" ? `${validate_component(SocialIcon, "SocialIcon").$$render($$result, {
    title: "YouTube",
    url: (_j = $milk == null ? void 0 : $milk.site) == null ? void 0 : _j.youtube,
    icon: "/img/icon-socialmedia-youtube.svg",
    size: "25"
  }, {}, {})}` : ``}
			${((_k = $milk == null ? void 0 : $milk.site) == null ? void 0 : _k.vimeo) != "" ? `${validate_component(SocialIcon, "SocialIcon").$$render($$result, {
    title: "Vimeo",
    url: (_l = $milk == null ? void 0 : $milk.site) == null ? void 0 : _l.vimeo,
    icon: "/img/icon-socialmedia-vimeo.svg",
    size: "25"
  }, {}, {})}` : ``}
			${((_m = $milk == null ? void 0 : $milk.site) == null ? void 0 : _m.etsy) != "" ? `${validate_component(SocialIcon, "SocialIcon").$$render($$result, {
    title: "Etsy",
    url: (_n = $milk == null ? void 0 : $milk.site) == null ? void 0 : _n.etsy,
    icon: "/img/icon-socialmedia-etsy.svg",
    size: "25"
  }, {}, {})}` : ``}
			${((_o = $milk == null ? void 0 : $milk.site) == null ? void 0 : _o.pinterest) != "" ? `${validate_component(SocialIcon, "SocialIcon").$$render($$result, {
    title: "Pinterest",
    url: (_p = $milk == null ? void 0 : $milk.site) == null ? void 0 : _p.pinterest,
    icon: "/img/icon-socialmedia-pinterest.svg",
    size: "25"
  }, {}, {})}` : ``}
			${((_q = $milk == null ? void 0 : $milk.site) == null ? void 0 : _q.airbnb) != "" ? `${validate_component(SocialIcon, "SocialIcon").$$render($$result, {
    title: "AirBnB",
    url: (_r = $milk == null ? void 0 : $milk.site) == null ? void 0 : _r.airbnb,
    icon: "/img/icon-socialmedia-airbnb.svg",
    size: "25"
  }, {}, {})}` : ``}
			${((_s = $milk == null ? void 0 : $milk.site) == null ? void 0 : _s.yelp) != "" ? `${validate_component(SocialIcon, "SocialIcon").$$render($$result, {
    title: "Yelp!",
    url: (_t = $milk == null ? void 0 : $milk.site) == null ? void 0 : _t.yelp,
    icon: "/img/icon-socialmedia-yelp.svg",
    size: "25"
  }, {}, {})}` : ``}
			${((_u = $milk == null ? void 0 : $milk.site) == null ? void 0 : _u.tiktok) != "" ? `${validate_component(SocialIcon, "SocialIcon").$$render($$result, {
    title: "TikTok",
    url: (_v = $milk == null ? void 0 : $milk.site) == null ? void 0 : _v.tiktok,
    icon: "/img/icon-socialmedia-tiktok.svg",
    size: "25"
  }, {}, {})}` : ``}
			${((_w = $milk == null ? void 0 : $milk.site) == null ? void 0 : _w.snapchat) != "" ? `${validate_component(SocialIcon, "SocialIcon").$$render($$result, {
    title: "SnapChat",
    url: (_x = $milk == null ? void 0 : $milk.site) == null ? void 0 : _x.snapchat,
    icon: "/img/icon-socialmedia-snapchat.svg",
    size: "25"
  }, {}, {})}` : ``}
			${((_y = $milk == null ? void 0 : $milk.site) == null ? void 0 : _y.blog) != "" ? `${validate_component(SocialIcon, "SocialIcon").$$render($$result, {
    title: "Blog",
    url: (_z = $milk == null ? void 0 : $milk.site) == null ? void 0 : _z.blog,
    icon: "/img/icon-socialmedia-blog.svg",
    size: "25"
  }, {}, {})}` : ``}
			${((_A = $milk == null ? void 0 : $milk.site) == null ? void 0 : _A.rss) != "" ? `${validate_component(SocialIcon, "SocialIcon").$$render($$result, {
    title: "RSS",
    url: (_B = $milk == null ? void 0 : $milk.site) == null ? void 0 : _B.rss,
    icon: "/img/icon-socialmedia-rss.svg",
    size: "25"
  }, {}, {})}` : ``}
			${((_C = $milk == null ? void 0 : $milk.site) == null ? void 0 : _C.google_maps) != "" ? `${validate_component(SocialIcon, "SocialIcon").$$render($$result, {
    title: "Google Maps",
    url: (_D = $milk == null ? void 0 : $milk.site) == null ? void 0 : _D.google_maps,
    icon: "/img/icon-socialmedia-google_maps.svg",
    size: "25"
  }, {}, {})}` : ``}
			${((_E = $milk == null ? void 0 : $milk.site) == null ? void 0 : _E.google_business) != "" ? `${validate_component(SocialIcon, "SocialIcon").$$render($$result, {
    title: "Google Business",
    url: (_F = $milk == null ? void 0 : $milk.site) == null ? void 0 : _F.google_business,
    icon: "/img/icon-socialmedia-google_business.svg",
    size: "25"
  }, {}, {})}` : ``}
			${((_G = $milk == null ? void 0 : $milk.site) == null ? void 0 : _G.vcf_file) != "" ? `${validate_component(SocialIcon, "SocialIcon").$$render($$result, {
    title: "vCard",
    url: (_H = $milk == null ? void 0 : $milk.site) == null ? void 0 : _H.vcf_file,
    icon: "/img/icon-socialmedia-vcard.svg",
    size: "25"
  }, {}, {})}` : ``}
			${((_I = $milk == null ? void 0 : $milk.site) == null ? void 0 : _I.calendar) != "" ? `${validate_component(SocialIcon, "SocialIcon").$$render($$result, {
    title: "Calendar",
    url: (_J = $milk == null ? void 0 : $milk.site) == null ? void 0 : _J.calendar,
    icon: "/img/icon-socialmedia-calendar.svg",
    size: "25"
  }, {}, {})}` : ``}
			${slots.default ? slots.default({}) : ``}</div></div>
</div>`;
});
var Block_Ratings_svelte = ".our-ratings.svelte-6ky0yj.svelte-6ky0yj{display:block;text-align:center}.our-ratings.svelte-6ky0yj.svelte-6ky0yj,.ratings-inner.svelte-6ky0yj.svelte-6ky0yj{padding:var(--padding-large)}.ratings-inner.svelte-6ky0yj.svelte-6ky0yj{margin:0 auto;max-width:var(--content-constrain);background:#f4f4f4;background:var(--background-offwhite,#f4f4f4)}h2.svelte-6ky0yj.svelte-6ky0yj,h3.svelte-6ky0yj.svelte-6ky0yj,p.svelte-6ky0yj.svelte-6ky0yj{color:#000;color:var(--color-black,#000)}h2.svelte-6ky0yj.svelte-6ky0yj{font-size:var(--extralarge-fontsize);margin-bottom:50px}h3.svelte-6ky0yj.svelte-6ky0yj{font-family:var(--font-main)}.rating.svelte-6ky0yj.svelte-6ky0yj{display:inline-block;vertical-align:middle;position:relative;border:4px solid #f4ba38;border:4px solid var(--color-yellow-vibrant,#f4ba38);width:150px;height:150px;margin:clamp(10px,4vw,40px);border-radius:75px;background:#fff;background:var(--background-white,#fff);transition:all .3s ease;transform-origin:center;transform:scale(1);color:var(--color-black)}.rating.svelte-6ky0yj.svelte-6ky0yj:hover{transform:scale(1.1)}.rating.svelte-6ky0yj a.svelte-6ky0yj{display:grid;align-content:center;justify-content:center;place-content:center;height:calc(100% - 12px);width:calc(100% - 12px);border:2px solid #f4ba38;border:2px solid var(--color-yellow-vibrant,#f4ba38);border-radius:75px;margin:6px;text-decoration:none;transition:all .3s ease;transform-origin:center;transform:scale(1);color:var(--color-black);font-family:var(--font-main)}.rating.svelte-6ky0yj:hover a.svelte-6ky0yj{transform:scale(1.1)}.rating.svelte-6ky0yj a h4.svelte-6ky0yj{font-size:13px;font-size:calc(var(--font-size-small, 15px) - 2px);line-height:13px;line-height:calc(var(--font-size-small, 15px) - 2px);text-transform:uppercase;margin-top:6px;margin-bottom:6px}.rating.svelte-6ky0yj a h4.svelte-6ky0yj,.rating.svelte-6ky0yj a h5.svelte-6ky0yj{font-family:var(--font-main);font-weight:700}.rating.svelte-6ky0yj a h5.svelte-6ky0yj{font-size:12px;font-size:calc(var(--font-size-small, 15px) - 3px);margin-top:-6px}@media screen and (min-width:650px){.our-ratings.svelte-6ky0yj .blurb.svelte-6ky0yj{margin:var(--padding);display:grid;grid-template-columns:1fr 2fr;text-align:left;-moz-column-gap:3em;grid-column-gap:3em;column-gap:3em}}@media screen and (max-width:480px){.our-ratings.svelte-6ky0yj.svelte-6ky0yj{padding:0}.rating.svelte-6ky0yj.svelte-6ky0yj{margin:5px}}";
const css$j = {
  code: ".our-ratings.svelte-6ky0yj.svelte-6ky0yj{display:block;text-align:center}.our-ratings.svelte-6ky0yj.svelte-6ky0yj,.ratings-inner.svelte-6ky0yj.svelte-6ky0yj{padding:var(--padding-large)}.ratings-inner.svelte-6ky0yj.svelte-6ky0yj{margin:0 auto;max-width:var(--content-constrain);background:#f4f4f4;background:var(--background-offwhite,#f4f4f4)}h2.svelte-6ky0yj.svelte-6ky0yj,h3.svelte-6ky0yj.svelte-6ky0yj,p.svelte-6ky0yj.svelte-6ky0yj{color:#000;color:var(--color-black,#000)}h2.svelte-6ky0yj.svelte-6ky0yj{font-size:var(--extralarge-fontsize);margin-bottom:50px}h3.svelte-6ky0yj.svelte-6ky0yj{font-family:var(--font-main)}.rating.svelte-6ky0yj.svelte-6ky0yj{display:inline-block;vertical-align:middle;position:relative;border:4px solid #f4ba38;border:4px solid var(--color-yellow-vibrant,#f4ba38);width:150px;height:150px;margin:clamp(10px,4vw,40px);border-radius:75px;background:#fff;background:var(--background-white,#fff);transition:all .3s ease;transform-origin:center;transform:scale(1);color:var(--color-black)}.rating.svelte-6ky0yj.svelte-6ky0yj:hover{transform:scale(1.1)}.rating.svelte-6ky0yj a.svelte-6ky0yj{display:grid;align-content:center;justify-content:center;place-content:center;height:calc(100% - 12px);width:calc(100% - 12px);border:2px solid #f4ba38;border:2px solid var(--color-yellow-vibrant,#f4ba38);border-radius:75px;margin:6px;text-decoration:none;transition:all .3s ease;transform-origin:center;transform:scale(1);color:var(--color-black);font-family:var(--font-main)}.rating.svelte-6ky0yj:hover a.svelte-6ky0yj{transform:scale(1.1)}.rating.svelte-6ky0yj a h4.svelte-6ky0yj{font-size:13px;font-size:calc(var(--font-size-small, 15px) - 2px);line-height:13px;line-height:calc(var(--font-size-small, 15px) - 2px);text-transform:uppercase;margin-top:6px;margin-bottom:6px}.rating.svelte-6ky0yj a h4.svelte-6ky0yj,.rating.svelte-6ky0yj a h5.svelte-6ky0yj{font-family:var(--font-main);font-weight:700}.rating.svelte-6ky0yj a h5.svelte-6ky0yj{font-size:12px;font-size:calc(var(--font-size-small, 15px) - 3px);margin-top:-6px}@media screen and (min-width:650px){.our-ratings.svelte-6ky0yj .blurb.svelte-6ky0yj{margin:var(--padding);display:grid;grid-template-columns:1fr 2fr;text-align:left;grid-column-gap:3em;-moz-column-gap:3em;column-gap:3em}}@media screen and (max-width:480px){.our-ratings.svelte-6ky0yj.svelte-6ky0yj{padding:0}.rating.svelte-6ky0yj.svelte-6ky0yj{margin:5px}}",
  map: `{"version":3,"file":"Block_Ratings.svelte","sources":["Block_Ratings.svelte"],"sourcesContent":["<div class=\\"our-ratings\\">\\n\\t<div class=\\"ratings-inner\\">\\n\\t\\t<h2>View Our Ratings</h2>\\n\\t\\t<div class=\\"blurb\\">\\n\\t\\t\\t<h3>Exceptional Service Has Earned Us Exceptional Recognition.</h3>\\n\\t\\t\\t<div class=\\"block-content\\">\\n\\t\\t\\t\\t<p>\\n\\t\\t\\t\\t\\tOur immigration law firm has earned the highest ratings in\\n\\t\\t\\t\\t\\tBest Lawyers in America, Super Lawyers, US News and World\\n\\t\\t\\t\\t\\tReport, Avvo, and Martindale-Hubbell.\\n\\t\\t\\t\\t</p>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t\\t<div class=\\"listing-grid ratings-listing\\">\\n\\t\\t\\t{#each ratings as rating}\\n\\t\\t\\t\\t<div class=\\"rating\\">\\n\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\thref={rating?.Ratings?.link}\\n\\t\\t\\t\\t\\t\\ttitle={\`\${rating?.title} - \${rating?.rating}\`}\\n\\t\\t\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\t\\t\\trel=\\"noopener\\"\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t<h4>{rating?.title}</h4>\\n\\t\\t\\t\\t\\t\\t<h5>{rating?.Ratings?.rating}</h5>\\n\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t{/each}\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<script>function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount, onDestroy } from 'svelte';\\n/* ## MILK ## */\\n\\nimport { milk } from '$milk/milk.js';\\n/* ## Variables ## */\\n\\nvar id;\\nvar blockstyle = '';\\nvar blockclass = 'our-ratings';\\n\\n$: blockclass = \\"our-ratings \\" + blockstyle;\\n/* ## Data Loading ## */\\n\\n\\nimport { preload_ratings } from '$graphql/sitespecific.preload.js';\\nvar ratings = preload_ratings;\\n\\nvar unsubscribe_ratings = () => {};\\n\\nimport { Q_GET_RATINGS } from '$graphql/sitespecific.graphql.js';\\n/* ## Main ## */\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  var _$milk, _$milk$data;\\n\\n  var queryVariables = {\\n    size: 12\\n  };\\n  var getRatings = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_RATINGS, $milk.data.sources.wordpress, queryVariables);\\n  unsubscribe_ratings = yield getRatings == null ? void 0 : getRatings.subscribe( /*#__PURE__*/function () {\\n    var _ref2 = _asyncToGenerator(function* (fetched_data) {\\n      var data = yield fetched_data; // console.log(data);\\n\\n      ratings = data.ratings.nodes;\\n    });\\n\\n    return function (_x) {\\n      return _ref2.apply(this, arguments);\\n    };\\n  }());\\n}));\\n/* ## Exit ## */\\n\\nonDestroy(() => {\\n  unsubscribe_ratings(); // important for garbage collection otherwise memory leak\\n});\\n/* ## Exports ## */\\n\\nexport { id, blockstyle };</script>\\n\\n<style>.our-ratings{display:block;text-align:center}.our-ratings,.ratings-inner{padding:var(--padding-large)}.ratings-inner{margin:0 auto;max-width:var(--content-constrain);background:#f4f4f4;background:var(--background-offwhite,#f4f4f4)}h2,h3,p{color:#000;color:var(--color-black,#000)}h2{font-size:var(--extralarge-fontsize);margin-bottom:50px}h3{font-family:var(--font-main)}.rating{display:inline-block;vertical-align:middle;position:relative;border:4px solid #f4ba38;border:4px solid var(--color-yellow-vibrant,#f4ba38);width:150px;height:150px;margin:clamp(10px,4vw,40px);border-radius:75px;background:#fff;background:var(--background-white,#fff);transition:all .3s ease;transform-origin:center;transform:scale(1);color:var(--color-black)}.rating:hover{transform:scale(1.1)}.rating a{display:grid;align-content:center;justify-content:center;place-content:center;height:calc(100% - 12px);width:calc(100% - 12px);border:2px solid #f4ba38;border:2px solid var(--color-yellow-vibrant,#f4ba38);border-radius:75px;margin:6px;text-decoration:none;transition:all .3s ease;transform-origin:center;transform:scale(1);color:var(--color-black);font-family:var(--font-main)}.rating:hover a{transform:scale(1.1)}.rating a h4{font-size:13px;font-size:calc(var(--font-size-small, 15px) - 2px);line-height:13px;line-height:calc(var(--font-size-small, 15px) - 2px);text-transform:uppercase;margin-top:6px;margin-bottom:6px}.rating a h4,.rating a h5{font-family:var(--font-main);font-weight:700}.rating a h5{font-size:12px;font-size:calc(var(--font-size-small, 15px) - 3px);margin-top:-6px}@media screen and (min-width:650px){.our-ratings .blurb{margin:var(--padding);display:grid;grid-template-columns:1fr 2fr;text-align:left;grid-column-gap:3em;-moz-column-gap:3em;column-gap:3em}}@media screen and (max-width:480px){.our-ratings{padding:0}.rating{margin:5px}}</style>\\n"],"names":[],"mappings":"AAsFO,wCAAY,CAAC,QAAQ,KAAK,CAAC,WAAW,MAAM,CAAC,wCAAY,CAAC,0CAAc,CAAC,QAAQ,IAAI,eAAe,CAAC,CAAC,0CAAc,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,IAAI,mBAAmB,CAAC,CAAC,WAAW,OAAO,CAAC,WAAW,IAAI,qBAAqB,CAAC,OAAO,CAAC,CAAC,8BAAE,CAAC,8BAAE,CAAC,6BAAC,CAAC,MAAM,IAAI,CAAC,MAAM,IAAI,aAAa,CAAC,IAAI,CAAC,CAAC,8BAAE,CAAC,UAAU,IAAI,qBAAqB,CAAC,CAAC,cAAc,IAAI,CAAC,8BAAE,CAAC,YAAY,IAAI,WAAW,CAAC,CAAC,mCAAO,CAAC,QAAQ,YAAY,CAAC,eAAe,MAAM,CAAC,SAAS,QAAQ,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,OAAO,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,IAAI,sBAAsB,CAAC,OAAO,CAAC,CAAC,MAAM,KAAK,CAAC,OAAO,KAAK,CAAC,OAAO,MAAM,IAAI,CAAC,GAAG,CAAC,IAAI,CAAC,CAAC,cAAc,IAAI,CAAC,WAAW,IAAI,CAAC,WAAW,IAAI,kBAAkB,CAAC,IAAI,CAAC,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,iBAAiB,MAAM,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,MAAM,IAAI,aAAa,CAAC,CAAC,mCAAO,MAAM,CAAC,UAAU,MAAM,GAAG,CAAC,CAAC,qBAAO,CAAC,eAAC,CAAC,QAAQ,IAAI,CAAC,cAAc,MAAM,CAAC,gBAAgB,MAAM,CAAC,cAAc,MAAM,CAAC,OAAO,KAAK,IAAI,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,MAAM,KAAK,IAAI,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,OAAO,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,IAAI,sBAAsB,CAAC,OAAO,CAAC,CAAC,cAAc,IAAI,CAAC,OAAO,GAAG,CAAC,gBAAgB,IAAI,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,iBAAiB,MAAM,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,MAAM,IAAI,aAAa,CAAC,CAAC,YAAY,IAAI,WAAW,CAAC,CAAC,qBAAO,MAAM,CAAC,eAAC,CAAC,UAAU,MAAM,GAAG,CAAC,CAAC,qBAAO,CAAC,CAAC,CAAC,gBAAE,CAAC,UAAU,IAAI,CAAC,UAAU,KAAK,IAAI,iBAAiB,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,YAAY,IAAI,CAAC,YAAY,KAAK,IAAI,iBAAiB,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,eAAe,SAAS,CAAC,WAAW,GAAG,CAAC,cAAc,GAAG,CAAC,qBAAO,CAAC,CAAC,CAAC,gBAAE,CAAC,qBAAO,CAAC,CAAC,CAAC,gBAAE,CAAC,YAAY,IAAI,WAAW,CAAC,CAAC,YAAY,GAAG,CAAC,qBAAO,CAAC,CAAC,CAAC,gBAAE,CAAC,UAAU,IAAI,CAAC,UAAU,KAAK,IAAI,iBAAiB,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,WAAW,IAAI,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,0BAAY,CAAC,oBAAM,CAAC,OAAO,IAAI,SAAS,CAAC,CAAC,QAAQ,IAAI,CAAC,sBAAsB,GAAG,CAAC,GAAG,CAAC,WAAW,IAAI,CAAC,gBAAgB,GAAG,CAAC,gBAAgB,GAAG,CAAC,WAAW,GAAG,CAAC,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,wCAAY,CAAC,QAAQ,CAAC,CAAC,mCAAO,CAAC,OAAO,GAAG,CAAC,CAAC"}`
};
function asyncGeneratorStep$j(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$j(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$j(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$j(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Block_Ratings = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var {id} = $$props;
  var {blockstyle = ""} = $$props;
  var ratings = preload_ratings;
  var unsubscribe_ratings = () => {
  };
  onMount(/* @__PURE__ */ _asyncToGenerator$j(function* () {
    var _$milk, _$milk$data;
    var queryVariables = {size: 12};
    var getRatings = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_RATINGS, $milk.data.sources.wordpress, queryVariables);
    unsubscribe_ratings = yield getRatings == null ? void 0 : getRatings.subscribe(/* @__PURE__ */ function() {
      var _ref2 = _asyncToGenerator$j(function* (fetched_data) {
        var data = yield fetched_data;
        ratings = data.ratings.nodes;
      });
      return function(_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  }));
  onDestroy(() => {
    unsubscribe_ratings();
  });
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  $$result.css.add(css$j);
  $$unsubscribe_milk();
  return `<div class="${"our-ratings svelte-6ky0yj"}"><div class="${"ratings-inner svelte-6ky0yj"}"><h2 class="${"svelte-6ky0yj"}">View Our Ratings</h2>
		<div class="${"blurb svelte-6ky0yj"}"><h3 class="${"svelte-6ky0yj"}">Exceptional Service Has Earned Us Exceptional Recognition.</h3>
			<div class="${"block-content"}"><p class="${"svelte-6ky0yj"}">Our immigration law firm has earned the highest ratings in
					Best Lawyers in America, Super Lawyers, US News and World
					Report, Avvo, and Martindale-Hubbell.
				</p></div></div>
		<div class="${"listing-grid ratings-listing"}">${each(ratings, (rating) => {
    var _a, _b;
    return `<div class="${"rating svelte-6ky0yj"}"><a${add_attribute("href", (_a = rating == null ? void 0 : rating.Ratings) == null ? void 0 : _a.link, 0)}${add_attribute("title", `${rating == null ? void 0 : rating.title} - ${rating == null ? void 0 : rating.rating}`, 0)} target="${"_blank"}" rel="${"noopener"}" class="${"svelte-6ky0yj"}"><h4 class="${"svelte-6ky0yj"}">${escape(rating == null ? void 0 : rating.title)}</h4>
						<h5 class="${"svelte-6ky0yj"}">${escape((_b = rating == null ? void 0 : rating.Ratings) == null ? void 0 : _b.rating)}</h5></a>
				</div>`;
  })}</div></div>
</div>`;
});
var description$7 = "Protecting The Rights of Immigrants Across America for a Quarter Century";
const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a;
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var _$milk, _$milk$site;
  var title = (_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.title;
  $$unsubscribe_milk();
  return `${validate_component(Head_Language, "Head_Language").$$render($$result, {lang: "en"}, {}, {})}
${validate_component(Head_HTML, "Head_HTML").$$render($$result, {
    title,
    description: description$7,
    keywords: (_a = $milk == null ? void 0 : $milk.site) == null ? void 0 : _a.keywords
  }, {}, {})}
${validate_component(Head_Facebook, "Head_Facebook").$$render($$result, {
    title,
    description: description$7,
    image: "/img/hero_homepage_01.jpg"
  }, {}, {})}
${validate_component(Head_Twitter, "Head_Twitter").$$render($$result, {
    title,
    description: description$7,
    image: "/img/hero_homepage_01.jpg"
  }, {}, {})}
${validate_component(Layout_Main, "Layout_Main").$$render($$result, {id: "page-homepage"}, {}, {
    default: () => `${validate_component(Hero, "Hero").$$render($$result, {
      id: "hero-home-01",
      image_url: "/img/hero_homepage_01.jpg",
      img_srcset: "/img/hero_homepage_01.jpg",
      avif_srcset: "/img/hero_homepage_01.avif",
      webp_srcset: "/img/hero_homepage_01.webp",
      title: "Harlan York and Associates",
      parallax: "false"
    }, {}, {
      default: () => `<h1>${escape(description$7)}</h1>
		${validate_component(ScrollTo, "ScrollTo").$$render($$result, {
        direction: "down",
        target: "#AfterMainHero"
      }, {}, {})}`
    })}
	${validate_component(Block_CallToAction, "Block_CallToAction").$$render($$result, {
      id: "call-to-action-02",
      blockstyle: "block-style01",
      extraclasses: "floating-calltoaction"
    }, {}, {})}
	<div id="${"AfterMainHero"}"></div>
	${validate_component(Block_Services, "Block_Services").$$render($$result, {id: "services", blockstyle: ""}, {}, {})}
	${validate_component(Block_Team, "Block_Team").$$render($$result, {id: "team", blockstyle: "block-style02"}, {}, {})}
	${validate_component(Hero, "Hero").$$render($$result, {
      id: "hero-home-02",
      image_url: "/img/hero_homepage_02_alt.jpg",
      img_srcset: "/img/hero_homepage_02_alt.jpg",
      avif_srcset: "/img/hero_homepage_02_alt.avif",
      webp_srcset: "/img/hero_homepage_02_alt.webp",
      title: "Working with Clients",
      parallax: "false"
    }, {}, {})}
	${validate_component(Block_Testimonials, "Block_Testimonials").$$render($$result, {
      id: "testimonials",
      blockstyle: "block-style05"
    }, {}, {})}
	${validate_component(Hero, "Hero").$$render($$result, {
      id: "hero-home-03",
      image_url: "/img/hero_homepage_03.jpg",
      img_srcset: "/img/hero_homepage_03.jpg",
      avif_srcset: "/img/hero_homepage_03.avif",
      webp_srcset: "/img/hero_homepage_03.webp",
      title: "Helping Clients",
      parallax: "false"
    }, {}, {})}
	<div style="${"background: #F4F4F4"}">${validate_component(Block_WP_BlogListingByCategory, "Block_WP_BlogListingByCategory").$$render($$result, {
      id: "featured-blogposts",
      blockstyle: "",
      blog_path: "/immigration-law-blog",
      category: "Featured",
      offset: "0",
      size: "2",
      pagination: "false"
    }, {}, {
      after: () => `<span slot="${"after"}"><a href="${"/immigration-law-blog"}" class="${"fancy-link"}" sveltekit:prefetch><span>View Our Blog</span></a></span>`,
      before: () => `<span slot="${"before"}"><h2>Read the Latest From</h2>
				<h2>The Immigration Law Blog</h2>
				<div class="${"block-content"}"><p>Harlan&#39;s blog has informative and practical advice, from
						getting a green card through marriage to detailed
						explanations of litigation, business immigration,
						citizenship, waivers and appeals.
					</p></div></span>`
    })}</div>
	${validate_component(Block_Featured, "Block_Featured").$$render($$result, {id: "featured", blockstyle: ""}, {}, {})}
	${validate_component(FeaturedVideo, "FeaturedVideo").$$render($$result, {
      id: "featured-video",
      blockstyle: "",
      video_source: "//player.vimeo.com/video/108146056",
      video_jpg: "/img/video_featured.jpg",
      video_webp: "/img/video_featured.webp",
      video_avif: "/img/video_featured.avif"
    }, {}, {})}
	${validate_component(SocialMedia, "SocialMedia").$$render($$result, {id: "socialmedia", blockstyle: ""}, {}, {})}
	${validate_component(Block_CallToAction, "Block_CallToAction").$$render($$result, {
      id: "call-to-action",
      blockstyle: "block-style01",
      extraclasses: "regular-calltoaction"
    }, {}, {})}
	${validate_component(Block_Ratings, "Block_Ratings").$$render($$result, {id: "ratings", blockstyle: ""}, {}, {})}`
  })}`;
});
var index$7 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: Routes
});
var Block_CallOutText_svelte = ".callouttext.svelte-1lm22wq{display:block;text-align:center}.callouttext-inner.svelte-1lm22wq{margin:0 auto;max-width:var(--content-constrain)}.callouttext-inner.svelte-1lm22wq,h2.svelte-1lm22wq{color:#fff;color:var(--color-white,#fff)}h2.svelte-1lm22wq{font-size:var(--extralarge-fontsize)}.callout-content.svelte-1lm22wq{text-align:left;color:#fff;color:var(--color-white,#fff);margin:0 calc(var(--padding-large)/2) -20px;font-style:italic;letter-spacing:.5px}";
const css$i = {
  code: ".callouttext.svelte-1lm22wq{display:block;text-align:center}.callouttext-inner.svelte-1lm22wq{margin:0 auto;max-width:var(--content-constrain)}.callouttext-inner.svelte-1lm22wq,h2.svelte-1lm22wq{color:#fff;color:var(--color-white,#fff)}h2.svelte-1lm22wq{font-size:var(--extralarge-fontsize)}.callout-content.svelte-1lm22wq{text-align:left;color:#fff;color:var(--color-white,#fff);margin:0 calc(var(--padding-large)/2) -20px;font-style:italic;letter-spacing:.5px}",
  map: `{"version":3,"file":"Block_CallOutText.svelte","sources":["Block_CallOutText.svelte"],"sourcesContent":["<div {id} class={blockclass}>\\n\\t<div class=\\"callouttext-inner\\">\\n\\t\\t<h2>{title}</h2>\\n\\t\\t<div class=\\"callout-content\\"><slot /></div>\\n\\t</div>\\n</div>\\n\\n<script>/* ## MILK ## */\\nimport { milk } from '$milk/milk.js';\\n/* ## Variables ## */\\n\\nvar id;\\nvar title = '';\\nvar blockstyle = '';\\nvar extraclasses = '';\\nvar blockclass = 'callouttext';\\n\\n$: blockclass = \\"callouttext \\" + blockstyle + \\" \\" + extraclasses;\\n/* ## Methods and Functions ## */\\n\\n\\nvar doCall = () => {\\n  var _window, _window$callingCard;\\n\\n  if ((_window = window) != null && (_window$callingCard = _window.callingCard) != null && _window$callingCard.show) {\\n    var _window2, _window2$callingCard;\\n\\n    (_window2 = window) == null ? void 0 : (_window2$callingCard = _window2.callingCard) == null ? void 0 : _window2$callingCard.show();\\n  }\\n};\\n\\nvar doEmail = () => {\\n  var _window3;\\n\\n  if ((_window3 = window) != null && _window3.location) {\\n    var _$milk, _$milk$site;\\n\\n    window.location = \\"mailto:\\" + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.email_address);\\n  }\\n};\\n\\nvar doCalendar = () => {\\n  var _window4, _window4$calendarCard;\\n\\n  if ((_window4 = window) != null && (_window4$calendarCard = _window4.calendarCard) != null && _window4$calendarCard.show) {\\n    var _window5, _window5$calendarCard;\\n\\n    (_window5 = window) == null ? void 0 : (_window5$calendarCard = _window5.calendarCard) == null ? void 0 : _window5$calendarCard.show();\\n  }\\n};\\n/* ## Exports ## */\\n\\n\\nexport { id, blockstyle, extraclasses, title };</script>\\n\\n<style>.callouttext{display:block;text-align:center}.callouttext-inner{margin:0 auto;max-width:var(--content-constrain)}.callouttext-inner,h2{color:#fff;color:var(--color-white,#fff)}h2{font-size:var(--extralarge-fontsize)}.callout-content{text-align:left;color:#fff;color:var(--color-white,#fff);margin:0 calc(var(--padding-large)/2) -20px;font-style:italic;letter-spacing:.5px}</style>\\n"],"names":[],"mappings":"AAuDO,2BAAY,CAAC,QAAQ,KAAK,CAAC,WAAW,MAAM,CAAC,iCAAkB,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,IAAI,mBAAmB,CAAC,CAAC,iCAAkB,CAAC,iBAAE,CAAC,MAAM,IAAI,CAAC,MAAM,IAAI,aAAa,CAAC,IAAI,CAAC,CAAC,iBAAE,CAAC,UAAU,IAAI,qBAAqB,CAAC,CAAC,+BAAgB,CAAC,WAAW,IAAI,CAAC,MAAM,IAAI,CAAC,MAAM,IAAI,aAAa,CAAC,IAAI,CAAC,CAAC,OAAO,CAAC,CAAC,KAAK,IAAI,eAAe,CAAC,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,WAAW,MAAM,CAAC,eAAe,IAAI,CAAC"}`
};
const Block_CallOutText = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => value);
  var {id} = $$props;
  var {title = ""} = $$props;
  var {blockstyle = ""} = $$props;
  var {extraclasses = ""} = $$props;
  var blockclass = "callouttext";
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  if ($$props.extraclasses === void 0 && $$bindings.extraclasses && extraclasses !== void 0)
    $$bindings.extraclasses(extraclasses);
  $$result.css.add(css$i);
  blockclass = "callouttext " + blockstyle + " " + extraclasses;
  $$unsubscribe_milk();
  return `<div${add_attribute("id", id, 0)} class="${escape(null_to_empty(blockclass)) + " svelte-1lm22wq"}"><div class="${"callouttext-inner svelte-1lm22wq"}"><h2 class="${"svelte-1lm22wq"}">${escape(title)}</h2>
		<div class="${"callout-content svelte-1lm22wq"}">${slots.default ? slots.default({}) : ``}</div></div>
</div>`;
});
const scrollToHash = () => {
  const elementId = window.location.hash.split("#").pop();
  if (elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView(true);
    }
  }
};
var Block_ServicesList_svelte = ".services.svelte-im579d.svelte-im579d{display:block;padding:50px 20px;padding:50px var(--padding-inner,20px);text-align:center}.services-inner.svelte-im579d.svelte-im579d{margin:0 auto;max-width:var(--content-constrain)}.service.svelte-im579d.svelte-im579d{background-color:#fff;display:inline-block;vertical-align:top;max-width:80%;height:auto;margin:clamp(10px,4vw,30px) auto;transition:all .3s ease;transform-origin:center;transform:scale(1);padding:0;position:relative;border-radius:0;border:0}.service.svelte-im579d.svelte-im579d:hover{transform:scale(1.1);background:rgba(0,0,0,.05)}.service.svelte-im579d h4.svelte-im579d{font-weight:700;text-transform:capitalize;font-family:var(--font-special);margin-bottom:0;color:var(--color-four);text-align:left}.service.svelte-im579d a.svelte-im579d{color:var(--color-white);font-weight:700}.service-content.svelte-im579d.svelte-im579d{text-align:center}.service-content.svelte-im579d>div.svelte-im579d{padding:2em 1em}.service-icon.svelte-im579d.svelte-im579d{background-color:var(--color-six);text-align:left;position:relative;padding:2em}.icon.svelte-im579d.svelte-im579d{width:50%;max-width:100px;height:auto;margin-bottom:20px}@media screen and (min-width:650px){.service.svelte-im579d.svelte-im579d{display:grid;grid-template-columns:35% calc(65% - 2em);-moz-column-gap:2em;grid-column-gap:2em;column-gap:2em}.service-content.svelte-im579d.svelte-im579d{text-align:left}}";
const css$h = {
  code: ".services.svelte-im579d.svelte-im579d{display:block;padding:50px 20px;padding:50px var(--padding-inner,20px);text-align:center}.services-inner.svelte-im579d.svelte-im579d{margin:0 auto;max-width:var(--content-constrain)}.service.svelte-im579d.svelte-im579d{background-color:#fff;display:inline-block;vertical-align:top;max-width:80%;height:auto;margin:clamp(10px,4vw,30px) auto;transition:all .3s ease;transform-origin:center;transform:scale(1);padding:0;position:relative;border-radius:0;border:0}.service.svelte-im579d.svelte-im579d:hover{transform:scale(1.1);background:rgba(0,0,0,.05)}.service.svelte-im579d h4.svelte-im579d{font-weight:700;text-transform:capitalize;font-family:var(--font-special);margin-bottom:0;color:var(--color-four);text-align:left}.service.svelte-im579d a.svelte-im579d{color:var(--color-white);font-weight:700}.service-content.svelte-im579d.svelte-im579d{text-align:center}.service-content.svelte-im579d>div.svelte-im579d{padding:2em 1em}.service-icon.svelte-im579d.svelte-im579d{background-color:var(--color-six);text-align:left;position:relative;padding:2em}.icon.svelte-im579d.svelte-im579d{width:50%;max-width:100px;height:auto;margin-bottom:20px}@media screen and (min-width:650px){.service.svelte-im579d.svelte-im579d{display:grid;grid-template-columns:35% calc(65% - 2em);grid-column-gap:2em;-moz-column-gap:2em;column-gap:2em}.service-content.svelte-im579d.svelte-im579d{text-align:left}}",
  map: `{"version":3,"file":"Block_ServicesList.svelte","sources":["Block_ServicesList.svelte"],"sourcesContent":["<div {id} class={blockclass}>\\n\\t<div class=\\"services-inner\\">\\n\\t\\t<div class=\\"services-list\\">\\n\\t\\t\\t{#each services as service}\\n\\t\\t\\t\\t<div class=\\"service\\" id={service?.slug}>\\n\\t\\t\\t\\t\\t<div class=\\"service-icon\\">\\n\\t\\t\\t\\t\\t\\t<h4>{service?.title}</h4>\\n\\t\\t\\t\\t\\t\\t<div class=\\"extra-buttons\\">\\n\\t\\t\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\t\\t\\thref=\\"immigration-law-services/{service?.slug}\\"\\n\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"read-more\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t>Read More\\n\\t\\t\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t<div class=\\"service-content\\">\\n\\t\\t\\t\\t\\t\\t<div>\\n\\t\\t\\t\\t\\t\\t\\t{@html cleanUp(service?.Services?.description)}\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t{/each}\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<script>function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount, onDestroy } from 'svelte';\\n/* ## MILK ## */\\n\\nimport { milk } from '$milk/milk.js';\\nimport { stripTags } from '$milk/util/helpers.js';\\nimport { scrollToHash } from '$milk/util/scroll.js';\\nvar id;\\nvar blockstyle = '';\\nvar blockclass = 'services';\\n\\n$: blockclass = \\"services \\" + blockstyle;\\n/* ## Data Loading ## */\\n\\n\\nimport { preload_services } from '$graphql/sitespecific.preload.js';\\nvar services = preload_services;\\n\\nvar unsubscribe_services = () => {};\\n\\nimport { Q_GET_SERVICES } from '$graphql/sitespecific.graphql.js';\\n/* ## Main ## */\\n\\nvar cleanUp = html => {\\n  return html.replace(/\\\\u00a0/g, ' ');\\n};\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  var _$milk, _$milk$data;\\n\\n  cleanUp = html => {\\n    return stripTags(html).replace(/\\\\u00a0/g, ' ');\\n  };\\n\\n  var queryVariables = {\\n    size: 999\\n  };\\n  var getServices = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_SERVICES, $milk.data.sources.wordpress, queryVariables);\\n  unsubscribe_services = yield getServices == null ? void 0 : getServices.subscribe( /*#__PURE__*/function () {\\n    var _ref2 = _asyncToGenerator(function* (fetched_data) {\\n      var data = yield fetched_data; // console.log(data);\\n\\n      services = data.services.nodes;\\n      setTimeout(scrollToHash, 1000);\\n    });\\n\\n    return function (_x) {\\n      return _ref2.apply(this, arguments);\\n    };\\n  }());\\n}));\\n/* ## Exit ## */\\n\\nonDestroy(() => {\\n  unsubscribe_services(); // important for garbage collection otherwise memory leak\\n});\\n/* ## Exports ## */\\n\\nexport { id, blockstyle };</script>\\n\\n<style>.services{display:block;padding:50px 20px;padding:50px var(--padding-inner,20px);text-align:center}.services-inner{margin:0 auto;max-width:var(--content-constrain)}.service{background-color:#fff;display:inline-block;vertical-align:top;max-width:80%;height:auto;margin:clamp(10px,4vw,30px) auto;transition:all .3s ease;transform-origin:center;transform:scale(1);padding:0;position:relative;border-radius:0;border:0}.service:hover{transform:scale(1.1);background:rgba(0,0,0,.05)}.service h4{font-weight:700;text-transform:capitalize;font-family:var(--font-special);margin-bottom:0;color:var(--color-four);text-align:left}.service p{font-size:14px;font-size:calc(var(--font-size-small, 15px) - 1px)}.service a{color:var(--color-white);font-weight:700}.service-content{text-align:center}.service-content>div{padding:2em 1em}.service-icon{background-color:var(--color-six);text-align:left;position:relative;padding:2em}.icon{width:50%;max-width:100px;height:auto;margin-bottom:20px}details{max-width:unset!important}summary{background:var(--color-white);color:var(--color-black);cursor:pointer;padding:.25rem 0;transition:all .3s ease;margin-top:-10px}.service:hover summary{background:#f2f2f2}.attorney:nth-child(2n) summary{background:var(--color-offwhite)}summary:before{content:\\"\\"}summary span{cursor:pointer;text-transform:uppercase;font-weight:700;display:inline-block;width:auto;position:relative}summary .less{display:none}details[open] summary .less{display:inline-block}details[open] summary .more{display:none}details .content{border:0}summary span:after{height:2px;background-color:transparent;position:absolute;content:\\"\\";width:0;margin:0 50%;display:block;bottom:0;left:0;transition:margin .5s,width .5s,opacity .5s,color .5s,background-color .5s}summary:hover span:after{margin:0 -10%;width:120%;opacity:1;background-color:var(--color-three)}@media screen and (min-width:650px){.service{display:grid;grid-template-columns:35% calc(65% - 2em);grid-column-gap:2em;-moz-column-gap:2em;column-gap:2em}.service-content{text-align:left}}</style>\\n"],"names":[],"mappings":"AA0FO,qCAAS,CAAC,QAAQ,KAAK,CAAC,QAAQ,IAAI,CAAC,IAAI,CAAC,QAAQ,IAAI,CAAC,IAAI,eAAe,CAAC,IAAI,CAAC,CAAC,WAAW,MAAM,CAAC,2CAAe,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,IAAI,mBAAmB,CAAC,CAAC,oCAAQ,CAAC,iBAAiB,IAAI,CAAC,QAAQ,YAAY,CAAC,eAAe,GAAG,CAAC,UAAU,GAAG,CAAC,OAAO,IAAI,CAAC,OAAO,MAAM,IAAI,CAAC,GAAG,CAAC,IAAI,CAAC,CAAC,IAAI,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,iBAAiB,MAAM,CAAC,UAAU,MAAM,CAAC,CAAC,CAAC,QAAQ,CAAC,CAAC,SAAS,QAAQ,CAAC,cAAc,CAAC,CAAC,OAAO,CAAC,CAAC,oCAAQ,MAAM,CAAC,UAAU,MAAM,GAAG,CAAC,CAAC,WAAW,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,sBAAQ,CAAC,gBAAE,CAAC,YAAY,GAAG,CAAC,eAAe,UAAU,CAAC,YAAY,IAAI,cAAc,CAAC,CAAC,cAAc,CAAC,CAAC,MAAM,IAAI,YAAY,CAAC,CAAC,WAAW,IAAI,CAAC,AAA6E,sBAAQ,CAAC,eAAC,CAAC,MAAM,IAAI,aAAa,CAAC,CAAC,YAAY,GAAG,CAAC,4CAAgB,CAAC,WAAW,MAAM,CAAC,8BAAgB,CAAC,iBAAG,CAAC,QAAQ,GAAG,CAAC,GAAG,CAAC,yCAAa,CAAC,iBAAiB,IAAI,WAAW,CAAC,CAAC,WAAW,IAAI,CAAC,SAAS,QAAQ,CAAC,QAAQ,GAAG,CAAC,iCAAK,CAAC,MAAM,GAAG,CAAC,UAAU,KAAK,CAAC,OAAO,IAAI,CAAC,cAAc,IAAI,CAAC,AAA22B,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,oCAAQ,CAAC,QAAQ,IAAI,CAAC,sBAAsB,GAAG,CAAC,KAAK,GAAG,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,gBAAgB,GAAG,CAAC,gBAAgB,GAAG,CAAC,WAAW,GAAG,CAAC,4CAAgB,CAAC,WAAW,IAAI,CAAC,CAAC"}`
};
function asyncGeneratorStep$i(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$i(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$i(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$i(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Block_ServicesList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var {id} = $$props;
  var {blockstyle = ""} = $$props;
  var blockclass = "services";
  var services = preload_services;
  var unsubscribe_services = () => {
  };
  var cleanUp = (html) => {
    return html.replace(/\u00a0/g, " ");
  };
  onMount(/* @__PURE__ */ _asyncToGenerator$i(function* () {
    var _$milk, _$milk$data;
    cleanUp = (html) => {
      return stripTags(html).replace(/\u00a0/g, " ");
    };
    var queryVariables = {size: 999};
    var getServices = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_SERVICES, $milk.data.sources.wordpress, queryVariables);
    unsubscribe_services = yield getServices == null ? void 0 : getServices.subscribe(/* @__PURE__ */ function() {
      var _ref2 = _asyncToGenerator$i(function* (fetched_data) {
        var data = yield fetched_data;
        services = data.services.nodes;
        setTimeout(scrollToHash, 1e3);
      });
      return function(_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  }));
  onDestroy(() => {
    unsubscribe_services();
  });
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  $$result.css.add(css$h);
  blockclass = "services " + blockstyle;
  $$unsubscribe_milk();
  return `<div${add_attribute("id", id, 0)} class="${escape(null_to_empty(blockclass)) + " svelte-im579d"}"><div class="${"services-inner svelte-im579d"}"><div class="${"services-list"}">${each(services, (service) => {
    var _a;
    return `<div class="${"service svelte-im579d"}"${add_attribute("id", service == null ? void 0 : service.slug, 0)}><div class="${"service-icon svelte-im579d"}"><h4 class="${"svelte-im579d"}">${escape(service == null ? void 0 : service.title)}</h4>
						<div class="${"extra-buttons"}"><a href="${"immigration-law-services/" + escape(service == null ? void 0 : service.slug)}" class="${"read-more svelte-im579d"}">Read More
							</a>
						</div></div>
					<div class="${"service-content svelte-im579d"}"><div class="${"svelte-im579d"}">${cleanUp((_a = service == null ? void 0 : service.Services) == null ? void 0 : _a.description)}
						</div></div>
				</div>`;
  })}</div></div>
</div>`;
});
var Block_eBook_svelte = ".ebooks.svelte-17j2ns0.svelte-17j2ns0{display:block;padding:0;text-align:center}@media screen and (min-width:650px){.ebooks.svelte-17j2ns0.svelte-17j2ns0{padding:50px 20px;padding:50px var(--padding-inner,20px)}}.ebooks-inner.svelte-17j2ns0.svelte-17j2ns0{margin:0 auto;max-width:var(--content-constrain)}.ebook.svelte-17j2ns0.svelte-17j2ns0{text-align:center;padding:25px;margin-bottom:2em}@media screen and (min-width:450px){.ebook.svelte-17j2ns0.svelte-17j2ns0{text-align:left;display:grid;-moz-column-gap:2em;grid-column-gap:2em;column-gap:2em;grid-template-columns:30% 60%}}.ebook-img.svelte-17j2ns0.svelte-17j2ns0{position:relative}.ebook-img.svelte-17j2ns0 img.svelte-17j2ns0{width:100%;height:auto;max-width:200px;margin-bottom:20px}.ebook-description.svelte-17j2ns0.svelte-17j2ns0{font-size:var(--small-fontsize);font-style:italic}h2.svelte-17j2ns0 a.svelte-17j2ns0:hover{text-decoration:none}.ebooks-list.svelte-17j2ns0.svelte-17j2ns0{margin:auto}@media screen and (min-width:650px){.ebooks-list.svelte-17j2ns0.svelte-17j2ns0{position:relative;z-index:200;max-width:700px;text-align:center}}";
const css$g = {
  code: ".ebooks.svelte-17j2ns0.svelte-17j2ns0{display:block;padding:0;text-align:center}@media screen and (min-width:650px){.ebooks.svelte-17j2ns0.svelte-17j2ns0{padding:50px 20px;padding:50px var(--padding-inner,20px)}}.ebooks-inner.svelte-17j2ns0.svelte-17j2ns0{margin:0 auto;max-width:var(--content-constrain)}.ebook.svelte-17j2ns0.svelte-17j2ns0{text-align:center;padding:25px;margin-bottom:2em}@media screen and (min-width:450px){.ebook.svelte-17j2ns0.svelte-17j2ns0{text-align:left;display:grid;grid-column-gap:2em;-moz-column-gap:2em;column-gap:2em;grid-template-columns:30% 60%}}.ebook-img.svelte-17j2ns0.svelte-17j2ns0{position:relative}.ebook-img.svelte-17j2ns0 img.svelte-17j2ns0{width:100%;height:auto;max-width:200px;margin-bottom:20px}.ebook-description.svelte-17j2ns0.svelte-17j2ns0{font-size:var(--small-fontsize);font-style:italic}h2.svelte-17j2ns0 a.svelte-17j2ns0:hover{text-decoration:none}.ebooks-list.svelte-17j2ns0.svelte-17j2ns0{margin:auto}@media screen and (min-width:650px){.ebooks-list.svelte-17j2ns0.svelte-17j2ns0{position:relative;z-index:200;max-width:700px;text-align:center}}",
  map: `{"version":3,"file":"Block_eBook.svelte","sources":["Block_eBook.svelte"],"sourcesContent":["<div {id} class={blockclass}>\\n\\t<div class=\\"ebooks-inner\\">\\n\\t\\t<div class=\\"ebooks-list\\">\\n\\t\\t\\t{#each ebooks as ebook}\\n\\t\\t\\t\\t<div id={ebook?.slug} class=\\"ebook block-style04\\">\\n\\t\\t\\t\\t\\t<div class=\\"ebook-img\\">\\n\\t\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\t\\thref={ebook?.eBook?.pdf?.mediaItemUrl}\\n\\t\\t\\t\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\t\\t\\t\\ttitle=\\"Read eBook\\"\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t<picture>\\n\\t\\t\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"image/avif\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tsrcset={ebook?.eBook?.avifImage?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"image/webp\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tsrcset={ebook?.eBook?.webpImage?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tsrc={ebook?.eBook?.pngImage?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\talt={ebook?.title}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\twidth=\\"200\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\theight=\\"275\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t</picture>\\n\\t\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t<div class=\\"ebook-content\\">\\n\\t\\t\\t\\t\\t\\t<h2>\\n\\t\\t\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\t\\t\\thref={ebook?.eBook?.pdf?.mediaItemUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\t\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\t\\t\\t\\t\\ttitle=\\"Read eBook\\"\\n\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t{ebook?.title}\\n\\t\\t\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t\\t\\t</h2>\\n\\t\\t\\t\\t\\t\\t<div class=\\"ebook-description\\">\\n\\t\\t\\t\\t\\t\\t\\t{cleanUp(ebook?.eBook?.shortDescription)}\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t<div>\\n\\t\\t\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\t\\t\\thref={ebook?.eBook?.pdf?.mediaItemUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\t\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"fancy-link\\"\\n\\t\\t\\t\\t\\t\\t\\t\\ttitle=\\"Read eBook\\"\\n\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t<span> Download The FREE eBook </span>\\n\\t\\t\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t{/each}\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<script>function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount, onDestroy } from 'svelte';\\n/* ## MILK ## */\\n\\nimport { milk } from '$milk/milk.js';\\nimport { stripTags } from '$milk/util/helpers.js';\\nvar id;\\nvar wpid;\\nvar blockstyle = '';\\nvar blockclass = 'ebooks';\\n\\n$: blockclass = \\"ebooks \\" + blockstyle;\\n/* ## Data Loading ## */\\n\\n\\nvar ebooks = [];\\n\\nvar unsubscribe_ebooks = () => {};\\n\\nimport { Q_GET_EBOOKBYID } from '$graphql/sitespecific.graphql.js';\\n/* ## Main ## */\\n\\nvar cleanUp = html => {\\n  return html.replace(/\\\\u00a0/g, ' ');\\n};\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  var _$milk, _$milk$data;\\n\\n  cleanUp = html => {\\n    return stripTags(html).replace(/\\\\u00a0/g, ' ');\\n  };\\n\\n  var queryVariables = {\\n    id: wpid\\n  };\\n  var getEBooks = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_EBOOKBYID, $milk.data.sources.wordpress, queryVariables);\\n  unsubscribe_ebooks = yield getEBooks == null ? void 0 : getEBooks.subscribe( /*#__PURE__*/function () {\\n    var _ref2 = _asyncToGenerator(function* (fetched_data) {\\n      var data = yield fetched_data;\\n      console.log(data);\\n      ebooks = [data.eBookBy];\\n    });\\n\\n    return function (_x) {\\n      return _ref2.apply(this, arguments);\\n    };\\n  }());\\n}));\\n/* ## Exit ## */\\n\\nonDestroy(() => {\\n  unsubscribe_ebooks(); // important for garbage collection otherwise memory leak\\n});\\n/* ## Exports ## */\\n\\nexport { id, blockstyle, wpid };</script>\\n\\n<style>.ebooks{display:block;padding:0;text-align:center}@media screen and (min-width:650px){.ebooks{padding:50px 20px;padding:50px var(--padding-inner,20px)}}.ebooks-inner{margin:0 auto;max-width:var(--content-constrain)}.ebook{text-align:center;padding:25px;margin-bottom:2em}@media screen and (min-width:450px){.ebook{text-align:left;display:grid;grid-column-gap:2em;-moz-column-gap:2em;column-gap:2em;grid-template-columns:30% 60%}}.ebook-img{position:relative}.ebook-img img{width:100%;height:auto;max-width:200px;margin-bottom:20px}.ebook-description{font-size:var(--small-fontsize);font-style:italic}h2 a:hover{text-decoration:none}.ebooks-list{margin:auto}@media screen and (min-width:650px){.ebooks-list{position:relative;z-index:200;max-width:700px;text-align:center}}</style>\\n"],"names":[],"mappings":"AA6HO,qCAAO,CAAC,QAAQ,KAAK,CAAC,QAAQ,CAAC,CAAC,WAAW,MAAM,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,qCAAO,CAAC,QAAQ,IAAI,CAAC,IAAI,CAAC,QAAQ,IAAI,CAAC,IAAI,eAAe,CAAC,IAAI,CAAC,CAAC,CAAC,2CAAa,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,IAAI,mBAAmB,CAAC,CAAC,oCAAM,CAAC,WAAW,MAAM,CAAC,QAAQ,IAAI,CAAC,cAAc,GAAG,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,oCAAM,CAAC,WAAW,IAAI,CAAC,QAAQ,IAAI,CAAC,gBAAgB,GAAG,CAAC,gBAAgB,GAAG,CAAC,WAAW,GAAG,CAAC,sBAAsB,GAAG,CAAC,GAAG,CAAC,CAAC,wCAAU,CAAC,SAAS,QAAQ,CAAC,yBAAU,CAAC,kBAAG,CAAC,MAAM,IAAI,CAAC,OAAO,IAAI,CAAC,UAAU,KAAK,CAAC,cAAc,IAAI,CAAC,gDAAkB,CAAC,UAAU,IAAI,gBAAgB,CAAC,CAAC,WAAW,MAAM,CAAC,iBAAE,CAAC,gBAAC,MAAM,CAAC,gBAAgB,IAAI,CAAC,0CAAY,CAAC,OAAO,IAAI,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,0CAAY,CAAC,SAAS,QAAQ,CAAC,QAAQ,GAAG,CAAC,UAAU,KAAK,CAAC,WAAW,MAAM,CAAC,CAAC"}`
};
function asyncGeneratorStep$h(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$h(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$h(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$h(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Block_eBook = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var {id} = $$props;
  var {wpid} = $$props;
  var {blockstyle = ""} = $$props;
  var blockclass = "ebooks";
  var ebooks = [];
  var unsubscribe_ebooks = () => {
  };
  var cleanUp = (html) => {
    return html.replace(/\u00a0/g, " ");
  };
  onMount(/* @__PURE__ */ _asyncToGenerator$h(function* () {
    var _$milk, _$milk$data;
    cleanUp = (html) => {
      return stripTags(html).replace(/\u00a0/g, " ");
    };
    var queryVariables = {id: wpid};
    var getEBooks = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_EBOOKBYID, $milk.data.sources.wordpress, queryVariables);
    unsubscribe_ebooks = yield getEBooks == null ? void 0 : getEBooks.subscribe(/* @__PURE__ */ function() {
      var _ref2 = _asyncToGenerator$h(function* (fetched_data) {
        var data = yield fetched_data;
        console.log(data);
        ebooks = [data.eBookBy];
      });
      return function(_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  }));
  onDestroy(() => {
    unsubscribe_ebooks();
  });
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.wpid === void 0 && $$bindings.wpid && wpid !== void 0)
    $$bindings.wpid(wpid);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  $$result.css.add(css$g);
  blockclass = "ebooks " + blockstyle;
  $$unsubscribe_milk();
  return `<div${add_attribute("id", id, 0)} class="${escape(null_to_empty(blockclass)) + " svelte-17j2ns0"}"><div class="${"ebooks-inner svelte-17j2ns0"}"><div class="${"ebooks-list svelte-17j2ns0"}">${each(ebooks, (ebook) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
    return `<div${add_attribute("id", ebook == null ? void 0 : ebook.slug, 0)} class="${"ebook block-style04 svelte-17j2ns0"}"><div class="${"ebook-img svelte-17j2ns0"}"><a${add_attribute("href", (_b = (_a = ebook == null ? void 0 : ebook.eBook) == null ? void 0 : _a.pdf) == null ? void 0 : _b.mediaItemUrl, 0)} target="${"_blank"}" rel="${"noreferrer"}" title="${"Read eBook"}"><picture><source type="${"image/avif"}"${add_attribute("srcset", (_d = (_c = ebook == null ? void 0 : ebook.eBook) == null ? void 0 : _c.avifImage) == null ? void 0 : _d.sourceUrl, 0)}>
								<source type="${"image/webp"}"${add_attribute("srcset", (_f = (_e = ebook == null ? void 0 : ebook.eBook) == null ? void 0 : _e.webpImage) == null ? void 0 : _f.sourceUrl, 0)}>
								<img${add_attribute("src", (_h = (_g = ebook == null ? void 0 : ebook.eBook) == null ? void 0 : _g.pngImage) == null ? void 0 : _h.sourceUrl, 0)}${add_attribute("alt", ebook == null ? void 0 : ebook.title, 0)} loading="${"lazy"}" width="${"200"}" height="${"275"}" class="${"svelte-17j2ns0"}"></picture>
						</a></div>
					<div class="${"ebook-content"}"><h2 class="${"svelte-17j2ns0"}"><a${add_attribute("href", (_j = (_i = ebook == null ? void 0 : ebook.eBook) == null ? void 0 : _i.pdf) == null ? void 0 : _j.mediaItemUrl, 0)} target="${"_blank"}" rel="${"noreferrer"}" title="${"Read eBook"}" class="${"svelte-17j2ns0"}">${escape(ebook == null ? void 0 : ebook.title)}
							</a></h2>
						<div class="${"ebook-description svelte-17j2ns0"}">${escape(cleanUp((_k = ebook == null ? void 0 : ebook.eBook) == null ? void 0 : _k.shortDescription))}</div>
						<div><a${add_attribute("href", (_m = (_l = ebook == null ? void 0 : ebook.eBook) == null ? void 0 : _l.pdf) == null ? void 0 : _m.mediaItemUrl, 0)} target="${"_blank"}" rel="${"noreferrer"}" class="${"fancy-link"}" title="${"Read eBook"}"><span>Download The FREE eBook </span></a>
						</div></div>
				</div>`;
  })}</div></div>
</div>`;
});
var Block_LanguagesWeSpeak_svelte = ".content-inner.svelte-1ngslob{margin:0 auto;max-width:var(--content-constrain)}.languages-we-speak.svelte-1ngslob{padding:calc(var(--padding)*3) var(--padding-large) calc(var(--padding)*2);text-align:left;margin:auto;background:var(--color-white)}h2.svelte-1ngslob{text-align:left}@media screen and (min-width:650px){.languages-we-speak.svelte-1ngslob{position:relative;z-index:200;max-width:700px;text-align:center}}";
const css$f = {
  code: ".content-inner.svelte-1ngslob{margin:0 auto;max-width:var(--content-constrain)}.languages-we-speak.svelte-1ngslob{padding:calc(var(--padding)*3) var(--padding-large) calc(var(--padding)*2);text-align:left;margin:auto;background:var(--color-white)}h2.svelte-1ngslob{text-align:left}@media screen and (min-width:650px){.languages-we-speak.svelte-1ngslob{position:relative;z-index:200;max-width:700px;text-align:center}}",
  map: '{"version":3,"file":"Block_LanguagesWeSpeak.svelte","sources":["Block_LanguagesWeSpeak.svelte"],"sourcesContent":["<div class=\\"content\\">\\n\\t<div class=\\"content-inner\\">\\n\\t\\t<div class=\\"languages-we-speak\\">\\n\\t\\t\\t<h2>SE HABLA ESPA\xD1OL</h2>\\n\\t\\t\\t<h2>N\xD3S FALAMOS PORTUGU\xCAS</h2>\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<style>.content-inner{margin:0 auto;max-width:var(--content-constrain)}.languages-we-speak{padding:calc(var(--padding)*3) var(--padding-large) calc(var(--padding)*2);text-align:left;margin:auto;background:var(--color-white)}h2{text-align:left}h2.rtl{text-align:right}@media screen and (min-width:650px){.languages-we-speak{position:relative;z-index:200;max-width:700px;text-align:center}}</style>\\n"],"names":[],"mappings":"AASO,6BAAc,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,IAAI,mBAAmB,CAAC,CAAC,kCAAmB,CAAC,QAAQ,KAAK,IAAI,SAAS,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,eAAe,CAAC,CAAC,KAAK,IAAI,SAAS,CAAC,CAAC,CAAC,CAAC,CAAC,WAAW,IAAI,CAAC,OAAO,IAAI,CAAC,WAAW,IAAI,aAAa,CAAC,CAAC,iBAAE,CAAC,WAAW,IAAI,CAAC,AAAwB,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,kCAAmB,CAAC,SAAS,QAAQ,CAAC,QAAQ,GAAG,CAAC,UAAU,KAAK,CAAC,WAAW,MAAM,CAAC,CAAC"}'
};
const Block_LanguagesWeSpeak = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$f);
  return `<div class="${"content"}"><div class="${"content-inner svelte-1ngslob"}"><div class="${"languages-we-speak svelte-1ngslob"}"><h2 class="${"svelte-1ngslob"}">SE HABLA ESPA\xD1OL</h2>
			<h2 class="${"svelte-1ngslob"}">N\xD3S FALAMOS PORTUGU\xCAS</h2></div></div>
</div>`;
});
var Block_FAQs_svelte = 'h2.svelte-crneov.svelte-crneov{font-size:var(--extralarge-fontsize)}.faqs.svelte-crneov.svelte-crneov{display:block;padding:50px 20px 0;padding:50px var(--padding-inner,20px) 0;text-align:center}.faqs-inner.svelte-crneov.svelte-crneov{margin:0 auto;max-width:var(--content-constrain);background:var(--color-offwhite);padding:calc(var(--padding)*2) 0}.faqs-list.svelte-crneov.svelte-crneov{position:relative;font-size:0}.faq.svelte-crneov.svelte-crneov,.faqs-list.svelte-crneov.svelte-crneov{margin:var(--padding)}.faq.svelte-crneov.svelte-crneov{text-align:left}@media screen and (min-width:650px){.faq.svelte-crneov.svelte-crneov{display:inline-block;vertical-align:top;width:calc(49% - var(--padding)*3/2);font-size:var(--base-fontsize)}}details.svelte-crneov.svelte-crneov{max-width:unset!important}summary.svelte-crneov.svelte-crneov{background:var(--color-offwhite);color:var(--color-black);cursor:pointer;padding:1rem 0;z-index:99}summary.svelte-crneov.svelte-crneov:before{content:""}summary.svelte-crneov span.svelte-crneov{cursor:pointer;text-transform:uppercase;font-weight:700;display:inline-block;width:auto;position:relative}details.svelte-crneov .content.svelte-crneov{border:0}summary.svelte-crneov span.svelte-crneov:after{height:2px;background-color:transparent;position:absolute;content:"";width:0;margin:0 50%;display:block;bottom:0;left:0;transition:margin .5s,width .5s,opacity .5s,color .5s,background-color .5s}details.svelte-crneov summary.svelte-crneov{padding-left:4rem;padding-right:1rem}details.svelte-crneov summary.svelte-crneov:before{content:"\xD7";color:#000;font-size:4rem;line-height:1rem;transform:rotate(-45deg);top:1.2rem;left:.6rem}details[open].svelte-crneov>summary.svelte-crneov:before{transform:rotate(90deg);color:red!important;transition:color 2s ease,transform 1s ease}';
const css$e = {
  code: 'h2.svelte-crneov.svelte-crneov{font-size:var(--extralarge-fontsize)}.faqs.svelte-crneov.svelte-crneov{display:block;padding:50px 20px 0;padding:50px var(--padding-inner,20px) 0;text-align:center}.faqs-inner.svelte-crneov.svelte-crneov{margin:0 auto;max-width:var(--content-constrain);background:var(--color-offwhite);padding:calc(var(--padding)*2) 0}.faqs-list.svelte-crneov.svelte-crneov{position:relative;font-size:0}.faq.svelte-crneov.svelte-crneov,.faqs-list.svelte-crneov.svelte-crneov{margin:var(--padding)}.faq.svelte-crneov.svelte-crneov{text-align:left}@media screen and (min-width:650px){.faq.svelte-crneov.svelte-crneov{display:inline-block;vertical-align:top;width:calc(49% - var(--padding)*3/2);font-size:var(--base-fontsize)}}details.svelte-crneov.svelte-crneov{max-width:unset!important}summary.svelte-crneov.svelte-crneov{background:var(--color-offwhite);color:var(--color-black);cursor:pointer;padding:1rem 0;z-index:99}summary.svelte-crneov.svelte-crneov:before{content:""}summary.svelte-crneov span.svelte-crneov{cursor:pointer;text-transform:uppercase;font-weight:700;display:inline-block;width:auto;position:relative}details.svelte-crneov .content.svelte-crneov{border:0}summary.svelte-crneov span.svelte-crneov:after{height:2px;background-color:transparent;position:absolute;content:"";width:0;margin:0 50%;display:block;bottom:0;left:0;transition:margin .5s,width .5s,opacity .5s,color .5s,background-color .5s}details.svelte-crneov summary.svelte-crneov{padding-left:4rem;padding-right:1rem}details.svelte-crneov summary.svelte-crneov:before{content:"\xD7";color:#000;font-size:4rem;line-height:1rem;transform:rotate(-45deg);top:1.2rem;left:.6rem}details[open].svelte-crneov>summary.svelte-crneov:before{transform:rotate(90deg);color:red!important;transition:color 2s ease,transform 1s ease}',
  map: `{"version":3,"file":"Block_FAQs.svelte","sources":["Block_FAQs.svelte"],"sourcesContent":["<div {id} class={blockclass}>\\n\\t<div class=\\"faqs-inner\\">\\n\\t\\t<h2>Frequently Asked Questions</h2>\\n\\t\\t<p>\\n\\t\\t\\tLoren Ipsum Dolor Sit Amet, Consetetur Sadipschin Elitr, Sed Diam\\n\\t\\t\\tNonumy Eirmod.\\n\\t\\t</p>\\n\\t\\t<div class=\\"faq-list\\">\\n\\t\\t\\t{#each faqs as faq}\\n\\t\\t\\t\\t<div class=\\"faq\\" id={faq?.slug}>\\n\\t\\t\\t\\t\\t<details>\\n\\t\\t\\t\\t\\t\\t<summary>\\n\\t\\t\\t\\t\\t\\t\\t<span>{faq?.title}</span>\\n\\t\\t\\t\\t\\t\\t</summary>\\n\\t\\t\\t\\t\\t\\t<div class=\\"content\\">\\n\\t\\t\\t\\t\\t\\t\\t{@html faq?.FAQ?.answer}\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t</details>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t{/each}\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<script>function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount, onDestroy } from 'svelte';\\n/* ## MILK ## */\\n\\nimport { milk } from '$milk/milk.js';\\nvar id;\\nvar blockstyle = '';\\nvar blockclass = 'faqs';\\n\\n$: blockclass = \\"faqs \\" + blockstyle;\\n/* ## Data Loading ## */\\n\\n\\nimport { preload_faqs } from '$graphql/sitespecific.preload.js';\\nvar faqs = preload_faqs;\\n\\nvar unsubscribe_faqs = () => {};\\n\\nimport { Q_GET_FAQS } from '$graphql/sitespecific.graphql.js';\\n/* ## Main ## */\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  var _$milk, _$milk$data;\\n\\n  var queryVariables = {\\n    size: 99\\n  };\\n  var getFAQs = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_FAQS, $milk.data.sources.wordpress, queryVariables);\\n  unsubscribe_faqs = yield getFAQs == null ? void 0 : getFAQs.subscribe( /*#__PURE__*/function () {\\n    var _ref2 = _asyncToGenerator(function* (fetched_data) {\\n      var data = yield fetched_data; // console.log(data);\\n\\n      faqs = data.fAQs.nodes;\\n      console.log(faqs);\\n    });\\n\\n    return function (_x) {\\n      return _ref2.apply(this, arguments);\\n    };\\n  }());\\n}));\\n/* ## Exit ## */\\n\\nonDestroy(() => {\\n  unsubscribe_faqs(); // important for garbage collection otherwise memory leak\\n});\\n/* ## Exports ## */\\n\\nexport { id, blockstyle };</script>\\n\\n<style>h2{font-size:var(--extralarge-fontsize)}.faqs{display:block;padding:50px 20px 0;padding:50px var(--padding-inner,20px) 0;text-align:center}.faqs-inner{margin:0 auto;max-width:var(--content-constrain);background:var(--color-offwhite);padding:calc(var(--padding)*2) 0}.faqs-list{position:relative;font-size:0}.faq,.faqs-list{margin:var(--padding)}.faq{text-align:left}@media screen and (min-width:650px){.faq{display:inline-block;vertical-align:top;width:calc(49% - var(--padding)*3/2);font-size:var(--base-fontsize)}}details{max-width:unset!important}summary{background:var(--color-offwhite);color:var(--color-black);cursor:pointer;padding:1rem 0;z-index:99}summary:before{content:\\"\\"}summary span{cursor:pointer;text-transform:uppercase;font-weight:700;display:inline-block;width:auto;position:relative}details .content{border:0}summary span:after{height:2px;background-color:transparent;position:absolute;content:\\"\\";width:0;margin:0 50%;display:block;bottom:0;left:0;transition:margin .5s,width .5s,opacity .5s,color .5s,background-color .5s}details summary{padding-left:4rem;padding-right:1rem}details summary:before{content:\\"\xD7\\";color:#000;font-size:4rem;line-height:1rem;transform:rotate(-45deg);top:1.2rem;left:.6rem}details[open]>summary:before{transform:rotate(90deg);color:red!important;transition:color 2s ease,transform 1s ease}</style>\\n"],"names":[],"mappings":"AA8EO,8BAAE,CAAC,UAAU,IAAI,qBAAqB,CAAC,CAAC,iCAAK,CAAC,QAAQ,KAAK,CAAC,QAAQ,IAAI,CAAC,IAAI,CAAC,CAAC,CAAC,QAAQ,IAAI,CAAC,IAAI,eAAe,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,WAAW,MAAM,CAAC,uCAAW,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,IAAI,mBAAmB,CAAC,CAAC,WAAW,IAAI,gBAAgB,CAAC,CAAC,QAAQ,KAAK,IAAI,SAAS,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,sCAAU,CAAC,SAAS,QAAQ,CAAC,UAAU,CAAC,CAAC,gCAAI,CAAC,sCAAU,CAAC,OAAO,IAAI,SAAS,CAAC,CAAC,gCAAI,CAAC,WAAW,IAAI,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,gCAAI,CAAC,QAAQ,YAAY,CAAC,eAAe,GAAG,CAAC,MAAM,KAAK,GAAG,CAAC,CAAC,CAAC,IAAI,SAAS,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,UAAU,IAAI,eAAe,CAAC,CAAC,CAAC,mCAAO,CAAC,UAAU,KAAK,UAAU,CAAC,mCAAO,CAAC,WAAW,IAAI,gBAAgB,CAAC,CAAC,MAAM,IAAI,aAAa,CAAC,CAAC,OAAO,OAAO,CAAC,QAAQ,IAAI,CAAC,CAAC,CAAC,QAAQ,EAAE,CAAC,mCAAO,OAAO,CAAC,QAAQ,EAAE,CAAC,qBAAO,CAAC,kBAAI,CAAC,OAAO,OAAO,CAAC,eAAe,SAAS,CAAC,YAAY,GAAG,CAAC,QAAQ,YAAY,CAAC,MAAM,IAAI,CAAC,SAAS,QAAQ,CAAC,qBAAO,CAAC,sBAAQ,CAAC,OAAO,CAAC,CAAC,qBAAO,CAAC,kBAAI,MAAM,CAAC,OAAO,GAAG,CAAC,iBAAiB,WAAW,CAAC,SAAS,QAAQ,CAAC,QAAQ,EAAE,CAAC,MAAM,CAAC,CAAC,OAAO,CAAC,CAAC,GAAG,CAAC,QAAQ,KAAK,CAAC,OAAO,CAAC,CAAC,KAAK,CAAC,CAAC,WAAW,MAAM,CAAC,GAAG,CAAC,KAAK,CAAC,GAAG,CAAC,OAAO,CAAC,GAAG,CAAC,KAAK,CAAC,GAAG,CAAC,gBAAgB,CAAC,GAAG,CAAC,qBAAO,CAAC,qBAAO,CAAC,aAAa,IAAI,CAAC,cAAc,IAAI,CAAC,qBAAO,CAAC,qBAAO,OAAO,CAAC,QAAQ,GAAG,CAAC,MAAM,IAAI,CAAC,UAAU,IAAI,CAAC,YAAY,IAAI,CAAC,UAAU,OAAO,MAAM,CAAC,CAAC,IAAI,MAAM,CAAC,KAAK,KAAK,CAAC,OAAO,CAAC,IAAI,eAAC,CAAC,qBAAO,OAAO,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC,MAAM,GAAG,UAAU,CAAC,WAAW,KAAK,CAAC,EAAE,CAAC,IAAI,CAAC,SAAS,CAAC,EAAE,CAAC,IAAI,CAAC"}`
};
function asyncGeneratorStep$g(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$g(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$g(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$g(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Block_FAQs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var {id} = $$props;
  var {blockstyle = ""} = $$props;
  var blockclass = "faqs";
  var faqs = preload_faqs;
  var unsubscribe_faqs = () => {
  };
  onMount(/* @__PURE__ */ _asyncToGenerator$g(function* () {
    var _$milk, _$milk$data;
    var queryVariables = {size: 99};
    var getFAQs = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_FAQS, $milk.data.sources.wordpress, queryVariables);
    unsubscribe_faqs = yield getFAQs == null ? void 0 : getFAQs.subscribe(/* @__PURE__ */ function() {
      var _ref2 = _asyncToGenerator$g(function* (fetched_data) {
        var data = yield fetched_data;
        faqs = data.fAQs.nodes;
        console.log(faqs);
      });
      return function(_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  }));
  onDestroy(() => {
    unsubscribe_faqs();
  });
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  $$result.css.add(css$e);
  blockclass = "faqs " + blockstyle;
  $$unsubscribe_milk();
  return `<div${add_attribute("id", id, 0)} class="${escape(null_to_empty(blockclass)) + " svelte-crneov"}"><div class="${"faqs-inner svelte-crneov"}"><h2 class="${"svelte-crneov"}">Frequently Asked Questions</h2>
		<p>Loren Ipsum Dolor Sit Amet, Consetetur Sadipschin Elitr, Sed Diam
			Nonumy Eirmod.
		</p>
		<div class="${"faq-list"}">${each(faqs, (faq) => {
    var _a;
    return `<div class="${"faq svelte-crneov"}"${add_attribute("id", faq == null ? void 0 : faq.slug, 0)}><details class="${"svelte-crneov"}"><summary class="${"svelte-crneov"}"><span class="${"svelte-crneov"}">${escape(faq == null ? void 0 : faq.title)}</span></summary>
						<div class="${"content svelte-crneov"}">${(_a = faq == null ? void 0 : faq.FAQ) == null ? void 0 : _a.answer}
						</div></details>
				</div>`;
  })}</div></div>
</div>`;
});
var index_svelte$4 = ".content.svelte-176w53d.svelte-176w53d{text-align:center}.title.svelte-176w53d.svelte-176w53d{position:relative;margin-bottom:-100px}.service-area.svelte-176w53d.svelte-176w53d{text-align:center}.service-area.svelte-176w53d p.svelte-176w53d{text-align:left;max-width:800px;font-style:italic;color:#666;margin:auto auto 45px}";
const css$d = {
  code: ".content.svelte-176w53d.svelte-176w53d{text-align:center}.title.svelte-176w53d.svelte-176w53d{position:relative;margin-bottom:-100px}.service-area.svelte-176w53d.svelte-176w53d{text-align:center}.service-area.svelte-176w53d p.svelte-176w53d{text-align:left;max-width:800px;font-style:italic;color:#666;margin:auto auto 45px}",
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<Head_Language lang=\\"en\\" />\\n<Head_HTML {title} {description} keywords={$milk?.site?.keywords} />\\n<Head_Facebook {title} {description} image=\\"/img/hero_services_01.jpg\\" />\\n<Head_Twitter {title} {description} image=\\"/img/hero_services_01.jpg\\" />\\n<Layout_Main id=\\"immigration-attorneys\\">\\n\\t<Hero\\n\\t\\tid=\\"hero-immigration-services\\"\\n\\t\\timage_url=\\"/img/hero_services_02.jpg\\"\\n\\t\\timg_srcset=\\"/img/hero_services_02.jpg\\"\\n\\t\\tavif_srcset=\\"/img/hero_services_02.avif\\"\\n\\t\\twebp_srcset=\\"/img/hero_services_02.webp\\"\\n\\t\\ttitle=\\"Harlan York and Associates\\"\\n\\t\\tparallax=\\"false\\">&nbsp;</Hero\\n\\t>\\n\\t<Block_CallOutText\\n\\t\\tid=\\"call-out-text\\"\\n\\t\\tblockstyle=\\"block-style01\\"\\n\\t\\textraclasses=\\"floating-calltoaction\\"\\n\\t\\ttitle=\\"Immigration Services\\"\\n\\t>\\n\\t\\t<p>{description}</p>\\n\\t</Block_CallOutText>\\n\\t<div class=\\"content\\">\\n\\t\\t<h1 class=\\"title\\">Our Services</h1>\\n\\t</div>\\n\\t<Block_ServicesList id=\\"services\\" blockstyle=\\"\\" />\\n\\t<div class=\\"service-area\\">\\n\\t\\t<p>\\n\\t\\t\\tHarlan York and Associates practices law in the areas of\\n\\t\\t\\tImmigration, Deportation Defense, Family Immigration, Corporate\\n\\t\\t\\tImmigration, Naturalization throughout Essex County \u2013 Hudson County\\n\\t\\t\\t\u2013 Morris County \u2013 Passaic County \u2013 Somerset County \u2013 Middlesex\\n\\t\\t\\tCounty \u2013 Bergen County \u2013 New Jersey -Immigration Lawyer \u2013 NJ\\n\\t\\t\\tImmigration Lawyer \u2013 Jersey City-Newark-Paterson Passaic Elizabeth\\n\\t\\t\\tEdison Woodbridge Toms River Hamilton Trenton Camden Clifton Passaic\\n\\t\\t\\tGarfield Wallington Cherry Hill East Orange Passaic Union City\\n\\t\\t\\tBayonne Irvington Old Bridge Lakewood North Bergen Vineland Union\\n\\t\\t\\tWayne Parsippany-Troy Hills New Brunswick Plainfield Bloomfield\\n\\t\\t\\tPerth Amboy East Brunswick West New York West Orange Hackensack\\n\\t\\t\\tAtlantic City Kearny Mount Laurel Montclair Essex Hoboken North\\n\\t\\t\\tBrunswick Belleville. In addition to serving clients in New York,\\n\\t\\t\\tPennsylvania, the greater United States, and Internationally.\\n\\t\\t</p>\\n\\t</div>\\n\\t<Block_eBook id=\\"marriage-ebook\\" wpid=\\"cG9zdDoyNDY=\\" blockstyle=\\"\\" />\\n\\t<Block_Testimonials id=\\"testimonials\\" blockstyle=\\"block-style05\\" />\\n\\t<Block_CallToAction\\n\\t\\tid=\\"call-to-action\\"\\n\\t\\tblockstyle=\\"block-style01\\"\\n\\t\\textraclasses=\\"regular-calltoaction\\"\\n\\t/>\\n\\t<Block_LanguagesWeSpeak />\\n\\t<Block_FAQs id=\\"FAQs\\" blockstyle=\\"\\" />\\n\\t<Block_Featured id=\\"featured\\" blockstyle=\\"\\" />\\n\\t<Block_Ratings id=\\"ratings\\" blockstyle=\\"\\" />\\n\\t<SocialMedia id=\\"socialmedia\\" blockstyle=\\"\\" />\\n</Layout_Main>\\n\\n<script>var _$milk, _$milk$site;\\n\\n/* ## MILK ## */\\nimport { milk } from '$milk/milk.js';\\n/* ## Components ## */\\n\\nimport Head_Language from '$milk/lib/Head_Language.svelte';\\nimport Head_HTML from '$milk/lib/Head_HTML.svelte';\\nimport Head_Facebook from '$milk/lib/Head_Facebook.svelte';\\nimport Head_Twitter from '$milk/lib/Head_Twitter.svelte';\\nimport Layout_Main from '$theme/Layout_Main.svelte';\\nimport Hero from '$milk/lib/Hero.svelte';\\nimport Block_CallOutText from '$theme/Block_CallOutText.svelte';\\nimport Block_ServicesList from '$theme/Block_ServicesList.svelte';\\nimport Block_eBook from '$theme/Block_eBook.svelte';\\nimport Block_CallToAction from '$theme/Block_CallToAction.svelte';\\nimport Block_LanguagesWeSpeak from '$theme/Block_LanguagesWeSpeak.svelte';\\nimport Block_FAQs from '$theme/Block_FAQs.svelte';\\nimport Block_Testimonials from '$theme/Block_Testimonials.svelte';\\nimport Block_Featured from '$theme/Block_Featured.svelte';\\nimport SocialMedia from '$milk/lib/SocialMedia.svelte';\\nimport Block_Ratings from '$theme/Block_Ratings.svelte';\\n/* ## Variables ## */\\n\\nvar title = \\"Immigration Services - \\" + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.title);\\nvar description = 'At Harlan York & Associates our immigration attorneys use their extensive experience on thousands of cases and daily reviews of new developments in the constantly changing field of immigration law to give you the best legal counsel available.';</script>\\n\\n<style>.content{text-align:center}.title{position:relative;margin-bottom:-100px}.service-area{text-align:center}.service-area p{text-align:left;max-width:800px;font-style:italic;color:#666;margin:auto auto 45px}</style>\\n"],"names":[],"mappings":"AAqFO,sCAAQ,CAAC,WAAW,MAAM,CAAC,oCAAM,CAAC,SAAS,QAAQ,CAAC,cAAc,MAAM,CAAC,2CAAa,CAAC,WAAW,MAAM,CAAC,4BAAa,CAAC,gBAAC,CAAC,WAAW,IAAI,CAAC,UAAU,KAAK,CAAC,WAAW,MAAM,CAAC,MAAM,IAAI,CAAC,OAAO,IAAI,CAAC,IAAI,CAAC,IAAI,CAAC"}`
};
var description$6 = "At Harlan York & Associates our immigration attorneys use their extensive experience on thousands of cases and daily reviews of new developments in the constantly changing field of immigration law to give you the best legal counsel available.";
const Immigration_law_services = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a;
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var _$milk, _$milk$site;
  var title = "Immigration Services - " + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.title);
  $$result.css.add(css$d);
  $$unsubscribe_milk();
  return `${validate_component(Head_Language, "Head_Language").$$render($$result, {lang: "en"}, {}, {})}
${validate_component(Head_HTML, "Head_HTML").$$render($$result, {
    title,
    description: description$6,
    keywords: (_a = $milk == null ? void 0 : $milk.site) == null ? void 0 : _a.keywords
  }, {}, {})}
${validate_component(Head_Facebook, "Head_Facebook").$$render($$result, {
    title,
    description: description$6,
    image: "/img/hero_services_01.jpg"
  }, {}, {})}
${validate_component(Head_Twitter, "Head_Twitter").$$render($$result, {
    title,
    description: description$6,
    image: "/img/hero_services_01.jpg"
  }, {}, {})}
${validate_component(Layout_Main, "Layout_Main").$$render($$result, {id: "immigration-attorneys"}, {}, {
    default: () => `${validate_component(Hero, "Hero").$$render($$result, {
      id: "hero-immigration-services",
      image_url: "/img/hero_services_02.jpg",
      img_srcset: "/img/hero_services_02.jpg",
      avif_srcset: "/img/hero_services_02.avif",
      webp_srcset: "/img/hero_services_02.webp",
      title: "Harlan York and Associates",
      parallax: "false"
    }, {}, {})}
	${validate_component(Block_CallOutText, "Block_CallOutText").$$render($$result, {
      id: "call-out-text",
      blockstyle: "block-style01",
      extraclasses: "floating-calltoaction",
      title: "Immigration Services"
    }, {}, {
      default: () => `<p>${escape(description$6)}</p>`
    })}
	<div class="${"content svelte-176w53d"}"><h1 class="${"title svelte-176w53d"}">Our Services</h1></div>
	${validate_component(Block_ServicesList, "Block_ServicesList").$$render($$result, {id: "services", blockstyle: ""}, {}, {})}
	<div class="${"service-area svelte-176w53d"}"><p class="${"svelte-176w53d"}">Harlan York and Associates practices law in the areas of
			Immigration, Deportation Defense, Family Immigration, Corporate
			Immigration, Naturalization throughout Essex County \u2013 Hudson County
			\u2013 Morris County \u2013 Passaic County \u2013 Somerset County \u2013 Middlesex
			County \u2013 Bergen County \u2013 New Jersey -Immigration Lawyer \u2013 NJ
			Immigration Lawyer \u2013 Jersey City-Newark-Paterson Passaic Elizabeth
			Edison Woodbridge Toms River Hamilton Trenton Camden Clifton Passaic
			Garfield Wallington Cherry Hill East Orange Passaic Union City
			Bayonne Irvington Old Bridge Lakewood North Bergen Vineland Union
			Wayne Parsippany-Troy Hills New Brunswick Plainfield Bloomfield
			Perth Amboy East Brunswick West New York West Orange Hackensack
			Atlantic City Kearny Mount Laurel Montclair Essex Hoboken North
			Brunswick Belleville. In addition to serving clients in New York,
			Pennsylvania, the greater United States, and Internationally.
		</p></div>
	${validate_component(Block_eBook, "Block_eBook").$$render($$result, {
      id: "marriage-ebook",
      wpid: "cG9zdDoyNDY=",
      blockstyle: ""
    }, {}, {})}
	${validate_component(Block_Testimonials, "Block_Testimonials").$$render($$result, {
      id: "testimonials",
      blockstyle: "block-style05"
    }, {}, {})}
	${validate_component(Block_CallToAction, "Block_CallToAction").$$render($$result, {
      id: "call-to-action",
      blockstyle: "block-style01",
      extraclasses: "regular-calltoaction"
    }, {}, {})}
	${validate_component(Block_LanguagesWeSpeak, "Block_LanguagesWeSpeak").$$render($$result, {}, {}, {})}
	${validate_component(Block_FAQs, "Block_FAQs").$$render($$result, {id: "FAQs", blockstyle: ""}, {}, {})}
	${validate_component(Block_Featured, "Block_Featured").$$render($$result, {id: "featured", blockstyle: ""}, {}, {})}
	${validate_component(Block_Ratings, "Block_Ratings").$$render($$result, {id: "ratings", blockstyle: ""}, {}, {})}
	${validate_component(SocialMedia, "SocialMedia").$$render($$result, {id: "socialmedia", blockstyle: ""}, {}, {})}`
  })}`;
});
var index$6 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: Immigration_law_services
});
const getStores = () => {
  const stores = getContext("__svelte__");
  return {
    page: {
      subscribe: stores.page.subscribe
    },
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    get preloading() {
      console.error("stores.preloading is deprecated; use stores.navigating instead");
      return {
        subscribe: stores.navigating.subscribe
      };
    },
    session: stores.session
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
const Head_Article = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var _$milk, _$milk$site, _$milk2, _$milk2$site;
  var {author} = $$props;
  var {pubdate} = $$props;
  if ($$props.author === void 0 && $$bindings.author && author !== void 0)
    $$bindings.author(author);
  if ($$props.pubdate === void 0 && $$bindings.pubdate && pubdate !== void 0)
    $$bindings.pubdate(pubdate);
  pubdate = pubdate && pubdate != "" ? new Date(pubdate).toISOString() : new Date().toISOString();
  author || (author = ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.first_name) + " " + ((_$milk2 = $milk) == null ? void 0 : (_$milk2$site = _$milk2.site) == null ? void 0 : _$milk2$site.last_name));
  $$unsubscribe_milk();
  return `${$$result.head += `<meta property="${"og:type"}" content="${"article"}" data-svelte="svelte-1pvvrac"><meta property="${"article:author"}"${add_attribute("content", author, 0)} data-svelte="svelte-1pvvrac"><meta property="${"article:published_time"}"${add_attribute("content", pubdate, 0)} data-svelte="svelte-1pvvrac"><meta name="${"author"}" type="${"article"}"${add_attribute("content", author, 0)} data-svelte="svelte-1pvvrac">${slots.default ? slots.default({}) : ``}`, ""}`;
});
var Block_FaqItem_svelte = ".single-faq-wrap.svelte-1isvkaq.svelte-1isvkaq{display:flex;grid-gap:15px;gap:15px;width:auto}.icon-wrap.svelte-1isvkaq.svelte-1isvkaq{position:relative;width:40px;height:40px}.faq-content.svelte-1isvkaq.svelte-1isvkaq{flex:1}.icon-wrap.svelte-1isvkaq i.svelte-1isvkaq{position:absolute;display:block;background-color:var(--color-black)}.icon-wrap.svelte-1isvkaq i.svelte-1isvkaq:first-child{height:16%;width:100%;top:50%;margin-top:-8%}.icon-wrap.svelte-1isvkaq i.svelte-1isvkaq:nth-child(2){height:100%;width:16%;left:50%;margin-left:-8%;transform-origin:center;transition:transform .2s ease-in}.dropdown.svelte-1isvkaq.svelte-1isvkaq{width:50%}[aria-expanded=true].svelte-1isvkaq i.svelte-1isvkaq:nth-child(2){transform:rotate(90deg)}";
const css$c = {
  code: ".single-faq-wrap.svelte-1isvkaq.svelte-1isvkaq{display:flex;grid-gap:15px;gap:15px;width:auto}.icon-wrap.svelte-1isvkaq.svelte-1isvkaq{position:relative;width:40px;height:40px}.faq-content.svelte-1isvkaq.svelte-1isvkaq{flex:1}.icon-wrap.svelte-1isvkaq i.svelte-1isvkaq{position:absolute;display:block;background-color:var(--color-black)}.icon-wrap.svelte-1isvkaq i.svelte-1isvkaq:first-child{height:16%;width:100%;top:50%;margin-top:-8%}.icon-wrap.svelte-1isvkaq i.svelte-1isvkaq:nth-child(2){height:100%;width:16%;left:50%;margin-left:-8%;transform-origin:center;transition:transform .2s ease-in}.dropdown.svelte-1isvkaq.svelte-1isvkaq{width:50%}[aria-expanded=true].svelte-1isvkaq i.svelte-1isvkaq:nth-child(2){transform:rotate(90deg)}",
  map: `{"version":3,"file":"Block_FaqItem.svelte","sources":["Block_FaqItem.svelte"],"sourcesContent":["<div class=\\"single-faq-wrap\\">\\n\\t<div on:click={toggle} aria-expanded={isOpen} class=\\"icon-wrap\\">\\n\\t\\t<i />\\n\\t\\t<i />\\n\\t</div>\\n\\t<div class=\\"faq-content\\">\\n\\t\\t<h3>{title}</h3>\\n\\n\\t\\t{#if isOpen}\\n\\t\\t\\t<div transition:slide={{ duration: 300 }} class=\\"dropdown\\">\\n\\t\\t\\t\\t<p>{content}</p>\\n\\t\\t\\t</div>\\n\\t\\t{/if}\\n\\t</div>\\n</div>\\n\\n<script>import { slide } from 'svelte/transition';\\nvar isOpen = false;\\n\\nvar toggle = () => isOpen = !isOpen;\\n\\nvar title, content;\\nexport { title, content };</script>\\n\\n<style>.single-faq-wrap{display:flex;grid-gap:15px;gap:15px;width:auto}.icon-wrap{position:relative;width:40px;height:40px}.faq-content{flex:1}.icon-wrap i{position:absolute;display:block;background-color:var(--color-black)}.icon-wrap i:first-child{height:16%;width:100%;top:50%;margin-top:-8%}.icon-wrap i:nth-child(2){height:100%;width:16%;left:50%;margin-left:-8%;transform-origin:center;transition:transform .2s ease-in}.dropdown{width:50%}[aria-expanded=true] i:nth-child(2){transform:rotate(90deg)}</style>\\n"],"names":[],"mappings":"AAwBO,8CAAgB,CAAC,QAAQ,IAAI,CAAC,SAAS,IAAI,CAAC,IAAI,IAAI,CAAC,MAAM,IAAI,CAAC,wCAAU,CAAC,SAAS,QAAQ,CAAC,MAAM,IAAI,CAAC,OAAO,IAAI,CAAC,0CAAY,CAAC,KAAK,CAAC,CAAC,yBAAU,CAAC,gBAAC,CAAC,SAAS,QAAQ,CAAC,QAAQ,KAAK,CAAC,iBAAiB,IAAI,aAAa,CAAC,CAAC,yBAAU,CAAC,gBAAC,YAAY,CAAC,OAAO,GAAG,CAAC,MAAM,IAAI,CAAC,IAAI,GAAG,CAAC,WAAW,GAAG,CAAC,yBAAU,CAAC,gBAAC,WAAW,CAAC,CAAC,CAAC,OAAO,IAAI,CAAC,MAAM,GAAG,CAAC,KAAK,GAAG,CAAC,YAAY,GAAG,CAAC,iBAAiB,MAAM,CAAC,WAAW,SAAS,CAAC,GAAG,CAAC,OAAO,CAAC,uCAAS,CAAC,MAAM,GAAG,CAAC,CAAC,aAAa,CAAC,IAAI,gBAAC,CAAC,gBAAC,WAAW,CAAC,CAAC,CAAC,UAAU,OAAO,KAAK,CAAC,CAAC"}`
};
const Block_FaqItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var isOpen = false;
  var {title} = $$props, {content} = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.content === void 0 && $$bindings.content && content !== void 0)
    $$bindings.content(content);
  $$result.css.add(css$c);
  return `<div class="${"single-faq-wrap svelte-1isvkaq"}"><div${add_attribute("aria-expanded", isOpen, 0)} class="${"icon-wrap svelte-1isvkaq"}"><i class="${"svelte-1isvkaq"}"></i>
		<i class="${"svelte-1isvkaq"}"></i></div>
	<div class="${"faq-content svelte-1isvkaq"}"><h3>${escape(title)}</h3>

		${``}</div>
</div>`;
});
var _slug__svelte$1 = ".blog-topbar.svelte-1wf9tyj.svelte-1wf9tyj.svelte-1wf9tyj{position:relative;margin:-20px 0 20px}.breadcrumbs.svelte-1wf9tyj.svelte-1wf9tyj.svelte-1wf9tyj{font-size:var(--small-fontsize)}.breadcrumbs.svelte-1wf9tyj a.svelte-1wf9tyj.svelte-1wf9tyj{color:var(--color-black)}.breadcrumbs.svelte-1wf9tyj a.svelte-1wf9tyj.svelte-1wf9tyj:hover{color:var(--color-four)}.flex-wrap.svelte-1wf9tyj.svelte-1wf9tyj.svelte-1wf9tyj{display:flex;justify-content:space-evenly;grid-gap:10px;gap:10px}@media screen and (max-width:768px){.flex-wrap.svelte-1wf9tyj.svelte-1wf9tyj.svelte-1wf9tyj{flex-wrap:wrap;justify-content:flex-start}}.outer-wrap.svelte-1wf9tyj.svelte-1wf9tyj.svelte-1wf9tyj{margin:0 var(--margin-Xl);padding:var(--padding-med)}h2.svelte-1wf9tyj.svelte-1wf9tyj.svelte-1wf9tyj{text-transform:capitalize;text-align:center;font-size:3rem;margin:1em 0;color:var(--color-black)}.bg-grey.svelte-1wf9tyj.svelte-1wf9tyj.svelte-1wf9tyj{padding:var(--padding-med);background-color:var(--color-eight)}.bg-grey.svelte-1wf9tyj>h3.svelte-1wf9tyj>a.svelte-1wf9tyj{color:#fff}.bg-white.svelte-1wf9tyj.svelte-1wf9tyj.svelte-1wf9tyj{background-color:#fff;box-shadow:-1px 2px 8px -2px}.service-info.svelte-1wf9tyj.svelte-1wf9tyj.svelte-1wf9tyj{margin:0 var(--margin-Xl);padding:var(--padding-med);text-align:center}.service-info.svelte-1wf9tyj h2.svelte-1wf9tyj.svelte-1wf9tyj{font-size:2em}";
const css$1$4 = {
  code: ".blog-topbar.svelte-1wf9tyj.svelte-1wf9tyj.svelte-1wf9tyj{position:relative;margin:-20px 0 20px}.breadcrumbs.svelte-1wf9tyj.svelte-1wf9tyj.svelte-1wf9tyj{font-size:var(--small-fontsize)}.breadcrumbs.svelte-1wf9tyj a.svelte-1wf9tyj.svelte-1wf9tyj{color:var(--color-black)}.breadcrumbs.svelte-1wf9tyj a.svelte-1wf9tyj.svelte-1wf9tyj:hover{color:var(--color-four)}.flex-wrap.svelte-1wf9tyj.svelte-1wf9tyj.svelte-1wf9tyj{display:flex;justify-content:space-evenly;grid-gap:10px;gap:10px}@media screen and (max-width:768px){.flex-wrap.svelte-1wf9tyj.svelte-1wf9tyj.svelte-1wf9tyj{flex-wrap:wrap;justify-content:flex-start}}.outer-wrap.svelte-1wf9tyj.svelte-1wf9tyj.svelte-1wf9tyj{margin:0 var(--margin-Xl);padding:var(--padding-med)}h2.svelte-1wf9tyj.svelte-1wf9tyj.svelte-1wf9tyj{text-transform:capitalize;text-align:center;font-size:3rem;margin:1em 0;color:var(--color-black)}.bg-grey.svelte-1wf9tyj.svelte-1wf9tyj.svelte-1wf9tyj{padding:var(--padding-med);background-color:var(--color-eight)}.bg-grey.svelte-1wf9tyj>h3.svelte-1wf9tyj>a.svelte-1wf9tyj{color:#fff}.bg-white.svelte-1wf9tyj.svelte-1wf9tyj.svelte-1wf9tyj{background-color:#fff;box-shadow:-1px 2px 8px -2px}.service-info.svelte-1wf9tyj.svelte-1wf9tyj.svelte-1wf9tyj{margin:0 var(--margin-Xl);padding:var(--padding-med);text-align:center}.service-info.svelte-1wf9tyj h2.svelte-1wf9tyj.svelte-1wf9tyj{font-size:2em}",
  map: `{"version":3,"file":"[slug].svelte","sources":["[slug].svelte"],"sourcesContent":["<svelte:head>\\n\\t{#each blog_css as css}\\n\\t\\t<link\\n\\t\\t\\tasync\\n\\t\\t\\thref={ (css.src.startsWith('http')) ? \`\${css.src}\` : \`\${$milk.site.admin_url}\${css.src}\` }\\n\\t\\t\\trel=\\"preload\\"\\n\\t\\t\\tas=\\"style\\"\\n\\t\\t/>\\n\\t\\t<link\\n\\t\\t\\tasync\\n\\t\\t\\thref={ (css.src.startsWith('http')) ? \`\${css.src}\` : \`\${$milk.site.admin_url}\${css.src}\` }\\n\\t\\t\\trel=\\"stylesheet\\"\\n\\t\\t/>\\n\\t{/each}\\n\\t{#each blog_scripts as script}\\n\\t\\t<script\\n\\t\\t\\tdefer\\n\\t\\t\\tsrc={ (script.src.startsWith('http')) ? \`\${script.src}\` : \`\${$milk.site.admin_url}\${script.src}\` }\\n\\t\\t/>\\n\\t{/each}\\n\\t<link rel=\\"stylesheet\\" href={themestyle} />\\n</svelte:head>\\n\\n<Head_Language lang=\\"en\\" />\\n<Head_HTML {title} {description} keywords={$milk?.site?.keywords} />\\n<Head_Facebook {title} {description} {image} />\\n<Head_Twitter {title} {description} {image} />\\n<Layout_Main id=\\"blog-post\\">\\n\\t{#each blog_posts as blog_post}\\n\\t\\t<Head_Article author={blog_post?.author?.node?.name} pubdate={blog_post?.date} />\\n\\t\\t<Hero\\n\\t\\t\\tid=\\"blog-post-hero\\"\\n\\t\\t\\timage_url={blog_post?.featuredImage?.node?.sourceUrl}\\n\\t\\t\\timg_srcset={blog_post?.featuredImage?.node?.srcSet}\\n\\t\\t\\tavif_srcset=\\"\\"\\n\\t\\t\\twebp_srcset=\\"\\"\\n\\t\\t\\ttitle=\\"Harlan York and Associates\\"\\n\\t\\t\\tparallax=\\"false\\">&nbsp;</Hero\\n\\t\\t>\\n\\t\\t<Block_CallOutText\\n\\t\\t\\tid=\\"call-out-text\\"\\n\\t\\t\\tblockstyle=\\"block-style01\\"\\n\\t\\t\\textraclasses=\\"floating-calltoaction\\"\\n\\t\\t\\ttitle={blog_post?.title}\\n\\t\\t>\\n\\n\\t\\t\\t{@html description}\\n\\t\\t\\t<div class=\\"callout-detials\\">\\n\\t\\t\\t\\t{months[post_date.getMonth()]}\\n\\t\\t\\t\\t{post_date.getDate()},\\n\\t\\t\\t\\t{post_date.getFullYear()}\\n\\t\\t\\t</div>\\n\\t\\t</Block_CallOutText>\\n\\t\\t<div class=\\"content\\">\\n\\t\\t\\t<div class=\\"content-inner\\">\\n\\t\\t\\t\\t<div class=\\"blog-topbar\\">\\n\\t\\t\\t\\t\\t<div class=\\"breadcrumbs\\">\\n\\t\\t\\t\\t\\t\\t<a href=\\"/\\">Home</a>\\n\\t\\t\\t\\t\\t\\t\u203A\\n\\t\\t\\t\\t\\t\\t<a href=\\"/immigration-law-services\\">Services</a>\\n\\t\\t\\t\\t\\t\\t\u203A\\n\\t\\t\\t\\t\\t\\t<a href={\`/immigration-law-services/\${blog_post?.slug}\`}>{blog_post?.title}</a>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t<div class=\\"blog-content\\">\\n\\t\\t\\t\\t\\t{@html blog_post?.content}\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t\\t<FeaturedVideo\\n\\t\\tid=\\"featured-video\\"\\n\\t\\tblockstyle=\\"\\"\\n\\t\\tvideo_source=\\"//player.vimeo.com/video/108146056\\"\\n\\t\\tvideo_jpg=\\"/img/video_featured.jpg\\"\\n\\t\\tvideo_webp=\\"/img/video_featured.webp\\"\\n\\t\\tvideo_avif=\\"/img/video_featured.avif\\"\\n\\t\\t/>\\n\\t\\t{#if blog_post?.Services?.serviceFaq}\\n\\t\\t<div class=\\"outer-wrap margin-sides-large bg-white\\">\\n\\t\\t\\t<h2>frequently asked questions</h2>\\n\\t\\t\\t<div class='flex-wrap'>\\t\\n\\t\\t\\t{#each blog_post?.Services?.serviceFaq as faq}\\n\\n\\t\\t\\t\\t<Block_FaqItem title={faq?.faqTitle} content={faq?.faqContent} />\\n\\t\\t\\t\\t\\n\\n\\t\\t\\t{/each}\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t\\t{/if}\\n\\t\\t{#if blog_post?.Services?.relatedPosts}\\n\\t\\t<div class=\\"outer-wrap margin-sides-large\\">\\n\\t\\t\\t<h2>related blog posts</h2>\\n\\t\\t\\t<div class='flex-wrap'>\\t\\n\\t\\t\\t{#each blog_post?.Services?.relatedPosts as relatedPost}\\n\\t\\t\\t\\t\\n\\t\\t\\t\\t<div class=\\"related-post-wrap\\">\\n\\t\\t\\t\\t\\t<div class='img-wrap'><a href={\`/immigration-law-blog/\${relatedPost?.slug}\`}><img src={relatedPost?.featuredImage?.node.sourceUrl} alt=\\"\\"></a></div>\\n\\t\\t\\t\\t\\t<div class=\\"bg-grey\\">\\n\\t\\t\\t\\t\\t\\t<h3><a href={\`/immigration-law-blog/\${relatedPost?.slug}\`}>{relatedPost?.title}</a></h3>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</div>\\n\\n\\t\\t\\t{/each}\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t\\t{/if}\\n\\t\\t<div class=\\"service-info\\">\\n\\t\\t\\t<h2>We are here to answer all your questions about {blog_post?.title}</h2>\\n\\t\\t\\t<p>\\n\\t\\t\\t\\tYou don't have to try to find the answers to your questions ononline. \\n\\t\\t\\t\\tPlease don't try to do your immigration paperwork on your own. Call a team of experienced professionals in immigration law.\\n\\t\\t\\t</p>\\n\\t\\t\\t<p>\\n\\t\\t\\t\\t<strong>\\n\\t\\t\\t\\t\\tUS immigration is processing visas and green createEventDispatcher. We are now seeing clients in carefully aranged times at our offices\\n\\n\\t\\t\\t\\t</strong>\\n\\t\\t\\t</p>\\n\\t\\t</div>\\n\\t{/each}\\n\\n\\t<Block_Testimonials id=\\"testimonials\\" blockstyle=\\"block-style05\\" />\\n\\n\\t\\n\\t<Block_CallToAction\\n\\t\\tid=\\"call-to-action\\"\\n\\t\\tblockstyle=\\"block-style01\\"\\n\\t\\textraclasses=\\"regular-calltoaction\\"\\n\\t/>\\n\\t<Block_LanguagesWeSpeak />\\n\\t<Block_Featured id=\\"featured\\" blockstyle=\\"\\" />\\n\\t<Block_Ratings id=\\"ratings\\" blockstyle=\\"\\" />\\n\\t<SocialMedia id=\\"socialmedia\\" blockstyle=\\"\\" />\\n</Layout_Main>\\n\\n<script>var _$milk, _$milk$site, _$milk2, _$milk2$site, _$milk3, _$milk3$site;\\n\\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount, onDestroy } from 'svelte';\\nimport { page } from '$app/stores';\\n/* ## MILK ## */\\n\\nimport { milk } from '$milk/milk.js';\\n/* ## Components ## */\\n\\nimport Head_Language from '$milk/lib/Head_Language.svelte';\\nimport Head_HTML from '$milk/lib/Head_HTML.svelte';\\nimport Head_Facebook from '$milk/lib/Head_Facebook.svelte';\\nimport Head_Twitter from '$milk/lib/Head_Twitter.svelte';\\nimport Head_Article from '$milk/lib/Head_Article.svelte';\\nimport Layout_Main from '$theme/Layout_Main.svelte';\\nimport Hero from '$milk/lib/Hero.svelte';\\nimport Block_CallOutText from '$theme/Block_CallOutText.svelte';\\nimport Block_ServicesList from '$theme/Block_ServicesList.svelte';\\nimport Block_CallToAction from '$theme/Block_CallToAction.svelte';\\nimport Block_LanguagesWeSpeak from '$theme/Block_LanguagesWeSpeak.svelte';\\nimport Block_Testimonials from '$theme/Block_Testimonials.svelte';\\nimport Block_Featured from '$theme/Block_Featured.svelte';\\nimport SocialMedia from '$milk/lib/SocialMedia.svelte';\\nimport Block_Ratings from '$theme/Block_Ratings.svelte';\\nimport Block_FaqItem from '$theme/Block_FaqItem.svelte';\\nimport FeaturedVideo from '$milk/lib/FeaturedVideo.svelte';\\n/* ## Variables ## */\\n\\nvar title = \\"Immigration Services - \\" + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.title);\\nvar description = (_$milk2 = $milk) == null ? void 0 : (_$milk2$site = _$milk2.site) == null ? void 0 : _$milk2$site.description;\\nvar image = (_$milk3 = $milk) == null ? void 0 : (_$milk3$site = _$milk3.site) == null ? void 0 : _$milk3$site.facebook_photo;\\nvar slug = $page.params.slug;\\nvar themestyle = '';\\n\\n$: themestyle = \\"/themes/\\" + $milk.config.theme + \\"/style.css\\";\\n/* ## Data Loading ## */\\n\\n\\nvar unsubscribe = () => {};\\n\\nvar blog_posts = [];\\nvar blog_css = [];\\nvar blog_scripts = [];\\nvar post_date = new Date();\\nvar months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];\\nimport { Q_GET_SERVICE } from '$graphql/sitespecific.graphql.js';\\nimport { createEventDispatcher, each } from 'svelte/internal'; // import BlockFaqItem from 'static/themes/hya/Block_FaqItem.svelte';\\n\\n/* ## Main ## */\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  var _$milk4, _$milk4$data;\\n\\n  slug = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);\\n  var queryVariables = {\\n    id: slug\\n  };\\n  var getService = (_$milk4 = $milk) == null ? void 0 : (_$milk4$data = _$milk4.data) == null ? void 0 : _$milk4$data.gql(Q_GET_SERVICE, $milk.data.sources.wordpress, queryVariables, false, 0);\\n  unsubscribe = yield getService == null ? void 0 : getService.subscribe( /*#__PURE__*/function () {\\n    var _ref2 = _asyncToGenerator(function* (fetched_data) {\\n      var _data$service, _data$service2, _data$service2$enqueu, _data$service3, _data$service3$enqueu, _data$service4, _data$service$Service, _data$featuredImage, _data$featuredImage$n;\\n\\n      var data = yield fetched_data;\\n      post_date = new Date(data == null ? void 0 : (_data$service = data.service) == null ? void 0 : _data$service.date);\\n      blog_css = (data == null ? void 0 : (_data$service2 = data.service) == null ? void 0 : (_data$service2$enqueu = _data$service2.enqueuedStylesheets) == null ? void 0 : _data$service2$enqueu.nodes) || [];\\n      blog_scripts = (data == null ? void 0 : (_data$service3 = data.service) == null ? void 0 : (_data$service3$enqueu = _data$service3.enqueuedScripts) == null ? void 0 : _data$service3$enqueu.nodes) || [];\\n      blog_posts = [data == null ? void 0 : data.service];\\n      title = data == null ? void 0 : (_data$service4 = data.service) == null ? void 0 : _data$service4.title;\\n      description = data == null ? void 0 : (_data$service$Service = data.service.Services) == null ? void 0 : _data$service$Service.excerpt;\\n      image = data == null ? void 0 : (_data$featuredImage = data.featuredImage) == null ? void 0 : (_data$featuredImage$n = _data$featuredImage.node) == null ? void 0 : _data$featuredImage$n.sourceUrl;\\n    });\\n\\n    return function (_x) {\\n      return _ref2.apply(this, arguments);\\n    };\\n  }());\\n}));\\n/* ## Exit ## */\\n\\nonDestroy(() => {\\n  unsubscribe(); // important for garbage collection otherwise memory leak\\n});\\nexport { slug };</script>\\t\\n\\n<style>.blog-topbar{position:relative;margin:-20px 0 20px}.breadcrumbs{font-size:var(--small-fontsize)}.breadcrumbs a{color:var(--color-black)}.breadcrumbs a:hover{color:var(--color-four)}.flex-wrap{display:flex;justify-content:space-evenly;grid-gap:10px;gap:10px}@media screen and (max-width:768px){.flex-wrap{flex-wrap:wrap;justify-content:flex-start}}.outer-wrap{margin:0 var(--margin-Xl);padding:var(--padding-med)}h2{text-transform:capitalize;text-align:center;font-size:3rem;margin:1em 0;color:var(--color-black)}.bg-grey{padding:var(--padding-med);background-color:var(--color-eight)}.bg-grey>h3>a{color:#fff}.bg-white{background-color:#fff;box-shadow:-1px 2px 8px -2px}.service-info{margin:0 var(--margin-Xl);padding:var(--padding-med);text-align:center}.service-info h2{font-size:2em}</style>\\n"],"names":[],"mappings":"AAkOO,yDAAY,CAAC,SAAS,QAAQ,CAAC,OAAO,KAAK,CAAC,CAAC,CAAC,IAAI,CAAC,yDAAY,CAAC,UAAU,IAAI,gBAAgB,CAAC,CAAC,2BAAY,CAAC,+BAAC,CAAC,MAAM,IAAI,aAAa,CAAC,CAAC,2BAAY,CAAC,+BAAC,MAAM,CAAC,MAAM,IAAI,YAAY,CAAC,CAAC,uDAAU,CAAC,QAAQ,IAAI,CAAC,gBAAgB,YAAY,CAAC,SAAS,IAAI,CAAC,IAAI,IAAI,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,uDAAU,CAAC,UAAU,IAAI,CAAC,gBAAgB,UAAU,CAAC,CAAC,wDAAW,CAAC,OAAO,CAAC,CAAC,IAAI,WAAW,CAAC,CAAC,QAAQ,IAAI,aAAa,CAAC,CAAC,+CAAE,CAAC,eAAe,UAAU,CAAC,WAAW,MAAM,CAAC,UAAU,IAAI,CAAC,OAAO,GAAG,CAAC,CAAC,CAAC,MAAM,IAAI,aAAa,CAAC,CAAC,qDAAQ,CAAC,QAAQ,IAAI,aAAa,CAAC,CAAC,iBAAiB,IAAI,aAAa,CAAC,CAAC,uBAAQ,CAAC,iBAAE,CAAC,gBAAC,CAAC,MAAM,IAAI,CAAC,sDAAS,CAAC,iBAAiB,IAAI,CAAC,WAAW,IAAI,CAAC,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,0DAAa,CAAC,OAAO,CAAC,CAAC,IAAI,WAAW,CAAC,CAAC,QAAQ,IAAI,aAAa,CAAC,CAAC,WAAW,MAAM,CAAC,4BAAa,CAAC,gCAAE,CAAC,UAAU,GAAG,CAAC"}`
};
function asyncGeneratorStep$f(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$f(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$f(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$f(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const U5Bslugu5D$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a;
  let $milk, $$unsubscribe_milk;
  let $page, $$unsubscribe_page;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  var _$milk, _$milk$site, _$milk2, _$milk2$site, _$milk3, _$milk3$site;
  var title = "Immigration Services - " + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.title);
  var description2 = (_$milk2 = $milk) == null ? void 0 : (_$milk2$site = _$milk2.site) == null ? void 0 : _$milk2$site.description;
  var image = (_$milk3 = $milk) == null ? void 0 : (_$milk3$site = _$milk3.site) == null ? void 0 : _$milk3$site.facebook_photo;
  var {slug = $page.params.slug} = $$props;
  var themestyle = "";
  var unsubscribe = () => {
  };
  var blog_posts = [];
  var blog_css = [];
  var blog_scripts = [];
  var post_date = new Date();
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  onMount(/* @__PURE__ */ _asyncToGenerator$f(function* () {
    var _$milk4, _$milk4$data;
    slug = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);
    var queryVariables = {id: slug};
    var getService = (_$milk4 = $milk) == null ? void 0 : (_$milk4$data = _$milk4.data) == null ? void 0 : _$milk4$data.gql(Q_GET_SERVICE, $milk.data.sources.wordpress, queryVariables, false, 0);
    unsubscribe = yield getService == null ? void 0 : getService.subscribe(/* @__PURE__ */ function() {
      var _ref2 = _asyncToGenerator$f(function* (fetched_data) {
        var _data$service, _data$service2, _data$service2$enqueu, _data$service3, _data$service3$enqueu, _data$service4, _data$service$Service, _data$featuredImage, _data$featuredImage$n;
        var data = yield fetched_data;
        post_date = new Date(data == null ? void 0 : (_data$service = data.service) == null ? void 0 : _data$service.date);
        blog_css = (data == null ? void 0 : (_data$service2 = data.service) == null ? void 0 : (_data$service2$enqueu = _data$service2.enqueuedStylesheets) == null ? void 0 : _data$service2$enqueu.nodes) || [];
        blog_scripts = (data == null ? void 0 : (_data$service3 = data.service) == null ? void 0 : (_data$service3$enqueu = _data$service3.enqueuedScripts) == null ? void 0 : _data$service3$enqueu.nodes) || [];
        blog_posts = [data == null ? void 0 : data.service];
        title = data == null ? void 0 : (_data$service4 = data.service) == null ? void 0 : _data$service4.title;
        description2 = data == null ? void 0 : (_data$service$Service = data.service.Services) == null ? void 0 : _data$service$Service.excerpt;
        image = data == null ? void 0 : (_data$featuredImage = data.featuredImage) == null ? void 0 : (_data$featuredImage$n = _data$featuredImage.node) == null ? void 0 : _data$featuredImage$n.sourceUrl;
      });
      return function(_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  }));
  onDestroy(() => {
    unsubscribe();
  });
  if ($$props.slug === void 0 && $$bindings.slug && slug !== void 0)
    $$bindings.slug(slug);
  $$result.css.add(css$1$4);
  themestyle = "/themes/" + $milk.config.theme + "/style.css";
  $$unsubscribe_milk();
  $$unsubscribe_page();
  return `${$$result.head += `${each(blog_css, (css2) => `<link async${add_attribute("href", css2.src.startsWith("http") ? `${css2.src}` : `${$milk.site.admin_url}${css2.src}`, 0)} rel="${"preload"}" as="${"style"}" data-svelte="svelte-1eol1zw">
		<link async${add_attribute("href", css2.src.startsWith("http") ? `${css2.src}` : `${$milk.site.admin_url}${css2.src}`, 0)} rel="${"stylesheet"}" data-svelte="svelte-1eol1zw">`)}${each(blog_scripts, (script) => `<script defer${add_attribute("src", script.src.startsWith("http") ? `${script.src}` : `${$milk.site.admin_url}${script.src}`, 0)} data-svelte="svelte-1eol1zw"></script>`)}<link rel="${"stylesheet"}"${add_attribute("href", themestyle, 0)} data-svelte="svelte-1eol1zw">`, ""}

${validate_component(Head_Language, "Head_Language").$$render($$result, {lang: "en"}, {}, {})}
${validate_component(Head_HTML, "Head_HTML").$$render($$result, {
    title,
    description: description2,
    keywords: (_a = $milk == null ? void 0 : $milk.site) == null ? void 0 : _a.keywords
  }, {}, {})}
${validate_component(Head_Facebook, "Head_Facebook").$$render($$result, {title, description: description2, image}, {}, {})}
${validate_component(Head_Twitter, "Head_Twitter").$$render($$result, {title, description: description2, image}, {}, {})}
${validate_component(Layout_Main, "Layout_Main").$$render($$result, {id: "blog-post"}, {}, {
    default: () => `${each(blog_posts, (blog_post) => {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      return `${validate_component(Head_Article, "Head_Article").$$render($$result, {
        author: (_b = (_a2 = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _a2.node) == null ? void 0 : _b.name,
        pubdate: blog_post == null ? void 0 : blog_post.date
      }, {}, {})}
		${validate_component(Hero, "Hero").$$render($$result, {
        id: "blog-post-hero",
        image_url: (_d = (_c = blog_post == null ? void 0 : blog_post.featuredImage) == null ? void 0 : _c.node) == null ? void 0 : _d.sourceUrl,
        img_srcset: (_f = (_e = blog_post == null ? void 0 : blog_post.featuredImage) == null ? void 0 : _e.node) == null ? void 0 : _f.srcSet,
        avif_srcset: "",
        webp_srcset: "",
        title: "Harlan York and Associates",
        parallax: "false"
      }, {}, {})}
		${validate_component(Block_CallOutText, "Block_CallOutText").$$render($$result, {
        id: "call-out-text",
        blockstyle: "block-style01",
        extraclasses: "floating-calltoaction",
        title: blog_post == null ? void 0 : blog_post.title
      }, {}, {
        default: () => `${description2}
			<div class="${"callout-detials"}">${escape(months[post_date.getMonth()])}
				${escape(post_date.getDate())},
				${escape(post_date.getFullYear())}</div>
		`
      })}
		<div class="${"content"}"><div class="${"content-inner"}"><div class="${"blog-topbar svelte-1wf9tyj"}"><div class="${"breadcrumbs svelte-1wf9tyj"}"><a href="${"/"}" class="${"svelte-1wf9tyj"}">Home</a>
						\u203A
						<a href="${"/immigration-law-services"}" class="${"svelte-1wf9tyj"}">Services</a>
						\u203A
						<a${add_attribute("href", `/immigration-law-services/${blog_post == null ? void 0 : blog_post.slug}`, 0)} class="${"svelte-1wf9tyj"}">${escape(blog_post == null ? void 0 : blog_post.title)}</a>
					</div></div>
				<div class="${"blog-content"}">${blog_post == null ? void 0 : blog_post.content}</div>
				
			</div></div>
		${validate_component(FeaturedVideo, "FeaturedVideo").$$render($$result, {
        id: "featured-video",
        blockstyle: "",
        video_source: "//player.vimeo.com/video/108146056",
        video_jpg: "/img/video_featured.jpg",
        video_webp: "/img/video_featured.webp",
        video_avif: "/img/video_featured.avif"
      }, {}, {})}
		${((_g = blog_post == null ? void 0 : blog_post.Services) == null ? void 0 : _g.serviceFaq) ? `<div class="${"outer-wrap margin-sides-large bg-white svelte-1wf9tyj"}"><h2 class="${"svelte-1wf9tyj"}">frequently asked questions</h2>
			<div class="${"flex-wrap svelte-1wf9tyj"}">${each((_h = blog_post == null ? void 0 : blog_post.Services) == null ? void 0 : _h.serviceFaq, (faq) => `${validate_component(Block_FaqItem, "Block_FaqItem").$$render($$result, {
        title: faq == null ? void 0 : faq.faqTitle,
        content: faq == null ? void 0 : faq.faqContent
      }, {}, {})}`)}</div>
		</div>` : ``}
		${((_i = blog_post == null ? void 0 : blog_post.Services) == null ? void 0 : _i.relatedPosts) ? `<div class="${"outer-wrap margin-sides-large svelte-1wf9tyj"}"><h2 class="${"svelte-1wf9tyj"}">related blog posts</h2>
			<div class="${"flex-wrap svelte-1wf9tyj"}">${each((_j = blog_post == null ? void 0 : blog_post.Services) == null ? void 0 : _j.relatedPosts, (relatedPost) => {
        var _a3;
        return `<div class="${"related-post-wrap"}"><div class="${"img-wrap"}"><a${add_attribute("href", `/immigration-law-blog/${relatedPost == null ? void 0 : relatedPost.slug}`, 0)}><img${add_attribute("src", (_a3 = relatedPost == null ? void 0 : relatedPost.featuredImage) == null ? void 0 : _a3.node.sourceUrl, 0)} alt="${""}"></a></div>
					<div class="${"bg-grey svelte-1wf9tyj"}"><h3 class="${"svelte-1wf9tyj"}"><a${add_attribute("href", `/immigration-law-blog/${relatedPost == null ? void 0 : relatedPost.slug}`, 0)} class="${"svelte-1wf9tyj"}">${escape(relatedPost == null ? void 0 : relatedPost.title)}</a></h3></div>
				</div>`;
      })}</div>
		</div>` : ``}
		<div class="${"service-info svelte-1wf9tyj"}"><h2 class="${"svelte-1wf9tyj"}">We are here to answer all your questions about ${escape(blog_post == null ? void 0 : blog_post.title)}</h2>
			<p>You don&#39;t have to try to find the answers to your questions ononline. 
				Please don&#39;t try to do your immigration paperwork on your own. Call a team of experienced professionals in immigration law.
			</p>
			<p><strong>US immigration is processing visas and green createEventDispatcher. We are now seeing clients in carefully aranged times at our offices

				</strong></p>
		</div>`;
    })}

	${validate_component(Block_Testimonials, "Block_Testimonials").$$render($$result, {
      id: "testimonials",
      blockstyle: "block-style05"
    }, {}, {})}

	
	${validate_component(Block_CallToAction, "Block_CallToAction").$$render($$result, {
      id: "call-to-action",
      blockstyle: "block-style01",
      extraclasses: "regular-calltoaction"
    }, {}, {})}
	${validate_component(Block_LanguagesWeSpeak, "Block_LanguagesWeSpeak").$$render($$result, {}, {}, {})}
	${validate_component(Block_Featured, "Block_Featured").$$render($$result, {id: "featured", blockstyle: ""}, {}, {})}
	${validate_component(Block_Ratings, "Block_Ratings").$$render($$result, {id: "ratings", blockstyle: ""}, {}, {})}
	${validate_component(SocialMedia, "SocialMedia").$$render($$result, {id: "socialmedia", blockstyle: ""}, {}, {})}`
  })}`;
});
var _slug_$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: U5Bslugu5D$1
});
var description$5 = "Immigration law is a constantly changing legal field. Immigration lawyer Harlan York provides this blog so you can stay up to date on how legal trends affect immigration law cases.";
function asyncGeneratorStep$e(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$e(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$e(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$e(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Immigration_information = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a;
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var _$milk, _$milk$site;
  var title = "Immigration Blog - " + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.title);
  onMount(/* @__PURE__ */ _asyncToGenerator$e(function* () {
    window.location.href = "/";
  }));
  $$unsubscribe_milk();
  return `${validate_component(Head_Language, "Head_Language").$$render($$result, {lang: "en"}, {}, {})}
${validate_component(Head_HTML, "Head_HTML").$$render($$result, {
    title,
    description: description$5,
    keywords: (_a = $milk == null ? void 0 : $milk.site) == null ? void 0 : _a.keywords
  }, {}, {})}
${validate_component(Head_Facebook, "Head_Facebook").$$render($$result, {
    title,
    description: description$5,
    image: "/img/hero_blog_01.jpg"
  }, {}, {})}
${validate_component(Head_Twitter, "Head_Twitter").$$render($$result, {
    title,
    description: description$5,
    image: "/img/hero_blog_01.jpg"
  }, {}, {})}
${validate_component(Layout_Main, "Layout_Main").$$render($$result, {id: "pages"}, {}, {})}`;
});
var index$5 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: Immigration_information
});
var Block_Languages_svelte = ".languages.svelte-1qpqdmg{display:block;padding:var(--padding);text-align:center}.languages-inner.svelte-1qpqdmg{padding:50px 20px 100px;padding:50px var(--padding-inner,20px) 100px;margin:0 auto;max-width:var(--content-constrain)}h2.svelte-1qpqdmg{font-size:var(--extralarge-fontsize)}hr.svelte-1qpqdmg{border-bottom:2px solid var(--color-white)}";
const css$b = {
  code: ".languages.svelte-1qpqdmg{display:block;padding:var(--padding);text-align:center}.languages-inner.svelte-1qpqdmg{padding:50px 20px 100px;padding:50px var(--padding-inner,20px) 100px;margin:0 auto;max-width:var(--content-constrain)}h2.svelte-1qpqdmg{font-size:var(--extralarge-fontsize)}hr.svelte-1qpqdmg{border-bottom:2px solid var(--color-white)}",
  map: `{"version":3,"file":"Block_Languages.svelte","sources":["Block_Languages.svelte"],"sourcesContent":["<div {id} class={blockclass}>\\n\\t<div class=\\"languages-inner\\">\\n\\t\\t<h2>Languages</h2>\\n\\t\\t<p>\\n\\t\\t\\tIf you are looking to translate our site, please choose a language\\n\\t\\t\\tfrom the options below. Google will automatically translate the page\\n\\t\\t\\tfor you.\\n\\t\\t</p>\\n\\t\\t<hr />\\n\\t\\t<h3>Convert Language With Google</h3>\\n\\t\\t<div>\\n\\t\\t\\t<button on:click={translate('es')} title=\\"Traducir al espa\xF1ol\\">\\n\\t\\t\\t\\tEspa\xF1ol\\n\\t\\t\\t</button>\\n\\t\\t\\t<button on:click={translate('fr')} title=\\"Traduire en Fran\xE7ais\\">\\n\\t\\t\\t\\tFran\xE7ais\\n\\t\\t\\t</button>\\n\\t\\t\\t<button on:click={translate('fr')} title=\\"Traduz para o portugu\xEAs\\">\\n\\t\\t\\t\\tPortugu\xEAs\\n\\t\\t\\t</button>\\n\\t\\t\\t<button on:click={translate('zh-CN')} title=\\"\u7FFB\u8BD1\u6210\u4E2D\u6587\\">\\n\\t\\t\\t\\t\u4E2D\u56FD\u4EBA\\n\\t\\t\\t</button>\\n\\t\\t\\t<button on:click={translate('ja')} title=\\"\u65E5\u672C\u8A9E\u306B\u7FFB\u8A33\\">\\n\\t\\t\\t\\t\u65E5\u672C\u8A9E\\n\\t\\t\\t</button>\\n\\t\\t\\t<button on:click={translate('ko')} title=\\"\uD55C\uAD6D\uC5B4\uB85C \uBC88\uC5ED\\">\\n\\t\\t\\t\\t\uD55C\uAD6D\uC5B4\\n\\t\\t\\t</button>\\n\\t\\t\\t<button on:click={translate('hi')} title=\\"\u0939\u093F\u0902\u0926\u0940 \u092E\u0947\u0902 \u0905\u0928\u0941\u0935\u093E\u0926 \u0915\u0930\u0947\u0902\\">\\n\\t\\t\\t\\t\u0939\u093F\u0902\u0926\u0940\\n\\t\\t\\t</button>\\n\\t\\t\\t<button on:click={translate('ar')} title=\\"\u062A\u0631\u062C\u0645\u0629 \u0627\u0644\u0649 \u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629\\">\\n\\t\\t\\t\\t\u0639\u0631\u0628\u0649\\n\\t\\t\\t</button>\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<script>function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount, onDestroy } from 'svelte';\\n/* ## Variables ## */\\n\\nvar id;\\nvar blockstyle = '';\\nvar blockclass = 'languages';\\n\\n$: blockclass = \\"languages \\" + blockstyle;\\n\\nvar translate = lang => {};\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  translate = lang => {\\n    window.location.href = \\"https://translate.google.com/translate?sl=auto&tl=\\" + lang + \\"&u=\\" + window.location.href;\\n  };\\n}));\\n/* ## Exports ## */\\n\\nexport { id, blockstyle };</script>\\n\\n<style>.languages{display:block;padding:var(--padding);text-align:center}.languages-inner{padding:50px 20px 100px;padding:50px var(--padding-inner,20px) 100px;margin:0 auto;max-width:var(--content-constrain)}h2{font-size:var(--extralarge-fontsize)}hr{border-bottom:2px solid var(--color-white)}</style>\\n"],"names":[],"mappings":"AAgEO,yBAAU,CAAC,QAAQ,KAAK,CAAC,QAAQ,IAAI,SAAS,CAAC,CAAC,WAAW,MAAM,CAAC,+BAAgB,CAAC,QAAQ,IAAI,CAAC,IAAI,CAAC,KAAK,CAAC,QAAQ,IAAI,CAAC,IAAI,eAAe,CAAC,IAAI,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,IAAI,mBAAmB,CAAC,CAAC,iBAAE,CAAC,UAAU,IAAI,qBAAqB,CAAC,CAAC,iBAAE,CAAC,cAAc,GAAG,CAAC,KAAK,CAAC,IAAI,aAAa,CAAC,CAAC"}`
};
function asyncGeneratorStep$d(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$d(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$d(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$d(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Block_Languages = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var {id} = $$props;
  var {blockstyle = ""} = $$props;
  var blockclass = "languages";
  onMount(/* @__PURE__ */ _asyncToGenerator$d(function* () {
  }));
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  $$result.css.add(css$b);
  blockclass = "languages " + blockstyle;
  return `<div${add_attribute("id", id, 0)} class="${escape(null_to_empty(blockclass)) + " svelte-1qpqdmg"}"><div class="${"languages-inner svelte-1qpqdmg"}"><h2 class="${"svelte-1qpqdmg"}">Languages</h2>
		<p>If you are looking to translate our site, please choose a language
			from the options below. Google will automatically translate the page
			for you.
		</p>
		<hr class="${"svelte-1qpqdmg"}">
		<h3>Convert Language With Google</h3>
		<div><button title="${"Traducir al espa\xF1ol"}">Espa\xF1ol
			</button>
			<button title="${"Traduire en Fran\xE7ais"}">Fran\xE7ais
			</button>
			<button title="${"Traduz para o portugu\xEAs"}">Portugu\xEAs
			</button>
			<button title="${"\u7FFB\u8BD1\u6210\u4E2D\u6587"}">\u4E2D\u56FD\u4EBA
			</button>
			<button title="${"\u65E5\u672C\u8A9E\u306B\u7FFB\u8A33"}">\u65E5\u672C\u8A9E
			</button>
			<button title="${"\uD55C\uAD6D\uC5B4\uB85C \uBC88\uC5ED"}">\uD55C\uAD6D\uC5B4
			</button>
			<button title="${"\u0939\u093F\u0902\u0926\u0940 \u092E\u0947\u0902 \u0905\u0928\u0941\u0935\u093E\u0926 \u0915\u0930\u0947\u0902"}">\u0939\u093F\u0902\u0926\u0940
			</button>
			<button title="${"\u062A\u0631\u062C\u0645\u0629 \u0627\u0644\u0649 \u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629"}">\u0639\u0631\u0628\u0649
			</button></div></div>
</div>`;
});
var _page_id__svelte = ".blog-topbar.svelte-k5git7.svelte-k5git7{position:relative;margin:-20px 0 20px}.breadcrumbs.svelte-k5git7.svelte-k5git7{font-size:var(--small-fontsize)}.breadcrumbs.svelte-k5git7 a.svelte-k5git7{color:var(--color-black)}.breadcrumbs.svelte-k5git7 a.svelte-k5git7:hover{color:var(--color-four)}";
const css$1$3 = {
  code: ".blog-topbar.svelte-k5git7.svelte-k5git7{position:relative;margin:-20px 0 20px}.breadcrumbs.svelte-k5git7.svelte-k5git7{font-size:var(--small-fontsize)}.breadcrumbs.svelte-k5git7 a.svelte-k5git7{color:var(--color-black)}.breadcrumbs.svelte-k5git7 a.svelte-k5git7:hover{color:var(--color-four)}",
  map: `{"version":3,"file":"[page_id].svelte","sources":["[page_id].svelte"],"sourcesContent":["<svelte:head>\\n\\t{#each blog_css as css}\\n\\t\\t<link\\n\\t\\t\\tasync\\n\\t\\t\\thref={ (css.src.startsWith('http')) ? \`\${css.src}\` : \`\${$milk.site.admin_url}\${css.src}\` }\\n\\t\\t\\trel=\\"preload\\"\\n\\t\\t\\tas=\\"style\\"\\n\\t\\t/>\\n\\t\\t<link\\n\\t\\t\\tasync\\n\\t\\t\\thref={ (css.src.startsWith('http')) ? \`\${css.src}\` : \`\${$milk.site.admin_url}\${css.src}\` }\\n\\t\\t\\trel=\\"stylesheet\\"\\n\\t\\t/>\\n\\t{/each}\\n\\t{#each blog_scripts as script}\\n\\t\\t<script\\n\\t\\t\\tdefer\\n\\t\\t\\tsrc={ (script.src.startsWith('http')) ? \`\${script.src}\` : \`\${$milk.site.admin_url}\${script.src}\` }\\n\\t\\t/>\\n\\t{/each}\\n\\t<link rel=\\"stylesheet\\" href={themestyle} />\\n</svelte:head>\\n\\n<Head_Language lang=\\"en\\" />\\n<Head_HTML {title} {description} keywords={$milk?.site?.keywords} />\\n<Head_Facebook {title} {description} {image} />\\n<Head_Twitter {title} {description} {image} />\\n<Layout_Main id=\\"blog-post\\">\\n\\t{#each blog_pages as blog_page}\\n\\t\\t<Head_Article author={blog_page?.author?.node?.name} pubdate={blog_page?.date} />\\n\\t\\t<Hero\\n\\t\\t\\tid=\\"blog-post-hero\\"\\n\\t\\t\\timage_url={blog_page?.featuredImage?.node?.sourceUrl}\\n\\t\\t\\timg_srcset={blog_page?.featuredImage?.node?.srcSet}\\n\\t\\t\\tavif_srcset=\\"\\"\\n\\t\\t\\twebp_srcset=\\"\\"\\n\\t\\t\\ttitle=\\"Harlan York and Associates\\"\\n\\t\\t\\tparallax=\\"false\\">&nbsp;</Hero\\n\\t\\t>\\n\\t\\t<Block_CallOutText\\n\\t\\t\\tid=\\"call-out-text\\"\\n\\t\\t\\tblockstyle=\\"block-style01\\"\\n\\t\\t\\textraclasses=\\"floating-calltoaction\\"\\n\\t\\t\\ttitle={blog_page?.title}\\n\\t\\t>\\n\\t\\t\\t<div class=\\"callout-detials\\">\\n\\t\\t\\t\\tBy: {blog_page?.author?.node?.name}\\n\\t\\t\\t\\t&nbsp;&nbsp;|&nbsp;&nbsp;\\n\\t\\t\\t\\t{months[page_date.getMonth()]}\\n\\t\\t\\t\\t{page_date.getDate()},\\n\\t\\t\\t\\t{page_date.getFullYear()}\\n\\t\\t\\t</div>\\n\\t\\t</Block_CallOutText>\\n\\t\\t<div class=\\"content\\">\\n\\t\\t\\t<div class=\\"content-inner\\">\\n\\t\\t\\t\\t<div class=\\"blog-topbar\\">\\n\\t\\t\\t\\t\\t<div class=\\"breadcrumbs\\">\\n\\t\\t\\t\\t\\t\\t<a href=\\"/\\">Home</a>\\n\\t\\t\\t\\t\\t\\t\u203A\\n\\t\\t\\t\\t\\t\\t<a href={\`/immigration-information/\${blog_page?.pageId}\`}>{blog_page?.title}</a>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</div>\\t\\n\\t\\t\\t\\t{@html blog_page?.content}\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t{/each}\\n\\t<Block_Testimonials id=\\"testimonials\\" blockstyle=\\"block-style05\\" />\\n\\n\\t<Block_CallToAction\\n\\t\\tid=\\"call-to-action\\"\\n\\t\\tblockstyle=\\"block-style01\\"\\n\\t\\textraclasses=\\"regular-calltoaction\\"\\n\\t/>\\n\\t<Block_LanguagesWeSpeak />\\n\\t<Block_Languages id=\\"languages\\" blockstyle=\\"block-style04\\" />\\n\\t<Block_Featured id=\\"featured\\" blockstyle=\\"\\" />\\n\\t<Block_Ratings id=\\"ratings\\" blockstyle=\\"\\" />\\n\\t<SocialMedia id=\\"socialmedia\\" blockstyle=\\"\\" />\\n</Layout_Main>\\n\\n<script>var _$milk, _$milk$site, _$milk2, _$milk2$site, _$milk3, _$milk3$site;\\n\\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount, onDestroy } from 'svelte';\\nimport { page } from '$app/stores';\\n/* ## MILK ## */\\n\\nimport { milk } from '$milk/milk.js';\\n/* ## Components ## */\\n\\nimport Head_Language from '$milk/lib/Head_Language.svelte';\\nimport Head_HTML from '$milk/lib/Head_HTML.svelte';\\nimport Head_Facebook from '$milk/lib/Head_Facebook.svelte';\\nimport Head_Twitter from '$milk/lib/Head_Twitter.svelte';\\nimport Head_Article from '$milk/lib/Head_Article.svelte';\\nimport Layout_Main from '$theme/Layout_Main.svelte';\\nimport Hero from '$milk/lib/Hero.svelte';\\nimport Block_CallOutText from '$theme/Block_CallOutText.svelte';\\nimport Block_ServicesList from '$theme/Block_ServicesList.svelte';\\nimport Block_CallToAction from '$theme/Block_CallToAction.svelte';\\nimport Block_LanguagesWeSpeak from '$theme/Block_LanguagesWeSpeak.svelte';\\nimport Block_Languages from '$theme/Block_Languages.svelte';\\nimport Block_Testimonials from '$theme/Block_Testimonials.svelte';\\nimport Block_Featured from '$theme/Block_Featured.svelte';\\nimport SocialMedia from '$milk/lib/SocialMedia.svelte';\\nimport Block_Ratings from '$theme/Block_Ratings.svelte';\\n/* ## Variables ## */\\n\\nvar title = \\"Immigration Services - \\" + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.title);\\nvar description = (_$milk2 = $milk) == null ? void 0 : (_$milk2$site = _$milk2.site) == null ? void 0 : _$milk2$site.description;\\nvar image = (_$milk3 = $milk) == null ? void 0 : (_$milk3$site = _$milk3.site) == null ? void 0 : _$milk3$site.facebook_photo;\\nvar page_id = $page.params.slug;\\nvar themestyle = '';\\n\\n$: themestyle = \\"/themes/\\" + $milk.config.theme + \\"/style.css\\";\\n/* ## Data Loading ## */\\n\\n\\nvar unsubscribe = () => {};\\n\\nvar blog_pages = [];\\nvar blog_css = [];\\nvar blog_scripts = [];\\nvar page_date = new Date();\\nvar months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];\\nimport { Q_GET_PAGE_BYID } from '$graphql/wordpress.graphql.js';\\n/* ## Main ## */\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  var _$milk4, _$milk4$data;\\n\\n  page_id = parseInt(window.location.href.substring(window.location.href.lastIndexOf('/') + 1));\\n  var queryVariables = {\\n    id: page_id\\n  };\\n  var getPost = (_$milk4 = $milk) == null ? void 0 : (_$milk4$data = _$milk4.data) == null ? void 0 : _$milk4$data.gql(Q_GET_PAGE_BYID, $milk.data.sources.wordpress, queryVariables, false, 0);\\n  unsubscribe = yield getPost == null ? void 0 : getPost.subscribe( /*#__PURE__*/function () {\\n    var _ref2 = _asyncToGenerator(function* (fetched_data) {\\n      var _data$pageBy, _data$pageBy2, _data$pageBy2$enqueue, _data$pageBy3, _data$pageBy3$enqueue, _data$featuredImage, _data$featuredImage$n;\\n\\n      var data = yield fetched_data;\\n      page_date = new Date(data == null ? void 0 : (_data$pageBy = data.pageBy) == null ? void 0 : _data$pageBy.date);\\n      blog_css = (data == null ? void 0 : (_data$pageBy2 = data.pageBy) == null ? void 0 : (_data$pageBy2$enqueue = _data$pageBy2.enqueuedStylesheets) == null ? void 0 : _data$pageBy2$enqueue.nodes) || [];\\n      blog_scripts = (data == null ? void 0 : (_data$pageBy3 = data.pageBy) == null ? void 0 : (_data$pageBy3$enqueue = _data$pageBy3.enqueuedScripts) == null ? void 0 : _data$pageBy3$enqueue.nodes) || [];\\n      blog_pages = [data == null ? void 0 : data.pageBy];\\n      title = data == null ? void 0 : data.title;\\n      description = data == null ? void 0 : data.excerpt;\\n      image = data == null ? void 0 : (_data$featuredImage = data.featuredImage) == null ? void 0 : (_data$featuredImage$n = _data$featuredImage.node) == null ? void 0 : _data$featuredImage$n.sourceUrl;\\n    });\\n\\n    return function (_x) {\\n      return _ref2.apply(this, arguments);\\n    };\\n  }());\\n}));\\n/* ## Exit ## */\\n\\nonDestroy(() => {\\n  unsubscribe(); // important for garbage collection otherwise memory leak\\n});\\nexport { page_id };</script>\\n\\n<style>.blog-topbar{position:relative;margin:-20px 0 20px}.breadcrumbs{font-size:var(--small-fontsize)}.breadcrumbs a{color:var(--color-black)}.breadcrumbs a:hover{color:var(--color-four)}</style>\\n"],"names":[],"mappings":"AAsKO,wCAAY,CAAC,SAAS,QAAQ,CAAC,OAAO,KAAK,CAAC,CAAC,CAAC,IAAI,CAAC,wCAAY,CAAC,UAAU,IAAI,gBAAgB,CAAC,CAAC,0BAAY,CAAC,eAAC,CAAC,MAAM,IAAI,aAAa,CAAC,CAAC,0BAAY,CAAC,eAAC,MAAM,CAAC,MAAM,IAAI,YAAY,CAAC,CAAC"}`
};
function asyncGeneratorStep$c(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$c(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$c(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$c(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const U5Bpage_idu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a;
  let $milk, $$unsubscribe_milk;
  let $page, $$unsubscribe_page;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  var _$milk, _$milk$site, _$milk2, _$milk2$site, _$milk3, _$milk3$site;
  var title = "Immigration Services - " + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.title);
  var description2 = (_$milk2 = $milk) == null ? void 0 : (_$milk2$site = _$milk2.site) == null ? void 0 : _$milk2$site.description;
  var image = (_$milk3 = $milk) == null ? void 0 : (_$milk3$site = _$milk3.site) == null ? void 0 : _$milk3$site.facebook_photo;
  var {page_id = $page.params.slug} = $$props;
  var themestyle = "";
  var unsubscribe = () => {
  };
  var blog_pages = [];
  var blog_css = [];
  var blog_scripts = [];
  var page_date = new Date();
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  onMount(/* @__PURE__ */ _asyncToGenerator$c(function* () {
    var _$milk4, _$milk4$data;
    page_id = parseInt(window.location.href.substring(window.location.href.lastIndexOf("/") + 1));
    var queryVariables = {id: page_id};
    var getPost = (_$milk4 = $milk) == null ? void 0 : (_$milk4$data = _$milk4.data) == null ? void 0 : _$milk4$data.gql(Q_GET_PAGE_BYID, $milk.data.sources.wordpress, queryVariables, false, 0);
    unsubscribe = yield getPost == null ? void 0 : getPost.subscribe(/* @__PURE__ */ function() {
      var _ref2 = _asyncToGenerator$c(function* (fetched_data) {
        var _data$pageBy, _data$pageBy2, _data$pageBy2$enqueue, _data$pageBy3, _data$pageBy3$enqueue, _data$featuredImage, _data$featuredImage$n;
        var data = yield fetched_data;
        page_date = new Date(data == null ? void 0 : (_data$pageBy = data.pageBy) == null ? void 0 : _data$pageBy.date);
        blog_css = (data == null ? void 0 : (_data$pageBy2 = data.pageBy) == null ? void 0 : (_data$pageBy2$enqueue = _data$pageBy2.enqueuedStylesheets) == null ? void 0 : _data$pageBy2$enqueue.nodes) || [];
        blog_scripts = (data == null ? void 0 : (_data$pageBy3 = data.pageBy) == null ? void 0 : (_data$pageBy3$enqueue = _data$pageBy3.enqueuedScripts) == null ? void 0 : _data$pageBy3$enqueue.nodes) || [];
        blog_pages = [data == null ? void 0 : data.pageBy];
        title = data == null ? void 0 : data.title;
        description2 = data == null ? void 0 : data.excerpt;
        image = data == null ? void 0 : (_data$featuredImage = data.featuredImage) == null ? void 0 : (_data$featuredImage$n = _data$featuredImage.node) == null ? void 0 : _data$featuredImage$n.sourceUrl;
      });
      return function(_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  }));
  onDestroy(() => {
    unsubscribe();
  });
  if ($$props.page_id === void 0 && $$bindings.page_id && page_id !== void 0)
    $$bindings.page_id(page_id);
  $$result.css.add(css$1$3);
  themestyle = "/themes/" + $milk.config.theme + "/style.css";
  $$unsubscribe_milk();
  $$unsubscribe_page();
  return `${$$result.head += `${each(blog_css, (css2) => `<link async${add_attribute("href", css2.src.startsWith("http") ? `${css2.src}` : `${$milk.site.admin_url}${css2.src}`, 0)} rel="${"preload"}" as="${"style"}" data-svelte="svelte-1eol1zw">
		<link async${add_attribute("href", css2.src.startsWith("http") ? `${css2.src}` : `${$milk.site.admin_url}${css2.src}`, 0)} rel="${"stylesheet"}" data-svelte="svelte-1eol1zw">`)}${each(blog_scripts, (script) => `<script defer${add_attribute("src", script.src.startsWith("http") ? `${script.src}` : `${$milk.site.admin_url}${script.src}`, 0)} data-svelte="svelte-1eol1zw"></script>`)}<link rel="${"stylesheet"}"${add_attribute("href", themestyle, 0)} data-svelte="svelte-1eol1zw">`, ""}

${validate_component(Head_Language, "Head_Language").$$render($$result, {lang: "en"}, {}, {})}
${validate_component(Head_HTML, "Head_HTML").$$render($$result, {
    title,
    description: description2,
    keywords: (_a = $milk == null ? void 0 : $milk.site) == null ? void 0 : _a.keywords
  }, {}, {})}
${validate_component(Head_Facebook, "Head_Facebook").$$render($$result, {title, description: description2, image}, {}, {})}
${validate_component(Head_Twitter, "Head_Twitter").$$render($$result, {title, description: description2, image}, {}, {})}
${validate_component(Layout_Main, "Layout_Main").$$render($$result, {id: "blog-post"}, {}, {
    default: () => `${each(blog_pages, (blog_page) => {
      var _a2, _b, _c, _d, _e, _f;
      return `${validate_component(Head_Article, "Head_Article").$$render($$result, {
        author: (_b = (_a2 = blog_page == null ? void 0 : blog_page.author) == null ? void 0 : _a2.node) == null ? void 0 : _b.name,
        pubdate: blog_page == null ? void 0 : blog_page.date
      }, {}, {})}
		${validate_component(Hero, "Hero").$$render($$result, {
        id: "blog-post-hero",
        image_url: (_d = (_c = blog_page == null ? void 0 : blog_page.featuredImage) == null ? void 0 : _c.node) == null ? void 0 : _d.sourceUrl,
        img_srcset: (_f = (_e = blog_page == null ? void 0 : blog_page.featuredImage) == null ? void 0 : _e.node) == null ? void 0 : _f.srcSet,
        avif_srcset: "",
        webp_srcset: "",
        title: "Harlan York and Associates",
        parallax: "false"
      }, {}, {})}
		${validate_component(Block_CallOutText, "Block_CallOutText").$$render($$result, {
        id: "call-out-text",
        blockstyle: "block-style01",
        extraclasses: "floating-calltoaction",
        title: blog_page == null ? void 0 : blog_page.title
      }, {}, {
        default: () => {
          var _a3, _b2;
          return `<div class="${"callout-detials"}">By: ${escape((_b2 = (_a3 = blog_page == null ? void 0 : blog_page.author) == null ? void 0 : _a3.node) == null ? void 0 : _b2.name)}
				\xA0\xA0|\xA0\xA0
				${escape(months[page_date.getMonth()])}
				${escape(page_date.getDate())},
				${escape(page_date.getFullYear())}</div>
		`;
        }
      })}
		<div class="${"content"}"><div class="${"content-inner"}"><div class="${"blog-topbar svelte-k5git7"}"><div class="${"breadcrumbs svelte-k5git7"}"><a href="${"/"}" class="${"svelte-k5git7"}">Home</a>
						\u203A
						<a${add_attribute("href", `/immigration-information/${blog_page == null ? void 0 : blog_page.pageId}`, 0)} class="${"svelte-k5git7"}">${escape(blog_page == null ? void 0 : blog_page.title)}</a>
					</div></div>	
				${blog_page == null ? void 0 : blog_page.content}</div>
		</div>`;
    })}
	${validate_component(Block_Testimonials, "Block_Testimonials").$$render($$result, {
      id: "testimonials",
      blockstyle: "block-style05"
    }, {}, {})}

	${validate_component(Block_CallToAction, "Block_CallToAction").$$render($$result, {
      id: "call-to-action",
      blockstyle: "block-style01",
      extraclasses: "regular-calltoaction"
    }, {}, {})}
	${validate_component(Block_LanguagesWeSpeak, "Block_LanguagesWeSpeak").$$render($$result, {}, {}, {})}
	${validate_component(Block_Languages, "Block_Languages").$$render($$result, {
      id: "languages",
      blockstyle: "block-style04"
    }, {}, {})}
	${validate_component(Block_Featured, "Block_Featured").$$render($$result, {id: "featured", blockstyle: ""}, {}, {})}
	${validate_component(Block_Ratings, "Block_Ratings").$$render($$result, {id: "ratings", blockstyle: ""}, {}, {})}
	${validate_component(SocialMedia, "SocialMedia").$$render($$result, {id: "socialmedia", blockstyle: ""}, {}, {})}`
  })}`;
});
var _page_id_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: U5Bpage_idu5D
});
var Block_Attorneys_svelte = '.attorneys.svelte-1iqzwc1.svelte-1iqzwc1{display:block;padding:100px 0;text-align:center}.inner-attorney-wrap.svelte-1iqzwc1.svelte-1iqzwc1{margin:0 auto;max-width:var(--content-constrain)}.attorneys-list.svelte-1iqzwc1.svelte-1iqzwc1{margin-top:-100px}@media screen and (min-width:650px){.attorneys-list.svelte-1iqzwc1.svelte-1iqzwc1{text-align:left}}.attorney.svelte-1iqzwc1.svelte-1iqzwc1{padding:var(--padding-large)}.attorney.svelte-1iqzwc1 img.svelte-1iqzwc1{margin:0 var(--padding-large) var(--padding-large)}.attorney.svelte-1iqzwc1.svelte-1iqzwc1:nth-child(2n){background:var(--color-offwhite)}@media screen and (min-width:650px){.attorney.svelte-1iqzwc1:nth-child(2n) img.svelte-1iqzwc1{float:right;margin:0 0 var(--padding-large) var(--padding-large)}.attorney.svelte-1iqzwc1:nth-child(odd) img.svelte-1iqzwc1{float:left;margin:0 var(--padding-large) var(--padding-large) 0}}.attorney.svelte-1iqzwc1.svelte-1iqzwc1:after{content:"";display:block;clear:both}.attorney.svelte-1iqzwc1 .email.svelte-1iqzwc1{position:relative;margin:-10px 0 10px}.attorney.svelte-1iqzwc1 .email a.svelte-1iqzwc1{color:var(--color-one)}details.svelte-1iqzwc1.svelte-1iqzwc1{max-width:unset!important;overflow:hidden}summary.svelte-1iqzwc1.svelte-1iqzwc1{background:transparent;color:var(--color-black);cursor:pointer;padding:1rem 0}.attorney.svelte-1iqzwc1:nth-child(2n) summary.svelte-1iqzwc1{background:var(--color-offwhite)}summary.svelte-1iqzwc1.svelte-1iqzwc1:before{content:""}summary.svelte-1iqzwc1 span.svelte-1iqzwc1{cursor:pointer;text-transform:uppercase;font-weight:700;display:inline-block;width:auto;position:relative}summary.svelte-1iqzwc1 .less.svelte-1iqzwc1{display:none}details[open].svelte-1iqzwc1 summary .less.svelte-1iqzwc1{display:inline-block}details[open].svelte-1iqzwc1 summary .more.svelte-1iqzwc1{display:none}details.svelte-1iqzwc1 .content.svelte-1iqzwc1{border:0}summary.svelte-1iqzwc1 span.svelte-1iqzwc1:after{height:2px;background-color:transparent;position:absolute;content:"";width:0;margin:0 50%;display:block;bottom:0;left:0;transition:margin .5s,width .5s,opacity .5s,color .5s,background-color .5s}summary.svelte-1iqzwc1:hover span.svelte-1iqzwc1:after{margin:0 -10%;width:120%;opacity:1;background-color:var(--color-three)}';
const css$a = {
  code: '.attorneys.svelte-1iqzwc1.svelte-1iqzwc1{display:block;padding:100px 0;text-align:center}.inner-attorney-wrap.svelte-1iqzwc1.svelte-1iqzwc1{margin:0 auto;max-width:var(--content-constrain)}.attorneys-list.svelte-1iqzwc1.svelte-1iqzwc1{margin-top:-100px}@media screen and (min-width:650px){.attorneys-list.svelte-1iqzwc1.svelte-1iqzwc1{text-align:left}}.attorney.svelte-1iqzwc1.svelte-1iqzwc1{padding:var(--padding-large)}.attorney.svelte-1iqzwc1 img.svelte-1iqzwc1{margin:0 var(--padding-large) var(--padding-large)}.attorney.svelte-1iqzwc1.svelte-1iqzwc1:nth-child(2n){background:var(--color-offwhite)}@media screen and (min-width:650px){.attorney.svelte-1iqzwc1:nth-child(2n) img.svelte-1iqzwc1{float:right;margin:0 0 var(--padding-large) var(--padding-large)}.attorney.svelte-1iqzwc1:nth-child(odd) img.svelte-1iqzwc1{float:left;margin:0 var(--padding-large) var(--padding-large) 0}}.attorney.svelte-1iqzwc1.svelte-1iqzwc1:after{content:"";display:block;clear:both}.attorney.svelte-1iqzwc1 .email.svelte-1iqzwc1{position:relative;margin:-10px 0 10px}.attorney.svelte-1iqzwc1 .email a.svelte-1iqzwc1{color:var(--color-one)}details.svelte-1iqzwc1.svelte-1iqzwc1{max-width:unset!important;overflow:hidden}summary.svelte-1iqzwc1.svelte-1iqzwc1{background:transparent;color:var(--color-black);cursor:pointer;padding:1rem 0}.attorney.svelte-1iqzwc1:nth-child(2n) summary.svelte-1iqzwc1{background:var(--color-offwhite)}summary.svelte-1iqzwc1.svelte-1iqzwc1:before{content:""}summary.svelte-1iqzwc1 span.svelte-1iqzwc1{cursor:pointer;text-transform:uppercase;font-weight:700;display:inline-block;width:auto;position:relative}summary.svelte-1iqzwc1 .less.svelte-1iqzwc1{display:none}details[open].svelte-1iqzwc1 summary .less.svelte-1iqzwc1{display:inline-block}details[open].svelte-1iqzwc1 summary .more.svelte-1iqzwc1{display:none}details.svelte-1iqzwc1 .content.svelte-1iqzwc1{border:0}summary.svelte-1iqzwc1 span.svelte-1iqzwc1:after{height:2px;background-color:transparent;position:absolute;content:"";width:0;margin:0 50%;display:block;bottom:0;left:0;transition:margin .5s,width .5s,opacity .5s,color .5s,background-color .5s}summary.svelte-1iqzwc1:hover span.svelte-1iqzwc1:after{margin:0 -10%;width:120%;opacity:1;background-color:var(--color-three)}',
  map: `{"version":3,"file":"Block_Attorneys.svelte","sources":["Block_Attorneys.svelte"],"sourcesContent":["<div {id} class={blockclass}>\\n\\t<div class=\\"attorneys-inner\\">\\n\\t\\t<div class=\\"attorneys-list\\">\\n\\t\\t\\t{#each attorneys as attorney}\\n\\t\\t\\t\\t<div class=\\"attorney outer-wrap\\" id={attorney?.slug}>\\n\\t\\t\\t\\t\\t<div class=\\"inner-attorney-wrap\\">\\n\\t\\t\\t\\t\\t\\t<div>\\n\\t\\t\\t\\t\\t\\t\\t<picture>\\n\\t\\t\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"image/avif\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tsrcset={attorney?.Attorney?.avifImage\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"image/webp\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tsrcset={attorney?.Attorney?.webpImage\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tsrc={attorney?.Attorney?.pngImage\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\talt={attorney?.title}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\twidth=\\"260\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\theight=\\"260\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t</picture>\\n\\t\\t\\t\\t\\t\\t\\t<h2 class=\\"name\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t{attorney?.title}\\n\\t\\t\\t\\t\\t\\t\\t</h2>\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"email\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t<a href={\`mailto:\${attorney?.Attorney?.email}\`}>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t{attorney?.Attorney?.email}\\n\\t\\t\\t\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t<div>\\n\\t\\t\\t\\t\\t\\t\\t\\t{@html attorney?.Attorney?.shortDescription}\\n\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t<div>\\n\\t\\t\\t\\t\\t\\t\\t<details>\\n\\t\\t\\t\\t\\t\\t\\t\\t<summary>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<span class=\\"more\\">Show More</span>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<span class=\\"less\\">Show Less</span>\\n\\t\\t\\t\\t\\t\\t\\t\\t</summary>\\n\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"content\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t{@html attorney?.Attorney\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t?.additionalDescription}\\n\\t\\t\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t\\t</details>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t{/each}\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<script>function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount, onDestroy } from 'svelte';\\n/* ## MILK ## */\\n\\nimport { milk } from '$milk/milk.js';\\nimport { scrollToHash } from '$milk/util/scroll.js';\\nvar id;\\nvar blockstyle = '';\\nvar blockclass = 'attorneys';\\n\\n$: blockclass = \\"attorneys \\" + blockstyle;\\n/* ## Data Loading ## */\\n\\n\\nimport { preload_attorneys } from '$graphql/sitespecific.preload.js';\\nvar attorneys = preload_attorneys;\\n\\nvar unsubscribe_team = () => {};\\n\\nimport { Q_GET_TEAM } from '$graphql/sitespecific.graphql.js';\\n/* ## Main ## */\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  var _$milk, _$milk$data;\\n\\n  var queryVariables = {\\n    size: 10\\n  };\\n  var getTeam = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_TEAM, $milk.data.sources.wordpress, queryVariables);\\n  unsubscribe_team = yield getTeam == null ? void 0 : getTeam.subscribe( /*#__PURE__*/function () {\\n    var _ref2 = _asyncToGenerator(function* (fetched_data) {\\n      var data = yield fetched_data;\\n      attorneys = data.attorneys.nodes; // console.log(attorneys);\\n\\n      setTimeout(scrollToHash, 1000);\\n    });\\n\\n    return function (_x) {\\n      return _ref2.apply(this, arguments);\\n    };\\n  }());\\n}));\\n/* ## Exit ## */\\n\\nonDestroy(() => {\\n  unsubscribe_team(); // important for garbage collection otherwise memory leak\\n});\\n/* ## Exports ## */\\n\\nexport { id, blockstyle };</script>\\n\\n<style>.attorneys{display:block;padding:100px 0;text-align:center}.inner-attorney-wrap{margin:0 auto;max-width:var(--content-constrain)}.attorneys-list{margin-top:-100px}@media screen and (min-width:650px){.attorneys-list{text-align:left}}.attorney{padding:var(--padding-large)}.attorney img{margin:0 var(--padding-large) var(--padding-large)}.attorney:nth-child(2n){background:var(--color-offwhite)}@media screen and (min-width:650px){.attorney:nth-child(2n) img{float:right;margin:0 0 var(--padding-large) var(--padding-large)}.attorney:nth-child(odd) img{float:left;margin:0 var(--padding-large) var(--padding-large) 0}}.attorney:after{content:\\"\\";display:block;clear:both}.attorney .email{position:relative;margin:-10px 0 10px}.attorney .email a{color:var(--color-one)}details{max-width:unset!important;overflow:hidden}summary{background:transparent;color:var(--color-black);cursor:pointer;padding:1rem 0}.attorney:nth-child(2n) summary{background:var(--color-offwhite)}summary:before{content:\\"\\"}summary span{cursor:pointer;text-transform:uppercase;font-weight:700;display:inline-block;width:auto;position:relative}summary .less{display:none}details[open] summary .less{display:inline-block}details[open] summary .more{display:none}details .content{border:0}summary span:after{height:2px;background-color:transparent;position:absolute;content:\\"\\";width:0;margin:0 50%;display:block;bottom:0;left:0;transition:margin .5s,width .5s,opacity .5s,color .5s,background-color .5s}summary:hover span:after{margin:0 -10%;width:120%;opacity:1;background-color:var(--color-three)}</style>\\n"],"names":[],"mappings":"AAiHO,wCAAU,CAAC,QAAQ,KAAK,CAAC,QAAQ,KAAK,CAAC,CAAC,CAAC,WAAW,MAAM,CAAC,kDAAoB,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,IAAI,mBAAmB,CAAC,CAAC,6CAAe,CAAC,WAAW,MAAM,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,6CAAe,CAAC,WAAW,IAAI,CAAC,CAAC,uCAAS,CAAC,QAAQ,IAAI,eAAe,CAAC,CAAC,wBAAS,CAAC,kBAAG,CAAC,OAAO,CAAC,CAAC,IAAI,eAAe,CAAC,CAAC,IAAI,eAAe,CAAC,CAAC,uCAAS,WAAW,EAAE,CAAC,CAAC,WAAW,IAAI,gBAAgB,CAAC,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,wBAAS,WAAW,EAAE,CAAC,CAAC,kBAAG,CAAC,MAAM,KAAK,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,IAAI,eAAe,CAAC,CAAC,IAAI,eAAe,CAAC,CAAC,wBAAS,WAAW,GAAG,CAAC,CAAC,kBAAG,CAAC,MAAM,IAAI,CAAC,OAAO,CAAC,CAAC,IAAI,eAAe,CAAC,CAAC,IAAI,eAAe,CAAC,CAAC,CAAC,CAAC,CAAC,uCAAS,MAAM,CAAC,QAAQ,EAAE,CAAC,QAAQ,KAAK,CAAC,MAAM,IAAI,CAAC,wBAAS,CAAC,qBAAM,CAAC,SAAS,QAAQ,CAAC,OAAO,KAAK,CAAC,CAAC,CAAC,IAAI,CAAC,wBAAS,CAAC,MAAM,CAAC,gBAAC,CAAC,MAAM,IAAI,WAAW,CAAC,CAAC,qCAAO,CAAC,UAAU,KAAK,UAAU,CAAC,SAAS,MAAM,CAAC,qCAAO,CAAC,WAAW,WAAW,CAAC,MAAM,IAAI,aAAa,CAAC,CAAC,OAAO,OAAO,CAAC,QAAQ,IAAI,CAAC,CAAC,CAAC,wBAAS,WAAW,EAAE,CAAC,CAAC,sBAAO,CAAC,WAAW,IAAI,gBAAgB,CAAC,CAAC,qCAAO,OAAO,CAAC,QAAQ,EAAE,CAAC,sBAAO,CAAC,mBAAI,CAAC,OAAO,OAAO,CAAC,eAAe,SAAS,CAAC,YAAY,GAAG,CAAC,QAAQ,YAAY,CAAC,MAAM,IAAI,CAAC,SAAS,QAAQ,CAAC,sBAAO,CAAC,oBAAK,CAAC,QAAQ,IAAI,CAAC,OAAO,CAAC,IAAI,gBAAC,CAAC,OAAO,CAAC,oBAAK,CAAC,QAAQ,YAAY,CAAC,OAAO,CAAC,IAAI,gBAAC,CAAC,OAAO,CAAC,oBAAK,CAAC,QAAQ,IAAI,CAAC,sBAAO,CAAC,uBAAQ,CAAC,OAAO,CAAC,CAAC,sBAAO,CAAC,mBAAI,MAAM,CAAC,OAAO,GAAG,CAAC,iBAAiB,WAAW,CAAC,SAAS,QAAQ,CAAC,QAAQ,EAAE,CAAC,MAAM,CAAC,CAAC,OAAO,CAAC,CAAC,GAAG,CAAC,QAAQ,KAAK,CAAC,OAAO,CAAC,CAAC,KAAK,CAAC,CAAC,WAAW,MAAM,CAAC,GAAG,CAAC,KAAK,CAAC,GAAG,CAAC,OAAO,CAAC,GAAG,CAAC,KAAK,CAAC,GAAG,CAAC,gBAAgB,CAAC,GAAG,CAAC,sBAAO,MAAM,CAAC,mBAAI,MAAM,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,MAAM,IAAI,CAAC,QAAQ,CAAC,CAAC,iBAAiB,IAAI,aAAa,CAAC,CAAC"}`
};
function asyncGeneratorStep$b(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$b(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$b(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$b(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Block_Attorneys = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var {id} = $$props;
  var {blockstyle = ""} = $$props;
  var blockclass = "attorneys";
  var attorneys = preload_attorneys;
  var unsubscribe_team = () => {
  };
  onMount(/* @__PURE__ */ _asyncToGenerator$b(function* () {
    var _$milk, _$milk$data;
    var queryVariables = {size: 10};
    var getTeam = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_TEAM, $milk.data.sources.wordpress, queryVariables);
    unsubscribe_team = yield getTeam == null ? void 0 : getTeam.subscribe(/* @__PURE__ */ function() {
      var _ref2 = _asyncToGenerator$b(function* (fetched_data) {
        var data = yield fetched_data;
        attorneys = data.attorneys.nodes;
        setTimeout(scrollToHash, 1e3);
      });
      return function(_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  }));
  onDestroy(() => {
    unsubscribe_team();
  });
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  $$result.css.add(css$a);
  blockclass = "attorneys " + blockstyle;
  $$unsubscribe_milk();
  return `<div${add_attribute("id", id, 0)} class="${escape(null_to_empty(blockclass)) + " svelte-1iqzwc1"}"><div class="${"attorneys-inner"}"><div class="${"attorneys-list svelte-1iqzwc1"}">${each(attorneys, (attorney) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    return `<div class="${"attorney outer-wrap svelte-1iqzwc1"}"${add_attribute("id", attorney == null ? void 0 : attorney.slug, 0)}><div class="${"inner-attorney-wrap svelte-1iqzwc1"}"><div><picture><source type="${"image/avif"}"${add_attribute("srcset", (_b = (_a = attorney == null ? void 0 : attorney.Attorney) == null ? void 0 : _a.avifImage) == null ? void 0 : _b.sourceUrl, 0)}>
								<source type="${"image/webp"}"${add_attribute("srcset", (_d = (_c = attorney == null ? void 0 : attorney.Attorney) == null ? void 0 : _c.webpImage) == null ? void 0 : _d.sourceUrl, 0)}>
								<img${add_attribute("src", (_f = (_e = attorney == null ? void 0 : attorney.Attorney) == null ? void 0 : _e.pngImage) == null ? void 0 : _f.sourceUrl, 0)}${add_attribute("alt", attorney == null ? void 0 : attorney.title, 0)} loading="${"lazy"}" width="${"260"}" height="${"260"}" class="${"svelte-1iqzwc1"}"></picture>
							<h2 class="${"name"}">${escape(attorney == null ? void 0 : attorney.title)}</h2>
							<div class="${"email svelte-1iqzwc1"}"><a${add_attribute("href", `mailto:${(_g = attorney == null ? void 0 : attorney.Attorney) == null ? void 0 : _g.email}`, 0)} class="${"svelte-1iqzwc1"}">${escape((_h = attorney == null ? void 0 : attorney.Attorney) == null ? void 0 : _h.email)}
								</a></div>
							<div>${(_i = attorney == null ? void 0 : attorney.Attorney) == null ? void 0 : _i.shortDescription}
							</div></div>
						<div><details class="${"svelte-1iqzwc1"}"><summary class="${"svelte-1iqzwc1"}"><span class="${"more svelte-1iqzwc1"}">Show More</span>
									<span class="${"less svelte-1iqzwc1"}">Show Less</span></summary>
								<div class="${"content svelte-1iqzwc1"}">${(_j = attorney == null ? void 0 : attorney.Attorney) == null ? void 0 : _j.additionalDescription}
								</div></details>
						</div></div>
				</div>`;
  })}</div></div>
</div>`;
});
var Block_3DBook_svelte = ".books.svelte-1v2s5my.svelte-1v2s5my{display:block;padding:0;text-align:center}@media screen and (min-width:650px){.books.svelte-1v2s5my.svelte-1v2s5my{padding:50px 20px;padding:50px var(--padding-inner,20px)}}.books-inner.svelte-1v2s5my.svelte-1v2s5my{margin:0 auto;max-width:var(--content-constrain)}.book.svelte-1v2s5my.svelte-1v2s5my{text-align:center;padding:25px;margin-bottom:2em}@media screen and (min-width:450px){.book.svelte-1v2s5my.svelte-1v2s5my{text-align:left;display:grid;-moz-column-gap:2em;grid-column-gap:2em;column-gap:2em;grid-template-columns:30% 60%}}.book-img.svelte-1v2s5my.svelte-1v2s5my{position:relative}.book-img.svelte-1v2s5my img.svelte-1v2s5my{width:100%;height:auto;max-width:200px;margin-bottom:20px}.book-description.svelte-1v2s5my.svelte-1v2s5my{font-size:var(--small-fontsize);font-style:italic}h2.svelte-1v2s5my a.svelte-1v2s5my:hover{text-decoration:none}.books-list.svelte-1v2s5my.svelte-1v2s5my{margin:auto}@media screen and (min-width:650px){.books-list.svelte-1v2s5my.svelte-1v2s5my{position:relative;z-index:200;max-width:700px;text-align:center}}";
const css$9 = {
  code: ".books.svelte-1v2s5my.svelte-1v2s5my{display:block;padding:0;text-align:center}@media screen and (min-width:650px){.books.svelte-1v2s5my.svelte-1v2s5my{padding:50px 20px;padding:50px var(--padding-inner,20px)}}.books-inner.svelte-1v2s5my.svelte-1v2s5my{margin:0 auto;max-width:var(--content-constrain)}.book.svelte-1v2s5my.svelte-1v2s5my{text-align:center;padding:25px;margin-bottom:2em}@media screen and (min-width:450px){.book.svelte-1v2s5my.svelte-1v2s5my{text-align:left;display:grid;grid-column-gap:2em;-moz-column-gap:2em;column-gap:2em;grid-template-columns:30% 60%}}.book-img.svelte-1v2s5my.svelte-1v2s5my{position:relative}.book-img.svelte-1v2s5my img.svelte-1v2s5my{width:100%;height:auto;max-width:200px;margin-bottom:20px}.book-description.svelte-1v2s5my.svelte-1v2s5my{font-size:var(--small-fontsize);font-style:italic}h2.svelte-1v2s5my a.svelte-1v2s5my:hover{text-decoration:none}.books-list.svelte-1v2s5my.svelte-1v2s5my{margin:auto}@media screen and (min-width:650px){.books-list.svelte-1v2s5my.svelte-1v2s5my{position:relative;z-index:200;max-width:700px;text-align:center}}",
  map: `{"version":3,"file":"Block_3DBook.svelte","sources":["Block_3DBook.svelte"],"sourcesContent":["<div {id} class={blockclass}>\\n\\t<div class=\\"books-inner\\">\\n\\t\\t<div class=\\"books-list\\">\\n\\t\\t\\t<div class=\\"book block-style02\\">\\n\\t\\t\\t\\t<div class=\\"book-img\\">\\n\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\thref=\\"https://3degreesoflaw.com/\\"\\n\\t\\t\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\t\\t\\ttitle=\\"Purchase the Book\\"\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t<picture>\\n\\t\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"image/avif\\"\\n\\t\\t\\t\\t\\t\\t\\t\\tsrcset=\\"/img/harlans-3degree-book.avif\\"\\n\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"image/webp\\"\\n\\t\\t\\t\\t\\t\\t\\t\\tsrcset=\\"/img/harlans-3degree-book.webp\\"\\n\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\t\\t\\tsrc=\\"/img/harlans-3degree-book.jpg\\"\\n\\t\\t\\t\\t\\t\\t\\t\\talt=\\"Three Dregrees of Law\\"\\n\\t\\t\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\t\\t\\twidth=\\"359\\"\\n\\t\\t\\t\\t\\t\\t\\t\\theight=\\"595\\"\\n\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t</picture>\\n\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t<div class=\\"book-content\\">\\n\\t\\t\\t\\t\\t<h2>\\n\\t\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\t\\thref=\\"https://3degreesoflaw.com/\\"\\n\\t\\t\\t\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\t\\t\\t\\ttitle=\\"Purchase the Book\\"\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\tThree Dregrees of Law\\n\\t\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t\\t</h2>\\n\\t\\t\\t\\t\\t<div class=\\"book-description\\">\\n\\t\\t\\t\\t\\t\\t<h3>\\n\\t\\t\\t\\t\\t\\t\\tUNLOCKING THE SECRETS TO HAPPINESS IN THE LEGAL\\n\\t\\t\\t\\t\\t\\t\\tUNIVERSE\\n\\t\\t\\t\\t\\t\\t</h3>\\n\\t\\t\\t\\t\\t\\t<p>\\n\\t\\t\\t\\t\\t\\t\\t\u201CTo be happy and successful as a lawyer find a path\\n\\t\\t\\t\\t\\t\\t\\tthat you love, practice the best way you can, and\\n\\t\\t\\t\\t\\t\\t\\twork with compassion.\u201D Harlan York\\n\\t\\t\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t\\t\\t<p>\\n\\t\\t\\t\\t\\t\\t\\tNot just for law students or attorneys, Three\\n\\t\\t\\t\\t\\t\\t\\tDegrees of Law is for anyone who has ever questioned\\n\\t\\t\\t\\t\\t\\t\\twhat they do, and wondered how they could improve\\n\\t\\t\\t\\t\\t\\t\\tnot only their output, but also their own sense of\\n\\t\\t\\t\\t\\t\\t\\tsatisfaction. It lays down a road map for how to be\\n\\t\\t\\t\\t\\t\\t\\thappy, successful and fulfilled no matter your line\\n\\t\\t\\t\\t\\t\\t\\tof work.\\n\\t\\t\\t\\t\\t\\t</p>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t<div>\\n\\t\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\t\\thref=\\"https://3degreesoflaw.com/\\"\\n\\t\\t\\t\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"fancy-link\\"\\n\\t\\t\\t\\t\\t\\t\\ttitle=\\"Purchase the Book\\"\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t<span> Purchase the Book </span>\\n\\t\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<script>/* ## Variables ## */\\nvar id;\\nvar blockstyle = '';\\nvar blockclass = 'books';\\n\\n$: blockclass = \\"books \\" + blockstyle;\\n/* ## Exports ## */\\n\\n\\nexport { id, blockstyle };</script>\\n\\n<style>.books{display:block;padding:0;text-align:center}@media screen and (min-width:650px){.books{padding:50px 20px;padding:50px var(--padding-inner,20px)}}.books-inner{margin:0 auto;max-width:var(--content-constrain)}.book{text-align:center;padding:25px;margin-bottom:2em}@media screen and (min-width:450px){.book{text-align:left;display:grid;grid-column-gap:2em;-moz-column-gap:2em;column-gap:2em;grid-template-columns:30% 60%}}.book-img{position:relative}.book-img img{width:100%;height:auto;max-width:200px;margin-bottom:20px}.book-description{font-size:var(--small-fontsize);font-style:italic}h2 a:hover{text-decoration:none}.books-list{margin:auto}@media screen and (min-width:650px){.books-list{position:relative;z-index:200;max-width:700px;text-align:center}}</style>\\n"],"names":[],"mappings":"AAyFO,oCAAM,CAAC,QAAQ,KAAK,CAAC,QAAQ,CAAC,CAAC,WAAW,MAAM,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,oCAAM,CAAC,QAAQ,IAAI,CAAC,IAAI,CAAC,QAAQ,IAAI,CAAC,IAAI,eAAe,CAAC,IAAI,CAAC,CAAC,CAAC,0CAAY,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,IAAI,mBAAmB,CAAC,CAAC,mCAAK,CAAC,WAAW,MAAM,CAAC,QAAQ,IAAI,CAAC,cAAc,GAAG,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,mCAAK,CAAC,WAAW,IAAI,CAAC,QAAQ,IAAI,CAAC,gBAAgB,GAAG,CAAC,gBAAgB,GAAG,CAAC,WAAW,GAAG,CAAC,sBAAsB,GAAG,CAAC,GAAG,CAAC,CAAC,uCAAS,CAAC,SAAS,QAAQ,CAAC,wBAAS,CAAC,kBAAG,CAAC,MAAM,IAAI,CAAC,OAAO,IAAI,CAAC,UAAU,KAAK,CAAC,cAAc,IAAI,CAAC,+CAAiB,CAAC,UAAU,IAAI,gBAAgB,CAAC,CAAC,WAAW,MAAM,CAAC,iBAAE,CAAC,gBAAC,MAAM,CAAC,gBAAgB,IAAI,CAAC,yCAAW,CAAC,OAAO,IAAI,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,yCAAW,CAAC,SAAS,QAAQ,CAAC,QAAQ,GAAG,CAAC,UAAU,KAAK,CAAC,WAAW,MAAM,CAAC,CAAC"}`
};
const Block_3DBook = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var {id} = $$props;
  var {blockstyle = ""} = $$props;
  var blockclass = "books";
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  $$result.css.add(css$9);
  blockclass = "books " + blockstyle;
  return `<div${add_attribute("id", id, 0)} class="${escape(null_to_empty(blockclass)) + " svelte-1v2s5my"}"><div class="${"books-inner svelte-1v2s5my"}"><div class="${"books-list svelte-1v2s5my"}"><div class="${"book block-style02 svelte-1v2s5my"}"><div class="${"book-img svelte-1v2s5my"}"><a href="${"https://3degreesoflaw.com/"}" target="${"_blank"}" rel="${"noreferrer"}" title="${"Purchase the Book"}"><picture><source type="${"image/avif"}" srcset="${"/img/harlans-3degree-book.avif"}">
							<source type="${"image/webp"}" srcset="${"/img/harlans-3degree-book.webp"}">
							<img src="${"/img/harlans-3degree-book.jpg"}" alt="${"Three Dregrees of Law"}" loading="${"lazy"}" width="${"359"}" height="${"595"}" class="${"svelte-1v2s5my"}"></picture></a></div>
				<div class="${"book-content"}"><h2 class="${"svelte-1v2s5my"}"><a href="${"https://3degreesoflaw.com/"}" target="${"_blank"}" rel="${"noreferrer"}" title="${"Purchase the Book"}" class="${"svelte-1v2s5my"}">Three Dregrees of Law
						</a></h2>
					<div class="${"book-description svelte-1v2s5my"}"><h3>UNLOCKING THE SECRETS TO HAPPINESS IN THE LEGAL
							UNIVERSE
						</h3>
						<p>\u201CTo be happy and successful as a lawyer find a path
							that you love, practice the best way you can, and
							work with compassion.\u201D Harlan York
						</p>
						<p>Not just for law students or attorneys, Three
							Degrees of Law is for anyone who has ever questioned
							what they do, and wondered how they could improve
							not only their output, but also their own sense of
							satisfaction. It lays down a road map for how to be
							happy, successful and fulfilled no matter your line
							of work.
						</p></div>
					<div><a href="${"https://3degreesoflaw.com/"}" target="${"_blank"}" rel="${"noreferrer"}" class="${"fancy-link"}" title="${"Purchase the Book"}"><span>Purchase the Book </span></a></div></div></div></div></div>
</div>`;
});
var description$4 = "We understand Immigration Law. It is all we do. We have helped thousands of immigrants and their families get green cards, specialized visas, stop deportation, and handle just about any immigration related issue. Our immigration attorneys will answer your questions in a way that you can understand, without complicated legal jargon. We charge reasonable fees and our entire law firm works directly on your case.";
const Immigration_attorneys = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a;
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var _$milk, _$milk$site;
  var title = "Immigration Attorneys - " + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.title);
  $$unsubscribe_milk();
  return `${validate_component(Head_Language, "Head_Language").$$render($$result, {lang: "en"}, {}, {})}
${validate_component(Head_HTML, "Head_HTML").$$render($$result, {
    title,
    description: description$4,
    keywords: (_a = $milk == null ? void 0 : $milk.site) == null ? void 0 : _a.keywords
  }, {}, {})}
${validate_component(Head_Facebook, "Head_Facebook").$$render($$result, {
    title,
    description: description$4,
    image: "/img/hero_attorneys_01.jpg"
  }, {}, {})}
${validate_component(Head_Twitter, "Head_Twitter").$$render($$result, {
    title,
    description: description$4,
    image: "/img/hero_attorneys_01.jpg"
  }, {}, {})}
${validate_component(Layout_Main, "Layout_Main").$$render($$result, {id: "immigration-attorneys"}, {}, {
    default: () => `${validate_component(Hero, "Hero").$$render($$result, {
      id: "hero-immigration-attorneys-01",
      image_url: "/img/hero_attorneys_01.jpg",
      img_srcset: "/img/hero_attorneys_01.jpg",
      avif_srcset: "/img/hero_attorneys_01.avif",
      webp_srcset: "/img/hero_attorneys_01.webp",
      title: "Harlan York and Associates",
      parallax: "false"
    }, {}, {})}
	${validate_component(Block_CallOutText, "Block_CallOutText").$$render($$result, {
      id: "call-out-text",
      blockstyle: "block-style01",
      extraclasses: "floating-calltoaction",
      title: "Our Attorneys"
    }, {}, {
      default: () => `<p>${escape(description$4)}</p>`
    })}
	${validate_component(Block_Attorneys, "Block_Attorneys").$$render($$result, {id: "attorneys", blockstyle: ""}, {}, {})}
	${validate_component(Block_3DBook, "Block_3DBook").$$render($$result, {id: "3dbook-book", blockstyle: ""}, {}, {})}
	${validate_component(Block_CallToAction, "Block_CallToAction").$$render($$result, {
      id: "call-to-action",
      blockstyle: "block-style01",
      extraclasses: "regular-calltoaction"
    }, {}, {})}
	${validate_component(Block_LanguagesWeSpeak, "Block_LanguagesWeSpeak").$$render($$result, {}, {}, {})}
	${validate_component(Block_Featured, "Block_Featured").$$render($$result, {id: "featured", blockstyle: ""}, {}, {})}
	${validate_component(Block_Ratings, "Block_Ratings").$$render($$result, {id: "ratings", blockstyle: ""}, {}, {})}
	${validate_component(SocialMedia, "SocialMedia").$$render($$result, {id: "socialmedia", blockstyle: ""}, {}, {})}`
  })}`;
});
var index$4 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: Immigration_attorneys
});
var Block_eBooksList_svelte = ".ebooks.svelte-1btcfck.svelte-1btcfck{display:block;padding:0;text-align:center}@media screen and (min-width:650px){.ebooks.svelte-1btcfck.svelte-1btcfck{padding:50px 20px;padding:50px var(--padding-inner,20px)}}.ebooks-inner.svelte-1btcfck.svelte-1btcfck{margin:0 auto;max-width:var(--content-constrain)}.ebooks-list.svelte-1btcfck.svelte-1btcfck{display:grid;-moz-column-gap:2em;grid-column-gap:2em;column-gap:2em;grid-template-columns:100%}@media screen and (min-width:850px){.ebooks-list.svelte-1btcfck.svelte-1btcfck{grid-template-columns:calc(50% - 1em) calc(50% - 1em)}}.ebook.svelte-1btcfck.svelte-1btcfck{text-align:center;padding:25px;margin-bottom:2em}@media screen and (min-width:450px){.ebook.svelte-1btcfck.svelte-1btcfck{text-align:left;display:grid;-moz-column-gap:2em;grid-column-gap:2em;column-gap:2em;grid-template-columns:30% 60%}}.ebook-img.svelte-1btcfck.svelte-1btcfck{position:relative}.ebook-img.svelte-1btcfck img.svelte-1btcfck{width:100%;height:auto;max-width:200px;margin-bottom:20px}.ebook-description.svelte-1btcfck.svelte-1btcfck{font-size:var(--small-fontsize);font-style:italic}h2.svelte-1btcfck a.svelte-1btcfck:hover{text-decoration:none}";
const css$8 = {
  code: ".ebooks.svelte-1btcfck.svelte-1btcfck{display:block;padding:0;text-align:center}@media screen and (min-width:650px){.ebooks.svelte-1btcfck.svelte-1btcfck{padding:50px 20px;padding:50px var(--padding-inner,20px)}}.ebooks-inner.svelte-1btcfck.svelte-1btcfck{margin:0 auto;max-width:var(--content-constrain)}.ebooks-list.svelte-1btcfck.svelte-1btcfck{display:grid;grid-column-gap:2em;-moz-column-gap:2em;column-gap:2em;grid-template-columns:100%}@media screen and (min-width:850px){.ebooks-list.svelte-1btcfck.svelte-1btcfck{grid-template-columns:calc(50% - 1em) calc(50% - 1em)}}.ebook.svelte-1btcfck.svelte-1btcfck{text-align:center;padding:25px;margin-bottom:2em}@media screen and (min-width:450px){.ebook.svelte-1btcfck.svelte-1btcfck{text-align:left;display:grid;grid-column-gap:2em;-moz-column-gap:2em;column-gap:2em;grid-template-columns:30% 60%}}.ebook-img.svelte-1btcfck.svelte-1btcfck{position:relative}.ebook-img.svelte-1btcfck img.svelte-1btcfck{width:100%;height:auto;max-width:200px;margin-bottom:20px}.ebook-description.svelte-1btcfck.svelte-1btcfck{font-size:var(--small-fontsize);font-style:italic}h2.svelte-1btcfck a.svelte-1btcfck:hover{text-decoration:none}",
  map: `{"version":3,"file":"Block_eBooksList.svelte","sources":["Block_eBooksList.svelte"],"sourcesContent":["<div {id} class={blockclass}>\\n\\t<div class=\\"ebooks-inner\\">\\n\\t\\t<div class=\\"ebooks-list\\">\\n\\t\\t\\t{#each ebooks as ebook}\\n\\t\\t\\t\\t<div id={ebook?.slug} class=\\"ebook block-style04\\">\\n\\t\\t\\t\\t\\t<div class=\\"ebook-img\\">\\n\\t\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\t\\thref={ebook?.eBook?.pdf?.mediaItemUrl}\\n\\t\\t\\t\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\t\\t\\t\\ttitle=\\"Read eBook\\"\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t<picture>\\n\\t\\t\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"image/avif\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tsrcset={ebook?.eBook?.avifImage?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"image/webp\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tsrcset={ebook?.eBook?.webpImage?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tsrc={ebook?.eBook?.pngImage?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\talt={ebook?.title}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\twidth=\\"200\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\theight=\\"275\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t</picture>\\n\\t\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t<div class=\\"ebook-content\\">\\n\\t\\t\\t\\t\\t\\t<h2>\\n\\t\\t\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\t\\t\\thref={ebook?.eBook?.pdf?.mediaItemUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\t\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\t\\t\\t\\t\\ttitle=\\"Read eBook\\"\\n\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t{ebook?.title}\\n\\t\\t\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t\\t\\t</h2>\\n\\t\\t\\t\\t\\t\\t<div class=\\"ebook-description\\">\\n\\t\\t\\t\\t\\t\\t\\t{cleanUp(ebook?.eBook?.shortDescription)}\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t<div>\\n\\t\\t\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\t\\t\\thref={ebook?.eBook?.pdf?.mediaItemUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\t\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"fancy-link\\"\\n\\t\\t\\t\\t\\t\\t\\t\\ttitle=\\"Read eBook\\"\\n\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t<span> Download The FREE eBook </span>\\n\\t\\t\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t{/each}\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<script>function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount, onDestroy } from 'svelte';\\n/* ## MILK ## */\\n\\nimport { milk } from '$milk/milk.js';\\nimport { stripTags } from '$milk/util/helpers.js';\\nvar id;\\nvar blockstyle = '';\\nvar blockclass = 'ebooks';\\n\\n$: blockclass = \\"ebooks \\" + blockstyle;\\n/* ## Data Loading ## */\\n\\n\\nimport { preload_ebooks } from '$graphql/sitespecific.preload.js';\\nvar ebooks = preload_ebooks;\\n\\nvar unsubscribe_ebooks = () => {};\\n\\nimport { Q_GET_EBOOKS } from '$graphql/sitespecific.graphql.js';\\n/* ## Main ## */\\n\\nvar cleanUp = html => {\\n  return html.replace(/\\\\u00a0/g, ' ');\\n};\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  var _$milk, _$milk$data;\\n\\n  cleanUp = html => {\\n    return stripTags(html).replace(/\\\\u00a0/g, ' ');\\n  };\\n\\n  var queryVariables = {\\n    size: 999\\n  };\\n  var getEBooks = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_EBOOKS, $milk.data.sources.wordpress, queryVariables);\\n  unsubscribe_ebooks = yield getEBooks == null ? void 0 : getEBooks.subscribe( /*#__PURE__*/function () {\\n    var _ref2 = _asyncToGenerator(function* (fetched_data) {\\n      var data = yield fetched_data; // console.log(data);\\n\\n      ebooks = data.eBooks.nodes;\\n    });\\n\\n    return function (_x) {\\n      return _ref2.apply(this, arguments);\\n    };\\n  }());\\n}));\\n/* ## Exit ## */\\n\\nonDestroy(() => {\\n  unsubscribe_ebooks(); // important for garbage collection otherwise memory leak\\n});\\n/* ## Exports ## */\\n\\nexport { id, blockstyle };</script>\\n\\n<style>.ebooks{display:block;padding:0;text-align:center}@media screen and (min-width:650px){.ebooks{padding:50px 20px;padding:50px var(--padding-inner,20px)}}.ebooks-inner{margin:0 auto;max-width:var(--content-constrain)}.ebooks-list{display:grid;grid-column-gap:2em;-moz-column-gap:2em;column-gap:2em;grid-template-columns:100%}@media screen and (min-width:850px){.ebooks-list{grid-template-columns:calc(50% - 1em) calc(50% - 1em)}}.ebook{text-align:center;padding:25px;margin-bottom:2em}@media screen and (min-width:450px){.ebook{text-align:left;display:grid;grid-column-gap:2em;-moz-column-gap:2em;column-gap:2em;grid-template-columns:30% 60%}}.ebook-img{position:relative}.ebook-img img{width:100%;height:auto;max-width:200px;margin-bottom:20px}.ebook-description{font-size:var(--small-fontsize);font-style:italic}h2 a:hover{text-decoration:none}</style>\\n"],"names":[],"mappings":"AA6HO,qCAAO,CAAC,QAAQ,KAAK,CAAC,QAAQ,CAAC,CAAC,WAAW,MAAM,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,qCAAO,CAAC,QAAQ,IAAI,CAAC,IAAI,CAAC,QAAQ,IAAI,CAAC,IAAI,eAAe,CAAC,IAAI,CAAC,CAAC,CAAC,2CAAa,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,IAAI,mBAAmB,CAAC,CAAC,0CAAY,CAAC,QAAQ,IAAI,CAAC,gBAAgB,GAAG,CAAC,gBAAgB,GAAG,CAAC,WAAW,GAAG,CAAC,sBAAsB,IAAI,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,0CAAY,CAAC,sBAAsB,KAAK,GAAG,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,KAAK,GAAG,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,oCAAM,CAAC,WAAW,MAAM,CAAC,QAAQ,IAAI,CAAC,cAAc,GAAG,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,oCAAM,CAAC,WAAW,IAAI,CAAC,QAAQ,IAAI,CAAC,gBAAgB,GAAG,CAAC,gBAAgB,GAAG,CAAC,WAAW,GAAG,CAAC,sBAAsB,GAAG,CAAC,GAAG,CAAC,CAAC,wCAAU,CAAC,SAAS,QAAQ,CAAC,yBAAU,CAAC,kBAAG,CAAC,MAAM,IAAI,CAAC,OAAO,IAAI,CAAC,UAAU,KAAK,CAAC,cAAc,IAAI,CAAC,gDAAkB,CAAC,UAAU,IAAI,gBAAgB,CAAC,CAAC,WAAW,MAAM,CAAC,iBAAE,CAAC,gBAAC,MAAM,CAAC,gBAAgB,IAAI,CAAC"}`
};
function asyncGeneratorStep$a(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$a(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$a(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$a(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Block_eBooksList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var {id} = $$props;
  var {blockstyle = ""} = $$props;
  var blockclass = "ebooks";
  var ebooks = preload_ebooks;
  var unsubscribe_ebooks = () => {
  };
  var cleanUp = (html) => {
    return html.replace(/\u00a0/g, " ");
  };
  onMount(/* @__PURE__ */ _asyncToGenerator$a(function* () {
    var _$milk, _$milk$data;
    cleanUp = (html) => {
      return stripTags(html).replace(/\u00a0/g, " ");
    };
    var queryVariables = {size: 999};
    var getEBooks = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_EBOOKS, $milk.data.sources.wordpress, queryVariables);
    unsubscribe_ebooks = yield getEBooks == null ? void 0 : getEBooks.subscribe(/* @__PURE__ */ function() {
      var _ref2 = _asyncToGenerator$a(function* (fetched_data) {
        var data = yield fetched_data;
        ebooks = data.eBooks.nodes;
      });
      return function(_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  }));
  onDestroy(() => {
    unsubscribe_ebooks();
  });
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  $$result.css.add(css$8);
  blockclass = "ebooks " + blockstyle;
  $$unsubscribe_milk();
  return `<div${add_attribute("id", id, 0)} class="${escape(null_to_empty(blockclass)) + " svelte-1btcfck"}"><div class="${"ebooks-inner svelte-1btcfck"}"><div class="${"ebooks-list svelte-1btcfck"}">${each(ebooks, (ebook) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
    return `<div${add_attribute("id", ebook == null ? void 0 : ebook.slug, 0)} class="${"ebook block-style04 svelte-1btcfck"}"><div class="${"ebook-img svelte-1btcfck"}"><a${add_attribute("href", (_b = (_a = ebook == null ? void 0 : ebook.eBook) == null ? void 0 : _a.pdf) == null ? void 0 : _b.mediaItemUrl, 0)} target="${"_blank"}" rel="${"noreferrer"}" title="${"Read eBook"}"><picture><source type="${"image/avif"}"${add_attribute("srcset", (_d = (_c = ebook == null ? void 0 : ebook.eBook) == null ? void 0 : _c.avifImage) == null ? void 0 : _d.sourceUrl, 0)}>
								<source type="${"image/webp"}"${add_attribute("srcset", (_f = (_e = ebook == null ? void 0 : ebook.eBook) == null ? void 0 : _e.webpImage) == null ? void 0 : _f.sourceUrl, 0)}>
								<img${add_attribute("src", (_h = (_g = ebook == null ? void 0 : ebook.eBook) == null ? void 0 : _g.pngImage) == null ? void 0 : _h.sourceUrl, 0)}${add_attribute("alt", ebook == null ? void 0 : ebook.title, 0)} loading="${"lazy"}" width="${"200"}" height="${"275"}" class="${"svelte-1btcfck"}"></picture>
						</a></div>
					<div class="${"ebook-content"}"><h2 class="${"svelte-1btcfck"}"><a${add_attribute("href", (_j = (_i = ebook == null ? void 0 : ebook.eBook) == null ? void 0 : _i.pdf) == null ? void 0 : _j.mediaItemUrl, 0)} target="${"_blank"}" rel="${"noreferrer"}" title="${"Read eBook"}" class="${"svelte-1btcfck"}">${escape(ebook == null ? void 0 : ebook.title)}
							</a></h2>
						<div class="${"ebook-description svelte-1btcfck"}">${escape(cleanUp((_k = ebook == null ? void 0 : ebook.eBook) == null ? void 0 : _k.shortDescription))}</div>
						<div><a${add_attribute("href", (_m = (_l = ebook == null ? void 0 : ebook.eBook) == null ? void 0 : _l.pdf) == null ? void 0 : _m.mediaItemUrl, 0)} target="${"_blank"}" rel="${"noreferrer"}" class="${"fancy-link"}" title="${"Read eBook"}"><span>Download The FREE eBook </span></a>
						</div></div>
				</div>`;
  })}</div></div>
</div>`;
});
var Block_VideosList_svelte = ".videos.svelte-1ota66h.svelte-1ota66h{display:block;padding:0;text-align:center}@media screen and (min-width:650px){.videos.svelte-1ota66h.svelte-1ota66h{padding:50px 20px;padding:50px var(--padding-inner,20px)}}.videos-inner.svelte-1ota66h.svelte-1ota66h{margin:0 auto;max-width:var(--content-constrain)}.videos-list.svelte-1ota66h.svelte-1ota66h{display:grid;-moz-column-gap:2em;grid-column-gap:2em;column-gap:2em;grid-template-columns:100%}@media screen and (min-width:850px){.videos-list.svelte-1ota66h.svelte-1ota66h{grid-template-columns:calc(50% - 1em) calc(50% - 1em)}}.video.svelte-1ota66h.svelte-1ota66h{text-align:center;padding:25px;margin-bottom:2em}.video-img.svelte-1ota66h.svelte-1ota66h{position:relative}.video-img.svelte-1ota66h img.svelte-1ota66h{width:100%;height:auto}.video-description.svelte-1ota66h.svelte-1ota66h{font-size:var(--small-fontsize);font-style:italic}";
const css$7 = {
  code: ".videos.svelte-1ota66h.svelte-1ota66h{display:block;padding:0;text-align:center}@media screen and (min-width:650px){.videos.svelte-1ota66h.svelte-1ota66h{padding:50px 20px;padding:50px var(--padding-inner,20px)}}.videos-inner.svelte-1ota66h.svelte-1ota66h{margin:0 auto;max-width:var(--content-constrain)}.videos-list.svelte-1ota66h.svelte-1ota66h{display:grid;grid-column-gap:2em;-moz-column-gap:2em;column-gap:2em;grid-template-columns:100%}@media screen and (min-width:850px){.videos-list.svelte-1ota66h.svelte-1ota66h{grid-template-columns:calc(50% - 1em) calc(50% - 1em)}}.video.svelte-1ota66h.svelte-1ota66h{text-align:center;padding:25px;margin-bottom:2em}.video-img.svelte-1ota66h.svelte-1ota66h{position:relative}.video-img.svelte-1ota66h img.svelte-1ota66h{width:100%;height:auto}.video-description.svelte-1ota66h.svelte-1ota66h{font-size:var(--small-fontsize);font-style:italic}",
  map: `{"version":3,"file":"Block_VideosList.svelte","sources":["Block_VideosList.svelte"],"sourcesContent":["<div {id} class={blockclass}>\\n\\t<div class=\\"videos-inner\\">\\n\\t\\t<div class=\\"videos-list\\">\\n\\t\\t\\t{#each videos as video}\\n\\t\\t\\t\\t<div id={video?.slug} class=\\"video\\">\\n\\t\\t\\t\\t\\t<div class=\\"video-img\\">\\n\\t\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\t\\thref={video?.Video?.video}\\n\\t\\t\\t\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\t\\t\\t\\ttitle=\\"Watch Video\\"\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t<picture>\\n\\t\\t\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"image/avif\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tsrcset={video?.Video?.avifImage?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"image/webp\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tsrcset={video?.Video?.webpImage?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tsrc={video?.Video?.jpegImage?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\talt={video?.title}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\twidth=\\"300\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\theight=\\"169\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t</picture>\\n\\t\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t{/each}\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<script>function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount, onDestroy } from 'svelte';\\n/* ## MILK ## */\\n\\nimport { milk } from '$milk/milk.js';\\nvar id;\\nvar blockstyle = '';\\nvar blockclass = 'videos';\\n\\n$: blockclass = \\"videos \\" + blockstyle;\\n/* ## Data Loading ## */\\n\\n\\nimport { preload_videos } from '$graphql/sitespecific.preload.js';\\nvar videos = preload_videos;\\n\\nvar unsubscribe_videos = () => {};\\n\\nimport { Q_GET_VIDEOS } from '$graphql/sitespecific.graphql.js';\\n/* ## Main ## */\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  var _$milk, _$milk$data;\\n\\n  var queryVariables = {\\n    size: 999\\n  };\\n  var getVideos = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_VIDEOS, $milk.data.sources.wordpress, queryVariables);\\n  unsubscribe_videos = yield getVideos == null ? void 0 : getVideos.subscribe( /*#__PURE__*/function () {\\n    var _ref2 = _asyncToGenerator(function* (fetched_data) {\\n      var data = yield fetched_data; // console.log(data);\\n\\n      videos = data.videos.nodes;\\n    });\\n\\n    return function (_x) {\\n      return _ref2.apply(this, arguments);\\n    };\\n  }());\\n}));\\n/* ## Exit ## */\\n\\nonDestroy(() => {\\n  unsubscribe_videos(); // important for garbage collection otherwise memory leak\\n});\\n/* ## Exports ## */\\n\\nexport { id, blockstyle };</script>\\n\\n<style>.videos{display:block;padding:0;text-align:center}@media screen and (min-width:650px){.videos{padding:50px 20px;padding:50px var(--padding-inner,20px)}}.videos-inner{margin:0 auto;max-width:var(--content-constrain)}.videos-list{display:grid;grid-column-gap:2em;-moz-column-gap:2em;column-gap:2em;grid-template-columns:100%}@media screen and (min-width:850px){.videos-list{grid-template-columns:calc(50% - 1em) calc(50% - 1em)}}.video{text-align:center;padding:25px;margin-bottom:2em}.video-img{position:relative}.video-img img{width:100%;height:auto}.video-description{font-size:var(--small-fontsize);font-style:italic}h2 a:hover{text-decoration:none}</style>\\n"],"names":[],"mappings":"AA0FO,qCAAO,CAAC,QAAQ,KAAK,CAAC,QAAQ,CAAC,CAAC,WAAW,MAAM,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,qCAAO,CAAC,QAAQ,IAAI,CAAC,IAAI,CAAC,QAAQ,IAAI,CAAC,IAAI,eAAe,CAAC,IAAI,CAAC,CAAC,CAAC,2CAAa,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,IAAI,mBAAmB,CAAC,CAAC,0CAAY,CAAC,QAAQ,IAAI,CAAC,gBAAgB,GAAG,CAAC,gBAAgB,GAAG,CAAC,WAAW,GAAG,CAAC,sBAAsB,IAAI,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,0CAAY,CAAC,sBAAsB,KAAK,GAAG,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,KAAK,GAAG,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,oCAAM,CAAC,WAAW,MAAM,CAAC,QAAQ,IAAI,CAAC,cAAc,GAAG,CAAC,wCAAU,CAAC,SAAS,QAAQ,CAAC,yBAAU,CAAC,kBAAG,CAAC,MAAM,IAAI,CAAC,OAAO,IAAI,CAAC,gDAAkB,CAAC,UAAU,IAAI,gBAAgB,CAAC,CAAC,WAAW,MAAM,CAAC"}`
};
function asyncGeneratorStep$9(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$9(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$9(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$9(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Block_VideosList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var {id} = $$props;
  var {blockstyle = ""} = $$props;
  var blockclass = "videos";
  var videos = preload_videos;
  var unsubscribe_videos = () => {
  };
  onMount(/* @__PURE__ */ _asyncToGenerator$9(function* () {
    var _$milk, _$milk$data;
    var queryVariables = {size: 999};
    var getVideos = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_VIDEOS, $milk.data.sources.wordpress, queryVariables);
    unsubscribe_videos = yield getVideos == null ? void 0 : getVideos.subscribe(/* @__PURE__ */ function() {
      var _ref2 = _asyncToGenerator$9(function* (fetched_data) {
        var data = yield fetched_data;
        videos = data.videos.nodes;
      });
      return function(_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  }));
  onDestroy(() => {
    unsubscribe_videos();
  });
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  $$result.css.add(css$7);
  blockclass = "videos " + blockstyle;
  $$unsubscribe_milk();
  return `<div${add_attribute("id", id, 0)} class="${escape(null_to_empty(blockclass)) + " svelte-1ota66h"}"><div class="${"videos-inner svelte-1ota66h"}"><div class="${"videos-list svelte-1ota66h"}">${each(videos, (video) => {
    var _a, _b, _c, _d, _e, _f, _g;
    return `<div${add_attribute("id", video == null ? void 0 : video.slug, 0)} class="${"video svelte-1ota66h"}"><div class="${"video-img svelte-1ota66h"}"><a${add_attribute("href", (_a = video == null ? void 0 : video.Video) == null ? void 0 : _a.video, 0)} target="${"_blank"}" rel="${"noreferrer"}" title="${"Watch Video"}"><picture><source type="${"image/avif"}"${add_attribute("srcset", (_c = (_b = video == null ? void 0 : video.Video) == null ? void 0 : _b.avifImage) == null ? void 0 : _c.sourceUrl, 0)}>
								<source type="${"image/webp"}"${add_attribute("srcset", (_e = (_d = video == null ? void 0 : video.Video) == null ? void 0 : _d.webpImage) == null ? void 0 : _e.sourceUrl, 0)}>
								<img${add_attribute("src", (_g = (_f = video == null ? void 0 : video.Video) == null ? void 0 : _f.jpegImage) == null ? void 0 : _g.sourceUrl, 0)}${add_attribute("alt", video == null ? void 0 : video.title, 0)} loading="${"lazy"}" width="${"300"}" height="${"169"}" class="${"svelte-1ota66h"}"></picture>
						</a></div>
				</div>`;
  })}</div></div>
</div>`;
});
var index_svelte$3 = ".content.svelte-1j6m5qp.svelte-1j6m5qp{margin-bottom:0}.content-inner.svelte-1j6m5qp h2.svelte-1j6m5qp,.view-more.svelte-1j6m5qp.svelte-1j6m5qp{text-align:center}.view-more.svelte-1j6m5qp.svelte-1j6m5qp{margin:-40px 25px 100px}";
const css$6 = {
  code: ".content.svelte-1j6m5qp.svelte-1j6m5qp{margin-bottom:0}.content-inner.svelte-1j6m5qp h2.svelte-1j6m5qp,.view-more.svelte-1j6m5qp.svelte-1j6m5qp{text-align:center}.view-more.svelte-1j6m5qp.svelte-1j6m5qp{margin:-40px 25px 100px}",
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<Head_Language lang=\\"en\\" />\\n<Head_HTML {title} {description} keywords={$milk?.site?.keywords} />\\n<Head_Facebook {title} {description} image=\\"/img/hero_services_01.jpg\\" />\\n<Head_Twitter {title} {description} image=\\"/img/hero_services_01.jpg\\" />\\n<Layout_Main id=\\"immigration-resources\\">\\n\\t<Hero\\n\\t\\tid=\\"hero-immigration-resources-01\\"\\n\\t\\timage_url=\\"/img/hero_resources_01.jpg\\"\\n\\t\\timg_srcset=\\"/img/hero_resources_01.jpg\\"\\n\\t\\tavif_srcset=\\"/img/hero_resources_01.avif\\"\\n\\t\\twebp_srcset=\\"/img/hero_resources_01.webp\\"\\n\\t\\ttitle=\\"Harlan York and Associates\\"\\n\\t\\tparallax=\\"false\\">&nbsp;</Hero\\n\\t>\\n\\t<Block_CallOutText\\n\\t\\tid=\\"call-out-text\\"\\n\\t\\tblockstyle=\\"block-style01\\"\\n\\t\\textraclasses=\\"floating-calltoaction\\"\\n\\t\\ttitle=\\"Immigration Resources\\"\\n\\t>\\n\\t\\t<p>{description}</p>\\n\\t</Block_CallOutText>\\n\\t<div class=\\"content\\">\\n\\t\\t<div class=\\"content-inner\\">\\n\\t\\t\\t<h1>Resource Library</h1>\\n\\t\\t\\t<br /><br />\\n\\t\\t</div>\\n\\t\\t<div class=\\"content-inner\\">\\n\\t\\t\\t<h2>eBooks</h2>\\n\\t\\t</div>\\n\\t</div>\\n\\t<Block_eBooksList id=\\"ebooks\\" />\\n\\t<div class=\\"content\\">\\n\\t\\t<div class=\\"content-inner\\">\\n\\t\\t\\t<h2>Videos</h2>\\n\\t\\t</div>\\n\\t</div>\\n\\t<Block_VideosList id=\\"videos\\" />\\n\\t<div class=\\"content view-more\\">\\n\\t\\t<div class=\\"content-inner\\">\\n\\t\\t\\t<h3>\\n\\t\\t\\t\\tView More Videos on\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\thref=\\"https://www.youtube.com/user/HYORKLAW/videos\\"\\n\\t\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\tYouTube\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t\\tand\\n\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\thref=\\"https://vimeo.com/user33052863\\"\\n\\t\\t\\t\\t\\ttarget=\\"_blank\\"\\n\\t\\t\\t\\t\\trel=\\"noreferrer\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\tVimeo\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</h3>\\n\\t\\t</div>\\n\\t</div>\\n\\t<Block_CallToAction\\n\\t\\tid=\\"call-to-action\\"\\n\\t\\tblockstyle=\\"block-style01\\"\\n\\t\\textraclasses=\\"regular-calltoaction\\"\\n\\t/>\\n\\t<Block_LanguagesWeSpeak />\\n\\t<Block_Languages id=\\"languages\\" blockstyle=\\"block-style04\\" />\\n\\t<Block_Featured id=\\"featured\\" blockstyle=\\"\\" />\\n\\t<Block_Ratings id=\\"ratings\\" blockstyle=\\"\\" />\\n\\t<SocialMedia id=\\"socialmedia\\" blockstyle=\\"\\" />\\n</Layout_Main>\\n\\n<script>var _$milk, _$milk$site;\\n\\n/* ## MILK ## */\\nimport { milk } from '$milk/milk.js';\\n/* ## Components ## */\\n\\nimport Head_Language from '$milk/lib/Head_Language.svelte';\\nimport Head_HTML from '$milk/lib/Head_HTML.svelte';\\nimport Head_Facebook from '$milk/lib/Head_Facebook.svelte';\\nimport Head_Twitter from '$milk/lib/Head_Twitter.svelte';\\nimport Layout_Main from '$theme/Layout_Main.svelte';\\nimport Hero from '$milk/lib/Hero.svelte';\\nimport Block_CallOutText from '$theme/Block_CallOutText.svelte';\\nimport Block_eBooksList from '$theme/Block_eBooksList.svelte';\\nimport Block_VideosList from '$theme/Block_VideosList.svelte';\\nimport Block_CallToAction from '$theme/Block_CallToAction.svelte';\\nimport Block_LanguagesWeSpeak from '$theme/Block_LanguagesWeSpeak.svelte';\\nimport Block_Languages from '$theme/Block_Languages.svelte';\\nimport Block_Featured from '$theme/Block_Featured.svelte';\\nimport SocialMedia from '$milk/lib/SocialMedia.svelte';\\nimport Block_Ratings from '$theme/Block_Ratings.svelte';\\n/* ## Variables ## */\\n\\nvar title = \\"Immigration Resources - \\" + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.title);\\nvar description = 'Please feel free to access our Free Resource Library. If you have any questions, our Attorneys are available for consultation. Immigration law is a constantly changing legal field. Harlan York is the best lawyer in the field because of his knowledge and passion for staying up to date with trending legal challenges that could affect your case. Harlan\u2019s Immigration Resource Library and Blog are filled with informative and practical advice, from getting a green card through marriage to detailed explanations of litigation, business immigration, citizenship, waivers and appeals.';</script>\\n\\n<style>.content{margin-bottom:0}.content-inner h2,.view-more{text-align:center}.view-more{margin:-40px 25px 100px}</style>\\n"],"names":[],"mappings":"AAkGO,sCAAQ,CAAC,cAAc,CAAC,CAAC,6BAAc,CAAC,iBAAE,CAAC,wCAAU,CAAC,WAAW,MAAM,CAAC,wCAAU,CAAC,OAAO,KAAK,CAAC,IAAI,CAAC,KAAK,CAAC"}`
};
var description$3 = "Please feel free to access our Free Resource Library. If you have any questions, our Attorneys are available for consultation. Immigration law is a constantly changing legal field. Harlan York is the best lawyer in the field because of his knowledge and passion for staying up to date with trending legal challenges that could affect your case. Harlan\u2019s Immigration Resource Library and Blog are filled with informative and practical advice, from getting a green card through marriage to detailed explanations of litigation, business immigration, citizenship, waivers and appeals.";
const Immigration_resources = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a;
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var _$milk, _$milk$site;
  var title = "Immigration Resources - " + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.title);
  $$result.css.add(css$6);
  $$unsubscribe_milk();
  return `${validate_component(Head_Language, "Head_Language").$$render($$result, {lang: "en"}, {}, {})}
${validate_component(Head_HTML, "Head_HTML").$$render($$result, {
    title,
    description: description$3,
    keywords: (_a = $milk == null ? void 0 : $milk.site) == null ? void 0 : _a.keywords
  }, {}, {})}
${validate_component(Head_Facebook, "Head_Facebook").$$render($$result, {
    title,
    description: description$3,
    image: "/img/hero_services_01.jpg"
  }, {}, {})}
${validate_component(Head_Twitter, "Head_Twitter").$$render($$result, {
    title,
    description: description$3,
    image: "/img/hero_services_01.jpg"
  }, {}, {})}
${validate_component(Layout_Main, "Layout_Main").$$render($$result, {id: "immigration-resources"}, {}, {
    default: () => `${validate_component(Hero, "Hero").$$render($$result, {
      id: "hero-immigration-resources-01",
      image_url: "/img/hero_resources_01.jpg",
      img_srcset: "/img/hero_resources_01.jpg",
      avif_srcset: "/img/hero_resources_01.avif",
      webp_srcset: "/img/hero_resources_01.webp",
      title: "Harlan York and Associates",
      parallax: "false"
    }, {}, {})}
	${validate_component(Block_CallOutText, "Block_CallOutText").$$render($$result, {
      id: "call-out-text",
      blockstyle: "block-style01",
      extraclasses: "floating-calltoaction",
      title: "Immigration Resources"
    }, {}, {
      default: () => `<p>${escape(description$3)}</p>`
    })}
	<div class="${"content svelte-1j6m5qp"}"><div class="${"content-inner"}"><h1>Resource Library</h1>
			<br><br></div>
		<div class="${"content-inner svelte-1j6m5qp"}"><h2 class="${"svelte-1j6m5qp"}">eBooks</h2></div></div>
	${validate_component(Block_eBooksList, "Block_eBooksList").$$render($$result, {id: "ebooks"}, {}, {})}
	<div class="${"content svelte-1j6m5qp"}"><div class="${"content-inner svelte-1j6m5qp"}"><h2 class="${"svelte-1j6m5qp"}">Videos</h2></div></div>
	${validate_component(Block_VideosList, "Block_VideosList").$$render($$result, {id: "videos"}, {}, {})}
	<div class="${"content view-more svelte-1j6m5qp"}"><div class="${"content-inner"}"><h3>View More Videos on
				<a href="${"https://www.youtube.com/user/HYORKLAW/videos"}" target="${"_blank"}" rel="${"noreferrer"}">YouTube
				</a>
				and
				<a href="${"https://vimeo.com/user33052863"}" target="${"_blank"}" rel="${"noreferrer"}">Vimeo
				</a></h3></div></div>
	${validate_component(Block_CallToAction, "Block_CallToAction").$$render($$result, {
      id: "call-to-action",
      blockstyle: "block-style01",
      extraclasses: "regular-calltoaction"
    }, {}, {})}
	${validate_component(Block_LanguagesWeSpeak, "Block_LanguagesWeSpeak").$$render($$result, {}, {}, {})}
	${validate_component(Block_Languages, "Block_Languages").$$render($$result, {
      id: "languages",
      blockstyle: "block-style04"
    }, {}, {})}
	${validate_component(Block_Featured, "Block_Featured").$$render($$result, {id: "featured", blockstyle: ""}, {}, {})}
	${validate_component(Block_Ratings, "Block_Ratings").$$render($$result, {id: "ratings", blockstyle: ""}, {}, {})}
	${validate_component(SocialMedia, "SocialMedia").$$render($$result, {id: "socialmedia", blockstyle: ""}, {}, {})}`
  })}`;
});
var index$3 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: Immigration_resources
});
var Block_WP_BlogListing_svelte = ".blog.svelte-1qbsj4z.svelte-1qbsj4z{display:block;padding:50px 20px;padding:50px var(--padding-inner,20px);color:#000;color:var(--color-black,#000);text-align:center}.blog-inner.svelte-1qbsj4z.svelte-1qbsj4z{margin:0 auto;max-width:var(--content-constrain)}h2.svelte-1qbsj4z.svelte-1qbsj4z,h3.svelte-1qbsj4z.svelte-1qbsj4z{color:#000;color:var(--color-black,#000)}.post.svelte-1qbsj4z.svelte-1qbsj4z{padding:var(--padding-large);text-align:left;width:auto;max-width:unset}.post.svelte-1qbsj4z h3 a.svelte-1qbsj4z{color:var(--color-black)}.post.svelte-1qbsj4z h3 a.svelte-1qbsj4z:hover{color:var(--color-four);text-decoration:none}.post.svelte-1qbsj4z.svelte-1qbsj4z:nth-child(2n){background:var(--color-offwhite)}.post.svelte-1qbsj4z .more.svelte-1qbsj4z{clear:both}.post.svelte-1qbsj4z img.svelte-1qbsj4z{margin-bottom:calc(var(--padding)*2)}@media screen and (min-width:650px){.post.svelte-1qbsj4z:nth-child(odd) img.svelte-1qbsj4z{float:left;margin:0 calc(var(--padding)*2) calc(var(--padding)*2) 0}.post.svelte-1qbsj4z:nth-child(2n) img.svelte-1qbsj4z{float:right;margin:0 0 calc(var(--padding)*2) calc(var(--padding)*2)}.post.svelte-1qbsj4z:nth-child(odd) .more.svelte-1qbsj4z{text-align:right}}.post-detials.svelte-1qbsj4z.svelte-1qbsj4z{font-size:var(--small-fontsize);margin-bottom:15px}";
const css$5 = {
  code: ".blog.svelte-1qbsj4z.svelte-1qbsj4z{display:block;padding:50px 20px;padding:50px var(--padding-inner,20px);color:#000;color:var(--color-black,#000);text-align:center}.blog-inner.svelte-1qbsj4z.svelte-1qbsj4z{margin:0 auto;max-width:var(--content-constrain)}h2.svelte-1qbsj4z.svelte-1qbsj4z,h3.svelte-1qbsj4z.svelte-1qbsj4z{color:#000;color:var(--color-black,#000)}.post.svelte-1qbsj4z.svelte-1qbsj4z{padding:var(--padding-large);text-align:left;width:auto;max-width:unset}.post.svelte-1qbsj4z h3 a.svelte-1qbsj4z{color:var(--color-black)}.post.svelte-1qbsj4z h3 a.svelte-1qbsj4z:hover{color:var(--color-four);text-decoration:none}.post.svelte-1qbsj4z.svelte-1qbsj4z:nth-child(2n){background:var(--color-offwhite)}.post.svelte-1qbsj4z .more.svelte-1qbsj4z{clear:both}.post.svelte-1qbsj4z img.svelte-1qbsj4z{margin-bottom:calc(var(--padding)*2)}@media screen and (min-width:650px){.post.svelte-1qbsj4z:nth-child(odd) img.svelte-1qbsj4z{float:left;margin:0 calc(var(--padding)*2) calc(var(--padding)*2) 0}.post.svelte-1qbsj4z:nth-child(2n) img.svelte-1qbsj4z{float:right;margin:0 0 calc(var(--padding)*2) calc(var(--padding)*2)}.post.svelte-1qbsj4z:nth-child(odd) .more.svelte-1qbsj4z{text-align:right}}.post-detials.svelte-1qbsj4z.svelte-1qbsj4z{font-size:var(--small-fontsize);margin-bottom:15px}",
  map: `{"version":3,"file":"Block_WP_BlogListing.svelte","sources":["Block_WP_BlogListing.svelte"],"sourcesContent":["<div class=\\"blog\\">\\n\\t<div class=\\"blog-inner\\">\\n\\t\\t<slot name=\\"before\\"><h2>{title}</h2></slot>\\n\\t\\t<div class=\\"posts-grid posts-listing\\">\\n\\t\\t\\t<div id=\\"BlogTop\\" />\\n\\t\\t\\t{#each posts as post}\\n\\t\\t\\t\\t<div class=\\"post\\">\\n\\t\\t\\t\\t\\t<div title={\`\${post?.title}\`}>\\n\\t\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\t\\thref={\`\${blog_path}/\${post?.slug}\`}\\n\\t\\t\\t\\t\\t\\t\\ttitle={\`\${post?.title}\`}\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t<picture>\\n\\t\\t\\t\\t\\t\\t\\t\\t{#if post?.featuredImage?.node?.srcSet}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"image/jpeg\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tsrcset={post?.featuredImage?.node\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t?.srcSet}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tsrc={post?.featuredImage?.node?.sourceUrl ||\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t'/milk/img/post_noimage.webp'}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\talt={post?.title}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\twidth=\\"250\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\\theight=\\"141\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t</picture>\\n\\t\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t\\t\\t<h3>\\n\\t\\t\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\t\\t\\thref={\`\${blog_path}/\${post?.slug}\`}\\n\\t\\t\\t\\t\\t\\t\\t\\ttitle={\`\${post?.title}\`}\\n\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t<span class=\\"post-title\\">{post?.title}</span>\\n\\t\\t\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t\\t\\t</h3>\\n\\t\\t\\t\\t\\t\\t<div class=\\"post-detials\\">\\n\\t\\t\\t\\t\\t\\t\\tBy: {post?.author?.node?.name}\\n\\t\\t\\t\\t\\t\\t\\t&nbsp;&nbsp;|&nbsp;&nbsp;\\n\\t\\t\\t\\t\\t\\t\\t{getDate(post?.date)}\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t<div class=\\"excerpt\\">\\n\\t\\t\\t\\t\\t\\t\\t{@html post?.excerpt}\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t\\t<div class=\\"more\\">\\n\\t\\t\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\t\\t\\thref={\`\${blog_path}/\${post?.slug}\`}\\n\\t\\t\\t\\t\\t\\t\\t\\ttitle={\`\${post?.title}\`}\\n\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"fancy-link\\"\\n\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t<span>Read More</span>\\n\\t\\t\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t{:else}\\n\\t\\t\\t\\t<div>\\n\\t\\t\\t\\t\\t<h2 style=\\"text-align: center;\\">\\n\\t\\t\\t\\t\\t\\tLooking for matching Blog Posts\\n\\t\\t\\t\\t\\t</h2>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t{/each}\\n\\t\\t</div>\\n\\t\\t<slot name=\\"after\\" />\\n\\t</div>\\n</div>\\n\\n<script>function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount, onDestroy } from 'svelte';\\n/* ## MILK ## */\\n\\nimport { milk } from '$milk/milk.js';\\nimport { debounce } from '$milk/util/helpers.js';\\n/* ## Vairables ## */\\n\\nvar id;\\nvar blockstyle = '';\\nvar blockclass = 'featured-blog';\\n\\n$: blockclass = \\"featured-blog \\" + blockstyle;\\n\\nvar blog_path = '/blog';\\nvar size = 10;\\nvar offset = 0;\\nvar count = 0;\\nvar category = '';\\nvar search = '';\\nvar months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];\\nvar title = 'Blog Posts';\\nvar posts = [];\\n\\n$: {\\n  categoryChange(category);\\n}\\n\\n$: {\\n  debouncedSearch(search);\\n}\\n\\n$: {\\n  doPage(offset);\\n}\\n\\n$: {\\n  doPerPage(size);\\n}\\n/* ## Data Loading ## */\\n\\n\\nvar unsubscribe_blogs = /*#__PURE__*/function () {\\n  var _ref = _asyncToGenerator(function* () {});\\n\\n  return function unsubscribe_blogs() {\\n    return _ref.apply(this, arguments);\\n  };\\n}();\\n\\nvar categoryChange = () => {};\\n\\nvar doSearch = () => {};\\n\\nvar debouncedSearch = () => {};\\n\\nvar doPage = () => {};\\n\\nvar doPerPage = () => {};\\n\\nimport { Q_LIST_POSTS, Q_LIST_POSTS_BYCAT } from '$graphql/wordpress.graphql.js';\\n/* ## Main ## */\\n\\nvar getDate = date => {\\n  var post_date = new Date(date);\\n  return months[post_date.getMonth()] + \\" \\" + post_date.getDate() + \\", \\" + post_date.getFullYear();\\n};\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  yield debouncedBlogListing();\\n\\n  categoryChange = category => {\\n    if (category != '') {\\n      search = '';\\n      offset = 0;\\n    }\\n\\n    debouncedBlogListing();\\n  };\\n\\n  doSearch = search => {\\n    if (search && search != '') {\\n      category = '';\\n      offset = 0;\\n    }\\n\\n    debouncedBlogListing();\\n  };\\n\\n  doPage = offset => {\\n    debouncedBlogListing();\\n  };\\n\\n  doPerPage = size => {\\n    debouncedBlogListing();\\n  };\\n\\n  debouncedSearch = debounce(() => {\\n    doSearch(search);\\n  }, 500, false);\\n}));\\n\\nvar getBlogListing = /*#__PURE__*/function () {\\n  var _ref3 = _asyncToGenerator(function* () {\\n    var _$milk, _$milk$data;\\n\\n    try {\\n      yield unsubscribe_blogs();\\n    } catch (err) {}\\n\\n    var THE_QUERY = category == '' ? Q_LIST_POSTS : Q_LIST_POSTS_BYCAT;\\n    var queryVariables = {\\n      offset: parseInt(offset),\\n      size: parseInt(size)\\n    };\\n\\n    if (category != '') {\\n      queryVariables.category = category;\\n    } else if (search != '') {\\n      queryVariables.search = search;\\n    }\\n\\n    var getBlogs = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(THE_QUERY, $milk.data.sources.wordpress, queryVariables, false, 0);\\n    unsubscribe_blogs = yield getBlogs == null ? void 0 : getBlogs.subscribe( /*#__PURE__*/function () {\\n      var _ref4 = _asyncToGenerator(function* (fetched_data) {\\n        var _data$posts, _data$posts$nodes$len, _data$posts2, _data$posts2$nodes;\\n\\n        var data = yield fetched_data; // console.log(data);\\n\\n        posts = data == null ? void 0 : (_data$posts = data.posts) == null ? void 0 : _data$posts.nodes;\\n        count = (_data$posts$nodes$len = data == null ? void 0 : (_data$posts2 = data.posts) == null ? void 0 : (_data$posts2$nodes = _data$posts2.nodes) == null ? void 0 : _data$posts2$nodes.length) != null ? _data$posts$nodes$len : 0;\\n\\n        if (category != '') {\\n          title = \\"Blog Category: \\" + category;\\n        } else if (search && search != '') {\\n          title = \\"Blog Search: \\" + search;\\n          window.history.pushState({\\n            additionalInformation: \\"Blog Search: \\" + search\\n          }, \\"Blog Search: \\" + search, window.location.href.split('?')[0] + \\"?s=\\" + encodeURIComponent(search));\\n        } else {\\n          var _window, _window$location, _window$location$href, _window$location$href2;\\n\\n          title = \\"Blog Posts\\";\\n\\n          if ((_window = window) != null && (_window$location = _window.location) != null && (_window$location$href = _window$location.href) != null && (_window$location$href2 = _window$location$href.split('?')) != null && _window$location$href2[1]) {\\n            window.history.pushState({\\n              additionalInformation: \\"Blog Listing\\"\\n            }, \\"Blog Listing\\", \\"\\" + window.location.href.split('?')[0]);\\n          }\\n        } // console.log(count);\\n\\n      });\\n\\n      return function (_x) {\\n        return _ref4.apply(this, arguments);\\n      };\\n    }());\\n  });\\n\\n  return function getBlogListing() {\\n    return _ref3.apply(this, arguments);\\n  };\\n}();\\n\\nvar debouncedBlogListing = debounce(() => {\\n  getBlogListing();\\n}, 500, false);\\n/* ## Exit ## */\\n\\nonDestroy(() => {\\n  unsubscribe_blogs(); // important for garbage collection otherwise memory leak\\n});\\nexport { id, blockstyle, blog_path, size, offset, count, category, search, title };</script>\\n\\n<style>.blog{display:block;padding:50px 20px;padding:50px var(--padding-inner,20px);color:#000;color:var(--color-black,#000);text-align:center}.blog-inner{margin:0 auto;max-width:var(--content-constrain)}h2,h3,p{color:#000;color:var(--color-black,#000)}.post{padding:var(--padding-large);text-align:left;width:auto;max-width:unset}.post h3 a{color:var(--color-black)}.post h3 a:hover{color:var(--color-four);text-decoration:none}.post:nth-child(2n){background:var(--color-offwhite)}.post .more{clear:both}.post img{margin-bottom:calc(var(--padding)*2)}@media screen and (min-width:650px){.post:nth-child(odd) img{float:left;margin:0 calc(var(--padding)*2) calc(var(--padding)*2) 0}.post:nth-child(2n) img{float:right;margin:0 0 calc(var(--padding)*2) calc(var(--padding)*2)}.post:nth-child(odd) .more{text-align:right}}.post-detials{font-size:var(--small-fontsize);margin-bottom:15px}</style>\\n"],"names":[],"mappings":"AAuPO,mCAAK,CAAC,QAAQ,KAAK,CAAC,QAAQ,IAAI,CAAC,IAAI,CAAC,QAAQ,IAAI,CAAC,IAAI,eAAe,CAAC,IAAI,CAAC,CAAC,MAAM,IAAI,CAAC,MAAM,IAAI,aAAa,CAAC,IAAI,CAAC,CAAC,WAAW,MAAM,CAAC,yCAAW,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,IAAI,mBAAmB,CAAC,CAAC,gCAAE,CAAC,EAAE,8BAAE,CAAC,MAAM,IAAI,CAAC,MAAM,IAAI,aAAa,CAAC,IAAI,CAAC,CAAC,mCAAK,CAAC,QAAQ,IAAI,eAAe,CAAC,CAAC,WAAW,IAAI,CAAC,MAAM,IAAI,CAAC,UAAU,KAAK,CAAC,oBAAK,CAAC,EAAE,CAAC,gBAAC,CAAC,MAAM,IAAI,aAAa,CAAC,CAAC,oBAAK,CAAC,EAAE,CAAC,gBAAC,MAAM,CAAC,MAAM,IAAI,YAAY,CAAC,CAAC,gBAAgB,IAAI,CAAC,mCAAK,WAAW,EAAE,CAAC,CAAC,WAAW,IAAI,gBAAgB,CAAC,CAAC,oBAAK,CAAC,oBAAK,CAAC,MAAM,IAAI,CAAC,oBAAK,CAAC,kBAAG,CAAC,cAAc,KAAK,IAAI,SAAS,CAAC,CAAC,CAAC,CAAC,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,oBAAK,WAAW,GAAG,CAAC,CAAC,kBAAG,CAAC,MAAM,IAAI,CAAC,OAAO,CAAC,CAAC,KAAK,IAAI,SAAS,CAAC,CAAC,CAAC,CAAC,CAAC,KAAK,IAAI,SAAS,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,oBAAK,WAAW,EAAE,CAAC,CAAC,kBAAG,CAAC,MAAM,KAAK,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,KAAK,IAAI,SAAS,CAAC,CAAC,CAAC,CAAC,CAAC,KAAK,IAAI,SAAS,CAAC,CAAC,CAAC,CAAC,CAAC,oBAAK,WAAW,GAAG,CAAC,CAAC,oBAAK,CAAC,WAAW,KAAK,CAAC,CAAC,2CAAa,CAAC,UAAU,IAAI,gBAAgB,CAAC,CAAC,cAAc,IAAI,CAAC"}`
};
function asyncGeneratorStep$8(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$8(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$8(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$8(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Block_WP_BlogListing = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var {id} = $$props;
  var {blockstyle = ""} = $$props;
  var {blog_path = "/blog"} = $$props;
  var {size = 10} = $$props;
  var {offset = 0} = $$props;
  var {count = 0} = $$props;
  var {category = ""} = $$props;
  var {search = ""} = $$props;
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  var {title = "Blog Posts"} = $$props;
  var posts = [];
  var unsubscribe_blogs = /* @__PURE__ */ function() {
    var _ref = _asyncToGenerator$8(function* () {
    });
    return function unsubscribe_blogs2() {
      return _ref.apply(this, arguments);
    };
  }();
  var categoryChange = () => {
  };
  var doSearch = () => {
  };
  var debouncedSearch = () => {
  };
  var doPage = () => {
  };
  var doPerPage = () => {
  };
  var getDate = (date) => {
    var post_date = new Date(date);
    return months[post_date.getMonth()] + " " + post_date.getDate() + ", " + post_date.getFullYear();
  };
  onMount(/* @__PURE__ */ _asyncToGenerator$8(function* () {
    yield debouncedBlogListing();
    categoryChange = (category2) => {
      if (category2 != "") {
        search = "";
        offset = 0;
      }
      debouncedBlogListing();
    };
    doSearch = (search2) => {
      if (search2 && search2 != "") {
        category = "";
        offset = 0;
      }
      debouncedBlogListing();
    };
    doPage = (offset2) => {
      debouncedBlogListing();
    };
    doPerPage = (size2) => {
      debouncedBlogListing();
    };
    debouncedSearch = debounce(() => {
      doSearch(search);
    }, 500, false);
  }));
  var getBlogListing = /* @__PURE__ */ function() {
    var _ref3 = _asyncToGenerator$8(function* () {
      var _$milk, _$milk$data;
      try {
        yield unsubscribe_blogs();
      } catch (err) {
      }
      var THE_QUERY = category == "" ? Q_LIST_POSTS : Q_LIST_POSTS_BYCAT;
      var queryVariables = {
        offset: parseInt(offset),
        size: parseInt(size)
      };
      if (category != "") {
        queryVariables.category = category;
      } else if (search != "") {
        queryVariables.search = search;
      }
      var getBlogs = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(THE_QUERY, $milk.data.sources.wordpress, queryVariables, false, 0);
      unsubscribe_blogs = yield getBlogs == null ? void 0 : getBlogs.subscribe(/* @__PURE__ */ function() {
        var _ref4 = _asyncToGenerator$8(function* (fetched_data) {
          var _data$posts, _data$posts$nodes$len, _data$posts2, _data$posts2$nodes;
          var data = yield fetched_data;
          posts = data == null ? void 0 : (_data$posts = data.posts) == null ? void 0 : _data$posts.nodes;
          count = (_data$posts$nodes$len = data == null ? void 0 : (_data$posts2 = data.posts) == null ? void 0 : (_data$posts2$nodes = _data$posts2.nodes) == null ? void 0 : _data$posts2$nodes.length) != null ? _data$posts$nodes$len : 0;
          if (category != "") {
            title = "Blog Category: " + category;
          } else if (search && search != "") {
            title = "Blog Search: " + search;
            window.history.pushState({
              additionalInformation: "Blog Search: " + search
            }, "Blog Search: " + search, window.location.href.split("?")[0] + "?s=" + encodeURIComponent(search));
          } else {
            var _window, _window$location, _window$location$href, _window$location$href2;
            title = "Blog Posts";
            if ((_window = window) != null && (_window$location = _window.location) != null && (_window$location$href = _window$location.href) != null && (_window$location$href2 = _window$location$href.split("?")) != null && _window$location$href2[1]) {
              window.history.pushState({additionalInformation: "Blog Listing"}, "Blog Listing", "" + window.location.href.split("?")[0]);
            }
          }
        });
        return function(_x) {
          return _ref4.apply(this, arguments);
        };
      }());
    });
    return function getBlogListing2() {
      return _ref3.apply(this, arguments);
    };
  }();
  var debouncedBlogListing = debounce(() => {
    getBlogListing();
  }, 500, false);
  onDestroy(() => {
    unsubscribe_blogs();
  });
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  if ($$props.blog_path === void 0 && $$bindings.blog_path && blog_path !== void 0)
    $$bindings.blog_path(blog_path);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.offset === void 0 && $$bindings.offset && offset !== void 0)
    $$bindings.offset(offset);
  if ($$props.count === void 0 && $$bindings.count && count !== void 0)
    $$bindings.count(count);
  if ($$props.category === void 0 && $$bindings.category && category !== void 0)
    $$bindings.category(category);
  if ($$props.search === void 0 && $$bindings.search && search !== void 0)
    $$bindings.search(search);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  $$result.css.add(css$5);
  {
    {
      categoryChange(category);
    }
  }
  {
    {
      debouncedSearch(search);
    }
  }
  {
    {
      doPage(offset);
    }
  }
  {
    {
      doPerPage(size);
    }
  }
  $$unsubscribe_milk();
  return `<div class="${"blog svelte-1qbsj4z"}"><div class="${"blog-inner svelte-1qbsj4z"}">${slots.before ? slots.before({}) : `<h2 class="${"svelte-1qbsj4z"}">${escape(title)}</h2>`}
		<div class="${"posts-grid posts-listing"}"><div id="${"BlogTop"}"></div>
			${posts.length ? each(posts, (post2) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return `<div class="${"post svelte-1qbsj4z"}"><div${add_attribute("title", `${post2 == null ? void 0 : post2.title}`, 0)}><a${add_attribute("href", `${blog_path}/${post2 == null ? void 0 : post2.slug}`, 0)}${add_attribute("title", `${post2 == null ? void 0 : post2.title}`, 0)} class="${"svelte-1qbsj4z"}"><picture>${((_b = (_a = post2 == null ? void 0 : post2.featuredImage) == null ? void 0 : _a.node) == null ? void 0 : _b.srcSet) ? `<source type="${"image/jpeg"}"${add_attribute("srcset", (_d = (_c = post2 == null ? void 0 : post2.featuredImage) == null ? void 0 : _c.node) == null ? void 0 : _d.srcSet, 0)}>` : ``}
								<img${add_attribute("src", ((_f = (_e = post2 == null ? void 0 : post2.featuredImage) == null ? void 0 : _e.node) == null ? void 0 : _f.sourceUrl) || "/milk/img/post_noimage.webp", 0)}${add_attribute("alt", post2 == null ? void 0 : post2.title, 0)} loading="${"lazy"}" width="${"250"}" height="${"141"}" class="${"svelte-1qbsj4z"}">
							</picture></a>
						<h3 class="${"svelte-1qbsj4z"}"><a${add_attribute("href", `${blog_path}/${post2 == null ? void 0 : post2.slug}`, 0)}${add_attribute("title", `${post2 == null ? void 0 : post2.title}`, 0)} class="${"svelte-1qbsj4z"}"><span class="${"post-title"}">${escape(post2 == null ? void 0 : post2.title)}</span>
							</a></h3>
						<div class="${"post-detials svelte-1qbsj4z"}">By: ${escape((_h = (_g = post2 == null ? void 0 : post2.author) == null ? void 0 : _g.node) == null ? void 0 : _h.name)}
							\xA0\xA0|\xA0\xA0
							${escape(getDate(post2 == null ? void 0 : post2.date))}</div>
						<div class="${"excerpt"}">${post2 == null ? void 0 : post2.excerpt}</div>
						<div class="${"more svelte-1qbsj4z"}"><a${add_attribute("href", `${blog_path}/${post2 == null ? void 0 : post2.slug}`, 0)}${add_attribute("title", `${post2 == null ? void 0 : post2.title}`, 0)} class="${"fancy-link svelte-1qbsj4z"}"><span>Read More</span></a>
						</div></div>
				</div>`;
  }) : `<div><h2 style="${"text-align: center;"}" class="${"svelte-1qbsj4z"}">Looking for matching Blog Posts
					</h2>
				</div>`}</div>
		${slots.after ? slots.after({}) : ``}</div>
</div>`;
});
var Block_WP_BlogListAllPages_svelte = ".blog-index.svelte-pcr4mx{position:absolute;margin-left:-999em;left:-999em}";
const css$4 = {
  code: ".blog-index.svelte-pcr4mx{position:absolute;margin-left:-999em;left:-999em}",
  map: '{"version":3,"file":"Block_WP_BlogListAllPages.svelte","sources":["Block_WP_BlogListAllPages.svelte"],"sourcesContent":["<div class=\\"blog-index\\">\\n\\t<div class=\\"blog-inner\\">\\n\\t\\t<div class=\\"posts-grid posts-listing\\">\\n\\t\\t\\t{#each posts as post}\\n\\t\\t\\t\\t<div class=\\"post\\">\\n\\t\\t\\t\\t\\t<div title={`${post?.title}`}>\\n\\t\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\t\\thref={`${blog_path}/${post?.slug}`}\\n\\t\\t\\t\\t\\t\\t\\ttitle={`${post?.title}`}\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t<span class=\\"post-title\\">{post?.title}</span>\\n\\t\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t{/each}\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<script>function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount, onDestroy } from \'svelte\';\\n/* ## MILK ## */\\n\\nimport { milk } from \'$milk/milk.js\';\\nimport { debounce } from \'$milk/util/helpers.js\';\\n/* ## Vairables ## */\\n\\nvar blog_path = \'/blog\';\\nvar posts = [];\\n/* ## Data Loading ## */\\n\\nvar unsubscribe_blogs = /*#__PURE__*/function () {\\n  var _ref = _asyncToGenerator(function* () {});\\n\\n  return function unsubscribe_blogs() {\\n    return _ref.apply(this, arguments);\\n  };\\n}();\\n\\nimport { Q_LIST_ALL_POSTS } from \'$graphql/wordpress.graphql.js\';\\n/* ## Main ## */\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  yield debouncedBlogListing();\\n}));\\n\\nvar getBlogListing = /*#__PURE__*/function () {\\n  var _ref3 = _asyncToGenerator(function* () {\\n    var _$milk, _$milk$data;\\n\\n    var queryVariables = {};\\n    var getBlogs = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_LIST_ALL_POSTS, $milk.data.sources.wordpress, queryVariables);\\n    unsubscribe_blogs = yield getBlogs == null ? void 0 : getBlogs.subscribe( /*#__PURE__*/function () {\\n      var _ref4 = _asyncToGenerator(function* (fetched_data) {\\n        var _data$posts;\\n\\n        var data = yield fetched_data;\\n        console.log(data);\\n        posts = data == null ? void 0 : (_data$posts = data.posts) == null ? void 0 : _data$posts.nodes;\\n      });\\n\\n      return function (_x) {\\n        return _ref4.apply(this, arguments);\\n      };\\n    }());\\n  });\\n\\n  return function getBlogListing() {\\n    return _ref3.apply(this, arguments);\\n  };\\n}();\\n\\nvar debouncedBlogListing = debounce(() => {\\n  getBlogListing();\\n}, 500, false);\\n/* ## Exit ## */\\n\\nonDestroy(() => {\\n  unsubscribe_blogs(); // important for garbage collection otherwise memory leak\\n});\\nexport { blog_path };</script>\\n\\n<style>.blog-index{position:absolute;margin-left:-999em;left:-999em}</style>\\n"],"names":[],"mappings":"AAsFO,yBAAW,CAAC,SAAS,QAAQ,CAAC,YAAY,MAAM,CAAC,KAAK,MAAM,CAAC"}'
};
function asyncGeneratorStep$7(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$7(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$7(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$7(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Block_WP_BlogListAllPages = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var {blog_path = "/blog"} = $$props;
  var posts = [];
  var unsubscribe_blogs = /* @__PURE__ */ function() {
    var _ref = _asyncToGenerator$7(function* () {
    });
    return function unsubscribe_blogs2() {
      return _ref.apply(this, arguments);
    };
  }();
  onMount(/* @__PURE__ */ _asyncToGenerator$7(function* () {
    yield debouncedBlogListing();
  }));
  var getBlogListing = /* @__PURE__ */ function() {
    var _ref3 = _asyncToGenerator$7(function* () {
      var _$milk, _$milk$data;
      var queryVariables = {};
      var getBlogs = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_LIST_ALL_POSTS, $milk.data.sources.wordpress, queryVariables);
      unsubscribe_blogs = yield getBlogs == null ? void 0 : getBlogs.subscribe(/* @__PURE__ */ function() {
        var _ref4 = _asyncToGenerator$7(function* (fetched_data) {
          var _data$posts;
          var data = yield fetched_data;
          console.log(data);
          posts = data == null ? void 0 : (_data$posts = data.posts) == null ? void 0 : _data$posts.nodes;
        });
        return function(_x) {
          return _ref4.apply(this, arguments);
        };
      }());
    });
    return function getBlogListing2() {
      return _ref3.apply(this, arguments);
    };
  }();
  var debouncedBlogListing = debounce(() => {
    getBlogListing();
  }, 500, false);
  onDestroy(() => {
    unsubscribe_blogs();
  });
  if ($$props.blog_path === void 0 && $$bindings.blog_path && blog_path !== void 0)
    $$bindings.blog_path(blog_path);
  $$result.css.add(css$4);
  $$unsubscribe_milk();
  return `<div class="${"blog-index svelte-pcr4mx"}"><div class="${"blog-inner"}"><div class="${"posts-grid posts-listing"}">${each(posts, (post2) => `<div class="${"post"}"><div${add_attribute("title", `${post2 == null ? void 0 : post2.title}`, 0)}><a${add_attribute("href", `${blog_path}/${post2 == null ? void 0 : post2.slug}`, 0)}${add_attribute("title", `${post2 == null ? void 0 : post2.title}`, 0)}><span class="${"post-title"}">${escape(post2 == null ? void 0 : post2.title)}</span>
						</a></div>
				</div>`)}</div></div>
</div>`;
});
function asyncGeneratorStep$6(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$6(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$6(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$6(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Block_WP_BlogCategorySelector = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var {category} = $$props;
  var {size = 99} = $$props;
  var blog_categories = [];
  var unsubscribe_blogcategories = () => {
  };
  onMount(/* @__PURE__ */ _asyncToGenerator$6(function* () {
    var _$milk, _$milk$data;
    var queryVariables = {size};
    var getBlogCategories = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_POST_CATEGORIES, $milk.data.sources.wordpress, queryVariables);
    unsubscribe_blogcategories = yield getBlogCategories == null ? void 0 : getBlogCategories.subscribe(/* @__PURE__ */ function() {
      var _ref2 = _asyncToGenerator$6(function* (fetched_data) {
        var _data$categories;
        var data = yield fetched_data;
        blog_categories = data == null ? void 0 : (_data$categories = data.categories) == null ? void 0 : _data$categories.nodes;
      });
      return function(_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  }));
  onDestroy(() => {
    unsubscribe_blogcategories();
  });
  if ($$props.category === void 0 && $$bindings.category && category !== void 0)
    $$bindings.category(category);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$unsubscribe_milk();
  return `<div class="${"blog-categories"}"><label for="${"blog_category"}">Category:</label>
	<select name="${"blog_category"}"${add_attribute("value", category, 1)}><option value="${""}">All </option>${each(blog_categories, (blog_category) => `<option${add_attribute("value", blog_category.name, 0)}>${escape(blog_category.name)}
			</option>`)}</select>
</div>`;
});
function asyncGeneratorStep$5(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$5(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$5(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$5(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Block_WP_BlogSearch = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var {search} = $$props;
  onMount(/* @__PURE__ */ _asyncToGenerator$5(function* () {
    var urlParams = new URLSearchParams(window.location.search);
    var s = urlParams.get("s");
    search = s;
  }));
  if ($$props.search === void 0 && $$bindings.search && search !== void 0)
    $$bindings.search(search);
  return `<div class="${"blog-search"}"><label for="${"blog_search"}">Search:</label>
	<input type="${"search"}" placeholder="${"Search For..."}"${add_attribute("value", search, 1)}>
</div>`;
});
function asyncGeneratorStep$4(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$4(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$4(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$4(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Block_WP_BlogPerPage = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var {size = 10} = $$props;
  var {options = [10, 20, 50, 100]} = $$props;
  var setSize = () => {
  };
  onMount(/* @__PURE__ */ _asyncToGenerator$4(function* () {
    var tmpSize = window.localStorage.getItem("size");
    if (tmpSize) {
      size = parseInt(tmpSize);
    }
    setSize = (s) => {
      window.localStorage.setItem("size", size);
      console.log({size});
    };
  }));
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  {
    {
      setSize(size);
    }
  }
  return `<div class="${"blog-perpage"}"><div class="${"blog-perpage-inner"}"><label for="${"perpage"}">Per Page:</label>
		<select name="${"perpage"}"${add_attribute("value", size, 1)}>${each(options, (option) => `<option${add_attribute("value", option, 0)}>${escape(option)}</option>`)}</select></div>
</div>`;
});
function asyncGeneratorStep$3(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$3(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$3(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$3(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Block_WP_BlogPagination = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var {count} = $$props;
  var {offset = 0} = $$props;
  var {size = 10} = $$props;
  var page2 = 1;
  var pages = 0;
  var doPage = () => {
  };
  onMount(/* @__PURE__ */ _asyncToGenerator$3(function* () {
    doPage = (page3) => {
      offset = page3 * size - size;
    };
  }));
  if ($$props.count === void 0 && $$bindings.count && count !== void 0)
    $$bindings.count(count);
  if ($$props.offset === void 0 && $$bindings.offset && offset !== void 0)
    $$bindings.offset(offset);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  pages = parseInt(count / size) + 1;
  page2 = parseInt(offset / size) + 1;
  {
    {
      doPage(page2);
    }
  }
  return `<div class="${"blog-pagination"}"><div class="${"blog-pagination-inner"}">${count > 0 ? `<label for="${"pagination"}">Pages:</label>
			<select name="${"pagination"}"${add_attribute("value", page2, 1)}>${each({length: pages}, (_, i) => `<option${add_attribute("value", i + 1, 0)}>${escape(i + 1)}</option>`)}</select>
			of ${escape(pages)}` : ``}</div>
</div>`;
});
var index_svelte$2 = ".controls.svelte-1ky4qdg,.pagination.svelte-1ky4qdg{display:block;padding:50px 20px 0;padding:50px var(--padding-inner,20px) 0;color:#000;color:var(--color-black,#000)}.controls-inner.svelte-1ky4qdg,.pagination-inner.svelte-1ky4qdg{margin:0 auto;max-width:var(--content-constrain);padding:0 var(--padding)}.pagination-inner.svelte-1ky4qdg,.pagination.svelte-1ky4qdg{margin-bottom:50px;text-align:left}";
const css$3 = {
  code: ".controls.svelte-1ky4qdg,.pagination.svelte-1ky4qdg{display:block;padding:50px 20px 0;padding:50px var(--padding-inner,20px) 0;color:#000;color:var(--color-black,#000)}.controls-inner.svelte-1ky4qdg,.pagination-inner.svelte-1ky4qdg{margin:0 auto;max-width:var(--content-constrain);padding:0 var(--padding)}.pagination.svelte-1ky4qdg,.pagination-inner.svelte-1ky4qdg{margin-bottom:50px;text-align:left}",
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<Head_Language lang=\\"en\\" />\\n<Head_HTML {title} {description} keywords={$milk?.site?.keywords} />\\n<Head_Facebook {title} {description} image=\\"/img/hero_blog_01.jpg\\" />\\n<Head_Twitter {title} {description} image=\\"/img/hero_blog_01.jpg\\" />\\n<Layout_Main id=\\"blog\\">\\n\\t<Hero\\n\\t\\tid=\\"hero-immigration-blog-01\\"\\n\\t\\timage_url=\\"/img/hero_blog_01.jpg\\"\\n\\t\\timg_srcset=\\"/img/hero_blog_01.jpg\\"\\n\\t\\tavif_srcset=\\"/img/hero_blog_01.avif\\"\\n\\t\\twebp_srcset=\\"/img/hero_blog_01.webp\\"\\n\\t\\ttitle=\\"Harlan York and Associates\\"\\n\\t\\tparallax=\\"false\\">&nbsp;</Hero\\n\\t>\\n\\t<Block_CallOutText\\n\\t\\tid=\\"call-out-text\\"\\n\\t\\tblockstyle=\\"block-style01\\"\\n\\t\\textraclasses=\\"floating-calltoaction\\"\\n\\t\\ttitle=\\"Immigration Law Blog\\"\\n\\t>\\n\\t\\t<p>{description}</p>\\n\\t</Block_CallOutText>\\n\\t<div class=\\"controls\\">\\n\\t\\t<div class=\\"controls-inner\\">\\n\\t\\t\\t<Block_WP_BlogCategorySelector bind:category />\\n\\t\\t\\t<Block_WP_BlogSearch bind:search />\\n\\t\\t</div>\\n\\t</div>\\n\\t<Block_WP_BlogListing\\n\\t\\tid=\\"blogposts\\"\\n\\t\\tblockstyle=\\"\\"\\n\\t\\tblog_path=\\"/immigration-law-blog\\"\\n\\t\\tbind:offset\\n\\t\\tbind:size\\n\\t\\tbind:count\\n\\t\\tbind:category\\n\\t\\tbind:search\\n\\t\\ttitle=\\"Blog Posts\\"\\n\\t/>\\n\\t<div class=\\"pagination\\">\\n\\t\\t<div class=\\"pagination-inner\\">\\n\\t\\t\\t<Block_WP_BlogPerPage bind:size options={[1, 10, 20, 50, 100]} />\\n\\t\\t\\t<Block_WP_BlogPagination bind:count bind:offset bind:size />\\n\\t\\t</div>\\n\\t</div>\\n\\t<Block_WP_BlogListAllPages blog_path=\\"/immigration-law-blog\\" />\\n\\t<Block_CallToAction\\n\\t\\tid=\\"call-to-action\\"\\n\\t\\tblockstyle=\\"block-style01\\"\\n\\t\\textraclasses=\\"regular-calltoaction\\"\\n\\t/>\\n\\t<Block_Languages id=\\"languages\\" blockstyle=\\"block-style04\\" />\\n\\t<Block_Featured id=\\"featured\\" blockstyle=\\"\\" />\\n\\t<Block_Ratings id=\\"ratings\\" blockstyle=\\"\\" />\\n\\t<SocialMedia id=\\"socialmedia\\" blockstyle=\\"\\" />\\n</Layout_Main>\\n\\n<script>var _$milk, _$milk$site;\\n\\n/* ## MILK ## */\\nimport { milk } from '$milk/milk.js';\\n/* ## Components ## */\\n\\nimport Head_Language from '$milk/lib/Head_Language.svelte';\\nimport Head_HTML from '$milk/lib/Head_HTML.svelte';\\nimport Head_Facebook from '$milk/lib/Head_Facebook.svelte';\\nimport Head_Twitter from '$milk/lib/Head_Twitter.svelte';\\nimport Layout_Main from '$theme/Layout_Main.svelte';\\nimport Hero from '$milk/lib/Hero.svelte';\\nimport Block_CallOutText from '$theme/Block_CallOutText.svelte';\\nimport Block_CallToAction from '$theme/Block_CallToAction.svelte';\\nimport Block_Languages from '$theme/Block_Languages.svelte';\\nimport Block_WP_BlogListing from '$milk/lib/Block_WP_BlogListing.svelte';\\nimport Block_WP_BlogListAllPages from '$milk/lib/Block_WP_BlogListAllPages.svelte';\\nimport Block_WP_BlogCategorySelector from '$milk/lib/Block_WP_BlogCategorySelector.svelte';\\nimport Block_WP_BlogSearch from '$milk/lib/Block_WP_BlogSearch.svelte';\\nimport Block_WP_BlogPerPage from '$milk/lib/Block_WP_BlogPerPage.svelte';\\nimport Block_WP_BlogPagination from '$milk/lib/Block_WP_BlogPagination.svelte';\\nimport Block_Featured from '$theme/Block_Featured.svelte';\\nimport SocialMedia from '$milk/lib/SocialMedia.svelte';\\nimport Block_Ratings from '$theme/Block_Ratings.svelte';\\n/* ## Variables ## */\\n\\nvar title = \\"Immigration Blog - \\" + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.title);\\nvar description = 'Immigration law is a constantly changing legal field. Immigration lawyer Harlan York provides this blog, so you can stay up to date on how legal trends affect immigration law cases.';\\nvar category = '';\\nvar search = '';\\nvar count = 0;\\nvar offset = 0;\\nvar size = 10;</script>\\n\\n<style>.content{text-align:center}.title{position:relative;margin-bottom:-100px}.controls,.pagination{display:block;padding:50px 20px 0;padding:50px var(--padding-inner,20px) 0;color:#000;color:var(--color-black,#000)}.controls-inner,.pagination-inner{margin:0 auto;max-width:var(--content-constrain);padding:0 var(--padding)}.pagination,.pagination-inner{margin-bottom:50px;text-align:left}</style>\\n"],"names":[],"mappings":"AA2FgF,wBAAS,CAAC,0BAAW,CAAC,QAAQ,KAAK,CAAC,QAAQ,IAAI,CAAC,IAAI,CAAC,CAAC,CAAC,QAAQ,IAAI,CAAC,IAAI,eAAe,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,MAAM,IAAI,CAAC,MAAM,IAAI,aAAa,CAAC,IAAI,CAAC,CAAC,8BAAe,CAAC,gCAAiB,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,IAAI,mBAAmB,CAAC,CAAC,QAAQ,CAAC,CAAC,IAAI,SAAS,CAAC,CAAC,0BAAW,CAAC,gCAAiB,CAAC,cAAc,IAAI,CAAC,WAAW,IAAI,CAAC"}`
};
var description$2 = "Immigration law is a constantly changing legal field. Immigration lawyer Harlan York provides this blog, so you can stay up to date on how legal trends affect immigration law cases.";
const Immigration_law_blog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a;
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var _$milk, _$milk$site;
  var title = "Immigration Blog - " + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.title);
  var category = "";
  var search = "";
  var count = 0;
  var offset = 0;
  var size = 10;
  $$result.css.add(css$3);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Head_Language, "Head_Language").$$render($$result, {lang: "en"}, {}, {})}
${validate_component(Head_HTML, "Head_HTML").$$render($$result, {
      title,
      description: description$2,
      keywords: (_a = $milk == null ? void 0 : $milk.site) == null ? void 0 : _a.keywords
    }, {}, {})}
${validate_component(Head_Facebook, "Head_Facebook").$$render($$result, {
      title,
      description: description$2,
      image: "/img/hero_blog_01.jpg"
    }, {}, {})}
${validate_component(Head_Twitter, "Head_Twitter").$$render($$result, {
      title,
      description: description$2,
      image: "/img/hero_blog_01.jpg"
    }, {}, {})}
${validate_component(Layout_Main, "Layout_Main").$$render($$result, {id: "blog"}, {}, {
      default: () => `${validate_component(Hero, "Hero").$$render($$result, {
        id: "hero-immigration-blog-01",
        image_url: "/img/hero_blog_01.jpg",
        img_srcset: "/img/hero_blog_01.jpg",
        avif_srcset: "/img/hero_blog_01.avif",
        webp_srcset: "/img/hero_blog_01.webp",
        title: "Harlan York and Associates",
        parallax: "false"
      }, {}, {})}
	${validate_component(Block_CallOutText, "Block_CallOutText").$$render($$result, {
        id: "call-out-text",
        blockstyle: "block-style01",
        extraclasses: "floating-calltoaction",
        title: "Immigration Law Blog"
      }, {}, {
        default: () => `<p>${escape(description$2)}</p>`
      })}
	<div class="${"controls svelte-1ky4qdg"}"><div class="${"controls-inner svelte-1ky4qdg"}">${validate_component(Block_WP_BlogCategorySelector, "Block_WP_BlogCategorySelector").$$render($$result, {category}, {
        category: ($$value) => {
          category = $$value;
          $$settled = false;
        }
      }, {})}
			${validate_component(Block_WP_BlogSearch, "Block_WP_BlogSearch").$$render($$result, {search}, {
        search: ($$value) => {
          search = $$value;
          $$settled = false;
        }
      }, {})}</div></div>
	${validate_component(Block_WP_BlogListing, "Block_WP_BlogListing").$$render($$result, {
        id: "blogposts",
        blockstyle: "",
        blog_path: "/immigration-law-blog",
        title: "Blog Posts",
        offset,
        size,
        count,
        category,
        search
      }, {
        offset: ($$value) => {
          offset = $$value;
          $$settled = false;
        },
        size: ($$value) => {
          size = $$value;
          $$settled = false;
        },
        count: ($$value) => {
          count = $$value;
          $$settled = false;
        },
        category: ($$value) => {
          category = $$value;
          $$settled = false;
        },
        search: ($$value) => {
          search = $$value;
          $$settled = false;
        }
      }, {})}
	<div class="${"pagination svelte-1ky4qdg"}"><div class="${"pagination-inner svelte-1ky4qdg"}">${validate_component(Block_WP_BlogPerPage, "Block_WP_BlogPerPage").$$render($$result, {options: [1, 10, 20, 50, 100], size}, {
        size: ($$value) => {
          size = $$value;
          $$settled = false;
        }
      }, {})}
			${validate_component(Block_WP_BlogPagination, "Block_WP_BlogPagination").$$render($$result, {count, offset, size}, {
        count: ($$value) => {
          count = $$value;
          $$settled = false;
        },
        offset: ($$value) => {
          offset = $$value;
          $$settled = false;
        },
        size: ($$value) => {
          size = $$value;
          $$settled = false;
        }
      }, {})}</div></div>
	${validate_component(Block_WP_BlogListAllPages, "Block_WP_BlogListAllPages").$$render($$result, {blog_path: "/immigration-law-blog"}, {}, {})}
	${validate_component(Block_CallToAction, "Block_CallToAction").$$render($$result, {
        id: "call-to-action",
        blockstyle: "block-style01",
        extraclasses: "regular-calltoaction"
      }, {}, {})}
	${validate_component(Block_Languages, "Block_Languages").$$render($$result, {
        id: "languages",
        blockstyle: "block-style04"
      }, {}, {})}
	${validate_component(Block_Featured, "Block_Featured").$$render($$result, {id: "featured", blockstyle: ""}, {}, {})}
	${validate_component(Block_Ratings, "Block_Ratings").$$render($$result, {id: "ratings", blockstyle: ""}, {}, {})}
	${validate_component(SocialMedia, "SocialMedia").$$render($$result, {id: "socialmedia", blockstyle: ""}, {}, {})}`
    })}`;
  } while (!$$settled);
  $$unsubscribe_milk();
  return $$rendered;
});
var index$2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: Immigration_law_blog
});
var blog_svelte = ".blog-topbar.svelte-ywg8f2.svelte-ywg8f2{position:relative;margin:-20px 0 20px}.breadcrumbs.svelte-ywg8f2.svelte-ywg8f2{font-size:var(--small-fontsize)}.breadcrumbs.svelte-ywg8f2 a.svelte-ywg8f2{color:var(--color-black)}.breadcrumbs.svelte-ywg8f2 a.svelte-ywg8f2:hover{color:var(--color-four)}.author.svelte-ywg8f2.svelte-ywg8f2{background:var(--color-seven);color:var(--color-white);text-align:center;margin:75px auto 25px}.author-image.svelte-ywg8f2.svelte-ywg8f2{text-align:center;position:relative}.author-image.svelte-ywg8f2 img.svelte-ywg8f2{border-radius:50%;overflow:hidden;margin:25px;width:80%;max-width:250px;height:auto}@media screen and (min-width:650px){.author.svelte-ywg8f2.svelte-ywg8f2{display:grid;grid-template-columns:1fr 2fr;text-align:left;-moz-column-gap:3em;grid-column-gap:3em;column-gap:3em}.author-image.svelte-ywg8f2.svelte-ywg8f2{text-align:center}}.author-content.svelte-ywg8f2.svelte-ywg8f2{padding:20px}.author-content.svelte-ywg8f2 h2.svelte-ywg8f2{color:var(--color-white)}.content.svelte-ywg8f2 .author a.svelte-ywg8f2{color:var(--color-white)!important}.content.svelte-ywg8f2 .author a.button.svelte-ywg8f2{background:var(--color-four);text-transform:uppercase;font-weight:700;margin-right:25px;border:0}.content.svelte-ywg8f2 .author a.button.svelte-ywg8f2:hover{background:var(--color-black)}";
const css$1$2 = {
  code: ".blog-topbar.svelte-ywg8f2.svelte-ywg8f2{position:relative;margin:-20px 0 20px}.breadcrumbs.svelte-ywg8f2.svelte-ywg8f2{font-size:var(--small-fontsize)}.breadcrumbs.svelte-ywg8f2 a.svelte-ywg8f2{color:var(--color-black)}.breadcrumbs.svelte-ywg8f2 a.svelte-ywg8f2:hover{color:var(--color-four)}.author.svelte-ywg8f2.svelte-ywg8f2{background:var(--color-seven);color:var(--color-white);text-align:center;margin:75px auto 25px}.author-image.svelte-ywg8f2.svelte-ywg8f2{text-align:center;position:relative}.author-image.svelte-ywg8f2 img.svelte-ywg8f2{border-radius:50%;overflow:hidden;margin:25px;width:80%;max-width:250px;height:auto}@media screen and (min-width:650px){.author.svelte-ywg8f2.svelte-ywg8f2{display:grid;grid-template-columns:1fr 2fr;text-align:left;grid-column-gap:3em;-moz-column-gap:3em;column-gap:3em}.author-image.svelte-ywg8f2.svelte-ywg8f2{text-align:center}}.author-content.svelte-ywg8f2.svelte-ywg8f2{padding:20px}.author-content.svelte-ywg8f2 h2.svelte-ywg8f2{color:var(--color-white)}.content.svelte-ywg8f2 .author a.svelte-ywg8f2{color:var(--color-white)!important}.content.svelte-ywg8f2 .author a.button.svelte-ywg8f2{background:var(--color-four);text-transform:uppercase;font-weight:700;margin-right:25px;border:0}.content.svelte-ywg8f2 .author a.button.svelte-ywg8f2:hover{background:var(--color-black)}",
  map: `{"version":3,"file":"blog.svelte","sources":["blog.svelte"],"sourcesContent":["<svelte:head>\\n\\t{#each blog_css as css}\\n\\t\\t<link\\n\\t\\t\\tasync\\n\\t\\t\\thref={ (css.src.startsWith('http')) ? \`\${css.src}\` : \`\${$milk.site.admin_url}\${css.src}\` }\\n\\t\\t\\trel=\\"preload\\"\\n\\t\\t\\tas=\\"style\\"\\n\\t\\t/>\\n\\t\\t<link\\n\\t\\t\\tasync\\n\\t\\t\\thref={ (css.src.startsWith('http')) ? \`\${css.src}\` : \`\${$milk.site.admin_url}\${css.src}\` }\\n\\t\\t\\trel=\\"stylesheet\\"\\n\\t\\t/>\\n\\t{/each}\\n\\t{#each blog_scripts as script}\\n\\t\\t<script\\n\\t\\t\\tdefer\\n\\t\\t\\tsrc={ (script.src.startsWith('http')) ? \`\${script.src}\` : \`\${$milk.site.admin_url}\${script.src}\` }\\n\\t\\t/>\\n\\t{/each}\\n\\t<link rel=\\"stylesheet\\" href={themestyle} />\\n</svelte:head>\\n\\n<Head_Language lang=\\"en\\" />\\n<Head_HTML {title} {description} keywords={$milk?.site?.keywords} />\\n<Head_Facebook {title} {description} {image} />\\n<Head_Twitter {title} {description} {image} />\\n<Layout_Main id=\\"blog-post\\">\\n\\t{#each blog_posts as blog_post}\\n\\t\\t<Head_Article author={blog_post?.author?.node?.name} pubdate={blog_post?.date} />\\n\\t\\t<Hero\\n\\t\\t\\tid=\\"blog-post-hero\\"\\n\\t\\t\\timage_url={blog_post?.featuredImage?.node?.sourceUrl}\\n\\t\\t\\timg_srcset={blog_post?.featuredImage?.node?.srcSet}\\n\\t\\t\\tavif_srcset=\\"\\"\\n\\t\\t\\twebp_srcset=\\"\\"\\n\\t\\t\\ttitle=\\"Harlan York and Associates\\"\\n\\t\\t\\tparallax=\\"false\\">&nbsp;</Hero\\n\\t\\t>\\n\\t\\t<Block_CallOutText\\n\\t\\t\\tid=\\"call-out-text\\"\\n\\t\\t\\tblockstyle=\\"block-style01\\"\\n\\t\\t\\textraclasses=\\"floating-calltoaction\\"\\n\\t\\t\\ttitle={blog_post?.title}\\n\\t\\t>\\n\\t\\t\\t<div class=\\"callout-detials\\">\\n\\t\\t\\t\\tBy: {blog_post?.author?.node?.name}\\n\\t\\t\\t\\t&nbsp;&nbsp;|&nbsp;&nbsp;\\n\\t\\t\\t\\t{months[post_date.getMonth()]}\\n\\t\\t\\t\\t{post_date.getDate()},\\n\\t\\t\\t\\t{post_date.getFullYear()}\\n\\t\\t\\t</div>\\n\\t\\t</Block_CallOutText>\\n\\t\\t<div class=\\"content\\">\\n\\t\\t\\t<div class=\\"content-inner\\">\\n\\t\\t\\t\\t<div class=\\"blog-topbar\\">\\n\\t\\t\\t\\t\\t<div class=\\"breadcrumbs\\">\\n\\t\\t\\t\\t\\t\\t<a href=\\"/\\">Home</a>\\n\\t\\t\\t\\t\\t\\t\u203A\\n\\t\\t\\t\\t\\t\\t<a href=\\"/immigration-law-blog\\">Blog</a>\\n\\t\\t\\t\\t\\t\\t\u203A\\n\\t\\t\\t\\t\\t\\t<a href={\`/immigration-law-blog/\${blog_post?.slug}\`}>{blog_post?.title}</a>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t<div class=\\"blog-content\\">\\n\\t\\t\\t\\t\\t{@html blog_post?.content}\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t<div class=\\"author\\">\\n\\t\\t\\t\\t\\t<div class=\\"author-image\\">\\n\\t\\t\\t\\t\\t\\t<picture>\\n\\t\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"image/avif\\"\\n\\t\\t\\t\\t\\t\\t\\t\\tsrcset={blog_post?.author?.node?.Users?.avifImage\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"image/webp\\"\\n\\t\\t\\t\\t\\t\\t\\t\\tsrcset={blog_post?.author?.node?.Users?.webpImage\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\t\\t\\tsrc={blog_post?.author?.node?.Users?.jpegImage?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\talt={blog_post?.author?.node?.name}\\n\\t\\t\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\t\\t\\twidth=\\"260\\"\\n\\t\\t\\t\\t\\t\\t\\t\\theight=\\"260\\"\\n\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t</picture>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t<div class=\\"author-content\\">\\n\\t\\t\\t\\t\\t\\t<h2>About {blog_post?.author?.node?.name}</h2>\\n\\t\\t\\t\\t\\t\\t<p>{blog_post?.author?.node?.description}</p>\\n\\t\\t\\t\\t\\t\\t<div class=\\"author-links\\">\\n\\t\\t\\t\\t\\t\\t\\t{#if blog_post?.author?.node?.Users?.attorneyLink}\\n\\t\\t\\t\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\t\\t\\t\\thref={blog_post?.author?.node?.Users?.attorneyLink}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\ttitle={blog_post?.author?.node?.name}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"button\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tView Full Bio\\n\\t\\t\\t\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t\\t\\t<a href=\\"/immigration-attorneys\\" class=\\"fancy-link\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t<span>See Our Attorneys</span>\\n\\t\\t\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t{/each}\\n\\t<Block_Testimonials id=\\"testimonials\\" blockstyle=\\"block-style05\\" />\\n\\n\\t<Block_CallToAction\\n\\t\\tid=\\"call-to-action\\"\\n\\t\\tblockstyle=\\"block-style01\\"\\n\\t\\textraclasses=\\"regular-calltoaction\\"\\n\\t/>\\n\\t<Block_LanguagesWeSpeak />\\n\\t<Block_Languages id=\\"languages\\" blockstyle=\\"block-style04\\" />\\n\\t<Block_Featured id=\\"featured\\" blockstyle=\\"\\" />\\n\\t<Block_Ratings id=\\"ratings\\" blockstyle=\\"\\" />\\n\\t<SocialMedia id=\\"socialmedia\\" blockstyle=\\"\\" />\\n</Layout_Main>\\n\\n<script>var _$milk, _$milk$site, _$milk2, _$milk2$site, _$milk3, _$milk3$site;\\n\\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount, onDestroy } from 'svelte';\\nimport { page } from '$app/stores';\\n/* ## MILK ## */\\n\\nimport { milk } from '$milk/milk.js';\\n/* ## Components ## */\\n\\nimport Head_Language from '$milk/lib/Head_Language.svelte';\\nimport Head_HTML from '$milk/lib/Head_HTML.svelte';\\nimport Head_Facebook from '$milk/lib/Head_Facebook.svelte';\\nimport Head_Twitter from '$milk/lib/Head_Twitter.svelte';\\nimport Head_Article from '$milk/lib/Head_Article.svelte';\\nimport Layout_Main from '$theme/Layout_Main.svelte';\\nimport Hero from '$milk/lib/Hero.svelte';\\nimport Block_CallOutText from '$theme/Block_CallOutText.svelte';\\nimport Block_ServicesList from '$theme/Block_ServicesList.svelte';\\nimport Block_CallToAction from '$theme/Block_CallToAction.svelte';\\nimport Block_LanguagesWeSpeak from '$theme/Block_LanguagesWeSpeak.svelte';\\nimport Block_Languages from '$theme/Block_Languages.svelte';\\nimport Block_Testimonials from '$theme/Block_Testimonials.svelte';\\nimport Block_Featured from '$theme/Block_Featured.svelte';\\nimport SocialMedia from '$milk/lib/SocialMedia.svelte';\\nimport Block_Ratings from '$theme/Block_Ratings.svelte';\\n/* ## Variables ## */\\n\\nvar title = \\"Immigration Services - \\" + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.title);\\nvar description = (_$milk2 = $milk) == null ? void 0 : (_$milk2$site = _$milk2.site) == null ? void 0 : _$milk2$site.description;\\nvar image = (_$milk3 = $milk) == null ? void 0 : (_$milk3$site = _$milk3.site) == null ? void 0 : _$milk3$site.facebook_photo;\\nvar slug = $page.params.slug;\\nvar themestyle = '';\\n\\n$: themestyle = \\"/themes/\\" + $milk.config.theme + \\"/style.css\\";\\n/* ## Data Loading ## */\\n\\n\\nvar unsubscribe = () => {};\\n\\nvar blog_posts = [];\\nvar blog_css = [];\\nvar blog_scripts = [];\\nvar post_date = new Date();\\nvar months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];\\nimport { Q_GET_POST_BYSLUG } from '$graphql/wordpress.graphql.js';\\n/* ## Main ## */\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  var _$milk4, _$milk4$data;\\n\\n  window.history.replaceState({\\n    additionalInformation: 'Dynamic Blog Routing'\\n  }, 'Immigation Blog', window.location.href.replace('blog/?slug=', '').replace('blog?slug=', ''));\\n  var urlParams = new URLSearchParams(window.location.search);\\n  var checkSlug = urlParams.get('slug');\\n\\n  if (checkSlug && checkSlug.length > 1) {\\n    slug = checkSlug;\\n  } else {\\n    slug = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);\\n  }\\n\\n  ; // console.log({slug});\\n\\n  var queryVariables = {\\n    slug: slug\\n  };\\n  var getPost = (_$milk4 = $milk) == null ? void 0 : (_$milk4$data = _$milk4.data) == null ? void 0 : _$milk4$data.gql(Q_GET_POST_BYSLUG, $milk.data.sources.wordpress, queryVariables, false, 0);\\n  unsubscribe = yield getPost == null ? void 0 : getPost.subscribe( /*#__PURE__*/function () {\\n    var _ref2 = _asyncToGenerator(function* (fetched_data) {\\n      var _data$postBy, _data$postBy2, _data$postBy2$enqueue, _data$postBy3, _data$postBy3$enqueue, _data$featuredImage, _data$featuredImage$n;\\n\\n      var data = yield fetched_data;\\n      post_date = new Date(data == null ? void 0 : (_data$postBy = data.postBy) == null ? void 0 : _data$postBy.date);\\n      blog_css = (data == null ? void 0 : (_data$postBy2 = data.postBy) == null ? void 0 : (_data$postBy2$enqueue = _data$postBy2.enqueuedStylesheets) == null ? void 0 : _data$postBy2$enqueue.nodes) || [];\\n      blog_scripts = (data == null ? void 0 : (_data$postBy3 = data.postBy) == null ? void 0 : (_data$postBy3$enqueue = _data$postBy3.enqueuedScripts) == null ? void 0 : _data$postBy3$enqueue.nodes) || [];\\n      blog_posts = [data == null ? void 0 : data.postBy];\\n      title = data == null ? void 0 : data.title;\\n      description = data == null ? void 0 : data.excerpt;\\n      image = data == null ? void 0 : (_data$featuredImage = data.featuredImage) == null ? void 0 : (_data$featuredImage$n = _data$featuredImage.node) == null ? void 0 : _data$featuredImage$n.sourceUrl;\\n\\n      if (window.location.href.includes('blog/?slug=') || window.location.href.includes('blog?slug=')) {\\n        window.history.replaceState({\\n          additionalInformation: 'Dynamic Blog Routing'\\n        }, title, window.location.href.replace('blog/?slug=', '').replace('blog?slug=', ''));\\n      }\\n\\n      ;\\n    });\\n\\n    return function (_x) {\\n      return _ref2.apply(this, arguments);\\n    };\\n  }());\\n}));\\n/* ## Exit ## */\\n\\nonDestroy(() => {\\n  unsubscribe(); // important for garbage collection otherwise memory leak\\n});\\nexport { slug };</script>\\n\\n<style>.blog-topbar{position:relative;margin:-20px 0 20px}.breadcrumbs{font-size:var(--small-fontsize)}.breadcrumbs a{color:var(--color-black)}.breadcrumbs a:hover{color:var(--color-four)}.author{background:var(--color-seven);color:var(--color-white);text-align:center;margin:75px auto 25px}.author-image{text-align:center;position:relative}.author-image img{border-radius:50%;overflow:hidden;margin:25px;width:80%;max-width:250px;height:auto}@media screen and (min-width:650px){.author{display:grid;grid-template-columns:1fr 2fr;text-align:left;grid-column-gap:3em;-moz-column-gap:3em;column-gap:3em}.author-image{text-align:center}}.author-content{padding:20px}.author-content h2{color:var(--color-white)}.content .author a{color:var(--color-white)!important}.content .author a.button{background:var(--color-four);text-transform:uppercase;font-weight:700;margin-right:25px;border:0}.content .author a.button:hover{background:var(--color-black)}</style>\\n"],"names":[],"mappings":"AAwOO,wCAAY,CAAC,SAAS,QAAQ,CAAC,OAAO,KAAK,CAAC,CAAC,CAAC,IAAI,CAAC,wCAAY,CAAC,UAAU,IAAI,gBAAgB,CAAC,CAAC,0BAAY,CAAC,eAAC,CAAC,MAAM,IAAI,aAAa,CAAC,CAAC,0BAAY,CAAC,eAAC,MAAM,CAAC,MAAM,IAAI,YAAY,CAAC,CAAC,mCAAO,CAAC,WAAW,IAAI,aAAa,CAAC,CAAC,MAAM,IAAI,aAAa,CAAC,CAAC,WAAW,MAAM,CAAC,OAAO,IAAI,CAAC,IAAI,CAAC,IAAI,CAAC,yCAAa,CAAC,WAAW,MAAM,CAAC,SAAS,QAAQ,CAAC,2BAAa,CAAC,iBAAG,CAAC,cAAc,GAAG,CAAC,SAAS,MAAM,CAAC,OAAO,IAAI,CAAC,MAAM,GAAG,CAAC,UAAU,KAAK,CAAC,OAAO,IAAI,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,mCAAO,CAAC,QAAQ,IAAI,CAAC,sBAAsB,GAAG,CAAC,GAAG,CAAC,WAAW,IAAI,CAAC,gBAAgB,GAAG,CAAC,gBAAgB,GAAG,CAAC,WAAW,GAAG,CAAC,yCAAa,CAAC,WAAW,MAAM,CAAC,CAAC,2CAAe,CAAC,QAAQ,IAAI,CAAC,6BAAe,CAAC,gBAAE,CAAC,MAAM,IAAI,aAAa,CAAC,CAAC,sBAAQ,CAAC,OAAO,CAAC,eAAC,CAAC,MAAM,IAAI,aAAa,CAAC,UAAU,CAAC,sBAAQ,CAAC,OAAO,CAAC,CAAC,qBAAO,CAAC,WAAW,IAAI,YAAY,CAAC,CAAC,eAAe,SAAS,CAAC,YAAY,GAAG,CAAC,aAAa,IAAI,CAAC,OAAO,CAAC,CAAC,sBAAQ,CAAC,OAAO,CAAC,CAAC,qBAAO,MAAM,CAAC,WAAW,IAAI,aAAa,CAAC,CAAC"}`
};
function asyncGeneratorStep$2(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$2(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$2(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$2(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Blog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a;
  let $milk, $$unsubscribe_milk;
  let $page, $$unsubscribe_page;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  var _$milk, _$milk$site, _$milk2, _$milk2$site, _$milk3, _$milk3$site;
  var title = "Immigration Services - " + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.title);
  var description2 = (_$milk2 = $milk) == null ? void 0 : (_$milk2$site = _$milk2.site) == null ? void 0 : _$milk2$site.description;
  var image = (_$milk3 = $milk) == null ? void 0 : (_$milk3$site = _$milk3.site) == null ? void 0 : _$milk3$site.facebook_photo;
  var {slug = $page.params.slug} = $$props;
  var themestyle = "";
  var unsubscribe = () => {
  };
  var blog_posts = [];
  var blog_css = [];
  var blog_scripts = [];
  var post_date = new Date();
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  onMount(/* @__PURE__ */ _asyncToGenerator$2(function* () {
    var _$milk4, _$milk4$data;
    window.history.replaceState({
      additionalInformation: "Dynamic Blog Routing"
    }, "Immigation Blog", window.location.href.replace("blog/?slug=", "").replace("blog?slug=", ""));
    var urlParams = new URLSearchParams(window.location.search);
    var checkSlug = urlParams.get("slug");
    if (checkSlug && checkSlug.length > 1) {
      slug = checkSlug;
    } else {
      slug = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);
    }
    var queryVariables = {slug};
    var getPost = (_$milk4 = $milk) == null ? void 0 : (_$milk4$data = _$milk4.data) == null ? void 0 : _$milk4$data.gql(Q_GET_POST_BYSLUG, $milk.data.sources.wordpress, queryVariables, false, 0);
    unsubscribe = yield getPost == null ? void 0 : getPost.subscribe(/* @__PURE__ */ function() {
      var _ref2 = _asyncToGenerator$2(function* (fetched_data) {
        var _data$postBy, _data$postBy2, _data$postBy2$enqueue, _data$postBy3, _data$postBy3$enqueue, _data$featuredImage, _data$featuredImage$n;
        var data = yield fetched_data;
        post_date = new Date(data == null ? void 0 : (_data$postBy = data.postBy) == null ? void 0 : _data$postBy.date);
        blog_css = (data == null ? void 0 : (_data$postBy2 = data.postBy) == null ? void 0 : (_data$postBy2$enqueue = _data$postBy2.enqueuedStylesheets) == null ? void 0 : _data$postBy2$enqueue.nodes) || [];
        blog_scripts = (data == null ? void 0 : (_data$postBy3 = data.postBy) == null ? void 0 : (_data$postBy3$enqueue = _data$postBy3.enqueuedScripts) == null ? void 0 : _data$postBy3$enqueue.nodes) || [];
        blog_posts = [data == null ? void 0 : data.postBy];
        title = data == null ? void 0 : data.title;
        description2 = data == null ? void 0 : data.excerpt;
        image = data == null ? void 0 : (_data$featuredImage = data.featuredImage) == null ? void 0 : (_data$featuredImage$n = _data$featuredImage.node) == null ? void 0 : _data$featuredImage$n.sourceUrl;
        if (window.location.href.includes("blog/?slug=") || window.location.href.includes("blog?slug=")) {
          window.history.replaceState({
            additionalInformation: "Dynamic Blog Routing"
          }, title, window.location.href.replace("blog/?slug=", "").replace("blog?slug=", ""));
        }
      });
      return function(_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  }));
  onDestroy(() => {
    unsubscribe();
  });
  if ($$props.slug === void 0 && $$bindings.slug && slug !== void 0)
    $$bindings.slug(slug);
  $$result.css.add(css$1$2);
  themestyle = "/themes/" + $milk.config.theme + "/style.css";
  $$unsubscribe_milk();
  $$unsubscribe_page();
  return `${$$result.head += `${each(blog_css, (css2) => `<link async${add_attribute("href", css2.src.startsWith("http") ? `${css2.src}` : `${$milk.site.admin_url}${css2.src}`, 0)} rel="${"preload"}" as="${"style"}" data-svelte="svelte-1eol1zw">
		<link async${add_attribute("href", css2.src.startsWith("http") ? `${css2.src}` : `${$milk.site.admin_url}${css2.src}`, 0)} rel="${"stylesheet"}" data-svelte="svelte-1eol1zw">`)}${each(blog_scripts, (script) => `<script defer${add_attribute("src", script.src.startsWith("http") ? `${script.src}` : `${$milk.site.admin_url}${script.src}`, 0)} data-svelte="svelte-1eol1zw"></script>`)}<link rel="${"stylesheet"}"${add_attribute("href", themestyle, 0)} data-svelte="svelte-1eol1zw">`, ""}

${validate_component(Head_Language, "Head_Language").$$render($$result, {lang: "en"}, {}, {})}
${validate_component(Head_HTML, "Head_HTML").$$render($$result, {
    title,
    description: description2,
    keywords: (_a = $milk == null ? void 0 : $milk.site) == null ? void 0 : _a.keywords
  }, {}, {})}
${validate_component(Head_Facebook, "Head_Facebook").$$render($$result, {title, description: description2, image}, {}, {})}
${validate_component(Head_Twitter, "Head_Twitter").$$render($$result, {title, description: description2, image}, {}, {})}
${validate_component(Layout_Main, "Layout_Main").$$render($$result, {id: "blog-post"}, {}, {
    default: () => `${each(blog_posts, (blog_post) => {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F;
      return `${validate_component(Head_Article, "Head_Article").$$render($$result, {
        author: (_b = (_a2 = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _a2.node) == null ? void 0 : _b.name,
        pubdate: blog_post == null ? void 0 : blog_post.date
      }, {}, {})}
		${validate_component(Hero, "Hero").$$render($$result, {
        id: "blog-post-hero",
        image_url: (_d = (_c = blog_post == null ? void 0 : blog_post.featuredImage) == null ? void 0 : _c.node) == null ? void 0 : _d.sourceUrl,
        img_srcset: (_f = (_e = blog_post == null ? void 0 : blog_post.featuredImage) == null ? void 0 : _e.node) == null ? void 0 : _f.srcSet,
        avif_srcset: "",
        webp_srcset: "",
        title: "Harlan York and Associates",
        parallax: "false"
      }, {}, {})}
		${validate_component(Block_CallOutText, "Block_CallOutText").$$render($$result, {
        id: "call-out-text",
        blockstyle: "block-style01",
        extraclasses: "floating-calltoaction",
        title: blog_post == null ? void 0 : blog_post.title
      }, {}, {
        default: () => {
          var _a3, _b2;
          return `<div class="${"callout-detials"}">By: ${escape((_b2 = (_a3 = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _a3.node) == null ? void 0 : _b2.name)}
				\xA0\xA0|\xA0\xA0
				${escape(months[post_date.getMonth()])}
				${escape(post_date.getDate())},
				${escape(post_date.getFullYear())}</div>
		`;
        }
      })}
		<div class="${"content svelte-ywg8f2"}"><div class="${"content-inner"}"><div class="${"blog-topbar svelte-ywg8f2"}"><div class="${"breadcrumbs svelte-ywg8f2"}"><a href="${"/"}" class="${"svelte-ywg8f2"}">Home</a>
						\u203A
						<a href="${"/immigration-law-blog"}" class="${"svelte-ywg8f2"}">Blog</a>
						\u203A
						<a${add_attribute("href", `/immigration-law-blog/${blog_post == null ? void 0 : blog_post.slug}`, 0)} class="${"svelte-ywg8f2"}">${escape(blog_post == null ? void 0 : blog_post.title)}</a>
					</div></div>
				<div class="${"blog-content"}">${blog_post == null ? void 0 : blog_post.content}</div>
				<div class="${"author svelte-ywg8f2"}"><div class="${"author-image svelte-ywg8f2"}"><picture><source type="${"image/avif"}"${add_attribute("srcset", (_j = (_i = (_h = (_g = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _g.node) == null ? void 0 : _h.Users) == null ? void 0 : _i.avifImage) == null ? void 0 : _j.sourceUrl, 0)}>
							<source type="${"image/webp"}"${add_attribute("srcset", (_n = (_m = (_l = (_k = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _k.node) == null ? void 0 : _l.Users) == null ? void 0 : _m.webpImage) == null ? void 0 : _n.sourceUrl, 0)}>
							<img${add_attribute("src", (_r = (_q = (_p = (_o = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _o.node) == null ? void 0 : _p.Users) == null ? void 0 : _q.jpegImage) == null ? void 0 : _r.sourceUrl, 0)}${add_attribute("alt", (_t = (_s = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _s.node) == null ? void 0 : _t.name, 0)} loading="${"lazy"}" width="${"260"}" height="${"260"}" class="${"svelte-ywg8f2"}">
						</picture></div>
					<div class="${"author-content svelte-ywg8f2"}"><h2 class="${"svelte-ywg8f2"}">About ${escape((_v = (_u = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _u.node) == null ? void 0 : _v.name)}</h2>
						<p>${escape((_x = (_w = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _w.node) == null ? void 0 : _x.description)}</p>
						<div class="${"author-links"}">${((_A = (_z = (_y = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _y.node) == null ? void 0 : _z.Users) == null ? void 0 : _A.attorneyLink) ? `<a${add_attribute("href", (_D = (_C = (_B = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _B.node) == null ? void 0 : _C.Users) == null ? void 0 : _D.attorneyLink, 0)}${add_attribute("title", (_F = (_E = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _E.node) == null ? void 0 : _F.name, 0)} class="${"button svelte-ywg8f2"}">View Full Bio
								</a>` : ``}
							<a href="${"/immigration-attorneys"}" class="${"fancy-link svelte-ywg8f2"}"><span>See Our Attorneys</span></a>
						</div></div>
				</div></div>
		</div>`;
    })}
	${validate_component(Block_Testimonials, "Block_Testimonials").$$render($$result, {
      id: "testimonials",
      blockstyle: "block-style05"
    }, {}, {})}

	${validate_component(Block_CallToAction, "Block_CallToAction").$$render($$result, {
      id: "call-to-action",
      blockstyle: "block-style01",
      extraclasses: "regular-calltoaction"
    }, {}, {})}
	${validate_component(Block_LanguagesWeSpeak, "Block_LanguagesWeSpeak").$$render($$result, {}, {}, {})}
	${validate_component(Block_Languages, "Block_Languages").$$render($$result, {
      id: "languages",
      blockstyle: "block-style04"
    }, {}, {})}
	${validate_component(Block_Featured, "Block_Featured").$$render($$result, {id: "featured", blockstyle: ""}, {}, {})}
	${validate_component(Block_Ratings, "Block_Ratings").$$render($$result, {id: "ratings", blockstyle: ""}, {}, {})}
	${validate_component(SocialMedia, "SocialMedia").$$render($$result, {id: "socialmedia", blockstyle: ""}, {}, {})}`
  })}`;
});
var blog = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: Blog
});
var _slug__svelte = ".blog-topbar.svelte-ywg8f2.svelte-ywg8f2{position:relative;margin:-20px 0 20px}.breadcrumbs.svelte-ywg8f2.svelte-ywg8f2{font-size:var(--small-fontsize)}.breadcrumbs.svelte-ywg8f2 a.svelte-ywg8f2{color:var(--color-black)}.breadcrumbs.svelte-ywg8f2 a.svelte-ywg8f2:hover{color:var(--color-four)}.author.svelte-ywg8f2.svelte-ywg8f2{background:var(--color-seven);color:var(--color-white);text-align:center;margin:75px auto 25px}.author-image.svelte-ywg8f2.svelte-ywg8f2{text-align:center;position:relative}.author-image.svelte-ywg8f2 img.svelte-ywg8f2{border-radius:50%;overflow:hidden;margin:25px;width:80%;max-width:250px;height:auto}@media screen and (min-width:650px){.author.svelte-ywg8f2.svelte-ywg8f2{display:grid;grid-template-columns:1fr 2fr;text-align:left;-moz-column-gap:3em;grid-column-gap:3em;column-gap:3em}.author-image.svelte-ywg8f2.svelte-ywg8f2{text-align:center}}.author-content.svelte-ywg8f2.svelte-ywg8f2{padding:20px}.author-content.svelte-ywg8f2 h2.svelte-ywg8f2{color:var(--color-white)}.content.svelte-ywg8f2 .author a.svelte-ywg8f2{color:var(--color-white)!important}.content.svelte-ywg8f2 .author a.button.svelte-ywg8f2{background:var(--color-four);text-transform:uppercase;font-weight:700;margin-right:25px;border:0}.content.svelte-ywg8f2 .author a.button.svelte-ywg8f2:hover{background:var(--color-black)}";
const css$1$1 = {
  code: ".blog-topbar.svelte-ywg8f2.svelte-ywg8f2{position:relative;margin:-20px 0 20px}.breadcrumbs.svelte-ywg8f2.svelte-ywg8f2{font-size:var(--small-fontsize)}.breadcrumbs.svelte-ywg8f2 a.svelte-ywg8f2{color:var(--color-black)}.breadcrumbs.svelte-ywg8f2 a.svelte-ywg8f2:hover{color:var(--color-four)}.author.svelte-ywg8f2.svelte-ywg8f2{background:var(--color-seven);color:var(--color-white);text-align:center;margin:75px auto 25px}.author-image.svelte-ywg8f2.svelte-ywg8f2{text-align:center;position:relative}.author-image.svelte-ywg8f2 img.svelte-ywg8f2{border-radius:50%;overflow:hidden;margin:25px;width:80%;max-width:250px;height:auto}@media screen and (min-width:650px){.author.svelte-ywg8f2.svelte-ywg8f2{display:grid;grid-template-columns:1fr 2fr;text-align:left;grid-column-gap:3em;-moz-column-gap:3em;column-gap:3em}.author-image.svelte-ywg8f2.svelte-ywg8f2{text-align:center}}.author-content.svelte-ywg8f2.svelte-ywg8f2{padding:20px}.author-content.svelte-ywg8f2 h2.svelte-ywg8f2{color:var(--color-white)}.content.svelte-ywg8f2 .author a.svelte-ywg8f2{color:var(--color-white)!important}.content.svelte-ywg8f2 .author a.button.svelte-ywg8f2{background:var(--color-four);text-transform:uppercase;font-weight:700;margin-right:25px;border:0}.content.svelte-ywg8f2 .author a.button.svelte-ywg8f2:hover{background:var(--color-black)}",
  map: `{"version":3,"file":"[slug].svelte","sources":["[slug].svelte"],"sourcesContent":["<svelte:head>\\n\\t{#each blog_css as css}\\n\\t\\t<link\\n\\t\\t\\tasync\\n\\t\\t\\thref={ (css.src.startsWith('http')) ? \`\${css.src}\` : \`\${$milk.site.admin_url}\${css.src}\` }\\n\\t\\t\\trel=\\"preload\\"\\n\\t\\t\\tas=\\"style\\"\\n\\t\\t/>\\n\\t\\t<link\\n\\t\\t\\tasync\\n\\t\\t\\thref={ (css.src.startsWith('http')) ? \`\${css.src}\` : \`\${$milk.site.admin_url}\${css.src}\` }\\n\\t\\t\\trel=\\"stylesheet\\"\\n\\t\\t/>\\n\\t{/each}\\n\\t{#each blog_scripts as script}\\n\\t\\t<script\\n\\t\\t\\tdefer\\n\\t\\t\\tsrc={ (script.src.startsWith('http')) ? \`\${script.src}\` : \`\${$milk.site.admin_url}\${script.src}\` }\\n\\t\\t/>\\n\\t{/each}\\n\\t<link rel=\\"stylesheet\\" href={themestyle} />\\n</svelte:head>\\n\\n<Head_Language lang=\\"en\\" />\\n<Head_HTML {title} {description} keywords={$milk?.site?.keywords} />\\n<Head_Facebook {title} {description} {image} />\\n<Head_Twitter {title} {description} {image} />\\n<Layout_Main id=\\"blog-post\\">\\n\\t{#each blog_posts as blog_post}\\n\\t\\t<Head_Article author={blog_post?.author?.node?.name} pubdate={blog_post?.date} />\\n\\t\\t<Hero\\n\\t\\t\\tid=\\"blog-post-hero\\"\\n\\t\\t\\timage_url={blog_post?.featuredImage?.node?.sourceUrl}\\n\\t\\t\\timg_srcset={blog_post?.featuredImage?.node?.srcSet}\\n\\t\\t\\tavif_srcset=\\"\\"\\n\\t\\t\\twebp_srcset=\\"\\"\\n\\t\\t\\ttitle=\\"Harlan York and Associates\\"\\n\\t\\t\\tparallax=\\"false\\">&nbsp;</Hero\\n\\t\\t>\\n\\t\\t<Block_CallOutText\\n\\t\\t\\tid=\\"call-out-text\\"\\n\\t\\t\\tblockstyle=\\"block-style01\\"\\n\\t\\t\\textraclasses=\\"floating-calltoaction\\"\\n\\t\\t\\ttitle={blog_post?.title}\\n\\t\\t>\\n\\t\\t\\t<div class=\\"callout-detials\\">\\n\\t\\t\\t\\tBy: {blog_post?.author?.node?.name}\\n\\t\\t\\t\\t&nbsp;&nbsp;|&nbsp;&nbsp;\\n\\t\\t\\t\\t{months[post_date.getMonth()]}\\n\\t\\t\\t\\t{post_date.getDate()},\\n\\t\\t\\t\\t{post_date.getFullYear()}\\n\\t\\t\\t</div>\\n\\t\\t</Block_CallOutText>\\n\\t\\t<div class=\\"content\\">\\n\\t\\t\\t<div class=\\"content-inner\\">\\n\\t\\t\\t\\t<div class=\\"blog-topbar\\">\\n\\t\\t\\t\\t\\t<div class=\\"breadcrumbs\\">\\n\\t\\t\\t\\t\\t\\t<a href=\\"/\\">Home</a>\\n\\t\\t\\t\\t\\t\\t\u203A\\n\\t\\t\\t\\t\\t\\t<a href=\\"/immigration-law-blog\\">Blog</a>\\n\\t\\t\\t\\t\\t\\t\u203A\\n\\t\\t\\t\\t\\t\\t<a href={\`/immigration-law-blog/\${blog_post?.slug}\`}>{blog_post?.title}</a>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t<div class=\\"blog-content\\">\\n\\t\\t\\t\\t\\t{@html blog_post?.content}\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t<div class=\\"author\\">\\n\\t\\t\\t\\t\\t<div class=\\"author-image\\">\\n\\t\\t\\t\\t\\t\\t<picture>\\n\\t\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"image/avif\\"\\n\\t\\t\\t\\t\\t\\t\\t\\tsrcset={blog_post?.author?.node?.Users?.avifImage\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"image/webp\\"\\n\\t\\t\\t\\t\\t\\t\\t\\tsrcset={blog_post?.author?.node?.Users?.webpImage\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\t\\t\\tsrc={blog_post?.author?.node?.Users?.jpegImage?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t\\t\\talt={blog_post?.author?.node?.name}\\n\\t\\t\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\t\\t\\twidth=\\"260\\"\\n\\t\\t\\t\\t\\t\\t\\t\\theight=\\"260\\"\\n\\t\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t\\t</picture>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t<div class=\\"author-content\\">\\n\\t\\t\\t\\t\\t\\t<h2>About {blog_post?.author?.node?.name}</h2>\\n\\t\\t\\t\\t\\t\\t<p>{blog_post?.author?.node?.description}</p>\\n\\t\\t\\t\\t\\t\\t<div class=\\"author-links\\">\\n\\t\\t\\t\\t\\t\\t\\t{#if blog_post?.author?.node?.Users?.attorneyLink}\\n\\t\\t\\t\\t\\t\\t\\t\\t<a\\n\\t\\t\\t\\t\\t\\t\\t\\t\\thref={blog_post?.author?.node?.Users?.attorneyLink}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\ttitle={blog_post?.author?.node?.name}\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"button\\"\\n\\t\\t\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tView Full Bio\\n\\t\\t\\t\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t\\t\\t<a href=\\"/immigration-attorneys\\" class=\\"fancy-link\\">\\n\\t\\t\\t\\t\\t\\t\\t\\t<span>See Our Attorneys</span>\\n\\t\\t\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t{/each}\\n\\t<Block_Testimonials id=\\"testimonials\\" blockstyle=\\"block-style05\\" />\\n\\n\\t<Block_CallToAction\\n\\t\\tid=\\"call-to-action\\"\\n\\t\\tblockstyle=\\"block-style01\\"\\n\\t\\textraclasses=\\"regular-calltoaction\\"\\n\\t/>\\n\\t<Block_LanguagesWeSpeak />\\n\\t<Block_Languages id=\\"languages\\" blockstyle=\\"block-style04\\" />\\n\\t<Block_Featured id=\\"featured\\" blockstyle=\\"\\" />\\n\\t<Block_Ratings id=\\"ratings\\" blockstyle=\\"\\" />\\n\\t<SocialMedia id=\\"socialmedia\\" blockstyle=\\"\\" />\\n</Layout_Main>\\n\\n<script>var _$milk, _$milk$site, _$milk2, _$milk2$site, _$milk3, _$milk3$site;\\n\\nfunction asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount, onDestroy } from 'svelte';\\nimport { page } from '$app/stores';\\n/* ## MILK ## */\\n\\nimport { milk } from '$milk/milk.js';\\n/* ## Components ## */\\n\\nimport Head_Language from '$milk/lib/Head_Language.svelte';\\nimport Head_HTML from '$milk/lib/Head_HTML.svelte';\\nimport Head_Facebook from '$milk/lib/Head_Facebook.svelte';\\nimport Head_Twitter from '$milk/lib/Head_Twitter.svelte';\\nimport Head_Article from '$milk/lib/Head_Article.svelte';\\nimport Layout_Main from '$theme/Layout_Main.svelte';\\nimport Hero from '$milk/lib/Hero.svelte';\\nimport Block_CallOutText from '$theme/Block_CallOutText.svelte';\\nimport Block_ServicesList from '$theme/Block_ServicesList.svelte';\\nimport Block_CallToAction from '$theme/Block_CallToAction.svelte';\\nimport Block_LanguagesWeSpeak from '$theme/Block_LanguagesWeSpeak.svelte';\\nimport Block_Languages from '$theme/Block_Languages.svelte';\\nimport Block_Testimonials from '$theme/Block_Testimonials.svelte';\\nimport Block_Featured from '$theme/Block_Featured.svelte';\\nimport SocialMedia from '$milk/lib/SocialMedia.svelte';\\nimport Block_Ratings from '$theme/Block_Ratings.svelte';\\n/* ## Variables ## */\\n\\nvar title = \\"Immigration Services - \\" + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.title);\\nvar description = (_$milk2 = $milk) == null ? void 0 : (_$milk2$site = _$milk2.site) == null ? void 0 : _$milk2$site.description;\\nvar image = (_$milk3 = $milk) == null ? void 0 : (_$milk3$site = _$milk3.site) == null ? void 0 : _$milk3$site.facebook_photo;\\nvar slug = $page.params.slug;\\nvar themestyle = '';\\n\\n$: themestyle = \\"/themes/\\" + $milk.config.theme + \\"/style.css\\";\\n/* ## Data Loading ## */\\n\\n\\nvar unsubscribe = () => {};\\n\\nvar blog_posts = [];\\nvar blog_css = [];\\nvar blog_scripts = [];\\nvar post_date = new Date();\\nvar months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];\\nimport { Q_GET_POST_BYSLUG } from '$graphql/wordpress.graphql.js';\\n/* ## Main ## */\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  var _$milk4, _$milk4$data;\\n\\n  slug = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);\\n  var queryVariables = {\\n    slug: slug\\n  };\\n  var getPost = (_$milk4 = $milk) == null ? void 0 : (_$milk4$data = _$milk4.data) == null ? void 0 : _$milk4$data.gql(Q_GET_POST_BYSLUG, $milk.data.sources.wordpress, queryVariables, false, 0);\\n  unsubscribe = yield getPost == null ? void 0 : getPost.subscribe( /*#__PURE__*/function () {\\n    var _ref2 = _asyncToGenerator(function* (fetched_data) {\\n      var _data$postBy, _data$postBy2, _data$postBy2$enqueue, _data$postBy3, _data$postBy3$enqueue, _data$featuredImage, _data$featuredImage$n;\\n\\n      var data = yield fetched_data;\\n      console.log(data);\\n      post_date = new Date(data == null ? void 0 : (_data$postBy = data.postBy) == null ? void 0 : _data$postBy.date);\\n      blog_css = (data == null ? void 0 : (_data$postBy2 = data.postBy) == null ? void 0 : (_data$postBy2$enqueue = _data$postBy2.enqueuedStylesheets) == null ? void 0 : _data$postBy2$enqueue.nodes) || [];\\n      blog_scripts = (data == null ? void 0 : (_data$postBy3 = data.postBy) == null ? void 0 : (_data$postBy3$enqueue = _data$postBy3.enqueuedScripts) == null ? void 0 : _data$postBy3$enqueue.nodes) || [];\\n      blog_posts = [data == null ? void 0 : data.postBy];\\n      title = data == null ? void 0 : data.title;\\n      description = data == null ? void 0 : data.excerpt;\\n      image = data == null ? void 0 : (_data$featuredImage = data.featuredImage) == null ? void 0 : (_data$featuredImage$n = _data$featuredImage.node) == null ? void 0 : _data$featuredImage$n.sourceUrl;\\n    });\\n\\n    return function (_x) {\\n      return _ref2.apply(this, arguments);\\n    };\\n  }());\\n}));\\n/* ## Exit ## */\\n\\nonDestroy(() => {\\n  unsubscribe(); // important for garbage collection otherwise memory leak\\n});\\nexport { slug };</script>\\n\\n<style>.blog-topbar{position:relative;margin:-20px 0 20px}.breadcrumbs{font-size:var(--small-fontsize)}.breadcrumbs a{color:var(--color-black)}.breadcrumbs a:hover{color:var(--color-four)}.author{background:var(--color-seven);color:var(--color-white);text-align:center;margin:75px auto 25px}.author-image{text-align:center;position:relative}.author-image img{border-radius:50%;overflow:hidden;margin:25px;width:80%;max-width:250px;height:auto}@media screen and (min-width:650px){.author{display:grid;grid-template-columns:1fr 2fr;text-align:left;grid-column-gap:3em;-moz-column-gap:3em;column-gap:3em}.author-image{text-align:center}}.author-content{padding:20px}.author-content h2{color:var(--color-white)}.content .author a{color:var(--color-white)!important}.content .author a.button{background:var(--color-four);text-transform:uppercase;font-weight:700;margin-right:25px;border:0}.content .author a.button:hover{background:var(--color-black)}</style>\\n"],"names":[],"mappings":"AAoNO,wCAAY,CAAC,SAAS,QAAQ,CAAC,OAAO,KAAK,CAAC,CAAC,CAAC,IAAI,CAAC,wCAAY,CAAC,UAAU,IAAI,gBAAgB,CAAC,CAAC,0BAAY,CAAC,eAAC,CAAC,MAAM,IAAI,aAAa,CAAC,CAAC,0BAAY,CAAC,eAAC,MAAM,CAAC,MAAM,IAAI,YAAY,CAAC,CAAC,mCAAO,CAAC,WAAW,IAAI,aAAa,CAAC,CAAC,MAAM,IAAI,aAAa,CAAC,CAAC,WAAW,MAAM,CAAC,OAAO,IAAI,CAAC,IAAI,CAAC,IAAI,CAAC,yCAAa,CAAC,WAAW,MAAM,CAAC,SAAS,QAAQ,CAAC,2BAAa,CAAC,iBAAG,CAAC,cAAc,GAAG,CAAC,SAAS,MAAM,CAAC,OAAO,IAAI,CAAC,MAAM,GAAG,CAAC,UAAU,KAAK,CAAC,OAAO,IAAI,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,mCAAO,CAAC,QAAQ,IAAI,CAAC,sBAAsB,GAAG,CAAC,GAAG,CAAC,WAAW,IAAI,CAAC,gBAAgB,GAAG,CAAC,gBAAgB,GAAG,CAAC,WAAW,GAAG,CAAC,yCAAa,CAAC,WAAW,MAAM,CAAC,CAAC,2CAAe,CAAC,QAAQ,IAAI,CAAC,6BAAe,CAAC,gBAAE,CAAC,MAAM,IAAI,aAAa,CAAC,CAAC,sBAAQ,CAAC,OAAO,CAAC,eAAC,CAAC,MAAM,IAAI,aAAa,CAAC,UAAU,CAAC,sBAAQ,CAAC,OAAO,CAAC,CAAC,qBAAO,CAAC,WAAW,IAAI,YAAY,CAAC,CAAC,eAAe,SAAS,CAAC,YAAY,GAAG,CAAC,aAAa,IAAI,CAAC,OAAO,CAAC,CAAC,sBAAQ,CAAC,OAAO,CAAC,CAAC,qBAAO,MAAM,CAAC,WAAW,IAAI,aAAa,CAAC,CAAC"}`
};
function asyncGeneratorStep$1(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator$1(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep$1(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep$1(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const U5Bslugu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a;
  let $milk, $$unsubscribe_milk;
  let $page, $$unsubscribe_page;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  var _$milk, _$milk$site, _$milk2, _$milk2$site, _$milk3, _$milk3$site;
  var title = "Immigration Services - " + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.title);
  var description2 = (_$milk2 = $milk) == null ? void 0 : (_$milk2$site = _$milk2.site) == null ? void 0 : _$milk2$site.description;
  var image = (_$milk3 = $milk) == null ? void 0 : (_$milk3$site = _$milk3.site) == null ? void 0 : _$milk3$site.facebook_photo;
  var {slug = $page.params.slug} = $$props;
  var themestyle = "";
  var unsubscribe = () => {
  };
  var blog_posts = [];
  var blog_css = [];
  var blog_scripts = [];
  var post_date = new Date();
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  onMount(/* @__PURE__ */ _asyncToGenerator$1(function* () {
    var _$milk4, _$milk4$data;
    slug = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);
    var queryVariables = {slug};
    var getPost = (_$milk4 = $milk) == null ? void 0 : (_$milk4$data = _$milk4.data) == null ? void 0 : _$milk4$data.gql(Q_GET_POST_BYSLUG, $milk.data.sources.wordpress, queryVariables, false, 0);
    unsubscribe = yield getPost == null ? void 0 : getPost.subscribe(/* @__PURE__ */ function() {
      var _ref2 = _asyncToGenerator$1(function* (fetched_data) {
        var _data$postBy, _data$postBy2, _data$postBy2$enqueue, _data$postBy3, _data$postBy3$enqueue, _data$featuredImage, _data$featuredImage$n;
        var data = yield fetched_data;
        console.log(data);
        post_date = new Date(data == null ? void 0 : (_data$postBy = data.postBy) == null ? void 0 : _data$postBy.date);
        blog_css = (data == null ? void 0 : (_data$postBy2 = data.postBy) == null ? void 0 : (_data$postBy2$enqueue = _data$postBy2.enqueuedStylesheets) == null ? void 0 : _data$postBy2$enqueue.nodes) || [];
        blog_scripts = (data == null ? void 0 : (_data$postBy3 = data.postBy) == null ? void 0 : (_data$postBy3$enqueue = _data$postBy3.enqueuedScripts) == null ? void 0 : _data$postBy3$enqueue.nodes) || [];
        blog_posts = [data == null ? void 0 : data.postBy];
        title = data == null ? void 0 : data.title;
        description2 = data == null ? void 0 : data.excerpt;
        image = data == null ? void 0 : (_data$featuredImage = data.featuredImage) == null ? void 0 : (_data$featuredImage$n = _data$featuredImage.node) == null ? void 0 : _data$featuredImage$n.sourceUrl;
      });
      return function(_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  }));
  onDestroy(() => {
    unsubscribe();
  });
  if ($$props.slug === void 0 && $$bindings.slug && slug !== void 0)
    $$bindings.slug(slug);
  $$result.css.add(css$1$1);
  themestyle = "/themes/" + $milk.config.theme + "/style.css";
  $$unsubscribe_milk();
  $$unsubscribe_page();
  return `${$$result.head += `${each(blog_css, (css2) => `<link async${add_attribute("href", css2.src.startsWith("http") ? `${css2.src}` : `${$milk.site.admin_url}${css2.src}`, 0)} rel="${"preload"}" as="${"style"}" data-svelte="svelte-1eol1zw">
		<link async${add_attribute("href", css2.src.startsWith("http") ? `${css2.src}` : `${$milk.site.admin_url}${css2.src}`, 0)} rel="${"stylesheet"}" data-svelte="svelte-1eol1zw">`)}${each(blog_scripts, (script) => `<script defer${add_attribute("src", script.src.startsWith("http") ? `${script.src}` : `${$milk.site.admin_url}${script.src}`, 0)} data-svelte="svelte-1eol1zw"></script>`)}<link rel="${"stylesheet"}"${add_attribute("href", themestyle, 0)} data-svelte="svelte-1eol1zw">`, ""}

${validate_component(Head_Language, "Head_Language").$$render($$result, {lang: "en"}, {}, {})}
${validate_component(Head_HTML, "Head_HTML").$$render($$result, {
    title,
    description: description2,
    keywords: (_a = $milk == null ? void 0 : $milk.site) == null ? void 0 : _a.keywords
  }, {}, {})}
${validate_component(Head_Facebook, "Head_Facebook").$$render($$result, {title, description: description2, image}, {}, {})}
${validate_component(Head_Twitter, "Head_Twitter").$$render($$result, {title, description: description2, image}, {}, {})}
${validate_component(Layout_Main, "Layout_Main").$$render($$result, {id: "blog-post"}, {}, {
    default: () => `${each(blog_posts, (blog_post) => {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F;
      return `${validate_component(Head_Article, "Head_Article").$$render($$result, {
        author: (_b = (_a2 = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _a2.node) == null ? void 0 : _b.name,
        pubdate: blog_post == null ? void 0 : blog_post.date
      }, {}, {})}
		${validate_component(Hero, "Hero").$$render($$result, {
        id: "blog-post-hero",
        image_url: (_d = (_c = blog_post == null ? void 0 : blog_post.featuredImage) == null ? void 0 : _c.node) == null ? void 0 : _d.sourceUrl,
        img_srcset: (_f = (_e = blog_post == null ? void 0 : blog_post.featuredImage) == null ? void 0 : _e.node) == null ? void 0 : _f.srcSet,
        avif_srcset: "",
        webp_srcset: "",
        title: "Harlan York and Associates",
        parallax: "false"
      }, {}, {})}
		${validate_component(Block_CallOutText, "Block_CallOutText").$$render($$result, {
        id: "call-out-text",
        blockstyle: "block-style01",
        extraclasses: "floating-calltoaction",
        title: blog_post == null ? void 0 : blog_post.title
      }, {}, {
        default: () => {
          var _a3, _b2;
          return `<div class="${"callout-detials"}">By: ${escape((_b2 = (_a3 = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _a3.node) == null ? void 0 : _b2.name)}
				\xA0\xA0|\xA0\xA0
				${escape(months[post_date.getMonth()])}
				${escape(post_date.getDate())},
				${escape(post_date.getFullYear())}</div>
		`;
        }
      })}
		<div class="${"content svelte-ywg8f2"}"><div class="${"content-inner"}"><div class="${"blog-topbar svelte-ywg8f2"}"><div class="${"breadcrumbs svelte-ywg8f2"}"><a href="${"/"}" class="${"svelte-ywg8f2"}">Home</a>
						\u203A
						<a href="${"/immigration-law-blog"}" class="${"svelte-ywg8f2"}">Blog</a>
						\u203A
						<a${add_attribute("href", `/immigration-law-blog/${blog_post == null ? void 0 : blog_post.slug}`, 0)} class="${"svelte-ywg8f2"}">${escape(blog_post == null ? void 0 : blog_post.title)}</a>
					</div></div>
				<div class="${"blog-content"}">${blog_post == null ? void 0 : blog_post.content}</div>
				<div class="${"author svelte-ywg8f2"}"><div class="${"author-image svelte-ywg8f2"}"><picture><source type="${"image/avif"}"${add_attribute("srcset", (_j = (_i = (_h = (_g = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _g.node) == null ? void 0 : _h.Users) == null ? void 0 : _i.avifImage) == null ? void 0 : _j.sourceUrl, 0)}>
							<source type="${"image/webp"}"${add_attribute("srcset", (_n = (_m = (_l = (_k = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _k.node) == null ? void 0 : _l.Users) == null ? void 0 : _m.webpImage) == null ? void 0 : _n.sourceUrl, 0)}>
							<img${add_attribute("src", (_r = (_q = (_p = (_o = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _o.node) == null ? void 0 : _p.Users) == null ? void 0 : _q.jpegImage) == null ? void 0 : _r.sourceUrl, 0)}${add_attribute("alt", (_t = (_s = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _s.node) == null ? void 0 : _t.name, 0)} loading="${"lazy"}" width="${"260"}" height="${"260"}" class="${"svelte-ywg8f2"}">
						</picture></div>
					<div class="${"author-content svelte-ywg8f2"}"><h2 class="${"svelte-ywg8f2"}">About ${escape((_v = (_u = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _u.node) == null ? void 0 : _v.name)}</h2>
						<p>${escape((_x = (_w = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _w.node) == null ? void 0 : _x.description)}</p>
						<div class="${"author-links"}">${((_A = (_z = (_y = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _y.node) == null ? void 0 : _z.Users) == null ? void 0 : _A.attorneyLink) ? `<a${add_attribute("href", (_D = (_C = (_B = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _B.node) == null ? void 0 : _C.Users) == null ? void 0 : _D.attorneyLink, 0)}${add_attribute("title", (_F = (_E = blog_post == null ? void 0 : blog_post.author) == null ? void 0 : _E.node) == null ? void 0 : _F.name, 0)} class="${"button svelte-ywg8f2"}">View Full Bio
								</a>` : ``}
							<a href="${"/immigration-attorneys"}" class="${"fancy-link svelte-ywg8f2"}"><span>See Our Attorneys</span></a>
						</div></div>
				</div></div>
		</div>`;
    })}
	${validate_component(Block_Testimonials, "Block_Testimonials").$$render($$result, {
      id: "testimonials",
      blockstyle: "block-style05"
    }, {}, {})}

	${validate_component(Block_CallToAction, "Block_CallToAction").$$render($$result, {
      id: "call-to-action",
      blockstyle: "block-style01",
      extraclasses: "regular-calltoaction"
    }, {}, {})}
	${validate_component(Block_LanguagesWeSpeak, "Block_LanguagesWeSpeak").$$render($$result, {}, {}, {})}
	${validate_component(Block_Languages, "Block_Languages").$$render($$result, {
      id: "languages",
      blockstyle: "block-style04"
    }, {}, {})}
	${validate_component(Block_Featured, "Block_Featured").$$render($$result, {id: "featured", blockstyle: ""}, {}, {})}
	${validate_component(Block_Ratings, "Block_Ratings").$$render($$result, {id: "ratings", blockstyle: ""}, {}, {})}
	${validate_component(SocialMedia, "SocialMedia").$$render($$result, {id: "socialmedia", blockstyle: ""}, {}, {})}`
  })}`;
});
var _slug_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: U5Bslugu5D
});
var Block_TestimonialsList_svelte = ".testimonials.svelte-4lwhug.svelte-4lwhug{display:block;padding:100px 20px;padding:100px var(--padding-inner,20px);text-align:center}.testimonials-inner.svelte-4lwhug.svelte-4lwhug{margin:0 auto;max-width:var(--content-constrain)}.testimonial.svelte-4lwhug.svelte-4lwhug{display:block;text-align:center}.testimonial.svelte-4lwhug.svelte-4lwhug:nth-child(2n){background:var(--color-offwhite)}.testimonials.svelte-4lwhug .testimonials-inner .testimonial.svelte-4lwhug{width:80%;margin:0 auto}@media screen and (min-width:650px){.testimonial.svelte-4lwhug.svelte-4lwhug{-moz-column-gap:2em;grid-column-gap:2em;column-gap:2em;text-align:left}}.testimonial.svelte-4lwhug .testimonial-content.svelte-4lwhug{padding:var(--padding)}.testimonial-quote.svelte-4lwhug.svelte-4lwhug{font-style:italic}.rating.svelte-4lwhug.svelte-4lwhug{margin:10px 0;height:17px;background:url(/img/icon-yellow-star.svg) 0 repeat;background-size:18px;color:transparent;font-size:0}";
const css$2 = {
  code: ".testimonials.svelte-4lwhug.svelte-4lwhug{display:block;padding:100px 20px;padding:100px var(--padding-inner,20px);text-align:center}.testimonials-inner.svelte-4lwhug.svelte-4lwhug{margin:0 auto;max-width:var(--content-constrain)}@media screen and (min-width:650px){}.testimonial.svelte-4lwhug.svelte-4lwhug{display:block;text-align:center}.testimonial.svelte-4lwhug.svelte-4lwhug:nth-child(2n){background:var(--color-offwhite)}.testimonials.svelte-4lwhug .testimonials-inner .testimonial.svelte-4lwhug{width:80%;margin:0 auto}@media screen and (min-width:650px){.testimonial.svelte-4lwhug.svelte-4lwhug{grid-column-gap:2em;-moz-column-gap:2em;column-gap:2em;text-align:left}}.testimonial.svelte-4lwhug .testimonial-content.svelte-4lwhug{padding:var(--padding)}.testimonial-quote.svelte-4lwhug.svelte-4lwhug{font-style:italic}.rating.svelte-4lwhug.svelte-4lwhug{margin:10px 0;height:17px;background:url(/img/icon-yellow-star.svg) 0 repeat;background-size:18px;color:transparent;font-size:0}",
  map: `{"version":3,"file":"Block_TestimonialsList.svelte","sources":["Block_TestimonialsList.svelte"],"sourcesContent":["<div {id} class={blockclass}>\\n\\t<div class=\\"testimonials-inner\\">\\n\\t\\t{#each testimonials as testimonial}\\n\\t\\t\\t<div class=\\"testimonial\\">\\n\\t\\t\\t\\t<!-- <picture>\\n\\t\\t\\t\\t\\t{#if testimonial?.Testimonial?.avifImage?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\ttype=\\"image/avif\\"\\n\\t\\t\\t\\t\\t\\t\\tsrcset={testimonial?.Testimonial?.avifImage\\n\\t\\t\\t\\t\\t\\t\\t\\t?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t{#if testimonial?.Testimonial?.webpImage?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\t\\ttype=\\"image/webp\\"\\n\\t\\t\\t\\t\\t\\t\\tsrcset={testimonial?.Testimonial?.webpImage\\n\\t\\t\\t\\t\\t\\t\\t\\t?.sourceUrl}\\n\\t\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\tsrc={testimonial?.Testimonial?.jpgImage?.sourceUrl ||\\n\\t\\t\\t\\t\\t\\t\\t'/milk/img/user_nophoto.svg'}\\n\\t\\t\\t\\t\\t\\talt={testimonial?.title}\\n\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\twidth=\\"130\\"\\n\\t\\t\\t\\t\\t\\theight=\\"130\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t</picture> -->\\n\\t\\t\\t\\t<div class=\\"testimonial-content\\">\\n\\t\\t\\t\\t\\t<div class=\\"testimonial-title\\">\\n\\t\\t\\t\\t\\t\\t<strong>{testimonial?.title}</strong>,\\n\\t\\t\\t\\t\\t\\t{#if testimonial?.Testimonial?.relationship}\\n\\t\\t\\t\\t\\t\\t\\t{testimonial?.Testimonial?.relationship}\\n\\t\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t<div class=\\"testimonial-quote\\">\\n\\t\\t\\t\\t\\t\\t\\"{testimonial?.Testimonial?.testimonial}\\"\\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t{#if testimonial?.Testimonial?.rating}\\n\\t\\t\\t\\t\\t\\t<div\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"rating\\"\\n\\t\\t\\t\\t\\t\\t\\tstyle={\`width: \${\\n\\t\\t\\t\\t\\t\\t\\t\\ttestimonial?.Testimonial?.rating * 18\\n\\t\\t\\t\\t\\t\\t\\t}px\`}\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t\\t\\t{testimonial?.Testimonial?.rating}\\n\\t\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</div>\\n\\t\\t{/each}\\n\\t</div>\\n</div>\\n\\n<script>function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\\n\\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"next\\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \\"throw\\", err); } _next(undefined); }); }; }\\n\\n/* ## Svelte ## */\\nimport { onMount, onDestroy } from 'svelte';\\n/* ## MILK ## */\\n\\nimport { milk } from '$milk/milk.js';\\nimport { shuffleArray } from '$milk/util/helpers.js';\\n/* ## Vairables ## */\\n\\nvar id;\\nvar blockstyle = '';\\nvar blockclass = 'testimonials';\\n\\n$: blockclass = \\"testimonials \\" + blockstyle;\\n/* ## Data Loading ## */\\n\\n\\nimport { preload_testimonials } from '$graphql/sitespecific.preload.js';\\nvar testimonials = preload_testimonials;\\n\\nvar unsubscribe_testimonials = () => {};\\n\\nimport { Q_GET_TESTIMONIALS } from '$graphql/sitespecific.graphql.js';\\n/* ## Main ## */\\n\\nonMount( /*#__PURE__*/_asyncToGenerator(function* () {\\n  var _$milk, _$milk$data;\\n\\n  var queryVariables = {\\n    size: 99\\n  };\\n  var getTestimonials = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_TESTIMONIALS, $milk.data.sources.wordpress, queryVariables);\\n  unsubscribe_testimonials = yield getTestimonials == null ? void 0 : getTestimonials.subscribe( /*#__PURE__*/function () {\\n    var _ref2 = _asyncToGenerator(function* (fetched_data) {\\n      var _data$testimonials;\\n\\n      var data = yield fetched_data; // console.log(data);\\n\\n      var tmpArray = data == null ? void 0 : (_data$testimonials = data.testimonials) == null ? void 0 : _data$testimonials.nodes;\\n      shuffleArray(tmpArray);\\n      testimonials = tmpArray.slice(0, 20);\\n      console.log(testimonials);\\n    });\\n\\n    return function (_x) {\\n      return _ref2.apply(this, arguments);\\n    };\\n  }());\\n}));\\n/* ## Exit ## */\\n\\nonDestroy(() => {\\n  unsubscribe_testimonials(); // important for garbage collection otherwise memory leak\\n});\\n/* ## Exports ## */\\n\\nexport { id, blockstyle };</script>\\n\\n<style>.testimonials{display:block;padding:100px 20px;padding:100px var(--padding-inner,20px);text-align:center}.testimonials-inner{margin:0 auto;max-width:var(--content-constrain)}h2,h3,p{color:#fff;color:var(--color-white,#fff)}h2{margin-bottom:20px;font-size:var(--extralarge-fontsize)}h3{font-family:var(--font-main)}@media screen and (min-width:650px){.testimonials .blurb{margin:var(--padding);display:grid;grid-template-columns:1fr 2fr;text-align:left;grid-column-gap:3em;-moz-column-gap:3em;column-gap:3em}}.testimonial{display:block;text-align:center}.testimonial:nth-child(2n){background:var(--color-offwhite)}.testimonials .testimonials-inner .testimonial{width:80%;margin:0 auto}@media screen and (min-width:650px){.testimonial{grid-column-gap:2em;-moz-column-gap:2em;column-gap:2em;text-align:left}}.testimonial img{border-radius:50%;margin:var(--padding) var(--padding) var(--padding) var(--padding-large)}.testimonial .testimonial-content{padding:var(--padding)}.testimonial-quote{font-style:italic}.rating{margin:10px 0;height:17px;background:url(/img/icon-yellow-star.svg) 0 repeat;background-size:18px;color:transparent;font-size:0}</style>\\n"],"names":[],"mappings":"AAmHO,yCAAa,CAAC,QAAQ,KAAK,CAAC,QAAQ,KAAK,CAAC,IAAI,CAAC,QAAQ,KAAK,CAAC,IAAI,eAAe,CAAC,IAAI,CAAC,CAAC,WAAW,MAAM,CAAC,+CAAmB,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,UAAU,IAAI,mBAAmB,CAAC,CAAC,AAA4I,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,AAA6J,CAAC,wCAAY,CAAC,QAAQ,KAAK,CAAC,WAAW,MAAM,CAAC,wCAAY,WAAW,EAAE,CAAC,CAAC,WAAW,IAAI,gBAAgB,CAAC,CAAC,2BAAa,CAAC,mBAAmB,CAAC,0BAAY,CAAC,MAAM,GAAG,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,OAAO,MAAM,CAAC,GAAG,CAAC,WAAW,KAAK,CAAC,CAAC,wCAAY,CAAC,gBAAgB,GAAG,CAAC,gBAAgB,GAAG,CAAC,WAAW,GAAG,CAAC,WAAW,IAAI,CAAC,CAAC,AAA4G,0BAAY,CAAC,kCAAoB,CAAC,QAAQ,IAAI,SAAS,CAAC,CAAC,8CAAkB,CAAC,WAAW,MAAM,CAAC,mCAAO,CAAC,OAAO,IAAI,CAAC,CAAC,CAAC,OAAO,IAAI,CAAC,WAAW,IAAI,yBAAyB,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,gBAAgB,IAAI,CAAC,MAAM,WAAW,CAAC,UAAU,CAAC,CAAC"}`
};
function asyncGeneratorStep(gen, resolve2, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve2(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve2, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve2, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve2, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
const Block_TestimonialsList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var {id} = $$props;
  var {blockstyle = ""} = $$props;
  var blockclass = "testimonials";
  var testimonials = preload_testimonials;
  var unsubscribe_testimonials = () => {
  };
  onMount(/* @__PURE__ */ _asyncToGenerator(function* () {
    var _$milk, _$milk$data;
    var queryVariables = {size: 99};
    var getTestimonials = (_$milk = $milk) == null ? void 0 : (_$milk$data = _$milk.data) == null ? void 0 : _$milk$data.gql(Q_GET_TESTIMONIALS, $milk.data.sources.wordpress, queryVariables);
    unsubscribe_testimonials = yield getTestimonials == null ? void 0 : getTestimonials.subscribe(/* @__PURE__ */ function() {
      var _ref2 = _asyncToGenerator(function* (fetched_data) {
        var _data$testimonials;
        var data = yield fetched_data;
        var tmpArray = data == null ? void 0 : (_data$testimonials = data.testimonials) == null ? void 0 : _data$testimonials.nodes;
        shuffleArray(tmpArray);
        testimonials = tmpArray.slice(0, 20);
        console.log(testimonials);
      });
      return function(_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  }));
  onDestroy(() => {
    unsubscribe_testimonials();
  });
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.blockstyle === void 0 && $$bindings.blockstyle && blockstyle !== void 0)
    $$bindings.blockstyle(blockstyle);
  $$result.css.add(css$2);
  blockclass = "testimonials " + blockstyle;
  $$unsubscribe_milk();
  return `<div${add_attribute("id", id, 0)} class="${escape(null_to_empty(blockclass)) + " svelte-4lwhug"}"><div class="${"testimonials-inner svelte-4lwhug"}">${each(testimonials, (testimonial) => {
    var _a, _b, _c, _d, _e, _f;
    return `<div class="${"testimonial svelte-4lwhug"}">
				<div class="${"testimonial-content svelte-4lwhug"}"><div class="${"testimonial-title"}"><strong>${escape(testimonial == null ? void 0 : testimonial.title)}</strong>,
						${((_a = testimonial == null ? void 0 : testimonial.Testimonial) == null ? void 0 : _a.relationship) ? `${escape((_b = testimonial == null ? void 0 : testimonial.Testimonial) == null ? void 0 : _b.relationship)}` : ``}</div>
					<div class="${"testimonial-quote svelte-4lwhug"}">&quot;${escape((_c = testimonial == null ? void 0 : testimonial.Testimonial) == null ? void 0 : _c.testimonial)}&quot;
					</div>
					${((_d = testimonial == null ? void 0 : testimonial.Testimonial) == null ? void 0 : _d.rating) ? `<div class="${"rating svelte-4lwhug"}"${add_attribute("style", `width: ${((_e = testimonial == null ? void 0 : testimonial.Testimonial) == null ? void 0 : _e.rating) * 18}px`, 0)}>${escape((_f = testimonial == null ? void 0 : testimonial.Testimonial) == null ? void 0 : _f.rating)}
						</div>` : ``}</div>
			</div>`;
  })}</div>
</div>`;
});
var index_svelte$1 = ".content.svelte-h689c5{text-align:center}.title.svelte-h689c5{position:relative;margin-bottom:-100px}h1.svelte-h689c5{padding-bottom:50px}";
const css$1 = {
  code: ".content.svelte-h689c5{text-align:center}.title.svelte-h689c5{position:relative;margin-bottom:-100px}h1.svelte-h689c5{padding-bottom:50px}",
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<Head_Language lang=\\"en\\" />\\n<Head_HTML {title} {description} keywords={$milk?.site?.keywords} />\\n<Head_Facebook {title} {description} image=\\"/img/hero_homepage_02.jpg\\" />\\n<Head_Twitter {title} {description} image=\\"/img/hero_homepage_02.jpg\\" />\\n<Layout_Main id=\\"immigration-attorneys\\">\\n\\t<Hero\\n\\t\\tid=\\"hero-client-testimonials-02\\"\\n\\t\\timage_url=\\"/img/hero_testimonial_01.jpg\\"\\n\\t\\timg_srcset=\\"/img/hero_testimonial_01.jpg\\"\\n\\t\\tavif_srcset=\\"/img/hero_testimonial_01.avif\\"\\n\\t\\twebp_srcset=\\"/img/hero_testimonial_01.webp\\"\\n\\t\\ttitle=\\"Client Testimonials\\"\\n\\t\\tparallax=\\"false\\">&nbsp;</Hero\\n\\t>\\n\\t<Block_CallOutText\\n\\t\\tid=\\"call-out-text\\"\\n\\t\\tblockstyle=\\"block-style01\\"\\n\\t\\textraclasses=\\"floating-calltoaction\\"\\n\\t\\ttitle=\\"Immigration Testimonials\\"\\n\\t>\\n\\t\\t<p>{description}</p>\\n\\t</Block_CallOutText>\\n\\t<div class=\\"content\\">\\n\\t\\t<h1 class=\\"title\\">Client Testimonials</h1>\\n\\t</div>\\n\\t<FeaturedVideo\\n\\t\\tid=\\"testimonial-video-01\\"\\n\\t\\tblockstyle=\\"\\"\\n\\t\\tvideo_source=\\"//www.youtube.com/embed/l071-FSWk4E\\"\\n\\t\\tvideo_jpg=\\"/img/testimonial-video-01.jpg\\"\\n\\t\\tvideo_webp=\\"/img/testimonial-video-01.webp\\"\\n\\t\\tvideo_avif=\\"/img/testimonial-video-01.avif\\"\\n\\t/>\\n\\t<Block_TestimonialsList id=\\"testimonials\\" blockstyle=\\"\\" />\\n\\t<FeaturedVideo\\n\\t\\tid=\\"testimonial-video-02\\"\\n\\t\\tblockstyle=\\"\\"\\n\\t\\tvideo_source=\\"//www.youtube.com/embed/13GqCdXBr80\\"\\n\\t\\tvideo_jpg=\\"/img/espanol-video-02.jpg\\"\\n\\t\\tvideo_webp=\\"/img/espanol-video-02.webp\\"\\n\\t\\tvideo_avif=\\"/img/espanol-video-02.avif\\"\\n\\t/>\\n\\t<br /><br />\\n\\t<Block_CallToAction\\n\\t\\tid=\\"call-to-action\\"\\n\\t\\tblockstyle=\\"block-style01\\"\\n\\t\\textraclasses=\\"regular-calltoaction\\"\\n\\t/>\\n\\t<Block_LanguagesWeSpeak />\\n\\t<Block_Languages id=\\"languages\\" blockstyle=\\"block-style04\\" />\\n\\t<Block_Featured id=\\"featured\\" blockstyle=\\"\\" />\\n\\t<Block_Ratings id=\\"ratings\\" blockstyle=\\"\\" />\\n\\t<SocialMedia id=\\"socialmedia\\" blockstyle=\\"\\" />\\n</Layout_Main>\\n\\n<script>var _$milk, _$milk$site;\\n\\n/* ## MILK ## */\\nimport { milk } from '$milk/milk.js';\\n/* ## Components ## */\\n\\nimport Head_Language from '$milk/lib/Head_Language.svelte';\\nimport Head_HTML from '$milk/lib/Head_HTML.svelte';\\nimport Head_Facebook from '$milk/lib/Head_Facebook.svelte';\\nimport Head_Twitter from '$milk/lib/Head_Twitter.svelte';\\nimport Layout_Main from '$theme/Layout_Main.svelte';\\nimport Hero from '$milk/lib/Hero.svelte';\\nimport Block_CallOutText from '$theme/Block_CallOutText.svelte';\\nimport FeaturedVideo from '$milk/lib/FeaturedVideo.svelte';\\nimport Block_CallToAction from '$theme/Block_CallToAction.svelte';\\nimport Block_LanguagesWeSpeak from '$theme/Block_LanguagesWeSpeak.svelte';\\nimport Block_Languages from '$theme/Block_Languages.svelte';\\nimport Block_TestimonialsList from '$theme/Block_TestimonialsList.svelte';\\nimport Block_Featured from '$theme/Block_Featured.svelte';\\nimport SocialMedia from '$milk/lib/SocialMedia.svelte';\\nimport Block_Ratings from '$theme/Block_Ratings.svelte';\\n/* ## Variables ## */\\n\\nvar title = \\"Client Testimonials - \\" + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.title);\\nvar description = 'Our Immigration Attorneys help thousands of clients avoid deportation, get their green cards and become US citizens. See what our clients and colleagues have to say about how Harlan York & Associates helped them with their case.';</script>\\n\\n<style>.content{text-align:center}.title{position:relative;margin-bottom:-100px}h1{padding-bottom:50px}</style>\\n"],"names":[],"mappings":"AAiFO,sBAAQ,CAAC,WAAW,MAAM,CAAC,oBAAM,CAAC,SAAS,QAAQ,CAAC,cAAc,MAAM,CAAC,gBAAE,CAAC,eAAe,IAAI,CAAC"}`
};
var description$1 = "Our Immigration Attorneys help thousands of clients avoid deportation, get their green cards and become US citizens. See what our clients and colleagues have to say about how Harlan York & Associates helped them with their case.";
const Client_testimonials = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a;
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var _$milk, _$milk$site;
  var title = "Client Testimonials - " + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.title);
  $$result.css.add(css$1);
  $$unsubscribe_milk();
  return `${validate_component(Head_Language, "Head_Language").$$render($$result, {lang: "en"}, {}, {})}
${validate_component(Head_HTML, "Head_HTML").$$render($$result, {
    title,
    description: description$1,
    keywords: (_a = $milk == null ? void 0 : $milk.site) == null ? void 0 : _a.keywords
  }, {}, {})}
${validate_component(Head_Facebook, "Head_Facebook").$$render($$result, {
    title,
    description: description$1,
    image: "/img/hero_homepage_02.jpg"
  }, {}, {})}
${validate_component(Head_Twitter, "Head_Twitter").$$render($$result, {
    title,
    description: description$1,
    image: "/img/hero_homepage_02.jpg"
  }, {}, {})}
${validate_component(Layout_Main, "Layout_Main").$$render($$result, {id: "immigration-attorneys"}, {}, {
    default: () => `${validate_component(Hero, "Hero").$$render($$result, {
      id: "hero-client-testimonials-02",
      image_url: "/img/hero_testimonial_01.jpg",
      img_srcset: "/img/hero_testimonial_01.jpg",
      avif_srcset: "/img/hero_testimonial_01.avif",
      webp_srcset: "/img/hero_testimonial_01.webp",
      title: "Client Testimonials",
      parallax: "false"
    }, {}, {})}
	${validate_component(Block_CallOutText, "Block_CallOutText").$$render($$result, {
      id: "call-out-text",
      blockstyle: "block-style01",
      extraclasses: "floating-calltoaction",
      title: "Immigration Testimonials"
    }, {}, {
      default: () => `<p>${escape(description$1)}</p>`
    })}
	<div class="${"content svelte-h689c5"}"><h1 class="${"title svelte-h689c5"}">Client Testimonials</h1></div>
	${validate_component(FeaturedVideo, "FeaturedVideo").$$render($$result, {
      id: "testimonial-video-01",
      blockstyle: "",
      video_source: "//www.youtube.com/embed/l071-FSWk4E",
      video_jpg: "/img/testimonial-video-01.jpg",
      video_webp: "/img/testimonial-video-01.webp",
      video_avif: "/img/testimonial-video-01.avif"
    }, {}, {})}
	${validate_component(Block_TestimonialsList, "Block_TestimonialsList").$$render($$result, {id: "testimonials", blockstyle: ""}, {}, {})}
	${validate_component(FeaturedVideo, "FeaturedVideo").$$render($$result, {
      id: "testimonial-video-02",
      blockstyle: "",
      video_source: "//www.youtube.com/embed/13GqCdXBr80",
      video_jpg: "/img/espanol-video-02.jpg",
      video_webp: "/img/espanol-video-02.webp",
      video_avif: "/img/espanol-video-02.avif"
    }, {}, {})}
	<br><br>
	${validate_component(Block_CallToAction, "Block_CallToAction").$$render($$result, {
      id: "call-to-action",
      blockstyle: "block-style01",
      extraclasses: "regular-calltoaction"
    }, {}, {})}
	${validate_component(Block_LanguagesWeSpeak, "Block_LanguagesWeSpeak").$$render($$result, {}, {}, {})}
	${validate_component(Block_Languages, "Block_Languages").$$render($$result, {
      id: "languages",
      blockstyle: "block-style04"
    }, {}, {})}
	${validate_component(Block_Featured, "Block_Featured").$$render($$result, {id: "featured", blockstyle: ""}, {}, {})}
	${validate_component(Block_Ratings, "Block_Ratings").$$render($$result, {id: "ratings", blockstyle: ""}, {}, {})}
	${validate_component(SocialMedia, "SocialMedia").$$render($$result, {id: "socialmedia", blockstyle: ""}, {}, {})}`
  })}`;
});
var index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: Client_testimonials
});
const Fonttest = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div style="${"background: #000; padding: 25px; position: fixed; height: 100vh; width: 100vw; color: #FFF;"}"><h1 style="${"font-family: 'Proxima Nova';"}">Proxima Nova</h1>
	<h1 style="${"font-family: 'Open Sans';"}">Open Sans</h1>
	<h1 style="${"font-family: 'Gill Sans MT';"}">Gill Sans MT</h1>
	<h1 style="${"font-family: 'Gill Sans';"}">Gill Sans</h1>
	<h1 style="${"font-family: Corbel;"}">Corbel</h1>
	<h1 style="${"font-family: Arial;"}">Arial</h1>
	<h1 style="${"font-family: sans-serif;"}">Sand-Serif</h1></div>`;
});
var fonttest = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: Fonttest
});
var index_svelte = '.content.svelte-19bt0mo.svelte-19bt0mo{margin-bottom:0}.content-inner.svelte-19bt0mo h2.svelte-19bt0mo,.image-grid.svelte-19bt0mo.svelte-19bt0mo{text-align:center}.image-grid.svelte-19bt0mo img.svelte-19bt0mo{margin:20px;max-width:calc(100% - 40px);height:auto}.video.svelte-19bt0mo.svelte-19bt0mo{margin:50px 20px;text-align:center}.video.svelte-19bt0mo p.svelte-19bt0mo{max-width:800px;margin:0 auto;padding:0 25px;font-style:italic}.center.svelte-19bt0mo.svelte-19bt0mo,.testimonials.svelte-19bt0mo.svelte-19bt0mo{text-align:center}.testimonials.svelte-19bt0mo.svelte-19bt0mo{margin-top:50px}.testimonials.svelte-19bt0mo figure.svelte-19bt0mo{margin:10px auto;padding:20px;text-align:left;font-style:italic;transition:all .3s;max-width:800px}.testimonials.svelte-19bt0mo figure.svelte-19bt0mo:hover{background:#eee;border-radius:20px;transition:all .3s}.testimonials.svelte-19bt0mo blockquote.svelte-19bt0mo{margin:0}.testimonials.svelte-19bt0mo figcaption.svelte-19bt0mo{padding:0 25px}.testimonials.svelte-19bt0mo cite.svelte-19bt0mo{color:#666;font-style:italic}.testimonials.svelte-19bt0mo cite.svelte-19bt0mo:before{content:"- "}.image-callout.svelte-19bt0mo.svelte-19bt0mo{margin:25px;text-align:center}.image-callout.svelte-19bt0mo img.svelte-19bt0mo{max-width:80%;width:400px;margin:10px auto}.image-callout.svelte-19bt0mo p.svelte-19bt0mo{font-style:italic}';
const css = {
  code: '.content.svelte-19bt0mo.svelte-19bt0mo{margin-bottom:0}.content-inner.svelte-19bt0mo h2.svelte-19bt0mo,.image-grid.svelte-19bt0mo.svelte-19bt0mo{text-align:center}.image-grid.svelte-19bt0mo img.svelte-19bt0mo{margin:20px;max-width:calc(100% - 40px);height:auto}.video.svelte-19bt0mo.svelte-19bt0mo{margin:50px 20px;text-align:center}.video.svelte-19bt0mo p.svelte-19bt0mo{max-width:800px;margin:0 auto;padding:0 25px;font-style:italic}.center.svelte-19bt0mo.svelte-19bt0mo,.testimonials.svelte-19bt0mo.svelte-19bt0mo{text-align:center}.testimonials.svelte-19bt0mo.svelte-19bt0mo{margin-top:50px}.testimonials.svelte-19bt0mo figure.svelte-19bt0mo{margin:10px auto;padding:20px;text-align:left;font-style:italic;transition:all .3s;max-width:800px}.testimonials.svelte-19bt0mo figure.svelte-19bt0mo:hover{background:#eee;border-radius:20px;transition:all .3s}.testimonials.svelte-19bt0mo blockquote.svelte-19bt0mo{margin:0}.testimonials.svelte-19bt0mo figcaption.svelte-19bt0mo{padding:0 25px}.testimonials.svelte-19bt0mo cite.svelte-19bt0mo{color:#666;font-style:italic}.testimonials.svelte-19bt0mo cite.svelte-19bt0mo:before{content:"- "}.image-callout.svelte-19bt0mo.svelte-19bt0mo{margin:25px;text-align:center}.image-callout.svelte-19bt0mo img.svelte-19bt0mo{max-width:80%;width:400px;margin:10px auto}.image-callout.svelte-19bt0mo p.svelte-19bt0mo{font-style:italic}',
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<Head_Language lang=\\"es\\" />\\n<Head_HTML {title} {description} keywords={$milk?.site?.keywords} />\\n<Head_Facebook {title} {description} image=\\"/img/hero_services_01.jpg\\" />\\n<Head_Twitter {title} {description} image=\\"/img/hero_services_01.jpg\\" />\\n<Layout_Main id=\\"immigration-espanol\\">\\n\\t<Hero\\n\\t\\tid=\\"hero-espanol\\"\\n\\t\\timage_url=\\"/img/hero_espanol_01.jpg\\"\\n\\t\\timg_srcset=\\"/img/hero_espanol_01.jpg\\"\\n\\t\\tavif_srcset=\\"/img/hero_espanol_01.avif\\"\\n\\t\\twebp_srcset=\\"/img/hero_espanol_01.webp\\"\\n\\t\\ttitle=\\"Harlan York and Associates\\"\\n\\t\\tparallax=\\"false\\">&nbsp;</Hero\\n\\t>\\n\\t<Block_CallOutText\\n\\t\\tid=\\"call-out-text\\"\\n\\t\\tblockstyle=\\"block-style01\\"\\n\\t\\textraclasses=\\"floating-calltoaction\\"\\n\\t\\ttitle=\\"Abogado de Inmigraci\xF3n\\"\\n\\t>\\n\\t\\t<p>{description}</p>\\n\\t</Block_CallOutText>\\n\\t<div class=\\"content\\">\\n\\t\\t<div class=\\"content-inner\\">\\n\\t\\t\\t<h1>Espa\xF1ol</h1>\\n\\t\\t\\t<br /><br />\\n\\t\\t\\t<p class=\\"center\\">\\n\\t\\t\\t\\tPeriodista Natalia Cruz, ganadora de varios premios Emmy, en\\n\\t\\t\\t\\tnuestra oficina para una entrevista en el programa nacional de\\n\\t\\t\\t\\tUnivisi\xF3n, Primer Impacto.\\n\\t\\t\\t</p>\\n\\t\\t\\t<div class=\\"image-grid\\">\\n\\t\\t\\t\\t<picture>\\n\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\ttype=\\"image/avif\\"\\n\\t\\t\\t\\t\\t\\tsrcset=\\"/img/harlan_spanish_tv_1.avif\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\ttype=\\"image/webp\\"\\n\\t\\t\\t\\t\\t\\tsrcset=\\"/img/harlan_spanish_tv_1.webp\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\tsrc=\\"/img/harlan_spanish_tv_1.jpg\\"\\n\\t\\t\\t\\t\\t\\talt=\\"Harlan on Spanish TV\\"\\n\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\twidth=\\"325\\"\\n\\t\\t\\t\\t\\t\\theight=\\"244\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t</picture>\\n\\t\\t\\t\\t<picture>\\n\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\ttype=\\"image/avif\\"\\n\\t\\t\\t\\t\\t\\tsrcset=\\"/img/harlan_spanish_tv_2.avif\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\ttype=\\"image/webp\\"\\n\\t\\t\\t\\t\\t\\tsrcset=\\"/img/harlan_spanish_tv_2.webp\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\tsrc=\\"/img/harlan_spanish_tv_2.jpg\\"\\n\\t\\t\\t\\t\\t\\talt=\\"Harlan on Spanish TV\\"\\n\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\twidth=\\"325\\"\\n\\t\\t\\t\\t\\t\\theight=\\"244\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t</picture>\\n\\t\\t\\t\\t<picture>\\n\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\ttype=\\"image/avif\\"\\n\\t\\t\\t\\t\\t\\tsrcset=\\"/img/harlan_spanish_tv_3.avif\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\ttype=\\"image/webp\\"\\n\\t\\t\\t\\t\\t\\tsrcset=\\"/img/harlan_spanish_tv_3.webp\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\tsrc=\\"/img/harlan_spanish_tv_3.jpg\\"\\n\\t\\t\\t\\t\\t\\talt=\\"Harlan on Spanish TV\\"\\n\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\twidth=\\"325\\"\\n\\t\\t\\t\\t\\t\\theight=\\"244\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t</picture>\\n\\t\\t\\t\\t<picture>\\n\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\ttype=\\"image/avif\\"\\n\\t\\t\\t\\t\\t\\tsrcset=\\"/img/harlan_spanish_tv_4.avif\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\ttype=\\"image/webp\\"\\n\\t\\t\\t\\t\\t\\tsrcset=\\"/img/harlan_spanish_tv_4.webp\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\tsrc=\\"/img/harlan_spanish_tv_4.jpg\\"\\n\\t\\t\\t\\t\\t\\talt=\\"Harlan on Spanish TV\\"\\n\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\twidth=\\"325\\"\\n\\t\\t\\t\\t\\t\\theight=\\"244\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t</picture>\\n\\t\\t\\t</div>\\n\\t\\t\\t<div class=\\"video\\">\\n\\t\\t\\t\\t<h2>Perdon de Castigo de 10 Anos</h2>\\n\\t\\t\\t\\t<FeaturedVideo\\n\\t\\t\\t\\t\\tid=\\"espanol-featured-video-01\\"\\n\\t\\t\\t\\t\\tblockstyle=\\"\\"\\n\\t\\t\\t\\t\\tvideo_source=\\"//www.youtube.com/embed/JaqlwYPYYlA\\"\\n\\t\\t\\t\\t\\tvideo_jpg=\\"/img/espanol-video-01.jpg\\"\\n\\t\\t\\t\\t\\tvideo_webp=\\"/img/espanol-video-01.webp\\"\\n\\t\\t\\t\\t\\tvideo_avif=\\"/img/espanol-video-01.avif\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t\\t<p>\\n\\t\\t\\t\\t\\tMejor Abogado de Inmigracion Harlan York habla sobre 601A Y\\n\\t\\t\\t\\t\\tcomo pueda recibir papeles en matrimonio con ciudadano\\n\\t\\t\\t\\t\\tdespues de cruzar la frontera.\\n\\t\\t\\t\\t</p>\\n\\t\\t\\t</div>\\n\\t\\t\\t<p>\\n\\t\\t\\t\\tEntendemos la Ley de Inmigraci\xF3n. Es todo lo que hacemos.\\n\\t\\t\\t\\tSabemos que usted trabaja duro. Nosotros tambi\xE9n. Nuestros\\n\\t\\t\\t\\tabogados de inmigraci\xF3n responder\xE1n a sus preguntas de una\\n\\t\\t\\t\\tmanera que pueda comprender, sin jerga legal complicada.\\n\\t\\t\\t\\tNosotros cobramos honorarios razonables y todo nuestro bufete de\\n\\t\\t\\t\\tabogados trabaja directamente sobre su caso.\\n\\t\\t\\t</p>\\n\\t\\t\\t<p>\\n\\t\\t\\t\\tAbogado de Inmigraci\xF3n, Harlan York, fue ex-presidente de la\\n\\t\\t\\t\\tSecci\xF3n de Inmigraci\xF3n de la Asociaci\xF3n de Abogados del Estado\\n\\t\\t\\t\\tde Nueva Jersey. El Sr. York fue nombrado recientemente\\n\\t\\t\\t\\tCo-Presidente de la asociaci\xF3n de abogados del Estado de Nueva\\n\\t\\t\\t\\tYork Comit\xE9 CFLS Sobre Inmigraci\xF3n. \u201CBest Lawyers,\u201D la\\n\\t\\t\\t\\tpublicaci\xF3n de colegas m\xE1s respetados en la profesi\xF3n legal,\\n\\t\\t\\t\\tnombro a Harlan York como el \u201CAbogado del A\xF1o de Inmigraci\xF3n\u201D\\n\\t\\t\\t\\tpara el 2012 en el estado de Nueva Jersey.\\n\\t\\t\\t</p>\\n\\t\\t\\t<p>\\n\\t\\t\\t\\tEl Sr. York ha aparecido en televisi\xF3n nacional por la cadena\\n\\t\\t\\t\\tCBS en el programa This Morning con Charlie Rose y Primer\\n\\t\\t\\t\\tImpacto de Univisi\xF3n, tambi\xE9n ha hablado sobre asuntos de\\n\\t\\t\\t\\tinmigraci\xF3n en la cadena de Telemundo, NBC y PBS.\\n\\t\\t\\t</p>\\n\\t\\t\\t<div>\\n\\t\\t\\t\\tEl Sr. York se\xF1ala entre sus casos m\xE1s memorables:\\n\\t\\t\\t\\t<ul>\\n\\t\\t\\t\\t\\t<li>\\n\\t\\t\\t\\t\\t\\tPeticiones de visa para los ganadores de premios Emmy,\\n\\t\\t\\t\\t\\t\\tGrammy y medallas Ol\xEDmpicas\\n\\t\\t\\t\\t\\t</li>\\n\\t\\t\\t\\t\\t<li>\\n\\t\\t\\t\\t\\t\\tEl ganar los casos de deportaci\xF3n para los inmigrantes\\n\\t\\t\\t\\t\\t\\tque tienen hijos con necesidades especiales\\n\\t\\t\\t\\t\\t</li>\\n\\t\\t\\t\\t\\t<li>\\n\\t\\t\\t\\t\\t\\tRepresentaci\xF3n de atletas profesionales y aficionados\\n\\t\\t\\t\\t\\t\\tcon sus solicitudes de tarjeta verde\\n\\t\\t\\t\\t\\t</li>\\n\\t\\t\\t\\t\\t<li>\\n\\t\\t\\t\\t\\t\\tAyudar a las v\xEDctimas de la violencia que sufrieron a\\n\\t\\t\\t\\t\\t\\tmanos de agresores extranjeros y nacionales\\n\\t\\t\\t\\t\\t</li>\\n\\t\\t\\t\\t\\t<li>\\n\\t\\t\\t\\t\\t\\tArgumentado que los inmigrantes con delitos deben ser\\n\\t\\t\\t\\t\\t\\tautorizados a permanecer en los Estados Unidos una vez\\n\\t\\t\\t\\t\\t\\tcomprobada su rehabilitaci\xF3n y las penurias a sus\\n\\t\\t\\t\\t\\t\\tc\xF3nyuges y ni\xF1os estadounidenses\\n\\t\\t\\t\\t\\t</li>\\n\\t\\t\\t\\t\\t<li>\\n\\t\\t\\t\\t\\t\\tApelaciones exitosas innumerables ante los tribunales\\n\\t\\t\\t\\t\\t\\tfederales y administrativas sobre cuestiones relativas a\\n\\t\\t\\t\\t\\t\\tla exenci\xF3n de la eliminaci\xF3n y el asilo pol\xEDtico\\n\\t\\t\\t\\t\\t</li>\\n\\t\\t\\t\\t\\t<li>\\n\\t\\t\\t\\t\\t\\tPreparaci\xF3n de las aplicaciones para las empresas\\n\\t\\t\\t\\t\\t\\tpatrocinadoras inmigrantes en industrias que van desde\\n\\t\\t\\t\\t\\t\\trestaurantes hasta la construcci\xF3n, agricultura,\\n\\t\\t\\t\\t\\t\\tinstituciones acad\xE9micas y laboratorios de investigaci\xF3n\\n\\t\\t\\t\\t\\t</li>\\n\\t\\t\\t\\t</ul>\\n\\t\\t\\t</div>\\n\\t\\t\\t<p>\\n\\t\\t\\t\\tEl Sr. York dicta frecuentemente conferencias en la Ley de\\n\\t\\t\\t\\tInmigraci\xF3n, incluyendo la Universidad de Columbia, Nueva York y\\n\\t\\t\\t\\tla Escuela de Derecho de la Universidad de Rutgers. El Sr. York\\n\\t\\t\\t\\tes un reconocido orador en los eventos patrocinados por la New\\n\\t\\t\\t\\tJersey State Bar Foundation y Federal Bar Association. El Sr.\\n\\t\\t\\t\\tYork fue tambi\xE9n un juez en el Torneo de Prueba Americano de la\\n\\t\\t\\t\\tUniversidad de Yale.\\n\\t\\t\\t</p>\\n\\t\\t\\t<div class=\\"video\\">\\n\\t\\t\\t\\t<h2>Green Cards a Traves de Matrimonio</h2>\\n\\t\\t\\t\\t<FeaturedVideo\\n\\t\\t\\t\\t\\tid=\\"espanol-featured-video-02\\"\\n\\t\\t\\t\\t\\tblockstyle=\\"\\"\\n\\t\\t\\t\\t\\tvideo_source=\\"//www.youtube.com/embed/6DbTa6Gqp_U\\"\\n\\t\\t\\t\\t\\tvideo_jpg=\\"/img/espanol-video-02.jpg\\"\\n\\t\\t\\t\\t\\tvideo_webp=\\"/img/espanol-video-02.webp\\"\\n\\t\\t\\t\\t\\tvideo_avif=\\"/img/espanol-video-02.avif\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t\\t<p>\\n\\t\\t\\t\\t\\tMejor Abogado de Inmigracion Harlan York habla sobre\\n\\t\\t\\t\\t\\tSolicitud de Residencia Permanente.\\n\\t\\t\\t\\t</p>\\n\\t\\t\\t</div>\\n\\t\\t\\t<div class=\\"image-callout\\">\\n\\t\\t\\t\\t<picture>\\n\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\ttype=\\"image/avif\\"\\n\\t\\t\\t\\t\\t\\tsrcset=\\"/img/hya_agustin_photo.avif\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t<source\\n\\t\\t\\t\\t\\t\\ttype=\\"image/webp\\"\\n\\t\\t\\t\\t\\t\\tsrcset=\\"/img/hya_agustin_photo.webp\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t\\t<img\\n\\t\\t\\t\\t\\t\\tsrc=\\"/img/hya_agustin_photo.jpg\\"\\n\\t\\t\\t\\t\\t\\talt=\\"Abogado Harlan York Con Agust\xEDn Fern\xE1ndez \\"\\n\\t\\t\\t\\t\\t\\tloading=\\"lazy\\"\\n\\t\\t\\t\\t\\t\\twidth=\\"800\\"\\n\\t\\t\\t\\t\\t\\theight=\\"550\\"\\n\\t\\t\\t\\t\\t/>\\n\\t\\t\\t\\t</picture>\\n\\t\\t\\t\\t<p>\\n\\t\\t\\t\\t\\tAbogado Harlan York Con Agust\xEDn Fern\xE1ndez \u2013 Quien Gano\xF3 el\\n\\t\\t\\t\\t\\tOscar Y Muchos Emmys \u2013 Y Su Esposa\\n\\t\\t\\t\\t</p>\\n\\t\\t\\t</div>\\n\\t\\t\\t<div class=\\"testimonials\\">\\n\\t\\t\\t\\t<h2>Testimonios</h2>\\n\\t\\t\\t\\t<figure>\\n\\t\\t\\t\\t\\t<blockquote>\\n\\t\\t\\t\\t\\t\\t\u201CHarlan York es un peleador callejero!\u201D\\n\\t\\t\\t\\t\\t</blockquote>\\n\\t\\t\\t\\t\\t<figcaption>\\n\\t\\t\\t\\t\\t\\t<cite\\n\\t\\t\\t\\t\\t\\t\\t>Garry Kasparov, m\xE1s grande jugador de ajedrez de\\n\\t\\t\\t\\t\\t\\t\\ttodos los tiempos</cite\\n\\t\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t</figcaption>\\n\\t\\t\\t\\t</figure>\\n\\t\\t\\t\\t<figure>\\n\\t\\t\\t\\t\\t<blockquote>\\n\\t\\t\\t\\t\\t\\t\u201CHe tratado con muchos abogados de inmigraci\xF3n. Todos\\n\\t\\t\\t\\t\\t\\tson amables contigo hasta que les pagas y luego ya no\\n\\t\\t\\t\\t\\t\\thay respuesta. El Sr. York fue el \xFAnico que demostr\xF3\\n\\t\\t\\t\\t\\t\\testar a mi lado hasta que se resolvi\xF3 el caso.\u201D\\n\\t\\t\\t\\t\\t</blockquote>\\n\\t\\t\\t\\t\\t<figcaption><cite>Thomas, Cliente</cite></figcaption>\\n\\t\\t\\t\\t</figure>\\n\\t\\t\\t\\t<figure>\\n\\t\\t\\t\\t\\t<blockquote>\\n\\t\\t\\t\\t\\t\\t\u201CNo s\xF3lo es un experto en la ley de inmigraci\xF3n actual,\\n\\t\\t\\t\\t\\t\\tpero tambi\xE9n est\xE1 bien enterado de los cambios que han\\n\\t\\t\\t\\t\\t\\tocurrido en los \xFAltimos 20 a\xF1os. Y siempre he encontrado\\n\\t\\t\\t\\t\\t\\tsus tarifas justas y razonables.\u201D\\n\\t\\t\\t\\t\\t</blockquote>\\n\\t\\t\\t\\t\\t<figcaption><cite>Alberto, Cliente</cite></figcaption>\\n\\t\\t\\t\\t</figure>\\n\\t\\t\\t\\t<figure>\\n\\t\\t\\t\\t\\t<blockquote>\\n\\t\\t\\t\\t\\t\\t\u201CCuando llegu\xE9 por primera vez a la oficina del se\xF1or\\n\\t\\t\\t\\t\\t\\tYork, me sent\xED abrumada, perdida, y confundida. Pero el\\n\\t\\t\\t\\t\\t\\tfue capaz de empezar de forma r\xE1pida a agilizar el\\n\\t\\t\\t\\t\\t\\tpapeleo. \xC9l fue muy seguro y profesional.\u201D\\n\\t\\t\\t\\t\\t</blockquote>\\n\\t\\t\\t\\t\\t<figcaption><cite>Alina, Cliente</cite></figcaption>\\n\\t\\t\\t\\t</figure>\\n\\t\\t\\t\\t<figure>\\n\\t\\t\\t\\t\\t<blockquote>\\n\\t\\t\\t\\t\\t\\t\u201CDispuesto a tomar el caso que otros abogados no fueron\\n\\t\\t\\t\\t\\t\\tcapaz de manejar. Honesto, sencillo y conoce la ley.\\n\\t\\t\\t\\t\\t\\tAdem\xE1s, una persona muy amable que puedes considerar tu\\n\\t\\t\\t\\t\\t\\tamigo y no s\xF3lo tu abogado.\u201D\\n\\t\\t\\t\\t\\t</blockquote>\\n\\t\\t\\t\\t\\t<figcaption><cite>Tarek, Cliente</cite></figcaption>\\n\\t\\t\\t\\t</figure>\\n\\t\\t\\t\\t<figure>\\n\\t\\t\\t\\t\\t<blockquote>\\n\\t\\t\\t\\t\\t\\t\u201CLo que m\xE1s me gusta sobre el Sr. York es que te dice lo\\n\\t\\t\\t\\t\\t\\tque puedes hacer y lo que no debes hacer para no perder\\n\\t\\t\\t\\t\\t\\ttu dinero y tiempo.\u201D\\n\\t\\t\\t\\t\\t</blockquote>\\n\\t\\t\\t\\t\\t<figcaption><cite>Birol, Cliente</cite></figcaption>\\n\\t\\t\\t\\t</figure>\\n\\t\\t\\t\\t<figure>\\n\\t\\t\\t\\t\\t<blockquote>\\n\\t\\t\\t\\t\\t\\t\u201CEllos son el tipo de abogados con quienes te puedes\\n\\t\\t\\t\\t\\t\\tcomunicar en cualquier momento por correo electr\xF3nico,\\n\\t\\t\\t\\t\\t\\ttel\xE9fono o mensaje de texto. Cada vez que ten\xEDa una\\n\\t\\t\\t\\t\\t\\tpregunta, les enviaba un e-mail y en el mismo d\xEDa\\n\\t\\t\\t\\t\\t\\tobten\xEDa la respuesta!\u201D\\n\\t\\t\\t\\t\\t</blockquote>\\n\\t\\t\\t\\t\\t<figcaption><cite>Adriana, Cliente</cite></figcaption>\\n\\t\\t\\t\\t</figure>\\n\\t\\t\\t\\t<figure>\\n\\t\\t\\t\\t\\t<blockquote>\\n\\t\\t\\t\\t\\t\\t\u201CHarlan York acept\xF3 un caso de inmigraci\xF3n absolutamente\\n\\t\\t\\t\\t\\t\\tmuerto despu\xE9s de tres negaciones y en proceso de\\n\\t\\t\\t\\t\\t\\tdeportaci\xF3n, gano el caso. Estamos muy contentos de\\n\\t\\t\\t\\t\\t\\trecibir nuestras tarjetas de residencia despu\xE9s de su\\n\\t\\t\\t\\t\\t\\tsobresaliente esfuerzo.\u201D\\n\\t\\t\\t\\t\\t</blockquote>\\n\\t\\t\\t\\t\\t<figcaption><cite>Nikolay, Cliente</cite></figcaption>\\n\\t\\t\\t\\t</figure>\\n\\t\\t\\t\\t<figure>\\n\\t\\t\\t\\t\\t<blockquote>\\n\\t\\t\\t\\t\\t\\t\u201CEl Sr. York ha sido un gran abogado, honesto en todos\\n\\t\\t\\t\\t\\t\\tlos a\xF1os que lo conozco. \xC9l me salv\xF3 de la deportaci\xF3n.\u201D\\n\\t\\t\\t\\t\\t</blockquote>\\n\\t\\t\\t\\t\\t<figcaption><cite>Luis, Cliente</cite></figcaption>\\n\\t\\t\\t\\t</figure>\\n\\t\\t\\t\\t<figure>\\n\\t\\t\\t\\t\\t<blockquote>\\n\\t\\t\\t\\t\\t\\t\u201CQued\xE9 muy satisfecha con todo el proceso. Sobre todo,\\n\\t\\t\\t\\t\\t\\tme encanto su accesibilidad. El personal es muy amable y\\n\\t\\t\\t\\t\\t\\tsiempre respondieron a mis preguntas cuando llam\xE9. El\\n\\t\\t\\t\\t\\t\\tSr. York es extremadamente bueno para comunicarse con\\n\\t\\t\\t\\t\\t\\tusted y responder cualquier pregunta. Nunca esper\xE9 mas\\n\\t\\t\\t\\t\\t\\tde unas pocas horas para recibir una llamada de vuelta.\\n\\t\\t\\t\\t\\t\\t\xC9l responde a sus correos electr\xF3nicos casi al instante.\\n\\t\\t\\t\\t\\t\\tHe trabajado con otros abogados y no he estado tan\\n\\t\\t\\t\\t\\t\\tsatisfecha hasta que me encontr\xE9 al se\xF1or York.\u201D\\n\\t\\t\\t\\t\\t</blockquote>\\n\\t\\t\\t\\t\\t<figcaption><cite>Martha, Cliente</cite></figcaption>\\n\\t\\t\\t\\t</figure>\\n\\t\\t\\t\\t<figure>\\n\\t\\t\\t\\t\\t<blockquote>\\n\\t\\t\\t\\t\\t\\t\u201CHarlan York y su equipo fueron absolutamente\\n\\t\\t\\t\\t\\t\\tincre\xEDbles. Nuestro caso de inmigraci\xF3n era un poco\\n\\t\\t\\t\\t\\t\\tcomplicado, pero Harlan estaba all\xED con nosotros cada\\n\\t\\t\\t\\t\\t\\tpaso del camino. Siempre nos sentimos como si fu\xE9ramos\\n\\t\\t\\t\\t\\t\\tde alta prioridad para Harlan y su equipo. Yo\\n\\t\\t\\t\\t\\t\\trecomendar\xEDa altamente Harlan York a cualquiera que est\xE9\\n\\t\\t\\t\\t\\t\\tbuscando ayuda con un caso de inmigraci\xF3n.\u201D\\n\\t\\t\\t\\t\\t</blockquote>\\n\\t\\t\\t\\t\\t<figcaption><cite>Laurie, Cliente</cite></figcaption>\\n\\t\\t\\t\\t</figure>\\n\\t\\t\\t\\t<figure>\\n\\t\\t\\t\\t\\t<blockquote>\\n\\t\\t\\t\\t\\t\\t\u201CEl descubri\xF3 que ten\xEDa un d\xEDa mas antes de mi\\n\\t\\t\\t\\t\\t\\tdeportaci\xF3n y fue capaz de revertir mi caso de manera\\n\\t\\t\\t\\t\\t\\tcorrecta. Harlan es muy amable, honesto, sincero y lleno\\n\\t\\t\\t\\t\\t\\tde energ\xEDa. \xC9l no hizo promesas vac\xEDas para nosotros. \xC9l\\n\\t\\t\\t\\t\\t\\ttrabaj\xF3 muy duro con mi caso. No puedo agradecerles lo\\n\\t\\t\\t\\t\\t\\tsuficiente.\u201D\\n\\t\\t\\t\\t\\t</blockquote>\\n\\t\\t\\t\\t\\t<figcaption><cite>Julia, Cliente</cite></figcaption>\\n\\t\\t\\t\\t</figure>\\n\\t\\t\\t\\t<figure>\\n\\t\\t\\t\\t\\t<blockquote>\\n\\t\\t\\t\\t\\t\\t\u201CMe lo recomend\xF3 un amigo. Tengo que decir que fue la\\n\\t\\t\\t\\t\\t\\tmejor decisi\xF3n que he tomado. El proceso fue r\xE1pido y\\n\\t\\t\\t\\t\\t\\tnunca me sent\xED inc\xF3modo. El Sr. York y su excepcional\\n\\t\\t\\t\\t\\t\\tequipo de personal jur\xEDdico profesional estaban all\xED\\n\\t\\t\\t\\t\\t\\tpara m\xED todo el tiempo. Siendo propietario de una\\n\\t\\t\\t\\t\\t\\tpeque\xF1a empresa que emplea a personas en situaciones\\n\\t\\t\\t\\t\\t\\tsimilares en la que yo estuve una vez, ahora lo\\n\\t\\t\\t\\t\\t\\trecomiendo a todo mi personal y el potencial futuro\\n\\t\\t\\t\\t\\t\\tpersonal Harlan York y Asociados. \xC9l tiene un cliente de\\n\\t\\t\\t\\t\\t\\tpor vida en mi, mi negocio, y mi familia.\u201D\\n\\t\\t\\t\\t\\t</blockquote>\\n\\t\\t\\t\\t\\t<figcaption><cite>Wayne, Cliente</cite></figcaption>\\n\\t\\t\\t\\t</figure>\\n\\t\\t\\t\\t<figure>\\n\\t\\t\\t\\t\\t<blockquote>\\n\\t\\t\\t\\t\\t\\t\u201CYork fue un profesional preciso. Se identificaron con\\n\\t\\t\\t\\t\\t\\tprecisi\xF3n los asuntos que deb\xEDan abordarse. En t\xE9rminos\\n\\t\\t\\t\\t\\t\\tpersonales, parec\xEDa compartir una pasi\xF3n igual por las\\n\\t\\t\\t\\t\\t\\tcomplejidades de la ley y los aspectos m\xE1s humanos de la\\n\\t\\t\\t\\t\\t\\tley de inmigraci\xF3n.\u201D\\n\\t\\t\\t\\t\\t</blockquote>\\n\\t\\t\\t\\t\\t<figcaption><cite>Jeremy, Cliente</cite></figcaption>\\n\\t\\t\\t\\t</figure>\\n\\t\\t\\t\\t<figure>\\n\\t\\t\\t\\t\\t<blockquote>\\n\\t\\t\\t\\t\\t\\t\u201CHarlan es muy profesional, agradable, eficiente, y\\n\\t\\t\\t\\t\\t\\ttransparente sobre el proceso y los costos. Adem\xE1s, es\\n\\t\\t\\t\\t\\t\\taccesible y sensible a las necesidades y preguntas de\\n\\t\\t\\t\\t\\t\\tlos clientes. Lo recomendar\xEDa sin dudarlo.\u201D\\n\\t\\t\\t\\t\\t</blockquote>\\n\\t\\t\\t\\t\\t<figcaption><cite>Anthony, Cliente</cite></figcaption>\\n\\t\\t\\t\\t</figure>\\n\\t\\t\\t\\t<figure>\\n\\t\\t\\t\\t\\t<blockquote>\\n\\t\\t\\t\\t\\t\\t\u201CEl Sr. York y su personal se comportaron de una manera\\n\\t\\t\\t\\t\\t\\tejemplar. Nunca tuvimos que esperar para obtener\\n\\t\\t\\t\\t\\t\\tinformaci\xF3n o una petici\xF3n especial. Nuestras preguntas\\n\\t\\t\\t\\t\\t\\to preocupaciones siempre fueron abordados. El caso fue\\n\\t\\t\\t\\t\\t\\tllevado a la terminaci\xF3n en menos tiempo de lo\\n\\t\\t\\t\\t\\t\\tesperado.\u201D\\n\\t\\t\\t\\t\\t</blockquote>\\n\\t\\t\\t\\t\\t<figcaption><cite>Ricardo, Cliente</cite></figcaption>\\n\\t\\t\\t\\t</figure>\\n\\t\\t\\t\\t<figure>\\n\\t\\t\\t\\t\\t<blockquote>\\n\\t\\t\\t\\t\\t\\t\u201CMe hab\xEDan dado el nombre del Sr. York por uno de mis\\n\\t\\t\\t\\t\\t\\tcolegas en la universidad, pero yo era esc\xE9ptico hasta\\n\\t\\t\\t\\t\\t\\tque me di cuenta de la eficiencia con que el maneja todo\\n\\t\\t\\t\\t\\t\\tel papeleo. Recib\xED mi ciudadan\xEDa en Estados Unidos sin\\n\\t\\t\\t\\t\\t\\tning\xFAn problema, y \u200B\u200Bapenas la semana pasada, 12 a\xF1os\\n\\t\\t\\t\\t\\t\\tdespu\xE9s, Harlan me proporcion\xF3 una nota legal que\\n\\t\\t\\t\\t\\t\\trequer\xEDa sin ninguna duda de la misma manera r\xE1pida y\\n\\t\\t\\t\\t\\t\\tdirecta que me hab\xEDa impresionado cuando lo conoc\xED.\u201D\\n\\t\\t\\t\\t\\t</blockquote>\\n\\t\\t\\t\\t\\t<figcaption><cite>Karl, Cliente</cite></figcaption>\\n\\t\\t\\t\\t</figure>\\n\\t\\t\\t</div>\\n\\t\\t\\t<div class=\\"video\\">\\n\\t\\t\\t\\t<FeaturedVideo\\n\\t\\t\\t\\t\\tid=\\"espanol-featured-video-03\\"\\n\\t\\t\\t\\t\\tblockstyle=\\"\\"\\n\\t\\t\\t\\t\\tvideo_source=\\"//www.youtube.com/embed/uX4lKIUCTJc\\"\\n\\t\\t\\t\\t\\tvideo_jpg=\\"/img/espanol-video-03.jpg\\"\\n\\t\\t\\t\\t\\tvideo_webp=\\"/img/espanol-video-03.webp\\"\\n\\t\\t\\t\\t\\tvideo_avif=\\"/img/espanol-video-03.avif\\"\\n\\t\\t\\t\\t/>\\n\\t\\t\\t\\t<p>\\n\\t\\t\\t\\t\\tArtasanchez habla de c\xF3mo Harlan York le ayud\xF3 a aclarar su\\n\\t\\t\\t\\t\\tsituaci\xF3n migratoria y asegurar su residencia permanente y\\n\\t\\t\\t\\t\\tciudadan\xEDa estadounidense.\\n\\t\\t\\t\\t</p>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t</div>\\n\\t<Block_CallToAction\\n\\t\\tid=\\"call-to-action\\"\\n\\t\\tblockstyle=\\"block-style01\\"\\n\\t\\textraclasses=\\"regular-calltoaction\\"\\n\\t/>\\n\\t<Block_LanguagesWeSpeak />\\n\\t<Block_Languages id=\\"languages\\" blockstyle=\\"block-style04\\" />\\n\\t<Block_Featured id=\\"featured\\" blockstyle=\\"\\" />\\n\\t<Block_Ratings id=\\"ratings\\" blockstyle=\\"\\" />\\n\\t<SocialMedia id=\\"socialmedia\\" blockstyle=\\"\\" />\\n</Layout_Main>\\n\\n<script>var _$milk, _$milk$site;\\n\\n/* ## MILK ## */\\nimport { milk } from '$milk/milk.js';\\n/* ## Components ## */\\n\\nimport Head_Language from '$milk/lib/Head_Language.svelte';\\nimport Head_HTML from '$milk/lib/Head_HTML.svelte';\\nimport Head_Facebook from '$milk/lib/Head_Facebook.svelte';\\nimport Head_Twitter from '$milk/lib/Head_Twitter.svelte';\\nimport Layout_Main from '$theme/Layout_Main.svelte';\\nimport Hero from '$milk/lib/Hero.svelte';\\nimport Block_CallOutText from '$theme/Block_CallOutText.svelte';\\nimport FeaturedVideo from '$milk/lib/FeaturedVideo.svelte';\\nimport Block_CallToAction from '$theme/Block_CallToAction.svelte';\\nimport Block_LanguagesWeSpeak from '$theme/Block_LanguagesWeSpeak.svelte';\\nimport Block_Languages from '$theme/Block_Languages.svelte';\\nimport Block_Featured from '$theme/Block_Featured.svelte';\\nimport SocialMedia from '$milk/lib/SocialMedia.svelte';\\nimport Block_Ratings from '$theme/Block_Ratings.svelte';\\n/* ## Variables ## */\\n\\nvar title = \\"Abogado de Inmigraci\\\\xF3n - \\" + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.title);\\nvar description = 'Llame a un bufete de abogados de inmigraci\xF3n dedicados y con mucha experiencia para tener la mejor posibilidad de luchar.';</script>\\n\\n<style>.content{margin-bottom:0}.content-inner h2,.image-grid{text-align:center}.image-grid img{margin:20px;max-width:calc(100% - 40px);height:auto}.video{margin:50px 20px;text-align:center}.video p{max-width:800px;margin:0 auto;padding:0 25px;font-style:italic}.center,.testimonials{text-align:center}.testimonials{margin-top:50px}.testimonials figure{margin:10px auto;padding:20px;text-align:left;font-style:italic;transition:all .3s;max-width:800px}.testimonials figure:hover{background:#eee;border-radius:20px;transition:all .3s}.testimonials blockquote{margin:0}.testimonials figcaption{padding:0 25px}.testimonials cite{color:#666;font-style:italic}.testimonials cite:before{content:\\"- \\"}.image-callout{margin:25px;text-align:center}.image-callout img{max-width:80%;width:400px;margin:10px auto}.image-callout p{font-style:italic}</style>\\n"],"names":[],"mappings":"AA4cO,sCAAQ,CAAC,cAAc,CAAC,CAAC,6BAAc,CAAC,iBAAE,CAAC,yCAAW,CAAC,WAAW,MAAM,CAAC,0BAAW,CAAC,kBAAG,CAAC,OAAO,IAAI,CAAC,UAAU,KAAK,IAAI,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,OAAO,IAAI,CAAC,oCAAM,CAAC,OAAO,IAAI,CAAC,IAAI,CAAC,WAAW,MAAM,CAAC,qBAAM,CAAC,gBAAC,CAAC,UAAU,KAAK,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,QAAQ,CAAC,CAAC,IAAI,CAAC,WAAW,MAAM,CAAC,qCAAO,CAAC,2CAAa,CAAC,WAAW,MAAM,CAAC,2CAAa,CAAC,WAAW,IAAI,CAAC,4BAAa,CAAC,qBAAM,CAAC,OAAO,IAAI,CAAC,IAAI,CAAC,QAAQ,IAAI,CAAC,WAAW,IAAI,CAAC,WAAW,MAAM,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,UAAU,KAAK,CAAC,4BAAa,CAAC,qBAAM,MAAM,CAAC,WAAW,IAAI,CAAC,cAAc,IAAI,CAAC,WAAW,GAAG,CAAC,GAAG,CAAC,4BAAa,CAAC,yBAAU,CAAC,OAAO,CAAC,CAAC,4BAAa,CAAC,yBAAU,CAAC,QAAQ,CAAC,CAAC,IAAI,CAAC,4BAAa,CAAC,mBAAI,CAAC,MAAM,IAAI,CAAC,WAAW,MAAM,CAAC,4BAAa,CAAC,mBAAI,OAAO,CAAC,QAAQ,IAAI,CAAC,4CAAc,CAAC,OAAO,IAAI,CAAC,WAAW,MAAM,CAAC,6BAAc,CAAC,kBAAG,CAAC,UAAU,GAAG,CAAC,MAAM,KAAK,CAAC,OAAO,IAAI,CAAC,IAAI,CAAC,6BAAc,CAAC,gBAAC,CAAC,WAAW,MAAM,CAAC"}`
};
var description = "Llame a un bufete de abogados de inmigraci\xF3n dedicados y con mucha experiencia para tener la mejor posibilidad de luchar.";
const Espanol = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a;
  let $milk, $$unsubscribe_milk;
  $$unsubscribe_milk = subscribe(milk, (value) => $milk = value);
  var _$milk, _$milk$site;
  var title = "Abogado de Inmigraci\xF3n - " + ((_$milk = $milk) == null ? void 0 : (_$milk$site = _$milk.site) == null ? void 0 : _$milk$site.title);
  $$result.css.add(css);
  $$unsubscribe_milk();
  return `${validate_component(Head_Language, "Head_Language").$$render($$result, {lang: "es"}, {}, {})}
${validate_component(Head_HTML, "Head_HTML").$$render($$result, {
    title,
    description,
    keywords: (_a = $milk == null ? void 0 : $milk.site) == null ? void 0 : _a.keywords
  }, {}, {})}
${validate_component(Head_Facebook, "Head_Facebook").$$render($$result, {
    title,
    description,
    image: "/img/hero_services_01.jpg"
  }, {}, {})}
${validate_component(Head_Twitter, "Head_Twitter").$$render($$result, {
    title,
    description,
    image: "/img/hero_services_01.jpg"
  }, {}, {})}
${validate_component(Layout_Main, "Layout_Main").$$render($$result, {id: "immigration-espanol"}, {}, {
    default: () => `${validate_component(Hero, "Hero").$$render($$result, {
      id: "hero-espanol",
      image_url: "/img/hero_espanol_01.jpg",
      img_srcset: "/img/hero_espanol_01.jpg",
      avif_srcset: "/img/hero_espanol_01.avif",
      webp_srcset: "/img/hero_espanol_01.webp",
      title: "Harlan York and Associates",
      parallax: "false"
    }, {}, {})}
	${validate_component(Block_CallOutText, "Block_CallOutText").$$render($$result, {
      id: "call-out-text",
      blockstyle: "block-style01",
      extraclasses: "floating-calltoaction",
      title: "Abogado de Inmigraci\xF3n"
    }, {}, {
      default: () => `<p>${escape(description)}</p>`
    })}
	<div class="${"content svelte-19bt0mo"}"><div class="${"content-inner svelte-19bt0mo"}"><h1>Espa\xF1ol</h1>
			<br><br>
			<p class="${"center svelte-19bt0mo"}">Periodista Natalia Cruz, ganadora de varios premios Emmy, en
				nuestra oficina para una entrevista en el programa nacional de
				Univisi\xF3n, Primer Impacto.
			</p>
			<div class="${"image-grid svelte-19bt0mo"}"><picture><source type="${"image/avif"}" srcset="${"/img/harlan_spanish_tv_1.avif"}">
					<source type="${"image/webp"}" srcset="${"/img/harlan_spanish_tv_1.webp"}">
					<img src="${"/img/harlan_spanish_tv_1.jpg"}" alt="${"Harlan on Spanish TV"}" loading="${"lazy"}" width="${"325"}" height="${"244"}" class="${"svelte-19bt0mo"}"></picture>
				<picture><source type="${"image/avif"}" srcset="${"/img/harlan_spanish_tv_2.avif"}">
					<source type="${"image/webp"}" srcset="${"/img/harlan_spanish_tv_2.webp"}">
					<img src="${"/img/harlan_spanish_tv_2.jpg"}" alt="${"Harlan on Spanish TV"}" loading="${"lazy"}" width="${"325"}" height="${"244"}" class="${"svelte-19bt0mo"}"></picture>
				<picture><source type="${"image/avif"}" srcset="${"/img/harlan_spanish_tv_3.avif"}">
					<source type="${"image/webp"}" srcset="${"/img/harlan_spanish_tv_3.webp"}">
					<img src="${"/img/harlan_spanish_tv_3.jpg"}" alt="${"Harlan on Spanish TV"}" loading="${"lazy"}" width="${"325"}" height="${"244"}" class="${"svelte-19bt0mo"}"></picture>
				<picture><source type="${"image/avif"}" srcset="${"/img/harlan_spanish_tv_4.avif"}">
					<source type="${"image/webp"}" srcset="${"/img/harlan_spanish_tv_4.webp"}">
					<img src="${"/img/harlan_spanish_tv_4.jpg"}" alt="${"Harlan on Spanish TV"}" loading="${"lazy"}" width="${"325"}" height="${"244"}" class="${"svelte-19bt0mo"}"></picture></div>
			<div class="${"video svelte-19bt0mo"}"><h2 class="${"svelte-19bt0mo"}">Perdon de Castigo de 10 Anos</h2>
				${validate_component(FeaturedVideo, "FeaturedVideo").$$render($$result, {
      id: "espanol-featured-video-01",
      blockstyle: "",
      video_source: "//www.youtube.com/embed/JaqlwYPYYlA",
      video_jpg: "/img/espanol-video-01.jpg",
      video_webp: "/img/espanol-video-01.webp",
      video_avif: "/img/espanol-video-01.avif"
    }, {}, {})}
				<p class="${"svelte-19bt0mo"}">Mejor Abogado de Inmigracion Harlan York habla sobre 601A Y
					como pueda recibir papeles en matrimonio con ciudadano
					despues de cruzar la frontera.
				</p></div>
			<p>Entendemos la Ley de Inmigraci\xF3n. Es todo lo que hacemos.
				Sabemos que usted trabaja duro. Nosotros tambi\xE9n. Nuestros
				abogados de inmigraci\xF3n responder\xE1n a sus preguntas de una
				manera que pueda comprender, sin jerga legal complicada.
				Nosotros cobramos honorarios razonables y todo nuestro bufete de
				abogados trabaja directamente sobre su caso.
			</p>
			<p>Abogado de Inmigraci\xF3n, Harlan York, fue ex-presidente de la
				Secci\xF3n de Inmigraci\xF3n de la Asociaci\xF3n de Abogados del Estado
				de Nueva Jersey. El Sr. York fue nombrado recientemente
				Co-Presidente de la asociaci\xF3n de abogados del Estado de Nueva
				York Comit\xE9 CFLS Sobre Inmigraci\xF3n. \u201CBest Lawyers,\u201D la
				publicaci\xF3n de colegas m\xE1s respetados en la profesi\xF3n legal,
				nombro a Harlan York como el \u201CAbogado del A\xF1o de Inmigraci\xF3n\u201D
				para el 2012 en el estado de Nueva Jersey.
			</p>
			<p>El Sr. York ha aparecido en televisi\xF3n nacional por la cadena
				CBS en el programa This Morning con Charlie Rose y Primer
				Impacto de Univisi\xF3n, tambi\xE9n ha hablado sobre asuntos de
				inmigraci\xF3n en la cadena de Telemundo, NBC y PBS.
			</p>
			<div>El Sr. York se\xF1ala entre sus casos m\xE1s memorables:
				<ul><li>Peticiones de visa para los ganadores de premios Emmy,
						Grammy y medallas Ol\xEDmpicas
					</li>
					<li>El ganar los casos de deportaci\xF3n para los inmigrantes
						que tienen hijos con necesidades especiales
					</li>
					<li>Representaci\xF3n de atletas profesionales y aficionados
						con sus solicitudes de tarjeta verde
					</li>
					<li>Ayudar a las v\xEDctimas de la violencia que sufrieron a
						manos de agresores extranjeros y nacionales
					</li>
					<li>Argumentado que los inmigrantes con delitos deben ser
						autorizados a permanecer en los Estados Unidos una vez
						comprobada su rehabilitaci\xF3n y las penurias a sus
						c\xF3nyuges y ni\xF1os estadounidenses
					</li>
					<li>Apelaciones exitosas innumerables ante los tribunales
						federales y administrativas sobre cuestiones relativas a
						la exenci\xF3n de la eliminaci\xF3n y el asilo pol\xEDtico
					</li>
					<li>Preparaci\xF3n de las aplicaciones para las empresas
						patrocinadoras inmigrantes en industrias que van desde
						restaurantes hasta la construcci\xF3n, agricultura,
						instituciones acad\xE9micas y laboratorios de investigaci\xF3n
					</li></ul></div>
			<p>El Sr. York dicta frecuentemente conferencias en la Ley de
				Inmigraci\xF3n, incluyendo la Universidad de Columbia, Nueva York y
				la Escuela de Derecho de la Universidad de Rutgers. El Sr. York
				es un reconocido orador en los eventos patrocinados por la New
				Jersey State Bar Foundation y Federal Bar Association. El Sr.
				York fue tambi\xE9n un juez en el Torneo de Prueba Americano de la
				Universidad de Yale.
			</p>
			<div class="${"video svelte-19bt0mo"}"><h2 class="${"svelte-19bt0mo"}">Green Cards a Traves de Matrimonio</h2>
				${validate_component(FeaturedVideo, "FeaturedVideo").$$render($$result, {
      id: "espanol-featured-video-02",
      blockstyle: "",
      video_source: "//www.youtube.com/embed/6DbTa6Gqp_U",
      video_jpg: "/img/espanol-video-02.jpg",
      video_webp: "/img/espanol-video-02.webp",
      video_avif: "/img/espanol-video-02.avif"
    }, {}, {})}
				<p class="${"svelte-19bt0mo"}">Mejor Abogado de Inmigracion Harlan York habla sobre
					Solicitud de Residencia Permanente.
				</p></div>
			<div class="${"image-callout svelte-19bt0mo"}"><picture><source type="${"image/avif"}" srcset="${"/img/hya_agustin_photo.avif"}">
					<source type="${"image/webp"}" srcset="${"/img/hya_agustin_photo.webp"}">
					<img src="${"/img/hya_agustin_photo.jpg"}" alt="${"Abogado Harlan York Con Agust\xEDn Fern\xE1ndez "}" loading="${"lazy"}" width="${"800"}" height="${"550"}" class="${"svelte-19bt0mo"}"></picture>
				<p class="${"svelte-19bt0mo"}">Abogado Harlan York Con Agust\xEDn Fern\xE1ndez \u2013 Quien Gano\xF3 el
					Oscar Y Muchos Emmys \u2013 Y Su Esposa
				</p></div>
			<div class="${"testimonials svelte-19bt0mo"}"><h2 class="${"svelte-19bt0mo"}">Testimonios</h2>
				<figure class="${"svelte-19bt0mo"}"><blockquote class="${"svelte-19bt0mo"}">\u201CHarlan York es un peleador callejero!\u201D
					</blockquote>
					<figcaption class="${"svelte-19bt0mo"}"><cite class="${"svelte-19bt0mo"}">Garry Kasparov, m\xE1s grande jugador de ajedrez de
							todos los tiempos</cite></figcaption></figure>
				<figure class="${"svelte-19bt0mo"}"><blockquote class="${"svelte-19bt0mo"}">\u201CHe tratado con muchos abogados de inmigraci\xF3n. Todos
						son amables contigo hasta que les pagas y luego ya no
						hay respuesta. El Sr. York fue el \xFAnico que demostr\xF3
						estar a mi lado hasta que se resolvi\xF3 el caso.\u201D
					</blockquote>
					<figcaption class="${"svelte-19bt0mo"}"><cite class="${"svelte-19bt0mo"}">Thomas, Cliente</cite></figcaption></figure>
				<figure class="${"svelte-19bt0mo"}"><blockquote class="${"svelte-19bt0mo"}">\u201CNo s\xF3lo es un experto en la ley de inmigraci\xF3n actual,
						pero tambi\xE9n est\xE1 bien enterado de los cambios que han
						ocurrido en los \xFAltimos 20 a\xF1os. Y siempre he encontrado
						sus tarifas justas y razonables.\u201D
					</blockquote>
					<figcaption class="${"svelte-19bt0mo"}"><cite class="${"svelte-19bt0mo"}">Alberto, Cliente</cite></figcaption></figure>
				<figure class="${"svelte-19bt0mo"}"><blockquote class="${"svelte-19bt0mo"}">\u201CCuando llegu\xE9 por primera vez a la oficina del se\xF1or
						York, me sent\xED abrumada, perdida, y confundida. Pero el
						fue capaz de empezar de forma r\xE1pida a agilizar el
						papeleo. \xC9l fue muy seguro y profesional.\u201D
					</blockquote>
					<figcaption class="${"svelte-19bt0mo"}"><cite class="${"svelte-19bt0mo"}">Alina, Cliente</cite></figcaption></figure>
				<figure class="${"svelte-19bt0mo"}"><blockquote class="${"svelte-19bt0mo"}">\u201CDispuesto a tomar el caso que otros abogados no fueron
						capaz de manejar. Honesto, sencillo y conoce la ley.
						Adem\xE1s, una persona muy amable que puedes considerar tu
						amigo y no s\xF3lo tu abogado.\u201D
					</blockquote>
					<figcaption class="${"svelte-19bt0mo"}"><cite class="${"svelte-19bt0mo"}">Tarek, Cliente</cite></figcaption></figure>
				<figure class="${"svelte-19bt0mo"}"><blockquote class="${"svelte-19bt0mo"}">\u201CLo que m\xE1s me gusta sobre el Sr. York es que te dice lo
						que puedes hacer y lo que no debes hacer para no perder
						tu dinero y tiempo.\u201D
					</blockquote>
					<figcaption class="${"svelte-19bt0mo"}"><cite class="${"svelte-19bt0mo"}">Birol, Cliente</cite></figcaption></figure>
				<figure class="${"svelte-19bt0mo"}"><blockquote class="${"svelte-19bt0mo"}">\u201CEllos son el tipo de abogados con quienes te puedes
						comunicar en cualquier momento por correo electr\xF3nico,
						tel\xE9fono o mensaje de texto. Cada vez que ten\xEDa una
						pregunta, les enviaba un e-mail y en el mismo d\xEDa
						obten\xEDa la respuesta!\u201D
					</blockquote>
					<figcaption class="${"svelte-19bt0mo"}"><cite class="${"svelte-19bt0mo"}">Adriana, Cliente</cite></figcaption></figure>
				<figure class="${"svelte-19bt0mo"}"><blockquote class="${"svelte-19bt0mo"}">\u201CHarlan York acept\xF3 un caso de inmigraci\xF3n absolutamente
						muerto despu\xE9s de tres negaciones y en proceso de
						deportaci\xF3n, gano el caso. Estamos muy contentos de
						recibir nuestras tarjetas de residencia despu\xE9s de su
						sobresaliente esfuerzo.\u201D
					</blockquote>
					<figcaption class="${"svelte-19bt0mo"}"><cite class="${"svelte-19bt0mo"}">Nikolay, Cliente</cite></figcaption></figure>
				<figure class="${"svelte-19bt0mo"}"><blockquote class="${"svelte-19bt0mo"}">\u201CEl Sr. York ha sido un gran abogado, honesto en todos
						los a\xF1os que lo conozco. \xC9l me salv\xF3 de la deportaci\xF3n.\u201D
					</blockquote>
					<figcaption class="${"svelte-19bt0mo"}"><cite class="${"svelte-19bt0mo"}">Luis, Cliente</cite></figcaption></figure>
				<figure class="${"svelte-19bt0mo"}"><blockquote class="${"svelte-19bt0mo"}">\u201CQued\xE9 muy satisfecha con todo el proceso. Sobre todo,
						me encanto su accesibilidad. El personal es muy amable y
						siempre respondieron a mis preguntas cuando llam\xE9. El
						Sr. York es extremadamente bueno para comunicarse con
						usted y responder cualquier pregunta. Nunca esper\xE9 mas
						de unas pocas horas para recibir una llamada de vuelta.
						\xC9l responde a sus correos electr\xF3nicos casi al instante.
						He trabajado con otros abogados y no he estado tan
						satisfecha hasta que me encontr\xE9 al se\xF1or York.\u201D
					</blockquote>
					<figcaption class="${"svelte-19bt0mo"}"><cite class="${"svelte-19bt0mo"}">Martha, Cliente</cite></figcaption></figure>
				<figure class="${"svelte-19bt0mo"}"><blockquote class="${"svelte-19bt0mo"}">\u201CHarlan York y su equipo fueron absolutamente
						incre\xEDbles. Nuestro caso de inmigraci\xF3n era un poco
						complicado, pero Harlan estaba all\xED con nosotros cada
						paso del camino. Siempre nos sentimos como si fu\xE9ramos
						de alta prioridad para Harlan y su equipo. Yo
						recomendar\xEDa altamente Harlan York a cualquiera que est\xE9
						buscando ayuda con un caso de inmigraci\xF3n.\u201D
					</blockquote>
					<figcaption class="${"svelte-19bt0mo"}"><cite class="${"svelte-19bt0mo"}">Laurie, Cliente</cite></figcaption></figure>
				<figure class="${"svelte-19bt0mo"}"><blockquote class="${"svelte-19bt0mo"}">\u201CEl descubri\xF3 que ten\xEDa un d\xEDa mas antes de mi
						deportaci\xF3n y fue capaz de revertir mi caso de manera
						correcta. Harlan es muy amable, honesto, sincero y lleno
						de energ\xEDa. \xC9l no hizo promesas vac\xEDas para nosotros. \xC9l
						trabaj\xF3 muy duro con mi caso. No puedo agradecerles lo
						suficiente.\u201D
					</blockquote>
					<figcaption class="${"svelte-19bt0mo"}"><cite class="${"svelte-19bt0mo"}">Julia, Cliente</cite></figcaption></figure>
				<figure class="${"svelte-19bt0mo"}"><blockquote class="${"svelte-19bt0mo"}">\u201CMe lo recomend\xF3 un amigo. Tengo que decir que fue la
						mejor decisi\xF3n que he tomado. El proceso fue r\xE1pido y
						nunca me sent\xED inc\xF3modo. El Sr. York y su excepcional
						equipo de personal jur\xEDdico profesional estaban all\xED
						para m\xED todo el tiempo. Siendo propietario de una
						peque\xF1a empresa que emplea a personas en situaciones
						similares en la que yo estuve una vez, ahora lo
						recomiendo a todo mi personal y el potencial futuro
						personal Harlan York y Asociados. \xC9l tiene un cliente de
						por vida en mi, mi negocio, y mi familia.\u201D
					</blockquote>
					<figcaption class="${"svelte-19bt0mo"}"><cite class="${"svelte-19bt0mo"}">Wayne, Cliente</cite></figcaption></figure>
				<figure class="${"svelte-19bt0mo"}"><blockquote class="${"svelte-19bt0mo"}">\u201CYork fue un profesional preciso. Se identificaron con
						precisi\xF3n los asuntos que deb\xEDan abordarse. En t\xE9rminos
						personales, parec\xEDa compartir una pasi\xF3n igual por las
						complejidades de la ley y los aspectos m\xE1s humanos de la
						ley de inmigraci\xF3n.\u201D
					</blockquote>
					<figcaption class="${"svelte-19bt0mo"}"><cite class="${"svelte-19bt0mo"}">Jeremy, Cliente</cite></figcaption></figure>
				<figure class="${"svelte-19bt0mo"}"><blockquote class="${"svelte-19bt0mo"}">\u201CHarlan es muy profesional, agradable, eficiente, y
						transparente sobre el proceso y los costos. Adem\xE1s, es
						accesible y sensible a las necesidades y preguntas de
						los clientes. Lo recomendar\xEDa sin dudarlo.\u201D
					</blockquote>
					<figcaption class="${"svelte-19bt0mo"}"><cite class="${"svelte-19bt0mo"}">Anthony, Cliente</cite></figcaption></figure>
				<figure class="${"svelte-19bt0mo"}"><blockquote class="${"svelte-19bt0mo"}">\u201CEl Sr. York y su personal se comportaron de una manera
						ejemplar. Nunca tuvimos que esperar para obtener
						informaci\xF3n o una petici\xF3n especial. Nuestras preguntas
						o preocupaciones siempre fueron abordados. El caso fue
						llevado a la terminaci\xF3n en menos tiempo de lo
						esperado.\u201D
					</blockquote>
					<figcaption class="${"svelte-19bt0mo"}"><cite class="${"svelte-19bt0mo"}">Ricardo, Cliente</cite></figcaption></figure>
				<figure class="${"svelte-19bt0mo"}"><blockquote class="${"svelte-19bt0mo"}">\u201CMe hab\xEDan dado el nombre del Sr. York por uno de mis
						colegas en la universidad, pero yo era esc\xE9ptico hasta
						que me di cuenta de la eficiencia con que el maneja todo
						el papeleo. Recib\xED mi ciudadan\xEDa en Estados Unidos sin
						ning\xFAn problema, y \u200B\u200Bapenas la semana pasada, 12 a\xF1os
						despu\xE9s, Harlan me proporcion\xF3 una nota legal que
						requer\xEDa sin ninguna duda de la misma manera r\xE1pida y
						directa que me hab\xEDa impresionado cuando lo conoc\xED.\u201D
					</blockquote>
					<figcaption class="${"svelte-19bt0mo"}"><cite class="${"svelte-19bt0mo"}">Karl, Cliente</cite></figcaption></figure></div>
			<div class="${"video svelte-19bt0mo"}">${validate_component(FeaturedVideo, "FeaturedVideo").$$render($$result, {
      id: "espanol-featured-video-03",
      blockstyle: "",
      video_source: "//www.youtube.com/embed/uX4lKIUCTJc",
      video_jpg: "/img/espanol-video-03.jpg",
      video_webp: "/img/espanol-video-03.webp",
      video_avif: "/img/espanol-video-03.avif"
    }, {}, {})}
				<p class="${"svelte-19bt0mo"}">Artasanchez habla de c\xF3mo Harlan York le ayud\xF3 a aclarar su
					situaci\xF3n migratoria y asegurar su residencia permanente y
					ciudadan\xEDa estadounidense.
				</p></div></div></div>
	${validate_component(Block_CallToAction, "Block_CallToAction").$$render($$result, {
      id: "call-to-action",
      blockstyle: "block-style01",
      extraclasses: "regular-calltoaction"
    }, {}, {})}
	${validate_component(Block_LanguagesWeSpeak, "Block_LanguagesWeSpeak").$$render($$result, {}, {}, {})}
	${validate_component(Block_Languages, "Block_Languages").$$render($$result, {
      id: "languages",
      blockstyle: "block-style04"
    }, {}, {})}
	${validate_component(Block_Featured, "Block_Featured").$$render($$result, {id: "featured", blockstyle: ""}, {}, {})}
	${validate_component(Block_Ratings, "Block_Ratings").$$render($$result, {id: "ratings", blockstyle: ""}, {}, {})}
	${validate_component(SocialMedia, "SocialMedia").$$render($$result, {id: "socialmedia", blockstyle: ""}, {}, {})}`
  })}`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: Espanol
});
const Layout_MDDefault = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Layout_Main, "Layout_Main").$$render($$result, {}, {}, {
    default: () => `${slots.default ? slots.default({}) : ``}`
  })}`;
});
var metadata = {layout: "default"};
const Test_svelte = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Layout_MDDefault, "Layout_MDSVEX_DEFAULT").$$render($$result, Object.assign(metadata), {}, {
    default: () => `<h1 id="${"this-is-a-test"}"><a href="${"#this-is-a-test"}">This is a Test</a></h1>
<pre class="${"language-js"}">${`<code class="language-js"><span class="token keyword">let</span> j <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></code>`}</pre>
<pre class="${"language-css"}">${`<code class="language-css"><span class="token selector">body</span> <span class="token punctuation">&#123;</span> <span class="token property">color</span><span class="token punctuation">:</span> red<span class="token punctuation">;</span> <span class="token punctuation">&#125;</span></code>`}</pre>
<p><img src="${"/img/profile_1200x1200.jpg"}" alt="${"A super cool pic or somthing."}"></p>`
  })}`;
});
var test_svelte = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: Test_svelte,
  metadata
});
const $layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Layout_Milk, "Layout_Milk").$$render($$result, {}, {}, {
    default: () => `${slots.default ? slots.default({}) : ``}`
  })}`;
});
var $layout$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  default: $layout
});
export {init, render};
