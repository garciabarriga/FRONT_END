// Component: Permite importar el decorador del componente
// NgModule: Permite importar el decorador del modulo
// OnInit: Permite que esta interfaz se inicialice una vez que Angular haya arrancado
// ViewChild: Permite importar el decorador de propiedades
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
// Permite que los formularios puedan ser usados en el componente
import { NgForm } from '@angular/forms';
// Permite que la navegación de una vista a otra sea posible
import { Router } from '@angular/router';
// Permite que los módulos necesarios de PrimeNG se puedan usar en el código del componente
import {PasswordModule, Draggable } from 'primeng/primeng';
// Permite que los métodos definidos en la clase LoginService se puedan usar en el código del componente
import { LoginService } from './service/login.service';
// Permite que los métodos definidos en la clase AlertService se puedan usar en el código
import {Message} from 'primeng/components/common/api';
import {MessageService} from 'primeng/components/common/messageservice';
// Permite que los métodos definidos en las clases LecturaService y RegistroService se puedan usar en el código
import { LecturasService } from '../tfm/services/lecturas.service';
import { RegistroService } from '../tfm/services/registro.service';

@Component({ // Se usa el decorador del Componente y se añade meta datos
  selector: 'app-login', // Se define el selector
  templateUrl: './login.component.html', // Se especifica el archivo de plantilla
  styleUrls: ['./login.component.css'] // Se especifica el archivo de estilo
})

export class LoginComponent implements OnInit { // Se define la clase LoginComponent que implementará la interfaz OnInit

  public isLogin = false; // Control de ejecucion del login, previene que se ejecute varias veces el boton del login.
  usu: any = ''; // Se declara la propiedad usu sin ningún tipo en específico y se inicializa sin ningún caracter
  pass: any = ''; // Se declara la propiedad pass sin ningún tipo en específico y se inicializa sin ningún caracter
  public usuario: any = {}; // Se declara la propiedad pública usuario sin ningún tipo específico y se inicializa como un objeto vacío
  estadoResp: any = ''; // Se declara la propiedad estadoResp sin ningún tipo en específico y se inicializa sin ningún caracter

  msgs: Message[] = []; // Se especifica el arreglo msg con contenido vacío
  modelMenu: any[] = []; // Se especifica el arreglo modelMenu sin ningún tipo específico y con contenido vacío
  notificaciones: any[] = []; // Se especifica el arreglo notificaciones sin ningún tipo específico y con contenido vacío

  // Se especifica el constructor de la clase que tendrá como parámetros de entrada al servicio de Login, Alerta y Registro
  // importados anteriormente
  constructor(private servicio: LoginService, private servicioRest: RegistroService, private messageService: MessageService) { }

  ngOnInit() {
  }

  ejecutalogin() { // Se define el método para ejecutar el servicio de Login definido anteriormente
    // Se llama al método incioSesion del servicio de Login pasándole como entrada el usuario y password solicitados en el formulario
      this.servicio.inicioSesion(this.usu, (this.pass)).subscribe(
      (resp: any) => {
        if (resp) { // Si existe una respuesta del Back End
          this.usuario = (resp); // En el objeto usuario se asigna la respuesta del servidor
          // En la sesión del navegador web se define el ítem usuario donde se almacena el campo usuario de la respuesta en formato string
          sessionStorage.setItem('usuario', JSON.stringify(resp.user));
          // En la sesión del navegador web se define el ítem jwt donde se almacena el campo token de la respuesta
          sessionStorage.setItem('jwt', (resp.token));
          this.cargarMenu('admin'); // Se llama al método cargarMenu pasándole como entrada el perfil del usuario
          this.obtenerNotificaciones(resp.user); // Se llama al método obtenerNotificaciones pasando como entrada el usuario
          this.isLogin = true; // Se establece la propiedad isLogin como true debido a que ya se ha realizado el Login
        } else {
          // Se inserta el mensaje de error en el arreglo msg
          this.showError()
        }
      },
      (error: any) => {
        this.showError()
      }
    );

  }
  cargarMenu(rol: String) { // Se especifica el método cargarMenu que tiene como entrada un rol
    // Se llama al método buscaMenu del servicio de Login pasándole como entrada el rol
    this.servicio.buscaMenu(rol).subscribe(
      res => { // Si existe una respuesta
        this.modelMenu = res.model; // En el arreglo modelMenu se asigna el campo model de la respuesta
        // En la sesión del navegador web se define el ítem menu donde se almacena el arreglo modelMenu en formato string
        sessionStorage.setItem('menu', JSON.stringify(this.modelMenu));
      },
      error => { // Si existe un error
        this.showError()
      }
    );
  }
 obtenerNotificaciones(resp) { // Se especifica el método obtenerNotificaciones que tiene como entrada una respuesta
    // Se llama al método buscar del servicio de Registro pasándole como entrada la tabla notificaciones
    // y el campo código de la respuesta. En el arreglo notificaciones se asigna la respuesta obtenida
    this.servicioRest.buscar('notificaciones', resp.codigo).subscribe(asd => this.notificaciones = asd);
  }

  showError() {
    this.msgs = [];
    this.msgs.push({severity:'error', summary:'Error de inicio de sesión', detail:'Usuario/ password incorrectos'});
}
  logout() { // Se define el método de logout
    // En la sesión del navegador web se remueven los items usuario, menú y jwt definidos en el Login
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('menu');
    sessionStorage.removeItem('jwt');
    // Se limpia el almacenamiento en la sesión del navegador web
    sessionStorage.clear();
    // Se resetea las propiedades usu y pass
    this.usu = '';
    this.pass = '';
    // El valor de la propiedad de control de Login se regresa al estado original
    this.isLogin = false;
  }
}
