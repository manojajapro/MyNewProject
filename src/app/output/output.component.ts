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
  gCapacity: any;
  compLimit: any;
  globalComposition: any;

  selectedConfiguration: any = 'Config_0';
  allConfigurations: any = [];
  selectedConfigurationData: any = [];
  selectedGlobalCompData: any = [];

  constructor(private service: BackendDataService) {}

  ngOnInit() {
    this.fetchModelData();
    
  }

  sortConfigData(arr: any) {
    arr.sort( //sort the array based on the comparison function passed as an argument.
      (a: any, b: any) =>
        a.Configuration.split('_')[1] - b.Configuration.split('_')[1]
    );
  }

  async fetchModelData() {
    await this.service.getModelData().subscribe((data: any) => {
      this.gCapacity = data.global_cap;
      this.compLimit = data.comp_limit;
      this.globalComposition = data.global_comp;

      this.sortConfigData(this.gCapacity);
      this.sortConfigData(this.compLimit);
      this.sortConfigData(this.globalComposition);

      this.allConfigurations = Object.values(this.gCapacity).map(
        (item: any) => item.Configuration
      );

      this.filterSelectedConfigData();
      this.prepareChart();
    });
  }

  filterSelectedConfigData() {
    //filtering data based on the selected configuration
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
    this.filterSelectedConfigData();
  } 

  prepareChart() {
    let root = am5.Root.new('chartdivCon');

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
        scrollbarX: am5.Scrollbar.new(root, { orientation: 'horizontal' }),
        scrollbarY: am5.Scrollbar.new(root, { orientation: 'vertical' }),
        pinchZoomX: true,
      })
    );

    let cursor = chart.set('cursor', am5xy.XYCursor.new(root, {}));
    cursor.lineY.set('visible', false);

    let xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 15,
    });

    xRenderer.labels.template.setAll({
      rotation: -90,
      centerY: am5.p50,
      centerX: 0,
    });

    xRenderer.grid.template.setAll({
      visible: false,
    });

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0.3,
        categoryField: 'Configuration',
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );
    xAxis.children.moveValue(am5.Label.new(root, {
      text: "- Capacity",
      x: am5.p50,
      centerX: am5.p50
    }), xAxis.children.length - 1);

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );
    yAxis.children.moveValue(am5.Label.new(root, {
      rotation: -90,
      text: "Thousand Barrels per day(kb/d)",
      y: am5.p50,
      centerX: am5.p50
    }), 0);

    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'CAP',
        categoryXField: 'Configuration',
        adjustBulletPosition: false,
        tooltip: am5.Tooltip.new(root, {
          labelText: '{valueY}',
        }),
      })
    );
    series.columns.template.setAll({
      width: 0.5,
    });

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationY: 1,
        sprite: am5.Circle.new(root, {
          radius: 5,
          fill: series.get('fill'),
        }),
      });
    });

    let data = this.gCapacity;

    xAxis.data.setAll(data);
    series.data.setAll(data);

    series.appear(1000);
    chart.appear(1000, 100);
  }
  
//   prepareChart(){
//     /* Chart code */

// // Create root element
// // https://www.amcharts.com/docs/v5/getting-started/#Root_element
// let root = am5.Root.new("chartdivCon");


// // Set themes
// // https://www.amcharts.com/docs/v5/concepts/themes/
// root.setThemes([
//   am5themes_Animated.new(root)
// ]);


// // Create chart
// // https://www.amcharts.com/docs/v5/charts/xy-chart/
// let chart = root.container.children.push(am5xy.XYChart.new(root, {
//   panX: false,
//   panY: false,
//   wheelX: "panX",
//   wheelY: "zoomX"
// }));


// // Add cursor
// // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
// let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
//   behavior: "zoomX"
// }));
// cursor.lineY.set("visible", false);

// let date = new Date();
// date.setHours(0, 0, 0, 0);
// let value = 100;

// function generateData() {
//   value = Math.round((Math.random() * 10 - 5) + value);
//   am5.time.add(date, "day", 1);
//   return {
//     date: date.getTime(),
//     value: value
//   };
// }

// function generateDatas(count:any) {
//   let data = [];
//   for (var i = 0; i < count; ++i) {
//     data.push(generateData());
//   }
//   return data;
// }


// // Create axes
// // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
// let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
//   maxDeviation: 0,
//   baseInterval: {
//     timeUnit: "day",
//     count: 1
//   },
//   renderer: am5xy.AxisRendererX.new(root, {
//     minGridDistance: 60
//   }),
//   tooltip: am5.Tooltip.new(root, {})
// }));

// let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
//   renderer: am5xy.AxisRendererY.new(root, {})
// }));


// // Add series
// // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
// let series = chart.series.push(am5xy.ColumnSeries.new(root, {
//   name: "Series",
//   xAxis: xAxis,
//   yAxis: yAxis,
//   valueYField: "Configuration",
//   valueXField: "Configuration",
//   tooltip: am5.Tooltip.new(root, {
//     labelText: "{valueY}"
//   })
// }));

// series.columns.template.setAll({ strokeOpacity: 0 })


// // Add scrollbar
// // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
// chart.set("scrollbarX", am5.Scrollbar.new(root, {
//   orientation: "horizontal"
// }));

// let data = this.gCapacity;

// xAxis.data.setAll(data);
// series.data.setAll(data);


// // Make stuff animate on load
// // https://www.amcharts.com/docs/v5/concepts/animations/
// series.appear(1000);
// chart.appear(1000, 100);
//   }
// }

} 