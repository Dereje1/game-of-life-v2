import React from "react";
import PropTypes from "prop-types";
import { SketchPicker } from "react-color";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const colorTypeMap = {
  canvasBackGround: "canvas",
  liveCell: "cell",
  grid: "grid"
};

const ColorsDialog = ({
  color,
  handleColorChange,
  closeColorPicker,
  open,
  updateColorChangeType,
  selectedColorType,
  showGrid
}) => (
  <Dialog
    sx={{ "& .MuiDialog-paper": { width: "auto", maxHeight: 530 } }}
    maxWidth="xs"
    open={open}
    onClose={closeColorPicker}
  >
    <DialogTitle sx={{ display: "flex", justifyContent: "center" }}>
      <Typography>{`Choose ${colorTypeMap[selectedColorType]} color`}</Typography>
    </DialogTitle>
    <DialogContent dividers sx={{ display: "flex", justifyContent: "center" }}>
      <SketchPicker color={color} onChange={handleColorChange} disableAlpha />
    </DialogContent>
    <DialogActions sx={{ justifyContent: "center" }}>
      <ButtonGroup variant="text" aria-label="outlined primary button group" fullWidth>
        {Object.keys(colorTypeMap).map((type) => (
          <Button
            onClick={() => updateColorChangeType(type)}
            color={selectedColorType === type ? "primary" : "inherit"}
            id={`${colorTypeMap[type]}-color-change`}
            key={type}
            disabled={type === "grid" && !showGrid ? true : false}
          >
            {colorTypeMap[type]}
          </Button>
        ))}
        <IconButton aria-label="reset" onClick={closeColorPicker}>
          <CancelOutlinedIcon style={{ fontSize: "2rem" }} />
        </IconButton>
      </ButtonGroup>
    </DialogActions>
  </Dialog>
);

ColorsDialog.propTypes = {
  color: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  showGrid: PropTypes.bool.isRequired,
  selectedColorType: PropTypes.string.isRequired,
  handleColorChange: PropTypes.func.isRequired,
  closeColorPicker: PropTypes.func.isRequired,
  updateColorChangeType: PropTypes.func.isRequired
};

export default ColorsDialog;
