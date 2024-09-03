import * as React from 'react';
import { Dialog } from '@material-ui/core';
import { DialogActions } from '@material-ui/core';
import { DialogContent } from '@material-ui/core';
import { DialogContentText } from '@material-ui/core';
import { DialogTitle } from '@material-ui/core';
import { Button } from "@dhis2/ui";
import { useRecoilState } from 'recoil';
import { ConfirmationState } from '../../schema/confirmationDialog';
import { useDeleteEvent } from '../../hooks/events/useDeleteEvents';

export default function AlertDialog() {
    const [confirmState, setConfirmState] = useRecoilState(ConfirmationState)
    const { deleteEvent } = useDeleteEvent()

    const handleClose = () => {
        setConfirmState({ open: false, event: "" })
    };

    const handleAgree = () => {
        void deleteEvent(confirmState.event)
    }

    return (
        <React.Fragment>
            <Dialog
                open={confirmState.open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div style={{ width: "500px" }}>
                    <DialogTitle id="alert-dialog-title">
                        {"Are you sure?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            This will unenroll the selected group from the seleted module
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} primary>Disagree</Button>
                        <Button onClick={handleAgree} destructive>Agree</Button>
                    </DialogActions>
                </div>
            </Dialog>
        </React.Fragment >
    );
}
