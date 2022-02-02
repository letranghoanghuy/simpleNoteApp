import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import User from '../models/user.model';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: User = new User();
  users?: User[];
  login: boolean = false;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.retrieveUsers();
  }

  retrieveUsers(): void {
    this.dataService.getAllUsers().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.users = data;
    });
  }

  loginUser(): void {
    for (let i of this.users) {
      if (this.user.name == i.name && this.user.password == i.password) {
        this.user.code = i.code;
        this.login = true;
        break;
      }
      else {
        this.login = false;
      }
    }

    if (this.login == true) {
      localStorage.setItem('login1', 'true');
      alert("Đăng nhập thành công");
      localStorage.setItem('name', this.user.name);
      localStorage.setItem('key', this.user.code);
      this.router.navigate(['/home']);
    }
    else {
      alert("Sai tên đăng nhập hoặc mật khẩu")
    }

  }
}
