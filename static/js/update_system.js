FORM_CLASSNAME = "detail-form"
DETAILLIST_CLASSNAME = "detail-list"
UPDATE_BTN_CLASSNAME = "update-btn"
SECTION_CLASSNAME = "detail-container"
function setUpdatingFunction(form_classname, detailList_classname, updateBtn_classname, section_classname){
    section = document.getElementsByClassName(section_classname)[0]
    form = document.getElementsByClassName(form_classname)[0]
    detailList = document.getElementsByClassName(detailList_classname)[0]
    updateBtn = document.getElementsByClassName(updateBtn_classname)[0]
    form.remove()
    updateBtn.addEventListener("click", ()=>{
        section.appendChild(form)
        detailList.remove()
        updateBtn.remove()
    })
}
setUpdatingFunction(FORM_CLASSNAME, DETAILLIST_CLASSNAME, UPDATE_BTN_CLASSNAME, SECTION_CLASSNAME)