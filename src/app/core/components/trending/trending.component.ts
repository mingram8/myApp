import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService, DataService } from "../../services";

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.css']
})
export class TrendingComponent implements OnInit {
  //marketNews:any = [];
  trendingStocks:any = [];
  topMover:any = [];
  topLoser:any = [];
  mostTalkedOfDay:any = [];
  stockData:any = [];
  type: string = 'all';

  constructor(private dataService: DataService, private activated_route: ActivatedRoute) {
    this.type = this.activated_route.snapshot.paramMap.get('type');
   }

  ngOnInit(): void {
    this.getTrendingStocks();
    this.getNews();
  }
  getTrendingStocks(){
    this.dataService.getAllTrendingStocks()
      .subscribe(res => {
        if (this.type  == 'all' || this.type == 'loser') {
          this.trendingStocks = res.losers;
          this.topLoser = this.trendingStocks;
          this.topLoser = this.topLoser.slice(0, 10);

          this.topLoser.forEach(element => {
            element.priceChange = '';
            element.close = element.price;
            element.changeInPrice = 0;
            element.changeInPercentage = 0;
            if (element.changes > 0) {
              element.priceChange = 'up';
              element.changeInPrice = element.changes;
              element.changeInPercentage = ((element.changes) / element.price * 100);
            } else if (element.changes < 0) {
              element.priceChange = 'down';
              element.changeInPrice = element.changes;
              element.changeInPercentage = ((element.changes) / element.price * 100);
            }
          });
        }


        if (this.type == 'all' || this.type == 'loser') {
        this.trendingStocks = res.gainers;
        this.topMover = this.trendingStocks;
        // this.topMover = this.trendingStocks.sort((a, b) => parseFloat(b.close) - parseFloat(a.close));
        this.topMover = this.topMover.slice(0,10);

        this.topMover.forEach(element => {
          element.priceChange = '';
          element.close = element.price;
          element.changeInPrice = 0;
          element.changeInPercentage = 0;
          if (element.changes > 0) {
            element.priceChange = 'up';
            element.changeInPrice = element.changes;
            element.changeInPercentage = ((element.changes) / element.price * 100);
          } else if(element.changes < 0) {
            element.priceChange = 'down';
            element.changeInPrice = element.changes;
            element.changeInPercentage = ((element.changes) / element.price * 100);
          }
        });
      }


        if (this.type == 'all' || this.type == 'mover') {
        this.trendingStocks = res.actives;
        this.mostTalkedOfDay = this.trendingStocks;
        // this.mostTalkedOfDay = this.trendingStocks.sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));
        this.mostTalkedOfDay = this.mostTalkedOfDay.slice(0,10);

        this.mostTalkedOfDay.forEach(element => {
          element.priceChange = '';
          element.close = element.price;
          element.changeInPrice = 0;
          element.changeInPercentage = 0;
          if (element.changes > 0) {
            element.priceChange = 'up';
            element.changeInPrice = element.changes;
            element.changeInPercentage = ((element.changes) / element.price * 100);
          } else if(element.changes < 0) {
            element.priceChange = 'down';
            element.changeInPrice = element.changes;
            element.changeInPercentage = ((element.changes) / element.price * 100);
          }
        });
      }
      });

  }

  marketNews:any = [];


  getNews()
  {
    this.dataService.getNews()
      .subscribe(res => {
        this.marketNews = res.news;
      });
  }


}
