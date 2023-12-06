import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-choose-language',
  templateUrl: './choose-language.page.html',
  styleUrls: ['./choose-language.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class ChooseLanguagePage implements OnInit {

  constructor(private app: AppComponent) { }

  ngOnInit() {
    this.app.shouldShowTabs$.next(false);
  }



}
