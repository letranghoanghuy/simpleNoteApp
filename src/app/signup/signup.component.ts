import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import User from '../models/user.model';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  user: User = new User();
  pass: any;

  constructor(private dataService: DataService, private router: Router) {
    this.user.code = this.makeid(10);
    this.user.image = 'https://firebasestorage.googleapis.com/v0/b/mynote-a18d6.appspot.com/o/istockphoto-1180500586-170667a.jpg?alt=media&token=a4598928-a4d7-456b-81d4-45af3aa240f1';
  }

  ngOnInit(): void {
  }

  makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
   
    return text;
  }

  public saveUser():void {
    if(this.user.password == this.pass){
      localStorage.setItem('login1', 'true');
      this.dataService.createUser(this.user).then(() => {
        alert("Đăng ký thành công");
        localStorage.setItem('name',this.user.name);
        localStorage.setItem('key',this.user.code);
        this.router.navigate(['/home']);
      })
    }
    else{
      alert('Nhập lại mật khẩu sai')
    }
  }


}
