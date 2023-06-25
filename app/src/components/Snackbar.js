import React, { useState, useEffect} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

const SnackBar = ({message, open, fail = false}) => {
    const [_open, setOpen] = useState(open);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
    };

    useEffect(() => {
        setOpen(open)
    }, [open]);



    return(
        <Snackbar
            open={_open}
            autoHideDuration={2000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top',
            horizontal: 'right'}}
        >
            <SnackbarContent
                style={{ backgroundColor: fail?'#bf0000':'#4caf50', color: 'white' }} // Apply custom background color and text color
                message={message}
            />
        </Snackbar>
    )


}

export default SnackBar;