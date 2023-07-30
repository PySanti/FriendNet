import { getPublicId } from "./getPublicId"
import {Cloudinary} from "@cloudinary/url-gen";
import { quality, format } from "@cloudinary/url-gen/actions/delivery"
import { auto, autoBest } from "@cloudinary/url-gen/qualifiers/quality"
import { limitFit } from "@cloudinary/url-gen/actions/resize"



/**
 * Recibe la url de una imagen de cloudinary y la retorna formateada para su renderizado
 * @param {String} photo_url 
 */
export function getFormatedImage(photo_url){
    const cloud = new Cloudinary({cloud: {cloudName: 'dwcabo8hs', url: {cdn_subdomain: false, useRootPath: true, shorten: true, secure: true} }})
    console.log('llamadno')
    const myImage = cloud.image(getPublicId(photo_url))
    myImage
        .resize(limitFit().width(400))
        .delivery(quality(autoBest()))
        .delivery(format(auto()))
    return myImage
}