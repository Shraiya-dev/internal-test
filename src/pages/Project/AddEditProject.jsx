import { Delete, Upload } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
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
import { Link } from 'react-router-dom'
import ConfirmationDialog from '../../components/ConfirmationDialog'
import { FileInput } from '../../components/CustomInputs'
import { OverTimeFactor } from '../../constant/booking'
import { CityOptions } from '../../constant/city'
import { StatesOptions } from '../../constant/state'
import { useFormikProps } from '../../hooks/useFormikProps'
import { getSelectOptions } from '../../utils/InputHelpers'
import { useAddEditProject } from './hooks/useAddEditProject'
import { useProjectDetails } from './provider/ProjectProvider'

const AddEditProject = () => {
    const { form, disabled, handleDisable, uploadFiles, isUploadingImages } = useAddEditProject()
    const { customer, project, getProject } = useProjectDetails()
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
            <form onSubmit={form.handleSubmit}>
                <Stack alignItems="stretch" margin="0" maxWidth={1000}>
                    <Paper sx={{ px: 2, mb: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h5">Customer Details</Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InputLabel>Name</InputLabel>
                                <Link to={`/customers/${customer?.customerId}`}>
                                    <Typography color="primary.main" sx={{ textDecoration: 'underline' }}>
                                        {customer?.name || 'No Name'}
                                    </Typography>
                                </Link>
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
                    </Paper>
                    <Stack
                        direction={'row'}
                        mb={3}
                        justifyContent="space-between"
                        position="sticky"
                        px={2}
                        zIndex={1000}
                        top={-24}
                        sx={{ background: '#ffffff' }}
                    >
                        <Typography variant="h5">Project Details</Typography>
                        <Stack spacing={2} my={2} justifyContent="flex-end" direction={'row'}>
                            {disabled ? (
                                project?._id && (
                                    <>
                                        <Button
                                            sx={{ mr: 2 }}
                                            variant="outlined"
                                            onClick={() => {
                                                handleDisable(false)
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </>
                                )
                            ) : (
                                <>
                                    {project?._id && (
                                        <Button
                                            variant="outlined"
                                            sx={{ mr: 2 }}
                                            onClick={() => {
                                                handleDisable()
                                                getProject()
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                    <LoadingButton
                                        loading={
                                            isUploadingImages?.site ||
                                            isUploadingImages?.accommodation ||
                                            form.isSubmitting
                                        }
                                        variant="outlined"
                                        onClick={() => {
                                            setConfirmationDialogProps({ open: true })
                                        }}
                                    >
                                        Submit
                                    </LoadingButton>
                                </>
                            )}
                        </Stack>
                    </Stack>
                    <Paper sx={{ px: 2, mb: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    fullWidth
                                    label="Project Name"
                                    disabled={disabled}
                                    {...formikProps('projectName')}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Select
                                    fullWidth
                                    variant="outlined"
                                    disabled={true}
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
                                    disabled={form.values.state === 'none' || true}
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
                                    disabled={disabled}
                                    {...formikProps('pincode')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    disabled={disabled}
                                    label="Geo Location"
                                    {...formikProps('geoLocation')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Site Address"
                                    multiline
                                    rows={3}
                                    disabled={disabled}
                                    {...formikProps('siteAddress')}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                    <Paper sx={{ px: 2, mb: 2 }}>
                        <Typography variant="h5">Worker Benefits</Typography>
                        <Typography variant="caption">
                            Add worker benefits for the project {form.values.projectName}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <FormControl error={formikProps('pf').error} disabled={disabled}>
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
                            <Grid item xs={12} md={4}>
                                <FormControl error={formikProps('esi').error} disabled={disabled}>
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
                            <Grid item xs={12} md={4}>
                                <FormControl error={formikProps('accommodation').error} disabled={disabled}>
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
                            <Grid item xs={12} md={4}>
                                <FormControl error={formikProps('food').error} disabled={disabled}>
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
                            <Grid item xs={12} md={4}>
                                <FormControl error={formikProps('joiningBonus').error} disabled={disabled}>
                                    <FormLabel>Joining Bonus?</FormLabel>
                                    <RadioGroup
                                        {...formikProps('joiningBonus')}
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
                            <Grid item xs={12} md={4}>
                                <FormControl error={formikProps('guaranteedSalary').error} disabled={disabled}>
                                    <FormLabel>Guaranteed Salary?</FormLabel>
                                    <RadioGroup
                                        {...formikProps('guaranteedSalary')}
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
                            <Grid item xs={12} md={4}>
                                <FormControl error={formikProps('weeklyKharchi').error} disabled={disabled}>
                                    <FormLabel>Weekly Kharchi?</FormLabel>
                                    <RadioGroup
                                        {...formikProps('weeklyKharchi')}
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
                            <Grid item xs={12} md={4}>
                                <FormControl error={formikProps('medicalSupport').error} disabled={disabled}>
                                    <FormLabel>Medical Support?</FormLabel>
                                    <RadioGroup
                                        {...formikProps('medicalSupport')}
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
                            {/* <Grid item xs={6}>
                                <FormLabel>Over Time Factor</FormLabel>

                                <Select fullWidth variant="outlined" disabled={disabled} {...formikProps('otf')}>
                                    {getSelectOptions(OverTimeFactor)}
                                </Select>
                            </Grid> */}
                        </Grid>
                    </Paper>
                    <Paper sx={{ px: 2, mb: 2 }}>
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
                                        disabled={disabled}
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
                                            {!disabled && (
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
                                            )}
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
                                        disabled={disabled}
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
                                            {!disabled && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => {
                                                        form.setFieldValue(
                                                            'accommodationImages',
                                                            form.values.accommodationImages.filter(
                                                                (item) => item !== url
                                                            )
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
                                            )}
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
                                        disabled={disabled}
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
                                            {!disabled && (
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
                                            )}
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

export default AddEditProject
