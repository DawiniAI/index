import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MedicationsService } from 'src/app/services/medications.service';
import { Medication } from 'src/app/models/medication';
import {
  MedicationCardComponent,
  MedicationWithPicture,
} from 'src/app/components/medication-card/medication-card.component';

@Component({
  selector: 'app-medication-details',
  templateUrl: './medication-details.page.html',
  styleUrls: ['./medication-details.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
    MedicationCardComponent,
  ],
})
export class MedicationDetailsPage implements OnInit {
  userName: string = 'John Doe';
  userImg: string =
    'https://pbs.twimg.com/profile_images/1668974811211608064/ckuhAgzW_400x400.jpg';
  userType: string = 'Pharmacist';
  medication: MedicationWithPicture = {
    id: '...',
    tradename: '...',
    activeingredient: '...',
    company: '...',
    group: '...',
    info: '...',
    form: '...',
    price: 0,
    palette: '...',
    picture: '...',
  };
  activeingredients: string[] = [];
  alternatives: MedicationWithPicture[] = [];
  similars: MedicationWithPicture[] = [];
  constructor(
    private route: ActivatedRoute,
    private medicationsService: MedicationsService
  ) {}

  async ngOnInit() {
    const medicationId = this.route.snapshot.paramMap.get('id');
    if (medicationId) {
      //TODO: enhance performance here
      console.log('medicationId', medicationId);
      this.medicationsService.getMedications().then(async (medications) => {
        const medication =
          this.medicationsService.getMedicationDetailsById(medicationId);
        if (medication) {
          this.medication = medication;
          this.medication.picture =
            (await this.medicationsService.getMedicationPicture(
              medication
            )) as string;
          this.activeingredients = medication.activeingredient.split('+');
          this.alternatives =
            this.medicationsService.getAlternativeMedications(medication);
          this.similars =
            this.medicationsService.getSimilarMedications(medication);
        }
      });
    }
  }

  getProperty(key: string): any {
    const medication = this.medication as any;
    return medication[key];
  }

  get greeting() {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  }
  get doctorName() {
    return this.userName.split(' ')[0];
  }
}
