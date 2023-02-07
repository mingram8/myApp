import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { DataService } from '../../../core/services';

@Component({
  selector: 'app-sidebar-market-news',
  templateUrl: './sidebar-market-news.component.html',
  styleUrls: ['./sidebar-market-news.component.css']
})
export class SidebarMarketNewsComponent implements OnInit {
  //@Input() marketNews;
  marketNews:any = [];
  topMover:any = [];
  topLoser:any = [];
  mostTalkedOfDay:any = [];
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getNews();
  }

  getNews()
  {
    this.dataService.getNews()
      .subscribe(res => {
        this.marketNews = res.news;
      });
  }

}
