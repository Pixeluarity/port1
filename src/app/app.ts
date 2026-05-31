import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  PLATFORM_ID,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
  encapsulation: ViewEncapsulation.None,
})
export class App implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private revealObserver?: IntersectionObserver;

  loaderDone = false;
  navScrolled = false;
  lightboxOpen = false;
  lightboxTitle = '';
  lightboxImage = '';
  contactBtnLabel = 'Send Enquiry';
  contactBtnOpacity = '1';
  contactBtnBackground = 'var(--ember)';

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    setTimeout(() => {
      this.loaderDone = true;
    }, 2400);

    if (typeof IntersectionObserver !== 'undefined') {
      const revEls = document.querySelectorAll('.reveal');
      this.revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { threshold: 0.1 },
      );
      revEls.forEach((el) => this.revealObserver!.observe(el));
    }
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.navScrolled = window.scrollY > 60;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeLightbox();
    }
  }

  openLightbox(event: Event): void {
    const item = event.currentTarget as HTMLElement;
    const title = item.getAttribute('data-title') ?? '';
    const cat = item.getAttribute('data-cat') ?? '';
    const bgEl = item.querySelector('.gallery-bg') as HTMLElement | null;
    if (!bgEl) {
      return;
    }

    this.lightboxTitle = `${cat}  ·  ${title}`;
    this.lightboxImage =
      bgEl.style.backgroundImage || getComputedStyle(bgEl).backgroundImage;
    this.lightboxOpen = true;
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
  }

  onLightboxBackdrop(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeLightbox();
    }
  }

  sendEnquiry(): void {
    const original = this.contactBtnLabel;
    this.contactBtnLabel = 'Sending…';
    this.contactBtnOpacity = '0.7';

    setTimeout(() => {
      this.contactBtnLabel = '✓ Enquiry Received';
      this.contactBtnOpacity = '1';
      this.contactBtnBackground = 'var(--gold)';

      setTimeout(() => {
        this.contactBtnLabel = original;
        this.contactBtnBackground = 'var(--ember)';
      }, 3000);
    }, 1400);
  }
}
