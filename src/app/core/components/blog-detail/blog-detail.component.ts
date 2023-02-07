import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, DataService } from '../../services';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  user: any;
  blog: any;

  constructor(private activatedRoute:ActivatedRoute, private el: ElementRef, private authenticationService: AuthenticationService, private router: Router, private dataService: DataService) {
    this.user = localStorage.getItem('currentUser');
  }

  ngOnInit(): void {
    if (localStorage.getItem('currentUser')) {
      this.authenticationService.setValueOfIsLoggedInCheckSubject = true;
    }

    this.activatedRoute.paramMap.subscribe(params => {
      let id = params.get('id');

      this.getBlogDetail(id);
    });
  }
  getBlogDetail(id) {
    this.dataService.getBlogDetail(id)
      .subscribe(res => {
        this.blog = res;


      });
  }

  onComment() {

  }


}
