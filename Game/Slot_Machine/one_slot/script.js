class Slot {
    constructor() {

    }
}

class DOMHelper {
    static moveSlot(el, from, to, time) {
        el.animate([
            {top: `${from}px`},
            {top: `${to}px`}
        ], {
            duration: time,
            fill: "forwards"
        });
    }

    static removeSlot(el, time) {
        setTimeout(() => {
            el.remove();
        }, time);
    }
}

class SlotMachine {
    slotData = [7, 'bar', '포도', 3];
    slotPosAmount = [-290, 0, 290];
    isSpinning = false;

    constructor() {
        this.createSlotEl(0);
        this.connectSpinButton();
    }

    createSlotEl(pos) {
        let slotPos;
        if (pos === -1) {
            slotPos = slotPosAmount[0];
        } else if (pos === 1) {
            slotPos = slotPosAmount[1];
        }
        const randomVal = this.getRandomValueFromData();
        const rootElement = document.getElementById('slot-machine');
        const slotEl = document.createElement('div');
        slotEl.className = 'slot';
        slotEl.innerHTML = `<h1>${randomVal}</h2>`;
        slotEl.style.top = `${slotPos}px`;
        rootElement.insertAdjacentElement('afterbegin', slotEl);

        return slotEl;
    }

    connectSpinButton() {
        const spinBtn = document.querySelector('.spin-btn');
        spinBtn.addEventListener('click', this.spinHandler.bind(this));
    }

    spin(spinTime) {
        const previousSlotEl = document.querySelector('div');
        DOMHelper.moveSlot(previousSlotEl, this.slotPosAmount[1], this.slotPosAmount[2], spinTime);

        const newSlotEl = this.createSlotEl(2, -1);
        DOMHelper.moveSlot(newSlotEl, this.slotPosAmount[0], this.slotPosAmount[1], spinTime);

        DOMHelper.removeSlot(previousSlotEl, spinTime);
    }

    getRandomValueFromData() {
        const randomVal = parseInt(Math.random() * this.slotData.length);
        const pickedVal = this.slotData[randomVal];
        return pickedVal;
    }

    spinHandler() {
        if (this.isSpinning) {
            return;
        }
        
        const spinIntervalId = setInterval(() => {
            this.spin(100);
        }, 100);
        
        setTimeout(() => {
            clearInterval(spinIntervalId);
            this.isSpinning = false;
        }, 1000);

        this.isSpinning = true;
    }
}

class App {
    static init() {
        const slotMachine = new SlotMachine();
    }
}

App.init();