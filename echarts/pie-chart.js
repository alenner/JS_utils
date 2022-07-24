/*
 * @Author: mulingyuer
 * @Date: 2021-09-17 14:50:09
 * @LastEditTime: 2022-07-24 21:58:55
 * @LastEditors: aleaner
 * @Description: 环形图表
 * @FilePath: \JS_utils\echarts\pie-chart.js
 * 怎么可能会有bug！！！
 */
import Chart from "./chart";
import merge from 'merge';
//图表
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);


export default class MyPieChart extends Chart {
  //悬浮展示
  tooltip = {
    trigger: "item",
    formatter: (params, ticket, callback) => {
      return `${params.name} ${params.value}%`;
    },
  };
  //图例
  legend = {
    right: "0",
    orient: "vertical",
    top: "center",
    icon: "circle",
    formatter: (name) => {
      const findData = this.data.find((item) => item.name === name);
      if (!findData) return name;
      return `${name} |    ${findData.value}%`;
    },
  }
  //图形
  series = {
    name: "",
    type: "pie",
    radius: ["70%", "90%"],
    center: ["35%", "50%"],
    avoidLabelOverlap: true,
    label: {
      show: false,
    },
    emphasis: {
      label: {
        show: false,
        fontSize: "20",
        fontWeight: "bold",
      },
    },
    labelLine: {
      show: false,
    },
    data: [],
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
    const { container, data, resize } = validData;
    //初始化实例
    this.$myChart = echarts.init(container);
    //设置图表数据
    this.setOption(data);

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
      showLegend = true,
      series,
      data,
      resize = true
    } = options;


    //容器
    this.container = this.validateContainer(container);
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
      data,
      resize
    }
  }

  //设置数据
  setOption(data) {
    this.data = this.validateData(data); //挂载，方便formatter查询

    //配置对象
    const options = {
      color: this.color,
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

