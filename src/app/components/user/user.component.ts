import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { User } from './../../models/User';
import { UserService } from "./../../services/user.service";
import { AddNotesComponent } from '../add-notes/add-notes.component';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  // get everything on clients side to improve speed
  user: User = {
    id: "",
    email: "",
    username: "",
    key: "",
    time: "",
    password: ""
  }
  @ViewChild(AddNotesComponent, { static: false }) msg1: AddNotesComponent;
  @ViewChild(AddNotesComponent, { static: false }) msg2: AddNotesComponent;
  link_verify: boolean;

  ngAfterViewInit() { }

  record: User[] = [];
  token = ""
  user_pass = []
  emails = []
  a = {}
  b = {}
  c={}
  // army.indexOf("Marcos") !== -1)  
  keys = []
  constructor(private usersService: UserService) {
    this.usersService.getuser().subscribe(
      (data: any) => {
        this.record = data;
        for (var i in this.record) {
          this.a[this.record[i].username] = this.record[i].password;
          this.b[this.record[i].username] = this.record[i].key;
          this.c[this.record[i].email] = this.record[i].username;
          
          this.keys.push(this.record[i].key)
          this.emails.push(this.record[i].email)
        }

    


      },
      (err: any) => {
      }
    )

  }


  ngOnInit(): void {
  }
  message = ""
  msging: boolean;
  dismissMsg() {
    this.msging = false;
  }
  sign: boolean = true;// for signup
  dismiss_verify() {
    this.verify = !this.verify;
    this.sign=true;
    // this.link_verify=!this.link_verify;
  }
  switch() {
    this.sign = !this.sign;
    this.verify = false;
    this.msging = false;
    this.user={};
    
    if (!this.sign) {
      this.usersService.getuser().subscribe(
        (data: any) => {
          this.record = data;

        }
      )
    }
  }
  logout() {
    localStorage.setItem('key', "");
  }
  verify: boolean = false;

  /**
   * 
   * 
   * return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
   * 
   */

load=false;
  onSignUp() {

    this.err = false;
    this.msging=false;
    this.verify=false;
    if (this.user.password != '' && this.user.username != '' && this.user.email != "") {
      if (!this.user.email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        // alert("The email is already registered!")
        this.message = "The email  is invalid! Please check";
        this.msging = true;
        this.err = true;


      }
      else if (this.user.username.length < 5) {
        // alert("Everthing is fine but password length should be greater than or 5")
        this.message = "Username length should be greater than or 5"
        this.msging = true;
        this.err = true;
      }
      else if (this.user.password.length < 5) {
        // alert("Everthing is fine but password length should be greater than or 5")
        this.message = "Everthing is fine but password length should be greater than or 5"
        this.msging = true;
        this.err = true;

      }
      else if (this.emails.indexOf(this.user.email) !== -1) {
        // alert("The email is already registered!")
        this.message = "The email is already registered!";
        this.msging = true;
        this.err = true;

      }


      else if (this.user.username.length >= 5 && this.user.password.length >= 5 && this.emails.indexOf(this.user.email) === -1 && this.user.email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
       this.load=true;
        while (this.token.length === 0) {
          var key = (Math.random() + 1).toString(36).substring(7);
          if (this.keys.indexOf(key) === -1) {
            this.token = key;
          }
        }
        this.err=false;
        this.verify =false;
        


        this.usersService.verifyUser(this.token, this.user.email).subscribe(
          (data: any) => {
            this.msging = true;
            this.verify=true;
       this.load=false;

          },
          (err: any) => {
          }
        )

      }
    }

  }
  mail_box=false;
  mail_verify(){
      this.mail_box=true;
      this.user.email='';
  }
  mail_verify1(){
    this.mail_box=false;
    this.verify=false;
    this.verify1=false;
    this.signin_msg=false;

}
verify1=false;
help_login(){
  this.username = "";
  this.key = "";
  if (this.user.key === this.token) {
    this.username =this.c[this.user.email];
    // this.key=this.b[this.username];
    this.key=this.b[this.username];

    this.usersService.setUsername(this.username);
    this.usersService.setKey(this.key);
    

   
    this.user.email = '';
    this.user.password = '';
    this.user.username = '';
    this.signin_msg = true;
    this.verify1 = false;
    // alert("key matched and verified!");

  }
}
  enter_account(email){
    var key = (Math.random() + 1).toString(36).substring(7);
    this.load=true;
    console.log("reached",this.user.email)
    if (!this.user.email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      // alert("The email is already registered!")
      this.message = "The email  is invalid! Please check";
      this.msging = true;
      this.err = true;
      this.load=false;
      this.verify1=true;
    }
    else if(this.user.email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
    this.token=key;
      this.usersService.verifyUser(key, email).subscribe(
      (data: any) => {
        this.message = "A Verification code has been mailed at your email Id- " + this.user.email + " Please apply the code to verify";
        this.msging = true;
   this.load=false;
   this.mail_box=false;
   this.verify1=true;
      },
    )
    }
    
  }

  err: boolean;
  verify_key() {
    this.username = "";
    this.key = "";
    if (this.user.key === this.token) {
      this.username = this.user.username;
      // console.log("username caught",this.username);
      // this.key=this.b[this.username];
      // console.log("user token :",this.key)
      this.usersService.setUsername(this.username);
      this.usersService.setKey(this.key);
      // this.user.token = this.token;
      this.user.key = this.token;
      this.key = this.user.key;

      this.user.time = Date.now().toString();
      this.usersService.addUsers(this.user);
      this.user.email = '';
      this.user.password = '';
      this.user.username = '';
      this.signin_msg = true;
      this.verify = false;
      // alert("key matched and verified!");

    }
  }
  username = ""
  key = ""
  signin_msg = false;
  onSignIn() {
    // this.username="";
    // this.key="";
    if (this.a[this.user.username] === this.user.password) {
      this.username = this.user.username;
      this.key = this.b[this.username];
      this.usersService.setUsername(this.username);
      this.usersService.setKey(this.key);
      localStorage.setItem("key", this.key)
      localStorage.setItem("usr", this.username)

      this.signin_msg = true;
    }
    else if(this.a[this.user.username] !== this.user.password){
      this.message="Username and password doesn't match";
      this.msging=true;
      this.err=true;
      this.signin_msg = false;

    }
  }

}
