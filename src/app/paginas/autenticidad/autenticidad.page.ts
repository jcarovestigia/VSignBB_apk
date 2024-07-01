import { CommonModule } from '@angular/common';
import { Component, ElementRef,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController, IonicModule, Platform } from '@ionic/angular';
import { FooterLightComponent } from '../../componentes/footer-light/footer-light.component';
import {InAppBrowser, InAppBrowserOptions} from '@awesome-cordova-plugins/in-app-browser/ngx';
import { IdiomaService } from '../../servicios/idioma.service';
import { TranslateModule, TranslateService} from '@ngx-translate/core'; 
import { HeaderComponent } from '../../componentes/header/header.component';
import { TagService } from '../../servicios/tag.service';

@Component({
  selector: 'app-autenticidad',
  templateUrl: './autenticidad.page.html',
  styleUrls: ['./autenticidad.page.scss'],
  standalone: true,
  imports: [  
    CommonModule,
    IonicModule,
    FooterLightComponent,
    TranslateModule,
    HeaderComponent
  ],
  providers:[
    InAppBrowser,
  ],
  
})
export class AutenticidadPage  {
  idioma: any;
  @ViewChild('circulo', { read: ElementRef, static: true }) circulo: ElementRef | undefined; 
  @ViewChild('falsa', { read: ElementRef, static: true }) circuloFalsa: ElementRef | undefined; 
  @ViewChild('autentica', { read: ElementRef, static: true }) circuloAutentica: ElementRef | undefined; 

  constructor(private router: Router,
    private animationCtrl: AnimationController,
    private iab: InAppBrowser,
    private idiomaServicio: IdiomaService,
    private translate:TranslateService,
    private platform: Platform,
    public tag:TagService) { 
      this.idiomaServicio.getDefaultLanguage();
      this.idioma = this.idiomaServicio.getCurrentLang();
    }
    ionViewWillEnter() {
   
      
    }
  
    ngAfterViewInit() {
      const tamano=this.platform.width()*0.9;
      const frames=[
        { offset: 0 , opacity:0, width: tamano*3+'px', height:tamano*3+'px'},
        { offset: 0.25 , opacity:0, width: tamano*3+'px', height:tamano*3+'px'},
        { offset: 0.9, opacity:1, width: tamano*0.8+'px', height: tamano*0.8+'px' },
        { offset: 0.95, opacity:1, width: tamano*0.85+'px', height: tamano*0.85+'px' },
        { offset: 1, opacity:1, width: tamano*0.8+'px', height: tamano*0.8+'px' },
      ]
      const tiempo=1000;
        
      if (this.tag.autentico){
        const animacionAutentico = this.animationCtrl.create()
        .addElement(this.circuloAutentica?.nativeElement)
        .keyframes(frames)
        .duration(tiempo)
        .play();
        this.circuloFalsa!.nativeElement.style.opacity=0;
      }
      else{
        const animacionFalso = this.animationCtrl.create()
        .addElement(this.circuloFalsa?.nativeElement)
        .keyframes(frames)
        .duration(tiempo)
        .play();
        this.circuloAutentica!.nativeElement.style.opacity=0;
      }
      
  
    }
 
   
  
    public abrirContacto():void{
      const options: InAppBrowserOptions = {
        zoom: 'no'
      }
      // Opening a URL and returning an InAppBrowserObject
      const browser = this.iab.create(this.translate.instant('home.contacto'), '_self', options);
  
    }
    public infoProducto():void{
      this.router.navigate(['producto']); 
    }
  
}
