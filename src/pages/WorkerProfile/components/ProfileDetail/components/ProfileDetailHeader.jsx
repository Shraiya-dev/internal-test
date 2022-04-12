import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import { headerMenu } from '../../../data'
import { useWorkerProfile } from '../../../providers/WorkerProfileProvider/WorkerProfileProvider'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
    headerContainer: {
        maxWidth: '100%',
        display: 'flex',
        overflowX: 'scroll',
        gap: '1.5rem',
        borderBottom: 'solid 1px #E5E7EB',
    },
    menuTitle: {
        fontSize: '0.9rem',
        fontWeight: 'bold',
        whiteSpace: 'no-wrap',
    },
}))

export const ProfileDetailHeader = () => {
    const classes = useStyles()
    const { activeTab, onTabClicked } = useWorkerProfile()
    return (
        <Box px={2} className={clsx(classes.headerContainer, 'hideScrollbar')}>
            {headerMenu.map((menu) => (
                <Box
                    key={menu.id}
                    py={2}
                    sx={{
                        width: 'max-content',
                        boxSizing: 'border-box',
                        borderBottom: `${activeTab === menu.id ? 'solid 2px #10B981' : 'solid 2px transparent'}`,
                        '&:hover': {
                            borderBottom: 'solid 2px #10B981',
                            cursor: 'pointer',
                        },
                        whiteSpace: 'nowrap',
                    }}
                    onClick={() => onTabClicked(menu.id)}
                >
                    <Typography className={classes.menuTitle}>{menu.title}</Typography>
                </Box>
            ))}
        </Box>
    )
}
