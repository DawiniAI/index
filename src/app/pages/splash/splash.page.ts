import { AppComponent } from './../../app.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  animations: [
    trigger('inOutAnimation', [
      state('inState', style({ bottom: 0, opacity: 1 })),
      state('outState', style({ bottom: -318, opacity: 0 })),
      transition('inState => outState', [animate('1s linear')]),
      transition('outState => inState', [animate('1s linear')]),
    ]),
  ],
})
export class SplashPage implements OnInit {
  constructor(
    private app: AppComponent,
    private storage: StorageService,
    private navController: NavController,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.app.shouldShowTabs$.next(false);
    await this.storage.init();
    this.authService.user$.pipe(debounceTime(2000)).subscribe(async (user) => {
      if (user) {
        this.navController.navigateRoot(['/search']);
      } else {
        this.navController.navigateRoot(['/login']);
        // await this.authService.fakeSignIn();
        // this.navController.navigateRoot(['/medication/2']);
      }
    });
  }
}
