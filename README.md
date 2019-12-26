# CPU 模拟器

根据计算机组成与原理的课程设计要求编写的 cpu 模拟器，可以读取特定的汇编指令集文件，并以执行一条微指令为最小单位进行单步执行和全部执行。

使用了 vue cli3 + vue2 + electron6，界面参考了[y86.js.org](https://y86.js.org/)

> 示例汇编代码：[example/test.data](example/test.data)

## 界面预览

![](example/example.gif)

## 课程设计要求

[任务书.md](example/任务书.md)

## 指导老师

于复兴

## 启动项目

```bash
yarn run serve # or yarn run electron:serve
```

## 构建

```bash
yarn run electron:build
```
