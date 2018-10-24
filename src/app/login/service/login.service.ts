import { Injectable } from '@angular/core'; // Permite que la inyección de dependencia se pueda usar en el código del servicio
// Permite que la clase DTOService definida anteriormente se pueda usar en el código del servicio
import {DtoService} from '../../config/global/dto.service';
// Permite que el menú de usuario se pueda usar en el código del servicio
import {userMenu} from '../../config/userMenu';
// Permite que las clases Observable y of de la librería Reactive Extensions For JavaScript se puedan usar en el código del servicio
import { Observable } from 'rxjs';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'

})
export class LoginService { // Se define la clase LoginService

  private url: string; // Se declara la propiedad privada url del tipo string

  constructor(private dto: DtoService) { // Se especifica el constructor que tiene como entrada el DTO definido anteriormente
    this.dto.obtenerUrl('tfm').subscribe( // Se llama al método obtenerUrl de DTO pasándole como entrada el módulo tfm
      (resp: any) => {
        this.url = resp.url; // En la propiedad privada url se asigna la url correspondiente al módulo buscado
      }
    );
   }

   inicioSesion(user: String, pass: String) { // Se define el método inicioSesion que tiene como entrada el usuario y password, ambos string
       const data = {nombreUsuario: user, password: pass}; // Se establece el objeto data que contiene el usuario y password
       // Se devuelve el resultado de hacer una petición POST a la URL http://40.87.54.55:3000/login/ enviando el objeto data
       return this.dto.ejecutaPost(this.url + 'login/', data);
   }
   buscaMenu(rol: String): Observable<any> { // Se establece el método buscaMenu que tiene como entrada el rol
      const b = userMenu; // Se define en la constante b el menú del usuario
      return of(b.find(x => x.rol === rol)); // Se devuelve el menú del usuario correspondiente al rol requerido
   }
   public mensaje(as) { // Se define el método mensaje
      this.dto.mostrarMensaje(as); // Se llama al método mostrarMensaje del DTO pasándole como entrada el mensaje
   }
}
