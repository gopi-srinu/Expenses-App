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
import { Expense } from 'src/app/Models/expense.model';
import Aos from 'aos';

echarts.use([BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent, CanvasRenderer]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [IonApp, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonIcon, SharedFooterComponent, IonHeader, IonMenu, IonToolbar, IonContent, IonTitle],
})
export class HomeComponent implements OnInit {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  expenditureAmount: number[] = [];
  savingsAmount: number[] = [];
  savings: number = 0;
  expenditure: number = 0;
  totalValue: number = 0;
  private dataLoaded = { expenditure: false, savings: false };
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
    Aos.init();
    this.getExpenditure();
    this.getSavings();
    this.getTotal();
    this.renderChart();
  }


  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  getExpenditure() {
    this.expenseService.getExpenses().subscribe((expense) => {
      const expensesData = expense.filter((expenseData) => expenseData.expense_category === 'Expenditure');
      this.expenditureAmount = expensesData.map((data) => data.expense_amount);
      this.expenditure = this.expenditureAmount.reduce((acc, curr) => Number(acc) + Number(curr), 0);
      this.dataLoaded.expenditure = true;
      this.ccheckIfAllDataLoaded();
    });
  }

  getSavings() {
    this.expenseService.getExpenses().subscribe((expense) => {
      const savingsData = expense.filter((expenseData) => expenseData.expense_category === 'Saving');
      this.savingsAmount = savingsData.map((data) => data.expense_amount);
      this.savings = this.savingsAmount.reduce((acc, curr) => Number(acc) + Number(curr), 0);
      this.dataLoaded.savings = true;
      this.ccheckIfAllDataLoaded();
    });
  }

  ccheckIfAllDataLoaded() {
    if (this.dataLoaded.expenditure && this.dataLoaded.savings) {
      this.getTotal();
      this.renderChart();
    }
  }


  getTotal() {
    this.totalValue = this.expenditure + this.savings;
  }

  logout() {
    this.router.navigateByUrl('splash');
  }

  renderChart() {
    const chartElement = document.getElementById('chartContainer');
    if (!chartElement) return;

    const myChart = echarts.init(chartElement);

    const currentDate = new Date();
    const months: string[] = [];
    const monthlyExpenditure = Array(12).fill(0);
    const monthlySavings = Array(12).fill(0);

    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      const monthName = date.toLocaleString('default', { month: 'short' });
      const yearDigits = date.getFullYear().toString().slice(2);
      months.push(`${monthName} '${yearDigits}`);
    }

    this.expenseService.getExpenses().subscribe((expenses: Expense[]) => {
      expenses.forEach(expense => {
        const expenseDate = new Date(expense.expense_date);
        const monthsAgo = (currentDate.getFullYear() - expenseDate.getFullYear()) * 12 +
          (currentDate.getMonth() - expenseDate.getMonth());

        if (monthsAgo >= 0 && monthsAgo < 12) {
          const monthIndex = 11 - monthsAgo;
          if (expense.expense_category === 'Expenditure') {
            monthlyExpenditure[monthIndex] += Number(expense.expense_amount);
          } else if (expense.expense_category === 'Saving') {
            monthlySavings[monthIndex] += Number(expense.expense_amount);
          }
        }
      });

      const option = {
        title: {
          textStyle: {
            color: '#000000',
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (params: any[]) {
            let tooltip = params[0].axisValue + '<br/>';
            let totalAmount = 0;

            params.forEach((param: { seriesName: any; value: number; }) => {
              tooltip += `${param.seriesName}: ₹${param.value.toLocaleString()}<br/>`;
              totalAmount += param.value;
            });

            tooltip += `<strong>Total: ₹${totalAmount.toLocaleString()}</strong>`;
            return tooltip;
          }
        },
        legend: {
          data: ['Expenditure', 'Savings'],
          textStyle: {
            color: '#000000'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: months,
          axisLabel: {
            rotate: 45,
            interval: 0
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '₹{value}'
          }
        },
        series: [
          {
            name: 'Expenditure',
            type: 'bar',
            stack: 'total',
            data: monthlyExpenditure,
            itemStyle: {
              color: '#FF6B6B'
            },
            emphasis: {
              itemStyle: {
                color: '#FF3333'
              }
            },
            label: {
              show: true,
              position: 'inside',
              formatter: function (params: { value: number; }) {
                return params.value > 0 ? `₹${params.value}` : '';
              }
            }
          },
          {
            name: 'Savings',
            type: 'bar',
            stack: 'total',
            data: monthlySavings,
            itemStyle: {
              color: '#4CAF50'
            },
            emphasis: {
              itemStyle: {
                color: '#2E7D32'
              }
            },
            label: {
              show: true,
              position: 'inside',
              formatter: function (params: { value: number; }) {
                return params.value > 0 ? `₹${params.value}` : '';
              }
            }
          }
        ]
      };

      myChart.setOption(option);

      // Handle window resize to make chart responsive
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    });
  }

}
