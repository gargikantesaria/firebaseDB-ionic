import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  itemRef: AngularFireObject<any>;
  item: Observable<any>;
  name; displayDetail; Updatedname;ref;

  constructor(public navCtrl: NavController,  public afDB: AngularFireDatabase) {
    this.itemRef = afDB.object('item');
    this.ref = this.afDB.database.ref('/item');
    this.ref.on('child_added', (res) => { console.log(" from child_add", res) })
    this.ref.on('child_changed', (res) => { console.log("child changed", res) });
    this.ref.on('child_moved', (res) => console.log("child_moved",res));
    this.ref.on('child_removed', (res) => { console.log("Child_removed", res)});
    this.getDetails();  
  }

  updateData(add, updatedName){
    this.afDB.list('/item').snapshotChanges().subscribe((res) => {
      res.forEach((ele:any) => {
        if(ele.payload.val().name == add) {
           this.afDB.list('/item').update(ele.key,{ name: updatedName }).then(() => {
            this.Updatedname = "";
            this.name = "";
            add = "";
            updatedName = "";
           })
        }
      });
    });
  }

  addData(addName) {
    this.ref.push({ name: addName }).then(() =>{ this.name = ""; addName =""; })  
  }

  deleteData(removeName){

    this.afDB.list('/item').snapshotChanges().subscribe((res) => {
      res.forEach((ele:any) => {
        if(ele.payload.val().name == removeName) {
           this.afDB.list('/item').remove(ele.key).then(() => {
            this.Updatedname = "";
            this.name = "";
            removeName = "";
           })
        }
      });
    });
  }

  getDetails(){
    this.afDB.list('/item').snapshotChanges().subscribe((res) => {
      let tempArray:any = [];
      res.forEach((ele) => {
        tempArray.push(ele.payload.val())
      });
      this.displayDetail = tempArray;
    })
  }
 
}
