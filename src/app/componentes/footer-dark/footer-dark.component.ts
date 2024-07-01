import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  standalone:true,
  imports: [  
    CommonModule,
    IonicModule
  ],
  selector: 'app-footer-dark',
  templateUrl: './footer-dark.component.html',
  styleUrls: ['./footer-dark.component.scss'],
})
export class FooterDarkComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  aHome(){
    this.router.navigate(['home']);
  
  }
}
