import React from 'react'
import { Box } from '@material-ui/core'
import { Field } from './Field'
import { FieldWithDropdown } from './FieldWithDropdown'
import { FieldWithDatePicker } from './FieldWithDatePicker'
import { HeadingWithEditProfile } from './HeadingWithEditProfile'

const genders = ['Male', 'Female']

export const PersonalDetails = ({ name, gender, dob }) => {
    return (
        <Box p={2} pt={1}>
            <HeadingWithEditProfile heading={'Personal Details'} />
            <Box
                pb={2}
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12,
                    borderBottom: 'solid 1px #E5E7EB',
                }}
            >
                <Field fieldName={'Name'} value={name} name={'name'} />
                <FieldWithDropdown
                    fieldName={'Gender'}
                    value={gender || 'Male'}
                    name={'gender'}
                    dropDownList={genders}
                />
                <FieldWithDatePicker fieldName={'Date of Birth'} value={dob || 'Not Available'} name={'dob'} />
            </Box>
        </Box>
    )
}
