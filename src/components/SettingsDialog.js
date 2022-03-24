import React from "react";
import PropTypes from "prop-types";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import HelpIcon from "@mui/icons-material/Help";
import GitHubIcon from "@mui/icons-material/GitHub";
import Switch from "@mui/material/Switch";
import Grid4x4Icon from "@mui/icons-material/Grid4x4";
import Typography from "@mui/material/Typography";
import InfoIcon from "@mui/icons-material/Info";
import PatternIcon from "@mui/icons-material/Pattern";
import RefreshIcon from "@mui/icons-material/Refresh";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import patterns from "../utils/patterns";

const getPatternLabel = (patternName) => {
  const [pattern] = patterns.filter((p) => p.value === patternName);
  return pattern.label;
};

const SettingsDialog = ({
  open,
  values,
  handleOk,
  showGrid,
  handleGrid,
  patternName,
  refreshPattern,
  handleColorPicker
}) => (
  <Dialog
    sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 530 } }}
    maxWidth="xs"
    open={open}
    onClose={handleOk}
  >
    <DialogContent dividers>
      <ListItem>
        <ListItemIcon>
          <PatternIcon color={patternName === "none" ? "" : "info"} />
        </ListItemIcon>
        <ListItemText id="switch-list-label-grid" primary={getPatternLabel(patternName)} />
        <IconButton disabled={patternName === "none"} onClick={refreshPattern}>
          <RefreshIcon color={patternName === "none" ? "" : "success"} />
        </IconButton>
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <Grid4x4Icon color={showGrid ? "info" : ""} />
        </ListItemIcon>
        <ListItemText id="switch-list-label-grid" primary="Grid" />
        <Switch
          edge="end"
          onChange={handleGrid}
          checked={showGrid}
          inputProps={{
            "aria-labelledby": "switch-list-label-grid"
          }}
        />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <FormatColorFillIcon color="info" />
        </ListItemIcon>
        <ListItemText id="switch-list-label-grid" primary="Colors" />
        <IconButton onClick={handleColorPicker}>
          <ColorLensIcon />
        </IconButton>
      </ListItem>
      {values.map((value) => (
        <ListItem key={value.title}>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText id={`${value.title}-label`} primary={value.title} />
          <Typography variant="subtitle1">{value.value}</Typography>
        </ListItem>
      ))}
    </DialogContent>
    <DialogActions sx={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
      <Links />
      <IconButton aria-label="reset" onClick={handleOk}>
        <CancelOutlinedIcon style={{ fontSize: "2rem" }} />
      </IconButton>
    </DialogActions>
  </Dialog>
);

export const Links = () => (
  <>
    <IconButton onClick={() => window.open("https://pi.math.cornell.edu/~lipa/mec/lesson6.html")}>
      <HelpIcon style={{ fontSize: "2rem" }} color="info" />
    </IconButton>

    <IconButton onClick={() => window.open("https://github.com/Dereje1/game-of-life-v2")}>
      <GitHubIcon style={{ fontSize: "2rem" }} color="success" />
    </IconButton>
  </>
);

export default SettingsDialog;

SettingsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  showGrid: PropTypes.bool.isRequired,
  values: PropTypes.array.isRequired,
  patternName: PropTypes.string.isRequired,
  handleOk: PropTypes.func.isRequired,
  handleGrid: PropTypes.func.isRequired,
  refreshPattern: PropTypes.func.isRequired,
  handleColorPicker: PropTypes.func.isRequired,
  showColorPicker: PropTypes.bool.isRequired
};
