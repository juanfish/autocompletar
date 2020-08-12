import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DOCUMENT } from "@angular/common";
import { Observable, fromEvent, Subscription } from 'rxjs';
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
  
  // subscription: Subscription;

  txtConsulta: string;
  txtTpCliente: string = 'N';
  txtTitulo: string = '';

  clientes = [];
  titulos = [];
  arreglo = [];
  jsonDatosM: any;
  jsonDatosM2: any;

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

  ngOnInit() {

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
      this.clientes = [];
      this.arreglo.push(...resultado['CadJson']['Ficha']);

      this.arreglo.forEach((elemento) => {
        this.clientes.push(elemento["Nombreficha"])
      })
  

    })
  }


  getValuesTit() {
    
    let obs = this.http.post('http://la2K12.eastus.cloudapp.azure.com:8079/pview/PViewISAPI.dll/la/rest/TView/WBusca_titulos',
      this.paramXXX,
      this.httpOptions);

    return obs.subscribe(resultado => {

      console.log("resultado titulo")
      console.log(resultado)
      this.jsonDatosM2 = resultado;
      this.jsonDatosM2.visible = true;

      this.arreglo = [];
      this.titulos = [];
      this.arreglo.push(...resultado['CadJson']['Tit']);

      this.arreglo.forEach((elemento) => {
        this.titulos.push(elemento["Nombretitulo"])
      })
      
    })
  }


  subscribeCli(){
    console.log('cliente')
    this.subscription = this.searchTextChanged.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      map(search => this.getValues())
    ).subscribe((res) => {
      // console.log(res);
    });

  }

  onChangeConsultaCliente(evt) {
    console.log(evt.target)
    if ((this.clientes == undefined) || (this.clientes.length === 0)) {      
      this.paramXXX.param.Codigo = this.txtConsulta;
      this.paramXXX.param.Tpcodigo = this.txtTpCliente;
  
      this.searchTextChanged.next(evt.target.value);
    }
    if (evt.target.value === ''){
      this.clientes = [];
    }
  }

  subscribeTit(){
    console.log('titulo')

    this.subscription = this.searchTextChanged.pipe(
      debounceTime(700),
      distinctUntilChanged(),
      map(search => this.getValuesTit())
    ).subscribe((res) => {
      // console.log(res);
    });

  }


  onChangeConsultaTitulo(evt) {
    console.log(evt.target)
    if ((this.titulos == undefined) || (this.titulos.length === 0)) {  
    this.paramXXX.param.Codigo = this.txtTitulo;
    this.paramXXX.param.Tpcodigo = '';

    this.searchTextChanged.next(evt.target.value);
    }
    if (evt.target.value === ''){
      this.titulos = [];
    }

  }

  onRbChange(e){
    this.txtTpCliente = e.target.value;
    console.log(this.txtTpCliente);
  }

  onClickButton(){
    alert(this.txtConsulta);
  }
}
