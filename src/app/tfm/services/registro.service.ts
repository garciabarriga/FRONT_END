import { Injectable } from '@angular/core'; // Permite que la inyección de dependencia se pueda usar en el código del servicio
// Permite que la clase DTOService definida anteriormente se pueda usar en el código
import { DtoService } from '../../config/global/dto.service';

@Injectable({
  providedIn: 'root'
})
export class RegistroService { // Se define la clase RegistroService
  private url: String; // Se declara la propiedad privada url del tipo string

  constructor(private dto: DtoService) { // Se especifica el constructor que tiene como entrada el DTO definido anteriormente
    this.dto.obtenerUrl('tfm').subscribe( // Se llama al método obtenerUrl de DTO pasándole como entrada el módulo tfm
      (resp: any) => {
        this.url = resp.url; // En la propiedad privada url se asigna la url correspondiente al módulo buscado
      }
    );
   }

   obtener(tabla) { // Se define el método para obtener los datos de una tabla (lecturas, clientes, equipos, etc)
    // Se devuelve el resultado de hacer una petición GET a la URL http://40.87.54.55:3000/tabla
    return this.dto.ejecutaGet(this.url.concat(tabla));
   }
   guardar(tabla, data) { // Se define el método para guardar datos en una tabla
    // Se devuelve el resultado de hacer una petición PUT a la URL http://40.87.54.55:3000/tabla enviando los datos necesarios
    return this.dto.ejecutaPut(this.url.concat(tabla), data) ;
   }
   modificar(tabla, data) { // Se define el método para modificar datos de una tabla
    // Se devuelve el resultado de hacer una petición POST a la URL http://40.87.54.55:3000/tabla enviando los datos necesarios
    return this.dto.ejecutaPost(this.url.concat(tabla), data) ;
   }
   eliminar(tabla, param) { // Se define el método para eliminar determinado parámetro de una tabla
    // Se devuelve el resultado de hacer una petición DELETE a la URL http://40.87.54.55:3000/tabla/param
    return this.dto.ejecutaDeleteId(this.url.concat(tabla, '/', param) ) ;
   }
   buscar(tabla, param) { // Se define el método para buscar determinado parámetro en una tabla
    // Se devuelve el resultado de hacer una petición GET a la URL http://40.87.54.55:3000/tabla/param
    return this.dto.ejecutaGet(this.url.concat(tabla, '/', param));
   }
}
