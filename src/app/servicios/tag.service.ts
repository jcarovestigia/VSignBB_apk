import { Injectable } from '@angular/core';
import { NFC } from '@awesome-cordova-plugins/nfc/ngx';
import { Position } from '@capacitor/geolocation';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { GeolocalizacionService } from './geolocalizacion.service';
import { ServidorService } from './servidor.service';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  clave0:Uint8Array =new Uint8Array([0xa1,0x80,0xe1,0x22,0x46,0xaa,0xfe,0x00,0x3e,0x29,0x1b,0x39,0x21,0x89,0x0d,0xd0]);
 	cliente:string='bb';
	nuestroPrefijo:string="vst://vestigia."+this.cliente+"/";
	
  miTag : string = "";
  NDEF: string = '';
  variable: string = '';
  UID: string = '';
  nonce: string = '';
  info: any={};
  autentificado:boolean=false;
  autentico:boolean=false;
  ocupado:boolean=false;

  private escaneando!: Subscription;//NO uso esto
  constructor(private nfc: NFC, private servidor: ServidorService, private geolocalizacion:GeolocalizacionService, private androidPermissions: AndroidPermissions,private platform: Platform) { 
    
  }
  aseguraPermisos(profundidad:number=0){
    if (this.platform.is("android")&&(profundidad<3)){
      console.log('Chequeo permisos '+profundidad);
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
        result => {
          console.log('Has permission?',result.hasPermission);
          if (!result.hasPermission){
            this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION, this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION])
            .then((result)=>{
              console.log('Vuelve',result);
              if (!result.hasPermission){
                this.aseguraPermisos(profundidad+1);
              }
              else{
                console.log('Has permission?',result.hasPermission);
              }
            })
            .catch();
            
          }  
        },
        err => {
          console.log('Error Chequeo permisos: pido permisos');
          this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION])
          .then((result)=>{
            console.log('Vuelve',result);
            this.aseguraPermisos(profundidad+1);
          })
          .catch();
      }
      )
      .catch((e)=>{console.log(e)});
      
      
    }
  }
  registraNuevoTag(ndef:string){
    this.miTag = ndef;
    this.cliente = this.miTag.substring(6, 8);
    this.nonce = this.miTag.substring(18, 22);
    this.variable = this.miTag.substring(18 + 5, this.miTag.indexOf("?"));
    this.UID = this.miTag.substring(18 + 5 + this.variable.length + 3, 18 + 5 + this.variable.length + 3+14);
    this.autentificado=false;
  }
  escanea(){//He dejado de usar esto
    this.aseguraPermisos();
    let flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
    return new Observable( (observer) =>{
      if (this.escaneando) {
        this.escaneando.unsubscribe();
        console.log('Quito subscripcion');
      }
      console.log('escaneo...');
      this.escaneando=this.nfc.readerMode(flags).subscribe({
        next: (tag) => {
          this.escaneando.unsubscribe();
          console.log('Visto un tag');
          let ndef:string='';
          if (tag.ndefMessage){
            for (var i = 1; i < tag.ndefMessage[0].payload.length; i++)
              ndef += String.fromCharCode(tag.ndefMessage[0].payload[i]);
          }
          this.registraNuevoTag(ndef);
          observer.next(true);
          observer.complete();
        
          console.log("habemus tag" , this.UID);
        },
        error: (err) => {
          console.log('Error reading tag', err);
          observer.next(false);
          observer.complete();
        }
      });
    });

  }

  autentifica(){
    return new Observable( (observer) =>{
      var NDEFhex='';
      for(var i=0;i<this.miTag.length;i++){
        var unByte=this.miTag.charCodeAt(i).toString(16);
        NDEFhex+=(unByte.length==1?'0':'')+unByte.toUpperCase();
      }
        this.geolocalizacion.leePosicion()
        .then((posicion:Position)=>{
               this.consulta(observer,NDEFhex,posicion.coords.latitude, posicion.coords.longitude);
        })
        .catch((e)=>{this.consulta(observer,NDEFhex)});
 
    });
  }
  consulta(observer:Subscriber<boolean>,NDEF:string,latitud=0,longitud=0){
    this.servidor.consulta(NDEF,longitud,latitud)
    .subscribe({
      next: (res:any)=>{
        console.log(res);
        this.autentificado=true;
        this.autentico=(res.Existe=='1');
        this.info=res;
        observer.next(this.autentico);
        observer.complete();
      }
    });
  
  }
  obtenNDEF(){
    return new Observable( (observer) =>{
      console.log('voy a conectar');
      console.log(this.nfc);

      this.nfc.connect("android.nfc.tech.IsoDep", 500)
      .then(()=>{
        console.log('conectado');
        this.seleccion()
        .subscribe((res:any)=>{
          if (res.exito){
            console.log('seleccionado');
            this.autentificacionClave0()
            .subscribe((res:any)=>{
              if (res.exito){
                console.log('Autentificado clave0');
                var tallaNonce=4;
					      this.nonce='';
					      var Base64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
					      for(var i=0;i<tallaNonce;i++){
                  this.nonce+=Base64.charAt(Math.floor(Math.random() * 64));
                }
				        this.escribeNDEF()
                .subscribe((res:any)=>{
                  if (res.exito){
                    console.log('NDEF escrito');
                    this.desautentificacion()
                    .subscribe((res:any)=>{
                      if (res.exito){
                        console.log('Desautentificado OK');
                        this.leeNDEF()
                        .subscribe((res:any)=>{
                          if (res.exito){
                            console.log('NDEF leido');
                            console.log('NDDEF:'+this.NDEF);
                            console.log('variable:'+this.variable);
                            console.log('UID:'+this.UID);
                            console.log('nonce:'+this.nonce);
                            this.nfc.close();
                            observer.next({'exito':true,'mensaje':""});
                            observer.complete();
                          }
                          else{
                            observer.next({'exito':false,'mensaje':"error leyendo NDEF:"+res.mensaje});
                            observer.complete();
                          }
                        });    
      }
                      else{
                        observer.next({'exito':false,'mensaje':"error escribiendo NDEF:"+res.mensaje});
                        observer.complete();
                      }
                    });    
                  }
                  else{
                    observer.next({'exito':false,'mensaje':"error escribiendo NDEF:"+res.mensaje});
                    observer.complete();
                  }
                });    
              }
              else{
                observer.next({'exito':false,'mensaje':"error autentificando:"+res.mensaje});
                observer.complete();
              }
            })
          }
          else{
            observer.next({'exito':false,'mensaje':"error seleccionando:"+res.mensaje});
            observer.complete();
          }
          });
          
      })
      .catch((error)=>{
				console.log('error');
				console.log("error conectando:"+error);
        observer.next({'exito':false,'mensaje':"error conectando:"+error});
        observer.complete();
				this.nfc.close();
			//	setTimeout(function(){este.obtenNDEF(callback,callbackError,objError,intento+1);},msEntreIntentos);
  		});
    });
  }
  private toHexString(bytes:Uint8Array):string{
    return Array.from(bytes, (byte) => {
      return ('0' + (byte & 0xff).toString(16)).slice(-2);
    }).join('');
  };
  private seleccion(){
    return new Observable( (observer) =>{
      console.log('selecciono');
  		var telegrama=new Uint8Array([0x00,0xA4,0x04,0x00,0x07,0xD2, 0x76,0x00,0x00,0x85,0x01,0x01,0x00]);
	  	//console.log(bytesACadena(telegrama));
		  try{
				this.nfc.transceive(telegrama)
				.then(
					  (respuestaBuffer)=>{
						var respuesta=new Uint8Array(respuestaBuffer);
						console.log('respuesta seleccion ');
						console.log(this.toHexString(respuesta));
						observer.next({'exito':true,'mensaje':"seleccionado"});
            observer.complete();
				})
				.catch((error)=>{
						console.log("error seleccionando "+error );
						observer.next({'exito':false,'mensaje':"error seleccionando "+error});
            observer.complete();
					});
      }
      catch(err){
        console.log('error seleccionando',err);
        observer.next({'exito':false,'mensaje':"error seleccionando c "+err});
      }	
    });
  }
  private autentificacionClave0(){ //Voy por aqui
    return new Observable( (observer) =>{
      console.log('quiero autentificarme');
      var claveNo=0;
      var telegrama=new Uint8Array([0x90,0x71,0x00,0x00,0x02,claveNo,0x00,0x00]);
      //console.log(bytesACadena(telegrama));
      var clave0=this.clave0;
      try{
          console.log('conectado aut0');
          this.nfc.transceive(telegrama)
          .then((respuestaBuffer)=>{
              var respuesta=new Uint8Array(respuestaBuffer);
              if (respuesta.length > 2) {
                if ((respuesta[respuesta.length - 1] == 175) &&
                  (respuesta[respuesta.length - 2] == 145)) {
                  var encriptadoRndB = [];
                  for (var i=0;i<respuesta.length-2;i++){
                     encriptadoRndB[i]=respuesta[i];
                  }
                  console.log('RndB encriptado:'+aesjs.utils.hex.fromBytes(encriptadoRndB));
                  var aes = new aesjs.ModeOfOperation.cbc(clave0);
                  var RndB =aes.decrypt(encriptadoRndB);
                  var RndBbytes=[];
                  for (var i = 0; i < RndB.length; i++) {
                    RndBbytes[i] = RndB[i];
                  }
                  var RndBEncriptado2=aes.encrypt(RndBbytes);
                  console.log('RndB rencriptado:'+aesjs.utils.hex.fromBytes(RndBEncriptado2));
                  console.log('RndB :'+aesjs.utils.hex.fromBytes(RndB));
                  
                  var RndB2 = [];
                  for (var i = 1; i < RndB.length; i++) {
                    RndB2[i - 1] = RndB[i];
                  }
                  RndB2[RndB.length - 1] = RndB[0];
                  var RndA:number[] = [];
                  for (var i = 0; i < RndB.length; i++) {
                    RndA[i] = Math.floor(Math.random() * 256);
                  }
                  var RndAYRndB = [];
                  for (var i = 0; i < RndB.length; i++) {
                    RndAYRndB[i] = RndA[i];
                    RndAYRndB[i + RndB.length] = RndB2[i];
                  }
                  console.log('voy a encriptar: ');
                  console.log(aesjs.utils.hex.fromBytes(RndAYRndB));
                  var RndAYRndBEncriptado = aes.encrypt(RndAYRndB);
                  console.log('respuesta encriptada:'+aesjs.utils.hex.fromBytes(RndAYRndBEncriptado));
                  var RndAYRndBEncritadoBytes=[];
                  for(var i=0;i<RndAYRndBEncriptado.length;i++)
                    RndAYRndBEncritadoBytes[i]=RndAYRndBEncriptado[i];
                  var RndAYRndB2 = aes.decrypt(RndAYRndBEncritadoBytes);
                  console.log('respuesta desencriptada:'+aesjs.utils.hex.fromBytes(RndAYRndB2));
                  var RndAYRndB2bytes=[];
                  for(var i=0;i<RndAYRndB2.length;i++)
                    RndAYRndB2bytes[i]=RndAYRndB2[i];
                  var arrayTelegrama2=[0x90, 0xaf, 0x00, 0x00, 0x20];
                  for (var i=0;i<RndAYRndBEncriptado.length;i++){
                    arrayTelegrama2[5+i]=RndAYRndBEncriptado[i];
                  }								
                  arrayTelegrama2[37] = 0;
                  console.log('telegrama:'+aesjs.utils.hex.fromBytes(arrayTelegrama2));
                  var telegrama2=new Uint8Array(arrayTelegrama2);
                  this.nfc.transceive(telegrama2)
                  .then(
                    function(respuesta2Buffer){
                      var respuesta2=new Uint8Array(respuesta2Buffer);
                      console.log('Respuesta:'+aesjs.utils.hex.fromBytes(respuesta2));
                      var rechazo=true;
                      if (respuesta2.length > 2) {
                        if ((respuesta2[respuesta2.length - 1] == 0) &&
                           (respuesta2[respuesta2.length - 2] == 145)) {
                            var TIRndA2PDcap2PCDcap2Encr=[]
                            for(var i=0;i<respuesta2.length-2;i++){
                              TIRndA2PDcap2PCDcap2Encr[i]=respuesta2[i];
                            }
                            var TIRndA2PDcap2PCDcap2Uint=aes.decrypt(TIRndA2PDcap2PCDcap2Encr);
                            var TIRndA2PDcap2PCDcap2=[];
                            for(var i=0;i<TIRndA2PDcap2PCDcap2Uint.length;i++)
                              TIRndA2PDcap2PCDcap2[i]=TIRndA2PDcap2PCDcap2Uint[i];
                            var identificadorTransaccion=TIRndA2PDcap2PCDcap2.slice(0,4);
                            var RndA2=TIRndA2PDcap2PCDcap2.slice(4,20);
                            var PDcap2=TIRndA2PDcap2PCDcap2.slice(20,26);
                            var PCDcap2=TIRndA2PDcap2PCDcap2.slice(26,32);
                            var RndA2rot=[];
                            for(var i=1;i<RndA2.length;i++) RndA2rot[i]=RndA2[i-1];
                            RndA2rot[0]=RndA2[RndA2.length-1];
                            if (RndA.length==RndA2rot.length){
                              var iguales=true;
                              for(var i=0;i<RndA.length;i++){
                                if (RndA[i]!=RndA2rot[i]){
                                  iguales=false;
                                  break;
                                }
                              }
                              if (iguales){
                                rechazo=false;
                                console.log('Identificado con clave0');
                                observer.next({'exito':true,'mensaje':""});
                                observer.complete();
                              }
                            }
                        }
                      }
                      if (rechazo){
                        console.log("error de identificacion ");
                        observer.next({'exito':false,'mensaje':"error de identificacion "});
                        observer.complete();
                      }
                    })
                  .catch(
                    function(error){
                      console.log("error enviando 2 "+error );
                      observer.next({'exito':false,'mensaje':"error enviando 2 "+error});
                      observer.complete();
                  });
              }
            }
          })
          .catch((error)=>{
            console.log("error enviando "+error );
            observer.next({'exito':false,'mensaje':"error enviando "+error});
            observer.complete();
          });
          
      }
      catch(err){
        console.log('error conectando',err);
        observer.next({'exito':false,'mensaje':"error de conexion nfc "+err});
        observer.complete();
      }
    });
  }
  private escribeNDEF(){ //Voy por aqui
    return new Observable( (observer) =>{
      console.log('quiero escribir NDEF');
      var mensaje=this.nuestroPrefijo+this.nonce+"/"+this.variable+"?m="+this.UID+"x000000x0000000000000000";
      var arrayTelegrama=[0x90,0x8d,0x00,0x00,(7+mensaje.length),0x02,0x07,0x00,0x00,(mensaje.length),0x00,0x00];
      for (var i=0;i<mensaje.length;i++){
        arrayTelegrama[12+i]=mensaje.charCodeAt(i);
      }
      arrayTelegrama[arrayTelegrama.length]=0;
      var telegrama=new Uint8Array(arrayTelegrama);
      this.nfc.transceive(telegrama)
      .then(
            function(respuestaBuffer){
              var respuesta=new Uint8Array(respuestaBuffer);
              if (respuesta.length == 2) {
                if ((respuesta[1] == 0) &&
                  (respuesta[0] == 0x91)) {
                    console.log('Escritura NDEF confirmada');
                    observer.next({'exito':true,'mensaje':""});
                    observer.complete();
                }
              }
            })
      .catch(
            function(error){
              console.log("NFC error escribiendo "+error );
              observer.next({'exito':false,'mensaje':"NFC error escribiendo "+error});
              observer.complete();
          
          });
     });
  }
  private desautentificacion(){
		return new Observable( (observer) =>{
      console.log('quiero desautentificarme');
      var claveNo=0;
      var telegrama=new Uint8Array([0x90,0x71,0x00,0x00,0x02,claveNo,0x00,0x00]);
      //console.log(bytesACadena(telegrama));
      try{
          console.log('conectado desaut');
          this.nfc.transceive(telegrama)
          .then(
              (respuestaBuffer)=>{
              var respuesta=new Uint8Array(respuestaBuffer);
              if (respuesta.length > 2) {
                if ((respuesta[respuesta.length - 1] == 175) &&
                  (respuesta[respuesta.length - 2] == 145)) {
                  var arrayTelegrama2=[0x90, 0xaf, 0x00, 0x00, 0x20];
                  for (var i=0;i<33;i++){
                    arrayTelegrama2[5+i]=0;
                  }
                  var telegrama2=new Uint8Array(arrayTelegrama2);
                  this.nfc.transceive(telegrama2)
                  .then(
                    function(respuesta2Buffer){
                      observer.next({'exito':true,'mensaje':""});
                      observer.complete();
                      })
                  .catch(
                    function(error){
                      console.log("error enviando 2 "+error );
                      observer.next({'exito':false,'mensaje':"error enviando 2 "+error});
                      observer.complete();
                    });
                  //console.log(aesjs.utils.hex.fromBytes(RndB));
                }
              }
          })
          .catch(
            function(error){
              console.log("error enviando "+error );
              observer.next({'exito':false,'mensaje':"error enviando "+error});
              observer.complete();
          });
      }
      catch(err){
        console.log('error conectando',err);
      }
    });
  }
  private analizaNDEF(){
		this.nonce=this.NDEF.substring(this.nuestroPrefijo.length,this.nuestroPrefijo.length+4);
		this.variable=this.NDEF.substring(this.nuestroPrefijo.length+5,this.NDEF.indexOf("?"));
		this.UID=this.NDEF.substring(this.nuestroPrefijo.length+5+this.variable.length+3,this.nuestroPrefijo.length+5+this.variable.length+3+14);
		console.log('salgo de analizar');
	};
	
	private leeNDEF(){
		return new Observable( (observer) =>{
      var telegrama=new Uint8Array([0x90,0xAD,0x00,0x00,0x07,0x02,0x00,0x00,0x00,0x00,0x00,0x00,0x00]);
      this.nfc.transceive(telegrama)
      .then(
          (respuestaBuffer)=>{
          var respuesta=new Uint8Array(respuestaBuffer);
          if (respuesta.length > 7) {
            if ((respuesta[respuesta.length-1] == 0) &&
              (respuesta[respuesta.length-2] == 0x91)) {
                this.NDEF="";
                var longitud=respuesta[4]-1;
                if (respuesta.length>=7+longitud){
                  for (var i=7;i<7+longitud;i++){
                    this.NDEF+=String.fromCharCode(respuesta[i]);
                  }
                  this.analizaNDEF();
                }
                observer.next({'exito':true,'mensaje':""});
                observer.complete();
            }
          }
      })
      .catch(
        function(error){
          console.log("NFC error leyendo "+error );
          observer.next({'exito':false,'mensaje':"NFC error leyendo "+error });
          observer.complete();
  });
    });
  }

}
