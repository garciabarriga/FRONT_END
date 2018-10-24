import { Injectable } from '@angular/core'; // Permite que la inyección de dependencia se pueda usar en el código del servicio
import { Message } from 'primeng/components/common/api'; // Permite que los mensajes de PrimeNG se puedan usar en el código del servicio
// Permite que el servicio de mensajes de PrimeNG se puedan usar en el código del servicio
import { MessageService } from 'primeng/components/common/messageservice';


@Injectable({
  providedIn: 'root' // El inyector root es responsable de crear una instancia de AlertService invocando al constructor
                     // y haciendola disponible para toda la aplicación
})
export class AlertService { // Se define la clase AlertService que permite invocar mensajes

  constructor(private messageService: MessageService) { } // Se especifica el constructor de la clase que tendrá como parámetro de entrada
                                                          // el servicio de mensajes importado anteriormente
  addSingle(mensaje: Message) { // Se define el método para añadir un mensaje
    // { severity: 'success', summary: 'Service Message', detail: 'Via MessageService' }
    this.messageService.add(mensaje);
  }

  addMultiple(mensajes: Message[]) { // Se especifica el método para añadir todos los mensajes
    this.messageService.addAll(mensajes);
  }

  clear() { //  Se define el método para limpiar los mensajes
    this.messageService.clear();
  }
}
