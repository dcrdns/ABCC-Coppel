import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormularioArticuloComponent } from '../formulario-articulo/formulario-articulo.component';

@Component({
  selector: 'app-buscar-articulo',
  standalone: true,
  imports: [HttpClientModule, CommonModule, ReactiveFormsModule, FormularioArticuloComponent],
  templateUrl: './buscar-articulo.component.html',
  styleUrls: ['./buscar-articulo.component.css']
})
export class BuscarArticuloComponent {
  searchForm: FormGroup; // Formulario de búsqueda
  articulo: any = null; // Para almacenar los datos del artículo
  articuloNoEncontrado = false; // Indica si el artículo no se encontró
  disableFields = false; // Bandera para desactivar campos en el formulario

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.searchForm = this.fb.group({
      sku: ['', Validators.required]
    });
  }

  // Buscar el artículo por SKU
  buscarArticulo() {
    const sku = this.searchForm.get('sku')?.value;
    if (sku) {
      this.http.get(`http://localhost/api/articulos.php?sku=${sku}`).subscribe(
        (data: any) => {
          if (data.length > 0) {
            this.articulo = data[0];
            this.articuloNoEncontrado = false;
            this.disableFields = false; // Si se encuentra el artículo, no desactivar campos
          } else {
            this.articulo = null;
            this.articuloNoEncontrado = true;
            this.disableFields = true; // Si no se encuentra el artículo, desactivar ciertos campos
          }
        },
        (error) => {
          console.error('Error al buscar el artículo:', error);
          this.articuloNoEncontrado = true;
          this.disableFields = true;
        }
      );
    }
  }
}
