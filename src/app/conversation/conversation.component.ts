import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';
import { ConversationService } from '../services/conversation.service';
import { AuthenticationService } from '../services/authentication.service';
import { componentNeedsResolution } from '@angular/core/src/metadata/resource_loading';
import { AngularFireStorage } from 'angularfire2/storage';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  friendId: any;
  friend: User;
  user: User;
  conversation_id: string;
  textMessage: string;
  conversation: any = [];
  shake: boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  picture: any;
  // price: number =  78.21654864;
  // today: any = Date.now();

  constructor(private activatedRoute: ActivatedRoute, 
              private userService: UserService,
              private conversationService: ConversationService,
              private authenticationService: AuthenticationService,
              private firebaseStorage: AngularFireStorage) {
    this.friendId = activatedRoute.snapshot.params['uid'];
    
    
    this.authenticationService.getStatus().subscribe(
      (session) => {
        this.userService.getFriendByid(session.uid).valueChanges().subscribe(
          (data: User) => {
            this.user = data;

            this.userService.getFriendByid(this.friendId).valueChanges().
            subscribe((data: User) => {
              this.friend = data;

              const ids = [this.user.uid, this.friend.uid].sort();
              this.conversation_id = ids.join('|');

              this.getConversation();

            }, (error) => {
              console.log(error);
            });
        })
      },
      (error) => {
        console.log(error);
      })
   }

  ngOnInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
} 

  sendMessage() {
    const message = {
      uid: this.conversation_id,
      timestamp: Date.now(),
      text: this.textMessage,
      sender: this.user.uid,
      receiver: this.friend.uid,
      type: 'text'
    }
    this.conversationService.createConversation(message).then(() => {
      this.textMessage = '';
    });

  }

  sendImage() {
    if(this.croppedImage) {
      const currentPictureId = Date.now();
      const pictures = this.firebaseStorage.ref('pictures/' + currentPictureId + '.jpg')
                       .putString(this.croppedImage, 'data_url');
      pictures.then((result) => {
        this.picture = this.firebaseStorage.ref('pictures/' + currentPictureId + '.jpg')
                       .getDownloadURL();
        this.picture.subscribe((pictureUrl) => {
                         console.log(pictureUrl);

                         const message = {
                          uid: this.conversation_id,
                          timestamp: Date.now(),
                          text: null,
                          sender: this.user.uid,
                          receiver: this.friend.uid,
                          url: pictureUrl,
                          type: 'image'
                          };

                          this.conversationService.createConversation(message).then(() => {
                              console.log('image uploaded just fine');
                              this.croppedImage = '';
                              this.scrollToBottom();  
                          });

                         });                 
          });
    }
  }
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
  }
  imageLoaded() {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }

  sendZumbido() {
    const message = {
      uid: this.conversation_id,
      timestamp: Date.now(),
      text: null,
      sender: this.user.uid,
      receiver: this.friend.uid,
      type: 'zumbido'
    }
    this.conversationService.createConversation(message).then(() => {
      this.doZumbido();
      this.scrollToBottom();
     });

  }

  doZumbido(){
    const audio = new Audio('assets/sound/zumbido.m4a');
    audio.play();
    this.shake = true;
    window.setTimeout(() => {
      this.shake = false;
    }, 1000);
  }

  getConversation() {
    this.conversationService.getConversation(this.conversation_id).valueChanges().subscribe(
      (data) => {
        this.conversation = data;
        this.conversation.forEach(message => {
          if(!message.seen) {
            if(message.type == "text") {
              const audio = new Audio('assets/sound/new_message.m4a');
              audio.play();
            } else if(message.type == "zumbido") {
              this.doZumbido();
            }
            message.seen = true;
            this.conversationService.editConversation(message);            

          } else {

          }
        });
      },
      (error) => {
        console.log(error);
      })
      this.scrollToBottom();
  }

  getUserNickById(id) {
    if(id === this.friend.uid) {
      return this.friend.nick;
    }
    else {
      return this.user.nick;
    }
  }

  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
}

}
