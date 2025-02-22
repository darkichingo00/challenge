import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about-worksync',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about-worksync.component.html',
  styleUrl: './about-worksync.component.scss'
})
export class AboutWorksyncComponent {

}
