import { Component, OnChanges, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.css']
})
export class StarComponent implements OnChanges {
  @Input() rating: number;
  starWidth: number;
  @Output() ratingClicked: EventEmitter<string> = new EventEmitter<string>();

  // starWidth depends on rating, but rating is Input prop.
  // cannot starWidth: number = this.rating * 86 / 5; since rating may not have a value
  // I feel ngOnChanges is like props ready, componentWillReceiveProps.
  ngOnChanges(): void {
    console.log('rating props is ready...');
    this.starWidth = this.rating * 86 / 5;
  }

  onClick(): void {
    this.ratingClicked.emit(`The rating ${this.rating} was clicked!`);
  }
}
