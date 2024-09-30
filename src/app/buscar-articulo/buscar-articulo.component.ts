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
  searchForm: FormGroup;
  articulo: any = null;
  articuloNoEncontrado = false;
  disableFields = false;
  showModificationForm = false;
  // Constructor
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
            this.disableFields = false;
            this.showModificationForm = false;
          } else {
            this.articulo = null;
            this.articuloNoEncontrado = true;
            this.disableFields = true;
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

  // Mostrar el formulario de modificación
  mostrarFormularioModificacion() {
    this.showModificationForm = true;
  }

  // Eliminar el artículo
  eliminarArticulo() {
    if (this.articulo) {
      const sku = this.articulo.Sku;
      if (sku === undefined) {
        alert('Error: SKU no válido.');
        return;
      }

      // Confirmación antes de eliminar
      const confirmed = confirm('¿Estás seguro de que deseas eliminar este artículo?');
      if (confirmed) {
        this.http.delete(`http://localhost/api/articulos.php?sku=${sku}`).subscribe(
          (response) => {
            console.log('Artículo eliminado:', response);
            this.articulo = null;
            this.articuloNoEncontrado = false;
            alert('Artículo eliminado exitosamente.');
          },
          (error) => {
            console.error('Error al eliminar el artículo:', error);
            alert('Error al eliminar el artículo.');
          }
        );
      } else {
        console.log('Eliminación cancelada.');
      }
    } else {
      alert('Error: No se encontró el artículo para eliminar.');
    }
  }
}
