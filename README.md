# 数据格式

## 城市

存储在云开发-集合city内，

城市对象的属性：

- _id ID号，用于数据库查询以及旅游地点归属关系确认
- belong number，属于哪个省，现阶段都为1，即广东省
- position array，元素为两个numer，先后代表经纬度(可选)
- attration array，元素为number，代表其下景点的_id值
- intro string，城市简介(可选)

## 旅游地点

存储在云开发-集合attration内。

旅游地点对象的属性：

- _id string,ID号，用于数据库查询
- belong number，属于哪个市id
- detail array，元素属性为string 小景点分布概览
- intro string，景点介绍
- mark number，评分(可选)
- name string，景点名字
- pic string 景点图片url路径的最后一段，如：`a1.png` ，其url必须真实有效，且图片存储在云存储的attra文件夹内，文件名字规定为`a`加上_id。后缀为`jpg,png,gif,tiff`的一种。
- position string，景点位置
- prize array，元素属性为string，景点资质
- special array，元素属性为string，景点特色关键字

## 用户

## 帖子