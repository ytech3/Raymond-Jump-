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