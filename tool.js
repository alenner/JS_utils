/*
 * @Author: dongjia
 * @Date: 2022-07-24 22:28:21
 * @LastEditTime: 2022-07-24 22:28:21
 * @LastEditors: aleaner
 * @Description: 
 * @FilePath: \JS_utils\tool.js
 * 怎么可能会有bug！！！
 */
/**
 * @description: 设置站点favicon
 * @param {string} src 图片链接
 */
export function setFavicon(src) {
  let linkEle =
    document.querySelector("link[rel*='icon']") ||
    document.createElement("link");
  linkEle.rel = "shortcut icon";
  linkEle.href = src;
  document.getElementsByTagName("head")[0].appendChild(linkEle);
}

/**
 * @description: 设置页面标题
 * @param {string} title 标题文字
 */
export function setTitle(title) {
  document.title = title;
}

/**
 * 生成uuid
 * @param {number} len 指定生成位数，默认32位
 * @param {string} radix 指定基数
 */
export function uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [],
    i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}


/**
 * 随机字符
 * @param {number} len 指定生成多少位
 */
export function randomString(len = 32) {
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  const maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}


/**
 * 复制文字
 * @param {element,string} ele 原生dom对象或者文本string
 */
export function copyText(ele) {
  return new Promise((resolve, reject) => {
    try {
      if (typeof ele === "string") {
        let input = document.createElement("input");
        input.setAttribute("readonly", "readonly");
        input.value = ele;
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, input.value.length)
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        input.remove();
        resolve(true);
      } else {
        window.getSelection().selectAllChildren(ele);
        document.execCommand("Copy");
        window.getSelection().removeAllRanges();
        resolve(true);
      }
    } catch (err) {
      console.log("复制发生错误", err);
      reject(err);
    }
  })
}




/**
 * @description: 获取文件后缀
 * @param {*} filename 文件名或src地址
 * @Date: 2021-09-07 10:09:16
 * @Author: mulingyuer
 */
export function getFileType(filename) {
  if (typeof filename === "string") {
    if (filename === "") return filename;
    return filename.split(".").pop().toLowerCase();
  } else {
    throw new Error("获取文件后缀的参数必须为字符串");
  }
}


/**
 * @description: 在线图片转本地
 * @param {string} url 在线链接
 * @return {base64}
 */
export function getDataUrl(url) {
  // function createObjectURL(object) {
  //   return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
  // }
  return new Promise((resolve, reject) => {

    // var xhr = new XMLHttpRequest();
    // xhr.open('get', url, true);
    // xhr.responseType = 'blob';
    // xhr.onload = function() {
    //   if(this.status === 200) {
    //     var img = new Image();
    //     img.onload = function() {}
    //     img.setAttribute("crossOrigin", "Anonymous"); //跨域
    //     img.src = URL.createObjectURL(this.response);
    //   }
    // };
    //
    // xhr.send();

    // const xhr = new XMLHttpRequest();
    // let canvas = document.createElement("canvas");
    // // canvas.width = this.naturalWidth;
    // // canvas.height = this.naturalHeight;
    // const canvasContext = canvas.getContext('2d')
    // xhr.onload = function () {
    //   const url = createObjectURL(this.response);
    //   const img = new Image()
    //   img.onload = function () {
    //     canvasContext.drawImage(img,0,0,400,600)
    //     canvasContext.getImageData(0,0,100,100)
    //     // 图片用完后记得释放内存
    //     URL.revokeObjectURL(url)
    //     // resolve(url);
    //   }
    //   img.src = url
    // }
    // xhr.open('GET', 'https://s.vipkidstatic.com/fe-static/mobile/learning-effect/prd/src/page/prd/img/common/bg@2x-2e6bf90fab2d77144cec052e5aa1766e.png', true)
    // xhr.responseType = 'blob'
    // xhr.send()

    /* eslint-disable */
    let image = new Image();
    image.setAttribute("crossOrigin", "Anonymous"); //跨域
    image.src = url;
    image.onload = function () {
      let canvas = document.createElement("canvas");
      canvas.width = this.naturalWidth;
      canvas.height = this.naturalHeight;
      canvas.getContext("2d").drawImage(this, 0, 0);
      // Data URI
      resolve(canvas.toDataURL("image/jpeg"));
    };
    // console.log(image.src);
    image.onerror = () => {
      reject(new Error("图片流异常"));
    };
  });
}



