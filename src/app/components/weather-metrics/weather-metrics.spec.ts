import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherMetricsComponent } from './weather-metrics';

describe('WeatherMetrics', () => {
  let component: WeatherMetricsComponent;
  let fixture: ComponentFixture<WeatherMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherMetricsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WeatherMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
