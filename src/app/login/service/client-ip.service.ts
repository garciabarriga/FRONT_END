import { Injectable } from '@angular/core'; // Permite que la inyección de dependencia se pueda usar en el código del servicio
// Permite que la clase DTOService definida anteriormente se pueda usar en el código
import { DtoService } from '../../config/global/dto.service';

@Injectable({
  providedIn: 'root'
})
export class GetIpCliente { // Se define la clase GetIpCliente

  constructor(private dto: DtoService) { } // Se especifica el constructor cuya entrada será el DTO definido anteriormente
  // Se define la url a donde se realizará la consulta de la IP
  private url: String = 'http://api.ipify.org/?format=json';

  getIpAddress() { // Se especifica el método para obtener la dirección IP
    return this.dto.ejecutaGet(this.url); // Se devuelve el resultado de ejecutar un GET hacia la url especificada previamente
  }
}
