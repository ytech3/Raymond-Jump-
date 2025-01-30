/*
 Handles the schedule of collectible team logos in the game.
 Uses predefined game schedule to determine which team logo appears next. Team logos are spawned in a specific order.
 ycles through the schedule in a loop to keep the game continuous if end game is not met.
 */

import { gameSchedule } from './schedule.js';

let scheduleIndex = 0;
const teamSchedule = gameSchedule.flatMap(({ team, games }) => Array(games).fill(team));

export function getNextCollectibleTeam() {
    const team = teamSchedule[scheduleIndex];
    scheduleIndex = (scheduleIndex + 1) % teamSchedule.length;
    return team;
}

export function resetScheduleIndex() {
    scheduleIndex = 0;
}