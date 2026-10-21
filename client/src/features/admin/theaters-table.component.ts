import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TheaterService } from '../../core/services/theater.service';
import { AuthService } from '../../core/services/auth.service';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { lastValueFrom } from 'rxjs';
import { TheaterAddDialogComponent } from './theater-add-dialog.component';
import { TheaterEditDialogComponent } from './theater-edit-dialog.component';
import { TheaterDeleteDialogComponent } from './theater-delete-dialog.component';

@Component({
  selector: 'app-theaters-table',
  standalone: true,
  imports: [CommonModule, NzModalModule],
  template: `
    <div class="theaters-table">
      @if (isAdmin) {
        <h2>All Theaters</h2>
      } @else if (isOwner) {
        <h2>My Theaters</h2>
      }

      @if (isOwner) {
        <button class="action-btn add-btn"(click)="addTheater()">Add Theater</button>
      }

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Email</th>
            <th>Phone</th>

            @if (isAdmin) {
              <th>Owner</th>
              <th>Status</th>
            }

            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          @for (theater of theaters; track theater.id) {
            <tr>
              <td>{{ theater.name }}</td>
              <td>{{ theater.address }}</td>
              <td>{{ theater.email }}</td>
              <td>{{ theater.phone }}</td>

              @if (isAdmin) {
                <td>{{ getOwnerName(theater.owner) }}</td>
                <td>{{ theater.approvalStatus }}</td>
              }

              <td>
                @if (isOwner) {
                  <button class="action-btn" (click)="editTheater(theater)">Edit</button>
                  <button class="action-btn delete-btn" (click)="onDelete(theater.id)">Delete</button>
                }

                @if (isAdmin) {
                  @if (theater.approvalStatus === 'approved') {
                    <button class="action-btn reject-btn" (click)="onReject(theater.id)">Reject</button>
                  } @else {
                    <button class="action-btn approve-btn" (click)="onApprove(theater.id)">Approve</button>
                  }
                }

              </td>
            </tr>
          } @empty {
            <tr>
              <td [attr.colspan]="isAdmin ? 7 : 5">No theaters found</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .theaters-table {
      padding: 20px;
    }

    h2 {
      margin-bottom: 16px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: left;
    }

    th {
      background-color: #f5f5f5;
    }

    .action-btn {
      margin-right: 8px;
      padding: 6px 12px;
      border: none;
      cursor: pointer;
      border-radius: 4px;
    }

    .add-btn {
      margin-bottom: 16px;
      background-color: #1677ff;
      color: white;
    }

    .approve-btn {
      background-color: #52c41a;
      color: white;
    }

    .reject-btn,
    .delete-btn {
      background-color: #ff4d4f;
      color: white;
    }
  `]
})
export class TheatersTableComponent implements OnInit {
  private theaterService = inject(TheaterService);
  private authService = inject(AuthService);
  private modal = inject(NzModalService);
  private message = inject(NzMessageService);

  theaters: any[] = [];
  isAdmin = false;
  isOwner = false;

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.isOwner = this.authService.isOwner();
    this.loadTheaters();
  }

  loadTheaters(): void {
    if (this.isAdmin) {
      this.theaterService.getTheaters().subscribe({
        next: (data) => {
          this.theaters = data;
        },
        error: (err) => {
          console.error('Failed to load theaters', err);
        }
      });
    } else if (this.isOwner) {
      this.theaterService.getMyTheaters().subscribe({
        next: (data) => {
          this.theaters = data;
        },
        error: (err) => {
          console.error('Failed to load theaters', err);
        }
      });
    }
  }

  getOwnerName(owner: any): string {
    if (!owner) return 'N/A';
    if (typeof owner === 'string') return owner;
    return owner.name ?? 'N/A';
  }

  onApprove(id: string | undefined): void {
    if (!id) return;
  
    this.modal.confirm({
      nzTitle: 'Approve theater?',
      nzContent: 'Once approved, customers will be able to see this theater in listings.',
      nzOkText: 'Approve',
      nzOkType: 'primary',
      nzCancelText: 'Cancel',
      nzOnOk: () =>
        lastValueFrom(this.theaterService.approveTheater(id))
          .then(() => {
            this.message.success('Theater approved');
            this.loadTheaters();
          })
          .catch((err) => {
            this.message.error(err?.error?.message || 'Approve failed');
            throw err; // keeps the modal open so the admin can retry or cancel
          })
    });
  }
  
  onReject(id: string | undefined): void {
    if (!id) return;
  
    this.modal.confirm({
      nzTitle: 'Reject theater?',
      nzContent: 'This theater will be deactivated and hidden from customers. You can approve it again later.',
      nzOkText: 'Reject',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () =>
        lastValueFrom(this.theaterService.rejectTheater(id))
          .then(() => {
            this.message.success('Theater rejected');
            this.loadTheaters();
          })
          .catch((err) => {
            this.message.error(err?.error?.message || 'Reject failed');
            throw err;
          })
    });
  }
  
  addTheater(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Add Theater',
      nzContent: TheaterAddDialogComponent,
      nzFooter: null,
      nzWidth: 600
    });
  
    modalRef.afterClose.subscribe((result) => {
      if (!result) return;
  
      this.theaterService.addTheater(result).subscribe({
        next: () => {
          this.message.success('Theater added');
          this.loadTheaters();
        },
        error: (err) => {
          this.message.error(err?.error?.message || 'Failed to add theater');
        }
      });
    });
  }
  
  editTheater(theater: any): void {
    const modalRef = this.modal.create({
      nzTitle: 'Edit Theater',
      nzContent: TheaterEditDialogComponent,
      nzData: theater,
      nzFooter: null,
      nzWidth: 600
    });
  
    modalRef.afterClose.subscribe((result) => {
      if (!result) return;
  
      this.theaterService.updateTheater(theater.id, result).subscribe({
        next: () => {
          this.message.success('Theater updated');
          this.loadTheaters();
        },
        error: (err) => {
          this.message.error(err?.error?.message || 'Failed to update theater');
        }
      });
    });
  }
  
  onDelete(id: string | undefined): void {
    if (!id) return;
  
    const theater = this.theaters.find((t) => t.id === id);
  
    const modalRef = this.modal.create({
      nzTitle: 'Delete Theater',
      nzContent: TheaterDeleteDialogComponent,
      nzData: { theater },
      nzFooter: null,
      nzWidth: 480
    });
  
    modalRef.afterClose.subscribe((confirmed) => {
      if (!confirmed) return;
  
      this.theaterService.deleteTheater(id).subscribe({
        next: () => {
          this.message.success('Theater deleted');
          this.loadTheaters();
        },
        error: (err) => {
          this.message.error(err?.error?.message || 'Failed to delete theater');
        }
      });
    });
  }
  
}
