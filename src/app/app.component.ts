import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, Platform } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IdiomaService } from './servicios/idioma.service';
import { WebIntent } from '@awesome-cordova-plugins/web-intent/ngx';
import { TagService } from './servicios/tag.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, TranslateModule],
  providers:[ TranslateService]
})
export class AppComponent {
  constructor(idioma: IdiomaService, private platform: Platform, private router:Router, private webIntent:WebIntent,private tag:TagService) {
    idioma.getDefaultLanguage();
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['home']);
    });
    this.webIntent.onIntent()
    .subscribe((i)=>{
      console.log('hay intent');
      let intent:any=i;
      if ((intent.action=="android.nfc.action.NDEF_DISCOVERED")&&(!this.tag.ocupado)){
        this.tag.ocupado=true;
        this.tag.aseguraPermisos();
        this.tag.registraNuevoTag(intent.data);
        this.tag.obtenNDEF()
        .subscribe((res)=>{
          if (res){
            this.router.navigate(['consultando'], {queryParams: {}});
          }
        });
        
      }
    });
    this.platform.ready()
    .then(()=>{
      console.log('Platform ready');
    })
    .catch((e)=>{});
  }
}
