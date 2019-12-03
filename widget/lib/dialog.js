!(function (global) {
    // 构造函数
    function $dialog(params) {
        this.$delayedtime = 3000 // 默认值：延时时长
        this.$close = function () { } // 关闭回调

        // 初始化
        this.init(params)
    }

    // 初始化操作
    $dialog.prototype.init = function (params) {
        this.close()
        this.mask()
        this.container()
        // this.delayed(true)
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                this[key](params[key])
            }
        }

        // 执行延时关闭
        var that = this
        if (this.$delayed !== false) {
            setTimeout(function () {
                that.close()
            }, this.$delayedtime)
        }
    }

    // 设置延时开关
    $dialog.prototype.delayed = function (bool) {
        this.$delayed = bool
    }

    // 设置延时时长 一旦设置，默认开启延时
    $dialog.prototype.delayedtime = function (time) {
        this.$delayed = true
        this.$delayedtime = time
    }

    // 设置关闭回调
    $dialog.prototype.setclose = function (actions) {
        this.$close = actions
    }

    // 关闭
    $dialog.prototype.close = function () {
        if (document.querySelectorAll('#dialog').length != 0) {
            document.getElementById('mask').remove()
            document.getElementById('dialog').remove()
            this.$close()
        }
    }

    // 阴影
    $dialog.prototype.mask = function () {
        var el = document.createElement('div')
        el.id = 'mask'
        el.addEventListener('click', this.close.bind(this))
        document.body.appendChild(el)
    }

    // 构建容器
    $dialog.prototype.container = function () {
        var el = document.createElement('div')
        el.id = 'dialog'
        document.body.appendChild(el)
    }

    // 标题
    $dialog.prototype.title = function (text) {
        var el = document.createElement('div')
        el.classList.add('dialog-title')
        el.innerText = text
        document.getElementById('dialog').appendChild(el)
    }

    // 消息
    $dialog.prototype.message = function (text) {
        var el = document.createElement('div')
        el.classList.add('dialog-message')
        el.innerText = text
        document.getElementById('dialog').appendChild(el)
    }

    // 初始化按钮
    $dialog.prototype.initButton = function () {
        if (this.$delayed !== true) {
            this.delayed(false)
        }
        if (document.querySelectorAll('#dialog>.dialog-button').length == 0) {
            var el = document.createElement('div')
            el.classList.add('dialog-button')
            document.getElementById('dialog').appendChild(el)
        }
    }

    // 成功按钮
    $dialog.prototype.success = function (param) {
        var text = '确定'
        var action = function () { }

        this.initButton()
        if (typeof param === 'object') {
            text = param.hasOwnProperty('title') ? param.title : '确定'
            action = param.hasOwnProperty('action') ? param.action : function () { }
        }
        if (typeof param === 'function') {
            action = param
        }

        var that = this
        var el = document.createElement('input')
        el.type = 'button'
        el.value = text
        el.classList.add('dialog-success')
        el.addEventListener('click', function () {
            action()
            that.close()
        })
        document.querySelector('#dialog>.dialog-button').appendChild(el)
    }

    // 失败按钮
    $dialog.prototype.fail = function (param) {
        var text = '取消'
        var action = function () { }

        this.initButton()
        if (typeof param === 'object') {
            text = param.hasOwnProperty('title') ? param.title : '取消'
            action = param.hasOwnProperty('action') ? param.action : function () { }
        }
        if (typeof param === 'function') {
            action = param
        }

        var that = this
        var el = document.createElement('input')
        el.type = 'button'
        el.value = text
        el.classList.add('dialog-error')
        el.addEventListener('click', function () {
            action()
            that.close()
        })
        document.querySelector('#dialog>.dialog-button').appendChild(el)
    }

    // 挂载全局
    global.$dialog = $dialog
})(this)