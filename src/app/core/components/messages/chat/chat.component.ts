import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthenticationService, DataService } from 'src/app/core/services';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-chat',
  host: {
    '(document:keydown)': 'onKeydown($event)',
  },
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  username: string;
  messages: any;
  message: string = '';
  chat_id: string;
  sender_id: string;
  receiver_id: string;
  storageData = this.authenticationService.currentUserValue;

  constructor(
    private activated_route: ActivatedRoute,
    private dataService: DataService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private router: Router,
    private db: AngularFirestore) {

    this.username = this.activated_route.snapshot.paramMap.get('username');
    this.chat_id = this.activated_route.snapshot.paramMap.get('chat_id');
    this.sender_id = this.activated_route.snapshot.paramMap.get('sender_id');
    this.receiver_id = this.activated_route.snapshot.paramMap.get('receiver_id');


  }


  ngOnInit(): void {


    if (this.chat_id == 'start') {
      this.startNewChat(this.sender_id,this.receiver_id);
    }
    this.getChat();
  }


  startNewChat(sender_id, receiver_id) {
  }

  getChat() {

    this.db.doc<any>(`chats/${this.chat_id}`).collection<any>('messages', ref =>
      ref.orderBy('sentAt')).valueChanges().subscribe(data => {

      this.messages = data;

        setTimeout(() => {
        var elem = document.getElementById('chat-area');
        if (elem != null) {
          elem.scrollTop = elem.scrollHeight;
        }
        }, 1);

    });

  }

  onKeydown(event) {
    if (event.keyCode === 13) {
      this.sendMessage();
    }
  }

  sendMessage() {


    this.messageService.create(this.chat_id,this.sender_id,this.receiver_id,
      { sentBy: this.storageData['id'], messageText: this.message, sentAt: Date.now() });
      this.message = '';
  }
  deleteChat() {
    this.messageService.deleteChat(this.chat_id);
    this.router.navigate(['/messages']);
  }

}
