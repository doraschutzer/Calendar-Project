import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SpentPage } from './spent.page';

describe('SpentPage', () => {
  let component: SpentPage;
  let fixture: ComponentFixture<SpentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SpentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
