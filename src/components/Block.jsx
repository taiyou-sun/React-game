// Block.jsx
import React from "react";

const colorCode = { red: "#ff6347", blue: "#87ceeb", green: "#98fb98" };

const Block = ({ id, width, height, margin, color }) => {
  const blockStyle = {
    width: `${width}px`,
    height: `${height}px`,
    margin: `${margin}px`,
    border: id !== -1 ? "1px solid #000" : null,
    background: colorCode[color],
  };
  return <div style={blockStyle} />;
};

export default Block;
