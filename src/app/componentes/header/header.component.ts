import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IdiomaService } from '../../servicios/idioma.service';

@Component({
  standalone:true,
  imports: [  
    CommonModule,
    IonicModule
  ],
 selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router, public idioma:IdiomaService) { 
  }

  @Output() onPlusClick = new EventEmitter<boolean>();

  
  clickIcon() {
    
    //this.onPlusClick.emit(true);
    this.router.navigate(['home']);
  }
  
  /*clickIcon(){
    this.router.navigate(['dial-page']);
  }*/

  nombreBandera():string{
    var banderaDe=['es','um','fr'];
    return banderaDe[this.idioma.getCurrentLangIndice()];
  }
  nuevoIdioma($event:any):void{
    this.idioma.setLanguage($event.target.value);
  }
  ngOnInit() {}

}
