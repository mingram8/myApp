import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services';

@Component({
  selector: 'app-sidebar-trending-stocks',
  templateUrl: './sidebar-trending-stocks.component.html',
  styleUrls: ['./sidebar-trending-stocks.component.css']
})
export class SidebarTrendingStocksComponent implements OnInit {
  trendingStocks:any = [];
  topMover:any = [];
  topLoser:any = [];
  mostTalkedOfDay:any = [];
  stockData:any = [];

  constructor(private dataService: DataService , private http : HttpClient) { }

  ngOnInit(): void {
    this.getTrendingStocks();
  }
  getTrendingStocks(){
    this.dataService.getTrendingStocks()
      .subscribe(res => {
        console.log(res)
        console.log(res)
        this.topLoser = res.losers;
        this.topLoser = this.topLoser.slice(0,2);

        this.topLoser.forEach(element => {
          element.priceChange = '';
          element.changeInPrice = 0;
          element.changeInPercentage = 0;
          if (element.changes > 0) {
            element.priceChange = 'up';
            element.changeInPrice = element.changes;
            element.changeInPercentage = element.changesPercentage;
          } else if (element.changes < 0) {
            element.priceChange = 'down';
            element.changeInPrice = element.changes;
            element.changeInPercentage = element.changesPercentage;
          }
        });


        this.topMover = res.gainers;
        this.topMover = this.topMover.slice(0,2);

        this.topMover.forEach(element => {
          element.priceChange = '';
          element.changeInPrice = 0;
          element.changeInPercentage = 0;
          if (element.changes > 0) {
            element.priceChange = 'up';
            element.changeInPrice = element.changes;
            element.changeInPercentage = element.changesPercentage;
          } else if (element.changes < 0) {
            element.priceChange = 'down';
            element.changeInPrice = element.changes;
            element.changeInPercentage = element.changesPercentage;
          }
        });

        this.mostTalkedOfDay = res.actives;
        this.mostTalkedOfDay = this.mostTalkedOfDay.slice(0,2);





        this.mostTalkedOfDay.forEach(element => {
          element.priceChange = '';
          element.changeInPrice = 0;
          element.changeInPercentage = 0;
          if (element.changes > 0) {
            element.priceChange = 'up';
            element.changeInPrice = element.changes;
            element.changeInPercentage = element.changesPercentage;
          } else if (element.changes < 0) {
            element.priceChange = 'down';
            element.changeInPrice = element.changes;
            element.changeInPercentage = element.changesPercentage;
          }
        });

        //console.log(this.mostTalkedOfDay)

      });


  }


}
