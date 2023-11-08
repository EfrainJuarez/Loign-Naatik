import { trigger, state, style, transition, animate } from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    style({ opacity: 0 }),
    animate('300ms ease', style({ opacity: 1 })),
  ]),
]);