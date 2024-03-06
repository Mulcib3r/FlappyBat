import {
	_decorator,
	Collider2D,
	Component,
	Contact2DType,
	director,
	Input,
	input,
	instantiate,
	Node,
	Prefab,
	RigidBody2D,
	Vec2,
	Label,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
	@property(Node)
	failureWindow: Node;
	@property(Node)
	player: Node;

	@property(Prefab)
	topColumn: Prefab;

	@property(Prefab)
	bottomColumn: Prefab;

	@property(Prefab)
	sensor: Prefab;

	@property(Label)
	scoreLabel: Label;

	isStarted = false;
	score = 0;

	start() {
		input.on(Input.EventType.TOUCH_START, this.jump, this);

		this.player
			.getComponent(Collider2D)
			.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

		this.player
			.getComponent(Collider2D)
			.on(Contact2DType.END_CONTACT, this.onEndContact, this);
	}

	private onBeginContact(
		selfCollider: Collider2D,
		otherCollider: Collider2D
	) {
		if (otherCollider.node.name !== "Sensor") {
			this.failureWindow.active = true;
			this.unscheduleAllCallbacks();
			director
				.getScene()
				.getChildByName("Canvas")
				.children.forEach((children) => {
					if (
						children.name === "topColumn" ||
						children.name === "bottomColumn" ||
						children.name === "Sensor"
					) {
						children.getComponent(RigidBody2D).linearVelocity =
							new Vec2(0, 0);
					}
				});
		}
	}
	private onEndContact(selfCollider: Collider2D, otherCollider: Collider2D) {
		if (otherCollider.node.name === "Sensor") {
			this.score += 1;
			this.scoreLabel.string = `Score: ${this.score}`;
		}
	}

	private jump() {
		let body: RigidBody2D = this.player.getComponent(RigidBody2D);
		body.linearVelocity = new Vec2(0, 0);
		body.applyLinearImpulseToCenter(new Vec2(0, 700), true);
		if (!this.isStarted) {
			this.schedule(() => this.generateColumns(), 0.8);
			this.isStarted = true;
		}
	}

	private generateColumns() {
		let canvas: Node = director.getScene().getChildByName("Canvas");
		let yRandom =
			(Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 300);
		let speed = 25;

		let topColumn: Node = instantiate(this.topColumn);
		topColumn.setParent(canvas);
		topColumn.setPosition(550, 750 + yRandom);
		topColumn.setSiblingIndex(3);
		topColumn.getComponent(RigidBody2D).linearVelocity = new Vec2(
			-speed,
			0
		);

		let bottomColumn: Node = instantiate(this.bottomColumn);
		bottomColumn.setParent(canvas);
		bottomColumn.setPosition(550, -750 + yRandom);
		bottomColumn.setSiblingIndex(3);
		bottomColumn.getComponent(RigidBody2D).linearVelocity = new Vec2(
			-speed,
			0
		);
		let sensor: Node = instantiate(this.sensor);
		sensor.setParent(canvas);
		sensor.setPosition(550, yRandom);
		sensor.setSiblingIndex(3);
		sensor.getComponent(RigidBody2D).linearVelocity = new Vec2(-speed, 0);

		this.scheduleOnce(() => {
			topColumn.destroy();
			bottomColumn.destroy();
			sensor.destroy();
		}, 2);
	}

	update(deltaTime: number) {}
}
