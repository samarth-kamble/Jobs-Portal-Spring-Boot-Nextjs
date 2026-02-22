export const formatInterviewTime = (dateString:any)=> {
    // Create a new Date object from the input string
    const date = new Date(dateString);

    // Define options for formatting the date
    const options:Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };

    // Format the date
    const formattedDate = date.toLocaleString('en-us', options)

    // Get hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine AM or PM suffix
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Format minutes to always have two digits
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    // Combine everything into the final format
    return `${formattedDate} on Time: ${hours}:${formattedMinutes} ${ampm}`;
}


