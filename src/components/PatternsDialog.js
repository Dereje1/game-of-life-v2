import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

const options = ['Random', 'Blinker', 'Glider']
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
    sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
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
            {options.map((option) => (
                <FormControlLabel
                    value={option}
                    key={option}
                    control={<Radio />}
                    label={option}
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