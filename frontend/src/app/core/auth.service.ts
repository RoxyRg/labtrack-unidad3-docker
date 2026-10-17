import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginResponse, Usuario } from './models';

const KEY = 'labtrack-sesion';
const API = '/api';
function recuperar(): LoginResponse | null {
  try {
    const dato = sessionStorage.getItem(KEY);
    if (!dato) return null;
    const parsed: LoginResponse = JSON.parse(dato);
    return parsed.access_token && parsed.usuario?.rol ? parsed : null;
  } catch { return null; }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  readonly sesion = signal<LoginResponse | null>(recuperar());
  readonly usuario = () => this.sesion()?.usuario ?? null;
  readonly token = () => this.sesion()?.access_token ?? null;

  login(correo: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API}/auth/login`, { correo, password }).pipe(
      tap((respuesta) => {
        sessionStorage.setItem(KEY, JSON.stringify(respuesta));
        this.sesion.set(respuesta);
      }),
    );
  }
  registrar(usuario: { nombre: string; matricula?: string; correo: string; password: string }): Observable<Usuario> {
    return this.http.post<Usuario>(`${API}/auth/register`, usuario);
  }
  salir(): void {
    sessionStorage.removeItem(KEY);
    this.sesion.set(null);
    void this.router.navigateByUrl('/login');
  }
}