/**
 * @description: 时间戳转指定文本格式
 * @param {Date} time 时间戳
 * @param {String} formatStr 返回的文本格式 YYYY-MM-DD H:m:s
 */
export function formatDate(time, formatStr) {
  let date = new Date(time);
  let Y = date.getFullYear();
  let M =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  formatStr = formatStr || "YYYY-MM-DD H:m:s";
  return formatStr.replace(/YYYY|MM|DD|H|m|s/gi, function (matches) {
    return {
      YYYY: Y,
      MM: M,
      DD: D,
      H: h,
      m: m,
      s: s,
    }[matches];
  });
};

/**
 * @description:  base64转文件
 * @param {base64} data
 * @return {Blob} 返回Blob对象
 */
export function baseTransformFile(data) {
  let f = atob(data);
  let buf = new ArrayBuffer(f.length);
  let view = new Uint8Array(buf);
  for (let i = 0; i !== f.length; ++i) view[i] = f.charCodeAt(i) & 0xff;
  return new Blob([buf]);
}


/**
 * @description: a元素下载文件
 * @param {Blob} blob
 * @param {String} fileName 文件名带格式的
 */
export function aElementDownload(blob, fileName) {
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob); // response is a blob
  a.download = fileName || "未命名文件"; //文件名称
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(a.href); // 释放URL 对象
  a.remove();
}

/**
 * @description: a元素下载文件
 * @param {url} url
 * @param {String} fileName 文件名带格式的
 */
export function aElementUrlDownload(url, fileName) {
  let a = document.createElement("a");
  a.href = url; // response is a blob
  a.download = fileName || "未命名文件"; //文件名称
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
}


/**
 * @description: 生成随机密码至少包含一个大写字母，小写字母，数字，特殊符号
 * @param {Number} length 生成多少位
 * @return {String} 返回的随机密码
 */
export function randomPassword(length) {
  length = Number(length)
  // Limit length
  if (length < 6) {
    length = 6
  } else if (length > 16) {
    length = 16
  }
  let passwordArray = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890', '!@-_=<>#*%+&^$'];
  var password = [];
  let n = 0;
  for (let i = 0; i < length; i++) {
    // If password length less than 9, all value random
    if (password.length < (length - 4)) {
      // Get random passwordArray index
      let arrayRandom = Math.floor(Math.random() * 4);
      // Get password array value
      let passwordItem = passwordArray[arrayRandom];
      // Get password array value random index
      // Get random real value
      let item = passwordItem[Math.floor(Math.random() * passwordItem.length)];
      password.push(item);
    } else {
      // If password large then 9, lastest 4 password will push in according to the random password index
      // Get the array values sequentially
      let newItem = passwordArray[n];
      let lastItem = newItem[Math.floor(Math.random() * newItem.length)];
      // Get array splice index
      let spliceIndex = Math.floor(Math.random() * password.length);
      password.splice(spliceIndex, 0, lastItem);
      n++
    }
  }
  return password.join("");
}

/**
 * @description: 对需要传输的引用数据类型进行JSON格式转化和对JSON编码
 * @param {Object} data 传输的引用数据类型对象
 * @return {String} 返回对data的Url编码处理
 */
export function enCode(data) {
  let value = data;
  if (typeof data === 'object') {
    value = JSON.stringify(data);
  }
  return encodeURIComponent(value);
}

/**
 * @description: 对需要传输的引用数据类型进行JSON格式转化和对JSON编码
 * @param {String} data Url编码字符串
 * @return {Object} 返回对data的解码处理
 */
export function deCode(data) {
  let value = data;
  if (typeof data === "string") {
    value = decodeURIComponent(data);
    try {
      value = JSON.parse(value);
    } catch (err) {
      //跳过
      console.log('获取失败' + err)
    }
  }
  return value;
}

