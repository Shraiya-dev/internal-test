import { LoadingButton } from '@mui/lab'
import { Button, Dialog, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import { useFormikProps } from '../../hooks/useFormikProps'

export const AddEditPaymentDetailsDialog = ({ cancel, confirm, open, form }) => {
    const formikProps = useFormikProps(form)
    return (
        <Dialog fullWidth maxWidth="xs" open={open} onClose={cancel}>
            <Stack p={2}>
                <Typography textAlign="center" variant="h4">
                    Payment Details
                </Typography>
                <form onSubmit={form.handleSubmit}>
                    <Stack spacing={3} mt={2}>
                        <RadioGroup row {...formikProps('type')} sx={{ justifyContent: 'space-evenly' }}>
                            <FormControlLabel value="BANK_ACCOUNT" control={<Radio />} label="Bank Account" />
                            <FormControlLabel value="UPI" control={<Radio />} label="UPI" />
                        </RadioGroup>
                        {form.values.type === 'BANK_ACCOUNT' ? (
                            <>
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    {...formikProps('name')}
                                    label="Account Holder Name"
                                    placeholder="Enter Name here"
                                />
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    {...formikProps('accountNumber')}
                                    label="Account Number"
                                    placeholder="Enter Account Number here"
                                />
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    {...formikProps('ifsc')}
                                    onChange={(e) => {
                                        form.setFieldValue(e.target.name, e.target.value.toUpperCase())
                                    }}
                                    label="IFSC code"
                                    placeholder="Enter Ifsc Code here"
                                />
                            </>
                        ) : (
                            <>
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    {...formikProps('vpa')}
                                    label="Upi Id"
                                    placeholder="Enter Name here"
                                />
                            </>
                        )}
                        <Stack direction="row" spacing={2}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => {
                                    form.resetForm()
                                    cancel()
                                }}
                            >
                                Cancel
                            </Button>
                            <LoadingButton
                                loading={form.isSubmitting}
                                type="submit"
                                fullWidth
                                variant="contained"
                                onClick={confirm}
                            >
                                Confirm
                            </LoadingButton>
                        </Stack>
                    </Stack>
                </form>
            </Stack>
        </Dialog>
    )
}
