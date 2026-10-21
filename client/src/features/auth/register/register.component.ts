import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user';

@Component({
  selector: 'register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ],
  template: `
    <div class="register-container">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-label [nzSpan]="24">Username</nz-form-label>
          <nz-form-control [nzSpan]="24" [nzErrorTip]="usernameError">
            <input nz-input formControlName="username" placeholder="Enter username" />
          </nz-form-control>
          <ng-template #usernameError>
            <span *ngIf="form.get('username')?.hasError('required')">Username is required</span>
            <span *ngIf="form.get('username')?.hasError('minlength')">Min 3 characters</span>
          </ng-template>
        </nz-form-item>

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
          {{ isSubmitting ? 'Registering...' : 'Register' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .register-container {
      max-width: 400px;
      margin: 40px auto;
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private message = inject(NzMessageService);
  private router = inject(Router);

  isSubmitting = false;

  form: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
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
      const user: User = {
        name: this.form.value.username,
        email: this.form.value.email,
        password: this.form.value.password,
        createdAt: new Date().toISOString()
      }
      await this.userService.register(user);

      this.message.success('Registration successful');

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
    } catch (error: any) {
      this.message.error(error?.message || 'Registration failed');
    } finally {
      this.isSubmitting = false;
    }
  }
}
