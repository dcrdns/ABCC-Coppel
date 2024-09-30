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
  @Input() sku: string = '';
  @Input() articulo: any;
  @Input() disableFields: boolean = false;
  isEditing: boolean = false;
  confirmButtonText: string = 'Agregar Artículo';

  articuloForm: FormGroup;
  showAlert: boolean = false;
  alertType: string = '';
  alertMessage: string = '';
  postId: number | undefined;

  departamentos: any[] = [];
  clases: any[] = [];
  familias: any[] = [];
  //Constructor
  constructor(private fb: FormBuilder, private http: HttpClient) {
    const today = new Date();
    const fechaAlta = today.toISOString().split('T')[0];
    const fechaBaja = '1900-01-01';

    this.articuloForm = this.fb.group({
      sku: [{ value: this.sku, disabled: true }, [Validators.required]],
      articulo: ['', [Validators.required]],
      marca: ['', [Validators.required]],
      modelo: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      clase: ['', [Validators.required]],
      familia: ['', [Validators.required]],
      stock: ['', [Validators.required, Validators.min(1)]],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      fechaAlta: [{ value: fechaAlta, disabled: true }, [Validators.required]],
      fechaBaja: [{ value: fechaBaja, disabled: true }],
      descontinuado: [{ value: 0, disabled: false }]
    });

    this.obtenerCatalogos(); // Cargar los datos de las tablas
  }
  //Cambia datos
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
        descontinuado: this.articulo.Descontinuado === 1 ? true : false
      });
      this.isEditing = true; // Indicar que estamos en modo de edición
      this.confirmButtonText = 'Modificar Artículo';
    } else {
      this.isEditing = false; // Estamos en modo agregar
      this.confirmButtonText = 'Agregar Artículo';
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
            this.articuloForm.reset();
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
            this.articuloForm.reset();
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
