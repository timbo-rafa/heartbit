import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: 
  `
    <span class="created-by">Created by <b><a href="https://github.com/timbo-rafa/heartbit-web" target="_blank">Rafael and Sergio</a></b> 2018</span>
    <div class="socials">
      <a href="https://linkedin.com/in/rtimbo" target="_blank" class="ion ion-social-linkedin"></a>
      <a href="https://github.com/timbo-rafa" target="_blank" class="ion ion-social-github"></a>
<!--  <a href="#" target="_blank" class="ion ion-social-facebook"></a>
      <a href="#" target="_blank" class="ion ion-social-twitter"></a> -->
      <a href="https://www.linkedin.com/in/sergio-de-almeida-brunacci/" target="_blank" class="ion ion-social-linkedin"></a>
    </div>
  `,
})
export class FooterComponent {
}
