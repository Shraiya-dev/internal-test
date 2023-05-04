import { CurrencyRupee } from '@mui/icons-material'
import {
    Button,
    Container,
    FormControl,
    FormControlLabel,
    Grid,
    InputAdornment,
    LinearProgress,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import React, { useState } from 'react'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { CityOptions } from '../../constant/city'
import { StatesOptions } from '../../constant/state'
import { useFormikProps } from '../../hooks/useFormikProps'
import { getSelectOptions } from '../../utils/InputHelpers'
import { useAddEditOrders } from './hooks/useAddEditOrders'
import { useParams } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'
import { orderStatusOptions } from '../OrdersInfo/hooks/useOrders'

export const orderTypeOptions = [
    { value: 'BAR_BENDING', label: 'Bar Bending' },
    { value: 'ELECTRICAL', label: 'Electrical' },
    { value: 'FIRE_FIGHTING', label: 'Fire Fighting' },
    { value: 'GLASS_PROFILES', label: 'Glass Profiles' },
    { value: 'GYPSUM', label: 'Gypsum' },
    { value: 'HVAC', label: 'HVAC' },
    { value: 'MASONRY', label: 'Masonry' },
    { value: 'MODULAR_FURNITURE', label: 'Modular Furniture' },
    { value: 'NETWORKING', label: 'Networking' },
    { value: 'PAINTING', label: 'Painting' },
    { value: 'PLUMBING', label: 'Plumbing' },
    { value: 'SITE_CARPENTRY', label: 'Site Carpentry' },
    { value: 'SOFT_HARD_FLOORING', label: 'Soft Hard Flooring' },
    { value: 'SHUTTERING_CARPENTRY', label: 'Shuttering Carpentry' },
    { value: 'TILE_MARBLE_GRANITE_STONE', label: 'Tile Marble' },
    { value: 'FABRICATION', label: 'Fabrication' },
    { value: 'CSR', label: 'CSR' },
    { value: 'STAGING', label: 'Staging' },
    { value: 'OTHERS', label: 'Others' },
]

export const startDateOptions = [
    { value: 'IMMEDIATELY', label: 'Immediately' },
    { value: 'WITHIN_15_DAYS', label: 'Within 15 Days' },
    { value: 'WITHIN_30_DAYS', label: 'Within 30 Days' },
    { value: 'MORE_THAN_30_DAYS', label: 'More than 30 Days' },
]
export const orderTagOption = [
    {
        value: 'INSTANT',
        label: 'Instant',
    },
]

export const AddEditOrders = () => {
    const { form, isError, disableForm, setDisableForm, orderDetail } = useAddEditOrders()
    const formikProps = useFormikProps(form)
    const { orderId } = useParams()

    return (
        <>
            <DashboardLayout>
                {orderId && !orderDetail && <LinearProgress />}
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
                            <Stack width={'100%'} direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="h3">Order Information</Typography>
                                <Stack direction="row" spacing={1}>
                                    {disableForm ? (
                                        <>
                                            <Button variant="outlined" onClick={() => setDisableForm(false)}>
                                                Edit
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                color="error"
                                                variant="outlined"
                                                onClick={() => {
                                                    setDisableForm(true)
                                                    form.resetForm()
                                                }}
                                            >
                                                cancel
                                            </Button>
                                            <LoadingButton
                                                loading={form.isSubmitting}
                                                variant="outlined"
                                                onClick={() => form.handleSubmit()}
                                            >
                                                Submit
                                            </LoadingButton>
                                        </>
                                    )}
                                </Stack>
                            </Stack>

                            <Grid container spacing={2} mt={2}>
                                <Grid item xs={6}>
                                    <Select
                                        fullWidth
                                        disabled={disableForm}
                                        variant="outlined"
                                        {...formikProps('orderStatus')}
                                    >
                                        {getSelectOptions(orderStatusOptions)}
                                    </Select>
                                </Grid>
                                <Grid item xs={6}>
                                    <Select
                                        fullWidth
                                        disabled={disableForm}
                                        variant="outlined"
                                        {...formikProps('startDateLabel')}
                                        onChange={(e) => {
                                            form.setFieldValue('startDateLabel', e.target.value)
                                        }}
                                    >
                                        {getSelectOptions([
                                            { label: 'Select startDate', value: 'none' },
                                            ...startDateOptions,
                                        ])}
                                    </Select>
                                </Grid>

                                <Grid item xs={6}>
                                    <Select
                                        fullWidth
                                        disabled={disableForm}
                                        variant="outlined"
                                        {...formikProps('state')}
                                        onChange={(e) => {
                                            form.setFieldValue('state', e.target.value)
                                            form.setFieldValue('city', 'none')
                                        }}
                                    >
                                        {getSelectOptions([{ label: 'Select state', value: 'none' }, ...StatesOptions])}
                                    </Select>
                                </Grid>

                                <Grid item xs={6}>
                                    <Select
                                        fullWidth
                                        variant="outlined"
                                        disabled={disableForm || form.values.state === 'none'}
                                        {...formikProps('city')}
                                        onChange={(e) => {
                                            form.setFieldValue('city', e.target.value)
                                        }}
                                    >
                                        {getSelectOptions([
                                            { label: 'Select city', value: 'none' },
                                            ...(CityOptions[form.values.state] ?? []),
                                        ])}
                                    </Select>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        disabled={disableForm}
                                        label="Material Specs"
                                        {...formikProps('materialSpecs')}
                                        onChange={(e) => {
                                            if (e.target.value.trim().length > 0) {
                                                form.setFieldValue('materialSpecs', e.target.value)
                                            } else {
                                                form.setFieldValue('materialSpecs', e.target.value.trim())
                                            }
                                        }}
                                        error={isError('materialSpecs')}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        disabled={disableForm}
                                        label="Job Details"
                                        {...formikProps('jobDetails')}
                                        onChange={(e) => {
                                            if (e.target.value.trim().length > 0) {
                                                form.setFieldValue('jobDetails', e.target.value)
                                            } else {
                                                form.setFieldValue('jobDetails', e.target.value.trim())
                                            }
                                        }}
                                        error={isError('jobDetails')}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <Select
                                        fullWidth
                                        disabled={disableForm}
                                        variant="outlined"
                                        {...formikProps('orderType')}
                                        onChange={(e) => {
                                            form.setFieldValue('orderType', e.target.value)
                                        }}
                                    >
                                        {getSelectOptions([
                                            { label: 'Select order type', value: 'none' },
                                            ...orderTypeOptions,
                                        ])}
                                    </Select>
                                </Grid>
                                <Grid item xs={6}>
                                    <Select
                                        fullWidth
                                        disabled={disableForm}
                                        variant="outlined"
                                        {...formikProps('orderTag')}
                                        onChange={(e) => {
                                            form.setFieldValue('orderTag', e.target.value)
                                        }}
                                    >
                                        {getSelectOptions([
                                            { label: 'Select order tag', value: 'none' },
                                            ...orderTagOption,
                                        ])}
                                    </Select>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        disabled={disableForm}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CurrencyRupee />
                                                </InputAdornment>
                                            ),
                                        }}
                                        fullWidth
                                        type={'number'}
                                        label="Order Value"
                                        {...formikProps('orderValue')}
                                        onChange={(e) => {
                                            if (e.target.value.trim().length > 0) {
                                                form.setFieldValue('orderValue', e.target.value)
                                            } else {
                                                form.setFieldValue('orderValue', e.target.value.trim())
                                            }
                                        }}
                                        error={isError('orderValue')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <h3>Material Required</h3>
                                    <FormControl disabled={disableForm} fullWidth>
                                        <RadioGroup
                                            {...formikProps('isMaterialsRequired')}
                                            onChange={(e, v) => form.setFieldValue('isMaterialsRequired', v === 'true')}
                                        >
                                            <Grid container spacing={2}>
                                                {[
                                                    { label: 'True', value: true },
                                                    { label: 'False', value: false },
                                                ].map((x) => {
                                                    return (
                                                        <Grid key={x.value} item>
                                                            <FormControlLabel
                                                                value={x.value}
                                                                control={<Radio />}
                                                                label={x.label}
                                                            />
                                                        </Grid>
                                                    )
                                                })}
                                            </Grid>
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Container>
                    </Paper>
                </Stack>
            </DashboardLayout>
        </>
    )
}
