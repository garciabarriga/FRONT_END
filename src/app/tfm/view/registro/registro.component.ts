// Component: Permite importar el decorador del componente
// OnInit: Permite que esta interfaz se inicialice una vez que Angular haya arrancado
import { Component, OnInit } from '@angular/core';
// Permite que los métodos definidos en la clase RegistroService se puedan usar en el código
import { RegistroService } from '../../services/registro.service';
//const IntroJs = require('../../../../../node_modules/intro.js');

@Component({
  selector: 'app-registro', // Se define el selector
  templateUrl: './registro.component.html', // Se especifica el archivo de plantilla
  styleUrls: ['./registro.component.css'] // Se especifica el archivo de estilo
})

export class RegistroComponent implements OnInit { // Se define la clase RegistroComponent que implementará la interfaz OnInit
// Se especifica el constructor de la clase que tendrá como parámetro de entrada el servicio de Registro importado anteriormente
  constructor(private service: RegistroService) { }

  rescatistas: any = []; // Se declara la propiedad rescatistas sin ningún tipo específico y se inicializa como un arreglo vacío
  perfiles: any = {}; // Se declara la propiedad perfiles sin ningún tipo específico y se inicializa como un objeto vacío
  rescatista: any = {}; // Se declara la propiedad rescatista sin ningún tipo específico y se inicializa como un objeto vacío
  usuario: any = {}; // Se declara la propiedad usuario sin ningún tipo específico y se inicializa como un objeto vacío
  parametros: any = []; // Se declara la propiedad parametros sin ningún tipo específico y se inicializa como un arreglo vacío
  crud: Boolean = false; // Se inicializa la propiedad crud
  cols: any = []; // Se declara la propiedad cols sin ningún tipo específico y se inicializa como un arreglo vacío
  tablarescatista = 'rescatistas'; // Se declara la propiedad tablarescatista y se asigna el string correspondiente del Back End
  tablaUsuario = 'usuarios'; // Se declara la propiedad tablaUsuario y se asigna el string correspondiente del Back End
  tablaParam = 'parametroConfigs'; // Se declara la propiedad tablaParam y se asigna el string correspondiente del Back End

  ngOnInit() {
    this.cargar(); // Se llama al método cargar
    this.cols = [ // Se establece la propiedad cols

      { field: 'identificacion', header: 'Documento' },
      { field: 'nombres', header: 'Nombre' },
      { field: 'apellidos', header: 'Apellido' },
      { field: 'direccion', header: 'Direccion' },
      { field: 'telefono', header: 'Telefono' },
      { field: 'movil', header: 'Movil' },
      { field: 'correo', header: 'Correo' }
    ];
    this.perfiles = [ // Se establece la propiedad perfiles
      { label: 'Administrador', value: '1' },
      { label: 'Rescatista', value: '2' }
    ];
  }
  opt() { // Se define el método opt
    this.usuario = {}; // Se resetean las propiedad usuario, rescatista y parametros
    this.rescatista = {};
    this.parametros = {};
    this.crud = !this.crud; // Se cambia el valor de la propiedad crud
  }
  onRowUnselect(e) {
  }
  startTour() {
    console.log('Starting tour');

   /* const intro = IntroJs.introJs();
    // Start tutorial
    intro.start();*/

  }
startTour1() {
    console.log('Starting tour');
  /*
    const intro = IntroJs.introJs();
    // Start tutorial
    intro.goToStepNumber(100).start();
    */
    

  }
  
  onRowSelect(e) { // Se define el método onRowSelect que tiene como entrada un evento
    // Se llama al método buscar del servicio de Registro pasándo como parámetros la tabla de usuarios y la identificación
    this.service.buscar(this.tablaUsuario, e.data.identificacion).subscribe(
      (resp: any) => {
        this.usuario = resp; // Se asigna en usuario la respuesta obtenida
        // Se llama al método buscarPerfil pasándole como entrada el campo perfil de la respuesta
        // Luego el resultado se asigna a la propiedad perfil del usuario
        this.usuario.perfil = this.buscarPerfil(resp.perfil);
        this.crud = true; // Se asigna el valor de true en la propiedad crud
      },
      (err) => {
        this.crud = true; // Se asigna el valor de true en la propiedad crud
      }
    );
  }
  buscarPerfil(perfil) { // Se define el método buscarPerfil que tiene como entrada un perfil
    const f = this.perfiles.find (x => x.value === perfil); // Se realiza la búsqueda en sí del perfil
    return f ? f : null; // Se devuelve el perfil en caso de que no sea nulo
  }

