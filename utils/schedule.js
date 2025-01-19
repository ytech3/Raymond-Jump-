export const gameSchedule = [
    { team: 'rockies', games: 3 },
    { team: 'pirates', games: 3 },
    { team: 'rangers', games: 3 },
    { team: 'angels', games: 3 },
    { team: 'braves', games: 3 },
    { team: 'redsox', games: 3 },
    { team: 'yankees', games: 4 },
    { team: 'diamondbacks', games: 3 },
    { team: 'padres', games: 3 },
    { team: 'royals', games: 3 },
    { team: 'yankees', games: 3 },
    { team: 'phillies', games: 3 },
    { team: 'brewers', games: 3 },
    { team: 'bluejays', games: 3 },
    { team: 'marlins', games: 3 },
    { team: 'astros', games: 3 },
    { team: 'bluejays', games: 3 },
    { team: 'twins', games: 3 },
    { team: 'astros', games: 4 },
    { team: 'rangers', games: 3 },
    { team: 'marlins', games: 3 },
    { team: 'redsox', games: 3 },
    { team: 'mets', games: 3 },
    { team: 'orioles', games: 4 },
    { team: 'tigers', games: 3 },
    { team: 'royals', games: 3 },
    { team: 'orioles', games: 3 },
    { team: 'athletics', games: 3 },
    { team: 'twins', games: 3 },
    { team: 'tigers', games: 3 },
    { team: 'redsox', games: 4 },
    { team: 'orioles', games: 3 },
    { team: 'whitesox', games: 3 },
    { team: 'reds', games: 3 },
    { team: 'yankees', games: 4 },
    { team: 'dodgers', games: 3 },
    { team: 'angels', games: 3 },
    { team: 'mariners', games: 3 },
    { team: 'athletics', games: 3 },
    { team: 'giants', games: 3 },
    { team: 'yankees', games: 2 },
    { team: 'cardinals', games: 3 },
    { team: 'guardians', games: 3 },
    { team: 'nationals', games: 3 },
    { team: 'mariners', games: 3 },
    { team: 'guardians', games: 4 },
    { team: 'whitesox', games: 3 },
    { team: 'cubs', games: 3 },
    { team: 'bluejays', games: 4 },
    { team: 'redsox', games: 3 },
    { team: 'orioles', games: 3 },
    { team: 'bluejays', games: 3 },
];

export function getTeamSchedule() {
    const schedule = [];
    gameSchedule.forEach(({ team, games }) => {
        for (let i = 0; i < games; i++) {
            schedule.push(team);
        }
    });
    return schedule;
}