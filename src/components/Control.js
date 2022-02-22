import React from 'react';
import IconButton from '@mui/material/IconButton';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';

const Action = ({ isRefreshing }) => {
    if (!isRefreshing) {
        return <PlayCircleFilledWhiteIcon style={{ fontSize: '2em' }} />
    } else {
        return <PauseIcon style={{ fontSize: '2em' }} />
    }
}

const Control = ({
    width,
    height,
    onRefresh,
    onPause,
    isRefreshing,
    onReset,
    onClear
}) => (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            width,
            height
        }}
    >
        <IconButton aria-label="play_pause" onClick={isRefreshing ? onPause : onRefresh}>
            <Action isRefreshing={isRefreshing} />
        </IconButton>
        <IconButton aria-label="reset" onClick={onReset}>
            <RestartAltIcon style={{ fontSize: '2em' }} />
        </IconButton>
        <IconButton aria-label="reset" onClick={onClear}>
            <HighlightOffOutlinedIcon style={{ fontSize: '2em' }} />
        </IconButton>
    </div>
)

export default Control