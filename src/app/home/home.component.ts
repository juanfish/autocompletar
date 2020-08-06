import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DOCUMENT } from "@angular/common";
import { Observable, fromEvent } from 'rxjs';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { THIS_EXPR, ThrowStmt } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchTextChanged = new Subject<string>();
  subscription: any;
  txtConsulta: string;
  txtTpCliente: string = '';

  nombres = [];
  arreglo = [];
  jsonDatosM: any;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'text/plain'
    })
  };

  paramXXX = {
    Json: true,
    param: {
      Codigo: "",
      Tpcodigo: ""
    }
  }

  constructor(private http: HttpClient) {

  }

  getValues() {
    

    let obs = this.http.post('http://la2K12.eastus.cloudapp.azure.com:8079/pview/PViewISAPI.dll/la/rest/TView/WBusca_DatosM',
      this.paramXXX,
      this.httpOptions);

    return obs.subscribe(resultado => {
      console.log(resultado)
      this.jsonDatosM = resultado;
      this.jsonDatosM.visible = true;

      this.arreglo = [];
      this.nombres = [];
      this.arreglo.push(...resultado['CadJson']['Ficha']);

      this.arreglo.forEach((elemento) => {
        this.nombres.push(elemento["Nombreficha"])
      })
      console.table(this.nombres)

    })
  }

  ngOnInit() {

    this.subscription = this.searchTextChanged.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      map(search => this.getValues())
    ).subscribe((res) => {
      console.log(res);
    });
  }

  onChangeConsultaCliente(evt) {
    this.paramXXX.param.Codigo = this.txtConsulta;
    this.paramXXX.param.Tpcodigo = this.txtTpCliente;

    this.searchTextChanged.next(evt.target.value);
  }

  onChangeConsultaTitulo(evt) {
    this.paramXXX.param.Codigo = this.txtConsulta;
    this.paramXXX.param.Tpcodigo = this.txtTpCliente;

    // this.searchTextChanged.next(evt.target.value);
  }

  onRbChange(e){
    this.txtTpCliente = e.target.value;
    console.log(this.txtTpCliente);
  }


}
