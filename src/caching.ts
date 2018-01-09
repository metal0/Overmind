// Preprocessing code to be run before animation of anything

import {profile} from './lib/Profiler';

@profile
export class GameCache implements ICache {
	overlords: { [overlord: string]: { [roleName: string]: string[] } };
	targets: { [ref: string]: string[] };
	structures: { [roomName: string]: { [structureType: string]: Structure[] } };
	constructionSites: { [roomName: string]: ConstructionSite[] };
	structureSites: { [roomName: string]: ConstructionSite[] };
	roadSites: { [roomName: string]: ConstructionSite[] };
	drops: { [roomName: string]: { [resourceType: string]: Resource[] } };

	constructor() {
		this.overlords = {};
		this.targets = {};
		this.structures = {};
		this.constructionSites = {};
		this.structureSites = {};
		this.roadSites = {};
		this.drops = {};
	}

	/* Generates a hash table for creeps assigned to each object: key: assignmentRef, val: (key: role, val: names[]) */
	private cacheOverlords() {
		let creepNamesByOverlord = _.groupBy(_.keys(Game.creeps), name => Game.creeps[name].memory.overlord);
		for (let name in creepNamesByOverlord) {
			this.overlords[name] = _.groupBy(creepNamesByOverlord[name], name => Game.creeps[name].memory.role);
		}
	}

	/* Generates a hash table for targets: key: TargetRef, val: targeting creep names*/
	private cacheTargets() {
		this.targets = _.groupBy(_.keys(Game.creeps), name => Game.creeps[name].memory.task ?
															  Game.creeps[name].memory.task!._target.ref : null);
	}

	/* Generates a nested hash table for structure lookup: {[roomName], {[structureType]: Structures[]} */
	private cacheStructures() {
		for (let name in Game.rooms) {
			this.structures[name] = _.groupBy(Game.rooms[name].find(FIND_STRUCTURES), s => s.structureType);
		}
	}

	/* Generates a nested hash table for structure lookup: {[roomName], {[structureType]: Structures[]} */
	private cacheConstructionSites() {
		for (let name in Game.rooms) {
			this.constructionSites[name] = Game.rooms[name].find(FIND_CONSTRUCTION_SITES);
			this.structureSites[name] = _.filter(this.constructionSites[name], s => s.structureType != STRUCTURE_ROAD);
			this.roadSites[name] = _.filter(this.constructionSites[name], s => s.structureType == STRUCTURE_ROAD);
		}

	}

	/* Generates a nested hash table for drop lookup: {[roomName], {[resourceType]: drops[]} */
	private cacheDrops() {
		for (let name in Game.rooms) {
			this.drops[name] = _.groupBy(Game.rooms[name].find(FIND_DROPPED_RESOURCES), r => r.resourceType);
		}
	}

	build() {
		this.rebuild();
	}

	rebuild() {
		this.cacheOverlords();
		this.cacheTargets();
		this.cacheStructures();
		this.cacheConstructionSites();
		this.cacheDrops();
	}
}

