import { Component } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BackendDataService } from 'src/app/backend-data.service';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isActive:boolean = true;
  inputChart : boolean=true ;
  data: any = [];
  allRegions: string[] = [];
  availableCitiesForSelectedRegion: string[] = [];
  availableYears: any = [];
  selectedRegion: string = 'ANZ';
  selectedCity: string = 'Altona';
  selectedYear: number = 2005;
  selectedObject: any;
  graphValue: any;
  graphValue1: any = [];
 

  constructor(private service: BackendDataService) {}

  ngOnInit(): void {
    this.fetchFeedsData();
    this.getRYCFromApi('ANZ', 'Altona', 2005);
    this.preparechart();
  
  }
  

  ngAfterViewInit() {}

  // fetching 
  async fetchFeedsData() {
    await this.service.getfetchData().subscribe((data: any) => {
      this.data = data.data;
      this.preparechart();
      this.extractRegions();
      this.updateAvailData();
    });
  }

  updateAvailData() {
    this.selectedObject = this.data.filter(
      (i: any) => i.region == this.selectedRegion
    );

    
     this.availableCitiesForSelectedRegion = this.selectedObject[0].cities.map(
      (obj: any) => {
        return obj.city;
      }
    );
    this.updateYearsAvail();
  }
  extractRegions() {
    // extractiong regions
    this.allRegions = this.data.map((obj: any) => {
      return obj.region;
    });
    console.log('allRegions', this.allRegions);
  }

  updateYearsAvail() {
    this.availableYears = this.selectedObject[0].cities.filter((obj: any) => {
      return obj.city == this.selectedCity;
    })[0].years;

    this.selectedYear = this.availableYears[0];
  }
  onRegionChangeHandler(e: any) {
    this.selectedRegion = e.target.value;
    this.updateAvailData();
    this.preparechart();
  }
  onCityChangeHandler(e: any) {
    this.selectedCity = e.target.value;
    this.updateAvailData();
    this.preparechart();
  }
  onYearChangeHandler(e: any) {
    this.selectedYear = e.target.value;
    this.preparechart();
  }
  async getRYCFromApi(region: any, city: any, year: any) {
    await this.service
      .getValuesForRCY(region, city, year)
      .subscribe((values: any) => {
        console.log('values', values);
        this.graphValue = values.data[0];
        delete this.graphValue.Year;
        delete this.graphValue.City;
        delete this.graphValue.Region;
  
        Object.keys(this.graphValue).forEach((key: any) => {
          this.graphValue1.push({
            country: key,
            value: this.graphValue[key],
          });
        });
       
      });
  }
  InputToggle(){
    this.isActive = true;
    this.inputChart = true;
  }
  OutputToggle(){
    this.isActive = false;
    this.inputChart = false;

  }

preparechart() {
  /**
   * ---------------------------------------
   * This demo was created using amCharts 5.
   *
   * For more information visit:
   * https://www.amcharts.com/
   *
   * Documentation is available at:
   * https://www.amcharts.com/docs/v5/
   * ---------------------------------------
   */

  let divId = 'chartdiv';
    am5.array.each(am5.registry.rootElements, function (root) {
      if (root.dom.id == divId) {
        root.dispose();
      }
    });

  // Create root element
  // https://www.amcharts.com/docs/v5/getting-started/#Root_element
  var root = am5.Root.new('chartdiv');

  // Set themes
  // https://www.amcharts.com/docs/v5/concepts/themes/
  root.setThemes([am5themes_Animated.new(root)]);

  // Create chart
  // https://www.amcharts.com/docs/v5/charts/xy-chart/
  var chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: 'panX',
      wheelY: 'zoomX',
      pinchZoomX: true,
    })
  );

  // Add cursor
  // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
  var cursor = chart.set('cursor', am5xy.XYCursor.new(root, {}));
  cursor.lineY.set('visible', true);

  // Create axes
  // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
  xRenderer.labels.template.setAll({
    rotation: -90,
    centerY: am5.p50,
    centerX: am5.p100,
    paddingRight: 15,
  });

  xRenderer.grid.template.setAll({
    location: 1,
  });

  var xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      maxDeviation: 0.3,
      categoryField: 'country',
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {}),
    })
  );

  var yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      renderer: am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1,
      }),
    })
  );

  // Create series
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  var series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: 'Series 1',
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: 'value',
      sequencedInterpolation: true,
      categoryXField: 'country',
      tooltip: am5.Tooltip.new(root, {
        labelText: '{valueY}',
      }),
    })
  );

  series.columns.template.setAll({
    cornerRadiusTL: 5,
    cornerRadiusTR: 5,
    strokeOpacity: 0,
  });

 
  let data = this.graphValue1;

  xAxis.data.setAll(data);
  series.data.setAll(data);

  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/
  series.appear(1000);
  chart.appear(1000, 100);
  }


}

