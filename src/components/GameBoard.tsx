import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { X, Circle } from "lucide-react";

type Player = "X" | "O";
type CellValue = Player | null;
type BoardState = Array<{ value: CellValue; timestamp: number }>;

const GameBoard: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill({ value: null, timestamp: 0 }));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<Player | "Draw" | null>(null);
  const [xMoveHistory, setXMoveHistory] = useState<Array<number>>([]);
  const [oMoveHistory, setOMoveHistory] = useState<Array<number>>([]);
  const { toast } = useToast();

  // Handle cell click
  const handleClick = (index: number) => {
    if (gameOver || board[index].value !== null) {
      return;
    }

    // Create a new board with the updated cell
    const newBoard = [...board];
    newBoard[index] = { value: currentPlayer, timestamp: Date.now() };
    
    // Track the move based on current player
    if (currentPlayer === "X") {
      const newXMoveHistory = [...xMoveHistory, index];
      
      // If X is making their 4th move, remove their first move
      if (newXMoveHistory.length === 4) {
        const firstMoveIndex = newXMoveHistory[0];
        newBoard[firstMoveIndex] = { value: null, timestamp: 0 };
        
        // Keep only the last 3 moves in history
        newXMoveHistory.shift();
        
        toast({
          title: "X's First Move Vanished",
          description: "Player X's first placed mark has disappeared!",
          duration: 3000,
        });
      }
      
      setXMoveHistory(newXMoveHistory);
    } else {
      const newOMoveHistory = [...oMoveHistory, index];
      
      // If O is making their 4th move, remove their first move
      if (newOMoveHistory.length === 4) {
        const firstMoveIndex = newOMoveHistory[0];
        newBoard[firstMoveIndex] = { value: null, timestamp: 0 };
        
        // Keep only the last 3 moves in history
        newOMoveHistory.shift();
        
        toast({
          title: "O's First Move Vanished",
          description: "Player O's first placed mark has disappeared!",
          duration: 3000,
        });
      }
      
      setOMoveHistory(newOMoveHistory);
    }
    
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  // Reset the game
  const resetGame = () => {
    setBoard(Array(9).fill({ value: null, timestamp: 0 }));
    setCurrentPlayer("X");
    setGameOver(false);
    setWinner(null);
    setXMoveHistory([]);
    setOMoveHistory([]);
  };

  // Check for a winner
  useEffect(() => {
    const checkWinner = () => {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      // Check for winning combinations
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
          board[a].value &&
          board[a].value === board[b].value &&
          board[a].value === board[c].value
        ) {
          return board[a].value;
        }
      }

      // Check for a draw - if all cells have been played but no winner
      const allCellsFilled = board.every(cell => cell.value !== null);
      if (allCellsFilled) {
        return "Draw";
      }

      return null;
    };

    const result = checkWinner();
    if (result) {
      setGameOver(true);
      setWinner(result);

      if (result === "Draw") {
        toast({
          title: "Game Over",
          description: "It's a draw!",
          duration: 3000,
        });
      } else {
        toast({
          title: "Game Over",
          description: `Player ${result} wins!`,
          duration: 3000,
        });
      }
    }
  }, [board, toast]);

  const renderCell = (index: number) => {
    const cell = board[index];

    return (
      <div
        key={index}
        className={`board-cell ${cell.value === 'X' ? 'board-cell-x' : ''} ${
          cell.value === 'O' ? 'board-cell-o' : ''
        }`}
        onClick={() => handleClick(index)}
      >
        {cell.value === "X" && <X className="animate-scale-in" size={36} />}
        {cell.value === "O" && <Circle className="animate-scale-in" size={36} />}
      </div>
    );
  };

  // Determine if next move will make a player's first mark vanish
  const getVanishingWarning = () => {
    if (gameOver) return null;
    
    if (currentPlayer === "X" && xMoveHistory.length === 3) {
      return "X's next move will make their first mark vanish!";
    } else if (currentPlayer === "O" && oMoveHistory.length === 3) {
      return "O's next move will make their first mark vanish!";
    }
    
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary animate-fade-in">
        Vanishing Tic Tac Toe
      </h1>
      
      <div className="mb-4 text-center">
        <p className="text-xl mb-2">Current Player: 
          <span className={currentPlayer === 'X' ? 'text-[#9b87f5] ml-2' : 'text-[#F97316] ml-2'}>
            {currentPlayer}
          </span>
        </p>
        {getVanishingWarning() && (
          <p className="text-sm opacity-70">
            {getVanishingWarning()}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-8">
        {Array(9)
          .fill(null)
          .map((_, index) => renderCell(index))}
      </div>

      {gameOver && (
        <div className="text-center mb-4 animate-fade-in">
          <h2 className="text-2xl font-bold mb-2">
            {winner === "Draw" ? "It's a Draw!" : `Player ${winner} Wins!`}
          </h2>
        </div>
      )}

      <Button 
        onClick={resetGame} 
        className="bg-primary hover:bg-primary/80 text-white font-bold"
      >
        Reset Game
      </Button>

      <div className="mt-8 text-sm opacity-80 max-w-md text-center">
        <p>Rules: Place your mark (X or O) in any empty cell. When a player places their fourth mark, their first placed mark will disappear.</p>
      </div>
    </div>
  );
};

export default GameBoard;
