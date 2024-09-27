import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BuscarArticuloComponent } from './buscar-articulo/buscar-articulo.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BuscarArticuloComponent,
    HttpClientModule // Asegúrate de incluir HttpClientModule aquí también
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Corregido aquí
})
export class AppComponent {
  title = 'ABCC-Coppel';
}
