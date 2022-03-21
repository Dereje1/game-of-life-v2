import React from "react";
import PropTypes from "prop-types";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import HelpIcon from "@mui/icons-material/Help";
import GitHubIcon from "@mui/icons-material/GitHub";
import Switch from "@mui/material/Switch";
import Grid4x4Icon from "@mui/icons-material/Grid4x4";
import Typography from "@mui/material/Typography";
import InfoIcon from "@mui/icons-material/Info";

const SettingsDialog = ({ open, values, handleOk, showGrid, handleGrid }) => (
  <Dialog
    sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 530 } }}
    maxWidth="xs"
    open={open}
    onClose={handleOk}
  >
    <DialogTitle sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
      {"  "}
      <IconButton aria-label="reset" onClick={handleOk}>
        <CloseIcon style={{ fontSize: "1.5rem" }} />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers>
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
    </DialogActions>
  </Dialog>
);

export const Links = () => (
  <>
    <IconButton
      //sx={{ width: 26, height: 26, bgcolor: "#737272", cursor: "pointer" }}
      onClick={() => window.open("https://pi.math.cornell.edu/~lipa/mec/lesson6.html")}
    >
      <HelpIcon style={{ fontSize: "2rem" }} color="info" />
    </IconButton>

    <IconButton
      // sx={{ width: 26, height: 26, bgcolor: "#bd2c00", cursor: "pointer" }}
      onClick={() => window.open("https://github.com/Dereje1/game-of-life-v2")}
    >
      <GitHubIcon style={{ fontSize: "2rem" }} color="success" />
    </IconButton>
  </>
);

export default SettingsDialog;

SettingsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  showGrid: PropTypes.bool.isRequired,
  values: PropTypes.array.isRequired,
  handleOk: PropTypes.func.isRequired,
  handleGrid: PropTypes.func.isRequired
};
