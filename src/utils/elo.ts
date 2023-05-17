export const calculateEloDiff = (
    playerOneElo: number,
    playerTwoElo: number,
    playerOneScore: number,
    playerTwoScore: number
) => {
    const playerOneExpected = 1 / (1 + Math.pow(10, (playerTwoElo - playerOneElo) / 400));
    const playerTwoExpected = 1 / (1 + Math.pow(10, (playerOneElo - playerTwoElo) / 400));
    const playerOneActual = playerOneScore > playerTwoScore ? 1 : 0;
    const playerTwoActual = playerTwoScore > playerOneScore ? 1 : 0;
    const playerOneDiff = Math.round(32 * (playerOneActual - playerOneExpected));
    const playerTwoDiff = Math.round(32 * (playerTwoActual - playerTwoExpected));
    return {
        playerOneDiff,
        playerTwoDiff,
    };
};
