import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, trendingUp, addCircle, person, menuOutline, arrowBackOutline } from 'ionicons/icons';
import { SharedFooterComponent } from '../shared-footer/shared-footer.component';
import { IonIcon, IonHeader, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonTitle, IonMenu, IonApp, IonToolbar, IonContent, IonMenuToggle } from "@ionic/angular/standalone";

import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { ExpenseTrackerService } from 'src/app/services/expense-tracker.service';

echarts.use([BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent, CanvasRenderer]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [IonApp, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonIcon, SharedFooterComponent, IonHeader, IonMenu, IonToolbar, IonContent, IonMenuToggle, IonTitle],
})
export class HomeComponent implements OnInit {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  expenditureAmount: number[] = [];
  savingsAmount: number[] = [];
  savings: number = 0;
  expenditure: number = 0;
  constructor(private router: Router, private expenseService: ExpenseTrackerService) {
    addIcons({
      home,
      trendingUp,
      addCircle,
      person,
      menuOutline,
      arrowBackOutline
    });
  }


  ngOnInit() {
    this.getExpenditure();
    this.getSavings();
    const chartElement = document.getElementById('chartContainer');

    const myChart = echarts.init(chartElement);

    const option = {
      title: {
        text: 'Expenses History', textStyle: {
          color: '#000000' // White color for title
        }
      },
      tooltip: {},
      legend: {
        data: ['Expenditure', 'Savings'], textStyle: {
          color: '#000000' // White color for title
        }
      },
      xAxis: { data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
      yAxis: {},
      series: [{ name: 'Expenditure', type: 'bar', data: [5, 20, 36, 10, 10, 20, 5, 20, 36, 10, 10, 20] }, { name: 'Savings', type: 'bar', data: [5, 20, 36, 10, 10, 20, 5, 20, 36, 10, 10, 20] }]
    };

    myChart.setOption(option);
    myChart.resize();
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  getExpenditure() {
    this.expenseService.getExpenses().subscribe((expense) => {
      const expensesData = expense.filter((expenseData) => {
        return expenseData.expense_category === 'Expenditure';
      });

      this.expenditureAmount = expensesData.map((data) => data.expense_amount);

      const totalExpenditure = this.expenditureAmount.reduce((acc, curr) => Number(acc) + Number(curr), 0);

      this.expenditure = totalExpenditure;
    });
  }


  getSavings() {
    this.expenseService.getExpenses().subscribe((expense) => {
      const savingsData = expense.filter((expenseData) => {
        return expenseData.expense_category === 'Saving';
      })

      this.savingsAmount = savingsData.map((data) => data.expense_amount);

      const totalSavings = this.savingsAmount.reduce((acc, curr) => Number(acc) + Number(curr), 0);
      this.savings = totalSavings;
    })
  }

  logout() {
    this.router.navigateByUrl('splash');
  }
}
