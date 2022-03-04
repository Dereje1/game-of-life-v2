import React from 'react';
import IconButton from '@mui/material/IconButton';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';
import './Controls.css'

export const Action = ({ isRefreshing }) => {
    if (!isRefreshing) {
        return <PlayCircleFilledWhiteIcon style={{ fontSize: '2em', color: 'green' }} />
    } else {
        return <PauseIcon style={{ fontSize: '2em', color: 'red' }} />
    }
}

export const ControlTop = ({
    width,
    height,
    onRefresh,
    onPause,
    isRefreshing,
    onReset,
    onClear,
    generations
}) => (
    <div
        style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            width,
            height
        }}
    >
        <div>
            <IconButton aria-label="play_pause" onClick={isRefreshing ? onPause : onRefresh}>
                <Action isRefreshing={isRefreshing} />
            </IconButton>
            <IconButton aria-label="reset" onClick={onReset}>
                <RestartAltIcon style={{ fontSize: '2em', color: 'blue' }} />
            </IconButton>
            <IconButton aria-label="clear" onClick={onClear}>
                <HighlightOffOutlinedIcon style={{ fontSize: '2em' }} />
            </IconButton>
        </div>
        <div>
            <Chip label={generations} style={{ width: 100 }} color={"success"} onClick={() => window.open('https://pi.math.cornell.edu/~lipa/mec/lesson6.html')} />
        </div>
    </div>
)

export const ControlBottom = ({
    width,
    height,
    handleCellSize,
    cellSize,
    onRefreshRate,
    refreshRate
}) => (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            width,
            height
        }}
    >
        <div style={{ width: width / 3 }}>
            <span style={{margin: 0, fontSize: '.75em', fontWeight: 'bold'}}>Cell Size</span>
            <Slider
                aria-label="Granularity"
                defaultValue={20}
                valueLabelDisplay="off"
                step={5}
                marks={[
                    {
                        value: 10,
                        label: '10',
                    },
                    {
                        value: 15,
                        label: '15',
                    },
                    {
                        value: 20,
                        label: '20',
                    },
                    {
                        value: 25,
                        label: '25',
                    },
                    {
                        value: 30,
                        label: '30px',
                    }
                ]}
                min={10}
                max={30}
                onChange={handleCellSize}
                value={cellSize}
            />
        </div>
        <div style={{ width: width / 3 }}>
            <span style={{margin: 0, fontSize: '.75em', fontWeight: 'bold'}}>Referesh Rate</span>
            <Slider
                aria-label="Refreshrate"
                defaultValue={120}
                valueLabelDisplay="off"
                step={125}
                marks={[
                    {
                        value: 20,
                        label: '20',
                    },
                    {
                        value: 140,
                        label: '140',
                    },
                    {
                        value: 260,
                        label: '260',
                    },
                    {
                        value: 380,
                        label: '380',
                    },
                    {
                        value: 500,
                        label: '500ms',
                    }
                ]}
                min={20}
                max={500}
                onChange={onRefreshRate}
                value={refreshRate}
                color="secondary"
            />
        </div>
    </div>
)
