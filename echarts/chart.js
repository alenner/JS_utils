/*
 * @Author: mulingyuer
 * @Date: 2021-10-21 15:39:37
 * @LastEditTime: 2022-07-24 21:58:49
 * @LastEditors: aleaner
 * @Description: 图表基类
 * @FilePath: \JS_utils\echarts\chart.js
 * 怎么可能会有bug！！！
 */
import { colors } from "./theme";
import { addListener, removeListener } from 'resize-detector';
import debounce from "lodash/debounce";
import { isArray, isObject, isBoolean } from "@/base/utils/tool";

export default class Chart {
  color = colors; //主题色

  constructor() {
    //防抖动
    this.onResize = debounce(this.onResize.bind(this), 300);
  }

  //为真报错
  checkReal(flag, errorText) {
    if (flag) throw new Error(errorText);
  }

  //添加resize事件
  addResize() {
    addListener(this.container, this.onResize);
  }

  // 监听容器大小变化
  onResize() {
    this.$myChart.resize();
  }

  //移除监听resize
  removeResize() {
    removeListener(this.container, this.onResize);
  }

  //销毁
  dispose() {
    this.$myChart.dispose();  //销毁实例
    if (this.resize) this.removeResize(); //移除resize事件监听
    //批量赋值null
    Object.keys(this).forEach(key => {
      this[key] = null;
    })
  }

  //校验color
  validateColor(color, errorText = "指定颜色color配置必须是一个数组") {
    this.checkReal(!isArray(color), errorText);
    return color;
  }

  //校验resize
  validateResize(resize, errorText = "resize必须是一个布尔值") {
    this.checkReal(!isBoolean(resize), errorText);
    return resize;
  }

  //校验grid
  validateGrid(grid, errorText = "指定grid配置必须是一个键值对象") {
    this.checkReal(!isObject(grid), errorText);
    return grid;
  }

  //校验yAxis
  validateYAxis(yAxis, errorText = "指定yAxis配置必须是一个键值对象") {
    this.checkReal(!isObject(yAxis), errorText);
    return yAxis;
  }

  //校验xAxis
  validateXAxis(xAxis, errorText = "指定xAxis配置必须是一个键值对象") {
    this.checkReal(!isObject(xAxis), errorText);
    return xAxis;
  }

  //校验series
  validateSeries(series, errorText = "指定series配置必须是一个键值对象") {
    this.checkReal(!isObject(series), errorText);
    return series;
  }

  //校验legend
  validateLegend(legend, errorText = "指定legend配置必须是一个键值对象") {
    this.checkReal(!isObject(legend), errorText);
    return legend;
  }

  //校验tooltip
  validateTooltip(tooltip, errorText = "指定tooltip配置必须是一个键值对象") {
    this.checkReal(!isObject(tooltip), errorText);
    return tooltip;
  }

  //校验data
  validateData(data, errorText = "data数据必须是一个数组") {
    this.checkReal(!data || !isArray(data), errorText);
    return data;
  }

  //校验xData
  validateXData(xData, errorText = "xData数据必须是一个数组") {
    this.checkReal(!xData || !isArray(xData), errorText);
    return xData;
  }

  //校验container
  validateContainer(container, errorText = "没有指定container DOM容器,或者它不是一个dom") {
    this.checkReal(!container && container instanceof HTMLElement, errorText);
    return container;
  }




}