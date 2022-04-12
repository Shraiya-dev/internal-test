import { Box, Button, Divider, Paper, Typography } from '@material-ui/core'
import { Star, StarOutline } from '@material-ui/icons'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const JobCard = ({ data, action, acceptWroker, rejectWorker }) => {
    const { bookingId } = useParams()
    const navigate = useNavigate()
    return (
        <Paper style={{ padding: '20px' }}>
            <Box pb={2} pt={2} display="flex" justifyContent="space-between">
                {/* <Box>
					<img width="100px" height="100px" src="/src/assets/hero-avatar.png" />
				</Box> */}
                <Box flex={0.98}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="h5">Name : {data.name}</Typography>
                        {/* <Typography variant="h6">Gender</Typography> */}
                    </Box>
                    {/* <Box display="flex" justifyContent="space-between">
						<Typography variant="h6">Experience : 3 years</Typography>
						<Typography variant="h6">Age : 30</Typography>
					</Box> */}
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6">Skill type : {data.skillType}</Typography>
                        {/* <Typography variant="h6">Unmarried </Typography> */}
                    </Box>
                </Box>
            </Box>
            <Divider />
            <Box pb={2} pt={2} display="flex" justifyContent="space-between">
                {/* <Box>
					<Typography variant="h3" align="center">
						11
					</Typography>
					<Typography>No. Of Projects</Typography>
				</Box> */}
                <Box flex={1} display="flex" flexDirection="column" alignItems="flex-end">
                    {/* <Typography variant="h6">
						Projects rating : <Star />
						<Star />
						<Star />
						<Star />
						<StarOutline />
					</Typography> */}
                    <Typography variant="h6">City : {data.city} </Typography>
                </Box>
            </Box>
            <Divider />
            <Box pb={2} pt={2} display="flex" justifyContent="space-evenly">
                <Button
                    onClick={() => {
                        navigate(`/profile/${data.id}/${bookingId}`)
                    }}
                    variant="outlined"
                >
                    View Details
                </Button>
                {action && (
                    <>
                        <Button
                            onClick={() => {
                                acceptWroker(data.jobCardId)
                            }}
                            variant="outlined"
                        >
                            Accept
                        </Button>
                        <Button
                            onClick={() => {
                                rejectWorker(data.jobCardId)
                            }}
                            variant="outlined"
                        >
                            Reject
                        </Button>
                    </>
                )}
            </Box>
        </Paper>
    )
}

export default JobCard
