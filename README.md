# reactjs 探究(草稿)

使用 `reactjs` 有两年多了, 虽然大多时间是个人的研究，但好歹也有些理解，知道多少记多少。

## react 核心


```
UI = f(state)
```

函数式、组件化

## virtual DOM

`virtual DOM` 是 `DOM` 元素的 `js` 对象表示形式。

`virtual DOM` 是 `react` 的一个特点，但我觉得不是其核心。它是 `react` 的优化手段。

正常情况下，要更新 `DOM`，需要

1. 判断 `DOM` 是否需要更新
2. 是的话就更新 `DOM`(包括更新和重新渲染一个新元素)

这两步，都可能会操作 `DOM`。第二步不用说，第一步里，如果判断依据是 `DOM` 上的属性的话，那获取这些属性，也需要操作 `DOM`， 性能也不会好。

如果用 `js` 对象表示 `DOM`, 那对 `js` 的操作，就比 `DOM` 操作，快得多。这会减少一些不必要的 `DOM` 操作。

如一个要更新一个元素，之前需要两步 `DOM` 操作，而现在只需要一步，第一步用`js` 对象而不是 `DOM` 对象来比较了，这就提高性能了。


## 组件生命周期

组件有安装和更新两个阶段

### 安装

安装阶段，对不同的元素

```
- text
- react dom 元素
- 自定义元素
```

进行实例化，自定义元素，最终也是会转化成 `dom` 元素的。 

`react` 元素都会有这个两个方法：

1. `mountComponent` 返回  `react` 元素
2. `receiveComponent` 接受 `更新数据`， 更新 `react` 元素

其中 `react dom` 会有

1. `_diff` 返回一个数组，存的是元素中变化的子项。
2. `_patch` 把 `_diff` 里的变化项，更新到 `react` 元素里。

两个方法，用于更新元素。这也是 `react` `diff` 算法核心。


### 更新

1. 如何判断是否更新

	1. 首先，是 `shouldComponentUpdate` 方法，是否返回 `true`, `true` 则更新，反之不更新
	
	2. 然后，调用 `render` 方法，这个方法返回的是 `virtual DOM`。这一步，实际 `DOM` 并没有变化。

	3. 其次，会调用内部方法，比较 `virtual DOM`, 比较完后，如果需要更新，
		
		- 则继续调用上一次渲染实例的 `receiveComponent` ，内部逻辑跟当前一样。
		
		- 否则，就是重新渲染元素了。

		
### diff 算法

更新分更新属性和更新子元素两部分。

更新属性就是比较要更新前后的两个对象，增删一些属性，这里先不讲，先讲讲更新子元素过程。

更新的过程，就是遍历由 `virtual DOM` 组成的新旧子元素。

首先根据如下条件，判断元素是否要更新

```
- 元素类型(创建react元素时的`type`)
- key 
```

然后会判断元素是否要

```
1. 移动位置(新旧子元素里都有)
2. 删除(旧的有，新的没有)
```


总的来说，这些变化的状态有:

```
var UPATE_TYPES = {
    MOVE_EXISTING: 1, // 移动
    REMOVE_NODE: 2,   // 删除
    INSERT_MARKUP: 3  // 新增
}
```

最后将这些变化，存到一个数组里，找完所有的变化后，`diff` 部分也就结束。接着再 `patch` 找到的变化, 即将这些变化，都更新到 `DOM` 里。最终完成了整个更新的过程。


## todo

1. 更新的流程图


## 参考

1. [reactjs源码分析](https://github.com/purplebamboo/blog/issues/2)

