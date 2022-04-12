import React from 'react'
import { PersonalDetails } from './PersonalDetails'
import { Experiences } from './Experiences'
import { Skills } from './Skills'

export const WorkerDetailsTab = ({ worker }) => {
    const { name, experience, skills, gender, dob } = worker
    return (
        <>
            <PersonalDetails name={name} gender={gender} dob={dob} />
            <Experiences experience={experience} />
            <Skills skills={skills} />
            {/* <Education /> */}
        </>
    )
}
