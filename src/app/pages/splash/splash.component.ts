import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import AOS from 'aos';
@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    AOS.init();
  }

  navigateToHomePage() {
    this.router.navigateByUrl('home');
  }

}
