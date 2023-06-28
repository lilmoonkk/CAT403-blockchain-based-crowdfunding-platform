import React, { useState, useEffect } from 'react';
import '../styles/styles.css';
import SnackBar from '../components/Snackbar';

const ImageUpload = (props) => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [open, setOpen] = useState(false);
  
    const handleDrop = (event) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      // Handle the dropped file as needed
      //console.log('Dropped file:', file);
      if(selectedImages === null){
          setSelectedImages([file]);
          
      } else {
          setSelectedImages(selectedImages.concat(file));
      }
    };

    
    const handleDragOver = (event) => {
      event.preventDefault();
    };

    
    const handleImageUpload = (event) => {
      //const file = event.target.files[0];
      //setSelectedImage(URL.createObjectURL(file));
      //setSelectedImages(event.target.files[0]);
        const files = Array.from(event.target.files);
        console.log(files)
        if(selectedImages === null){
            setSelectedImages(files);
            
        } else {
            setSelectedImages(selectedImages.concat(files));
        }
    };

    const handleSubmit = async(e) => {
        console.log(selectedImages)
        e.preventDefault()
        let formData = new FormData()
        //formData.append('images', selectedImages)
        selectedImages.forEach((image, index) => {
          formData.append(`images`, image);
        });
        formData.append('projectid', props.project._id);
        formData.append('milestone', props.project.current_mil);
        formData.append('contract_address', props.project.contract_address);
        formData.append('owner_address', sessionStorage.getItem('wallet_address'));

        const res = await fetch('/proof/add',{
            method: 'post',
            //headers: {'Content-Type': 'application/json'},
            body: formData
        }).catch(error => alert(error.message));
        if(res.ok){
          setOpen(true)
          window.location.reload(false);
          //alert('You have placed your proofs successfully!')
            //window.location.replace('/')
        }
    };
  
    return (
      <div>
        <SnackBar message="You have uploaded your proofs successfully!" open={open}/>
        <div
          className = "file-upload-div"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p style={{cursor: "default"}}>Drag and drop an image here</p>
          <p style={{cursor: "default"}}>Or</p>
          <input type="file" name="images" multiple onChange={handleImageUpload} />
          
        </div>
        {selectedImages && (
            selectedImages.map((img) => (
              <p>{img.name}</p>
            ))
        )}
        <button onClick={handleSubmit}>Submit</button>
        
      </div>
    );
};
  
export default ImageUpload;