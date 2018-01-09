// Emergency directive: recover from a catastrophic room crash

import {Directive} from './Directive';
import {log} from '../lib/logger/log';
import {profile} from '../lib/Profiler';
import {BootstrappingOverlord} from '../overlords/overlord_bootstrap';
import {Priority} from '../config/priorities';


export const EMERGENCY_ENERGY_THRESHOLD = 1300;

@profile
export class DirectiveBootstrap extends Directive {

	static directiveName = 'bootstrap';
	static color = COLOR_ORANGE;
	static secondaryColor = COLOR_ORANGE;

	colony: IColony; 					// Emergency flag definitely has a colony
	room: Room;							// Definitely has a room
	private needsEnergy: boolean; 		// Whether there is enough energy in the room
	private needsMiner: boolean;		// Whether a miner needs to be spawned
	private needsManager: boolean;		// Whether a manager needs to be spawned
	private needsSupplier: boolean;		// Whether a supplier needs to be spawned

	constructor(flag: Flag) {
		super(flag);
		this.needsEnergy = this.room.energyAvailable < _.min([EMERGENCY_ENERGY_THRESHOLD,
															  this.room.energyCapacityAvailable]);
		this.needsMiner = (this.colony.getCreepsByRole('miner').length == 0);
		this.needsManager = (this.colony.commandCenter != undefined &&
							 this.colony.commandCenter.overlord != undefined &&
							 this.colony.getCreepsByRole('manager').length > 0);
		this.needsSupplier = (this.colony.getCreepsByRole('supplier').length == 0);
		this.overlords.bootstrap = new BootstrappingOverlord(this, Priority.Critical);
	}

	init(): void {
		if (Game.time % 100 == 0) {
			log.alert(`Colony ${this.room.name} is in emergency recovery mode.`);
		}
	}

	run(): void {
		if (!this.needsMiner && !this.needsManager && !this.needsSupplier && !this.needsEnergy) {
			log.alert(`Colony ${this.room.name} has recovered from crash; removing bootstrap directive.`);
			this.remove();
		}
	}
}
