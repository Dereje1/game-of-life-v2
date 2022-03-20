import React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import HelpIcon from "@mui/icons-material/Help";
import Avatar from "@mui/material/Avatar";
import GitHubIcon from "@mui/icons-material/GitHub";
import Stack from "@mui/material/Stack";

const InfoDialog = ({ open, values, handleOk }) => (
  <Dialog
    sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 530 } }}
    maxWidth="xs"
    open={open}
    onClose={handleOk}
  >
    <DialogContent dividers>
      {values.map((v) => (
        <ListItem key={v.title}>
          <ListItemText primary={v.title} secondary={v.value} />
        </ListItem>
      ))}
    </DialogContent>
    <DialogActions>
      <Links />
      <Button onClick={handleOk} sx={{ marginLeft: 10 }}>
        Ok
      </Button>
    </DialogActions>
  </Dialog>
);

export const Links = () => (
  <Stack direction="row" spacing={10}>
    <Avatar
      sx={{ width: 26, height: 26, bgcolor: "#737272", cursor: "pointer" }}
      onClick={() => window.open("https://pi.math.cornell.edu/~lipa/mec/lesson6.html")}
    >
      <HelpIcon />
    </Avatar>

    <Avatar
      sx={{ width: 26, height: 26, bgcolor: "#bd2c00", cursor: "pointer" }}
      onClick={() => window.open("https://github.com/Dereje1/game-of-life-v2")}
    >
      <GitHubIcon />
    </Avatar>
  </Stack>
);

export default InfoDialog;

InfoDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  values: PropTypes.array.isRequired,
  handleOk: PropTypes.func.isRequired
};
