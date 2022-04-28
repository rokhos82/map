/*
 * The Overseer Web Worker is the main entry point for simulations.  From here
 * simulations get handed to a controller that then runs the simulation in a
 * seperate thread.  Thus, multiple simulations can be ran simultaneously.
 *
 * Controllers will communicate back to the overseer
 * Overseer will communicate back to the front-end for updates
*/
