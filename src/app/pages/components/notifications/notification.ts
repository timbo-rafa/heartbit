export class Notification {
  type: string;
  title: string;
  content: string;

  constructor( type: string, title: string, content: string) {
    this.type = type;
    this.title = title;
    this.content = content;
  }
}