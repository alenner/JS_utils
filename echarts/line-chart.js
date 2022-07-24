/*
 * @Author: mulingyuer
 * @Date: 2021-09-17 17:11:41
 * @LastEditTime: 2022-07-24 21:58:53
 * @LastEditors: aleaner
 * @Description: 平滑折线图
 * @FilePath: \JS_utils\echarts\line-chart.js
 * 怎么可能会有bug！！！
 */
import Chart from "./chart";
import merge from 'merge';
//图表
import * as echarts from 'echarts/core';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([GridComponent, TooltipComponent, LegendComponent, LineChart, CanvasRenderer]);


export default class MyLineChart extends Chart {
  //悬浮展示
  tooltip = {
    trigger: 'axis'
  };
  //布局
  grid = {
    left: '0',
    right: '0',
    bottom: '0',
    top: "20px",
    containLabel: true,
  }
  //x轴
  xAxis = {
    type: 'category',
    data: []
  };
  //y轴
  yAxis = {
    type: 'value'
  };
  //图形
  series = {
    data: [],
    type: 'line',
    smooth: true,
    showSymbol: false,
    areaStyle: {
      opacity: 0.3
    }
  };


  constructor(options = {}) {
    super(options);

    //初始化
    this.init(options);
  }


  //初始化
  init(options) {
    //校验+合并参数
    const validData = this.initValidatorAndMerge(options);

    //获取图表数据
    const { container, xData, data, resize } = validData;
    //初始化实例
    this.$myChart = echarts.init(container);
    //设置图表数据
    this.setOption(xData, data);

    //监听容器resize
    if (resize) this.addResize();
  }

  //初始化校验+合并参数
  initValidatorAndMerge(options) {
    const {
      container,
      color,
      tooltip,
      showTooltip = true,
      legend,
      showLegend = false,
      series,
      grid,
      xAxis,
      yAxis,
      xData,
      data,
      resize = true
    } = options;


    //容器
    this.container = this.validateContainer(container);
    //xData
    this.validateXData(xData);
    //data
    this.validateData(data);

    //tooltip
    this.showTooltip = showTooltip;
    if (showTooltip && tooltip) merge.recursive(this.tooltip, this.validateTooltip(tooltip));
    //legend
    this.showLegend = showLegend;
    if (showLegend && legend) merge.recursive(this.legend, this.validateLegend(legend));
    //series
    if (series) merge.recursive(this.series, this.validateSeries(series));
    //xAxis
    if (xAxis) merge.recursive(this.xAxis, this.validateXAxis(xAxis));
    //yAxis
    if (yAxis) merge.recursive(this.yAxis, this.validateYAxis(yAxis));
    // grid
    if (grid) merge.recursive(this.grid, this.validateGrid(grid));
    //resize
    this.resize = this.validateResize(resize);
    //颜色
    if (color) this.color = this.validateColor(color);

    //返回出去
    return {
      container,
      color,
      tooltip,
      showTooltip,
      legend,
      showLegend,
      series,
      grid,
      xAxis,
      yAxis,
      xData,
      data,
      resize
    }
  }

  //设置数据
  setOption(xData, data) {
    this.xAxis.data = this.validateXData(xData); //挂载坐标数据
    this.data = this.validateData(data); //挂载，方便formatter查询

    //配置对象
    const options = {
      color: this.color,
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      grid: this.grid,
      series: [
        merge.recursive(this.series, { data })
      ]
    };

    //是否显示组件
    if (this.showLegend) options.legend = this.legend;
    if (this.showTooltip) options.tooltip = this.tooltip;

    //设置
    this.$myChart.setOption(options);
  }
}