/**
 * 获取时间戳（秒）
 * @returns {number}
 */
export function timestamp() {
  let crr = new Date();
  return Math.floor(crr.getTime() / 1000);
}


/**
 * @description: 判断数据类型
 * @param {*} value
 * @return {*}
 * @Date: 2021-03-31 16:08:04
 * @Author: mulingyuer
 */
export function getType(value) {
  let type = typeof value;
  if (type !== "object") {
    return type;
  }
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
};


/**
 * @description: 是否为一个对象
 * @param {*} obj
 * @Date: 2021-10-05 18:41:05
 * @Author: mulingyuer
 */
export function isObject(obj) {
  return getType(obj) === "object";
};


/**
 * @description: 是否为一个函数
 * @param {*} fn
 * @Date: 2021-10-05 18:42:49
 * @Author: mulingyuer
 */
export function isFunction(fn) {
  return getType(fn) === "function";
};


/**
 * @description: 是否为字符串
 * @param {*} str
 * @Date: 2021-10-05 20:17:48
 * @Author: mulingyuer
 */
export function isString(str) {
  return getType(str) === "string";
}


/**
 * @description: 是否为数组
 * @param {*} arr
 * @Date: 2021-10-20 15:48:01
 * @Author: mulingyuer
 */
export function isArray(arr) {
  return getType(arr) === "array";
}

/**
 * @description: 是否为布尔值
 * @param {*} boolean
 * @Date: 2021-10-20 15:49:05
 * @Author: mulingyuer
 */
export function isBoolean(boolean) {
  return getType(boolean) === "boolean";
}


/**
 * @description: 是否是一个promise对象
 * @param {*} obj
 * @Date: 2021-10-05 18:41:33
 * @Author: mulingyuer
 */
export function isPromise(obj) {
  if (obj instanceof Promise) {
    return true;
  } else if (isObject(obj) && isFunction(obj.then) && isFunction(obj.catch)) {
    return true;
  } else {
    return false;
  }
};


/**
 * @description: 是否为空字符
 * @param {*} string
 * @Date: 2021-10-22 10:00:13
 * @Author: mulingyuer
 */
export function isEmptyString(string) {
  return isString(string) && string.trim() === '';
}


/**
 * @description: 判断是否为json 不是很准
 * @param {*} str
 * @Date: 2021-05-17 10:33:29
 * @Author: mulingyuer
 */
export function isJSON(str) {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str);
      if (typeof obj === 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  } else {
    return false
  }
};



/**
 * @description: 自定义去除首尾指定字符，默认去空格
 * @param {*} string 字符
 * @param {*} character 指定要去除的字符
 * @param {*} type 方向
 * @Date: 2021-05-21 18:23:42
 * @Author: mulingyuer
 */
export const trim = function (string, character = " ", type = "all") {
  if (typeof string === "string" && typeof character === "string" && character.length >= 1) {
    switch (type) {
      case "all":
        return string.replace(new RegExp(`^${character}+|${character}+$`, "g"), "");
        break;
      case "left":
        return string.replace(new RegExp(`^${character}+`, "g"), "");
        break;
      case "right":
        return string.replace(new RegExp(`${character}+$`, "g"), "");
        break;
      default:
        throw new Error("不存在的方向，指定方向仅left或者right或者不填（all）");
    }
  } else {
    return string;
  }
};




/**
 * @description: 安全沙箱-string代码转js代码
 * @param {*} value string
 * @Date: 2021-06-10 11:52:41
 * @Author: mulingyuer
 */
export const sandBox = function (value) {
  const withStr = `with(obj) { return ${value} }`;
  //创建监听对象
  const proxy = new Proxy(Object.create(null), {
    has(target, key) {
      if (['console', 'Math', 'Date'].includes(key)) {
        return target[key];
      }
      return true;
    },
    get(target, key) {
      if (key === Symbol.unscopables) return undefined;
      return target[key]
    }
  });
  return new Function('obj', withStr)(proxy); //将监听的对象作为obj参数传入
};


