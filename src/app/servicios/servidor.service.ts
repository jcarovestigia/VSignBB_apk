import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IdiomaService } from './idioma.service';


@Injectable({
  providedIn: 'root'
})
export class ServidorService {
  public URLServidor:string= 'https://vestigiacontrol.com/vsignbb';

  constructor(private http: HttpClient, private idioma:IdiomaService) { }

  consulta(NDEFhex:string, longitud:number=0, latitud:number=0){
    return new Observable(
      
      (subscriber)=>{
        this.http.get(this.URLServidor+"/tags2/comprobartag/"+NDEFhex+"/"+longitud+'/'+latitud+'/'+this.idioma.getCurrentLang(),
                        {
                   //       headers: new HttpHeaders({   'Content-Type': 'application/json'  })
                        })
        .subscribe({
          next: (res)=>{
            console.log(res);
            subscriber.next(res);
            subscriber.complete();
          },
          error: (err)=>{
            console.log(err)
            subscriber.next(err);
            subscriber.complete();
          }
        });
    });
  }
}
