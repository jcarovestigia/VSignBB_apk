import { Component, ElementRef, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, Platform } from '@ionic/angular';
import { TagService } from 'src/app/servicios/tag.service';
import { ServidorService } from 'src/app/servicios/servidor.service';
import { FooterDarkComponent } from 'src/app/componentes/footer-dark/footer-dark.component';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/componentes/header/header.component';
import { MenuTabComponent } from 'src/app/componentes/menu-tab/menu-tab.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.page.html',
  styleUrls: ['./documentos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,
    FooterDarkComponent,
    TranslateModule,
    HeaderComponent,
    MenuTabComponent
  ]
})
export class DocumentosPage  {
  public documentos:any[]=[];
  public links:any[]=[];
  @ViewChild(MenuTabComponent) menu!: MenuTabComponent;
  
  constructor(public tag:TagService, private sanitizer: DomSanitizer, private servidor:ServidorService, private platform:Platform) { }
  
  ionViewWillEnter() {
    this.menu.selectedSegment="documentos";
    this.documentos=[];
    this.links=[];
    var listaDocumentos=this.tag.info.documentos_art.split('\n');
    var patron=/(.+)\[(.*)\]/;
    var anchoPreferido=this.platform.width()-50;
    for(var i in listaDocumentos){
      let res=patron.exec(listaDocumentos[i].trim());
      if (res!.length==3){
        var html='';
        var href=res![1].replace(/ /g,'_');
        var esImagen = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        var esVideo = /(\.mp4|\.ogg)$/i;
        var tipo='link';
        var titulo=res![2];

        if(!esImagen.test(href)){
          if (esVideo.test(href)){
            tipo='video';
            html='<h5 class="card-title">'+res![2]+'</h5> \
              <video width="'+anchoPreferido+'" controls autoplay> \
                <source src="'+this.servidor.URLServidor+'/d/'+href+'" type="video/mp4"> \
                  Este dispositivo no soporta video \
                </video>';
          }
        }
        else{
          tipo='imagen';
          html=`
              <img class="card-img-top imagenDoc" data-descripcion="`+encodeURIComponent(res![2])+`" data-href="`+href+`" style="width:100%;display:block" src="`+this.servidor.URLServidor+`/d/`+href+`"></img> 
              <div class="ion-text-end"><h5>`+res![2]+`</h5></div> 
              `;
        }
        if (tipo=='link'){
          this.links.push({tipo: tipo, href:this.sanitizer.bypassSecurityTrustResourceUrl(this.servidor.URLServidor+`/d/`+href), titulo:titulo});
        }
        else{
          this.documentos.push({tipo: tipo, html:html, link:this.servidor.URLServidor+`/d/`+href, titulo:titulo});
        }
      }
    }
  }

}
