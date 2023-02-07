import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService, DataService } from '../../services';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/message.model';
import { map } from 'rxjs/operators';
import { Chat } from 'src/app/models/chat.model';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})


export class MessagesComponent implements OnInit {
  messages: Chat[];
  title = '';
  showChat: boolean = false;
  userDoc: AngularFirestoreDocument<any>;
  messagesData: any[];
  storageData = this.authenticationService.currentUserValue;
  constructor(private dataService: DataService,
    private authenticationService: AuthenticationService,
    private activate_route: ActivatedRoute,
    private messageService: MessageService,
    private db: AngularFirestore,
    ) {

  }

  ngOnInit(): void {
    this.retrieveTutorials();
  }

  ngOnchanges() {
    console.log('hi, im from message component');
  }

  showChatFunc() {
  this.showChat = !this.showChat;
  //console.log(this.showChat);
  }


  refreshList(): void {
    this.retrieveTutorials();
  }
  retrieveTutorials(): void {


    this.messageService.
    getAll(this.storageData['id']).
    snapshotChanges().
    subscribe(data => {
      // this.messages = data;
      // console.log(data)
      this.messages = [];
       data.forEach(c =>
          {
         this.getLastMessage(c.payload.doc.id);
         this.messages[c.payload.doc.id] = [];
         this.messages[c.payload.doc.id]['data'] = {
           id: c.payload.doc.id,...c.payload.doc.data()
         };
          }
          )


          let msgData = this.messages;
          this.messagesData = Object.keys(msgData).map(function (personNamedIndex) {
          let person = msgData[personNamedIndex];
          return person;
          });

          console.log(this.messagesData)

    });


  }
  getLastMessage(id: string): any {
    return this.db.doc<any>(`chats/${id}`).collection<any>('messages',ref=>ref.orderBy('sentAt','desc').limit(1)).valueChanges().subscribe(data => {
      data.forEach(d => {
        this.messages[id]['recentMessage'] = d;
      });
    });

  }



}
