import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from 'src/app/services/move.service';
import { BehaviorSubject } from 'rxjs';
import { UnitComponent } from '../unit/unit.component';

@Component({
    selector: 'app-arrow',
    templateUrl: './arrow.component.html',
    styleUrls: ['./arrow.component.scss']
})
export class ArrowComponent implements OnInit {

    @Input() mode: string;

    moveAnimation: BehaviorSubject<number> = new BehaviorSubject(0);

    public x;
    startX;
    public y;
    startY;
    public z = -1;
    private angle = null; 
    private moves: number[] = [];

    constructor(private moveService: OrderService) { }

    ngOnInit() {
        this.moveService.orders.subscribe(direction => {
            if (direction) {
                console.log('arrow move ' + direction);
                this.moveAnimation.next(direction);
                // if (this.mode === "Normal") {
                //     this.move(direction);
                // } else {
                    // if (this.moves.length > 1) {
                    //     this.x = this.startX;
                    //     this.y = this.startY;
                    //     this.replay();
                    // }
               // }
            }
        });
        this.moveAnimation.subscribe(direction => {
            this.move(direction);
        });


        this.moveService.focused.subscribe((unit:UnitComponent ) => {
            if (unit) {
                this.startX = this.x = unit.x * 40 + 13;
                this.startY = this.y = unit.y * 40 + 13;
            } else {
                this.x = 13;
                this.y = 13;
                this.z = -1;
            }
        });

        this.x = 13;
        this.y = 13;
    }

    async replay() {
        for (let i = 0; i < this.moves.length; i++) {
            await this.move(this.moves[i]);
        }

    }


    async move(direction: number) {  
        this.z = 4;
        for (let i = 0; i < 40; i++) {
            if ( i % 4 === 0)
            await new Promise((resolve, reject) => setTimeout(resolve, 1));
            switch (direction) {
                case 1:
                    this.y--;
                    this.angle = -90;
                    break;
                case 2:
                    this.angle = 0;
                    this.x++;
                    break;
                case 3:
                    this.y++;
                    this.angle = 90;
                    break;
                case 4:
                    this.x--;
                    this.angle = 180;
                    break;
            }
        } 
    }



}
