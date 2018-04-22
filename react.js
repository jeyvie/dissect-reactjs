import ReactElement from './createElement.js'
import ReactDOMComponent from './ReactDOMComponent.js'

import ReactClass from './ReactClass.js'
import ReactCompositeComponent from './ReactCompositeComponent.js'

//component类，用来表示文本在渲染，更新，删除时应该做些什么事情
function ReactDOMTextComponent(text) {
    //存下当前的字符串
    this._currentElement = '' + text;
    //用来标识当前component
    this._rootNodeID = null;
}

//component渲染时生成的dom结构
ReactDOMTextComponent.prototype.mountComponent = function (rootID) {
    this._rootNodeID = rootID;
    return '<span data-reactid="' + rootID + '">' + this._currentElement + '</span>';
}


//component工厂  用来返回一个component实例
export const instantiateReactComponent = function (node) {
    //文本节点的情况
    if (typeof node === 'string' || typeof node === 'number') {
        return new ReactDOMTextComponent(node)
    }

    //浏览器默认节点的情况
    if (typeof node === 'object' && typeof node.type === 'string') {
        //注意这里，使用了一种新的component
        return new ReactDOMComponent(node);
    }

    //自定义的元素节点
    if (typeof node === 'object' && typeof node.type === 'function') {
        //注意这里，使用新的component,专门针对自定义元素
        return new ReactCompositeComponent(node);
    }
}





const React = {
    nextReactRootIndex: 0, // 确保元素唯一,
    createClass: function (spec) {
        //生成一个子类
        var Constructor = function (props) {
            this.props = props;
            this.state = this.getInitialState ? this.getInitialState() : null;
        }
        //原型继承，继承超级父类
        Constructor.prototype = new ReactClass();
        Constructor.prototype.constructor = Constructor;
        //混入spec到原型
        $.extend(Constructor.prototype, spec);
        return Constructor;

    },
    /* 
    createElement只是做了简单的参数修正，
    最终返回一个ReactElement实例对象也就是我们说的虚拟元素的实例
    */
    createElement: function (type, config, children) {

        var props = {}, propName;
        config = config || {}

        //看有没有key，用来标识element的类型，方便以后高效的更新，这里可以先不管
        var key = config.key || null;

        //复制config里的内容到props
        for (propName in config) {
            if (config.hasOwnProperty(propName) && propName !== 'key') {
                props[propName] = config[propName];
            }
        }

        //处理 children,全部挂载到 props 的 children 属性上
        //支持两种写法，如果只有一个参数，直接赋值给children，否则做合并处理
        var childrenLength = arguments.length - 2;
        if (childrenLength === 1) {
            props.children = $.isArray(children) ? children : [children];
        } else if (childrenLength > 1) {
            var childArray = Array(childrenLength);
            for (var i = 0; i < childrenLength; i++) {
                childArray[i] = arguments[i + 2];
            }
            props.children = childArray;
        }

        return new ReactElement(type, key, props);

    },
    render: function (element, container) {

        var componentInstance = instantiateReactComponent(element);
        var markup = componentInstance.mountComponent(React.nextReactRootIndex++);
        $(container).html(markup);
        //触发完成mount的事件
        $(document).trigger('mountReady');
    }
}

export default React;