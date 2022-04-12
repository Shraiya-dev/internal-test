import { Box } from '@material-ui/core'
import React from 'react'
import { Heading } from './Heading'
import { InfoWithDescription } from './InfoWithDescription'
import { NotKnown } from './NotKnown'

export const Experiences = ({ experience }) => {
    let experiences = []
    if (experience?.length > 0) {
        experiences = experience.map((exp, idx) => ({
            ...exp,
            remove: false,
            id: idx,
        }))
    }
    return (
        <Box p={2} pt={0} pb={2}>
            <Box
                pb={4}
                sx={{
                    borderBottom: 'solid 1px #E5E7EB',
                }}
            >
                <div>
                    <Heading heading={'Experiences'} />
                </div>
                {experience?.length === 0 && <NotKnown message={'No Experience'} />}
                <>
                    {experience?.length > 0 &&
                        experience.map((exp, idx) => (
                            <InfoWithDescription
                                key={idx}
                                id={idx}
                                title={exp.title}
                                experiences={experiences}
                                duration={exp.dateRange} //(2 years 3 months) implement total duration calculator
                            />
                        ))}
                </>
            </Box>
        </Box>
    )
}
