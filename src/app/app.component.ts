import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private translateService: TranslateService, private titleService: Title) {
  }

  ngOnInit(): void {
    this.translateService.setDefaultLang('en');
    this.titleService.setTitle('At Event');
  }
}
