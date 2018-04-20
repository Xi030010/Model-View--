function Dep () {
  this.subs = [];
}

Dep.prototype.addSub = function (sub) {
  this.subs.push(sub);
}

Dep.prototype.notify = function () {
  this.subs.forEach(function (sub) {
    sub.update();
  })
}

Dep.target = null;

function Watcher (vm, node, name, attribute) {
  this.vm = vm;
  this.node = node;// 虚拟DOM节点
  this.attribute = attribute;
  this.name = name;// 订阅的属性名称
  this.update();
}

Watcher.prototype.update = function () {
  Dep.target = this;
  if (!this.attribute) this.node.nodeValue = this.vm[this.name];
  else this.node[this.attribute] = this.vm[this.name];
  Dep.target = null;
}

function Vue (options) {
  this.$options = options;
  observe(this, options.data);
  var node = document.getElementById(options.el);
  node.appendChild(parseHTML(this, node));
}

function parseHTML (vm, node) {
  var frag = document.createDocumentFragment();
  while (node.firstChild) {
    compile(vm, node.firstChild)
    frag.appendChild(node.firstChild);
  }
  return frag;
}

function compile (vm, node) {
  // node为元素
  if (node.nodeType === 1) {
    [...node.attributes].forEach(function (attribute) {
      if(attribute.nodeName === 'v-model') {
        new Watcher(vm, node, attribute.nodeValue, 'value');
      }
    })
  }
  // node为文本结点
  else if (node.nodeType === 3) {
    var reg = /\{\{(.*)\}\}/;
    if (reg.test(node.nodeValue)) {
      var name = reg.exec(node.nodeValue)[1].trim();
      new Watcher(vm, node, name);
    }
  }
}

function observe (vm, data) {
  Object.keys(data).forEach(function (key) {
    defineReactive(vm, key, data[key]);
  })
}

function defineReactive (vm, key, value) {
  var dep = new Dep();
  Object.defineProperty(vm, key, {
    get: function () {
      if (Dep.target) dep.addSub(Dep.target);
      console.log(value);
      return value;
    },
    set: function (newValue) {
      if (newValue === value) return ;
      value = newValue;
      dep.notify();
    }
  })
}

var app = new Vue({
  el: 'app',
  data: {
    message: 'message'
  }
})

setTimeout(function () {
  app.message = 'test';
}, 3000)
