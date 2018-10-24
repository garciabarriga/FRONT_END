import { Injectable } from '@angular/core'; // Permite que la inyección de dependencia se pueda usar en el código del servicio
// Permite que la clase DTOService definida anteriormente se pueda usar en el código
import { DtoService } from '../../config/global/dto.service';

@Injectable({
  providedIn: 'root'
})
export class LecturasService { // Se define la clase LecturaService

  private url: String; // Se declara la propiedad privada url del tipo string
  constructor(private dto: DtoService) { // Se especifica el constructor que tiene como entrada el DTO definido anteriormente
    this.dto.obtenerUrl('tfm').subscribe( // Se llama al método obtenerUrl de DTO pasándole como entrada el módulo tfm
      (resp: any) => {
        this.url = resp.url; // En la propiedad privada url se asigna la url correspondiente al módulo buscado
      }
    );
   }

   obtenerLecturas() { // Se define el método para obtener lecturas
    // Se devuelve el resultado de hacer una petición GET a la URL http://40.87.54.55:3000/lecturas
    return this.dto.ejecutaGet(this.url.concat('lecturas'));
   }
   // Se define el método para obtener las lecturas corresponidentes a un usuario específico y entre un rango de fechas
   obtenerLecturasUsuario(usuario, fi, ff) {
    // Se devuelve el resultado de hacer una petición GET a la URL http://40.87.54.55:3000/lecturas/usuario/fechaIncial/fechaFinal
    return this.dto.ejecutaGet(this.url.concat('lecturas/', usuario, '/', fi, '/', ff));
   }
}
