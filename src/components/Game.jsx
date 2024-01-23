// Game.jsx
import React, { useState, useEffect } from "react";
import "./Game.css";
import Block from "./Block";

const colors = ["red", "red", "blue", "green"];

//wall setting
const WALLWIDTH = 320;
const WALLHEIGHT = 400;

//block setting
const ROWCOUNT = 4;
const COLCOUNT = 6;
const BLOCKMARGIN = 4;
const BLOCKWIDTH = Math.floor(WALLWIDTH / COLCOUNT) - BLOCKMARGIN * 2;
const BLOCKHEIGHT = 20;

//paddle setting
const PADDLEWIDTH = 60;
const PADDLERANGE = 20;
const PADDLEBOTTOM = 10;

//ball setting
const SPEEDX = -3;
const SPEEDY = -3;
const BALLX = 160;
const BALLY = 200;

const Game = () => {
  const [paddleX, setPaddleX] = useState(150);
  const [ballX, setBallX] = useState(BALLX);
  const [ballY, setBallY] = useState(BALLY);
  const [ballSpeedX, setBallSpeedX] = useState(SPEEDX);
  const [ballSpeedY, setBallSpeedY] = useState(SPEEDY);
  const [blocks, setBlocks] = useState(createInitialBlocks());

  function createInitialBlocks() {
    return Array.from({ length: ROWCOUNT }, (_, row) =>
      Array.from({ length: COLCOUNT }, (_, col) => ({
        color: colors[row],
        id: row * COLCOUNT + col,
      }))
    );
  }

  const resetGame = () => {
    // Reset all game state here
    setBlocks(createInitialBlocks());
    setBallX(BALLX);
    setBallY(BALLY);
    setBallSpeedX(SPEEDX);
    setBallSpeedY(SPEEDY);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft" && paddleX > 0) {
        setPaddleX(paddleX - 20);
      } else if (e.key === "ArrowRight" && paddleX < 290) {
        setPaddleX(paddleX + 20);
      }
    };

    const updateGame = () => {
      setBallX((prevX) => prevX + ballSpeedX);
      setBallY((prevY) => prevY + ballSpeedY);

      //Block all clear
      if (blocks.every((r) => r.every((b) => b.id === -1))) {
        alert("GAME CLEAR");
        resetGame();
      }

      //Ball collision with bottom
      if (ballY > WALLHEIGHT) {
        alert("GAME OVER");
        resetGame();
      }

      //Ball collision with side walls
      if (ballX < 0 && ballSpeedX < 0) {
        setBallSpeedX((prevSpeedX) => -prevSpeedX);
      }
      if (ballX > WALLWIDTH && ballSpeedX > 0) {
        setBallSpeedX((prevSpeedX) => -prevSpeedX);
      }

      // Ball collision with uppper walls
      if (ballY < 0 && ballSpeedY < 0) {
        setBallSpeedY((prevSpeedY) => -prevSpeedY);
      }

      // Ball collision with paddle
      if (
        ballY > WALLHEIGHT - (PADDLEBOTTOM + PADDLERANGE) &&
        ballY < WALLHEIGHT - PADDLEBOTTOM &&
        ballX > paddleX &&
        ballX < paddleX + PADDLEWIDTH &&
        ballSpeedY > 0
      ) {
        setBallSpeedY((prevSpeedY) => -prevSpeedY);
      }

      // Ball collision with blocks
      for (const row of blocks) {
        for (const block of row) {
          if (block.id === -1) continue;
          const rn = Math.floor(block.id / COLCOUNT);
          const cn = block.id % COLCOUNT;
          const bw = BLOCKWIDTH + BLOCKMARGIN * 2;
          const bh = BLOCKHEIGHT + BLOCKMARGIN * 2;

          if (
            ballX > cn * bw + BLOCKMARGIN &&
            ballX < cn * bw + BLOCKMARGIN + BLOCKWIDTH &&
            ballY > rn * bh + BLOCKMARGIN &&
            ballY < rn * bh + BLOCKMARGIN + BLOCKHEIGHT
          ) {
            const prevX = ballX - ballSpeedX * 2;
            const prevY = ballY - ballSpeedY * 2;

            if (
              prevX < cn * bw + BLOCKMARGIN ||
              prevX > cn * bw + BLOCKMARGIN + BLOCKWIDTH
            ) {
              setBallSpeedX((prevSpeedX) => -prevSpeedX);
            }
            if (
              prevY < rn * bh + BLOCKMARGIN ||
              prevY > rn * bh + BLOCKMARGIN + BLOCKHEIGHT
            ) {
              setBallSpeedY((prevSpeedY) => -prevSpeedY);
            }
            setBlocks((prevBlocks) =>
              prevBlocks.map((r) =>
                r.map((b) => (b.id === block.id ? { color: null, id: -1 } : b))
              )
            );
          }
        }
      }
    };

    const gameLoop = setInterval(() => {
      updateGame();
    }, 16);

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [paddleX, ballX, ballY, ballSpeedX, ballSpeedY, blocks]);

  return (
    <div
      className="game"
      style={{ width: `${WALLWIDTH}px`, height: `${WALLHEIGHT}px` }}
    >
      <div
        className="paddle"
        style={{
          left: `${paddleX}px`,
          width: `${PADDLEWIDTH}px`,
          bottom: `${PADDLEBOTTOM}px`,
        }}
      />
      <div className="ball" style={{ left: `${ballX}px`, top: `${ballY}px` }} />
      {blocks.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((block, colIndex) => (
            <Block
              key={rowIndex * COLCOUNT + colIndex}
              id={block.id}
              width={BLOCKWIDTH}
              height={BLOCKHEIGHT}
              margin={BLOCKMARGIN}
              color={block.color}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Game;
