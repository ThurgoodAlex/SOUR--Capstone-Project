 //tunnel URL
const localhostIP:string = process.env.EXPO_PUBLIC_HOST || 'localhost'
console.log(localhostIP)
 //Alex desktop URL
 //const localhostIP = "10.0.0.62";

 //Ashlyn's URL 
 //const localhostIP = "192.168.68.60";

 // emma's url
//  const localhostIP = '10.18.114.117';

// Ricardo's url

const fullUrl = "http://" + localhostIP + ":8000";

 export { localhostIP, fullUrl };