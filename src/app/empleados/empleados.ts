import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { EmpleadoService } from '../core/services/empleadoservice';
import { HttpErrorResponse } from '@angular/common/http';

interface Empleado {
  id?: number;
  nombre: string;
  apellido: string;
  correo: string;
  salario: number;
  created_at?: string;
  updated_at?: string;
}

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empleados.html',
  styleUrls: ['./empleados.css']
})
export class Empleados {

  empleados: Empleado[] = [];

  nuevoEmpleado: Empleado = {
    nombre: '',
    apellido: '',
    correo: '',
    salario: 0
  };

  constructor(private empleadoService: EmpleadoService) {
    this.listarEmpleados();
  }

  listarEmpleados(): void {
    this.empleadoService.getEmpleados().subscribe({
      next: (data: Empleado[]) => this.empleados = data,
      error: (err: HttpErrorResponse) => console.error('Error al cargar empleados', err)
    });
  }

  insertarEmpleado(form: NgForm | undefined): void {
  if (!form) return; // evita error si form es undefined

  if (!this.nuevoEmpleado.nombre || !this.nuevoEmpleado.apellido || !this.nuevoEmpleado.correo || !this.nuevoEmpleado.salario) {
    console.warn('Formulario incompleto');
    return;
  }

  this.empleadoService.agregarEmpleado(this.nuevoEmpleado).subscribe({
    next: (data: Empleado) => {
      this.empleados.push(data);

      // Limpiar formulario
      form.resetForm();

      this.nuevoEmpleado = { nombre: '', apellido: '', correo: '', salario: 0 };
    },
    error: (err: HttpErrorResponse) => console.error('Error al insertar empleado', err)
  });
}

}
