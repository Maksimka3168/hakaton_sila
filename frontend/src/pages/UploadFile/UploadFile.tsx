import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import classes from './UploadFile.module.css';
import fileimg from '../../assets/file.png';
import config from '../../config/enviroments'
function UploadFile() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileChange = async (file: File | null) => {
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'csv') {
        setFileName(file.name);
        const reader = new FileReader();

        reader.onload = () => {
          toast.success('Файл успешно загружен');
        };

        reader.onerror = () => {
          toast.error('Ошибка при чтении файла.');
        };

        reader.readAsText(file);

        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await axios.post(`${config.baseApiUrl}upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            responseType: 'blob', 
          });

          const blob = new Blob([response.data], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          setDownloadUrl(url); 
          toast.success('Файл готов для скачивания');
        } catch (error) {
          console.error('Ошибка при отправке файла:', error);
          toast.error('Ошибка при отправке файла на сервер.');
        }
      } else {
        toast.error('Пожалуйста, выберите файл формата CSV.');
      }
    }
  };

  const handleBrowseClick = () => {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    handleFileChange(file);
  };

  return (
    <main className={classes.main}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div
        className={`${classes.fileUpload} ${isDragging ? classes.dragging : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={classes.dropArea}>
          <img src={fileimg} alt="File upload" />
          <p>Выберите файл или перетащите его сюда</p>
          <span>CSV формат(Датасет не больше 200 строк)</span>
          <button className={classes.browseBtn} onClick={handleBrowseClick}>
            Browse file
          </button>
          <input
            id="file-input"
            type="file"
            accept=".csv"
            onChange={handleFileInputChange}
            className={classes.fileInput}
          />
          {fileName && <p className={classes.fileName}>Файл выбран: {fileName}</p>}
          {downloadUrl && (
            <a
              href={downloadUrl}
              download="modified_file.csv"
              className={classes.downloadButton}
            >
              Скачать результат
            </a>
          )}
        </div>
      </div>
    </main>
  );
}

export default UploadFile;
