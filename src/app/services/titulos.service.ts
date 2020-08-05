import { Injectable } from '@angular/core';
import { TituloClass } from '../shared/titulos.model';

@Injectable({
  providedIn: 'root'
})
export class TitulosService {
  titulos : TituloClass;

  constructor() { }
}
