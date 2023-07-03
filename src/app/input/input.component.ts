import { Component } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
//   ngOnInit() {
//     this.preparechart()
//    }
//   preparechart() {
//     /**
//      * ---------------------------------------
//      * This demo was created using amCharts 5.
//      *
//      * For more information visit:
//      * https://www.amcharts.com/
//      *
//      * Documentation is available at:
//      * https://www.amcharts.com/docs/v5/
//      * ---------------------------------------
//      */

//     // Create root element
//     // https://www.amcharts.com/docs/v5/getting-started/#Root_element
//     var root = am5.Root.new('chartdiv');

//     // Set themes
//     // https://www.amcharts.com/docs/v5/concepts/themes/
//     root.setThemes([am5themes_Animated.new(root)]);

//     // Create chart
//     // https://www.amcharts.com/docs/v5/charts/xy-chart/
//     var chart = root.container.children.push(
//       am5xy.XYChart.new(root, {
//         panX: true,
//         panY: true,
//         wheelX: 'panX',
//         wheelY: 'zoomX',
//         pinchZoomX: true,
//       })
//     );

//     // Add cursor
//     // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
//     var cursor = chart.set('cursor', am5xy.XYCursor.new(root, {}));
//     cursor.lineY.set('visible', false);

//     // Create axes
//     // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
//     var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
//     xRenderer.labels.template.setAll({
//       rotation: -90,
//       centerY: am5.p50,
//       centerX: am5.p100,
//       paddingRight: 15,
//     });

//     xRenderer.grid.template.setAll({
//       location: 1,
//     });

//     var xAxis = chart.xAxes.push(
//       am5xy.CategoryAxis.new(root, {
//         maxDeviation: 0.3,
//         categoryField: 'country',
//         renderer: xRenderer,
//         tooltip: am5.Tooltip.new(root, {}),
//       })
//     );

//     var yAxis = chart.yAxes.push(
//       am5xy.ValueAxis.new(root, {
//         maxDeviation: 0.3,
//         renderer: am5xy.AxisRendererY.new(root, {
//           strokeOpacity: 0.1,
//         }),
//       })
//     );

//     // Create series
//     // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
//     var series = chart.series.push(
//       am5xy.ColumnSeries.new(root, {
//         name: 'Series 1',
//         xAxis: xAxis,
//         yAxis: yAxis,
//         valueYField: 'value',
//         sequencedInterpolation: true,
//         categoryXField: 'country',
//         tooltip: am5.Tooltip.new(root, {
//           labelText: '{valueY}',
//         }),
//       })
//     );

//     series.columns.template.setAll({
//       cornerRadiusTL: 5,
//       cornerRadiusTR: 5,
//       strokeOpacity: 0,
//     });

//     // Set data
//     var data = [
//       {
//         country: 'DGO',
//         value: 30,
//       },
//       {
//         country: 'GAS',
//         value: 20,
//       },
//       {
//         country: 'HFO',
//         value: 40,
//       },
//       {
//         country: 'HSO',
//         value: 10,
//       },
//       {
//         country: 'HSW',
//         value: 70,
//       },
//       {
//         country: 'KJF',
//         value: 23,
//       },
//       {
//         country: 'LPG',
//         value: 15,
//       },
//       {
//         country: 'LSO',
//         value: 50,
//       },
//       {
//         country: 'LSW',
//         value: 30,
//       },
//       {
//         country: 'MSO',
//         value: 60,
//       },
//       {
//         country: 'MSW',
//         value: 10,
//       },
//       {
//         country: 'NAP',
//         value: 10,
//       },
//     ];

//     xAxis.data.setAll(data);
//     series.data.setAll(data);

//     // Make stuff animate on load
//     // https://www.amcharts.com/docs/v5/concepts/animations/
//     series.appear(1000);
//     chart.appear(1000, 100);
//   }
}

