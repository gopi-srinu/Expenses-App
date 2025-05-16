import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense } from '../Models/expense.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseTrackerService {
  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:3000';

  addExpense(expense: Expense) {
    const postReq = `${this.apiUrl}/add-expense`;
    return this.http.post(postReq, expense);
  }

  getExpenses(): Observable<Expense[]> {
    const getReq = `${this.apiUrl}/get-expense`;
    return this.http.get<Expense[]>(getReq);
  }
}
