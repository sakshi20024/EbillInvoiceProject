import { SafeUrlPipe } from './safe-url.pipe';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';


// describe('SafeUrlPipe', () => {
//   it('create an instance', () => {
//    const pipe = new SafeUrlPipe();
//     expect(pipe).toBeTruthy();


describe('SafeUrlPipe', () => {
  let pipe: SafeUrlPipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    // Configure TestBed and provide DomSanitizer
    TestBed.configureTestingModule({
      providers: [DomSanitizer]
    });

    // Create an instance of the pipe and the sanitizer
    sanitizer = TestBed.inject(DomSanitizer);
    pipe = new SafeUrlPipe(sanitizer);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform a URL to a safe resource URL', () => {
    const url = 'https://example.com';
    const transformedUrl: SafeResourceUrl = pipe.transform(url);

    // Check that the output is of type SafeResourceUrl (this is the expected return type)
    expect(transformedUrl).toBeTruthy();
  });
});
