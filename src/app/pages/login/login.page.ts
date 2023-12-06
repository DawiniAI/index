import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, Platform } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class LoginPage implements OnInit {
  error = '';
  disabled = false;
  devMode = !environment.production;
  constructor(
    private app: AppComponent,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.app.shouldShowTabs$.next(false);
    if(navigator.userAgent.includes('FBAN') || navigator.userAgent.includes('FBAV') || navigator.userAgent.includes('Messenger')){
      this.error = 'Please open this app in a browser'
      this.disabled = true;
    }else{
      this.disabled = false;
    }

  }

  async signInWithGoogle() {
    const user = await this.authService.signinWithGoogle();
    if (user) {
      this.authService.saveUserDataToStorage(user);
      //navigate to search page
      this.app.tabActive$.next('search');
      this.router.navigate(['search']);
    }
  }

  async signInAnonymously(){
    const user = await this.authService.signInAnonymously()
    if(user){
      const guestUser:any = {
        displayName: 'Guest',
        email: '',
        photoURL: '',
        uid: user.user.uid,
      }
      this.authService.saveUserDataToStorage(guestUser);
      //navigate to search page
      this.app.tabActive$.next('search');
      this.router.navigate(['search']);
    }

  }

  async fakeSignIn(){
    const user = await this.authService.fakeSignIn();
    if(user){
      this.authService.saveUserDataToStorage(user);
      //navigate to search page
      this.app.tabActive$.next('search');
      this.router.navigate(['search']);
    }
  }
}
