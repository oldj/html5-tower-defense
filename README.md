# HTML5 塔防游戏


 * Author: oldj
 * Email: oldj.wu@gmail.com
 * Blog: [http://oldj.net/](http://oldj.net/)
 * Source: https://github.com/oldj/html5-tower-defense
 * License: MIT


## 运行

进入 `src` 或 `build` 目录，用浏览器（如 Chrome、IE9 ）打开 td.html 即可运行本游戏。

或者查看[线上Demo](http://oldj.net/static/html5-tower-defense/td.html)。

## 说明

 1. 本游戏完全使用 HTML5 / JavaScript / CSS 实现，没有用到 Flash、SilverLight 等技术。
 2. 这一个版本没有用到图片，游戏中的所有物品都是使用 HTML5 画出来的。
 3. 这一个版本部分地方为 IE9 做了专门的优化，可正常运行在 IE9 下。


## 目录

    /build          压缩后的可发布的文件
    /screenshorts   屏幕截图
    /src            源码
        /css        样式表
        /js         JavaScripts 源文件
    /tools          小工具、脚本
    /README.md      本文件


## 作弊方法

为方便测试，本游戏内置了几个作弊方法，在命令行中执行如下命令即可：

 1. 增加 100 万金钱：`_TD.cheat="money+";`
 2. 难度增倍：`_TD.cheat="difficulty+";`
 3. 难度减半：`_TD.cheat="difficulty-";`
 4. 生命值恢复：`_TD.cheat="life+";`
 5. 生命值降为最低：`_TD.cheat="life-";`

注意，以上作弊方法主要是为测试设计，正常游戏过程中请酌情使用，否则可能会降低游戏乐趣。


## 更新历史

 - 2015-09-06 支持 retina 显示屏。
 - 2011-01-01 调整参数，同时根据网友建议，新建建筑时添加检查，禁止用建筑把怪物包围起来（v0.1.14）。
 - 2010-12-29 根据网友建议，增加生命自动恢复功能（每隔 5 波生命恢复 5 点，每隔 10 波生命恢复 10 点）。调整参数，减小了激光枪的射程，增强了重机枪的威力（v0.1.12）。
 - 2010-12-18 添加新武器“激光枪”（v0.1.8.0）。
 - 2010-12-12 暂停图片资源版本分支的开发，继续优化、开发圈圈版（v0.1.7.0）。
 - 2010-11-28 第一个图片资源版本（v0.2.1.3267）。
 - 2010-11-23 发布 [圈圈版（v0.1.6.2970）](http://oldj.net/article/html5-td-circle-version/)。
 - 2010-11-14 线上发布第一个版本。
 - 2010-11-11 开始编写这个游戏。


## 开发计划

 - 添加新武器“加农炮”，特性：击中怪物时会发生爆炸，造成面攻击。
 - 添加关卡编辑器。
 - 添加保存进度的功能。
