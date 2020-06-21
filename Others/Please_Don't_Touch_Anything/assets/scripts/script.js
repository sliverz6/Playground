////////////////////////////////////////////
// 현재 메인 버튼을 누르면 노래가 계속 겹침
// 아마 이벤트리스너가 중첩되서 그런듯



class BGMHelper {
    static startMusic(src) {
        const BGM = new Audio();
        BGM.src = src;
        BGM.play();
        BGM.loop = true;
        return BGM;
    }

    static stopMusic(BGMelement) {
        BGMelement.pause();
    }
}

class DOMHelper {
    static clearEventListener(element) {
        const clonedElement = element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement;
    }
}

class SceneHelper {
    static sceneList = [];

    static moveNextScene(nextScene, sceneId) {
        if (nextScene === 'title') {
            const titleScene = new TitleScene;
            this.sceneList.push(titleScene);
        }
        if (nextScene === 'main') {
            const mainScene = new MainScene;
            this.sceneList.push(mainScene);
            const prevScene = this.sceneList.find(scene => scene.id === sceneId);
            prevScene.musicStop();
        }
    }

    static init(curSceneId) {
        const curScene = this.sceneList.find(scene => scene.id === curSceneId);
        curScene.musicStop();

        this.sceneList = [];
        console.log(this.sceneList);
    }
}

class MainScene {
    constructor() {
        this.id = '2';
        this.musicStart();
    }

    musicStart() {
        BGMHelper.startMusic('assets/Bgm/02_Main_Theme.mp3');
    }
} 

class TitleScene {
    constructor() {
        this.id = '1';
        this.musicStart();
        this.connectMainButton();
        this.connectRestartButton();
    }

    connectMainButton() {
        const mainButton = document.getElementById('button');
        mainButton.addEventListener('click', SceneHelper.moveNextScene.bind(SceneHelper, 'main', this.id));
    }

    connectRestartButton() {
        const restartButton = document.getElementById('restart');
        restartButton.addEventListener('click', App.restart.bind(this, this.id));
    }

    musicStart() {
        this.mainSceneBgm = BGMHelper.startMusic('assets/Bgm/01_Title_Screen.mp3');
    }

    musicStop() {
        BGMHelper.stopMusic(this.mainSceneBgm);
    }

    init() {
        const mainButton = document.getElementById('button');
        const restartButton = document.getElementById('restart');
        DOMHelper.clearEventListener(mainButton);
        DOMHelper.clearEventListener(restartButton);
    }
}

class App {
    static init() {
        const startButton = document.getElementById('game-start-button');
        startButton.addEventListener('click', App.gameStart);
    }

    static gameStart() {
        App.removeTitlePage();
        SceneHelper.moveNextScene('title');
    }

    static restart(currentSceneId) {
        this.init();
        SceneHelper.init(currentSceneId);
        SceneHelper.moveNextScene('title');
    }

    static removeTitlePage() {
        const titlePage = document.getElementById('title-page');
        titlePage.classList.add('remove');
    }
}

App.init();