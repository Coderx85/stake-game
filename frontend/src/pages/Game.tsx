import { useEffect, useRef, useState } from "react";
import { BallManager } from "../game/classes/BallManager";
import axios from "axios";
import { Button } from "../components/ui";
import { baseURL } from "../utils";

export function Game() {
  const [ballManager, setBallManager] = useState<BallManager>();
  const canvasRef = useRef<any>();
  const [totalResult, setTotalResult] = useState(0);

  useEffect(() => {
    if (canvasRef.current) {
      const ballManager = new BallManager(
        canvasRef.current as unknown as HTMLCanvasElement
      );
      setBallManager(ballManager);
    }
  }, [canvasRef]);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center">
      <canvas ref={canvasRef} width="800" height="800"></canvas>
      <div className="mt-5">
        <h2>Total Result: {totalResult}</h2>
      </div>

      <div className="flex gap-5">
        <Button
          className="px-10"
          onClick={async () => {
            const response = await axios.post(`${baseURL}/game`, {
              data: 1,
            });
            if (ballManager) {
              ballManager.addBall(response.data.point);
              setTotalResult((prev) => prev + response.data.point);
            }
          }}
        >
          Add ball
        </Button>
        {ballManager && (
          <Button
            onClick={() => {
              ballManager.stop();
              setTotalResult(0);
            }}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
