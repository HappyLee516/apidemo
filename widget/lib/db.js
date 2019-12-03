function $db() {
    this.db = api.require('db')
    this.dbName = 'meet'
    this.filesTable = 'hy_files'
    this.createFilesTable() 
    this.createMeetsTable() 
    this.createIssueTable() 
}

// 开启
$db.prototype.open = function (callback) {
    if (!callback) {
        callback = function(){}
    }

    this.db.openDatabase({
        name: this.dbName
    }, function (ret, err) {
        if (ret.status) {
            callback()
        } else {
            console.warn('数据库打开失败，错误码：' + JSON.stringify(err.code));
        }
    })
}

// 关闭
$db.prototype.close = function (callback) {
    if (!callback) {
        callback = function(){}
    }
    
    this.db.closeDatabase({
        name: this.dbName
    }, function (ret, err) {
        if (ret.status) {
            callback()
        } else {
            // console.warn('数据库关闭失败，错误码：' + JSON.stringify(err.code) + '错误描述：' + JSON.stringify(err.msg));
        }
    })
}

// 插入
$db.prototype.execute = function (sql, callback) {
    if (!callback) {
        callback = function(){}
    }

    this.db.executeSql({
        name: this.dbName,
        sql: sql
    }, function (ret, err) {
        if (ret.status) {
            callback()
        } else {
            console.warn('数据库插入失败，错误码：' + JSON.stringify(err));
        }
    });
}

// 查询
$db.prototype.select = function (sql, callback) {
    if (!callback) {
        callback = function(){}
    }

    this.db.selectSql({
        name: this.dbName,
        sql: sql
    }, function (ret, err) {
        if (ret.status) {
            callback(ret.data)
        } else {
            console.warn('数据库查询失败，错误码：' + JSON.stringify(ret));
        }
    });
}

// 事务
$db.prototype.tran = function (sql, callback) {
    if (!callback) {
        callback = function(){}
    }

    this.db.transaction({
        name: this.dbName,
        operation: sql // begin 开始事务, commit 提交事务, rollback 回滚操作
    }, function (ret, err) {
        if (ret.status) {
            callback()
        } else {
            console.warn('事务操作失败，错误码：' + JSON.stringify(err.code));
        }
    });
}

// +----------------------------------------------------------------------
// | 会议
// +----------------------------------------------------------------------

// 插入会议
$db.prototype.insertMeet = function(info, callback=()=>{}) {
    if (!info) {
        console.warn('无任何数据插入');
        return
    }
    info.createtime = Date.parse(new Date())/1000
    var that = this
    this.open(function() {
        that.execute(`
            INSERT INTO meets
            (id, title, second_title, address, metting_time, main_people, join_people, outline)
            VALUES
            ('${info.id}', '${info.title}', '${info.second_title}', '${info.address}', '${info.metting_time}', '${info.main_people}', '${info.join_people}', '${info.outline}')
        `, function() {
            // that.close()
            callback()
        })
    })
}

// 删除相关会议
$db.prototype.delMeet = function(id) {
    return new Promise((resolve) => {
        var sql = "DELETE FROM meets WHERE id = "+id
        var that = this
        this.open(function() {
            that.execute(sql, function(res) {
                // that.close()
                resolve(res)
            })
        })
    });
}

// 查询会议
$db.prototype.queryMeet = function(id) {
    return new Promise(resolve => {
        var sql = "SELECT * FROM meets WHERE id = "+id
        var that = this
        this.open(function() {
            that.select(sql, function(res) {
                resolve(res)
            })
        })
    });
}

// 创建会议表
$db.prototype.createMeetsTable = function() {
    var that = this
    this.open(function(params) {
        that.execute(
            `CREATE TABLE IF NOT EXISTS meets(
                meetid INTEGER PRIMARY KEY NOT NULL,
                id INT(12) NOT NULL,
                title VARCHAR(255) DEFAULT '',
                second_title VARCHAR(255) DEFAULT '',
                address TEXT DEFAULT '',
                metting_time INT(12) DEFAULT 0,
                main_people VARCHAR(255) DEFAULT '',
                join_people VARCHAR(255) DEFAULT '',
                outline TEXT DEFAULT '',
                do_name VARCHAR(50) DEFAULT '',
                do_desc TEXT DEFAULT '',
                do_time INT(12)
            )`,function() {
                // that.close()
            }
        )
    })
}

// 删除会议表
$db.prototype.deleteMeetsTable = function() {
    var that = this
    this.open(function() {
        that.execute("DROP TABLE IF EXISTS meets",function() {
            console.warn('会议表删除成功');
        })
    })
}

// +----------------------------------------------------------------------
// | 议题
// +----------------------------------------------------------------------

