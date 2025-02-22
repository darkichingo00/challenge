import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutWorksyncComponent } from './about-worksync.component';

describe('AboutWorksyncComponent', () => {
  let component: AboutWorksyncComponent;
  let fixture: ComponentFixture<AboutWorksyncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutWorksyncComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AboutWorksyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
