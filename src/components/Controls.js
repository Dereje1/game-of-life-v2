import React from "react";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import PauseIcon from "@mui/icons-material/Pause";
import PatternIcon from "@mui/icons-material/Pattern";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import Slider from "@mui/material/Slider";
import Chip from "@mui/material/Chip";
import HelpIcon from "@mui/icons-material/Help";
import Avatar from "@mui/material/Avatar";
import GitHubIcon from "@mui/icons-material/GitHub";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import Grid3x3Icon from "@mui/icons-material/Grid3x3";
import Grid4x4Icon from "@mui/icons-material/Grid4x4";
import "./Controls.css";

export const Action = ({ isRefreshing }) => {
  if (!isRefreshing) {
    return <PlayCircleFilledWhiteIcon style={{ fontSize: "2.5rem", color: "#0288d1" }} />;
  } else {
    return <PauseIcon style={{ fontSize: "2.5rem", color: "#d32f2f" }} />;
  }
};

export const ControlTop = ({
  height,
  isRefreshing,
  generations,
  showGrid,
  handleRefresh,
  handlePause,
  handlePattern,
  handleClear,
  handleGrid
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      width: "100%",
      height,
      background: "#e5e5e359"
    }}
  >
    <div>
      <IconButton aria-label="play_pause" onClick={isRefreshing ? handlePause : handleRefresh}>
        <Action isRefreshing={isRefreshing} />
      </IconButton>
      <IconButton aria-label="reset" onClick={handlePattern}>
        <PatternIcon style={{ fontSize: "2.5rem" }} />
      </IconButton>
      <IconButton aria-label="clear" onClick={handleClear}>
        <HighlightOffOutlinedIcon style={{ fontSize: "2.5rem" }} />
      </IconButton>
      <Checkbox
        onChange={handleGrid}
        checked={showGrid}
        icon={<Grid3x3Icon />}
        checkedIcon={<Grid4x4Icon />}
      />
    </div>
    <Chip
      label={generations}
      style={{ width: 100, justifyContent: "space-between" }}
      color={isRefreshing ? "error" : "info"}
      variant="outlined"
    />
  </div>
);

export const ControlBottom = ({
  height,
  cellSize,
  refreshRate,
  handleCellSize,
  handleRefreshRate
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
      width: "100%",
      height,
      marginTop: 5
    }}
  >
    <div style={{ width: "30%" }}>
      <Slider
        aria-label="Cellsize"
        defaultValue={15}
        valueLabelDisplay="off"
        step={5}
        marks={[
          {
            value: 5,
            label: "5"
          },
          {
            value: 10,
            label: "10"
          },
          {
            value: 15,
            label: "15"
          },
          {
            value: 20,
            label: "20"
          },
          {
            value: 25,
            label: "25px"
          }
        ]}
        min={5}
        max={25}
        onChange={handleCellSize}
        value={cellSize}
      />
    </div>
    <div style={{ width: "30%" }}>
      <Slider
        track="inverted"
        aria-label="Refreshrate"
        defaultValue={100}
        valueLabelDisplay="off"
        step={null}
        marks={[
          {
            value: 400,
            label: "400ms"
          },
          {
            value: 300,
            label: "300"
          },
          {
            value: 200,
            label: "200"
          },
          {
            value: 100,
            label: "100"
          },
          {
            value: 1,
            label: "max"
          }
        ]}
        min={1}
        max={400}
        onChange={handleRefreshRate}
        value={refreshRate}
        color="secondary"
      />
    </div>
    <Links />
  </div>
);

export const Links = () => (
  <Stack direction="column" spacing={0.5} style={{ margin: 5 }}>
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

Action.propTypes = {
  isRefreshing: PropTypes.bool.isRequired
};

ControlTop.propTypes = {
  height: PropTypes.number.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
  generations: PropTypes.number.isRequired,
  showGrid: PropTypes.bool.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  handlePause: PropTypes.func.isRequired,
  handlePattern: PropTypes.func.isRequired,
  handleClear: PropTypes.func.isRequired,
  handleGrid: PropTypes.func.isRequired
};

ControlBottom.propTypes = {
  height: PropTypes.number.isRequired,
  cellSize: PropTypes.number.isRequired,
  refreshRate: PropTypes.number.isRequired,
  handleCellSize: PropTypes.func.isRequired,
  handleRefreshRate: PropTypes.func.isRequired
};
