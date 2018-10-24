import { Injectable } from '@angular/core'; // Permite que la inyección de dependencia se pueda usar en el código del interceptor
import { // Permite que un pedido, manejador, evento e interceptor HTTP puedan usarse en el código
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { LoginService } from '../../login/service/login.service';
import { Observable } from 'rxjs'; // Permite que la clase Observable de la librería RXJS se puedan usar en el código
import { DtoService } from './dto.service'; // Permite que la clase DTOService definida anteriormente se pueda usar en el código

@Injectable()
// Se define la clase TokenInterceptor que implementará la interfaz HttpInterceptor
export class TokenInterceptor implements HttpInterceptor {
  // Se especifica el constructor que tendrá como parámetro de entrada la autorización del encabezado del pedido HTTP definida anteriormente
  constructor(public auth: DtoService) {}
  // Se define el método intercept que tiene como entrada el pedido y el manejador HTTP
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({ // Se clona el pedido original a fin de que sea inmutable
      setHeaders: { // Se establece el encabezado
    // Se emplea un esquema de autorización Bearer seguido del JWT obtenido por el método getToken de la autorización definida anteriormente
        Authorization: `Bearer ${this.auth.getToken()}`
      }
    });
    return next.handle(request); // Se pasa el control al siguiente interceptor en la cadena
  }
}
