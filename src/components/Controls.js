import React from "react";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import PauseIcon from "@mui/icons-material/Pause";
import PatternIcon from "@mui/icons-material/Pattern";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import Slider from "@mui/material/Slider";
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import Grid3x3Icon from "@mui/icons-material/Grid3x3";
import Grid4x4Icon from "@mui/icons-material/Grid4x4";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import InfoIcon from "@mui/icons-material/Info";

const getLinearProgressValue = (generationsPerSecond, refreshVal) => {
  // aim for 50 gens/sec for max refreshrate (1ms)
  const requestedRefreshRate = refreshVal === 6 ? 50 : Math.pow(2, refreshVal);
  const value = generationsPerSecond / requestedRefreshRate;
  return value < 1 ? Math.floor(value * 100) : 100;
};

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
  handlePatternDialog,
  handleClear,
  handleGrid,
  metrics: { generationsPerSecond, refreshVal },
  handleInfoDialog
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      width: "100%",
      height,
      background: "#e5e5e359"
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        width: "100%"
      }}
    >
      <div>
        <IconButton aria-label="play_pause" onClick={isRefreshing ? handlePause : handleRefresh}>
          <Action isRefreshing={isRefreshing} />
        </IconButton>
        <IconButton aria-label="reset" onClick={handlePatternDialog}>
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
        <IconButton aria-label="clear" onClick={handleInfoDialog}>
          <InfoIcon style={{ fontSize: "1.5rem" }} color={isRefreshing ? "error" : "info"} />
        </IconButton>
      </div>
      <div>
        <Chip
          label={generations}
          style={{ width: 100, justifyContent: "space-between", marginBottom: 3 }}
          color={isRefreshing ? "error" : "info"}
          variant="outlined"
        />
      </div>
    </div>
    {isRefreshing && generationsPerSecond ? (
      <Tooltip title={`${generationsPerSecond.toFixed(1)} generations/sec`} placement="top-start">
        <LinearProgress
          value={getLinearProgressValue(generationsPerSecond, refreshVal)}
          variant="determinate"
          sx={{
            background: "#e5e5e359",
            "& .MuiLinearProgress-bar": { bgcolor: "#d32f2f" }
          }}
        />
      </Tooltip>
    ) : (
      <div id="empty-progress-div" style={{ height: 4, background: "#e5e5e359" }}></div>
    )}
  </div>
);

export const ControlBottom = ({
  height,
  cellSize,
  refreshVal,
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
      <Typography
        id="linear-slider"
        gutterBottom
        sx={{ fontSize: "1.3vmax", marginBottom: 0, fontWeight: "bold" }}
      >
        {`Element size: ${cellSize}px`}
      </Typography>
      <Slider
        aria-label="Cellsize"
        defaultValue={15}
        valueLabelDisplay="off"
        step={5}
        marks={[
          {
            value: 5
          },
          {
            value: 10
          },
          {
            value: 15
          },
          {
            value: 20
          },
          {
            value: 25
          }
        ]}
        min={5}
        max={25}
        onChange={handleCellSize}
        value={cellSize}
      />
    </div>
    <div style={{ width: "30%" }}>
      <Typography
        id="non-linear-slider"
        gutterBottom
        sx={{ fontSize: "1.3vmax", marginBottom: 0, fontWeight: "bold" }}
      >
        {`${refreshVal === 6 ? "Max" : 2 ** refreshVal} generations / sec`}
      </Typography>
      <Slider
        aria-label="Refreshrate"
        defaultValue={3}
        valueLabelDisplay="off"
        step={null}
        min={1}
        max={6}
        onChange={handleRefreshRate}
        value={refreshVal}
        color="secondary"
        scale={(x) => 2 ** x}
        marks={[
          {
            value: 1
          },
          {
            value: 2
          },
          {
            value: 3
          },
          {
            value: 6
          }
        ]}
      />
    </div>
  </div>
);

Action.propTypes = {
  isRefreshing: PropTypes.bool.isRequired
};

ControlTop.propTypes = {
  height: PropTypes.number.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
  generations: PropTypes.number.isRequired,
  showGrid: PropTypes.bool.isRequired,
  metrics: PropTypes.object.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  handlePause: PropTypes.func.isRequired,
  handlePatternDialog: PropTypes.func.isRequired,
  handleClear: PropTypes.func.isRequired,
  handleGrid: PropTypes.func.isRequired,
  handleInfoDialog: PropTypes.func.isRequired
};

ControlBottom.propTypes = {
  height: PropTypes.number.isRequired,
  cellSize: PropTypes.number.isRequired,
  refreshVal: PropTypes.number.isRequired,
  handleCellSize: PropTypes.func.isRequired,
  handleRefreshRate: PropTypes.func.isRequired
};
