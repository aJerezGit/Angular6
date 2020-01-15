import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestsService } from '../services/requests.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  friends: User[];
  user: User;
  query: string = '';
  closeResult: string;
  friendEmail: string = '';

  constructor(private userService: UserService, 
              private authenticationService: AuthenticationService,
              private modalService: NgbModal, 
              private router: Router,
              private requestService: RequestsService) {
    this.authenticationService.getStatus().subscribe(
      (status) => {
        this.userService.getFriendByid(status.uid).valueChanges().subscribe(
          (data: User) => {
            this.user = data;
            if(this.user.friends){
              this.user.friends = Object.values(this.user.friends);
            }
            // console.log(this.user);
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );  
      
    this.userService.getUser().valueChanges().subscribe((data: User[]) => {
      this.friends = data;
    }), (error) => {
      console.log(error);
    }
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  sendRequest() {
    const request = {
      timestamp: Date.now(),
      receiver_email: this.friendEmail,
      sender: this.user.uid,
      status: 'pending'
    }
    this.requestService.createRequest(request).then(() => {
      alert('Sended request');
    }).catch((error) => {
      alert('There is something wrong with the request');
      console.log(error);
    })
  }

  ngOnInit() {
  }

  logOut() {
    this.authenticationService.logOut()
    .then(() => {
      alert('Session closed');
      this.router.navigate(['login']);
    })
    .catch((error) => {
      console.log(error);
    });
  }

}
