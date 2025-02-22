import { Component } from '@angular/core';
import { AboutWorksyncComponent } from '../about/about-worksync/about-worksync.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AboutWorksyncComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
