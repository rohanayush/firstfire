import { Injectable } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Notes } from  '../models/Notes';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { stringify } from 'querystring';
@Injectable({
  providedIn: 'root'
})
export class NotesService {
  url="https://firstfire-recommend.herokuapp.com"
  notesCollection: AngularFirestoreCollection<Notes>;
  notes:Observable<Notes[]>;
  notesDoc:AngularFirestoreDocument<Notes>;

  constructor(public afs: AngularFirestore, private http:HttpClient) { 
    this.notesCollection = this.afs.collection<Notes>('naya');
    //this.notes = this.notesCollection.valueChanges();
    this.notes=this.notesCollection.snapshotChanges().pipe(map(
      changes => {
        return changes.map(a =>{
          const data = a.payload.doc.data() as Notes;
          data.id  = a.payload.doc.id;
          // console.log("token if any",a.payload.doc.token);
          console.log("constrcutor sevice:data",data);
          return data;
        });
      })
    );
  }

  getRecommendation(note){
    console.log("reaching service", note)
    if(note.length===0){
      var a=["a"]
      return this.http.post(this.url+"/recommend",a);
    }
    return this.http.post(this.url+"/recommend",note);
  }
  getNotes(){
    return this.notes;
  }

  addNotes(note: Notes){
    this.notesCollection.add(note);
  }
  delete(note:Notes){
    this.notesDoc = this.afs.doc(`naya/${note.id}`);
    this.notesDoc.delete();

  }
  update(note:Notes){
    this.notesDoc = this.afs.doc(`naya/${note.id}`);
    this.notesDoc.update(note);
  }
}
