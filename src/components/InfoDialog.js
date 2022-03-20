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
import HelpIcon from "@mui/icons-material/Help";
import GitHubIcon from "@mui/icons-material/GitHub";

const InfoDialog = ({ open, values, handleOk }) => (
  <Dialog
    sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 530 } }}
    maxWidth="xs"
    open={open}
    onClose={handleOk}
  >
    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      Board Info
      <IconButton aria-label="reset" onClick={handleOk}>
        <CloseIcon style={{ fontSize: "1.5rem" }} />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers>
      {values.map((v) => (
        <ListItem key={v.title}>
          <ListItemText primary={v.title} secondary={v.value} />
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

export default InfoDialog;

InfoDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  values: PropTypes.array.isRequired,
  handleOk: PropTypes.func.isRequired
};
