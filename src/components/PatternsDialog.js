import React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import patterns from "../utils/patterns";

const PatternsDialog = ({
  open,
  value,
  handleCancel,
  handleOk,
  handleEntering,
  radioGroupRef,
  handlePatternChange
}) => (
  <Dialog
    sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 530 } }}
    maxWidth="xs"
    TransitionProps={{ onEntering: handleEntering }}
    open={open}
  >
    <DialogTitle>Choose Pattern</DialogTitle>
    <DialogContent dividers>
      <RadioGroup
        ref={radioGroupRef}
        aria-label="patterns"
        name="patterns"
        value={value}
        onChange={handlePatternChange}
      >
        {patterns.map(({ value, label }) => (
          <FormControlLabel value={value} key={value} control={<Radio />} label={label} />
        ))}
      </RadioGroup>
    </DialogContent>
    <DialogActions>
      <Button autoFocus onClick={handleCancel}>
        Cancel
      </Button>
      <Button onClick={handleOk}>Ok</Button>
    </DialogActions>
  </Dialog>
);

export default PatternsDialog;

PatternsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleOk: PropTypes.func.isRequired,
  handleEntering: PropTypes.func.isRequired,
  radioGroupRef: PropTypes.any,
  handlePatternChange: PropTypes.func.isRequired
};
