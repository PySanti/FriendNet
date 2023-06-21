FORM_CLASSNAME = "detail-form"
DETAILLIST_CLASSNAME = "detail-list"
UPDATE_BTN_CLASSNAME = "update-btn"
SECTION_CLASSNAME = "detail-container"
DETAIL_IMG_PREVIEW = "img-detail-preview"
function setUpdatingFunction(form_classname, detailList_classname, updateBtn_classname, section_classname){
    /*
        Funcion creada para eliminar inicialmente el formulario de actualizacion del template,
        por otro lado, configurar los elementos para, al presionar el update-btn,
        surga el formulario
    */
    detailImg =  document.getElementById(DETAIL_IMG_PREVIEW)
    section = document.getElementsByClassName(section_classname)[0]
    form = document.getElementsByClassName(form_classname)[0]
    detailList = document.getElementsByClassName(detailList_classname)[0]
    updateBtn = document.getElementsByClassName(updateBtn_classname)[0]
    updateBtn.addEventListener("click", ()=>{
        form.classList.add('form-activated')
        section.appendChild(form)
        detailImg.remove()
        detailList.remove()
        updateBtn.remove()
    })
}
setUpdatingFunction(FORM_CLASSNAME, DETAILLIST_CLASSNAME, UPDATE_BTN_CLASSNAME, SECTION_CLASSNAME)