import React from 'react'
import { Layout } from '../../components/Layout'
import { SortAndFilter } from './components/SortAndFilter'
import { TapTabs } from './components/TapTabs'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    container: {
        border: 'solid 1px #C2CFD9',
        padding: theme.spacing(1),
    },
    table: {
        margin: 'auto',
        width: '90%',
        marginTop: theme.spacing(2),
    },
    row: {
        // border: "solid 1px red",
        padding: theme.spacing(2),
    },
    divider: {
        border: 'solid 1px #C2CFD9',
        width: '830%',
        marginTop: theme.spacing(2),
    },
}))

export const TAP = () => {
    const classes = useStyles()
    return (
        <>
            <SortAndFilter />
            <TapTabs />
            <Layout>
                <table className={classes.table}>
                    <tr>
                        <th className={classes.container}>Sr. No.</th>
                        <th className={classes.container}>Name</th>
                        <th className={classes.container}>Phone Number</th>
                        <th className={classes.container}>Job Type</th>
                        <th className={classes.container}>Worker Type</th>
                        <th className={classes.container}>City</th>
                        <th className={classes.container}></th>
                    </tr>
                    <div className={classes.divider}></div>
                    <tr>
                        <td className={classes.row}>1 </td>
                        <td>Sachin Jain</td>
                        <td>7837827387</td>
                        <td>Mason</td>
                        <td>Helper</td>
                        <td>Kota</td>
                        <td style={{ textDecoration: 'underline' }}>Tap</td>
                    </tr>
                    <div className={classes.divider}></div>
                    <tr>
                        <td className={classes.row}>1 </td>
                        <td>Sachin Jain</td>
                        <td>7837827387</td>
                        <td>Mason</td>
                        <td>Helper</td>
                        <td>Kota</td>
                        <td style={{ textDecoration: 'underline' }}>Tap</td>
                    </tr>{' '}
                    <div className={classes.divider}></div>
                    <tr>
                        <td className={classes.row}>1 </td>
                        <td>Sachin Jain</td>
                        <td>7837827387</td>
                        <td>Mason</td>
                        <td>Helper</td>
                        <td>Kota</td>
                        <td style={{ textDecoration: 'underline' }}>Tap</td>
                    </tr>{' '}
                    <div className={classes.divider}></div>
                    <tr>
                        <td className={classes.row}>1 </td>
                        <td>Sachin Jain</td>
                        <td>7837827387</td>
                        <td>Mason</td>
                        <td>Helper</td>
                        <td>Kota</td>
                        <td style={{ textDecoration: 'underline' }}>Tap</td>
                    </tr>{' '}
                    <div className={classes.divider}></div>
                    <tr>
                        <td className={classes.row}>1 </td>
                        <td>Sachin Jain</td>
                        <td>7837827387</td>
                        <td>Mason</td>
                        <td>Helper</td>
                        <td>Kota</td>
                        <td style={{ textDecoration: 'underline' }}>Tap</td>
                    </tr>
                    <div className={classes.divider}></div>
                </table>
            </Layout>
        </>
    )
}
