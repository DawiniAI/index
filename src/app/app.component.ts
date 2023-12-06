import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { MedicationsService } from './services/medications.service';
import { StorageService } from './services/storage.service';
import { tabs } from './data/tabs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, TranslateModule],
})
export class AppComponent {
  tabs = tabs;
  tabActive$ = new BehaviorSubject(this.tabs[0].tab);
  shouldShowTabs$ = new BehaviorSubject(true);
  medicationService = inject(MedicationsService);
  storage = inject(StorageService);
  translate = inject(TranslateService);
  platform = inject(Platform);
  authService = inject(AuthService);
  router = inject(Router);
  constructor() {
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  async ngOnInit() {
    //display splash screen
    this.router.navigate(['/splash']);
    //prepare storage
    await this.storage.init();
    //prepare current data
    await this.medicationService.getMedications();
    //prepare latest data
    await this.prepareLatestData();
    //init google login
    this.platform.ready().then(() => {
      GoogleAuth.initialize({
        clientId: environment.google.clientId,
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
    });
    //get user from storage
    const user = await this.storage.get('user');
    if (user) {
      this.authService.userDetails = user;
      this.authService.userDetails$.next(user);
      console.log('got user from storage');
    }
  }

  async prepareLatestData() {
    const remoteVersion = await this.medicationService.getCurrentAPIVersion();
    const localVersion =
      (await this.storage.get('current-api-version')) || 'v5';
    const remoteVersionNumber = remoteVersion?.data?.version?.split('v')[1];
    const localVersionNumber = localVersion?.data?.version?.split('v')[1];
    console.log('remoteVersionNumber', remoteVersionNumber);
    console.log('localVersionNumber', localVersionNumber);
    if (
      remoteVersionNumber &&
      localVersionNumber &&
      remoteVersionNumber > localVersionNumber
    ) {
      await this.medicationService.getMedicationsFromFirebaseAndSaveToLocalStorage();
      console.log('updated');
    } else {
      console.log('no need to update');
      //prepare data;
      this.medicationService.getMedications();
    }
    this.storage.set('current-api-version', remoteVersion);
  }
}
