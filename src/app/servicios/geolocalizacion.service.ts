import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class GeolocalizacionService {

  constructor() { }
  public leePosicion(){
       return Geolocation.getCurrentPosition({
         maximumAge:6000,
         timeout:5000,
         enableHighAccuracy: true});

    };
}
