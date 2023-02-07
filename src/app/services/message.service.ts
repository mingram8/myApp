import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

import { Message } from '../models/message.model';
import { Chat } from "../models/chat.model";
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private dbPath = '/chats';
  messagesRef: AngularFirestoreCollection<Chat[]>;
  constructor(private db: AngularFirestore) {
    this.messagesRef = db.collection(this.dbPath);
  }
  getAll(id): AngularFirestoreCollection<Chat> {
    return this.db.collection('chats', ref => ref.where('users', 'array-contains', id));
  }
  create(chat_id,sender_id,receiver_id,Message: Message): any {
     // if (this.chat_id == 'start') {
        this.db.doc<any>(`chats/${chat_id}`).set({ users: [sender_id, receiver_id] });
      //   this.router.navigate([`/messages/${this.sender_id}_${this.receiver_id}/${this.sender_id}/${this.receiver_id}`]);
      // }
    return this.db.doc<any>(`chats/${chat_id}`).collection<any>('messages').add(Message);

  }

  deleteChat(chat_id) {
    this.db.doc<any>(`chats/${chat_id}`).delete();
  }

}
