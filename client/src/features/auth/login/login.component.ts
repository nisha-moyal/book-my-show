import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzMessageModule
  ],
  template: `
    <div class="login-container">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-label [nzSpan]="24">Email</nz-form-label>
          <nz-form-control [nzSpan]="24" [nzErrorTip]="emailError">
            <input nz-input formControlName="email" type="email" placeholder="Enter email" />
          </nz-form-control>
          <ng-template #emailError>
            <span *ngIf="form.get('email')?.hasError('required')">Email is required</span>
            <span *ngIf="form.get('email')?.hasError('email')">Invalid email</span>
          </ng-template>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="24">Password</nz-form-label>
          <nz-form-control [nzSpan]="24" [nzErrorTip]="passwordError">
            <input nz-input formControlName="password" type="password" placeholder="Enter password" />
          </nz-form-control>
          <ng-template #passwordError>
            <span *ngIf="form.get('password')?.hasError('required')">Password is required</span>
            <span *ngIf="form.get('password')?.hasError('minlength')">Min 6 characters</span>
          </ng-template>
        </nz-form-item>

        <button nz-button nzType="primary" [disabled]="!form.valid || isSubmitting">
          {{ isSubmitting ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 40px auto;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private message = inject(NzMessageService);
  private router = inject(Router);
  private authService = inject(AuthService);

  isSubmitting = false;

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  
    this.isSubmitting = true;
  
    try {
      const response = await this.userService.login(this.form.value);
      
      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.user.role);
        localStorage.setItem('user', response.data.user.name);
      }
      
      this.message.success('Login successful');
      // Here is the critical line:
      if (this.authService.isOwner()) {
        this.router.navigate(['/partner-dashboard']);
      } else if (this.authService.isAdmin()) {
        this.router.navigate(['/admin/theaters']);
      } else {
        this.router.navigate(['/']);
      }
    } catch (error: any) {
      this.message.error(error?.message || 'Login failed');
    } finally {
      this.isSubmitting = false;
    }
  }
}
