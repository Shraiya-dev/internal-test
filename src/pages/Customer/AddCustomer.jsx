import { Button, Container, Grid, Paper, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { useFormikProps } from '../../hooks/useFormikProps'
import { CUSTOMER_ROUTE } from '../../routes'
import { useAddEditCustomerDetails } from './customerDetails/hooks/useAddEditCustomerDetails'
import { PhoneField } from '../../components/CustomInputs'

export const AddCustomer = () => {
    const { form, disableForm, organisation } = useAddEditCustomerDetails()
    const formikProps = useFormikProps(form)
    const navigate = useNavigate()

    return (
        <>
            <DashboardLayout>
                <Stack alignItems="stretch" margin="0 auto" maxWidth={1000}>
                    <Paper sx={{ p: 2, m: 2 }}>
                        <Container
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                mb: 4,
                            }}
                        >
                            <Stack
                                width={'100%'}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                mt={2}
                            >
                                <Typography variant="h3">Customer Information</Typography>
                                <Stack direction="row" spacing={1}>
                                    <Button color="error" variant="outlined" onClick={() => navigate(CUSTOMER_ROUTE)}>
                                        Cancel
                                    </Button>
                                    <Button variant="outlined" onClick={() => form.handleSubmit()}>
                                        Submit
                                    </Button>
                                </Stack>
                            </Stack>

                            <Grid container spacing={2} my={4}>
                                <Grid item xs={4}>
                                    <TextField fullWidth label="Name" {...formikProps('name')} disabled={disableForm} />
                                </Grid>

                                <Grid item xs={4}>
                                    <PhoneField
                                        fullWidth
                                        label="phoneNumber"
                                        {...formikProps('phoneNumber')}
                                        onKeyDown={(e) => {
                                            if (e.key === 'e' || e.key === '+' || e.key === '-' || e.key === '.') {
                                                e.preventDefault()
                                            }
                                        }}
                                        disabled={disableForm}
                                    />
                                </Grid>

                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        label="Company Name"
                                        {...formikProps('companyName')}
                                        disabled={disableForm || organisation}
                                    />
                                </Grid>
                            </Grid>
                        </Container>
                    </Paper>
                </Stack>
            </DashboardLayout>
        </>
    )
}
