import { Component } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { BackendDataService } from '../backend-data.service';


@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.css']
})
export class OutputComponent {
  globalCapacity: any;
  compLimit: any;
  globalComposition: any;

  selectedConfiguration: any = 'Config_0';
  selectedConfigurationData: any = [];
  selectedGlobalCompData: any = [];
  allConfigurations: any = [];
 

  constructor(private service: BackendDataService) {}

  ngOnInit() {
    this.fetchModelDate();
  }

  sortConfigurationData(arr: any) {
    arr.sort(
  (a: any, b: any) =>
    a.Configuration.split('_')[1] - b.Configuration.split('_')[1]
    );
  }
  async fetchModelDate() {
    await this.service.getModelData().subscribe((data: any) => {
      
      this.compLimit = data.comp_limit;
      this.globalComposition = data.global_comp;
      this.globalCapacity = data.global_cap;

      this.sortConfigurationData(this.compLimit);
      this.sortConfigurationData(this.globalCapacity);
      this.sortConfigurationData(this.globalComposition);

      this.allConfigurations = Object.values(this.globalCapacity).map(
        (item: any) => item.Configuration
      );
      this.filterSelectedConfigurationData();
      this.prepareChart();
    });
  }

  filterSelectedConfigurationData() {
    this.selectedConfigurationData = this.compLimit.filter((obj: any) => {
      return obj.Configuration == this.selectedConfiguration;
    });

    this.selectedGlobalCompData = this.globalComposition.filter((obj: any) => {
      return obj.Configuration == this.selectedConfiguration;
    });

    this.combineCompAndLimitData();
  }

  combineCompAndLimitData() {
    for (let i = 0; i < this.selectedConfigurationData.length; i++) {
      const feed = this.selectedConfigurationData[i].Feed;
      const config = this.selectedConfigurationData[i].Configuration;
      const match = this.selectedGlobalCompData.find((obj: any) => {
        return obj.Configuration === config && obj.Feed === feed;
      });

      if (match) {
        this.selectedConfigurationData[i].Composition = match.Composition;
      }
    }
  }

  selectCongingChangeHandler(e: any) {
    this.selectedConfiguration = e.target.value;
    this.filterSelectedConfigurationData();
  }

  prepareChart() {/* Chart code */
  // Create root element
  // https://www.amcharts.com/docs/v5/getting-started/#Root_element
  let root = am5.Root.new("chartdivCon");
  
  
  // Set themes
  // https://www.amcharts.com/docs/v5/concepts/themes/
  root.setThemes([
    am5themes_Animated.new(root)
  ]);
  
  
  // Create chart
  // https://www.amcharts.com/docs/v5/charts/xy-chart/
  let chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: true,
    panY: true,
    wheelX: "panX",
    wheelY: "zoomX",
    pinchZoomX:true
  }));
  
  
  // Add cursor
  // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
  let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
    behavior: "none"
  }));
  cursor.lineY.set("visible", false);
  
  
  // Generate random data
  let date = new Date();
  date.setHours(0, 0, 0, 0);
  let value = 18000;
  
  function generateData() {
    value = Math.round((Math.random() * 10 - 5) + value);
    am5.time.add(date, "day", 1);
    return {
      date: date.getTime(),
      value: value
    };
  }
  
  function generateDatas(count:any) {
    let data = [];
    for (var i = 0; i < count; ++i) {
      data.push(generateData());
    }
    return data;
  }
  
  
  // Create axes
  // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
    maxDeviation: 0.2,
    baseInterval: {
      timeUnit: "day",
      count: 1
    },
    renderer: am5xy.AxisRendererX.new(root, {}),
    tooltip: am5.Tooltip.new(root, {})
  }));
  
  let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {})
  }));
  
  
  // Add series
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  let series = chart.series.push(am5xy.LineSeries.new(root, {
    name: "Series",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value",
    valueXField: "date",
    tooltip: am5.Tooltip.new(root, {
      labelText: "{valueY}"
    })
  }));
  
  
  // Add scrollbar
  // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
  chart.set("scrollbarX", am5.Scrollbar.new(root, {
    orientation: "horizontal"
  }));
  
  
  // Set data
  let data = generateDatas(1200);
  series.data.setAll(data);
  
  
  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/
  series.appear(1000);
  chart.appear(1000, 100);}
}
