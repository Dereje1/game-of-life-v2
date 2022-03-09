import React from 'react';
import IconButton from '@mui/material/IconButton';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';
import HelpIcon from '@mui/icons-material/Help';
import Avatar from '@mui/material/Avatar';
import GitHubIcon from '@mui/icons-material/GitHub';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import Grid4x4Icon from '@mui/icons-material/Grid4x4';
import './Controls.css'

export const Action = ({ isRefreshing }) => {
    if (!isRefreshing) {
        return <PlayCircleFilledWhiteIcon style={{ fontSize: '2.5rem', color: '#0288d1' }} />
    } else {
        return <PauseIcon style={{ fontSize: '2.5rem', color: '#d32f2f' }} />
    }
}

export const ControlTop = ({
    height,
    onRefresh,
    onPause,
    isRefreshing,
    onReset,
    onClear,
    generations,
    showGrid,
    handleGrid
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
            <IconButton aria-label="reset" onClick={onReset} disabled={isRefreshing}>
                <RestartAltIcon style={{ fontSize: '2.5rem' }} />
            </IconButton>
            <IconButton aria-label="clear" onClick={onClear} disabled={isRefreshing}>
                <HighlightOffOutlinedIcon style={{ fontSize: '2.5rem' }} />
            </IconButton>
        </div>

        <Checkbox
            onChange={handleGrid}
            checked={showGrid}
            icon={<Grid3x3Icon />}
            checkedIcon={<Grid4x4Icon />}
        />

        <Chip
            label={generations}
            style={{ width: 100, justifyContent: 'space-between' }}
            color={isRefreshing ? "error" : "info"}
            variant="outlined"
        />

    </div>
)

export const ControlBottom = ({
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
        <Links />
    </div>
)

const Links = () => (
    <Stack direction="column" spacing={1} style={{ marginLeft: 5 }}>
        <Avatar
            sx={{ width: 24, height: 24, bgcolor: "#737272", cursor: 'pointer' }}
            onClick={() => window.open('https://pi.math.cornell.edu/~lipa/mec/lesson6.html')}
        >
            <HelpIcon />
        </Avatar>

        <Avatar
            sx={{ width: 24, height: 24, bgcolor: "#737272", cursor: 'pointer' }}
            onClick={() => window.open('https://github.com/Dereje1/game-of-life-v2')}
        >
            <GitHubIcon />
        </Avatar>
    </Stack>
)