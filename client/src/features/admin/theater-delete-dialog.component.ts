import { Component, inject } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-theater-delete-dialog',
  standalone: true,
  template: `
    <div>
      <h3>Confirm Deletion</h3>
      <p>Are you sure you want to delete the theater: <strong>{{ theater?.name }}</strong>?</p>

      <div class="footer-buttons">
        <button nz-button (click)="cancel()">Cancel</button>
        <button nz-button nzType="danger" (click)="confirmDelete()">Delete</button>
      </div>
    </div>
  `,
  styles: [`
    .footer-buttons {
      display: flex;
      justify-content: flex-end;
      margin-top: 24px;
      gap: 8px;
    }
  `]
})
export class TheaterDeleteDialogComponent {
  private modalRef = inject(NzModalRef);
  private data = inject(NZ_MODAL_DATA);
  theater = this.data?.theater;

  confirmDelete(): void {
    this.modalRef.close(true);
  }

  cancel(): void {
    this.modalRef.close(false);
  }
}
