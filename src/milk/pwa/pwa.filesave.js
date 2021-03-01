import { saveAs } from 'file-saver';
export const setupFileSaver = () => {
	/* #### File Saver #### */
	window.saveAs = saveAs
}
