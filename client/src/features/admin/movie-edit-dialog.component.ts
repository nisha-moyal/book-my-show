import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Movie } from '../../core/models/movie';

@Component({
  selector: 'movie-edit-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="save()">
      <nz-form-item>
        <nz-form-label [nzSpan]="24">Title</nz-form-label>
        <nz-form-control [nzSpan]="24">
          <input nz-input formControlName="title" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="24">Description</nz-form-label>
        <nz-form-control [nzSpan]="24">
          <textarea nz-input formControlName="description"></textarea>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="24">Poster URL</nz-form-label>
        <nz-form-control [nzSpan]="24">
          <input nz-input formControlName="poster" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="24">Duration (mins)</nz-form-label>
        <nz-form-control [nzSpan]="24">
          <input nz-input type="number" formControlName="duration" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="24">Genre</nz-form-label>
        <nz-form-control [nzSpan]="24">
          <input nz-input formControlName="genre" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="24">Release Date</nz-form-label>
        <nz-form-control [nzSpan]="24">
          <input nz-input type="date" formControlName="date" />
        </nz-form-control>
      </nz-form-item>

      <div class="footer">
        <button nz-button type="button" (click)="cancel()">Cancel</button>
        <button nz-button nzType="primary" type="submit" [disabled]="form.invalid">
          Update Movie
        </button>
      </div>
    </form>
  `,
  styles: [`
    .footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }
  `]
})
export class MovieEditDialogComponent {
  private fb = inject(NonNullableFormBuilder);
  private modalRef = inject(NzModalRef);
  private movie = inject<Movie>(NZ_MODAL_DATA);

  form = this.fb.group({
    title: [this.movie.title, Validators.required],
    description: [this.movie.description, Validators.required],
    poster: [this.movie.poster, Validators.required],
    duration: [this.movie.duration, [Validators.required, Validators.min(1)]],
    genre: [this.movie.genre, Validators.required],
    date: [this.toDateInput(this.movie.date), Validators.required]
  });

  save(): void {
    if (this.form.invalid) return;

    const value = this.form.getRawValue();

    this.modalRef.close({
      ...value,
      date: new Date(value.date).toISOString()
    });
  }

  cancel(): void {
    this.modalRef.close();
  }

  // Converts a Date or ISO string to the yyyy-MM-dd value used by <input type="date">
  private toDateInput(date: string | Date): string {
    return new Date(date).toISOString().split('T')[0];
  }
}
