import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BoardGuardService implements CanActivate {
  
  canActivate(route, state): boolean {
    return true;
  }

  constructor() { }
}
