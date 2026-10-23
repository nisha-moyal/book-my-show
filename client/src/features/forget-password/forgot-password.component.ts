import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="forgot-password-container">
      <div class="forgot-password-card">
        <h2>Forgot Password</h2>
        <p class="subtitle">
          Enter your email to receive an OTP and reset your password.
        </p>

        <form [formGroup]="forgotPasswordForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="Enter your email"
            />
            <small
              class="error"
              *ngIf="
                forgotPasswordForm.get('email')?.touched &&
                forgotPasswordForm.get('email')?.invalid
              "
            >
              Please enter a valid email
            </small>
          </div>

          <button
            type="button"
            class="primary-btn"
            (click)="sendOtp()"
            *ngIf="!otpSent"
            [disabled]="loading"
          >
            {{ loading ? 'Sending...' : 'Send OTP' }}
          </button>

          <div *ngIf="otpSent" class="otp-section">
            <div class="form-group">
              <label for="otp">OTP</label>
              <input
                id="otp"
                type="text"
                formControlName="otp"
                placeholder="Enter OTP"
              />
            </div>

            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                formControlName="newPassword"
                placeholder="Enter new password"
              />
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                formControlName="confirmPassword"
                placeholder="Confirm new password"
              />
            </div>

            <small class="error" *ngIf="passwordMismatch">
              Password and confirm password must match
            </small>

            <button
              type="button"
              class="primary-btn"
              (click)="resetPassword()"
              [disabled]="loading"
            >
              {{ loading ? 'Resetting...' : 'Reset Password' }}
            </button>
          </div>

          <p class="success" *ngIf="successMessage">{{ successMessage }}</p>
          <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>

          <button type="button" class="back-btn" (click)="goToLogin()">
            Back to Login
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .forgot-password-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f7fb;
        padding: 20px;
      }

      .forgot-password-card {
        width: 100%;
        max-width: 420px;
        background: #fff;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      }

      h2 {
        margin: 0 0 8px;
        color: #222;
        text-align: center;
      }

      .subtitle {
        margin: 0 0 24px;
        font-size: 14px;
        color: #666;
        text-align: center;
      }

      .form-group {
        margin-bottom: 16px;
        display: flex;
        flex-direction: column;
      }

      label {
        margin-bottom: 6px;
        font-size: 14px;
        font-weight: 600;
        color: #333;
      }

      input {
        padding: 10px 12px;
        font-size: 14px;
        border: 1px solid #d0d7de;
        border-radius: 8px;
        outline: none;
      }

      input:focus {
        border-color: #1976d2;
      }

      .primary-btn,
      .back-btn {
        width: 100%;
        padding: 11px 14px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        margin-top: 8px;
      }

      .primary-btn {
        background: #1976d2;
        color: #fff;
      }

      .primary-btn:disabled {
        background: #90caf9;
        cursor: not-allowed;
      }

      .back-btn {
        background: transparent;
        color: #1976d2;
        border: 1px solid #1976d2;
      }

      .error {
        color: #d32f2f;
        font-size: 12px;
        margin-top: 4px;
        display: block;
      }

      .success {
        color: #2e7d32;
        font-size: 13px;
        margin-top: 12px;
        text-align: center;
      }

      .otp-section {
        margin-top: 12px;
      }
    `,
  ],
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  otpSent = false;
  loading = false;
  successMessage = '';
  errorMessage = '';

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    otp: [''],
    newPassword: ['', [Validators.minLength(6)]],
    confirmPassword: ['', [Validators.minLength(6)]],
  });

  get passwordMismatch(): boolean {
    const newPassword = this.forgotPasswordForm.get('newPassword')?.value;
    const confirmPassword =
      this.forgotPasswordForm.get('confirmPassword')?.value;

    return (
      !!newPassword && !!confirmPassword && newPassword !== confirmPassword
    );
  }

  sendOtp(): void {
    this.successMessage = '';
    this.errorMessage = '';

    const emailControl = this.forgotPasswordForm.get('email');

    if (emailControl?.invalid) {
      emailControl.markAsTouched();
      return;
    }

    const email = emailControl?.value as string;

    this.loading = true;

    this.userService.forgotPassword({ email }).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.otpSent = true;
        this.successMessage = response?.message || 'OTP sent successfully';
      },
      error: (error: any) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'Failed to send OTP';
      },
    });
  }

  resetPassword(): void {
    this.successMessage = '';
    this.errorMessage = '';

    const { email, otp, newPassword, confirmPassword } =
      this.forgotPasswordForm.value;

    if (!otp || !newPassword || !confirmPassword) {
      this.errorMessage = 'Please fill all fields';
      return;
    }

    if (this.passwordMismatch) {
      this.errorMessage = 'Password and confirm password must match';
      return;
    }

    this.loading = true;

    this.userService
      .resetPassword(email as string, {
        otp,
        newPassword,
      })
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.successMessage =
            response?.message || 'Password reset successful';

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (error: any) => {
          this.loading = false;
          this.errorMessage =
            error?.error?.message || 'Failed to reset password';
        },
      });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
