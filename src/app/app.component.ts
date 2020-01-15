import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { User } from './interfaces/user';
import { UserService } from './services/user.service';
import { RequestsService } from './services/requests.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { RequestComponent } from './modals/request/request.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'platzinger';
  user: User;
  request: any[] = [];
  mailsShown: any = [];

  constructor(public router: Router, 
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private requestService: RequestsService,
              private dialogService: DialogService ) {

    this.authenticationService.getStatus().subscribe(
      (status) => {
        this.userService.getFriendByid(status.uid).valueChanges().subscribe(
          (data: User) => {
            this.user = data;
            this.requestService.getRequestsForEmail(this.user.email).valueChanges()
            .subscribe((requests) => {
              this.request = requests;
              this.request = this.request.filter((request) => {
                return request.status !== 'accepted' && request.status !== 'rejected';
              });
              this.request.forEach((r) => {
                if(this.mailsShown.indexOf(r.sender) === -1) {
                  this.mailsShown.push(r.sender);
                  this.dialogService.addDialog(RequestComponent, {scope: this, currentRequest: r});
                }
              })
            }, (error) => {
              console.log(error);
            })
          }, (error) => {
            console.log(error);
          })
      })            
    
  }
}
