import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController, IonicModule, Platform } from '@ionic/angular';
import { FooterLightComponent } from '../../componentes/footer-light/footer-light.component';
import {InAppBrowser, InAppBrowserOptions} from '@awesome-cordova-plugins/in-app-browser/ngx';
import { IdiomaService } from '../../servicios/idioma.service';
import { TranslateModule, TranslateService} from '@ngx-translate/core'; 
import { HeaderComponent } from '../../componentes/header/header.component';
import { TagService } from '../../servicios/tag.service';

@Component({
  selector: 'app-consultando',
  templateUrl: './consultando.page.html',
  styleUrls: ['./consultando.page.scss'],
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
export class ConsultandoPage  {
  idioma: any;
  @ViewChild('leyendo', { read: ElementRef, static: true }) circuloLeyendo: ElementRef | undefined; 
  @ViewChild('consultando1', { read: ElementRef, static: true }) circuloConsultando1: ElementRef | undefined; 
  @ViewChild('ayuda', { read: ElementRef, static: true }) circuloAyuda: ElementRef | undefined; 

  constructor(  private router: Router,
                private animationCtrl: AnimationController,
                private iab: InAppBrowser,
                private idiomaServicio: IdiomaService,
                private translate:TranslateService,
                private platform: Platform,
                private tag:TagService) {
      this.idiomaServicio.getDefaultLanguage();
      this.idioma = this.idiomaServicio.getCurrentLang();
  }
   
  ionViewWillEnter() {
   
    this.tag.autentifica()
    .subscribe((res)=>{
      this.router.navigate(['autenticidad'], {queryParams: {}});
    });
    
  }

  ngAfterViewInit() {
      const tiempoEscaneando=2500;
      const tiempoGirando=1000;
      const tiempoAyuda=2500;
      //E-G-A-G
      const tiempo=tiempoEscaneando+2*tiempoGirando+tiempoAyuda;
      const tamano=this.platform.width()*0.9+'px';
      const animacionLeyendo = this.animationCtrl.create()
      .addElement(this.circuloLeyendo?.nativeElement)
    .keyframes([
      { offset: 0 , width: tamano, height:tamano},
      { offset: tiempoEscaneando/tiempo, width: tamano, height:tamano},
      { offset: (tiempoEscaneando+tiempoGirando/2)/tiempo, width: 0, height: tamano },
      { offset: (tiempoEscaneando+tiempoGirando+tiempoAyuda+tiempoGirando/2)/tiempo, width: 0, height: tamano },
      { offset: 1, width: tamano, height: tamano },
    ]);
    const animacionConsultando1 = this.animationCtrl.create()
    .addElement(this.circuloConsultando1?.nativeElement)
    .keyframes([
      { offset: 0 , width: tamano, height:tamano,opacity:1},
      { offset: 0.1*tiempoEscaneando/tiempo , width: tamano, height:tamano,opacity:0},
      { offset: 0.2*tiempoEscaneando/tiempo , width: tamano, height:tamano,opacity:1},
      { offset: 0.4*tiempoEscaneando/tiempo , width: tamano, height:tamano,opacity:0},
      { offset: 0.5*tiempoEscaneando/tiempo , width: tamano, height:tamano,opacity:1},
      { offset: 0.7*tiempoEscaneando/tiempo , width: tamano, height:tamano,opacity:0},
      { offset: 0.75*tiempoEscaneando/tiempo , width: tamano, height:tamano,opacity:1},
      { offset: 0.9*tiempoEscaneando/tiempo , width: tamano, height:tamano,opacity:0},
      { offset: tiempoEscaneando/tiempo, width: tamano, height:tamano,opacity:0},
      { offset: 1, width: tamano, height: tamano,opacity:0 },
    ]);
    const animacionAyuda = this.animationCtrl.create()
      .addElement(this.circuloAyuda?.nativeElement)
      .keyframes([
        { offset: 0 , width: 0, height:tamano},
        { offset: (tiempoEscaneando+tiempoGirando/2)/tiempo, width: 0, height:tamano},
        { offset: (tiempoEscaneando+tiempoGirando)/tiempo, width: tamano, height: tamano },
        { offset: (tiempoEscaneando+tiempoGirando+tiempoAyuda)/tiempo, width: tamano, height: tamano },
        { offset: (tiempoEscaneando+tiempoGirando+tiempoAyuda+tiempoGirando/2)/tiempo, width: 0, height: tamano },
        { offset: 1, width: 0, height: tamano },
      ])
    this.animationCtrl.create()
    .duration(tiempo)
    .iterations(Infinity)
    .addAnimation([animacionLeyendo,animacionConsultando1,animacionAyuda])
    .play();
    

  }


  
  @HostListener('unloaded')
  ngOnDestroy() {
    console.log('Items destroyed');
  }

  public abrirContacto():void{
    const options: InAppBrowserOptions = {
      zoom: 'no'
    }
    // Opening a URL and returning an InAppBrowserObject
    const browser = this.iab.create(this.translate.instant('home.contacto'), '_self', options);

  }

}
