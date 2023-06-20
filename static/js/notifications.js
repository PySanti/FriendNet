notificationsIcon = document.getElementById("notification-icon")
notificationGlobe = document.getElementById('notification-globe')
notificationGlobeActiveClassName = "notification-globe-active"
notificationsContainer = document.getElementById("notifications-container")
notificationsContainerClassName = 'notifications-hidden'
notificationsIcon.addEventListener('click', ()=>{
    console.log('Notificaciones desplegadas')
    try{
        notificationGlobe.classList.toggle(notificationGlobeActiveClassName)
    } catch(err){
        console.log('El notification globe no existe')
    }
    notificationsContainer.classList.toggle(notificationsContainerClassName)
})