// 插入议题
$db.prototype.insertIssue = function(info, callback=()=>{}) {
    if (!info) {
        console.warn('无任何数据插入');
        return
    }
    info.createtime = Date.parse(new Date())/1000
    var that = this
    this.open(function() {
        that.execute(`
            INSERT INTO issue
            (id, mid, issue_title, content, file, filename, url, people)
            VALUES
            ('${info.id}', '${info.mid}', '${info.issue_title}', '${info.content}', '${info.file}', '${info.filename}', '${info.url}', '${info.people}')
        `, function() {
            callback()
        })
    })
}

// 修改议题文件
$db.prototype.modifyIssue = function(id, file, filename, callback=()=>{}) {
    var that = this
    this.open(function() {
        that.execute(`
            UPDATE issue SET file = '${file}' filename = '${filename}' WHERE id = ${id};
        `, function() {
            callback()
        })
    })
}

// 删除相关议题
$db.prototype.delIssue = function(id) {
    return new Promise((resolve) => {
        var sql = "DELETE FROM issue WHERE mid = "+id
        var that = this
        this.open(function() {
            that.execute(sql, function(res) {
                resolve(res)
            })
        })
    });
}

// 查询所有议题
$db.prototype.queryIssue = function(id) {
    return new Promise(resolve => {
        var sql = "SELECT * FROM issue WHERE mid = "+id
        var that = this
        this.open(function() {
            that.select(sql, function(res) {
                resolve(res)
            })
        })
    });
}

// 查询单个议题
$db.prototype.queryOnceIssue = function(id) {
    return new Promise(resolve => {
        var sql = "SELECT * FROM issue WHERE id = "+id
        var that = this
        this.open(function() {
            that.select(sql, function(res) {
                resolve(res)
            })
        })
    });
}

// 创建议题表
$db.prototype.createIssueTable = function() {
    var that = this
    this.open(function(params) {
        that.execute(
            `CREATE TABLE IF NOT EXISTS issue(
                issueid INTEGER PRIMARY KEY NOT NULL,
                id INT(12) NOT NULL,
                mid INT(12) NOT NULL,
                issue_title VARCHAR(255) DEFAULT '',
                content TEXT DEFAULT '',
                file TEXT DEFAULT '',
                filename TEXT DEFAULT '',
                url TEXT DEFAULT '',
                people VARCHAR(255) DEFAULT ''
            )`,function() {
                
            }
        )
    })
}

// 删除议题表
$db.prototype.deleteIssueTable = function() {
    var that = this
    this.open(function() {
        that.execute("DROP TABLE IF EXISTS issue",function() {
            console.warn('议题表删除成功');
        })
    })
}

// +----------------------------------------------------------------------
// | 附件
// +----------------------------------------------------------------------

// 创建附件表
$db.prototype.createFilesTable = function() {
    var that = this
    this.open(function(params) {
        that.execute(
            `CREATE TABLE IF NOT EXISTS ${that.filesTable}(
                filesid INTEGER PRIMARY KEY NOT NULL,
                id INT(12) NOT NULL,
                name VARCHAR(255),
                url TEXT,
                ytid VARCHAR(255),
                filetype VARCHAR(255)
            )`,function() {
                
            }
        )
    })
}

// 插入附件
$db.prototype.insertFiles = function(info, callback=()=>{}) {
    if (!info) {
        console.warn('无任何数据插入');
        return
    }
    var that = this
    this.open(function() {
        that.execute(`
            INSERT INTO ${that.filesTable}
            (id, name, url, ytid, filetype)
            VALUES
            ('${info.id}', '${info.name}', '${info.url}', '${info.ytid}', '${info.filetype}')
        `, function() {
            callback()
        })
    })
}

// 删除附件表
$db.prototype.deleteFilesTable = function() {
    var that = this
    this.open(function() {
        that.execute(`DROP TABLE IF EXISTS ${that.filesTable}`,function() {
            console.warn('附件表删除成功');
        })
    })
}

// 修改议题文件
$db.prototype.modifyFiles = function(id, data, callback=()=>{}) {
    var that = this
    this.open(function() {
        that.execute(`
            UPDATE ${that.filesTable} SET name='${data.name}', url='${data.url}', ytid='${data.ytid}', filetype='${data.filetype}'  WHERE id=${id};
        `, function() {
            callback()
        })
    })
}

// 查询所有附件
$db.prototype.queryAllFiles = function(id) {
    return new Promise(resolve => {
        var sql = `SELECT * FROM ${this.filesTable} WHERE ytid = ${id}`
        var that = this
        this.open(function() {
            that.select(sql, function(res) {
                resolve(res)
            })
        })
    });
}

$db.prototype.queryAll = function(id) {
    return new Promise(resolve => {
        var sql = `SELECT * FROM ${this.filesTable}`
        var that = this
        this.open(function() {
            that.select(sql, function(res) {
                resolve(res)
            })
        })
    });
}

// 查询单个附件
$db.prototype.queryOnceFiles = function(id) {
    return new Promise(resolve => {
        var sql = `SELECT * FROM ${this.filesTable} WHERE id = ${id}`
        var that = this
        this.open(function() {
            that.select(sql, function(res) {
                resolve(res)
            })
        })
    });
}