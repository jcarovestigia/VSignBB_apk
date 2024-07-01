import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone:true,
  imports: [  
    CommonModule,
    IonicModule
  ],
  selector: 'app-footer-light',
  templateUrl: './footer-light.component.html',
  styleUrls: ['./footer-light.component.scss'],
})
export class FooterLightComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  
}
