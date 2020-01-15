import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class UserService {
friends: User[];

constructor(private angularFireBatabase: AngularFireDatabase) {
    // let users = [
    //   {uid: 1,nick: 'Eduardo', subnick: 'Mi mensaje personal', status: 'online', age: 28, email: 'eduardo@platzi.com', friend: true},
    //   {uid: 2,nick: 'Yuliana', subnick: 'Mi mensaje personal', status: 'busy', age: 25, email: 'yuliana@platzi.com', friend: true},
    //   {uid: 3,nick: 'Freddy', subnick: 'Mi mensaje personal', status: 'away', age: 28, email: 'freddy@platzi.com', friend: false},
    //   {uid: 4,nick: 'William', subnick: 'Pedro', age: 27, email: 'aer@are.com.co', status: "offline", friend: true}
    // ];
    // this.friends = users;


   }

   
  getUser(){
    return this.angularFireBatabase.list('/users');   
  }

  getFriendByid(uid) {
    return this.angularFireBatabase.object('/users/' + uid);
  }

  createUser(user) {
    return this.angularFireBatabase.object('/users/' + user.uid).set(user);
  }

  editUser(user) {
    return this.angularFireBatabase.object('/users/' + user.uid).set(user);
  }

  setAvatar(avatar, user) {
    this.editUser(user);
    return this.angularFireBatabase.object('/users/' + user.uid + '/avatar').set(avatar);   
  }

  addFriend(userId, friendId) {
    this.angularFireBatabase.object('users/' + userId + '/friends/' + friendId).set(friendId);
    return this.angularFireBatabase.object('users/' + friendId + '/friends/' + userId).set(userId);
  }

  //  getFriends() {
  //    return this.friends;
  //  }

  //  getFriendByid(uid) {
  //    return this.friends.find(user => user.uid = uid);
  //  }
}
