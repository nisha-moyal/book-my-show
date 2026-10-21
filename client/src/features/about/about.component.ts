import { Component } from '@angular/core';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'about',
  standalone: true,
  imports: [NzTypographyModule, NzCardModule, NzDividerModule],
  template: `
    <div class="about-container">
      <h1 nz-typography>About BookMyShow</h1>
      <p nz-typography nzType="secondary">
        Your one-stop destination for booking movies, concerts, and events.
      </p>
      
      <nz-divider></nz-divider>

      <div class="content">
        <nz-card nzTitle="Our Mission">
          <p>We aim to bring entertainment to your fingertips by providing a seamless booking experience for all your favorite shows across India.</p>
        </nz-card>

        <nz-card nzTitle="Built by" style="margin-top: 20px;">
          <p>Developed by <strong>Nisha Moyal</strong>, a Senior Full-Stack Engineer focused on building high-performance, scalable applications.</p>
        </nz-card>
      </div>
    </div>
  `,
  styles: [`
    .about-container {
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
      text-align: center;
    }
    .content {
      text-align: left;
    }
  `]
})
export class AboutComponent {}
