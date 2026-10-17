import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria, Equipo, EquipoPayload, Prestamo, PrestamoPayload } from './models';
const API = '/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  categorias(): Observable<Categoria[]> { return this.http.get<Categoria[]>(`${API}/categorias`); }
  crearCategoria(data: {nombre: string; descripcion?: string | null}): Observable<Categoria> {
    return this.http.post<Categoria>(`${API}/categorias`, data);
  }
  editarCategoria(id: number, data: {nombre: string; descripcion?: string | null}): Observable<Categoria> {
    return this.http.patch<Categoria>(`${API}/categorias/${id}`, data);
  }
  eliminarCategoria(id: number): Observable<unknown> { return this.http.delete(`${API}/categorias/${id}`); }

  equipos(filtros: {q?: string; categoriaId?: number | null; estado?: string; incluirInactivos?: boolean} = {}): Observable<Equipo[]> {
    let params = new HttpParams();
    if (filtros.q) params = params.set('q', filtros.q);
    if (filtros.categoriaId) params = params.set('categoriaId', filtros.categoriaId);
    if (filtros.estado) params = params.set('estado', filtros.estado);
    if (filtros.incluirInactivos) params = params.set('incluirInactivos', 'true');
    return this.http.get<Equipo[]>(`${API}/equipos`, { params });
  }
  crearEquipo(data: EquipoPayload): Observable<Equipo> { return this.http.post<Equipo>(`${API}/equipos`, data); }
  editarEquipo(id: number, data: EquipoPayload): Observable<Equipo> { return this.http.patch<Equipo>(`${API}/equipos/${id}`, data); }
  bajaEquipo(id: number): Observable<unknown> { return this.http.delete(`${API}/equipos/${id}`); }
  estadoEquipo(id: number, estado: 'DISPONIBLE' | 'MANTENIMIENTO'): Observable<Equipo> {
    return this.http.patch<Equipo>(`${API}/equipos/${id}/estado`, { estado });
  }

  misPrestamos(): Observable<Prestamo[]> { return this.http.get<Prestamo[]>(`${API}/prestamos/mios`); }
  todosPrestamos(): Observable<Prestamo[]> { return this.http.get<Prestamo[]>(`${API}/prestamos`); }
  vencidos(): Observable<Prestamo[]> { return this.http.get<Prestamo[]>(`${API}/prestamos/vencidos`); }
  solicitar(data: PrestamoPayload): Observable<Prestamo> { return this.http.post<Prestamo>(`${API}/prestamos`, data); }
  editarPrestamo(id: number, data: PrestamoPayload): Observable<Prestamo> {
    return this.http.patch<Prestamo>(`${API}/prestamos/${id}`, data);
  }
  accionPrestamo(id: number, accion: 'cancelar' | 'aprobar' | 'rechazar' | 'entregar' | 'devolver'): Observable<Prestamo> {
    return this.http.patch<Prestamo>(`${API}/prestamos/${id}/${accion}`, {});
  }
}
