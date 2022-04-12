import React from 'react'
import { Box } from '@material-ui/core'
import { Heading } from './Heading'
import { InfoWithDescription } from './InfoWithDescription'
import { NotKnown } from './NotKnown'
import { Field } from './Field'

export const Identifications = ({ doc }) => {
    const { aadhar, pan, uanNo } = doc
    return (
        <Box p={2} pl={0} pt={0} pb={2}>
            <Heading heading={'Documents'} />
            <Box
                pb={2}
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12,
                }}
            >
                {!doc && <NotKnown message={'Not Available'} />}
                {doc && (
                    <>
                        <Field fieldName={'Aadhar'} value={aadhar || 'Not Available'} name={'aadhar'} />
                        <Field fieldName={'PAN'} value={pan || 'Not Available'} name={'pan'} />
                        <Field fieldName={'UAN'} value={uanNo || 'Not Available'} name={'uanNo'} />
                    </>
                )}

                {/* <InfoWithDescription
          title={`Aadhar`}
          duration={aadhar || "Not Available"}
        />
        <InfoWithDescription title={`PAN`} duration={pan || "Not Available"} />
        <InfoWithDescription
          title={`UAN`}
          duration={uanNo || "Not Available"}
        /> */}
            </Box>
        </Box>
    )
}
