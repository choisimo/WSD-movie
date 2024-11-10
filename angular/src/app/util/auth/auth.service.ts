import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  tryLogin(email: string, password: string, saveToken = true): Observable<any> {
    return new Observable(observer => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((user: any) => user.id === email && user.password === password);

      if (user) {
        if (saveToken) {
          localStorage.setItem('TMDb-Key', user.password);
        }
        observer.next(user);
        observer.complete();
      } else {
        observer.error('Login failed');
        observer.complete();
      }
    });
  }

  tryRegister(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = users.some((existingUser: any) => existingUser.id === email);

        if (userExists) {
          throw new Error('User already exists');
        }

        const newUser = { id: email, password: password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        observer.next();
        observer.complete();
      } catch (err) {
        observer.error(err);
        observer.complete();
      }
    });
  }
}
