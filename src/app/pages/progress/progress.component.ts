import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, trendingUp, addCircle, person, arrowBackOutline, menuOutline } from 'ionicons/icons';
import { SharedFooterComponent } from "../shared-footer/shared-footer.component";
import { IonHeader, IonIcon, IonSearchbar, IonMenu, IonMenuToggle, IonButtons, IonMenuButton, IonTitle, IonContent, IonToolbar, IonApp } from "@ionic/angular/standalone";
import { ExpenseTrackerService } from 'src/app/services/expense-tracker.service';
import { Expense } from 'src/app/Models/expense.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
  imports: [IonApp,IonMenuToggle, IonIcon, IonHeader, SharedFooterComponent, CommonModule, MatButtonModule, MatMenuModule, IonSearchbar, FormsModule, ReactiveFormsModule, IonMenu, IonTitle, IonContent, IonToolbar],
})
export class ProgressComponent implements OnInit {

  expenses: string = '';
  expensesData: Expense[] = [];
  allexpensesData: Expense[] = [];
  constructor(private router: Router, private expenseTrackerService: ExpenseTrackerService) {
    addIcons({
      home,
      trendingUp,
      addCircle,
      person,
      arrowBackOutline,
      menuOutline
    });
  }

  ngOnInit() {
    this.getExpenses();
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  getExpenses() {
    this.expenseTrackerService.getExpenses().subscribe((expense) => {
      this.expensesData = expense;
      this.allexpensesData = this.expensesData;
    })
  }

  filterExpenses(value: string) {
    const selectedValue = value?.toLowerCase() || '';
    this.allexpensesData = this.expensesData.filter((expense) => {
      const category = expense.expense_category?.toLowerCase() || '';
      return category.includes(selectedValue);
    });
  }


  searchExpenses() {
    const searchValue = (this.expenses || '').toLowerCase().replace(/\s/g, '');

    this.allexpensesData = this.expensesData.filter(expense =>
      (expense.expense_name || '').toLowerCase().replace(/\s/g, '').includes(searchValue)
    );
  }


  logout() {
    this.router.navigateByUrl('splash');
  }

}
