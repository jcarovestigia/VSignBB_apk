import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../../componentes/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { FooterDarkComponent } from '../../componentes/footer-dark/footer-dark.component';
import { TagService } from '../../servicios/tag.service';
import { MenuTabComponent } from '../../componentes/menu-tab/menu-tab.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EstadoService } from 'src/app/servicios/estado.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
  standalone: true,
  imports: [
      IonicModule,
      CommonModule,
      FormsModule,
      FooterDarkComponent,
      TranslateModule,
      HeaderComponent,
      MenuTabComponent
    ]
})
export class ProductoPage  {
  public show:boolean=true;
  public esHTML=false;
  public pagina!: SafeResourceUrl;
  @ViewChild(MenuTabComponent) menu!: MenuTabComponent;
  constructor(public tag:TagService, private sanitizer: DomSanitizer, private estado:EstadoService) { 
  }
  ionViewWillEnter(){
    console.log('Pro onViewWillEnter');
    this.esHTML=new RegExp('^((http|https)://)[-a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)$','i').test(this.tag.info.descripcion_art);
    if (this.esHTML){
      this.pagina=this.sanitizer.bypassSecurityTrustResourceUrl(this.tag.info.descripcion_art);
    }
    this.menu.selectedSegment="detalles";
  }
}
