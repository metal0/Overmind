//
// ___________________________________________________________
//
//  _____  _    _ _______  ______ _______ _____ __   _ ______
// |     |  \  /  |______ |_____/ |  |  |   |   | \  | |     \
// |_____|   \/   |______ |    \_ |  |  | __|__ |  \_| |_____/
//
// ___________ Artificial Intelligence for Screeps ___________
//
//
// Overmind repository: github.com/bencbartlett/overmind
//


'use strict';
// Import global settings and prototypes
import './globals';
import './settings/settings_user';
import './prototypes/prototypes_Creep';
import './prototypes/prototypes_Flag';
import './prototypes/prototypes_RoomObject';
import './prototypes/prototypes_RoomPosition';
import './prototypes/prototypes_RoomVisual';
import './prototypes/prototypes_Room';
import './prototypes/prototypes_Structures';
// Configuration, logging, and profiling
import {log} from './lib/logger/log';
import * as Profiler from 'lib/Profiler';
import {taskInstantiator} from './maps/map_tasks';
import {sandbox} from './sandbox/sandbox';
import {Memcheck} from './memcheck';
import OM from './Overmind';

// Execute this every global reset
global.log = log;
global.Profiler = Profiler.init();
global.taskFromPrototask = taskInstantiator;
Memcheck.format();

// Main loop
export function loop(): void {
	Memcheck.clean();			// Clean memory
	global.Overmind = new OM();	// Instantiate the Overmind
	Overmind.build();			// Build phase: instantiate caches and colony components
	Overmind.init();			// Init phase: spawning and energy requests
	Overmind.run();				// Run phase: execute state-changing actions
	sandbox();					// Sandbox: run any testing code
}

