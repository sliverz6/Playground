
///////////////////////////////////////////////////
// 진행 중
// 1. 모달 기능
// 2. 소규모 유효성 검사

// 해야할 일
// 1. 지출 기록 입력을 표시하기
///////////////////////////////////////////////////

class Validator {
    static validateForm() {

    }
}

class DOMHelper {
    static clearEventListener(element) {
        const clonedElement = element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement;
    }
}

class ExpenseItem {
    constructor(type, content, amount) {
        this.type = type;
        this.content = content;
        this.amount = amount;
    }
}

class ExpenseList {

}

class Modal {
    constructor() {
        this.backdrop = document.querySelector('.backdrop');
        this.modal = document.querySelector('.modal');
        this.saveButton = this.modal.querySelector('.form__btn');
    }

    getInputs() {
        const inputData = [];
        const select = this.modal.querySelector('select');
        const inputs = this.modal.querySelectorAll('input');
        inputData.push(select);
        for (const input of inputs) {
            inputData.push(input);
        }

        return inputData
    }

    clearInput() {
        const inputs = this.getInputs();
        for (const input of inputs) {
            input.value = '';
        } 
    }

    close() {
        this.clearInput();
        this.backdrop.classList.remove('visible');
        this.modal.classList.remove('visible');
    }    
   
    saveHandler(event) {
        event.preventDefault();

        const inputs = this.getInputs();
        const type = inputs[0].value;
        const content = inputs[1].value;
        const amount = inputs[2].value;

        if (type.trim() === '' || content.trim() === '' || amount.trim() === '') {
            alert('내용을 입력해주세요');
            return;
        } 

        const expenseLog = new ExpenseItem(type, content, amount);
        console.log(expenseLog);

        this.close();
    }

    show() {
        this.backdrop.classList.add('visible');
        this.modal.classList.add('visible');

        this.backdrop = DOMHelper.clearEventListener(this.backdrop);
        this.saveButton = DOMHelper.clearEventListener(this.saveButton);

        this.backdrop.addEventListener('click', this.close.bind(this)); 
        this.saveButton.addEventListener('click', this.saveHandler.bind(this));
    }
}

class App {
    static init() {
        const addExpenseBtn = document.querySelector('.expense-header__add-btn');
        addExpenseBtn.addEventListener('click', this.addExpenseHandler);
    }

    static addExpenseHandler() {
        const modal = new Modal();
        modal.show();
    }
}

App.init();