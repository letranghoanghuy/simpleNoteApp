import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import User, { Note } from '../models/user.model';
import { DataService } from '../services/data.service';
import { map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [MessageService]
})
export class HomeComponent implements OnInit {
  login: string;
  users: User[];
  user: User = new User();
  newArr: Note[] = [];

  note: Note = new Note();
  selectedNote: Note | undefined;
  submitted = false;

  currentNote: Note = {
    title: '',
    content: '',
    date: ''
  }

  public popoverTitle: string = 'Xóa';
  public popoverMessage: string = 'Bạn có muốn xóa không?';
  confirmClicked = false;
  cancelClicked = false;

  constructor(private router: Router, private dataService: DataService, private message: MessageService) {
    this.user.name = localStorage.getItem('name');
    this.user.code = localStorage.getItem('key');
  }

  ngOnInit(): void {
    this.login = localStorage.getItem('login1');
    if (this.login == 'false' || this.login == undefined) {
      this.router.navigate(['/login']);
    }
    this.retrieveUsers();
  }

  public retrieveUsers(): void {
    this.dataService.getAllUsers().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.users = data;
      for (let i of this.users) {
        if (i.name == this.user.name && i.code == this.user.code) {
          this.user = i;
          this.dataService.getAllNotes(this.user.key).snapshotChanges().pipe(
            map(changes =>
              changes.map(c =>
                ({ key: c.payload.key, ...c.payload.val() })
              )
            )
          ).subscribe(data => {
            // this.user.notes = data;
            this.newArr = data
          });
        }
      }
    });
  }

  public viewNote(note: Note) {
    this.selectedNote = note;
  }

  public getSelectedClass(note: Note): string {
    if (!this.selectedNote) {
      return "";
    }
    return this.selectedNote.key === note.key ? 'selected' : 'notSelected';
  }

  public saveNote(key: string, key1: string): void {
    if (this.note.key == undefined) {
      this.dataService.createNote(this.note, key).then(() => {
        this.submitted = true;
        this.message.add({
          severity: 'success',
          summary: 'success',
          detail: 'Thêm thành công'
        })
      })
    }
    else {
      const data = {
        title: this.note.title,
        content: this.note.content,
        date: this.note.date
      }
      this.dataService.updateNote(key, key1, data).then(() => {
        this.submitted = true;
        this.message.add({
          severity: 'success',
          summary: 'success',
          detail: 'Cập nhật thành công'
        })
      })
        .catch(err => console.log(err));
    }
  }

  public newNote(): void {
    this.submitted = false;
    this.note = {
      title: '',
      content: '',
      date: '',
    };
  }

  public setActiveNote(note: Note): void {
    this.submitted = false;
    this.currentNote = { ...note };
    // console.log(this.currentNote);
    this.note.key = this.currentNote.key;
    this.note.title = this.currentNote.title;
    this.note.content = this.currentNote.content;
    this.note.date = this.currentNote.date;
  }

  public deleteNote(key: string, key1: string): void {
    this.dataService.deleteNote(key, key1)
      .then(() => {
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'delete',
          detail: 'Đã xóa'
        })
      })
      .catch(err => console.log(err));
  }

  public logout(): void {
    localStorage.setItem('login1', 'false');
    this.router.navigate(['/login']);
  }

  public updateImg(key: string): void {
    const data = {
      image: this.user.image
    }
    this.dataService.updateUser(key, data).then(() => this.message.add({
      severity: 'success',
      summary: 'success',
      detail: 'Cập nhật thành công'
    }))
      .catch(err => console.log(err));
  }
}
