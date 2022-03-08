import React from 'react';
import IconButton from '@mui/material/IconButton';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';
import InfoIcon from '@mui/icons-material/Info';
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
            justifyContent: 'space-evenly',
            width: '100%',
            height,
            background: '#e5e5e359',
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
            <Chip
                icon={<InfoIcon
                    onClick={() => window.open('https://pi.math.cornell.edu/~lipa/mec/lesson6.html')}
                    style={{ cursor: 'pointer' }}
                />}
                label={generations}
                style={{ width: 100, justifyContent: 'space-between' }}
                color={isRefreshing ? "error" : "info"}
                variant="outlined"
            />
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
            width: '100%',
            height,
            marginTop: 5 
        }}
    >
        <div style={{ width: '30%', }}>
            <span style={{ fontSize: '.75em', fontWeight: 'bold' }}>Cell Size</span>
            <Slider
                aria-label="Cellsize"
                defaultValue={15}
                valueLabelDisplay="off"
                step={5}
                marks={[
                    {
                        value: 5,
                        label: '5',
                    },
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
                        label: '25px',
                    }
                ]}
                min={5}
                max={25}
                onChange={handleCellSize}
                value={cellSize}
            />
        </div>
        <div style={{ width: '30%' }}>
            <span style={{ fontSize: '.75em', fontWeight: 'bold' }}>Referesh Rate</span>
            <Slider
                aria-label="Refreshrate"
                defaultValue={140}
                valueLabelDisplay="off"
                step={120}
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
