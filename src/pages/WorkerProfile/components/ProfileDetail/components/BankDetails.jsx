import React from 'react'
import { Box } from '@material-ui/core'
import { Heading } from './Heading'
import { NotKnown } from './NotKnown'
import { Field } from './Field'
import { HeadingWithEditProfile } from './HeadingWithEditProfile'

export const BankDetails = ({ bankDetails }) => {
    const { bank, accountNo, ifsc } = bankDetails
    return (
        <Box p={1} px={0}>
            <HeadingWithEditProfile heading={'Bank Details'} />
            <Box
                pb={2}
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12,
                    borderBottom: 'solid 1px #E5E7EB',
                }}
            >
                {!bankDetails && <NotKnown message={'Not Available'} />}
                <Field fieldName={'Bank'} value={bank || 'Not Available'} name={'bank'} />
                <Field fieldName={'Account Number'} value={accountNo || 'Not Available'} name={'accountNo'} />
                <Field fieldName={'IFSC Code'} value={ifsc || 'Not Available'} name={'ifsc'} />
            </Box>
        </Box>
    )
}
