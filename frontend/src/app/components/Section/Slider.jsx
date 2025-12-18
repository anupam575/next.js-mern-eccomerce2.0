"use client";

import React from "react";
import Slider from "@mui/material/Slider";
import "./style/Slider.css";

const PriceSlider = ({ value, onChange, onChangeCommitted, min = 0, max = 50000 }) => {
  return (
    <div className="slider-container">
      <Slider
        value={value}
        min={min}
        max={max}
        valueLabelDisplay="auto"
        onChange={onChange}
        onChangeCommitted={onChangeCommitted}
        track={true}
        sx={{
          height: 3,
          '& .MuiSlider-rail': { height: 3, backgroundColor: '#ccc', opacity: 0.3 },
          '& .MuiSlider-track': { height: 6, backgroundColor: '#ff9900' },
          '& .MuiSlider-thumb': {
            width: 20,
            height: 20,
            marginTop: '-7px',
            backgroundColor: '#ff9900',
            border: '2px solid #fff',
            '&:hover, &.Mui-focusVisible': {
              boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
              transform: 'scale(1.1)',
            },
          },
          '& .MuiSlider-valueLabel': {
            top: -35,
            fontSize: 12,
            backgroundColor: '#ff9900',
            color: '#fff',
            padding: '3px 6px',
            borderRadius: 4,
          },
        }}
      />
      <div className="slider-values">
        <span>₹{value[0]}</span>
        <span>₹{value[1]}</span>
      </div>
    </div>
  );
};

export default PriceSlider;
