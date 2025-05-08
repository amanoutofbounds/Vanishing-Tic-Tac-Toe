
import GameBoard from "../components/GameBoard";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-game-bg">
      <div className="w-full max-w-md">
        <GameBoard />
      </div>
    </div>
  );
};

export default Index;
