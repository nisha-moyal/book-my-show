import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'app-theater-edit-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzButtonModule,
    NzSwitchModule
  ],
  template: `
    <div class="dialog-container">
      <h2>Edit Theater</h2>
      
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <!-- Name Field -->
        <nz-form-item>
          <nz-form-label nzRequired>Name</nz-form-label>
          <nz-form-control nzHasFeedback [nzErrorTip]="nameError">
            <input nz-input placeholder="Enter theater name" formControlName="name" />
          </nz-form-control>
          <ng-template #nameError>
            @if(form.get('name')?.hasError('required')) {
              <span>Name is required</span>
            }

            @if(form.get('name')?.hasError('minlength')) {
              <span>Name must be at least 3 characters</span>
            }
          </ng-template>
        </nz-form-item>

        <!-- Address Field -->
        <nz-form-item>
          <nz-form-label nzRequired>Full Address</nz-form-label>
          <nz-form-control nzHasFeedback [nzErrorTip]="addressError">
            <textarea 
              nz-input 
              placeholder="Enter full address" 
              formControlName="address" 
              rows="3">
            </textarea>
          </nz-form-control>
          <ng-template #addressError>
            @if(form.get('address')?.hasError('required')) {
              <span>Address is required</span>
            }

            @if(form.get('address')?.hasError('minlength')) {
              <span>Address must be at least 10 characters</span>
            }
          </ng-template>
        </nz-form-item>

        <!-- Email Field -->
        <nz-form-item>
          <nz-form-label nzRequired>Email</nz-form-label>
          <nz-form-control nzHasFeedback [nzErrorTip]="emailError">
            <input nz-input placeholder="Enter email" formControlName="email" />
          </nz-form-control>
          <ng-template #emailError>
            @if (form.get('email')?.hasError('email')) {
              <span>Enter a valid email</span>
            }

            @if (form.get('email')?.hasError('required')) {
              <span>Email is required</span>
            }
          </ng-template>
        </nz-form-item>

        <!-- Phone Field -->
        <nz-form-item>
          <nz-form-label nzRequired>Contact Phone</nz-form-label>
          <nz-form-control nzHasFeedback [nzErrorTip]="phoneError">
            <nz-input-number
              style="width: 100%"
              [nzMin]="1000000000"
              [nzMax]="9999999999"
              placeholder="Enter 10-digit phone number"
              formControlName="phone">
            </nz-input-number>
          </nz-form-control>
          <ng-template #phoneError>
            @if(form.get('phone')?.hasError('required')) {
              <span>Phone is required</span>
            }

            @if(form.get('phone')?.hasError('min')) {
              <span>Phone must be at least 10 digits</span>
            }
          </ng-template>
        </nz-form-item>

        <!-- Buttons -->
        <div class="footer-buttons">
          <button nz-button type="button" (click)="cancel()">Cancel</button>
          <button 
            nz-button 
            nzType="primary" 
            type="submit" 
            [disabled]="form.invalid || form.pristine">
            Update Theater
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      max-width: 600px;
      padding: 0px;
    }

    h2 {
      margin-bottom: 24px;
    }

    nz-form-item {
      margin-bottom: 16px;
    }

    .footer-buttons {
      display: flex;
      justify-content: flex-end;
      margin-top: 24px;
      gap: 8px;
    }
  `]
})
export class TheaterEditDialogComponent {
  private fb = inject(NonNullableFormBuilder);
  private modalRef = inject(NzModalRef);
  private theaterData = inject(NZ_MODAL_DATA);

  form = this.fb.group({
    name: [this.theaterData.name, [Validators.required, Validators.minLength(3)]],
    address: [this.theaterData.address, [Validators.required, Validators.minLength(10)]],
    email: [this.theaterData.email, [Validators.required, Validators.email]],
    phone: [this.theaterData.phone, [Validators.required, Validators.min(1000000000)]],
    isActive: [this.theaterData.isActive]
  });

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.modalRef.close(this.form.getRawValue());
  }

  cancel(): void {
    this.modalRef.close();
  }
}
