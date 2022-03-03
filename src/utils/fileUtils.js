import * as XLSX from 'xlsx'

export const retriveDataFromExcel = async (fileBlob, callback) => {
	var reader = new FileReader()
	reader.onload = function async(e) {
		var data = e.target.result
		let readedData = XLSX.read(data, { type: 'binary' })
		const wsname = readedData.SheetNames[0]
		const ws = readedData.Sheets[wsname]

		/* Convert array to json*/
		const fileData = XLSX.utils.sheet_to_json(ws, { header: 1 })
		callback(fileData)
	}
	reader.readAsBinaryString(fileBlob)
}

export const createCsvBlob = (data) => {
	let csvContent = data.map((e) => e.join(',')).join('\n')
	var contentType = 'text/csv'
	const file = new Blob([csvContent], { type: contentType })
	return file
}