/**
 * @description: json的字符解析方法
 * @param {*} value string
 * @Date: 2021-06-10 14:22:58
 * @Author: mulingyuer
 */
export const sandParse = function (key, val) {
  if (/^function\s*\(.*\)\s*{/.test(val) || /^\(.*\)\s*=>/.test(val) || /^.*\s*\(.*\)\s*{/.test(val)) {
    return sandBox(val);
  }
  return val;
}


/**
 * @description: json的格式化方法
 * @param {*} value *
 * @Date: 2021-06-10 14:25:11
 * @Author: mulingyuer
 */
export const sandStringify = function (key, val) {
  if (typeof val === 'function') {
    return val.toString();
  }
  return val;
}



/**
 * @description:  自定义json格式化
 * @param {*} obj
 * @Date: 2021-06-10 17:28:19
 * @Author: mulingyuer
 */
export const jsonStringify = function (obj, isBeautify = false) {
  return new Promise((resolve, reject) => {
    try {
      let objString = "";
      if (isBeautify) {
        objString = JSON.stringify(obj, sandStringify, 2);
      } else {
        objString = JSON.stringify(obj, sandStringify);
      }
      return resolve(objString);
    } catch (error) {
      return reject(error);
    }
  })
};

/**
 * @description: 自定义json解析
 * @param {*} string
 * @Date: 2021-06-10 17:30:09
 * @Author: mulingyuer
 */
export const jsonParse = function (str) {
  return new Promise((resolve, reject) => {
    try {
      if (isJSON(str)) {
        const obj = JSON.parse(str, sandParse);
        return resolve(obj);
      } else {
        return str;
      }
    } catch (error) {
      return reject(error);
    }
  })
};


/**
 * @description: json美化
 * @param {*} value
 * @Date: 2021-06-11 15:25:12
 * @Author: mulingyuer
 */
export const jsonBeautify = function (value) {
  return new Promise((resolve, reject) => {
    try {
      if (!isJSON(value)) {
        return reject(new Error("值不是json，无法格式化"));
      }
      const bVal = JSON.stringify(JSON.parse(value, sandParse), sandStringify, 2);
      return resolve(bVal);
    } catch (error) {
      return reject(error);
    }
  })
};


/**
 * @description: 随机密码
 * @param {*} len 密码位数
 * @param {*} mode 密码难度：hide(大小写数字特殊字符)、medium(大小写数字)、low(小写数字)
 * @Date: 2021-07-02 15:52:32
 * @Author: mulingyuer
 */
export const randomPass = function (len = 16, mode = "high") {
  const lowerCaseArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',];
  const blockLetterArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const numberArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const specialArr = ['!', '@', '-', '_', '=', '#', '*', '%', '+', '&', '^', '$'];
  const passArr = [];
  let password = '';

  //指定参数随机获取一个字符
  const specifyRandom = function (...arr) {
    let str = "";
    arr.forEach(item => {
      str += item[Math.floor(Math.random() * item.length)]
    });
    return str;
  }

  switch (mode) {
    case "high":
      //安全最高的
      password += specifyRandom(lowerCaseArr, blockLetterArr, numberArr, specialArr);
      passArr.push(...lowerCaseArr, ...blockLetterArr, ...numberArr, ...specialArr);
      break;
    case "medium":
      //中等的
      password += specifyRandom(lowerCaseArr, blockLetterArr, numberArr);
      passArr.push(...lowerCaseArr, ...blockLetterArr, ...numberArr);
      break;
    //低等的
    case "low":
      password += specifyRandom(lowerCaseArr, numberArr);
      passArr.push(...lowerCaseArr, ...numberArr);
      break;
    default:
      password += specifyRandom(lowerCaseArr, numberArr);
      passArr.push(...lowerCaseArr, ...numberArr);
  }

  const forLen = len - password.length;
  for (let i = 0; i < forLen; i++) {
    password += specifyRandom(passArr);
  }

  return password;
}


/**
 * @description: 等比缩略图方法 url地址，{w:200,h:200}可不传，默认高优先，且默认值h为200
 * @param {*} url 图片地址
 * @param {*} w 宽
 * @param {*} h 高
 * @Date: 2021-08-06 11:42:57
 * @Author: mulingyuer
 */
export const fixImageUrl = function (url, { w, h } = {}) {
  if (!url) return url;

  const lastDotIndex = url.lastIndexOf('.')
  if (lastDotIndex === -1) return url

  const imageTypes = ['jpg', 'jpeg', 'png']
  const imageType = url.slice(lastDotIndex + 1).toLowerCase()
  if (!imageTypes.includes(imageType)) return url;

  const cosReg = /(http|https):\/\/.*\/cos\//; //腾讯云
  if (!url.includes) return url;
  const joiner = url.includes("?") ? "&" : "?";
  if (h && h > 0 && w && w > 0) {
    return cosReg.test(url) ?
      `${url}${joiner}imageMogr2/thumbnail/x${h}` :
      `${url}${joiner}fit=max&h=${h}`
  } else {
    if (h && h > 0) {
      return cosReg.test(url) ?
        `${url}${joiner}imageMogr2/thumbnail/x${h}` :
        `${url}${joiner}fit=max&h=${h}&r=${randomString()}`
    } else if (w && w > 0) {
      return cosReg.test(url) ?
        `${url}${joiner}imageMogr2/thumbnail/${w}x` :
        `${url}${joiner}fit=max&w=${w}&r=${randomString()}`;
    } else {
      return cosReg.test(url) ?
        `${url}${joiner}imageMogr2/thumbnail/x200` :
        `${url}${joiner}fit=max&h=200&r=${randomString()}`;
    }
  }
  return url;
}


/**
 * @description:  对象扁平化
 * @param {*} data {}
 * @Date: 2021-08-11 10:53:11
 * @Author: mulingyuer
 */
export function objectFlat(data = {}) {
  let newObj = {};

  let process = (key, value) => {
    if (Object(value) !== value) {
      //普通类型、null、undefind
      newObj[key] = value;
    } else {
      //引用类型
      if (Array.isArray(value)) {
        value.forEach((childVal, childIndex) => {
          process(`${key}[${childIndex}]`, childVal);
        });

        //空数组赋值空数组
        if (value.length === 0) newObj[key] = [];
      } else {
        const keyArr = Object.keys(value);
        keyArr.forEach((childKey) => {
          process(`${key}.${childKey}`, value[childKey]);
        });

        //为空赋值空对象
        if (keyArr.length === 0) newObj[key] = {};
      }
    }
  };

  Object.keys(data).forEach((key) => process(key, data[key]));
  return newObj;
}



/**
 * @description: 过滤对象中指定的属性,也可以拿来浅拷贝
 * @param {object、array} obj 过滤的对象
 * @param {array} keys 过滤的key值
 * @Date: 2021-09-09 10:14:09
 * @Author: mulingyuer
 */
export function objectFilter(obj, ...keys) {
  if (typeof obj !== 'object') return obj;   //只有对象才能json化

  try {
    const jsonData = JSON.stringify(obj, (key, val) => {
      if (keys.includes(key)) return void 0;
      return val;
    });

    return JSON.parse(jsonData);
  } catch (error) {
    console.error(error);
    return obj;
  }

}

/**
 * 适配饿了么日期时间组件v-model传值的
 * @param timestamp
 * @returns {number|*}
 */
export function toElementTimestamp(timestamp) {
  if (timestamp === '' || timestamp === undefined || timestamp === null || timestamp === -1) {
    return ''
  } else if (timestamp.toString().length <= 10) {
    return timestamp * 1000
  }
  return timestamp
}

/**
 * 转换成10位的时间戳
 * @param timestamp
 * @returns {*}
 */
export function toShortTimestamp(timestamp) {
  console.log(timestamp)
  if (timestamp === '' || timestamp === undefined || timestamp === null) {
    // TODO: 该返回-1还是0呢，不确定
    return 0
  } else if (timestamp.toString().length > 10) {
    return timestamp / 1000
  }
  return timestamp
}
