// url: https://www.jianshu.com/p/1157aaccad36

// 定义队列
function Queue() {
    this.dataStore = [];
    // this.enqueue = enqueue;     //入队
    // this.dequeue = dequeue;     //出队
    // this.front = front;         //查看队首元素
    // this.back = back;           //查看队尾元素
    // this.toString = toString;   //显示队列所有元素
    // this.clear = clear;         //清空当前队列
    // this.empty = empty;         //判断当前队列是否为空
}

// enqueue：向队列添加元素
Queue.prototype.enqueue = function (element) {
    this.dataStore.push(element);
}

// dequeue：删除队首的元素
Queue.prototype.dequeue = function () {
    if (this.empty()) return 'This queue is empty';
    else this.dataStore.shift();
}

// empty：判断队列是否为空
Queue.prototype.empty = function () {
    if (this.dataStore.length == 0) return true;
    else return false;
}

// front：查看队首元素
Queue.prototype.front = function () {
    if (this.empty()) return 'This queue is empty';
    else return this.dataStore[0];
}

// back：查看队尾元素
Queue.prototype.back = function () {
    if (this.empty()) return 'This queue is empty';
    else return this.dataStore[this.dataStore.length - 1];
}

// toString：查看队列中所有元素
Queue.prototype.toString = function () {
    return this.dataStore.join('\n');
}

// clear：清空当前队列
Queue.prototype.clear = function () {
    delete this.dataStore;
    this.dataStor = [];
}