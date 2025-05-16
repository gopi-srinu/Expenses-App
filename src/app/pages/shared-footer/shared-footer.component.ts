import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonIcon,
  IonTabBar,
  IonTabButton,
  IonFooter,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, trendingUp, addCircle, person } from 'ionicons/icons';
@Component({
  selector: 'app-shared-footer',
  templateUrl: './shared-footer.component.html',
  styleUrls: ['./shared-footer.component.scss'],
  imports: [IonFooter, IonTabBar, IonTabButton, IonIcon, IonLabel]
})
export class SharedFooterComponent implements OnInit {

  constructor(private router: Router) {
    addIcons({
      home,
      trendingUp,
      addCircle,
      person
    });
  }

  ngOnInit() { }

  navigateTo(route: string) {
    this.router.navigateByUrl(route, { skipLocationChange: false });
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
