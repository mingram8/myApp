import { Component, OnInit, AfterViewInit, ViewChild, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, DataService } from "../../services";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  //marketNews:any = [];
  page = {
    title: 'Home',
    subtitle: 'Welcome Home!',
    content: 'Some home content.',
  };

  inputContent: any
  post_id: any
  reply_input: any
  postsData: any = [];
  showData: boolean;
  @Output() stock = "";



  constructor(private router: Router, private activatedRoute: ActivatedRoute, private authenticationService: AuthenticationService, private dataService: DataService) {
  }
  // isReply : boolean;
  ngOnInit(): void {

  }







}
