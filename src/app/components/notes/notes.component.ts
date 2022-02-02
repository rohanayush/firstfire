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
   this.token=this.user.getKey();
      this.usr=this.user.getUsername();
     this.notesService.getNotes().subscribe( 
      notes => {
      this.notes = notes;
     this.notes_user= this.notes.filter(
       (note)=>{
         return note.token == this.token;
       },
     );
     for(var i=0;i < this.notes_user.length;i++){
       this.content.push(this.notes_user[i]["content"]);
     }
     this.notesService.getRecommendation(this.content).subscribe(
       (data:any)=>{
         this.store=data;
     
         for(var i=0;i < this.store.length;i++){
            for (var j=0; j< this.store[i].articles.length;j++){
                  this.recommend.push(this.store[i].articles[j]);
                 
            }
         }
         this.recommend=this.shuffle(this.recommend)
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
  }
  update(event, note){
    this.notesService.update(note);
    this.collapse(event,note);
  }

}
