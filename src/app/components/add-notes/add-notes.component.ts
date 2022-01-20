import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { Notes } from '../../models/Notes';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-add-notes',
  templateUrl: './add-notes.component.html',
  styleUrls: ['./add-notes.component.css']
})
export class AddNotesComponent implements OnInit {

  note: Notes = {
    title : '', 
    content:'',
    token:''
  } 
  // token=(Math.random() + 1).toString(36).substring(7);

  usr=""
  token=""
  @ViewChild('myDiv') myDiv: ElementRef<HTMLElement>;

triggerFalseClick() {
  el:ElementRef;

  console.log("token",this.token)
  if(this.token==""){
    let el: HTMLElement = this.myDiv.nativeElement;
    el.click();
  }
}
  constructor(private notesService:NotesService, private user:UserService ) { 
      this.token=localStorage.getItem("key");
      console.log("token",this.token)
      this.usr=localStorage.getItem("usr");
      console.log("user",this.usr)

      if(this.usr===""){
        this.triggerFalseClick();
      }
   }

  ngOnInit(): void {
  }
  theme:boolean=false; // false means simple or default and true means dark mode
  changeTheme(){
           this.theme=!this.theme;
  }
  msg=false;
  
  logout(){
    this.user.setKey("");
    this.user.setUsername("");
    localStorage.setItem("key","");
    localStorage.setItem("usr","");

    this.msg=true;
  }
  onSubmit(){
    if(this.note.title != '' && this.note.content!=''){
      this.note.token = this.token;
      this.notesService.addNotes(this.note);
      this.note.title='';
      this.note.content='';
    }
  }

}
