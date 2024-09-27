import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-formulario-articulo',
  standalone: true,
  templateUrl: './formulario-articulo.component.html',
  styleUrls: ['./formulario-articulo.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule]
})
export class FormularioArticuloComponent implements OnChanges {
  @Input() sku: string = ''; // Recibe el SKU no encontrado (nuevo)
  @Input() articulo: any; // Recibe el objeto artículo
  @Input() disableFields: boolean = false; // Bandera para desactivar campos
  isEditing: boolean = false; // Bandera para saber si estamos modificando un artículo
  confirmButtonText: string = 'Agregar Artículo'; // Texto del botón de confirmación

  articuloForm: FormGroup;
  showAlert: boolean = false; // Control para mostrar alerta
  alertType: string = ''; // Tipo de alerta: success o danger
  alertMessage: string = ''; // Mensaje de alerta
  postId: number | undefined; // Para almacenar el ID del artículo agregado

  departamentos: any[] = []; // Para almacenar los departamentos
  clases: any[] = []; // Para almacenar las clases
  familias: any[] = []; // Para almacenar las familias

  constructor(private fb: FormBuilder, private http: HttpClient) {
    const today = new Date(); // Obtener la fecha actual
    const fechaAlta = today.toISOString().split('T')[0]; // Formatear fecha a YYYY-MM-DD
    const fechaBaja = '1900-01-01'; // Valor por defecto para Fecha Baja

    this.articuloForm = this.fb.group({
      sku: [{ value: this.sku, disabled: true }, [Validators.required]], // SKU desactivado
      articulo: ['', [Validators.required]],
      marca: ['', [Validators.required]],
      modelo: ['', [Validators.required]],
      departamento: ['', [Validators.required]], // Agregar validación
      clase: ['', [Validators.required]], // Agregar validación
      familia: ['', [Validators.required]], // Agregar validación
      stock: ['', [Validators.required, Validators.min(1)]],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      fechaAlta: [{ value: fechaAlta, disabled: true }, [Validators.required]], // Fecha Alta por defecto
      fechaBaja: [{ value: fechaBaja, disabled: true }], // Fecha Baja por defecto
      descontinuado: [{ value: 0, disabled: false }] // Descontinuado por defecto
    });

    this.obtenerCatalogos(); // Cargar los datos de las tablas
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['disableFields']) {
      if(!this.isEditing){
        this.articuloForm.get('sku')?.setValue(this.sku);
      }
      this.articuloForm.patchValue({ sku: this.sku });
      if (this.disableFields) {
        this.articuloForm.get('sku')?.disable();
        this.articuloForm.get('fechaAlta')?.disable();
        this.articuloForm.get('fechaBaja')?.disable();
        this.articuloForm.get('descontinuado')?.disable();
      } else {
        this.articuloForm.get('sku')?.enable();
        this.articuloForm.get('fechaAlta')?.enable();
        this.articuloForm.get('fechaBaja')?.enable();
        this.articuloForm.get('descontinuado')?.enable();
      }
    }

    if (changes['articulo'] && this.articulo) {
      // Llenar el formulario con los datos del artículo
      this.articuloForm.patchValue({
        sku: this.articulo.Sku,
        articulo: this.articulo.Articulo,
        marca: this.articulo.Marca,
        modelo: this.articulo.Modelo,
        departamento: this.articulo.Departamento,
        clase: this.articulo.Clase,
        familia: this.articulo.Familia,
        stock: this.articulo.Stock,
        cantidad: this.articulo.Cantidad,
        fechaAlta: this.articulo.FechaAlta,
        fechaBaja: this.articulo.FechaBaja,
        descontinuado: this.articulo.Descontinuado === 1 ? true : false // Convertir a booleano
      });
      this.isEditing = true; // Indicar que estamos en modo de edición
      this.confirmButtonText = 'Modificar Artículo'; // Cambiar texto del botón
    } else {
      this.isEditing = false; // Estamos en modo agregar
      this.confirmButtonText = 'Agregar Artículo'; // Cambiar texto del botón
    }
  }

  // Método para obtener los datos de Departamentos, Clases y Familias
  obtenerCatalogos() {
    this.http.get<any>('http://localhost/api/getCatalogos.php').subscribe(
      (data) => {
        this.departamentos = data.departamentos;
        this.clases = data.clases;
        this.familias = data.familias;
        console.log(this.familias)
      },
      (error) => {
        console.error('Error al cargar los catálogos:', error);
      }
    );
  }

  // Método para agregar o modificar el artículo
  onSubmit() {
    if (this.articuloForm.valid) {
      const nuevoArticulo = this.articuloForm.getRawValue(); // Obtener los valores
      nuevoArticulo.descontinuado = nuevoArticulo.descontinuado ? 1 : 0; // Convertir a 0 o 1

      console.log(this.isEditing ? 'Modificando Artículo:' : 'Agregando Artículo:', nuevoArticulo);
      console.log(nuevoArticulo)

      if (this.isEditing) {
        // Modificar el artículo
        this.http.put(`http://localhost/api/articulos.php?sku=${nuevoArticulo.sku}`, nuevoArticulo).subscribe(
          data => {
            console.log('Artículo modificado exitosamente:', data);
            this.showAlert = true;
            this.alertType = 'success';
            this.alertMessage = 'Artículo modificado exitosamente.';
            this.articuloForm.reset(); // Reiniciar el formulario
          },
          error => {
            console.error('Error al modificar el artículo:', error);
            this.showAlert = true;
            this.alertType = 'danger';
            this.alertMessage = 'Error al modificar el artículo. Por favor, intenta de nuevo.';
          }
        );
      } else {
        // Agregar el artículo
        this.http.post<any>('http://localhost/api/articulos.php', nuevoArticulo).subscribe(
          data => {
            this.postId = data.id;
            console.log('Artículo agregado exitosamente:', data);
            this.showAlert = true;
            this.alertType = 'success';
            this.alertMessage = 'Artículo agregado exitosamente.';
            this.articuloForm.reset(); // Reiniciar el formulario
          },
          error => {
            console.error('Error al agregar el artículo:', error);
            this.showAlert = true;
            this.alertType = 'danger';
            this.alertMessage = 'Error al agregar el artículo. Por favor, intenta de nuevo.';
          }
        );
      }
    } else {
      console.log('El formulario no es válido');
    }
  }
}
