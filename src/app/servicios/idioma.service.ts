import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class IdiomaService {
  idiomaActual: any;
  idiomasImplementados=['es','en'];
  idiomaPorDefecto='es';

  constructor(private translate: TranslateService) { 
    if (localStorage.getItem('lang')==null) this.getDefaultLanguage();
    this.idiomaActual = localStorage.getItem('lang')||this.idiomaPorDefecto;
  }
  getDefaultLanguage(){
    if (this.idiomaActual) {
      this.translate.setDefaultLang(this.idiomaActual);
    } else {
      var idiomaTelefono=this.translate.getBrowserLang()||this.idiomaPorDefecto;
      if (this.idiomasImplementados.indexOf(idiomaTelefono)<0)
        this.idiomaActual=this.idiomaPorDefecto;
      else
        this.idiomaActual=idiomaTelefono;
      localStorage.setItem('lang', this.idiomaActual);
      this.translate.setDefaultLang(this.idiomaActual);
    }
    return this.idiomaActual;
  }
  setLanguage(setLang: string) {
    if (this.idiomasImplementados.indexOf(setLang)<0)
      this.idiomaActual=this.idiomaPorDefecto;
    else
      this.idiomaActual=setLang;
    this.translate.use(this.idiomaActual);
    localStorage.setItem('lang', this.idiomaActual);
  }

  getCurrentLang():string {
    return this.idiomaActual;
  }
  getCurrentLangIndice():number {
    return this.idiomasImplementados.indexOf(this.idiomaActual);
  }
  

}
