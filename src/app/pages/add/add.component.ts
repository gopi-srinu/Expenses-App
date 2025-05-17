import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, trendingUp, addCircle, person } from 'ionicons/icons';
import { IonIcon, IonButton, IonHeader, IonSelect, IonSelectOption, IonApp } from "@ionic/angular/standalone";
import { arrowBackOutline } from 'ionicons/icons';
import { menuOutline } from 'ionicons/icons';
import { IonList } from "@ionic/angular/standalone";
import { IonInput, IonMenu, IonTitle, IonButtons, IonMenuButton, IonContent, IonToolbar, IonMenuToggle } from "@ionic/angular/standalone";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedFooterComponent } from "../shared-footer/shared-footer.component";
import { Notyf } from 'notyf';
import { ExpenseTrackerService } from 'src/app/services/expense-tracker.service';
import { CommonModule } from '@angular/common';
import Aos from 'aos';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  imports: [IonApp, IonHeader, IonButton, IonIcon, IonList, IonInput, ReactiveFormsModule, FormsModule, SharedFooterComponent, IonSelect, IonSelectOption, IonApp, CommonModule]
})
export class AddComponent implements OnInit {
  expenseForm!: FormGroup;


  constructor(private router: Router, private fb: FormBuilder, private expenseTrackerService: ExpenseTrackerService) {
    addIcons({
      home,
      trendingUp,
      addCircle,
      person,
      arrowBackOutline,
      menuOutline
    });
    this.expenseForm = this.fb.group({
      expense_Name: ['', [Validators.required]],
      expense_Amount: [0, [Validators.required]],
      expense_Date: [this.setDate(), [Validators.required]],
      expense_Category: ['', [Validators.required]]
    })
  }

  ngOnInit() {
    // this.setDate();
    Aos.init();
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  submitExpensesForm() {
    if (this.expenseForm.valid) {
      const notyf = new Notyf({
        duration: 3000,
        position: {
          x: 'right',
          y: 'top'
        }
      })
      notyf.success('Your Expense has been submitted Successfully!');
      this.expenseTrackerService.addExpense(this.expenseForm.value).subscribe((addedExpenseResponse) => {
        console.log(addedExpenseResponse);
      })
      this.expenseForm.reset();
      this.expenseForm.patchValue({
        expense_Date: this.setDate()
      });
    }
  }

  setDate() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    return formattedDate;
  }

  logout() {
    this.router.navigateByUrl('splash');
  }
}
