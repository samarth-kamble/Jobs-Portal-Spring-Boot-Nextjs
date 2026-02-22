export const openBase64PDF = (base64String:string) =>{
    const byteCharecters = atob(base64String)
    const byteNumbers = new Array(byteCharecters.length)

    for (let i=0; i< byteCharecters.length; i++){
        byteNumbers[i] = byteCharecters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], {type:'application/pdf'})
    const blobUrl = URL.createObjectURL(blob)
    window.open(blobUrl, '_blank')
}