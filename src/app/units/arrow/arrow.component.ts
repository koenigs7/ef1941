import { Component, OnInit, Input } from '@angular/core';
import { MoveService } from 'src/app/services/move.service';

@Component({
    selector: 'app-arrow',
    templateUrl: './arrow.component.html',
    styleUrls: ['./arrow.component.scss']
})
export class ArrowComponent implements OnInit {

    @Input() mode: string;

    public x;
    public y;
    public z = -1;
    private angle = null;
    private moving = false;
    private moves:number[] = [];

    constructor(private moveService: MoveService) { }

    ngOnInit() {
        this.moveService.movement.subscribe(direction => {
            if (direction) {
                console.log('arrow move ' + direction);
                this.moves.push(direction);
                if ( this.mode === "Normal") {
                    this.move(direction);
                } else {
                    if ( this.moves.length > 1 ) {
                        this.moves.forEach(direction => this.move(direction));
                    }
                }
            }
        });
        this.moveService.focused.subscribe(xy => {
            if (xy) {
                this.x = xy[0];
                this.y = xy[1];
            } else {
                this.x = 13;
                this.y = 13;
                this.z = -1;
            }
        });
 
        this.x = 13;
        this.y = 13;
    }


    async move(direction: number) {
        if ( this.moving ) return;
        this.moving = true;
        this.z = 4;
        for (let i = 0; i < 40; i++) {
            await new Promise((resolve, reject) => setTimeout(resolve, 10));
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
        this.moving = false;
    }



}
