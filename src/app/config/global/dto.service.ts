import { Injectable } from '@angular/core'; // Permite que la inyección de dependencia se pueda usar en el código del servicio
// Permite que un cliente, encabezados, respuesta y errores en la respuesta HTTP puedan usarse en el código del servicio
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
// Permite que las clases Observable, throwError y of de la librería Reactive Extensions For JavaScript se puedan usar en el código
import { Observable, throwError, of } from 'rxjs';
// Permite que los operadores de RXJS como catchError y retry se puedan usar en el código
import { catchError, retry } from 'rxjs/operators';
// Permite que los atributos de urlUser definidos en el archivo url se puedan usar en el código
import { urlUser } from '../url';
// Permite que los mensajes de PrimeNG se puedan usar en el código del servicio
import {Message} from 'primeng/primeng';
// Permite que los métodos definidos en la clase AlertService se puedan usar en el código
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class DtoService { // Se define la clase Data Transfer Object Service
                          // que permite intercambiar datos entre el Front End y el Back End y viceversa
  msgs: Message[] = []; // Se especifica el arreglo msgs con contenido vacío
  auth: String = ''; // Se define la cadena de caracteres auth y se inicializa sin ningún caracter
  private httpOptions = { // Se establece el objeto httpOptions
    headers: new HttpHeaders({
      'Content-Type':  'application/json' // Se define un encabezado que declara explícitamente el tipo de cuerpo del pedido (json)
    }
  )
  };
  constructor(private _http: HttpClient, private alertService: AlertService) { } // Se especifica el constructor de la clase que tendrá como
  // parámetros de entrada al cliente HTTP y el servicio de alerta de mensajes importados anteriormente

  public getToken(): string { // Se define el método público para obtener el JWT, que se espera sea un string
    return sessionStorage.getItem('jwt'); // Se devuelve el ítem con la clave jwt almacenado en la sesión del navegador web
  }

  ejecutaPost(url, data): Observable<any> { // Se define el método para ejecutar un POST que tiene como entrada los datos a enviar
                                            // al Back End y su URL
      return this._http.post<any>(url, data, this.httpOptions) // Se devuelve el resultado de hacer una petición PUT a la URL del Back End,
      .pipe(                                                   // enviando los datos y considerando el formato json
        catchError(this.handleError) // Se detectan los errores y se canalizan mediante el manejador correspondiente
      );
  }
  ejecutaGet(url): Observable<any> { // Se define el método para ejecutar un GET que tiene como entrada la URL del Back End
    return this._http.get<any>(url, this.httpOptions) // Se devuelve el resultado de hacer una petición GET a la URL del Back End,
    .pipe(                                            // considerando el formato json
      catchError(this.handleError) // Se detectan los errores y se canalizan mediante el manejador correspondiente
    );
  }

  ejecutaPut(url, data): Observable<any> { // Se define el método para ejecutar un PUT que tiene como entrada los datos a enviar
                                           // al Back End y su URL
    return this._http.put(url, data, this.httpOptions) // Se devuelve el resultado de hacer una petición PUT a la URL del Back End,
    .pipe(                                             // enviando los datos y considerando el formato json
      catchError(this.handleError) // Se detectan los errores y se canalizan mediante el manejador correspondiente
    );
  }

  ejecutaDelete(url): Observable<any> { // Se define el método para ejecutar un DELETE que tiene como entrada la URL del Back End
       return this._http.delete(url, this.httpOptions); // Se devuelve el resultado de hacer una petición DELETE a la URL del Back End,
  }                                                     // considerando el formato json
  ejecutaDeleteId(url): Observable<any> { // Se define el método para ejecutar un DELETE que tiene como entrada la URL del Back End
     return this._http.delete(url, this.httpOptions); // Se devuelve el resultado de hacer una petición DELETE a la URL del Back End,
  }                                                   // considerando el formato json

  obtenerUrl(_modulo: String): Observable<any> { // Se define el método para obtener la URL
    const _url = urlUser; // Se asigna en la constante url el objeto urlUser
    // console.log(_url);
    return of(_url.find(x => x.modulo === _modulo)); // Se devuelve la url correspondiente al módulo en cuestión
  }
  // Se define el método para manejar errores, el cual tiene como entrada el error en la respuesta HTTP
  private handleError(error: HttpErrorResponse) {
    let resp: any; // Se define la variable resp que será de cualquier tipo
    if (error.error instanceof ErrorEvent) { // Si un error en el lado cliente o un error de red ha ocurrido
      // console.error('Error', error.error.message);
      resp = {estado: 'Error', mensaje: error.error.message, codigo: '500'}; // Se detalla el error producido y su código
    } else { // El Back End ha devuelto un código de respuesta no exitoso
      resp = {estado: 'Error del Backend ', mensaje: error.error, codigo: error.status}; // Se detalla el error producido y su código
    }
    return throwError(resp); // Se devuelve al usuario un observable con el mensaje de error resp
  }

  // Se define el método para manejar otros errores en función de una respuesta
  public manejoError(resp: any) {
    // Si la respuesta no es nula y sus encabezados no son indefinidos entonces no se realiza nada
    if (resp !== null && resp.headers !== undefined) {
      // sessionStorage.setItem('jwt', resp.headers['_headers'].get('x-auth-token'));
    }
    let mensaje = 'ERROR DE CONEXIÓN CON EL SERVIDOR'; // Se especifica un mensaje de error
    // Si el mensaje de la respuesta no es indefinido y no es nulo
    if (resp.message !== undefined && resp.message !== null) {
      mensaje = resp.message; // En la variable mensaje se asigna el mensaje de la respuesta
    }
    this.msgs = []; // Se define arreglo msgs con contenido vacío
    // Se inserta el mensaje de error en el arreglo msgs
    this.msgs.push({severity: 'error', summary: mensaje, detail: ''});
    // this.alertService.mostrarMensaje(this.msgs);
  }

  // Se define el método para mostrar mensajes resultado de la ejecución de una petición al Back End
  // Se tiene como entrada el mensaje y el parámetro booleano acumular
  public mostrarMensaje(msgs: Message[], persistirmsg = false, acumular = false) {
    if (!acumular) { // Si acumular es falso
      this.msgs = msgs; // En msgs se asigna el mensaje
    } else { // Caso contrario
      this.msgs = this.msgs.concat(msgs); // En msgs concatene el nuevo mensaje con lo anteriormente almacenado
    }
    // this.msgs = msgs;
   // this.alertService.mostrarMensaje(this.msgs, persistirmsg);
  }
}
