import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'movie-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule],
  template: `
    <div class="movie-dialog-container">
      <h2>Add Movie</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <!-- Title -->
        <nz-form-item>
          <nz-form-label [nzSpan]="24">Title</nz-form-label>
          <nz-form-control [nzSpan]="24" [nzErrorTip]="titleError">
            <input nz-input formControlName="title" placeholder="Enter movie title" />
          </nz-form-control>
          <ng-template #titleError>
            @if (form.get('title')?.hasError('required')) {
              <span>Title is required</span>
            }
          </ng-template>
        </nz-form-item>

        <!-- Description -->
        <nz-form-item>
          <nz-form-label [nzSpan]="24">Description</nz-form-label>
          <nz-form-control [nzSpan]="24" [nzErrorTip]="descriptionError">
            <textarea nz-input formControlName="description" placeholder="Enter movie description"></textarea>
          </nz-form-control>
          <ng-template #descriptionError>
            @if (form.get('description')?.hasError('required')) {
              <span>Description is required</span>
            }
          </ng-template>
        </nz-form-item>

        <!-- Poster (backend expects 'poster', not 'posterUrl') -->
        <nz-form-item>
          <nz-form-label [nzSpan]="24">Poster</nz-form-label>
          <nz-form-control [nzSpan]="24" [nzErrorTip]="posterError">
            <input nz-input formControlName="poster" placeholder="Enter poster URL" />
          </nz-form-control>
          <ng-template #posterError>
            @if (form.get('poster')?.hasError('required')) {
              <span>Poster is required</span>
            }
          </ng-template>
        </nz-form-item>

        <!-- Duration -->
        <nz-form-item>
          <nz-form-label [nzSpan]="24">Duration (minutes)</nz-form-label>
          <nz-form-control [nzSpan]="24" [nzErrorTip]="durationError">
            <input nz-input type="number" formControlName="duration" placeholder="e.g. 120" />
          </nz-form-control>
          <ng-template #durationError>
            @if (form.get('duration')?.hasError('required')) {
              <span>Duration is required</span>
            }
          </ng-template>
        </nz-form-item>

        <!-- Genre -->
        <nz-form-item>
          <nz-form-label [nzSpan]="24">Genre</nz-form-label>
          <nz-form-control [nzSpan]="24" [nzErrorTip]="genreError">
            <input nz-input formControlName="genre" placeholder="e.g. Action" />
          </nz-form-control>
          <ng-template #genreError>
            @if (form.get('genre')?.hasError('required')) {
              <span>Genre is required</span>
            }
          </ng-template>
        </nz-form-item>

        <!-- Date -->
        <nz-form-item>
          <nz-form-label [nzSpan]="24">Release Date</nz-form-label>
          <nz-form-control [nzSpan]="24" [nzErrorTip]="dateError">
            <input nz-input type="date" formControlName="date" />
          </nz-form-control>
          <ng-template #dateError>
            @if (form.get('date')?.hasError('required')) {
              <span>Date is required</span>
            }
          </ng-template>
        </nz-form-item>

        <button nz-button nzType="primary" [disabled]="!form.valid">Add Movie</button>
      </form>
    </div>
  `,
  styles: [`
    .movie-dialog-container { max-width: 500px; margin: 0 auto; padding: 20px; }
  `]
})
export class MovieDialogComponent {
  private fb = inject(FormBuilder);
  private modalRef = inject(NzModalRef);

  form: FormGroup = this.fb.group({
    title:    ['', Validators.required],
    description: ['', Validators.required],
    poster:   ['', Validators.required],  // <-- changed from posterUrl → poster
    duration: ['', Validators.required],
    genre:    ['', Validators.required],
    date:     ['', Validators.required]
  });

  onSubmit(): void {
    if (this.form.valid) {
      // Ensure date is a proper Date string for backend (ISO string)
      const raw = this.form.value;
      const payload = {
        ...raw,
        date: raw.date ? new Date(raw.date).toISOString() : ''
      };
      this.modalRef.close(payload);
    }
  }
}
