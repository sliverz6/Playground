class Slot {
    constructor(slotData, slotPos) {
        this.slotData = slotData;
        this.slotPos = slotPos;
    }

    render() {
        const slot = document.createElement('li');
        slot.className = 'slot';
        slot.textContent = this.slotData;

        if (this.slotPos === 0) {
            slot.style.top = (700 / 3) * 0 + 'px';
        }
        if (this.slotPos === 1) {
            slot.style.top = (700 / 3) * 1 + 'px';
        }
        if (this.slotPos === 2) {
            slot.style.top = (700 / 3) * 2 + 'px';
        }

        return slot;
    }
}

class Slots {
    slotData = [1, 2, 3, 4, 5, 6, 7];
    slots = [];

    constructor() {
        this.settingSlotView();

        this.connectSpinButton();
    }

    getRandomSlotData() {
        const randomValue = parseInt(Math.random() * 7);
        const randomSlotData = this.slotData[randomValue];
        return randomSlotData;
    }

    settingSlotView() { 
        const rootSlot = document.querySelector('.slots');

        for (let slotPos = 0; slotPos < 3; slotPos++) {
            const slot = new Slot(this.getRandomSlotData(), slotPos);
            this.slots.push(slot);
            const slotEl = slot.render();
            rootSlot.append(slotEl);
        }
    }

    connectSpinButton() {
        const spinButton = document.querySelector('.spin-btn');
        spinButton.addEventListener('click', this.spinHandler.bind(this));
    }

    spinHandler() {
        const slots = document.querySelectorAll('.slot');
        for (const slot of slots) {
            slot.style.top = (700 / 3) * 1 + 'px';
        }
    }
}

class App {
    static init() {
        const slots = new Slots();
    }
}

App.init();