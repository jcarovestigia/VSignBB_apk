import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FooterDarkComponent } from 'src/app/componentes/footer-dark/footer-dark.component';
import { HeaderComponent } from 'src/app/componentes/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { MenuTabComponent } from 'src/app/componentes/menu-tab/menu-tab.component';
import { TagService } from 'src/app/servicios/tag.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,
    FooterDarkComponent,
    TranslateModule,
    HeaderComponent,
    MenuTabComponent
 
  ]
})
export class RegistroPage  {
  @ViewChild(MenuTabComponent) menu!: MenuTabComponent;
  public hyTransaccion:string='';

  constructor(public tag:TagService) { }
  
  
  ionViewWillEnter() {
    this.menu.selectedSegment="registro";
    var txtTransaccion:string=this.tag.info.transaccion;
    console.log('Entro con transaccion='+txtTransaccion);
    while(txtTransaccion!=''){
      this.hyTransaccion+=txtTransaccion.substring(0,8)+'&shy;';
      txtTransaccion=txtTransaccion.substring(8);
    }
						  
  }

}
