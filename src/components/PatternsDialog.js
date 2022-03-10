import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

const options = [
    { value: 'random', label: 'Random' },
    { value: 'blinker', label: 'Blinker' },
    { value: 'toad', label: 'Toad' },
    { value: 'beacon', label: 'Beacon' },
    { value: 'glider', label: 'Glider' },
    { value: 'spaceShip', label: 'Lightweight Space Ship' },
    { value: 'pulsar', label: 'Evolve to Pulsar' },
    { value: 'pentaDecathlon', label: 'Evolve to Penta-Decathlon' },
]

const PatternsDialog = ({
    open,
    handleEntering,
    other,
    radioGroupRef,
    value,
    handleChange,
    handleCancel,
    handleOk

}) => (<Dialog
    sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 500 } }}
    maxWidth="xs"
    TransitionProps={{ onEntering: handleEntering }}
    open={open}
    {...other}
>
    <DialogTitle>Choose Pattern</DialogTitle>
    <DialogContent dividers>
        <RadioGroup
            ref={radioGroupRef}
            aria-label="patterns"
            name="patterns"
            value={value}
            onChange={handleChange}
        >
            {options.map(({ value, label }) => (
                <FormControlLabel
                    value={value}
                    key={value}
                    control={<Radio />}
                    label={label}
                />
            ))}
        </RadioGroup>
    </DialogContent>
    <DialogActions>
        <Button autoFocus onClick={handleCancel}>
            Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
    </DialogActions>
</Dialog>)

export default PatternsDialog;