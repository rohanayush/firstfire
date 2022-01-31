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
  // army.indexOf("Marcos") !== -1)  
  keys = []
  constructor(private usersService: UserService) {
    this.usersService.getuser().subscribe(
      (data: any) => {
        console.log("getting all users", data);
        this.record = data;
        // var a={}
        for (var i in this.record) {
          this.a[this.record[i].username] = this.record[i].password;
          // this.user_pass.push
          this.b[this.record[i].username] = this.record[i].key;
          this.keys.push(this.record[i].key)
          this.emails.push(this.record[i].email)

        }

        console.log("this.a", this.a)

      },
      (err: any) => {
        console.log("error in getting all users", err);
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
    // this.link_verify=!this.link_verify;
  }
  switch() {
    this.sign = !this.sign;
    this.verify = false;
    this.msging = false;
    if (!this.sign) {
      this.usersService.getuser().subscribe(
        (data: any) => {
          this.record = data;
          console.log(this.record);

        }
      )
    }
  }
  logout() {
    localStorage.setItem('key', "");
    console.log("key", localStorage.getItem('key'));
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


  onSignUp() {
    this.err = false;
    if (this.user.password != '' && this.user.username != '' && this.user.email != "") {
      alert(this.user.email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
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
        while (this.token.length === 0) {
          var key = (Math.random() + 1).toString(36).substring(7);
          if (this.keys.indexOf(key) === -1) {
            this.token = key;
          }
        }
        this.verify = true;

        this.usersService.verifyUser(this.token, this.user.email).subscribe(
          (data: any) => {
            console.log(data);
            this.message = "A code has been mailed to you email Id ," + this.user.email + " Please write that code to verify";
            this.msging = true;
          },
          (err: any) => {
            console.log("error in sending token", err);
          }
        )

      }
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
      console.log("username caught", this.username);
      this.key = this.b[this.username];
      console.log("user token :", this.key)
      this.usersService.setUsername(this.username);
      this.usersService.setKey(this.key);
      localStorage.setItem("key", this.key)
      localStorage.setItem("usr", this.username)   

      this.signin_msg = true;
    }
  }

}
