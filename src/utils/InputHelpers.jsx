import { MenuItem } from '@mui/material'

export const getSelectOptions = (opt, index) => {
	return opt.map((item) => (
		<MenuItem key={item.label + '-' + index} value={item.value}>
			{item.label}
		</MenuItem>
	))
}
