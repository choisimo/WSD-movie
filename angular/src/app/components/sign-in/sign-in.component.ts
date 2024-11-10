import {Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../util/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})

export class SignInComponent implements OnInit, OnDestroy {
  isLoginVisible = true;
  email = '';
  password = '';
  registerEmail = '';
  registerPassword = '';
  confirmPassword = '';
  rememberMe = false;
  acceptTerms = false;
  isEmailFocused = false;
  isPasswordFocused = false;
  isRegisterEmailFocused = false;
  isRegisterPasswordFocused = false;
  isConfirmPasswordFocused = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // onMounted 로직을 여기에 구현
  }

  ngOnDestroy() {
    // onUnmounted 로직을 여기에 구현
  }

  get isLoginFormValid(): boolean {
    return !!this.email && !!this.password;
  }

  get isRegisterFormValid(): boolean {
    return !!this.registerEmail &&
      !!this.registerPassword &&
      !!this.confirmPassword &&
      this.registerPassword === this.confirmPassword &&
      this.acceptTerms;
  }

  toggleCard() {
    this.isLoginVisible = !this.isLoginVisible;
    setTimeout(() => {
      document.getElementById('register')?.classList.toggle('register-swap');
      document.getElementById('login')?.classList.toggle('login-swap');
    }, 50);
  }

  focusInput(inputName: string) {
    switch(inputName) {
      case 'email': this.isEmailFocused = true; break;
      case 'password': this.isPasswordFocused = true; break;
      case 'registerEmail': this.isRegisterEmailFocused = true; break;
      case 'registerPassword': this.isRegisterPasswordFocused = true; break;
      case 'confirmPassword': this.isConfirmPasswordFocused = true; break;
    }
  }

  blurInput(inputName: string) {
    switch(inputName) {
      case 'email': this.isEmailFocused = false; break;
      case 'password': this.isPasswordFocused = false; break;
      case 'registerEmail': this.isRegisterEmailFocused = false; break;
      case 'registerPassword': this.isRegisterPasswordFocused = false; break;
      case 'confirmPassword': this.isConfirmPasswordFocused = false; break;
    }
  }

  handleLogin() {
    this.authService.tryLogin(this.email, this.password).subscribe({
      next: (user) => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        alert('Login failed');
      }
    });
  }

  handleRegister() {
    this.authService.tryRegister(this.registerEmail, this.registerPassword).subscribe({
      next: () => {
        this.toggleCard();
      },
      error: (err) => {
        alert(err.message);
      }
    });
  }
}
