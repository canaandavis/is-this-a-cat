import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import './Uploader.css';
import CatFace from '../../assets/cat_face.png';

const GOOGLE_API_KEY = 'AIzaSyB-UYwVrp5rXaIzRB_6AKH1_1M4RcQOh1Y';
class Uploader extends Component {
  state = {
    file: null,
    fileUrl: null,
    uploading: false,
  };

  handleDrop = filesArray => {
    this.clearCurrentPreview();
    this.setState(() => ({ file: filesArray[0] }));
    this.generateBase64(filesArray[0]);
  };

  clearCurrentPreview = () => {
    if (this.state.file) {
      window.URL.revokeObjectURL(this.state.file.preview);
    }
  };

  generateBase64 = file => {
    const reader = new FileReader();

    reader.onload = () => {
      const fileUrl = reader.result;
      this.setState(() => ({ fileUrl }));
      this.handleFileUpload(fileUrl);
    };

    reader.onabort = () =>
      this.props.onEvent('ERROR', 'file reading was aborted');
    reader.onerror = () =>
      this.props.onEvent('ERROR', 'file reading has failed');

    try {
      reader.readAsDataURL(file);
    } catch (err) {
      this.props.onEvent('ERROR', 'Could not read file.');
    }
  };

  handleFileUpload = async fileUrl => {
    this.props.onEvent('UPLOADING');
    this.setState(() => ({ uploading: true }));
    const requestBody = {
      requests: [
        {
          image: { content: fileUrl.replace(/data:image.*base64,/, '') },
          features: [{ type: 'LABEL_DETECTION', maxResults: 20 }],
        },
      ],
    };
    try {
      let resp = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`,
        {
          method: 'POST',
          body: JSON.stringify(requestBody),
        }
      );

      let results = await resp.json();
      this.setState(() => ({ results }));
      this.props.onEvent('UPLOAD_COMPLETE', results);
    } catch (err) {
      this.props.onEvent('ERROR');
    }
  };

  renderUploadPreview = () => {
    return (
      <div className="upload-preview">
        <div className="upload-preview_overlay">
          <img src={CatFace} alt="spinner" />
        </div>
        <img src={this.state.fileUrl} alt="Upload Preview" />
      </div>
    );
  };

  renderDropZone = () => {
    return (
      <Dropzone
        accept="image/*"
        className="drop-zone"
        activeClassName="drop-zone_active"
        acceptClassName="drop-zone_active"
        rejectClassName="drop-zone_rejected"
        disabledClassName="drop-zone_disabled"
        multiple={false}
        onDrop={this.handleDrop}
      >
        <p>
          Drag and Drop some photos in here and we'll do our best to tell you if
          there's a cat in the picture or not.
        </p>
      </Dropzone>
    );
  };

  render() {
    if (this.state.uploading) {
      return this.renderUploadPreview();
    } else {
      return this.renderDropZone();
    }
  }
}

export default Uploader;
