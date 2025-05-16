import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonIcon, IonInput, IonList, IonButton, IonMenu, IonContent, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonApp } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, trendingUp, addCircle, person, arrowBackOutline, menuOutline } from 'ionicons/icons';
import { SharedFooterComponent } from '../shared-footer/shared-footer.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Notyf } from 'notyf';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [IonApp, IonButton, IonList, IonInput, IonHeader, IonIcon, SharedFooterComponent, FormsModule, ReactiveFormsModule, CommonModule, IonMenu, IonTitle, IonButtons, IonMenuButton, IonToolbar, IonContent],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  constructor(private router: Router, private fb: FormBuilder) {
    addIcons({
      home,
      trendingUp,
      addCircle,
      person,
      menuOutline, arrowBackOutline
    });
  }

  ngOnInit() {
    this.profileForm = this.fb.group({
      fullName: [''],
      phoneNumber: [0],
      date: [this.setDate()]
    })
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  setDate() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    return formattedDate;
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      const notyf = new Notyf({
        position: {
          x: 'right',
          y: 'top'
        }
      })
      notyf.error(`Form is invalid, Please fill the form to update.`);
    } else {
      const notyf = new Notyf({
        position: {
          x: 'right',
          y: 'top'
        }
      })
      notyf.success('Profile updated successfully.');
    }
  }

  logout() {
    this.router.navigateByUrl('splash');
  }
}
