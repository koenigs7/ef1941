import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AudioService {

    muted = false;
    audio = new Audio();
    sounds = [];
    playing = false;

    constructor() { 
        this.audio.onended = ( _ => {
            this.playing = false;
            this.play();
        });
    }

    mute() {
        this.muted = true;
    }

    play() {
        if ( !this.playing && this.sounds.length > 0 ) {
            this.playing = true;
            const sound = this.sounds.pop();
            // console.log('playing ' + sound);
            this.audio.src = 'assets/sounds/' + sound + '.mp3';
            this.audio.load();
            this.audio.play();
        }
    }

    move() {
        this.sounds.push('move');
        this.play();
    }

    shot() {
        // this.sounds.push('shot');
        this.play();
    }

    dead() {
        this.sounds.push('dead');
        this.play();
    }

}