function setImagePreview(imageInputClassName){
    const img = document.getElementsByClassName('photo-input')[0]
    img.addEventListener('change', (e)=>{
        const url = URL.createObjectURL(e.target.files[0])
        const preview = document.getElementsByClassName('img-preview')[0]
        preview.src = url
    })
}

setImagePreview()