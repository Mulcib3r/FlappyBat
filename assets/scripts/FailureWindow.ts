import { _decorator, Component, director, Node, RigidBody2D } from "cc";
import { GameManager } from "./GameManager";
const { ccclass, property } = _decorator;

@ccclass("FailureWindow")
export class FailureWindow extends Component {
	start() {}

	private restartGame() {
		let gameManager = director
			.getScene()
			.getChildByName("GameManager")
			.getComponent(GameManager);

		gameManager.failureWindow.active = false;

		gameManager.player.getComponent(RigidBody2D).sleep();
		gameManager.player.setPosition(-150, 0);
		gameManager.player.setRotationFromEuler(0, 0);

		gameManager.score = 0;
		gameManager.scoreLabel.string = "Score: 0";
		gameManager.isStarted = false;
		director
			.getScene()
			.getChildByName("Canvas")
			.children.forEach((children) => {
				if (
					children.name === "topColumn" ||
					children.name === "bottomColumn" ||
					children.name === "Sensor"
				) {
					children.destroy();
				}
			});
	}

	private gameMenu() {
		director.loadScene("MenuScene");
	}

	update(deltaTime: number) {}
}
