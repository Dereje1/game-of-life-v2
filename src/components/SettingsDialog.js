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
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import RestoreIcon from "@mui/icons-material/Restore";
import patterns from "../utils/patterns";

const getPatternLabel = (patternName) => {
  const [pattern] = patterns.filter((p) => p.value === patternName);
  return pattern.label;
};

const SettingsDialog = ({
  open,
  values,
  handleClose,
  showGrid,
  handleGrid,
  patternName,
  refreshPattern,
  handleColorPicker,
  handlePatternDialog,
  restoreColors,
  disableColorRestore
}) => (
  <Dialog
    sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 530 } }}
    maxWidth="xs"
    open={open}
    onClose={handleClose}
  >
    <DialogContent dividers>
      <ListItem>
        <ListItemIcon>
          <PatternIcon color={patternName === "none" ? "inherit" : "info"} />
        </ListItemIcon>
        <ListItemText
          id="pattern-list-label"
          primary="Pattern"
          secondary={getPatternLabel(patternName)}
        />
        <IconButton disabled={patternName === "none"} onClick={refreshPattern}>
          <RefreshIcon color={patternName === "none" ? "inherit" : "warning"} />
        </IconButton>
        <IconButton onClick={handlePatternDialog}>
          <ManageAccountsIcon color={patternName === "none" ? "error" : "info"} />
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
        <ListItemText id="color-list-label" primary="Colors" />
        <IconButton onClick={restoreColors} disabled={disableColorRestore}>
          <RestoreIcon color={disableColorRestore ? "inherit" : "warning"} />
        </IconButton>
        <IconButton onClick={handleColorPicker}>
          <ColorLensIcon color="success" />
        </IconButton>
      </ListItem>
      {values.map((value) => (
        <ListItem key={value.title}>
          <ListItemIcon>
            <InfoIcon color="info" />
          </ListItemIcon>
          <ListItemText id={`${value.title}-label`} primary={value.title} />
          <Typography variant="subtitle1">{value.value}</Typography>
        </ListItem>
      ))}
    </DialogContent>
    <DialogActions sx={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
      <Links />
      <IconButton aria-label="reset" onClick={handleClose}>
        <CancelOutlinedIcon style={{ fontSize: "2rem" }} />
      </IconButton>
    </DialogActions>
  </Dialog>
);

export const Links = () => (
  <>
    <IconButton
      onClick={() => window.open("https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life")}
    >
      <HelpIcon style={{ fontSize: "2rem" }} color="warning" />
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
  disableColorRestore: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleGrid: PropTypes.func.isRequired,
  refreshPattern: PropTypes.func.isRequired,
  handleColorPicker: PropTypes.func.isRequired,
  handlePatternDialog: PropTypes.func.isRequired,
  restoreColors: PropTypes.func.isRequired
};
