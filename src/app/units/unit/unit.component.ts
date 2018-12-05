import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-unit',
    templateUrl: './unit.component.html',
    styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {

    public x = 40;
    public y = 100;
    public selected = false;

    constructor() { }

    ngOnInit() {
        setTimeout(() => {
            this.x++;
        }, 1000);
    }

    clicked(event) {
        console.log(event);
        this.selected = !this.selected;
        if ( this.selected ) {
            this.x -= 2;
            this.y -= 2;
        } else {
            this.x += 2;
            this.y += 2;
        }
    }

    drag(event) {
        console.log(event);
    }

}
