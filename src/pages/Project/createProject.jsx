import { Delete, Upload } from '@mui/icons-material'
import {
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    InputLabel,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import React, { useState } from 'react'
import ConfirmationDialog from '../../components/ConfirmationDialog'
import { FileInput } from '../../components/CustomInputs'
import { OverTimeFactor } from '../../constant/booking'
import { CityOptions } from '../../constant/city'
import { StatesOptions } from '../../constant/state'
import { useFormikProps } from '../../hooks/useFormikProps'
import { getSelectOptions } from '../../utils/InputHelpers'
import { useCreateProject } from './hooks/useCreateProject'

const CreateProject = () => {
    const { form, uploadFiles, isUploadingImages } = useCreateProject()
    const [confirmationDialogProps, setConfirmationDialogProps] = useState({
        open: false,
    })
    const formikProps = useFormikProps(form)
    return (
        <>
            <ConfirmationDialog
                content={
                    <>
                        <Typography variant="h5">Save Changes ?</Typography>
                        <Typography pt={3}>
                            <Typography component="span" color="error">
                                <strong> Disclaimer:</strong>
                            </Typography>{' '}
                            Project Details are template values used for new bookings. Changes made to Project Details
                            will not be propagated to existing Bookings, JobCards and Employees.
                        </Typography>
                    </>
                }
                cancel={() => {
                    setConfirmationDialogProps({ open: false })
                }}
                confirm={() => {
                    form.handleSubmit()
                    setConfirmationDialogProps({ open: false })
                }}
                open={confirmationDialogProps.open}
            />
            <form onSubmit={form.handleSubmit} onReset={form.handleReset}>
                <Stack alignItems="stretch" margin="0" maxWidth={1000}>
                    {/* <Paper sx={{ p: 2, mb: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h5">Customer Details</Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InputLabel>Name</InputLabel>
                                <Typography variant="h6">{customer?.name}</Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InputLabel>Company Name</InputLabel>
                                <Typography variant="h6">{customer?.companyName}</Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InputLabel>Email</InputLabel>
                                <Typography variant="h6">{customer?.email}</Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InputLabel>PhoneNumber</InputLabel>
                                <Typography variant="h6">{customer?.phoneNumber}</Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InputLabel>GSTIN</InputLabel>
                                <Typography variant="h6">{customer?.GSTIN}</Typography>
                            </Grid>
                        </Grid>
                    </Paper> */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h4">Project Details</Typography>
                        <Stack direction="row" spacing={2}>
                            <Button type="reset" color="error" variant="outlined">
                                Reset
                            </Button>
                            <Button type="submit" variant="contained">
                                Submit
                            </Button>
                        </Stack>
                    </Stack>
                    <Paper sx={{ p: 2, mb: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>
                                <TextField fullWidth label="Project Name" {...formikProps('projectName')} />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Select
                                    fullWidth
                                    variant="outlined"
                                    {...formikProps('state')}
                                    onChange={(e) => {
                                        form.handleChange(e)
                                        form.setFieldValue('city', 'none')
                                    }}
                                >
                                    {getSelectOptions([{ label: 'Select state', value: 'none' }, ...StatesOptions])}
                                </Select>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Select
                                    fullWidth
                                    variant="outlined"
                                    disabled={form.values.state === 'none'}
                                    {...formikProps('city')}
                                >
                                    {getSelectOptions([
                                        { label: 'Select city', value: 'none' },
                                        ...(CityOptions[form.values.state] ?? []),
                                    ])}
                                </Select>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Pincode"
                                    placeholder="Enter Pincode "
                                    {...formikProps('pincode')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Geo Location" {...formikProps('geoLocation')} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Site Address"
                                    multiline
                                    rows={3}
                                    {...formikProps('siteAddress')}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                    <Paper sx={{ p: 2, mb: 2 }}>
                        <Typography variant="h5">Worker Benefits</Typography>
                        <Typography variant="caption">
                            Add worker benefits for the project {form.values.projectName}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <FormControl error={formikProps('pf').error}>
                                    <FormLabel>Provident Fund (PF) available?</FormLabel>
                                    <RadioGroup
                                        {...formikProps('pf')}
                                        onChange={(e) => {
                                            form.setFieldValue(e.target.name, e.target.value === 'true')
                                        }}
                                    >
                                        <Stack direction={'row'}>
                                            <FormControlLabel value={true} control={<Radio />} label={'Yes'} />
                                            <FormControlLabel value={false} control={<Radio />} label={'No'} />
                                        </Stack>
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl error={formikProps('esi').error}>
                                    <FormLabel>Employee State Insurance (ESI) provided?</FormLabel>
                                    <RadioGroup
                                        {...formikProps('esi')}
                                        onChange={(e) => {
                                            form.setFieldValue(e.target.name, e.target.value === 'true')
                                        }}
                                    >
                                        <Stack direction={'row'}>
                                            <FormControlLabel value={true} control={<Radio />} label={'Yes'} />
                                            <FormControlLabel value={false} control={<Radio />} label={'No'} />
                                        </Stack>
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl error={formikProps('accommodation').error}>
                                    <FormLabel>Accommodation provided?</FormLabel>
                                    <RadioGroup
                                        {...formikProps('accommodation')}
                                        onChange={(e) => {
                                            form.setFieldValue(e.target.name, e.target.value === 'true')
                                        }}
                                    >
                                        <Stack direction={'row'}>
                                            <FormControlLabel value={true} control={<Radio />} label={'Yes'} />
                                            <FormControlLabel value={false} control={<Radio />} label={'No'} />
                                        </Stack>
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl error={formikProps('food').error}>
                                    <FormLabel>Food provided?</FormLabel>
                                    <RadioGroup
                                        {...formikProps('food')}
                                        onChange={(e) => {
                                            form.setFieldValue(e.target.name, e.target.value === 'true')
                                        }}
                                    >
                                        <Stack direction={'row'}>
                                            <FormControlLabel value={true} control={<Radio />} label={'Yes'} />
                                            <FormControlLabel value={false} control={<Radio />} label={'No'} />
                                        </Stack>
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <FormLabel>Over Time Factor</FormLabel>

                                <Select fullWidth variant="outlined" {...formikProps('otf')}>
                                    {getSelectOptions(OverTimeFactor)}
                                </Select>
                            </Grid>
                        </Grid>
                    </Paper>
                    <Paper sx={{ p: 2, mb: 2 }}>
                        <Grid container spacing={1} alignItems="flex-start">
                            <Grid container item spacing={1} xs={12} md={6}>
                                <Grid item xs={12} display="flex" flexDirection="row">
                                    <Stack>
                                        <Typography variant="h5">Site Images</Typography>
                                        <Typography variant="caption">Allowed: .jpg/.jpeg/.png</Typography>
                                    </Stack>

                                    <FileInput
                                        onChange={(e) => {
                                            uploadFiles('site', [...e.target.files])
                                            e.target.value = ''
                                        }}
                                        isLoading={isUploadingImages?.site}
                                        accept="image/*"
                                        id="siteImages"
                                        sx={{ ml: 2 }}
                                        variant="contained"
                                        startIcon={<Upload />}
                                        label="Upload"
                                    />
                                </Grid>
                                {form.values.siteImages?.length ? (
                                    form.values.siteImages?.map((url) => (
                                        <Grid item xs={6} md={4} key={url} position="relative">
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    form.setFieldValue(
                                                        'siteImages',
                                                        form.values.siteImages.filter((item) => item !== url)
                                                    )
                                                }}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 0,
                                                    background: '#efefef',
                                                    '&:hover': {
                                                        background: '#efefefa1',
                                                    },
                                                }}
                                                color="error"
                                            >
                                                <Delete />
                                            </IconButton>
                                            <img width={'100%'} src={url} srcSet={url} loading="lazy" />
                                        </Grid>
                                    ))
                                ) : (
                                    <Grid item xs={12}>
                                        <Typography variant="h6" color="#afafaf">
                                            No Images
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                            <Grid container item spacing={1} xs={12} md={6}>
                                <Grid item xs={12} display="flex" flexDirection="row">
                                    <Stack>
                                        <Typography variant="h5">Accommodation Images</Typography>
                                        <Typography variant="caption">Allowed: .jpg/.jpeg/.png</Typography>
                                    </Stack>

                                    <FileInput
                                        onChange={(e) => {
                                            uploadFiles('accommodation', [...e.target.files])
                                            e.target.value = ''
                                        }}
                                        isLoading={isUploadingImages?.accommodation}
                                        accept="image/*"
                                        id="accommodationImages"
                                        sx={{ ml: 2 }}
                                        variant="contained"
                                        startIcon={<Upload />}
                                        label="Upload"
                                    />
                                </Grid>
                                {form.values.accommodationImages?.length ? (
                                    form.values.accommodationImages?.map((url) => (
                                        <Grid item xs={6} md={4} key={url} position="relative">
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    form.setFieldValue(
                                                        'accommodationImages',
                                                        form.values.accommodationImages.filter((item) => item !== url)
                                                    )
                                                }}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 0,
                                                    background: '#efefef',
                                                    '&:hover': {
                                                        background: '#efefefa1',
                                                    },
                                                }}
                                                color="error"
                                            >
                                                <Delete />
                                            </IconButton>
                                            <img width={'100%'} src={url} srcSet={url} loading="lazy" />
                                        </Grid>
                                    ))
                                ) : (
                                    <Grid item xs={12}>
                                        <Typography variant="h6" color="#afafaf">
                                            No Images
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                            <Grid container item spacing={2} xs={12}>
                                <Grid item xs={12} display="flex" flexDirection="row">
                                    <Stack>
                                        <Typography variant="h5">Project video</Typography>
                                        <Typography variant="caption">Allowed: .mp4</Typography>
                                    </Stack>

                                    <FileInput
                                        onChange={(e) => {
                                            uploadFiles('projectVideo', [...e.target.files])
                                            e.target.value = ''
                                        }}
                                        isLoading={isUploadingImages?.projectVideo}
                                        accept="video/mp4"
                                        id="projectVideo"
                                        sx={{ ml: 2 }}
                                        variant="contained"
                                        startIcon={<Upload />}
                                        label="Upload"
                                    />
                                </Grid>
                                {form.values.projectVideo?.length ? (
                                    form.values.projectVideo?.map((url) => (
                                        <Grid item xs={6} md={4} key={url.url} position="relative">
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    form.setFieldValue(
                                                        'projectVideo',
                                                        form.values.projectVideo.filter((item) => item !== url)
                                                    )
                                                }}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                    zIndex: 10,
                                                    background: '#efefef',
                                                    transform: 'translate(50%, 0%)',
                                                    '&:hover': {
                                                        background: '#efefefa1',
                                                    },
                                                }}
                                                color="error"
                                            >
                                                <Delete />
                                            </IconButton>
                                            <video
                                                controls
                                                width={'100%'}
                                                src={url.url}
                                                srcSet={url.url}
                                                loading="lazy"
                                            />
                                        </Grid>
                                    ))
                                ) : (
                                    <Grid item xs={12}>
                                        <Typography variant="h6" color="#afafaf">
                                            No Videos
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    </Paper>
                </Stack>
            </form>
        </>
    )
}

export default CreateProject
