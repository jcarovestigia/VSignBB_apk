import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController, IonicModule, Platform } from '@ionic/angular';
import { FooterLightComponent } from '../../componentes/footer-light/footer-light.component';
import {InAppBrowser, InAppBrowserOptions} from '@awesome-cordova-plugins/in-app-browser/ngx';
import { IdiomaService } from '../../servicios/idioma.service';
import { TranslateModule, TranslateService} from '@ngx-translate/core'; 
import { HeaderComponent } from '../../componentes/header/header.component';
import { TagService } from '../../servicios/tag.service';
//import { HomePageRoutingModule } from './home-routing.module';


@Component({
  standalone: true,
  imports: [  
    CommonModule,
    IonicModule,
    FooterLightComponent,
    TranslateModule,
    HeaderComponent,
  ],
  providers:[
    InAppBrowser,
  ],
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnDestroy{
  idioma: any;
  @ViewChild('leyendo', { read: ElementRef, static: true }) circuloLeyendo: ElementRef | undefined; 
  @ViewChild('ayuda', { read: ElementRef, static: true }) circuloAyuda: ElementRef | undefined; 
  @ViewChild('objetivo1', { read: ElementRef, static: true }) objetivo1: ElementRef | undefined; 
  @ViewChild('objetivo2', { read: ElementRef, static: true }) objetivo2: ElementRef | undefined; 

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
   
    // --------------------------------------------------------------------------------
    // this.tag.escanea()
    // .subscribe((res)=>{
    //   console.log('Respuesta a escaneo: ',res);
    //   if (res){
    //     this.tag.obtenNDEF()
    //     .subscribe((res)=>{
    //       if (res){
    //         this.router.navigate(['consultando'], {queryParams: {}});
    //       }
    //     }

    //     );
        
    //   }
    //   else{

    //   }
    // });
    this.tag.ocupado=false;
    
  }

  ngAfterViewInit() {
   
      const tiempoEscaneando=5500;
      const tiempoGirando=1000;
      const tiempoAyuda=2500;
      const esperaObjetivo=500;
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
      ])
      const animacionObjetivo1 = this.animationCtrl.create()
      .addElement(this.objetivo1?.nativeElement)
      .keyframes([
        { offset: 0 , width: tamano, height:tamano, 'transform-origin':'center center',transform: 'rotate(0deg) translate(-50%, -50%)',opacity:0},
        { offset: esperaObjetivo/tiempo, width: tamano, height:tamano, transform: 'rotate(0deg) translate(-50%, -50%)', opacity:1},
        { offset: (tiempoEscaneando-esperaObjetivo)/tiempo, width: tamano, height: tamano, transform: 'rotate(190deg) translate(-50%, -50%)',  opacity:1},
        { offset: (tiempoEscaneando)/tiempo, width: tamano, height: tamano,'transform-origin':'center', transform: 'rotate(90deg) translate(-50%, -50%)',   opacity:0},
        { offset: 1,  width: tamano, height: tamano,transform: 'rotate(0deg) translate(-50%, -50%)',opacity:0 },
      ])
      const animacionObjetivo2 = this.animationCtrl.create()
      .addElement(this.objetivo2?.nativeElement)
      .keyframes([
        { offset: 0 , width: tamano, height:tamano, 'transform-origin':'center center',transform: 'rotate(60deg) translate(-50%, -50%)',opacity:0},
        { offset: esperaObjetivo/tiempo, width: tamano, height:tamano, transform: 'rotate(60deg) translate(-50%, -50%)', opacity:1},
        { offset: (tiempoEscaneando-esperaObjetivo)/tiempo, width: tamano, height: tamano, transform: 'rotate(10deg) translate(-50%, -50%)',  opacity:1},
        { offset: (tiempoEscaneando)/tiempo, width: tamano, height: tamano,'transform-origin':'center', transform: 'rotate(0deg) translate(-50%, -50%)',   opacity:0},
        { offset: 1, width: tamano, height: tamano, transform: 'rotate(60deg) translate(-50%, -50%)',opacity:0 },
      ])
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
    .addAnimation([animacionLeyendo,animacionObjetivo1,animacionObjetivo2,animacionAyuda])
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
