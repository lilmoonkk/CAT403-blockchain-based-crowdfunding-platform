import React, { useState, useEffect } from 'react';

const ImageUpload = (props) => {
    const [selectedImages, setSelectedImages] = useState(null);
  
    const handleImageUpload = (event) => {
      //const file = event.target.files[0];
      //setSelectedImage(URL.createObjectURL(file));
      //setSelectedImages(event.target.files[0]);
        const files = Array.from(event.target.files);
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
          alert('You have placed your proofs successfully!')
            //window.location.replace('/')
        }
    };
  
    return (
      <div>
        <input type="file" name="images" multiple onChange={handleImageUpload} />
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