  cargar() { // Se define el método cargar
    // Se llama al método obtener del servicio de Registro pasándo como parámetros la tabla de rescatistas
    this.service.obtener(this.tablarescatista).subscribe(
      (resp) => {
        this.rescatistas = resp; // Se asigna en rescatistas la respuesta obtenida
        this.crud = false; // Se asigna el valor de false en la propiedad crud
      }
    );
  }
  validar() { // Se define el método validar
    return true; // Devuelve verdadero
  }

  
  eliminar() { // Se define el método para eliminar los datos del rescatista y usuario
    if (this.rescatista._id) { // Si existe el id del rescatista
    // Se llama al método eliminar del servicio de Registro pasándo como parámetros la tabla de rescatistas y el id del rescatista
      this.service.eliminar(this.tablarescatista, this.rescatista._id).subscribe(
        () => {
          if (this.usuario._id) { // Si existe el id del usuario
            // Se llama al método eliminar del servicio de Registro pasándo como parámetros la tabla de usuarios y el id del usuario
            this.service.eliminar(this.tablaUsuario, this.usuario._id).subscribe(() => {
            // Se llama al método eliminar del servicio de Registro pasándo como parámetros la tabla de equipos y el código del usuario
              this.service.eliminar('equipos', this.usuario.codigo).subscribe(() => {
            // Se llama al método eliminar del servicio de Registro pasándo como parámetros la tabla de parámetros y el código del usuario
                this.service.eliminar(this.tablaParam, this.usuario.codigo).subscribe((e) => {
                    this.cargar(); // Se llama al método cargar
                });
              });
            });
          }
        }
      );
    }
  }
  guardar() { // Se define el método para guardar los datos del rescatista y usuario
    if (this.validar()) { // Primero se validan los datos ingresados
      // Se asigna el perfil del usuario y por defecto se establece un perfil de administrador
        this.usuario.perfil = this.usuario.perfil ? this.usuario.perfil.value : '1';
      // Se asigna la identificación del rescatista en la propiedad rescatista del objeto usuario
      this.usuario.rescatista = this.rescatista.identificacion;
      if (!this.rescatista._id) { // Si el rescatista aún no tiene un id
    // Se llama al método guardar del servicio de Registro pasándo como parámetros la tabla de rescatistas y los datos del rescatista
        this.service.guardar(this.tablarescatista, this.rescatista).subscribe(
          (resp: any) => { // Si se recibe una respuesta
    // Se llama al método guardar del servicio de Registro pasándo como parámetros la tabla de usuarios y los datos del usuario
            this.service.guardar(this.tablaUsuario, this.usuario).subscribe(
              (resp1: any) => { // Si se recibe una respuesta
     // Se llama al método guardarDatosSensor pasando como entrada el código del usuario
    // Se llama al método cargar para mostrar en la tabla todos los rescatistas registrados
                this.cargar();
              }
            );
          }
        );
      } else { // Si el rescatista ya tiene un id
    // Se llama al método modificar del servicio de Registro pasándo como parámetros la tabla de rescatistas y los datos del rescatista
        this.service.modificar(this.tablarescatista, this.rescatista).subscribe(
          (resp: any) => {
    // Se llama al método modificar del servicio de Registro pasándo como parámetros la tabla de usuarios y los datos del usuario
            this.service.modificar(this.tablaUsuario, this.usuario).subscribe(
              (resp1: any) => {
            // Se llama al método cargar para mostrar en la tabla todos los rescatistas registrados
                this.cargar();
              }
            );
          }
        );
      }
    }
  }
}
