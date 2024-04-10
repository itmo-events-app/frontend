import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
// import { CloudUpload } from "@shared/ui/icons";
import styles from './index.module.css';
import { HiOutlineCloudUpload } from 'react-icons/hi';

interface DropzoneProps {
  onDrop: (files: File[]) => void;
  acceptType?: string;
  maxFileSize?: number;
}

const Dropzone: React.FC<DropzoneProps> = ({
                                             onDrop,
                                             acceptType,
                                             maxFileSize,
                                           }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDropHandler = useCallback(
    (acceptedFiles: File[]) => {
      onDrop(acceptedFiles);
      setPreview(URL.createObjectURL(acceptedFiles[0]));
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropHandler,
    accept: {
      [acceptType || '*/*']: ['.jpg', '.jpeg', '.png', '.gif'],
    },
    maxFiles: 1,
    maxSize: maxFileSize || 5 * 1024 ** 2, // Default to 5 MB
  });

  const removeFile = () => {
    onDrop([]);
    setPreview(null);
  };

  return (
    <div {...getRootProps()} >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Перетащите фото...</p>
      ) : (
        <>
          <p className={styles.dropzone_form_container}><HiOutlineCloudUpload size={20} /> Перетащите или <span>выберите</span> фото</p>
          {preview && (
            <div className={styles.preview_container}>
              <img src={preview} alt="Preview" width="200" />
              <button type="button" onClick={removeFile}>
                удалить фото
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dropzone;