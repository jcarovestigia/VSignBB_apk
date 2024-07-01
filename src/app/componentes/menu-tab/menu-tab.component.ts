import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService} from '@ngx-translate/core'; 
import { TagService } from 'src/app/servicios/tag.service';


@Component({
  standalone:true,
  imports: [  
    CommonModule,
    IonicModule,
    FormsModule,
    TranslateModule
  ],
  selector: 'app-menu-tab',
  templateUrl: './menu-tab.component.html',
  styleUrls: ['./menu-tab.component.scss'],
})
export class MenuTabComponent implements OnInit {
  @Input() selectedSegment: string='';

  constructor(private router: Router, public tag:TagService, private translate:TranslateService) { }
  ngOnInit(): void {
  }

  segmentChanged(ev: any) {
    console.log(ev.detail.value);
    if(ev.detail.value == 'detalles'){
      this.router.navigate(['producto']);
    }
    else if(ev.detail.value == 'documentos'){
      this.router.navigate(['documentos']);
    }
    else if(ev.detail.value == 'registro'){
      this.router.navigate(['registro']);
    }
  }
  @HostListener('unloaded')
  pageDestroy() {
    console.log("Component is dead!");
  }

}
