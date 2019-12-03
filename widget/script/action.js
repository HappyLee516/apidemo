// var globalBaseUrl = "http://test802.ittun.com"
var globalBaseUrl = "http://huiyiapp.qupinmall.com"

// 异步请求封装
function ajax(options, success, error) {
    success = success ? success : function () { }
    error = error ? error : function () { }

    var defaultOptions = {
        baseUrl: globalBaseUrl,
        method: 'get',
        url: '',
        headers: {
            token: $api.getStorage('token')
        },
        showError: true,
        showLoading: true,
    }
    options = $.extend(defaultOptions, options)

    if (options.showLoading) {
        api.showProgress({
            title: '加载中...',
            text: '请稍候...',
            modal: false
        })
    }

    // for (var i in options.data) {
    //     if (isArray(options.data[i])) {
    //         var arr = options.data[i]
    //         delete options.data[i]
    //         arr.forEach(function (item, index) {
    //             options.data[i+'['+index+']'] = item
    //         })
    //     }
    // }

    api.ajax({
        method: options.method,
        url: options.baseUrl + options.url,
        dataType: 'json',
        headers: $.extend(defaultOptions.headers, options.headers),
        data: {
            values: options.data,
        },
    }, function (ret, err) {
        if (ret) {
            if (options.showLoading) {
                api.hideProgress()
            }

            if (ret.status === 0) {
                if (options.showError) {
                    toast(ret.msg)
                }
                if (options.notGlobal) {
                    api.toast({
                        msg: ret.msg,
                        duration: 2000,
                        location: 'middle',
                    })
                }
            }
            success(ret)
        } else {
            if (options.showLoading) {
                api.hideProgress()
            }

            switch (err.statusCode) {
                case 0:
                    toast('网络错误,请检查网络')
                    break
                case 404:
                    toast('404')
                    break
                case 500:
                    toast('系统错误')
                    break
                case 502:
                    toast('网络错误,请重试')
                    break
            }

            error(ret)
            console.log(options.url + JSON.stringify(err))
        }
    })
}

// 消息提醒
function toast(msg) {
    api.toast({
        msg: msg,
        duration: 2000,
        location: 'middle',
        global: true,
    })
}

// 显示弹窗
function showDialog(params) {
    params.setclose = function() {
        api.closeFrame({
            name: 'dialog'
        })
    }
    api.openFrame({
        name: 'dialog',
        url: 'widget://html/component/dialog.html',
        rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
        },
        pageParam: {
            param: stringify(params)
        }
    });
}

// 序列化
function stringify(json) {
    return JSON.stringify(json, function (key, val) {
        if (typeof val === 'function') {
            return val + '';
        }
        return val;
    });
}

// 解序列
function parse(json) {
    return JSON.parse(json, function (k, v) {
        if (v.indexOf && v.indexOf('function') > -1) {
            return eval("(function(){return " + v + " })()")
        }
        return v;
    });
}

//时间戳转换函数，可以设置格式。
function formatTime(date, format) {
    format = format ? format : 'y年m月d日'
    date = new Date(date * 1000)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    var arr = [year, month, day, hour, minute, second].map(function (item) {
        item = item.toString()
        return item[1] ? item : '0' + item
    })
    return format = format.replace(/[yY]/, arr[0]).replace(/[mM]/, arr[1]).replace(/[dD]/, arr[2]).replace(/[hH]/, arr[3]).replace(/[iI]/, arr[4]).replace(/[sS]/, arr[5])
}

// JS 时间戳转星期几
function getWeek(date) {
    var week;
    date = new Date(date * 1000)
    if(date.getDay() == 0) week = "星期日"
    if(date.getDay() == 1) week = "星期一"
    if(date.getDay() == 2) week = "星期二"
    if(date.getDay() == 3) week = "星期三"
    if(date.getDay() == 4) week = "星期四"
    if(date.getDay() == 5) week = "星期五"
    if(date.getDay() == 6) week = "星期六"
    return week;
}

// JS 时间戳判断时间几天前
function getDateTimeBefor(publishtime) {
    var currTime = Date.parse(new Date());;
    var l = parseInt(currTime) - parseInt(publishtime);
    // 少于一分钟
    var time = l / 1000;
    if (time < 60) {
        return "刚刚";
    }

    // 秒转分钟
    var minuies = time / 60;
    if (minuies < 60) {
        return Math.floor(minuies) + "分钟前";
    }

    // 秒转小时
    var hours = time / 3600;
    if (hours < 24) {
        return Math.floor(hours) + "小时前";
    }
    //秒转天数
    var days = time / 3600 / 24;
    if (days < 30) {
        return Math.floor(days) + "天前";
    }
    //秒转月
    var months = time / 3600 / 24 / 30;
    if (months < 12) {
        return Math.floor(months) + "月前";
    }
    //秒转年
    var years = time / 3600 / 24 / 30 / 12;
    return Math.floor(years) + "年前";

}

// 判断文件是否存在
function isExist(path) {
    var fs = api.require('fs');
    fs.exist({
        path: 'fs://file.txt'
    }, function (ret, err) {
        if (ret.exist) {
            if (ret.directory) {
                alert('文件夹');
            } else {
                alert('文件');
            }
        } else {
            alert(JSON.stringify(err));
        }
    });
}

// 下载文件 （本地存储位置用默认地址cache,方便api.clearCache清除缓存）
function download(url, callback) {
    api.download({
        url: url,
        report: true,
        cache: true,
        allowResume: true
    }, function (ret, err) {
        if (ret.state == 1) {
            // console.log('缓存本地地址： ' + ret.savePath);
            callback(ret)
        }
    });
}

// 下载多个文件
function downloadMoreThanOne(arr) {
    var promiseList = []
    arr.forEach(function(item) {
        promiseList.push(new Promise((resolve, reject) => {
            api.download({
                url: item,
                report: true,
                cache: true,
                allowResume: true
            }, function (ret) {
                if (ret.state == 1) {
                    resolve(ret.savePath)
                }
                if (ret.state == 2) {
                    reject(ret)
                }
            });
        }))
    });
    return Promise.all(promiseList)
}

// 关闭当前window
function closeWin() {
    api.closeWin();
}

// +----------------------------------------------------------------------
// | 测试方法 慎用
// +----------------------------------------------------------------------

// 删表大法
function rm_rf() {
    console.warn('清除数据库中..');
    db.deleteMeetsTable()
    db.deleteIssueTable()
    db.deleteFilesTable()
}