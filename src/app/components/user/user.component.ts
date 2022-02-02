import { Component, OnInit } from '@angular/core';
import { NotesService } from 'src/app/services/notes.service';
import { UserService } from 'src/app/services/user.service';
import { Notes } from '../../models/Notes';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  editState:boolean=false;
  editNote:Notes;

  notes : Notes[];
  usr=""
  token=""
  content=[]
  constructor(private notesService:NotesService, private user:UserService ) { 
    this.content=[]
    this.notes=[]
    this.token=this.user.getKey()
    console.log("token",this.token)
    this.usr=this.user.getUsername();
    console.log("user",this.usr)
    this.notes_user=[];
     this.notesService.getNotes().subscribe( 
      notes => {
      //  console.log(notes);
      console.log(notes)
      this.notes = notes;
     this.notes_user= this.notes.filter(
       (note)=>{
         return note.token == this.token;
       },
     );
     console.log("notes of user", this.notes_user)
     this.content=[];

     for(var i=0;i < this.notes_user.length;i++){
       this.content.push(this.notes_user[i]["content"]);
     }
     console.log("content:",this.content)
     this.store=[]
     this.recommend=[]
     this.notesService.cleaner(this.content).subscribe(
       (cl:any)=>{
         console.log("cleaned array",cl);
         this.content=cl;
         this.recommend=[];
         this.notesService.getRecommendation(this.content).subscribe(
          (data:any)=>{
            // console.log("data",data);
            // console.log("getting only article",data.entries);
            this.store=data;
            console.log("data", this.store);

           
        
            for(var i=0;i < this.store.length;i++){
                    if(this.store[i].entries.length>0){
                       this.recommend.push(this.store[i].entries.splice(0,6));
                     }
                    
            }
            // this.recommend=this.shuffle(this.recommend)
            console.log("this recommendations:",this.recommend);
          }
        )
       }
     )
     
  
      }
      );  
  }
  shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  notes_user1:Notes[];
  notes_user:Notes[];

  // key="abc"
  recommend=[]
  store:any;
  note_active:boolean=true;
  recommendations_active:boolean;
  rec_class(){
    this.note_active=!this.note_active;
  }
  ngOnInit() {
   
  }
  setNotes(){
    this.notes_user = this.notes_user1;
    this.notes_user1= this.notes_user;
  }
  onPencil(event, note){
        this.editState = true;
        this.editNote = note;
  }
  collapse(event,note){
    this.editState=false;
  }

  delete(event,note){
    this.notesService.delete(note);
    this.constructor();
  }
  update(event, note){
    this.notesService.update(note);
    this.collapse(event,note);
    this.constructor();
 
  }

}
