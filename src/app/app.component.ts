import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import define from '../../library/index.js';
 import {Runtime, Inspector} from '../../library/runtime.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'd3-demo';

  constructor( @Inject(DOCUMENT) private document: any){
    const runtime = new Runtime();
    const main = runtime.module(define, Inspector.into(document.body));

  }
   


}


