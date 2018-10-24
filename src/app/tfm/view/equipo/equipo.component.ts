// Component: Permite importar el decorador del componente
// OnInit: Permite que esta interfaz se inicialice una vez que Angular haya arrancado
import { Component, OnInit } from '@angular/core';
// Permite que los métodos definidos en la clase RegistroService se puedan usar en el código
import { RegistroService } from '../../services/registro.service';
//const IntroJs = require('../../../../../node_modules/intro.js');

@Component({ // Se usa el decorador del Componente y se añade meta datos
  selector: 'app-equipo', // Se define el selector
  templateUrl: './equipo.component.html', // Se especifica el archivo de plantilla
  styleUrls: ['./equipo.component.css'] // Se especifica el archivo de estilo
})

export class EquipoComponent implements OnInit { // Se define la clase EquipoComponent que implementará la interfaz OnInit
  // Se especifica el constructor de la clase que tendrá como parámetro de entrada el servicio de Registro importado anteriormente
  constructor(private service: RegistroService) { }
  params: any = {}; // Se declara la propiedad params sin ningún tipo específico y se inicializa como un objeto vacío
  paramsBD: any = []; // Se declara la propiedad paramsBD sin ningún tipo específico y se inicializa como un arreglo vacío
  equipo: any = {}; // Se declara la propiedad equipo sin ningún tipo específico y se inicializa como un objeto vacío
  usuario: any = {}; // Se declara la propiedad usuario sin ningún tipo específico y se inicializa como un objeto vacío
  tablaParam = 'parametroConfigs'; // Se declara la propiedad tablaParam y se asigna el string correspondiente del Back End
  tablaEquipo = 'equipos'; // Se declara la propiedad tablaEquipo y se asigna el string correspondiente del Back End
  ppm_a: any = {valor: 0}; // Se declara la propiedad ppm_a sin ningún tipo específico y se inicializa como un objeto vacío
  mgm3_a = {valor: 0}; // Se declara la propiedad mgm3_a sin ningún tipo específico y se inicializa como un objeto vacío
  ppm_e: any = {valor: 0}; // Se declara la propiedad ppm_e sin ningún tipo específico y se inicializa como un objeto vacío
  mgm3_e: any = {valor: 0}; // Se declara la propiedad mgm3_e sin ningún tipo específico y se inicializa como un objeto vacío
  ngOnInit() { // Se define el método ngOnInit
    // En la propiedad usuario se asigna el ítem usuario almacenado en la sesión del navegador web pero en formato JSON
    this.usuario = JSON.parse(sessionStorage.getItem('usuario'));
    this.obtenerDatosUsuario(); // Se llama al método obtenerDatosUsuario
  }
  startTour() {
    console.log('Starting tour');

    /*const intro = IntroJs.introJs();
    intro.start();*/

  }
  obtenerDatosUsuario() { // Se define el método para obtener los datos correspondientes a un usuario
    // Se llama al método buscar del servicio de Registro pasándole como entrada la tabla de configuración de parámetros
    // y el código del usuario
    this.service.buscar(this.tablaParam, this.usuario.codigo).subscribe(
        (res) => {
            this.paramsBD = res; // En la propiedad paramsBD se asigna la respuesta
            this.armarObjetoParams(); // Se llama al método armarObjetoParams
        }
    );
    // Se llama al método buscar del servicio de Registro pasándole como entrada la tabla de equipos y el código del usuario
    this.service.buscar(this.tablaEquipo.concat('/usuario'), this.usuario.codigo).subscribe(
        (res) => {
            this.equipo = res; // En la propiedad equipo se asigna la respuesta
        }
    );
  }

  armarObjetoParams() { // Se define el método para crear el objeto de parámetros de configuración
    this.ppm_a = this.buscarparametro('ppm_a'); // En la propiedad ppm_a se asigna el valor del parámetro correspondiente
    this.ppm_e = this.buscarparametro('ppm_e'); // En la propiedad ppm_e se asigna el valor del parámetro correspondiente
    this.mgm3_a = this.buscarparametro('mgm3_a'); // En la propiedad mgm3_a se asigna el valor del parámetro correspondiente
    this.mgm3_e = this.buscarparametro('mgm3_e'); // En la propiedad mgm3_e se asigna el valor del parámetro correspondiente
  }
  buscarparametro(param) { // Se define el método para buscar el parámetro de configuración
    // En los parámetros de configuración para un determinado usuario se realiza la búsqueda en el campo nombre del parámetro requerido
    return this.paramsBD.find(x => x.nombre === param);
  }
  actualizarEstado(e) { // Se define el método para actualizar el estado del equipo
    this.equipo.estado = 1 ? this.equipo.estado : 0; // Se obtiene el valor del estado del equipo
    // Se llama al método modificar del servicio de Registro pasando como entrada la tabla de equipos y toda la información del equipo
    this.service.modificar(this.tablaEquipo, this.equipo).subscribe();
  }
  guardarParams() { // Se define el método para guardar los parámetros de configuración
    // Se llama al método modificar del servicio de Registro pasándole como entrada la tabla de parámetros de configuración
    // y el valor de ppm de alerta
    this.service.modificar(this.tablaParam, this.ppm_a).subscribe(() => {
      // Se llama al método modificar del servicio de Registro pasándole como entrada la tabla de parámetros de configuración
      // y el valor de ppm de emergencia
      this.service.modificar(this.tablaParam, this.ppm_e).subscribe(() => {
        // Se llama al método modificar del servicio de Registro pasándole como entrada la tabla de parámetros de configuración
        // y el valor de mgm3 de alerta
        this.service.modificar(this.tablaParam, this.mgm3_a).subscribe(() => {
          // Se llama al método modificar del servicio de Registro pasándole como entrada la tabla de parámetros de configuración
          // y el valor de mgm3 de emergencia
          this.service.modificar(this.tablaParam, this.mgm3_e).subscribe(() => {
            console.log('Actualizados'); // Se imprime por consola el mensaje correspondiente
          });
        });
      });
    });
  }
}
