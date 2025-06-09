import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Invoice } from '../invoice';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FlashVideoPopupComponent } from '../flash-video-popup/flash-video-popup.component';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-invoice-display',
  standalone:true,
  imports: [CommonModule, FontAwesomeModule, FlashVideoPopupComponent],
  templateUrl: './invoice-display.component.html',
  styleUrls: ['./invoice-display.component.css']
})
export class InvoiceDisplayComponent implements OnInit {
  invoice: Invoice | null = null;
  mobileNumber: string | null = null;

  loading = false;
  errorMessage = '';
  showPopup=true;

 headerImageList: string[] = [];
 footerImageList: string[] =[];

 userRating: number = 0;
 maxStars: number = 5;
  hoverRating = 0;
  ratingSubmitted = false;
  currentHeaderIndex = 0;
  intervalId: any;


 pdfBlobUrl: SafeResourceUrl | null = null;
 forDownload: string | null = null; 
  
  setRating(star: number): void {
    this.userRating = star;
     this.hoverRating = star;
    this.ratingSubmitted = true;
  }

  faFacebook = faFacebook;
  faInstagram = faInstagram;
  faTwitter = faTwitter;

  socialLinks = {
    facebook: 'https://facebook.com/zudio',
    instagram: 'https://instagram.com/zudio',
    twitter: 'https://twitter.com/zudio'
  };

@ViewChild('invoiceContent', { static: false }) invoiceContent!: ElementRef;

downloadPDF() {
  if (!this.mobileNumber) return;

  const url = `https://localhost:7103/api/Invoices/pdf/${this.mobileNumber}`;
  this.http.get(url, { responseType: 'blob' }).subscribe({
    next: (blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${this.mobileNumber}.pdf`;
      a.click();
      a.remove();
    },
    error: (err) => {
      console.error("Error downloading PDF:", err);
      this.errorMessage = 'Unable to download invoice PDF.';
    }
  });


   const invoiceElement = document.getElementById('invoiceContent');

  const opt = {
    margin:       0,
    filename:     'invoice.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, backgroundColor: '#ffffff' }, // white bg for canvas
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
   

}

downloadInvoicePDF() {
  if (!this.mobileNumber) return;

  const url = `https://localhost:7103/api/Invoices/pdf/${this.mobileNumber}`;
  this.http.get(url, { responseType: 'blob' }).subscribe({
    next: (blob) => {
      const blobUrl = URL.createObjectURL(blob) + '#toolbar=0&navpanes=0&scrollbar=0';
      this.pdfBlobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl); // Sanitize it
    },
    error: (err) => {
      console.error("Error loading PDF:", err);
      this.errorMessage = 'Unable to load invoice PDF.';
    }
  });
}

 constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router,  private sanitizer: DomSanitizer) {}

  ngOnInit() {
      
     this.intervalId = setInterval(() => {
      this.nextHeader();
    }, 3000);
     
      this.downloadInvoicePDF();
    
    this.route.queryParams.subscribe(params => {
      this.mobileNumber = params['mobile'];
      if (this.mobileNumber) {
        this.fetchInvoice();
      }
    });
     this.headerImageList = [
                                'assets/img1.jpg',
                                'assets/img2.jpg',
                                'assets/img3.jpg']                                
     this.footerImageList = [
                                'assets/img3.jpg',
                                'assets/img2.jpg',
                                'assets/img1.jpg']

     this.downloadInvoicePDF();
    
   const shown = sessionStorage.getItem('popupShown');
  if (!shown) {
    this.showPopup = true;

    // Delay storing the session to next tick
    setTimeout(() => {
      sessionStorage.setItem('popupShown', 'true');
    }, 0);
  } else {
    this.showPopup = true;
  } 
  console.log("Invoice showPopup: ", this.showPopup);
    
  }

   ngOnDestroy() {
    clearInterval(this.intervalId); // Cleanup on component destroy
  }

  nextHeader() {
    this.currentHeaderIndex = (this.currentHeaderIndex + 1) % this.headerImageList.length;
  }
 
  fetchInvoice() {
      this.loading = true;
      this.errorMessage = '';

    this.http.get<Invoice>(`https://localhost:7103/api/Invoices/${this.mobileNumber}`)
      .subscribe({
        next: (data) => {
          this.invoice = data;
          this.loading = false;
        },
        error: (err) => {
          this.invoice = null;
          this.loading = false;
          this.errorMessage = 'Failed to fetch invoice. Please try again later.';
        }
  });

  }  
  
}

