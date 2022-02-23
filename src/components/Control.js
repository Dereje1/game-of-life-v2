import React from 'react';
import IconButton from '@mui/material/IconButton';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import Slider from '@mui/material/Slider';

const Action = ({ isRefreshing }) => {
    if (!isRefreshing) {
        return <PlayCircleFilledWhiteIcon style={{ fontSize: '2em' ,color: 'green'}} />
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
    onClear
}) => (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width,
            height
        }}
    >
        <div>
            <IconButton aria-label="play_pause" onClick={isRefreshing ? onPause : onRefresh}>
                <Action isRefreshing={isRefreshing} />
            </IconButton>
            <IconButton aria-label="reset" onClick={onReset}>
                <RestartAltIcon style={{ fontSize: '2em' , color: 'blue'}} />
            </IconButton>
            <IconButton aria-label="clear" onClick={onClear}>
                <HighlightOffOutlinedIcon style={{ fontSize: '2em' }} />
            </IconButton>
        </div>
    </div>
)

export const ControlBottom = ({
    width,
    height,
    onGranularity,
    granularity,
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
        <div style={{ width: width/3 }}>
            <Slider
                aria-label="Granularity"
                defaultValue={20}
                valueLabelDisplay="off"
                step={10}
                marks={[
                    {
                        value: 10,
                        label: '10',
                    },
                    {
                        value: 20,
                        label: '20',
                    },
                    {
                        value: 30,
                        label: '30',
                    },
                    {
                        value: 40,
                        label: '40',
                    },
                    {
                        value: 50,
                        label: '50px',
                    }
                ]}
                min={10}
                max={50}
                onChange={onGranularity}
                value={granularity}
            />
        </div>
        <div style={{ width: width/3 }}>
            <Slider
                aria-label="Refreshrate"
                defaultValue={175}
                valueLabelDisplay="off"
                step={125}
                marks={[
                    {
                        value: 50,
                        label: '50',
                    },
                    {
                        value: 175,
                        label: '175',
                    },
                    {
                        value: 300,
                        label: '300',
                    },
                    {
                        value: 425,
                        label: '425',
                    },
                    {
                        value: 550,
                        label: '550ms',
                    }
                ]}
                min={50}
                max={500}
                onChange={onRefreshRate}
                value={refreshRate}
            />
        </div>
    </div>
)
