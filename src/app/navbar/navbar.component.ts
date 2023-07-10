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
  fetchAllData: any = []; 
  allRegionsList: any = [];
  selectedRegionCitiesList: any = [];
  selectedCityYearsList: any = [];
  selectedRegionObject: any = [];
  selectedCityObject: any = [];
  selectedRegion: any;
  selectedCity: any;
  selectedYear: any;
  graphValue1:any =[];
  chartDiv: any = [];



  //parameter called service

  constructor(private dataService: BackendDataService) {} //BackendDataService class.
  // This allows the class to access the methods and properties
  // use them to retrieve or manipulate data.

  ngOnInit() {
    this.getCityRegionYearData();
  }

  async getCityRegionYearData() {
    await this.dataService.getRegionCityYear().subscribe((data: any) => {
      this.fetchAllData = data.data; //getting all data's
      this.setData();
    })
  }

  setData() {
     this.fetchAllData.forEach((data: any) => {
     this.allRegionsList.push(data.region);  
    });
     this.setSelectedRegion("ANZ") 
     this.setSelectedCity("Altona") 
     this.setSelectedYear(2005) 
     this.graphValue()
  }

  graphValue() {
    this.getChartValuesFromApi(this.selectedRegion, this.selectedCity, this.selectedYear)
  }
  async getChartValuesFromApi(region:any, city:any, year:any){
    await this.dataService.getChartValues(region, city, year).subscribe((data: any) => {
     this.graphValue1 = [];
      Object.entries(data.data[0]).forEach(entry => {
        const [key, value] = entry;
        if ((key !== "City") && (key !== "Region") && (key !== "Year")) {
          this.graphValue1.push({ country: key, value: value});
        }
      });

      console.log("Input chart data values", this.graphValue1)
     this.preparechart();
    });
  }
    onChangeRegionEvent(element:any) {
     this.setSelectedRegion(element.target.value)
     this.setSelectedCity(this.selectedRegionCitiesList[0])
     this.setSelectedYear(this.selectedCityYearsList[0])
     this.graphValue()
  }
  onChangeCityEvent(element:any) {
     this.setSelectedCity(element.target.value)
     this.setSelectedYear(this.selectedCityYearsList[0])
     this.graphValue()
  }
   onChangeYearEvent(element:any) { 
    this.setSelectedYear(element.target.value)
    this.graphValue()
  }
  setSelectedRegion(region: any) {
  this.selectedRegion = region; //getting the selected region 
  this.selectedRegionObject = this.fetchAllData.filter((data:any) => 
      data.region == this.selectedRegion
    );

  this.selectedRegionCitiesList = [];
  this.selectedRegionObject[0].cities.forEach((region: any) => { //getting all the cities in the selected region
  this.selectedRegionCitiesList.push(region.city);   
    });
  }

  setSelectedCity(city: any) {
    this.selectedCity = city;   //getting the selected city 
    this.selectedCityObject = (this.selectedRegionObject[0].cities).filter((region:any) => 
      region.city == this.selectedCity
    );
    this.selectedCityYearsList = this.selectedCityObject[0].years; //getting the years from selected city
  }

  setSelectedYear(year: any) {
    this.selectedYear = year 
  }

  InputToggle(){
    this.isActive = true;
    this.inputChart = true;
  }
  OutputToggle(){
    this.isActive = false;
    this.inputChart = false;
  }

  // Assign the filtered data to the chart
preparechart() {

  if (this.chartDiv["inputChartdiv"]) {
    this.chartDiv["inputChartdiv"].dispose() 
 }

  // Create root element
  // https://www.amcharts.com/docs/v5/getting-started/#Root_element
  var root = am5.Root.new('inputChartdiv');

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
  xAxis.children.moveValue(am5.Label.new(root, {
    text: "Feeds",
    x: am5.p50,
    centerX: am5.p50
  }), xAxis.children.length - 1);

  var yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      renderer: am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1,
      }),
    })
  );
  yAxis.children.moveValue(am5.Label.new(root, {
    rotation: -90,
    text: "Capacity Thousand Barrels per day(kb/d)",
    y: am5.p50,
    centerX: am5.p50
  }), 0);

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

  this.chartDiv["inputChartdiv"] = root

  xAxis.data.setAll(this.graphValue1);
  series.data.setAll(this.graphValue1);

  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/
  series.appear(1000);
  chart.appear(1000, 100);

  

  }


}

