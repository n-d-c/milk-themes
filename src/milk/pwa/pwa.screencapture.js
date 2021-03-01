import html2canvas from 'html2canvas';
import saveAs from 'file-saver';
export const screenCapture = (filename) => {
	/* #### ScreenShot #### */
	html2canvas(document.body).then(function(canvas) {
		canvas.toBlob(function(blob) {
			saveAs(blob, `${filename}.png`);
		});
	});
}
