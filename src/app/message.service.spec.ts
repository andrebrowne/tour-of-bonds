import { TestBed, inject } from '@angular/core/testing';

import { MessageService } from './message.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      // Import the HttpClient mocking services
      imports: [ HttpClientTestingModule ],
      // Provide the service-under-test and any of its dependencies
      providers: [
        MessageService
      ]
    });
  });

  it('should be created', inject([MessageService], (service: MessageService) => {
    expect(service).toBeTruthy();
  }));
});
