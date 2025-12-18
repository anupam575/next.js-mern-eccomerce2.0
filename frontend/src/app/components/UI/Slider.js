import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

function SliderSizes({ value, onChange, onChangeCommitted }) {
  return (
    <Box sx={{ width: "100%" }}>
      <Slider
        size="small"
        value={value}
        onChange={onChange}
        onChangeCommitted={onChangeCommitted}
        valueLabelDisplay="auto"
        min={0}
        max={50000}
      />
    </Box>
  );
}

export default SliderSizes;
