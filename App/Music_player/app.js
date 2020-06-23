class DOMHelper {
    static clearEventListenr(element) {
        const clonedElement = element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement;
    }
}

class Music {
    constructor(track) {
        this.track = track;
    }
}

class MPlayer {
    mode = {
        play: 'play',
        stop: 'stop'
    }

    isPlaying = false;

    playList = [];

    constructor() {
        this.player = document.querySelector('audio');
        this.connectControlButton(this.mode.play);
    }

    updateTimer() {
        const currentTime = document.querySelector('.time__current');
        const durationTime = document.querySelector('.time__entire');
        
        const current = parseInt(this.player.currentTime);
        const duration = parseInt(this.player.duration);

        const curMin = parseInt(current / 60);
        let curSec = current % 60;

        if (curSec < 10) {
            curSec = `0${curSec}`;
        }

        const durMin = parseInt((duration - current) / 60);
        let durSec = (duration - current) % 60;

        if (durSec < 10) {
            durSec = `0${durSec}`;
        }
        
        const curTimer = `${curMin}:${curSec}`;
        const durTimer = `-${durMin}:${durSec}`;

        currentTime.textContent = curTimer;
        durationTime.textContent = durTimer;
    }

    progressHandler(e) {
        const entireDur = parseInt(e.target.getBoundingClientRect().width);
        const curPosition = (e.offsetX / entireDur * 100);

        this.play(curPosition);
    }

    addTrack(track) {
        const title = document.querySelector('.info__title');
        title.textContent = track;

        this.playList.push(new Music(track));
        this.player.setAttribute('src', this.playList[0].track);

        this.player.addEventListener('canplay', () => {
            this.updateTimer();

            const progress = document.querySelector('progress');
            progress.setAttribute('max', this.player.duration);

            progress.addEventListener('click', this.progressHandler.bind(this));
        });
    }

    toggleButton(type) {
        let btn = document.querySelector(`.btn--${type}`);
        btn = DOMHelper.clearEventListenr(btn);
        btn.classList.remove('visible');
        
        if (type === this.mode.play) {
            btn.nextElementSibling.classList.add('visible');
            this.connectControlButton(this.mode.stop);
        } else {
            btn.previousElementSibling.classList.add('visible');
            this.connectControlButton(this.mode.play);
        }
    }

    updateProgress() {
        const progress = document.querySelector('progress');
        progress.setAttribute('value', this.player.currentTime);
    }
    
    play(position) {
        if (position) {
            console.log(position);
            this.player.currentTime = this.player.duration * position / 100;
            if (this.isPlaying) {
                this.toggleButton(this.mode.play);
            }
            this.updateTimer();
            this.updateProgress();
            return;
        }

        this.player.play();

        this.intervalId = setInterval(() => {
            this.updateTimer();
            this.updateProgress();
        }, 10);
    }

    stop() {
        this.player.pause();

        clearInterval(this.intervalId);
    }

    controlBtnHandler(type) {
        if (!this.player.src) {
            return;
        }

        if (type === this.mode.play) {
            this.play();
        } else if (type === this.mode.stop) {
            this.stop();
        }
        this.toggleButton(type);
    }

    connectControlButton(type) {
        const btn = document.querySelector(`.btn--${type}`);
        btn.classList.add('visible');
        btn.addEventListener('click', this.controlBtnHandler.bind(this, type));
    }
}

class App {
    static init() {
        const mPlayer = new MPlayer('');
        // mPlayer.addTrack('Vanze & Reunify - Angel (feay. Parker Polhill & Bibiane Z).mp3');
        
        const form = document.querySelector('.form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fileBtn = document.querySelector('.file');
            const fileName = fileBtn.value.split('\\')[2];
            
            if (fileName) {
                mPlayer.addTrack(fileName);
            }
        });
    }
}

App.init()