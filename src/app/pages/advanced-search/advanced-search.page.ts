import { Component, NgZone, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/services/auth.service';
import { MedicationCardComponent } from 'src/app/components/medication-card/medication-card.component';
import { Medication } from 'src/app/models/medication';
import { MedicationsService } from 'src/app/services/medications.service';
import { toEnglishName } from 'src/app/utlities/toEn';

@Component({
  selector: 'app-advanced-search',
  templateUrl: 'advanced-search.page.html',
  styleUrls: ['advanced-search.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    MedicationCardComponent,
    RouterModule,
  ],
})
export class AdvancedSearchPage {
  userType: string = 'Doctor';
  searchType: string = 'Trade Name';
  medicationService = inject(MedicationsService);
  searchTerm: string = '';
  searchTerm$ = new Subject<string>();
  searchResults: Medication[] = [];
  ngZone = inject(NgZone);
  suggestedTerm = '';
  aiResults: Medication[] = [];
  app = inject(AppComponent);
  authService = inject(AuthService);
  userName: string = '';
  userImg: string = '';
  greeting: string = '';
  route = inject(ActivatedRoute);
  constructor() {}

  async ngOnInit() {
    this.prepareUI();
    this.initSearch();
  }

  pinFormatter(value: number) {
    const total = 500
    const val = Math.round(value * total / 100)
    return val;
  }

  initSearch() {
    this.searchTerm$.subscribe(async (searchTerm) => {
      if (searchTerm && searchTerm.length > 3) {
        if (this.searchTerm.match(/^[\u0621-\u064A]+/)) {
          //Arabic Search Term
          let arabicSearchTermConvertedToEnglish = toEnglishName(
            this.searchTerm
          );
          console.log(
            'arabicSearchTermConvertedToEnglish',
            arabicSearchTermConvertedToEnglish
          );
          this.searchResults = await this.medicationService.searchMedications(
            arabicSearchTermConvertedToEnglish
          );
          if (this.searchResults.length === 0) {
            this.aiResults = await this.medicationService.getClosestMedications(
              arabicSearchTermConvertedToEnglish,
              0.35,
              15
            );
            if (this.aiResults.length > 0) {
              this.suggestedTerm = this.aiResults[0].tradename;
            }
          }
        } else {
          //Normal English Search Term
          this.searchResults = await this.medicationService.searchMedications(
            searchTerm
          );
          if (this.searchResults.length === 0) {
            this.aiResults = await this.medicationService.getClosestMedications(
              searchTerm
            );
            if (this.aiResults.length > 0) {
              this.suggestedTerm = this.aiResults[0].tradename;
            }
          }
        }
      } else {
        this.searchResults = [];
      }
    });
  }

  shouldShowYouCanSearchNow() {
    return this.searchTerm.length <= 3 && this.searchResults.length === 0;
  }

  onSearchInput(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.searchTerm$.next(this.searchTerm);
  }

  prepareUI() {
    this.app.shouldShowTabs$.next(false);
    this.greeting = this.getGreeting();
    this.getUserName();
    this.getUserPicture();
    this.route.queryParams.subscribe(async (params) => {
      const query = params['q'];
      const filter = params['filter'];
      if (query && filter) {
        this.searchResults = await this.medicationService.searchMedications(
          query,
          filter
        );
      }
    });
  }

  getUserPicture() {
    this.authService.userDetails$.subscribe((user) => {
      if (user && user.photoURL) {
        this.userImg = user.photoURL;
      } else {
        this.userImg = 'assets/icons/logo-transparent.png';
      }
    });
  }

  getUserName() {
    this.authService.userDetails$.subscribe((user) => {
      if (user && user.displayName) {
        this.userName = user.displayName.split(' ')[0];
      } else {
        this.userName = 'Guest';
      }
    });
  }
  getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  }

  getMedicationImg(medication: Medication) {
    return this.ngZone.runOutsideAngular(() => {
      return this.medicationService.getMedicationPicture(medication);
    });
  }
}
