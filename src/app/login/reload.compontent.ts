// Component: Permite importar el decorador del componente
// NgModule: Permite importar el decorador del modulo
// OnInit: Permite que esta interfaz se inicialice una vez que Angular haya arrancado
import { Component, NgModule, OnInit } from '@angular/core';
// Permite que la navegación de una vista a otra sea posible
import { Router } from '@angular/router';

@Component({ // Se usa el decorador del Componente y se añade meta datos
  selector: 'app-reload', // Se define el selector
  template: ` ` // No se especifica ningún archivo de plantilla
})

export class ReloadComponent implements OnInit { // Se define la clase ReloadComponent que implementará la interfaz OnInit

  constructor() { }

  ngOnInit() { // Se define el método ngOnInit
      // En la sesión del navegador web se remueve el ítem jwt definido en el Login
      sessionStorage.removeItem('jwt');
      // Se limpia el almacenamiento en la sesión del navegador web
      sessionStorage.clear();
      // Recarga la página o documento
      location.reload();
  }
}
