import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MovieService } from '../../core/services/movie.service';

@Component({
  selector: 'app-show-add-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzButtonModule
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="show-form">
      <nz-form-item>
        <nz-form-label [nzSpan]="24" nzRequired>Movie</nz-form-label>
        <nz-form-control [nzSpan]="24">
          <nz-select formControlName="movie" nzPlaceHolder="Select movie">
            @for (movie of movies; track movie.id) {
              <nz-option
                [nzValue]="movie.id"
                [nzLabel]="movie.title || movie.name">
              </nz-option>
            }
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="24" nzRequired>Date & Time</nz-form-label>
        <nz-form-control [nzSpan]="24">
          <input nz-input type="datetime-local" formControlName="time" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="24" nzRequired>Ticket Price</nz-form-label>
        <nz-form-control [nzSpan]="24">
          <input
            nz-input
            type="number"
            formControlName="ticketPrice"
            placeholder="Enter ticket price"
          />
        </nz-form-control>
      </nz-form-item>

      <div class="dialog-actions">
        <button nz-button type="button" (click)="cancel()">Cancel</button>
        <button nz-button nzType="primary" htmlType="submit" [disabled]="form.invalid">
          Add Show
        </button>
      </div>
    </form>
  `,
  styles: [`
    .show-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 12px;
    }
  `]
})
export class ShowAddDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private modalRef = inject(NzModalRef);
  private movieService = inject(MovieService);
  private message = inject(NzMessageService);

  movies: any[] = [];

  form = this.fb.group({
    movie: ['', Validators.required],
    time: ['', Validators.required],
    ticketPrice: [null as number | null, [Validators.required, Validators.min(1)]]
  });

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.movieService.getMovies().subscribe({
      next: (res: any) => {
        this.movies = (res?.data ?? res ?? []).map((movie: any) => ({
          id: movie._id ?? movie.id,
          title: movie.title,
          name: movie.name
        }));
      },
      error: (err) => {
        this.message.error(err?.error?.message || 'Failed to load movies');
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.modalRef.close(this.form.value);
  }

  cancel(): void {
    this.modalRef.close();
  }
}
