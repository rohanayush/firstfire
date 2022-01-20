import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNotesComponent } from './components/add-notes/add-notes.component';
import { UserComponent } from './components/user/user.component';


const routes: Routes = [
  { path:'home',component:UserComponent},
  { path:'notes',component:AddNotesComponent},
  { path:'**',component:UserComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
