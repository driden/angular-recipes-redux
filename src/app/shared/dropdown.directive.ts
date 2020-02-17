import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  isOpen = false;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('click')
  onClick() {
    console.log('OnClick directive');
    this.resolveClass('open');
    this.isOpen = !this.isOpen;
  }

  resolveClass = elemClass =>
    this.isOpen
      ? this.renderer.removeClass(this.elRef.nativeElement, elemClass)
      : this.renderer.addClass(this.elRef.nativeElement, elemClass);

  // Manera de hacerlo con HostBinding

  // @HostBinding('class.open') isOpen = false;
  // @HostListener('click') toggleOpen() {
  //   this.isOpen = !this.isOpen;
  // }
}
