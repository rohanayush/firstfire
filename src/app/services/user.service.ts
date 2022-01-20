import { Injectable } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from  './../models/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  userCollection: AngularFirestoreCollection<User>;
  user:Observable<User[]>; 
  userDoc:AngularFirestoreDocument<User>;
  url="https://firstfire-signup.herokuapp.com/";
  key:string="";
  username:string=""
  constructor(public afs: AngularFirestore, private http:HttpClient) { 
    this.userCollection = this.afs.collection<User>('logg');
    //this.user = this.userCollection.valueChanges();
    this.user=this.userCollection.snapshotChanges().pipe(map(
      changes => {
        return changes.map(a =>{
          const data = a.payload.doc.data() as User;
          data.id  = a.payload.doc.id;
          // console.log("token if any",a.payload.doc.token);
          console.log("constrcutor sevice:data",data);
          return data;
        });
      })
    );
  }
  getKey(){
    return this.key;
  } 
  
  setKey(key){
    this.key=key;
  } 
  
  setUsername(usr){
    this.username=usr;
  } 
  getUsername(){
    return this.username;
  }
  getuser(){ 
    return this.user;
  }


  verifyUser(token,email){
       var url= this.url +"/suggest";
       var ar=[]
       ar.push(token)
       ar.push(email)
    return this.http.post(url,token+"+"+email);
  }

  addUsers(user: User){
    this.userCollection.add(user);
  }
  delete(user:User){
    this.userDoc = this.afs.doc(`logg/${user.id}`);
    this.userDoc.delete();

  }
  update(user:User){
    this.userDoc = this.afs.doc(`logg/${user.id}`);
    this.userDoc.update(user); 
  } 
}
