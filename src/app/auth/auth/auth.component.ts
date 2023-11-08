import { Component, ElementRef, OnDestroy, OnInit, } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { slideInAnimation } from 'src/assets/animations/fade.animation';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  animations:[
    slideInAnimation
  ]
})
export class AuthComponent implements OnInit, OnDestroy {
  
  changingText: string[] = [
    "Irure labore ipsum consequat minim reprehenderit cupidatat nulla officia velit in excepteur ad.", 
    "Labore et duis proident officia est dolor anim consequat non velit est non eiusmod tempor.", 
    "Veniam aute est culpa deserunt aute eiusmod non excepteur duis."
  ];
  currentIndex: number = 0;
  currentText: string = '';
  private typingSubscription: Subscription | null = null;
  private fadingSubscription: Subscription | null = null;
  fading: boolean = false; // Agrega una propiedad para controlar el desvanecimiento


  constructor(private contexts: ChildrenOutletContexts) { }


  ngOnInit() {
    this.startTypingAnimation();
  }

  ngOnDestroy(): void {
    this.typingSubscription?.unsubscribe();
    this.fadingSubscription?.unsubscribe();
  }

  startTypingAnimation() {
    const textToType = this.changingText[this.currentIndex];
    let currentIndex = 0;

    this.typingSubscription = interval(50).subscribe(() => {
      if (currentIndex <= textToType.length) {
        this.currentText = textToType.slice(0, currentIndex);
        currentIndex++;
      } else {
        this.typingSubscription?.unsubscribe();
        this.startFadingAnimation();
      }
    });
  }

  startFadingAnimation() {
    this.fading = true; // Establece showText en false para aplicar la clase de desvanecimiento
    setTimeout(() => {
      this.currentIndex = (this.currentIndex + 1) % this.changingText.length;
      this.fading = false; // Restaura la propiedad "fading" a false para mostrar el siguiente texto
      this.startTypingAnimation();
    }, 1000); // Ajusta el tiempo según tus preferencias
  }
  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
