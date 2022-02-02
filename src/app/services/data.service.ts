import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import User, { Note } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dbPath = "/users";
  usersRef: AngularFireList<User>;
  userRef: AngularFireObject<User>;

  private dbNotePath = '';
  notesRef: AngularFireList<Note>;

  constructor(private db: AngularFireDatabase) { 
    this.usersRef = db.list(this.dbPath);
  }

  public getAllUsers(): AngularFireList<User>{
    return this.usersRef;
  }

  public getUser(key: string){
    this.userRef = this.db.object(this.dbPath+'/'+key);
    return this.userRef;
  }

  public createUser(user: User):any{
    return this.usersRef.push(user);
  }

  public updateUser(key: string,value: any): Promise<void>{
    return this.usersRef.update(key,value);
  }

  public deleteUser(key: string): Promise<void>{
    return this.usersRef.remove(key);
  }

  public getAllNotes(key: string): AngularFireList<Note> {
    this.dbNotePath= "/users" + "/" + key +'/notes';
    this.notesRef = this.db.list(this.dbNotePath);
    return this.notesRef;
  }

  public createNote(note: Note,key: string): any {
    this.dbNotePath= "/users" + "/" + key +'/notes';
    this.notesRef = this.db.list(this.dbNotePath);
    return this.notesRef.push(note);
  }

  public updateNote(key: string, key1: string, value: any): Promise<void>{
    this.dbNotePath= "/users" + "/" + key +'/notes';
    this.notesRef = this.db.list(this.dbNotePath);
    return this.notesRef.update(key1, value);
  }

  public deleteNote(key: string, key1: string): Promise<void>{
    this.dbNotePath= "/users" + "/" + key +'/notes';
    this.notesRef = this.db.list(this.dbNotePath);
    return this.notesRef.remove(key1);
  }

}
