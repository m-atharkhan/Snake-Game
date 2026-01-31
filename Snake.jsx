import { useEffect, useState } from 'react';
import './snake.css';

const Snake = () => {
    const GRID_SIZE = 20;
    const SNAKE_SPEED = 150;
    const [snake, setSnake] = useState([[10, 10]]);
    const [direction, setDirection] = useState('RIGHT');
    const [isGameOver, setIsGameOver] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    const randomFood = () => {
        let r, c;
        do {
            r = Math.floor(Math.random() * GRID_SIZE);
            c = Math.floor(Math.random() * GRID_SIZE);
        } while (snake.some(([sr, sc]) => sr === r && sc === c));
        return [r, c];
    };

    const [food, setFood] = useState(randomFood());

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowUp' && direction !== 'DOWN') setDirection('UP');
            if (e.key === 'ArrowDown' && direction !== 'UP') setDirection('DOWN');
            if (e.key === 'ArrowLeft' && direction !== 'RIGHT') setDirection('LEFT');
            if (e.key === 'ArrowRight' && direction !== 'LEFT') setDirection('RIGHT');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [direction]);

    useEffect(() => {
        if (!isRunning || isGameOver) return;

        const interval = setInterval(() => {
            setSnake((prevSnake) => {
                const head = prevSnake[0];
                let newHead = [...head];

                if (direction === 'UP') newHead = [head[0] - 1, head[1]];
                if (direction === 'DOWN') newHead = [head[0] + 1, head[1]];
                if (direction === 'RIGHT') newHead = [head[0], head[1] + 1];
                if (direction === 'LEFT') newHead = [head[0], head[1] - 1];

                if (newHead[0] < 0) newHead[0] = GRID_SIZE - 1;
                if (newHead[0] >= GRID_SIZE) newHead[0] = 0;
                if (newHead[1] < 0) newHead[1] = GRID_SIZE - 1;
                if (newHead[1] >= GRID_SIZE) newHead[1] = 0;

                if (prevSnake.some(([r, c]) => r === newHead[0] && c === newHead[1])) {
                    setIsGameOver(true);
                    return prevSnake;
                }

                const newSnake = [newHead, ...prevSnake];

                if (newHead[0] === food[0] && newHead[1] === food[1]) {
                    setFood(randomFood());
                } else {
                    newSnake.pop();
                }
                return newSnake;
            });
        }, SNAKE_SPEED);

        return () => clearInterval(interval);
    }, [direction, food, isRunning, isGameOver]);

    const resetGame = () => {
        setSnake([[10, 10]]);
        setDirection('RIGHT');
        setFood(randomFood());
        setIsGameOver(false);
    };

    return (
        <>
            <nav>
                <h1>Snake Game</h1>
                <button
                    onClick={() => {
                        if (isGameOver) {
                            resetGame();
                            setIsRunning(true);
                        } else {
                            setIsRunning(!isRunning);
                        }
                    }}
                >
                    {isGameOver ? 'Restart' : isRunning ? 'Pause' : 'Play'}
                </button>
            </nav>
            <div className="main">
                {Array(GRID_SIZE).fill().map((_, rowIndex) => (
                    <div className="row" key={rowIndex}>
                        {Array(GRID_SIZE).fill().map((_, colIndex) => (
                            <div
                                key={colIndex}
                                className="cell"
                                style={
                                    snake.some(([r, c]) => r === rowIndex && c === colIndex)? { backgroundColor: 'red' }: food[0] === rowIndex && food[1] === colIndex? { backgroundColor: 'green' }: {}
                                }
                            />
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Snake;
