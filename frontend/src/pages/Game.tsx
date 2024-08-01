import { useEffect, useRef, useState } from "react";
import { BallManager } from "../game/classes/BallManager";
import axios from "axios";
import { Button } from "../components/ui";
import { baseURL } from "../utils";
import CountUp from 'react-countup';

export function Game() {
  const [ballManager, setBallManager] = useState<BallManager>();
  const canvasRef = useRef<any>();
  const [totalResult, setTotalResult] = useState(0);
  const [countUpKey, setCountUpKey] = useState(0);
  let prevResult = 0;

  useEffect(() => {
    if (canvasRef.current) {
      const ballManager = new BallManager(
        canvasRef.current as HTMLCanvasElement
      );
      setBallManager(ballManager);
    }
  }, [canvasRef]);

  useEffect(() => {
    setCountUpKey(prevKey => prevKey + 1); // Update key to force re-render of CountUp
  }, [totalResult, prevResult]);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center">
      <canvas ref={canvasRef} width="800" height="800"></canvas>

      <div className="m-5">
        <CountUp key={countUpKey} start={prevResult} end={totalResult} delay={0}>
          {({ countUpRef }: { countUpRef: React.MutableRefObject<any> }) => (
            <h1 className="display" ref={countUpRef}/>
          )}
        </CountUp>
        <h2>Total Ressult: {totalResult}</h2>
           
        <Button
          className="px-10"
          onClick={async () => {
            const response = await axios.post(`${baseURL}/game`, {
              data: 1,
            });
            const ballValue = Math.round(response.data.point)
            if (ballManager) {
              ballManager.addBall(ballValue);
              prevResult = totalResult;
              setTotalResult((prev) => (prev + ballValue));
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
