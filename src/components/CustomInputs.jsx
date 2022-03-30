import { Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useRef } from 'react'

const useStyles = makeStyles((theme) => ({
	fileInputContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	hide: {
		visibility: 'hidden',
		width: 0,
		height: 0,
	},
	labelStyle: {
		cursor: 'pointer',
	},
}))

export const FileInput = ({ id, icon, label, disabled, variant, color, className, sx, ...props }) => {
	const classes = useStyles()
	const labelRef = useRef()
	return (
		<Button
			sx={sx}
			disabled={disabled}
			onClick={() => {
				labelRef.current.click()
			}}
			className={className}
			startIcon={icon}
			variant={variant}
			color={color}>
			{label}
			<label className={classes.hide} ref={labelRef} htmlFor={id}></label>
			<input className={classes.hide} id={id} type="file" {...props} />
		</Button>
	)
}
